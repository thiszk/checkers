/* Game square Matrix 
    each element represents a playable square 
    
                        |
                        |
                        |
                   (0,0)|  id : 0
    ---------------------  */
 var gameSquare = []; 
 var player;
 var selectedPiece = [];
 
function start(player, boardSize) {
    createMatrix(boardSize);
    checkGameOver(player, gameSquare, boardSize);
    document.getElementById('start').disabled = true;  
}

function createMatrix(boardSize){
    for (let index = 0 ; index < boardSize ; index++) {
       gameSquare[index] = [];
    }
    setValues(boardSize, gameSquare);
}

function setValues(boardSize, gameSquare) {  
    let centerRow = [];

    centerRow[0] = (boardSize/2)-1;
    centerRow[1] = boardSize/2;

    for (let row = 0 ; row < boardSize ; row++) {
        if (row < centerRow[0]) {
            for (let column = 0; column < boardSize/2 ; column++) {
                changeValue(1,row, column, gameSquare); 
            }   
        }
        else if (row > centerRow[1]) {
            for (let column = 0; column < boardSize/2 ; column++) {
                changeValue(-1,row, column, gameSquare);          
            }               
        }
        else{
            for (let column = 0; column < boardSize/2 ; column++) {
                changeValue(0,row, column, gameSquare);        
            }               
        }   
    }  
}

function changeValue(newValue, row, column, gameSquare) {
    gameSquare[row][column] = newValue;
}
/* Finds the matrix element associated with the pieceId */

function getMatrixElementValue(id, boardSize, gameSquare) {
    let row = getMatrixParameter(id, boardSize,'row');
    let column = getMatrixParameter(id, boardSize,'column')

    return gameSquare[row][column];
}

function getMatrixParameter(id, boardSize, parameter) {
    switch (parameter) {
        case 'row':
            return Math.floor(id/(boardSize/2));
        
        default:
            return id % (boardSize/2);            
    }
}

/* Functions for the gameplay */ 
function changePlayer(newPlayer) {
    switch (newPlayer) {
        case 'red':
            newPlayer = 'blue';
            break;
    
        default:
            newPlayer = 'red';
            break;
    }
    return newPlayer;
}

function checkGameOver(player, gameSquare, boardSize) {

    let piecesLeft = piecesAvailable(player);
    let movPossible = movementAvailable(player, gameSquare, boardSize);
    let notOver = (piecesLeft && movPossible);
    console.log('checkGameO');
    switch (notOver) {
        case false:
            gameOver(player);
            console.log('FIM AAA');
            break;
    
        default:
            nextMove(player, gameSquare, boardSize, 'checkForce');
            console.log('nextMove');
            break;
    }
}

function nextMove(player, gameSquare, boardSize, moveType) {
    let numberOfPlayableSquares = document.getElementsByClassName('gray').length;
    let selectedId;

    switch (moveType) {
        case 'checkForce':
            let isForce = false;
            console.log('checkForce');
            console.log(player+'AQUI');
            for (let id = 0; id < numberOfPlayableSquares ; id++) {
                let pieceType = getPieceType(id);
                let pieceColor = getPieceColor(id);
                 if (pieceColor == player ){
                    canAtack = checkIfAtack(id, player, pieceType, gameSquare, boardSize);
                    if (canAtack == true) {
                        id = numberOfPlayableSquares;
                        isForce = true;
                        nextMove(player, gameSquare, boardSize,'forceMove');    
                    }
                }  
            }
            if (isForce == false) {
                nextMove(player,gameSquare, boardSize, 'normalMove');
            }
            break;
    
        case 'forceMove':
            console.log('forceMove');
            for (let id = 0; id < numberOfPlayableSquares ; id++) {
                let pieceType = getPieceType(id);
                let pieceColor = getPieceColor(id);
                
                if (pieceColor == player ){
                    canAtack = checkIfAtack(id, player, pieceType, gameSquare, boardSize);
                    if (canAtack == true) {                       
                    activatePiece(id, pieceColor, 'atack','allowMovement', gameSquare, selectedId);      
                    }
                }  
            }
            break;
        default: // normalMove
        console.log('normalMove');
            for (let id = 0; id < numberOfPlayableSquares ; id++) {
                let pieceType = getPieceType(id);
                let pieceColor = getPieceColor(id);
                console.log(pieceColor);
                if (pieceColor == player ){
                canMove = checkIfMovable(id, pieceColor, pieceType, gameSquare, boardSize);
                    if (canMove) {
                        activatePiece(id, pieceColor, 'move','allowMovement', gameSquare, selectedId);
                    }
                
                }  
            }
        break;
    }
}

