export default class Websocket {
    url = "";
    websocket = null;
    constructor(url) {
        this.url = url;
    }
    open() {
        this.websocket = new WebSocket(this.url);
    }
    onOpen() {
        return new Promise((success) => {
            if (this.websocket) {
                this.websocket.onopen = () => {
                    success(undefined);
                };
            }
        });
    }
    onMessage() {
        return new Promise((success) => {
            if (this.websocket) {
                this.websocket.onmessage = (message) => {
                    success(message);
                };
            }
        });
    }
    onClose() {
        return new Promise((success) => {
            if (this.websocket) {
                this.websocket.onclose = () => {
                    success(undefined);
                };
            }
        });
    }
    onError() {
        return new Promise((success) => {
            if (this.websocket) {
                this.websocket.onerror = () => {
                    success(undefined);
                };
            }
        });
    }
    send(data) {
        if (this.websocket) {
            this.websocket.send(data);
        }
    }
    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}
;
