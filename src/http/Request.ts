class Request {

    url: string;
    type: "GET" | "POST" | "PUT" | "DELETE";
    header?: { [key: string]: string };
    param?: { [key: string]: string };
    body?: any;
    config?: {
        dataType?: "BODY" | "FORM_DATA"
    };

    constructor(data: Request) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header;
        this.param = data.param;
        this.body = data.body;
        this.config = data.config;
    }

}

export default Request;