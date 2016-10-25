using System;
using System.IO;
using System.Linq;
using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Entities;
using OfficeDevPnP.Core.Framework.Provisioning.ObjectHandlers;
using OfficeDevPnP.Core.Framework.Provisioning.Providers.Json;
using OfficeDevPnP.Core.Framework.Provisioning.Providers.Xml.V201512;
using Provisioning.Client.Library.Common;
using Provisioning.Client.Library.Models;
using Provisioning.Client.Library.PnpExtensions;
using ProvisioningTemplate = OfficeDevPnP.Core.Framework.Provisioning.Model.ProvisioningTemplate;

namespace Provisioning.Client.Library
{

    public class ProvisionManager
    {
        protected string XmlPath { get; set; }
        protected SPOConnectionInfo ConnectionInfo;
        public ProvisionManager(SPOConnectionInfo connectionInfo, string xmlPath)
        {
            XmlPath = xmlPath;

            ConnectionInfo = connectionInfo;

        }

        private ProvisioningTemplate _provisioningTemplate;


        public bool Connect()
        {
            Logger.Instance.Write("Checking connection...");
            try
            {
                var context = ProvisioningClientContext.GetClientContext(ConnectionInfo.SiteUrl, ConnectionInfo);
                if (context == null) return false; //if user cancel the login page, context will be null
                var web = context.Web;
                context.Load(web);
                context.ExecuteQuery();
                Logger.Instance.Write("Connection Ok. Now applying the template.");
            }
            catch (System.Net.WebException we)
            {
                Logger.Instance.Write(we);
                return false;
            }
            catch (Exception exp)
            {
                Logger.Instance.Write(exp);
                return false;
            }
            return true;
        }

        protected ProvisioningTemplate GetProvisioningTemplate(string templateName)
        {
            if (_provisioningTemplate != null && _provisioningTemplate.Id == templateName) return _provisioningTemplate;
            var templateProvider = new NecXmlFileSystemTemplateProvider(Path.GetDirectoryName(XmlPath), "", ConnectionInfo);

            _provisioningTemplate = templateProvider.GetTemplate(Path.GetFileName(XmlPath), templateName);
            return _provisioningTemplate;
        }

        public void RunSequences(bool deleteExistingSiteCollection)
        {

            var templateProvider = new NecXmlFileSystemTemplateProvider(Path.GetDirectoryName(XmlPath), "", ConnectionInfo);
            var sequences = templateProvider.GetSequences(Path.GetFileName(XmlPath));

            if (sequences.Length > 1)
            {
                throw new NotSupportedException("Only one sequence is supported now.");
            }
            var sequence = sequences.First();


            var siteColClientContext = ProvisioningClientContext.GetClientContext(ConnectionInfo.CentralAdminUrl, ConnectionInfo);

            ProcessSiteCollections(deleteExistingSiteCollection, sequence, siteColClientContext);
        }

        private void ProcessSiteCollections(bool deleteExistingSiteCollection, Sequence sequence, ClientContext siteColClientContext)
        {
            foreach (var siteCollection in sequence.SiteCollection)
            {
                Logger.Instance.Write("Processing Started - Site Collection '{0}'", siteCollection.Url);
                var templateReferrence = siteCollection.Templates.ProvisioningTemplateReference.First();
                var provisioningTemplate = GetProvisioningTemplate(templateReferrence.ID);
                if (!provisioningTemplate.Parameters.ContainsKey("DefaultSiteTemplate"))
                    throw new Exception("Please include Key 'DefaultSiteTemplate' with default site template id (i.e., STS#1)");
                var defaultSiteTemplate = provisioningTemplate.Parameters["DefaultSiteTemplate"];

                var timeZoneId = provisioningTemplate.Parameters.GetTokenReplaced(siteCollection.TimeZone);
                var siteCollectionUrl = provisioningTemplate.Parameters.GetTokenReplaced(siteCollection.Url);

                var siteCollectionEntity = new SiteEntity
                {
                    Lcid = Convert.ToUInt32(provisioningTemplate.Parameters.GetTokenReplaced(siteCollection.Language)),
                    SiteOwnerLogin = provisioningTemplate.Parameters.GetTokenReplaced(siteCollection.PrimarySiteCollectionAdmin),
                    Template = provisioningTemplate.Parameters.GetTokenReplaced(defaultSiteTemplate),
                    Title = siteCollection.Title,
                    Url = siteCollectionUrl,
                    StorageWarningLevel = Convert.ToInt32(siteCollection.StorageWarningLevel),
                    StorageMaximumLevel = Convert.ToInt32(siteCollection.StorageMaximumLevel),
                    TimeZoneId = Convert.ToInt32(timeZoneId)
                };

                siteColClientContext.CreateSiteCollectionIfNotExists(siteCollectionEntity, deleteExistingSiteCollection);

                foreach (var templateRef in siteCollection.Templates.ProvisioningTemplateReference)
                {
                    provisioningTemplate = GetProvisioningTemplate(templateRef.ID);
                    ApplyTemplate(siteCollectionUrl, provisioningTemplate);
                }
                Logger.Instance.Write("Processing Done - Site Collection '{0}'", siteCollection.Url);
            }

            ProcessSites(sequence);
        }