function gameOver(player) {
    
    changePlayer(player);
    
            

    
}


function piecesAvailable(player) {
    
    let numberOfPieces = document.getElementsByClassName(player).length;

    if (numberOfPieces > 0){
        return true;
    }
    return false;
}



/* Checks possible movements player, gameSquare, boardSize*/

function checkIfMovable(id, player, type, gameSquare, boardSize) {
    let pieceRow = getMatrixParameter(id,boardSize,'row');
    let pieceColumn = getMatrixParameter(id,boardSize,'column');
    let movableRow, upperRow, lowerRow, movable;
    let [movableRColumn, movableLColumn] = moveColumnSelector(pieceRow, pieceColumn);

    switch (type) {
        case 'special':
                switch (pieceRow) {
                    case 0:
                        lowerRow = false;
                        upperRow = checkIfRLEmpty(gameSquare, pieceRow + 1, movableRColumn, movableLColumn);
                        break;
                    
                    case boardSize - 1:
                        lowerRow = checkIfRLEmpty(gameSquare, pieceRow - 1, movableRColumn, movableLColumn);
                        upperRow = false;
                        break;
                    default:
                        lowerRow = checkIfRLEmpty(gameSquare, pieceRow - 1, movableRColumn, movableLColumn);
                        upperRow = checkIfRLEmpty(gameSquare, pieceRow + 1, movableRColumn, movableLColumn); 
                        break;
                }
                movable = (upperRow || lowerRow);
        break;
        
        default:
            switch (player) {
                case 'red':
                    movableRow = pieceRow + 1;
                    break;
            
                default:
                    movableRow = pieceRow - 1;
                    break;
            }
            movable = checkIfRLEmpty(gameSquare, movableRow, movableRColumn, movableLColumn);
        break;
    }
    return movable;
}

function moveColumnSelector(pieceRow, pieceColumn, boardSize) {
    let parity = pieceRow % 2;
    let leftColumn, rightColumn;

    switch (parity) {
        case 1:
            rightColumn = pieceColumn;
            if (pieceColumn == boardSize/2 - 1) {
                leftColumn = pieceColumn;
            }
            else{
                leftColumn = pieceColumn + 1;
            }
            break;

        default:
            leftColumn = pieceColumn;
            if (pieceColumn==0) {
                rightColumn = pieceColumn;
            }
            else{
                rightColumn = pieceColumn - 1;
            }         
            break;
    } 
    return [rightColumn, leftColumn];
}

function checkIfRLEmpty(gameSquare, movableRow, movableRColumn, movableLColumn) {
    let empty;
    if ((gameSquare[movableRow][movableRColumn] == 0) || (gameSquare[movableRow][movableLColumn]) == 0) {
        empty = true;
    }
    else{
        empty = false;
    }
    return empty;
}

function checkIfEmpty(gameSquare, movableRow, movableColumn) {
    let empty;
    
    if (gameSquare[movableRow][movableColumn] == 0) {
        empty = true;
    }
    else{
        empty = false;
    }
    return empty;
}


/* Checks possible atacks */


