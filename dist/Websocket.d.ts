export default class Ws {
    private readonly url;
    private websocket;
    onOpen: () => void;
    onMessage: () => void;
    onClose: () => void;
    onError: () => void;
    constructor(url: string);
    open(): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    close(): void;
}
