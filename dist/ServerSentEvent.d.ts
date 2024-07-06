export default class ServerSentEvent {
    private readonly url;
    private readonly param?;
    private eventSource;
    private openAction;
    private messageAction;
    private errorAction;
    private closeAction;
    constructor(url: string, param?: {
        [key in string]: string;
    });
    onOpen(action: () => void): void;
    onMessage<DATA_TYPE>(type: string, action: (data: DATA_TYPE) => void): void;
    onError<DATA_TYPE>(action: (data: DATA_TYPE) => void): void;
    onClose(action: () => void): void;
    open(): void;
    close(): void;
}
