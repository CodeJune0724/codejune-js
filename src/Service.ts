import variable from "./variable";
import InfoException from "./exception/InfoException";
import http from "./http";
import httpType from "./model/httpType";
import HttpRequest from "./model/HttpRequest";

export default class Service {

    url: string;

    data: {
        [key: string]: {
            request?: any,
            response: any,
            [ key: string ]: any
        }
    } = {};

    constructor(url: string) {
        this.url = url;
    }

    $send(httpRequest: HttpRequest, requestHandler?: (httpRequest: HttpRequest) => void): Promise<any> {
        return new Promise<any>((s, e) => {
            let methodName = httpRequest.url;
            let type = httpRequest.type;
            let header = httpRequest.header;
            let data = httpRequest.data;
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
            if (data !== undefined && data !== null) {
                this.data[methodName].request = data;
            }
            if (variable.isEmpty(requestHandler) || requestHandler === undefined) {
                requestHandler = () => {}
            }

            let requestData: HttpRequest = {
                url: this.url + "/" + methodName,
                type: type,
                header: header,
                data: this.data[methodName].request,
                param: param
            };
            requestHandler(requestData);
            this.$requestHandler(requestData);
            http.send(requestData).then((responseData) => {
                variable.clean(this.data[methodName].response);
                let responseDataJson;
                try {
                    responseDataJson = JSON.parse(responseData);
                } catch (exception) {
                    responseDataJson = responseData;
                }
                if (variable.isObject(this.data[methodName].response)) {
                    variable.addKey(this.data[methodName].response, responseDataJson);
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

    $download(httpRequest: HttpRequest, requestHandler?: (requestData: HttpRequest) => void): Promise<any> {
        return new Promise<any>((s: Function, e) => {
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
                requestHandler = () => {}
            }
            let requestData: HttpRequest = {
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

    $requestHandler(httpRequest: HttpRequest): void {}

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