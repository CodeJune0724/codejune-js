import HttpRequest from "./model/HttpRequest";
export default class Service {
    url: string;
    data: {
        [key: string]: {
            request?: any;
            response: any;
            [key: string]: any;
        };
    };
    constructor(url: string);
    $send(httpRequest: HttpRequest, requestHandler?: (httpRequest: HttpRequest) => void): Promise<any>;
    $download(httpRequest: HttpRequest, requestHandler?: (requestData: HttpRequest) => void): Promise<any>;
    $asyncDownload(httpRequest: HttpRequest, requestHandler?: (requestData: HttpRequest) => void): Promise<any>;
    $requestHandler(httpRequest: HttpRequest): void;
    _getHttpRequest(httpRequest: HttpRequest, requestHandler?: (httpRequest: HttpRequest) => void): HttpRequest;
    _getName(httpRequest: HttpRequest): string;
}
