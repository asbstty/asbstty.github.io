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