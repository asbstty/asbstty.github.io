function BrickT() {
  this.rowNums = 3;
  this.columnNums = 3; 
  this.bricks = [[0, 0, 0], [0, 1, 0], [1, 1, 1]];
  this.offsetRow = -3;
  this.offsetColumn = 2;
  this.centerPoint = [1,1]
}

BrickT.prototype = new BaseBrick()