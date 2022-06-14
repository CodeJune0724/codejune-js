import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";
import httpType from "../model/httpType";
import BaseService from "./BaseService";
import QueryResult from "../model/QueryResult";
import filter from "../model/filter";
import { addNull } from "../util/TypeUtil";
import variable from "../variable";

export default class DatabaseService<T extends BasePO, FILTER extends addNull<filter<T>> = null> extends BaseService {

    data: {
        query: {
            request: Query<FILTER>,
            response: ResponseResult<QueryResult<T>>;
        },
        save: {
            request: T,
            response: ResponseResult<T>
        },
        saveList: {
            request: T[],
            response: ResponseResult<T[]>
        },
        delete: {
            request: T,
            response: ResponseResult<null>
        },
        deleteList: {
            request: T[],
            response: ResponseResult<null>
        },
        [key: string]: {
            request: any,
            response: ResponseResult<any>
        }
    };

    constructor(url: string, t: T, filter?: FILTER) {
        super(url);
        this.data = {
            query: {
                request: new Query({
                    filter: filter
                }),
                response: new ResponseResult({
                    result: new QueryResult()
                })
            },
            save: {
                request: variable.clone(t),
                response: new ResponseResult()
            },
            saveList: {
                request: [],
                response: new ResponseResult()
            },

            delete: {
                request: variable.clone(t),
                response: new ResponseResult()
            },
            deleteList: {
                request: [],
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