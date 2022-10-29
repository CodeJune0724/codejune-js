export default class Websocket {
    private readonly url;
    private websocket;
    constructor(url: string);
    open(): void;
    onOpen(): Promise<undefined>;
    onMessage(): Promise<MessageEvent<any>>;
    onClose(): Promise<undefined>;
    onError(): Promise<undefined>;
    send(data: any): void;
    close(): void;
}
