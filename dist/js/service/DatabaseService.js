import ResponseResult from "../model/ResponseResult";
import Query from "../model/Query";
import httpType from "../model/httpType";
import BaseService from "./BaseService";
import QueryResult from "../model/QueryResult";
import variable from "../variable";
export default class DatabaseService extends BaseService {
    data;
    constructor(url, t, filter) {
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
    query(request) {
        return this.$send({
            url: "query",
            type: httpType.POST,
            data: request
        });
    }
    save(request) {
        return this.$send({
            url: "save",
            type: httpType.POST,
            data: request
        });
    }
    saveList(request) {
        return this.$send({
            url: "saveList",
            type: httpType.POST,
            data: request
        });
    }
    doDelete(request) {
        return this.$send({
            url: "delete",
            type: httpType.POST,
            data: request
        });
    }
    deleteList(request) {
        return this.$send({
            url: "deleteList",
            type: httpType.POST,
            data: request
        });
    }
}
;
