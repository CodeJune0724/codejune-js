export default {
    select() {
        return new Promise((s) => {
            let fileE = document.createElement("input");
            fileE.type = "file";
            fileE.addEventListener("change", function () {
                let files = fileE.files;
                if (files === null) {
                    s();
                }
                else {
                    s(files[0]);
                }
            });
            fileE.click();
        });
    },
    selectMore() {
        return new Promise((s) => {
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
