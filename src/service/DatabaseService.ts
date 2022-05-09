import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";
import httpType from "../model/httpType";
import BaseService from "./BaseService";

export default class DatabaseService<T extends BasePO> extends BaseService {

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
        super(url);
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
        return this.$send({
            url: "query",
            type: httpType.POST,
            data: request
        });
    }

    save(request?: T) {
        return this.$send({
            url: "save",
            type: httpType.POST,
            data: request
        });
    }

    saveList(request?: T[]) {
        return this.$send({
            url: "saveList",
            type: httpType.POST,
            data: request
        });
    }

    doDelete(request?: T) {
        return this.$send({
            url: "delete",
            type: httpType.POST,
            data: request
        });
    }

    deleteList(request?: T[]) {
        return this.$send({
            url: "deleteList",
            type: httpType.POST,
            data: request
        });
    }

};