/// <reference path="../typings/jquery/jquery.d.ts" />




export class Constants {
    static folderContentTypeId: string = '0x012000';
    static pageLayoutContentTypeId = '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811';
}

export class FeatureInfo {
    ID: string;

    constructor(id: string) {
        this.ID = id;
    }
}
export class SiteFeatureTemplate {
    itemId: number;
    title: string;
    description: string;
    templateId: string;
    templateType: string;
    serverRelativeUrl: string;
    fullUrl: string;
}

export class TemplateFile {
    Language: number;
    TimeZone: number;
    UseSamePermissionsAsParentSite: boolean;
    WebTemplateId: string;
    Templates: Array<Template>;
}

export class Template {
    Features: {
        WebFeatures: Array<FeatureInfo>;
        SiteFeatures: Array<FeatureInfo>;
    };
    Security: SiteSecurityInfo;
    SiteFields: Array<FieldInfo>;
    ContentTypes: Array<ContentTypeInfo>;
    Pages: Array<PublishingPageInfo>;
    Lists: Array<ListCreationInfo>;
    Workflows: {
        Subscriptions: Array<WFSubscriptionInfo>;
    };
    WebSettings: WebSettings;
    CustomActions: {
        SiteCustomActions: Array<CustomActionInfo>;
        WebCustomActions: Array<CustomActionInfo>;
    }
}
export class CommandUIExtension {
    Url: string;
    Xml: string;
}
export class CustomActionInfo {
    Name: string;
    Description: string;
    ScriptSrc: string;
    Location: string;
    Sequence: number;
    CommandUIExtension: CommandUIExtension;
    Rights: string;
    Group: string;
    Url:string;
}
class CustomActionCreationInfo extends CustomActionInfo {

}

export class SiteSecurityInfo {
    SiteGroups: Array<SiteGroupInfo>;
    SiteSecurityPermissions: {
        RoleAssignments: Array<RoleAssignmentInfo>;
    };
}
export class SiteGroupInfo {
    Title: string;
    Description: string;
    Owner: string;
    AllowMembersEditMembership: boolean;
    AllowRequestToJoinLeave: boolean;
    AutoAcceptRequestToJoinLeave: boolean;
    OnlyAllowMembersViewMembership: boolean;
    RequestToJoinLeaveEmailSetting: boolean;
    Members: Array<string>;

}
export class ListInfo {
    constructor(list: SP.List) {
        this.Title = list.get_title();
        this.ID = list.get_id().toString();
        this.RootFolderUrl = list.get_rootFolder().get_serverRelativeUrl();
        this.ContentTypesEnabled = list.get_contentTypesEnabled();
        this.ParentWebUrl = list.get_parentWebUrl();
    }

    Title: string;
    ID: string;
    RootFolderUrl: string;
    ContentTypesEnabled: boolean;
    ParentWebUrl: string;
}
export class ViewCreationInfo {
    DisplayName: string;
    RowLimit: number;
    DefaultView: boolean;
    Paged: boolean;
    Query: string;
    ViewFields: Array<string>;
}
export class ListCreationInfo {
    Title: string;
    Description: string;
    Url: string;
    TemplateType: number;
    OnQuickLaunch: boolean;
    EnableVersioning: boolean;
    MaxVersionLimit: number;
    MinorVersionLimit: number;
    EnableMinorVersions: boolean;
    EnableModeration: boolean;
    ForceCheckOut: boolean;
    EnableAttachments: boolean;
    Hidden: boolean;
    EnableFolderCreation: boolean;
    Views: Array<ViewCreationInfo>;
    RemoveExistingViews: boolean;
    Security: ObjectSecurityInfo;
    DataRows: Array<any>;
    EnableEnterpriseKeywords: boolean;
    RemoveExistingContentTypes: boolean;
    ContentTypeBindings: Array<ContentTypeBindingInfo>;
}
export class GroupCreationInfo {
    Title: string;
    Description: string;
    OnlyAllowMembersViewMembership: boolean;
    AllowMembersEditMembership: boolean;
    AllowRequestToJoinLeave: boolean;
    AutoAcceptRequestToJoinLeave: boolean;
}
export class DependentLookupFieldInfo {
    ShowField: string;
    DisplayName: string;
}
export class FieldInfo {
    ID: string;
    Required: boolean;
    JSLink: string;
    Name: string;
    DisplayName: string;
    Type: string;
    Group: string;
    List: string;
    ShowField: string;
    DependentLookupFields: Array<DependentLookupFieldInfo>;
    Xml: string;
}
export class FieldRefInfo {
    ID: string;
    Name: string;
    Hidden: boolean;
    Required: boolean;
}
export class ContentTypeInfo {
    ParentId: string;
    Name: string;
    ID: string;
    Group: string;
    Description: string;
    FieldRefs: Array<FieldRefInfo>;
    DocumentSetTemplate: DocumentSetTemplateInfo;
}
export class ContentTypeNameId {
    ID: SP.ContentTypeId;
    Name: string;
}
export class DocumentSetTemplateInfo extends ContentTypeInfo {
    AllowedContentTypes: Array<ContentTypeNameId>;
    SharedFields: Array<FieldRefInfo>;
    WelcomePageFields: Array<FieldRefInfo>;
}
export class ContentTypeBindingInfo {
    ID: string;
    Default: boolean;
    Name: string;
}
export class WFSubscriptionInfo {
    HistoryListTitle: string;
    TaskListTitle: string;
    ListTitle: string;
    WFDefinitionId: string;
    Name: string;
    Enabled: boolean;
    WorkflowStartEvent: boolean;
    ItemAddedEvent: boolean;
    ItemUpdatedEvent: boolean;
}
export class PublishingPageInfo {
    Url: string;
    Layout: string;
    Title: string;
    SEOTitle: string;
    Security: ObjectSecurityInfo;

}
export class ObjectSecurityInfo {
    BreakRoleInheritance: PermissionInfo;
}
export class PermissionInfo {
    ClearSubscopes: boolean;
    CopyRoleAssignments: boolean;
    RoleAssignment: Array<RoleAssignmentInfo>;
}
export class RoleAssignmentInfo {
    Principal: string;
    RoleDefinition: string;
}
export interface LoggerInterface {
    log(msg: string, isError?: boolean): void
}
export class WebSettings {
    WelcomePage: string;
}
export class SiteCreationInfo {
    Title: string;
    Name: string;
    Description: string;
    Language: number;
    UseSamePermissionsAsParentSite: boolean;
    WebTemplateId: string;
}

if (!String.prototype.replaceAll) {
    //http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        search = search.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

class Logger implements LoggerInterface {
    log(msg: string, isError: boolean = false) {
        if (isError)
            console.log('ERROR: ' + msg);
        else console.log(msg);
    }
}

export class Utils {
    static getQueryStringParameter(paramToRetrieve) {
        paramToRetrieve = paramToRetrieve.toLowerCase();
        var urlParts = document.location.toString().toLowerCase().split("?");
        if (urlParts.length < 2) return null;
        var params = urlParts[1].split("&");
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve)
                return singleParam[1];
        }
        return '';
    };
    static isAppContext() {
        return (_spPageContextInfo && _spPageContextInfo.webTemplate == '17');
    }
    static loadWFScripts(callback) {
        ExecuteOrDelayUntilScriptLoaded(() => {
            ExecuteOrDelayUntilScriptLoaded(() => {
                SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
                SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", callback);
            }, "sp.js");
        }, "sp.runtime.js");
    };
    static loadPublishingScripts(callback) {
        ExecuteOrDelayUntilScriptLoaded(() => {
            ExecuteOrDelayUntilScriptLoaded(() => {
                SP.SOD.registerSod('sp.publishing.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.publishing.js'));
                SP.SOD.executeFunc('sp.publishing.js', "SP.Publishing.PublishingWeb", callback);
            }, "sp.js");
        }, "sp.runtime.js");
    }
    static loadRequestExecutor(callback) {
        ExecuteOrDelayUntilScriptLoaded(() => {
            if (SP.ProxyWebRequestExecutorFactory) {
                callback();
                return;
            }
            var hostWebUrl = decodeURIComponent(Utils.getQueryStringParameter('SPHostUrl'));
            var scriptbase = hostWebUrl + "/_layouts/15/";
            $.getScript(scriptbase + "SP.RequestExecutor.js", () => {
                callback();
            });
        }, "sp.js");

    }
    static arrayFirst<T>(array: Array<T>, predicate: (p: T) => boolean, predicateOwner = null): T {
        for (var i = 0, j = array.length; i < j; i++)
            if (predicate.call(predicateOwner, array[i], i))
                return array[i];
        return null;
    }
    static arrayFilter<T>(array: Array<T>, predicate: (item: T, index: number) => boolean): Array<T> {
        array = array || [];
        var result = [];
        for (var i = 0, j = array.length; i < j; i++)
            if (predicate(array[i], i))
                result.push(array[i]);
        return result;
    }
    static arrayMap<T, TU>(array: Array<T>, mapping: (item: T, index: number) => TU): Array<TU> {
        array = array || [];
        var result = [];
        for (var i = 0, j = array.length; i < j; i++)
            result.push(mapping(array[i], i));
        return result;
    }
}
export class UI {
    static dialog: SP.UI.ModalDialog;
    static showDialog(header: string, msg: string) {
        SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', () => {
            if (this.dialog) {
                this.closeDialog();
            }
            this.dialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(header, msg, 150, 550);
        });
    };
    static closeDialog() {
        if (this.dialog) {
            this.dialog.close(SP.UI.DialogResult.invalid);
        }
    };
    static clearAllNotification() {
        SP.UI.Status.removeAllStatus(true);
    };
    static showNotification(title: string, msg: string, isError?: boolean) {
        SP.UI.Status.removeAllStatus(true);
        var notificationId = SP.UI.Status.addStatus(title, msg);
        if (isError)
            SP.UI.Status.setStatusPriColor(notificationId, 'red');
        else
            SP.UI.Status.setStatusPriColor(notificationId, 'green');
        setTimeout(() => { SP.UI.Status.removeStatus(notificationId); }, 10000);
    };
    static showStickyNotification(title: string, msg: string, isError?: boolean) {
        SP.UI.Status.removeAllStatus(true);
        var notificationId = SP.UI.Status.addStatus(title, msg);
        if (isError)
            SP.UI.Status.setStatusPriColor(notificationId, 'red');
        else
            SP.UI.Status.setStatusPriColor(notificationId, 'green');
    };
    static showShortNotification(msg: string, isError?: boolean) {
        SP.UI.Status.removeAllStatus(true);
        var notificationId = SP.UI.Status.addStatus(msg);
        if (isError)
            SP.UI.Status.setStatusPriColor(notificationId, 'red');
        else
            SP.UI.Status.setStatusPriColor(notificationId, 'green');
        setTimeout(() => { SP.UI.Status.removeStatus(notificationId); }, 2000);
    };
}

