const DIRECTION_DOWN = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_LEFT = 3;
const DIRECTION_UP = 4;
const boardColumnNum = 10
const boardRowNum = 20
const boardCvs = document.getElementById('boardCvs')
const doneCvs = document.getElementById('doneCvs')
const brickCvs = document.getElementById('brickCvs')
const nextBrickCvs = document.getElementById('nextBrick')
const boardCtx = boardCvs.getContext('2d');
const doneCtx = doneCvs.getContext('2d');
const brickCtx = brickCvs.getContext('2d');
const nextBrickCtx = nextBrickCvs.getContext('2d');

let doneList = []
let curDirection = DIRECTION_DOWN
let boardWidth = boardCvs.clientWidth;
let boardHeight = boardCvs.clientHeight;
const nextBrickWidth = nextBrickCvs.clientWidth;
const nextBrickHeight = nextBrickCvs.clientHeight;
const brickWidth = boardWidth / boardColumnNum;
brickCtx.fillStyle = 'black'
doneCtx.fillStyle = 'gray'
nextBrickCtx.fillStyle = 'black'
let speed = 800;
let score = 0;
let gameTimeout = null;

initGame();
refresh();

function initGame() {
  for(let row = 0; row < boardRowNum; row++) {
    doneList[row] = new Array(boardColumnNum);
    doneList[row].fill(0);
  }
  drawBoard();
  generateBrick();
  drawBrick();
  gameOver = false;
}

function refresh() {
  move();
  speed = 800 - 100 * Math.floor(score /100);
  speed = Math.max(speed, 200);
  if(!gameOver) {
    setTimeout(refresh, speed);
  }
}

function drawBrick() {
  const bricks = this.fuck.getBricks();
  brickCtx.clearRect(0, 0, boardWidth, boardHeight);
  bricks.forEach((rowItems, rowIndex) => {
    rowItems.forEach((item, columnIndex) => {
      const realRowIndex = rowIndex + this.offsetRow;
      const realColumnIndex = columnIndex + this.offsetColumn;
      if(item === 1 && realRowIndex >= 0 && realColumnIndex >= 0) {
        brickCtx.beginPath();
        brickCtx.fillRect(realColumnIndex * brickWidth + 1, realRowIndex * brickWidth + 1, brickWidth - 2, brickWidth - 2);
      }
    })
  })
}

function drawBoard() {
  for(let row = 1; row <= boardRowNum - 1; row++) {
    boardCtx.moveTo(0, row * brickWidth);
    boardCtx.lineTo(boardWidth, row * brickWidth);
    boardCtx.stroke();
  }
  for(let column = 1; column <= boardColumnNum - 1; column++) {
    boardCtx.moveTo(column * brickWidth, 0);
    boardCtx.lineTo(column * brickWidth, boardHeight);
    boardCtx.stroke();
  }
}

function drawDoneList() {
  doneCtx.clearRect(0, 0, boardWidth, boardHeight);
  for(let rowIndex = 0; rowIndex < boardRowNum; rowIndex ++) {
    for(let columnIndex = 0; columnIndex < boardColumnNum; columnIndex ++) {
      const item = doneList[rowIndex][columnIndex]
      doneCtx.beginPath();
      if(item === 1) {
        doneCtx.fillRect(columnIndex * brickWidth + 1, rowIndex * brickWidth + 1, brickWidth - 2, brickWidth - 2)
      }
    }
  }
}

function move() {
  const canMove = prepareMove();
  if(canMove) {
    drawBrick();
  } else {
    if(curDirection !== DIRECTION_DOWN) {
      curDirection = DIRECTION_DOWN;
      return;
    }
    const bricks = this.fuck.getBricks();
    bricks.forEach((rowItems, rowIndex) => {
      rowItems.forEach((item, columnIndex) => {
        const realRowIndex = rowIndex + this.offsetRow;
        const realColumnIndex = columnIndex + this.offsetColumn;
        if(realRowIndex >= 0 && realColumnIndex >= 0 && realRowIndex < boardRowNum && realColumnIndex < boardColumnNum) {
          doneList[realRowIndex][realColumnIndex] += item;
        }
      })
    })
    brickCtx.clearRect(0, 0, boardWidth, boardHeight);
    drawDoneList();
    let eraseNum = erase();
    if(eraseNum > 0) {
      drawDoneList();
      score += 10;
    }
    if(this.offsetRow + eraseNum < 0) {
      alert('game Over!')
      gameOver = true;
    } else {
      generateBrick();
    }
  }
  curDirection = DIRECTION_DOWN;
}

