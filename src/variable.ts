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
     * @param data 数据
     *
     * @return Boolean
     * */
    isEmpty(data: any): boolean {
        if (this.isNull(data)) {
            return true;
        }
        let type = this.getType(data);
        if (type === String && data === "") {
            return true;
        }
        if (type === Array && data.length === 0) {
            return true;
        }
        return type === Object && Object.keys(data).length === 0;
    },

    /**
     * 获取对象类型
     *
     * @param data 数据
     *
     * @return Function
     * */
    getType(data: any): Function | null {
        if (this.isNull(data)) {
            return null;
        }
        return data.constructor;
    },

    /**
     * 是否是对象
     *
     * @param data 数据
     *
     * @return Boolean
     * */
    isObject(data: any): boolean {
        if (this.isNull(data)) {
            return false;
        }
        if (data instanceof Object) {
            let type = this.getType(data);
            if (type == null) {
                return false;
            }
            if (type.toString().indexOf("class") === 0) {
                return true;
            }
            if (type === Array) {
                return true;
            }
            return type === Object;
        }
        return false;
    },

    /**
     * 克隆对象
     *
     * @param data 数据
     *
     * @return Object || 数据
     * */
    clone(data: any): any {
        if (this.isObject(data)) {
            if (this.getType(data) === Array) {
                let newData = [];
                for (let item of data) {
                    newData.push(this.clone(item));
                }
                return newData;
            } else {
                let newData: any = {};
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        let value = data[key];
                        if (this.isObject(value)) {
                            newData[key] = this.clone(value);
                        } else {
                            newData[key] = null;
                        }
                    }
                }
                this.assignment(newData, data);
                return newData;
            }
        } else {
            if (this.isNull(data)) {
                return null;
            }
            return data;
        }
    },

    /**
     * 给对象赋值
     *
     * @param object1 被赋值的对象
     * @param object2 要赋值的对象
     * @param isStrict 是否是严谨模式
     * */
    assignment(object1: any, object2: any, isStrict?: boolean): void {
        let type1 = this.getType(object1);
        if (this.isObject(object1) && this.isObject(object2)) {
            if (type1 === Array) {
                let ok = true;
                if (isStrict === true && this.getType(object2) !== Array) {
                    ok = false;
                }
                if (type1 !== this.getType(object2)) {
                    ok = false;
                }
                if (ok) {
                    object1.splice(0, object1.length);
                    for (let item of object2) {
                        object1.push(this.clone(item));
                    }
                }
            } else {
                for (let key in object1) {
                    if (object1.hasOwnProperty(key)) {
                        let value1: any = object1[key];
                        let value2: any = object2[key];
                        if (value2 === undefined) {
                            continue;
                        }
                        if (this.isObject(value1)) {
                            if (this.getType(value1) === this.getType(value2)) {
                                this.assignment(value1, value2);
                            } else {
                                if (!(!this.isNull(isStrict) && this.getType(isStrict) === Boolean && isStrict)) {
                                    object1[key] = this.clone(value2);
                                }
                            }
                        } else {
                            if (!this.isNull(isStrict) && this.getType(isStrict) === Boolean && isStrict) {
                                if (this.isNull(value1) || this.getType(value1) === this.getType(value2)) {
                                    object1[key] = this.clone(value2);
                                }
                            } else {
                                object1[key] = this.clone(value2);
                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * toString
     *
     * @param data data
     * */
    toStr(data: any): string | null {
        if (this.isNull(data)) {
            return null;
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
    clean(data: any): void {
        if (this.isObject(data)) {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let value = data[key];
                    if (this.getType(value) === Array) {
                        data[key] = [];
                    } else if (this.isObject(value)) {
                        this.clean(value);
                    } else {
                        data[key] = null;
                    }
                }
            }
        }
    },

    /**
     * 获取值
     *
     * @param data data
     * @param key key
     *
     * @return any
     * */
    getValue(data: any, key: string): any {
        if (this.isNull(data) || this.isEmpty(key)) {
            return null;
        }
        return data[key];
    },

    setValue(data: any, key: string, value: any): void {
        if (this.isEmpty(data) || this.isEmpty(key)) {
            return;
        }
        data[key] = value;
    }
};