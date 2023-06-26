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
     * @param data data
     *
     * @return boolean
     * */
    isEmpty(data: any): boolean;
    /**
     * 是否是对象
     *
     * @param data data
     *
     * @return boolean
     * */
    isObject(data: any): boolean;
    /**
     * 克隆对象
     *
     * @param data 数据
     *
     * @return 克隆后的对象
     * */
    clone<T extends object>(data: T): T;
    /**
     * 给对象赋值
     *
     * @param object1 赋值的对象
     * @param object2 取值的对象
     * @param isStrict 是否是严谨模式
     * */
    assignment(object1: {
        [x: string]: any;
    }, object2: {
        [x: string]: any;
    }, isStrict?: boolean): void;
    /**
     * toString
     *
     * @param data data
     *
     * @return string
     * */
    toStr(data: any): string;
    /**
     * 清空数据
     *
     * @param data 数据
     * */
    clean(data: {
        [x: string]: any;
    }): void;
};
export default _default;
