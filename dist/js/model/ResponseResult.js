import variable from "../variable";
export default class ResponseResult {
    flag = false;
    code;
    message;
    result = null;
    constructor(data) {
        variable.assignment(this, data);
    }
}
;
let test1 = {
    name: new ResponseResult()
};
