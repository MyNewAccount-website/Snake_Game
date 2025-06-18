const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector("#score");
const reset = document.querySelector("#reset");

const LeftButton = document.querySelector(".LeftButton");
const RightButton = document.querySelector(".RightButton");
const DownButton = document.querySelector(".DownButton");
const UpButton = document.querySelector(".UpButton");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const snakeColor = "lightgreen";
const snakeBorderColor = "black";
const appleColor = "red";
const unitSize = 25;

let running = true;
let xVelocity = 0;
let yVelocity = unitSize;
let appleX;
let appleY;
let scoreGame = 0;
let speed = 75;

let snake = [
    {
        x: 0,
        y: 0
    }, 
    {
        x: unitSize,
        y: 0
    },
    {
        x: unitSize * 2,
        y: 0
    },
    {
        x: unitSize * 3,
        y: 0
    },
    {
        x: unitSize * 4,
        y: 0
    }
]

gameStart();

function gameStart(){
    
    appleX = createApple(0, canvasWidth - unitSize);
    appleY = createApple(0, canvasHeight - unitSize);

    clearBoard();
    setInterval(()=>{
        if (running){
            clearBoard();
            drawApple();
            CheckBoard();
            moveSnake();
            drawSnake();
            drawDesign();
            SnakeColision();
        }}, 75);
    
}

function drawDesign() {
    const headX = snake[0].x;
    const headY = snake[0].y;

    const eyeRadius = 3;
    const eyeOffsetX = 5;
    const eyeOffsetY = 5;

    ctx.fillStyle = "black";

    // Determine direction to place eyes correctly
    if (xVelocity > 0) { // moving right
        // Eyes on top-right and bottom-right
        drawEye(headX + unitSize - eyeOffsetX, headY + eyeOffsetY);
        drawEye(headX + unitSize - eyeOffsetX, headY + unitSize - eyeOffsetY);
    } else if (xVelocity < 0) { // moving left
        // Eyes on top-left and bottom-left
        drawEye(headX + eyeOffsetX, headY + eyeOffsetY);
        drawEye(headX + eyeOffsetX, headY + unitSize - eyeOffsetY);
    } else if (yVelocity > 0) { // moving down
        // Eyes on bottom-left and bottom-right
        drawEye(headX + eyeOffsetX, headY + unitSize - eyeOffsetY);
        drawEye(headX + unitSize - eyeOffsetX, headY + unitSize - eyeOffsetY);
    } else if (yVelocity < 0) { // moving up
        // Eyes on top-left and top-right
        drawEye(headX + eyeOffsetX, headY + eyeOffsetY);
        drawEye(headX + unitSize - eyeOffsetX, headY + eyeOffsetY);
    }
}

// Helper function to draw a small black circle
function drawEye(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
}


function clearBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "Black";
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

reset.addEventListener("click", ()=>{
    scoreGame = 0;
    score.innerHTML = "0";
    snake = [
    {
        x: 0,
        y: 0
    }, 
    {
        x: unitSize,
        y: 0
    },
    {
        x: unitSize * 2,
        y: 0
    },
    {
        x: unitSize * 3,
        y: 0
    },
    {
        x: unitSize * 4,
        y: 0
    }
    ]

    xVelocity = 0;
    yVelocity = unitSize;

    clearBoard();
    running = true;
});

function createApple(min, max){
    const range = Math.floor((max - min) / unitSize);
    return Math.floor(Math.random() * range) * unitSize + min;
}

function drawApple(){
    ctx.fillStyle = appleColor;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "Black";
    ctx.fillRect(appleX, appleY, unitSize, unitSize);
    ctx.strokeRect(appleX, appleY, unitSize, unitSize);
}

function moveSnake(){
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    // const oneSegment = {
    //     x: snake[snake.length - 1].x,
    //     y: snake[snake.length - 1].y
    // };

    snake.unshift(head);

    if (head.x == appleX && head.y == appleY){
        scoreGame += 1;
        score.innerHTML = scoreGame;
        
        // speed -= 10;
        
        // snake.push(oneSegment);

        appleX = createApple(0, canvasWidth - unitSize);
        appleY = createApple(0, canvasHeight - unitSize);

        drawApple();

    } else {
        snake.pop();
    }
}

function CheckBoard() {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x > canvasWidth) {
            snake[i].x = 0;
        } else if (snake[i].x < 0) {
            snake[i].x = canvasWidth;
        }

        if (snake[i].y > canvasHeight) {
            snake[i].y = 0;
        } else if (snake[i].y < 0) {
            snake[i].y = canvasHeight;
        }
    }
}

function SnakeColision(){
    for (let i = 1; i < snake.length; i++){
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y){
            running = false;
            ctx.font = "50px Permanent Marker";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        }
    }
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (yVelocity === 0) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case "ArrowRight":
            if (xVelocity === 0) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;
        case "ArrowDown":
            if (yVelocity === 0) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
        case "ArrowLeft":
            if (xVelocity === 0) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;
    }
});


LeftButton.addEventListener("click", ()=>{
    if (xVelocity === 0) {
        xVelocity = -unitSize;
        yVelocity = 0;
    }
})

RightButton.addEventListener("click", ()=>{
    if (xVelocity === 0) {
        xVelocity = unitSize;
        yVelocity = 0;
    }
})

DownButton.addEventListener("click", ()=>{
    if (yVelocity === 0) {
        xVelocity = 0;
        yVelocity = unitSize;
    }
})

UpButton.addEventListener("click", ()=>{
    if (yVelocity === 0) {
        xVelocity = 0;
        yVelocity = -unitSize;
    }
})