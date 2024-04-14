export default class Websocket {
    private readonly url;
    private websocket;
    private onOpenAction;
    private onMessageAction;
    private onCloseAction;
    private onErrorAction;
    constructor(url: string);
    onOpen(action: (ev: Event) => void): void;
    onMessage(action: (ev: MessageEvent<any>) => void): void;
    onClose(action: (ev: CloseEvent) => void): void;
    onError(action: (ev: Event) => void): void;
    open(): void;
    send(data: any): void;
    close(): void;
}
