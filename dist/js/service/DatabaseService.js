import ResponseResult from "../model/ResponseResult";
import Query from "../model/Query";
import httpType from "../model/httpType";
import BaseService from "./BaseService";
import QueryResult from "../model/QueryResult";
export default class DatabaseService extends BaseService {
    data;
    constructor(url, t) {
        super(url);
        this.data = {
            query: {
                request: new Query(),
                response: new ResponseResult({
                    result: new QueryResult()
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