        private void ProcessSites(Sequence sequence)
        {
            if (sequence.Site == null) return;
            foreach (var site in sequence.Site)
            {
                Logger.Instance.Write("Processing Started - Site '{0}'", site.Url);
                var templateReferrence = site.Templates.ProvisioningTemplateReference.First();
                var provisioningTemplate = GetProvisioningTemplate(templateReferrence.ID);

                var siteUrl = provisioningTemplate.Parameters.GetTokenReplaced(site.Url);
                var parentWebUrl = siteUrl.Substring(0, siteUrl.LastIndexOf('/'));
                var webUrl = siteUrl.Substring(siteUrl.LastIndexOf('/') + 1);
                var siteTitle = provisioningTemplate.Parameters.GetTokenReplaced(site.Title);
                var lcid = provisioningTemplate.Parameters.GetTokenReplaced(site.Language);

                var clientContext = ProvisioningClientContext.GetClientContext(parentWebUrl, ConnectionInfo);

                if (!provisioningTemplate.Parameters.ContainsKey("DefaultSiteTemplate"))
                    throw new Exception("Please include Key 'DefaultSiteTemplate' with default site template id (i.e., STS#1)");
                var defaultSiteTemplate = provisioningTemplate.Parameters["DefaultSiteTemplate"];


                var newWebUrl = ProvisioningClientContext.CreateWebIfNotExists(clientContext.Web, siteTitle, webUrl, string.Empty, defaultSiteTemplate, Convert.ToInt32(lcid), site.UseSamePermissionsAsParentSite);
                ApplyTemplate(newWebUrl, provisioningTemplate);
                Logger.Instance.Write("Processing Done - Site '{0}'", site.Url);
            }
        }

        private void ApplyTemplate(string siteUrl, ProvisioningTemplate template)
        {
            Logger.Instance.Write("Applying template '{0}' for site '{1}", template.DisplayName, siteUrl);
            var clientContext = ProvisioningClientContext.GetClientContext(siteUrl, ConnectionInfo);
            var web = clientContext.Web;
            var provisioningTemplateApplyingInformation = new ProvisioningTemplateApplyingInformation()
            {
                MessagesDelegate = MessageDelegate,
                ProgressDelegate = ProgressDelegate
            };
            web.ApplyProvisioningTemplate(template, provisioningTemplateApplyingInformation);
            Logger.Instance.Write("Applied template '{0}' for site '{1}", template.DisplayName, siteUrl);
        }

        private void ProgressDelegate(string message, int step, int total)
        {
            Logger.Instance.Write("Processing {0}",message);
        }

        private void MessageDelegate(string message, ProvisioningMessageType messagetype)
        {
            Logger.Instance.Write(messagetype == ProvisioningMessageType.Error ? "Error in processing {0}" : "Processing {0}", message);
        }

        public void SaveTemplate(string templateName)
        {
            var templateProvider = new NecXmlFileSystemTemplateProvider(Path.GetDirectoryName(XmlPath), "",ConnectionInfo);
            var provisioningTemplate = GetProvisioningTemplate(templateName);
            templateProvider.SaveAs(provisioningTemplate, @"c:\temp\a.txt", new JsonPnPFormatter());
        }
    }
}
