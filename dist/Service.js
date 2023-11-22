import Http from "./Http";
import variable from "./variable";
let getHttp = (request, service) => {
    request.url = request.url.startsWith("http") ? request.url : service.url ? `${service.url}${request.url ? request.url.startsWith("/") ? request.url : `/${request.url}` : ""}` : request.url;
    let result = new Http(request.url, request.type);
    if (request.header) {
        for (let key in request.header) {
            result.addHeader(key, request.header[key]);
        }
    }
    if (request.param) {
        for (let key in request.param) {
            result.addParam(key, request.param[key]);
        }
    }
    result.setBody(request.body);
    if (result.contentType === null && request.type !== "GET" && variable.isObject(request.body)) {
        result.setContentType("APPLICATION_JSON");
    }
    return result;
};
let responseHandler = (response) => {
    let result;
    try {
        result = JSON.parse(response);
    }
    catch (e) {
        result = response;
    }
    return result;
};
export default class Service {
    url;
    constructor(url) {
        this.url = url;
    }
    $send(request) {
        return new Promise((s, e) => {
            getHttp(request, this).send().then((response) => {
                s(responseHandler(response));
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }
    $download(request) {
        return new Promise((s, e) => {
            getHttp(request, this).download().then(() => {
                s();
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }
    $asyncDownload(request) {
        return new Promise((s, e) => {
            getHttp(request, this).asyncDownload().then(() => {
                s();
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }
}
;
