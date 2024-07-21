import { getUrl } from "./Http";

let getData = (data: any) => {
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    } else {
        return data;
    }
};

export default class ServerSentEvent {

    private readonly url: string = "";

    private readonly param?: { [key in string]: string | null };

    private eventSource: EventSource | null = null;

    private openAction: () => void = () => {};

    private messageAction: { [key in string]: (data: any) => void } = {};

    private errorAction: (data: any) => void = () => {};

    private closeAction: () => void = () => {};

    constructor(url: string, param?: { [key in string]: string | null }) {
        this.url = url;
        this.param = param;
    }

    onOpen(action: () => void) {
        this.openAction = action;
    }

    onMessage<DATA_TYPE>(type: string, action: (data: DATA_TYPE) => void) {
        this.messageAction[type] = action;
    }

    onError<DATA_TYPE>(action: (data: DATA_TYPE) => void) {
        this.errorAction = action;
    }

    onClose(action: () => void) {
        this.closeAction = action;
    }

    open() {
        this.eventSource = new EventSource(getUrl(this.url, this.param));
        this.eventSource.onopen = () => {
            this.openAction();
        };
        for (let item in this.messageAction) {
            this.eventSource.addEventListener(item, (event: MessageEvent) => {
                this.messageAction[item](getData(event.data));
            });
        }
        this.eventSource.addEventListener("$error", (event: MessageEvent) => {
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

};