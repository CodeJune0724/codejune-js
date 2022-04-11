import variable from "../variable";
import InfoException from "../exception/InfoException";
import http from "../http";
import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";

export default class DatabaseService<T extends BasePO> {

    url: string;

    data: {
        query: {
            request: Query | null,
            response: ResponseResult | null;
        },
        save: {
            request: T | null | undefined,
            response: ResponseResult | null
        },
        saveList: {
            request: T[] | null,
            response: ResponseResult | null
        },
        delete: {
            request: T | null | undefined,
            response: ResponseResult | null
        },
        deleteList: {
            request: T[] | null,
            response: ResponseResult | null
        },
        [key: string]: {
            request: any,
            response: ResponseResult | null
        }
    };

    constructor(url: string, t?: T) {
        this.url = url;
        this.data = {
            query: {
                request: null,
                response: null
            },
            save: {
                request: t,
                response: null
            },
            saveList: {
                request: null,
                response: null
            },

            delete: {
                request: t,
                response: null
            },
            deleteList: {
                request: null,
                response: null
            }
        };
    }

    query(request?: Query) {
        return this.$send("query", "POST", request);
    }

    save(request?: T) {
        return this.$send("save", "POST", request);
    }

    saveList(request?: T[]) {
        return this.$send("saveList", "POST", request);
    }

    doDelete(request?: T) {
        return this.$send("delete", "POST", request);
    }

    deleteList(request?: T[]) {
        return this.$send("deleteList", "POST", request);
    }

    $send(methodName: string, type: string, request?: any): Promise<any> {
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
            if (!variable.isEmpty(request)) {
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

};