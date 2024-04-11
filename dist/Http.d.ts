type type = "GET" | "POST" | "PUT" | "DELETE";
type contentType = "APPLICATION_JSON" | "APPLICATION_XML" | "FORM_DATA" | "ROW";
export default class Http {
    readonly url: string;
    readonly type: type;
    readonly param: {
        [key in string]: string;
    };
    readonly header: {
        [key in string]: string;
    } & {
        "Content-type"?: type;
    };
    contentType: contentType | null;
    body: any;
    constructor(url: string, type: type);
    addHeader(key: string, value: string): void;
    addParam(key: string, value: string): void;
    setContentType(contentType: contentType | null): void;
    setBody(body: any): void;
    send(): Promise<string>;
    download(): Promise<undefined>;
    asyncDownload(): Promise<undefined>;
    sendOfBlob(): Promise<Blob>;
    private _getFetch;
    private _getUrl;
}
export { type, contentType };
