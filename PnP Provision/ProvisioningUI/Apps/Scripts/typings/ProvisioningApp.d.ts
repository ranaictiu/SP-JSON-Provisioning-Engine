//String.prototype.startsWith is defined in init.js (sp)
interface String {
    startsWith(txt: string): boolean;
}

declare namespace StringUtil {
    function IsGuid(text: string): boolean;
}
declare namespace SP {
    export module DocumentSet {
        export class DocumentSetTemplate extends ClientObject {
            static getDocumentSetTemplate(context: ClientContext, contentType: SP.ContentType): StringResult;
        }
    }
    //export interface WorkflowSubscription extends SP.ClientObject {
    //    constructor(context: SP.ClientRuntimeContext);
    //}
    export interface Field {
        updateAndPushChanges();
    }
}
//declare namespace SP.WorkflowServices {
//    export class WorkflowSubscription extends SP.WorkflowServices.WorkflowSubscription {
//        constructor(context: SP.ClientRuntimeContext);
//    }
//}
interface window {
    XMLSerializer: any;
}
