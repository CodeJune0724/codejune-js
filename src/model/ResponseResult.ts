import variable from "../variable";

export default class ResponseResult<T> {

    flag: boolean = false;

    code: any;

    message: any;

    result: T | null = null;

    constructor(data?: object) {
        variable.assignment(this, data);
    }

};


type test = {
    name: ResponseResult<{
        count: null,
        data: null
    }>
}


let test1: test = {
    name: new ResponseResult<{count: null; data: null}>()
}