class HttpOption {
    url;
    type;
    header;
    urlData;
    data;
    constructor(data) {
        this.url = data.url;
        this.type = data.type;
        this.header = data.header ? data.header : {};
        this.urlData = data.urlData ? data.urlData : {};
        this.data = data.data ? data.data : {};
    }
}
export default HttpOption;
