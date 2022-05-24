import variable from "../variable";
export default class ResponseResult {
    flag = false;
    code;
    message;
    result;
    constructor(data) {
        variable.assignment(this, data);
    }
}
;
