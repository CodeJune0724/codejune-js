let getUrl = (url, param, uri) => {
    let result = uri && uri.startsWith("http") ? uri : `${url}${uri ? `/${uri}` : ""}`;
    if (!param) {
        return result;
    }
    let paramString = "?";
    for (let key in param) {
        let value = param[key];
        if (value) {
            paramString = paramString + key + "=" + value + "&";
        }
    }
    if (paramString !== "?") {
        paramString = paramString.substring(0, paramString.length - 1);
    }
    else {
        paramString = "";
    }
    result = result + paramString;
    return result;
};
let getFetch = (request) => {
    if (request.contentType === "FORM_DATA") {
        if (request.header) {
            delete request.header["Content-type"];
        }
        let formData = new FormData();
        if (request.body && typeof request.body === "object") {
            for (let key in request.body) {
                let value = request.body[key];
                if (!value) {
                    continue;
                }
                if (value.constructor === FileList || Array.isArray(value)) {
                    for (let item of value) {
                        formData.append(key, item);
                    }
                }
                else {
                    formData.append(key, value);
                }
            }
        }
        request.body = formData;
    }
    else {
        if (request.body) {
            request.body = JSON.stringify(request.body);
        }
    }
    return fetch(getUrl(request.url, request.param), {
        cache: "no-cache",
        credentials: "same-origin",
        mode: "cors",
        redirect: "follow",
        referrer: "no-referrer",
        method: request.type,
        headers: (() => {
            let result = {};
            if (request.header) {
                for (let key in request.header) {
                    let value = request.header[key];
                    if (!value) {
                        continue;
                    }
                    result[key] = value;
                }
            }
            return result;
        })(),
        body: request.type !== "GET" ? request.body : undefined
    });
};
export default class Http {
    request = {
        url: "",
        type: "GET"
    };
    constructor(url, type) {
        this.request.url = url;
        this.request.type = type;
    }
    addHeader(key, value) {
        if (!this.request.header) {
            this.request.header = {};
        }
        this.request.header[key] = value;
    }
    addParam(key, value) {
        if (!this.request.param) {
            this.request.param = {};
        }
        this.request.param[key] = value;
    }
    setContentType(contentType) {
        this.request.contentType = contentType;
        let key = "Content-type";
        if (!this.request.header) {
            this.request.header = {};
        }
        switch (contentType) {
            case "APPLICATION_JSON":
                this.request.header[key] = "application/json";
                break;
            case "APPLICATION_XML":
                this.request.header[key] = "application/xml";
                break;
            case "FORM_DATA":
                this.request.header[key] = "multipart/form-data";
                break;
            case "TEXT_PLAIN":
                this.request.header[key] = "text/plain";
                break;
            case "TEXT_HTML":
                this.request.header[key] = "text/html";
                break;
            case "FORM_URLENCODED":
                this.request.header[key] = "application/x-www-form-urlencoded";
                break;
            case null:
                delete this.request.header[key];
                break;
        }
    }
    setBody(body) {
        this.request.body = body;
    }
    send() {
        return new Promise((success, error) => {
            getFetch(this.request).then(async (response) => {
                let result = {
                    code: response.status,
                    header: (() => {
                        let header = {};
                        response.headers.forEach((key, value) => {
                            header[key] = value;
                        });
                        return header;
                    })(),
                    body: await response.text()
                };
                success(result);
            }).catch((e) => {
                error(e);
            });
        });
    }
    download() {
        return new Promise((success, error) => {
            try {
                window.open(getUrl(this.request.url, this.request.param));
                success(undefined);
            }
            catch (e) {
                error(e);
            }
        });
    }
    asyncDownload() {
        return new Promise((success, error) => {
            getFetch(this.request).then((response) => {
                let contentType = response.headers.get("Content-Type");
                if (contentType && contentType.indexOf("download") !== -1) {
                    response.blob().then((blob) => {
                        try {
                            let a = document.createElement("a");
                            let url = window.URL.createObjectURL(blob);
                            let filename = response.headers.get("Content-Disposition");
                            filename = filename ? filename : "";
                            let test = /filename=(.*?)$/g;
                            let fileNameList = test.exec(filename);
                            if (fileNameList !== null) {
                                filename = fileNameList[1];
                            }
                            a.href = url;
                            a.download = decodeURI(filename);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            success();
                        }
                        catch (e) {
                            error(e);
                        }
                    });
                }
                else {
                    response.text().then((text) => {
                        error(text);
                    });
                }
            }).catch((e) => {
                error(e);
            });
        });
    }
    sendOfBlob() {
        return new Promise((success, error) => {
            getFetch(this.request).then((response) => {
                response.blob().then((blob) => {
                    let result = {
                        code: response.status,
                        header: (() => {
                            let header = {};
                            response.headers.forEach((key, value) => {
                                header[key] = value;
                            });
                            return header;
                        })(),
                        body: blob
                    };
                    success(result);
                });
            }).catch((e) => {
                error(e);
            });
        });
    }
}
;
export { getUrl };
