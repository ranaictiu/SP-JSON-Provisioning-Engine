define(["require", "exports", "../Provisioning/SharePointHelper", 'knockout'], function (require, exports, SharePointHelper, ko) {
    "use strict";
    var Utils = SharePointHelper.Utils;
    var CleanupModel = (function () {
        function CleanupModel(logElementId) {
            this.siteName = ko.observable('');
            this.logDivId = logElementId;
        }
        CleanupModel.prototype.deleteSite = function () {
            var url = _spPageContextInfo.siteServerRelativeUrl;
            url = url + '/' + this.siteName();
            this.siteServerRelativeUrl = url;
            this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
            //this.hostWebUrl = decodeURIComponent(SharePointHelper.Utils.getQueryStringParameter('SPHostUrl'));
            $('#' + this.logDivId).empty();
            //var currentContext = new SP.ClientContext(this.appWebUrl);
            //var factory = new SP.ProxyWebRequestExecutorFactory(this.appWebUrl);
            //currentContext.set_webRequestExecutorFactory(factory);
            //var context = new SP.AppContextSite(currentContext, this.siteServerRelativeUrl);
            var context = new SP.ClientContext(this.siteServerRelativeUrl);
            this.spHelper = new SharePointHelper.SpHelper(context);
            this.deleteSiteInternal(context)
                .then(function () {
                alert('done');
            }, function () {
                alert('failed');
            });
        };
        CleanupModel.prototype.runCleanup = function () {
            var _this = this;
            Utils.loadRequestExecutor(function () {
                _this.deleteSite();
            });
        };
        CleanupModel.prototype.deleteSiteInternal = function (context) {
            var _this = this;
            var promises = $.when(1);
            var executeContext = this.spHelper.getExecuteContext();
            var siteGroups = new Array();
            var roleAssignemnts;
            promises = promises.then(function () {
                roleAssignemnts = context.get_web().get_roleAssignments();
                executeContext.load(roleAssignemnts, 'Include(Member)');
                return _this.spHelper.executeQueryPromise();
            });
            promises = promises.then(function () {
                var enumerator = roleAssignemnts.getEnumerator();
                while (enumerator.moveNext()) {
                    var m = enumerator.get_current().get_member();
                    if (m.get_principalType() == SP.Utilities.PrincipalType.sharePointGroup)
                        siteGroups.push(m);
                }
                return {};
            });
            promises = promises.then(function () {
                var d = $.Deferred();
                var iPromises = $.when(1);
                var _loop_1 = function(m) {
                    iPromises = iPromises.then(function () {
                        _this.logToDiv("Deleting group " + m.get_title());
                        var rootWeb = context.get_site().get_rootWeb();
                        rootWeb.get_siteGroups().removeById(m.get_id());
                        return _this.spHelper.executeQueryPromise();
                    });
                };
                for (var _i = 0, siteGroups_1 = siteGroups; _i < siteGroups_1.length; _i++) {
                    var m = siteGroups_1[_i];
                    _loop_1(m);
                }
                iPromises.done(function () {
                    d.resolve();
                })
                    .fail(function () {
                    d.reject();
                });
                return d;
            });
            promises = promises.then(function () {
                _this.logToDiv('Deleting web');
                var helper = _this.spHelper.getHelperContextFromUrl(_this.siteServerRelativeUrl);
                helper.getWeb().deleteObject();
                return helper.executeQueryPromise();
            });
            promises.done(function () {
                _this.logToDiv('Done');
            }).fail(function () {
                _this.logToDiv('failed');
            });
            return promises;
        };
        CleanupModel.prototype.logToDiv = function (msg) {
            msg = "<p>" + msg + "</p>";
            $(msg).appendTo('#' + this.logDivId);
        };
        return CleanupModel;
    }());
    exports.CleanupModel = CleanupModel;
});
//# sourceMappingURL=CleanupModel.js.map