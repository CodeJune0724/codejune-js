import Http, { type } from "./Http";

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
            this._getHttp(request).send().then((responseData) => {
                let responseDataJson;
                try {
                    responseDataJson = JSON.parse(responseData);
                } catch (exception) {
                    responseDataJson = responseData;
                }
                s(responseDataJson);
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $download(request: Request): Promise<undefined> {
        return new Promise<any>((s: Function, e) => {
            this._getHttp(request).download().then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $asyncDownload(request: Request): Promise<undefined> {
        return new Promise<any>((s: Function, e) => {
            this._getHttp(request).asyncDownload().then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    private _getHttp(request: Request): Http {
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
        if (result.contentType === null && request.type !== "GET" && typeof request.body === "object") {
            result.setContentType("APPLICATION_JSON");
        }
        return result;
    }

};

export {
    Request
};