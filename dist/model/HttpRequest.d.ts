import httpType from "./httpType";
declare class HttpRequest {
    url: string;
    type: httpType;
    header?: {
        [key: string]: string;
    };
    param?: {
        [key: string]: string;
    };
    body?: any;
    config?: {
        dataType?: "BODY" | "FORM_DATA";
        name?: string;
    };
    constructor(data: HttpRequest);
}
export default HttpRequest;
