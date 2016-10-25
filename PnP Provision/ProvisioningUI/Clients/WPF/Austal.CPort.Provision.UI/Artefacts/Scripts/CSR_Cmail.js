var Softract = Softract || {};
Softract.jsLinks = Softract.jsLinks || {};


Softract.jsLinks.csrTemplateRender = function () {
    if (typeof SPClientTemplates === 'undefined')
        return;
    var templateLookupDdlId;
    var templateBodyId;
    //var fromUserControlId;

    function cleanId(id) {
        return id.replace('$', '\\$').replace('.', '\\.');
    }

    function renderTemplateField(ctx) {
        var content = null;
        switch (ctx.CurrentFieldSchema.Name) {
            case "SoftractCmailTemplateLookup":
                content = SPFieldLookup_Edit(ctx);
                templateLookupDdlId = cleanId($($.parseHTML(content)).find('select').attr('id'));
                break;
            case "SoftractCorsPndncMessage":
                content = SPFieldNote_Edit(ctx);
                templateBodyId = cleanId($($.parseHTML(content)).find('div.ms-rtestate-write').attr('id'));
                break;
            //case 'SoftractCorsPndncFrom':
            //    content = SPClientPeoplePickerCSRTemplate(ctx);
            //    fromUserControlId = cleanId($($.parseHTML(content)).find('div.sp-peoplepicker-topLevel').attr('id'));
            //    break;
        }

        return content;
    }

    function postRender(ctx) {
        var frmCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        if (frmCtx.controlMode != SPClientTemplates.ClientControlMode.NewForm && frmCtx.controlMode != SPClientTemplates.ClientControlMode.EditForm) return;
        if (ctx.ListSchema.Field[0].Name == 'SoftractCmailTemplateLookup') {

            $('#' + templateLookupDdlId)
                .on('change', function() {
                    loadTemplate();
                });
            loadTemplate();
        }

        //if (ctx.ListSchema.Field[0].Name == 'SoftractCorsPndncFrom') {
        //    var pp = window.SPClientPeoplePicker.SPClientPeoplePickerDict[fromUserControlId];
        //    var usrObj = { 'Key': _spPageContextInfo.userLoginName };
        //    pp.AddUnresolvedUser(usrObj);
        //}
    }
    function loadTemplate() {
        var selectedId = $('#' + templateLookupDdlId).val();
        if (selectedId == null || selectedId=='' || selectedId=='0') return;
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('Correspondence Templates')/items({0})?$select=SoftractCorsPndncTemplate".format(selectedId),
            method: 'GET',
            cache: false,
            headers: {
                accept: "application/json; odata=verbose",
                contentType: "application/json;odata=verbose"
            },
            success: function (response) {
                $('#' + templateBodyId).html(response.d['SoftractCorsPndncTemplate']);
            },
            error: function (error, errorCode, errorMessage) {
                Softract.common.uiManager.showNotification('Error', 'Failed to load template', true);
            }
        });
    }

    function _registerTemplate() {
        var fieldRenderingContext = {};

        fieldRenderingContext.Templates = {};
        fieldRenderingContext.OnPostRender = postRender;
        fieldRenderingContext.Templates.Fields = {
            'SoftractCorsPndncMessage': {
                'NewForm': renderTemplateField,
                "EditForm": renderTemplateField
            },
            'SoftractCmailTemplateLookup': {
                'NewForm': renderTemplateField,
                "EditForm": renderTemplateField

            }
            //,
            //'SoftractCorsPndncFrom': {
            //    'NewForm': renderTemplateField,
            //    "EditForm": renderTemplateField

            //}
        };
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldRenderingContext);
    }

    ExecuteOrDelayUntilScriptLoaded(_registerTemplate, 'clienttemplates.js');
};


RegisterModuleInit('/_catalogs/masterpage/Softract/Scripts/CSR_Cmail.js', Softract.jsLinks.csrTemplateRender);

//this function get executed in case when Minimum Download Strategy not enabled. 
Softract.jsLinks.csrTemplateRender();