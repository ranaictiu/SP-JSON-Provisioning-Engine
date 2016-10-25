using System.IO;
using System.Xml.Linq;
using OfficeDevPnP.Core.Framework.Provisioning.Providers.Xml;
using OfficeDevPnP.Core.Framework.Provisioning.Providers.Xml.V201512;
using OfficeDevPnP.Core.Utilities;
using Provisioning.Client.Library.Models;
using ProvisioningTemplate = OfficeDevPnP.Core.Framework.Provisioning.Model.ProvisioningTemplate;

namespace Provisioning.Client.Library.PnpExtensions
{
    public class NecXmlFileSystemTemplateProvider : XMLTemplateProvider
    {
        protected SPOConnectionInfo ConnectionInfo;
        public NecXmlFileSystemTemplateProvider()
        {

        }
        public NecXmlFileSystemTemplateProvider(string connectionString, string container, SPOConnectionInfo connectionInfo) :
            base(new NecFileSystemConnector(connectionString, container, connectionInfo))
        {
            ConnectionInfo = connectionInfo;
        }

        public Sequence[] GetSequences(string uri)
        {
            var formatter = new XMLPnPSchemaFormatter();
            formatter.Initialize(this);
            Stream stream = this.Connector.GetFileStream(uri);

            if (stream == null)
            {
                //throw new ApplicationException(string.Format(CoreResources.Provisioning_Formatter_Invalid_Template_URI, uri));
            }

            MemoryStream sourceStream = new MemoryStream();
            stream.CopyTo(sourceStream);
            sourceStream.Position = 0;
            XDocument xml = XDocument.Load(sourceStream);


            var provisioning = XMLSerializer.Deserialize<OfficeDevPnP.Core.Framework.Provisioning.Providers.Xml.V201512.Provisioning>(xml);
            return provisioning.Sequence;

        }

        public override ProvisioningTemplate GetTemplate(string uri)
        {
            return base.GetTemplate(uri);
        }
    }




}