function prepareMove() {
  let offsetColumn = this.offsetColumn;
  let offsetRow = this.offsetRow;
  let bricks = this.fuck.getBricks();
  if(curDirection === DIRECTION_LEFT) {
    offsetColumn -= 1;
  } else if(curDirection === DIRECTION_RIGHT) {
    offsetColumn += 1;
  } else if(curDirection === DIRECTION_DOWN) {
    offsetRow += 1;
  } else if(curDirection === DIRECTION_UP) {
    bricks = this.fuck.attemptRotate();
  }
  const canMove = isValid(bricks, offsetRow, offsetColumn);
  if(canMove) {
    this.offsetColumn = offsetColumn;
    this.offsetRow = offsetRow;
    this.fuck.setBricks(bricks);
  }
  return canMove;
}

function isValid(bricks, offsetRow, offsetColumn) {
  let result = true;
  for(let row = 0; row < bricks.length; row ++) {
    let rows = bricks[row];
    for(let column = 0; column < rows.length; column ++) {
      if(rows[column] === 1) {
        const tar_column = column + offsetColumn;
        const tar_row = row + offsetRow;
        if(tar_column < 0 || tar_column >= boardColumnNum || tar_row >= boardRowNum) {
          result = false;
          break;
        } else {
          if(tar_row >= 0) {
            const doneItem = doneList[tar_row][tar_column];
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

//清除
function erase() {
  const brickRowNums = this.fuck.getRowNums();
  const minRow = this.offsetRow;
  const maxRow = this.offsetRow + brickRowNums - 1;
  let eraseNum = 0;
  let firstRow = Math.max(minRow, 0);
  let realMaxRow = Math.min(maxRow, boardRowNum - 1);
  for(let rowIndex = firstRow; rowIndex <= realMaxRow; rowIndex++) {
    const rowList = doneList[rowIndex]
    let canDelete = true;
    for(let columnIndex = 0; columnIndex < boardColumnNum; columnIndex ++) {
      if(rowList[columnIndex] !== 1) {
        canDelete = false;
        break;
      }
    }
    if(canDelete) {
      doneList.splice(rowIndex, 1);
      doneList.unshift(new Array(boardColumnNum).fill(0));
      eraseNum ++
    }
  }
  return eraseNum;
}

//生成新的
function generateBrick() {
  if(this.nextFuck) {
    this.fuck = this.nextFuck;
  } else {
    this.fuck = getNewBrick();
  }
  this.offsetRow = this.fuck.offsetRow;
  this.offsetColumn = this.fuck.offsetColumn;
  this.nextFuck = getNewBrick();
  drawNextBrick();
}

//

//生成下一个方块
function getNewBrick() {
  const brickType = Math.floor(Math.random() * 6);
  let brick = [];
  switch(brickType) {
    case 0:
      brick = new BrickT();
      break;
    case 1:
      brick = new BrickL();
      break;
    case 2:
      brick = new BrickAntiL();
      break;
    case 3:
      brick = new BrickTian();
      break;
    case 4:
      brick = new BrickLine();
      break;
    case 5:
      brick = new BrickZ();
      break;
    default:
      brick = new BrickL();
      break;
  }
  return brick
}

function drawNextBrick() {
  console.log('this.nextFuck', this.nextFuck)
  const bricks = this.nextFuck.getBricks();
  nextBrickCtx.clearRect(0, 0, nextBrickWidth, nextBrickHeight);
  bricks.forEach((rowItems, rowIndex) => {
    rowItems.forEach((item, columnIndex) => {
      if(item === 1 && rowIndex >= 0 && columnIndex >= 0) {
        nextBrickCtx.beginPath();
        nextBrickCtx.fillRect(columnIndex * brickWidth + 1, rowIndex * brickWidth + 1, brickWidth - 2, brickWidth - 2);
      }
    })
  })
}

addEventListener('keydown', e => {
  const code = e.which
  if(code == 39 || code == 68) {  //向右
    curDirection = DIRECTION_RIGHT
    move();
  } else if(code == 37 || code == 65) { //向左
    curDirection = DIRECTION_LEFT
    move();
  } else if(code == 38 || code == 87) {  //向上
    curDirection = DIRECTION_UP;
    move(); 
  }  else if(code == 40 || code == 83) {  //向下 
    curDirection = DIRECTION_DOWN;
    move();
  }
})