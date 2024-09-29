
import { Stack } from './stack.js'

export class FormulaParser {

    constructor(matrix) {

        this.matrix = matrix;

        //creating stacks

        //stack for value
        this.valueStack = new Stack();
        //stack for operators
        this.operatorStack = new Stack();

        //functions for handling special functions of parser
        this.functions = {
            SUM: this.handleSum.bind(this),
            COUNT: this.handleCount.bind(this),
            AVG: this.handleAvg.bind(this),
            MIN: this.handleMin.bind(this),
            MAX: this.handleMax.bind(this)
        };


    }

    resetStacks() {
        //clears the stacks
        this.valueStack.clear();
        this.operatorStack.clear();
    }

    tokenize(formula) {
        const regex = /(\b(?:SUM|COUNT|AVG|MAX|MIN)\b|\(|\)|\*|\/|\+|\-|\d+|\$?[A-Za-z]\$?\d+(?::\$?[A-Za-z]\$?\d+)?|,)/g;
        // Use the regex to match and return all tokens
        return formula.match(regex);
    }


    evaluateFormula(formula) {

        //check if its a formula or not and remove = and white spaces
        if (!formula || !formula.startsWith("=")) return formula;
        formula = formula.slice(1).toUpperCase().trim();

        //tokenize formula
        let tokenizedFormula = this.tokenize(formula);

        return this.parseFormula(tokenizedFormula);

    }

    parseFormula(tokenizedFormula) {

        for (let i = 0; i < tokenizedFormula.length; i++) {

            let token = tokenizedFormula[i];
            console.log("For token ", token);

            if (token in this.functions) {
                //token is a function
                //push the function in operator stack
                this.operatorStack.push(token);
            }
            else if (this.isNumber(token)) {
                //if token is a number just push it in value stack
                this.valueStack.push(parseFloat(token));
            }
            else if (this.isOperator(token)) {
                //token is operator
                //push the token ie. operator in stack if operators precedence
                //is more or equal than precedence of operator on top of stack
                //else solve the top of stack first until the precedence of top
                //becomes less than tokens precedence
                this.handleOperator(token);
            }
            else if (this.isCellReference(token) || this.isRange(token) || token == '(') {
                //simply push on value stack
                this.valueStack.push(token);
            }
            else if (token == ')') {
                //main logic here
                //check for top of operator stack
                //if empty then there should be only one thing between brackets return that
                //if top of op stack is operator +-/*^ then pick top two element from value stack
                //and go on evaluting value until opening bracket is reached
                //if top of op stack is function then pop all elements of value and create the args
                //which is then passed to the function on top as a args and returned the value
                this.handleClosingBracket(token)

            }
        }

        //once ended now lets evaluate remaining elements of the stack
        this.handleRemainingEvaluation();

        if (this.valueStack.size() == 1) {
            console.log("final answer is ", this.valueStack.peek());
            this.resetStacks()
            return this.valueStack.peek();
        }

        this.resetStacks();
        return -1;

    }


    handleOperator(token) {

        while (!this.operatorStack.isEmpty() &&
            this.isOperator(this.operatorStack.peek()) &&
            this.precedence(this.operatorStack.peek()) > this.precedence(token)
        ) {
            this.evaluateTopOfStack();
        }
        this.operatorStack.push(token);

    }

    evaluateTopOfStack() {
        let value1 = this.valueStack.peek();
        this.valueStack.pop();
        let value2 = this.valueStack.peek();
        this.valueStack.pop();

        this.valueStack.push(this.applyOperation(value2, value1, this.operatorStack.peek()));
        this.operatorStack.pop();
    }

    handleClosingBracket(token) {

        if (this.isOperator(this.operatorStack.peek())) {

            while (this.valueStack != '(' &&
                !this.operatorStack.isEmpty() &&
                this.isOperator(this.operatorStack.peek()) &&
                this.precedence(this.operatorStack.peek()) > this.precedence(token)
            ) {
                this.evaluateTopOfStack();
            }
            this.valueStack.pop();
        }
        else if (this.operatorStack.peek() in this.functions) {
            this.evaluateFunctionOperation();
        }
    }

    evaluateFunctionOperation() {
        let tempArgs = [];
        while (!this.valueStack.isEmpty() &&
            this.valueStack.peek() != '(') {
            tempArgs.push(this.valueStack.peek());
            this.valueStack.pop();
        }
        this.valueStack.pop();//poping (
        tempArgs = tempArgs.reverse();
        let value = this.functions[this.operatorStack.peek()](tempArgs);
        this.operatorStack.pop();
        console.log(value)
        this.valueStack.push(value);
    }

    handleRemainingEvaluation() {
        console.log("before")
        this.valueStack.print();
        this.operatorStack.print();

        while (!this.operatorStack.isEmpty()) {

            this.evaluateTopOfStack();
        }
        console.log("After")
        this.valueStack.print();
        this.operatorStack.print();
    }



    precedence(op) {
        //gives precedence of a operator
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        if (op === '^') return 3;
        return 0;
    }

