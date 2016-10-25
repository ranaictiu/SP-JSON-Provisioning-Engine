using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Diagnostics;
using OfficeDevPnP.Core.Framework.Provisioning.Extensibility;
using OfficeDevPnP.Core.Framework.Provisioning.Model;
using OfficeDevPnP.Core.Framework.Provisioning.ObjectHandlers;
using OfficeDevPnP.Core.Framework.Provisioning.ObjectHandlers.TokenDefinitions;
using OfficeDevPnP.Core.Utilities;
using Provisioning.Client.Library.PnpExtensions.Data;
using RoleAssignment = OfficeDevPnP.Core.Framework.Provisioning.Model.RoleAssignment;
using RoleDefinition = OfficeDevPnP.Core.Framework.Provisioning.Model.RoleDefinition;

namespace Provisioning.Client.Library.PnpExtensions
{
    public class ProvisionExtensibilityHandler : IProvisioningExtensibilityHandler
    {
        public IEnumerable<TokenDefinition> GetTokens(ClientContext ctx, ProvisioningTemplate template, string configurationData)
        {
            return new List<TokenDefinition>();
        }

        public void Provision(ClientContext ctx, ProvisioningTemplate template, ProvisioningTemplateApplyingInformation applyingInformation, TokenParser tokenParser, PnPMonitoredScope scope, string configurationData)
        {
            var config = XMLSerializer.Deserialize<ProvisioningExtensibilityHandlerConfig>(configurationData);
            if (config == null) return;
            ProcessContentTypes(ctx, config.ContentTypes);
            ProcessFiles(ctx, config.Files);
            ProcessSolutions(ctx, template, config.Solutions);

            if (config.Features != null && config.Features.Length > 0)
            {
                applyingInformation.ProgressDelegate?.Invoke("Extensibility provider - Activating Feature.", 0, 0);
                ctx.RequestTimeout = 600000;//10 mins. Publishing infrasturcture feature activation takes five mins sometime.
                ProcessFeatures(ctx.Site, config.Features.Where(f => f.Scope == "Site").ToList(), scope);
                ProcessFeatures(ctx.Web, config.Features.Where(f => f.Scope == "Web"), scope);
            }


            //PnP skip  processing role definitions at site collection level, so do it here
            if (template.Security?.SiteSecurityPermissions?.RoleDefinitions != null)
            {
                var roleDefinitions = template.Security.SiteSecurityPermissions.RoleDefinitions;
                foreach (var roleDefinition in roleDefinitions)
                {
                    ApplyRoleDefinition(ctx, roleDefinition);
                }
            }

            //PnP skip  processing role roleassignments at site collection level, so do it here
            if (template.Security?.SiteSecurityPermissions?.RoleAssignments != null)
            {
                var roleAssignments = template.Security.SiteSecurityPermissions.RoleAssignments;
                foreach (var ra in roleAssignments)
                {
                    ApplyRoleAssignments(ctx, ra);
                }

            }

        }

        private void ApplyRoleDefinition(ClientContext context, RoleDefinition roleDefinition)
        {
            var web = context.Web;
            var existingRoleDefinitions = context.LoadQuery(web.RoleDefinitions.Include(wr => wr.Name, wr => wr.BasePermissions, wr => wr.Description));
            web.Context.ExecuteQueryRetry();
            var siteRoleDefinition = existingRoleDefinitions.FirstOrDefault(erd => erd.Name == roleDefinition.Name);
            if (siteRoleDefinition == null)
            {
                
                var roleDefinitionCi = new RoleDefinitionCreationInformation();
                roleDefinitionCi.Name = roleDefinition.Name;
                roleDefinitionCi.Description = roleDefinition.Description;
                BasePermissions basePermissions = new BasePermissions();

                foreach (var permission in roleDefinition.Permissions)
                {
                    basePermissions.Set(permission);
                }

                roleDefinitionCi.BasePermissions = basePermissions;

                web.RoleDefinitions.Add(roleDefinitionCi);
                web.Context.ExecuteQueryRetry();
            }

        }

        private void ApplyRoleAssignments(ClientContext context, RoleAssignment roleAssignment)
        {
            var web = context.Web;
            var webRoleDefinitions = context.LoadQuery(web.RoleDefinitions);
            var groups = web.Context.LoadQuery(web.SiteGroups.Include(g => g.LoginName));
            web.Context.ExecuteQueryRetry();

            Principal principal = groups.FirstOrDefault(g => g.LoginName == roleAssignment.Principal);
            if (principal == null)
            {
                principal = web.EnsureUser(roleAssignment.Principal);
            }

            var roleDefinitionBindingCollection = new RoleDefinitionBindingCollection(web.Context);

            var roleDefinition = webRoleDefinitions.FirstOrDefault(r => r.Name == roleAssignment.RoleDefinition);

            if (roleDefinition != null)
            {
                roleDefinitionBindingCollection.Add(roleDefinition);
            }
            web.RoleAssignments.Add(principal, roleDefinitionBindingCollection);
            web.Context.ExecuteQueryRetry();

        }