export class SpHelper {

    private webAvailableContentTypes: SP.ContentType[];
    private _context: SP.ClientObject | SP.ClientContext;
    private _logger: LoggerInterface;
    constructor(ctx: SP.ClientObject | SP.ClientContext, logger = new Logger()) {
        this.webAvailableContentTypes = null;
        this._context = ctx;
        this._logger = logger;
    }
    static isCurrentContextWebApp() {
        return _spPageContextInfo && _spPageContextInfo.webTemplate == '17';
    }


    static getHelperContextFromUrl(fullUrl: string): SpHelper {
        if (SpHelper.isCurrentContextWebApp() && !fullUrl.startsWith('/')) { //if full url and app site, use proxy
            var context = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
            var factory = new SP.ProxyWebRequestExecutorFactory(_spPageContextInfo.webAbsoluteUrl);
            context.set_webRequestExecutorFactory(factory);
            var appContext = new SP.AppContextSite(context, fullUrl);
            return new SpHelper(appContext);
        } else {
            return new SpHelper(new SP.ClientContext(fullUrl));
        }
    }
    //Returns the current executing context. If it's an app site, this returns the app context.
    getExecuteContext(): SP.ClientContext {
        if (this._context instanceof SP.ClientContext) {
            return <SP.ClientContext>this._context;
        }
        return <SP.ClientContext>(<SP.ClientObject>this._context).get_context();
    }
     
