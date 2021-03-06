﻿import ko = require('knockout');
import SharePointHelper = require("../Provisioning/SharePointHelper");
import UI = SharePointHelper.UI;
class TreeNode {

    id: string; // will be autogenerated if omitted
    text: string; // node text
    icon: string; // string for custom
    state: {
        opened: boolean;  // is the node open
        disabled: boolean;  // is the node disabled
        selected: boolean;  // is the node selected
    };
    children: Array<TreeNode>;  // array of strings or objects
    //li_attr: { };  // attributes for the generated LI node
    //a_attr: { };  // attributes for the generated A node
    attrs: any;

}
export class ProvisioningAppModel {
    appWebTemplateName = 'app';
    tree: JSTree;
    spHelper: SharePointHelper.SpHelper;
    treeNodeElementName: string;
    selectedSiteNode = ko.observable<TreeNode>();
    initialize(treeNodeName: string) {
        this.treeNodeElementName = treeNodeName;
        UI.showDialog('Loading', 'Please wait while loading...');
        var hostUrl = decodeURIComponent(SharePointHelper.Utils.getQueryStringParameter('SPHostUrl'));
        this.spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(hostUrl);
        //this.spHelper = new SharePointHelper.SpHelper(SP.ClientContext.get_current());
        var rootWeb = this.spHelper.getSiteCollection().get_rootWeb();

        var subWebs = rootWeb.get_webs();
        var promises = $.when(1);
        promises = promises.then(() => {
            var context = this.spHelper.getExecuteContext();
            context.load(rootWeb, 'Title', 'Id', 'ServerRelativeUrl', 'Url');
            context.load(subWebs, 'Include(Id,Title,ServerRelativeUrl,Url,WebTemplate)');
            return this.spHelper.executeQueryPromise();
        });
        promises = promises.then(() => {
            var rootNodes = Array<TreeNode>();
            var rootWebNode = this.convertWebToNode(rootWeb);
            rootWebNode.state = <any>{};
            rootWebNode.state.opened = true;
            rootWebNode.state.selected = true;
            rootWebNode.children = new Array<TreeNode>();
            rootNodes.push(rootWebNode);
            for (let w of this.spHelper.getEnumerationList<SP.Web>(subWebs)) {
                if (w.get_webTemplate().toLocaleLowerCase() == this.appWebTemplateName.toLocaleLowerCase())
                    continue;
                rootWebNode.children.push(this.convertWebToNode(w));
            }
            var jsOptions = <JSTreeStaticDefaults>{};
            jsOptions.plugins = ['core'];
            jsOptions.core = <JSTreeStaticDefaultsCore>{};
            jsOptions.core.data = rootNodes;


            this.tree = $('#' + treeNodeName).jstree({
                'core': {
                    'check_callback': true,
                    'data': rootNodes
                }
            });
            this.tree = $('#' + treeNodeName).jstree(jsOptions);
            $('#' + treeNodeName).on('select_node.jstree', (e, d) => {
                var tn = <TreeNode>d;
                var node = <TreeNode>(<any>tn).node.original;
                var rootMostNode = d.node.parent == '#';
                this.selectedSiteNode(rootMostNode ? null : node);


                if (!rootMostNode && !node.attrs.loaded) {
                    var selectedNode = $('#' + treeNodeName).jstree('get_selected');
                    this.loadSubWebs(selectedNode, node);
                }
            });
            return jQuery.Deferred().resolve();
        });
        promises.done(() => {
            UI.closeDialog();
        })
            .fail(() => {
                UI.closeDialog();
                UI.showNotification('Eror', 'Failed to load subwebs', true);
            });
    }
    canAction = ko.computed(() => {
        return this.selectedSiteNode() != null;
    });
    navigateToPage(pagePath) {
        var queryString = document.URL.split("?")[1];
        var webRelativeUrl = encodeURIComponent(this.selectedSiteNode().attrs.serverRelativeUrl);
        var webFullUrl = encodeURIComponent(this.selectedSiteNode().attrs.url);
        queryString += `&ParentRelativeUrl=${webRelativeUrl}&ParentUrl=${webFullUrl}`;
        document.location.href = `${_spPageContextInfo.webAbsoluteUrl}/${pagePath}?${queryString}`;
    }
    convertWebToNode(web: SP.Web, opened?: boolean, selected?: boolean): TreeNode {
        var node = new TreeNode();
        node.id = web.get_id().toString();
        node.text = web.get_title();
        node.children = null;
        node.state = <any>{};
        if (opened)
            node.state.opened = true;
        if (selected)
            node.state.selected = true;
        node.attrs = {
            serverRelativeUrl: web.get_serverRelativeUrl(),
            url: web.get_url(),
            loaded: false
        };
        return node;
    }

    loadSubWebs(parentNode, treeNode: TreeNode) {
        UI.showDialog('Loading', 'Please wait while loading...');
        var promises = $.when(1);
        let subWebs: SP.WebCollection;
        promises = promises.then(() => {
            var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(treeNode.attrs.serverRelativeUrl);
            subWebs = spHelper.getWeb().get_webs();
            var context = spHelper.getExecuteContext();
            context.load(subWebs, 'Include(Id,Title,Url,ServerRelativeUrl,WebTemplate)');
            return spHelper.executeQueryPromise();
        });
        promises.done(() => {
            for (let w of this.spHelper.getEnumerationList<SP.Web>(subWebs)) {
                if (w.get_webTemplate().toLocaleLowerCase() == this.appWebTemplateName.toLocaleLowerCase())
                    continue;
                var n = this.convertWebToNode(w, true);
                treeNode.attrs.loaded = true;
                $("#" + this.treeNodeElementName).jstree("create_node", parentNode, n, 'last');
                $("#" + this.treeNodeElementName).jstree('open_node', parentNode);
            }
            UI.closeDialog();
        })
            .fail(() => {
                UI.showNotification('Eror', 'Failed to load subwebs', true);
                UI.closeDialog();
            });
    }
}
$(document).ready(() => {
    SharePointHelper.Utils.loadRequestExecutor(() => {
        var model = new ProvisioningAppModel();
        ko.applyBindings(model, document.getElementById('provisioningApp'));
        model.initialize('jsTreeSites');

    });
});