declare const _default: {
    /**
     * 是否为空
     *
     * @param data data
     *
     * @return boolean
     * */
    isNull(data: any): boolean;
    /**
     * 对象是否为空
     *
     * @param data 数据
     *
     * @return Boolean
     * */
    isEmpty(data: any): boolean;
    /**
     * 获取对象类型
     *
     * @param data 数据
     *
     * @return Function
     * */
    getType(data: any): Function | null;
    /**
     * 是否是对象
     *
     * @param data 数据
     *
     * @return Boolean
     * */
    isObject(data: any): boolean;
    /**
     * 克隆对象
     *
     * @param data 数据
     *
     * @return Object || 数据
     * */
    clone(data: any): any;
    /**
     * 给对象赋值
     *
     * @param object1 赋值的对象
     * @param object2 取值的对象
     * @param isStrict 是否是严谨模式
     * */
    assignment(object1: any, object2: any, isStrict?: boolean): void;
    /**
     * toString
     *
     * @param data data
     * */
    toStr(data: any): string | null;
    /**
     * 清空数据
     *
     * @param data 数据
     * */
    clean(data: any): void;
    /**
     * 追加节点
     * */
    addKey(object1: any, object2: any): void;
};
export default _default;
