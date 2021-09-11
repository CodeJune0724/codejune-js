export default {
    select() {
        return new Promise((s) => {
            let fileE = document.createElement("input");
            fileE.type = "file";
            fileE.addEventListener("change", function () {
                let file = fileE.files[0];
                s(file);
            });
            fileE.click();
        });
    }
};