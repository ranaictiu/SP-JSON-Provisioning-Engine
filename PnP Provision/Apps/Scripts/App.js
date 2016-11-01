ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage() {

    $(document).ready(function () {
//        $('#siteIcon img').attr('src', _spPageContextInfo.webServerRelativeUrl + '/images/Logo.png');
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', sharePointReady);
    });

    function sharePointReady() {
        var scriptbase = austal.common.contextInfo.hostWebUrl + "/_layouts/15/";
        $.getScript(scriptbase + "SP.RequestExecutor.js", requestExecutorLoaded);
    }

    function requestExecutorLoaded() {
        ///sites/Austal/AustalAddInSiteCreation/images/Logo.png?rev=43

    }
}
window.onerror = function () {
    try {
        austal.progressSteps.setFailed(null, 'Site Creation Failed');
        austal.common.uiManager.closeDialog();
        austal.common.uiManager.showStickyNotification('Error', 'Failed to complete the operation', true);
    } catch (e) {
    }
};