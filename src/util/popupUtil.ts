type popup<T extends object> = {
    loading: boolean,
    display: boolean,
    open: (data?: any) => void,
    close: () => void
} & T;

export default {
    create<T extends object>(data: T & { openHandler?: (data: any) => void }): popup<T> {
        return {
            loading: false,
            display: false,
            ...data,
            async open(d?: any) {
                this.display = true;
                this.loading = true;
                if (data.openHandler) {
                    await data.openHandler(d);
                }
                this.loading = false;
            },
            close() {
                this.display = false;
            }
        };
    }
};