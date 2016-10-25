/// <reference path="../../_layouts/15/init.debug.js" />
/// <reference path="../../_layouts/15/SP.Core.debug.js" />
/// <reference path="../../_layouts/15/SP.Runtime.debug.js" />
/// <reference path="../../_layouts/15/SP.debug.js" />
/// <reference path="../../_layouts/15/sp.workflowservices.debug.js" />
/// <reference path="../../_layouts/15/SP.DocumentManagement.debug.js" />
/// <reference path="../../_layouts/15/sp.publishing.debug.js" />

/// <reference path="knockout-3.3.0.js" />


var softract = softract || {};
softract.common = softract.common || {};


var rawWhen = $.when;
$.when = function (promise) {
    if ($.isArray(promise)) {
        var dfd = new jQuery.Deferred();
        rawWhen.apply($, promise)
            .done(function () {
                dfd.resolve(Array.prototype.slice.call(arguments));
            })
            .fail(function () {
                dfd.reject(Array.prototype.slice.call(arguments));
            });
        return dfd.promise();
    } else {
        return rawWhen.apply($, arguments);
    }
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (needle, caseInsensitive) {
        for (var i = 0; i < this.length; i++) {
            if (caseInsensitive == false) {
                if (this[i] === needle) {
                    return i;
                }
            }
            else {
                if (this[i].toLowerCase() === needle.toLowerCase()) {
                    return i;
                }
            }
        }
        return -1;
    };
}
if (!String.prototype.replaceAll) {
    //http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        var search = search.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

ExecuteOrDelayUntilScriptLoaded(function () {
    ExecuteOrDelayUntilScriptLoaded(function () {

        SP.ClientContext.prototype.executeQueryPromise = function () {
            var deferred = $.Deferred();
            this.executeQueryAsync(
                function (a, b, c) {
                    deferred.resolve(arguments);
                },
                function (a, b, c) {
                    deferred.reject(arguments);
                    softract.common.uiManager.log('ERROR!' + b.get_message());
                }
            );
            return deferred.promise();
        };
    }, "sp.js");
}, "sp.runtime.js");

softract.common.constants = softract.common.constants || (function () {
    var folderContentTypeId = '0x012000';
    var CDRLTaskBaseContentTypeId = '0x010800440874A0E71F4BE7A2F09DE230DC3DBE';
    var CDRLTaskListTitle = 'Workflow Tasks';
    var WorkflowStatusListTitle = "Workflow Status";
    var CDRLListTitle = 'CDRL List';
    var DocumentsLibraryTitle = 'Documents';
    var CDRLTaskContentTypeName = 'CDRL Task';
    var CDRLDocumentSetContentTypeId = '0x0120D52000DF7EEDA66222417CA6D69ADC1F6FA294';
    var PageLayoutContentTypeId = '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811';
    var CDRLDocumentBaseContentType = '0x010100F0F3AEF4E25C4BB28AC7055B994C2ACF';
    var PeerReviewStatusFieldName = 'Peer_x0020_Review_x0020_Status';
    var PMApprovalStatusFieldName = 'PM_x0020_Approval_x0020_Status';
    var COASubmissionStatusFieldName = 'COA_x0020_Submission_x0020_Status';
    var _siteCreationAddInProductId = '{3dd5bf39-2ba1-471e-90b4-0ea7d9b9eaf9}';
    var _peerReviewWorkflowName = 'Peer Review';
    var _internalWorkflowName = 'PM Approval';
    var _externalWorkflowName = 'COA Submission';
    var _taskCancellationWorkflowName = 'Task Cancellation';
    var _siteConfigListTitle = 'Site Config';
    var _ocdlListTitle = "OCDL";
    var _fpsListTitle = "FPS";
    var _mssListTitle = "MSS";
    var _testPlanListTitle = "Test Plan";
    var _correspondenceBaseContentTypeId = '0x010100C0D2066864CA4A11942B175F78E9782F';

    return {
        SiteCreationAddInProductId: _siteCreationAddInProductId,
        PageLayoutContentTypeId: PageLayoutContentTypeId, CorrespondenceBaseContentTypeId: _correspondenceBaseContentTypeId,
        WorkflowStatusListTitle: WorkflowStatusListTitle, COASubmissionStatusFieldName: COASubmissionStatusFieldName,
        PMApprovalStatusFieldName: PMApprovalStatusFieldName, PeerReviewStatusFieldName: PeerReviewStatusFieldName,
        CDRLDocumentBaseContentType: CDRLDocumentBaseContentType, CDRLDocumentSetContentTypeId: CDRLDocumentSetContentTypeId,
        CDRLTaskContentTypeName: CDRLTaskContentTypeName, folderContentTypeId: folderContentTypeId,
        CDRLTaskListTitle: CDRLTaskListTitle, CDRLListTitle: CDRLListTitle, DocumentsLibraryTitle: DocumentsLibraryTitle,
        CDRLTaskBaseContentTypeId: CDRLTaskBaseContentTypeId, PeerReviewWorkflowName: _peerReviewWorkflowName,
        InternalWorkflowName: _internalWorkflowName, ExternalWorkflowName: _externalWorkflowName, TaskCancellationWorkflowName: _taskCancellationWorkflowName,
        SiteConfigListTitle: _siteConfigListTitle, OCDLListTitle: _ocdlListTitle, FPSListTitle: _fpsListTitle, MSSListTitle: _mssListTitle, TestPlanListTitle: _testPlanListTitle
    }
})();

softract.common.uiManager = softract.common.uiManager || (function () {
    var waitDialog;
    var showNotification = function (title, msg, isError) {
        SP.UI.Status.removeAllStatus(true);
        var notificationId = SP.UI.Status.addStatus(title, msg);
        if (isError)
            SP.UI.Status.setStatusPriColor(notificationId, 'red');
        else
            SP.UI.Status.setStatusPriColor(notificationId, 'green');
        setTimeout(function () { SP.UI.Status.removeStatus(notificationId); }, 10000);
    };
    var showStickyNotification = function (title, msg, isError) {
        SP.UI.Status.removeAllStatus(true);
        var notificationId = SP.UI.Status.addStatus(title, msg);
        if (isError)
            SP.UI.Status.setStatusPriColor(notificationId, 'red');
        else
            SP.UI.Status.setStatusPriColor(notificationId, 'green');
        //setTimeout(function () { SP.UI.Status.removeStatus(notificationId); }, 10000);
    };
    var showShortNotification = function (msg, isError) {
        SP.UI.Status.removeAllStatus(true);
        var notificationId = SP.UI.Status.addStatus(msg);
        if (isError)
            SP.UI.Status.setStatusPriColor(notificationId, 'red');
        else
            SP.UI.Status.setStatusPriColor(notificationId, 'green');
        setTimeout(function () { SP.UI.Status.removeStatus(notificationId); }, 2000);
    };
    var showDialog = function (header, msg) {
        SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function () {
            if (waitDialog) {
                closeDialog();
            }
            waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose(header, msg, 150, 550);
        });

    };
    var closeDialog = function () {
        if (waitDialog) {
            waitDialog.close();
        }
    };
    var clearAllNotification = function () {
        SP.UI.Status.removeAllStatus(true);
    };

    var log = function (msg, isError) {
        console.log(msg);
        //if (isError) {
        //    $('#siteCreationStatus').append("<div>ERROR:" + msg + "</div>");
        //}
        //else
        //    $('#siteCreationStatus').append("<div><img src='../Images/tick.png'/>" + msg + "</div>");
    };
    return { clearAllNotification: clearAllNotification, showStickyNotification: showStickyNotification, showNotification: showNotification, showShortNotification: showShortNotification, showDialog: showDialog, closeDialog: closeDialog, log: log };

})();

