import * as provisioningApp from "./SharePointHelper"
import Template = provisioningApp.Template;
import ListInfo = provisioningApp.ListInfo;
import ListCreationInfo = provisioningApp.ListCreationInfo;
import FeatureInfo = provisioningApp.FeatureInfo;

//interface ProgressInterface {
//    clearSteps: () => void;
//    addStep: (name: string, title: string) => void;
//    setInProgress: (name: string, message: string) => void;
//    setSuccess: (name: string, message: string) => void;
//    setFailed: (name: string, message?: string) => void;
//}

enum operationStatus {
    unknown,
    inProgress,
    success,
    failed
}

interface ProgressListenerInteface {
    progressUpdate: (stepName: string, message: string, status: operationStatus) => void;
}


class TemplateManager {

    private currentContext: SP.ClientContext | SP.ClientObject;
    private currentWeb: SP.Web;
    private spHelper: provisioningApp.SpHelper;
    private progressListener: ProgressListenerInteface;
    initialize(ctx: SP.ClientContext | SP.ClientObject, progressHandler: ProgressListenerInteface) {
        this.currentContext = ctx;
        this.spHelper = new provisioningApp.SpHelper(ctx);
        this.progressListener = progressHandler;
    }
    applyTemplate(template) {
        var promises = $.when(1);
        promises = promises.then(() => {
            this.currentWeb = this.spHelper.getWeb();
            var executeContext = this.spHelper.getExecuteContext();
            executeContext.load(this.currentWeb);
            return this.spHelper.executeQueryPromise();

        });
        promises = promises.then(() => {
            return this.processFeatures(template);
        });
        promises = promises.then(() => {
            return this.processSiteGroups(template);
        });
        promises = promises.then(() => {
            return this.processSiteFields(template);
        });
        promises = promises.then(() => {
            return this.processContentTypes(template);
        });
        promises = promises.then(() => {
            return this.processPublishingPages(template);
        });
        promises = promises.then(() => {
            return this.processLists(template);
        });
        promises = promises.then(() => {
            return this.processWorkflows(template);
        });
        promises = promises.then(() => {
            return this.processNavigation(template);
        });
        promises = promises.then(() => {
            return this.processCustomActions(template);
        });

        promises = promises.then(() => {
            return this.processWebSettings(template);
        });
        return promises;
    }

