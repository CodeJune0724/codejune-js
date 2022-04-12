import variable from "../variable";
import InfoException from "../exception/InfoException";
import http from "../http";
import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";

export default class DatabaseService<T extends BasePO> {

    url: string;

    constructor(url: string) {
        this.url = url;
    }

    query(request?: Query) {
        return this.$send("query", "POST", request);
    }

    save(request?: T) {
        return this.$send("save", "POST", request);
    }

    saveList(request?: T[]) {
        return this.$send("saveList", "POST", request);
    }

    doDelete(request?: T) {
        return this.$send("delete", "POST", request);
    }

    deleteList(request?: T[]) {
        return this.$send("deleteList", "POST", request);
    }

    $send(methodName: string, type: string, request?: any): Promise<any> {
        return new Promise((s, e) => {
            if (variable.isEmpty(methodName)) {
                throw new InfoException("方法名 is null");
            }
            if (variable.isEmpty(type)) {
                throw new InfoException("type is null");
            }
            let requestData: any = {
                url: this.url + "/" + methodName,
                type: type,
                data: request
            };
            requestData = this.$requestHandler(requestData);
            http.send(requestData).then((responseData) => {
                let responseDataJson = JSON.parse(responseData);
                let responseResult = new ResponseResult(responseDataJson);
                if (responseResult.flag) {
                    s(responseResult);
                } else {
                    e(responseResult);
                }
            }).catch((responseData) => {
                e(responseData);
            });
        });
    }

    $requestHandler(requestData: object): object {
        return requestData;
    }

};
