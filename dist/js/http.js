import variable from "./variable";
import httpType from "./model/httpType";
export default {
    send(data) {
        return new Promise((success, error) => {
            let url = this._getUrl(data);
            let type = data.type;
            let header = data.header ? data.header : {};
            let sendData = data.data;
            // 判断是否有文件
            let isExistFile = false;
            if (variable.isObject(sendData)) {
                for (let key in sendData) {
                    if (variable.getType(sendData[key]) === File) {
                        isExistFile = true;
                        break;
                    }
                }
                if (isExistFile) {
                    let formData = new FormData();
                    for (let key in sendData) {
                        formData.append(key, sendData[key]);
                    }
                    sendData = formData;
                }
            }
            // 转换请求数据
            if (variable.isObject(sendData)) {
                if (variable.getType(sendData) !== FormData) {
                    sendData = JSON.stringify(sendData);
                }
            }
            // 添加application/json
            if (type !== httpType.GET && !isExistFile) {
                header["content-type"] = "application/json";
            }
            fetch(url, {
                cache: "no-cache",
                credentials: "same-origin",
                mode: "cors",
                redirect: "follow",
                referrer: "no-referrer",
                method: type,
                headers: header,
                body: sendData
            }).then((response) => {
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
    },
    download(data) {
        return new Promise((success, error) => {
            try {
                window.open(this._getUrl(data));
                success();
            }
            catch (e) {
                error(e);
            }
        });
    },
    asyncDownload(data) {
        return new Promise((success, error) => {
            fetch(this._getUrl(data)).then((response) => {
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
                        a.download = filename;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        success();
                    }
                    catch (e) {
                        error(e);
                    }
                });
            });
        });
    },
    _getUrl(data) {
        let url = data.url;
        let urlData = data.urlData ? data.urlData : {};
        if (!variable.isEmpty(urlData)) {
            let u = "?";
            for (let key in urlData) {
                let value = urlData[key];
                if (!variable.isEmpty(value)) {
                    u = u + key + "=" + value + "&";
                }
            }
            if (u !== "?") {
                u = u.substring(0, u.length - 1);
            }
            else {
                u = "";
            }
            url = url + u;
        }
        return url;
    }
};
