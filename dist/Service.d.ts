import Request from "./http/Request";
export default class Service {
    url?: string;
    constructor(url?: string);
    $send(request: Request): Promise<any>;
    $download(request: Request): Promise<any>;
    $asyncDownload(request: Request): Promise<any>;
    $requestHandler(request: Request): void;
    _getHttpRequest(request: Request): Request;
}
