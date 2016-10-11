define(["require", "exports", 'knockout', "../Provisioning/SharePointHelper"], function (require, exports, ko, provisioning) {
    "use strict";
    var ui = provisioning.UI;
    var utils = provisioning.Utils;
    require(["jQuery"], function ($) {
        $(document).ready(function () {
            var model = new SiteTemplateViewModel();
            ko.applyBindings(model, document.getElementById('siteCreationContainer'));
            model.initialize();
        });
    });
    var SiteTemplate = (function () {
        function SiteTemplate() {
        }
        return SiteTemplate;
    }());
    var SiteTemplateViewModel = (function () {
        function SiteTemplateViewModel() {
            var _this = this;
            this.siteTitle = ko.observable('');
            this.siteName = ko.observable('');
            this.siteDescription = ko.observable('');
            this.siteTemplates = ko.observableArray([]);
            this.selectedTemplate = ko.observable(null);
            this.getSiteUrl = ko.computed(function () {
                if (_this.siteName() == '')
                    return '';
                return decodeURI(utils.getQueryStringParameter('SPHostUrl')) + ("/" + _this.siteName());
            });
        }
        SiteTemplateViewModel.prototype.initialize = function () {
            var _this = this;
            this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
            ui.showDialog('Loading...', 'Please wait while loading');
            this.spHelper.getListItems('Templates', 100, '', function (lis) {
                var siteTemplates = ko.utils.arrayMap(lis, function (li) {
                    var st = new SiteTemplate();
                    st.id = li.get_id();
                    st.title = li.get_item('Title');
                    return st;
                });
                _this.siteTemplates(siteTemplates);
                ui.closeDialog();
            });
        };
        SiteTemplateViewModel.prototype.createSite = function () {
            alert('hi');
        };
        return SiteTemplateViewModel;
    }());
});
//# sourceMappingURL=SiteTemplateModel.js.map