using System;
using System.Xml.Serialization;

namespace Provisioning.Client.Library.PnpExtensions.Data
{
    [Serializable]
    public class File
    {
        [XmlAttribute]
        public string Src { get; set; }

        [XmlAttribute]
        public string Name { get; set; }

        [XmlAttribute]
        public string Folder { get; set; }

        [XmlAttribute]
        public string Level { get; set; }
    }
}
