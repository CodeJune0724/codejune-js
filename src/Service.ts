import Http, { type } from "./Http";
import variable from "./variable";

type request = {
    url: string,
    type: type,
    header?: { [key: string]: string },
    param?: { [key: string]: string },
    body?: any
}

export default class Service {

    readonly url?: string;

    constructor(url?: string) {
        this.url = url;
    }

    $send(request: request): Promise<any> {
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

    $download(request: request): Promise<undefined> {
        return new Promise<any>((s: Function, e) => {
            this._getHttp(request).download().then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $asyncDownload(request: request): Promise<undefined> {
        return new Promise<any>((s: Function, e) => {
            this._getHttp(request).asyncDownload().then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $requestHandler(request: request): void {}

    private _getHttp(request: request): Http {
        request.url = request.url.indexOf("http") !== -1 ? request.url : this.url + "/" + request.url;
        this.$requestHandler(request);
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

};