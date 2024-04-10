export default class ServerSentEvent {

    private readonly url: string = "";

    private eventSource: EventSource | null = null;

    private openAction: () => void = () => {};

    private messageAction: { [key in string]: (data: string) => void } = {};

    private closeAction: () => void = () => {};

    constructor(url: string) {
        this.url = url;
    }

    onOpen(action: () => void) {
        this.openAction = action;
    }

    onMessage(type: string, action: (data: string) => void) {
        this.messageAction[type] = action;
    }

    onClose(action: () => void) {
        this.closeAction = action;
    }

    open() {
        this.eventSource = new EventSource(this.url);
        this.eventSource.onopen = () => {
            this.openAction();
        };
        for (let item in this.messageAction) {
            this.eventSource.addEventListener(item, (event: MessageEvent) => {
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

};