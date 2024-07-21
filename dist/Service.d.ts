import { Request } from "./Http";
import ServerSentEvent from "./ServerSentEvent";
export default class Service {
    readonly url?: string;
    constructor(url?: string);
    $send(request: Request): Promise<any>;
    $serverSentEvent(url: string, param?: {
        [key in string]: string | null;
    }): ServerSentEvent;
    $download(request: Request): Promise<any>;
    $asyncDownload(request: Request): Promise<any>;
}
