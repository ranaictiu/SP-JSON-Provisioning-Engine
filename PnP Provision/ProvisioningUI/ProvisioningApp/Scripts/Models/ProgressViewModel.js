define(["require", "exports", "../Provisioning/SharePointHelper", "../Provisioning/TemplateManager", 'knockout'], function (require, exports, SharePointHelper, TemplateManager, ko) {
    "use strict";
    var ProgressSteps = TemplateManager.ProgressSteps;
    var OperationStatus = TemplateManager.OperationStatus;
    var Utils = SharePointHelper.Utils;
    var ProgressStep = (function () {
        function ProgressStep(name, title, status) {
            if (status === void 0) { status = OperationStatus.unknown; }
            this.status = ko.observable(null);
            this.title = ko.observable(null);
            this.noOfActions = 0;
            this.name = name;
            this.title(title);
            this.status(status);
        }
        return ProgressStep;
    }());
    var ProgressUIModel = (function () {
        function ProgressUIModel() {
        }
        ProgressUIModel.prototype.initialize = function (templateFile) {
            this.steps = ko.observableArray([]);
            for (var _i = 0, _a = templateFile.Templates; _i < _a.length; _i++) {
                var templateItem = _a[_i];
                if (templateItem.Features && ((templateItem.Features.SiteFeatures && templateItem.Features.SiteFeatures.length > 0) || (templateItem.Features.WebFeatures && templateItem.Features.WebFeatures.length > 0))) {
                    this.addOrUpdateStep(ProgressSteps.Features, 'Feature Activation');
                }
                if (templateItem.Security && ((templateItem.Security.SiteGroups && templateItem.Security.SiteGroups.length > 0) ||
                    (templateItem.Security.SiteSecurityPermissions && templateItem.Security.SiteSecurityPermissions.RoleAssignments &&
                        templateItem.Security.SiteSecurityPermissions.RoleAssignments.length > 0))) {
                    this.addOrUpdateStep(ProgressSteps.SecurityGroups, 'Site Security');
                }
                if (templateItem.SiteFields && templateItem.SiteFields.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Columns, 'Site Columns');
                }
                if (templateItem.ContentTypes && templateItem.ContentTypes.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.ContentTypes, 'Content Types');
                }
                if (templateItem.Pages && templateItem.Pages.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Pages, 'Pages');
                }
                if (templateItem.Lists && templateItem.Lists.length > 0) {
                    this.addOrUpdateStep(ProgressSteps.Lists, 'Lists');
                }
                if (templateItem.Workflows && templateItem.Workflows.Subscriptions && templateItem.Workflows.Subscriptions.length > 0) {
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
                if (operationStatus)
                    step.status(operationStatus);
            }
            else {
                this.steps.push(new ProgressStep(stepName, title, operationStatus ? operationStatus : OperationStatus.pending));
            }
        };
        ProgressUIModel.prototype.setStatus = function (stepName, status, message) {
            var step = Utils.arrayFirst(this.steps(), function (s) {
                return s.name == stepName;
            });
            step.status(status);
            if (message) {
                step.title(message);
            }
        };
        ProgressUIModel.prototype.show = function (elementId, dialogTitle, currentStep, width, height) {
            if (currentStep == ProgressSteps.SiteCreation) {
                this.steps.unshift(new ProgressStep(currentStep, 'Creating Site', OperationStatus.inProgress));
            }
            var existingBinding = ko.dataFor(document.getElementById(elementId));
            if (existingBinding == null || existingBinding == false)
                ko.applyBindings(this, document.getElementById(elementId));
            $('#' + elementId).addClass('progress-steps');
            var options = {
                title: dialogTitle,
                modal: true,
                width: 'auto',
                height: 'auto'
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