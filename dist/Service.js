import variable from "./variable";
import InfoException from "./exception/InfoException";
import http from "./http";
export default class Service {
    url;
    data = {};
    constructor(url) {
        this.url = url;
    }
    $send(httpRequest, requestHandler) {
        return new Promise((s, e) => {
            let name = this._getName(httpRequest);
            http.send(this._getHttpRequest(httpRequest, requestHandler)).then((responseData) => {
                variable.clean(this.data[name].response);
                let responseDataJson;
                try {
                    responseDataJson = JSON.parse(responseData);
                }
                catch (exception) {
                    responseDataJson = responseData;
                }
                if (variable.isObject(this.data[name].response)) {
                    variable.assignment(this.data[name].response, responseDataJson, false);
                }
                else {
                    this.data[name].response = responseDataJson;
                }
                s(this.data[name].response);
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $download(httpRequest, requestHandler) {
        return new Promise((s, e) => {
            let requestData = this._getHttpRequest(httpRequest, requestHandler);
            requestData.param = requestData.body;
            http.download(requestData).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $asyncDownload(httpRequest, requestHandler) {
        return new Promise((s, e) => {
            let requestData = this._getHttpRequest(httpRequest, requestHandler);
            http.asyncDownload(requestData).then(() => {
                s();
            }).catch((responseData) => {
                let responseDataJson;
                try {
                    responseDataJson = JSON.parse(responseData);
                }
                catch (exception) {
                    responseDataJson = responseData;
                }
                e(responseDataJson);
            });
        });
    }
    $requestHandler(httpRequest) { }
    _getHttpRequest(httpRequest, requestHandler) {
        let name = this._getName(httpRequest);
        let url = httpRequest.url;
        let type = httpRequest.type;
        let header = httpRequest.header;
        let body = httpRequest.body;
        let param = httpRequest.param;
        if (variable.isEmpty(name)) {
            throw new InfoException("方法名 is null");
        }
        if (variable.isEmpty(type)) {
            throw new InfoException("type is null");
        }
        if (variable.isEmpty(this.data[name])) {
            this.data[name] = {
                request: null,
                response: null
            };
        }
        if (body !== undefined && body !== null) {
            this.data[name].request = body;
        }
        if (variable.isEmpty(requestHandler) || requestHandler === undefined) {
            requestHandler = () => { };
        }
        let result = {
            url: this.url + "/" + url,
            type: type,
            header: header,
            body: this.data[name].request,
            param: param
        };
        requestHandler(result);
        this.$requestHandler(result);
        return result;
    }
    _getName(httpRequest) {
        let result = httpRequest.url;
        let config = httpRequest.config;
        if (config && config.name) {
            result = config.name;
        }
        return result;
    }
}
;