    getWeb(): SP.Web {
        if (this._context instanceof SP.ClientContext) {
            return (<SP.ClientContext>this._context).get_web();
        }
        return (<SP.AppContextSite>this._context).get_web();
    }
    getSiteCollection(): SP.Site {
        if (this._context instanceof SP.ClientContext) {
            return (<SP.ClientContext>this._context).get_site();
        }
        return (<SP.AppContextSite>this._context).get_site();
    }
    getEnumerationList<T>(source): Array<T> {
        var list = new Array<T>();
        var enumerator = source.getEnumerator();
        while (enumerator.moveNext()) {
            list.push(enumerator.get_current());
        }
        return list;
    }
    executeQueryPromise() {
        var deferred = $.Deferred();
        var executeContext = this.getExecuteContext();
        var logger = this._logger;
        executeContext.executeQueryAsync(
            function (a, b) {
                deferred.resolve(arguments);
            },
            function (a, b) {
                deferred.reject(arguments);
                logger.log(b.get_message(), true);
            }
        );
        return deferred.promise();
    }
    addExistingFieldToListContentType(listTitle: string, contentTypeId: string, fieldInternalName: string) {

        var web = (<SP.ClientContext>this._context).get_web();
        var list = web.get_lists().getByTitle(listTitle);
        var contentType = list.get_contentTypes().getById(contentTypeId);
        var taxKeywordField = list.get_fields().getByInternalNameOrTitle(fieldInternalName);

        var fieldLink = new SP.FieldLinkCreationInformation();
        fieldLink.set_field(taxKeywordField);
        contentType.get_fieldLinks().add(fieldLink);
        contentType.update(true);
        return this.executeQueryPromise();
    };
    getWebContentTypeByName(contentTypeName: string, properties: string, callback: (contentTypes: SP.ContentType[]) => void) {
        var contentType = null;
        var d = $.Deferred();
        var web = this.getWeb();

        if (this.webAvailableContentTypes) { //first check cached content types 
            contentType = Utils.arrayFirst<SP.ContentType>(this.webAvailableContentTypes, c => (c.get_name() == contentTypeName));
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
            properties = `Include(${properties})`;
        }
        if (properties)
            executeContext.load(availableContentTypes, properties);
        else
            executeContext.load(availableContentTypes);

        executeContext.executeQueryAsync(() => {
            this.webAvailableContentTypes = this.getEnumerationList<SP.ContentType>(availableContentTypes);
            contentType = Utils.arrayFirst<SP.ContentType>(this.webAvailableContentTypes, c => {
                return c.get_name() == contentTypeName;
            });
            callback(contentType);
            d.resolve();
        },
            () => {
                callback(null);
                d.reject();
            });
        return d;
    }
    activateWebFeature(featureId: string, scope: string) {
        var d = $.Deferred();
        var web = this.getWeb();
        var features = web.get_features();
        features.add(new SP.Guid(featureId), false, SP.FeatureDefinitionScope[scope]);
        var executeContext = this.getExecuteContext();
        executeContext.executeQueryAsync(() => {
            d.resolve();
        },
            () => {
                this._logger.log('Failed to activated web feature ' + featureId, true);
                d.reject();
            });
        return d;
    }
    getActivatedFeatures(isWebLevel: boolean, callback: (features: Array<FeatureInfo>) => any) {
        var deferred = $.Deferred();
        var web = this.getWeb();
        var site = this.getSiteCollection();
        var self = this;

        var executeContext = this.getExecuteContext();
        var frs = isWebLevel ? web.get_features() : site.get_features();
        executeContext.load(frs, 'Include(DefinitionId)');
        executeContext.executeQueryAsync(function () {
            var featuresInfo = new Array<FeatureInfo>();
            var features = self.getEnumerationList<SP.Feature>(frs);
            for (let l of features) {
                featuresInfo.push(new FeatureInfo(l.get_definitionId().toString()));
            }

            callback(featuresInfo);
            deferred.resolve(arguments);
        },
            function () {
                this._logger.log('Failed to get all activated features', true);
                callback(null);
                deferred.reject(arguments);
            });
        return deferred;
    };
    createGroup(pnpGroup: GroupCreationInfo, roleDefinitionName: string, callback: (group: SP.Group) => void) {
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
        executeContext.executeQueryAsync(() => {
            callback(group);
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    createSite(siteInfo: SiteCreationInfo, callback: (web: SP.Web) => any): JQueryGenericPromise<{}> {
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
        executeContext.executeQueryAsync(() => {
            callback(newWeb);
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    addUserToGroup(groupName: string, userKey: string) {
        var web = this.getWeb();
        var group = web.get_siteGroups().getByName(groupName);
        group.get_users().addUser(web.ensureUser(userKey));
        group.update();
        return this.executeQueryPromise();
    }
    getAllSiteGroups(callback: (groups: SP.Group[]) => void) {
        var d = $.Deferred();
        var site = this.getSiteCollection();
        var siteGroups = site.get_rootWeb().get_siteGroups();
        var executeContext = this.getExecuteContext();
        executeContext.load(siteGroups);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.Group>(siteGroups));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getListFields(listTitle: string, callback: (fields: SP.Field[]) => void) {
        var d = $.Deferred();
        var web = this.getWeb();
        var list = web.get_lists().getByTitle(listTitle);
        var listFields = list.get_fields();
        var executeContext = this.getExecuteContext();
        executeContext.load(listFields);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.Field>(listFields));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getAllLists(callback: (lists: ListInfo[]) => void) {
        var deferred = $.Deferred();
        var web = this.getWeb();
        var lists = web.get_lists();
        var executeContext = this.getExecuteContext();
        executeContext.load(lists, "Include(Title,Id,RootFolder,ContentTypesEnabled,ParentWebUrl)");
        executeContext.executeQueryAsync(() => {
            var listInfo = [];
            var listArray = this.getEnumerationList<SP.List>(lists);
            for (let l of listArray) {
                listInfo.push(new ListInfo(l));
            }
            callback(listInfo);
            deferred.resolve();
        }, () => {
            this._logger.log('Failed to get all lists', true);
            callback(null);
            deferred.reject();
        });
        return deferred;
    }
    getListInfo(listTitle: string, callback: (listInfo: ListInfo) => any) {
        var d = $.Deferred();
        var web = this.getWeb();
        var list = web.get_lists().getByTitle(listTitle);
        var executeContext = this.getExecuteContext();
        executeContext.load(list, 'Title', 'Id', 'RootFolder', 'ContentTypesEnabled', 'ContentTypes', 'ParentWebUrl');
        executeContext.executeQueryAsync(() => {
            callback(new ListInfo(list));
            d.resolve();
        },
            () => {
                callback(null);
                d.reject();
            });
        return d;
    };
    activateDeactivateWebFeatures(featuresToActivate: Array<any>) {
        var deferred = $.Deferred();
        if (featuresToActivate == null || featuresToActivate.length == 0) {
            deferred.resolve();
            return deferred;
        }
        this._logger.log('activating/deactivating features');


        var promises = $.when(1);//empty promise

        for (let f of featuresToActivate) {
            promises = promises.then(() => this.activateWebFeature(f.ID, f.Scope ? f.Scope : 'farm'));
        }

        promises.done(() => {
            this._logger.log('Activated all features');
            deferred.resolve();
        }).fail(() => {
            this._logger.log('Failed to activated all features', true);
            deferred.reject();
        });

        return deferred;
    };
    createList(listCreationInfo: ListCreationInfo) {
        var promises = $.when(1);
        var title = listCreationInfo.Title;
        var description = listCreationInfo.Description;
        var url = listCreationInfo.Url;
        var template = listCreationInfo.TemplateType;
        var onQuickLaunch = listCreationInfo.OnQuickLaunch;
        var list;
        var web = this.getWeb();
        //let allLists: ListInfo[];
        let allLists = <ListInfo[]>[];
        promises = promises.then(() => {
            return this.getAllLists(lsts => { allLists = lsts; });
        });

        promises = promises.then(() => {
            var existingList = Utils.arrayFirst<ListInfo>(allLists, l => (l.Title.toLowerCase() == listCreationInfo.Title.toLowerCase()));
            if (existingList) {
                list = existingList;
                return {};
            }

            this._logger.log('creating list ' + title);
            var spListCreationInfo = new SP.ListCreationInformation();
            spListCreationInfo.set_title(title);
            spListCreationInfo.set_description(description);
            spListCreationInfo.set_url(url);
            spListCreationInfo.set_templateType(template);
            list = web.get_lists().add(spListCreationInfo);
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            this._logger.log(`updating list ${title} `);
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
                || listCreationInfo.EnableAttachments != null || listCreationInfo.Hidden != null || listCreationInfo.EnableFolderCreation != null;;
            if (updateListRequired) {
                list.update();
                return this.executeQueryPromise();
            }
            return {};
        });

        promises = promises.then(() => {
            return this.processListContentTypes(listCreationInfo);
        });
        promises = promises.then(() => {
            return this.processListFields(listCreationInfo);
        });

        return promises;
    }
    private processListContentTypes(listInstance: ListCreationInfo) {
        var listTitle = listInstance.Title;
        var removeExistingContentTypes = listInstance.RemoveExistingContentTypes;
        var pnpContentTypeBidnings = listInstance.ContentTypeBindings;
        if (pnpContentTypeBidnings == null || pnpContentTypeBidnings.length == 0) return {};
        var list: ListInfo;
        var promises = $.when(1);
        promises = promises.then(() => {
            return this.getListInfo(listTitle, (l) => { list = l; });
        });
        promises = promises.then(() => {
            if (!list.ContentTypesEnabled) {
                return this.enableListContentType(list.ID);
            }
            return $.Deferred().resolve();
        });
        for (let ctb of pnpContentTypeBidnings) {
            promises = promises.then(() => {
                //var context = new SP.ClientContext(currentWeb.get_serverRelativeUrl());
                return this.addContentTypeToListInternal(list.ID, ctb);
            });
        }
        if (removeExistingContentTypes) {
            promises = promises.then(() => {
                var defaultContentType = pnpContentTypeBidnings.length == 1 ? pnpContentTypeBidnings[0] : Utils.arrayFirst<ContentTypeBindingInfo>(pnpContentTypeBidnings,
                    (c) => { return c.Default != null && c.Default; });
                return this.removeAllContentTypesBut(listTitle, pnpContentTypeBidnings, defaultContentType);
            });


        }
        return promises;
    }
    private processListFields(listInstance) {
        var listTitle = listInstance.Title;
        var pnpFields = listInstance.FieldRefs;
        var promises = $.when(1);
        if (pnpFields == null || pnpFields.length == 0) return promises;
        let listFields: Array<SP.Field>;
        promises = promises.then(() => {
            return this.getListFields(listTitle, (flds) => {
                listFields = flds;
            });
        });

        for (let pnpf of pnpFields) {
            promises = promises.then(() => {
                var listField = Utils.arrayFirst<SP.Field>(listFields, (f) => {
                    return f.get_id().equals(new SP.Guid(pnpf.ID));
                });
                if (listField == null)
                    return this.addFieldToList(listTitle, pnpf.ID, pnpf.DisplayName);
                else if (listField.get_title().toLowerCase() != pnpf.DisplayName.toLowerCase()) {
                    //field exist in the list but need to chagne display name
                    return this.updateListField(listTitle, pnpf.ID, pnpf.DisplayName);
                } else if (pnpf.Choices) { //need to update choices
                    return this.updateListFieldChoices(listTitle, pnpf.ID, pnpf.Choices);
                } else return {};
            });
        }
        return promises;
    }
    createViews(pnpListInstance: ListCreationInfo) {
        if (pnpListInstance.Views == null || pnpListInstance.Views.length == 0) return {};
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();
        var existingViews = null;
        var listInstance;

        var promises = $.when(1);
        promises = promises.then(() => {
            listInstance = web.get_lists().getByTitle(pnpListInstance.Title);
            existingViews = listInstance.get_views();
            executeContext.load(existingViews);
            executeContext.load(listInstance);
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            if (!pnpListInstance.RemoveExistingViews) return {};
            existingViews = this.getEnumerationList(existingViews);
            for (var i = 0; i < existingViews.length; i++) {
                existingViews[i].deleteObject();
            }
            return this.executeQueryPromise();
        });

        for (let pnpView of pnpListInstance.Views) {
            promises = promises.then(() => {
                var listViewCreationInfo = new SP.ViewCreationInformation();
                listViewCreationInfo.set_title(pnpView.DisplayName);
                listViewCreationInfo.set_rowLimit(pnpView.RowLimit ? pnpView.RowLimit : 30);
                listViewCreationInfo.set_viewTypeKind(SP.ViewType.html); //for now set html.
                listViewCreationInfo.set_setAsDefaultView(pnpView.DefaultView);
                listViewCreationInfo.set_paged(pnpView.Paged);
                listViewCreationInfo.set_query(pnpView.Query);
                listViewCreationInfo.set_viewFields(pnpView.ViewFields);
                listInstance.get_views().add(listViewCreationInfo);
                return this.executeQueryPromise();
            });
        }

        return promises;
    }
    getListContentTypes(listIdOrTitle: string, propertiesToLoad: string, callback: (cts: Array<SP.ContentType>) => void) {
        var d = $.Deferred();
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();
        var list = StringUtil.IsGuid(listIdOrTitle) ? web.get_lists().getById(listIdOrTitle) : web.get_lists().getByTitle(listIdOrTitle);
        var conteTypes = list.get_contentTypes();
        if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
            propertiesToLoad = `Include(${propertiesToLoad})`;
        }
        if (propertiesToLoad)
            executeContext.load(conteTypes, propertiesToLoad);
        else
            executeContext.load(conteTypes);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.ContentType>(conteTypes));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;

    }
    private addContentTypeToListInternal(listId: string, contentTypeBinding) {
        var contentTypeName = contentTypeBinding.Name;
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();
        var promises = $.when(1);

        var webContentType = null;
        var listContentType = null;
        let listContentTypeFields: SP.FieldCollection;
        let listContentTypes: Array<SP.ContentType>;

        var list = null;
        promises = promises.then(() => {
            return this.getWebContentTypeByName(contentTypeName, 'Id,Name', ct => {
                webContentType = ct;
            });
        });
        promises = promises.then(() => {
            return this.getListContentTypes(listId, 'Id,Name', cts => {
                listContentTypes = cts;
            });
        });
        promises = promises.then(() => {
            listContentType = Utils.arrayFirst<SP.ContentType>(listContentTypes, (lct) => {
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
            return this.executeQueryPromise();
        });
        promises = promises.then(() => {
            if (contentTypeBinding.Hidden) {
                var ct = list.get_contentTypes().getById(listContentType.get_id());
                ct.set_hidden(true);
                ct.update();
                return this.executeQueryPromise();
            }
            return {};
        });

        promises = promises.then(() => {
            var iPromies = $.when(1);
            var d = $.Deferred();
            var listContentTypeFieldCollection = this.getEnumerationList<SP.Field>(listContentTypeFields);

            //Rich text field in document library gets converted to plain text. This code snippet will make sure the field is converted back to rich text 
            //after adding the content type. Ref - https://social.msdn.microsoft.com/Forums/office/en-US/95a05ae0-5d3b-432f-81bf-1f4a03e9910b/rich-text-column-in-document-library?forum=sharepointcustomizationlegacy
            if (list.get_baseTemplate() == SP.ListTemplateType.documentLibrary) {
                //if the content type inherits from document, then check if there's any rich text field that needs conversion from plain text to rich text
                const noteFields = Utils.arrayFilter(listContentTypeFieldCollection, (f) => {
                    return f.get_typeAsString() == 'Note' && (<SP.FieldMultiLineText>executeContext.castTo(f, SP.FieldMultiLineText)).get_richText() == false;
                });

                for (let nf of noteFields) {
                    var webField;
                    iPromies = iPromies.then(() => {
                        webField = web.get_availableFields().getById(nf.get_id());
                        executeContext.load(webField);
                        return this.executeQueryPromise();
                    });
                    iPromies = iPromies.then(() => {
                        var richTextField = <SP.FieldMultiLineText>executeContext.castTo(webField, SP.FieldMultiLineText);
                        if (richTextField.get_richText()) {
                            var lf = <SP.FieldMultiLineText>executeContext.castTo(nf, SP.FieldMultiLineText);
                            lf.set_richText(true);
                            lf.update();
                            return this.executeQueryPromise();
                        }
                        return {};
                    });
                }
            }

            iPromies.then(() => { d.resolve(); }, () => { d.reject(); });
            return d;

        });

        return promises;
    };
    enableListContentType(listId: string) {
        var web = this.getWeb();
        var list = web.get_lists().getById(listId);
        list.set_contentTypesEnabled(true);
        list.update();
        return this.executeQueryPromise();
    };
    createWebField(webServerRelativeUrl: string, pnpField: FieldInfo) {
        let promises = $.when(1);
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();
        let lists: Array<ListInfo>;

        const idPart = pnpField.ID == null ? "" : "ID='" + pnpField.ID + "'";
        const requiredPart = pnpField.Required ? " Required='TRUE' " : " Required='FALSE' ";
        const jsLinkPart = pnpField.JSLink ? ` JSLink='${pnpField.JSLink}' ` : "";
        let xml: string;
        if (pnpField.Xml) {
            xml = pnpField.Xml;
        } else {
            xml = `<Field ${idPart}  Name='${pnpField.Name}' DisplayName='${pnpField.DisplayName}' Type='${pnpField.Type}' ${requiredPart}  ${jsLinkPart}  Group='${pnpField.Group}' />`;
        }
        var fieldCreated: SP.Field;

        promises = promises.then(() => {
            executeContext.load(web, 'ServerRelativeUrl');
            fieldCreated = web.get_fields().addFieldAsXml(xml, true, SP.AddFieldOptions.addFieldCheckDisplayName);
            executeContext.load(fieldCreated);
            return this.executeQueryPromise();
        });



        if (pnpField.Type == 'Lookup' || pnpField.Type == 'LookupMulti') {
            promises = promises.then(() => {
                return this.getAllLists((lsts) => {
                    lists = lsts;
                });
            });
            promises = promises.then(() => {
                var listUrl = (webServerRelativeUrl + '/' + pnpField.List).toLowerCase();
                var list = Utils.arrayFirst<ListInfo>(lists, (l) => {
                    return l.RootFolderUrl.toLowerCase() == listUrl;
                });

                var fieldLookup = <SP.FieldLookup>executeContext.castTo(fieldCreated, SP.FieldLookup);
                fieldLookup.set_lookupList(list.ID);
                fieldLookup.set_lookupField(pnpField.ShowField);
                fieldLookup.set_allowMultipleValues(pnpField.Type == 'LookupMulti');
                fieldLookup.update();

                return this.executeQueryPromise();

            });
            if (pnpField.DependentLookupFields) {
                promises = promises.then(() => {
                    var fieldLookup = <SP.FieldLookup>executeContext.castTo(fieldCreated, SP.FieldLookup);
                    for (var i = 0; i < pnpField.DependentLookupFields.length; i++) {
                        web.get_fields().addDependentLookup(pnpField.DependentLookupFields[i].DisplayName, fieldLookup, pnpField.DependentLookupFields[i].ShowField);
                    }
                    return this.executeQueryPromise();
                });
            }
        }
        return promises;
    }
    createWebContentType(pnpContentType: ContentTypeInfo) {
        var promises = $.when(1);
        var webContentTypes;
        var ctParentId = pnpContentType.ParentId;
        var ctName = pnpContentType.Name;
        var ctGroup = pnpContentType.Group;
        var ctDescription = pnpContentType.Description;
        var fieldRefs = pnpContentType.FieldRefs;
        var docSetTemplate = pnpContentType.DocumentSetTemplate;
        var executeContext = this.getExecuteContext();
        let contentTypeCreated: SP.ContentType;
        let fieldLinks: Array<SP.FieldLink>;
        let fieldLinkCollection: SP.FieldLinkCollection;
        promises = promises.then(() => {
            var web = this.getWeb();
            webContentTypes = web.get_contentTypes();
            var parentContentType = this.getSiteCollection().get_rootWeb().get_availableContentTypes().getById(ctParentId);//considering parent content type is always from root web

            var ctCreationInformation = new SP.ContentTypeCreationInformation();
            ctCreationInformation.set_name(ctName);
            ctCreationInformation.set_group(ctGroup);
            ctCreationInformation.set_description(ctDescription);
            ctCreationInformation.set_parentContentType(parentContentType);
            contentTypeCreated = webContentTypes.add(ctCreationInformation);
            fieldLinkCollection = contentTypeCreated.get_fieldLinks();


            executeContext.load(contentTypeCreated);
            executeContext.load(fieldLinkCollection, 'Include(Id,Name,Hidden)');
            return this.executeQueryPromise();
        });
        promises = promises.then(() => {
            fieldLinks = this.getEnumerationList<SP.FieldLink>(fieldLinkCollection);
            return {};
        });

        if (fieldRefs != null && fieldRefs.length > 0) {
            for (let fr of fieldRefs) {

                promises = promises.then(() => {
                    contentTypeCreated = this.getWeb().get_contentTypes().getById(contentTypeCreated.get_id().toString());

                    var fieldRefId = new SP.Guid(fr.ID);
                    var fieldExists = Utils.arrayFirst<SP.FieldLink>(fieldLinks, (fl) => {

                        return fl.get_id().equals(fieldRefId);
                    }) != null;

                    let fieldLink: SP.FieldLink;
                    if (fieldExists) {
                        fieldLink = contentTypeCreated.get_fieldLinks().getById(fieldRefId);
                    } else {
                        var fieldLinkCreationInfo = new SP.FieldLinkCreationInformation();
                        var field = this.getWeb().get_availableFields().getByInternalNameOrTitle(fr.Name);
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
                    return this.executeQueryPromise();

                });
            }
        }
        promises = promises.then(() => {
            var reorderedFields = Utils.arrayMap(fieldRefs, (f, i) => {
                return f.Name;
            });
            var fieldLinks = contentTypeCreated.get_fieldLinks();
            fieldLinks.reorder(reorderedFields);
            contentTypeCreated.update(true);
            executeContext.load(contentTypeCreated);
            return this.executeQueryPromise();

        });

        if (docSetTemplate) //document set id
        {
            promises = promises.then(() => {
                return this.provisionDocumentSet(docSetTemplate, contentTypeCreated);
            });

        }

        return promises;


    };
    provisionDocumentSet(pnpDocSetTemplate: DocumentSetTemplateInfo, contentType: SP.ContentType) {
        var promises = $.when(1);
        var dsTemplate;
        var welcomeFieldsResponse, allowedContentTypesResponse, sharedFieldsResponse;
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();

        let webAvailableContentCollection: SP.ContentTypeCollection;
        let webAvailableContentTypes: Array<SP.ContentType>;
        promises = promises.then(() => {

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
            return this.executeQueryPromise();
        });
        promises = promises.then(() => {
            var dsAllowedContentTypes = this.getEnumerationList(allowedContentTypesResponse);
            webAvailableContentTypes = this.getEnumerationList<SP.ContentType>(webAvailableContentCollection);
            //add contnet types
            for (var i = 0; i < pnpDocSetTemplate.AllowedContentTypes.length; i++) {
                var pnpAllowedCT = pnpDocSetTemplate.AllowedContentTypes[i];
                var ctDefinition = Utils.arrayFirst<SP.ContentType>(webAvailableContentTypes, (ct) => {
                    return ct.get_name() == pnpAllowedCT.Name;
                });
                var ctExistsInDocumentSet = Utils.arrayFirst(dsAllowedContentTypes, (act) => { //check if content type already exists in document set
                    return (<SP.ContentTypeId>act).get_stringValue().toLowerCase() == ctDefinition.get_id().get_stringValue().toLowerCase();
                }) != null;
                if (!ctExistsInDocumentSet) {
                    dsTemplate.get_allowedContentTypes().add(ctDefinition.get_id());
                }
            }

            //remove content types not needed
            for (var a = 0; a < dsAllowedContentTypes.length; a++) {
                var dsAllowedContentType = dsAllowedContentTypes[a];
                var ctDefinition = Utils.arrayFirst<SP.ContentType>(webAvailableContentTypes, (ct) => {
                    return ct.get_id().get_stringValue().toLowerCase() == (<SP.ContentTypeId>dsAllowedContentType).get_stringValue().toLowerCase();
                });

                var removeCT = Utils.arrayFirst<ContentTypeNameId>(pnpDocSetTemplate.AllowedContentTypes, (ct) => { //check if content type is allowed in document set
                    return ct.Name == ctDefinition.get_name();
                }) == null;
                if (removeCT) {
                    dsTemplate.get_allowedContentTypes().remove(ctDefinition.get_id());
                }
            }


            //add shared fields
            var dsSharedFields = this.getEnumerationList<SP.Field>(sharedFieldsResponse);
            for (var j = 0; j < pnpDocSetTemplate.SharedFields.length; j++) {
                var sField = pnpDocSetTemplate.SharedFields[j];
                var field = web.get_availableFields().getByInternalNameOrTitle(sField.Name);
                var fieldExists = Utils.arrayFirst<SP.Field>(dsSharedFields, (sf) => {
                    return sf.get_internalName() == sField.Name;
                }) != null;
                if (!fieldExists)
                    dsTemplate.get_sharedFields().add(field);
            }

            var dsWelcomePageFields = this.getEnumerationList<SP.Field>(welcomeFieldsResponse);
            for (var k = 0; k < pnpDocSetTemplate.WelcomePageFields.length; k++) {
                var wField = pnpDocSetTemplate.WelcomePageFields[k];
                var wfExists = Utils.arrayFirst<SP.Field>(dsWelcomePageFields, (f) => {
                    return f.get_internalName() == wField.Name;
                }) != null;
                if (!wfExists) {
                    var field = web.get_availableFields().getByInternalNameOrTitle(wField.Name);
                    dsTemplate.get_welcomePageFields().add(field);
                }
            }
            dsTemplate.update(true);
            return this.executeQueryPromise();
        });
        return promises;
    }
    removeAllContentTypesBut(listTitle: string, pnpContentTypeBindings: Array<ContentTypeBindingInfo>, pnpDeafultContentType: ContentTypeBindingInfo) {
        var promises = $.when(1);
        var listContentTypesObj = null;
        var rootFolder = null;
        var executeContext = this.getExecuteContext();
        //get list content types
        promises = promises.then(() => {
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            rootFolder = list.get_rootFolder();
            listContentTypesObj = list.get_contentTypes();
            executeContext.load(listContentTypesObj);
            executeContext.load(rootFolder);
            return this.executeQueryPromise();
        });


        //set default content type
        promises = promises.then(() => {
            var web = this.getWeb();
            var listContentTypes = this.getEnumerationList<SP.ContentType>(listContentTypesObj);

            var reorderedListContentTypes = [];
            var defaultContentType = Utils.arrayFirst<SP.ContentType>(listContentTypes, (ct) => {
                return ct.get_name() == pnpDeafultContentType.Name;
            });
            reorderedListContentTypes.push(defaultContentType.get_id());
            var nonDefaultContentTypes = Utils.arrayFilter(listContentTypes, (ct) => {
                return ct.get_name() != pnpDeafultContentType.Name && !ct.get_stringId().startsWith(Constants.folderContentTypeId);//ignore folder
            });
            for (let ct of nonDefaultContentTypes) {
                reorderedListContentTypes.push(ct.get_id());
            }

            rootFolder.set_uniqueContentTypeOrder(reorderedListContentTypes);
            rootFolder.update();

            var list = web.get_lists().getByTitle(listTitle);
            rootFolder = list.get_rootFolder();
            listContentTypesObj = list.get_contentTypes();
            executeContext.load(listContentTypesObj);
            executeContext.load(rootFolder);

            return this.executeQueryPromise();
        });

        //delete other content types
        promises = promises.then(() => {
            var listContentTypes = this.getEnumerationList<SP.ContentType>(listContentTypesObj);

            var contentTypesToDelete = Utils.arrayFilter(listContentTypes, (lct) => {
                return Utils.arrayFirst<ContentTypeBindingInfo>(pnpContentTypeBindings, (ctb) => {
                    return ctb.Name == lct.get_name();
                }) == null;
            });
            contentTypesToDelete = Utils.arrayFilter(contentTypesToDelete, (ctb) => {//exclude folders
                return !ctb.get_stringId().startsWith('0x012000');
            });
            for (let c of contentTypesToDelete) {
                c.deleteObject();
            }
            return this.executeQueryPromise();
        });

        return promises;
    };
    addEnterpriseKeywordColumnsToList(listTitle: string) {
        var promises = $.when(1);
        var executeContext = this.getExecuteContext();

        promises = promises.then(() => {
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            var taxKeywordField = this.getSiteCollection().get_rootWeb().get_fields().getByInternalNameOrTitle('TaxKeyword');

            list.get_fields().add(taxKeywordField);
            return this.executeQueryPromise();
        });
        var contentTypes = null;
        var contentTypeList = [];
        promises = promises.then(() => {
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            //var taxKeywordField = list.get_fields().getByInternalNameOrTitle('TaxKeyword');
            contentTypes = list.get_contentTypes();
            contentTypeList = executeContext.loadQuery(contentTypes, 'Include(StringId,Id,Name,Fields)');
            return this.executeQueryPromise();

        });
        promises = promises.then(() => {
            var d = $.Deferred();
            var iPromises = $.when(1);
            for (let ct of contentTypeList) {
                if (ct.get_stringId().startsWith(Constants.folderContentTypeId))//no need to process folders
                    continue;
                var fields = this.getEnumerationList<SP.Field>(ct.get_fields());
                var fieldExistsInContentType = Utils.arrayFirst<SP.Field>(fields, (f) => {
                    return f.get_internalName() == 'TaxKeyword';
                }) != null;
                if (!fieldExistsInContentType) {
                    iPromises = iPromises.then(() => {
                        return this.addExistingFieldToListContentType(listTitle, ct.get_id(), 'TaxKeyword');
                    });
                }
            }
            iPromises.then(() => {
                d.resolve();
            }, () => {
                d.reject();
            });
            return d;
        });

        return promises;
    }
    updateListField(listTitle: string, fId: string, fDisplayName: string) {
        var web = this.getWeb();
        var listField = web.get_lists().getByTitle(listTitle).get_fields().getById(new SP.Guid(fId));
        listField.set_title(fDisplayName);
        listField.update();
        return this.executeQueryPromise();
    }
    updateListFieldChoices(listTitle: string, fId: string, choices: Array<string>) {
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();
        var listField = web.get_lists().getByTitle(listTitle).get_fields().getById(new SP.Guid(fId));
        var choiceField = <SP.FieldChoice>executeContext.castTo(listField, SP.FieldChoice);
        choiceField.set_choices(choices);
        choiceField.updateAndPushChanges();
        return this.executeQueryPromise();
    }
    addFieldToList(listTitle: string, fId: string, fDisplayName: string) {
        var promises = $.when(1);
        var webField;
        var executeContext = this.getExecuteContext();
        promises = promises.then(() => {
            var web = this.getWeb();
            var list = web.get_lists().getByTitle(listTitle);
            webField = web.get_availableFields().getById(new SP.Guid(fId));
            executeContext.load(webField);
            list.get_fields().add(webField);
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            if (webField.get_title() == fDisplayName) return {};//display name same so return empty promise;
            return this.updateListField(listTitle, fId, fDisplayName);
        });

        return promises;
    }
    getAvailableFields(propertiesToLoad: string, callback: (fields: Array<SP.Field>) => void) {
        var d = $.Deferred();
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();
        var fields = web.get_availableFields();

        if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
            propertiesToLoad = `Include(${propertiesToLoad})`;
        }
        if (propertiesToLoad)
            executeContext.load(fields, propertiesToLoad);
        else
            executeContext.load(fields);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.Field>(fields));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getAvailableContentTypes(propertiesToLoad: string, callback: (contentTypes: Array<SP.ContentType>) => void) {
        var d = $.Deferred();
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();

        var availableContentTypes = web.get_availableContentTypes();

        if (propertiesToLoad != null && !propertiesToLoad.startsWith('Include(')) {
            propertiesToLoad = `Include(${propertiesToLoad})`;
        }
        if (propertiesToLoad)
            executeContext.load(availableContentTypes, propertiesToLoad);
        else
            executeContext.load(availableContentTypes);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.ContentType>(availableContentTypes));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getCurrentUser(callback: (user: SP.User) => void) {
        var d = $.Deferred();
        var user = this.getSiteCollection().get_rootWeb().get_currentUser();
        var executeContext = this.getExecuteContext();
        executeContext.load(user);
        executeContext.executeQueryAsync(() => {
            callback(user);
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getAllwebs(parentWeb: SP.Web, properties: string, callback: (webs: Array<SP.Web>) => any) {
        var d = $.Deferred();
        //var site = this.getSite();
        //var allWebs = site.get_rootWeb().get_webs();
        var allWebs = parentWeb.get_webs();
        var executeContext = this.getExecuteContext();
        if (!properties.startsWith('Include(')) {
            properties = `Include(${properties})`;
        }
        executeContext.load(allWebs, properties);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.Web>(allWebs));
            d.resolve();
        }, () => {
            d.reject();
        });
        return d;
    }
    getFilesInfo(docLibTitle: string, callback: (fiels: Array<SP.File>) => any) {
        var d = $.Deferred();
        var web = this.getWeb();
        var docLib = web.get_lists().getByTitle(docLibTitle);
        var files = docLib.get_rootFolder().get_files();
        var executeContext = this.getExecuteContext();
        executeContext.load(files);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.File>(files));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getFileContent(webUrl: string, fileServerRelativeUrl: string, callback) {
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
            error: () => {
                callback(null);
            }
        }
        return $.ajax(options);
    }
    getFileContentAsBinary(siteUrl: string, fileServerRelativeUrl: string, callback) {
        var d = $.Deferred();
        var url;
        if (Utils.isAppContext() && !siteUrl.toLowerCase().startsWith(_spPageContextInfo.webAbsoluteUrl.toLowerCase())) {
            url = `${_spPageContextInfo.webAbsoluteUrl}/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('${fileServerRelativeUrl}')/$value?@target='${siteUrl}'`;
        } else
            url = `${siteUrl}/_api/web/GetFileByServerRelativeUrl('${fileServerRelativeUrl}')/$value`;
        var re = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        re.executeAsync({
            url: url,
            method: "GET",
            headers: {
                "accept": "application/json; odata=verbose"
            },
            binaryStringResponseBody: true,
            success: (c) => {
                callback(c.body);
                d.resolve();
            },
            error: () => {
                callback(null);
                d.reject();
            }
        });
        return d;
    }
    getListItems(listTitle: string, maxCount: number, fieldsToLoad: string, callback: (items: Array<SP.ListItem>) => any) {
        var d = $.Deferred();
        var list = this.getWeb().get_lists().getByTitle(listTitle);
        var camlQuery = new SP.CamlQuery();
        if (maxCount == 0) {
            maxCount = 10000;//sorry we support max 10,000;
        }
        camlQuery.set_viewXml(`<View Scope='RecursiveAll'><Query></Query><RowLimit>${maxCount}</RowLimit></View>`);
        var listItems = list.getItems(camlQuery);
        var executeContext = this.getExecuteContext();
        if (fieldsToLoad != null && fieldsToLoad != '')
            executeContext.load(listItems, `Include(${fieldsToLoad})`);

        else
            executeContext.load(listItems);
        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList<SP.ListItem>(listItems));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }
    getListItemsbyIds(listIdOrTitle: string, itemIds: Array<number>, fieldsToLoad: string, callback) {
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();
        var d = $.Deferred();
        var valuesQueryPart = "";
        for (var i = 0; i < itemIds.length; i++) {
            valuesQueryPart += `<Value Type='Counter'>${itemIds[i]}</Value>`;
        }
        var query = `<View Scope='RecursiveAll'><Query><Where><In><FieldRef Name='ID' /><Values>${valuesQueryPart}</Values></In></Where></Query></View>`;
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(query);
        var list = StringUtil.IsGuid(listIdOrTitle) ? web.get_lists().getById(listIdOrTitle) : web.get_lists().getByTitle(listIdOrTitle);
        var listItems = list.getItems(camlQuery);
        if (fieldsToLoad != null && fieldsToLoad != '')
            executeContext.load(listItems, `Include(${fieldsToLoad})`);
        else
            executeContext.load(listItems);

        executeContext.executeQueryAsync(() => {
            callback(this.getEnumerationList(listItems));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();
        });
        return d;
    }

    private mapAndGetCustomActionRights(rights:string) {
            var basePermission = new SP.BasePermissions();
            for (var v in SP.PermissionKind) {
                if (SP.PermissionKind.hasOwnProperty(v) && v.toLowerCase() == rights.toLowerCase()) {
                    var d = SP.PermissionKind[v];
                    basePermission.set(SP.PermissionKind[d]);
                    break;
                }
            }
        return basePermission;
    }
    addCustomAction(customAction: CustomActionInfo) {
        var executeContext = this.getExecuteContext();
        var promises = $.when(1);
        var ribbonXml = null;
        var customActions = null;
        var customActionNodes = new Array<any>();
        let actionsToCreate = new Array<SP.UserCustomAction>();

        promises = promises.then(() => {
            var web = this.getWeb();
            customActions = web.get_userCustomActions();
            executeContext.load(customActions);
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            var actions = this.getEnumerationList<SP.UserCustomAction>(customActions);
            for (let ca of customActionNodes) {
                var existingAction = Utils.arrayFirst<SP.UserCustomAction>(actions, a => {
                    return a.get_name() == $(ca).attr('Id');
                });
                if (existingAction) {
                    existingAction.deleteObject();
                }
            }
            return this.executeQueryPromise();
        });

        if (customAction.CommandUIExtension == null) { //inline custom action, not an url
            promises = promises.then(() => {
                var web = this.getWeb();
                var newAction = web.get_userCustomActions().add();
                //var newAction = new SP.UserCustomAction();
                newAction.set_name(customAction.Name);
                newAction.set_description(customAction.Description);
                newAction.set_sequence(customAction.Sequence);
                newAction.set_location(customAction.Location);
                var scriptSrc = this.getPageContextFullUrl(customAction.ScriptSrc);
                newAction.set_scriptSrc(scriptSrc);
                if(customAction.Group)
                    newAction.set_group(customAction.Group);
                if (customAction.Rights)
                    newAction.set_rights(this.mapAndGetCustomActionRights(customAction.Rights));
                if (customAction.Url) {
                    newAction.set_url(customAction.Url);
                }
                actionsToCreate.push(newAction);
                newAction.update();
                return this.executeQueryPromise();
            });
            return promises;
        }

        //custom action is url, so load the file from url and process it
        promises = promises.then(() => {
            if (customAction.CommandUIExtension.Xml) {
                customActionNodes.push(customAction.CommandUIExtension.Xml);
            }
            var templateFileUrl = this.getPageContextFullUrl(customAction.CommandUIExtension.Url);
            return this.getFileContent(_spPageContextInfo.webServerRelativeUrl, templateFileUrl, (xml) => {
                ribbonXml = xml;
                var actionxml = $.parseXML(ribbonXml);
                customActionNodes = <any>$(actionxml).find('CustomAction');
            });
        });

        promises = promises.then(() => {
            var d = $.Deferred();
            var iPromies = $.when(1);
            for (let customActionNode of customActionNodes) {

                iPromies = iPromies.then(() => {
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
                    } else {
                        if (window['XMLSerializer']) {//jQuery parsing in IE doesn't work so need to use window.XMLSerializer for IE
                            var serializer = <XMLSerializer>new (<any>window).XMLSerializer;
                            xmlContent = serializer.serializeToString($(cmdExtension).get(0));
                        } else {
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

                    var web = this.getWeb();
                    var customAction = web.get_userCustomActions().add();
                    customAction.set_name(customActionName);

                    customAction.set_title($(customActionNode).attr('Title'));
                    customAction.set_location(location);

                    if (groupId)
                        customAction.set_group(groupId);

                    if (rights) {
                        customAction.set_rights(this.mapAndGetCustomActionRights(rights));
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
                    return this.executeQueryPromise();
                });


            }

            iPromies.done(() => {
                d.resolve();
            })
                .fail(() => {
                    d.reject();
                });

            return d;

        });

        return promises;
    }
    addWorkflowSubscription(pnpWFSubscription: WFSubscriptionInfo) {
        var promises = $.when(1);
        let allLists: Array<ListInfo>;
        var historyList, taskList;
        var historyListId, taskListId, targetListId;
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();
        promises = promises.then(() => {

            return this.getAllLists((lsts) => {
                allLists = lsts;
            });
        });
        promises = promises.then(() => {
            historyList = Utils.arrayFirst<ListInfo>(allLists, (l) => {
                return l.Title.toLowerCase() == pnpWFSubscription.HistoryListTitle.toLowerCase();
            });
            taskList = Utils.arrayFirst<ListInfo>(allLists, (l) => {
                return l.Title.toLowerCase() == pnpWFSubscription.TaskListTitle.toLowerCase();
            });
            var targetList = pnpWFSubscription.ListTitle == null ? null : Utils.arrayFirst<ListInfo>(allLists, (l) => {
                return l.Title.toLowerCase() == pnpWFSubscription.ListTitle.toLowerCase();
            });
            if (targetList) {
                //targetListId = targetList.get_id ? targetList.get_id().toString() : targetList.id;
                targetListId = targetList.ID;
            }
            return {};
        });

        promises = promises.then(() => {
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
                return this.executeQueryPromise();
            }
            else return {
            };
        });

        promises = promises.then(() => {
            taskListId = taskList.get_id ? taskList.get_id().toString() : taskList.id;
            historyListId = historyList.get_id ? historyList.get_id().toString() : historyList.id;
            return this.publishWorkflowSubscription(pnpWFSubscription, taskListId, historyListId, targetListId);
        });

        return promises;
    }
    publishWorkflowSubscription(pnpWFSubscription: WFSubscriptionInfo, taskListId: string, historyListId: string, targetListId: string) {
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();
        let wfSubscriptions: Array<SP.WorkflowServices.WorkflowSubscription>;
        let wfSubscriptionCollection: SP.WorkflowServices.WorkflowSubscriptionCollection;
        var wfServiceManager, wfSubscriptionService;
        var promises = $.when(1);
        var subscriptionExists = false;

        promises = promises.then(() => {
            var d = $.Deferred();
            Utils.loadWFScripts(() => {
                wfServiceManager = new SP.WorkflowServices.WorkflowServicesManager(executeContext, web);
                wfSubscriptionService = wfServiceManager.getWorkflowSubscriptionService();
                d.resolve();
            });
            return d;
        });
        promises = promises.then(() => {
            if (targetListId == null) {
                wfSubscriptionCollection = wfSubscriptionService.enumerateSubscriptionsByDefinition(pnpWFSubscription.WFDefinitionId);
                executeContext.load(wfSubscriptionCollection);
                return this.executeQueryPromise();
            }
            return {};
        });

        promises = promises.then(() => {
            if (targetListId == null) {
                wfSubscriptions = this.getEnumerationList<SP.WorkflowServices.WorkflowSubscription>(wfSubscriptionCollection);
                subscriptionExists = Utils.arrayFirst<SP.WorkflowServices.WorkflowSubscription>(wfSubscriptions, (s) => {
                    return s.get_name() == pnpWFSubscription.Name;
                }) != null;

                //if (wfSubscription) {
                //    wfSubscriptionService.deleteSubscription(wfSubscription.get_id());
                //    executeContext.load(web);
                //    return executeContext.executeQueryPromise();
                //}
            }
            return {};
        });

        promises = promises.then(() => {
            if (subscriptionExists) {
                this._logger.log(`workflow subscription ${pnpWFSubscription.Name} exists.`);
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
            return this.executeQueryPromise();
        });
        return promises;
    }
    private getNavSource(pnpType: string): SP.Publishing.Navigation.StandardNavigationSource {
        if (pnpType == 'Inherit')
            return SP.Publishing.Navigation.StandardNavigationSource.inheritFromParentWeb;
        else if (pnpType == 'Structural')
            return SP.Publishing.Navigation.StandardNavigationSource.portalProvider;
        else if (pnpType == 'Managed')
            return SP.Publishing.Navigation.StandardNavigationSource.taxonomyProvider;
        return SP.Publishing.Navigation.StandardNavigationSource.unknown;

    }
    private getNavigationNodeUrl(url: string): string {
        var executeContext = this.getExecuteContext();
        if (url == null || url == '') return '';
        if (url == '/') return executeContext.get_url();
        if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://') || url.startsWith('/')) return url;

        return executeContext.get_url() + '/' + url;
    }
    provisionNavigation(pnpNavigation) {
        var d = $.Deferred();
        Utils.loadPublishingScripts(() => {
            this.provisionNavigationInternal(pnpNavigation).done(() => {
                d.resolve();
            }).fail(() => {
                d.reject();
            });
        });
        return d;
    }
    private provisionNavigationInternal(pnpNavigation) {
        var promises = $.when(1);
        var pnpGlobalNavigation = pnpNavigation.GlobalNavigation;
        var pnpCurrentNavigation = pnpNavigation.CurrentNavigation;

        let quickLaunches: SP.NavigationNodeCollection;

        var web = this.getWeb();
        var executeContext = this.getExecuteContext();


        promises = promises.then(() => {
            let webNavSettings = new SP.Publishing.Navigation.WebNavigationSettings(executeContext, web);
            webNavSettings.set_addNewPagesToNavigation(false); //don't add new pages in navigation by default
            var currentNavigation = webNavSettings.get_currentNavigation();
            var globalNavigation = webNavSettings.get_globalNavigation();
            let currentNavSource = this.getNavSource(pnpCurrentNavigation.NavigationType);
            let globalNavSource = this.getNavSource(pnpGlobalNavigation.NavigationType);
            currentNavigation.set_source(currentNavSource);
            globalNavigation.set_source(globalNavSource);

            webNavSettings.update(null);
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            quickLaunches = web.get_navigation().get_quickLaunch();
            executeContext.load(quickLaunches);
            return this.executeQueryPromise();
        });


        promises = promises.then(() => {
            if (pnpCurrentNavigation.StructuralNavigation == null || pnpCurrentNavigation.StructuralNavigation.NavigationNode == null) return {};
            if (pnpCurrentNavigation.StructuralNavigation && pnpCurrentNavigation.StructuralNavigation.RemoveExistingNodes == true) {
                var c = quickLaunches.get_count();
                for (var i = 0; i < c; i++) {
                    quickLaunches.get_item(0).deleteObject();
                }
            }

            var pnpNavigationNodes = pnpCurrentNavigation.StructuralNavigation.NavigationNode;

            this.addNavNodeRecursive(pnpNavigationNodes, quickLaunches, null);

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
            return this.executeQueryPromise();

        });

        return promises;
    }
    private addNavNodeRecursive(pnpNodes, quickLaunches: SP.NavigationNodeCollection, parentNode: SP.NavigationNode) {
        if (pnpNodes == null) return;
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
    }
    provisionPublishingPages(pnpPages) {
        var d = $.Deferred();
        Utils.loadPublishingScripts(() => {
            this.provisionPublishingPagesInternal(pnpPages).done(() => {
                d.resolve();
            }).fail(() => {
                d.reject();
            });
        });
        return d;
    }
    private provisionPublishingPagesInternal(pnpPages: Array<PublishingPageInfo>) {
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();

        var promises = $.when(1);
        let pageLayouts: Array<SP.ListItem>;
        let pageLayoutCollection: SP.ListItemCollection;
        let publishingPages: Array<SP.ListItem>;
        promises = promises.then(() => {
            var masterPageGallery = this.getSiteCollection().get_rootWeb().get_lists().getByTitle('Master Page Gallery');
            var camlQuery = new SP.CamlQuery();
            var query = `<View><Query><Where><BeginsWith><FieldRef Name='ContentTypeId' /><Value Type='ContentTypeId'>${Constants.pageLayoutContentTypeId}</Value></BeginsWith></Where></Query><ViewFields><FieldRef Name='Title' /></ViewFields></View>`;
            camlQuery.set_viewXml(query);
            pageLayoutCollection = masterPageGallery.getItems(camlQuery);
            executeContext.load(pageLayoutCollection);
            executeContext.load(web, 'Title', 'ServerRelativeUrl');
            return this.executeQueryPromise();
        });
        promises = promises.then(() => {
            pageLayouts = this.getEnumerationList<SP.ListItem>(pageLayoutCollection);
            return this.getListItems('Pages', 100, 'FileLeafRef', (pgs) => {
                publishingPages = pgs;
            });
        });

        var webServerRelativeUrl = web.get_serverRelativeUrl();
        for (let pnpPage of pnpPages) {
            var newPage, pageExists;

            promises = promises.then(() => {
                var pageServerRelativeUrl = webServerRelativeUrl + '/' + pnpPage.Url;
                pageExists = Utils.arrayFirst(publishingPages, (pp) => {
                    return pp.get_item('FileLeafRef').toLowerCase() == pageServerRelativeUrl.toLowerCase();
                }) != null;
                return {};
            });

            promises = promises.then(() => {
                if (pageExists) return {};
                var publishingWeb = SP.Publishing.PublishingWeb.getPublishingWeb(executeContext, web);
                var pubPageInfo = new SP.Publishing.PublishingPageInformation();
                pubPageInfo.set_name(pnpPage.Url);

                var pageLayout = Utils.arrayFirst(pageLayouts, (pl) => {
                    return pl.get_item('Title') != null && pl.get_item('Title').toLowerCase() == pnpPage.Layout.toLowerCase();
                });

                pubPageInfo.set_pageLayoutListItem(pageLayout);
                newPage = publishingWeb.addPublishingPage(pubPageInfo);
                executeContext.load(newPage);
                return this.executeQueryPromise();
            });
            promises = promises.then(() => {
                if (pageExists) return {};
                var pageListItem = newPage.get_listItem();
                pageListItem.set_item("Title", pnpPage.Title);
                if (pnpPage.SEOTitle) {
                    pageListItem.set_item('SeoBrowserTitle', pnpPage.SEOTitle);
                }
                pageListItem.update();
                pageListItem.get_file().checkIn();
                pageListItem.get_file().publish("Publishing after creation");
                return this.executeQueryPromise();
            });

            promises = promises.then(() => {
                if (!pageExists && pnpPage.Security != null) {
                    var d = $.Deferred();
                    this.applySecurity(newPage.get_listItem(), pnpPage.Security).then(() => {
                        d.resolve();
                    }, () => {
                        d.reject();
                    });
                    return d;
                }
                return {};
            });


        }


        return promises;
    }
    private applySecurity(securableObject: SP.SecurableObject, pnpSecurity: ObjectSecurityInfo) {
        var pnpPermission = pnpSecurity.BreakRoleInheritance;
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();
        let roleAssignments: Array<SP.RoleAssignment>;
        let siteGroups: Array<SP.Group>;
        let roleAssignmentCollection: SP.RoleAssignmentCollection;
        var siteGroupCollection: SP.GroupCollection;

        var promises = $.when(1);

        promises = promises.then(() => {
            securableObject.breakRoleInheritance(pnpPermission.CopyRoleAssignments, pnpPermission.ClearSubscopes);
            executeContext.load(web, 'Title');
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            roleAssignmentCollection = securableObject.get_roleAssignments();
            executeContext.load(roleAssignmentCollection, 'Include(Member,RoleDefinitionBindings.Include(Name))');
            siteGroupCollection = web.get_siteGroups();
            executeContext.load(siteGroupCollection, 'Include(LoginName)');
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            roleAssignments = this.getEnumerationList<SP.RoleAssignment>(roleAssignmentCollection);
            siteGroups = this.getEnumerationList<SP.Group>(siteGroupCollection);
            return {};
        });


        for (let pnpRoleAssignment of pnpPermission.RoleAssignment) {
            promises = promises.then(() => {
                var roleDefinitionName = pnpRoleAssignment.RoleDefinition;
                var roleDefinition = web.get_roleDefinitions().getByName(roleDefinitionName);

                //check role in current object
                var existingRole = Utils.arrayFirst(roleAssignments, (ra) => {
                    return ra.get_member().get_title().toLowerCase() == pnpRoleAssignment.Principal.toLowerCase();
                });

                if (existingRole == null) {
                    let newRole: SP.Principal = Utils.arrayFirst(siteGroups, (sg) => {
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
                    var existingRoleBindings = this.getEnumerationList<SP.RoleDefinition>(existingRole.get_roleDefinitionBindings());
                    var existingRoleBinding = Utils.arrayFirst(existingRoleBindings, (rdb) => {
                        return rdb.get_name().toLowerCase() == roleDefinitionName.toLowerCase();
                    });
                    if (existingRoleBinding == null) {
                        //var roleDefinitionBindingCollection = new SP.RoleDefinitionBindingCollection.newObject(executeContext);
                        //existingRole.get_roleDefinitionBindings().removeAll();
                        existingRole.get_roleDefinitionBindings().add(roleDefinition);
                        existingRole.update();
                    }
                }
                return this.executeQueryPromise();
            });

        }
        return promises;
    }
    getRESTRequest(url, callback) {
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
    }
    startWorkflowOnListItem(subscription: SP.WorkflowServices.WorkflowSubscription, itemId: number, initiationParameters) {
        var d = $.Deferred();
        var executeContext = this.getExecuteContext();
        var web = this.getWeb();
        Utils.loadWFScripts(() => {
            var wfServicesManager = new SP.WorkflowServices.WorkflowServicesManager(executeContext, web);
            var instanceService = wfServicesManager.getWorkflowInstanceService();
            if (itemId != null && itemId != 0)
                instanceService.startWorkflowOnListItem(subscription, itemId, initiationParameters);
            else
                instanceService.startWorkflow(subscription, initiationParameters);

            executeContext.executeQueryAsync(() => {
                d.resolve();
            }, () => {
                d.reject();
            });
        });
        return d;
    }
    setWelcomePage(url: string) {
        var web = this.getWeb();
        var rootFolder = web.get_rootFolder();
        rootFolder.set_welcomePage(url);
        rootFolder.update();
        return this.executeQueryPromise();
    }
    getFromExternalService(url: string, callback) {
        var d = $.Deferred();
        var request = new SP.WebRequestInfo();
        request.set_url(url);
        request.set_method("GET");
        request.set_headers({
            "Accept": "application/json;odata=verbose"
        });
        var executeContext = this.getExecuteContext();
        var response = SP.WebProxy.invoke(executeContext, request);
        executeContext.executeQueryAsync(() => {
            if (response == null || response.get_statusCode() != 200) {
                callback(null);
                d.reject();
                return;
            }
            callback(JSON.parse(response.get_body()));
            d.resolve();
        }, () => {
            callback(null);
            d.reject();

        });
        return d;
    }
    private getInnerHTMLContent(node: Node) {
        if ((<Element>node).innerHTML) return (<Element>node).innerHTML;
        var elementNode;
        if (node.childNodes.length == 1) {
            elementNode = node.childNodes[0];
        }
        else {
            let contentNode: Node;
            for (var i = 0; i < node.childNodes.length; i++) {
                var n = node.childNodes[i];
                if (n.nodeType == n.ELEMENT_NODE) {
                    contentNode = n;
                    break;
                }
            }
            return (<Element>contentNode).innerHTML;
        }
        var serializer = <XMLSerializer>(new (<any>window).XMLSerializer);
        return serializer.serializeToString(elementNode);
    }
    addAttachmentToListItem(siteUrl: string, listTitle: string, listItemId: string, fileName: string, content: any) {
        var d = $.Deferred();
        var re = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        try {
            var url = `${_spPageContextInfo.webAbsoluteUrl}/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('${listTitle}')/items(${listItemId})/AttachmentFiles/add(FileName='${fileName}')?@target='${siteUrl}'`;
            re.executeAsync({
                url: url,
                method: "POST",
                binaryStringRequestBody: true,
                body: content,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: () => {
                    d.resolve();
                },
                error: () => {
                    d.reject();
                }
            });
        } catch (e) {
            d.reject();
        }
        return d;
    }
    populateList(listTitle: string, dataRows: Array<any>) {
        var web = this.getWeb();
        var executeContext = this.getExecuteContext();
        var promises = $.when(1);

        var rowsToAdd = [], existingRows;

        promises = promises.then(() => {
            executeContext.load(web, 'Url');
            return this.executeQueryPromise();
        });

        promises = promises.then(() => {
            return this.parseDataRows(dataRows, (rs) => {
                rowsToAdd = rs;
            });
        });

        promises = promises.then(() => {
            var d = $.Deferred();
            var list = web.get_lists().getByTitle(listTitle);
            var iPromises = $.when(1);
            for (let dr of rowsToAdd) {
                var listItem;
                iPromises = iPromises.then(() => {
                    var liCreationInfo = new SP.ListItemCreationInformation();
                    listItem = list.addItem(liCreationInfo);
                    for (var propertyName in dr) {
                        if (dr.hasOwnProperty(propertyName) && propertyName != '_Attachments')
                            listItem.set_item(propertyName, dr[propertyName]);
                    }
                    executeContext.load(listItem, 'Id');
                    listItem.update();
                    return this.executeQueryPromise();
                });

                if (dr._Attachments && dr._Attachments.length > 0) {
                    for (let attachment of dr._Attachments) {
                        iPromises = iPromises.then(() => {
                            var fileUrl = attachment.Url.startsWith('/') ? attachment.Url : _spPageContextInfo.webServerRelativeUrl + '/' + attachment.Url;
                            var content = null;
                            return this.getFileContentAsBinary(_spPageContextInfo.webAbsoluteUrl, fileUrl, (c) => {
                                content = c;
                            }).then(() => {
                                return this.addAttachmentToListItem(web.get_url(), listTitle, listItem.get_id(), attachment.Name, content);
                            });


                        });
                    }
                }

            }
            iPromises.done(() => {
                d.resolve();
            }).fail(() => {
                d.reject();
            });

            return d;
        });

        return promises;
    }
    private getPageContextFullUrl(url) {
        return url.startsWith('/') ? url : _spPageContextInfo.webServerRelativeUrl + '/' + url;
    }
    private parseDataRows(dataRows: Array<any>, callback) {
        var promises = $.when(1);
        var rowsToAdd = [];

        for (let dr of dataRows) {
            if (dr._url == null) {
                rowsToAdd.push(dr);
                continue;
            }

            //data row is an url, so load rows from url

            promises = promises.then(() => {
                var fileUrl = this.getPageContextFullUrl(dr._url);
                return this.getFileContent(_spPageContextInfo.webAbsoluteUrl, fileUrl, (c) => {
                    if (dr._type != 'xml') return; //support xml only now, will support json if I get paid.
                    var xmlResponse = $.parseXML(c);
                    if (xmlResponse.firstChild.localName != 'DataRows') return;
                    for (var j = 0; j < xmlResponse.firstChild.childNodes.length; j++) {
                        var row = xmlResponse.firstChild.childNodes[j];
                        if (row.nodeType != row.ELEMENT_NODE || row.localName != 'DataRow') continue;
                        var r = {
                        };
                        for (var k = 0; k < row.childNodes.length; k++) {
                            if (row.childNodes[k].nodeType == row.ELEMENT_NODE)
                                r[row.childNodes[k].localName] = this.getInnerHTMLContent(row.childNodes[k]);
                        }
                        rowsToAdd.push(r);

                    }
                });
            });


        }

        promises = promises.then(() => {
            callback(rowsToAdd);
            return {};
        });

        return promises;
    }
    setupPermissionForList(listTitle: string, pnpSecurity: ObjectSecurityInfo) {
        var web = this.getWeb();
        var list = web.get_lists().getByTitle(listTitle);
        return this.applySecurity(list, pnpSecurity);
    }

}

