export default class Ws {
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
        this.websocket.onopen = this.onOpen;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onclose = this.onClose;
        this.websocket.onerror = this.onError;
    }
    send(data) {
        this.websocket?.send(data);
    }
    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}
;
