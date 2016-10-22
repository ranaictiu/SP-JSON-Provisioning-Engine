define(["require", "exports", "../Provisioning/SharePointHelper", "../Provisioning/TemplateManager"], function (require, exports, SharePointHelper, TemplateManager) {
    "use strict";
    var ProgressSteps = TemplateManager.ProgressSteps;
    var OperationStatus = TemplateManager.OperationStatus;
    var Utils = SharePointHelper.Utils;
    var ProgressStep = (function () {
        function ProgressStep(name, title, status) {
            if (status === void 0) { status = OperationStatus.unknown; }
            this.name = name;
            this.title(title);
            this.status(status);
        }
        return ProgressStep;
    }());
    var ProgressUIModel = (function () {
        function ProgressUIModel() {
        }
        //constructor(actionSteps: Array<ProgressStep>) {
        //    this.steps(actionSteps);
        //}
        ProgressUIModel.prototype.initialize = function (templateFile) {
            var steps = new Array();
            for (var _i = 0, _a = templateFile.templates; _i < _a.length; _i++) {
                var templateItem = _a[_i];
                if (templateItem.features && ((templateItem.features.siteFeatures && templateItem.features.siteFeatures.length > 0) || (templateItem.features.webFeatures && templateItem.features.webFeatures.length > 0))) {
                    this.addOrUpdateStep(ProgressSteps.Features, 'Feature Activation');
                }
                if (templateItem.security && ((templateItem.security.siteGroups && templateItem.security.siteGroups.length > 0) ||
                    (templateItem.security.siteSecurityPermissions && templateItem.security.siteSecurityPermissions.roleAssignments &&
                        templateItem.security.siteSecurityPermissions.roleAssignments.length > 0))) {
                    this.addOrUpdateStep(ProgressSteps.SecurityGroups, 'Site Security');
                }
                if (templateItem.siteFields && templateItem.siteFields.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Columns, 'Site Columns');
                }
                if (templateItem.contentTypes && templateItem.contentTypes.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.ContentTypes, 'Content Types');
                }
                if (templateItem.pages && templateItem.pages.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Pages, 'Pages');
                }
                if (templateItem.lists && templateItem.lists.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Lists, 'Lists');
                }
                if (templateItem.workflows && templateItem.workflows.subscriptions && templateItem.workflows.subscriptions.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Workflows, 'Workflows');
                }
            }
            this.addOrUpdateStep(ProgressSteps.Finalization, 'Finalisation');
        };
        ProgressUIModel.prototype.addOrUpdateStep = function (stepName, title, operationStatus) {
            var step = Utils.arrayFirst(this.steps(), function (s) {
                return s.name == stepName;
            });
            if (step) {
                step.noOfActions = step.noOfActions + 1;
            }
            else {
                this.steps.push(new ProgressStep(stepName, title, operationStatus ? operationStatus : OperationStatus.pending));
            }
        };
        ProgressUIModel.prototype.setStatus = function (stepName, status, message) {
            var step = ko.utils.arrayFirst(this.steps(), function (s) {
                return s.name == stepName;
            });
            step.status(status);
            if (message) {
                step.title(message);
            }
        };
        ProgressUIModel.prototype.show = function (elementId, dialogTitle, currentStep, width, height) {
            if (currentStep == ProgressSteps.SiteCreation) {
                this.addOrUpdateStep(ProgressSteps.SiteCreation, 'Creating Site', OperationStatus.inProgress);
            }
            var existingBinding = ko.dataFor(document.getElementById(elementId));
            if (existingBinding == null || existingBinding == false)
                ko.applyBindings(this, document.getElementById(elementId));
            $('#' + elementId).addClass('progress-steps');
            var options = {
                title: dialogTitle,
                modal: true,
                width: null,
                height: null
            };
            if (width) {
                options.width = width + 'px';
            }
            if (height) {
                options.height = height + 'px';
            }
            $('#' + elementId).dialog(options);
        };
        ProgressUIModel.prototype.setFailed = function () {
            var currentStep = Utils.arrayFirst(this.steps(), function (s) {
                return s.status() == OperationStatus.inProgress;
            });
            this.setStatus(currentStep.name, OperationStatus.failed);
        };
        return ProgressUIModel;
    }());
    exports.ProgressUIModel = ProgressUIModel;
});
//# sourceMappingURL=ProgressViewModel.js.map