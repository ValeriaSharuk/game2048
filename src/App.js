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
        const randomCoordinate1 = emptyCoordinates[Math.floor(Math.random() * emptyCoordinates.length)];
        board[randomCoordinate1[0]][randomCoordinate1[1]] = Math.random() > 0.5 ? 2 : 4;
        return board;
    }

    addAndMoveNumsInRowLeft(board, i) {
        let arrNumbers = []
        let isInArrNumber = false;
        let k = 0;
        let checkModifiedRow = false;
        for (let j = 0; j <= 3; j++) {
            //элемент строки матрицы - число?
            if(board[i][j] !== null){
                //в вспомогательном массиве нет чисел?
                if(!isInArrNumber){
                    arrNumbers.push(board[i][j]);
                    isInArrNumber = true;
                }
                else{
                    //У соседствующих элементов одинаковые значения?
                    if(arrNumbers[k] === board[i][j]){
                        arrNumbers[k] += board[i][j];
                    }
                    else{
                        arrNumbers.push(board[i][j]);
                        k++;
                    }
                }
            }
        }
        if (arrNumbers.length !== 4) {
            checkModifiedRow = true;
        }
        for (let l = arrNumbers.length; l <= 3; l++) {
            arrNumbers.push(null);
        }

        return [arrNumbers, checkModifiedRow];
    }

    moveLeft() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        for (let i = 0; i <= 3; i++) {
            [newBoard[i], checkModifiedRow] = this.addAndMoveNumsInRowLeft(board,i);
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        if(!checkModifiedMatrix) alert("Вы проиграли! Начините игру заново");
        else {
            if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
                board = this.placeRandom(newBoard);
                this.setState({board});
            }
        }
    }


    addAndMoveNumsInRowRight(board, i) {
        let arrNumbers = []
        let isInArrNumber = false;
        let k = 0;
        let checkModifiedRow = false;
        for (let j = 3; j >= 0; j--) {
            if(board[i][j] !== null){
                if(!isInArrNumber){
                    arrNumbers.push(board[i][j]);
                    isInArrNumber = true;
                }
                else{
                    if(arrNumbers[k] === board[i][j]){
                        arrNumbers[k] += board[i][j];
                    }
                    else{
                        arrNumbers.push(board[i][j]);
                        k++;
                    }
                }
            }
        }
        if (arrNumbers.length !== 4) {
            checkModifiedRow = true;
        }
        for (let l = arrNumbers.length; l <= 3; l++) {
            arrNumbers.push(null);
        }

        return [arrNumbers, checkModifiedRow];
    }

    moveRight() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        for (let i = 0; i <= 3; i++) {
            [newBoard[i], checkModifiedRow] = this.addAndMoveNumsInRowRight(board,i);
            newBoard[i] = newBoard[i].reverse();
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        if(!checkModifiedMatrix) alert("Вы проиграли! Начините игру заново");
        else {
                if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
                    board = this.placeRandom(newBoard);
                    this.setState({board});
                }
        }
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
        for (let i = 0; i <= 3; i++) {
            [newBoard[i], checkModifiedRow] = this.addAndMoveNumsInRowRight(this.transposition(board),i);
            newBoard[i] = newBoard[i].reverse();
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        newBoard = this.transposition(newBoard);

        if(!checkModifiedMatrix) alert("Вы проиграли! Начините игру заново");
        else {
            if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
                board = this.placeRandom(newBoard);
                this.setState({board});
            }
        }
    }


    moveUp() {
        let {board} = this.state;
        let newBoard = [];
        let checkModifiedRow = false;
        let checkModifiedMatrix = false;
        for (let i = 0; i <= 3; i++) {
            [newBoard[i], checkModifiedRow] = this.addAndMoveNumsInRowLeft(this.transposition(board),i);
            checkModifiedMatrix = checkModifiedRow || checkModifiedMatrix;
        }
        newBoard = this.transposition(newBoard);

        if(!checkModifiedMatrix) alert("Вы проиграли! Начините игру заново");
        else {
            if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
                board = this.placeRandom(newBoard);
                this.setState({board});
            }
        }
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

