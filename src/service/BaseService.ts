import ResponseResult from "../model/ResponseResult";
import HttpRequest from "../model/HttpRequest";
import Service from "../Service";

export default class BaseService extends Service {

    data: {
        [key: string]: {
            request?: any,
            response: ResponseResult<any>,
            [ key: string ]: any
        }
    } = {};

    constructor(url: string) {
        super(url);
    }

    $send<T>(httpRequest: HttpRequest, requestHandler?: (httpRequest: HttpRequest) => void): Promise<ResponseResult<T>> {
        return new Promise<ResponseResult<T>>((success, error) => {
            super.$send(httpRequest, requestHandler).then((responseData) => {
                if (responseData.flag) {
                    success(responseData);
                } else {
                    error(responseData);
                }
            }).catch((e) => {
                error(e);
            });
        });
    }

};