softract.common.siteConfig = softract.common.siteConfig || (function () {
    var context = null;
    var configValues = null;
    var hasInitialized = ko.observable();
    var getConfigValue = function (key) {
        if (configValues) {
            var configItem = ko.utils.arrayFirst(configValues, function (cv) {
                return cv.get_item('softractSiteConfigKey') == key;
            });
            return configItem ? configItem.get_item('softractSiteConfigValue') : null;
        }
        else {
            return null;
        }
    }

    var getServiceEndPointUrl = function () {
        var serviceEndpointUrl = softract.common.siteConfig.getConfigValue('ServiceEndPoint');
        var environment = softract.common.siteConfig.getConfigValue('Environment');
        if (environment) {
            return serviceEndpointUrl + '/' + environment;
        }
        return serviceEndpointUrl;
    }

    var setConfigValue = function (key, value) {
        var listItem = ko.utils.arrayFirst(configValues, function (cv) {
            return cv.get_item('softractSiteConfigKey') == key;
        });
        listItem.set_item('softractSiteConfigValue', value);
        listItem.update();
    }

    var saveChanges = function () {
        return softract.spHelper.getExecuteContext(context).executeQueryPromise();
    };

    var initialize = function (spcontext) {
        context = spcontext;
        if (configValues) {
            var d = $.Deferred();
            d.resolve();
            return d;
        };
        return softract.spHelper.getListItems(context, softract.common.constants.SiteConfigListTitle, 0, null, function (items) {
            configValues = items;
        });
    }
    return { initialize: initialize, getServiceEndPointUrl: getServiceEndPointUrl, getConfigValue: getConfigValue, setConfigValue: setConfigValue, saveChanges: saveChanges }
})();

