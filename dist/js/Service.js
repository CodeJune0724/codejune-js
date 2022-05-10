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
    $send(httpOption, requestHandler) {
        return new Promise((s, e) => {
            let methodName = httpOption.url;
            let type = httpOption.type;
            let header = httpOption.header;
            let data = httpOption.data;
            let urlData = httpOption.urlData;
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
            if (data !== undefined && data !== null) {
                this.data[methodName].request = data;
            }
            if (variable.isEmpty(requestHandler) || requestHandler === undefined) {
                requestHandler = (requestData) => {
                    return requestData;
                };
            }
            let requestData = {
                url: this.url + "/" + methodName,
                type: type,
                header: header,
                data: this.data[methodName].request,
                urlData: urlData
            };
            requestData = requestHandler(requestData);
            requestData = this.$requestHandler(requestData);
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
                    variable.assignment(this.data[methodName].response, responseDataJson);
                }
                else {
                    this.data[methodName].response = responseDataJson;
                }
                s(responseDataJson);
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $download(httpOption, requestHandler) {
        return new Promise((s, e) => {
            let methodName = httpOption.url;
            let urlData = httpOption.urlData;
            if (variable.isEmpty(methodName)) {
                throw new InfoException("方法名 is null");
            }
            if (variable.isEmpty(this.data[methodName])) {
                this.data[methodName] = {
                    request: null,
                    response: null
                };
            }
            if (urlData !== undefined) {
                this.data[methodName].request = urlData;
            }
            if (requestHandler === undefined || variable.isEmpty(requestHandler)) {
                requestHandler = (requestData) => {
                    return requestData;
                };
            }
            let requestData = {
                url: this.url + "/" + methodName,
                type: httpType.GET,
                urlData: this.data[methodName].request
            };
            requestData = requestHandler(requestData);
            requestData = this.$requestHandler(requestData);
            http.download(requestData).then(() => {
                s();
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }
    $requestHandler(requestData) {
        return requestData;
    }
    $addData(methodName, request, result) {
        if (request === undefined) {
            request = null;
        }
        if (result === undefined) {
            result = null;
        }
        this.data[methodName] = {
            request: request,
            response: result
        };
    }
}
;
