import variable from "./variable";
import InfoException from "./exception/InfoException";
import http from "./http";
import httpType from "./model/httpType";
import HttpOption from "./model/HttpOption";

export default class Service {

    url: string;

    data: {
        [key: string]: {
            request: any,
            response: any
        }
    } = {};

    constructor(url: string) {
        this.url = url;
    }

    $send(httpOption: HttpOption, requestHandler?: (requestData: HttpOption) => HttpOption): Promise<any> {
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
                }
            }

            let requestData: HttpOption = {
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
                } catch (exception) {
                    responseDataJson = responseData;
                }
                if (variable.isObject(this.data[methodName].response)) {
                    if (variable.isObject(responseDataJson)) {
                        for (let key in responseDataJson) {
                            if (this.data[methodName].response[key] === undefined) {
                                this.data[methodName].response[key] = null;
                            }
                        }
                    }
                    variable.assignment(this.data[methodName].response, responseDataJson);
                } else {
                    this.data[methodName].response = responseDataJson;
                }
                s(this.data[methodName].response);
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $download(httpOption: HttpOption, requestHandler?: (requestData: HttpOption) => HttpOption): Promise<any> {
        return new Promise((s: Function, e) => {
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
                }
            }
            let requestData: HttpOption = {
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

    $requestHandler(requestData: HttpOption): HttpOption {
        return requestData;
    }

    $addData(methodName: string, request?: any, result?: any): void {
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

};