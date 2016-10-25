using System;
using System.Xml.Serialization;

namespace Provisioning.Client.Library.PnpExtensions.Data
{
    [Serializable]
    public class ContentType
    {
        [XmlAttribute]
        public string ID { get; set; }

        [XmlArrayItem]
        public RemoveFieldRef[] RemoveFieldRefs { get; set; }
    }
}