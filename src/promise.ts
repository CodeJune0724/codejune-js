export default {
    then<T>(promise: Promise<T>, callback: (data: T) => void): Promise<T> {
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