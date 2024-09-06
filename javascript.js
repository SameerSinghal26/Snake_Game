const board = document.getElementById('board3');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highscoreText = document.getElementById('highScore');

// Game Variable
const grid = 20;
let snake = [{x: 10, y: 10}];
let food = generate_food();
let highestScore = 0;
let direction = 'right';
let gameinterval;
let gamespeed = 250;
let gamestart = false;

function startGame() {
    gamestart = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameinterval = setInterval(() => {
        move();
        collision();
        draw();
    }, gamespeed );
}

function draw() {
    board.innerHTML = '';
    drawsnake();
    drawfood();
    updatescore();
}

function drawsnake() {
    snake.forEach((segment) => {
        const snakeElement = creategameElement('div','snake');
        setposition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function drawfood() {
    if(gamestart){
        const foodelement = creategameElement('div','food');
        setposition(foodelement,food);
        board.appendChild(foodelement);
    }
}

function generate_food() {
    const x = Math.floor(Math.random() *grid) + 1;
    const y = Math.floor(Math.random() *grid) + 1;
    return {x, y};
}


function creategameElement(tag, className){
    const gameElement = document.createElement(tag);
    gameElement.className = className;
    return gameElement;
}

function setposition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function resetGameInterval() {
    clearInterval(gameinterval);
    gameinterval = setInterval(() => {
        move();
        collision();
        draw();
    }, gamespeed);
}

function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generate_food();
        increaseSpeed();
        clearInterval(gameinterval);
        gameinterval = setInterval(() => {
            move();
            collision();
            draw();
        }, gamespeed);
    } else {
        snake.pop();
    }
}
function increaseSpeed() {
    if(gamespeed > 200){
        gamespeed -= 6;
    }
    else if(gamespeed > 150){
        gamespeed -= 4;
    }
    else if(gamespeed > 100){
        gamespeed -= 2;
    }
    else if(gamespeed > 50){
        gamespeed -= 1;
    }
    else if(gamespeed > 25){
        gamespeed -= .8;
    }
}

// Action Listener 
function keyPress(event){
    if((!gamestart && event.code === 'Space')|| (!gamestart && event.key === ' ')) {
        startGame();
    }
    else{
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}
function virtualKey(keyCode) {
    const simuevent = { key: '', code: ''};

    switch (keyCode) {
        case 38: 
            simuevent.key = 'ArrowUp';
            simuevent.code = 'ArrowUp';
            break;
        case 40: 
            simuevent.key = 'ArrowDown';
            simuevent.code = 'ArrowDown';
            break;
        case 37: 
            simuevent.key = 'ArrowLeft';
            simuevent.code = 'ArrowLeft';
            break;
        case 39: 
            simuevent.key = 'ArrowRight';
            simuevent.code = 'ArrowRight';
            break;
    }

    keyPress(simuevent);
}
document.getElementById('startButton').addEventListener('click', function() {
    startGame();
});
document.querySelector('.up').addEventListener('click', function() {
    virtualKey(38);
});
document.querySelector('.down').addEventListener('click', function() {
    virtualKey(40);
});
document.querySelector('.left').addEventListener('click', function() {
    virtualKey(37); 
});
document.querySelector('.right').addEventListener('click', function() {
    virtualKey(39); 
});

document.addEventListener('keydown', keyPress);


function collision() {
    const head = snake[0];
    if (head.x < 1 || head.x > grid || head.y < 1 || head.y > grid){
        ReStartGame();
    }
    // for body collision 
    for(let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y){
            ReStartGame();
        }
    }
}

function ReStartGame() {
    updateHighScore();
    stopgame();
    snake = [{x: 10, y: 10 }];
    food = generate_food();
    direction = 'right';
    gamespeed = 250;
    updatescore();
}

function stopgame() {
    clearInterval(gameinterval);
    gamestart = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}
  

function updatescore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highestScore) {
      highestScore = currentScore;
      highscoreText.textContent = highestScore.toString().padStart(3, '0');
    }
    highscoreText.style.display = 'block';
}
