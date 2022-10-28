import Http from "./http";
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
    $requestHandler(request) { }
    _getHttp(request) {
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
}
;
