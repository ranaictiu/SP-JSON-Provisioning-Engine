import * as provisioningApp from "./SharePointHelper"
import Template = provisioningApp.Template;
import ListInfo = provisioningApp.ListInfo;
import FeatureInfo = provisioningApp.FeatureInfo;
import Utils = provisioningApp.Utils;

//interface ProgressInterface {
//    clearSteps: () => void;
//    addStep: (name: string, title: string) => void;
//    setInProgress: (name: string, message: string) => void;
//    setSuccess: (name: string, message: string) => void;
//    setFailed: (name: string, message?: string) => void;
//}

export enum OperationStatus {
    unknown,
    pending,
    inProgress,
    success,
    failed
}

export enum ProgressSteps {
    SiteCreation,
    Features,
    SecurityGroups,
    Columns,
    ContentTypes,
    Lists,
    Pages,
    Workflows,
    Navigation,
    CustomActions,
    WebSettings,
    Finalization
}

export interface ProgressListenerInteface {
    progressUpdate: (stepName: ProgressSteps, status: OperationStatus, message?: string) => void;
}


export class TemplateManager {

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
        this.progressListener.progressUpdate(ProgressSteps.Features, OperationStatus.inProgress, 'Activating Features');
        promises = promises.then(() => {
            return this.spHelper.getActivatedFeatures(true, (fs) => {
                activatedWebFeatures = fs;
            });
        });
        promises = promises.then(() => {
            var pnpFeatures = template.Features != null && template.Features.WebFeatures != null ? template.Features.WebFeatures : null;
            featuresToActivate = Utils.arrayFilter(pnpFeatures, (f) => {
                return Utils.arrayFirst(activatedWebFeatures, (af) => {
                    return f.ID.toLowerCase() == af.ID.toLowerCase();
                }) == null;
            });
            return {};
        });
        promises = promises.then(() => {
            if (featuresToActivate == null || featuresToActivate.length == 0) return {};

            return this.spHelper.activateDeactivateWebFeatures(featuresToActivate);
        });
        promises = promises.then(() => {
            //if (featuresToActivate != null && featuresToActivate.length > 0) {
            this.progressListener.progressUpdate(ProgressSteps.Features, OperationStatus.success, 'Features Activated');
            //}
            return {};
        });
        return promises;
    }
    private processSiteGroups(template: Template) {
        if (template.Security == null || template.Security.SiteGroups == null || template.Security.SiteGroups.length ==
            0)
            return {};
        var promises = $.when(1);
        let siteGroups: Array<SP.Group>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.SecurityGroups, OperationStatus.inProgress, 'Creating Security Groups');

            return this.spHelper.getAllSiteGroups((groups) => {
                siteGroups = groups;
            });
        });
        for (let g of template.Security.SiteGroups) {


            promises = promises.then(() => {
                var roleDefinitionName = this.getRoleDefinitionName(template, g.Title);
                var groupExists = Utils.arrayFirst(siteGroups, (grp) => {
                    return grp.get_title().toLowerCase() == g.Title.toLowerCase();
                }) != null;

                if (groupExists) return {}
                return this.spHelper.createGroup(g, roleDefinitionName, (groupCreated) => {

                });
            });


        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.SecurityGroups, OperationStatus.success, 'Security Groups Created');
            return {};
        });
        return promises;
    }
    private processSiteFields(template: Template) {
        if (template.SiteFields == null || template.SiteFields.length == 0) return {};
        var promises = $.when(1);
        let availableFields: Array<SP.Field>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Columns, OperationStatus.inProgress, 'Creating Site Fields');
            return this.spHelper.getAvailableFields('Id,InternalName', (flds) => {
                availableFields = flds;
            });
        });
        for (let sf of template.SiteFields) {
            promises = promises.then(() => {
                var fieldExistsAlready = Utils.arrayFirst(availableFields, (f) => {
                    return f.get_internalName() == sf.Name;
                }) != null;
                if (fieldExistsAlready) {
                    return $.Deferred().resolve();
                };
                return this.spHelper.createWebField(this.currentWeb.get_serverRelativeUrl(), sf);
            });
        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Columns, OperationStatus.success, 'Site Fields Created');
            return {};
        });
        return promises;
    }
    private processContentTypes(template: Template) {
        if (template.ContentTypes == null || template.ContentTypes.length == 0) return {};
        var promises = $.when(1);
        let availableContentTypes: Array<SP.ContentType>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.ContentTypes, OperationStatus.inProgress, 'Creating ContentTypes');
            return this.spHelper.getAvailableContentTypes('Id,Name', (ctypes) => {
                availableContentTypes = ctypes;
            });
        });
        for (let ct of template.ContentTypes) {
            promises = promises.then(() => {
                var ctExists = Utils.arrayFirst(availableContentTypes, (cti) => {
                    return ct.Name == cti.get_name();
                }) != null;
                if (ctExists) {
                    return $.Deferred().resolve();
                }
                return this.spHelper.createWebContentType(ct);
            });
        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.ContentTypes, OperationStatus.success, 'ContentTypes Created');
            return {};
        });
        return promises;
    }
    private processPublishingPages(template: Template) {
        if (template.Pages == null || template.Pages.length == 0) return {};
        var promises = $.when(1);
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Pages, OperationStatus.inProgress, 'Creating Pages');
            return {};
        });
        promises = promises.then(() => {
            return this.spHelper.provisionPublishingPages(template.Pages);
        });

        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Pages, OperationStatus.success, 'Pages Created');
            return {};
        });
        return promises;
    }
    private processLists(template: Template) {
        if (template.Lists == null || template.Lists.length == 0) return {};
        var promises = $.when(1);
        let allLists: Array<ListInfo>;
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Lists, OperationStatus.inProgress, 'Creating Lists');
            return {};
        });

        promises = promises.then(() => {
            return this.spHelper.getAllLists((lsts) => {
                allLists = lsts;
            });
        });

        for (let listInstance of template.Lists) {
            promises = promises.then(() => {
                return this.spHelper.createList(listInstance);
            });
            if (listInstance.EnableEnterpriseKeywords)
                promises = promises.then(() => {
                    return this.spHelper.addEnterpriseKeywordColumnsToList(listInstance.Title);
                });

            promises = promises.then(() => {
                return this.spHelper.createViews(listInstance);
            });
            if (listInstance.DataRows) {
                promises = promises.then(() => {
                    return this.spHelper.populateList(listInstance.Title, listInstance.DataRows);
                });
            }
            if (listInstance.Security && listInstance.Security.BreakRoleInheritance) {
                promises = promises.then(() => {
                    return this.spHelper.setupPermissionForList(listInstance.Title, listInstance.Security);
                });
            }


        }
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Lists, OperationStatus.success, 'Lists Created');
            return {};
        });
        return promises;
    }
    private processWorkflows(template: Template) {
        if (template.Workflows == null || template.Workflows.Subscriptions == null ||
            template.Workflows.Subscriptions.length == 0)
            return {};

        var promises = $.when(1);
        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Workflows, OperationStatus.inProgress, 'Provisioning Workflows');
            return {};
        });
        for (let wfs of template.Workflows.Subscriptions) {
            promises = promises.then(() => {
                return this.spHelper.addWorkflowSubscription(wfs);
            });
        }

        promises = promises.then(() => {
            this.progressListener.progressUpdate(ProgressSteps.Workflows, OperationStatus.success, 'Workflows Provisioned');
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
        if (template.WebSettings == null) return {};
        if (template.WebSettings.WelcomePage)
            return this.spHelper.setWelcomePage(template.WebSettings.WelcomePage);
        return {};
    }
    private processCustomActions(template: Template) {
        if (template.CustomActions == null || template.CustomActions.WebCustomActions == null) return {};

        var promises = $.when(1);
        for (let customAction of template.CustomActions.WebCustomActions) {
            promises = promises.then(() => {
                return this.spHelper.addCustomAction(customAction);

            });
        }

        return promises;
    }

    getRoleDefinitionName(template: Template, groupName): string {
        if (template.Security == null || template.Security.SiteSecurityPermissions == null ||
            template.Security.SiteSecurityPermissions.RoleAssignments == null) return null;
        var roleAssignment = Utils.arrayFirst(template.Security.SiteSecurityPermissions.RoleAssignments,
            (r) => {
                return r.Principal.toLowerCase() == groupName.toLowerCase();
            });
        return roleAssignment == null ? null : roleAssignment.RoleDefinition;
    }
}
