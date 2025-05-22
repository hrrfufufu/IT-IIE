// Game Constants
const GAME_CONSTANTS = {
    LEVEL_WIDTH: 3000,
    DEAD_ZONE: 0.3,
    PLAYER_SIZE: 40,
    ENEMY_SIZE: 20,
    PLATFORM_SIZE: 200,
    BASE_FLOOR: 140
};

// Game State
let game = {
    scale: 1,
    score: 0,
    muted: false,
    started: false,
    camera: {
        offset: 0,
        deadLeft: 0,
        deadRight: 0
    }
};

// Audio
let audio = {
    bgMusic: null,
    gameOver: null,
    kill: null
};

// Game Objects
let player;
let enemy;
let platforms = [];
let canyons = [];
let clouds;
let sky;
let piltover;
let building;
let floor;

// UI Elements
let ui = {
    musicSlider: null,
    soundSlider: null,
    restartBtn: null,
    sliderContainer: null
};

// Menu Effects
let paintSplatters = [];

/* Preload assets */
function preload() {
    audio.bgMusic = new Audio("PaintTheTownBlue.mp3");
    audio.gameOver = new Audio("GameOver.mp3");
    audio.kill = new Audio("shot.wav");
}

/* Setup game */
function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont('PressStart2P');
    
    initScale();
    initAudio();
    initUI();
    initGameObjects();
    createMenuEffects();
}

function initScale() {
    game.scale = min(width / 1024, height / 576);
    updateDeadZone();
}

function initAudio() {
    audio.bgMusic.volume = 0.2;
    audio.gameOver.volume = 0.45;
    audio.kill.volume = 0.45;
    
    audio.bgMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}

function initUI() {
    ui.musicSlider = select('#musicVolume');
    ui.soundSlider = select('#soundVolume');
    ui.restartBtn = select('#restartButton');
    ui.sliderContainer = select('.slider-container');
    
    ui.musicSlider.input(() => {
        audio.bgMusic.volume = ui.musicSlider.value();
    });
    
    ui.soundSlider.input(() => {
        audio.gameOver.volume = ui.soundSlider.value();
        audio.kill.volume = ui.soundSlider.value();
    });
    
    ui.restartBtn.mousePressed(restartGame);
    
    document.getElementById('startButton').addEventListener('click', startGame);
}

