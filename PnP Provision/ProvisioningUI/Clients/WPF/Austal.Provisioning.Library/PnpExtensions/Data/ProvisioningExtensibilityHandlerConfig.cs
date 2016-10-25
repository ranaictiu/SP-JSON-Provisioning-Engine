using System;
using System.Xml.Serialization;

namespace Provisioning.Client.Library.PnpExtensions.Data
{
    [Serializable]
    [XmlRoot(Namespace = "http://schemas.nec.com.au/PnP/ProvisioningExtensibilityHandler", IsNullable = false)]
    public class ProvisioningExtensibilityHandlerConfig
    {
       

        [XmlArrayItem(IsNullable = true)]
        public ContentType[] ContentTypes { get; set; }

        [XmlArrayItem(IsNullable = true)]
        public File[] Files { get; set; }

        [XmlArrayItem(IsNullable = true)]
        public Solution[] Solutions { get; set; }

        [XmlArrayItem(IsNullable = true)]
        public Feature[] Features { get; set; }
    }
}