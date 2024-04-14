let getData = (data) => {
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        }
        catch (e) {
            return data;
        }
    }
    else {
        return data;
    }
};
export default class ServerSentEvent {
    url = "";
    eventSource = null;
    openAction = () => { };
    messageAction = {};
    errorAction = () => { };
    closeAction = () => { };
    constructor(url) {
        this.url = url;
    }
    onOpen(action) {
        this.openAction = action;
    }
    onMessage(type, action) {
        this.messageAction[type] = action;
    }
    onError(action) {
        this.errorAction = action;
    }
    onClose(action) {
        this.closeAction = action;
    }
    open() {
        this.eventSource = new EventSource(this.url);
        this.eventSource.onopen = () => {
            this.openAction();
        };
        for (let item in this.messageAction) {
            this.eventSource.addEventListener(item, (event) => {
                this.messageAction[item](getData(event.data));
            });
        }
        this.eventSource.addEventListener("$error", (event) => {
            this.errorAction(getData(event.data));
        });
        this.eventSource.onerror = () => {
            this.closeAction();
            this.close();
        };
    }
    close() {
        if (!this.eventSource) {
            return;
        }
        this.eventSource.close();
    }
}
;
