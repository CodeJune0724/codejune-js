import variable from "../variable";
import InfoException from "../exception/InfoException";
import http from "../http";
import ResponseResult from "../model/ResponseResult";
import httpType from "../model/httpType";

export default class BaseService {

    url: string;

    data: {
        [key: string]: {
            request: any,
            response: ResponseResult
        }
    } = {};

    constructor(url: string) {
        this.url = url;
    }

    $send(methodName: string, type: httpType, request?: any, requestHandler?: (requestData: object) => object): Promise<any> {
        return new Promise((s, e) => {
            if (variable.isEmpty(methodName)) {
                throw new InfoException("方法名 is null");
            }
            if (variable.isEmpty(type)) {
                throw new InfoException("type is null");
            }
            if (variable.isEmpty(this.data[methodName])) {
                this.data[methodName] = {
                    request: {},
                    response: new ResponseResult()
                };
            }
            if (request !== undefined) {
                this.data[methodName].request = request;
            }
            if (requestHandler === undefined || variable.isEmpty(requestHandler)) {
                requestHandler = (requestData) => {
                    return requestData;
                }
            }

            let requestData: any = {
                url: this.url + "/" + methodName,
                type: type,
                data: this.data[methodName].request
            };
            requestData = requestHandler(requestData);
            requestData = this.$requestHandler(requestData);
            http.send(requestData).then((responseData) => {
                let responseDataJson = JSON.parse(responseData);
                let responseResult = new ResponseResult(responseDataJson);
                this.data[methodName].response = responseResult;
                if (responseResult.flag) {
                    s(responseResult);
                } else {
                    e(responseResult);
                }
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $requestHandler(requestData: object): object {
        return requestData;
    }

    $addData(methodName: string, request?: any, result?: any): void {
        if (request === undefined) {
            request = {};
        }
        this.data[methodName] = {
            request: request,
            response: new ResponseResult({
                result
            })
        };
    }

};