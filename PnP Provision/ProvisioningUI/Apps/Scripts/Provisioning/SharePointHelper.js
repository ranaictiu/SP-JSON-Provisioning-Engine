/// <reference path="../typings/jquery/jquery.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Constants = (function () {
        function Constants() {
        }
        Constants.folderContentTypeId = '0x012000';
        Constants.pageLayoutContentTypeId = '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811';
        return Constants;
    }());
    exports.Constants = Constants;
    var FeatureInfo = (function () {
        function FeatureInfo(id) {
            this.ID = id;
        }
        return FeatureInfo;
    }());
    exports.FeatureInfo = FeatureInfo;
    var TemplateFile = (function () {
        function TemplateFile() {
        }
        return TemplateFile;
    }());
    exports.TemplateFile = TemplateFile;
    var Template = (function () {
        function Template() {
        }
        return Template;
    }());
    exports.Template = Template;
    var CustomActionInfo = (function () {
        function CustomActionInfo() {
        }
        return CustomActionInfo;
    }());
    exports.CustomActionInfo = CustomActionInfo;
    var SiteSecurityInfo = (function () {
        function SiteSecurityInfo() {
        }
        return SiteSecurityInfo;
    }());
    exports.SiteSecurityInfo = SiteSecurityInfo;
    var SiteGroupInfo = (function () {
        function SiteGroupInfo() {
        }
        return SiteGroupInfo;
    }());
    exports.SiteGroupInfo = SiteGroupInfo;
    var ListInfo = (function () {
        function ListInfo(list) {
            this.Title = list.get_title();
            this.ID = list.get_id().toString();
            this.RootFolderUrl = list.get_rootFolder().get_serverRelativeUrl();
            this.ContentTypesEnabled = list.get_contentTypesEnabled();
            this.ParentWebUrl = list.get_parentWebUrl();
        }
        return ListInfo;
    }());
    exports.ListInfo = ListInfo;
    var ViewCreationInfo = (function () {
        function ViewCreationInfo() {
        }
        return ViewCreationInfo;
    }());
    exports.ViewCreationInfo = ViewCreationInfo;
    var ListCreationInfo = (function () {
        function ListCreationInfo() {
        }
        return ListCreationInfo;
    }());
    exports.ListCreationInfo = ListCreationInfo;
    var GroupCreationInfo = (function () {
        function GroupCreationInfo() {
        }
        return GroupCreationInfo;
    }());
    exports.GroupCreationInfo = GroupCreationInfo;
    var DependentLookupFieldInfo = (function () {
        function DependentLookupFieldInfo() {
        }
        return DependentLookupFieldInfo;
    }());
    exports.DependentLookupFieldInfo = DependentLookupFieldInfo;
    var FieldInfo = (function () {
        function FieldInfo() {
        }
        return FieldInfo;
    }());
    exports.FieldInfo = FieldInfo;
    var FieldRefInfo = (function () {
        function FieldRefInfo() {
        }
        return FieldRefInfo;
    }());
    exports.FieldRefInfo = FieldRefInfo;
    var ContentTypeInfo = (function () {
        function ContentTypeInfo() {
        }
        return ContentTypeInfo;
    }());
    exports.ContentTypeInfo = ContentTypeInfo;
    var ContentTypeNameId = (function () {
        function ContentTypeNameId() {
        }
        return ContentTypeNameId;
    }());
    exports.ContentTypeNameId = ContentTypeNameId;
    var DocumentSetTemplateInfo = (function (_super) {
        __extends(DocumentSetTemplateInfo, _super);
        function DocumentSetTemplateInfo() {
            _super.apply(this, arguments);
        }
        return DocumentSetTemplateInfo;
    }(ContentTypeInfo));
    exports.DocumentSetTemplateInfo = DocumentSetTemplateInfo;
    var ContentTypeBindingInfo = (function () {
        function ContentTypeBindingInfo() {
        }
        return ContentTypeBindingInfo;
    }());
    exports.ContentTypeBindingInfo = ContentTypeBindingInfo;
    var WFSubscriptionInfo = (function () {
        function WFSubscriptionInfo() {
        }
        return WFSubscriptionInfo;
    }());
    exports.WFSubscriptionInfo = WFSubscriptionInfo;
    var PublishingPageInfo = (function () {
        function PublishingPageInfo() {
        }
        return PublishingPageInfo;
    }());
    exports.PublishingPageInfo = PublishingPageInfo;
    var ObjectSecurityInfo = (function () {
        function ObjectSecurityInfo() {
        }
        return ObjectSecurityInfo;
    }());
    exports.ObjectSecurityInfo = ObjectSecurityInfo;
    var PermissionInfo = (function () {
        function PermissionInfo() {
        }
        return PermissionInfo;
    }());
    exports.PermissionInfo = PermissionInfo;
    var RoleAssignmentInfo = (function () {
        function RoleAssignmentInfo() {
        }
        return RoleAssignmentInfo;
    }());
    exports.RoleAssignmentInfo = RoleAssignmentInfo;
    var WebSettings = (function () {
        function WebSettings() {
        }
        return WebSettings;
    }());
    exports.WebSettings = WebSettings;
    var SiteCreationInfo = (function () {
        function SiteCreationInfo() {
        }
        return SiteCreationInfo;
    }());
    exports.SiteCreationInfo = SiteCreationInfo;
    if (!String.prototype.replaceAll) {
        //http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            search = search.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            return target.replace(new RegExp(search, 'g'), replacement);
        };
    }
    var Logger = (function () {
        function Logger() {
        }
        Logger.prototype.log = function (msg, isError) {
            if (isError === void 0) { isError = false; }
            if (isError)
                console.log('ERROR: ' + msg);
            else
                console.log(msg);
        };
        return Logger;
    }());
    var Utils = (function () {
        function Utils() {
        }
        Utils.getQueryStringParameter = function (paramToRetrieve) {
            paramToRetrieve = paramToRetrieve.toLowerCase();
            var urlParts = document.location.toString().toLowerCase().split("?");
            if (urlParts.length < 2)
                return null;
            var params = urlParts[1].split("&");
            for (var i = 0; i < params.length; i = i + 1) {
                var singleParam = params[i].split("=");
                if (singleParam[0] == paramToRetrieve)
                    return singleParam[1];
            }
            return '';
        };
        ;
        Utils.isAppContext = function () {
            return (_spPageContextInfo && _spPageContextInfo.webTemplate == '17');
        };
        Utils.loadWFScripts = function (callback) {
            ExecuteOrDelayUntilScriptLoaded(function () {
                ExecuteOrDelayUntilScriptLoaded(function () {
                    SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
                    SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", callback);
                }, "sp.js");
            }, "sp.runtime.js");
        };
        ;
        Utils.loadPublishingScripts = function (callback) {
            ExecuteOrDelayUntilScriptLoaded(function () {
                ExecuteOrDelayUntilScriptLoaded(function () {
                    SP.SOD.registerSod('sp.publishing.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.publishing.js'));
                    SP.SOD.executeFunc('sp.publishing.js', "SP.Publishing.PublishingWeb", callback);
                }, "sp.js");
            }, "sp.runtime.js");
        };
        Utils.loadRequestExecutor = function (callback) {
            ExecuteOrDelayUntilScriptLoaded(function () {
                if (SP.ProxyWebRequestExecutorFactory) {
                    callback();
                    return;
                }
                var hostWebUrl = decodeURIComponent(Utils.getQueryStringParameter('SPHostUrl'));
                var scriptbase = hostWebUrl + "/_layouts/15/";
                $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
                    callback();
                });
            }, "sp.js");
        };
        Utils.arrayFirst = function (array, predicate, predicateOwner) {
            if (predicateOwner === void 0) { predicateOwner = null; }
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i], i))
                    return array[i];
            return null;
        };
        Utils.arrayFilter = function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i], i))
                    result.push(array[i]);
            return result;
        };
        Utils.arrayMap = function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i], i));
            return result;
        };
        return Utils;
    }());
    exports.Utils = Utils;
    var UI = (function () {
        function UI() {
        }
        UI.showDialog = function (header, msg) {
            var _this = this;
            SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function () {
                if (_this.dialog) {
                    _this.closeDialog();
                }
                _this.dialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(header, msg, 150, 550);
            });
        };
        ;
        UI.closeDialog = function () {
            if (this.dialog) {
                this.dialog.close(SP.UI.DialogResult.invalid);
            }
        };
        ;
        UI.clearAllNotification = function () {
            SP.UI.Status.removeAllStatus(true);
        };
        ;
        UI.showNotification = function (title, msg, isError) {
            SP.UI.Status.removeAllStatus(true);
            var notificationId = SP.UI.Status.addStatus(title, msg);
            if (isError)
                SP.UI.Status.setStatusPriColor(notificationId, 'red');
            else
                SP.UI.Status.setStatusPriColor(notificationId, 'green');
            setTimeout(function () { SP.UI.Status.removeStatus(notificationId); }, 10000);
        };
        ;
        UI.showStickyNotification = function (title, msg, isError) {
            SP.UI.Status.removeAllStatus(true);
            var notificationId = SP.UI.Status.addStatus(title, msg);
            if (isError)
                SP.UI.Status.setStatusPriColor(notificationId, 'red');
            else
                SP.UI.Status.setStatusPriColor(notificationId, 'green');
        };
        ;
        UI.showShortNotification = function (msg, isError) {
            SP.UI.Status.removeAllStatus(true);
            var notificationId = SP.UI.Status.addStatus(msg);
            if (isError)
                SP.UI.Status.setStatusPriColor(notificationId, 'red');
            else
                SP.UI.Status.setStatusPriColor(notificationId, 'green');
            setTimeout(function () { SP.UI.Status.removeStatus(notificationId); }, 2000);
        };
        ;
        return UI;
    }());
    exports.UI = UI;
    var SpHelper = (function () {
        function SpHelper(ctx, logger) {
            if (logger === void 0) { logger = new Logger(); }
            this.webAvailableContentTypes = null;
            this._context = ctx;
            this._logger = logger;
        }
        SpHelper.isCurrentContextWebApp = function () {
            return _spPageContextInfo && _spPageContextInfo.webTemplate == '17';
        };
        SpHelper.prototype.getHelperContextFromUrl = function (fullUrl) {
            if (SpHelper.isCurrentContextWebApp() && !fullUrl.startsWith('/')) {
                var context = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
                var factory = new SP.ProxyWebRequestExecutorFactory(_spPageContextInfo.webAbsoluteUrl);
                context.set_webRequestExecutorFactory(factory);
                var appContext = new SP.AppContextSite(context, fullUrl);
                return new SpHelper(appContext);
            }
            else {
                return new SpHelper(new SP.ClientContext(fullUrl));
            }
        };
        SpHelper.prototype.getExecuteContext = function () {
            if (this._context instanceof SP.ClientContext) {
                return this._context;
            }
            return this._context.get_context();
        };
        SpHelper.prototype.getWeb = function () {
            if (this._context instanceof SP.ClientContext) {
                return this._context.get_web();
            }
            return this._context.get_web();
        };
        SpHelper.prototype.getSiteCollection = function () {
            if (this._context instanceof SP.ClientContext) {
                return this._context.get_site();
            }
            return this._context.get_site();
        };
        SpHelper.prototype.getEnumerationList = function (source) {
            var list = new Array();
            var enumerator = source.getEnumerator();
            while (enumerator.moveNext()) {
                list.push(enumerator.get_current());
            }
            return list;
        };
        SpHelper.prototype.executeQueryPromise = function () {
            var deferred = $.Deferred();
            var executeContext = this.getExecuteContext();
            var logger = this._logger;
            executeContext.executeQueryAsync(function (a, b) {
                deferred.resolve(arguments);
            }, function (a, b) {
                deferred.reject(arguments);
                logger.log(b.get_message(), true);
            });
            return deferred.promise();
        };
        SpHelper.prototype.addExistingFieldToListContentType = function (listTitle, contentTypeId, fieldInternalName) {
            var web = this._context.get_web();
            var list = web.get_lists().getByTitle(listTitle);
            var contentType = list.get_contentTypes().getById(contentTypeId);
            var taxKeywordField = list.get_fields().getByInternalNameOrTitle(fieldInternalName);
            var fieldLink = new SP.FieldLinkCreationInformation();
            fieldLink.set_field(taxKeywordField);
            contentType.get_fieldLinks().add(fieldLink);
            contentType.update(true);
            return this.executeQueryPromise();
        };
        ;
        SpHelper.prototype.getWebContentTypeByName = function (contentTypeName, properties, callback) {
            var _this = this;
            var contentType = null;
            var d = $.Deferred();
            var web = this.getWeb();
            if (this.webAvailableContentTypes) {
                contentType = Utils.arrayFirst(this.webAvailableContentTypes, function (c) { return (c.get_name() == contentTypeName); });
                if (contentType) {
                    callback(contentType);
                    d.resolve();
                    return d;
                }
            }
            //content type not found in cached list, so load fresh
            var availableContentTypes = web.get_availableContentTypes();
            var executeContext = this.getExecuteContext();
            if (properties != null && !properties.startsWith('Include(')) {
                properties = "Include(" + properties + ")";
            }
            if (properties)
                executeContext.load(availableContentTypes, properties);
            else
                executeContext.load(availableContentTypes);
            executeContext.executeQueryAsync(function () {
                _this.webAvailableContentTypes = _this.getEnumerationList(availableContentTypes);
                contentType = Utils.arrayFirst(_this.webAvailableContentTypes, function (c) {
                    return c.get_name() == contentTypeName;
                });
                callback(contentType);
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.activateWebFeature = function (featureId, scope) {
            var _this = this;
            var d = $.Deferred();
            var web = this.getWeb();
            var features = web.get_features();
            features.add(new SP.Guid(featureId), false, SP.FeatureDefinitionScope[scope]);
            var executeContext = this.getExecuteContext();
            executeContext.executeQueryAsync(function () {
                d.resolve();
            }, function () {
                _this._logger.log('Failed to activated web feature ' + featureId, true);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getActivatedFeatures = function (isWebLevel, callback) {
            var deferred = $.Deferred();
            var web = this.getWeb();
            var site = this.getSiteCollection();
            var self = this;
            var executeContext = this.getExecuteContext();
            var frs = isWebLevel ? web.get_features() : site.get_features();
            executeContext.load(frs, 'Include(DefinitionId)');
            executeContext.executeQueryAsync(function () {
                var featuresInfo = new Array();
                var features = self.getEnumerationList(frs);
                for (var _i = 0, features_1 = features; _i < features_1.length; _i++) {
                    var l = features_1[_i];
                    featuresInfo.push(new FeatureInfo(l.get_definitionId().toString()));
                }
                callback(featuresInfo);
                deferred.resolve(arguments);
            }, function () {
                this._logger.log('Failed to get all activated features', true);
                callback(null);
                deferred.reject(arguments);
            });
            return deferred;
        };
        ;
        SpHelper.prototype.createGroup = function (pnpGroup, roleDefinitionName, callback) {
            var d = $.Deferred();
            this._logger.log('creating group ' + pnpGroup.Title, false);
            var groupCreationInfo = new SP.GroupCreationInformation();
            groupCreationInfo.set_title(pnpGroup.Title);
            groupCreationInfo.set_description(pnpGroup.Description);
            var web = this.getWeb();
            var group = web.get_siteGroups().add(groupCreationInfo);
            group.set_onlyAllowMembersViewMembership(pnpGroup.OnlyAllowMembersViewMembership);
            group.set_allowMembersEditMembership(pnpGroup.AllowMembersEditMembership);
            group.set_allowRequestToJoinLeave(pnpGroup.AllowRequestToJoinLeave);
            group.set_autoAcceptRequestToJoinLeave(pnpGroup.AutoAcceptRequestToJoinLeave);
            group.update();
            var executeContext = this.getExecuteContext();
            var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(executeContext);
            if (roleDefinitionName) {
                var roleDefinition = web.get_roleDefinitions().getByName(roleDefinitionName);
                collRoleDefinitionBinding.add(roleDefinition);
                var collRollAssignment = web.get_roleAssignments();
                collRollAssignment.add(group, collRoleDefinitionBinding);
            }
            executeContext.load(group);
            executeContext.executeQueryAsync(function () {
                callback(group);
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.createSite = function (siteInfo, callback) {
            var d = $.Deferred();
            var webCreationInfo = new SP.WebCreationInformation();
            webCreationInfo.set_title(siteInfo.Title);
            webCreationInfo.set_url(siteInfo.Name);
            webCreationInfo.set_description(siteInfo.Description);
            webCreationInfo.set_language(siteInfo.Language);
            webCreationInfo.set_useSamePermissionsAsParentSite(siteInfo.UseSamePermissionsAsParentSite);
            webCreationInfo.set_webTemplate(siteInfo.WebTemplateId);
            var newWeb = this.getWeb().get_webs().add(webCreationInfo);
            var executeContext = this.getExecuteContext();
            executeContext.load(newWeb, 'ServerRelativeUrl', 'Created');
            executeContext.executeQueryAsync(function () {
                callback(newWeb);
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.addUserToGroup = function (groupName, userKey) {
            var web = this.getWeb();
            var group = web.get_siteGroups().getByName(groupName);
            group.get_users().addUser(web.ensureUser(userKey));
            group.update();
            return this.executeQueryPromise();
        };
        SpHelper.prototype.getAllSiteGroups = function (callback) {
            var _this = this;
            var d = $.Deferred();
            var site = this.getSiteCollection();
            var siteGroups = site.get_rootWeb().get_siteGroups();
            var executeContext = this.getExecuteContext();
            executeContext.load(siteGroups);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(siteGroups));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getListFields = function (listTitle, callback) {
            var _this = this;
            var d = $.Deferred();
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            var listFields = list.get_fields();
            var executeContext = this.getExecuteContext();
            executeContext.load(listFields);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(listFields));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getAllLists = function (callback) {
            var _this = this;
            var deferred = $.Deferred();
            var web = this.getWeb();
            var lists = web.get_lists();
            var executeContext = this.getExecuteContext();
            executeContext.load(lists, "Include(Title,Id,RootFolder,ContentTypesEnabled,ParentWebUrl)");
            executeContext.executeQueryAsync(function () {
                var listInfo = [];
                var listArray = _this.getEnumerationList(lists);
                for (var _i = 0, listArray_1 = listArray; _i < listArray_1.length; _i++) {
                    var l = listArray_1[_i];
                    listInfo.push(new ListInfo(l));
                }
                callback(listInfo);
                deferred.resolve();
            }, function () {
                _this._logger.log('Failed to get all lists', true);
                callback(null);
                deferred.reject();
            });
            return deferred;
        };
        SpHelper.prototype.getListInfo = function (listTitle, callback) {
            var d = $.Deferred();
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            var executeContext = this.getExecuteContext();
            executeContext.load(list, 'Title', 'Id', 'RootFolder', 'ContentTypesEnabled', 'ContentTypes', 'ParentWebUrl');
            executeContext.executeQueryAsync(function () {
                callback(new ListInfo(list));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        ;
        SpHelper.prototype.activateDeactivateWebFeatures = function (featuresToActivate) {
            var _this = this;
            var deferred = $.Deferred();
            if (featuresToActivate == null || featuresToActivate.length == 0) {
                deferred.resolve();
                return deferred;
            }
            this._logger.log('activating/deactivating features');
            var promises = $.when(1); //empty promise
            var _loop_1 = function(f) {
                promises = promises.then(function () { return _this.activateWebFeature(f.ID, f.Scope ? f.Scope : 'farm'); });
            };
            for (var _i = 0, featuresToActivate_1 = featuresToActivate; _i < featuresToActivate_1.length; _i++) {
                var f = featuresToActivate_1[_i];
                _loop_1(f);
            }
            promises.done(function () {
                _this._logger.log('Activated all features');
                deferred.resolve();
            }).fail(function () {
                _this._logger.log('Failed to activated all features', true);
                deferred.reject();
            });
            return deferred;
        };
        ;
        SpHelper.prototype.createList = function (listCreationInfo) {
            var _this = this;
            var promises = $.when(1);
            var title = listCreationInfo.Title;
            var description = listCreationInfo.Description;
            var url = listCreationInfo.Url;
            var template = listCreationInfo.TemplateType;
            var onQuickLaunch = listCreationInfo.OnQuickLaunch;
            var list;
            var web = this.getWeb();
            //let allLists: ListInfo[];
            var allLists = [];
            promises = promises.then(function () {
                return _this.getAllLists(function (lsts) { allLists = lsts; });
            });
            promises = promises.then(function () {
                var existingList = Utils.arrayFirst(allLists, function (l) { return (l.Title.toLowerCase() == listCreationInfo.Title.toLowerCase()); });
                if (existingList) {
                    list = existingList;
                    return {};
                }
                _this._logger.log('creating list ' + title);
                var spListCreationInfo = new SP.ListCreationInformation();
                spListCreationInfo.set_title(title);
                spListCreationInfo.set_description(description);
                spListCreationInfo.set_url(url);
                spListCreationInfo.set_templateType(template);
                list = web.get_lists().add(spListCreationInfo);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                _this._logger.log("updating list " + title + " ");
                var updateListRequired = false;
                list = web.get_lists().getByTitle(title);
                if (onQuickLaunch != null) {
                    list.set_onQuickLaunch(onQuickLaunch ? SP.QuickLaunchOptions.on : SP.QuickLaunchOptions.off);
                }
                if (listCreationInfo.EnableVersioning != null) {
                    list.set_enableVersioning(listCreationInfo.EnableVersioning);
                    if (listCreationInfo.EnableVersioning)
                        list.set_majorVersionLimit(listCreationInfo.MaxVersionLimit);
                }
                if (listCreationInfo.EnableMinorVersions != null) {
                    list.set_enableMinorVersions(listCreationInfo.EnableMinorVersions);
                    if (listCreationInfo.EnableMinorVersions) {
                        list.set_draftVersionVisibility(SP.DraftVisibilityType.author);
                        list.set_majorWithMinorVersionsLimit(listCreationInfo.MinorVersionLimit);
                    }
                }
                if (listCreationInfo.EnableModeration != null) {
                    list.set_enableModeration(listCreationInfo.EnableModeration);
                }
                if (listCreationInfo.ForceCheckOut != null) {
                    list.set_forceCheckout(listCreationInfo.ForceCheckOut);
                }
                if (listCreationInfo.EnableAttachments != null) {
                    list.set_enableAttachments(listCreationInfo.EnableAttachments);
                }
                if (listCreationInfo.Hidden != null) {
                    list.set_hidden(listCreationInfo.Hidden);
                }
                if (listCreationInfo.EnableFolderCreation != null) {
                    list.set_enableFolderCreation(listCreationInfo.EnableFolderCreation);
                }
                updateListRequired = listCreationInfo.OnQuickLaunch != null || listCreationInfo.EnableVersioning != null ||
                    listCreationInfo.EnableMinorVersions != null || listCreationInfo.EnableModeration != null || listCreationInfo.ForceCheckOut != null
                    || listCreationInfo.EnableAttachments != null || listCreationInfo.Hidden != null || listCreationInfo.EnableFolderCreation != null;
                ;
                if (updateListRequired) {
                    list.update();
                    return _this.executeQueryPromise();
                }
                return {};
            });
            promises = promises.then(function () {
                return _this.processListContentTypes(listCreationInfo);
            });
            promises = promises.then(function () {
                return _this.processListFields(listCreationInfo);
            });
            return promises;
        };
        SpHelper.prototype.processListContentTypes = function (listInstance) {
            var _this = this;
            var listTitle = listInstance.Title;
            var removeExistingContentTypes = listInstance.RemoveExistingContentTypes;
            var pnpContentTypeBidnings = listInstance.ContentTypeBindings;
            if (pnpContentTypeBidnings == null || pnpContentTypeBidnings.length == 0)
                return {};
            var list;
            var promises = $.when(1);
            promises = promises.then(function () {
                return _this.getListInfo(listTitle, function (l) { list = l; });
            });
            promises = promises.then(function () {
                if (!list.ContentTypesEnabled) {
                    return _this.enableListContentType(list.ID);
                }
                return $.Deferred().resolve();
            });
            var _loop_2 = function(ctb) {
                promises = promises.then(function () {
                    //var context = new SP.ClientContext(currentWeb.get_serverRelativeUrl());
                    return _this.addContentTypeToListInternal(list.ID, ctb);
                });
            };
            for (var _i = 0, pnpContentTypeBidnings_1 = pnpContentTypeBidnings; _i < pnpContentTypeBidnings_1.length; _i++) {
                var ctb = pnpContentTypeBidnings_1[_i];
                _loop_2(ctb);
            }
            if (removeExistingContentTypes) {
                promises = promises.then(function () {
                    var defaultContentType = pnpContentTypeBidnings.length == 1 ? pnpContentTypeBidnings[0] : Utils.arrayFirst(pnpContentTypeBidnings, function (c) { return c.Default != null && c.Default; });
                    return _this.removeAllContentTypesBut(listTitle, pnpContentTypeBidnings, defaultContentType);
                });
            }
            return promises;
        };
        SpHelper.prototype.processListFields = function (listInstance) {
            var _this = this;
            var listTitle = listInstance.Title;
            var pnpFields = listInstance.FieldRefs;
            var promises = $.when(1);
            if (pnpFields == null || pnpFields.length == 0)
                return promises;
            var listFields;
            promises = promises.then(function () {
                return _this.getListFields(listTitle, function (flds) {
                    listFields = flds;
                });
            });
            var _loop_3 = function(pnpf) {
                promises = promises.then(function () {
                    var listField = Utils.arrayFirst(listFields, function (f) {
                        return f.get_id().equals(new SP.Guid(pnpf.ID));
                    });
                    if (listField == null)
                        return _this.addFieldToList(listTitle, pnpf.ID, pnpf.DisplayName);
                    else if (listField.get_title().toLowerCase() != pnpf.DisplayName.toLowerCase()) {
                        //field exist in the list but need to chagne display name
                        return _this.updateListField(listTitle, pnpf.ID, pnpf.DisplayName);
                    }
                    else if (pnpf.Choices) {
                        return _this.updateListFieldChoices(listTitle, pnpf.ID, pnpf.Choices);
                    }
                    else
                        return {};
                });
            };
            for (var _i = 0, pnpFields_1 = pnpFields; _i < pnpFields_1.length; _i++) {
                var pnpf = pnpFields_1[_i];
                _loop_3(pnpf);
            }
            return promises;
        };
        SpHelper.prototype.createViews = function (pnpListInstance) {
            var _this = this;
            if (pnpListInstance.Views == null || pnpListInstance.Views.length == 0)
                return {};
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            var existingViews = null;
            var listInstance;
            var promises = $.when(1);
            promises = promises.then(function () {
                listInstance = web.get_lists().getByTitle(pnpListInstance.Title);
                existingViews = listInstance.get_views();
                executeContext.load(existingViews);
                executeContext.load(listInstance);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                if (!pnpListInstance.RemoveExistingViews)
                    return {};
                existingViews = _this.getEnumerationList(existingViews);
                for (var i = 0; i < existingViews.length; i++) {
                    existingViews[i].deleteObject();
                }
                return _this.executeQueryPromise();
            });
            var _loop_4 = function(pnpView) {
                promises = promises.then(function () {
                    var listViewCreationInfo = new SP.ViewCreationInformation();
                    listViewCreationInfo.set_title(pnpView.DisplayName);
                    listViewCreationInfo.set_rowLimit(pnpView.RowLimit ? pnpView.RowLimit : 30);
                    listViewCreationInfo.set_viewTypeKind(SP.ViewType.html); //for now set html.
                    listViewCreationInfo.set_setAsDefaultView(pnpView.DefaultView);
                    listViewCreationInfo.set_paged(pnpView.Paged);
                    listViewCreationInfo.set_query(pnpView.Query);
                    listViewCreationInfo.set_viewFields(pnpView.ViewFields);
                    listInstance.get_views().add(listViewCreationInfo);
                    return _this.executeQueryPromise();
                });
            };
            for (var _i = 0, _a = pnpListInstance.Views; _i < _a.length; _i++) {
                var pnpView = _a[_i];
                _loop_4(pnpView);
            }
            return promises;
        };
        SpHelper.prototype.getListContentTypes = function (listIdOrTitle, propertiesToLoad, callback) {
            var _this = this;
            var d = $.Deferred();
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var list = StringUtil.IsGuid(listIdOrTitle) ? web.get_lists().getById(listIdOrTitle) : web.get_lists().getByTitle(listIdOrTitle);
            var conteTypes = list.get_contentTypes();
            if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
                propertiesToLoad = "Include(" + propertiesToLoad + ")";
            }
            if (propertiesToLoad)
                executeContext.load(conteTypes, propertiesToLoad);
            else
                executeContext.load(conteTypes);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(conteTypes));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.addContentTypeToListInternal = function (listId, contentTypeBinding) {
            var _this = this;
            var contentTypeName = contentTypeBinding.Name;
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var promises = $.when(1);
            var webContentType = null;
            var listContentType = null;
            var listContentTypeFields;
            var listContentTypes;
            var list = null;
            promises = promises.then(function () {
                return _this.getWebContentTypeByName(contentTypeName, 'Id,Name', function (ct) {
                    webContentType = ct;
                });
            });
            promises = promises.then(function () {
                return _this.getListContentTypes(listId, 'Id,Name', function (cts) {
                    listContentTypes = cts;
                });
            });
            promises = promises.then(function () {
                listContentType = Utils.arrayFirst(listContentTypes, function (lct) {
                    return lct.get_name() == contentTypeName;
                });
                list = web.get_lists().getById(listId);
                if (listContentType == null) {
                    var lContentTypes = list.get_contentTypes();
                    webContentType = web.get_availableContentTypes().getById(webContentType.get_id());
                    listContentType = lContentTypes.addExistingContentType(webContentType);
                }
                listContentTypeFields = listContentType.get_fields();
                executeContext.load(listContentType);
                executeContext.load(listContentTypeFields);
                executeContext.load(list);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                if (contentTypeBinding.Hidden) {
                    var ct = list.get_contentTypes().getById(listContentType.get_id());
                    ct.set_hidden(true);
                    ct.update();
                    return _this.executeQueryPromise();
                }
                return {};
            });
            promises = promises.then(function () {
                var iPromies = $.when(1);
                var d = $.Deferred();
                var listContentTypeFieldCollection = _this.getEnumerationList(listContentTypeFields);
                //Rich text field in document library gets converted to plain text. This code snippet will make sure the field is converted back to rich text 
                //after adding the content type. Ref - https://social.msdn.microsoft.com/Forums/office/en-US/95a05ae0-5d3b-432f-81bf-1f4a03e9910b/rich-text-column-in-document-library?forum=sharepointcustomizationlegacy
                if (list.get_baseTemplate() == SP.ListTemplateType.documentLibrary) {
                    //if the content type inherits from document, then check if there's any rich text field that needs conversion from plain text to rich text
                    var noteFields = Utils.arrayFilter(listContentTypeFieldCollection, function (f) {
                        return f.get_typeAsString() == 'Note' && executeContext.castTo(f, SP.FieldMultiLineText).get_richText() == false;
                    });
                    var _loop_5 = function(nf) {
                        iPromies = iPromies.then(function () {
                            webField = web.get_availableFields().getById(nf.get_id());
                            executeContext.load(webField);
                            return _this.executeQueryPromise();
                        });
                        iPromies = iPromies.then(function () {
                            var richTextField = executeContext.castTo(webField, SP.FieldMultiLineText);
                            if (richTextField.get_richText()) {
                                var lf = executeContext.castTo(nf, SP.FieldMultiLineText);
                                lf.set_richText(true);
                                lf.update();
                                return _this.executeQueryPromise();
                            }
                            return {};
                        });
                    };
                    var webField;
                    for (var _i = 0, noteFields_1 = noteFields; _i < noteFields_1.length; _i++) {
                        var nf = noteFields_1[_i];
                        _loop_5(nf);
                    }
                }
                iPromies.then(function () { d.resolve(); }, function () { d.reject(); });
                return d;
            });
            return promises;
        };
        ;
        SpHelper.prototype.enableListContentType = function (listId) {
            var web = this.getWeb();
            var list = web.get_lists().getById(listId);
            list.set_contentTypesEnabled(true);
            list.update();
            return this.executeQueryPromise();
        };
        ;
        SpHelper.prototype.createWebField = function (webServerRelativeUrl, pnpField) {
            var _this = this;
            var promises = $.when(1);
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            var lists;
            var idPart = pnpField.ID == null ? "" : "ID='" + pnpField.ID + "'";
            var requiredPart = pnpField.Required ? " Required='TRUE' " : " Required='FALSE' ";
            var jsLinkPart = pnpField.JSLink ? " JSLink='" + pnpField.JSLink + "' " : "";
            var xml = "<Field " + idPart + "  Name='" + pnpField.Name + "' DisplayName='" + pnpField.DisplayName + "' Type='" + pnpField.Type + "' " + requiredPart + "  " + jsLinkPart + "  Group='" + pnpField.Group + "' />";
            var fieldCreated;
            promises = promises.then(function () {
                executeContext.load(web, 'ServerRelativeUrl');
                fieldCreated = web.get_fields().addFieldAsXml(xml, true, SP.AddFieldOptions.addFieldCheckDisplayName);
                executeContext.load(fieldCreated);
                return _this.executeQueryPromise();
            });
            if (pnpField.Type == 'Lookup' || pnpField.Type == 'LookupMulti') {
                promises = promises.then(function () {
                    return _this.getAllLists(function (lsts) {
                        lists = lsts;
                    });
                });
                promises = promises.then(function () {
                    var listUrl = (webServerRelativeUrl + '/' + pnpField.List).toLowerCase();
                    var list = Utils.arrayFirst(lists, function (l) {
                        return l.RootFolderUrl.toLowerCase() == listUrl;
                    });
                    var fieldLookup = executeContext.castTo(fieldCreated, SP.FieldLookup);
                    fieldLookup.set_lookupList(list.ID);
                    fieldLookup.set_lookupField(pnpField.ShowField);
                    fieldLookup.set_allowMultipleValues(pnpField.Type == 'LookupMulti');
                    fieldLookup.update();
                    return _this.executeQueryPromise();
                });
                if (pnpField.DependentLookupFields) {
                    promises = promises.then(function () {
                        var fieldLookup = executeContext.castTo(fieldCreated, SP.FieldLookup);
                        for (var i = 0; i < pnpField.DependentLookupFields.length; i++) {
                            web.get_fields().addDependentLookup(pnpField.DependentLookupFields[i].DisplayName, fieldLookup, pnpField.DependentLookupFields[i].ShowField);
                        }
                        return _this.executeQueryPromise();
                    });
                }
            }
            return promises;
        };
        SpHelper.prototype.createWebContentType = function (pnpContentType) {
            var _this = this;
            var promises = $.when(1);
            var webContentTypes;
            var ctParentId = pnpContentType.ParentId;
            var ctName = pnpContentType.Name;
            var ctGroup = pnpContentType.Group;
            var ctDescription = pnpContentType.Description;
            var fieldRefs = pnpContentType.FieldRefs;
            var docSetTemplate = pnpContentType.DocumentSetTemplate;
            var executeContext = this.getExecuteContext();
            var contentTypeCreated;
            var fieldLinks;
            var fieldLinkCollection;
            promises = promises.then(function () {
                var web = _this.getWeb();
                webContentTypes = web.get_contentTypes();
                var parentContentType = _this.getSiteCollection().get_rootWeb().get_availableContentTypes().getById(ctParentId); //considering parent content type is always from root web
                var ctCreationInformation = new SP.ContentTypeCreationInformation();
                ctCreationInformation.set_name(ctName);
                ctCreationInformation.set_group(ctGroup);
                ctCreationInformation.set_description(ctDescription);
                ctCreationInformation.set_parentContentType(parentContentType);
                contentTypeCreated = webContentTypes.add(ctCreationInformation);
                fieldLinkCollection = contentTypeCreated.get_fieldLinks();
                executeContext.load(contentTypeCreated);
                executeContext.load(fieldLinkCollection, 'Include(Id,Name,Hidden)');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                fieldLinks = _this.getEnumerationList(fieldLinkCollection);
                return {};
            });
            if (fieldRefs != null && fieldRefs.length > 0) {
                var _loop_6 = function(fr) {
                    promises = promises.then(function () {
                        contentTypeCreated = _this.getWeb().get_contentTypes().getById(contentTypeCreated.get_id().toString());
                        var fieldRefId = new SP.Guid(fr.ID);
                        var fieldExists = Utils.arrayFirst(fieldLinks, function (fl) {
                            return fl.get_id().equals(fieldRefId);
                        }) != null;
                        var fieldLink;
                        if (fieldExists) {
                            fieldLink = contentTypeCreated.get_fieldLinks().getById(fieldRefId);
                        }
                        else {
                            var fieldLinkCreationInfo = new SP.FieldLinkCreationInformation();
                            var field = _this.getWeb().get_availableFields().getByInternalNameOrTitle(fr.Name);
                            fieldLinkCreationInfo.set_field(field);
                            fieldLink = contentTypeCreated.get_fieldLinks().add(fieldLinkCreationInfo);
                        }
                        if (fr.Hidden != null) {
                            fieldLink.set_hidden(fr.Hidden);
                        }
                        if (fr.Required != null)
                            fieldLink.set_required(fr.Required);
                        contentTypeCreated.update(true);
                        executeContext.load(contentTypeCreated);
                        return _this.executeQueryPromise();
                    });
                };
                for (var _i = 0, fieldRefs_1 = fieldRefs; _i < fieldRefs_1.length; _i++) {
                    var fr = fieldRefs_1[_i];
                    _loop_6(fr);
                }
            }
            promises = promises.then(function () {
                var reorderedFields = Utils.arrayMap(fieldRefs, function (f, i) {
                    return f.Name;
                });
                var fieldLinks = contentTypeCreated.get_fieldLinks();
                fieldLinks.reorder(reorderedFields);
                contentTypeCreated.update(true);
                executeContext.load(contentTypeCreated);
                return _this.executeQueryPromise();
            });
            if (docSetTemplate) {
                promises = promises.then(function () {
                    return _this.provisionDocumentSet(docSetTemplate, contentTypeCreated);
                });
            }
            return promises;
        };
        ;
        SpHelper.prototype.provisionDocumentSet = function (pnpDocSetTemplate, contentType) {
            var _this = this;
            var promises = $.when(1);
            var dsTemplate;
            var welcomeFieldsResponse, allowedContentTypesResponse, sharedFieldsResponse;
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var webAvailableContentCollection;
            var webAvailableContentTypes;
            promises = promises.then(function () {
                dsTemplate = SP.DocumentSet.DocumentSetTemplate.getDocumentSetTemplate(executeContext, contentType);
                welcomeFieldsResponse = dsTemplate.get_welcomePageFields();
                allowedContentTypesResponse = dsTemplate.get_allowedContentTypes();
                sharedFieldsResponse = dsTemplate.get_sharedFields();
                webAvailableContentCollection = web.get_availableContentTypes();
                executeContext.load(dsTemplate);
                executeContext.load(welcomeFieldsResponse);
                executeContext.load(allowedContentTypesResponse);
                executeContext.load(sharedFieldsResponse);
                executeContext.load(webAvailableContentCollection, 'Include(Id,Name)');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                var dsAllowedContentTypes = _this.getEnumerationList(allowedContentTypesResponse);
                webAvailableContentTypes = _this.getEnumerationList(webAvailableContentCollection);
                //add contnet types
                for (var i = 0; i < pnpDocSetTemplate.AllowedContentTypes.length; i++) {
                    var pnpAllowedCT = pnpDocSetTemplate.AllowedContentTypes[i];
                    var ctDefinition = Utils.arrayFirst(webAvailableContentTypes, function (ct) {
                        return ct.get_name() == pnpAllowedCT.Name;
                    });
                    var ctExistsInDocumentSet = Utils.arrayFirst(dsAllowedContentTypes, function (act) {
                        return act.get_stringValue().toLowerCase() == ctDefinition.get_id().get_stringValue().toLowerCase();
                    }) != null;
                    if (!ctExistsInDocumentSet) {
                        dsTemplate.get_allowedContentTypes().add(ctDefinition.get_id());
                    }
                }
                //remove content types not needed
                for (var a = 0; a < dsAllowedContentTypes.length; a++) {
                    var dsAllowedContentType = dsAllowedContentTypes[a];
                    var ctDefinition = Utils.arrayFirst(webAvailableContentTypes, function (ct) {
                        return ct.get_id().get_stringValue().toLowerCase() == dsAllowedContentType.get_stringValue().toLowerCase();
                    });
                    var removeCT = Utils.arrayFirst(pnpDocSetTemplate.AllowedContentTypes, function (ct) {
                        return ct.Name == ctDefinition.get_name();
                    }) == null;
                    if (removeCT) {
                        dsTemplate.get_allowedContentTypes().remove(ctDefinition.get_id());
                    }
                }
                //add shared fields
                var dsSharedFields = _this.getEnumerationList(sharedFieldsResponse);
                for (var j = 0; j < pnpDocSetTemplate.SharedFields.length; j++) {
                    var sField = pnpDocSetTemplate.SharedFields[j];
                    var field = web.get_availableFields().getByInternalNameOrTitle(sField.Name);
                    var fieldExists = Utils.arrayFirst(dsSharedFields, function (sf) {
                        return sf.get_internalName() == sField.Name;
                    }) != null;
                    if (!fieldExists)
                        dsTemplate.get_sharedFields().add(field);
                }
                var dsWelcomePageFields = _this.getEnumerationList(welcomeFieldsResponse);
                for (var k = 0; k < pnpDocSetTemplate.WelcomePageFields.length; k++) {
                    var wField = pnpDocSetTemplate.WelcomePageFields[k];
                    var wfExists = Utils.arrayFirst(dsWelcomePageFields, function (f) {
                        return f.get_internalName() == wField.Name;
                    }) != null;
                    if (!wfExists) {
                        var field = web.get_availableFields().getByInternalNameOrTitle(wField.Name);
                        dsTemplate.get_welcomePageFields().add(field);
                    }
                }
                dsTemplate.update(true);
                return _this.executeQueryPromise();
            });
            return promises;
        };
        SpHelper.prototype.removeAllContentTypesBut = function (listTitle, pnpContentTypeBindings, pnpDeafultContentType) {
            var _this = this;
            var promises = $.when(1);
            var listContentTypesObj = null;
            var rootFolder = null;
            var executeContext = this.getExecuteContext();
            //get list content types
            promises = promises.then(function () {
                var web = _this.getWeb();
                var list = web.get_lists().getByTitle(listTitle);
                rootFolder = list.get_rootFolder();
                listContentTypesObj = list.get_contentTypes();
                executeContext.load(listContentTypesObj);
                executeContext.load(rootFolder);
                return _this.executeQueryPromise();
            });
            //set default content type
            promises = promises.then(function () {
                var web = _this.getWeb();
                var listContentTypes = _this.getEnumerationList(listContentTypesObj);
                var reorderedListContentTypes = [];
                var defaultContentType = Utils.arrayFirst(listContentTypes, function (ct) {
                    return ct.get_name() == pnpDeafultContentType.Name;
                });
                reorderedListContentTypes.push(defaultContentType.get_id());
                var nonDefaultContentTypes = Utils.arrayFilter(listContentTypes, function (ct) {
                    return ct.get_name() != pnpDeafultContentType.Name && !ct.get_stringId().startsWith(Constants.folderContentTypeId); //ignore folder
                });
                for (var _i = 0, nonDefaultContentTypes_1 = nonDefaultContentTypes; _i < nonDefaultContentTypes_1.length; _i++) {
                    var ct = nonDefaultContentTypes_1[_i];
                    reorderedListContentTypes.push(ct.get_id());
                }
                rootFolder.set_uniqueContentTypeOrder(reorderedListContentTypes);
                rootFolder.update();
                var list = web.get_lists().getByTitle(listTitle);
                rootFolder = list.get_rootFolder();
                listContentTypesObj = list.get_contentTypes();
                executeContext.load(listContentTypesObj);
                executeContext.load(rootFolder);
                return _this.executeQueryPromise();
            });
            //delete other content types
            promises = promises.then(function () {
                var listContentTypes = _this.getEnumerationList(listContentTypesObj);
                var contentTypesToDelete = Utils.arrayFilter(listContentTypes, function (lct) {
                    return Utils.arrayFirst(pnpContentTypeBindings, function (ctb) {
                        return ctb.Name == lct.get_name();
                    }) == null;
                });
                contentTypesToDelete = Utils.arrayFilter(contentTypesToDelete, function (ctb) {
                    return !ctb.get_stringId().startsWith('0x012000');
                });
                for (var _i = 0, contentTypesToDelete_1 = contentTypesToDelete; _i < contentTypesToDelete_1.length; _i++) {
                    var c = contentTypesToDelete_1[_i];
                    c.deleteObject();
                }
                return _this.executeQueryPromise();
            });
            return promises;
        };
        ;
        SpHelper.prototype.addEnterpriseKeywordColumnsToList = function (listTitle) {
            var _this = this;
            var promises = $.when(1);
            var executeContext = this.getExecuteContext();
            promises = promises.then(function () {
                var web = _this.getWeb();
                var list = web.get_lists().getByTitle(listTitle);
                var taxKeywordField = _this.getSiteCollection().get_rootWeb().get_fields().getByInternalNameOrTitle('TaxKeyword');
                list.get_fields().add(taxKeywordField);
                return _this.executeQueryPromise();
            });
            var contentTypes = null;
            var contentTypeList = [];
            promises = promises.then(function () {
                var web = _this.getWeb();
                var list = web.get_lists().getByTitle(listTitle);
                //var taxKeywordField = list.get_fields().getByInternalNameOrTitle('TaxKeyword');
                contentTypes = list.get_contentTypes();
                contentTypeList = executeContext.loadQuery(contentTypes, 'Include(StringId,Id,Name,Fields)');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                var d = $.Deferred();
                var iPromises = $.when(1);
                var _loop_7 = function(ct) {
                    if (ct.get_stringId().startsWith(Constants.folderContentTypeId))
                        return "continue";
                    fields = _this.getEnumerationList(ct.get_fields());
                    fieldExistsInContentType = Utils.arrayFirst(fields, function (f) {
                        return f.get_internalName() == 'TaxKeyword';
                    }) != null;
                    if (!fieldExistsInContentType) {
                        iPromises = iPromises.then(function () {
                            return _this.addExistingFieldToListContentType(listTitle, ct.get_id(), 'TaxKeyword');
                        });
                    }
                };
                var fields, fieldExistsInContentType;
                for (var _i = 0, contentTypeList_1 = contentTypeList; _i < contentTypeList_1.length; _i++) {
                    var ct = contentTypeList_1[_i];
                    var state_7 = _loop_7(ct);
                    if (state_7 === "continue") continue;
                }
                iPromises.then(function () {
                    d.resolve();
                }, function () {
                    d.reject();
                });
                return d;
            });
            return promises;
        };
        SpHelper.prototype.updateListField = function (listTitle, fId, fDisplayName) {
            var web = this.getWeb();
            var listField = web.get_lists().getByTitle(listTitle).get_fields().getById(new SP.Guid(fId));
            listField.set_title(fDisplayName);
            listField.update();
            return this.executeQueryPromise();
        };
        SpHelper.prototype.updateListFieldChoices = function (listTitle, fId, choices) {
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var listField = web.get_lists().getByTitle(listTitle).get_fields().getById(new SP.Guid(fId));
            var choiceField = executeContext.castTo(listField, SP.FieldChoice);
            choiceField.set_choices(choices);
            choiceField.updateAndPushChanges();
            return this.executeQueryPromise();
        };
        SpHelper.prototype.addFieldToList = function (listTitle, fId, fDisplayName) {
            var _this = this;
            var promises = $.when(1);
            var webField;
            var executeContext = this.getExecuteContext();
            promises = promises.then(function () {
                var web = _this.getWeb();
                var list = web.get_lists().getByTitle(listTitle);
                webField = web.get_availableFields().getById(new SP.Guid(fId));
                executeContext.load(webField);
                list.get_fields().add(webField);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                if (webField.get_title() == fDisplayName)
                    return {}; //display name same so return empty promise;
                return _this.updateListField(listTitle, fId, fDisplayName);
            });
            return promises;
        };
        SpHelper.prototype.getAvailableFields = function (propertiesToLoad, callback) {
            var _this = this;
            var d = $.Deferred();
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var fields = web.get_availableFields();
            if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
                propertiesToLoad = "Include(" + propertiesToLoad + ")";
            }
            if (propertiesToLoad)
                executeContext.load(fields, propertiesToLoad);
            else
                executeContext.load(fields);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(fields));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getAvailableContentTypes = function (propertiesToLoad, callback) {
            var _this = this;
            var d = $.Deferred();
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var availableContentTypes = web.get_availableContentTypes();
            if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
                propertiesToLoad = "Include(" + propertiesToLoad + ")";
            }
            if (propertiesToLoad)
                executeContext.load(availableContentTypes, propertiesToLoad);
            else
                executeContext.load(availableContentTypes);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(availableContentTypes));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getCurrentUser = function (callback) {
            var d = $.Deferred();
            var user = this.getSiteCollection().get_rootWeb().get_currentUser();
            var executeContext = this.getExecuteContext();
            executeContext.load(user);
            executeContext.executeQueryAsync(function () {
                callback(user);
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getAllwebs = function (parentWeb, properties, callback) {
            var _this = this;
            var d = $.Deferred();
            //var site = this.getSite();
            //var allWebs = site.get_rootWeb().get_webs();
            var allWebs = parentWeb.get_webs();
            var executeContext = this.getExecuteContext();
            if (!properties.startsWith('Include(')) {
                properties = "Include(" + properties + ")";
            }
            executeContext.load(allWebs, properties);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(allWebs));
                d.resolve();
            }, function () {
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getFilesInfo = function (docLibTitle, callback) {
            var _this = this;
            var d = $.Deferred();
            var web = this.getWeb();
            var docLib = web.get_lists().getByTitle(docLibTitle);
            var files = docLib.get_rootFolder().get_files();
            var executeContext = this.getExecuteContext();
            executeContext.load(files);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(files));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getFileContent = function (webUrl, fileServerRelativeUrl, callback) {
            var url = webUrl + "/_api/web/getfilebyserverrelativeurl('" + fileServerRelativeUrl + "')/$value";
            var options = {
                url: url,
                method: 'GET',
                'cache': false,
                headers: {
                    "Content-Type": "application/json; odata=verbose",
                    "Accept": "application/json; odata=verbose"
                },
                dataType: 'text',
                success: callback,
                error: function () {
                    callback(null);
                }
            };
            return $.ajax(options);
        };
        SpHelper.prototype.getFileContentAsBinary = function (siteUrl, fileServerRelativeUrl, callback) {
            var d = $.Deferred();
            var url;
            if (Utils.isAppContext() && !siteUrl.toLowerCase().startsWith(_spPageContextInfo.webAbsoluteUrl.toLowerCase())) {
                url = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + fileServerRelativeUrl + "')/$value?@target='" + siteUrl + "'";
            }
            else
                url = siteUrl + "/_api/web/GetFileByServerRelativeUrl('" + fileServerRelativeUrl + "')/$value";
            var re = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
            re.executeAsync({
                url: url,
                method: "GET",
                headers: {
                    "accept": "application/json; odata=verbose"
                },
                binaryStringResponseBody: true,
                success: function (c) {
                    callback(c.body);
                    d.resolve();
                },
                error: function () {
                    callback(null);
                    d.reject();
                }
            });
            return d;
        };
        SpHelper.prototype.getListItems = function (listTitle, maxCount, fieldsToLoad, callback) {
            var _this = this;
            var d = $.Deferred();
            var list = this.getWeb().get_lists().getByTitle(listTitle);
            var camlQuery = new SP.CamlQuery();
            if (maxCount == 0) {
                maxCount = 10000; //sorry we support max 10,000;
            }
            camlQuery.set_viewXml("<View Scope='RecursiveAll'><Query></Query><RowLimit>" + maxCount + "</RowLimit></View>");
            var listItems = list.getItems(camlQuery);
            var executeContext = this.getExecuteContext();
            if (fieldsToLoad != null && fieldsToLoad != '')
                executeContext.load(listItems, "Include(" + fieldsToLoad + ")");
            else
                executeContext.load(listItems);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(listItems));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getListItemsbyIds = function (listIdOrTitle, itemIds, fieldsToLoad, callback) {
            var _this = this;
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            var d = $.Deferred();
            var valuesQueryPart = "";
            for (var i = 0; i < itemIds.length; i++) {
                valuesQueryPart += "<Value Type='Counter'>" + itemIds[i] + "</Value>";
            }
            var query = "<View Scope='RecursiveAll'><Query><Where><In><FieldRef Name='ID' /><Values>" + valuesQueryPart + "</Values></In></Where></Query></View>";
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(query);
            var list = StringUtil.IsGuid(listIdOrTitle) ? web.get_lists().getById(listIdOrTitle) : web.get_lists().getByTitle(listIdOrTitle);
            var listItems = list.getItems(camlQuery);
            if (fieldsToLoad != null && fieldsToLoad != '')
                executeContext.load(listItems, "Include(" + fieldsToLoad + ")");
            else
                executeContext.load(listItems);
            executeContext.executeQueryAsync(function () {
                callback(_this.getEnumerationList(listItems));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getCustomActionXmlNode = function (xml) {
            var actionxml = $.parseXML(xml);
            var ca = $(actionxml).find('CustomAction');
            return ca;
        };
        SpHelper.prototype.addCustomAction = function (webUrl, fileServerRelativeUrl) {
            var _this = this;
            var executeContext = this.getExecuteContext();
            var promises = $.when(1);
            var ribbonXml = null;
            var customActions = null;
            var customActionNodes;
            promises = promises.then(function () {
                return _this.getFileContent(webUrl, fileServerRelativeUrl, function (xml) {
                    ribbonXml = xml;
                    customActionNodes = _this.getCustomActionXmlNode(ribbonXml);
                });
            });
            promises = promises.then(function () {
                var web = _this.getWeb();
                customActions = web.get_userCustomActions();
                executeContext.load(customActions);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                var actions = _this.getEnumerationList(customActions);
                for (var i = 0; i < customActionNodes.length; i++) {
                    var customActionName = $(customActionNodes[i]).attr('Id');
                    var existingAction = Utils.arrayFirst(actions, function (a) {
                        return a.get_name() == customActionName;
                    });
                    if (existingAction) {
                        existingAction.deleteObject();
                    }
                }
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                var d = $.Deferred();
                var iPromies = $.when(1);
                var _loop_8 = function(customActionNode) {
                    iPromies = iPromies.then(function () {
                        var customActionName = $(customActionNode).attr('Id');
                        var xmlContent = null, url = null, registrationType = null;
                        var cmdExtension = $(customActionNode).find('CommandUIExtension');
                        var urlAction = $(customActionNode).find('UrlAction');
                        var location = $(customActionNode).attr('Location');
                        var registrationId = $(customActionNode).attr('RegistrationId');
                        var groupId = $(customActionNode).attr('GroupId');
                        var rights = $(customActionNode).attr('Rights');
                        if (urlAction && urlAction.length > 0) {
                            url = $(customActionNode).find('UrlAction').attr('Url');
                        }
                        else {
                            if (window['XMLSerializer']) {
                                var serializer = new window.XMLSerializer;
                                xmlContent = serializer.serializeToString($(cmdExtension).get(0));
                            }
                            else {
                                xmlContent = $(customActionNode).find('CommandUIExtension')[0].outerHTML;
                            }
                        }
                        if ($(customActionNode).attr('RegistrationType') != null) {
                            switch ($(customActionNode).attr('RegistrationType')) {
                                case 'List':
                                    registrationType = SP.UserCustomActionRegistrationType.list;
                                    break;
                                case 'ContentType':
                                    registrationType = SP.UserCustomActionRegistrationType.contentType;
                                    break;
                                case 'FileType':
                                    registrationType = SP.UserCustomActionRegistrationType.fileType;
                                    break;
                                case 'ProgId':
                                    registrationType = SP.UserCustomActionRegistrationType.progId;
                                    break;
                            }
                        }
                        var sequence = parseInt($(customActionNode).attr('Sequence'));
                        var web = _this.getWeb();
                        var customAction = web.get_userCustomActions().add();
                        customAction.set_name(customActionName);
                        customAction.set_title($(customActionNode).attr('Title'));
                        customAction.set_location(location);
                        if (groupId)
                            customAction.set_group(groupId);
                        if (rights) {
                            var basePermission = new SP.BasePermissions();
                            for (var v in SP.PermissionKind) {
                                if (SP.PermissionKind.hasOwnProperty(v) && v.toLowerCase() == rights.toLowerCase()) {
                                    var d = SP.PermissionKind[v];
                                    basePermission.set(SP.PermissionKind[d]);
                                    break;
                                }
                            }
                            customAction.set_rights(basePermission);
                        }
                        if (xmlContent)
                            customAction.set_commandUIExtension(xmlContent); // CommandUIExtension xml
                        if (registrationId)
                            customAction.set_registrationId(registrationId);
                        if (registrationType)
                            customAction.set_registrationType(registrationType);
                        if (url)
                            customAction.set_url(url);
                        customAction.set_sequence(sequence);
                        customAction.update();
                        return _this.executeQueryPromise();
                    });
                };
                for (var _i = 0, customActionNodes_1 = customActionNodes; _i < customActionNodes_1.length; _i++) {
                    var customActionNode = customActionNodes_1[_i];
                    _loop_8(customActionNode);
                }
                iPromies.done(function () {
                    d.resolve();
                })
                    .fail(function () {
                    d.reject();
                });
                return d;
            });
            return promises;
        };
        SpHelper.prototype.addWorkflowSubscription = function (pnpWFSubscription) {
            var _this = this;
            var promises = $.when(1);
            var allLists;
            var historyList, taskList;
            var historyListId, taskListId, targetListId;
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            promises = promises.then(function () {
                return _this.getAllLists(function (lsts) {
                    allLists = lsts;
                });
            });
            promises = promises.then(function () {
                historyList = Utils.arrayFirst(allLists, function (l) {
                    return l.Title.toLowerCase() == pnpWFSubscription.HistoryListTitle.toLowerCase();
                });
                taskList = Utils.arrayFirst(allLists, function (l) {
                    return l.Title.toLowerCase() == pnpWFSubscription.TaskListTitle.toLowerCase();
                });
                var targetList = pnpWFSubscription.ListTitle == null ? null : Utils.arrayFirst(allLists, function (l) {
                    return l.Title.toLowerCase() == pnpWFSubscription.ListTitle.toLowerCase();
                });
                if (targetList) {
                    //targetListId = targetList.get_id ? targetList.get_id().toString() : targetList.id;
                    targetListId = targetList.ID;
                }
                return {};
            });
            promises = promises.then(function () {
                var listCreated = false;
                if (historyList == null) {
                    var historyListCreationInformation = new SP.ListCreationInformation();
                    historyListCreationInformation.set_templateType(SP.ListTemplateType.workflowHistory);
                    historyListCreationInformation.set_title(pnpWFSubscription.HistoryListTitle);
                    historyList = web.get_lists().add(historyListCreationInformation);
                    executeContext.load(historyList);
                    listCreated = true;
                }
                if (taskList == null) {
                    var taskListCreationInformation = new SP.ListCreationInformation();
                    taskListCreationInformation.set_templateType(SP.ListTemplateType.tasks);
                    taskListCreationInformation.set_title(pnpWFSubscription.TaskListTitle);
                    taskList = web.get_lists().add(taskListCreationInformation);
                    executeContext.load(taskList);
                    listCreated = true;
                }
                if (listCreated) {
                    return _this.executeQueryPromise();
                }
                else
                    return {};
            });
            promises = promises.then(function () {
                taskListId = taskList.get_id ? taskList.get_id().toString() : taskList.id;
                historyListId = historyList.get_id ? historyList.get_id().toString() : historyList.id;
                return _this.publishWorkflowSubscription(pnpWFSubscription, taskListId, historyListId, targetListId);
            });
            return promises;
        };
        SpHelper.prototype.publishWorkflowSubscription = function (pnpWFSubscription, taskListId, historyListId, targetListId) {
            var _this = this;
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            var wfSubscriptions;
            var wfSubscriptionCollection;
            var wfServiceManager, wfSubscriptionService;
            var promises = $.when(1);
            var subscriptionExists = false;
            promises = promises.then(function () {
                var d = $.Deferred();
                Utils.loadWFScripts(function () {
                    wfServiceManager = new SP.WorkflowServices.WorkflowServicesManager(executeContext, web);
                    wfSubscriptionService = wfServiceManager.getWorkflowSubscriptionService();
                    d.resolve();
                });
                return d;
            });
            promises = promises.then(function () {
                if (targetListId == null) {
                    wfSubscriptionCollection = wfSubscriptionService.enumerateSubscriptionsByDefinition(pnpWFSubscription.WFDefinitionId);
                    executeContext.load(wfSubscriptionCollection);
                    return _this.executeQueryPromise();
                }
                return {};
            });
            promises = promises.then(function () {
                if (targetListId == null) {
                    wfSubscriptions = _this.getEnumerationList(wfSubscriptionCollection);
                    subscriptionExists = Utils.arrayFirst(wfSubscriptions, function (s) {
                        return s.get_name() == pnpWFSubscription.Name;
                    }) != null;
                }
                return {};
            });
            promises = promises.then(function () {
                if (subscriptionExists) {
                    _this._logger.log("workflow subscription " + pnpWFSubscription.Name + " exists.");
                    return {};
                }
                var wfSubscription = new SP.WorkflowServices.WorkflowSubscription(executeContext);
                wfSubscription.set_definitionId(new SP.Guid(pnpWFSubscription.WFDefinitionId));
                wfSubscription.set_name(pnpWFSubscription.Name);
                if (pnpWFSubscription.Enabled != null)
                    wfSubscription.set_enabled(pnpWFSubscription.Enabled);
                var eventTypes = [];
                if (pnpWFSubscription.WorkflowStartEvent != null && pnpWFSubscription.WorkflowStartEvent) {
                    eventTypes.push('WorkflowStart');
                }
                if (pnpWFSubscription.ItemAddedEvent != null && pnpWFSubscription.ItemAddedEvent) {
                    eventTypes.push('ItemAdded');
                }
                if (pnpWFSubscription.ItemUpdatedEvent != null && pnpWFSubscription.ItemUpdatedEvent) {
                    eventTypes.push('ItemUpdated');
                }
                wfSubscription.set_eventTypes(eventTypes);
                wfSubscription.setProperty("HistoryListId", historyListId);
                wfSubscription.setProperty("TaskListId", taskListId);
                if (targetListId)
                    wfSubscriptionService.publishSubscriptionForList(wfSubscription, targetListId);
                else {
                    wfSubscription.set_eventSourceId(web.get_id().toString());
                    wfSubscriptionService.publishSubscription(wfSubscription);
                }
                return _this.executeQueryPromise();
            });
            return promises;
        };
        SpHelper.prototype.getNavSource = function (pnpType) {
            if (pnpType == 'Inherit')
                return SP.Publishing.Navigation.StandardNavigationSource.inheritFromParentWeb;
            else if (pnpType == 'Structural')
                return SP.Publishing.Navigation.StandardNavigationSource.portalProvider;
            else if (pnpType == 'Managed')
                return SP.Publishing.Navigation.StandardNavigationSource.taxonomyProvider;
            return SP.Publishing.Navigation.StandardNavigationSource.unknown;
        };
        SpHelper.prototype.getNavigationNodeUrl = function (url) {
            var executeContext = this.getExecuteContext();
            if (url == null || url == '')
                return '';
            if (url == '/')
                return executeContext.get_url();
            if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://') || url.startsWith('/'))
                return url;
            return executeContext.get_url() + '/' + url;
        };
        SpHelper.prototype.provisionNavigation = function (pnpNavigation) {
            var _this = this;
            var d = $.Deferred();
            Utils.loadPublishingScripts(function () {
                _this.provisionNavigationInternal(pnpNavigation).done(function () {
                    d.resolve();
                }).fail(function () {
                    d.reject();
                });
            });
            return d;
        };
        SpHelper.prototype.provisionNavigationInternal = function (pnpNavigation) {
            var _this = this;
            var promises = $.when(1);
            var pnpGlobalNavigation = pnpNavigation.GlobalNavigation;
            var pnpCurrentNavigation = pnpNavigation.CurrentNavigation;
            var quickLaunches;
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            promises = promises.then(function () {
                var webNavSettings = new SP.Publishing.Navigation.WebNavigationSettings(executeContext, web);
                webNavSettings.set_addNewPagesToNavigation(false); //don't add new pages in navigation by default
                var currentNavigation = webNavSettings.get_currentNavigation();
                var globalNavigation = webNavSettings.get_globalNavigation();
                var currentNavSource = _this.getNavSource(pnpCurrentNavigation.NavigationType);
                var globalNavSource = _this.getNavSource(pnpGlobalNavigation.NavigationType);
                currentNavigation.set_source(currentNavSource);
                globalNavigation.set_source(globalNavSource);
                webNavSettings.update(null);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                quickLaunches = web.get_navigation().get_quickLaunch();
                executeContext.load(quickLaunches);
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                if (pnpCurrentNavigation.StructuralNavigation == null || pnpCurrentNavigation.StructuralNavigation.NavigationNode == null)
                    return {};
                if (pnpCurrentNavigation.StructuralNavigation && pnpCurrentNavigation.StructuralNavigation.RemoveExistingNodes == true) {
                    var c = quickLaunches.get_count();
                    for (var i = 0; i < c; i++) {
                        quickLaunches.get_item(0).deleteObject();
                    }
                }
                var pnpNavigationNodes = pnpCurrentNavigation.StructuralNavigation.NavigationNode;
                _this.addNavNodeRecursive(pnpNavigationNodes, quickLaunches, null);
                //for (var j = 0; j < pnpNavigationNodes.length; j++) {
                //    var currentPnpNode = pnpNavigationNodes[j];
                //    var nv = new SP.NavigationNodeCreationInformation();
                //    nv.set_isExternal(currentPnpNode.IsExternal == null ? false : currentPnpNode.IsExternal);
                //    nv.set_title(currentPnpNode.Title);
                //    nv.set_url(getNavigationNodeUrl(executeContext, currentPnpNode.Url));
                //    nv.set_asLastNode(true);
                //    var newNode = quickLaunches.add(nv);
                //    addNavNodeRecursive(executeContext, currentPnpNode.NavigationNode, newNode);
                //}
                return _this.executeQueryPromise();
            });
            return promises;
        };
        SpHelper.prototype.addNavNodeRecursive = function (pnpNodes, quickLaunches, parentNode) {
            if (pnpNodes == null)
                return;
            for (var i = 0; i < pnpNodes.length; i++) {
                var currentPnpNode = pnpNodes[i];
                var nv = new SP.NavigationNodeCreationInformation();
                nv.set_isExternal(currentPnpNode.IsExternal == null ? false : currentPnpNode.IsExternal);
                nv.set_title(currentPnpNode.Title);
                var url = this.getNavigationNodeUrl(currentPnpNode.Url);
                nv.set_url(url);
                nv.set_asLastNode(true);
                if (parentNode == null) {
                    var newNode = quickLaunches.add(nv);
                    this.addNavNodeRecursive(currentPnpNode.NavigationNode, quickLaunches, newNode);
                }
                else
                    parentNode.get_children().add(nv);
            }
        };
        SpHelper.prototype.provisionPublishingPages = function (pnpPages) {
            var _this = this;
            var d = $.Deferred();
            Utils.loadPublishingScripts(function () {
                _this.provisionPublishingPagesInternal(pnpPages).done(function () {
                    d.resolve();
                }).fail(function () {
                    d.reject();
                });
            });
            return d;
        };
        SpHelper.prototype.provisionPublishingPagesInternal = function (pnpPages) {
            var _this = this;
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            var promises = $.when(1);
            var pageLayouts;
            var pageLayoutCollection;
            var publishingPages;
            promises = promises.then(function () {
                var masterPageGallery = _this.getSiteCollection().get_rootWeb().get_lists().getByTitle('Master Page Gallery');
                var camlQuery = new SP.CamlQuery();
                var query = "<View><Query><Where><BeginsWith><FieldRef Name='ContentTypeId' /><Value Type='ContentTypeId'>" + Constants.pageLayoutContentTypeId + "</Value></BeginsWith></Where></Query><ViewFields><FieldRef Name='Title' /></ViewFields></View>";
                camlQuery.set_viewXml(query);
                pageLayoutCollection = masterPageGallery.getItems(camlQuery);
                executeContext.load(pageLayoutCollection);
                executeContext.load(web, 'Title', 'ServerRelativeUrl');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                pageLayouts = _this.getEnumerationList(pageLayoutCollection);
                return _this.getListItems('Pages', 100, 'FileLeafRef', function (pgs) {
                    publishingPages = pgs;
                });
            });
            var webServerRelativeUrl = web.get_serverRelativeUrl();
            var _loop_9 = function(pnpPage) {
                promises = promises.then(function () {
                    var pageServerRelativeUrl = webServerRelativeUrl + '/' + pnpPage.Url;
                    pageExists = Utils.arrayFirst(publishingPages, function (pp) {
                        return pp.get_item('FileLeafRef').toLowerCase() == pageServerRelativeUrl.toLowerCase();
                    }) != null;
                    return {};
                });
                promises = promises.then(function () {
                    if (pageExists)
                        return {};
                    var publishingWeb = SP.Publishing.PublishingWeb.getPublishingWeb(executeContext, web);
                    var pubPageInfo = new SP.Publishing.PublishingPageInformation();
                    pubPageInfo.set_name(pnpPage.Url);
                    var pageLayout = Utils.arrayFirst(pageLayouts, function (pl) {
                        return pl.get_item('Title') != null && pl.get_item('Title').toLowerCase() == pnpPage.Layout.toLowerCase();
                    });
                    pubPageInfo.set_pageLayoutListItem(pageLayout);
                    newPage = publishingWeb.addPublishingPage(pubPageInfo);
                    executeContext.load(newPage);
                    return _this.executeQueryPromise();
                });
                promises = promises.then(function () {
                    if (pageExists)
                        return {};
                    var pageListItem = newPage.get_listItem();
                    pageListItem.set_item("Title", pnpPage.Title);
                    if (pnpPage.SEOTitle) {
                        pageListItem.set_item('SeoBrowserTitle', pnpPage.SEOTitle);
                    }
                    pageListItem.update();
                    pageListItem.get_file().checkIn();
                    pageListItem.get_file().publish("Publishing after creation");
                    return _this.executeQueryPromise();
                });
                promises = promises.then(function () {
                    if (!pageExists && pnpPage.Security != null) {
                        var d = $.Deferred();
                        _this.applySecurity(newPage.get_listItem(), pnpPage.Security).then(function () {
                            d.resolve();
                        }, function () {
                            d.reject();
                        });
                        return d;
                    }
                    return {};
                });
            };
            var newPage, pageExists;
            for (var _i = 0, pnpPages_1 = pnpPages; _i < pnpPages_1.length; _i++) {
                var pnpPage = pnpPages_1[_i];
                _loop_9(pnpPage);
            }
            return promises;
        };
        SpHelper.prototype.applySecurity = function (securableObject, pnpSecurity) {
            var _this = this;
            var pnpPermission = pnpSecurity.BreakRoleInheritance;
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            var roleAssignments;
            var siteGroups;
            var roleAssignmentCollection;
            var siteGroupCollection;
            var promises = $.when(1);
            promises = promises.then(function () {
                securableObject.breakRoleInheritance(pnpPermission.CopyRoleAssignments, pnpPermission.ClearSubscopes);
                executeContext.load(web, 'Title');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                roleAssignmentCollection = securableObject.get_roleAssignments();
                executeContext.load(roleAssignmentCollection, 'Include(Member,RoleDefinitionBindings.Include(Name))');
                siteGroupCollection = web.get_siteGroups();
                executeContext.load(siteGroupCollection, 'Include(LoginName)');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                roleAssignments = _this.getEnumerationList(roleAssignmentCollection);
                siteGroups = _this.getEnumerationList(siteGroupCollection);
                return {};
            });
            var _loop_10 = function(pnpRoleAssignment) {
                promises = promises.then(function () {
                    var roleDefinitionName = pnpRoleAssignment.RoleDefinition;
                    var roleDefinition = web.get_roleDefinitions().getByName(roleDefinitionName);
                    //check role in current object
                    var existingRole = Utils.arrayFirst(roleAssignments, function (ra) {
                        return ra.get_member().get_title().toLowerCase() == pnpRoleAssignment.Principal.toLowerCase();
                    });
                    if (existingRole == null) {
                        var newRole = Utils.arrayFirst(siteGroups, function (sg) {
                            return sg.get_loginName().toLowerCase() == pnpRoleAssignment.Principal.toLowerCase();
                        });
                        if (newRole == null) {
                            newRole = web.ensureUser(pnpRoleAssignment.Principal);
                        }
                        var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(executeContext);
                        collRoleDefinitionBinding.add(roleDefinition);
                        securableObject.get_roleAssignments().add(newRole, collRoleDefinitionBinding);
                    }
                    else {
                        var existingRoleBindings = _this.getEnumerationList(existingRole.get_roleDefinitionBindings());
                        var existingRoleBinding = Utils.arrayFirst(existingRoleBindings, function (rdb) {
                            return rdb.get_name().toLowerCase() == roleDefinitionName.toLowerCase();
                        });
                        if (existingRoleBinding == null) {
                            //var roleDefinitionBindingCollection = new SP.RoleDefinitionBindingCollection.newObject(executeContext);
                            //existingRole.get_roleDefinitionBindings().removeAll();
                            existingRole.get_roleDefinitionBindings().add(roleDefinition);
                            existingRole.update();
                        }
                    }
                    return _this.executeQueryPromise();
                });
            };
            for (var _i = 0, _a = pnpPermission.RoleAssignment; _i < _a.length; _i++) {
                var pnpRoleAssignment = _a[_i];
                _loop_10(pnpRoleAssignment);
            }
            return promises;
        };
        SpHelper.prototype.getRESTRequest = function (url, callback) {
            return $.ajax({
                url: url,
                'method': 'GET',
                'cache': false,
                'headers': {
                    "Accept": "application/json; odata=verbose"
                },
                success: callback,
                error: callback
            });
        };
        SpHelper.prototype.startWorkflowOnListItem = function (subscription, itemId, initiationParameters) {
            var d = $.Deferred();
            var executeContext = this.getExecuteContext();
            var web = this.getWeb();
            Utils.loadWFScripts(function () {
                var wfServicesManager = new SP.WorkflowServices.WorkflowServicesManager(executeContext, web);
                var instanceService = wfServicesManager.getWorkflowInstanceService();
                if (itemId != null && itemId != 0)
                    instanceService.startWorkflowOnListItem(subscription, itemId, initiationParameters);
                else
                    instanceService.startWorkflow(subscription, initiationParameters);
                executeContext.executeQueryAsync(function () {
                    d.resolve();
                }, function () {
                    d.reject();
                });
            });
            return d;
        };
        SpHelper.prototype.setWelcomePage = function (url) {
            var web = this.getWeb();
            var rootFolder = web.get_rootFolder();
            rootFolder.set_welcomePage(url);
            rootFolder.update();
            return this.executeQueryPromise();
        };
        SpHelper.prototype.getFromExternalService = function (url, callback) {
            var d = $.Deferred();
            var request = new SP.WebRequestInfo();
            request.set_url(url);
            request.set_method("GET");
            request.set_headers({
                "Accept": "application/json;odata=verbose"
            });
            var executeContext = this.getExecuteContext();
            var response = SP.WebProxy.invoke(executeContext, request);
            executeContext.executeQueryAsync(function () {
                if (response == null || response.get_statusCode() != 200) {
                    callback(null);
                    d.reject();
                    return;
                }
                callback(JSON.parse(response.get_body()));
                d.resolve();
            }, function () {
                callback(null);
                d.reject();
            });
            return d;
        };
        SpHelper.prototype.getInnerHTMLContent = function (node) {
            if (node.innerHTML)
                return node.innerHTML;
            var elementNode;
            if (node.childNodes.length == 1) {
                elementNode = node.childNodes[0];
            }
            else {
                var contentNode = void 0;
                for (var i = 0; i < node.childNodes.length; i++) {
                    var n = node.childNodes[i];
                    if (n.nodeType == n.ELEMENT_NODE) {
                        contentNode = n;
                        break;
                    }
                }
                return contentNode.innerHTML;
            }
            var serializer = (new window.XMLSerializer);
            return serializer.serializeToString(elementNode);
        };
        SpHelper.prototype.addAttachmentToListItem = function (siteUrl, listTitle, listItemId, fileName, content) {
            var d = $.Deferred();
            var re = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
            try {
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + listTitle + "')/items(" + listItemId + ")/AttachmentFiles/add(FileName='" + fileName + "')?@target='" + siteUrl + "'";
                re.executeAsync({
                    url: url,
                    method: "POST",
                    binaryStringRequestBody: true,
                    body: content,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function () {
                        d.resolve();
                    },
                    error: function () {
                        d.reject();
                    }
                });
            }
            catch (e) {
                d.reject();
            }
            return d;
        };
        SpHelper.prototype.populateList = function (listTitle, dataRows) {
            var _this = this;
            var web = this.getWeb();
            var executeContext = this.getExecuteContext();
            var promises = $.when(1);
            var rowsToAdd = [], existingRows;
            promises = promises.then(function () {
                executeContext.load(web, 'Url');
                return _this.executeQueryPromise();
            });
            promises = promises.then(function () {
                return _this.parseDataRows(dataRows, function (rs) {
                    rowsToAdd = rs;
                });
            });
            promises = promises.then(function () {
                var d = $.Deferred();
                var list = web.get_lists().getByTitle(listTitle);
                var iPromises = $.when(1);
                var _loop_11 = function(dr) {
                    iPromises = iPromises.then(function () {
                        var liCreationInfo = new SP.ListItemCreationInformation();
                        listItem = list.addItem(liCreationInfo);
                        for (var propertyName in dr) {
                            if (dr.hasOwnProperty(propertyName) && propertyName != '_Attachments')
                                listItem.set_item(propertyName, dr[propertyName]);
                        }
                        executeContext.load(listItem, 'Id');
                        listItem.update();
                        return _this.executeQueryPromise();
                    });
                    if (dr._Attachments && dr._Attachments.length > 0) {
                        var _loop_12 = function(attachment) {
                            iPromises = iPromises.then(function () {
                                var fileUrl = attachment.Url.startsWith('/') ? attachment.Url : _spPageContextInfo.webServerRelativeUrl + '/' + attachment.Url;
                                var content = null;
                                return _this.getFileContentAsBinary(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (c) {
                                    content = c;
                                }).then(function () {
                                    return _this.addAttachmentToListItem(web.get_url(), listTitle, listItem.get_id(), attachment.Name, content);
                                });
                            });
                        };
                        for (var _i = 0, _a = dr._Attachments; _i < _a.length; _i++) {
                            var attachment = _a[_i];
                            _loop_12(attachment);
                        }
                    }
                };
                var listItem;
                for (var _b = 0, rowsToAdd_1 = rowsToAdd; _b < rowsToAdd_1.length; _b++) {
                    var dr = rowsToAdd_1[_b];
                    _loop_11(dr);
                }
                iPromises.done(function () {
                    d.resolve();
                }).fail(function () {
                    d.reject();
                });
                return d;
            });
            return promises;
        };
        SpHelper.prototype.parseDataRows = function (dataRows, callback) {
            var _this = this;
            var promises = $.when(1);
            var rowsToAdd = [];
            var _loop_13 = function(dr) {
                if (dr._url == null) {
                    rowsToAdd.push(dr);
                    return "continue";
                }
                //data row is an url, so load rows from url
                promises = promises.then(function () {
                    var fileUrl = dr._url.startsWith('/') ? dr._url : _spPageContextInfo.webServerRelativeUrl + '/' + dr._url;
                    return _this.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, function (c) {
                        if (dr._type != 'xml')
                            return; //support xml only now, will support json if I get paid.
                        var xmlResponse = $.parseXML(c);
                        if (xmlResponse.firstChild.localName != 'DataRows')
                            return;
                        for (var j = 0; j < xmlResponse.firstChild.childNodes.length; j++) {
                            var row = xmlResponse.firstChild.childNodes[j];
                            if (row.nodeType != row.ELEMENT_NODE || row.localName != 'DataRow')
                                continue;
                            var r = {};
                            for (var k = 0; k < row.childNodes.length; k++) {
                                if (row.childNodes[k].nodeType == row.ELEMENT_NODE)
                                    r[row.childNodes[k].localName] = _this.getInnerHTMLContent(row.childNodes[k]);
                            }
                            rowsToAdd.push(r);
                        }
                    });
                });
            };
            for (var _i = 0, dataRows_1 = dataRows; _i < dataRows_1.length; _i++) {
                var dr = dataRows_1[_i];
                var state_13 = _loop_13(dr);
                if (state_13 === "continue") continue;
            }
            promises = promises.then(function () {
                callback(rowsToAdd);
                return {};
            });
            return promises;
        };
        SpHelper.prototype.setupPermissionForList = function (listTitle, pnpSecurity) {
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            return this.applySecurity(list, pnpSecurity);
        };
        return SpHelper;
    }());
    exports.SpHelper = SpHelper;
});
//# sourceMappingURL=SharePointHelper.js.map