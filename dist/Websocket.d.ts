export default class Websocket {
    private readonly url;
    private websocket;
    private onOpenAction;
    private onMessageAction;
    private onCloseAction;
    constructor(url: string);
    onOpen(action: (ev: Event) => void): void;
    onMessage(action: (ev: MessageEvent<any>) => void): void;
    onClose(action: (ev: CloseEvent) => void): void;
    connect(): void;
    send(data: any): void;
    close(): void;
}
