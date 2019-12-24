import React from 'react';
import styles from './index.scss';
import GameController from '@/utils/gameController';
import { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT } from '@/utils/constant';
const classNames = require('classnames');

export default class Snake extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0,
      duration: 0,
      autoPlay: false,
      isInGame: false,
    }
    this.sept = 10;
    this.xNum = Math.floor(600 / this.sept) - 1;
    this.yNum = Math.floor(400 / this.sept) - 1;
    this.countInterval = null;
  }

  componentDidMount() {
    const $snakeCvs = document.getElementById('snakeCanvas');
    this.snakeCtx = $snakeCvs.getContext('2d');
    new GameController(this.handleKeyDown);
  }

  handleKeyDown = direction => {
    if(this.lock || this.state.autoPlay)
      return
    if(this.curDirection + direction !== 0) {
      this.curDirection = direction;
      this.lock = true;
    }
  }

  formatTime(time) {
    const minute = Math.floor(time / 60)
    const second = time % 60
    return [minute, second].join(':').split(':').map(item => {
      if(item.length == 1) {
        return '0' + item
      }
      return item
    }).join(':')
  }

  startGame = () => {
    this.setState({
      isInGame: true
    })
    this.lock = false
    this.speed = 100
    this.startCountDown()
    this.initSnake()
    this.generateFood()
    this.drawSnake()
    this.drawFood()
    this.refresh()
  }

  startCountDown = () => {
    this.countInterval = setInterval(() => {
      this.setState({
        duration: this.state.duration + 1
      });
    }, 1000);
  }

  initSnake = () => {
    this.snake = []
    this.cachePoint = null
    this.curDirection = DIRECTION_RIGHT
    let originPos = {x: 25, y: 20}
    for(let i = 0; i < 4; i++) {
      this.snake.push({x: originPos.x + i, y: originPos.y})
    }
    this.head = this.snake[this.snake.length - 1]
  }


  generateFood = () => {
    const x = Math.ceil(Math.random() * this.xNum)
    const y = Math.ceil(Math.random() * this.yNum)
    let conflict = false
    for(let item of this.snake) {
      if(item.x == x && item.y == y) {
        conflict = true;
        break;
      }
    }
    if(conflict) {
      this.generateFood()
    } else {
      this.food = {x, y}
    }
  }

  switchAuto = () => {
    this.setState({
      autoPlay: !this.state.autoPlay
    })
  }

  drawSnake = () => {
    let isFirst = true
    const snakeCtx = this.snakeCtx;
    const sept = this.sept;
    snakeCtx.lineWidth = 3
    for(let i = 0; i < this.snake.length; i++) {
      if(isFirst) {
        const {x, y} = this.snake[i]
        snakeCtx.beginPath()
        snakeCtx.moveTo(x * sept, y * sept)
        isFirst = false
      } else {
        const {x, y} = this.snake[i]
        snakeCtx.lineTo(x * sept, y * sept)
        snakeCtx.stroke()
        snakeCtx.beginPath()
        snakeCtx.moveTo(x * sept, y * sept)
      }
    }
  }

  drawFood = () => {
    const foodWidth = 10;
    const sept = this.sept;
    const snakeCtx = this.snakeCtx;
    const {x, y} = this.food
    snakeCtx.clearRect(x - foodWidth/ 2, y - foodWidth / 2, foodWidth, foodWidth)
    const radius = 3;
    snakeCtx.beginPath();
    snakeCtx.fillStyle = 'red';
    snakeCtx.lineWidth = 2;
    snakeCtx.arc(x * sept, y * sept, radius, 0, 2 * Math.PI);
    snakeCtx.fill();
  }

  isGameOver = () => {
    const {x:headX, y:headY} = this.head
    let conflict = false
    for(let i = 0; i < this.snake.length - 1; i++) {
      const item = this.snake[i]
      if(item.x == headX && item.y == headY) {
        conflict = true;
        break;
      }
    }
    return conflict || this.curDirection === DIRECTION_RIGHT && headX == this.xNum + 1 || 
      this.curDirection === DIRECTION_UP && headY == 0 || 
      this.curDirection === DIRECTION_DOWN && headY == this.yNum + 1 ||
      this.curDirection === DIRECTION_LEFT && headX == 0
  }

  autoDrive = () => {
    const {x: headX, y: headY} = this.head
    const {x: foodX, y: foodY} = this.food
    let curDirection = this.curDirection;
    if(foodX > headX) {
      if(curDirection === DIRECTION_LEFT) {
        if(foodY >= headY) {
          curDirection = DIRECTION_UP
        } else {
          curDirection = DIRECTION_DOWN
        }
      } else {
        curDirection = DIRECTION_RIGHT
      }
    } else if(foodX == headX) {
      if(foodY > headY) {
        if(curDirection === DIRECTION_UP) {
          curDirection = DIRECTION_RIGHT
        } else {
          curDirection = DIRECTION_DOWN
        }
      } else if(foodY < headY) {
        if(curDirection === DIRECTION_DOWN) {
          curDirection = DIRECTION_RIGHT
        } else {
          curDirection = DIRECTION_UP
        }
      }
    } else if(foodX < headX) {
      if(curDirection === DIRECTION_RIGHT) {
        if(foodY >= headY) {
          curDirection = DIRECTION_UP
        } else {
          curDirection = DIRECTION_DOWN
        }
      } else {
        curDirection = DIRECTION_LEFT
      }
    }
    this.curDirection = curDirection;
  }

  updateSnake = () => {
    let next = {}
    let lastIndex = this.snake.length - 1
    const curDirection = this.curDirection;
    const {x, y} = this.head
    if(curDirection == DIRECTION_RIGHT) {
      next = {x: x + 1, y}
    } else if(curDirection == DIRECTION_UP) {
      next = {x, y: y - 1}
    } else if(curDirection == DIRECTION_LEFT) {
      next = {x: x - 1, y}
    } else if(curDirection == DIRECTION_DOWN) {
      next = {x, y: y + 1}
    }
    for(let i = 0; i <= lastIndex; i++) {
      if(i < lastIndex) {
        this.snake[i] = this.snake[i + 1]
      } else {
        this.snake[i] = next
      }
    }
    if(this.cachePoint) {
      this.snake.unshift(this.cachePoint)
      this.cachePoint = null
    }
    this.head = next
    if(this.head.x == this.food.x && this.head.y == this.food.y) {
      this.cachePoint = {}
      this.cachePoint = this.snake[0]
      this.setState({
        score: this.state.score + 10
      })
      this.generateFood()
    }
  }

  refresh = () => {
    if(!this.isGameOver()) {
      setTimeout(this.refresh, this.speed);
      if(this.state.autoPlay) {
        this.autoDrive();
      }
      this.updateSnake()
      this.draw()
      this.lock = false
    } else {
      clearInterval(this.countInterval)
      this.countInterval = null
      this.setState({
        isInGame: false
      })
    }
  }

  draw = () => {
    this.snakeCtx.clearRect(0, 0, 600, 400)
    this.drawFood()
    this.drawSnake()
  }

  render() {
    const {score, duration, autoPlay, isInGame} = this.state;
    return(
      <div className={styles.content}>
        <div className={styles.gameInfo}>
          <div>时长：{this.formatTime(duration)}</div>
          <div>得分：{score}</div>
        </div>
        <div className={styles.gameArea}>
          <div className={styles.cvs}></div>
          <canvas id='snakeCanvas' className={styles.cvs} width="600" height="400"></canvas>
          {!isInGame && <div className={styles.btnStart} onClick={this.startGame}>go</div>}
        </div>
        <div className={styles.autoArea}>
          <div>自己动</div>
          <div className={classNames(styles.toggleSwitch, {
            [styles.toggleActive]: autoPlay
          })} onClick={this.switchAuto}>
            <div className={classNames(styles.toggleCircle, {
              [styles.toggleCircleActive]: autoPlay
            })}></div>
          </div>
        </div>
      </div>
    )
  }
}