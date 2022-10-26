import Request from "./http/Request";
import variable from "./variable";

export default {
    send(data: Request): Promise<any> {
        return new Promise((success, error) => {
            this._getFetch(data).then((response) => {
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
    },

    download(data: Request): Promise<any> {
        return new Promise((success: Function, error) => {
            try {
                window.open(this._getUrl(data));
                success();
            } catch (e) {
                error(e);
            }
        });
    },

    asyncDownload(data: Request): Promise<any> {
        return new Promise((success: any, error) => {
            this._getFetch(data).then((response) => {
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
    },

    _getUrl(data: Request): string {
        let url = data.url;
        let param: { [key: string]: string } = data.param ? data.param : {};
        if (!variable.isEmpty(param)) {
            let u = "?";
            for (let key in param) {
                let value = param[key];
                if (!variable.isEmpty(value)) {
                    u = u + key + "=" + value + "&";
                }
            }
            if (u !== "?") {
                u = u.substring(0, u.length - 1);
            } else {
                u = "";
            }
            url = url + u;
        }
        return url;
    },

    _getFetch(data: Request): Promise<Response> {
        let url: string = this._getUrl(data);
        let type = data.type;
        let header: { [key: string]: string } = data.header ? data.header : {};
        let sendData: any = data.body;
        let config = data.config;

        // 判断是否有文件
        let isExistFile: boolean = false;
        if (variable.isObject(sendData)) {
            for (let key in sendData) {
                let valueType = variable.getType(sendData[key]);
                if (valueType === File || valueType === FileList) {
                    isExistFile = true;
                    break;
                }
                if (valueType === Array) {
                    for (let item of sendData[key]) {
                        if (variable.getType(item) === File || variable.getType(item) === FileList) {
                            isExistFile = true;
                            break;
                        }
                    }
                }
            }
            if (isExistFile) {
                let formData = new FormData();
                for (let key in sendData) {
                    let value = sendData[key];
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
                sendData = formData;
            }
        }

        // 转换请求数据
        if (variable.isObject(sendData)) {
            if (variable.getType(sendData) !== FormData) {
                let dataType = "BODY";
                if (config) {
                    if (config.dataType) {
                        dataType = config.dataType;
                    }
                }
                switch (dataType) {
                    case "BODY":
                        sendData = JSON.stringify(sendData);
                        break;
                    case "FORM_DATA":
                        let formData = new FormData();
                        for (let key in sendData) {
                            formData.append(key, sendData[key]);
                        }
                        sendData = formData;
                        break;
                }
            }
        }

        // 添加application/json
        if (type !== "GET" && !isExistFile) {
            header["content-type"] = "application/json";
        }

        return fetch(url, {
            cache: "no-cache",
            credentials: "same-origin",
            mode: "cors",
            redirect: "follow",
            referrer: "no-referrer",
            method: type,
            headers: header,
            body: type !== "GET" ? sendData : undefined
        });
    }
};