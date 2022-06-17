export default {
    create(data) {
        return {
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
    }
};
