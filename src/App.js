import React from "react";
import './index.css'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            board: null
        };
    }

//Инициализация доски
    initBoard() {
        let board = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]]
        board = this.placeRandom(board);
        board = this.placeRandom(board);
        this.setState({board});

    }

//Возвращает координаты пустых элементов
    getEmptyCoordinates(board) {
        const emptyCoordinates = [];

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    emptyCoordinates.push([i, j])
                }
            }
        }

        return emptyCoordinates;
    }

//возвращает доску с рандомным чисом в ней
    placeRandom(board) {
        const emptyCoordinates = this.getEmptyCoordinates(board);
        const randomCoordinate = emptyCoordinates[Math.floor(Math.random() * emptyCoordinates.length)];
        board[randomCoordinate[0]][randomCoordinate[1]] = Math.random() > 0.5 ? 2 : 4;
        return board;
    }

    shoveRow(board) {
        let arrNumbers = []
        let isInArrNumber = false;
        let checkModifiedRow = false;
        let k = 0;
        let j = 0;
        while(j <= 3) {
            //элемент строки матрицы - число?
            if(board[j] !== null){
                [arrNumbers, k, isInArrNumber, j] = this.checkIfArrEmpty(isInArrNumber, arrNumbers, k, board, j);
            }
            j++;
        }
        if (arrNumbers.length !== 4) {
            checkModifiedRow = true;
        }
        for (let l = arrNumbers.length; l <= 3; l++) {
            arrNumbers.push(null);
        }

        return [arrNumbers, checkModifiedRow];
    }

    checkIfArrEmpty(isInArrNumber, arrNumbers, k, board, j) {
        //в вспомогательном массиве нет чисел?
        if (!isInArrNumber) {
            arrNumbers.push(board[j]);
            isInArrNumber = true;
        } else {
            //Сложить одинаковые числа
            [arrNumbers, k, j] = this.addUpIfSameNumber(arrNumbers, k, board, j);
        }
        return [arrNumbers, k, isInArrNumber, j];
    }

    addUpIfSameNumber(arrNumbers, k, board, j) {
        if(arrNumbers[k] === board[j]){
            arrNumbers[k] += board[j];
            if(j !== 3){
                j++;
                arrNumbers.push(board[j]);
                k++;
            }
        }
        else{
            arrNumbers.push(board[j]);
            k++;
        }
        return [arrNumbers, k, j];
    }

    checkGameOver(newBoard, board, checkModifiedMatrix){
        if(!checkModifiedMatrix) alert("Вы проиграли! Начините игру заново");
        else {
            if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
                board = this.placeRandom(newBoard);
                this.setState({board});
            }
        }
    }

    moveLeft() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        for (let i = 0; i <= 3; i++) {
            [newBoard[i], checkModifiedRow] = this.shoveRow(board[i]);
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        this.checkGameOver(newBoard, board, checkModifiedMatrix);
    }


    moveRight() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        for (let i = 0; i <= 3; i++) {
            newBoard[i] = Array.from(board[i]);
            newBoard[i] = newBoard[i].reverse();
            [newBoard[i], checkModifiedRow] = this.shoveRow(newBoard[i]);
            newBoard[i] = newBoard[i].reverse();
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        this.checkGameOver(newBoard, board, checkModifiedMatrix);
    }
//транспонирование матрицы
    transposition(newBoard){
        const rows = newBoard.length, cols = newBoard[0].length;
        const grid = [];
        for (let j = 0; j < cols; j++) {
            grid[j] = Array(rows);
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[j][i] = newBoard[i][j];
            }
        }
        return grid;
    }

    moveDown() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        let transposedMatrix = this.transposition(board);
        for (let i = 0; i <= 3; i++) {
            newBoard[i] = Array.from(transposedMatrix[i]);
            newBoard[i] = newBoard[i].reverse();
            [newBoard[i], checkModifiedRow] = this.shoveRow(newBoard[i]);
            newBoard[i] = newBoard[i].reverse();
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        newBoard = this.transposition(newBoard);

        this.checkGameOver(newBoard, board, checkModifiedMatrix);
    }


    moveUp() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        let transposedMatrix = this.transposition(board);
        for (let i = 0; i <= 3; i++) {
            [newBoard[i], checkModifiedRow] = this.shoveRow(transposedMatrix[i]);
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        newBoard = this.transposition(newBoard);

        this.checkGameOver(newBoard, board, checkModifiedMatrix);
    }

    componentWillMount() {
        this.initBoard();
    }

    render() {
        const {board} = this.state;
        return (
            <div>
                <div className="button" onClick={() => {
                    this.initBoard()
                }}>Restart
                </div>

                <div className="buttons">
                    <div className="button" onClick={() => {
                        this.moveLeft()
                    }}>Left
                    </div>
                    <div className="button" onClick={() => {
                        this.moveRight()
                    }}>Right
                    </div>
                    <div className="button" onClick={() => {
                        this.moveDown()
                    }}>Down
                    </div>
                    <div className="button" onClick={() => {
                        this.moveUp()
                    }}>Up
                    </div>
                </div>
                    <div className="game2048">
                        {board.map((row, i) => (
                            <div key={i}>
                                {row.map((col, j) => (
                                    <span className="grid" key={j}>{col}</span>
                                ))}
                            </div>
                        ))}
                    </div>

            </div>
        )
    }
}

export default App;

