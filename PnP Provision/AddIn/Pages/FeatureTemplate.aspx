<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />
    <link rel="Stylesheet" type="text/css" href="../Content/App.min.css" />
    <script type="text/javascript" src="../scripts/lib/require.js"></script>
    <script type="text/javascript" src="../scripts/Config.js"></script>
    <link rel="Stylesheet" type="text/css" href="../Content/App.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/themes/base/jquery-ui.min.css" />
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Feature Template
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="provisioning-app bs">
        <div id="FeatureTemplateContainer">
            <div class="tab-content" style="display: none" data-bind="visible: hasLoaded">
                <h2 data-bind="text: 'Feature Templates for site ' + $root.webTitle()"></h2>
                <table class="table table-hover">
                    <tr>
                        <th>Template</th>
                        <th>Description</th>
                        <th>Status/Action</th>
                    </tr>
                    <!-- ko foreach:allFeatureTemplates -->
                    <tr>
                        <td data-bind="text: $data.title"></td>
                        <td data-bind="text: $data.description"></td>
                        <td>
                            <span class="btn btn-success disabled" data-bind="visible: $root.hasTemplateApplied($data)">Template Applied</span>
                            <a href="javascript:void(0)" class="btn btn-primary" data-bind="visible: !$root.hasTemplateApplied($data), click: function () { $parent.applyTemplate($data) }">Apply this template</a>
                        </td>
                    </tr>
                    <!-- /ko -->
                </table>
            </div>
        </div>
        <div id="FeatureTemplateStatus" style="display: none;">
            <ul data-bind="foreach: steps()">
                <li data-bind="css: statusCssClass()">
                    <span class="status-icon"></span>
                    <span class="status-title" data-bind="text: title"></span>
                </li>
            </ul>
        </div>
    </div>
      <script type="text/javascript">
            require(['jquery', 'jqueryui', 'knockout', '../scripts/models/FeatureTemplateModel']);
        </script>
</asp:Content>
