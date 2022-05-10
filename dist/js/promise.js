export default {
    then(promise, callback) {
        return new Promise((s, e) => {
            promise.then((data) => {
                callback(data);
                s(data);
            }).catch((data) => {
                e(data);
            });
        });
    }
};
