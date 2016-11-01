define(["require", "exports", "../Provisioning/SharePointHelper", 'knockout', "./ProgressViewModel", "../Provisioning/TemplateManager"], function (require, exports, SharePointHelper, ko, ViewModel, Manager) {
    "use strict";
    var UI = SharePointHelper.UI;
    var Utils = SharePointHelper.Utils;
    var SiteFeatureTemplate = SharePointHelper.SiteFeatureTemplate;
    var ProgressSteps = Manager.ProgressSteps;
    var ProgressUiModel = ViewModel.ProgressUIModel;
    var OperationStatus = Manager.OperationStatus;
    var FeatureTemplateModel = (function () {
        function FeatureTemplateModel() {
            this.featureConfigListTitle = 'PAFeatureTemplates';
            this.allFeatureTemplates = ko.observableArray([]);
            this.appliedFeatureTemplates = ko.observableArray([]);
            this.hasLoaded = ko.observable(false);
            this.webTitle = ko.observable();
            this.featureConfigListExists = false;
        }
        FeatureTemplateModel.prototype.getApplyToWebUrl = function () {
            return decodeURIComponent(SharePointHelper.Utils.getQueryStringParameter('ParentUrl'));
        };
        FeatureTemplateModel.prototype.initialize = function () {
            var _this = this;
            this.progressUI = new ProgressUiModel();
            this.templateManager = new Manager.TemplateManager();
            UI.showDialog('loading...', 'Please wait while loading Templates');
            var promises = $.when(1);
            promises = promises.then(function () {
                return _this.loadAllTemplates();
            });
            promises = promises.then(function () {
                return _this.ensureFeatureConfigList();
            });
            promises = promises.then(function () {
                return _this.loadAppliedTemplates();
            });
            promises.done(function () {
                _this.hasLoaded(true);
                UI.closeDialog();
            }).fail(function () {
                UI.closeDialog();
                UI.showNotification('Error', 'Failed to load templates', true);
            });
        };
        FeatureTemplateModel.prototype.loadAllTemplates = function () {
            var _this = this;
            var d = $.Deferred();
            UI.showDialog('Loading', 'Please wait while loading');
            var spHelper = new SharePointHelper.SpHelper(SP.ClientContext.get_current());
            spHelper.getListItems('Templates', 100, 'Id,Title,TemplateDescription,TemplateID,TemplateType,EncodedAbsUrl,File.ServerRelativeUrl', function (items) {
                items = ko.utils.arrayFilter(items, function (i) {
                    return i.get_item('TemplateType') == 'Feature';
                });
                var mappedItems = Utils.arrayMap(items, function (li) {
                    return _this.convertListItemToModel(li);
                    //return { id: i.get_id(), title: i.get_item('Title'), key: i.get_item('Title'), description: i.get_item('TemplateDescription'), fileUrl: i.get_item('FileRef') };
                });
                _this.allFeatureTemplates(mappedItems);
                d.resolve();
            });
            return d;
        };
        FeatureTemplateModel.prototype.convertListItemToModel = function (li) {
            var st = new SiteFeatureTemplate();
            st.itemId = li.get_id();
            st.title = li.get_item('Title');
            st.description = li.get_item('TemplateDescription');
            st.templateId = li.get_item('TemplateID');
            st.templateType = li.get_item('TemplateType');
            st.serverRelativeUrl = li.get_file().get_serverRelativeUrl();
            st.fullUrl = li.get_item('EncodedAbsUrl');
            return st;
        };
        FeatureTemplateModel.prototype.loadAppliedTemplates = function () {
            var _this = this;
            var promises = $.when(1);
            var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
            promises = promises.then(function () {
                return spHelper.getListItems(_this.featureConfigListTitle, 100, null, function (items) {
                    var templates = Utils.arrayMap(items, function (t) {
                        var sft = new SiteFeatureTemplate();
                        sft.templateId = t.get_item('Title');
                        return sft;
                        //return { key: t.get_item('Title') };
                    });
                    _this.appliedFeatureTemplates(templates);
                });
            });
            return promises;
        };
        FeatureTemplateModel.prototype.ensureFeatureConfigList = function () {
            var _this = this;
            var promises = $.when(1);
            var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
            var context = spHelper.getExecuteContext();
            var web = spHelper.getWeb();
            var listCollection;
            promises = promises.then(function () {
                context.load(web, 'Id', 'Title');
                listCollection = web.get_lists();
                context.load(listCollection, 'Include(Title)');
                return spHelper.executeQueryPromise();
            });
            promises = promises.then(function () {
                _this.webTitle(web.get_title());
                var lists = spHelper.getEnumerationList(listCollection);
                _this.featureConfigListExists = Utils.arrayFirst(lists, function (l) {
                    return l.get_title() == _this.featureConfigListTitle;
                }) != null;
                return jQuery.Deferred().resolve();
            });
            promises = promises.then(function () {
                if (_this.featureConfigListExists)
                    return jQuery.Deferred().resolve();
                //if hidden 'feature config list' doesn't exist, create one
                var listCreationInfo = new SP.ListCreationInformation();
                listCreationInfo.set_title(_this.featureConfigListTitle);
                listCreationInfo.set_description('Provisioning App Feature Template');
                listCreationInfo.set_quickLaunchOption(SP.QuickLaunchOptions.off);
                listCreationInfo.set_templateType(100); //custom list
                var newList = web.get_lists().add(listCreationInfo);
                newList.set_hidden(true);
                newList.update();
                return spHelper.executeQueryPromise();
            });
            return promises;
        };
        FeatureTemplateModel.prototype.hasTemplateApplied = function (template) {
            return Utils.arrayFirst(this.appliedFeatureTemplates(), function (t) {
                return t.templateId == template.templateId;
            }) != null;
        };
        FeatureTemplateModel.prototype.applyTemplate = function (selectedTemplate) {
            var _this = this;
            this.selectedTemplate = selectedTemplate;
            var fileUrl = selectedTemplate.serverRelativeUrl;
            var spHelper = new SharePointHelper.SpHelper(SP.ClientContext.get_current());
            UI.showDialog('Loading', 'Please wait while loading template details');
            spHelper.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (t) {
                UI.closeDialog();
                t = t.replaceAll('{{SiteTitle}}', _this.webTitle());
                var siteTemplate = $.parseJSON(t);
                _this.processTemplates(siteTemplate);
            });
        };
        FeatureTemplateModel.prototype.processTemplates = function (siteTemplate) {
            var _this = this;
            this.progressUI.initialize(siteTemplate);
            this.progressUI.show('FeatureTemplateStatus', 'Applying Template', null, 450);
            var templatePromises = $.when(1);
            var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
            var _loop_1 = function(template) {
                templatePromises = templatePromises.then(function () {
                    _this.templateManager.initialize(spHelper, _this);
                    return _this.templateManager.applyTemplate(template);
                });
            };
            for (var _i = 0, _a = siteTemplate.Templates; _i < _a.length; _i++) {
                var template = _a[_i];
                _loop_1(template);
            }
            templatePromises = templatePromises.then(function () {
                return _this.saveTempalteSettings();
            });
            templatePromises.done(function () {
                var templates = _this.appliedFeatureTemplates();
                templates.push(_this.selectedTemplate);
                _this.appliedFeatureTemplates(templates);
                _this.selectedTemplate = null;
                _this.progressUI.setStatus(ProgressSteps.Finalization, OperationStatus.success, 'Template Applied Successfully');
                UI.showStickyNotification('Template Applied', 'Template Applied Successfully.', false);
            }).fail(function () {
                _this.progressUI.setFailed();
                UI.showStickyNotification('Error', 'Failed to apply template', true);
            });
        };
        FeatureTemplateModel.prototype.saveTempalteSettings = function () {
            var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
            var web = spHelper.getWeb();
            var list = web.get_lists().getByTitle(this.featureConfigListTitle);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var listItem = list.addItem(itemCreateInfo);
            listItem.set_item('Title', this.selectedTemplate.templateId);
            listItem.update();
            return spHelper.executeQueryPromise();
        };
        FeatureTemplateModel.prototype.progressUpdate = function (stepName, status, message) {
            this.progressUI.setStatus(stepName, status, message);
        };
        return FeatureTemplateModel;
    }());
    exports.FeatureTemplateModel = FeatureTemplateModel;
    $(document).ready(function () {
        Utils.loadRequestExecutor(function () {
            var model = new FeatureTemplateModel();
            ko.applyBindings(model, document.getElementById('FeatureTemplateContainer'));
            model.initialize();
        });
    });
});
//# sourceMappingURL=FeatureTemplateModel.js.map