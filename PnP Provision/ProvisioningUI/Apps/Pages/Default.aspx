<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />
    <link rel="Stylesheet" type="text/css" href="../Content/App.min.css" />
    <script type="text/javascript" src="../scripts/lib/require.js"></script>
    <script type="text/javascript" src="../scripts/Config.js"></script>
    <link rel="Stylesheet" type="text/css" href="../Content/App.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/themes/base/jquery-ui.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/themes/default/style.min.css" />
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Provisioning App
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div id="provisioningApp">
        <div id="jsTreeSites"></div>
        <div class="provisioning-app bs">
            <button class="btn btn-primary" data-bind="enable: canAction, click: function () { navigateToPage('Pages/SiteTemplate.aspx'); }">Create Site</button>
            <button class="btn btn-primary" data-bind="enable: canAction, click: function () { navigateToPage('Pages/FeatureTemplate.aspx'); }">Manage Feature Templates</button>
        </div>
    </div>
    <script type="text/javascript">
        require(['jquery', 'jqueryui', 'knockout', 'jstree', '../scripts/models/ProvisioningAppModel']);
    </script>
</asp:Content>
