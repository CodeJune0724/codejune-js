import httpType from "./httpType";

class HttpOption {

    url: string;
    type: httpType;
    header?: object | null;
    urlData?: object | null;
    data?: object | null;

    constructor(data: HttpOption) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header ? data.header : {};
        this.urlData = data.urlData ? data.urlData : {};
        this.data = data.data ? data.data : {};
    }

}

export default HttpOption;