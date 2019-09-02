'use strict';

let direction = 2;

function hide(element){
    element.style.visibility = "hidden";
}

function unhide(element){
    element.style.visibility = "visible";
}

function setCookie(name, value, seconds=null) {
    let date = new Date();
    let expires = "";
    if(seconds){
        date.setTime(date.getTime() + (seconds*1000));
        date.setTime(date.getTime() + (seconds*1000));
        expires = "expires=" + date.toUTCString() + ";";
    }
    document.cookie = name + "=" + value + ";" + expires + "path=/";
}

function readCookie(name){
    let cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++){
        if(name === cookies[i].trim().split("=")[0]){
            return cookies[i].trim().split("=")[1];
        }
    }
}

function updateScore(score){
    setCookie("score", score);
    document.querySelector(".score").innerText = score;
}

function coverBoard(color){
    let board_curtain = document.querySelector(".board__curtain");
    board_curtain.classList.add("active");
    setTimeout(function(){
        board_curtain.innerHTML = "";
    }, 5000);
    setTimeout(function(){
        board_curtain.style.backgroundColor = color;
        board_curtain.classList.remove("active");
    }, 6000);
}

function uncoverBoard(){
    coverBoard("rgba(0,0,0,0)");
}

function restart(){
    document.querySelector(".restart_button").removeEventListener('click', init);
    uncoverBoard();
    clearBoard();
    direction = 2;
    updateScore(0);
    setTimeout(init, 6000);
}

function gameOver(){
    coverBoard("orange");
    let board_curtain = document.querySelector(".board__curtain");
    const button = document.createElement('button');
    button.classList.add("restart_button");
    button.innerText = "Restart";
    button.addEventListener('click', restart);
    setTimeout(function(){
        board_curtain.appendChild(button);
    }, 6000);
}

function changeDirection(evt){
    if(parseInt(readCookie("motionDone")) === 0)
        return 0;
    if(evt.key === 'ArrowUp' && direction !== 3){
        direction = 1;
    }
    if(evt.key === 'ArrowRight' && direction !== 4){
        direction = 2;
    }
    if(evt.key === 'ArrowDown' && direction !== 1){
        direction = 3;
    }
    if(evt.key === 'ArrowLeft' && direction !== 2){
        direction = 4;
    }
    setCookie("motionDone", 0);
}

function placeFood(board_arr){
    let board_width = document.querySelector('.board').clientWidth;
    let board_height = document.querySelector('.board').clientHeight;
    let snake_elements = document.querySelectorAll('.snake_element');
    let max_horizontaly = board_width/snake_elements[0].clientWidth;
    let max_verticaly = board_height/snake_elements[0].clientWidth;
    let horizontaly = parseInt(Math.random()*max_horizontaly);
    let verticaly = parseInt(Math.random()*max_verticaly);
    while(board_arr[horizontaly][verticaly] === 'snake'){
        horizontaly = parseInt(Math.random()*max_horizontaly);
        verticaly = parseInt(Math.random()*max_verticaly);
    }
    board_arr[horizontaly][verticaly] = 'food';
    let food = document.querySelector('.food');
    food.style.marginLeft = horizontaly*30 + 'px';
    food.style.marginTop = verticaly*30 + 'px';
}

function countdown(seconds){
    const cd = document.createElement('p');
    cd.classList.add('countdown');
    document.querySelector('body').appendChild(cd);
    cd.innerHTML = seconds;
    let cdt = setInterval(function(){
        cd.innerHTML = --seconds;
        if(seconds < 1){
            clearInterval(cdt);
            cd.remove();
        }
    }, 1000);
}

function clearBoard(){
    let board_elements = document.querySelectorAll(".board_element");
    for(let i = 0; i < board_elements.length; i++){
        board_elements[i].remove();
    }
    let snake_elements = document.querySelectorAll(".snake_element");
    for(let i = snake_elements.length-1; i > 2; i--){
        snake_elements[i].remove();
    }
}

