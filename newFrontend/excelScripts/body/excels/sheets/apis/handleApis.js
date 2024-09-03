export class HandleApis {
    constructor(sheet) {
        this.init();
        this.sheet = sheet;
    }

    init() {
        this.tableName = null;
    }

    async uploadFile(formData) {

        const res = await fetch('http://localhost:5249/api/Data/insertMultipleData6', {
            method: 'POST',
            body: formData,
        })

        if (res) {
            this.tableName = 'usertest2';
            this.getDataInRange(0, 500);
            this.sheet.renderor.renderCanvas();
        }
    }

    async getDataInRange(startInd, limit) {

        console.log("getting data")

        if (!this.tableName) {
            return;
        }

        await fetch(`http://localhost:5249/api/Data/getDataInRange?start=${startInd}&limit=${limit}`, {
            method: 'GET',
            accept: 'text/plain'
        })
            .then(async (response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.sheet.ll.insertMultipleDataInLL(data, startInd);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}