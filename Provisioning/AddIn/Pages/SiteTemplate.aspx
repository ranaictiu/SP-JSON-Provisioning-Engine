﻿<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink Name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.DocumentManagement.js" runat="server" LoadAfterUI="true" Localizable="false" />

    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="false" LoadAfterUI="true" Localizable="false" />
    <script type="text/javascript" src="../scripts/lib/require.js"></script>
    <script type="text/javascript" src="../scripts/Config.js"></script>
    <link rel="Stylesheet" type="text/css" href="../Content/App.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/themes/base/jquery-ui.min.css" />
    </asp:Content>
    <asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
        Create New Site
    </asp:Content>
    <asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
        <div id="siteCreationContainer" class="provisioning-app bs">
            <fieldset>
                <div class="form-group">
                    <label class="control-label">
                        Site Title<span class="required">*</span>
                    </label>
                    <input type="text" data-bind="value: siteTitle" class="xlarge form-control" />
                </div>
                <div class="form-group">
                    <label class="control-label">
                        Site Name<span class="required">*</span>
                    </label>
                    <input type="text" data-bind="value: siteName" class="xlarge form-control" />
                    <div data-bind="html: getSiteUrl"></div>
                </div>
                <div class="form-group">
                    <label class="control-label">
                        Description<span class="required">*</span>
                    </label>
                    <textarea rows="5" cols="30" data-bind="value: siteDescription" class="xlarge form-control"></textarea>
                </div>
                <div class="form-group">
                    <label class="control-label">
                        Site Template<span class="required">*</span>
                    </label>
                    <select class="form-control" data-bind="options: siteTemplates, optionsText: 'title', value: selectedTemplate"></select>
                </div>
                <div class="form-group">
                    <a class="btn btn-success btn-lg" href="javascript:void(0)" data-bind="click: createSite">Create Site</a>
                </div>
            </fieldset>
        </div>
        <div id="siteCreationStatus" style="display: none;" class="progress-steps">
            <ul data-bind="foreach: steps()">
                <li data-bind="css: statusCssClass()">
                    <span class="status-icon"></span>
                    <span class="status-title" data-bind="text: title"></span>
                </li>
            </ul>
        </div>
        <script type="text/javascript">
            require(['jquery', 'jqueryui', 'knockout', '../scripts/models/SiteTemplateModel']);
        </script>
</asp:Content>
