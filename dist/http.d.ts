import HttpRequest from "./model/HttpRequest";
declare const _default: {
    send(data: HttpRequest): Promise<any>;
    download(data: HttpRequest): Promise<any>;
    asyncDownload(data: HttpRequest): Promise<any>;
    _getUrl(data: HttpRequest): string;
    _getFetch(data: HttpRequest): Promise<Response>;
};
export default _default;
