export default class Ws {

    private readonly url: string = "";

    private websocket: WebSocket | null = null;

    onOpen: (this:WebSocket, ev: Event) => any = () => {};

    onMessage: (this:WebSocket, ev: MessageEvent<any>) => any = () => {};

    onClose: (this:WebSocket, ev: CloseEvent) => any = () => {};

    onError: (this:WebSocket, ev: Event) => any = () => {};

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

    send(data: any) {
        if (this.websocket) {
            this.websocket.send(data);
        }
    }

    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }

};