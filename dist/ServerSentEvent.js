import variable from "./variable";
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
let getUrl = (url, param) => {
    if (!variable.isEmpty(param)) {
        let paramString = "?";
        for (let key in param) {
            let value = param[key];
            if (value) {
                paramString = paramString + key + "=" + value + "&";
            }
        }
        if (paramString !== "?") {
            paramString = paramString.substring(0, paramString.length - 1);
        }
        else {
            paramString = "";
        }
        url = url + paramString;
    }
    return url;
};
export default class ServerSentEvent {
    url = "";
    param;
    eventSource = null;
    openAction = () => { };
    messageAction = {};
    errorAction = () => { };
    closeAction = () => { };
    constructor(url, param) {
        this.url = url;
        this.param = param;
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
        this.eventSource = new EventSource(getUrl(this.url, this.param));
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
