type type = "GET" | "POST" | "PUT" | "DELETE";
type contentType = "APPLICATION_JSON" | "APPLICATION_XML" | "FORM_DATA" | "ROW";
interface Request {
    url: string;
    type: type;
    param?: {
        [key: string]: string | null;
    };
    header?: {
        [key: string]: string | null;
    };
    contentType?: contentType | null;
    body?: any;
}
declare let getUrl: (url: string, param?: {
    [key: string]: string | null;
}, uri?: string) => string;
export default class Http {
    readonly request: Request;
    constructor(url: string, type: type);
    addHeader(key: string, value: string | null): void;
    addParam(key: string, value: string | null): void;
    setContentType(contentType: contentType | null): void;
    setBody(body: any): void;
    send(): Promise<string>;
    download(): Promise<undefined>;
    asyncDownload(): Promise<undefined>;
    sendOfBlob(): Promise<Blob>;
}
export { type, contentType, Request, getUrl };
