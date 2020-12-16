
/* Board and border construction */

var boardSize;

function createBoard(boardSize){
	let borderSelector = document.getElementById('board');
	let squareId = (boardSize*boardSize)/2 - 1;

	borderSelector.classList.add('border');
	createBorder(boardSize);

	for (let index = boardSize; index > 0; index--) {
		createRow(index, boardSize, squareId);
		squareId -= boardSize/2; 
	}
}

function createBorder(boardSize) {
	let border = document.getElementById('board');
	let size = boardSize*50;

	border.style.width = (size+"px");
	border.style.height = (size+"px");
}

/*  Creates a row, alternating between gray and white squares; 
	*Initial square color based on rowIndex */

function createRow(rowIndex, boardSize, squareId){
	let parity, columnLenght, columnParity;

	columnParity = checkParity(rowIndex);

	switch (columnParity) {
		case 1:
			columnLenght = boardSize+1;
			break;
		default:
			columnLenght = boardSize;
			break;	
	}	
	for (let index = columnLenght; index > columnParity; index--) {
		parity = checkParity(index);

		switch (parity) {
			case 0:
				createDiv('gray','square',squareId);
				squareId--;
				break;
			default:
				createDiv('white','square');
				break;
		}
	}
	createDiv('clearFloat');
}

/* Check if number is odd or even */

function checkParity(number){
	return number%2;
}

/* Creates new div inside board div */

function createDiv(class1,class2,squareId) {
	let newDiv = document.createElement('div');

	newDiv.classList.add(class1,class2);
	document.getElementById('board').appendChild(newDiv);

	if (squareId!=null) {
		newDiv.id = 'square' + squareId;
	}
}

function getBoardSize(size) {
	boardSize = size;
	document.getElementById('size8').disabled= true;
	document.getElementById('size10').disabled= true;	
	createBoard(size);

}