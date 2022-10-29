import variable from "./variable";

type type = "GET" | "POST" | "PUT" | "DELETE";
type contentType = "APPLICATION_JSON" | "APPLICATION_XML" | "FORM_DATA" | "ROW";

export default class Http {

    readonly url: string = "";

    readonly type: type = "GET";

    readonly param: { [key in string]: string } = {};

    readonly header: { [key in string]: string } & { "Content-type"?: type } = {};

    contentType: contentType | null = null;

    body: any = null;

    constructor(url: string, type: type) {
        this.url = url;
        this.type = type;
    }

    addHeader(key: string, value: string) {
        this.header[key] = value;
    }

    addParam(key: string, value: string) {
        this.param[key] = value;
    }

    setContentType(contentType: contentType | null) {
        this.contentType = contentType;
        let key = "Content-type";
        switch (contentType) {
            case "APPLICATION_JSON":
                this.header[key] = "application/json";
                break;
            case "APPLICATION_XML":
                this.header[key] = "application/xml";
                break;
            case "ROW":
                this.header[key] = "text/plain";
                break;
            case null:
                delete this.header[key];
                break;
        }
    }

    setBody(body: any) {
        this.body = body;
    }

    send(): Promise<string> {
        return new Promise((success, error) => {
            this._getFetch().then((response) => {
                let responseText = response.text();
                if (response.ok) {
                    success(responseText);
                } else {
                    error(responseText);
                }
            }).catch((m) => {
                error(m);
            });
        });
    }

    download(): Promise<undefined> {
        return new Promise((success: Function, error) => {
            try {
                window.open(this._getUrl());
                success();
            } catch (e) {
                error(e);
            }
        });
    }

    asyncDownload(): Promise<undefined> {
        return new Promise((success: any, error) => {
            this._getFetch().then((response) => {
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
            });
        });
    }

    private _getFetch(): Promise<Response> {
        let isExistFile: boolean = false;
        if (variable.isObject(this.body)) {
            for (let key in this.body) {
                let value = this.body[key];
                let valueType = variable.getType(value);
                if (valueType === File || valueType === FileList) {
                    isExistFile = true;
                    break;
                }
                if (valueType === Array) {
                    for (let item of value) {
                        if (variable.getType(item) === File || variable.getType(item) === FileList) {
                            isExistFile = true;
                            break;
                        }
                    }
                }
            }
            if (isExistFile) {
                this.contentType = "FORM_DATA";
            }
        }
        if (this.contentType === "FORM_DATA") {
            let formData = new FormData();
            if (variable.isObject(this.body)) {
                for (let key in this.body) {
                    let value = this.body[key];
                    if (variable.getType(value) === FileList) {
                        for (let item of value) {
                            formData.append(key, item);
                        }
                    } else if (variable.getType(value) === Array) {
                        for (let item of value) {
                            formData.append(key, item);
                        }
                    } else {
                        formData.append(key, value);
                    }
                }
            }
            this.body = formData;
        }
        return fetch(this._getUrl(), {
            cache: "no-cache",
            credentials: "same-origin",
            mode: "cors",
            redirect: "follow",
            referrer: "no-referrer",
            method: this.type,
            headers: this.header,
            body: this.type !== "GET" ? this.body : undefined
        });
    }

    private _getUrl(): string {
        let result = this.url;
        if (!variable.isEmpty(this.param)) {
            let param = "?";
            for (let key in this.param) {
                let value = this.param[key];
                if (value) {
                    param = param + key + "=" + value + "&";
                }
            }
            if (param !== "?") {
                param = param.substring(0, param.length - 1);
            } else {
                param = "";
            }
            result = result + param;
        }
        return result;
    }

};

export { type };