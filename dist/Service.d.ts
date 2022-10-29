import { type } from "./http";
declare type request = {
    url: string;
    type: type;
    header?: {
        [key: string]: string;
    };
    param?: {
        [key: string]: string;
    };
    body?: any;
};
export default class Service {
    readonly url?: string;
    constructor(url?: string);
    $send(request: request): Promise<any>;
    $download(request: request): Promise<undefined>;
    $asyncDownload(request: request): Promise<undefined>;
    $requestHandler(request: request): void;
    private _getHttp;
}
export {};
