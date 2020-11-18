'use strict'

var MINE = '💣';
var FLAG = '⛳';
var EMPTY = '⬜';
var LOSE = '😰';
var BTN = '😄';

var rowNum = 4;
var colNum = 4;
var gBoard = [];
var gGame;


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
    };
    resetWatch();
    renderBoard();
}

function chooseLevel() {
    
}

function cellClicked(elTd) {
    var cellCoord = getCellCoord(elTd.id);
    var cell = gBoard[cellCoord.i][cellCoord.j];
    // console.log('cellCoord.i=' + cellCoord.i + ' cellCoord.j=' + cellCoord.j);
    if (!gGame.isOn) { //if the game didn't start, start
        startWatch();
        gGame.isOn = true;
    }
    cell.isShown = true;

    // console.log('gBoard[cellCoord.i][cellCoord.j].minesAroundCount=' + gBoard[cellCoord.i][cellCoord.j].minesAroundCount);
    if (cell.isMine) {
        showAllMines();
        setTimeout(gameOver, 500);
    } else {
        gGame.shownCount++;
    }

    // if (cell.isMine && 
    //     cell.isFlagged) {
    //     if (!cell.isMine &&
    //         cell.isShown) {
    //         alert('you WIN!')
    //         stopWatch();
    //     }
    // }
    renderBoard();
    // console.log('gGame.shownCount=' + gGame.shownCount);
}

function gameOver() {
    gGame.isOn = false;
    stopWatch();
    var elBtn = document.querySelector('button');
    elBtn.innerText = LOSE;
}

// function win(elTd) {
//     var cellCoord = getCellCoord(elTd.id);
//     var cell = gBoard[cellCoord.i][cellCoord.j];
//     if (gGame.isON && 
//         cell.isShown && !cell.isMine) {
//         if (cell.isFlagged && cell.isMine) {
//             alert('you WIN!')
//             stopWatch();
//         }
//     }
// }

function cellFlaged(elTd) { // right click will not start the game
    var cellCoord = getCellCoord(elTd.id);
    var cell = gBoard[cellCoord.i][cellCoord.j];

    cell.isFlagged = !cell.isFlagged;
    if (cell.isFlagged) {
        gGame.flagsCount++;
    } else {
        gGame.flagsCount--;
    }
    renderBoard();
}

function showAllMines() {
    for (var i = 0; i < rowNum; i++) {
        for (var j = 0; j < colNum; j++) {
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

function minesAroundCount(board, rowIdx, colIdx) {   ///rowIdx, colIdx
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

function createMines(board) {
    board[0][0].isMine = true;
    board[1][1].isMine = true;

    for (var i = 0; i < rowNum; i++) {
        for (var j = 0; j < colNum; j++) {
            board[i][j].minesAroundCount = minesAroundCount(board, i, j);
            // console.log('i=' + i + ' j=' + j + ' board[i][j].minesAroundCount= ' + board[i][j].minesAroundCount);
        }
    }
}

function createBoard(rowNum, colNum) {
    var board = [];
    rowNum = 4;
    colNum = 4;

    for (var i = 0; i < rowNum; i++) {
        var row = [];
        for (var j = 0; j < colNum; j++) {
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
    createMines(board);
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
    elFlagsCount.innerText = FLAG + ' ' + gGame.flagsCount;
}

