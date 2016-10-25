using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.XPath;
using OfficeDevPnP.Core.Framework.Provisioning.Connectors;
using OfficeDevPnP.Core.Framework.Provisioning.Providers.Xml;
using Provisioning.Client.Library.Models;

namespace Provisioning.Client.Library.PnpExtensions
{
    public class NecFileSystemConnector : FileSystemConnector
    {
        protected SPOConnectionInfo ConnectionInfo;
        public NecFileSystemConnector(string connectionString, string container, SPOConnectionInfo connectionInfo) : base(connectionString, container)
        {
            ConnectionInfo = connectionInfo;
        }

        public override Stream GetFileStream(string fileName)
        {
            var stream = base.GetFileStream(fileName);
            XmlDocument document = new XmlDocument();
            document.Load(stream);
            var outerXml = document.OuterXml;
            var pnpNamespace = GetNamespace(document, XMLConstants.PROVISIONING_SCHEMA_PREFIX);
            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(document.NameTable);
            namespaceManager.AddNamespace(XMLConstants.PROVISIONING_SCHEMA_PREFIX, pnpNamespace);

            //Check for connection info?
            Type myType = typeof(SPOConnectionInfo);
           

            var parameters = document.SelectSingleNode("//pnp:Provisioning/pnp:Preferences/pnp:Parameters", namespaceManager);
            foreach (XmlNode childNode in parameters.ChildNodes)
            {
                if (childNode.NodeType == XmlNodeType.Element)
                {
                    var parameterName = childNode.Attributes["Key"].Value;
                    PropertyInfo conPropInfo = myType.GetProperty(parameterName);
                    var parameterValue = "";
                    if (conPropInfo != null && !string.IsNullOrEmpty(ConnectionInfo.GetType().GetProperty(conPropInfo.Name).GetValue(ConnectionInfo).ToString()))
                    {
                        parameterValue = ConnectionInfo.GetType().GetProperty(conPropInfo.Name).GetValue(ConnectionInfo).ToString();
                    }
                    else
                    {
                        parameterValue = childNode.InnerText;
                    }
                    outerXml = Regex.Replace(outerXml, $"{{{parameterName}}}", parameterValue);
                }
            }

            var mStream = new MemoryStream();
            var formattedXmlDocument=new XmlDocument();
            formattedXmlDocument.LoadXml(outerXml);
            formattedXmlDocument.Save(mStream);
            mStream.Position = 0;
            return mStream;
        }

        private string GetNamespace(XmlDocument xDoc, string prefixName)
        {
            XmlNamespaceManager result = new XmlNamespaceManager(xDoc.NameTable);

            IDictionary<string, string> localNamespaces = null;
            XPathNavigator xNav = xDoc.CreateNavigator();
            while (xNav.MoveToFollowing(XPathNodeType.Element))
            {
                localNamespaces = xNav.GetNamespacesInScope(XmlNamespaceScope.Local);
                foreach (var localNamespace in localNamespaces)
                {
                    string prefix = localNamespace.Key;
                    if (!string.IsNullOrEmpty(prefix) && prefix == prefixName)
                        return localNamespace.Value;
                }
            }

            return null;
        }

        //public override string GetFile(string fileName, string container)
        //{
        //    var xml = base.GetFile(fileName, container);
        //    XmlDocument xmlDocument = new XmlDocument();

        //    xmlDocument.LoadXml(xml);
        //    XmlNamespaceManager namespaceManager = new XmlNamespaceManager(xmlDocument.NameTable);
        //    var nameSpaces = namespaceManager.GetNamespacesInScope(XmlNamespaceScope.Local);
        //    var pnpNameSpace = nameSpaces["pnp"];

        //    var selectSingleNode = xmlDocument.SelectSingleNode("//pnp:Provisioning/pnp:Preferences/pnp:Parameters");

        //    return string.Empty;
        //}
    }
}