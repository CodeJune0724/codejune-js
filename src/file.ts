export default {

    select(): Promise<File> {
        return new Promise<File>((s: Function) => {
            let fileE = document.createElement("input");
            fileE.type = "file";
            fileE.addEventListener("change", function () {
                let files = fileE.files;
                if (files === null) {
                    s();
                } else {
                    s(files[0]);
                }
            });
            fileE.click();
        });
    },

    selectMore(): Promise<FileList> {
        return new Promise<FileList>((s: Function) => {
            let fileE = document.createElement("input");
            fileE.type = "file";
            fileE.multiple = true;
            fileE.addEventListener("change", function () {
                let files = fileE.files;
                s(files);
            });
            fileE.click();
        });
    },

    async slice(file: File, sliceSize: number, action: (data: { pointer: number, file: Blob }) => Promise<void>) {
        if (sliceSize < 0) {
            return;
        }
        let pointer = 0;
        let fileSize = file.size;
        while (pointer < fileSize) {
            let stepSize = pointer + sliceSize > fileSize ? fileSize - pointer : sliceSize;
            let sliceFile = file.slice(pointer, pointer + stepSize);
            pointer = pointer + stepSize;
            await action({
                pointer,
                file: sliceFile
            });
        }
    }

};