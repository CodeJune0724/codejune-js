import variable from "./variable";
import InfoException from "./exception/InfoException";
import http from "./http";
import Request from "./http/Request";

export default class Service {

    url?: string;

    constructor(url?: string) {
        this.url = url;
    }

    $send(request: Request): Promise<any> {
        return new Promise<any>((s, e) => {
            http.send(this._getHttpRequest(request)).then((responseData) => {
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

    $download(request: Request): Promise<any> {
        return new Promise<any>((s: Function, e) => {
            http.download(this._getHttpRequest(request)).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $asyncDownload(request: Request): Promise<any> {
        return new Promise<any>((s: Function, e) => {
            http.asyncDownload(this._getHttpRequest(request)).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $requestHandler(request: Request): void {}

    _getHttpRequest(request: Request): Request {
        let url = request.url;
        let type = request.type;
        let header = request.header;
        let body = request.body;
        let param = request.param;
        if (variable.isEmpty(url)) {
            throw new InfoException("url is null");
        }
        if (variable.isEmpty(type)) {
            throw new InfoException("type is null");
        }
        let result: Request = {
            url: url.indexOf("http") !== -1 ? url : this.url + "/" + url,
            type: type,
            header: header,
            body: body,
            param: param
        };
        this.$requestHandler(result);
        return result;
    }

};