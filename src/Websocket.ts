export default class Ws {

    private readonly url: string = "";

    private websocket: WebSocket | null = null;

    onOpen = () => {};

    onMessage = () => {};

    onClose = () => {};

    onError = () => {};

    constructor(url: string) {
        this.url = url;
    }

    open() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = this.onOpen;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onclose = this.onClose;
        this.websocket.onerror = this.onError;
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this.websocket?.send(data);
    }

    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }

};