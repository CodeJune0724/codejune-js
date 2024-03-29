export default {

    /**
     * 是否为空
     *
     * @param data data
     *
     * @return boolean
     * */
    isNull(data: any): boolean {
        return data === undefined || data === null;
    },

    /**
     * 对象是否为空
     *
     * @param data data
     *
     * @return boolean
     * */
    isEmpty(data: any): boolean {
        if (this.isNull(data)) {
            return true;
        }
        if (this.isObject(data)) {
            return Object.keys(data).length === 0;
        }
        if (typeof data === "string") {
            return data.trim() === "";
        }
        if (typeof data === "number") {
            return isNaN(data) || data === 0;
        }
        return typeof data !== "boolean";
    },

    /**
     * 是否是对象
     *
     * @param data data
     *
     * @return boolean
     * */
    isObject(data: any): boolean {
        if (this.isNull(data)) {
            return false;
        }
        return typeof data === "object";
    },

    /**
     * 克隆对象
     *
     * @param data 数据
     *
     * @return 克隆后的对象
     * */
    clone<T extends object>(data: T): T {
        if (this.isNull(data)) {
            return data;
        }
        if (Array.isArray(data)) {
            let result = [];
            for (let item of data) {
                result.push(this.clone(item));
            }
            return result as T;
        } else if (this.isObject(data)) {
            let result: { [key: string]: any } = {};
            for (let key in data) {
                let value = data[key];
                if (value === undefined) {
                    continue;
                }
                if (this.isObject(value)) {
                    result[key] = this.clone(value as object);
                } else {
                    result[key] = value;
                }
            }
            return result as T;
        } else {
            return data;
        }
    },

    /**
     * 给对象赋值
     *
     * @param object1 赋值的对象
     * @param object2 取值的对象
     * @param isStrict 是否是严谨模式
     * */
    assignment(object1: { [key in string]: any }, object2: { [key in string]: any }, isStrict?: boolean) {
        if (this.isNull(isStrict) ? true : isStrict === true) {
            for (let key in object1) {
                let value1 = object1[key];
                let value2 = object2[key];
                if (value1 === undefined || value2 === undefined) {
                    continue;
                }
                if (value1 === null) {
                    object1[key] = value2;
                    continue;
                }
                if (this.isObject(value1)) {
                    if (this.isObject(value2)) {
                        if (Array.isArray(value1) && Array.isArray(value2)) {
                            value1 = [];
                            for (let item of value2) {
                                value1.push(item);
                            }
                            object1[key] = value1;
                            continue;
                        }
                        if (!Array.isArray(value1) && !Array.isArray(value2)) {
                            this.assignment(value1, value2, true);
                        }
                    }
                } else {
                    if (value2 === null || typeof value1 === typeof value2) {
                        object1[key] = value2;
                    }
                }
            }
        } else {
            for (let key in object2) {
                let value2: any = object2[key];
                if (value2 === undefined) {
                    continue;
                }
                object1[key] = value2;
            }
        }
    },

    /**
     * toString
     *
     * @param data data
     *
     * @return string
     * */
    toStr(data: any): string {
        if (this.isNull(data)) {
            return `${data}`;
        }
        if (this.isObject(data)) {
            return JSON.stringify(data);
        }
        return data.toString();
    },

    /**
     * 清空数据
     *
     * @param data 数据
     * */
    clean(data: { [key in string]: any } | any[]): void {
        if (Array.isArray(data)) {
            data.splice(0, data.length);
        } else {
            for (let key in data) {
                let value = data[key];
                if (this.isNull(value) || typeof value === "function") {
                    continue;
                }
                if (this.isObject(value) && !(value instanceof File)) {
                    this.clean(value);
                } else {
                    data[key] = null;
                }
            }
        }
    }

};