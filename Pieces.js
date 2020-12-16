
/* Create pieces on the board 
    each black square receives a div representing a piece location */



function createPieces(boardSize) {
    let numPieces = numberOfPieces(boardSize);

    for (let squareId = 0 ; squareId < (boardSize*boardSize)/2 ; squareId++) {
         if (squareId<numPieces) {
             createDivPiece(squareId,'red','round','normal');               
        }
        else if (squareId > (numPieces-1) + (boardSize/2)*2) {                
            createDivPiece(squareId,'blue','round','normal');
        }
        else {
            createDivPiece(squareId,'empty','round');
        }   
    }   
    document.getElementById('setPieces').disabled = true;   
}

function createDivPiece(squareId,class1,class2,class3) {
    let newDiv = document.createElement('div');
    
	newDiv.classList.add(class1,class2,class3);
    newDiv.id = squareId;
    document.getElementById('square'+squareId).appendChild(newDiv);
}


function numberOfPieces(boardSize) {
    switch (boardSize%2) {
        case 0:
            return (boardSize/2)*(boardSize/2-1);
  
        default:
            return (boardSize + boardSize/2);
    }
    
}