    private processFeatures(template: Template) {
        var promises = $.when(1);
        let activatedWebFeatures: Array<FeatureInfo>;
        var featuresToActivate;
        promises = promises.then(() => {
            return this.spHelper.getActivatedFeatures(true, (fs) => {
                activatedWebFeatures = fs;
            });
        });
        promises = promises.then(() => {
            var pnpFeatures = template.features != null && template.features.webFeatures != null ? template.features.webFeatures : null;
            featuresToActivate = ko.utils.arrayFilter(pnpFeatures, (f) => {
                return ko.utils.arrayFirst(activatedWebFeatures, (af) => {
                    return f.definitionId.toLowerCase() == af.definitionId.toLowerCase();
                }) == null;
            });
            return {};
        });
        promises = promises.then(() => {
            if (featuresToActivate == null || featuresToActivate.length == 0) return {};
            this.progressListener.progressUpdate('FeatureActivation', 'Activating Features', operationStatus.inProgress);
            return this.spHelper.activateDeactivateWebFeatures(featuresToActivate);
        });
        promises = promises.then(() => {
            if (featuresToActivate != null && featuresToActivate.length > 0) {
                this.progressListener.progressUpdate('FeatureActivation', 'Features Activated', operationStatus.success);
            }
            return {};
        });
        return promises;
    }
    private processSiteGroups(template: Template) {
        if (template.security == null || template.security.siteGroups == null || template.security.siteGroups.length ==
            0)
            return {};
        var promises = $.when(1);
        let siteGroups: Array<SP.Group>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate('SiteGroups', 'Creating Security Groups', operationStatus.inProgress);

            return this.spHelper.getAllSiteGroups((groups) => {
                siteGroups = groups;
            });
        });
        for (let g of template.security.siteGroups) {


            promises = promises.then(() => {
                var roleDefinitionName = this.getRoleDefinitionName(template, g.title);
                var groupExists = ko.utils.arrayFirst(siteGroups, (grp) => {
                    return grp.get_title().toLowerCase() == g.title.toLowerCase();
                }) != null;

                if (groupExists) return {}
                return this.spHelper.createGroup(g, roleDefinitionName, (groupCreated) => {

                });
            });


        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate('SiteGroups', 'Security Groups Created', operationStatus.success);
            return {};
        });
        return promises;
    }
    private processSiteFields(template: Template) {
        if (template.siteFields == null || template.siteFields.length == 0) return {};
        var promises = $.when(1);
        let availableFields: Array<SP.Field>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate('FieldsCreation', 'Creating Site Fields', operationStatus.inProgress);
            return this.spHelper.getAvailableFields('Id,InternalName', (flds) => {
                availableFields = flds;
            });
        });
        for (let sf of template.siteFields) {
            promises = promises.then(() => {
                var fieldExistsAlready = ko.utils.arrayFirst(availableFields, (f) => {
                    return f.get_internalName() == sf.name;
                }) != null;
                if (fieldExistsAlready) {
                    return $.Deferred().resolve();
                };
                return this.spHelper.createWebField(this.currentWeb.get_serverRelativeUrl(), sf);
            });
        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate('FieldsCreation', 'Site Fields Created', operationStatus.success);
            return {};
        });
        return promises;
    }
    private processContentTypes(template: Template) {
        if (template.contentTypes == null || template.contentTypes.length == 0) return {};
        var promises = $.when(1);
        let availableContentTypes: Array<SP.ContentType>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate('ContentTypesCreation', 'Creating ContentTypes', operationStatus.inProgress);
            return this.spHelper.getAvailableContentTypes('Id,Name', (ctypes) => {
                availableContentTypes = ctypes;
            });
        });
        for (let ct of template.contentTypes) {
            promises = promises.then(() => {
                var ctExists = ko.utils.arrayFirst(availableContentTypes, (cti) => {
                    return ct.name == cti.get_name();
                }) != null;
                if (ctExists) {
                    return $.Deferred().resolve();
                }
                return this.spHelper.createWebContentType(ct);
            });
        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate('ContentTypesCreation', 'ContentTypes Created', operationStatus.success);
            return {};
        });
        return promises;
    }
    private processPublishingPages(template: Template) {
        if (template.pages == null || template.pages.length == 0) return {};
        var promises = $.when(1);
        promises = promises.then(() => {
            this.progressListener.progressUpdate('PagesCreation', 'Creating Pages', operationStatus.inProgress);
            return {};
        });
        promises = promises.then(() => {
            return this.spHelper.provisionPublishingPages(template.pages);
        });

        promises = promises.then(() => {
            this.progressListener.progressUpdate('PagesCreation', 'Pages Created', operationStatus.success);
            return {};
        });
        return promises;
    }
    private processLists(template: Template) {
        if (template.lists == null || template.lists.length == 0) return {};
        var promises = $.when(1);
        let allLists: Array<ListInfo>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate('ListsCreation', 'Creating Lists', operationStatus.inProgress);
            return {};
        });

        promises = promises.then(() => {
            return this.spHelper.getAllLists((lsts) => {
                allLists = lsts;
            });
        });

        for (let listInstance of template.lists) {
            promises = promises.then(() => {
                return this.spHelper.createList(listInstance);
            });
            if (listInstance.enableEnterpriseKeywords)
                promises = promises.then(() => {
                    return this.spHelper.addEnterpriseKeywordColumnsToList(listInstance.title);
                });

            promises = promises.then(() => {
                return this.spHelper.createViews(listInstance);
            });
            if (listInstance.dataRows) {
                promises = promises.then(() => {
                    return this.spHelper.populateList(listInstance.title, listInstance.dataRows);
                });
            }
            if (listInstance.security && listInstance.security.breakRoleInheritance) {
                promises = promises.then(() => {
                    return this.spHelper.setupPermissionForList(listInstance.title, listInstance.security);
                });
            }


        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate('ListsCreation', 'Lists Created', operationStatus.success);
            return {};
        });
        return promises;
    }
    private processWorkflows(template: Template) {
        if (template.workflows == null || template.workflows.subscriptions == null ||
            template.workflows.subscriptions.length == 0)
            return {};

        var promises = $.when(1);
        promises = promises.then(() => {
            this.progressListener.progressUpdate('WorkflowsCreation', 'Provisioning Workflows', operationStatus.inProgress);
            return {};
        });
        for (let wfs of template.workflows.subscriptions) {
            promises = promises.then(() => {
                return this.spHelper.addWorkflowSubscription(wfs);
            });
        }

        promises = promises.then(() => {
            this.progressListener.progressUpdate('WorkflowsCreation', 'Workflows Provisioned', operationStatus.success);
            return {};
        });
        return promises;
    }
    private processNavigation(template: Template) {
        return {};
        //if (template.Navigation == null) return {};
        //var promises = $.when(1);
        //promises = promises.then(()=> {
        //    progressSteps.setInProgress('Navigation', 'Preparing Navigation');
        //    return {};
        //});
        //promises = promises.then(()=> {
        //    return {};
        //    //TODO: navigation is not processed 
        //    return spHelper.provisionNavigation(template.Navigation);
        //});
        //promises = promises.then(()=> {
        //    progressSteps.setSuccess('Navigation', 'Naviation Prepared');
        //    return {};
        //});
        //return promises;
    }
    private processWebSettings(template: Template) {
        if (template.webSettings == null) return {};
        if (template.webSettings.welcomePage)
            return this.spHelper.setWelcomePage(template.webSettings.welcomePage);
        return {};
    }
    private processCustomActions(template: Template) {
        if (template.customActions == null || template.customActions.webCustomActions == null) return {};

        var promises = $.when(1);
        for (let customAction of template.customActions.webCustomActions) {
            promises = promises.then(() => {
                var templateFileUrl = _spPageContextInfo.webServerRelativeUrl + customAction.url;
                return this.spHelper.addCustomAction(_spPageContextInfo.webAbsoluteUrl, templateFileUrl);

            });
        }

        return promises;
    }

    getRoleDefinitionName(template: Template, groupName): string {
        if (template.security == null || template.security.siteSecurityPermissions == null ||
            template.security.siteSecurityPermissions.roleAssignments == null) return null;
        var roleAssignment = ko.utils.arrayFirst(template.security.siteSecurityPermissions.roleAssignments,
            (r) => {
                return r.principal.toLowerCase() == groupName.toLowerCase();
            });
        return roleAssignment == null ? null : roleAssignment.roleDefinition;
    }
}
