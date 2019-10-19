class Drawer {
  constructor() {
    this.cvs = document.getElementById('myCanvas')
    this.ctx = this.cvs.getContext('2d')
    this.sept = 40   //每个格子间隔：40
    this.ctx.fillStyle='black';
    this.xNum = 1;
    this.yNum = 1;
    this.chessWidth = 30;   //棋子宽度：30
    this.startX = this.chessWidth / 2;
    this.startY = this.chessWidth / 2;
    this.curX = this.startX;
    this.curY = this.startX;
  }

  //画棋盘
  initChessBoard() {
    while(this.curY + this.sept < this.cvs.height) {
      this.yNum ++;
      this.curY += this.sept;
    }
    while(this.curX + this.sept < this.cvs.width) {
      this.xNum ++;
      this.curX += this.sept;
    }
    //画横线
    for(let i = 0 ; i < this.yNum; i++) {
      this.ctx.moveTo(this.startX, this.startY + i * this.sept);
      this.ctx.lineTo(this.curX, this.startX + i * this.sept);
      this.ctx.stroke();
    }
    //画竖线
    for(let i = 0; i < this.xNum; i++) {
      this.ctx.moveTo(this.startX + i * this.sept, this.startY);
      this.ctx.lineTo(this.startY + i * this.sept, this.curY);
      this.ctx.stroke();
    }
  }

  //画棋子
  drawChess(x, y, color) {
    console.log('drawChess>>>>', y, y, color)
    const radius = this.chessWidth / 2;
    const realX = radius + x * this.sept;
    const realY = radius + y * this.sept;
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(realX, realY, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  //清空棋子
  clearChess() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
    this.initChessBoard()
  }
}
