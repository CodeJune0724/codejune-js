export default class Websocket {
    private readonly url;
    private websocket;
    onOpen: (ev: Event) => any;
    onMessage: (ev: MessageEvent<any>) => any;
    onClose: (ev: CloseEvent) => any;
    onError: (ev: Event) => any;
    constructor(url: string);
    open(): void;
    send(data: any): void;
    close(): void;
}
