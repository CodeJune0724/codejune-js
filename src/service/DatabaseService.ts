import variable from "../variable";
import InfoException from "../exception/InfoException";
import http from "../http";
import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";
import httpType from "../model/httpType";

export default class DatabaseService<T extends BasePO> {

    url: string;

    data: {
        query: {
            request: Query,
            response: ResponseResult;
        },
        save: {
            request: T | null,
            response: ResponseResult
        },
        saveList: {
            request: T[] | null,
            response: ResponseResult
        },
        delete: {
            request: T | null,
            response: ResponseResult
        },
        deleteList: {
            request: T[] | null,
            response: ResponseResult
        },
        [key: string]: {
            request: any,
            response: ResponseResult
        }
    };

    constructor(url: string, t?: T) {
        this.url = url;
        this.data = {
            query: {
                request: new Query(),
                response: new ResponseResult({
                    result: {
                        count: null,
                        data: null
                    }
                })
            },
            save: {
                request: t === undefined ? null : t,
                response: new ResponseResult()
            },
            saveList: {
                request: t === undefined ? null : [],
                response: new ResponseResult()
            },

            delete: {
                request: t === undefined ? null : t,
                response: new ResponseResult()
            },
            deleteList: {
                request: t === undefined ? null : [],
                response: new ResponseResult()
            }
        };
    }

    query(request?: Query) {
        return this.$send("query", httpType.POST, request);
    }

    save(request?: T) {
        return this.$send("save", httpType.POST, request);
    }

    saveList(request?: T[]) {
        return this.$send("saveList", httpType.POST, request);
    }

    doDelete(request?: T) {
        return this.$send("delete", httpType.POST, request);
    }

    deleteList(request?: T[]) {
        return this.$send("deleteList", httpType.POST, request);
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