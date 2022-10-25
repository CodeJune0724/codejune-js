import Request from "./http/Request";
declare const _default: {
    send(data: Request): Promise<any>;
    download(data: Request): Promise<any>;
    asyncDownload(data: Request): Promise<any>;
    _getUrl(data: Request): string;
    _getFetch(data: Request): Promise<Response>;
};
export default _default;
