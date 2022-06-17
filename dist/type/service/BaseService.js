import Service from "../Service";
export default class BaseService extends Service {
    data = {};
    constructor(url) {
        super(url);
    }
    $send(httpRequest, requestHandler) {
        return new Promise((success, error) => {
            super.$send(httpRequest, requestHandler).then((responseData) => {
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
