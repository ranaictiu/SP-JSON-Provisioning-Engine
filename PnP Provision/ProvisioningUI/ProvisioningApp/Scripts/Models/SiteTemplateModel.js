define(["require", "exports", 'knockout', "../Provisioning/SharePointHelper", "../Provisioning/TemplateManager", "./ProgressViewModel"], function (require, exports, ko, provisioning, TemplateManager, ViewModel) {
    "use strict";
    var uiManager = provisioning.UI;
    var utils = provisioning.Utils;
    var OperationStatus = TemplateManager.OperationStatus;
    var ProgressSteps = TemplateManager.ProgressSteps;
    var ProgressUiModel = ViewModel.ProgressUIModel;
    var SiteCreationInfo = provisioning.SiteCreationInfo;
    require(["jQuery"], function ($) {
        $(document).ready(function () {
            var model = new SiteTemplateViewModel();
            ko.applyBindings(model, document.getElementById('siteCreationContainer'));
            var progressUi = new ProgressUiModel();
            model.initialize(progressUi);
        });
    });
    var SiteFeatureTemplate = (function () {
        function SiteFeatureTemplate() {
        }
        return SiteFeatureTemplate;
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
        SiteTemplateViewModel.prototype.initialize = function (progressUi) {
            var _this = this;
            this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
            this.progressUI = progressUi;
            uiManager.showDialog('Loading...', 'Please wait while loading');
            this.spHelper.getListItems('Templates', 100, 'Id,Title,TemplateDescription,TemplateID,TemplateType,EncodedAbsUrl,File.serverRelativeUrl', function (lis) {
                var siteTemplateItems = ko.utils.arrayFilter(lis, function (li) {
                    return li.get_item('TemplateType') == 'Site';
                });
                var siteTemplates = utils.arrayMap(siteTemplateItems, function (li, index) {
                    var st = new SiteFeatureTemplate();
                    st.itemId = li.get_id();
                    st.title = li.get_item('Title');
                    st.description = li.get_item('TemplateDescription');
                    st.templateId = li.get_item('TemplateID');
                    st.templateType = li.get_item('TemplateType');
                    st.serverRelativeUrl = li.get_file().get_serverRelativeUrl();
                    st.fullUrl = li.get_item('EncodedAbsUrl');
                    return st;
                });
                _this.siteTemplates(siteTemplates);
                uiManager.closeDialog();
            });
        };
        SiteTemplateViewModel.prototype.createSite = function () {
            var _this = this;
            if (!this.validateInputs()) {
                return;
            }
            uiManager.showDialog('Validating Request', 'Please wait while validating request.');
            var fileUrl = this.selectedTemplate().fullUrl;
            this.spHelper.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (template) {
                template = template.replaceAll('{{SiteTitle}}', _this.siteName());
                var siteTemplate = $.parseJSON(template);
                _this.validRequest(siteTemplate)
                    .done(function () {
                    uiManager.closeDialog();
                })
                    .fail(function () {
                    uiManager.closeDialog();
                    uiManager.clearAllNotification();
                    _this.startProvisioning(siteTemplate);
                });
            });
        };
        SiteTemplateViewModel.prototype.validRequest = function (siteTemplate) {
            var _this = this;
            var promises = $.when(1);
            promises.then(function () {
                var d = $.Deferred();
                _this.spHelper.getCurrentUser(function (user) {
                    if (user.get_isSiteAdmin())
                        d.resolve();
                    else {
                        uiManager.showNotification('Permission', "You don't have permission to create site.");
                        d.reject();
                    }
                });
                return d;
            })
                .then(function () {
                var d = $.Deferred();
                var rootWeb = _this.spHelper.getSiteCollection().get_rootWeb();
                var siteUrl = _this.getSiteUrl().toLocaleLowerCase();
                _this.spHelper.getAllwebs(rootWeb, 'ServerRelativeUrl', function (webs) {
                    var web = utils.arrayFirst(webs, function (w) {
                        return w.get_serverRelativeUrl().toLocaleLowerCase() == siteUrl;
                    });
                    if (web) {
                        uiManager.showNotification('Site Exists', 'The site already exists. please use a different name.');
                        d.reject();
                    }
                    else
                        d.resolve();
                });
                return d;
            }).then(function () {
                var d = $.Deferred();
                var allGroupNames = [];
                for (var _i = 0, _a = siteTemplate.templates; _i < _a.length; _i++) {
                    var t = _a[_i];
                    if (t.security && t.security.siteGroups) {
                        var currentGroupNames = utils.arrayMap(t.security.siteGroups, function (g, i) {
                            return g.title.toLocaleLowerCase();
                        });
                        $.merge(allGroupNames, currentGroupNames);
                    }
                }
                _this.spHelper.getAllSiteGroups(function (siteGroups) {
                    var groupExists = false;
                    for (var _i = 0, siteGroups_1 = siteGroups; _i < siteGroups_1.length; _i++) {
                        var g = siteGroups_1[_i];
                        if (allGroupNames.indexOf(g.get_title().toLocaleLowerCase()) != -1) {
                            groupExists = true;
                            uiManager.showNotification('Group Exists', "The site group " + g.get_title() + " already exists. ");
                            break;
                        }
                    }
                    if (groupExists) {
                        d.reject();
                    }
                    else {
                        d.resolve();
                    }
                });
                return d;
            });
            return promises;
        };
        ;
        SiteTemplateViewModel.prototype.validateInputs = function () {
            if (this.siteTitle() == '') {
                uiManager.showNotification('Site Title', 'Please enter site title');
                return false;
            }
            if (this.siteName() == '') {
                uiManager.showNotification('Site Name', 'Please enter site name');
                return false;
            }
            if (this.siteDescription() == '') {
                uiManager.showNotification('Site Description', 'Site description is required');
                return false;
            }
            if (this.selectedTemplate() == null) {
                uiManager.showNotification('Site Template', 'Please select site template');
                return false;
            }
            return true;
        };
        SiteTemplateViewModel.prototype.startProvisioning = function (siteTemplate) {
            var _this = this;
            this.progressUI.initialize(siteTemplate);
            this.progressUI.show('siteCreationStatus', 'Creating Site', ProgressSteps.SiteCreation, 450);
            var siteCreationInfo = new SiteCreationInfo();
            siteCreationInfo.title = this.siteTitle();
            siteCreationInfo.language = siteTemplate.language;
            siteCreationInfo.useSamePermissionsAsParentSite = siteTemplate.useSamePermissionsAsParentSite;
            siteCreationInfo.webTemplateId = siteTemplate.webTemplateId;
            siteCreationInfo.description = this.siteDescription();
            siteCreationInfo.name = this.siteName();
            var parentWebContext = this.spHelper.getHelperContextFromUrl(utils.getQueryStringParameter('SPHostUrl'));
            parentWebContext.createSite(siteCreationInfo)
                .then(function () {
                _this.spHelper = _this.spHelper.getHelperContextFromUrl(_this.getSiteUrl());
                var templatePromises = $.when(1);
                for (var i = 0; i < siteTemplate.templates.length; i++) {
                    var template = siteTemplate.templates[i];
                    (function (t) {
                        templatePromises = templatePromises.then(function () {
                            _this.templateManager.initialize(_this.spHelper.getExecuteContext(), _this);
                            return _this.templateManager.applyTemplate(t);
                        });
                    })(template);
                }
                return templatePromises;
            })
                .then(function () {
                //do post processing actions - like save some settings
            })
                .done(function () {
                _this.onComplete(true);
            })
                .fail(function () {
                _this.onComplete(false);
            });
        };
        SiteTemplateViewModel.prototype.onComplete = function (success) {
            if (success) {
                this.progressUI.setStatus(ProgressSteps.Finalization, OperationStatus.success, 'Site Ready to Access');
                //uiManager.log('site created successfully.');
                uiManager.showStickyNotification('Site Created', 'Site Created successfully.', false);
            }
            else {
                this.progressUI.setFailed();
                uiManager.showStickyNotification('Error', 'Failed to create site', true);
            }
        };
        SiteTemplateViewModel.prototype.progressUpdate = function (stepName, message, status) {
        };
        return SiteTemplateViewModel;
    }());
});
//# sourceMappingURL=SiteTemplateModel.js.map