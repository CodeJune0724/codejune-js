declare class Request {
    url: string;
    type: "GET" | "POST" | "PUT" | "DELETE";
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
