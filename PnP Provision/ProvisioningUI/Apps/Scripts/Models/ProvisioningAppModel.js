define(["require", "exports", 'knockout', "../Provisioning/SharePointHelper"], function (require, exports, ko, SharePointHelper) {
    "use strict";
    var UI = SharePointHelper.UI;
    var TreeNode = (function () {
        function TreeNode() {
        }
        return TreeNode;
    }());
    var ProvisioningAppModel = (function () {
        function ProvisioningAppModel() {
            var _this = this;
            this.appWebTemplateName = 'app';
            this.selectedSiteNode = ko.observable();
            this.canAction = ko.computed(function () {
                return _this.selectedSiteNode() != null;
            });
        }
        ProvisioningAppModel.prototype.initialize = function (treeNodeName) {
            var _this = this;
            this.treeNodeElementName = treeNodeName;
            UI.showDialog('Loading', 'Please wait while loading...');
            var hostUrl = decodeURIComponent(SharePointHelper.Utils.getQueryStringParameter('SPHostUrl'));
            this.spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(hostUrl);
            //this.spHelper = new SharePointHelper.SpHelper(SP.ClientContext.get_current());
            var rootWeb = this.spHelper.getSiteCollection().get_rootWeb();
            var subWebs = rootWeb.get_webs();
            var promises = $.when(1);
            promises = promises.then(function () {
                var context = _this.spHelper.getExecuteContext();
                context.load(rootWeb, 'Title', 'Id', 'ServerRelativeUrl', 'Url');
                context.load(subWebs, 'Include(Id,Title,ServerRelativeUrl,Url)');
                return _this.spHelper.executeQueryPromise();
            });
            promises = promises.then(function () {
                var rootNodes = Array();
                var rootWebNode = _this.convertWebToNode(rootWeb);
                rootWebNode.state = {};
                rootWebNode.state.opened = true;
                rootWebNode.state.selected = true;
                rootWebNode.children = new Array();
                rootNodes.push(rootWebNode);
                for (var _i = 0, _a = _this.spHelper.getEnumerationList(subWebs); _i < _a.length; _i++) {
                    var w = _a[_i];
                    rootWebNode.children.push(_this.convertWebToNode(w));
                }
                var jsOptions = {};
                jsOptions.plugins = ['core'];
                jsOptions.core = {};
                jsOptions.core.data = rootNodes;
                _this.tree = $('#' + treeNodeName).jstree({
                    'core': {
                        'check_callback': true,
                        'data': rootNodes
                    }
                });
                _this.tree = $('#' + treeNodeName).jstree(jsOptions);
                $('#' + treeNodeName).on('select_node.jstree', function (e, d) {
                    var tn = d;
                    var node = tn.node.original;
                    var rootMostNode = d.node.parent == '#';
                    _this.selectedSiteNode(rootMostNode ? null : node);
                    if (!rootMostNode && !node.attrs.loaded) {
                        var selectedNode = $('#' + treeNodeName).jstree('get_selected');
                        _this.loadSubWebs(selectedNode, node);
                    }
                });
                return jQuery.Deferred().resolve();
            });
            promises.done(function () {
                UI.closeDialog();
            })
                .fail(function () {
                UI.closeDialog();
                UI.showNotification('Eror', 'Failed to load subwebs', true);
            });
        };
        ProvisioningAppModel.prototype.navigateToPage = function (pagePath) {
            var queryString = document.URL.split("?")[1];
            var webRelativeUrl = encodeURIComponent(this.selectedSiteNode().attrs.serverRelativeUrl);
            var webFullUrl = encodeURIComponent(this.selectedSiteNode().attrs.url);
            queryString += "&ParentRelativeUrl=" + webRelativeUrl + "&ParentUrl=" + webFullUrl;
            document.location.href = _spPageContextInfo.webAbsoluteUrl + "/" + pagePath + "?" + queryString;
        };
        ProvisioningAppModel.prototype.convertWebToNode = function (web, opened, selected) {
            var node = new TreeNode();
            node.id = web.get_id().toString();
            node.text = web.get_title();
            node.children = null;
            node.state = {};
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
        };
        ProvisioningAppModel.prototype.loadSubWebs = function (parentNode, treeNode) {
            var _this = this;
            UI.showDialog('Loading', 'Please wait while loading...');
            var promises = $.when(1);
            var subWebs;
            promises = promises.then(function () {
                var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(treeNode.attrs.serverRelativeUrl);
                subWebs = spHelper.getWeb().get_webs();
                var context = spHelper.getExecuteContext();
                context.load(subWebs, 'Include(Id,Title,Url,ServerRelativeUrl,WebTemplate)');
                return spHelper.executeQueryPromise();
            });
            promises.done(function () {
                for (var _i = 0, _a = _this.spHelper.getEnumerationList(subWebs); _i < _a.length; _i++) {
                    var w = _a[_i];
                    if (w.get_webTemplate().toLocaleLowerCase() == _this.appWebTemplateName.toLocaleLowerCase())
                        continue;
                    var n = _this.convertWebToNode(w, true);
                    treeNode.attrs.loaded = true;
                    $("#" + _this.treeNodeElementName).jstree("create_node", parentNode, n, 'last');
                    $("#" + _this.treeNodeElementName).jstree('open_node', parentNode);
                }
                UI.closeDialog();
            })
                .fail(function () {
                UI.showNotification('Eror', 'Failed to load subwebs', true);
                UI.closeDialog();
            });
        };
        return ProvisioningAppModel;
    }());
    exports.ProvisioningAppModel = ProvisioningAppModel;
    $(document).ready(function () {
        SharePointHelper.Utils.loadRequestExecutor(function () {
            var model = new ProvisioningAppModel();
            ko.applyBindings(model, document.getElementById('provisioningApp'));
            model.initialize('jsTreeSites');
        });
    });
});
//# sourceMappingURL=ProvisioningAppModel.js.map