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
interface String {
    replaceAll(search: string, replacement: string): string;
}

//interface serializer {
//    serializeToString: (elemtn: HTMLElement) => string;
//}
//interface window{
//    XMLSerializer: any;
//}