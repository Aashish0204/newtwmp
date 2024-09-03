export class NavFunctionalities {

    constructor(sheet) {
        this.init();
        this.sheet = sheet;
    }

    init() {
        // this.handleEvents();
    }

    async handleFileUpload(e) {

        e.preventDefault();
        console.log("uploaded file");

        const fileInput = document.getElementById('uploadFileInput');
        const file = fileInput.files[0];

        if (file) {

            const formData = new FormData();
            formData.append('file', file);

            this.sheet.handleApis.uploadFile(formData);

        } else {
            alert('Please select a file to upload.');
        }


    }


}