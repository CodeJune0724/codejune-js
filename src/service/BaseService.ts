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

    $send(methodName: string, type: httpType, request?: any): Promise<any> {
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

            let requestData: any = {
                url: this.url + "/" + methodName,
                type: type,
                data: this.data[methodName].request
            };
            requestData = this.$requestHandler(requestData);
            http.send(requestData).then((responseData) => {
                let responseDataJson = JSON.parse(responseData);
                this.data[methodName].response!.setData(responseDataJson);
                if (this.data[methodName].response!.flag) {
                    s(this.data[methodName].response);
                } else {
                    e(this.data[methodName].response);
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