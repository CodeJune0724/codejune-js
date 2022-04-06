export default class responseResult {

    flag = null;

    code = null;

    message = null;

    data = null;

    setData(json) {
        this.flag = json.flag;
        this.code = json.code;
        this.message = json.message;
        this.data = json.data;
    }

};