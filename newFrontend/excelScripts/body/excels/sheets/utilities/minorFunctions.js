export class MinorFunctions {
    constructor(sheet) {
        this.sheet = sheet;
        this.ll = sheet.ll;
    }

    get_Min_Max_Avg_Sum_Count_OfArray(data) {
        let resultObj = this.processArray(data);
        if (resultObj.count > 1) {
            return resultObj;
        }
        return -1;
    }

    processArray(data) {
        let sum = 0;
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        let count = 0;

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {

                const value = parseFloat(data[i][j]);

                if ((!isNaN(value))) {
                    sum += value;
                    if (value < min) min = value;
                    if (value > max) max = value;
                    count++;
                }
            }
        }

        let avg = count === 0 ? 0 : sum / count;
        return { "min": min.toFixed(2), "max": max.toFixed(2), "avg": avg.toFixed(2), "sum": sum.toFixed(2), "count": count };
    }


    copyToClipboard2DArr(selectedCellsArray) {

        // Convert the 2D array to a tab-separated string
        const arrayToClipboardString = selectedCellsArray.map(row => row.join('->')).join('\n');

        // Function to copy the string to the clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Data copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy data to clipboard', err);
            });
        }

        // Copy the string to the clipboard
        copyToClipboard(arrayToClipboardString);

    }

    deleteFromLinkedList(start, end) {

        let [rowStart, colStart, rowEnd, colEnd] = this.getRowColStartEnd(start, end)

        for (let i = rowStart; i <= rowEnd; i++) {

            for (let j = colStart; j <= colEnd; j++) {

                this.sheet.ll.deleteNode(i+1, j+1);

            }
        }


    }

    getRowColStartEnd(start, end) {

        let rowStart = Math.min(start.rowInd, end.rowInd);
        let colStart = Math.min(start.colInd, end.colInd);

        let rowEnd = Math.max(start.rowInd, end.rowInd);
        let colEnd = Math.max(start.colInd, end.colInd);

        return [rowStart, colStart, rowEnd, colEnd];
    }

    pasteToLinkedList(start, end, dataArr) {

        this.deleteFromLinkedList(start, end);

        let [rowStart, colStart, rowEnd , colEnd] = this.getRowColStartEnd(start, end);

        for (let i = 0; (i < dataArr.length); i++) {
            for (let j = 0; (j < dataArr[i].length); j++) {
                console.log(i + rowStart, j + colStart, dataArr[i][j])
                this.sheet.ll.setValueAtInd(i + rowStart, j + colStart, dataArr[i][j]);
            }
        }

        this.sheet.renderer.renderCanvas();
    }

    async pasteClipboard(start, end) {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const dataArray = clipboardText.split('\n').map(row => row.trim().split('->'));
            this.pasteToLinkedList(start, end, dataArray)

        } catch (err) {
            console.error('Failed to read clipboard contents:', err);
        }
    }





}