

export class Scroll {

    constructor(sheet) {
        this.fullCanvas = sheet.fullCanvas;
        this.horizontalBar = sheet.horizontalBar;
        this.horizontalScroll = sheet.horizontalScroll;
        this.verticalBar = sheet.verticalBar;
        this.verticalScroll = sheet.verticalScroll;
        this.renderer = sheet.renderer;
        this.handleApis = sheet.handleApis;

        this.headerCellsMaker = sheet.headerCellsMaker;
        this.functionality = sheet.functionality;

        this.horizontallyScrolled = 0;
        this.verticallyScrolled = 0;

        this.totalContentWidth = 0;
        this.totalContentHeight = 0;

        this.wheelScrollRate = 5;

        this.init();
    }

    init() {

        this.functionality.getScrollInstance(this);


        this.isHorizontalScrolling = false;
        this.startMouseX = 0;
        this.startBarLeft = this.horizontalBar.offsetLeft;
        this.currentMouseX = 0;

        this.updateHorizontalScrollBar();


        this.isVerticalScrolling = false;
        this.startMouseY = 0;
        this.startBarTop = this.verticalBar.offsetTop;
        this.currentMouseY = 0;

        this.updateVerticalScrollBar();
        this.handleWheelEvent();


        //creating the totalContentWidth
        this.totalContentWidth = this.horizontalScroll.clientWidth * 2;
        this.totalContentHeight = this.headerCellsMaker.verticalArr[this.headerCellsMaker.verticalArr.length - 1].y;

    }

    updateGrid() {

        this.renderer.renderCanvasOnScroll(this.horizontallyScrolled, this.verticallyScrolled);
        this.functionality.getScrollInstance(this)
        this.functionality.saveInputData()
        this.functionality.updateInputPositionAndValue();
        this.functionality.handleRectangleToMake();
    }

    increaseNumOfCols() {
        this.headerCellsMaker.increaseNumOfCols();
        this.renderer.renderCanvasOnScroll(this.horizontallyScrolled, this.verticallyScrolled)
    }

    increaseNumOfRows() {
        let initialLengthOfVerArr = this.headerCellsMaker.verticalArr.length;
        this.headerCellsMaker.increaseNumOfRows(500);
        this.handleApis.getDataInRange(initialLengthOfVerArr, 500);
        this.renderer.renderCanvasOnScroll(this.horizontallyScrolled, this.verticallyScrolled)
    }

    updateScrollByDiffHor(diffX) {
        // To get new position of Bar from left
        let newBarLeft = this.startBarLeft + diffX;

        // how much the bar can move / travel
        let maxBarLeft = this.horizontalScroll.clientWidth - this.horizontalBar.offsetWidth;

        // Limiting the Bar , so that it can't go back the starting position and not not go beyond maxBarleft
        newBarLeft = Math.max(0, Math.min(newBarLeft, maxBarLeft));

        // Deciding how much content should be loaded
        let minContentWidth = this.horizontalScroll.clientWidth * 2;

        // how much u have scrolled till now with respect to content
        this.horizontallyScrolled = newBarLeft * this.totalContentWidth / this.horizontalScroll.clientWidth;

        // It is used for increasing more conentent , when we reach 80% of total content width , total content width get increases by horziontal Scroll clienWidth
        if (this.horizontallyScrolled >= .7 * (this.totalContentWidth - this.horizontalScroll.clientWidth)) {
            this.totalContentWidth += this.horizontalScroll.clientWidth;
            this.increaseNumOfCols();
        }

        // This is used when horizontally scroll become less or equal to 0 , the total content Width become equal to minContent Width 
        else if (this.horizontallyScrolled <= 0) {
            this.totalContentWidth = minContentWidth;
        }

        newBarLeft = this.horizontallyScrolled * this.horizontalScroll.clientWidth / this.totalContentWidth;

        this.horizontalBar.style.width = Math.max(20, (this.horizontalScroll.clientWidth * this.horizontalScroll.clientWidth / this.totalContentWidth)) + "px"

        // Update bar style
        this.horizontalBar.style.left = `${newBarLeft}px`;

        this.startMouseX = this.currentMouseX;
        this.startBarLeft = newBarLeft;

        this.currentMouseX = 0;

        this.updateGrid();
    }

