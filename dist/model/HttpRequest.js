class HttpRequest {
    url;
    type;
    header;
    param;
    data;
    config;
    constructor(data) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header ? data.header : {};
        this.param = data.param ? data.param : {};
        this.data = data.data ? data.data : {};
        this.config = data.config;
    }
}
export default HttpRequest;
