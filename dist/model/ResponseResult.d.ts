export default class ResponseResult<T> {
    flag: boolean;
    code: any;
    message: any;
    result: T | null;
    constructor(data?: object);
}
