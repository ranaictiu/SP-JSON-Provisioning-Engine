import SharePointHelper = require("../Provisioning/SharePointHelper");
import ko = require('knockout');
import ViewModel = require("./ProgressViewModel");
import UI = SharePointHelper.UI;
import Utils = SharePointHelper.Utils;
import SiteFeatureTemplate = SharePointHelper.SiteFeatureTemplate;
import TemplateFile = SharePointHelper.TemplateFile;
import ProgressUIManager = ViewModel.ProgressUIInterface;
import Manager = require("../Provisioning/TemplateManager");
import ProgressSteps = Manager.ProgressSteps;
import ProgressUiModel = ViewModel.ProgressUIModel;
import ProgressListenerInteface = Manager.ProgressListenerInteface;
import OperationStatus = Manager.OperationStatus;

export class FeatureTemplateModel implements ProgressListenerInteface {
    progressUI: ProgressUIManager;
    templateManager: Manager.TemplateManager;
    featureConfigListTitle = 'PAFeatureTemplates';
    allFeatureTemplates = ko.observableArray([]);
    appliedFeatureTemplates = ko.observableArray<SiteFeatureTemplate>([]);
    hasLoaded = ko.observable(false);
    webTitle = ko.observable();
    featureConfigListExists = false;
    selectedTemplate: SiteFeatureTemplate;
    private getApplyToWebUrl() {
        return decodeURIComponent(SharePointHelper.Utils.getQueryStringParameter('ParentUrl'));
    }
    initialize() {
        this.progressUI = new ProgressUiModel();
        this.templateManager = new Manager.TemplateManager();
        UI.showDialog('loading...', 'Please wait while loading Templates');
        var promises = $.when(1);
        promises = promises.then(() => {
            return this.loadAllTemplates();
        });
        promises = promises.then(() => {
            return this.ensureFeatureConfigList();
        });
        promises = promises.then(() => {
            return this.loadAppliedTemplates();
        });

        promises.done(() => {
            this.hasLoaded(true);
            UI.closeDialog();
        }).fail(() => {
            UI.closeDialog();
            UI.showNotification('Error', 'Failed to load templates', true);
        });
    }
    loadAllTemplates() {
        var d = $.Deferred();
        UI.showDialog('Loading', 'Please wait while loading');
        var spHelper = new SharePointHelper.SpHelper(SP.ClientContext.get_current());
        spHelper.getListItems('Templates', 100, 'Id,Title,TemplateDescription,TemplateID,TemplateType,EncodedAbsUrl,File.ServerRelativeUrl', (items) => {
            items = ko.utils.arrayFilter(items, i => {
                return i.get_item('TemplateType') == 'Feature';
            });
            var mappedItems = Utils.arrayMap<SP.ListItem, SharePointHelper.SiteFeatureTemplate>(items, li => {
                return this.convertListItemToModel(li);
                //return { id: i.get_id(), title: i.get_item('Title'), key: i.get_item('Title'), description: i.get_item('TemplateDescription'), fileUrl: i.get_item('FileRef') };
            });
            this.allFeatureTemplates(mappedItems);
            d.resolve();
        });
        return d;
    }
    private convertListItemToModel(li: SP.ListItem) {
        var st = new SiteFeatureTemplate();
        st.itemId = li.get_id();
        st.title = li.get_item('Title');
        st.description = li.get_item('TemplateDescription');
        st.templateId = li.get_item('TemplateID');
        st.templateType = li.get_item('TemplateType');
        st.serverRelativeUrl = li.get_file().get_serverRelativeUrl();
        st.fullUrl = li.get_item('EncodedAbsUrl');
        return st;
    }
    loadAppliedTemplates() {
        var promises = $.when(1);
        var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());

