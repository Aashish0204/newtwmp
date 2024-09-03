
import { Sheet } from './sheets/sheet.js'

export class Excel {
    constructor(excelMaker, rowContainer, row, col) {

        this.rowContainer = rowContainer;
        this.col = col;
        this.row = row;

        this.sheets = {};
        this.currentSheetId = null;
        this.sheetCounter = 0;


        this.excelMaker = excelMaker;

        this.excel = null;
        this.footer = null;

        this.init();
    }

    init() {
        this.constructExcel();
        this.createFooter();
        this.addNewSheet();
        this.handleEvents();

        this.excelMaker.updateCurrSheet(this.sheets[this.currentSheetId]);

    }

    constructExcel() {
        const excel = document.createElement('div');
        excel.className = 'excel';
        this.excel = excel;

        const sheetContainer = document.createElement('div');
        sheetContainer.className = 'sheetContainer';

        const footer = document.createElement('div');
        footer.className = 'footer';

        excel.appendChild(sheetContainer);
        excel.appendChild(footer);
        this.rowContainer.appendChild(excel);

        this.sheetContainer = sheetContainer;
        this.footer = footer;

    }

    createFooter() {

        // Create the buttons container div
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        // Create the fixed add button
        const addSheetButton = document.createElement('button');
        addSheetButton.textContent = '+';
        addSheetButton.addEventListener('click', () => this.addNewSheet());
        buttonsDiv.appendChild(addSheetButton);

        // Create the scrollable container for other buttons
        const scrollableButtonsDiv = document.createElement('div');
        scrollableButtonsDiv.className = 'scrollableButtons';
        buttonsDiv.appendChild(scrollableButtonsDiv);

        // Append buttonsDiv to footer
        this.footer.appendChild(buttonsDiv);

        // Create the info display div
        const infoDiv = document.createElement('div');
        infoDiv.className = 'selectedCellInfo';

        // Append infoDiv to footer
        this.footer.appendChild(infoDiv);

    }


    addNewSheet() {
        this.sheetCounter++;
        const sheetId = `sheet${this.sheetCounter}`;

        let newSheet = document.createElement('div');
        newSheet.className = 'sheet';
        newSheet.setAttribute('id', `sheet${this.row}_${this.col}_${this.sheetCounter}`)

        const sheet = new Sheet(newSheet, this.updateSelectedCellsInfo);
        this.sheets[sheetId] = sheet;

        this.switchSheet(sheetId);
        this.updateFooterSheetsDiv();
    }

    switchSheet(sheetId) {
        if (this.currentSheetId) {
            this.sheetContainer.innerHTML = '';
            const previousActiveButton = document.querySelector(`.footer button[data-sheet-id="${this.currentSheetId}"]`);
            if (previousActiveButton) {
                previousActiveButton.classList.remove('active');
            }
        }

        this.currentSheetId = sheetId;
        this.sheetContainer.appendChild(this.sheets[sheetId].sheet);


        const currentActiveButton = document.querySelector(`.footer button[data-sheet-id="${sheetId}"]`);
        if (currentActiveButton) {
            currentActiveButton.classList.add('active');
        }
    }

    deleteSheet(sheetId) {
        if (Object.keys(this.sheets).length > 1) {
            if (this.sheets[sheetId]) {
                this.sheets[sheetId].sheet.remove();
                delete this.sheets[sheetId];

                if (this.currentSheetId === sheetId) {
                    const remainingSheetIds = Object.keys(this.sheets);
                    this.currentSheetId = remainingSheetIds.length ? remainingSheetIds[0] : null;
                    if (this.currentSheetId) {
                        this.switchSheet(this.currentSheetId);
                    } else {
                        this.sheetContainer.innerHTML = '';
                    }
                }

                this.updateFooterSheetsDiv();
            }
        }
        else {
            alert("Deleting the last sheet is not allowed")
        }
    }

    updateFooterSheetsDiv() {
        const scrollableBtns = this.footer.querySelector('.scrollableButtons');
        scrollableBtns.innerHTML = '';

        Object.keys(this.sheets).forEach(sheetId => {
            const sheetButton = document.createElement('button');
            sheetButton.textContent = sheetId.charAt(0).toUpperCase() + sheetId.slice(1);//converting to capital letter first character
            sheetButton.setAttribute('data-sheet-id', sheetId);

            sheetButton.addEventListener('click', () => this.switchSheet(sheetId));

            const closeButton = document.createElement('button');
            closeButton.className = 'close';
            closeButton.textContent = 'X';
            closeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.deleteSheet(sheetId);
            });

            sheetButton.appendChild(closeButton);
            scrollableBtns.appendChild(sheetButton);

            if (this.currentSheetId === sheetId) {
                sheetButton.classList.add('active');
            }
        });
    }

    updateSelectedCellsInfo(obj) {
        const info = document.querySelector('.selectedCellInfo');

        let infoList = [ 'sum', 'min', 'max', 'avg', 'count'];

        info.innerHTML = ''

        if(obj!=-1){

            infoList.forEach((ele)=>{
                let infoEle = document.createElement('p');
                infoEle.className = 'selectedCellInfoElements';
                infoEle.innerHTML = `${ele.charAt(0).toUpperCase()+ele.substring(1,ele.length)}: ${obj[ele]} &nbsp`;
                info.appendChild(infoEle);
            })
        }

    }

    handleMouseDown(e) {
        e.preventDefault();
        this.excelMaker.updateCurrSheet(this.sheets[this.currentSheetId]);
    }

    handleEvents() {
        this.excel.addEventListener("click", (e) => {
            this.handleMouseDown(e);
        })
    }


}