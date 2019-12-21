import React from 'react';
import styles from './index.scss';
import initBrick from './Brick';

const DIRECTION_DOWN = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_LEFT = 3;
const DIRECTION_UP = 4;
const colors = ['black','#0BF1D0', '#0BF179', '#F1D80B', '#F1550B', '#EE1717', '#F10B0B']

export default class Els extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0
    }
    this.boardRowNum = 20;
    this.boardColumnNum = 10;
    this.doneList = [];
    this.curDirection = DIRECTION_DOWN;
    this.speed = 600;
    this.brickWidth = 350 / this.boardColumnNum;
    this.brickHeight = 700 / this.boardRowNum;
  }

  componentDidMount() {
    this.boardCtx = document.getElementById('boardCvs').getContext('2d');
    this.nextBrickCtx = document.getElementById('nextBrick').getContext('2d');
    this.brickCtx = document.getElementById('brickCvs').getContext('2d');
    this.doneCtx = document.getElementById('doneCvs').getContext('2d');
    this.brickCtx.fillStyle = 'black'
    this.doneCtx.fillStyle = 'gray'
    this.nextBrickCtx.fillStyle = 'black'
    this.initGame();
    addEventListener('keydown', e => {
      const code = e.which
      if(code == 39 || code == 68) {  //向右
        this.curDirection = DIRECTION_RIGHT
        this.move();
      } else if(code == 37 || code == 65) { //向左
        this.curDirection = DIRECTION_LEFT
        this.move();
      } else if(code == 38 || code == 87) {  //向上
        this.curDirection = DIRECTION_UP;
        this.move(); 
      }  else if(code == 40 || code == 83) {  //向下 
        this.curDirection = DIRECTION_DOWN;
        this.move();
      }
    })
  }

  initGame = () => {
    for(let row = 0; row < this.boardRowNum; row++) {
      this.doneList[row] = new Array(this.boardColumnNum);
      this.doneList[row].fill(0);
    }
    this.drawBoard();
    this.generateBrick();
    this.startGame();
  }

  drawBoard = () => {
    const boardRowNum = this.boardRowNum;
    for(let row = 1; row <= boardRowNum - 1; row++) {
      this.boardCtx.moveTo(0, row * this.brickWidth);
      this.boardCtx.lineTo(350, row * this.brickWidth);
      this.boardCtx.stroke();
    }
    for(let column = 1; column <= this.boardColumnNum - 1; column++) {
      this.boardCtx.moveTo(column * this.brickWidth, 0);
      this.boardCtx.lineTo(column * this.brickWidth, 700);
      this.boardCtx.stroke();
    }
  }

  drawDoneList() {
    this.doneCtx.clearRect(0, 0, 350, 700);
    for(let rowIndex = 0; rowIndex < this.boardRowNum; rowIndex ++) {
      for(let columnIndex = 0; columnIndex < this.boardColumnNum; columnIndex ++) {
        const item = this.doneList[rowIndex][columnIndex]
        this.doneCtx.beginPath();
        if(item === 1) {
          this.doneCtx.fillRect(columnIndex * this.brickWidth + 1, rowIndex * this.brickWidth + 1, this.brickWidth - 2, this.brickWidth - 2)
        }
      }
    }
  }

  move() {
    const canMove = this.prepareMove();
    if(canMove) {
      this.drawBrick();
    } else {
      if(this.curDirection !== DIRECTION_DOWN) {
        this.curDirection = DIRECTION_DOWN;
        return;
      }
      const bricks = this.currentBrick.getBricks();
      bricks.forEach((rowItems, rowIndex) => {
        rowItems.forEach((item, columnIndex) => {
          const realRowIndex = rowIndex + this.offsetRow;
          const realColumnIndex = columnIndex + this.offsetColumn;
          if(realRowIndex >= 0 && realColumnIndex >= 0 && realRowIndex < this.boardRowNum && realColumnIndex < this.boardColumnNum) {
            this.doneList[realRowIndex][realColumnIndex] += item;
          }
        })
      })
      this.brickCtx.clearRect(0, 0, 350, 700);
      this.drawDoneList();
      let eraseNum = this.erase();
      if(eraseNum > 0) {
        this.drawDoneList();
        let score = this.state.score;
        this.setState({
          score: score += 10 * eraseNum
        })
      }
      if(this.offsetRow + eraseNum < 0) {
        alert('game Over!')
        this.gameOver = true;
      } else {
        this.generateBrick();
      }
    }
    this.curDirection = DIRECTION_DOWN;
  }

  prepareMove() {
    let offsetColumn = this.offsetColumn;
    let offsetRow = this.offsetRow;
    let bricks = this.currentBrick.getBricks();
    if(this.curDirection === DIRECTION_LEFT) {
      offsetColumn -= 1;
    } else if(this.curDirection === DIRECTION_RIGHT) {
      offsetColumn += 1;
    } else if(this.curDirection === DIRECTION_DOWN) {
      offsetRow += 1;
    } else if(this.curDirection === DIRECTION_UP) {
      bricks = this.currentBrick.attemptRotate();
    }
    const canMove = this.isValid(bricks, offsetRow, offsetColumn);
    if(canMove) {
      this.offsetColumn = offsetColumn;
      this.offsetRow = offsetRow;
      this.currentBrick.setBricks(bricks);
    }
    return canMove;
  }

  isValid(bricks, offsetRow, offsetColumn) {
    let result = true;
    for(let row = 0; row < bricks.length; row ++) {
      let rows = bricks[row];
      for(let column = 0; column < rows.length; column ++) {
        if(rows[column] === 1) {
          const tar_column = column + offsetColumn;
          const tar_row = row + offsetRow;
          if(tar_column < 0 || tar_column >= this.boardColumnNum || tar_row >= this.boardRowNum) {
            result = false;
            break;
          } else {
            if(tar_row >= 0) {
              const doneItem = this.doneList[tar_row][tar_column];
              if(doneItem > 0) {
                result = false;
                break;
              }
            }
          }
        }
      }
    }
    return result;
  }

  erase() {
    const brickRowNums = this.currentBrick.getRowNums();
    const minRow = this.offsetRow;
    const maxRow = this.offsetRow + brickRowNums - 1;
    let eraseNum = 0;
    let firstRow = Math.max(minRow, 0);
    let realMaxRow = Math.min(maxRow, this.boardRowNum - 1);
    for(let rowIndex = firstRow; rowIndex <= realMaxRow; rowIndex++) {
      const rowList = this.doneList[rowIndex]
      let canDelete = true;
      for(let columnIndex = 0; columnIndex < this.boardColumnNum; columnIndex ++) {
        if(rowList[columnIndex] !== 1) {
          canDelete = false;
          break;
        }
      }
      if(canDelete) {
        this.doneList.splice(rowIndex, 1);
        this.doneList.unshift(new Array(this.boardColumnNum).fill(0));
        eraseNum ++
      }
    }
    return eraseNum;
  }

  //生成新的
  generateBrick = () => {
    if(this.nextBrick) {
      this.currentBrick = this.nextBrick;
    } else {
      this.currentBrick = this.getNewBrick();
    }
    this.offsetRow = this.currentBrick.offsetRow;
    this.offsetColumn = this.currentBrick.offsetColumn;
    this.nextBrick = this.getNewBrick();
    this.drawNextBrick();
  }

  //生成下一个方块
  getNewBrick = () => {
    const brickType = Math.floor(Math.random() * 6);
    return initBrick(brickType);
  }

  drawNextBrick() {
    const bricks = this.nextBrick.getBricks();
    this.nextBrickCtx.clearRect(0, 0, 140, 140);
    bricks.forEach((rowItems, rowIndex) => {
      rowItems.forEach((item, columnIndex) => {
        if(item === 1 && rowIndex >= 0 && columnIndex >= 0) {
          this.nextBrickCtx.beginPath();
          this.nextBrickCtx.fillRect(columnIndex * this.brickWidth + 1, rowIndex * this.brickWidth + 1, this.brickWidth - 2, this.brickWidth - 2);
        }
      })
    })
  }

  drawBrick() {
    const bricks = this.currentBrick.getBricks();
    this.brickCtx.clearRect(0, 0, 350, 700);
    bricks.forEach((rowItems, rowIndex) => {
      rowItems.forEach((item, columnIndex) => {
        const realRowIndex = rowIndex + this.offsetRow;
        const realColumnIndex = columnIndex + this.offsetColumn;
        if(item === 1 && realRowIndex >= 0 && realColumnIndex >= 0) {
          this.brickCtx.beginPath();
          this.brickCtx.fillRect(realColumnIndex * this.brickWidth + 1, realRowIndex * this.brickWidth + 1, this.brickWidth - 2, this.brickWidth - 2);
        }
      })
    })
  }

  refresh = () => {
    this.move();
    let newSpeed = 800 - 100 * Math.floor(this.state.score /100);
    newSpeed = Math.max(newSpeed, 200);
    if(this.speed !== newSpeed) {
      this.speed = newSpeed;
      this.brickCtx.fillStyle = colors[Math.floor(this.state.score / 100)];
    }
    if(!this.gameOver) {
      setTimeout(this.refresh, this.speed);
    }
  }

  startGame = () => {
    this.gameOver = false;
    this.refresh();
  }

  render() {
    const {score} = this.state
    return(
      <div className={styles.container}>
        <div>{score}</div>
        <div className={styles.content}>
          <canvas id='boardCvs' width="350" height="700" className={styles.cvs}></canvas>
          <canvas id='doneCvs' width="350" height="700" className={styles.cvs}></canvas>
          <canvas id='brickCvs' width="350" height="700" className={styles.cvs}></canvas>
          <canvas id='nextBrick' width="140" height="140" className={styles.cvs}></canvas>
        </div>
      </div>
    )
  }
}