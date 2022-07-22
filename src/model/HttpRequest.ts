import httpType from "./httpType";

class HttpRequest {

    url: string;
    type: httpType;
    header?: { [key: string]: string };
    param?: { [key: string]: string };
    body?: any;
    config?: {
        dataType: "BODY" | "FORM_DATA"
    };

    constructor(data: HttpRequest) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header;
        this.param = data.param;
        this.body = data.body;
        this.config = data.config;
    }

}

export default HttpRequest;