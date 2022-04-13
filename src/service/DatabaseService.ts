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

};