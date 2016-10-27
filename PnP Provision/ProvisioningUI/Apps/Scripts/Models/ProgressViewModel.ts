import SharePointHelper = require("../Provisioning/SharePointHelper");
import TemplateManager = require("../Provisioning/TemplateManager");
import ko = require('knockout');
import ProgressSteps = TemplateManager.ProgressSteps;
import OperationStatus = TemplateManager.OperationStatus;

import Utils = SharePointHelper.Utils;
import TemplateFile = SharePointHelper.TemplateFile;


class ProgressStep {
    constructor(name: ProgressSteps, title: string, status: OperationStatus = OperationStatus.unknown) {
        this.name = name;
        this.title(title);
        this.status(status);
    }
    name: ProgressSteps;
    status: KnockoutObservable<OperationStatus> = ko.observable(null);
    title: KnockoutObservable<string> = ko.observable(null);
    noOfActions: number = 0;
    statusCssClass = ko.computed(() => {
        if (this.status())
            return 'status-' + OperationStatus[this.status()];
        return '';
    });
}
export interface ProgressUIInterface {
    steps: KnockoutObservableArray<ProgressStep>;
    initialize(templateFile: TemplateFile);
    show(elementId: string, dialogTitle: string, currentStep: ProgressSteps, width?: number, height?: number);
    setStatus(stepName: ProgressSteps, status: OperationStatus, message?: string);
    setFailed();
}
export class ProgressUIModel implements ProgressUIInterface {
    steps: KnockoutObservableArray<ProgressStep>;

    constructor() {
        this.steps = ko.observableArray([]);
    }

    initialize(templateFile: TemplateFile) {
        this.steps([]);
        for (let templateItem of templateFile.Templates) {
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
    }
    private addOrUpdateStep(stepName: ProgressSteps, title: string, operationStatus?: OperationStatus) {
        var step = Utils.arrayFirst(this.steps(), s => {
            return s.name == stepName;
        });
        if (step) {
            step.noOfActions = step.noOfActions + 1;
            if (operationStatus) step.status(operationStatus);
        } else {
            this.steps.push(new ProgressStep(stepName, title, operationStatus ? operationStatus : OperationStatus.pending));
        }
    }
    setStatus(stepName: ProgressSteps, status: TemplateManager.OperationStatus, message?: string) {
        var step = Utils.arrayFirst<ProgressStep>(this.steps(), s => {
            return s.name == stepName;
        });
        step.status(status);
        if (message) {
            step.title(message);
        }
    }
    show(elementId: string, dialogTitle: string, currentStep: ProgressSteps, width?: number, height?: number) {
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
    }

    setFailed() {
        var currentStep = Utils.arrayFirst<ProgressStep>(this.steps(), s => {
            return s.status() == OperationStatus.inProgress;
        });
        this.setStatus(currentStep.name, OperationStatus.failed);
    }
}