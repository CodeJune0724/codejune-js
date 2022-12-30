export default {
    /**
     * 是否为空
     *
     * @param data data
     *
     * @return boolean
     * */
    isNull(data) {
        return data === undefined || data === null;
    },
    /**
     * 对象是否为空
     *
     * @param data 数据
     *
     * @return Boolean
     * */
    isEmpty(data) {
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
    getType(data) {
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
    isObject(data) {
        if (this.isNull(data)) {
            return false;
        }
        if (data instanceof Object) {
            let type = this.getType(data);
            if (type == null) {
                return false;
            }
            if (JSON.stringify(data) !== undefined) {
                return true;
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
    clone(data) {
        if (this.isObject(data)) {
            if (this.getType(data) === Array) {
                let newData = [];
                for (let item of data) {
                    newData.push(this.clone(item));
                }
                return newData;
            }
            else {
                let newData = {};
                for (let key in data) {
                    newData[key] = this.clone(data[key]);
                }
                return newData;
            }
        }
        else {
            if (this.isNull(data)) {
                return null;
            }
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
    assignment(object1, object2, isStrict) {
        let type1 = this.getType(object1);
        let isStrictBoolean = this.isEmpty(isStrict) ? true : isStrict === true;
        if (!this.isObject(object1) || !this.isObject(object2)) {
            return;
        }
        if (type1 === Array) {
            let ok = true;
            if (isStrictBoolean && this.getType(object2) !== Array) {
                ok = false;
            }
            if (type1 !== this.getType(object2)) {
                ok = false;
            }
            if (ok) {
                object1.splice(0, object1.length);
                for (let item of object2) {
                    object1.push(item);
                }
            }
        }
        else {
            if (isStrictBoolean) {
                for (let key in object1) {
                    let value1 = object1[key];
                    let value2 = object2[key];
                    if (value1 === undefined || value2 === undefined) {
                        continue;
                    }
                    let isAssignment = false;
                    if (value1 === null) {
                        isAssignment = true;
                    }
                    else if (value2 === null && !this.isObject(value1)) {
                        isAssignment = true;
                    }
                    else if (this.getType(value1) === this.getType(value2)) {
                        isAssignment = true;
                    }
                    else if (this.isObject(value1) && this.isObject(value2)) {
                        isAssignment = true;
                    }
                    if (isAssignment) {
                        if (this.isObject(value2)) {
                            value2 = this.clone(value2);
                        }
                        if (this.isObject(value1) && this.isObject(value2)) {
                            this.assignment(value1, value2, true);
                        }
                        else {
                            object1[key] = value2;
                        }
                    }
                }
            }
            else {
                for (let key in object2) {
                    let value2 = object2[key];
                    if (value2 === undefined) {
                        continue;
                    }
                    if (this.isObject(value2)) {
                        value2 = this.clone(value2);
                    }
                    object1[key] = value2;
                }
            }
        }
    },
    /**
     * toString
     *
     * @param data data
     * */
    toStr(data) {
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
    clean(data) {
        if (data instanceof Array) {
            data.splice(0);
        }
        else if (this.isObject(data)) {
            for (let key in data) {
                let value = data[key];
                if (this.isObject(value)) {
                    this.clean(value);
                }
                else {
                    data[key] = null;
                }
            }
        }
    },
    /**
     * 追加节点
     * */
    addKey(object1, object2) {
        if (!this.isObject(object1) || !this.isObject(object2)) {
            return;
        }
        for (let key in object2) {
            let o2 = object2[key];
            if (this.isNull(object1[key])) {
                if (this.isObject(o2)) {
                    if (this.getType(o2) === Array) {
                        object1[key] = [];
                    }
                    else {
                        object1[key] = {};
                    }
                }
                else {
                    object1[key] = null;
                }
            }
            this.addKey(object1[key], o2);
        }
    },
    /**
     * 过滤节点
     * */
    filterKey(object, keys) {
        for (let key in object) {
            if (keys.indexOf(key) === -1) {
                delete object[key];
            }
        }
    }
};