    applyOperation(a, b, op) {
        //applies operation op on expression a and b
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            case '^': return Math.pow(a, b);
            default: return 0;
        }
    }



    handleSum(args) {
        console.log(args);
        let sum = 0;

        for (let arg of args) {
            if (this.isNumber(arg)) {
                sum += parseFloat(arg);
            } else if (this.isRange(arg)) {
                const { start, end } = this.getRangePosition(arg);
                console.log(start, end);

                for (let row = start.row; row <= end.row; row++) {
                    for (let col = start.col; col <= end.col; col++) {
                        const value = this.matrix.getCellvalue(row + 1, col + 1);
                        sum += value ? parseFloat(value) : 0;
                    }
                }
            } else if (this.isCellReference(arg)) {
                console.log("before ", arg)
                arg = arg.replace(/\$/g, '');
                console.log("after ", arg)
                let pos = this.getCellPosition(arg);
                const value = this.matrix.getCellvalue(pos.row + 1, pos.col + 1);
                sum += value ? parseFloat(value) : 0;
            } else {
                console.warn(`Ignoring invalid argument: ${arg}`);
            }
        }

        return sum;
    }

    handleCount(args) {
        console.log(args);
        let count = 0;

        for (let arg of args) {
            if (this.isNumber(arg)) {
                count++;
            } else if (this.isRange(arg)) {
                const { start, end } = this.getRangePosition(arg);
                console.log(start, end);

                for (let row = start.row; row <= end.row; row++) {
                    for (let col = start.col; col <= end.col; col++) {
                        const value = this.matrix.getCellvalue(row + 1, col + 1);
                        this.isNumber(value) ? count++ : ""
                    }
                }
            } else if (this.isCellReference(arg)) {
                arg = arg.replace(/\$/g, '');
                let pos = this.getCellPosition(arg);
                const value = this.matrix.getCellvalue(pos.row + 1, pos.col + 1);
                this.isNumber(value) ? count++ : ""
            } else {
                console.warn(`Ignoring invalid argument: ${arg}`);
            }
        }

        return count;
    }

    handleMin(args) {
        console.log(args);
        let min = Infinity;

        for (let arg of args) {
            if (this.isNumber(arg)) {
                min = Math.min(min, parseFloat(arg))
            } else if (this.isRange(arg)) {
                const { start, end } = this.getRangePosition(arg);
                console.log(start, end);

                for (let row = start.row; row <= end.row; row++) {
                    for (let col = start.col; col <= end.col; col++) {
                        const value = this.matrix.getCellvalue(row + 1, col + 1);
                        this.isNumber(value) ? min = Math.min(min, parseFloat(value)) : ""
                    }
                }
            } else if (this.isCellReference(arg)) {
                arg = arg.replace(/\$/g, '');
                let pos = this.getCellPosition(arg);
                const value = this.matrix.getCellvalue(pos.row + 1, pos.col + 1);
                this.isNumber(value) ? min = Math.min(min, value) : "";
            } else {
                console.warn(`Ignoring invalid argument: ${arg}`);
            }
        }

        return min;
    }

    handleMax(args) {
        console.log(args);
        let max = -Infinity;

        for (let arg of args) {
            if (this.isNumber(arg)) {
                max = Math.max(max, parseFloat(arg))
            } else if (this.isRange(arg)) {
                const { start, end } = this.getRangePosition(arg);
                console.log(start, end);

                for (let row = start.row; row <= end.row; row++) {
                    for (let col = start.col; col <= end.col; col++) {
                        const value = this.matrix.getCellvalue(row + 1, col + 1);
                        this.isNumber(value) ? max = Math.max(max, parseFloat(value)) : "";
                    }
                }
            } else if (this.isCellReference(arg)) {
                arg = arg.replace(/\$/g, '');
                let pos = this.getCellPosition(arg);
                const value = this.matrix.getCellvalue(pos.row + 1, pos.col + 1);
                this.isNumber(value) ? max = Math.max(max, parseFloat(value)) : "";
            } else {
                console.warn(`Ignoring invalid argument: ${arg}`);
            }
        }

        return max;
    }

    handleAvg(args) {

        console.log(args);
        let sum = 0, count = 0;

        for (let arg of args) {
            if (this.isNumber(arg)) {
                sum += parseFloat(arg);
                count++;
            } else if (this.isRange(arg)) {
                const { start, end } = this.getRangePosition(arg);
                console.log(start, end);

                for (let row = start.row; row <= end.row; row++) {
                    for (let col = start.col; col <= end.col; col++) {
                        const value = this.matrix.getCellvalue(row + 1, col + 1);
                        if (this.isNumber(value)) {
                            sum += parseFloat(value);
                            count++;
                        }
                    }
                }
            } else if (this.isCellReference(arg)) {
                arg = arg.replace(/\$/g, '');
                let pos = this.getCellPosition(arg);
                const value = this.matrix.getCellvalue(pos.row + 1, pos.col + 1);
                if (this.isNumber(value)) {
                    sum += parseFloat(value);
                    count++;
                }
            } else {
                console.warn(`Ignoring invalid argument: ${arg}`);
            }
        }

        return count === 0 ? 0 : sum / count;

    }



    isOperator(char) {
        const operators = ['+', '-', '*', '/', '^'];
        return operators.includes(char);
    }


    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    isRange(value) {
        return /^[A-Z]+\d+:[A-Z]+\d+$/i.test(value);
    }

    isCellReference(value) {
        return /^(\$?[A-Z]+\$?\d+)$/.test(value);
    }

    getCellPosition(cellRef) {
        const col = cellRef.charCodeAt(0) - 'A'.charCodeAt(0); // A = 0, B = 1, etc.
        const row = parseInt(cellRef.slice(1), 10) - 1; // Convert row number to zero-based index
        return { row, col };
    }


    getRangePosition(range) {
        console.log(range)
        const [startCell, endCell] = range.split(":");
        return {
            start: this.getCellPosition(startCell),
            end: this.getCellPosition(endCell),
        };
    }


}