        private void ProcessFeatures<T>(T parent, IEnumerable<Data.Feature> features, PnPMonitoredScope scope)
        {
            if (features == null) return;

            var activeFeatures = new List<Microsoft.SharePoint.Client.Feature>();
            Web web = null;
            Site site = null;
            if (parent is Site)
            {
                site = parent as Site;
                site.Context.Load(site.Features, fs => fs.Include(f => f.DefinitionId));
                site.Context.ExecuteQueryRetry();
                activeFeatures = site.Features.ToList();
            }
            else
            {
                web = parent as Web;
                web.Context.Load(web.Features, fs => fs.Include(f => f.DefinitionId));
                web.Context.ExecuteQueryRetry();
                activeFeatures = web.Features.ToList();
            }

            foreach (var feature in features)
            {
                var actionRequired = (feature.Deactivate && activeFeatures.FirstOrDefault(f => f.DefinitionId == feature.ID) != null) ||
                    (!feature.Deactivate && activeFeatures.FirstOrDefault(f => f.DefinitionId == feature.ID) == null);

                if (!actionRequired) continue;

                try
                {
                    ProcessFeatureInternal(site == null ? web.Features : site.Features, feature.ID, !feature.Deactivate, FeatureDefinitionScope.Farm);
                }
                catch (Exception exp)
                {
                    scope.LogError("Error activating/deactivating feature {0}: {1}", feature.ID, exp.Message);
                }

            }
        }

        private static void ProcessFeatureInternal(Microsoft.SharePoint.Client.FeatureCollection features, Guid featureID, bool activate, FeatureDefinitionScope scope)
        {

            features.Context.Load(features);
            features.Context.ExecuteQueryRetry();

            int oldCount = features.Count();

            if (activate)
            {
                features.Add(featureID, true, scope);
                features.Context.ExecuteQueryRetry();

                features.Context.Load(features);
                features.Context.ExecuteQueryRetry();
            }
            else
            {
                features.Remove(featureID, false);
                features.Context.ExecuteQueryRetry();

            }
        }



        private void ProcessSolutions(ClientContext context, ProvisioningTemplate pnpTemplate, Solution[] solutions)
        {
            if (solutions == null) return;
            foreach (var solution in solutions)
            {
                if (solution.Redeploy)
                {
                    context.DeactivateRemoveSolution(solution);
                }
                context.DeployActivateSolution(solution, pnpTemplate);
            }
        }

        private void ProcessFiles(ClientContext ctx, Data.File[] files)
        {
            if (files != null)
            {
                foreach (var file in files)
                {
                    if (file.Level == "Published")
                    {
                        if (!file.Folder.StartsWith("_catalogs"))
                            throw new NotSupportedException("Publishing file in non-masterpage gallery not supported");

                        var web = ctx.Web;
                        List masterPageGallery = web.GetCatalog((int)ListTemplateType.MasterPageCatalog);
                        Microsoft.SharePoint.Client.Folder rootFolder = masterPageGallery.RootFolder;
                        Microsoft.SharePoint.Client.Folder customFolder = web.EnsureFolder(rootFolder, file.Folder); ;
                        web.Context.Load(masterPageGallery);
                        web.Context.Load(customFolder);
                        web.Context.ExecuteQueryRetry();


                        CamlQuery query = new CamlQuery();
                        query.ViewXml = string.Format("<View Scope='RecursiveAll'><Query><Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='File'>{0}</Value></Eq></Where></Query></View>", file.Name);
                        var existingCollection = masterPageGallery.GetItems(query);
                        web.Context.Load(existingCollection);
                        web.Context.ExecuteQueryRetry();
                        ListItem item = existingCollection.FirstOrDefault();

                        if (masterPageGallery.ForceCheckout || masterPageGallery.EnableVersioning)
                        {
                            item.File.Publish(string.Empty);
                        }
                        web.Context.ExecuteQueryRetry();
                    }
                }
            }
        }

        private void ProcessContentTypes(ClientContext ctx, Data.ContentType[] contentTypes)
        {
            if (contentTypes != null)
            {
                var ctypes = ctx.Web.ContentTypes;
                ctx.Load(ctypes, cts => cts.Include(ct => ct.Id));
                ctx.ExecuteQuery();

                foreach (var contentTypeConfig in contentTypes)
                {
                    if (ctypes.Any(ct => ct.Id.StringValue.Equals(contentTypeConfig.ID, StringComparison.CurrentCultureIgnoreCase)))
                    {
                        var contentType = ctx.Web.ContentTypes.GetById(contentTypeConfig.ID);
                        ctx.RemoveFieldsFromContentType(contentType, contentTypeConfig.RemoveFieldRefs);
                    }
                }
            }
        }

        public ProvisioningTemplate Extract(ClientContext ctx, ProvisioningTemplate template, ProvisioningTemplateCreationInformation creationInformation, PnPMonitoredScope scope, string configurationData)
        {
            return template;
        }
    }
}