softract.utils = softract.utils || (function () {
    var getQueryStringParameter = function (paramToRetrieve) {
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
    var loadWFScripts = function (callback) {
        ExecuteOrDelayUntilScriptLoaded(function () {
            ExecuteOrDelayUntilScriptLoaded(function () {
                SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
                SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", callback);
            }, "sp.js");
        }, "sp.runtime.js");
    };

    var loadPublishingScripts = function (callback) {
        ExecuteOrDelayUntilScriptLoaded(function () {
            ExecuteOrDelayUntilScriptLoaded(function () {
                SP.SOD.registerSod('sp.publishing.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.publishing.js'));
                SP.SOD.executeFunc('sp.publishing.js', "SP.Publishing.PublishingWeb", callback);

            }, "sp.js");
        }, "sp.runtime.js");
    }

    var loadAppWebUrl = function (context, appProductId, callback) {
        var d = $.Deferred();
        var web = context.get_web();
        var appInstances = web.getAppInstancesByProductId(appProductId);
        context.load(appInstances);
        context.executeQueryAsync(function () {
            var appInstance = appInstances.get_count() == 1 ? appInstances.getItemAtIndex(0) : null;
            if (appInstance == null) {
                callback(null);
                d.reject();
            } else {
                callback(appInstance.get_appWebFullUrl());
                d.resolve();
            }
        }, function () {
            callback(null);
            d.reject();
        });

        return d;
    }
    var isGuid = function (str) {
        var regex = /^((\{[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}\})|([0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}))$/i;

        return regex.test(str);
    }

    var guidEquals = function (firstGuid, secondGuid) {
        return (firstGuid.replace(/[{}]/g, "").toLowerCase() === secondGuid.replace(/[{}]/g, "").toLowerCase());
    }
    function getHostUrl(url) {
        var hostUrl = url;

        if (hostUrl.lastIndexOf('/') > hostUrl.indexOf('//') + 1) {
            hostUrl = hostUrl.substring(0, hostUrl.indexOf('/', hostUrl.indexOf('//') + 2));
        }
        return hostUrl;
    }

    return {
        getHostUrl: getHostUrl, guidEquals: guidEquals, isGuid: isGuid, loadPublishingScripts: loadPublishingScripts, loadWFScripts: loadWFScripts, getQueryStringParameter: getQueryStringParameter, loadAppWebUrl: loadAppWebUrl
    }
})();


softract.customactions = softract.customactions || (function () {

    var navigateToApplyTemplatePage = function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            var rootWeb = _spPageContextInfo.siteServerRelativeUrl == _spPageContextInfo.webServerRelativeUrl;
            if (rootWeb) {
                softract.common.uiManager.showNotification('Apply Template', 'Template cannot be applied to this site.', true);
                return;
            }
            var context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl);
            softract.utils.loadAppWebUrl(context, softract.common.constants.SiteCreationAddInProductId, function (url) {
                if (url == null)
                    softract.common.uiManager.showNotification('Error', 'failed to load app details', true);
                else
                    document.location = url + '/pages/ApplyTemplate.aspx?SPHostUrl=' + encodeURIComponent(_spPageContextInfo.siteAbsoluteUrl) + '&ApplyToWebUrl=' + encodeURIComponent(_spPageContextInfo.webServerRelativeUrl);
            });
        });
    }


    return {
        navigateToApplyTemplatePage: navigateToApplyTemplatePage
    }

})();


$(document).ready(function () {
    softract.common.contextInfo = softract.common.contextInfo || (function () {
        var hostWebUrl = decodeURIComponent(softract.utils.getQueryStringParameter("SPHostUrl"));
        var appWebUrl = decodeURIComponent(softract.utils.getQueryStringParameter("SPAppWebUrl"));
        var isAppWeb = (_spPageContextInfo && _spPageContextInfo.webTemplate == 17);
        if (appWebUrl == null || appWebUrl == '') {
            appWebUrl = isAppWeb ? _spPageContextInfo.webAbsoluteUrl : ''; //17 is app web template
        }

        return {
            hostWebUrl: hostWebUrl,
            appWebUrl: appWebUrl,
            isAppWeb: isAppWeb
        };
    })();
});

