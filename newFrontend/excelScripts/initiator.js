
import { ExcelMaker } from "./body/excelMaker.js";
import { HeaderMaker } from "./header/headerMaker.js";

export class Initiator {

    constructor(headerElement, bodyElement) {

        this.headerElement = headerElement;
        this.bodyElement = bodyElement;


        //required values for making body
        this.maxRow = 3;
        this.maxCol = 3;


        //creating body component
        this.excelMakerInstance = this.createBody();

        //creating header component
        this.headerInstance = this.createHeader();

    }

    createBody() {
        return new ExcelMaker(this.bodyElement,this.maxRow,this.maxCol);
    }

    createHeader() {
        new HeaderMaker(this.headerElement,this.excelMakerInstance);
    }

}