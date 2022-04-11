export default {
    select(): Promise<File | null> {
        return new Promise((s) => {
            let fileE = document.createElement("input");
            fileE.type = "file";
            fileE.addEventListener("change", function () {
                let files = fileE.files;
                if (files === null) {
                    s(null);
                } else {
                    s(files[0]);
                }
            });
            fileE.click();
        });
    }
};