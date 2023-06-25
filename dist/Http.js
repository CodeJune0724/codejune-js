import variable from "./variable";
export default class Http {
    url = "";
    type = "GET";
    param = {};
    header = {};
    contentType = null;
    body = null;
    constructor(url, type) {
        this.url = url;
        this.type = type;
    }
    addHeader(key, value) {
        this.header[key] = value;
    }
    addParam(key, value) {
        this.param[key] = value;
    }
    setContentType(contentType) {
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
    setBody(body) {
        this.body = body;
    }
    send() {
        return new Promise((success, error) => {
            this._getFetch().then((response) => {
                let responseText = response.text();
                if (response.ok) {
                    success(responseText);
                }
                else {
                    error(responseText);
                }
            }).catch((m) => {
                error(m);
            });
        });
    }
    download() {
        return new Promise((success, error) => {
            try {
                window.open(this._getUrl());
                success();
            }
            catch (e) {
                error(e);
            }
        });
    }
    asyncDownload() {
        return new Promise((success, error) => {
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
            });
        });
    }
    _getFetch() {
        if (!variable.isNull(this.body) && typeof this.body === "object") {
            let checkFile = (data) => {
                if (variable.isNull(data)) {
                    return false;
                }
                if (data.constructor === File || data.constructor === FileList) {
                    return true;
                }
                for (let key in data) {
                    let value = this.body[key];
                    if (checkFile(value)) {
                        return true;
                    }
                }
                return false;
            };
            if (checkFile(this.body)) {
                this.contentType = "FORM_DATA";
            }
        }
        if (this.contentType === "FORM_DATA") {
            delete this.header["Content-type"];
            let formData = new FormData();
            if (!variable.isNull(this.body) && typeof this.body === "object") {
                for (let key in this.body) {
                    let value = this.body[key];
                    if (value === undefined) {
                        continue;
                    }
                    if (!variable.isNull(value) && (value.constructor === FileList || Array.isArray(value))) {
                        for (let item of value) {
                            formData.append(key, item);
                        }
                    }
                    else {
                        formData.append(key, value);
                    }
                }
            }
            this.body = formData;
        }
        else {
            if (variable.isNull(this.body) && typeof this.body === "object") {
                this.body = JSON.stringify(this.body);
            }
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
    _getUrl() {
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
            }
            else {
                param = "";
            }
            result = result + param;
        }
        return result;
    }
}
;
