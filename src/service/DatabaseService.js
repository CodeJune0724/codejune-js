import variable from "../variable.js";
import InfoException from "../exception/InfoException.js";
import http from "../http.js";

export default class DatabaseService {

    server = null;

    moduleName = null;

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

    constructor(server, moduleName, sendFunction) {
        this.server = server;
        this.moduleName = moduleName;
        if (variable.isEmpty(sendFunction)) {
            sendFunction = http.send;
        }
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

    delete(request) {
        return this.$send("delete", request);
    }

    deleteList(request) {
        return this.$send("deleteList", request);
    }

    getUrl(type) {
        if (variable.isEmpty(this.server) || variable.isEmpty(this.moduleName) || variable.isEmpty(type)) {
            throw new InfoException("服务地址或者模块名为配置");
        }
        return this.server + "/" + this.moduleName + "/" + type;
    }

    $send(type, request) {
        if (variable.isEmpty(type)) {
            throw new InfoException("type is null");
        }
        if (!variable.isEmpty(request)) {
            this.data[type].request = request;
        }
        return this.sendFunction({
            url: this.getUrl(type),
            type: "POST",
            data: this.data[type].request
        }).then((responseData) => {
            this.data[type].response = responseData.data;
        });
    }

};