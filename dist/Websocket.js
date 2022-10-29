export default class Websocket {
    url = "";
    websocket = null;
    onOpen = () => { };
    onMessage = () => { };
    onClose = () => { };
    onError = () => { };
    constructor(url) {
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
            this.websocket = null;
        }
    }
}
;
