
import { Excel } from './excels/excel.js'

export class ExcelMaker {

    constructor(mainContainer, maxRow, maxCol) {

        this.mainContainer = mainContainer;//refrence to mainContainer
        this.maxRow = maxRow;
        this.maxCol = maxCol;

        this.currRow = 0; //how many rows are there currently
        this.rowArr = []; //array of rows that contains excel refrence

        this.init();

    }

    addNewRow() {

        if (this.currRow >= this.maxRow) {
            alert("No more excel can be added")
            return;
        }

        //increase row Value
        this.currRow += 1;

        //creating row div
        const row = document.createElement('div');
        row.className = 'row';
        row.setAttribute('id', `row${this.currRow}`)
        row.style.gridTemplateColumns = '100%';


        const excel = new Excel(this, row, this.currRow, 1);
        // console.log(excel);
        this.rowArr[this.currRow - 1] = [excel];


        this.mainContainer.appendChild(row);

        //applying changes to main grid % values
        let newGTR = ""
        for (let i = 0; i < this.currRow; i++) {
            newGTR += `${100 / this.currRow}% `;
        }

        this.mainContainer.style.gridTemplateRows = newGTR;
        this.mainContainer.style.gridTemplateColumns = '';

    }

    addNewCol(rowNum) {

        //getting the row element


        let colNum = this.rowArr[rowNum - 1].length;

        if (colNum >= this.maxCol) {
            alert("No more excel can be added")
            return;
        }

        let rowRef = document.getElementById(`row${rowNum}`);

        colNum += 1;

        const excel = new Excel(this, rowRef, rowNum, colNum);

        this.rowArr[rowNum - 1].push(excel);

        //applying changes to main grid % values
        let newGTC = ""
        for (let i = 0; i < colNum; i++) {
            newGTC += `${100 / colNum}% `;
        }

        rowRef.style.gridTemplateColumns = newGTC;
        rowRef.style.gridTemplateRows = '';

    }

    interchangeLayout() {

        //main container interchange
        let gtC = this.mainContainer.style.gridTemplateColumns;
        let gtR = this.mainContainer.style.gridTemplateRows;

        this.mainContainer.style.gridTemplateColumns = gtR;
        this.mainContainer.style.gridTemplateRows = gtC;


        //for each rows

        for (let i = 0; i < this.currRow; i++) {
            let currEle = document.getElementById(`row${i + 1}`);

            let gtC = currEle.style.gridTemplateColumns;
            let gtR = currEle.style.gridTemplateRows;

            currEle.style.gridTemplateColumns = gtR;
            currEle.style.gridTemplateRows = gtC;
        }

    }

    handleResize() {
        let isResizing = false;
        let currentElement = null;
        let startX, startY, startWidth, startHeight;
        let rowPer = []
        let colPer = []

        const checkForResizeRange = (xPos, yPos) => {
            const threshold = 5; // threshold for detecting borders

            const boxes = this.mainContainer.querySelectorAll('.excel');

            for (const box of boxes) {
                const rect = box.getBoundingClientRect();

                const isOnLeftBorder = xPos >= rect.left - threshold && xPos <= rect.left + threshold && xPos > 5;
                const isOnRightBorder = xPos >= rect.right - threshold && xPos <= rect.right + threshold && xPos < this.mainContainer.clientWidth - 5;
                const isOnTopBorder = yPos >= rect.top - threshold && yPos <= rect.top + threshold && yPos > 5;
                const isOnBottomBorder = yPos >= rect.bottom - threshold && yPos <= rect.bottom + threshold && yPos < this.mainContainer.clientHeight - 5;

                if (isOnLeftBorder || isOnRightBorder) {
                    this.mainContainer.style.cursor = 'col-resize';
                    return { element: box, direction: isOnLeftBorder ? 'left' : 'right' };
                } else if (isOnTopBorder || isOnBottomBorder) {
                    this.mainContainer.style.cursor = 'row-resize';
                    return { element: box, direction: isOnTopBorder ? 'top' : 'bottom' };
                }
            }

            this.mainContainer.style.cursor = '';
            return null;
        };

        //added to check if resize code is working or not
        this.mainContainer.addEventListener('mousedown', (e) => {
            const resizeInfo = checkForResizeRange(e.clientX, e.clientY);

            if (resizeInfo) {
                isResizing = true;
                currentElement = resizeInfo.element;
                startX = e.clientX;
                startY = e.clientY;
                rowPer = currentElement.parentElement.style.gridTemplateColumns.split(" ").map(item => parseFloat(item.slice(0, -1)));
                colPer = this.mainContainer.style.gridTemplateRows.split(" ").map(item => parseFloat(item.slice(0, -1)));


            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) {
                checkForResizeRange(e.clientX, e.clientY);
                return;
            }

            let currX = e.clientX;
            let currY = e.clientY;

            const dx = currX - startX;
            const dy = currY - startY;

            if (this.mainContainer.style.cursor === 'col-resize') {

                let perMoved = (dx / currentElement.parentElement.clientWidth * 100);

                let colIndex = Array.from(currentElement.parentElement.children).indexOf(currentElement);

                let newRowPerArr = rowPer.map(ele => ele)
                newRowPerArr[colIndex] += perMoved;
                newRowPerArr[colIndex + 1] -= perMoved;

                // console.log(newRowPerArr)

                currentElement.parentElement.style.gridTemplateColumns = newRowPerArr.map(ele => ele + '%').join(" ");


            } else if (this.mainContainer.style.cursor === 'row-resize') {
                let perMoved = (dy / this.mainContainer.clientHeight * 100);
                let rowIndex = Array.from(this.mainContainer.children).indexOf(currentElement.parentElement);

                let newColPerArr = colPer.map(ele => ele);
                newColPerArr[rowIndex] += perMoved;
                newColPerArr[rowIndex + 1] -= perMoved;

                // console.log('Row resize:', newColPerArr);

                this.mainContainer.style.gridTemplateRows = newColPerArr.map(ele => ele + '%').join(" ");
            }

        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            currentElement = null;
        });
    }

    updateCurrSheet(sheetObj) {
        this.currSheetObj = sheetObj;
    }

    getCurrSheet() {
        console.log(this.currSheetObj)
        return this.currSheetObj;
    }

    init() {

        // setInitialCss
        this.mainContainer.style.display = "grid";

        //adding First Row
        this.addNewRow();
        this.handleResize()

    }

}