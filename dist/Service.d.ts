import { type } from "./Http";
interface Request {
    url: string;
    type: type;
    header?: {
        [key: string]: string;
    };
    param?: {
        [key: string]: string;
    };
    body?: any;
}
export default class Service {
    readonly url?: string;
    constructor(url?: string);
    $send(request: Request): Promise<any>;
    $download(request: Request): Promise<any>;
    $asyncDownload(request: Request): Promise<any>;
}
export { Request };
