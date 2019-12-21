class BaseBrick {
  attemptRotate() {
    let result = []
    for(let row = 0; row < this.rowNums; row ++) {
      result[row] = new Array(this.columnNums).fill(0);
    }
    const [centerRow, centerColumn] = this.centerPoint;
    for(let row = 0; row < this.bricks.length; row ++) {
      let rowItems = this.bricks[row]
      for(let column = 0; column < rowItems.length; column ++) {
        let resultRowNum = (row - centerRow) * 0 - (column - centerColumn) * 1 + centerRow;
        let resultColumnNum = (column - centerColumn) * 0 + (row - centerRow) * 1 + centerColumn;
        result[resultRowNum][resultColumnNum] = this.bricks[row][column]
      }
    }
    return result;
  }

  getBricks() {
    return this.bricks;
  }

  getRowNums() {
    return this.rowNums;
  }

  setBricks(bricks) {
    this.bricks = bricks;
  }
}

class BrickAntiL extends BaseBrick {
  constructor() {
    super();
    this.rowNums = 3;
    this.columnNums = 3; 
    this.bricks = [[0, 0, 1], [0, 0, 1], [0, 1, 1]];
    this.offsetRow = -3;
    this.offsetColumn = 2;
    this.centerPoint = [1,1]
  }
}

class BrickL extends BaseBrick {
  constructor() {
    super();
    this.rowNums = 3;
    this.columnNums = 3; 
    this.bricks = [[1, 0, 0], [1, 0, 0], [1, 1, 0]];
    this.offsetRow = -3;
    this.offsetColumn = 3;
    this.centerPoint = [1,1]
  }
}

/** Line */
class BrickLine extends BaseBrick {
  constructor() {
    super();
    this.rowNums = 4;
    this.columnNums = 4; 
    this.step = 0;
    this.bricks = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]];
    this.offsetRow = -4;
    this.offsetColumn = 3;
    this.centerPoint = [1,1]
  }

  attemptRotate() {
    let result = []
    if(this.bricks[3][0] === 1) {
      result = [[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0]]
    } else {
      result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]]
    }
    return result;
  }
}

/** T */
class BrickT extends BaseBrick{
  constructor() {
    super();
    this.rowNums = 3;
    this.columnNums = 3; 
    this.bricks = [[0, 0, 0], [0, 1, 0], [1, 1, 1]];
    this.offsetRow = -3;
    this.offsetColumn = 2;
    this.centerPoint = [1,1]
  }
}

/** 田 */
class BrickTian extends BaseBrick{
  constructor() {
    super();
    this.rowNums = 2;
    this.columnNums = 2; 
    this.bricks = [[1, 1], [1, 1]];
    this.offsetRow = -2;
    this.offsetColumn = 3;
    this.centerPoint = [1,1];
    }
}

/** Z */
class BrickZ extends BaseBrick{
  constructor() {
    super();
    this.rowNums = 3;
    this.columnNums = 3; 
    this.bricks = [[1, 1, 0], [0, 1, 0], [0, 1, 1]];
    this.offsetRow = -3;
    this.offsetColumn = 3;
    this.centerPoint = [1,1];
  }
}

export default function initBrick(brickType) {
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
  return brick;
}