        promises = promises.then(() => {
            return spHelper.getListItems(this.featureConfigListTitle, 100, null, items => {
                var templates = Utils.arrayMap(items, t => {
                    var sft = new SiteFeatureTemplate();
                    sft.templateId = t.get_item('Title');
                    return sft;
                    //return { key: t.get_item('Title') };
                });
                this.appliedFeatureTemplates(templates);
            });

        });
        return promises;
    }
    ensureFeatureConfigList() {
        var promises = $.when(1);
        var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
        var context = spHelper.getExecuteContext();
        var web = spHelper.getWeb();
        let listCollection: SP.ListCollection;

        promises = promises.then(() => {
            context.load(web, 'Id', 'Title');
            listCollection = web.get_lists();
            context.load(listCollection, 'Include(Title)');
            return spHelper.executeQueryPromise();
        });
        promises = promises.then(() => {
            this.webTitle(web.get_title());
            var lists = spHelper.getEnumerationList<SP.List>(listCollection);
            this.featureConfigListExists = Utils.arrayFirst(lists, l => {
                return l.get_title() == this.featureConfigListTitle;
            }) != null;
            return jQuery.Deferred().resolve();
        });
        promises = promises.then(() => {
            if (this.featureConfigListExists) return jQuery.Deferred().resolve();

            //if hidden 'feature config list' doesn't exist, create one
            var listCreationInfo = new SP.ListCreationInformation();
            listCreationInfo.set_title(this.featureConfigListTitle);
            listCreationInfo.set_description('Provisioning App Feature Template');
            listCreationInfo.set_quickLaunchOption(SP.QuickLaunchOptions.off);
            listCreationInfo.set_templateType(100); //custom list

            var newList = web.get_lists().add(listCreationInfo);
            newList.set_hidden(true);
            newList.update();
            return spHelper.executeQueryPromise();
        });

        return promises;
    }
    hasTemplateApplied(template) {
        return Utils.arrayFirst(this.appliedFeatureTemplates(), t => {
            return t.templateId == template.templateId;
        }) != null;
    }
    applyTemplate(selectedTemplate) {
        this.selectedTemplate = selectedTemplate;
        var fileUrl = selectedTemplate.serverRelativeUrl;
        var spHelper = new SharePointHelper.SpHelper(SP.ClientContext.get_current());
        UI.showDialog('Loading', 'Please wait while loading template details');
        spHelper.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, t => {
            UI.closeDialog();
            t = t.replaceAll('{{SiteTitle}}', this.webTitle());
            var siteTemplate = <TemplateFile>$.parseJSON(t);
            this.processTemplates(siteTemplate);

        });
    }
    processTemplates(siteTemplate: TemplateFile) {
        this.progressUI.initialize(siteTemplate);
        this.progressUI.show('FeatureTemplateStatus', 'Applying Template', null, 450);
        var templatePromises = $.when(1);
        var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
        for (let template of siteTemplate.Templates) {
            templatePromises = templatePromises.then(() => {
                this.templateManager.initialize(spHelper, this);
                return this.templateManager.applyTemplate(template);
            });
        }
        templatePromises = templatePromises.then(() => {
            return this.saveTempalteSettings();
        });
        templatePromises.done(() => {
            var templates = this.appliedFeatureTemplates();
            templates.push(this.selectedTemplate);
            this.appliedFeatureTemplates(templates);
            this.selectedTemplate = null;
            this.progressUI.setStatus(ProgressSteps.Finalization, OperationStatus.success, 'Template Applied Successfully');
            UI.showStickyNotification('Template Applied', 'Template Applied Successfully.', false);
        }).fail(() => {
            this.progressUI.setFailed();
            UI.showStickyNotification('Error', 'Failed to apply template', true);
        });

    }
    saveTempalteSettings() {
        var spHelper = SharePointHelper.SpHelper.getHelperContextFromUrl(this.getApplyToWebUrl());
        var web = spHelper.getWeb();
        var list = web.get_lists().getByTitle(this.featureConfigListTitle);
        var itemCreateInfo = new SP.ListItemCreationInformation();
        var listItem = list.addItem(itemCreateInfo);

        listItem.set_item('Title', this.selectedTemplate.templateId);
        listItem.update();
        return spHelper.executeQueryPromise();
    }
    progressUpdate(stepName: ProgressSteps, status: OperationStatus, message?: string) {
        this.progressUI.setStatus(stepName, status, message);
    }
}

$(document).ready(() => {
    Utils.loadRequestExecutor(() => {
        var model = new FeatureTemplateModel();
        ko.applyBindings(model, document.getElementById('FeatureTemplateContainer'));
        model.initialize();
    });
});