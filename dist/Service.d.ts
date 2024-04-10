import { type, contentType } from "./Http";
import ServerSentEvent from "./ServerSentEvent";
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
    contentType?: contentType | null;
}
export default class Service {
    readonly url?: string;
    constructor(url?: string);
    $send(request: Request): Promise<any>;
    $eventSource(url: string): ServerSentEvent;
    $download(request: Request): Promise<any>;
    $asyncDownload(request: Request): Promise<any>;
}
export { Request };
