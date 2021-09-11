import HttpOption from "../entity/HttpOption.js";
import variable from "./variable.js";
import base64 from "./base64.js";

export default {
    send(data) {
        return new Promise((success, error) => {
            let httpOption = new HttpOption(data);
            let http = new XMLHttpRequest();
            http.open(httpOption.type, httpOption.url);
            if (!variable.isNull(httpOption.header)) {
                for (let key in httpOption.header) {
                    if (httpOption.header.hasOwnProperty(key)) {
                        http.setRequestHeader(key, httpOption.header[key]);
                    }
                }
            }
            if (!variable.isNull(httpOption.data)) {
                http.send(httpOption.data);
            } else {
                http.send();
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

    download(data) {
        return new Promise((success, error) => {
            let httpOption = new HttpOption(data);
            let http = new XMLHttpRequest();
            http.open(httpOption.type, httpOption.url);
            http.responseType = "blob";
            if (!variable.isNull(httpOption.header)) {
                for (let key in httpOption.header) {
                    if (httpOption.header.hasOwnProperty(key)) {
                        http.setRequestHeader(key, httpOption.header[key]);
                    }
                }
            }
            if (!variable.isNull(httpOption.data)) {
                http.send(httpOption.data);
            } else {
                http.send();
            }
            http.onload = function () {
                console.log(http);
                if (http.status === 200) {
                    let fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        // 下载失败
                        let type = e.target.result;
                        if (type.substring(0, 29) === "data:application/json;base64,") {
                            let r = base64.decode(type.substring(29, type.length));
                            error(r);
                            return;
                        }

                        let a = document.createElement("a");
                        a.download = decodeURIComponent(http.getResponseHeader("Content-disposition")).substring(20);
                        a.href = e.target.result;
                        a.click();
                        success();
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
    }
};