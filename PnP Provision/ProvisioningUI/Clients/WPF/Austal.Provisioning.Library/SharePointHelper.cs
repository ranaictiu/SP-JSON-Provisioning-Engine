using System;
using System.Linq;
using Microsoft.Online.SharePoint.TenantAdministration;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using OfficeDevPnP.Core.Entities;
using OfficeDevPnP.Core.Framework.Provisioning.Model;
using Provisioning.Client.Library.Common;
using Provisioning.Client.Library.PnpExtensions.Data;
using TermGroup = OfficeDevPnP.Core.Framework.Provisioning.Model.TermGroup;

namespace Provisioning.Client.Library
{
    public static class SharePointHelper
    {
        public static void CreateSiteCollectionIfNotExists(this ClientContext clientContext, SiteEntity siteEntity, bool deleteExistingSiteCollection)
        {
            var tenant = new Tenant(clientContext);
            Logger.Instance.Write("Checking if site collection exists as Recylced.");
            if (tenant.CheckIfSiteExists(siteEntity.Url, "Recycled"))
            {
                Logger.Instance.Write("Site collection '{0}' already exists as recyceld.", siteEntity.Url);
                throw new Exception("Site already exists as 'Recycled'");
            }

            Logger.Instance.Write("Checking if site collection exists as Active.");
            var activeSiteExists = tenant.CheckIfSiteExists(siteEntity.Url, "Active");
            if (activeSiteExists)
            {
                if (!deleteExistingSiteCollection)
                {
                    Logger.Instance.Write("Site collection '{0}' already exists, so using existing site collection.", siteEntity.Url);
                    return;
                }
                Logger.Instance.Write("Site Collection {0} exists. Deleting the site collection.", siteEntity.Url);
                tenant.DeleteSiteCollection(siteEntity.Url, false);
            }


            Logger.Instance.Write("Creating site collection '{0}'", siteEntity.Url);
            tenant.CreateSiteCollection(siteEntity);
            Logger.Instance.Write("Site collection '{0}' created successfully", siteEntity.Url);
        }

        public static void CreateTermGroupIfNotExists(this ClientContext clientContext, TermGroup pnpTermGroup, int lcid)
        {
            var taxonomySession = TaxonomySession.GetTaxonomySession(clientContext);
            var termStore = taxonomySession.GetDefaultSiteCollectionTermStore();
            var termGroups = termStore.Groups;
            clientContext.Load(termGroups, tg => tg.Include(g => g.Id, g => g.Name));
            clientContext.ExecuteQuery();



            var termGroup = termGroups.SingleOrDefault(tg => tg.Id.Equals(pnpTermGroup.Id));

            Microsoft.SharePoint.Client.Taxonomy.TermSetCollection termSets = null;
            //check if termgroup exists
            if (termGroup == null)
            {
                termGroup = termStore.CreateGroup(pnpTermGroup.Name, pnpTermGroup.Id);
                clientContext.Load(termGroup);
                clientContext.ExecuteQuery();
            }
            else
            {
                termSets = termGroup.TermSets;
                clientContext.Load(termSets, ts => ts.Include(t => t.Id));
                clientContext.ExecuteQuery();
            }
            foreach (var pnpTermSet in pnpTermGroup.TermSets)
            {
                var termSetExists = termSets != null && termSets.Any(ts => ts.Id.Equals(pnpTermSet.Id));
                if (!termSetExists)
                {
                    var termSet = termGroup.CreateTermSet(pnpTermGroup.Name, pnpTermGroup.Id, lcid);
                }

            }
        }