function initGameObjects() {
    // Player
    player = {
        x: 110 * game.scale,
        y: 210 * game.scale,
        width: GAME_CONSTANTS.PLAYER_SIZE * game.scale,
        height: 160 * game.scale,
        speedGravity: -7 * game.scale,
        colors: {
            main: color(202, 190, 215),
            dark: color(45, 35, 40),
            purple: color(128, 89, 174),
            pink: color(220, 84, 210),
            blue: color(93, 127, 195),
            lightBlue: color(153, 198, 219)
        },
        grounded: false,
        dead: false,
        onPlatform: false,
        lastX: null,
        
        draw: function() {
            if (this.dead) {
                this.drawDeath();
                return;
            }
            
            if ((this.lastX !== this.x) || this.dead) {
                fill(this.colors.main);
                rect(this.x - 10 * game.scale, this.y - 65 * game.scale, 10 * game.scale, 10 * game.scale);
                this.lastX = this.x;
            } else {
                this.drawNormal();
            }
        },
        
        drawNormal: function() {
            noStroke();
            fill(this.colors.main);
            ellipse(this.x, this.y - 100 * game.scale, this.width, this.width);
            rect(this.x - 20 * game.scale, this.y - 75 * game.scale, this.width, 60 * game.scale);
            rect(this.x + 5 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 60 * game.scale);
            rect(this.x - 20 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 60 * game.scale);
            rect(this.x - 70 * game.scale, this.y - 75 * game.scale, 50 * game.scale, this.width - 27 * game.scale);
            rect(this.x + 20 * game.scale, this.y - 75 * game.scale, 50 * game.scale, this.width - 27 * game.scale);
            rect(this.x - 7 * game.scale, this.y - 85 * game.scale, 14 * game.scale, 10 * game.scale);
            
            fill(this.colors.pink);
            ellipse(this.x - 9 * game.scale, this.y - 96 * game.scale, 8 * game.scale, 8 * game.scale);
            ellipse(this.x + 9 * game.scale, this.y - 96 * game.scale, 8 * game.scale, 8 * game.scale);
            
            fill(this.colors.dark);
            rect(this.x + 5 * game.scale, this.y + 30 * game.scale, this.width - 25 * game.scale, 15 * game.scale);
            rect(this.x - 20 * game.scale, this.y + 30 * game.scale, this.width - 25 * game.scale, 15 * game.scale);
            rect(this.x - 70 * game.scale, this.y - 75 * game.scale, 25 * game.scale, this.width - 27 * game.scale);
            rect(this.x + 30 * game.scale, this.y - 75 * game.scale, 40 * game.scale, this.width - 27 * game.scale);
            
            quad(this.x - 12 * game.scale, this.y - 75 * game.scale, 
                 this.x + 12 * game.scale, this.y - 75 * game.scale, 
                 this.x + 20 * game.scale, this.y - 45 * game.scale, 
                 this.x - 20 * game.scale, this.y - 45 * game.scale);
            
            fill(this.colors.purple);
            rect(this.x - 20 * game.scale, this.y - 25 * game.scale, this.width, 10 * game.scale);
            rect(this.x + 5 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 30 * game.scale);
            rect(this.x - 20 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 30 * game.scale);
            rect(this.x + 47 * game.scale, this.y - 75 * game.scale, 16 * game.scale, this.width - 27 * game.scale);
            
            fill(this.colors.blue);
            triangle(this.x - 20 * game.scale, this.y - 120 * game.scale, 
                    this.x, this.y - 105 * game.scale, 
                    this.x + 20 * game.scale, this.y - 120 * game.scale);
            triangle(this.x - 22 * game.scale, this.y - 95 * game.scale, 
                    this.x - 19 * game.scale, this.y - 130 * game.scale, 
                    this.x + 2 * game.scale, this.y - 120 * game.scale);
            triangle(this.x - 2 * game.scale, this.y - 120 * game.scale, 
                    this.x + 19 * game.scale, this.y - 130 * game.scale, 
                    this.x + 22 * game.scale, this.y - 95 * game.scale);
            triangle(this.x - 33 * game.scale, this.y - 105 * game.scale, 
                    this.x - 19 * game.scale, this.y - 75 * game.scale, 
                    this.x, this.y - 120 * game.scale);
        },
        
        drawDeath: function() {
            fill(this.colors.main);
            ellipse(this.x, this.y - 100 * game.scale, this.width, this.width);
            rect(this.x - 20 * game.scale, this.y - 75 * game.scale, this.width, 60 * game.scale);
            rect(this.x + 5 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 60 * game.scale);
            rect(this.x - 20 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 60 * game.scale);
            rect(this.x - 7 * game.scale, this.y - 85 * game.scale, 14 * game.scale, 10 * game.scale);
            rect(this.x - 27 * game.scale, this.y - 125 * game.scale, this.width - 27 * game.scale, 50 * game.scale);
            rect(this.x + 14 * game.scale, this.y - 125 * game.scale, this.width - 27 * game.scale, 50 * game.scale);
            
            fill(this.colors.pink);
            ellipse(this.x - 9 * game.scale, this.y - 96 * game.scale, 8 * game.scale, 8 * game.scale);
            ellipse(this.x + 9 * game.scale, this.y - 96 * game.scale, 8 * game.scale, 8 * game.scale);
            
            fill(this.colors.dark);
            rect(this.x + 5 * game.scale, this.y + 30 * game.scale, this.width - 25 * game.scale, 15 * game.scale);
            rect(this.x - 20 * game.scale, this.y + 30 * game.scale, this.width - 25 * game.scale, 15 * game.scale);
            rect(this.x - 27 * game.scale, this.y - 125 * game.scale, this.width - 27 * game.scale, 25 * game.scale);
            rect(this.x + 14 * game.scale, this.y - 125 * game.scale, this.width - 27 * game.scale, 40 * game.scale);
            
            quad(this.x - 12 * game.scale, this.y - 75 * game.scale, 
                 this.x + 12 * game.scale, this.y - 75 * game.scale, 
                 this.x + 20 * game.scale, this.y - 45 * game.scale, 
                 this.x - 20 * game.scale, this.y - 45 * game.scale);
            
            fill(this.colors.purple);
            rect(this.x - 20 * game.scale, this.y - 25 * game.scale, this.width, 10 * game.scale);
            rect(this.x + 5 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 30 * game.scale);
            rect(this.x - 20 * game.scale, this.y - 15 * game.scale, this.width - 25 * game.scale, 30 * game.scale);
            rect(this.x + 14 * game.scale, this.y - 117 * game.scale, this.width - 27 * game.scale, 15 * game.scale);
            
            fill(this.colors.blue);
            triangle(this.x - 20 * game.scale, this.y - 120 * game.scale, 
                    this.x, this.y - 105 * game.scale, 
                    this.x + 20 * game.scale, this.y - 120 * game.scale);
            triangle(this.x - 22 * game.scale, this.y - 95 * game.scale, 
                    this.x - 19 * game.scale, this.y - 130 * game.scale, 
                    this.x + 2 * game.scale, this.y - 120 * game.scale);
            triangle(this.x - 2 * game.scale, this.y - 120 * game.scale, 
                    this.x + 19 * game.scale, this.y - 130 * game.scale, 
                    this.x + 22 * game.scale, this.y - 95 * game.scale);
            triangle(this.x - 33 * game.scale, this.y - 105 * game.scale, 
                    this.x - 19 * game.scale, this.y - 75 * game.scale, 
                    this.x, this.y - 120 * game.scale);
        },
        
        update: function() {
            if (this.dead) return;
            
            this.applyGravity();
            this.checkPlatforms();
            this.checkEnemy();
            this.checkCanyons();
            this.checkBounds();
            this.handleInput();
        },
        
        applyGravity: function() {
            let onPlatform = false;
            
            for (let platform of platforms) {
                if (platform.checkCollision(this)) {
                    this.grounded = true;
                    this.onPlatform = true;
                    onPlatform = true;
                    this.speedGravity = 0;
                    break;
                }
            }
            
            if (this.speedGravity > -7 * game.scale && !onPlatform) {
                this.speedGravity -= game.scale;
            }
            
            if (!onPlatform) {
                this.onPlatform = false;
                if (this.y + this.height < height) {
                    this.y -= this.speedGravity;
                    this.grounded = false;
                } else {
                    this.y = height - this.height;
                    this.grounded = true;
                    this.speedGravity = 0;
                }
            }
        },
        
        checkPlatforms: function() {
            let onPlatform = false;
            for (let platform of platforms) {
                if (platform.checkCollision(this)) {
                    onPlatform = true;
                    break;
                }
            }
            
            if (!onPlatform && this.grounded && this.y + this.height < height - floor.height) {
                this.grounded = false;
            }
        },
        
        checkEnemy: function() {
            if (enemy.dead) return;
        
            const enemyX = enemy.x - game.camera.offset; // Учитываем смещение камеры
            const playerBottom = this.y + this.height;
            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + enemy.height;
        
            if (!this.grounded) {
                if (playerBottom > enemyTop && this.y < enemyBottom) {
                    if (Math.abs(this.x - enemyX) < 50 * game.scale) {
                        audio.kill.play();
                        enemy.dead = true;
                        game.score += 10;
                    }
                }
            }
        
            if (this.x >= enemyX && this.x <= enemyX + enemy.width) {
                if (playerBottom > enemyTop) {
                    this.dead = true;
                    game.score = 0;
                    audio.gameOver.play();
                    audio.bgMusic.pause();
                }
            }
        },
        
        checkCanyons: function() {
            for (let canyon of canyons) {
                const canyonX = canyon.x - game.camera.offset; // Учитываем смещение камеры
                if (this.y + this.height >= height - floor.height + 100 * game.scale &&
                    this.x >= canyonX &&
                    this.x + this.width <= canyonX + canyon.width) {
                    this.grounded = false;
                    this.dead = true;
                }
            }
        },
        
        checkBounds: function() {
            if (this.x < 0) this.x = 0;
            const maxX = 1200 * game.scale - this.width; // Невидимая стена на 1700
            if (this.x > maxX) {
                this.x = maxX;
            }
        },
        
        handleInput: function() {
            if (this.grounded && keyIsDown(32)) this.jump();
            if (keyIsDown(68)) this.moveRight();
            if (keyIsDown(65)) this.moveLeft();
        },
        
        jump: function() {
            if (this.grounded) {
                this.speedGravity = 19 * game.scale;
                this.y -= this.speedGravity;
                this.grounded = false;
                this.onPlatform = false;
            }
        },
        
        moveLeft: function() {
            this.x -= 10 * game.scale;
            // Анимация движения влево (как в оригинале)
            fill(this.colors.blue);
            quad(this.x - 23 * game.scale, this.y - 105 * game.scale, 
                 this.x - 13 * game.scale, this.y - 120 * game.scale, 
                 this.x + 5 * game.scale, this.y - 125 * game.scale, 
                 this.x - 9 * game.scale, this.y - 75 * game.scale);
            
            fill(this.colors.main);
            rect(this.x, this.y - 75 * game.scale, this.width - 20 * game.scale, 80 * game.scale);
            rect(this.x + 3 * game.scale, this.y - 85 * game.scale, 14 * game.scale, 10 * game.scale);
            ellipse(this.x + 10 * game.scale, this.y - 100 * game.scale, this.width, this.width);
            rect(this.x + 2 * game.scale, this.y - 25 * game.scale, this.width - 24 * game.scale, 60 * game.scale);
            
            fill(this.colors.pink);
            ellipse(this.x - 10 * game.scale, this.y - 96 * game.scale, 4 * game.scale, 8 * game.scale);
            
            fill(this.colors.blue);
            triangle(this.x - 10 * game.scale, this.y - 110 * game.scale, 
                    this.x + 10 * game.scale, this.y - 130 * game.scale, 
                    this.x + 30 * game.scale, this.y - 115 * game.scale);
            quad(this.x - 10 * game.scale, this.y - 110 * game.scale, 
                this.x + 30 * game.scale, this.y - 115 * game.scale, 
                this.x + 30 * game.scale, this.y - 90 * game.scale, 
                this.x + 5 * game.scale, this.y - 85 * game.scale);
            
            fill(this.colors.purple);
            rect(this.x, this.y - 25 * game.scale, this.width - 20 * game.scale, 40 * game.scale);
            
            fill(this.colors.dark);
            rect(this.x, this.y + 30 * game.scale, this.width - 20 * game.scale, 15 * game.scale);
            rect(this.x + 3 * game.scale, this.y - 60 * game.scale, this.width - 26 * game.scale, 40 * game.scale);
            
            quad(this.x - 5 * game.scale, this.y - 55 * game.scale, 
                this.x, this.y - 75 * game.scale, 
                this.x + 3 * game.scale, this.y - 50 * game.scale, 
                this.x - 1 * game.scale, this.y - 50 * game.scale);
            
            rect(this.x, this.y - 50 * game.scale, this.width - 20 * game.scale, 5 * game.scale);
            
            fill(this.colors.purple);
            rect(this.x + 3 * game.scale, this.y - 43 * game.scale, this.width - 26 * game.scale, 16 * game.scale);
        },
        
        moveRight: function() {
            this.x += 10 * game.scale;
            // Анимация движения вправо (как в оригинале)
            fill(this.colors.main);
            rect(this.x - 20 * game.scale, this.y - 75 * game.scale, this.width - 20 * game.scale, 80 * game.scale);
            ellipse(this.x - 10 * game.scale, this.y - 100 * game.scale, this.width, this.width);
            rect(this.x - 17 * game.scale, this.y - 85 * game.scale, 14 * game.scale, 10 * game.scale);
            rect(this.x - 18 * game.scale, this.y - 25 * game.scale, this.width - 24 * game.scale, 60 * game.scale);
            
            fill(this.colors.blue);
            triangle(this.x - 30 * game.scale, this.y - 115 * game.scale, 
                    this.x - 10 * game.scale, this.y - 130 * game.scale, 
                    this.x + 10 * game.scale, this.y - 110 * game.scale);
            quad(this.x - 30 * game.scale, this.y - 115 * game.scale, 
                this.x + 10 * game.scale, this.y - 110 * game.scale, 
                this.x - 5 * game.scale, this.y - 85 * game.scale, 
                this.x - 30 * game.scale, this.y - 90 * game.scale);
            quad(this.x + 23 * game.scale, this.y - 105 * game.scale, 
                this.x + 13 * game.scale, this.y - 120 * game.scale, 
                this.x - 5 * game.scale, this.y - 125 * game.scale, 
                this.x + 9 * game.scale, this.y - 75 * game.scale);
            
            fill(this.colors.purple);
            rect(this.x - 20 * game.scale, this.y - 25 * game.scale, this.width - 20 * game.scale, 40 * game.scale);
            
            fill(this.colors.dark);
            rect(this.x - 20 * game.scale, this.y + 30 * game.scale, this.width - 20 * game.scale, 15 * game.scale);
            rect(this.x - 17 * game.scale, this.y - 43 * game.scale, this.width - 26 * game.scale, 33 * game.scale);
            
            quad(this.x + 5 * game.scale, this.y - 55 * game.scale, 
                this.x, this.y - 75 * game.scale, 
                this.x - 1 * game.scale, this.y - 50 * game.scale, 
                this.x + 3 * game.scale, this.y - 50 * game.scale);
            
            rect(this.x - 20 * game.scale, this.y - 50 * game.scale, this.width - 20 * game.scale, 5 * game.scale);
            
            fill(this.colors.main);
            rect(this.x - 17 * game.scale, this.y - 50 * game.scale, this.width - 26 * game.scale, 7 * game.scale);
        },
        
        reset: function() {
            this.x = 110 * game.scale;
            this.y = 210 * game.scale;
            this.speedGravity = -7 * game.scale;
            this.grounded = false;
            this.dead = false;
            this.onPlatform = false;
            this.lastX = null;
        }
    };

    // Enemy
    enemy = {
        x: 430 * game.scale,
        y: 450 * game.scale,
        width: GAME_CONSTANTS.ENEMY_SIZE * game.scale,
        height: 60 * game.scale,
        borderLeft: 400 * game.scale,
        borderRight: 1700 * game.scale,
        speed: random(2, 5) * game.scale,
        direction: 2,
        dead: false,
        respawnTimer: null,
        lastX: null,
        
        draw: function() {
            if (this.dead) {
                this.drawDefeat();
                return;
            }
            
            noStroke();
            fill(75, 92, 96);
            rect(this.x - game.camera.offset - 33 * game.scale, this.y - 40 * game.scale, 30 * game.scale, 50 * game.scale);
            rect(this.x - game.camera.offset + 3 * game.scale, this.y - 40 * game.scale, 30 * game.scale, 50 * game.scale);
            
            fill(50, 76, 104);
            rect(this.x - game.camera.offset - 30 * game.scale, this.y - 80 * game.scale, this.width + 40 * game.scale, 40 * game.scale);
            
            strokeWeight(3 * game.scale);
            stroke(174, 124, 89);
            rect(this.x - game.camera.offset - 20 * game.scale, this.y - 70 * game.scale, this.width + 20 * game.scale, 30 * game.scale);
            noStroke();
            
            rect(this.x - game.camera.offset - 20 * game.scale, this.y - 120 * game.scale, 40 * game.scale, 40 * game.scale);
            triangle(this.x - game.camera.offset - 30 * game.scale, this.y - 42 * game.scale, 
                    this.x - game.camera.offset, this.y - 30 * game.scale, 
                    this.x - game.camera.offset + 30 * game.scale, this.y - 42 * game.scale);
            
            fill(45, 70, 94);
            rect(this.x - game.camera.offset - 55 * game.scale, this.y - 80 * game.scale, 25 * game.scale, 50 * game.scale);
            rect(this.x - game.camera.offset + 30 * game.scale, this.y - 80 * game.scale, 25 * game.scale, 50 * game.scale);
            
            fill(174, 124, 89);
            rect(this.x - game.camera.offset - 16 * game.scale, this.y - 105 * game.scale, 32 * game.scale, 25 * game.scale);
            rect(this.x - game.camera.offset - 60 * game.scale, this.y - 85 * game.scale, 32 * game.scale, 20 * game.scale);
            rect(this.x - game.camera.offset + 28 * game.scale, this.y - 85 * game.scale, 32 * game.scale, 20 * game.scale);
            rect(this.x - game.camera.offset - 5 * game.scale, this.y - 122 * game.scale, 10 * game.scale, 8 * game.scale);
            
            fill(42, 53, 50);
            rect(this.x - game.camera.offset - 35 * game.scale, this.y - 10 * game.scale, 32 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset + 3 * game.scale, this.y - 10 * game.scale, 32 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset - 57 * game.scale, this.y - 50 * game.scale, 27 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset + 30 * game.scale, this.y - 50 * game.scale, 27 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset - 60 * game.scale, this.y - 85 * game.scale, 16 * game.scale, 10 * game.scale);
            rect(this.x - game.camera.offset + 44 * game.scale, this.y - 85 * game.scale, 16 * game.scale, 10 * game.scale);
            rect(this.x - game.camera.offset - 18 * game.scale, this.y - 110 * game.scale, 36 * game.scale, 8 * game.scale);
            
            fill(155, 114, 86);
            ellipse(this.x - game.camera.offset, this.y - 87 * game.scale, 12 * game.scale, 12 * game.scale);
            ellipse(this.x - game.camera.offset - 12 * game.scale, this.y - 87 * game.scale, 6 * game.scale, 6 * game.scale);
            ellipse(this.x - game.camera.offset + 12 * game.scale, this.y - 87 * game.scale, 6 * game.scale, 6 * game.scale);
            
            fill(101, 109, 101);
            ellipse(this.x - game.camera.offset + 9 * game.scale, this.y - 96 * game.scale, 14 * game.scale, 6 * game.scale);
            ellipse(this.x - game.camera.offset - 9 * game.scale, this.y - 96 * game.scale, 14 * game.scale, 6 * game.scale);
        },
        
        drawDefeat: function() {
            noStroke();
            fill(66, 172, 229);
            rect(this.x - game.camera.offset - 33 * game.scale, this.y - 40 * game.scale, 30 * game.scale, 50 * game.scale);
            rect(this.x - game.camera.offset + 3 * game.scale, this.y - 40 * game.scale, 30 * game.scale, 50 * game.scale);
            rect(this.x - game.camera.offset - 30 * game.scale, this.y - 80 * game.scale, this.width + 40 * game.scale, 40 * game.scale);
            rect(this.x - game.camera.offset - 20 * game.scale, this.y - 120 * game.scale, 40 * game.scale, 40 * game.scale);
            rect(this.x - game.camera.offset - 55 * game.scale, this.y - 80 * game.scale, 25 * game.scale, 50 * game.scale);
            rect(this.x - game.camera.offset + 30 * game.scale, this.y - 80 * game.scale, 25 * game.scale, 50 * game.scale);
            rect(this.x - game.camera.offset - 60 * game.scale, this.y - 85 * game.scale, 32 * game.scale, 20 * game.scale);
            rect(this.x - game.camera.offset + 28 * game.scale, this.y - 85 * game.scale, 32 * game.scale, 20 * game.scale);
            rect(this.x - game.camera.offset - 5 * game.scale, this.y - 122 * game.scale, 10 * game.scale, 8 * game.scale);
            rect(this.x - game.camera.offset - 35 * game.scale, this.y - 10 * game.scale, 32 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset + 3 * game.scale, this.y - 10 * game.scale, 32 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset - 57 * game.scale, this.y - 50 * game.scale, 27 * game.scale, 23 * game.scale);
            rect(this.x - game.camera.offset + 30 * game.scale, this.y - 50 * game.scale, 27 * game.scale, 23 * game.scale);
            
            fill(226, 97, 198);
            textSize(20 * game.scale);
            text("XD", this.x - game.camera.offset - 12 * game.scale, this.y - 90 * game.scale);
        },
        
        update: function() {
            if (this.dead) {
                this.handleRespawn();
                return;
            }
            
            this.move();
        },
        
        move: function() {
            this.x += this.speed * this.direction;
            
            if (this.x <= this.borderLeft) {
                this.x = this.borderLeft;
                this.direction *= -1;
            } else if (this.x >= this.borderRight) {
                this.x = this.borderRight;
                this.direction *= -1;
            }
        },
        
        handleRespawn: function() {
            if (!this.respawnTimer) {
                this.respawnTimer = millis();
                this.speed = 0;
                return;
            }
            
            const elapsed = millis() - this.respawnTimer;
            if (elapsed >= 1000) {
                let newX;
                if (player.x < this.borderLeft + 150 * game.scale) {
                    newX = random(this.borderRight - 300 * game.scale, this.borderRight);
                } else if (player.x > this.borderRight - 150 * game.scale) {
                    newX = random(this.borderLeft, this.borderLeft + 300 * game.scale);
                } else {
                    newX = random(this.borderLeft, this.borderRight);
                    while (Math.abs(newX - player.x) < 150 * game.scale) {
                        newX = random(this.borderLeft, this.borderRight);
                    }
                }
                
                this.x = newX;
                this.y = 450 * game.scale;
                this.dead = false;
                this.direction *= -1;
                
                if (game.score <= 60) {
                    this.speed = random(2, 5) * game.scale;
                } else if (game.score > 100) {
                    this.speed = random(100) * game.scale;
                } else {
                    this.speed = random(8, 10) * game.scale;
                }
                
                this.respawnTimer = null;
                this.lastX = null;
            }
        },
        
        reset: function() {
            this.x = 430 * game.scale;
            this.y = 450 * game.scale;
            this.speed = random(2, 5) * game.scale;
            this.direction = 2;
            this.dead = false;
            this.respawnTimer = null;
            this.lastX = null;
        }
    };

    // Platforms
    generateRandomPlatforms();
    
    // Canyon
    canyons = [
        {
            x: 220 * game.scale,
            y: height - GAME_CONSTANTS.BASE_FLOOR * game.scale,
            width: 150 * game.scale,
            
            draw: function() {
                fill(148, 64, 77);
                rect(this.x - game.camera.offset, this.y, 150 * game.scale, height);
                
                strokeWeight(10 * game.scale);
                stroke(127, 137, 118);
                line(230 * game.scale - game.camera.offset, 380 * game.scale, 230 * game.scale - game.camera.offset, height);
                line(290 * game.scale - game.camera.offset, 380 * game.scale, 290 * game.scale - game.camera.offset, height);
                line(350 * game.scale - game.camera.offset, 380 * game.scale, 350 * game.scale - game.camera.offset, height);
                line(510 * game.scale - game.camera.offset, 380 * game.scale, 510 * game.scale - game.camera.offset, height);
                line(570 * game.scale - game.camera.offset, 380 * game.scale, 570 * game.scale - game.camera.offset, height);
                noStroke();
                
                fill(121, 132, 111);
                rect(220 * game.scale - game.camera.offset, 485 * game.scale, 150 * game.scale, height);
                
                fill(115, 127, 104);
                rect(220 * game.scale - game.camera.offset, 450 * game.scale, 40 * game.scale, height);
                rect(320 * game.scale - game.camera.offset, 440 * game.scale, 40 * game.scale, height);
                rect(270 * game.scale - game.camera.offset, 470 * game.scale, 40 * game.scale, height);
                
                fill(109, 122, 97);
                rect(230 * game.scale - game.camera.offset, 480 * game.scale, 40 * game.scale, height);
                rect(330 * game.scale - game.camera.offset, 460 * game.scale, 40 * game.scale, height);
                rect(280 * game.scale - game.camera.offset, 500 * game.scale, 40 * game.scale, height);
                
                fill(103, 117, 91);
                rect(220 * game.scale - game.camera.offset, 520 * game.scale, 40 * game.scale, height);
                rect(310 * game.scale - game.camera.offset, 510 * game.scale, 40 * game.scale, height);
                rect(260 * game.scale - game.camera.offset, 530 * game.scale, 40 * game.scale, height);
                
                fill(98, 112, 85);
                rect(330 * game.scale - game.camera.offset, 530 * game.scale, 40 * game.scale, height);
                rect(230 * game.scale - game.camera.offset, 540 * game.scale, 40 * game.scale, height);
                rect(290 * game.scale - game.camera.offset, 555 * game.scale, 40 * game.scale, height);
                
                fill(49, 56, 44);
                triangle(this.x - game.camera.offset, this.y + 40 * game.scale, 
                        this.x - game.camera.offset, this.y + 70 * game.scale, 
                        this.x - game.camera.offset + 30 * game.scale, this.y + 70 * game.scale);
                triangle(this.x - game.camera.offset + 150 * game.scale, this.y + 40 * game.scale, 
                        this.x - game.camera.offset + 150 * game.scale, this.y + 70 * game.scale, 
                        this.x - game.camera.offset + 120 * game.scale, this.y + 70 * game.scale);
                
                fill(60, 68, 54);
                quad(this.x - game.camera.offset, this.y, 
                    this.x - game.camera.offset + 30 * game.scale, this.y + 30 * game.scale,  
                    this.x - game.camera.offset + 30 * game.scale, this.y + 70 * game.scale, 
                    this.x - game.camera.offset, this.y + 40 * game.scale);
                quad(this.x - game.camera.offset + 120 * game.scale, this.y + 30 * game.scale,  
                    this.x - game.camera.offset + 150 * game.scale, this.y, 
                    this.x - game.camera.offset + 150 * game.scale, this.y + 40 * game.scale, 
                    this.x - game.camera.offset + 120 * game.scale, this.y + 70 * game.scale);
            }
        }
    ];

    // Sky
    sky = {
        width: GAME_CONSTANTS.LEVEL_WIDTH * game.scale,
        height: 440 * game.scale,
        colors: {
            top: color(228, 41, 85),
            middle: color(208, 47, 83),
            bottom: color(181, 55, 80)
        },
        
        draw: function() {
            fill(this.colors.bottom);
            rect(0 - game.camera.offset, 0, this.width, this.height);
            
            fill(this.colors.middle);
            rect(0 - game.camera.offset, 0, this.width, this.height - 52 * game.scale);
            
            fill(this.colors.top);
            rect(0 - game.camera.offset, 0, this.width, this.height - 104 * game.scale);
        }
    };

    // Piltover
    piltover = {
        draw: function() {
            fill(151, 158, 145);
            rect(50 * game.scale - game.camera.offset, 270 * game.scale, 100 * game.scale, height);
            
            fill(144, 153, 137);
            rect(70 * game.scale - game.camera.offset, 130 * game.scale, 60 * game.scale, height);
            
            fill(136, 145, 128);
            ellipse(100 * game.scale - game.camera.offset, 110 * game.scale, 60 * game.scale, 60 * game.scale);
            
            fill(144, 153, 137);
            ellipse(103 * game.scale - game.camera.offset, 107 * game.scale, 55 * game.scale, 55 * game.scale);
            
            fill(121, 133, 110);
            ellipse(122 * game.scale - game.camera.offset, 110 * game.scale, 12 * game.scale, 27 * game.scale);
            
            fill(138, 147, 130);
            rect(30 * game.scale - game.camera.offset, 320 * game.scale, 60 * game.scale, height);
            rect(110 * game.scale - game.camera.offset, 320 * game.scale, 60 * game.scale, height);
            
            fill(127, 137, 118);
            rect(170 * game.scale - game.camera.offset, 370 * game.scale, GAME_CONSTANTS.LEVEL_WIDTH * game.scale, 10 * game.scale);
            
            strokeWeight(10 * game.scale);
            stroke(127, 137, 118);
            line(230 * game.scale - game.camera.offset, 380 * game.scale, 230 * game.scale - game.camera.offset, height);
            line(290 * game.scale - game.camera.offset, 380 * game.scale, 290 * game.scale - game.camera.offset, height);
            line(350 * game.scale - game.camera.offset, 380 * game.scale, 350 * game.scale - game.camera.offset, height);
            line(510 * game.scale - game.camera.offset, 380 * game.scale, 510 * game.scale - game.camera.offset, height);
            line(570 * game.scale - game.camera.offset, 380 * game.scale, 570 * game.scale - game.camera.offset, height);
            noStroke();
            
            fill(121, 132, 111);
            rect(410 * game.scale - game.camera.offset, 320 * game.scale, 40 * game.scale, height);
            
            fill(113, 124, 103);
            triangle(405 * game.scale - game.camera.offset, 320 * game.scale, 
                    430 * game.scale - game.camera.offset, 290 * game.scale, 
                    455 * game.scale - game.camera.offset, 320 * game.scale);
        }
    };

    // Clouds
    clouds = {
        x: random(0, width/2),
        y: random(30 * game.scale, 150 * game.scale),
        w: random(width/2, width),
        s: random(180 * game.scale, 300 * game.scale),
        borderLeft: -400 * game.scale,
        borderRight: width + 400 * game.scale,
        speed: random(2, 4) * game.scale,
        speed2: random(2, 4) * game.scale,
        direction: 1,
        direction2: 1,
        
        draw: function() {
            noStroke();
            fill(226, 90, 124, 200);
            ellipse(this.x, this.y, 150 * game.scale, 100 * game.scale);
            
            fill(229, 78, 115, 200);
            ellipse(this.x - 70 * game.scale, this.y + 20 * game.scale, 120 * game.scale, 70 * game.scale);
            rect(this.x - 130 * game.scale, this.y + 20 * game.scale, 120 * game.scale, 35 * game.scale, 0, 0, 20 * game.scale, 20 * game.scale);
            
            fill(234, 84, 121, 200);
            ellipse(this.x + 40 * game.scale, this.y + 30 * game.scale, 160 * game.scale, 50 * game.scale);
            rect(this.x - 40 * game.scale, this.y + 30 * game.scale, 160 * game.scale, 25 * game.scale, 0, 0, 20 * game.scale, 20 * game.scale);
            
            fill(226, 90, 124, 200);
            ellipse(this.w, this.s, 150 * game.scale, 100 * game.scale);
            
            fill(229, 78, 115, 200);
            ellipse(this.w - 70 * game.scale, this.s + 20 * game.scale, 120 * game.scale, 70 * game.scale);
            rect(this.w - 130 * game.scale, this.s + 20 * game.scale, 120 * game.scale, 35 * game.scale, 0, 0, 20 * game.scale, 20 * game.scale);
            
            fill(234, 84, 121, 200);
            ellipse(this.w + 40 * game.scale, this.s + 30 * game.scale, 160 * game.scale, 50 * game.scale);
            rect(this.w - 40 * game.scale, this.s + 30 * game.scale, 160 * game.scale, 25 * game.scale, 0, 0, 20 * game.scale, 20 * game.scale);
        },
        
        update: function() {
            this.x += this.speed * this.direction;
            if (this.x <= this.borderLeft) {
                this.x += this.borderLeft - this.x;
                this.direction *= -1;
                this.y = random(30 * game.scale, 150 * game.scale);
                this.speed = random(2, 4) * game.scale;
            } else if (this.x >= this.borderRight) {
                this.x -= this.x - this.borderRight;
                this.direction *= -1;
                this.y = random(30 * game.scale, 150 * game.scale);
                this.speed = random(2, 4) * game.scale;
            }

            this.w += this.speed2 * this.direction2;
            if (this.w <= this.borderLeft) {
                this.w += this.borderLeft - this.w;
                this.direction2 *= -1;
                this.s = random(180 * game.scale, 300 * game.scale);
                this.speed2 = random(2, 4) * game.scale;
            } else if (this.w >= this.borderRight) {
                this.w -= this.w - this.borderRight;
                this.direction2 *= -1;
                this.s = random(180 * game.scale, 300 * game.scale);
                this.speed2 = random(2, 4) * game.scale;
            }
        }
    };

    // Building
    building = {
        draw: function() {
            fill(81, 91, 75);
            rect(600 * game.scale - game.camera.offset, 0, GAME_CONSTANTS.LEVEL_WIDTH * game.scale, height);
            
            fill(94, 102, 87);
            rect(580 * game.scale - game.camera.offset, 0, 20 * game.scale, height);
        }
    };

    // Floor
    floor = {
        height: GAME_CONSTANTS.BASE_FLOOR * game.scale,
        color: color(40, 45, 36),
        
        draw: function() {
            noStroke();
            fill(this.color);
            rect(0 - game.camera.offset, height - this.height, GAME_CONSTANTS.LEVEL_WIDTH * game.scale, this.height);
            
            fill(60, 68, 54);
            rect(0 - game.camera.offset, height - this.height, GAME_CONSTANTS.LEVEL_WIDTH * game.scale, 40 * game.scale);
            
            fill(49, 56, 44);
            rect(0 - game.camera.offset, height - 100 * game.scale, GAME_CONSTANTS.LEVEL_WIDTH * game.scale, 30 * game.scale);
            rect(210 * game.scale - game.camera.offset, height - this.height + 40 * game.scale, 170 * game.scale, 220 * game.scale);
        }
    };
}

