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
    query(request) {
        return this.$send({
            url: "query",
            type: httpType.POST,
            body: request
        });
    }
    save(request) {
        return this.$send({
            url: "save",
            type: httpType.POST,
            body: request
        });
    }
    saveList(request) {
        return this.$send({
            url: "saveList",
            type: httpType.POST,
            body: request
        });
    }
    doDelete(request) {
        return this.$send({
            url: "delete",
            type: httpType.POST,
            body: request
        });
    }
    deleteList(request) {
        return this.$send({
            url: "deleteList",
            type: httpType.POST,
            body: request
        });
    }
    getDetails(id) {
        if (id) {
            this.data.getDetails.request = id;
        }
        return this.$send({
            config: {
                name: "getDetails"
            },
            url: this.data.getDetails.request,
            type: httpType.GET
        });
    }
}
;
