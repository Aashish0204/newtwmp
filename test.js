
function getColumnLeftPosition(col) {
    let x = 0;
    for (let i = 0; i < col; i++) {
        x += columnWidths[i];
    }
    return x;
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = getColumnAtX(x);

    if (col > 0 && Math.abs(x - getColumnLeftPosition(col)) < RESIZE_HANDLE_WIDTH / 2) {
        isResizing = true;
        resizingColumn = col - 1;
        canvas.style.cursor = 'col-resize';
    } 

    canvas.addEventListener('mouseup',()=>{
        return;
    })
});
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (isResizing) {
        const newWidth = x - getColumnLeftPosition(resizingColumn);
        if (newWidth > 10) {  // Minimum column width
            columnWidths[resizingColumn] = newWidth;
            render();
        }
    } else {
        const col = getColumnAtX(x);
        if (col > 0 && Math.abs(x - getColumnLeftPosition(col)) < RESIZE_HANDLE_WIDTH / 2) {
            canvas.style.cursor = 'col-resize';
        } else {
            canvas.style.cursor = 'default';
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isResizing = false;
    resizingColumn = -1;
    canvas.style.cursor = 'default';
});

canvas.addEventListener('click', (e) => {
    if (!isResizing) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = getColumnAtX(x);
        const row = Math.floor(y / CELL_HEIGHT);

        if (col !== -1 && row < ROWS) {
            cellInput.style.display = 'block';
            cellInput.style.left = `${rect.left + getColumnLeftPosition(col)}px`;
            cellInput.style.top = `${rect.top + row * CELL_HEIGHT}px`;
            cellInput.style.width = `${columnWidths[col]}px`;
            cellInput.style.height = `${CELL_HEIGHT}px`;
            cellInput.value = data[row][col];
            cellInput.focus();

            cellInput.onblur = () => {
                data[row][col] = cellInput.value;
                cellInput.style.display = 'none';
                render();
            };
        }
    }
});



render();