function generateBoard(){
    let snake_elements = document.querySelectorAll('.snake_element');
    let board_width = document.querySelector('.board').clientWidth;
    let board_height = document.querySelector('.board').clientHeight;
    let board_element;

    const board = document.querySelector(".board");
    let board_arr = new Array(board_width/snake_elements[0].clientWidth);

    for(let i = 0; i < board_arr.length; i++){
        board_arr[i] = new Array(board_height/snake_elements[0].clientWidth);
    }

    for(let i = 0; i < board_arr.length; i++)
        for(let j = 0; j < board_arr[i].length; j++)
            board_arr[i][j] = '';

    for(let i = 0; i < board_height/30; i++){
        for(let j = 0; j < board_width/30; j++){
            board_element = document.createElement('div');
            board_element.classList.add('board_element');
            board_element.style.marginTop = 30*i + 'px';
            board_element.style.marginLeft = 30*j + 'px';
            board.appendChild(board_element);
        }
    }
    for(let i = 0; i < snake_elements.length; i++){
        snake_elements[i].style.marginLeft = (board_width/2-i*snake_elements[i].clientWidth + 15) + 'px';
        snake_elements[i].style.marginTop = (board_height/2 + 15) + 'px';
        board_arr[parseInt(snake_elements[i].style.marginLeft)/30][parseInt(snake_elements[i].style.marginTop)/30] = "snake";
    }
    return board_arr;
}

function motion(speed, board_arr){
    let snake_elements = document.querySelectorAll('.snake_element');
    let board_width = document.querySelector('.board').clientWidth;
    let board_height = document.querySelector('.board').clientHeight;
    const board = document.querySelector(".board");
    let newx, newy;
    document.addEventListener('keydown', changeDirection);
    let a = setInterval(function() {
        switch (direction) {
            case 1:
                newx = snake_elements[0].style.marginLeft;
                newy = (parseInt(snake_elements[0].style.marginTop) - snake_elements[0].clientHeight);
                break;
            case 2:
                newx = (parseInt(snake_elements[0].style.marginLeft) + snake_elements[0].clientWidth);
                newy = snake_elements[0].style.marginTop;
                break;
            case 3:
                newx = snake_elements[0].style.marginLeft;
                newy = (parseInt(snake_elements[0].style.marginTop) + snake_elements[0].clientHeight);
                break;
            case 4:
                newx = (parseInt(snake_elements[0].style.marginLeft) - snake_elements[0].clientWidth);
                newy = snake_elements[0].style.marginTop;
                break;
            default:
                break;
        }
        newx = parseInt(newx);
        newy = parseInt(newy);
        board_arr[parseInt(snake_elements[snake_elements.length-1].style.marginLeft)/30][parseInt(snake_elements[snake_elements.length-1].style.marginTop)/30] = "";
        if (newx < 0 || newx >= board_width || newy < 0 || newy >= board_height || board_arr[newx/30][newy/30] === "snake") {
            clearInterval(a);
            gameOver();
        }else{
            for(let i = snake_elements.length-1; i > 0; i--){
                snake_elements[i].style.marginLeft = snake_elements[i-1].style.marginLeft;
                snake_elements[i].style.marginTop = snake_elements[i-1].style.marginTop;
                board_arr[parseInt(snake_elements[i].style.marginLeft)/30][parseInt(snake_elements[i].style.marginTop)/30] = "snake";
            }
            snake_elements[0].style.marginLeft = newx + 'px';
            snake_elements[0].style.marginTop = newy + 'px';
            if(board_arr[newx/30][newy/30] === "food"){
                let new_snake_element = document.createElement('div');
                new_snake_element.classList.add('snake_element');
                new_snake_element.style.marginTop = newy + 'px';
                new_snake_element.style.marginLeft = newx + 'px';
                board.appendChild(new_snake_element);
                snake_elements = document.querySelectorAll('.snake_element');
                board_arr[newx/30][newy/30] = '';
                placeFood(board_arr);
                updateScore(parseInt(readCookie("score"))+1);
            }
        }
        setCookie("motionDone", 1);
    }, 300);
}

function startGame(){
    let board_arr = generateBoard();
    placeFood(board_arr);
    let cd_seconds = 5;
    countdown(cd_seconds);
    setTimeout(function(){
        motion(300, board_arr);
    }, cd_seconds*1000);
    setCookie("score", 0);
    unhide(document.querySelector(".score"));
}

function init(){
    hide(document.querySelector(".score"));
}

init();