        public static void RemoveFieldsFromContentType(this ClientContext clientContext, Microsoft.SharePoint.Client.ContentType contentType, RemoveFieldRef[] removeFieldRefs)
        {
            if (removeFieldRefs == null) return;
            var updateRequired = false;
            var fieldLinks = contentType.FieldLinks;
            clientContext.Load(fieldLinks, flds => flds.Include(fld => fld.Id));
            clientContext.ExecuteQuery();

            foreach (var removeFieldRefConfig in removeFieldRefs)
            {
                if (fieldLinks.Any(fl => fl.Id == removeFieldRefConfig.ID))
                {
                    var fieldLink = contentType.FieldLinks.GetById(removeFieldRefConfig.ID);
                    fieldLink.DeleteObject();
                    updateRequired = true;
                }
            }

            if (updateRequired)
            {
                contentType.Update(true);
                clientContext.ExecuteQueryRetry();
            }
        }

        public static void DeactivateRemoveSolution(this ClientContext clientContext, Solution solution)
        {
            var solutionFile = GetSolution(clientContext, solution);
            if (solutionFile == null) return;
            var wsp = new Microsoft.SharePoint.Client.Publishing.DesignPackageInfo()
            {
                PackageGuid = new Guid(solution.PackageGuid),
                PackageName = GetSolutionName(solution.PackageName, false)
            };

            // uninstall the solution
            Microsoft.SharePoint.Client.Publishing.DesignPackage.UnInstall(clientContext, clientContext.Site, wsp);
            clientContext.ExecuteQuery();

            solutionFile.DeleteObject();
            clientContext.ExecuteQuery();
        }

        public static void DeployActivateSolution(this ClientContext clientContext, Solution solution, ProvisioningTemplate pnpTemplate)
        {
            var solutionFile = GetSolution(clientContext, solution);

            if (solutionFile != null && solutionFile.Exists) return;

            var solutionGallery = clientContext.Web.Lists.GetByTitle("Solution Gallery");
            clientContext.Load(solutionGallery);
            clientContext.Load(solutionGallery.RootFolder);
            clientContext.ExecuteQuery();

            var file = pnpTemplate.Connector.GetFileStream(solution.PackagePath);

            var fileCI = new FileCreationInformation()
            {
                ContentStream = file,
                Url = GetSolutionName(solution.PackageName, true),
                Overwrite = false
            };

            var uploadedFile = solutionGallery.RootFolder.Files.Add(fileCI);
            clientContext.Load(uploadedFile);
            clientContext.ExecuteQuery();

            var wsp = new Microsoft.SharePoint.Client.Publishing.DesignPackageInfo()
            {
                // during deployment, the solution ID is not necessary
                PackageGuid = Guid.Empty, // 4c16c0b9-0162-43ad-a8e9-a4b810e58a56
                PackageName = GetSolutionName(solution.PackageName, false)
            };

            // install the solution from the file url
            var filerelativeurl = solutionGallery.RootFolder.ServerRelativeUrl + "/" + GetSolutionName(solution.PackageName, true);
            Microsoft.SharePoint.Client.Publishing.DesignPackage.Install(clientContext, clientContext.Site, wsp, filerelativeurl);
            clientContext.ExecuteQuery();
        }

        private static Microsoft.SharePoint.Client.File GetSolution(ClientContext clientContext, Solution solution)
        {
            var solutionGallery = clientContext.Web.Lists.GetByTitle("Solution Gallery");
            clientContext.Load(solutionGallery);
            clientContext.Load(solutionGallery.RootFolder);

            var files = solutionGallery.RootFolder.Files;
            var packageName = GetSolutionName(solution.PackageName, true);
            clientContext.Load(files, fs => fs.Where(f => f.Name == packageName));

            clientContext.ExecuteQuery();

            var file = files.FirstOrDefault();
            return file;
        }
        private static string GetSolutionName(string name, bool includeWSPExtension)
        {
            if (includeWSPExtension)
                return name.EndsWith(".wsp", StringComparison.InvariantCultureIgnoreCase) ? name : string.Format("{0}.wsp", name);
            else
                return name.EndsWith(".wsp", StringComparison.InvariantCultureIgnoreCase) ? name.Substring(0, name.Length - ".wsp".Length) : name;
        }

        public static void ActivateDeactivateFeature(this ClientContext clientContext, Guid featureId, bool deactivate)
        {

        }
    }
}
