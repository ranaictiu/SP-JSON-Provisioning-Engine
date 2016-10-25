using System;

namespace Provisioning.Client.Library.Models
{
    public class SPOConnectionInfo
    {
        public string SiteUrl { get; set; }

        public string CentralAdminUrl { get; set; }

        public string O365TenantName
        {
            get
            {
                if (Uri.IsWellFormedUriString(this.SiteUrl, UriKind.Absolute))
                {
                    Uri uri=new Uri(this.SiteUrl);
                    return uri.Host.Split('.')[0];//for url like https://tenantname.sharepoint.com, 
                }
                return string.Empty;
            }
        }

        public string SiteCollectionAdmin => this.UserName;

        public string SiteCollectionPath { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public bool UserNamePasswordProvided { get; set; }

        public SPOConnectionInfo Copy(string url)
        {
            return new SPOConnectionInfo()
            {
                UserName = this.UserName,
                Password = this.Password,
                SiteUrl = url,
                CentralAdminUrl = this.CentralAdminUrl,
                //O365TenantName = this.O365TenantName,
                //SiteCollectionAdmin = this.SiteCollectionAdmin,
                SiteCollectionPath = this.SiteCollectionPath
            };
        }
    }
}