function checkIfAtack(id, player, type, gameSquare, boardSize) {
    let pieceRow = getMatrixParameter(id,boardSize,'row');
    let pieceColumn = getMatrixParameter(id,boardSize,'column');
    let canAtackUp, canAtackDown, canAtack;
    let [moveRColumn, moveLColumn, atackRColumn, atackLColumn] = atackColumnSelector(pieceRow, pieceColumn, boardSize);

    switch (type) {
        case 'special':
            switch (pieceRow) {
                case 0:
                case 1:
                    canAtack = checkAllPositions(gameSquare, pieceRow + 1, atackRColumn, atackLColumn, pieceRow + 2, moveRColumn, moveLColumn ,player);
                    break;
           
                case boardSize - 1:
                case boardSize - 2:
                    canAtack = checkAllPositions(gameSquare, pieceRow - 1, atackRColumn, atackLColumn, pieceRow - 2, moveRColumn, moveLColumn ,player);
                    break;
                default:
                    canAtackUp = checkAllPositions(gameSquare, pieceRow + 1, atackRColumn, atackLColumn, pieceRow + 2, moveRColumn, moveLColumn ,player);
                    canAtackDown = checkAllPositions(gameSquare, pieceRow - 1, atackRColumn, atackLColumn, pieceRow - 2, moveRColumn, moveLColumn ,player);
                    canAtack = (canAtackUp || canAtackDown);
                    break;
            }
            break;
     
        default:
            switch (player) {
                case 'red':
                    switch (pieceRow) {
                        case boardSize-2:
                            canAtack = false;
                            break;
                    
                        default:
                            canAtack = checkAllPositions(gameSquare, pieceRow + 1, atackRColumn, atackLColumn, pieceRow + 2, moveRColumn, moveLColumn ,player);
                            break;
                    }
                    break;
            
                default:
                    switch (pieceRow) {
                        case 1:
                            canAtack = false;
                            break;
                    
                        default:
                            canAtack = checkAllPositions(gameSquare, pieceRow - 1, atackRColumn, atackLColumn, pieceRow - 2, moveRColumn, moveLColumn ,player);
                            break;
                    }
                    break;
            }
            break;
    }
    return canAtack;
}

function atackColumnSelector(pieceRow, pieceColumn,boardSize) {
    let moveLeftColumn, moveRightColumn;
    let atackLeftColumn, atackRightColumn;
    let parity = pieceRow % 2;

    switch (pieceColumn) {
        case 0:
            moveRightColumn = moveLeftColumn = pieceColumn + 1;
            if (parity == 1) {
                atackRightColumn = atackLeftColumn = pieceColumn + 1;
            }
            else {
                atackRightColumn = atackLeftColumn = pieceColumn;
            }
            break;

        case (boardSize/2-1):
            moveRightColumn = moveLeftColumn = pieceColumn - 1;
            if (parity == 1) {
                atackRightColumn = atackLeftColumn = pieceColumn;
            }
            else {
                atackRightColumn = atackLeftColumn = pieceColumn - 1;
            }
            break;

        default:
            moveRightColumn = pieceColumn - 1;
            moveLeftColumn = pieceColumn + 1;

            if (parity == 1) {
                atackRightColumn = pieceColumn;
                atackLeftColumn = pieceColumn + 1;
            }
            else {
                atackRightColumn = pieceColumn - 1;
                atackLeftColumn = pieceColumn;
            }
            
            break;
    } 
    return [moveRightColumn, moveLeftColumn, atackRightColumn, atackLeftColumn];
}

function checkIfEnemy(gameSquare, atackRow, atackColumn, player) {
    let enemy;
    let squareValue;

    switch (player) {
        case 'red':
            squareValue = -1;
            break;
    
        default:
            squareValue = 1;
            break;
    }
    if (gameSquare[atackRow][atackColumn] == squareValue) {
        enemy = true;
    }
    else{
        enemy = false;
    }
    return enemy;
}

function checkAllPositions(gameSquare, atackRow, atackRColumn, atackLColumn, moveRow, moveRColumn, moveLColumn, player) {
    let canAtack;
    atackRight = checkIfEnemy(gameSquare, atackRow, atackRColumn, player);
    moveRight = checkIfEmpty(gameSquare, moveRow, moveRColumn);
    atackLeft = checkIfEnemy(gameSquare, atackRow, atackLColumn, player);
    moveLeft = checkIfEmpty(gameSquare, moveRow, moveLColumn);
    canAtack = (atackRight && moveRight) || (atackLeft && moveLeft);
    
    return canAtack;
}

