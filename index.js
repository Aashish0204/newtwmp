
//imports
import { Scroll } from '../scripts/scroll.js'
import { MiniCanvas } from './scripts/miniCanvas.js';
import { LinkedList } from './scripts/linkedList.js'

//global varaibles that are to be used in other files too

export let horizontalCnvCtx = null;
export let verticalCnvCtx = null;
export let spreadsheetCnvCtx = null;

export let horizontalCanvas = null;
export let verticalCanvas = null;
export let spreadsheetCanvas = null;

function scallingCanvas() {

    const dpr = window.devicePixelRatio;

    //scalling horizontal canvas

    horizontalCanvas.width = Math.floor(horizontalCanvas.clientWidth * dpr)
    horizontalCanvas.height = Math.floor(horizontalCanvas.clientHeight * dpr)

    horizontalCnvCtx.scale(dpr, dpr)

    //scalling vertical canvas

    verticalCanvas.width = Math.floor(verticalCanvas.clientWidth * dpr)
    verticalCanvas.height = Math.floor(verticalCanvas.clientHeight * dpr)

    verticalCnvCtx.scale(dpr, dpr)

    //scalling main canvas
    spreadsheetCanvas.width = Math.floor(spreadsheetCanvas.clientWidth * dpr)
    spreadsheetCanvas.height = Math.floor(spreadsheetCanvas.clientHeight * dpr)


    spreadsheetCnvCtx.scale(dpr, dpr)


}

//onPageLoaded
document.addEventListener('DOMContentLoaded', (e) => {

    console.log("DOM Content Loaded");

    //All Initializations
    const verticalBar = document.getElementById('verticalBar')
    const horizontalBar = document.getElementById('horizontalBar')
    const fullCanvas = document.getElementById('fullCanvas')
    const horizontalScroll = document.getElementById('horizontalScroll')
    const verticalScroll = document.getElementById('verticalScroll')


    horizontalCanvas = document.getElementById('horizontalCanvas')
    verticalCanvas = document.getElementById('verticalCanvas')
    spreadsheetCanvas = document.getElementById('spreadsheetCanvas')

    console.log(horizontalCanvas, verticalCanvas, spreadsheetCanvas)

    horizontalCnvCtx = horizontalCanvas.getContext('2d');
    verticalCnvCtx = verticalCanvas.getContext('2d');
    spreadsheetCnvCtx = spreadsheetCanvas.getContext('2d');

    //scalling canvas
    scallingCanvas()

    //initiating Canvas Formation
    const inititalNumOfCols = 1000;
    const initialNumOfRows = 50;
    const initialWidthHorizontal = 100;
    const initialHeightHorizontal = horizontalCanvas.clientHeight;
    const initialWidthVertical = verticalCanvas.clientWidth;
    const initialHeightVertical = 30;
    const resizeWidth = 12;
    const offsetSharpness = 0.5;

    let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical, resizeWidth,offsetSharpness)

    const horizontalArr = miniCanvas.horizontalArr;
    const verticalArr = miniCanvas.verticalArr;

    const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);

    //intiating ScrollFunctionalities
    new Scroll(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas);

})


