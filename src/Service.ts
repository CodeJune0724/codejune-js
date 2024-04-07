import Http, { type, contentType } from "./Http";
import variable from "./variable";

interface Request {
    url: string;
    type: type;
    header?: { [key: string]: string };
    param?: { [key: string]: string };
    body?: any;
    contentType?: contentType | null;
}

let getHttp = (request: Request, service: Service) => {
    request.url = request.url.startsWith("http") ? request.url : service.url ? `${service.url}${request.url ? request.url.startsWith("/") ? request.url : `/${request.url}` : ""}` : request.url;
    let result = new Http(request.url, request.type);
    if (request.header) {
        for (let key in request.header) {
            result.addHeader(key, request.header[key]);
        }
    }
    if (request.param) {
        for (let key in request.param) {
            result.addParam(key, request.param[key]);
        }
    }
    result.setBody(request.body);
    if (request.contentType) {
        result.setContentType(request.contentType);
    }
    if (result.contentType === null && request.type !== "GET" && variable.isObject(request.body)) {
        result.setContentType("APPLICATION_JSON");
    }
    return result;
};

let responseHandler = (response: string) => {
    let result;
    try {
        result = JSON.parse(response);
    } catch (e) {
        result = response;
    }
    return result;
};

export default class Service {

    readonly url?: string;

    constructor(url?: string) {
        this.url = url;
    }

    $send(request: Request) {
        return new Promise<any>((s, e) => {
            getHttp(request, this).send().then((response) => {
                s(responseHandler(response));
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }

    $download(request: Request) {
        return new Promise<any>((s: Function, e) => {
            getHttp(request, this).download().then(() => {
                s();
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }

    $asyncDownload(request: Request) {
        return new Promise<any>((s: Function, e) => {
            getHttp(request, this).asyncDownload().then(() => {
                s();
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }

};

export {
    Request
};