export default class Websocket {

    private readonly url: string = "";

    private websocket: WebSocket | null = null;

    onOpen: (ev: Event) => any = () => {};

    onMessage: (ev: MessageEvent<any>) => any = () => {};

    onClose: (ev: CloseEvent) => any = () => {};

    onError: (ev: Event) => any = () => {};

    constructor(url: string) {
        this.url = url;
    }

    open() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = (ev) => {
            this.onOpen(ev);
        };
        this.websocket.onmessage = (ev) => {
            this.onMessage(ev);
        };
        this.websocket.onclose = (ev) => {
            this.onClose(ev);
        };
        this.websocket.onerror = (ev) => {
            this.onError(ev);
        };
    }

    send(data: any) {
        if (this.websocket) {
            this.websocket.send(data);
        }
    }

    close() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }

};