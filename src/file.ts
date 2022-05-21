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
        return new Promise((s: Function) => {
            let fileE = document.createElement("input");
            fileE.type = "file";
            fileE.multiple = true;
            fileE.addEventListener("change", function () {
                let files = fileE.files;
                s(files);
            });
            fileE.click();
        });
    }
};