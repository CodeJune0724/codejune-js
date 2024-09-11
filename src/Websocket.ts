export default class Websocket {

    private readonly url: string = "";

    private websocket: WebSocket | null = null;

    private onOpenAction: (ev: Event) => void = () => {};

    private onMessageAction: (ev: MessageEvent<any>) => void = () => {};

    private onCloseAction: (ev: CloseEvent) => void = () => {};

    constructor(url: string) {
        this.url = url;
    }

    onOpen(action: (ev: Event) => void) {
        this.onOpenAction = action;
    }

    onMessage(action: (ev: MessageEvent<any>) => void) {
        this.onMessageAction = action;
    }

    onClose(action: (ev: CloseEvent) => void) {
        this.onCloseAction = action;
    }

    connect() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = (event) => {
            this.onOpenAction(event);
        };
        this.websocket.onmessage = (messageEvent) => {
            this.onMessageAction(messageEvent);
        };
        this.websocket.onclose = (closeEvent) => {
            this.onCloseAction(closeEvent);
        };
        this.websocket.onerror = (event) => {
            this.close();
            throw new Error(event);
        };
    }

    send(data: any) {
        if (this.websocket) {
            if (data instanceof Blob || data instanceof ArrayBuffer || typeof data === "string") {
                this.websocket.send(data);
            } else {
                this.websocket.send(JSON.stringify(data));
            }
        }
    }

    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }

};