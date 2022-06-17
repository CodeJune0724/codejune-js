import ResponseResult from "../model/ResponseResult";
import HttpRequest from "../model/HttpRequest";
import Service from "../Service";
export default class BaseService extends Service {
    data: {
        [key: string]: {
            request?: any;
            response: ResponseResult<any>;
            [key: string]: any;
        };
    };
    constructor(url: string);
    $send<T>(httpRequest: HttpRequest, requestHandler?: (httpRequest: HttpRequest) => void): Promise<ResponseResult<T>>;
}
