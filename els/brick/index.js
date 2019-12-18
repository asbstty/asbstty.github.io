function BaseBrick() {

}

BaseBrick.prototype.attemptRotate = function() {
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

BaseBrick.prototype.getBricks = function() {
  return this.bricks;
}

BaseBrick.prototype.getRowNums = function() {
  return this.rowNums;
}

BaseBrick.prototype.setBricks = function(bricks) {
  this.bricks = bricks;
}

/** AntiL */
function BrickAntiL() {
  this.rowNums = 3;
  this.columnNums = 3; 
  this.bricks = [[0, 0, 1], [0, 0, 1], [0, 1, 1]];
  this.offsetRow = -3;
  this.offsetColumn = 2;
  this.centerPoint = [1,1]
}

BrickAntiL.prototype = new BaseBrick()

/** L */
function BrickL() {
  this.rowNums = 3;
  this.columnNums = 3; 
  this.bricks = [[1, 0, 0], [1, 0, 0], [1, 1, 0]];
  this.offsetRow = -3;
  this.offsetColumn = 3;
  this.centerPoint = [1,1]
}

BrickL.prototype = new BaseBrick()

/** Line */
function BrickLine() {
  this.rowNums = 4;
  this.columnNums = 4; 
  this.step = 0;
  this.bricks = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]];
  this.offsetRow = -4;
  this.offsetColumn = 3;
  this.centerPoint = [1,1]
  this.attemptRotate = function() {
    let result = []
    if(this.bricks[3][0] === 1) {
      result = [[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0]]
    } else {
      result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]]
    }
    return result;
  }
}

BrickLine.prototype = new BaseBrick()

/** T */
function BrickT() {
  this.rowNums = 3;
  this.columnNums = 3; 
  this.bricks = [[0, 0, 0], [0, 1, 0], [1, 1, 1]];
  this.offsetRow = -3;
  this.offsetColumn = 2;
  this.centerPoint = [1,1]
}

BrickT.prototype = new BaseBrick()

/** 田 */
function BrickTian() {
  this.rowNums = 2;
  this.columnNums = 2; 
  this.bricks = [[1, 1], [1, 1]];
  this.offsetRow = -2;
  this.offsetColumn = 3;
  this.centerPoint = [1,1]
}

BrickTian.prototype = new BaseBrick()

/** Z */
function BrickZ() {
  this.rowNums = 3;
  this.columnNums = 3; 
  this.bricks = [[1, 1, 0], [0, 1, 0], [0, 1, 1]];
  this.offsetRow = -3;
  this.offsetColumn = 3;
  this.centerPoint = [1,1]
}

BrickZ.prototype = new BaseBrick()