export default class ServerSentEvent {
    url = "";
    eventSource = null;
    openAction = () => { };
    messageAction = {};
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
                this.messageAction[item](event.data);
            });
        }
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
