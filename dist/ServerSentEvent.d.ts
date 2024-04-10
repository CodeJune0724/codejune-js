export default class ServerSentEvent {
    private readonly url;
    private eventSource;
    private openAction;
    private messageAction;
    private closeAction;
    constructor(url: string);
    onOpen(action: () => void): void;
    onMessage(type: string, action: (data: string) => void): void;
    onClose(action: () => void): void;
    open(): void;
    close(): void;
}