function generateRandomPlatforms() {
    platforms = [];
    const minX = 0 * game.scale;
    const maxX = 1600 * game.scale;
    const minDistance = 250 * game.scale;
    const platformCount = Math.floor(random(1, 3)); 
    
    let lastX = minX;
    
    for (let i = 0; i < platformCount; i++) {
        let x = lastX + minDistance + random(50, 300) * game.scale;
        if (x > maxX) break;
        
        platforms.push({
            x: x,
            y: 250 * game.scale,
            width: GAME_CONSTANTS.PLATFORM_SIZE * game.scale,
            height: 20 * game.scale,
            color: color(148, 64, 77),
            metalColor: color(174, 124, 89),
            
            draw: function() {
                fill(this.color);
                rect(this.x - game.camera.offset, height - this.y - this.height * 2, this.width, this.height);
                
                fill(this.metalColor);
                rect(this.x - game.camera.offset, height - this.y - this.height * 2, this.width, 3 * game.scale);
                rect(this.x - game.camera.offset, height - this.y - this.height * 2 + 17 * game.scale, this.width, 3 * game.scale);
                
                fill(75, 92, 96);
                ellipse(this.x - game.camera.offset + 15 * game.scale, height - this.y - this.height * 2 + 10 * game.scale, 8 * game.scale, 8 * game.scale);
                ellipse(this.x - game.camera.offset + this.width - 15 * game.scale, height - this.y - this.height * 2 + 10 * game.scale, 8 * game.scale, 8 * game.scale);
            },
            
            checkCollision: function(player) {
                const platformX = this.x - game.camera.offset;
                return player.x + player.width > platformX && 
                       player.x < platformX + this.width &&
                       height - (player.y + player.height + 2 * game.scale) + this.height > height - GAME_CONSTANTS.BASE_FLOOR * game.scale - this.y && 
                       height - (player.y + player.height + 2 * game.scale) + this.height < height - GAME_CONSTANTS.BASE_FLOOR * game.scale - this.y + 5 * game.scale &&
                       player.speedGravity <= 0;
            }
        });
        
        lastX = x;
    }
}

