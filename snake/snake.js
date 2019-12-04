const DIRECTION_UP = -1;
const DIRECTION_DOWN = 1;
const DIRECTION_RIGHT = -2;
const DIRECTION_LEFT = 2;

function IsPC(){  
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
  var flag = true;  
  for (var v = 0; v < Agents.length; v++) {  
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
  }  
  return flag;  
}

addEventListener('load', () => {
  const $tableCvs = document.getElementById('tableCanvas')
  const $snakeCvs = document.getElementById("snakeCanvas")
  const snakeCtx = $snakeCvs.getContext('2d')
  const btnStart = document.getElementById('btnStart')
  const divDuration = document.getElementById('gameDuration')
  const divScore = document.getElementById('gameScore')
  const toggleSwitch = document.querySelector('.toggle-switch');
  const toggleCircle = document.querySelector('.toggle-circle');
  const sept = 10
  const foodWidth = 10
  let snake = []
  let curX = sept
  let curY = sept
  let xNum = 0
  let yNum = 0
  let food = {}
  let speed = 100
  let curDirection = DIRECTION_RIGHT
  let cachePoint = null
  let score = 0
  let duration = 0
  let countInterval = null
  let gameData = {}
  let lock = false
  let autoPlay = false
  Object.defineProperties(gameData, {
    'score': {
      get: function() {
        return score
      },
      set: function(val) {
        score = val
        divScore.innerText = `得分：${score}`
        if(speed > 50) {
          speed = 100 - 10 * Math.floor(score / 10)
        }
      }
    },
    'duration': {
      get: function() {
        return duration
      },
      set: function(val) {
        duration = val
        const timeStr = formatTime(duration)
        divDuration.innerText = `时长：${timeStr}`
      }
    }
  })
  gameData.score = 0
  gameData.duration = 0
  btnStart.addEventListener('click', () => {
    btnStart.style.display = 'none'
    startGame()
  })
  initGameBoard()
  function initGameBoard() {
    while(curY + sept <= $tableCvs.height) {
      yNum ++;
      curY += sept;
    }
    while(curX + sept <= $tableCvs.width) {
      xNum ++;
      curX += sept;
    }
  }

  function formatTime(time) {
    const minute = Math.floor(time / 60)
    const second = time % 60
    return [minute, second].join(':').split(':').map(item => {
      if(item.length == 1) {
        return '0' + item
      }
      return item
    }).join(':')
  }

  function startGame() {
    gameData.score = 0
    gameData.duration = 0
    lock = false
    speed = 100
    startCountDown()
    initSnake()
    generateFood()
    drawSnake()
    drawFood()
    refresh()
  }

  function startCountDown() {
    countInterval = setInterval(() => {
      gameData.duration += 1
    }, 1000)
  }

  function generateFood() {
    const x = Math.ceil(Math.random() * xNum)
    const y = Math.ceil(Math.random() * yNum)
    let conflict = false
    for(let item of snake) {
      if(item.x == x && item.y == y) {
        conflict = true;
        break;
      }
    }
    if(conflict) {
      generateFood()
    } else {
      food = {x, y}
    }
  }

  function drawFood() {
    snakeCtx.clearRect(food.x - foodWidth/ 2, food.y - foodWidth / 2, foodWidth, foodWidth)
    const radius = 3;
    snakeCtx.beginPath();
    snakeCtx.fillStyle = 'red';
    snakeCtx.lineWidth = 2;
    snakeCtx.arc(food.x * sept, food.y * sept, radius, 0, 2 * Math.PI);
    snakeCtx.fill();
  }

  function initSnake() {
    snake = []
    cachePoint = null
    curDirection = DIRECTION_RIGHT
    let originPos = {x: 25, y: 20}
    for(let i = 0; i < 4; i++) {
      snake.push({x: originPos.x + i, y: originPos.y})
    }
    head = snake[snake.length - 1]
  }

  function drawSnake() {
    let isFirst = true
    snakeCtx.lineWidth = 3
    for(let i = 0; i < snake.length; i++) {
      if(isFirst) {
        const {x, y} = snake[i]
        snakeCtx.beginPath()
        snakeCtx.moveTo(x * sept, y * sept)
        isFirst = false
      } else {
        const {x, y} = snake[i]
        snakeCtx.lineTo(x * sept, y * sept)
        snakeCtx.stroke()
        snakeCtx.beginPath()
        snakeCtx.moveTo(x * sept, y * sept)
      }
    }
  }

  function refresh() {
    if(!isGameOver()) {
      setTimeout(refresh, speed);
      if(autoPlay) {
        autoDrive();
      }
      updateSnake()
      draw()
      lock = false
    } else {
      clearInterval(countInterval)
      countInterval = null
      btnStart.style.display = 'block'
    }
  }

  //自动驾驶
  function autoDrive() {
    const {x: headX, y: headY} = head
    const {x: foodX, y: foodY} = food
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
  }

  //根据方向决定下一步的数组
  function updateSnake() {
    let next = {}
    let lastIndex = snake.length - 1
    const {x, y} = head
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
        snake[i] = snake[i + 1]
      } else {
        snake[i] = next
      }
    }
    if(cachePoint) {
      snake.unshift(cachePoint)
      cachePoint = null
    }
    head = next
    if(head.x == food.x && head.y == food.y) {
      cachePoint = {}
      cachePoint = snake[0]
      gameData.score += 10
      generateFood()
    }
  }

  function draw() {
    snakeCtx.clearRect(0, 0, $snakeCvs.width, $snakeCvs.height)
    drawFood()
    drawSnake()
  }

  function isGameOver() {
    const {x, y} = head
    let conflict = false
    for(let i = 0; i < snake.length - 1; i++) {
      const item = snake[i]
      if(item.x == head.x && item.y == head.y) {
        conflict = true;
        console.log('item>>>>>', item)
        console.log('head>>>>>', head)
        console.log('snake>>>>', snake)
        break;
      }
    }
    return conflict || curDirection === DIRECTION_RIGHT && x == xNum + 1 || 
            curDirection === DIRECTION_UP && y == 0 || 
            curDirection === DIRECTION_DOWN && y == yNum + 1 ||
            curDirection === DIRECTION_LEFT && x == 0
  }

  addEventListener('keydown', e => {
    const code = e.which
    if(lock || autoPlay)
      return
    if(code == 38 || code == 87) {  //向上
      if(curDirection !== DIRECTION_DOWN) {
        curDirection = DIRECTION_UP
        lock = true
      }
    } else if(code == 39 || code == 68) {  //向右
      if(curDirection !== DIRECTION_LEFT) {
        curDirection = DIRECTION_RIGHT
        lock = true
      }
    } else if(code == 40 || code == 83) {  //向下 
      if(curDirection !== DIRECTION_UP) {
        curDirection = DIRECTION_DOWN
        lock = true
      }
    } else if(code == 37 || code == 65) { //向左
      if(curDirection !== DIRECTION_RIGHT) {
        curDirection =  DIRECTION_LEFT
        lock = true
      }
    }
  })
  toggleSwitch.addEventListener('click', () => {
    toggleSwitch.classList.toggle('toggle-active');
    toggleCircle.classList.toggle('toggle-circle-active');
    autoPlay = !autoPlay
  })
})