import variable from "../variable";

export default class responseResult {

    flag: any;

    code: any;

    message: any;

    result: any;

    constructor(data?: object) {
        this.setData(data);
    }

    setData(data?: object) {
        variable.assignment(this, data, true);
    }

};