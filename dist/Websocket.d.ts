export default class Ws {
    private readonly url;
    private websocket;
    onOpen: (this: WebSocket, ev: Event) => any;
    onMessage: (this: WebSocket, ev: MessageEvent<any>) => any;
    onClose: (this: WebSocket, ev: CloseEvent) => any;
    onError: (this: WebSocket, ev: Event) => any;
    constructor(url: string);
    open(): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView | ArrayBuffer): void;
    close(): void;
}