    updateHorizontalScrollBar() {

        this.horizontalBar.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            //To check if horizontal Scrolling
            this.isHorizontalScrolling = true;
            // To get Starting position of mouse with respect to page
            this.startMouseX = e.pageX;
            // To get position of horzontal bar from left
            this.startBarLeft = this.horizontalBar.offsetLeft;



            const onMouseMove = (e) => {
                if (!this.isHorizontalScrolling) return;
                e.preventDefault();
                // To know the current value of Current mouse with respect to page
                this.currentMouseX = e.pageX;
                // To know how much mouse have moved
                let diffX = this.currentMouseX - this.startMouseX;
                this.updateScrollByDiffHor(diffX)

            };

            const onMouseUp = () => {
                this.isHorizontalScrolling = false;
                window.removeEventListener('pointermove', onMouseMove);
                window.removeEventListener('pointerup', onMouseUp);
            };

            window.addEventListener('pointermove', onMouseMove);
            window.addEventListener('pointerup', onMouseUp);


        });

        this.fullCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.updateScrollByDiffHor(e.deltaX * this.wheelScrollRate / 100);
        })
    }


    //fucntion to update the scroll bar and content using the diff
    updateScrollByDiffVer(diffY) {

        let newBarTop = this.startBarTop + diffY;

        let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;
        newBarTop = Math.max(0, Math.min(newBarTop, maxBarTop));

        let minContentHeight = this.verticalScroll.clientHeight * 2;

        this.verticallyScrolled = newBarTop * this.totalContentHeight / this.verticalScroll.clientHeight;

        if (this.verticallyScrolled >= .8 * (this.totalContentHeight - this.verticalScroll.clientHeight)) {
            this.increaseNumOfRows()
            this.totalContentHeight = this.headerCellsMaker.verticalArr[this.headerCellsMaker.verticalArr.length - 1].y;

        }
        else if (this.verticallyScrolled <= 0) {
            this.totalContentHeight = minContentHeight;
        }

        newBarTop = this.verticallyScrolled * this.verticalScroll.clientHeight / this.totalContentHeight;

        this.verticalBar.style.height = Math.max(30, (this.verticalScroll.clientHeight * this.verticalScroll.clientHeight / this.totalContentHeight)) + "px"

        this.verticalBar.style.top = `${newBarTop}px`;

        this.startMouseY = this.currentMouseY;
        this.startBarTop = newBarTop;

        this.currentMouseY = 0;

        this.updateGrid();
    }



    handleWheelScrollVer(diffY) {

        // console.log(diffY);

        let newBarTop = this.startBarTop + diffY;

        let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;

        newBarTop = Math.max(0, Math.min(newBarTop, maxBarTop));

        let minContentHeight = this.verticalScroll.clientHeight * 2;

        this.verticallyScrolled = Math.max(0, this.verticallyScrolled + diffY);

        if (this.verticallyScrolled >= .8 * (this.totalContentHeight - this.verticalScroll.clientHeight)) {
            this.increaseNumOfRows();
            this.totalContentHeight = this.headerCellsMaker.verticalArr[this.headerCellsMaker.verticalArr.length - 1].y;
        }
        else if (this.verticallyScrolled <= 0) {
            this.totalContentHeight = minContentHeight;
        }

        newBarTop = this.verticallyScrolled * this.verticalScroll.clientHeight / this.totalContentHeight;

        this.verticalBar.style.height = Math.max(30, (this.verticalScroll.clientHeight * this.verticalScroll.clientHeight / this.totalContentHeight)) + "px"

        this.verticalBar.style.top = `${newBarTop}px`;

        this.startMouseY = this.currentMouseY;
        this.startBarTop = newBarTop;

        this.currentMouseY = 0;

        this.updateGrid();
    }

    updateVerticalScrollBar() {

        this.verticalBar.addEventListener('pointerdown', (e) => {
            e.preventDefault();

            this.isVerticalScrolling = true;
            this.startMouseY = e.pageY;
            this.startBarTop = this.verticalBar.offsetTop;

            const onMouseMove = (e) => {
                if (!this.isVerticalScrolling) return;
                e.preventDefault();
                this.currentMouseY = e.pageY;
                let diffY = this.currentMouseY - this.startMouseY;
                this.updateScrollByDiffVer(diffY);
            };

            const onMouseUp = () => {
                this.isVerticalScrolling = false;
                window.removeEventListener('pointermove', onMouseMove);
                window.removeEventListener('pointerup', onMouseUp);
            };

            window.addEventListener('pointermove', onMouseMove);
            window.addEventListener('pointerup', onMouseUp);

        });

    }


    handleWheelEvent() {

        this.fullCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.handleWheelScrollVer(e.deltaY * this.wheelScrollRate / 10)
        })
    }



}