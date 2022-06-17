import HttpRequest from "./model/HttpRequest";
declare const _default: {
    send(data: HttpRequest): Promise<any>;
    download(data: HttpRequest): Promise<any>;
    asyncDownload(data: HttpRequest): Promise<any>;
    _getUrl(data: HttpRequest): string;
};
export default _default;
