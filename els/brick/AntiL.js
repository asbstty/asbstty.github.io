function BrickAntiL() {
  this.rowNums = 3;
  this.columnNums = 3; 
  this.bricks = [[0, 0, 1], [0, 0, 1], [0, 1, 1]];
  this.offsetRow = -3;
  this.offsetColumn = 3;
  this.centerPoint = [1,1]
}

BrickAntiL.prototype = new BaseBrick()