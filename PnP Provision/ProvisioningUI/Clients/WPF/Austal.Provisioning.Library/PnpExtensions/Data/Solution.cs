using System;
using System.Xml.Serialization;

namespace Provisioning.Client.Library.PnpExtensions.Data
{
    [Serializable]
    public class Solution
    {
        [XmlAttribute]
        public string PackageGuid { get; set; }

        [XmlAttribute]
        public string PackageName { get; set; }

        [XmlAttribute]
        public string PackagePath { get; set; }

        [XmlAttribute]
        public bool Redeploy { get; set; }

    }
}
