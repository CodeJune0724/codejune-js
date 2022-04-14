export default {
    then(promise: Promise<any>, callback: (data: any) => void): Promise<any> {
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