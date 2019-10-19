class Drawer {
  constructor() {
    this.tableCvs = document.getElementById('tableCanvas')
    this.chessCvs = document.getElementById('chessCanvas')
    this.tableCtx = this.tableCvs.getContext('2d')
    this.chessCtx = this.chessCvs.getContext('2d')
    this.sept = 40   //每个格子间隔：40
    this.tableCtx.fillStyle='black';
    this.chessCtx.fillStyle = 'black';
    this.xNum = 1;
    this.yNum = 1;
    this.chessWidth = 30;   //棋子宽度：30
    this.startX = this.chessWidth / 2;
    this.startY = this.chessWidth / 2;
    this.curX = this.startX;
    this.curY = this.startX;
    this.hasLastChess = false;
    this.lastPoint = {lastX: -1, lastY: -1, lastColor:''}
  }

  //画棋盘
  initChessBoard() {
    while(this.curY + this.sept < this.tableCvs.height) {
      this.yNum ++;
      this.curY += this.sept;
    }
    while(this.curX + this.sept < this.tableCvs.width) {
      this.xNum ++;
      this.curX += this.sept;
    }
    //画横线
    for(let i = 0 ; i < this.yNum; i++) {
      this.tableCtx.moveTo(this.startX, this.startY + i * this.sept);
      this.tableCtx.lineTo(this.curX, this.startX + i * this.sept);
      this.tableCtx.stroke();
    }
    //画竖线
    for(let i = 0; i < this.xNum; i++) {
      this.tableCtx.moveTo(this.startX + i * this.sept, this.startY);
      this.tableCtx.lineTo(this.startY + i * this.sept, this.curY);
      this.tableCtx.stroke();
    }
  }

  //放棋子
  putChess(x, y, color) {
    if(this.hasLastChess) {
      const {lastX, lastY, lastColor} = this.lastPoint  //lastX, lastY:实际的坐标，不是数组下标
      this.chessCtx.clearRect(lastX - width / 2, lastY - this.chessWidth / 2, this.chessWidth, this.chessWidth);
      this.drawChess(lastX, lastY, lastColor)
    }
    const radius = this.chessWidth / 2;
    const realX = radius + x * this.sept;
    const realY = radius + y * this.sept;
    this.drawChess(realX, realY, color, true);
    this.hasLastChess = true
    this.lastPoint = {
      lastX: realX,
      lastY: realY,
      lastColor: color
    }
    
  }

  //画棋子
  drawChess(x, y, color, isNew) {  // 新棋子中间加上红点
    const radius = this.chessWidth / 2; 
    this.chessCtx.beginPath();
    this.chessCtx.fillStyle = color;
    this.chessCtx.arc(x, y, radius, 0, 2 * Math.PI);
    this.chessCtx.fill();
    if(isNew) {
      this.chessCtx.beginPath();
      this.chessCtx.fillStyle = 'red';
      this.chessCtx.arc(x, y, 5, 0, 2 * Math.PI);
      this.chessCtx.fill();
    }
  }

  //清空棋子
  clearChess() {
    this.chessCtx.clearRect(0, 0, this.chessCvs.width, this.chessCvs.height)
    this.hasLastChess = false;
    this.lastPoint = {lastX: -1, lastY: -1, lastColor:''}
  }
}
