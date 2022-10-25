export default {
    create(data) {
        let result = {
            loading: false,
            display: false,
            ...data,
            async open(d) {
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
        if (data.close) {
            result.close = data.close;
        }
        return result;
    }
};
