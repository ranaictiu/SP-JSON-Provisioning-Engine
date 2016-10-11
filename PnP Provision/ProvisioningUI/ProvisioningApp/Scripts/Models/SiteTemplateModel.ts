import ko = require('knockout');
import provisioning = require("../Provisioning/SharePointHelper")
import ui = provisioning.UI;
import utils = provisioning.Utils;
require(["jQuery"], ($) => {
    $(document).ready(() => {
        var model = new SiteTemplateViewModel();
        ko.applyBindings(model, document.getElementById('siteCreationContainer'));
        model.initialize();
    });
});

class SiteTemplate {
    id: number;
    title: string;
}

class SiteTemplateViewModel {
    siteTitle: KnockoutObservable<string> = ko.observable('');
    siteName: KnockoutObservable<string> = ko.observable('');
    siteDescription: KnockoutObservable<string> = ko.observable('');
    siteTemplates: KnockoutObservableArray<SiteTemplate> = ko.observableArray([]);
    spHelper: provisioning.SpHelper;
    selectedTemplate: KnockoutObservable<SiteTemplate> = ko.observable(null);

    initialize() {
        this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
        ui.showDialog('Loading...', 'Please wait while loading');
        this.spHelper.getListItems('Templates', 100, '', (lis) => {
            var siteTemplates = ko.utils.arrayMap(lis, li => {
                var st = new SiteTemplate();
                st.id = li.get_id();
                st.title = li.get_item('Title');
                return st;
            });
            this.siteTemplates(siteTemplates);
            ui.closeDialog();
        });
    }
    getSiteUrl = ko.computed(() => {
        if (this.siteName() == '') return '';
        return decodeURI(utils.getQueryStringParameter('SPHostUrl')) + `/${this.siteName()}`;
    });
    createSite() {
        alert('hi');
    }
}