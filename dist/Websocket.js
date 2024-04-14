export default class Websocket {
    url = "";
    websocket = null;
    onOpenAction = () => { };
    onMessageAction = () => { };
    onCloseAction = () => { };
    onErrorAction = () => { };
    constructor(url) {
        this.url = url;
    }
    onOpen(action) {
        this.onOpenAction = action;
    }
    onMessage(action) {
        this.onMessageAction = action;
    }
    onClose(action) {
        this.onCloseAction = action;
    }
    onError(action) {
        this.onErrorAction = action;
    }
    open() {
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
            this.onErrorAction(event);
        };
    }
    send(data) {
        if (this.websocket) {
            if (data instanceof Blob || data instanceof ArrayBuffer || typeof data === "string") {
                this.websocket.send(data);
            }
            else {
                this.websocket.send(JSON.stringify(data));
            }
        }
    }
    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}
;
