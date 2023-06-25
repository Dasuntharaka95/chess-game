const gameBoard = $(' <div id="gameBoard"></div>');
const playerDispaly = $("#player");
const infoDisplay = $("#info-display");
const startDiv=$('.start-div');
const lastpageInfo=$('#winner ');
const btnGameStartAgain=$('#try-again');
const gameBody=$('#gameBody');
const gameOver=$('#gameOver');

const width = 8;
let playerGo = 'black';
playerDispaly.text('black');
let winner="";
let black_score =0;
let white_score=0;

const startPieces = [rook, knight, bishop, queen, king, bishop, knight, rook, pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, rook, knight, bishop, queen, king, bishop, knight, rook,];
gameOver.addClass("hide");
function creatBoard() {
    startPieces.forEach((startPieces, i) => {
        const square = $('<div class="square"></div>');
        square.html(startPieces)
        square.attr("square-id", i);
        square.find("div")?.attr('draggable', true);
        square.addClass('beige');
        const row = Math.floor(i / 8) + 1;
        if (row % 2 !== 0) {
            square.addClass(i % 2 === 0 ? "beige" : "brown");
        } else {
            square.addClass(i % 2 === 0 ? "brown" : "beige");
        }
        if (i <= 15) {
            square.find("div svg").addClass("black");
        }
        if (i >= 48) {
            square.find("div svg").addClass("white");
        }

        gameBoard.append(square);

    });

    gameBody.prepend(gameBoard)

}

creatBoard();

const allSquare = $(".square");

Array.from(allSquare).forEach(square => {
    $(square).on('dragstart', dragStart);
    $(square).on('dragover', dragOver);
    $(square).on('drop', dragDrop);
    $(square).on('click', clickView);

    });

let startPositionId;
let darggedElemnt;
let startPositionSquare;

function clickView(e){
    if(!(e.target.children[0]?.className.animVal===playerGo))return;
    const pieceName=$(e.target).attr("id");
    const startPosition=Number($(e.target.parentNode).attr("square-id"));
    const validMoves=[];
    for (let i = 0; i < 64; i++) {

        if(checkIfValid(startPosition,i,pieceName)){
            const taken = document.querySelector(`[square-id="${i}"]`).firstElementChild?.classList.contains("pieces")
            const opponentGo = playerGo === 'white' ? 'black' : 'white';
            const takenByOpponent = document.querySelector(`[square-id ="${i}"]`).firstElementChild?.firstElementChild.classList.contains(opponentGo);

            console.log(taken,takenByOpponent)
            if(!taken||(taken && takenByOpponent)){
                validMoves.push(i);
            }

                    }
    }

    if(validMoves.length){
        validMoves.forEach(e=>{
            document.querySelector(`[square-id="${e}"]`).classList.add("targetPath");
            setTimeout(()=>{document.querySelector(`[square-id="${e}"]`).classList.remove("targetPath");},2000);

        })
    }
}

function dragStart(e) {
    clickView(e);
    startPositionId = e.target.parentNode.getAttribute('square-id');
    startPositionSquare=e.target.parentNode;
    darggedElemnt = e.target;
    if(darggedElemnt.children[0].className.animVal===playerGo)  startPositionSquare.classList.add('startPosition');
}



function dragOver(e) {
    e.preventDefault();
}

