class HttpRequest {
    url;
    type;
    header;
    param;
    body;
    config;
    constructor(data) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header;
        this.param = data.param;
        this.body = data.body;
        this.config = data.config;
    }
}
export default HttpRequest;
