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

    $send<T>(httpOption: HttpRequest, requestHandler?: (requestData: HttpRequest) => void): Promise<ResponseResult<T>> {
        return new Promise<ResponseResult<T>>((success, error) => {
            super.$send(httpOption, requestHandler).then((responseData) => {
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