var Softract = Softract || {};
Softract.jsLinks = Softract.jsLinks || {};


Softract.jsLinks.renderFPSLookupField = function () {
    if (typeof SPClientTemplates === 'undefined')
        return;



    function renderFpsFieldValues(ctx) {
        if (ctx.CurrentItem == null) return '';
        var lookupValues;
        var frmCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        if (frmCtx)
            lookupValues = SPClientTemplates.Utility.ParseMultiLookupValues(ctx.CurrentFieldValue);
        else
            lookupValues = ctx.CurrentItem['SoftractFPSLookup'];
        var html = "";
        for (var i = 0; i < lookupValues.length; i++) {
            if (html != '') html += "; ";
            var lookupId = lookupValues[i].lookupId ? lookupValues[i].lookupId : lookupValues[i].LookupId; //list view uses lookupId whereas Form uses LookupId
            var lookupValue = lookupValues[i].lookupId ? lookupValues[i].lookupValue : lookupValues[i].LookupValue;
            html += "<a onclick=\"Softract.jsLinks.showFPSItemInDialog({0},'{1}'); return false;\" href='javascript:void(0)'>{1}</a>".format(lookupId, lookupValue);
        }
        return html;

    }
    function renderOcdlToFpsValue(ctx) {
        return "<a href='{0}/Lists/FPSs/All FPSs.aspx?FilterField1=SoftractOCDLLookup&FilterValue1={1}'>View FPSs</a>".format(_spPageContextInfo.webAbsoluteUrl, encodeURIComponent(ctx.CurrentItem['Title']));
    }
    function renderFpsToMssValue(ctx) {
        return "<a href='{0}/Lists/MSSs/All MSSs.aspx?FilterField1=SoftractFPSLookup&FilterValue1={1}'>View MSSs</a>".format(_spPageContextInfo.webAbsoluteUrl, encodeURIComponent(ctx.CurrentItem['Title']));
    }
    function renderOcdlLookupValue(ctx) {
        if (ctx.CurrentItem == null) return '';
        var lookupValues;
        var frmCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        if (frmCtx)
            lookupValues = SPClientTemplates.Utility.ParseMultiLookupValues(ctx.CurrentFieldValue);
        else
            lookupValues = ctx.CurrentItem['SoftractOCDLLookup'];
        var html = "";
        for (var i = 0; i < lookupValues.length; i++) {
            if (html != '') html += "; ";
            var lookupId = lookupValues[i].lookupId ? lookupValues[i].lookupId : lookupValues[i].LookupId; //list view uses lookupId whereas Form uses LookupId
            var lookupValue = lookupValues[i].lookupId ? lookupValues[i].lookupValue : lookupValues[i].LookupValue;
            html += "<a onclick=\"Softract.jsLinks.showOCDLItemInDialog({0},'{1}'); return false;\" href='javascript:void(0)'>{1}</a>".format(lookupId, lookupValue);
        }
        return html;
    }

    function renderFiledAsHidden(ctx) {
        return "<div class='Softract-hidden-field'></div>";
    }
    function postRender(ctx) {
        $('.Softract-hidden-field').closest("tr").hide();
    }

    function _registerTemplate() {
        var fieldRenderingContext = {};

        fieldRenderingContext.Templates = {};
        fieldRenderingContext.OnPostRender = postRender;
        fieldRenderingContext.Templates.Fields = {
            'SoftractFPSLookup': {
                'View': renderFpsFieldValues,
                "DisplayForm": renderFpsFieldValues

            },
            'SoftractVcrmOcdlToFps': {
                'View': renderOcdlToFpsValue,
                'DisplayForm': renderFiledAsHidden,
                'NewForm': renderFiledAsHidden,
                'EditForm': renderFiledAsHidden
            },
            'SoftractVcrmFpsToMss': {
                'View': renderFpsToMssValue,
                'DisplayForm': renderFiledAsHidden,
                'NewForm': renderFiledAsHidden,
                'EditForm': renderFiledAsHidden
            },
            'SoftractOCDLLookup': {
                'View': renderOcdlLookupValue,
                'DisplayForm': renderOcdlLookupValue
            }
        };
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldRenderingContext);
    }

    ExecuteOrDelayUntilScriptLoaded(_registerTemplate, 'clienttemplates.js');
};
Softract.jsLinks.showFPSItemInDialog = function (itemId, itemTitle) {
    var template = "<table id='divFPSLookupHtml' class='ms-formtable' border='0' cellpadding='0' cellspacing='0' width='100%'><tbody> {0} </tbody></table>";
    var rowTempalte = "<tr><td nowrap='true' valign='top' class='ms-formlabel'><span class='ms-h3 ms-standardheader'>{0}</span></td><td valign='top' class='ms-formbody'>{1}</td></tr>";
    var listItem;
    var promises = $.when(1);
    promises = promises.then(function () {
        var d = $.Deferred();
        ExecuteOrDelayUntilScriptLoaded(function () {
            d.resolve();
        }, "sp.js");
        return d;
    });


    Softract.common.uiManager.showDialog('Loading', 'Please wait while loading FPS...');

    promises = promises.then(function () {
        var d = $.Deferred();
        var context = SP.ClientContext.get_current();
        listItem = context.get_web().get_lists().getByTitle(Softract.common.constants.FPSListTitle).getItemById(itemId);
        context.load(listItem);
        context.executeQueryAsync(function() {
            d.resolve();
        },function() {
            d.reject();
        });
        return d;
    });
    promises = promises.then(function () {
        var rowsHtml = rowTempalte.format('Unique ID', listItem.get_item('Title'));
        rowsHtml += rowTempalte.format('Description', listItem.get_item('SoftractPlainDescription') == null ? '' : listItem.get_item('SoftractPlainDescription'));
        rowsHtml += rowTempalte.format('In-links', listItem.get_item('SoftractOcdlInLinks') == null ? '' : listItem.get_item('SoftractOcdlInLinks'));
        var ocdls = listItem.get_item('SoftractOCDLLookup');
        var ocdlHtml = '';
        for (var i = 0; i < ocdls.length; i++) {
            if (ocdlHtml != '') ocdlHtml += '; ';
            ocdlHtml += "<a href='javascript:void(0)' onclick=\"Softract.jsLinks.showOCDLItemInDialog({0},'{1}')\">{1}<a/>".format(ocdls[i].get_lookupId(), ocdls[i].get_lookupValue());
        }
        rowsHtml += rowTempalte.format('OCDLs', ocdlHtml);
        var fullHtml = template.format(rowsHtml);
        $('#divFPSLookupHtml').remove();
        $(document.body).append(fullHtml);

    });

    promises.done(function () {
        Softract.common.uiManager.closeDialog();
        SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function () {
            var options = {
                html: document.getElementById('divFPSLookupHtml'),
                autoSize: true,
                allowMaximize: false,
                title: 'FPS - ' + itemTitle,
                showClose: true
            };
            SP.UI.ModalDialog.showModalDialog(options);
        });
    }).fail(function () {
        Softract.common.uiManager.closeDialog();
        Softract.common.uiManager.showNotification('Error', 'Failed to load FPS', true);
    });
}
Softract.jsLinks.showOCDLItemInDialog = function (itemId, itemTitle) {
    var template = "<table id='divOCDLLookupHtml' class='ms-formtable' border='0' cellpadding='0' cellspacing='0' width='100%'><tbody> {0} </tbody></table>";
    var rowTempalte = "<tr><td nowrap='true' valign='top' class='ms-formlabel'><span class='ms-h3 ms-standardheader'>{0}</span></td><td valign='top' class='ms-formbody'>{1}</td></tr>";
    var listItem;
    var promises = $.when(1);
    promises = promises.then(function () {
        var d = $.Deferred();
        ExecuteOrDelayUntilScriptLoaded(function () {
            d.resolve();
        }, "sp.js");
        return d;
    });

    Softract.common.uiManager.showDialog('Loading', 'Please wait while loading OCDL...');

    promises = promises.then(function () {
        var d = $.Deferred();
        var context = SP.ClientContext.get_current();
        listItem = context.get_web().get_lists().getByTitle(Softract.common.constants.OCDLListTitle).getItemById(itemId);
        context.load(listItem);
        context.executeQueryAsync(function() {
            d.resolve();
        }, function() {
            d.reject();
        });
        return d;
    });
    promises = promises.then(function () {
        var rowsHtml = rowTempalte.format('Unique ID', listItem.get_item('Title'));
        rowsHtml += rowTempalte.format('Description', listItem.get_item('SoftractPlainDescription') == null ? '' : listItem.get_item('SoftractPlainDescription'));
        var fullHtml = template.format(rowsHtml);
        $('#divOCDLLookupHtml').remove();
        $(document.body).append(fullHtml);

    });

    promises.done(function () {
        Softract.common.uiManager.closeDialog();
        SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function () {
            var options = {
                html: document.getElementById('divOCDLLookupHtml'),
                autoSize: true,
                allowMaximize: false,
                title: 'OCDL - ' + itemTitle,
                showClose: true
            };
            SP.UI.ModalDialog.showModalDialog(options);
        });
    }).fail(function () {
        Softract.common.uiManager.closeDialog();
        Softract.common.uiManager.showNotification('Error', 'Failed to load OCDL', true);
    });



}

RegisterModuleInit('/_catalogs/masterpage/Softract/Scripts/CSR_VCRM.js', Softract.jsLinks.renderFPSLookupField);

//this function get executed in case when Minimum Download Strategy not enabled. 
Softract.jsLinks.renderFPSLookupField();