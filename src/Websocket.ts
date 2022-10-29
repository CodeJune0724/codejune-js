export default class Websocket {

    private readonly url: string = "";

    private websocket: WebSocket | null = null;

    constructor(url: string) {
        this.url = url;
    }

    open() {
        this.websocket = new WebSocket(this.url);
    }

    onOpen(): Promise<undefined> {
        return new Promise<undefined>((success) => {
            if (this.websocket) {
                this.websocket.onopen = () => {
                    success(undefined);
                };
            }
        });
    }

    onMessage(): Promise<MessageEvent<any>> {
        return new Promise<MessageEvent<any>>((success) => {
            if (this.websocket) {
                this.websocket.onmessage = (message) => {
                    success(message);
                };
            }
        });
    }

    onClose(): Promise<undefined> {
        return new Promise<undefined>((success) => {
            if (this.websocket) {
                this.websocket.onclose = () => {
                    success(undefined);
                };
            }
        });
    }

    onError(): Promise<undefined> {
        return new Promise<undefined>((success) => {
            if (this.websocket) {
                this.websocket.onerror = () => {
                    success(undefined);
                };
            }
        });
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