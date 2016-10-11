define(["require", "exports", "./SharePointHelper"], function (require, exports, provisioningApp) {
    "use strict";
    //interface ProgressInterface {
    //    clearSteps: () => void;
    //    addStep: (name: string, title: string) => void;
    //    setInProgress: (name: string, message: string) => void;
    //    setSuccess: (name: string, message: string) => void;
    //    setFailed: (name: string, message?: string) => void;
    //}
    var operationStatus;
    (function (operationStatus) {
        operationStatus[operationStatus["unknown"] = 0] = "unknown";
        operationStatus[operationStatus["inProgress"] = 1] = "inProgress";
        operationStatus[operationStatus["success"] = 2] = "success";
        operationStatus[operationStatus["failed"] = 3] = "failed";
    })(operationStatus || (operationStatus = {}));
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
                var pnpFeatures = template.features != null && template.features.webFeatures != null ? template.features.webFeatures : null;
                featuresToActivate = ko.utils.arrayFilter(pnpFeatures, function (f) {
                    return ko.utils.arrayFirst(activatedWebFeatures, function (af) {
                        return f.definitionId.toLowerCase() == af.definitionId.toLowerCase();
                    }) == null;
                });
                return {};
            });
            promises = promises.then(function () {
                if (featuresToActivate == null || featuresToActivate.length == 0)
                    return {};
                _this.progressListener.progressUpdate('FeatureActivation', 'Activating Features', operationStatus.inProgress);
                return _this.spHelper.activateDeactivateWebFeatures(featuresToActivate);
            });
            promises = promises.then(function () {
                if (featuresToActivate != null && featuresToActivate.length > 0) {
                    _this.progressListener.progressUpdate('FeatureActivation', 'Features Activated', operationStatus.success);
                }
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processSiteGroups = function (template) {
            var _this = this;
            if (template.security == null || template.security.siteGroups == null || template.security.siteGroups.length ==
                0)
                return {};
            var promises = $.when(1);
            var siteGroups;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('SiteGroups', 'Creating Security Groups', operationStatus.inProgress);
                return _this.spHelper.getAllSiteGroups(function (groups) {
                    siteGroups = groups;
                });
            });
            var _loop_1 = function(g) {
                promises = promises.then(function () {
                    var roleDefinitionName = _this.getRoleDefinitionName(template, g.title);
                    var groupExists = ko.utils.arrayFirst(siteGroups, function (grp) {
                        return grp.get_title().toLowerCase() == g.title.toLowerCase();
                    }) != null;
                    if (groupExists)
                        return {};
                    return _this.spHelper.createGroup(g, roleDefinitionName, function (groupCreated) {
                    });
                });
            };
            for (var _i = 0, _a = template.security.siteGroups; _i < _a.length; _i++) {
                var g = _a[_i];
                _loop_1(g);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('SiteGroups', 'Security Groups Created', operationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processSiteFields = function (template) {
            var _this = this;
            if (template.siteFields == null || template.siteFields.length == 0)
                return {};
            var promises = $.when(1);
            var availableFields;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('FieldsCreation', 'Creating Site Fields', operationStatus.inProgress);
                return _this.spHelper.getAvailableFields('Id,InternalName', function (flds) {
                    availableFields = flds;
                });
            });
            var _loop_2 = function(sf) {
                promises = promises.then(function () {
                    var fieldExistsAlready = ko.utils.arrayFirst(availableFields, function (f) {
                        return f.get_internalName() == sf.name;
                    }) != null;
                    if (fieldExistsAlready) {
                        return $.Deferred().resolve();
                    }
                    ;
                    return _this.spHelper.createWebField(_this.currentWeb.get_serverRelativeUrl(), sf);
                });
            };
            for (var _i = 0, _a = template.siteFields; _i < _a.length; _i++) {
                var sf = _a[_i];
                _loop_2(sf);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('FieldsCreation', 'Site Fields Created', operationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processContentTypes = function (template) {
            var _this = this;
            if (template.contentTypes == null || template.contentTypes.length == 0)
                return {};
            var promises = $.when(1);
            var availableContentTypes;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('ContentTypesCreation', 'Creating ContentTypes', operationStatus.inProgress);
                return _this.spHelper.getAvailableContentTypes('Id,Name', function (ctypes) {
                    availableContentTypes = ctypes;
                });
            });
            var _loop_3 = function(ct) {
                promises = promises.then(function () {
                    var ctExists = ko.utils.arrayFirst(availableContentTypes, function (cti) {
                        return ct.name == cti.get_name();
                    }) != null;
                    if (ctExists) {
                        return $.Deferred().resolve();
                    }
                    return _this.spHelper.createWebContentType(ct);
                });
            };
            for (var _i = 0, _a = template.contentTypes; _i < _a.length; _i++) {
                var ct = _a[_i];
                _loop_3(ct);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('ContentTypesCreation', 'ContentTypes Created', operationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processPublishingPages = function (template) {
            var _this = this;
            if (template.pages == null || template.pages.length == 0)
                return {};
            var promises = $.when(1);
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('PagesCreation', 'Creating Pages', operationStatus.inProgress);
                return {};
            });
            promises = promises.then(function () {
                return _this.spHelper.provisionPublishingPages(template.pages);
            });
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('PagesCreation', 'Pages Created', operationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processLists = function (template) {
            var _this = this;
            if (template.lists == null || template.lists.length == 0)
                return {};
            var promises = $.when(1);
            var allLists;
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('ListsCreation', 'Creating Lists', operationStatus.inProgress);
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
                if (listInstance.enableEnterpriseKeywords)
                    promises = promises.then(function () {
                        return _this.spHelper.addEnterpriseKeywordColumnsToList(listInstance.title);
                    });
                promises = promises.then(function () {
                    return _this.spHelper.createViews(listInstance);
                });
                if (listInstance.dataRows) {
                    promises = promises.then(function () {
                        return _this.spHelper.populateList(listInstance.title, listInstance.dataRows);
                    });
                }
                if (listInstance.security && listInstance.security.breakRoleInheritance) {
                    promises = promises.then(function () {
                        return _this.spHelper.setupPermissionForList(listInstance.title, listInstance.security);
                    });
                }
            };
            for (var _i = 0, _a = template.lists; _i < _a.length; _i++) {
                var listInstance = _a[_i];
                _loop_4(listInstance);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('ListsCreation', 'Lists Created', operationStatus.success);
                return {};
            });
            return promises;
        };
        TemplateManager.prototype.processWorkflows = function (template) {
            var _this = this;
            if (template.workflows == null || template.workflows.subscriptions == null ||
                template.workflows.subscriptions.length == 0)
                return {};
            var promises = $.when(1);
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('WorkflowsCreation', 'Provisioning Workflows', operationStatus.inProgress);
                return {};
            });
            var _loop_5 = function(wfs) {
                promises = promises.then(function () {
                    return _this.spHelper.addWorkflowSubscription(wfs);
                });
            };
            for (var _i = 0, _a = template.workflows.subscriptions; _i < _a.length; _i++) {
                var wfs = _a[_i];
                _loop_5(wfs);
            }
            promises = promises.then(function () {
                _this.progressListener.progressUpdate('WorkflowsCreation', 'Workflows Provisioned', operationStatus.success);
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
            if (template.webSettings == null)
                return {};
            if (template.webSettings.welcomePage)
                return this.spHelper.setWelcomePage(template.webSettings.welcomePage);
            return {};
        };
        TemplateManager.prototype.processCustomActions = function (template) {
            var _this = this;
            if (template.customActions == null || template.customActions.webCustomActions == null)
                return {};
            var promises = $.when(1);
            var _loop_6 = function(customAction) {
                promises = promises.then(function () {
                    var templateFileUrl = _spPageContextInfo.webServerRelativeUrl + customAction.url;
                    return _this.spHelper.addCustomAction(_spPageContextInfo.webAbsoluteUrl, templateFileUrl);
                });
            };
            for (var _i = 0, _a = template.customActions.webCustomActions; _i < _a.length; _i++) {
                var customAction = _a[_i];
                _loop_6(customAction);
            }
            return promises;
        };
        TemplateManager.prototype.getRoleDefinitionName = function (template, groupName) {
            if (template.security == null || template.security.siteSecurityPermissions == null ||
                template.security.siteSecurityPermissions.roleAssignments == null)
                return null;
            var roleAssignment = ko.utils.arrayFirst(template.security.siteSecurityPermissions.roleAssignments, function (r) {
                return r.principal.toLowerCase() == groupName.toLowerCase();
            });
            return roleAssignment == null ? null : roleAssignment.roleDefinition;
        };
        return TemplateManager;
    }());
});
//# sourceMappingURL=TemplateManager.js.map