function checkUniAtack(gameSquare, atackRow, atackColumn, moveRow, moveColumn, player) {
    let canUniAtack,
    atack = checkIfEnemy(gameSquare, atackRow, atackColumn, player),
    move = checkIfEmpty(gameSquare, moveRow, moveColumn);
    canUniAtack = (atack && move);
    
    return canUniAtack;
}

/* action functions */

function activatePiece(id, player, activationType, action, gameSquare, selectedId) {
    selectedPiece[id] = document.getElementById(id);
    let type = getPieceType(id);

    switch (action) {
        case 'allowMovement':
            console.log('allowMovement');
            selectedPiece[id].classList.add('movementAllowed');
            if (activationType == 'atack') {
                selectedPiece[id].addEventListener('click', function(){displayPossibleAtacks(id, player, type, gameSquare, boardSize)}, {once : true});;
            }
            else { //'move 
                selectedPiece[id].addEventListener('click', function(){displayPossibleMovements(id, player, type, gameSquare, boardSize)}, {once : true});
               
            } 
            break;
    
        case 'displayMovement':
            console.log('displayMOVE');
            selectedPiece[id].classList.add('possibleMovement');
            selectedPiece[id].addEventListener('click', function(){activatePiece(id, player, activationType, 'endMovement', gameSquare, selectedId)}, {once : true});
            break;

        case 'endMovement':
            endMovement(id, player, selectedId, gameSquare, boardSize);
            
            clearMovementClasses('selectedPiece');
            clearMovementClasses('possibleMovement');
            clearMovementClasses('movementAllowed');  
            
            
            if (activationType == 'atack') {
                let chain = checkIfAtack(id, player, type, gameSquare, boardSize);
                if (chain) {
                    activatePiece(id, player, 'atack', 'allowMovement', gameSquare, selectedId)
                }
            }
            else{
                checkPromotion(id, player, type, boardSize);
                let newPlayer = changePlayer(player);
                checkGameOver(newPlayer, gameSquare, boardSize);
            }
        default:
            break;
    } 
}

function clearMovementClasses(className) {
    let element = document.getElementsByClassName(className);
   
    while(element.length > 0){
        element[0].classList.remove(className);
    }
}

/* atack functions*/

function displayPossibleAtacks(id, player, type, gameSquare, boardSize) {
    let pieceRow = getMatrixParameter(id,boardSize,'row');
    let pieceColumn = getMatrixParameter(id,boardSize,'column');
    let selectedId = id;
    let [moveRColumn, moveLColumn, atackRColumn, atackLColumn] = atackColumnSelector(pieceRow, pieceColumn, boardSize);
    let [atackUpRow, moveUpRow, atackDownRow, moveDownRow] = atackRowSelector(id, player, type, boardSize);

    let checkRightUp = checkUniAtack(gameSquare, atackUpRow, atackRColumn, moveUpRow, moveRColumn, player);
    let checkLeftUp = checkUniAtack(gameSquare, atackUpRow, atackLColumn, moveUpRow, moveLColumn, player);
    let checkRightDown = checkUniAtack(gameSquare, atackDownRow, atackRColumn, moveDownRow, moveRColumn, player);   
    let checkLeftDown = checkUniAtack(gameSquare, atackDownRow, atackLColumn, moveDownRow, moveLColumn, player);
    
    if (moveUpRow == moveDownRow) {           
        checkLeftDown = checkRightDown = false;
    }

    if (moveRColumn == moveLColumn) {
        checkLeftDown = checkLeftUp = false;
    }

    if (checkRightUp) { 
        let uRid = getIdByParam(moveUpRow, moveRColumn, boardSize); 
        activatePiece(uRid, player, 'atack', 'displayMovement', gameSquare, selectedId); 
    }
    if (checkLeftUp) { 
        let uLid = getIdByParam(moveUpRow, moveRColumn, boardSize);
        activatePiece(uLid, player, 'atack','displayMovement', gameSquare, selectedId); 
    }
    if (checkRightDown) { 
        let dRid = getIdByParam(moveUpRow, moveRColumn, boardSize);
        activatePiece(dRid, player, 'atack','displayMovement', gameSquare, selectedId); 
    }
    if (checkLeftDown) { 
        let dLid = getIdByParam(moveUpRow, moveRColumn, boardSize);
        activatePiece(dLid, player, 'atack', 'displayMovement', gameSquare, selectedId); 
    }
}   

