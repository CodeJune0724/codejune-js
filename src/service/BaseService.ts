import ResponseResult from "../model/ResponseResult";
import HttpRequest from "../model/HttpRequest";
import Service from "../Service";

export default class BaseService extends Service {

    data: {
        [key: string]: {
            request?: any,
            response: ResponseResult,
            [ key: string ]: any
        }
    } = {};

    constructor(url: string) {
        super(url);
    }

    $send(httpOption: HttpRequest, requestHandler?: (requestData: HttpRequest) => void): Promise<ResponseResult> {
        return new Promise<ResponseResult>((success, error) => {
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