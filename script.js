// select cvs
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// game vars and const
let frame = 0;

// load  images
const bgSpace = new Image();
const bear2 = new Image();
const metrop = new Image();
const gameoverp = new Image();
const readyp = new Image();

bgSpace.src = "images/bg.png";
bear2.src = "images/bear2.png";
metrop.src = "images/metro.png";
gameoverp.src = "images/gamover.png";
readyp.src = "images/ready.png";

// load audio


const rocket = new Audio();
const bomb = new Audio();

 
rocket.src = "audios/rocket.mp3";
bomb.src = "audios/bomb.mp3"; 
// game state
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// control game
document.addEventListener("keydown", function (evt) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bear.flap();
            rocket.play();
            break;
        case state.over:
            rock.reset();
            bear.speedReset();
            score.reset();
            state.current = state.getReady;
            break;
    }
})

// distance
function getDistance(bx1, by1, rx2, ry2) {
    var xDistance = rx2 - bx1;
    var yDistance = ry2 - by1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

//Background
const bg = {
    sX: 0,
    sY: 0,
    w: 618,
    h: 428,
    x: 0,
    y: 0,

    draw: function () {
        ctx.drawImage(bgSpace, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}

// bear
const bear = {
    w: 70,
    h: 100,
    x: 50,
    y: 150,
    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    draw: function () {
        ctx.drawImage(bear2, this.x, this.y, this.w, this.h);
    },
    flap: function () {
        this.speed = -this.jump;
    },
    update: function () {
        if (state.current == state.getReady) {
            this.y = 150;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;
        }
    },
    speedReset: function () {
        this.speed = 0;
    }
}
// game ready
const getReady = {
    w: 500,
    h: 81,
    x: 75,
    y: 180,
    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(readyp, this.x, this.y, this.w, this.h);
        }
    }
}

// game over
const gameOver = {
    w: 304,
    h: 338,
    x: cvs.width / 2 - 304 / 2,
    y: 60,

    draw: function () {
        if (state.current == state.over) {
            ctx.drawImage(gameoverp, this.x, this.y, this.w, this.h);
        }
    }
}

// rock
const rock = {
    w: 80,
    h: 80,
    dx: 2,
    position: [],
    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let top = p.y;
            ctx.drawImage(metrop, p.x, p.y, this.w, this.h);
        }
    },
    update: function () {
        if (state.current !== state.game) return;
        if (frame % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: Math.random() * cvs.height - 50
            });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx
            if (getDistance(50, bear.y, this.position[i].x, this.position[i].y) < 35 + 37 || bear.y > cvs.height) {
                bomb.play();
                state.current = state.over;
            }
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    reset: function () {
        this.position = [];
    }
}

// scroe
const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,
    draw: function () {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#FFF";
        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "25px Times"
            ctx.fillText(this.value, cvs.width / 2, 50);
            ctx.strokeText(this.value, cvs.width / 2, 50);
        } else if (state.current == state.over) {
            // score value
            ctx.font = "25px Times"
            ctx.fillText(this.value, 310, 180);
            ctx.strokeText(this.value, 310, 180);
            // best scroe
            ctx.fillText(this.best, 310, 240);
            ctx.strokeText(this.best, 310, 240);
        }
    },
    reset: function () {
        this.value = 0;
    }
}
// draw
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    rock.draw();
    bear.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

//upadte
function upadte() {
    bear.update();
    rock.update();
}

// loop
function loop() {
    upadte();
    draw();
    frame++;
    requestAnimationFrame(loop);
}

loop();
