import ko = require('knockout');
import provisioning = require("../Provisioning/SharePointHelper")
import TemplateManager = require("../Provisioning/TemplateManager");
import ViewModel = require("./ProgressViewModel");
import uiManager = provisioning.UI;
import utils = provisioning.Utils;

import ProgressListenerInteface = TemplateManager.ProgressListenerInteface;
import OperationStatus = TemplateManager.OperationStatus;
import ProgressSteps = TemplateManager.ProgressSteps;

import ProgressUIManager = ViewModel.ProgressUIInterface;
import ProgressUiModel = ViewModel.ProgressUIModel;
import Template = provisioning.Template;
import TemplateFile = provisioning.TemplateFile;
import GroupCreationInfo = provisioning.GroupCreationInfo;
import SiteCreationInfo = provisioning.SiteCreationInfo;
require(["jQuery"], ($) => {
    $(document).ready(() => {
        var model = new SiteTemplateViewModel();
        ko.applyBindings(model, document.getElementById('siteCreationContainer'));
        var progressUi = new ProgressUiModel();
        model.initialize(progressUi);
    });
});

class SiteFeatureTemplate {
    itemId: number;
    title: string;
    description: string;
    templateId: string;
    templateType: string;
    serverRelativeUrl: string;
    fullUrl: string;
}

class SiteTemplateViewModel implements ProgressListenerInteface {
    siteTitle: KnockoutObservable<string> = ko.observable('');
    siteName: KnockoutObservable<string> = ko.observable('');
    siteDescription: KnockoutObservable<string> = ko.observable('');
    siteTemplates: KnockoutObservableArray<SiteFeatureTemplate> = ko.observableArray([]);
    spHelper: provisioning.SpHelper;
    selectedTemplate: KnockoutObservable<SiteFeatureTemplate> = ko.observable(null);
    progressUI: ProgressUIManager;
    templateManager: TemplateManager.TemplateManager;

    initialize(progressUi: ProgressUIManager) {
        this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
        this.progressUI = progressUi;
        uiManager.showDialog('Loading...', 'Please wait while loading');
        this.spHelper.getListItems('Templates', 100, 'Id,Title,TemplateDescription,TemplateID,TemplateType,EncodedAbsUrl,File.serverRelativeUrl', (lis) => {
            var siteTemplateItems = ko.utils.arrayFilter(lis, li => {
                return li.get_item('TemplateType') == 'Site';
            });
            var siteTemplates = utils.arrayMap<SP.ListItem, SiteFeatureTemplate>(siteTemplateItems, (li, index) => {
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
            this.siteTemplates(siteTemplates);
            uiManager.closeDialog();
        });
    }
    getSiteUrl = ko.computed(() => {
        if (this.siteName() == '') return '';
        return decodeURI(utils.getQueryStringParameter('SPHostUrl')) + `/${this.siteName()}`;
    });

    createSite() {
        if (!this.validateInputs()) {
            return;
        }
        uiManager.showDialog('Validating Request', 'Please wait while validating request.');
        var fileUrl = this.selectedTemplate().fullUrl;
        this.spHelper.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, template => {
            template = template.replaceAll('{{SiteTitle}}', this.siteName());
            var siteTemplate = <TemplateFile>$.parseJSON(template);

            this.validRequest(siteTemplate)
                .done(() => {
                    uiManager.closeDialog();
                })
                .fail(() => {
                    uiManager.closeDialog();
                    uiManager.clearAllNotification();
                    this.startProvisioning(siteTemplate);
                });
        });
    }
    validRequest(siteTemplate: TemplateFile) {
        var promises = $.when(1);
        promises.then(() => {
            let d = $.Deferred();
            this.spHelper.getCurrentUser(user => {
                if (user.get_isSiteAdmin())
                    d.resolve();
                else {
                    uiManager.showNotification('Permission', "You don't have permission to create site.");
                    d.reject();
                }
            });
            return d;
        })
            .then(() => {
                let d = $.Deferred();
                var rootWeb = this.spHelper.getSiteCollection().get_rootWeb();
                var siteUrl = this.getSiteUrl().toLocaleLowerCase();
                this.spHelper.getAllwebs(rootWeb, 'ServerRelativeUrl', webs => {
                    var web = utils.arrayFirst<SP.WebInformation>(webs, (w) => {
                        return w.get_serverRelativeUrl().toLocaleLowerCase() == siteUrl;
                    });
                    if (web) {
                        uiManager.showNotification('Site Exists', 'The site already exists. please use a different name.');
                        d.reject();
                    }
                    else d.resolve();
                });
                return d;
            }).then(() => {
                var d = $.Deferred();
                var allGroupNames = [];
                for (let t of siteTemplate.templates) {
                    if (t.security && t.security.siteGroups) {
                        var currentGroupNames = utils.arrayMap<GroupCreationInfo, string>(t.security.siteGroups, (g, i) => {
                            return g.title.toLocaleLowerCase();
                        });
                        $.merge(allGroupNames, currentGroupNames);
                    }
                }
                this.spHelper.getAllSiteGroups(siteGroups => {
                    var groupExists = false;
                    for (let g of siteGroups) {
                        if (allGroupNames.indexOf(g.get_title().toLocaleLowerCase()) != -1) {
                            groupExists = true;
                            uiManager.showNotification('Group Exists', `The site group ${g.get_title()} already exists. `);
                            break;
                        }
                    }
                    if (groupExists) {
                        d.reject();
                    } else {
                        d.resolve();
                    }
                });
                return d;
            });
        return promises;
    };
    validateInputs(): boolean {
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
    }
    startProvisioning(siteTemplate: TemplateFile) {
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
            .then(() => {
                this.spHelper = this.spHelper.getHelperContextFromUrl(this.getSiteUrl());
                var templatePromises = $.when(1);
                for (var i = 0; i < siteTemplate.templates.length; i++) {
                    var template = siteTemplate.templates[i];
                    (t => {
                        templatePromises = templatePromises.then(() => {
                            this.templateManager.initialize(this.spHelper.getExecuteContext(), this);
                            return this.templateManager.applyTemplate(t);
                        });
                    })(template);

                }
                return templatePromises;
            })
            .then(() => {
                //do post processing actions - like save some settings
            })
            .done(() => {
                this.onComplete(true);
            })
            .fail(() => {
                this.onComplete(false);
            });
    }
    onComplete(success: boolean) {
        if (success) {
            this.progressUI.setStatus(ProgressSteps.Finalization, OperationStatus.success, 'Site Ready to Access');
            //uiManager.log('site created successfully.');
            uiManager.showStickyNotification('Site Created', 'Site Created successfully.', false);
        } else {
            this.progressUI.setFailed();
            uiManager.showStickyNotification('Error', 'Failed to create site', true);
        }
    }
    progressUpdate(stepName: ProgressSteps, message: string, status: OperationStatus): void {

    }
}