class HeaderCell {
    constructor(x, y, width, height, value) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = { "data": value };
        this.next = null;
        this.isSelected = false;
    }
}


export class HeaderCellsMaker {
    constructor(horizontalCanvas, verticalCanvas,handleApis) {

        this.horizontalCanvas = horizontalCanvas;
        this.verticalCanvas = verticalCanvas;

        this.initialWidthHorizontal = 80;
        this.initialHeightVertical = 20;

        this.handleApis = handleApis;

        this.numOfCols = 100;
        this.numOfRows = 500;

        this.initialHeightHorizontal = this.horizontalCanvas.clientHeight;
        this.initialWidthVertical = this.verticalCanvas.clientWidth;


        this.horizontalArr = []
        this.verticalArr = []
        this.init()
    }

    init() {
        this.createArrays()
    }

    createArrays() {

        //putting values the array
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.numOfCols; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthHorizontal, this.initialHeightHorizontal, i + 1);
            this.horizontalArr[i] = cell;

            x += this.initialWidthHorizontal;
        }

        x = 0;
        y = 0;
        for (let i = 0; i < this.numOfRows; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthVertical, this.initialHeightVertical, i + 1);
            this.verticalArr[i] = cell;
            y += this.initialHeightVertical;
        }

        // console.log("created array vertical of size ", 1 , " to ", this.numOfRows);


    }

    getHorizontalArray() {
        return this.horizontalArr;
    }

    getVerticalArray() {
        return this.verticalArr;
    }


    increaseNumOfCols() {

        console.log("increasing number of rows")

        const lastCell = this.horizontalArr[this.horizontalArr.length - 1];
        let x = lastCell.x + lastCell.width;
        let y = 0;
        let currIndex = Math.floor(this.numOfCols + 1);

        const numNewCols = Math.floor(2 * this.horizontalCanvas.width / this.initialWidthHorizontal);


        for (let i = 0; i < numNewCols; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthHorizontal, this.initialHeightHorizontal, currIndex + 1);
            this.horizontalArr.push(cell);
            x += this.initialWidthHorizontal;
            currIndex++;
        }

        this.numOfCols = this.horizontalArr.length;
    }

    increaseNumOfRows(numNewRows) {
        console.log("increasing number of rows ")

        const lastCell = this.verticalArr[this.verticalArr.length - 1];
        let y = lastCell.y + lastCell.height;
        let x = 0;
        let currIndex = Math.floor(this.numOfRows + 1);

        // const numNewRows = Math.floor(2*this.verticalCanvas.height / this.initialHeightVertical)*10;//10 is factor for creating almost 400 rows

        console.log("from ",this.numOfRows, numNewRows);

        // this.handleApis.getDataInRange(this.numOfRows,numNewRows);

        for (let i = 0; i < numNewRows; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthVertical, this.initialHeightVertical, currIndex + 1);
            this.verticalArr.push(cell);
            y += this.initialHeightVertical;
            currIndex++;
        }
        this.numOfRows = this.verticalArr.length;
    }

    resizeColumn(index, diff) {
        let MIN_WIDTH = 50;
        this.horizontalArr[index].width = Math.max(MIN_WIDTH, this.horizontalArr[index].width + diff);
        for (let i = index + 1; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].x = this.horizontalArr[i - 1].x + this.horizontalArr[i - 1].width;
        }
    }

    resizeRow(index, diff) {

        let MIN_HEIGHT = 15;
        this.verticalArr[index].height = Math.max(MIN_HEIGHT, this.verticalArr[index].height + diff);
        for (let i = index + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].y = this.verticalArr[i - 1].y + this.verticalArr[i - 1].height;
        }

    }

    addRowAtInd(ind) {

        let oldRow = this.verticalArr[ind];

        let newRow = new HeaderCell(oldRow.x, oldRow.y, this.initialWidthVertical, this.initialHeigthVertical, ind + 1);

        this.verticalArr.splice(ind, 0, newRow)

        for (let i = ind + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].value.data += 1;
            this.verticalArr[i].y += this.initialHeigthVertical;
        }
    }

    deleteRowAtInd(ind) {

        let rowToBeDeleted = this.verticalArr[ind];

        this.verticalArr.splice(ind, 1)

        for (let i = ind; i < this.verticalArr.length; i++) {
            this.verticalArr[i].value.data -= 1;
            this.verticalArr[i].y -= this.initialHeigthVertical;
        }
    }

    deleteColAtInd(ind) {

        let colToBeDeleted = this.horizontalArr[ind];
        let widthOfCol = colToBeDeleted.width;

        this.horizontalArr.splice(ind, 1);

        for (let i = ind; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data -= 1;
            this.horizontalArr[i].x -= widthOfCol;
        }
    }

    addColAtInd(ind) {

        let oldCol = this.horizontalArr[ind];

        let newCol = new HeaderCell(oldCol.x, oldCol.y, this.initialWidthHorizontal, this.initialHeightHorizontal, ind + 1);

        this.horizontalArr.splice(ind, 0, newCol)

        for (let i = ind + 1; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data += 1;
            this.horizontalArr[i].x += this.initialWidthHorizontal;
        }
    }


}