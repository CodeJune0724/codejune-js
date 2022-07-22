import variable from "./variable";
import InfoException from "./exception/InfoException";
import http from "./http";
import httpType from "./model/httpType";
export default class Service {
    url;
    data = {};
    constructor(url) {
        this.url = url;
    }
    $send(httpRequest, requestHandler) {
        return new Promise((s, e) => {
            let methodName = httpRequest.url;
            let type = httpRequest.type;
            let header = httpRequest.header;
            let body = httpRequest.body;
            let param = httpRequest.param;
            if (variable.isEmpty(methodName)) {
                throw new InfoException("方法名 is null");
            }
            if (variable.isEmpty(type)) {
                throw new InfoException("type is null");
            }
            if (variable.isEmpty(this.data[methodName])) {
                this.data[methodName] = {
                    request: null,
                    response: null
                };
            }
            if (body !== undefined && body !== null) {
                this.data[methodName].request = body;
            }
            if (variable.isEmpty(requestHandler) || requestHandler === undefined) {
                requestHandler = () => { };
            }
            let requestData = {
                url: this.url + "/" + methodName,
                type: type,
                header: header,
                body: this.data[methodName].request,
                param: param
            };
            requestHandler(requestData);
            this.$requestHandler(requestData);
            http.send(requestData).then((responseData) => {
                variable.clean(this.data[methodName].response);
                let responseDataJson;
                try {
                    responseDataJson = JSON.parse(responseData);
                }
                catch (exception) {
                    responseDataJson = responseData;
                }
                if (variable.isObject(this.data[methodName].response)) {
                    variable.assignment(this.data[methodName].response, responseDataJson, false);
                }
                else {
                    this.data[methodName].response = responseDataJson;
                }
                s(this.data[methodName].response);
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $download(httpRequest, requestHandler) {
        return new Promise((s, e) => {
            let methodName = httpRequest.url;
            let param = httpRequest.param;
            if (variable.isEmpty(methodName)) {
                throw new InfoException("方法名 is null");
            }
            if (variable.isEmpty(this.data[methodName])) {
                this.data[methodName] = {
                    request: null,
                    response: null
                };
            }
            if (param !== undefined) {
                this.data[methodName].request = param;
            }
            if (requestHandler === undefined || variable.isEmpty(requestHandler)) {
                requestHandler = () => { };
            }
            let requestData = {
                url: this.url + "/" + methodName,
                type: httpType.GET,
                param: this.data[methodName].request
            };
            requestHandler(requestData);
            this.$requestHandler(requestData);
            http.download(requestData).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $requestHandler(httpRequest) { }
}
;
