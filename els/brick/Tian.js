function BrickTian() {
  this.rowNums = 2;
  this.columnNums = 2; 
  this.bricks = [[1, 1], [1, 1]];
  this.offsetRow = -2;
  this.offsetColumn = 3;
  this.centerPoint = [1,1]
}

BrickTian.prototype = new BaseBrick()