function getIdByParam(row, column, boardSize) {
    let id = (row*boardSize/2)+column;
    return id;
}

function getPieceType(id) {
    let isSpecial = document.getElementById(id).classList;

    if (isSpecial.contains('special')){
        return 'special';
    }
    return 'normal';
}

function getPieceColor(id) {
    let color = document.getElementById(id).classList;

    if (color.contains('red')) {
        return 'red';
    }
    else if (color.contains('blue')) {
        return 'blue';
    }
    return 'empty';
}

function atackRowSelector(id, player, type, boardSize) {
    let pieceRow = getMatrixParameter(id,boardSize,'row');
    let atackUpRow, moveUpRow;
    let atackDownRow, moveDownRow;
    switch (type) {
        case 'special':
            switch (pieceRow) {
                case 0:
                case 1:
                    atackUpRow = atackDownRow = pieceRow + 1; 
                    moveUpRow = moveDownRow = pieceRow + 2;
                    break;
           
                case boardSize - 1:
                case boardSize - 2:
                    atackUpRow = atackDownRow = pieceRow - 1; 
                    moveUpRow = moveDownRow = pieceRow - 2;
                    break;
                default:
                    atackDownRow =  pieceRow - 1; 
                    moveDownRow =  pieceRow - 2;
                    atackUpRow =  pieceRow + 1; 
                    moveUpRow =  pieceRow + 2;
                    break;
            }
            break;
     
        default:
            switch (player) {
                case 'red':
                    atackUpRow = atackDownRow = pieceRow + 1; 
                    moveUpRow = moveDownRow = pieceRow + 2;
                    break;
            
                default:
                    atackUpRow = atackDownRow = pieceRow - 1; 
                    moveUpRow = moveDownRow = pieceRow - 2;
            }
            break;
    }
    return [ atackUpRow, moveUpRow, atackDownRow, moveDownRow ];
}

/* movement functions */

function displayPossibleMovements(id, player, type, gameSquare, boardSize) {
    let pieceRow = getMatrixParameter(id,boardSize,'row');
    let pieceColumn = getMatrixParameter(id,boardSize,'column');
    let selectedId = id;
    let [movableRColumn, movableLColumn] = moveColumnSelector(pieceRow, pieceColumn);
    let [moveUpRow, moveDownRow] = moveRowSelector(id, player, type, boardSize);   

    let checkRightUp = checkIfEmpty(gameSquare, moveUpRow, movableRColumn);
    let checkLeftUp = checkIfEmpty(gameSquare, moveUpRow, movableLColumn);
    let checkRightDown = checkIfEmpty(gameSquare, moveDownRow, movableRColumn);   
    let checkLeftDown = checkIfEmpty(gameSquare, moveDownRow, movableLColumn);

    let selectedPiece = document.getElementById(id);
        selectedPiece.classList.add('selectedPiece');

    if (moveUpRow == moveDownRow) {           
        checkLeftDown = checkRightDown = false;
    }

    if (movableRColumn == movableLColumn) {
        checkLeftDown = checkLeftUp = false;
    }

    if (checkRightUp) { 
        let uRid = getIdByParam(moveUpRow, movableRColumn, boardSize); 
        activatePiece(uRid, player, 'move','displayMovement', gameSquare, selectedId); 
    }
    if (checkLeftUp) { 
        let uLid = getIdByParam(moveUpRow, movableLColumn, boardSize);
        activatePiece(uLid, player,'move','displayMovement', gameSquare, selectedId); 
    }
    if (checkRightDown) { 
        let dRid = getIdByParam(moveDownRow, movableRColumn, boardSize);
        activatePiece(dRid, player, 'move','displayMovement', gameSquare, selectedId); 
    }
    if (checkLeftDown) { 
        let dLid = getIdByParam(moveDownRow, movableLColumn, boardSize);
        activatePiece(dLid, player, 'move','displayMovement', gameSquare, selectedId); 
    }
}  
    

