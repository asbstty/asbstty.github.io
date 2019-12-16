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