function createMenuEffects() {
    for (let i = 0; i < 15; i++) {
        paintSplatters.push({
            x: random(width),
            y: random(height),
            size: random(50, 200),
            color: color(random(200, 255), random(50, 150), random(100, 200), random(100, 200)),
            rotation: random(360),
            speed: random(0.2, 0.8)
        });
    }
}

function updateDeadZone() {
    game.camera.deadLeft = width/2 - width * GAME_CONSTANTS.DEAD_ZONE/2;
    game.camera.deadRight = width/2 + width * GAME_CONSTANTS.DEAD_ZONE/2;
}

function updateCamera() {
    const targetOffset = player.x - width / 2;
    const lerpFactor = 0.1;
    
    // Ограничиваем targetOffset, чтобы камера не уходила дальше 1700
    const maxCameraOffset = 1700 * game.scale - width;
    game.camera.offset = lerp(
        game.camera.offset, 
        constrain(targetOffset, 0, maxCameraOffset), 
        lerpFactor
    );
}

function startGame() {
    game.started = true;
    audio.bgMusic.play();
    select('#startButton').style('display', 'none');
    select('.slider-container').addClass('visible');
}

function restartGame() {
    player.reset();
    enemy.reset();
    generateRandomPlatforms(); // Важно: пересоздаем платформы
    game.score = 0;
    game.camera.offset = 0;
    audio.bgMusic.currentTime = 0;
    audio.bgMusic.play();
    audio.gameOver.pause();
    select('#restartButton').style('display', 'none');
    select('#restartButton').style('opacity', '0');
}

