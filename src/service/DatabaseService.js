import variable from "../variable.js";
import InfoException from "../exception/InfoException.js";
import http from "../http.js";

export default class DatabaseService {

    url = null;

    sendFunction = null;

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

            response: {
                count: null,
                data: []
            }
        },

        save: {
            request: {},

            response: {}
        },

        saveList: {
            request: [],

            response: {}
        },

        delete: {
            request: {},

            response: {}
        },

        deleteList: {
            request: [],

            response: {}
        }
    };

    constructor(url, sendFunction) {
        this.url = url;
        this.sendFunction = sendFunction;
    }

    query(request) {
        return this.$send("query", request);
    }

    save(request) {
        return this.$send("save", request);
    }

    saveList(request) {
        return this.$send("saveList", request);
    }

    doDelete(request) {
        return this.$send("delete", request);
    }

    deleteList(request) {
        return this.$send("deleteList", request);
    }

    $send(type, request) {
        if (variable.isEmpty(type)) {
            throw new InfoException("type is null");
        }
        if (!variable.isEmpty(request)) {
            this.data[type].request = request;
        }
        let send;
        if (!variable.isEmpty(this.sendFunction) && variable.getType(this.sendFunction) === Function) {
            send = this.sendFunction;
        } else {
            send = http.send;
        }
        return send({
            url: this.url + "/" + type,
            type: "POST",
            data: this.data[type].request
        }, http.send).then((responseData) => {
            this.data[type].response = responseData.data;
        });
    }

};