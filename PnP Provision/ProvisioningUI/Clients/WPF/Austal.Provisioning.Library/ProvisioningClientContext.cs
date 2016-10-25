using System.Net;
using Microsoft.SharePoint.Client;
using Provisioning.Client.Library.ClaimsAuth;
using Provisioning.Client.Library.Common;
using Provisioning.Client.Library.Models;

namespace Provisioning.Client.Library
{
    public class ProvisioningClientContext
    {
        //public SPOConnectionInfo ConnectionInfo { get; set; }

        public static ClientContext GetClientContext(string siteUrl, SPOConnectionInfo connectionInfo)
        {
            if (!connectionInfo.UserNamePasswordProvided) return GetAuthenticatedContext(siteUrl, 0, 0); //new ClientContext(ConnectionInfo.SiteUrl);

            var contenxt = new ClientContext(siteUrl);
            var pwd = OfficeDevPnP.Core.Utilities.EncryptionUtility.ToSecureString(connectionInfo.Password);
            contenxt.Credentials = new SharePointOnlineCredentials(connectionInfo.UserName, pwd);
            return contenxt;
        }
        public static ClientContext GetAuthenticatedContext(string targetSiteUrl, int popUpWidth, int popUpHeight)
        {
            CookieCollection cookies = null;
            cookies = ClaimClientContext.GetAuthenticatedCookies(targetSiteUrl, popUpWidth, popUpHeight);
            if (cookies == null) return null;

            ClientContext context = new ClientContext(targetSiteUrl);
            try
            {
                context.ExecutingWebRequest += delegate (object sender, WebRequestEventArgs e)
                {
                    e.WebRequestExecutor.WebRequest.CookieContainer = new CookieContainer();
                    foreach (Cookie cookie in cookies)
                    {
                        e.WebRequestExecutor.WebRequest.CookieContainer.Add(cookie);
                    }
                };
            }
            catch
            {
                if (context != null) context.Dispose();
                throw;
            }
            context.RequestTimeout = 300000;// 5 minutes
            return context;
        }
        public static string CreateWebIfNotExists(Web parentWeb, string title, string leafUrl, string description, string template, int language, bool inheritPermissions = true, bool inheritNavigation = true)
        {
            Logger.Instance.Write("Creating site '{0}'", leafUrl);
            var web = parentWeb.GetWeb(leafUrl) ?? parentWeb.CreateWeb(title, leafUrl, description, template, language, inheritPermissions, inheritNavigation);
            var webUrl = parentWeb.Context.Url + "/" + leafUrl;
            Logger.Instance.Write("Created Site '{0}'", leafUrl);
            return webUrl;
        }
    }
}
