import variable from "../variable.js";

export default class responseResult {

    flag = null;

    code = null;

    message = null;

    result = null;

    constructor(data) {
        this.setData(data);

    }

    setData(data) {
        variable.assignment(this, data);
    }

};