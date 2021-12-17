const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var board = $('.game-board')
var scoreBoard = $('.score-board')
var gameRows = 25
var SPEED = 10;
var gameOver = false
var foodColorList = [
    {
        background: "#ffff00",
        boxShadow:"0 0 25px #ffff00"
    },
    {
        background: "#76ff03",
        boxShadow:"0 0 25px #76ff03"
    },
    {
        background: "#f06292",
        boxShadow:"0 0 25px #f06292"
    },
    {
        background: "#4fc3f7",
        boxShadow:"0 0 25px #4fc3f7"
    },
    {
        background: "#ba68c8",
        boxShadow:"0 0 25px #f57c00"
    },
    {
        background: "#673ab7",
        boxShadow:"0 0 25px #673ab7"
    },

]
var foodColor = {
    background: "#673ab7",
    boxShadow:"0 0 25px #673ab7"
}
var snakeBody = [
    {x:12,y:12},
]

var foodPosition = {
    x:0,
    y:0,
}

var movement = {
    down: {x:0,y:1},
    up: {x:0,y:-1},
    left: {x:-1,y:0},
    right: {x:1,y:0},
}
var score = 0

// controller

var snakeMove = {x:0,y:0} 
var isMoveUp = false, isMoveDown = false, isMoveLeft = false, isMoveRight = false

function move1() {
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i+1] = { ...snakeBody[i] }
    }
    snakeBody[0].y += snakeMove.y
    snakeBody[0].x += snakeMove.x
    // if(snakeBody[0].y < 0) {
    //     snakeBody[0].y = gameRows
    // }
    // if(snakeBody[0].x < 0) {
    //     snakeBody[0].x = gameRows
    // }
    // if(snakeBody[0].y > gameRows) {
    //     snakeBody[0].y = 0
    // }
    // if(snakeBody[0].x > gameRows) {
    //     snakeBody[0].x = 0
    // }
    
}

function draw1(board) {
    snakeBody.forEach(conran => {
        var snake = document.createElement('div') 
        snake.classList.add('snake')
        snake.style.gridRowStart = conran.y
        snake.style.gridColumnStart = conran.x
        board.appendChild(snake)
    });
}

// food

function randomFood() {
    return {
        x: Math.floor(Math.random() * (gameRows) + 1),
        y: Math.floor(Math.random() * (gameRows) + 1),
    }
}

function randomColor() {
    var index = Math.floor(Math.random() * 6 + 0)
    return foodColorList[index]
}

function eatFood() {
    if(snakeBody[0].x == foodPosition.x && snakeBody[0].y == foodPosition.y) {
        return true
    }
}

function createFood() {
    const food = document.createElement('div')
    food.classList.add('food') 
    food.style.gridRowStart = foodPosition.y
    food.style.gridColumnStart = foodPosition.x
    food.style.background = foodColor.background
    food.style.boxShadow = foodColor.boxShadow  
    board.appendChild(food)  
    if(eatFood()) {
        score +=1
        scoreBoard.innerHTML = `<span>SCORE : </span><span class="score">${score}</span>`
        getFoodPosition()
        getFoodColor()
        longer()
    }  
}

function getFoodColor() {
    foodColor = randomColor()
}
getFoodColor()

function getFoodPosition() {
    var posi = randomFood()
    if(intersection(posi,snakeBody)) {
        return getFoodPosition()
    } else {
        foodPosition = posi
    }
}
getFoodPosition()

// snake longer 

function longer() {
    snakeBody.push({...snakeBody[snakeBody.length -1]})
}

// death

function wallCrash() {
    return snakeBody[0].x < 1 || snakeBody[0].x > gameRows || snakeBody[0].y < 1 || snakeBody[0].y > gameRows
}

function checkGameOver(board) {
    if(wallCrash() || intersection(snakeBody[0],snakeBody)) {
        gameOver = true
        const alert = document.createElement('div')
        alert.classList.add('alert')
        alert.innerText = 'press "ENTER" to restart'
        board.appendChild(alert)
    }
}

function intersection(caiDau,snakeBody) {
    var check = snakeBody.some(function(element,index) {
        if(index != 0) {
            return element.x === caiDau.x && element.y === caiDau.y

        }
    })
    return check
}


// sum

function draw() {
    board.innerHTML = ''
    draw1(board)
    createFood(board)
}

function move() {
    move1()
    eatFood()
    checkGameOver(board)
}

var last = 0;
function gamePlay(curr) {
    if(gameOver) return;

    window.requestAnimationFrame(gamePlay)
    var seconds = (curr - last) / 1000
    if(seconds < 1/SPEED) return 

    window.addEventListener('keydown', function(e) {
        switch(e.key) {
            case('ArrowDown'): {
                if(!isMoveUp) {
                    snakeMove = movement.down
                    isMoveUp = false 
                    isMoveDown = true 
                    isMoveLeft = false 
                    isMoveRight = false
                }
                break
            } 
            case('ArrowUp'): {
                if(!isMoveDown) {
                    snakeMove = movement.up
                    isMoveUp = true 
                    isMoveDown = false 
                    isMoveLeft = false 
                    isMoveRight = false
                }break
            } 
            case('ArrowLeft'): {
                if(!isMoveRight) {
                    snakeMove = movement.left
                    isMoveUp = false 
                    isMoveDown = false 
                    isMoveLeft = true 
                    isMoveRight = false
                } break
            } 
            case('ArrowRight'): {
                if(!isMoveLeft) {
                    snakeMove = movement.right
                    isMoveUp = false 
                    isMoveDown = false 
                    isMoveLeft = false 
                    isMoveRight = true
                } break
            }
            case('Enter'): {
                if(gameOver) {
                    gameOver = false
                    this.window.location.reload()
                }
            } 
        }    
    })

    last = curr
    draw()
    move()
      
}


window.requestAnimationFrame(gamePlay)

