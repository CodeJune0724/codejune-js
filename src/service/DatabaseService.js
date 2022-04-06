import variable from "../variable.js";
import InfoException from "../exception/InfoException.js";
import http from "../http.js";
import ResponseResult from "../model/ResponseResult.js";

export default class DatabaseService {

    url = null;

    data = {
        query: {
            request: {
                page: null,
                size: null,
                filter: {},
                sort: {
                    column: null,
                    orderBy: null
                }
            },

            response: new ResponseResult()
        },

        save: {
            request: {},

            response: new ResponseResult()
        },

        saveList: {
            request: [],

            response: new ResponseResult()
        },

        delete: {
            request: {},

            response: new ResponseResult()
        },

        deleteList: {
            request: [],

            response: new ResponseResult()
        }
    };

    constructor(url) {
        this.url = url;
    }

    query(request) {
        return this.$send("query", "POST", request);
    }

    save(request) {
        return this.$send("save", "POST", request);
    }

    saveList(request) {
        return this.$send("saveList", "POST", request);
    }

    doDelete(request) {
        return this.$send("delete", "POST", request);
    }

    deleteList(request) {
        return this.$send("deleteList", "POST", request);
    }

    $send(methodName, type, request) {
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
            let requestData = {
                url: this.url + "/" + methodName,
                type: type,
                data: this.data[methodName].request
            };
            requestData = this.$requestHandler(requestData);
            http.send(requestData).then((responseData) => {
                let responseDataJson = JSON.parse(responseData);
                this.data[methodName].response.setData(responseDataJson);
                s(this.data[methodName].response);
            }).catch((responseData) => {
                this.data[methodName].response = JSON.parse(responseData);
                e(this.data[methodName].response);
            });
        });
    }

    $requestHandler(requestData) {
        return requestData;
    }

};