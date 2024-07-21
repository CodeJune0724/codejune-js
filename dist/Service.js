import Http, { getUrl } from "./Http";
import ServerSentEvent from "./ServerSentEvent";
let getHttp = (service, request) => {
    let result = new Http(getUrl(service.url ? service.url : "", {}, request.url), request.type);
    if (request.param) {
        for (let key in request.param) {
            result.addParam(key, request.param[key]);
        }
    }
    if (request.header) {
        for (let key in request.header) {
            result.addHeader(key, request.header[key]);
        }
    }
    if (request.contentType) {
        result.setContentType(request.contentType);
    }
    result.setBody(request.body);
    if (result.request.contentType === null && result.request.type !== "GET" && typeof result.request.body === "object") {
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
            getHttp(this, request).send().then((response) => {
                s(responseHandler(response));
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }
    $serverSentEvent(url, param) {
        return new ServerSentEvent(getUrl(this.url ? this.url : "", {}, url), param);
    }
    $download(request) {
        return new Promise((s, e) => {
            getHttp(this, request).download().then(() => {
                s();
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }
    $asyncDownload(request) {
        return new Promise((s, e) => {
            getHttp(this, request).asyncDownload().then(() => {
                s();
            }).catch((response) => {
                e(responseHandler(response));
            });
        });
    }
}
;
