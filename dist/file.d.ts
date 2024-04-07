declare const _default: {
    select(): Promise<File>;
    selectMore(): Promise<FileList>;
    slice(file: File, sliceSize: number, action: (data: {
        pointer: number;
        file: Blob;
    }) => Promise<void>): Promise<void>;
};
export default _default;
