import httpType from "./httpType";

class HttpOption {

    url: string;
    type: httpType;
    header?: { [key: string]: string };
    urlData?: { [key: string]: string };
    data?: any;

    constructor(data: HttpOption) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header ? data.header : {};
        this.urlData = data.urlData ? data.urlData : {};
        this.data = data.data ? data.data : {};
    }

}

export default HttpOption;