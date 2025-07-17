// 🟢 Inicializa el canvas y contexto de dibujo
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 🔵 Parámetros de la pelota
var ballRadius = 16;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 5;  // velocidad horizontal
var dy = -5; // velocidad vertical

// 🟣 Parámetros de la paleta
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// 🔴 Control de teclas
var rightPressed = false;
var leftPressed = false;

// 🧱 Parámetros de los ladrillos
var brickRowCount = 12;
var brickColumnCount = 6;
var brickWidth = 60;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// 🧮 Marcadores
var score = 0;
var lives = 10;
var gameOver = false;

// 🔃 Matriz de ladrillos
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 = activo
    }
}

// 🎮 Eventos del teclado y mouse
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if(e.keyCode == 39) rightPressed = true;
    else if(e.keyCode == 37) leftPressed = true;
}
function keyUpHandler(e) {
    if(e.keyCode == 39) rightPressed = false;
    else if(e.keyCode == 37) leftPressed = false;
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width)
        paddleX = relativeX - paddleWidth/2; // centra la paleta bajo el cursor
}

// 💥 Detecta si la bola golpea algún ladrillo
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth &&
                   y > b.y && y < b.y+brickHeight) {
                    dy = -dy;       // rebote vertical
                    b.status = 0;   // ladrillo roto
                    score++;        // suma puntos

                    // 🏆 Si no queda ningún ladrillo, se gana
                    if(score == brickRowCount*brickColumnCount) {
                        alert("¡GANASTE CAMPEÓN!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// 🎯 Dibuja la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#00ff0d"; // verde brillante
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.closePath();
}

// 🧭 Dibuja la paleta (jugador)
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#15ff00"; // verde fosforescente
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.closePath();
}

// 🧱 Dibuja los ladrillos con colores animados
function drawBricks() {
    let colorShift = Math.floor(128 + 128 * Math.sin(Date.now() / 400));
    let brickColor = `rgb(${colorShift}, ${255 - colorShift}, 70)`;

    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColor;
                ctx.shadowColor = "#222";
                ctx.shadowBlur = 3;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 📊 Muestra el marcador
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + score, 8, 20);
}

// ❤️ Muestra las vidas restantes como corazones
function drawLives() {
    for(let i = 0; i < lives; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width - (15 * i) - 15, 20, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ff4444";
        ctx.fill();
        ctx.closePath();
    }
}

// 🔴 Pantalla de fin de juego
function drawGameOver() {
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("¡PERDISTE GIL XD!", canvas.width / 4, canvas.height / 2);
}

// 🌅 Fondo con gradiente dinámico
function drawBackground() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(1, "#333333");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 🔁 Ciclo principal de dibujo y física del juego
function draw() {
    if(gameOver) {
        drawGameOver();
        return;
    }

    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // 🌐 Rebote contra los bordes
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) dx = -dx;
    if(y + dy < ballRadius) dy = -dy;
    else if(y + dy > canvas.height-ballRadius) {
        // 🛡️ Verifica si la bola toca la paleta
        if(x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
            lives--;
            if(lives <= 0) {
                gameOver = true;
            } else {
                // 🔄 Reinicia posición tras perder vida
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 5;
                dy = -5;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // 🕹️ Mueve la paleta con teclas
    if(rightPressed && paddleX < canvas.width-paddleWidth) paddleX += 7;
    else if(leftPressed && paddleX > 0) paddleX -= 7;

    // ⚽ Mueve la bola
    x += dx;
    y += dy;

    requestAnimationFrame(draw); // 🔁 anima cada frame
}

draw(); // 🔥 inicia el juego
