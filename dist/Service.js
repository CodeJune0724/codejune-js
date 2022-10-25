import variable from "./variable";
import InfoException from "./exception/InfoException";
import http from "./http";
export default class Service {
    url;
    constructor(url) {
        this.url = url;
    }
    $send(request) {
        return new Promise((s, e) => {
            http.send(this._getHttpRequest(request)).then((responseData) => {
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
            http.download(this._getHttpRequest(request)).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $asyncDownload(request) {
        return new Promise((s, e) => {
            http.asyncDownload(this._getHttpRequest(request)).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $requestHandler(request) { }
    _getHttpRequest(request) {
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
        let result = {
            url: url.indexOf("http") !== -1 ? url : this.url + "/" + url,
            type: type,
            header: header,
            body: body,
            param: param
        };
        this.$requestHandler(result);
        return result;
    }
}
;
