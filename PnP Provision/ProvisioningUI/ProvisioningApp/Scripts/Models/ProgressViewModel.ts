import SharePointHelper = require("../Provisioning/SharePointHelper");
import TemplateManager = require("../Provisioning/TemplateManager");
import ProgressSteps = TemplateManager.ProgressSteps;
import OperationStatus = TemplateManager.OperationStatus;

import Utils = SharePointHelper.Utils;
import TemplateFile = SharePointHelper.TemplateFile;

class ProgressStep {
    constructor(name: ProgressSteps, title: string, status: OperationStatus = OperationStatus.unknown) {
        this.name = name;
        this.title( title);
        this.status (status);
    }
    name: ProgressSteps;
    status:KnockoutObservable<OperationStatus>;
    title:KnockoutObservable<string>;
    noOfActions: number;
}
export interface ProgressUIInterface {
    steps: KnockoutObservableArray<ProgressStep>;
    initialize(templateFile: TemplateFile);
    show(elementId: string, dialogTitle: string, currentStep: ProgressSteps,width?: number, height?: number);
    setStatus(stepName: ProgressSteps, status: OperationStatus, message?: string);
    setFailed();
}
export class ProgressUIModel implements ProgressUIInterface {
    steps: KnockoutObservableArray<ProgressStep>;
    //constructor(actionSteps: Array<ProgressStep>) {
    //    this.steps(actionSteps);
    //}
    initialize(templateFile: TemplateFile) {
        var steps = new Array<ProgressStep>();
        for (let templateItem of templateFile.templates) {
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
    }
    private addOrUpdateStep(stepName: ProgressSteps, title: string, operationStatus?: OperationStatus) {
        var step = Utils.arrayFirst(this.steps(), s => {
            return s.name == stepName;
        });
        if (step) {
            step.noOfActions = step.noOfActions + 1;
        } else {
            this.steps.push(new ProgressStep(stepName, title, operationStatus ? operationStatus : OperationStatus.pending));
        }
    }
    setStatus(stepName: ProgressSteps, status: TemplateManager.OperationStatus, message?: string) {
        var step = ko.utils.arrayFirst(this.steps(), s => {
            return s.name == stepName;
        });
        step.status( status);
        if (message) {
            step.title(message);
        }
    }
    show(elementId: string, dialogTitle: string, currentStep: ProgressSteps, width?: number, height?: number) {
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
        (<any>$('#' + elementId)).dialog(options);
    }

    setFailed() {
        var currentStep = Utils.arrayFirst<ProgressStep>(this.steps(), s => {
            return s.status() == OperationStatus.inProgress;
        });
        this.setStatus(currentStep.name, OperationStatus.failed);
    }
}