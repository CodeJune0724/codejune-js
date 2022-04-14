import variable from "../variable";

export default class ResponseResult {

    flag: any;

    code: any;

    message: any;

    result: any;

    constructor(data?: object) {
        variable.assignment(this, data);
    }

};