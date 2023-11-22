import Http, { type } from "./Http";
import variable from "./variable";

interface Request {
    url: string;
    type: type;
    header?: { [key: string]: string };
    param?: { [key: string]: string };
    body?: any;
}

export default class Service {

    readonly url?: string;

    constructor(url?: string) {
        this.url = url;
    }

    $send(request: Request): Promise<any> {
        return new Promise<any>((s, e) => {
            this.$getHttp(request).send().then((response) => {
                s(this.$responseHandler(response));
            }).catch((response) => {
                e(this.$responseHandler(response));
            });
        });
    }

    $download(request: Request): Promise<undefined> {
        return new Promise<any>((s: Function, e) => {
            this.$getHttp(request).download().then(() => {
                s();
            }).catch((response) => {
                e(this.$responseHandler(response));
            });
        });
    }

    $asyncDownload(request: Request): Promise<undefined> {
        return new Promise<any>((s: Function, e) => {
            this.$getHttp(request).asyncDownload().then(() => {
                s();
            }).catch((response) => {
                e(this.$responseHandler(response));
            });
        });
    }

    private $getHttp(request: Request): Http {
        request.url = request.url.startsWith("http") ? request.url : this.url ? `${this.url}${request.url ? request.url.startsWith("/") ? request.url : `/${request.url}` : ""}` : request.url;
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
        if (result.contentType === null && request.type !== "GET" && variable.isObject(request.body)) {
            result.setContentType("APPLICATION_JSON");
        }
        return result;
    }

    private $responseHandler(response: string) {
        let result;
        try {
            result = JSON.parse(response);
        } catch (exception) {
            result = response;
        }
        return result;
    }

};

export {
    Request
};