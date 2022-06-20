declare type popup<T extends object> = {
    loading: boolean;
    display: boolean;
    open: (data?: any) => void;
    close: () => void;
} & T;
declare const _default: {
    create<T extends object>(data: T & {
        openHandler?: ((data: any) => void) | undefined;
        close?: (() => void) | undefined;
    }): popup<T>;
};
export default _default;
