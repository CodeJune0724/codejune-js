class HttpRequest {
    url;
    type;
    header;
    param;
    data;
    constructor(data) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header ? data.header : {};
        this.param = data.param ? data.param : {};
        this.data = data.data ? data.data : {};
    }
}
export default HttpRequest;
