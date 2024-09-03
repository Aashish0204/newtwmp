export class HandleUpload {

    constructor(excelMaker) {

        this.excelMaker = excelMaker;
        this.handleEvents();
    }


    handleFileUploadEvents() {
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.currSheet = this.excelMaker.getCurrSheet();
            this.currSheet.navFunctionalities.handleFileUpload(e);
        })
    }

    handleEvents() {
        this.handleFileUploadEvents();
    }


}