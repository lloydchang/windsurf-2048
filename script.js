const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
let score = 0;

function initGame() {
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gridContainer.appendChild(cell);
    }
    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    const cells = document.querySelectorAll('.grid-cell');
    let emptyCells = [];
    cells.forEach((cell, index) => {
        if (!cell.dataset.value) {
            emptyCells.push(index);
        }
    });
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        cells[randomIndex].dataset.value = 2;
        cells[randomIndex].innerText = 2;
        updateCellColor(cells[randomIndex]);
    }
}

function updateCellColor(cell) {
    const value = cell.dataset.value;
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f67c5f',
        128: '#f9f5e8',
        256: '#e1d4b5',
        512: '#c1b3a1',
        1024: '#c1b3a1',
        2048: '#c1b3a1',
    };
    cell.style.backgroundColor = colors[value];
}

function handleInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveTiles('up');
            break;
        case 'ArrowDown':
            moveTiles('down');
            break;
        case 'ArrowLeft':
            moveTiles('left');
            break;
        case 'ArrowRight':
            moveTiles('right');
            break;
    }
}

function moveTiles(direction) {
    const cells = document.querySelectorAll('.grid-cell');
    let cellValues = [];
    cells.forEach(cell => {
        if (cell.dataset.value) {
            cellValues.push(parseInt(cell.dataset.value));
        } else {
            cellValues.push(0);
        }
    });

    if (direction === 'up') {
        for (let col = 0; col < 4; col++) {
            let column = [cellValues[col], cellValues[col + 4], cellValues[col + 8], cellValues[col + 12]];
            column = mergeTiles(column);
            cellValues[col] = column[0];
            cellValues[col + 4] = column[1];
            cellValues[col + 8] = column[2];
            cellValues[col + 12] = column[3];
        }
    } else if (direction === 'down') {
        for (let col = 0; col < 4; col++) {
            let column = [cellValues[col + 12], cellValues[col + 8], cellValues[col + 4], cellValues[col]];
            column = mergeTiles(column);
            cellValues[col + 12] = column[0];
            cellValues[col + 8] = column[1];
            cellValues[col + 4] = column[2];
            cellValues[col] = column[3];
        }
    } else if (direction === 'left') {
        for (let row = 0; row < 4; row++) {
            let rowValues = [cellValues[row * 4], cellValues[row * 4 + 1], cellValues[row * 4 + 2], cellValues[row * 4 + 3]];
            rowValues = mergeTiles(rowValues);
            cellValues[row * 4] = rowValues[0];
            cellValues[row * 4 + 1] = rowValues[1];
            cellValues[row * 4 + 2] = rowValues[2];
            cellValues[row * 4 + 3] = rowValues[3];
        }
    } else if (direction === 'right') {
        for (let row = 0; row < 4; row++) {
            let rowValues = [cellValues[row * 4 + 3], cellValues[row * 4 + 2], cellValues[row * 4 + 1], cellValues[row * 4]];
            rowValues = mergeTiles(rowValues);
            cellValues[row * 4 + 3] = rowValues[0];
            cellValues[row * 4 + 2] = rowValues[1];
            cellValues[row * 4 + 1] = rowValues[2];
            cellValues[row * 4] = rowValues[3];
        }
    }

    cells.forEach((cell, index) => {
        if (cellValues[index] > 0) {
            cell.dataset.value = cellValues[index];
            cell.innerText = cellValues[index];
            updateCellColor(cell);
        } else {
            cell.dataset.value = '';
            cell.innerText = '';
        }
    });

    addRandomTile(); // Add a new tile after moving
    checkWin(); // Check if the player has won after moving tiles
    checkGameOver(); // Check if the game is over after moving tiles
}

function mergeTiles(tiles) {
    let mergedTiles = [];
    let newTiles = [];

    tiles.forEach(tile => {
        if (tile > 0) {
            mergedTiles.push(tile);
        }
    });

    for (let i = 0; i < mergedTiles.length - 1; i++) {
        if (mergedTiles[i] === mergedTiles[i + 1]) {
            newTiles.push(mergedTiles[i] * 2);
            score += mergedTiles[i] * 2; // Update score when tiles merge
            i++;
        } else {
            newTiles.push(mergedTiles[i]);
        }
    }

    if (mergedTiles.length > 0 && newTiles.length < mergedTiles.length) {
        newTiles.push(mergedTiles[mergedTiles.length - 1]);
    }

    while (newTiles.length < 4) {
        newTiles.push(0);
    }

    scoreDisplay.innerText = score; // Update score display
    return newTiles;
}

function checkWin() {
    const cells = document.querySelectorAll('.grid-cell');
    for (let cell of cells) {
        if (cell.dataset.value == 2048) {
            alert('You Win!'); // Notify the player
            return;
        }
    }
}

function checkGameOver() {
    const cells = document.querySelectorAll('.grid-cell');
    let emptyCells = Array.from(cells).some(cell => !cell.dataset.value);
    if (!emptyCells) {
        // Check if any adjacent tiles can be merged
        for (let i = 0; i < 16; i++) {
            if (i % 4 < 3 && cells[i].dataset.value === cells[i + 1].dataset.value) return false;
            if (i < 12 && cells[i].dataset.value === cells[i + 4].dataset.value) return false;
        }
        alert('Game Over!'); // Notify the player
    }
}

document.addEventListener('keydown', handleInput);

initGame();
