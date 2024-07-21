type type = "GET" | "POST" | "PUT" | "DELETE";
type contentType = "APPLICATION_JSON" | "APPLICATION_XML" | "FORM_DATA" | "ROW";

interface Request {
    url: string;
    type: type;
    param?: { [key: string]: string | null };
    header?: { [key: string]: string | null };
    contentType?: contentType | null;
    body?: any;
}

let getUrl = (url: string, param?: { [key: string]: string | null }, uri?: string): string => {
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
    } else {
        paramString = "";
    }
    result = result + paramString;
    return result;
};

let getFetch = (request: Request): Promise<Response> => {
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
                } else {
                    formData.append(key, value);
                }
            }
        }
        request.body = formData;
    } else {
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
            let result: { [key: string]: string } = {};
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
}

export default class Http {

    readonly request: Request = {
        url: "",
        type: "GET"
    };

    constructor(url: string, type: type) {
        this.request.url = url;
        this.request.type = type;
    }

    addHeader(key: string, value: string | null) {
        if (!this.request.header) {
            this.request.header = {};
        }
        this.request.header[key] = value;
    }

    addParam(key: string, value: string | null) {
        if (!this.request.param) {
            this.request.param = {};
        }
        this.request.param[key] = value;
    }

    setContentType(contentType: contentType | null) {
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
            case "ROW":
                this.request.header[key] = "text/plain";
                break;
            case null:
                delete this.request.header[key];
                break;
        }
    }

    setBody(body: any) {
        this.request.body = body;
    }

    send(): Promise<string> {
        return new Promise((success, error) => {
            getFetch(this.request).then((response) => {
                let responseText = response.text();
                if (response.ok) {
                    success(responseText);
                } else {
                    error(responseText);
                }
            }).catch((e) => {
                error(e);
            });
        });
    }

    download(): Promise<undefined> {
        return new Promise((success: Function, error) => {
            try {
                window.open(getUrl(this.request.url, this.request.param));
                success();
            } catch (e) {
                error(e);
            }
        });
    }

    asyncDownload(): Promise<undefined> {
        return new Promise((success: any, error) => {
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
                        } catch (e) {
                            error(e);
                        }
                    });
                } else {
                    response.text().then((text) => {
                        error(text);
                    });
                }
            }).catch((e) => {
                error(e);
            });
        });
    }

    sendOfBlob(): Promise<Blob> {
        return new Promise((success: any, error) => {
            getFetch(this.request).then((response) => {
                response.blob().then((blob) => {
                    success(blob);
                });
            }).catch((e) => {
                error(e);
            });
        });
    }

};

export { type, contentType, Request, getUrl };