softract.csr = softract.csr | {
};
softract.csr.documentsListView = softract.csr.documentsListView || (function () {
    if (typeof SPClientTemplates === 'undefined')
        return;
    function renderFieldValue(ctx) {
        var fieldValue = ctx.CurrentItem[ctx.CurrentFieldSchema.RealFieldName];
        if (ctx.CurrentItem.ContentTypeId.startsWith(softract.common.constants.CDRLDocumentSetContentTypeId))
            return fieldValue;

        var controlId = "softract_{0}_{1}".format(ctx.CurrentFieldSchema.RealFieldName, ctx.CurrentItem.ID);
        if (ctx.CurrentFieldSchema.RealFieldName == softract.common.constants.PeerReviewStatusFieldName)
            loadDetailsAndUpdateUrl(controlId, ctx.listName, ctx.CurrentItem.ID);

        return fieldValue == '' ? "<div></div>" : "<a href='#' id='{0}'>{1}</a>".format(controlId, fieldValue);
    }

    function loadDetailsAndUpdateUrl(controlId, listId, itemId) {
        var url = "{0}/_api/web/Lists/GetById('{1}')/items({2})?$expand=softractWFStatusLookup&$select=softractWFStatusLookup/softractWFStatusPRWfID,softractWFStatusLookup/softractWFStatusPMAWfID,softractWFStatusLookup/softractWFStatusCOAWfID".format(_spPageContextInfo.webAbsoluteUrl, listId, itemId);
        $.ajax({
            url: url,
            'method': 'GET',
            'cache': false,
            'headers': {
                "Accept": "application/json; odata=verbose"
            },
            success: function (response) {
                var controlId, worfkFlowUrl;
                var lookupValue = response != null && response.d != null && response.d.softractWFStatusLookup != null ? response.d.softractWFStatusLookup : null;
                if (lookupValue == null) return;
                if (lookupValue['softractWFStatusPRWfID']) {
                    controlId = "softract_{0}_{1}".format(softract.common.constants.PeerReviewStatusFieldName, itemId);
                    worfkFlowUrl = "{0}/_layouts/15/wrkstat.aspx?List={1}&WorkflowInstanceName={2}".format(_spPageContextInfo.webAbsoluteUrl, listId, lookupValue['softractWFStatusPRWfID']);
                    $('#' + controlId).attr('href', worfkFlowUrl);
                }
                if (lookupValue['softractWFStatusPMAWfID']) {
                    controlId = "softract_{0}_{1}".format(softract.common.constants.PMApprovalStatusFieldName, itemId);
                    worfkFlowUrl = "{0}/_layouts/15/wrkstat.aspx?List={1}&WorkflowInstanceName={2}".format(_spPageContextInfo.webAbsoluteUrl, listId, lookupValue['softractWFStatusPMAWfID']);
                    $('#' + controlId).attr('href', worfkFlowUrl);
                }
                if (lookupValue['softractWFStatusCOAWfID']) {
                    controlId = "softract_{0}_{1}".format(softract.common.constants.COASubmissionStatusFieldName, itemId);
                    worfkFlowUrl = "{0}/_layouts/15/wrkstat.aspx?List={1}&WorkflowInstanceName={2}".format(_spPageContextInfo.webAbsoluteUrl, listId, lookupValue['softractWFStatusCOAWfID']);
                    $('#' + controlId).attr('href', worfkFlowUrl);
                }
            }
        });
    }



    function _registerTemplate() {
        var fieldRenderingContext = {
        };

        fieldRenderingContext.Templates = {
        };
        fieldRenderingContext.Templates.Fields = {
            'Peer_x0020_Review_x0020_Status': {
                'View': renderFieldValue
            },
            'PM_x0020_Approval_x0020_Status': {
                'View': renderFieldValue
            },
            'COA_x0020_Submission_x0020_Status': {
                'View': renderFieldValue
            }
        };
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldRenderingContext);
    }

    function registerRendering() {
        SP.SOD.executeFunc("clienttemplates.js", "SPClientTemplates", function () {
            _registerTemplate();
        });
        //ExecuteOrDelayUntilScriptLoaded(_registerTemplate, 'clienttemplates.js');
    }

    RegisterModuleInit('/_catalogs/masterpage/softract/Scripts/softract.Common.js', registerRendering);

    //this function get executed in case when Minimum Download Strategy not enabled. 
    registerRendering();

})();
