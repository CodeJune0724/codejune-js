import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";
import httpType from "../model/httpType";
import BaseService from "./BaseService";
import QueryResult from "../model/QueryResult";
import filter from "../model/filter";
import variable from "../variable";

export default class DatabaseService<T extends BasePO, DATA_MORE extends { [key: string]: { request?: any, response: ResponseResult<any> } } = {}> extends BaseService {

    data: {
        query: {
            request: Query<T>,
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
        getDetails: {
            request: any,
            response: ResponseResult<object>
        }
    } & DATA_MORE;

    constructor(url: string, t: T, filter?: filter<T>) {
        super(url);
        // @ts-ignore
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

    query(request?: Query<T>) {
        return this.$send<QueryResult<T>>({
            url: "query",
            type: httpType.POST,
            body: request
        });
    }

    save(request?: T) {
        return this.$send<T>({
            url: "save",
            type: httpType.POST,
            body: request
        });
    }

    saveList(request?: T[]) {
        return this.$send<T[]>({
            url: "saveList",
            type: httpType.POST,
            body: request
        });
    }

    doDelete(request?: T) {
        return this.$send<null>({
            url: "delete",
            type: httpType.POST,
            body: request
        });
    }

    deleteList(request?: T[]) {
        return this.$send<null>({
            url: "deleteList",
            type: httpType.POST,
            body: request
        });
    }

    getDetails(id?: any) {
        if (id) {
            this.data.getDetails.request = id;
        }
        return this.$send<object>({
            config: {
                name: "getDetails"
            },
            url: this.data.getDetails.request,
            type: httpType.GET
        });
    }

};