function checkIfValid(startID,targetID,element) {
    startPositionSquare?.classList.remove("startPosition");

    const targetId = targetID;
    const startId = startID;
    const piece = element;

    switch (piece) {
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
            if (starterRow.includes(startId) && startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width *2}"]`).firstChild  ||
                startId + width === targetId && !document.querySelector(`[square-id="${startId + width }"]`).firstChild  ||
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild) {
                return true;
            }
            break;
        case 'rook':
            const startColumn = startId % width;
            const startRow = Math.floor(startId / width);
            const targetColumn = targetId % width;
            const targetRow = Math.floor(targetId / width);

            if (startColumn === targetColumn || startRow === targetRow) {
                const minColumn = Math.min(startColumn, targetColumn);
                const maxColumn = Math.max(startColumn, targetColumn);
                const minRow = Math.min(startRow, targetRow);
                const maxRow = Math.max(startRow, targetRow);

                if (startColumn === targetColumn) {
                    for (let row = minRow + 1; row < maxRow; row++) {
                        const intermediateId = row * width + startColumn;
                        if (document.querySelector(`[square-id="${intermediateId}"]`).firstChild) {
                            return false;
                        }
                    }
                } else {
                    for (let col = minColumn + 1; col < maxColumn; col++) {
                        const intermediateId = startRow * width + col;
                        if (document.querySelector(`[square-id="${intermediateId}"]`).firstChild) {
                            return false;
                        }
                    }
                }

                return true;
            }

            break;

        case 'knight':
            const row1=[1,9,17,25,33,41,49,57,0,8,16,24,32,40,48,56];
            const row2=[0,8,16,24,32,40,48,56];
            const row3=[7,15,23,31,39,47,55,63,6,14,22,30,38,46,54,62];
            const row4=[7,15,23,31,39,47,55,63];
            if ((startId + width * 2 + 1 === targetId && !(row4.includes(startId))) ||
                (startId + width * 2 - 1 === targetId && !(row2.includes(startId))) ||
                (startId + width - 2 === targetId && !(row1.includes(startId)))||
                (startId + width + 2 === targetId && !(row3.includes(startId)))||
                (startId - width * 2 + 1 === targetId && !(row4.includes(startId)))||
                (startId - width * 2 - 1 === targetId && !(row2.includes(startId)))||
                (startId - width - 2 === targetId && !(row1.includes(startId)))||
                (startId - width + 2 === targetId && !(row3.includes(startId)))) {
                return true;
            }
            break;
        case 'bishop':
            const startColumnBishop = startId % width;
            const targetColumnBishop = targetId % width;
            if (startColumnBishop<targetColumnBishop && startId + width + 1 === targetId ||
                startColumnBishop<targetColumnBishop &&startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||

                startColumnBishop > targetColumnBishop && startId - width - 1 === targetId ||
                startColumnBishop > targetColumnBishop && startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                startColumnBishop > targetColumnBishop && startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                startColumnBishop > targetColumnBishop && startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                startColumnBishop > targetColumnBishop && startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                startColumnBishop > targetColumnBishop && startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                startColumnBishop > targetColumnBishop && startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||

                startColumnBishop<targetColumnBishop &&startId - width + 1 === targetId ||
                startColumnBishop<targetColumnBishop &&startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                startColumnBishop<targetColumnBishop &&startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild ||

                startColumnBishop > targetColumnBishop &&startId + width - 1 === targetId ||
                startColumnBishop > targetColumnBishop &&startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startColumnBishop > targetColumnBishop &&startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                startColumnBishop > targetColumnBishop &&startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                startColumnBishop > targetColumnBishop &&startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                startColumnBishop > targetColumnBishop &&startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                startColumnBishop > targetColumnBishop &&startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild

            ) {
                return true;
            }
            break;
        case 'queen':

            const startColumnQueen = startId % width;
            const startRowQueen = Math.floor(startId / width);
            const targetColumnQueen = targetId % width;
            const targetRowQueen = Math.floor(targetId / width);
            if (
                startColumnQueen<targetColumnQueen && startId + width + 1 === targetId ||
                startColumnQueen<targetColumnQueen &&startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||

                startColumnQueen > targetColumnQueen && startId - width - 1 === targetId ||
                startColumnQueen > targetColumnQueen && startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                startColumnQueen > targetColumnQueen && startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                startColumnQueen > targetColumnQueen && startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                startColumnQueen > targetColumnQueen && startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                startColumnQueen > targetColumnQueen && startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                startColumnQueen > targetColumnQueen && startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||

                startColumnQueen<targetColumnQueen &&startId - width + 1 === targetId ||
                startColumnQueen<targetColumnQueen &&startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                startColumnQueen<targetColumnQueen &&startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild ||

                startColumnQueen > targetColumnQueen &&startId + width - 1 === targetId ||
                startColumnQueen > targetColumnQueen &&startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startColumnQueen > targetColumnQueen &&startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                startColumnQueen > targetColumnQueen &&startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                startColumnQueen > targetColumnQueen &&startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                startColumnQueen > targetColumnQueen &&startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                startColumnQueen > targetColumnQueen &&startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild

            ) {
                return true;
            } else if(startColumnQueen === targetColumnQueen || startRowQueen === targetRowQueen){
                const minColumn = Math.min(startColumnQueen, targetColumnQueen);
                const maxColumn = Math.max(startColumnQueen, targetColumnQueen);
                const minRow = Math.min(startRowQueen, targetRowQueen);
                const maxRow = Math.max(startRowQueen, targetRowQueen);

                if (startColumnQueen === targetColumnQueen) {
                    for (let row = minRow + 1; row < maxRow; row++) {
                        const intermediateId = row * width + startColumnQueen;
                        if (document.querySelector(`[square-id="${intermediateId}"]`).firstChild) {
                            return false;
                        }
                    }
                } else {
                    for (let col = minColumn + 1; col < maxColumn; col++) {
                        const intermediateId = startRowQueen * width + col;
                        if (document.querySelector(`[square-id="${intermediateId}"]`).firstChild) {
                            return false;
                        }
                    }
                }

                return true;
            }

            break;
        case 'king':
            if (startId + width - 1 === targetId || startId - width + 1 === targetId || startId - width - 1 === targetId || startId + width + 1 === targetId || startId - 1 === targetId || startId + 1 === targetId || startId - width === targetId || startId + width === targetId

            ) {
                return true;
            }
            break;
    }


}

