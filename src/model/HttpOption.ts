import httpType from "./httpType";

class HttpOption {

    readonly url: string;
    readonly type: httpType;
    readonly header?: object;
    readonly urlData?: object;
    readonly data?: object;

    constructor(data: HttpOption) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header ? data.header : {};
        this.urlData = data.urlData ? data.urlData : {};
        this.data = data.data ? data.data : {};
    }

}

export default HttpOption;