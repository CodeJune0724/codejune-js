import Http from "./Http";
import variable from "./variable";
export default class Service {
    url;
    constructor(url) {
        this.url = url;
    }
    $send(request) {
        return new Promise((s, e) => {
            this._getHttp(request).send().then((responseData) => {
                let responseDataJson;
                try {
                    responseDataJson = JSON.parse(responseData);
                }
                catch (exception) {
                    responseDataJson = responseData;
                }
                s(responseDataJson);
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $download(request) {
        return new Promise((s, e) => {
            this._getHttp(request).download().then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $asyncDownload(request) {
        return new Promise((s, e) => {
            this._getHttp(request).asyncDownload().then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    _getHttp(request) {
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
}
;