function moveRowSelector(id, player, type, boardSize) {
    let pieceRow = getMatrixParameter(id,boardSize,'row');
    let moveUpRow;
    let moveDownRow;
    switch (type) {
        case 'special':
            switch (pieceRow) {
                case 0:
                    moveUpRow = moveDownRow = pieceRow + 1;
                    break;
           
                case boardSize - 1:
                    moveUpRow = moveDownRow = pieceRow - 1;
                    break;
                default:
                    moveDownRow =  pieceRow - 1;
                    moveUpRow =  pieceRow + 1;
                    break;
            }
            break;
     
        default:
            switch (player) {
                case 'red':
                    moveUpRow = moveDownRow = pieceRow + 1;
                    break;
            
                default:
                    moveUpRow = moveDownRow = pieceRow - 1;
            }
            break;
    }
    return [ moveUpRow, moveDownRow ];
}

function endMovement(id, player, selectedId, gameSquare, boardSize) {
    let selectedPiece = document.getElementById(id);
    let previousId = document.getElementById(selectedId);
    let type = previousId.classList.contains('special');

  switch (player) {
      case 'red':
        selectedPiece.classList.remove('empty');
        selectedPiece.classList.add('red');
        
        previousId.classList.remove('red');
        previousId.classList.add('empty');

        selectedPiece.classList.add('normal');
        previousId.classList.remove('normal');
        break;
  
      default:
        selectedPiece.classList.remove('empty');
        selectedPiece.classList.add('blue');

        previousId.classList.remove('blue');
        previousId.classList.add('empty');

        selectedPiece.classList.add('normal');
        previousId.classList.remove('normal');
        break;
  }
  if (type == 'special') {
    selectedPiece.classList.remove('normal');
    selectedPiece.classList.add('special');
    previousId.classList.remove('special');
    previousId.classList.add('normal');
    console.log('endMovement');
  }
    updateMatrixElements(id, boardSize);
    updateMatrixElements(selectedId, boardSize);
}


function checkPromotion(id, type, boardSize) {
    let element = document.getElementById(id);
    let row = getMatrixParameter(id, boardSize, 'row');

    if ( ( (row == 0 || boardSize - 1) && (type == 'normal') ) ){
        element.classList.add('special');
        element.classList.remove('normal');
    }
}

function movementAvailable(player, gameSquare, boardSize) {
    let numberOfPlayableSquares = document.getElementsByClassName('gray').length;
    let pieceType, pieceColor;
    let canAtack, canMove, movAvailable;
        
    for (let id = 0; id < numberOfPlayableSquares; id++) {
        pieceColor = getPieceColor(id);
        pieceType = getPieceType(id)
        if (player == pieceColor) {
            canAtack = checkIfAtack(id, player, pieceType, gameSquare, boardSize);
            canMove = checkIfMovable(id , player, pieceType, gameSquare, boardSize);
            movAvailable = (canAtack || canMove);

            if (movAvailable) {
                id = numberOfPlayableSquares;
            }
        }
    }
    return movAvailable;
}

function updateMatrixElements(id, boardSize) {
    let row = getMatrixParameter(id, boardSize, 'row');
    let column = getMatrixParameter(id, boardSize, 'column');
    let type = getPieceColor(id);
    
    switch (type) {
        case 'red':
            gameSquare[row][column] = 1;
            break;
        case 'blue':
            gameSquare[row][column] = -1;
        default:
            gameSquare[row][column] = 0;
            break;
    }

    console.log('newM'+gameSquare[row][column]);
}
