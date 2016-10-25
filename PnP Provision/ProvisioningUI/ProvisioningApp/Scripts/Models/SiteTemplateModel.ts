import ko = require('knockout');
import provisioning = require("../Provisioning/SharePointHelper")
import TemplateMgr = require("../Provisioning/TemplateManager");
import ViewModel = require("./ProgressViewModel");
import uiManager = provisioning.UI;
import utils = provisioning.Utils;

import ProgressListenerInteface = TemplateMgr.ProgressListenerInteface;
import OperationStatus = TemplateMgr.OperationStatus;
import ProgressSteps = TemplateMgr.ProgressSteps;

import ProgressUIManager = ViewModel.ProgressUIInterface;
import ProgressUiModel = ViewModel.ProgressUIModel;
import Template = provisioning.Template;
import TemplateFile = provisioning.TemplateFile;
import GroupCreationInfo = provisioning.GroupCreationInfo;
import SiteCreationInfo = provisioning.SiteCreationInfo;
import TemplateManager = TemplateMgr.TemplateManager;


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
    templateManager: TemplateManager;

    initialize(progressUi: ProgressUIManager) {
        this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
        this.templateManager = new TemplateManager();
        this.progressUI = progressUi;
        uiManager.showDialog('Loading...', 'Please wait while loading');
        utils.loadRequestExecutor(() => {
            this.spHelper.getListItems('Templates', 100, 'Id,Title,TemplateDescription,TemplateID,TemplateType,EncodedAbsUrl,File.ServerRelativeUrl', (lis) => {
                var siteTemplateItems = ko.utils.arrayFilter(lis, li => {
                    return li.get_item('TemplateType') == 'Site';
                });
                var siteTemplates = utils.arrayMap<SP.ListItem, SiteFeatureTemplate>(siteTemplateItems, li => {
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
        });

    }
    getSiteUrl = ko.computed(() => {
        if (this.siteName() == '') return '';
        return this.getParentWebUrl() + `/${this.siteName()}`;
    });
    getSiteServerRelativeUrl() {
        return _spPageContextInfo.webServerRelativeUrl + `/${this.siteName()}`;
    }

    getParentWebUrl() {
        return decodeURIComponent(utils.getQueryStringParameter('SPHostUrl'));
    }

    createSite() {
        if (!this.validateInputs()) {
            return;
        }
        this.spHelper = new provisioning.SpHelper(SP.ClientContext.get_current());
        uiManager.showDialog('Validating Request', 'Please wait while validating request.');
        var fileUrl = this.selectedTemplate().serverRelativeUrl;
        this.spHelper.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, template => {
            template = template.replaceAll('{{SiteTitle}}', this.siteName());
            var siteTemplate = <TemplateFile>$.parseJSON(template);

            this.validRequest(siteTemplate)
                .done(() => {
                    uiManager.closeDialog();
                    uiManager.clearAllNotification();
                    this.startProvisioning(siteTemplate);
                })
                .fail(() => {
                    uiManager.closeDialog();
                });
        });
    }
    validRequest(siteTemplate: TemplateFile) {
        var promises = $.when(1);
        let rootWebServerRelativeUrl: string;

        var rootWeb = this.spHelper.getSiteCollection().get_rootWeb();
        promises = promises.then(() => {
            var ctx = this.spHelper.getExecuteContext();
            ctx.load(rootWeb, 'ServerRelativeUrl');
            return this.spHelper.executeQueryPromise();
        });
        promises = promises.then(() => {
            rootWebServerRelativeUrl = rootWeb.get_serverRelativeUrl();
            let d = $.Deferred();
            this.spHelper.getCurrentUser(user => {
                if (user.get_isSiteAdmin())
                    d.resolve();
                else {
                    uiManager.showNotification('Permission', "You don't have permission to create site.", true);
                    d.reject();
                }
            });
            return d;
        });
        promises = promises.then(() => {
            let d = $.Deferred();
            return d.resolve();

            //var siteServerRelativeUrl = rootWebServerRelativeUrl + '/' + this.siteName();
            //this.spHelper.getAllwebs(rootWeb, 'ServerRelativeUrl,Url', webs => {
            //    var web = utils.arrayFirst<SP.Web>(webs, (w) => {
            //        return w.get_serverRelativeUrl().toLocaleLowerCase() == siteServerRelativeUrl;
            //    });
            //    if (web) {
            //        uiManager.showNotification('Site Exists', 'The site already exists. please use a different name.',
            //            true);
            //        d.reject();
            //    } else d.resolve();
            //});
            //return d;
        });
        promises = promises.then(() => {
            var d = $.Deferred();
            var allGroupNames = [];
            for (let t of siteTemplate.Templates) {
                if (t.Security && t.Security.SiteGroups) {
                    var currentGroupNames = utils.arrayMap<GroupCreationInfo, string>(t.Security.SiteGroups, (g, i) => {
                        return g.Title.toLocaleLowerCase();
                    });
                    $.merge(allGroupNames, currentGroupNames);
                }
            }
            this.spHelper.getAllSiteGroups(siteGroups => {
                var groupExists = false;
                for (let g of siteGroups) {
                    if (allGroupNames.indexOf(g.get_title().toLocaleLowerCase()) != -1) {
                        groupExists = true;
                        uiManager.showNotification('Group Exists', `The site group ${g.get_title()} already exists. `, true);
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
    }
    startProvisioning(siteTemplate: TemplateFile) {
        this.progressUI.initialize(siteTemplate);
        this.progressUI.show('siteCreationStatus', 'Creating Site', ProgressSteps.SiteCreation, 450);

        var siteCreationInfo = new SiteCreationInfo();
        siteCreationInfo.Title = this.siteTitle();
        siteCreationInfo.Language = siteTemplate.Language;
        siteCreationInfo.UseSamePermissionsAsParentSite = siteTemplate.UseSamePermissionsAsParentSite;
        siteCreationInfo.WebTemplateId = siteTemplate.WebTemplateId;
        siteCreationInfo.Description = this.siteDescription();
        siteCreationInfo.Name = this.siteName();
        var parentWebContext = this.spHelper.getHelperContextFromUrl(this.getParentWebUrl());
        let createdWeb: SP.Web;
        //let serverRelativeUrl: string='/sites/devbld/dd';
        parentWebContext.createSite(siteCreationInfo, (w) => {
            createdWeb = w;
        })
            .then(() => {
                this.progressUI.setStatus(ProgressSteps.SiteCreation, OperationStatus.success, 'Site Created');
                let createdWebContext = new SP.ClientContext(createdWeb.get_serverRelativeUrl());
                createdWebContext.set_requestTimeout(300000);
                this.spHelper = new provisioning.SpHelper(createdWebContext);

                var templatePromises = $.when(1);
                for (var i = 0; i < siteTemplate.Templates.length; i++) {
                    var template = siteTemplate.Templates[i];
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
    progressUpdate(stepName: ProgressSteps, status: OperationStatus, message?: string): void {
        this.progressUI.setStatus(stepName, status, message);
    }
}


$(document).ready(() => {
    var model = new SiteTemplateViewModel();
    ko.applyBindings(model, document.getElementById('siteCreationContainer'));
    var progressUi = new ProgressUiModel();
    model.initialize(progressUi);
});