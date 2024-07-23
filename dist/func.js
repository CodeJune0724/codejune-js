export default {
    debounce(action, delay) {
        let timeoutIndex = undefined;
        return function () {
            let param = arguments;
            clearTimeout(timeoutIndex);
            timeoutIndex = setTimeout(() => {
                action.apply(this, param);
            }, delay);
        };
    }
};
