import HttpOption from "./model/HttpOption";
import variable from "./variable";
import base64 from "./base64";
import httpType from "./model/httpType";

export default {
    send(data: HttpOption): Promise<any> {
        return new Promise((success, error) => {
            let http = new XMLHttpRequest();
            let url: string = this._getUrl(data);
            let header: object = data.header ? data.header : {};
            let sendData: any | null = data.data;

            // 判断是否有文件
            if (!variable.isEmpty(data.data)) {
                let isExistFile = false;
                for (let key in data.data) {
                    if (variable.getType(variable.getValue(data.data, key)) === File) {
                        isExistFile = true;
                        break;
                    }
                }
                if (isExistFile) {
                    let formData = new FormData();
                    for (let key in data.data) {
                        formData.append(key, variable.getValue(data.data, key));
                    }
                    sendData = formData;
                }
            }

            // 添加application/json
            if (data.type !== httpType.GET) {
                variable.setValue(header, "content-type", "application/json");
            }

            http.open(data.type, url);
            for (let key in header) {
                http.setRequestHeader(key, variable.getValue(header, key));
            }

            if (variable.isEmpty(sendData)) {
                http.send();
            } else {
                if (variable.getType(sendData) === FormData) {
                    http.send(sendData);
                } else {
                    http.send(variable.toStr(sendData));
                }
            }

            http.onreadystatechange = function () {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        success(http.response);
                    } else {
                        error(http.response);
                    }
                }
            }
        });
    },

    download(data: HttpOption): Promise<any> {
        return new Promise((success: Function, error) => {
            try {
                window.open(this._getUrl(data));
                success();
            } catch (e) {
                error(e);
            }
        });
    },

    asynchronousDownload(data: HttpOption): Promise<any> {
        return new Promise((success, error) => {
            let http = new XMLHttpRequest();
            http.open(data.type, this._getUrl(data));
            http.responseType = "blob";
            if (!variable.isEmpty(data.header)) {
                for (let key in data.header) {
                    http.setRequestHeader(key, variable.getValue(data.header, key));
                }
            }
            http.send();
            http.onload = function () {
                if (http.status === 200) {
                    let fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        // 下载失败
                        let type: any = e.target!.result;
                        if (type.substring(0, 29) === "data:application/json;base64,") {
                            let r = base64.decode(type.substring(29, type.length));
                            error(r);
                            return;
                        }

                        let a: any = document.createElement("a");
                        a.download = decodeURIComponent(http.getResponseHeader("Content-disposition")!).substring(20);
                        a.href = e.target!.result;
                        a.click();
                        success(undefined);
                    };
                    fileReader.readAsDataURL(http.response);
                } else {
                    try {
                        http.responseText;
                    } catch (e) {
                        error(e);
                    }
                }
            };
        });
    },

    _getUrl(data: HttpOption): string {
        let url = data.url;
        if (data.type === httpType.GET && !variable.isEmpty(data.urlData)) {
            let u = "?";
            for (let key in data.urlData) {
                let value = variable.getValue(data.urlData, key);
                if (!variable.isEmpty(value)) {
                    value = variable.toStr(value);
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
    }
};