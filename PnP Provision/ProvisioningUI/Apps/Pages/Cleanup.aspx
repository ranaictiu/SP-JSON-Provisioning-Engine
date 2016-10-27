<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />

    <script type="text/javascript" src="../scripts/lib/require.js"></script>
    <script type="text/javascript" src="../scripts/Config.js"></script>
    <link rel="Stylesheet" type="text/css" href="../Content/App.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/themes/base/jquery-ui.min.css" />
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Developer only page
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div id="CleanupContainer">
        <fieldset>
            <div class="form-group">
                <label class="control-label">
                    Site Name
                </label>
                <input id="austalSiteName" type="text" class="xlarge form-control" data-bind="value:siteName" />
            </div>
            <div class="form-group">
                <a class="btn btn-error btn-lg" href="javascript:void(0)" data-bind="click: runCleanup">Delete Site</a>
            </div>
        </fieldset>
        <div id="divDeveloperLog">
        </div>
    </div>
    <script type="text/javascript">
        require(['jquery', 'jqueryui', 'knockout', '../scripts/models/CleanupModel'], function ($, jui, ko, exports) {
           
            var model = new exports.CleanupModel('divDeveloperLog');
            ko.applyBindings(model, document.getElementById('CleanupContainer'));
        });
    </script>
</asp:Content>
