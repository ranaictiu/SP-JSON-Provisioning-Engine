using System;
using System.Xml.Serialization;

namespace Provisioning.Client.Library.PnpExtensions.Data
{
    [Serializable]
    public class Feature
    {
        [XmlAttribute]
        public Guid ID { get; set; }

        [XmlAttribute]
        public bool Deactivate { get; set; }

        [XmlAttribute]
        public string Scope { get; set; }
    }
}
