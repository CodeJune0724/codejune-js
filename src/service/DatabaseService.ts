import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";
import httpType from "../model/httpType";
import BaseService from "./BaseService";
import QueryResult from "../model/QueryResult";

export default class DatabaseService<T extends BasePO> extends BaseService {

    data: {
        query: {
            request: Query,
            response: ResponseResult<QueryResult<T>>;
        },
        save: {
            request: T | null,
            response: ResponseResult<T>
        },
        saveList: {
            request: T[] | null,
            response: ResponseResult<T[]>
        },
        delete: {
            request: T | null,
            response: ResponseResult<null>
        },
        deleteList: {
            request: T[] | null,
            response: ResponseResult<null>
        },
        [key: string]: {
            request: any,
            response: ResponseResult<any>
        }
    };

    constructor(url: string, t?: T) {
        super(url);
        this.data = {
            query: {
                request: new Query(),
                response: new ResponseResult()
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
        return this.$send<QueryResult<T>>({
            url: "query",
            type: httpType.POST,
            data: request
        });
    }

    save(request?: T) {
        return this.$send<T>({
            url: "save",
            type: httpType.POST,
            data: request
        });
    }

    saveList(request?: T[]) {
        return this.$send<T[]>({
            url: "saveList",
            type: httpType.POST,
            data: request
        });
    }

    doDelete(request?: T) {
        return this.$send<null>({
            url: "delete",
            type: httpType.POST,
            data: request
        });
    }

    deleteList(request?: T[]) {
        return this.$send<null>({
            url: "deleteList",
            type: httpType.POST,
            data: request
        });
    }

};