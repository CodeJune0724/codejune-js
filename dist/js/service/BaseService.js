import Service from "../Service";
export default class BaseService extends Service {
    data = {};
    constructor(url) {
        super(url);
    }
    $send(httpOption, requestHandler) {
        return new Promise((success, error) => {
            super.$send(httpOption, requestHandler).then((responseData) => {
                if (responseData.flag) {
                    success(responseData);
                }
                else {
                    error(responseData);
                }
            }).catch((e) => {
                error(e);
            });
        });
    }
}
;
