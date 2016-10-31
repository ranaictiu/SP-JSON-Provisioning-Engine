import SharePointHelper = require("../Provisioning/SharePointHelper");
import ko=require('knockout');
import Utils = SharePointHelper.Utils;

export class CleanupModel {
    logDivId: string;
    appWebUrl: string;
    //hostWebUrl: string;
    siteServerRelativeUrl: string;
    spHelper: SharePointHelper.SpHelper;
    siteName = ko.observable<string>('');
    constructor(logElementId: string) {
        this.logDivId = logElementId;
    }
    deleteSite() {
        var url = _spPageContextInfo.siteServerRelativeUrl;
        url = url + '/' +this.siteName();
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
            .then(() => {
                alert('done');
            }, () => {
                alert('failed');
            });
    }
    runCleanup() {
        Utils.loadRequestExecutor(() => {
            this.deleteSite();
        });
    }
    private deleteSiteInternal(context: SP.ClientContext) {
        var promises = $.when(1);
        var executeContext = this.spHelper.getExecuteContext();


        let siteGroups = new Array<SP.Principal>();
        let roleAssignemnts: SP.RoleAssignmentCollection;

        promises = promises.then(() => {
            roleAssignemnts = context.get_web().get_roleAssignments();

            executeContext.load(roleAssignemnts, 'Include(Member)');
            return this.spHelper.executeQueryPromise();
        });

        promises = promises.then(() => {
            var enumerator = roleAssignemnts.getEnumerator();
            while (enumerator.moveNext()) {
                var m = enumerator.get_current().get_member();
                if (m.get_principalType() == SP.Utilities.PrincipalType.sharePointGroup)
                    siteGroups.push(m);
            }

            return {};
        });
        promises = promises.then(() => {
            var d = $.Deferred();
            var iPromises = $.when(1);
            for (let m of siteGroups) {
                iPromises = iPromises.then(() => {
                    this.logToDiv(`Deleting group ${m.get_title()}`);
                    var rootWeb = context.get_site().get_rootWeb();
                    rootWeb.get_siteGroups().removeById(m.get_id());
                    return this.spHelper.executeQueryPromise();
                });
            }
            iPromises.done(() => {
                d.resolve();
            })
                .fail(() => {
                    d.reject();
                });
            return d;
        });



        promises = promises.then(() => {
            this.logToDiv('Deleting web');
            var helper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.siteServerRelativeUrl);
            helper.getWeb().deleteObject();
            return helper.executeQueryPromise();
        });



        promises.done(() => {
            this.logToDiv('Done');
        }).fail(() => {
            this.logToDiv('failed');
        });
        return promises;
    }

    private logToDiv(msg: string) {
        msg = `<p>${msg}</p>`;
        $(msg).appendTo('#' + this.logDivId);
    }
}