import variable from "../variable.js";
import InfoException from "../exception/InfoException.js";

let types = [String, Number, Object, Array, Boolean];

export default class HttpOption {

    constructor(data) {
        this.url = null;
        this.type = null;
        this.header = null;
        this.urlData = null;
        this.data = null;
        this.check = {
            urlData: null,
            data: null
        };
        this.setContentTypeByJson = true;

        variable.assignment(this, data);
        if (variable.isEmpty(this.url)) {
            throw new InfoException("url不能为空");
        }

        if (variable.isEmpty(this.type)) {
            throw new InfoException("type不能为空");
        }
        if (this.type === "get") {
            this.type = "GET";
        }
        if (this.type === "post") {
            this.type = "POST";
        }
        if (this.type === "put") {
            this.type = "PUT";
        }
        if (this.type === "delete") {
            this.type = "DELETE";
        }
        if (!(this.type === "POST" || this.type === "GET" || this.type === "PUT" || this.type === "DELETE")) {
            throw new InfoException("type错误");
        }

        if (!variable.isNull(this.header)) {
            if (!variable.isObject(this.header)) {
                throw new InfoException("header错误");
            }
            for (let key in this.header) {
                if (this.header.hasOwnProperty(key)) {
                    this.header[key] = variable.toStr(this.header[key]);
                }
            }
        }

        if (!variable.isNull(this.urlData) && !variable.isObject(this.urlData)) {
            throw new InfoException("urlData错误");
        }

        if (!variable.isNull(this.check.urlData)) {
            if (!HttpOption.withType(this.check.urlData)) {
                throw new InfoException("check.urlData错误");
            }

            let newUrlData = HttpOption.getNewData(this.check.urlData);
            variable.assignment(newUrlData, this.urlData, true);
            this.urlData = newUrlData;
        }

        if (!variable.isNull(this.check.data)) {
            if (!HttpOption.withType(this.check.data)) {
                throw new InfoException("check.data错误");
            }

            let newData = HttpOption.getNewData(this.check.data);
            variable.assignment(newData, this.data);
            this.data = newData;
        }

        //  拼接url
        if (!variable.isNull(this.urlData)) {
            let u = "?";
            for (let key in this.urlData) {
                if (this.urlData.hasOwnProperty(key)) {
                    let value = this.urlData[key];
                    if (!variable.isNull(value)) {
                        value = variable.toStr(value);
                        u = u + key + "=" + value + "&";
                    }
                }
            }
            if (u !== "?") {
                u = u.substr(0, u.length - 1);
            } else {
                u = "";
            }
            this.url = this.url + u;
        }

        // 判断是否有文件
        if (this.data !== null) {
            let isExistFile = false;
            for (let key in this.data) {
                if (this.data.hasOwnProperty(key)) {
                    if (variable.getType(this.data[key]) === File) {
                        isExistFile = true;
                        break;
                    }
                }
            }
            if (isExistFile) {
                let formData = new FormData();
                for (let key in this.data) {
                    if (this.data.hasOwnProperty(key)) {
                        formData.append(key, this.data[key]);
                    }
                }
                this.data = formData;
            } else {
                // 添加application/json
                if (this.setContentTypeByJson === true) {
                    if (this.type === "POST") {
                        if (this.header === null) {
                            this.header = {};
                        }
                        this.header["content-type"] = "application/json";
                    }
                }
                this.data = variable.toStr(this.data);
            }
        }
    }

    static withType(checkData) {
        if (!variable.isObject(checkData)) {
            return false;
        }

        for (let key in checkData) {
            if (checkData.hasOwnProperty(key)) {
                let value = checkData[key];
                if (variable.isObject(value)) {
                    if (!HttpOption.withType(value)) {
                        return false;
                    }
                } else {
                    let isOk = false;
                    for (let item of types) {
                        if (item === value) {
                            isOk = true;
                        }
                    }
                    if (!isOk) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    static getNewData(checkData) {
        let result = {};
        for (let key in checkData) {
            if (checkData.hasOwnProperty(key)) {
                let value = checkData[key];
                if (variable.isObject(value)) {
                    result[key] = HttpOption.getNewData(value);
                } else {
                    result[key] = null;
                }
            }
        }
        return result;
    }
}