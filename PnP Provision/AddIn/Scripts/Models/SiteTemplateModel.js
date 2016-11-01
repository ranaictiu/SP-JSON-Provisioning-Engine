define(["require", "exports", 'knockout', "../Provisioning/SharePointHelper", "../Provisioning/TemplateManager", "./ProgressViewModel"], function (require, exports, ko, provisioning, TemplateMgr, ViewModel) {
    "use strict";
    var uiManager = provisioning.UI;
    var utils = provisioning.Utils;
    var OperationStatus = TemplateMgr.OperationStatus;
    var ProgressSteps = TemplateMgr.ProgressSteps;
    var ProgressUiModel = ViewModel.ProgressUIModel;
    var SiteCreationInfo = provisioning.SiteCreationInfo;
    var TemplateManager = TemplateMgr.TemplateManager;
    var SiteFeatureTemplate = provisioning.SiteFeatureTemplate;
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
                return _this.getParentWebUrl() + ("/" + _this.siteName());
            });
        }
        SiteTemplateViewModel.prototype.initialize = function (progressUi) {
            var _this = this;
            this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
            this.templateManager = new TemplateManager();
            this.progressUI = progressUi;
            uiManager.showDialog('Loading...', 'Please wait while loading');
            this.spHelper.getListItems('Templates', 100, 'Id,Title,TemplateDescription,TemplateID,TemplateType,EncodedAbsUrl,File.ServerRelativeUrl', function (lis) {
                var siteTemplateItems = ko.utils.arrayFilter(lis, function (li) {
                    return li.get_item('TemplateType') == 'Site';
                });
                var siteTemplates = utils.arrayMap(siteTemplateItems, function (li) {
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
        SiteTemplateViewModel.prototype.getSiteServerRelativeUrl = function () {
            return this.getParentWebRelativeUrl() + ("/" + this.siteName());
        };
        SiteTemplateViewModel.prototype.getParentWebUrl = function () {
            return decodeURIComponent(utils.getQueryStringParameter('ParentUrl'));
        };
        SiteTemplateViewModel.prototype.getParentWebRelativeUrl = function () {
            return decodeURIComponent(utils.getQueryStringParameter('ParentRelativeUrl'));
        };
        SiteTemplateViewModel.prototype.createSite = function () {
            var _this = this;
            if (!this.validateInputs()) {
                return;
            }
            this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
            uiManager.showDialog('Validating Request', 'Please wait while validating request.');
            var fileUrl = this.selectedTemplate().serverRelativeUrl;
            this.spHelper.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (template) {
                template = template.replaceAll('{{SiteTitle}}', _this.siteName());
                var siteTemplate = $.parseJSON(template);
                _this.validRequest(siteTemplate)
                    .done(function () {
                    uiManager.closeDialog();
                    uiManager.clearAllNotification();
                    _this.startProvisioning(siteTemplate);
                })
                    .fail(function () {
                    uiManager.closeDialog();
                });
            });
        };
        SiteTemplateViewModel.prototype.validRequest = function (siteTemplate) {
            var _this = this;
            var promises = $.when(1);
            var parentWebHelper = provisioning.SpHelper.getHelperContextFromUrl(this.getParentWebUrl());
            //promises = promises.then(() => {
            //    var ctx = this.spHelper.getExecuteContext();
            //    ctx.load(rootWeb, 'ServerRelativeUrl');
            //    return this.spHelper.executeQueryPromise();
            //});
            promises = promises.then(function () {
                var d = $.Deferred();
                _this.spHelper.getCurrentUser(function (user) {
                    if (user.get_isSiteAdmin())
                        d.resolve();
                    else {
                        uiManager.showNotification('Permission', "You don't have permission to create site.", true);
                        d.reject();
                    }
                });
                return d;
            });
            promises = promises.then(function () {
                var d = $.Deferred();
                //return d.resolve();
                //var helper = provisioning.SpHelper.getHelperContextFromUrl(this.getParentWebRelativeUrl());
                var parentWeb = parentWebHelper.getWeb();
                var siteServerRelativeUrl = _this.getSiteServerRelativeUrl();
                parentWebHelper.getAllwebs(parentWeb, 'ServerRelativeUrl,Url', function (webs) {
                    var web = utils.arrayFirst(webs, function (w) {
                        return w.get_serverRelativeUrl().toLocaleLowerCase() == siteServerRelativeUrl;
                    });
                    if (web) {
                        uiManager.showNotification('Site Exists', 'The site already exists. please use a different name.', true);
                        d.reject();
                    }
                    else
                        d.resolve();
                });
                return d;
            });
            promises = promises.then(function () {
                var d = $.Deferred();
                var allGroupNames = [];
                for (var _i = 0, _a = siteTemplate.Templates; _i < _a.length; _i++) {
                    var t = _a[_i];
                    if (t.Security && t.Security.SiteGroups) {
                        var currentGroupNames = utils.arrayMap(t.Security.SiteGroups, function (g, i) {
                            return g.Title.toLocaleLowerCase();
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
                            uiManager.showNotification('Group Exists', "The site group " + g.get_title() + " already exists. ", true);
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
                uiManager.showNotification('Site Title', 'Please enter site title', true);
                return false;
            }
            if (this.siteName() == '') {
                uiManager.showNotification('Site Name', 'Please enter site name', true);
                return false;
            }
            if (this.siteDescription() == '') {
                uiManager.showNotification('Site Description', 'Site description is required', true);
                return false;
            }
            if (this.selectedTemplate() == null) {
                uiManager.showNotification('Site Template', 'Please select site template', true);
                return false;
            }
            return true;
        };
        SiteTemplateViewModel.prototype.startProvisioning = function (siteTemplate) {
            var _this = this;
            this.progressUI.initialize(siteTemplate);
            this.progressUI.show('siteCreationStatus', 'Creating Site', ProgressSteps.SiteCreation, 450);
            var siteCreationInfo = new SiteCreationInfo();
            siteCreationInfo.Title = this.siteTitle();
            siteCreationInfo.Language = siteTemplate.Language;
            siteCreationInfo.UseSamePermissionsAsParentSite = siteTemplate.UseSamePermissionsAsParentSite;
            siteCreationInfo.WebTemplateId = siteTemplate.WebTemplateId;
            siteCreationInfo.Description = this.siteDescription();
            siteCreationInfo.Name = this.siteName();
            var parentWebContext = provisioning.SpHelper.getHelperContextFromUrl(this.getParentWebUrl());
            var createdWeb;
            //let serverRelativeUrl: string='/sites/devbld/dd';
            parentWebContext.createSite(siteCreationInfo, function (w) {
                createdWeb = w;
            })
                .then(function () {
                _this.progressUI.setStatus(ProgressSteps.SiteCreation, OperationStatus.success, 'Site Created');
                var createdWebContext = new SP.ClientContext(createdWeb.get_serverRelativeUrl());
                createdWebContext.set_requestTimeout(600000); //set timeout to six mins, required for some feature activation like publishing feature
                _this.spHelper = new provisioning.SpHelper(createdWebContext);
                var templatePromises = $.when(1);
                for (var i = 0; i < siteTemplate.Templates.length; i++) {
                    var template = siteTemplate.Templates[i];
                    (function (t) {
                        templatePromises = templatePromises.then(function () {
                            _this.templateManager.initialize(_this.spHelper, _this);
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
        SiteTemplateViewModel.prototype.progressUpdate = function (stepName, status, message) {
            this.progressUI.setStatus(stepName, status, message);
        };
        return SiteTemplateViewModel;
    }());
    $(document).ready(function () {
        utils.loadRequestExecutor(function () {
            var model = new SiteTemplateViewModel();
            ko.applyBindings(model, document.getElementById('siteCreationContainer'));
            var progressUi = new ProgressUiModel();
            model.initialize(progressUi);
        });
    });
});
//# sourceMappingURL=SiteTemplateModel.js.map