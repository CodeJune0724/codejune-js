export default {

    debounce(action: Function, delay: number): Function {
        let timeoutIndex: number | undefined = undefined;
        return function(this: any) {
            let param = arguments;
            clearTimeout(timeoutIndex);
            timeoutIndex = setTimeout(() => {
                action.apply(this, param);
            }, delay);
        }
    }

};