function keyPressed() {
    if (keyCode === 77) { // M key
        game.muted = !game.muted;
        audio.bgMusic.volume = game.muted ? 0 : ui.musicSlider.value();
    }
    
    if (keyCode === ESCAPE) { // ESC key
        ui.sliderContainer.toggleClass('visible');
    }
}

function draw() {
    if (!game.started) {
        drawMenu();
        return;
    }
    
    updateCamera();
    background(148, 64, 77);
    
    // Рисуем игровой мир с учетом камеры
    push();
    translate(-game.camera.offset, 0);
    
    sky.draw();
    piltover.draw();
    clouds.draw();
    building.draw();
    floor.draw();
    
    platforms.forEach(p => p.draw());
    canyons.forEach(c => c.draw());
    enemy.draw();
    
    pop();
    
    clouds.update();
    
    player.update();
    player.draw();
    
    enemy.update();
    
    drawUI();
    
    if (player.dead) {
        showGameOver();
    }
}

function drawMenu() {
    background(20, 25, 35);
    
    paintSplatters.forEach(s => {
        push();
        translate(s.x, s.y);
        rotate(radians(s.rotation));
        noStroke();
        fill(s.color);
        
        beginShape();
        for (let i = 0; i < 10; i++) {
            let angle = map(i, 0, 10, 0, TWO_PI);
            let r = s.size * 0.5;
            let x = r * cos(angle) * random(0.8, 1.2);
            let y = r * sin(angle) * random(0.8, 1.2);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
        
        s.rotation += random(-1, 1);
        s.x += random(-0.5, 0.5);
        s.y += random(-0.5, 0.5);
    });
    
    drawingContext.shadowBlur = 15 * game.scale;
    drawingContext.shadowColor = color(232, 65, 120);
    fill(255);
    textSize(40 * game.scale);
    textAlign(CENTER, CENTER);
    text("PAINT THE TOWN", width/2, height/2 - 60 * game.scale);
    
    textSize(60 * game.scale);
    fill(232, 65, 120);
    text("BLUE", width/2, height/2 + 10 * game.scale);
    
    drawingContext.shadowBlur = 10 * game.scale;
    drawingContext.shadowColor = color(74, 105, 189);
    fill(255);
    textSize(16 * game.scale);
    text("PRESS START TO BEGIN", width/2, height/2 + 80 * game.scale);
    
    drawingContext.shadowBlur = 0;
}

function drawUI() {
    drawingContext.shadowBlur = 8 * game.scale;
    drawingContext.shadowColor = color(232, 65, 120);
    fill(255);
    textSize(24 * game.scale);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text("SCORE: " + game.score, 20 * game.scale, 20 * game.scale);
    drawingContext.shadowBlur = 0;
}

function showGameOver() {
    showRestartButton();
    
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    drawingContext.shadowBlur = 20 * game.scale;
    drawingContext.shadowColor = color(232, 65, 120);
    fill(255, 0, 0);
    textSize(60 * game.scale);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2 - 50 * game.scale);
    
    drawingContext.shadowBlur = 15 * game.scale;
    drawingContext.shadowColor = color(74, 105, 189);
    fill(255);
    textSize(24 * game.scale);
    text("SCORE: " + game.score, width/2, height/2 + 20 * game.scale);
    
    drawingContext.shadowBlur = 0;
}

function showRestartButton() {
    select('#restartButton').style('display', 'block');
    select('#restartButton').style('opacity', '1');
    
    if (frameCount % 60 < 30) {
        select('#restartButton').style('transform', 'translate(-50%, -50%) scale(1.02)');
    } else {
        select('#restartButton').style('transform', 'translate(-50%, -50%) scale(0.98)');
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    game.scale = min(width / 1024, height / 576);
    updateDeadZone();
}