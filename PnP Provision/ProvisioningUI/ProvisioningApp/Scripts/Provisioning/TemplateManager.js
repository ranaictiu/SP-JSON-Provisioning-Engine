define(["require", "exports", "./SharePointHelper"], function (require, exports, provisioningApp) {
    "use strict";
    var Utils = provisioningApp.Utils;
    //interface ProgressInterface {
    //    clearSteps: () => void;
    //    addStep: (name: string, title: string) => void;
    //    setInProgress: (name: string, message: string) => void;
    //    setSuccess: (name: string, message: string) => void;
    //    setFailed: (name: string, message?: string) => void;
    //}
    (function (OperationStatus) {
        OperationStatus[OperationStatus["unknown"] = 0] = "unknown";
        OperationStatus[OperationStatus["pending"] = 1] = "pending";
        OperationStatus[OperationStatus["inProgress"] = 2] = "inProgress";
        OperationStatus[OperationStatus["success"] = 3] = "success";
        OperationStatus[OperationStatus["failed"] = 4] = "failed";
    })(exports.OperationStatus || (exports.OperationStatus = {}));
    var OperationStatus = exports.OperationStatus;
    (function (ProgressSteps) {
        ProgressSteps[ProgressSteps["SiteCreation"] = 0] = "SiteCreation";
        ProgressSteps[ProgressSteps["Features"] = 1] = "Features";
        ProgressSteps[ProgressSteps["SecurityGroups"] = 2] = "SecurityGroups";
        ProgressSteps[ProgressSteps["Columns"] = 3] = "Columns";
        ProgressSteps[ProgressSteps["ContentTypes"] = 4] = "ContentTypes";
        ProgressSteps[ProgressSteps["Lists"] = 5] = "Lists";
        ProgressSteps[ProgressSteps["Pages"] = 6] = "Pages";
        ProgressSteps[ProgressSteps["Workflows"] = 7] = "Workflows";
        ProgressSteps[ProgressSteps["Navigation"] = 8] = "Navigation";
        ProgressSteps[ProgressSteps["CustomActions"] = 9] = "CustomActions";
        ProgressSteps[ProgressSteps["WebSettings"] = 10] = "WebSettings";
        ProgressSteps[ProgressSteps["Finalization"] = 11] = "Finalization";
    })(exports.ProgressSteps || (exports.ProgressSteps = {}));
    var ProgressSteps = exports.ProgressSteps;
    var TemplateManager = (function () {
        function TemplateManager() {
        }
        TemplateManager.prototype.initialize = function (ctx, progressHandler) {
            this.currentContext = ctx;
            this.spHelper = new provisioningApp.SpHelper(ctx);
            this.progressListener = progressHandler;
        };
        TemplateManager.prototype.applyTemplate = function (template) {
            var _this = this;
            var promises = $.when(1);
            promises = promises.then(function () {
                _this.currentWeb = _this.spHelper.getWeb();
                var executeContext = _this.spHelper.getExecuteContext();
                executeContext.load(_this.currentWeb);
                return _this.spHelper.executeQueryPromise();
            });
            promises = promises.then(function () {
                return _this.processFeatures(template);
            });
            promises = promises.then(function () {
                return _this.processSiteGroups(template);
            });
            promises = promises.then(function () {
                return _this.processSiteFields(template);
            });
            promises = promises.then(function () {
                return _this.processContentTypes(template);
            });
            promises = promises.then(function () {
                return _this.processPublishingPages(template);
            });
            promises = promises.then(function () {
                return _this.processLists(template);
            });
            promises = promises.then(function () {
                return _this.processWorkflows(template);
            });
            promises = promises.then(function () {
                return _this.processNavigation(template);
            });
            promises = promises.then(function () {
                return _this.processCustomActions(template);
            });
            promises = promises.then(function () {
                return _this.processWebSettings(template);
            });
            return promises;
        };
        TemplateManager.prototype.processFeatures = function (template) {
            var _this = this;
            var promises = $.when(1);
            var activatedWebFeatures;
            var featuresToActivate;
            promises = promises.then(function () {
                return _this.spHelper.getActivatedFeatures(true, function (fs) {
                    activatedWebFeatures = fs;
                });
            });
            promises = promises.then(function () {
                var pnpFeatures = template.Features != null && template.Features.WebFeatures != null ? template.Features.WebFeatures : null;
                featuresToActivate = Utils.arrayFilter(pnpFeatures, function (f) {
                    return Utils.arrayFirst(activatedWebFeatures, function (af) {
                        return f.DefinitionId.toLowerCase() == af.DefinitionId.toLowerCase();
                    }) == null;
                });
                return {};
            });
            promises = promises.then(function () {
                if (featuresToActivate == null || featuresToActivate.length == 0)
                    return {};
                _this.progressListener.progressUpdate(ProgressSteps.Features, 'Activating Features', OperationStatus.inProgress);
                return _this.spHelper.activateDeactivateWebFeatures(featuresToActivate);
            });
            promises = promises.then(function () {
                if (featuresToActivate != null && featuresToActivate.length > 0) {
                    _this.progressListener.progressUpdate(ProgressSteps.Features, 'Features Activated', OperationStatus.success);
                }
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processSiteGroups = function (template) {
            var _this = this;
            if (template.Security == null || template.Security.SiteGroups == null || template.Security.SiteGroups.length ==
                0)
                return {};
            var promises = $.when(1);
            var siteGroups;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.SecurityGroups, 'Creating Security Groups', OperationStatus.inProgress);
                return _this.spHelper.getAllSiteGroups(function (groups) {
                    siteGroups = groups;
                });
            });
            var _loop_1 = function(g) {
                promises = promises.then(function () {
                    var roleDefinitionName = _this.getRoleDefinitionName(template, g.Title);
                    var groupExists = Utils.arrayFirst(siteGroups, function (grp) {
                        return grp.get_title().toLowerCase() == g.Title.toLowerCase();
                    }) != null;
                    if (groupExists)
                        return {};
                    return _this.spHelper.createGroup(g, roleDefinitionName, function (groupCreated) {
                    });
                });
            };
            for (var _i = 0, _a = template.Security.SiteGroups; _i < _a.length; _i++) {
                var g = _a[_i];
                _loop_1(g);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.SecurityGroups, 'Security Groups Created', OperationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processSiteFields = function (template) {
            var _this = this;
            if (template.SiteFields == null || template.SiteFields.length == 0)
                return {};
            var promises = $.when(1);
            var availableFields;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Columns, 'Creating Site Fields', OperationStatus.inProgress);
                return _this.spHelper.getAvailableFields('Id,InternalName', function (flds) {
                    availableFields = flds;
                });
            });
            var _loop_2 = function(sf) {
                promises = promises.then(function () {
                    var fieldExistsAlready = Utils.arrayFirst(availableFields, function (f) {
                        return f.get_internalName() == sf.Name;
                    }) != null;
                    if (fieldExistsAlready) {
                        return $.Deferred().resolve();
                    }
                    ;
                    return _this.spHelper.createWebField(_this.currentWeb.get_serverRelativeUrl(), sf);
                });
            };
            for (var _i = 0, _a = template.SiteFields; _i < _a.length; _i++) {
                var sf = _a[_i];
                _loop_2(sf);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Columns, 'Site Fields Created', OperationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processContentTypes = function (template) {
            var _this = this;
            if (template.ContentTypes == null || template.ContentTypes.length == 0)
                return {};
            var promises = $.when(1);
            var availableContentTypes;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.ContentTypes, 'Creating ContentTypes', OperationStatus.inProgress);
                return _this.spHelper.getAvailableContentTypes('Id,Name', function (ctypes) {
                    availableContentTypes = ctypes;
                });
            });
            var _loop_3 = function(ct) {
                promises = promises.then(function () {
                    var ctExists = Utils.arrayFirst(availableContentTypes, function (cti) {
                        return ct.Name == cti.get_name();
                    }) != null;
                    if (ctExists) {
                        return $.Deferred().resolve();
                    }
                    return _this.spHelper.createWebContentType(ct);
                });
            };
            for (var _i = 0, _a = template.ContentTypes; _i < _a.length; _i++) {
                var ct = _a[_i];
                _loop_3(ct);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.ContentTypes, 'ContentTypes Created', OperationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processPublishingPages = function (template) {
            var _this = this;
            if (template.Pages == null || template.Pages.length == 0)
                return {};
            var promises = $.when(1);
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Pages, 'Creating Pages', OperationStatus.inProgress);
                return {};
            });
            promises = promises.then(function () {
                return _this.spHelper.provisionPublishingPages(template.Pages);
            });
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Pages, 'Pages Created', OperationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processLists = function (template) {
            var _this = this;
            if (template.Lists == null || template.Lists.length == 0)
                return {};
            var promises = $.when(1);
            var allLists;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Lists, 'Creating Lists', OperationStatus.inProgress);
                return {};
            });
            promises = promises.then(function () {
                return _this.spHelper.getAllLists(function (lsts) {
                    allLists = lsts;
                });
            });
            var _loop_4 = function(listInstance) {
                promises = promises.then(function () {
                    return _this.spHelper.createList(listInstance);
                });
                if (listInstance.EnableEnterpriseKeywords)
                    promises = promises.then(function () {
                        return _this.spHelper.addEnterpriseKeywordColumnsToList(listInstance.Title);
                    });
                promises = promises.then(function () {
                    return _this.spHelper.createViews(listInstance);
                });
                if (listInstance.DataRows) {
                    promises = promises.then(function () {
                        return _this.spHelper.populateList(listInstance.Title, listInstance.DataRows);
                    });
                }
                if (listInstance.Security && listInstance.Security.BreakRoleInheritance) {
                    promises = promises.then(function () {
                        return _this.spHelper.setupPermissionForList(listInstance.Title, listInstance.Security);
                    });
                }
            };
            for (var _i = 0, _a = template.Lists; _i < _a.length; _i++) {
                var listInstance = _a[_i];
                _loop_4(listInstance);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Lists, 'Lists Created', OperationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processWorkflows = function (template) {
            var _this = this;
            if (template.Workflows == null || template.Workflows.Subscriptions == null ||
                template.Workflows.Subscriptions.length == 0)
                return {};
            var promises = $.when(1);
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Workflows, 'Provisioning Workflows', OperationStatus.inProgress);
                return {};
            });
            var _loop_5 = function(wfs) {
                promises = promises.then(function () {
                    return _this.spHelper.addWorkflowSubscription(wfs);
                });
            };
            for (var _i = 0, _a = template.Workflows.Subscriptions; _i < _a.length; _i++) {
                var wfs = _a[_i];
                _loop_5(wfs);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate(ProgressSteps.Workflows, 'Workflows Provisioned', OperationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processNavigation = function (template) {
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
        };
        TemplateManager.prototype.processWebSettings = function (template) {
            if (template.WebSettings == null)
                return {};
            if (template.WebSettings.WelcomePage)
                return this.spHelper.setWelcomePage(template.WebSettings.WelcomePage);
            return {};
        };
        TemplateManager.prototype.processCustomActions = function (template) {
            var _this = this;
            if (template.CustomActions == null || template.CustomActions.WebCustomActions == null)
                return {};
            var promises = $.when(1);
            var _loop_6 = function(customAction) {
                promises = promises.then(function () {
                    var templateFileUrl = _spPageContextInfo.webServerRelativeUrl + customAction.Url;
                    return _this.spHelper.addCustomAction(_spPageContextInfo.webAbsoluteUrl, templateFileUrl);
                });
            };
            for (var _i = 0, _a = template.CustomActions.WebCustomActions; _i < _a.length; _i++) {
                var customAction = _a[_i];
                _loop_6(customAction);
            }
            return promises;
        };
        TemplateManager.prototype.getRoleDefinitionName = function (template, groupName) {
            if (template.Security == null || template.Security.SiteSecurityPermissions == null ||
                template.Security.SiteSecurityPermissions.RoleAssignments == null)
                return null;
            var roleAssignment = Utils.arrayFirst(template.Security.SiteSecurityPermissions.RoleAssignments, function (r) {
                return r.Principal.toLowerCase() == groupName.toLowerCase();
            });
            return roleAssignment == null ? null : roleAssignment.RoleDefinition;
        };
        return TemplateManager;
    }());
    exports.TemplateManager = TemplateManager;
});
//# sourceMappingURL=TemplateManager.js.map