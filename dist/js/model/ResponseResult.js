import variable from "../variable";
export default class ResponseResult {
    flag;
    code;
    message;
    result;
    constructor(data) {
        variable.assignment(this, data);
    }
}
;
