using System;
using System.Xml.Serialization;

namespace Provisioning.Client.Library.PnpExtensions.Data
{
    [Serializable]
    public class RemoveFieldRef
    {
        [XmlAttribute]
        public Guid ID { get; set; }
    }
}