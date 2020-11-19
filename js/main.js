'use strict'

var MINE = '💣';
var FLAG = '⛳';
var EMPTY = '⬜';
var LOSE = '😰';
var BTN = '😄';
var LIFE = '🖤';

var gBoard = [];
var gGame;
var gLevel = {
    size: 0,
    mines: 0,
};

function initGame() {
    console.log('hello');
    var elBtn = document.querySelector('button');
    elBtn.innerText = BTN;
    gBoard = createBoard();
    console.log('init gBoard.length=' + gBoard.length);
    gGame = {
        isOn: false,
        shownCount: 0,
        flagsCount: 0,
        secsPassed: 0,
        lives: gLevel.lives
    };
    resetWatch();
    renderBoard();
}

function getRandomLocation(board, count, rowIdx, colIdx) {
    var locations = [];
    var randomLocations = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (i === rowIdx && j === colIdx) {
                console.log('not adding cell ' + i + ',' + j);
                continue;
            } else {
                locations.push({ i, j });
            }
        }
    }
    // get a random index (index location) from the array.
    for (let i = 0; i < count; i++) {
        var randIndex = getRandomIntInclusive(0, locations.length);
        var randCoord = locations[randIndex];
        randomLocations.push(randCoord);
        locations.splice(randIndex, 1);
    }
    return randomLocations;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseLevel(elBtn) {
    switch (elBtn.innerText) {
        case 'Easy':
            gLevel = {
                size: 4,
                mines: 2,
                lives: 1
            }
            break;
        case 'Medium':
            gLevel = {
                size: 8,
                mines: 12,
                lives: 3
            }
            break;
        case 'Hard':
            gLevel = {
                size: 12,
                mines: 30,
                lives: 3
            }
            break;
        default:
            break;
    }
    initGame();
}

function cellClicked(elTd) {
    var cellCoord = getCellCoord(elTd.id);
    var cell = gBoard[cellCoord.i][cellCoord.j];
    // console.log('cellCoord.i=' + cellCoord.i + ' cellCoord.j=' + cellCoord.j);
    if (!gGame.isOn) { //if the game didn't start, start
        createMines(gBoard, cellCoord.i, cellCoord.j);
        startWatch();
        gGame.isOn = true;
    }
    if (cell.isFlagged) {
        return;
    }

    cell.isShown = true;

    // console.log('gBoard[cellCoord.i][cellCoord.j].minesAroundCount=' + gBoard[cellCoord.i][cellCoord.j].minesAroundCount);
    if (cell.isMine) {
        gGame.lives--;
        console.log('gGame.lives=' + gGame.lives);
        if (gGame.lives === 0) {
            showAllMines();
            setTimeout(gameOver, 500);
        }
    } else {
        gGame.shownCount++;
    }
    expandShown(gBoard, cellCoord.i, cellCoord.j)

    if (isVictory()) {
        stopWatch();
        setTimeout(function () {
            alert('you WIN! 😎');
        }, 100)
    }
    renderBoard();

    // console.log('gGame.shownCount=' + gGame.shownCount);
}

function isVictory() {
    // console.log('isVictoryCalled');
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!((cell.isMine && cell.isFlagged) || cell.isShown)) {
                return false;
            }
        }
    }
    return true;
}

function gameOver() {
    gGame.isOn = false;
    stopWatch();
    var elBtn = document.querySelector('button');
    elBtn.innerText = LOSE;
}

function cellFlaged(elTd) { // right click will not start the game
    var cellCoord = getCellCoord(elTd.id);
    var cell = gBoard[cellCoord.i][cellCoord.j];

    cell.isFlagged = !cell.isFlagged;
    if (cell.isFlagged) {
        gGame.flagsCount++;
    } else {
        gGame.flagsCount--;
    }

    if (isVictory()) {
        stopWatch();
        setTimeout(function () {
            alert('you WIN!');
        }, 100)
    }
    renderBoard();
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
}

function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    // ['cell','2','7']
    coord.i = +parts[1]
    coord.j = +parts[2];
    return coord;
}

function expandShown(board, rowIdx, colIdx) {
    // console.log('exShcalled rowIdx=' + rowIdx + ' colIdx=' + colIdx);
    var cell = board[rowIdx][colIdx];
    if (cell.minesAroundCount === 0) {
        // console.log('no mines around');
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= board.length) continue;
                if (rowIdx === i && colIdx === j) continue;
                if (!board[i][j].isShown) {
                    board[i][j].isShown = true;
                    expandShown(board, i, j);
                }
            }
        }
    }
}

function minesAroundCount(board, rowIdx, colIdx) {
    var countMinesAround = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (rowIdx === i && colIdx === j) continue;
            if (board[i][j].isMine) {
                countMinesAround++;
            }
            // console.log('rowIdx=' + rowIdx + ' colIdx=' + colIdx + ' i=' + i + ' j=' + j + ' isMine=' + board[i][j].isMine + ' countMinesAround=' + countMinesAround);
        }
    }
    return countMinesAround;
}

function createMines(board, rowIdx, colIdx) {
    // board[0][0].isMine = true;
    // board[1][1].isMine = true;
    var randomMinesLocations = getRandomLocation(board, gLevel.mines, rowIdx, colIdx);
    // randomMinesLocations[i] => {i,j}
    for (let i = 0; i < randomMinesLocations.length; i++) {
        var mineCoord = randomMinesLocations[i];
        console.log('mineCoord=' + mineCoord.i + "," + mineCoord.j);

        board[mineCoord.i][mineCoord.j].isMine = true;
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = minesAroundCount(board, i, j);
            // console.log('i=' + i + ' j=' + j + ' board[i][j].minesAroundCount= ' + board[i][j].minesAroundCount);
        }
    }
}

function createBoard() {
    var board = [];
    var boardLength = gLevel.size;

    for (var i = 0; i < boardLength; i++) {
        var row = [];
        for (var j = 0; j < boardLength; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isFlagged: false,
            };
            row.push(cell);
        }
        board.push(row);
    }
    // createMines(board);
    // console.log(board);
    return board;
}

function renderBoard() {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';

        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var tdId = 'cell-' + i + '-' + j;
            var strCell = '';
            if (cell.isShown) {
                if (cell.isMine) {
                    strCell = MINE;
                } else {
                    if (cell.minesAroundCount === 0) {
                        strCell = EMPTY;
                    } else {
                        strCell = cell.minesAroundCount;
                    }
                }
            } else if (cell.isFlagged) {
                strCell = FLAG;
            }
            strHTML += '<td id="' + tdId + '" onclick="cellClicked(this)" oncontextmenu="cellFlaged(this); return false;">' + strCell + '</td>';
        }
        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    var elFlagsCount = document.querySelector('.flagscount');
    elFlagsCount.innerText = FLAG + ' ' + (gLevel.mines - gGame.flagsCount);

    var elLives = document.querySelector('.lives');
    var lives = '';
    for (let i = 0; i < gGame.lives; i++) {
        lives += LIFE;
    }
    elLives.innerText = lives;
}

