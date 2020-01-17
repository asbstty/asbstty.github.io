import {DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT} from './constant.js'

export default class GameController {
  constructor(handleKeydown) {
    this.init();
    this.handleKeydown = handleKeydown;
  }

  init() {
    addEventListener('keydown', e => {
      const code = e.which
      let direction = DIRECTION_RIGHT;
      if(code == 39 || code == 68) {  //向右
        direction = DIRECTION_RIGHT;
      } else if(code == 37 || code == 65) { //向左
        direction = DIRECTION_LEFT;
      } else if(code == 38 || code == 87) {  //向上
        direction = DIRECTION_UP;
      }  else if(code == 40 || code == 83) {  //向下 
        direction = DIRECTION_DOWN;
      }
      this.handleKeydown && this.handleKeydown(direction);
    })
  }
}