function dragDrop(e) {
    e.preventDefault();
    Array.from(document.querySelectorAll(".square")).forEach(square=>{
        square.classList.remove("targetPath")
    })
    const correctGo = darggedElemnt.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('pieces');
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
    const targetId=Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id'));
    const startId=Number(startPositionId);
    const piece=darggedElemnt.id;
    const valid = checkIfValid(startId,targetId,piece);
    if (correctGo) {
        if (takenByOpponent && valid) {
            addScore($(e.target).attr("id"));
            $('#black_score').text(black_score);
            $('#white_score').text(white_score);
            e.target.parentNode.append(darggedElemnt);
            e.target.remove();
            changePlayer();
            checkWin()
            return;
        }
        if (taken && !takenByOpponent) {
            infoDisplay.text("you cannot go here");
            setTimeout(() => infoDisplay.text(""), 2000);
            return;
        }
        if (valid) {
            e.currentTarget.append(darggedElemnt);
            changePlayer();
            checkWin()


        }
    }

}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIds()
        playerGo = "white";
        playerDispaly.text(playerGo);
    } else {
        revertIds()
        playerGo = "black";
        playerDispaly.text(playerGo);
    }
}


function reverseIds() {
    Array.from(allSquare).forEach((square, i) => {
        square.setAttribute('square-id', (width * width - 1) - i);
    });
}

function revertIds() {
    Array.from(allSquare).forEach((square, i) => {
        square.setAttribute('square-id', i);
    });
}

function getPieceValue(piece) {
    if (piece === null) {
        return 0;
    }
    if (piece === 'pawn') {
        return 10;
    } else if (piece === 'rook') {
        return 50;
    } else if (piece === 'knight') {
        return 30;
    } else if (piece=== 'bishop') {
        return 30;

    } else if (piece === 'queen') {
        return 90;

    } else if (piece === 'king') {
        return 900;

    }
}
function addScore(piece){
    if(playerGo==="black"){
        black_score=black_score+getPieceValue(piece);
    }else if(playerGo==="white"){
        white_score=white_score+getPieceValue(piece);
    }
}

function checkWin() {
    const kings = Array.from(document.querySelectorAll('#king'));
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.html("BLACK PLAYER WING");
        const allSquare = document.querySelectorAll('.square');
        playerDispaly.text("Game Over");
        winner='BLACK';
        playerDispaly.parent().css("visibility", "hidden");
        allSquare.forEach(sq => {
            sq.firstChild?.setAttribute('draggable', false)
        });
        lastPage()
        return true;
    }else if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.html("WHITE PLAYER WING");
        winner='WHITE';
        playerDispaly.parent().addClass("hide");
        playerDispaly.text("Game Over");
        const allSquare = document.querySelectorAll('.square');
        allSquare.forEach(sq => {
            sq.firstChild?.setAttribute('draggable', false)
        });
        lastPage()
        return true;
    }else {
        return false;
    }
}
btnGameStartAgain.on("click",()=>{

});
function lastPage(){
    setTimeout(()=>{
        gameBody.addClass("hide");
        gameOver.removeClass("hide");
    },500)
    $('#last-page').addClass("animate__pulse animate__infinite\tinfinite")
    if(winner==="BLACK"){
        lastpageInfo.text("BLACK PLAYER");
    }else {
        lastpageInfo.text("WHITE WHITE");
    }
}


