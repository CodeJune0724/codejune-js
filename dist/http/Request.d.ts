import type from "./type";
declare class Request {
    url: string;
    type: type;
    header?: {
        [key: string]: string;
    };
    param?: {
        [key: string]: string;
    };
    body?: any;
    config?: {
        dataType?: "BODY" | "FORM_DATA";
    };
    constructor(data: Request);
}
export default Request;
