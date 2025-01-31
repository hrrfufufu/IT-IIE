let player;
let sky;
let piltover;
let clouds;
let building;
let floor;
let score = 0;
let enemy;
var background_music = new Audio("PaintTheTownBlue.mp3");
var gameover_se = new Audio("GameOver.mp3");
var kill_se = new Audio("shot.wav");
let countCanyons = 1;
let canyons = [];

function setup() {
    createCanvas(1024, 576);
    background_music.volume = 0.2;
    gameover_se.volume = 0.45;
    kill_se.volume = 0.45;
    player = {
        x: 110,
        y: 210,
        width: 40,
        height: 160,
        speedGravity: -7,
        color1: color(202, 190, 215), // skin
        color2: color(45, 35, 40), // clothes
        color3: color(128, 89, 174), // clothes2
        color4: color(220, 84, 210), // eyes
        color5: color(93, 127, 195), // hair
        color6: color(153, 198, 219), // tattoos
        grounded: false,
        dead: false,
        moveLeft: false,
        moveRight: false,
        lastX: null, // Переменная для хранения последнего значения x
        drawPlayer: function () {
            // Проверяем, изменилось ли значение x или персонаж умер
            if ((this.lastX !== this.x) || this.dead) {
                // Обновляем положение персонажа
                fill(this.color1);
                rect(this.x - 10, this.y - 65, 10, 10); // cube
                // Сохраняем новое значение x
                this.lastX = this.x;
            } else {
                noStroke();
                fill(this.color1);
                ellipse(this.x, this.y - 100, this.width, this.width); // head
                rect(this.x - 20, this.y - 75, this.width, 60); // body
                rect(this.x + 5, this.y - 15, this.width - 25, 60); // legs
                rect(this.x - 20, this.y - 15, this.width - 25, 60);
                rect(this.x - 70, this.y - 75, 50, this.width - 27); // arms
                rect(this.x + 20, this.y - 75, 50, this.width - 27);
                rect(this.x - 7, this.y - 85, 14, 10); // neck
                fill(this.color4); // eyes
                ellipse(this.x - 9, this.y - 96, 8, 8);
                ellipse(this.x + 9, this.y - 96, 8, 8);
                fill(this.color2);
                rect(this.x + 5, this.y + 30, this.width - 25, 15); // boots
                rect(this.x - 20, this.y + 30, this.width - 25, 15);
                rect(this.x - 70, this.y - 75, 25, this.width - 27); // bandages
                rect(this.x + 30, this.y - 75, 40, this.width - 27);
                quad(this.x - 12, this.y - 75, this.x + 12, this.y - 75, this.x + 20, this.y - 45, this.x - 20, this.y - 45); // top
                fill(this.color3);
                rect(this.x - 20, this.y - 25, this.width, 10); // pants
                rect(this.x + 5, this.y - 15, this.width - 25, 30);
                rect(this.x - 20, this.y - 15, this.width - 25, 30);
                rect(this.x + 47, this.y - 75, 16, this.width - 27); // bandage
                fill(this.color5);
                triangle(this.x - 20, this.y - 120, this.x, this.y - 105, this.x + 20, this.y - 120); // hair
                triangle(this.x - 22, this.y - 95, this.x - 19, this.y - 130, this.x + 2, this.y - 120);
                triangle(this.x - 2, this.y - 120, this.x + 19, this.y - 130, this.x + 22, this.y - 95);
                triangle(this.x - 33, this.y - 105, this.x - 19, this.y - 75, this.x, this.y - 120);
            }
        },
        
        gravity: function (floor) {
            if (this.speedGravity > -7)
                this.speedGravity--;
            if (this.y + 30 < height - floor.height)
                this.y -= this.speedGravity;
            else {
                this.grounded = true;
            }
        },
        jump: function () {
            this.speedGravity = 19;
            this.y -= this.speedGravity;
            this.grounded = false;
        },
        moveLeft: function () {
            this.x = this.x - 10;
            fill(this.color5); // fringe
            quad(this.x - 23, this.y - 105, this.x - 13, this.y - 120, this.x + 5, this.y - 125, this.x - 9, this.y - 75);
            fill(this.color1);
            rect(this.x, this.y - 75, this.width - 20, 80); // body
            rect(this.x + 3, this.y - 85, 14, 10); // neck
            ellipse(this.x + 10, this.y - 100, this.width, this.width); //head
            rect(this.x + 2, this.y - 25, this.width - 24, 60); // legs
            fill(this.color4); // eyes
            ellipse(this.x - 10, this.y - 96, 4, 8);
            fill(this.color5); // hair
            triangle(this.x - 10, this.y - 110, this.x + 10, this.y - 130, this.x + 30, this.y - 115);
            quad(this.x - 10, this.y - 110, this.x + 30, this.y - 115, this.x + 30, this.y - 90, this.x + 5, this.y - 85);
            fill(this.color3);
            rect(this.x, this.y - 25, this.width - 20, 40); // pants
            fill(this.color2);
            rect(this.x, this.y + 30, this.width - 20, 15); // boots
            rect(this.x + 3, this.y - 60, this.width - 26, 40); // bandages
            quad(this.x - 5, this.y - 55, this.x, this.y - 75, this.x + 3, this.y - 50, this.x - 1, this.y - 50); // top
            rect(this.x, this.y - 50, this.width - 20, 5)
            fill(this.color3);
            rect(this.x + 3, this.y - 43, this.width - 26, 16); // bandage
        },
        moveRight: function () {
            this.x = this.x + 10;
            fill(this.color1);
            rect(this.x - 20, this.y - 75, this.width - 20, 80); // body
            ellipse(this.x - 10, this.y - 100, this.width, this.width); // head
            rect(this.x - 17, this.y - 85, 14, 10); // neck
            rect(this.x - 18, this.y - 25, this.width - 24, 60); // legs
            fill(this.color5); // hair
            triangle(this.x - 30, this.y - 115, this.x - 10, this.y - 130, this.x + 10, this.y - 110);
            quad(this.x - 30, this.y - 115, this.x + 10, this.y - 110, this.x - 5, this.y - 85, this.x - 30, this.y - 90);
            quad(this.x + 23, this.y - 105, this.x + 13, this.y - 120, this.x - 5, this.y - 125, this.x + 9, this.y - 75);
            fill(this.color3);
            rect(this.x - 20, this.y - 25, this.width - 20, 40); // pants
            fill(this.color2);
            rect(this.x - 20, this.y + 30, this.width - 20, 15); // boots
            rect(this.x - 17, this.y - 43, this.width - 26, 33); // bandages
            quad(this.x + 5, this.y - 55, this.x, this.y - 75, this.x - 1, this.y - 50, this.x + 3, this.y - 50); // top
            rect(this.x - 20, this.y - 50, this.width - 20, 5)
            fill(this.color1);
            rect(this.x - 17, this.y - 50, this.width - 26, 7) // hand

        },
        movement: function () {
            if (!this.dead) {
                if (this.grounded && keyIsDown(32))
                    this.jump();
                if (keyIsDown(68))
                    this.moveRight();
                if (keyIsDown(65))
                    this.moveLeft();
            }
        },

        fallAnimation: function () {
            if (this.dead) {
                // Условие для проверки падения персонажа
                if (this.y - 200 < height) {
                    this.y -= this.speedGravity;
                    background_music.volume = 0;
                    gameover_se.play(); // Звук проигрывается сразу после смерти
                    fill(this.color1);
                    ellipse(this.x, this.y - 100, this.width, this.width); // head
                    rect(this.x - 20, this.y - 75, this.width, 60); // body
                    rect(this.x + 5, this.y - 15, this.width - 25, 60); // legs
                    rect(this.x - 20, this.y - 15, this.width - 25, 60);
                    rect(this.x - 7, this.y - 85, 14, 10); // neck
                    rect(this.x - 27, this.y - 125, this.width - 27, 50); // arms
                    rect(this.x + 14, this.y - 125, this.width - 27, 50);
                    fill(this.color4); // eyes
                    ellipse(this.x - 9, this.y - 96, 8, 8);
                    ellipse(this.x + 9, this.y - 96, 8, 8);
                    fill(this.color2);
                    rect(this.x + 5, this.y + 30, this.width - 25, 15); // boots
                    rect(this.x - 20, this.y + 30, this.width - 25, 15);
                    rect(this.x - 27, this.y - 125, this.width - 27, 25); // bandages
                    rect(this.x + 14, this.y - 125, this.width - 27, 40);
                    quad(this.x - 12, this.y - 75, this.x + 12, this.y - 75, this.x + 20, this.y - 45, this.x - 20, this.y - 45); // top
                    fill(this.color3);
                    rect(this.x - 20, this.y - 25, this.width, 10); // pants
                    rect(this.x + 5, this.y - 15, this.width - 25, 30);
                    rect(this.x - 20, this.y - 15, this.width - 25, 30);
                    rect(this.x + 14, this.y - 117, this.width - 27, 15);
                    fill(this.color5);
                    triangle(this.x - 20, this.y - 120, this.x, this.y - 105, this.x + 20, this.y - 120); // hair
                    triangle(this.x - 22, this.y - 95, this.x - 19, this.y - 130, this.x + 2, this.y - 120);
                    triangle(this.x - 2, this.y - 120, this.x + 19, this.y - 130, this.x + 22, this.y - 95);
                    triangle(this.x - 33, this.y - 105, this.x - 19, this.y - 75, this.x, this.y - 120);
                }
                
                // Проверяем наличие таймера респавна
                if (!this.respawnTimer) {
                    this.respawnTimer = millis();
                }
                
                // Проверяем прошло ли достаточно времени для респавна
                if (millis() - this.respawnTimer >= 7000) {
                    // Устанавливаем начальные значения для персонажа
                    this.dead = false;
                    this.x = 110;
                    this.y = 210; // Обновляем позицию Y, чтобы избежать ошибок с падением
                    this.speedGravity = -7; 
                    this.respawnTimer = null; // Сброс таймера респавна
                    this.lastX = null;
                    background_music.volume = 0.2;
                }
            }
        },

        caughtAnimation: function() {
            if (this.dead && this.x > 370) {
                noStroke ();
                fill(this.color1);
                ellipse(this.x, this.y - 95, this.width, this.width); // head
                rect(this.x - 20, this.y - 75, this.width, 60); // body
                rect(this.x - 7, this.y - 85, 14, 10); // neck
                fill(this.color4); // eyes
                ellipse(this.x - 9, this.y - 91, 8, 8);
                ellipse(this.x + 9, this.y - 91, 8, 8);
                fill(this.color5);
                triangle(this.x - 20, this.y - 115, this.x, this.y - 100, this.x + 20, this.y - 115); // hair
                triangle(this.x - 22, this.y - 90, this.x - 19, this.y - 125, this.x + 2, this.y - 115);
                triangle(this.x - 2, this.y - 115, this.x + 19, this.y - 125, this.x + 22, this.y - 90);
                triangle(this.x - 33, this.y - 100, this.x - 19, this.y - 70, this.x, this.y - 115);
                fill(64, 58, 76);
                rect(this.x - 20, this.y - 75, this.width, 60); // top
                rect(this.x + 3, this.y - 15, this.width - 25, 60); // pants
                rect(this.x - 18, this.y - 15, this.width - 25, 60);
                fill(131, 145, 173); // stripes
                rect(this.x - 20, this.y - 75, this.width, 10);
                rect(this.x - 20, this.y - 55, this.width, 10);
                rect(this.x - 20, this.y - 35, this.width, 10);
                fill(this.color1);
                rect(this.x + 15, this.y - 70, this.width - 27, 60); // arms
                rect(this.x - 28, this.y - 70, this.width - 27, 60);                
            } 
        },
        
        
        checkEnemy: function() {
            const playerBottom = player.y + player.height;
            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + enemy.height;
            // Проверка столкновения игрока с врагом по вертикали
            if (!this.dead && !enemy.dead) {
                if (!this.grounded) {
                    if (playerBottom > enemyTop && player.y < enemyBottom) {
                        if (Math.abs(player.x - enemy.x) < 50) {

                        kill_se.play();
                        enemy.dead = true;
                        score += 10;
                        }
                    }
                }
            } 
            
            // Проверка столкновения игрока с врагом сбоку 
            if (!this.dead && !enemy.dead) {
                if (this.x >= enemy.x && this.x <= enemy.x + enemy.width) {
                    if (playerBottom > enemyTop) {
                    this.dead = true;
                    score = 0; // Сброс очков до нуля
                    background_music.volume = 0;
                    gameover_se.play(); // Звук проигрывается сразу после смерти
                    this.caughtAnimation();

                } else {
                    return;
                }
                    // Проверяем наличие таймера респавна
                    if (!this.respawnTimer) {
                        this.respawnTimer = millis();
                        this.caughtAnimation();
                    }
                }
            }
            
                
                // Проверяем прошло ли достаточно времени для респавна
                if (this.dead && this.respawnTimer && millis() - this.respawnTimer >= 7000) {
                    // Устанавливаем начальные значения для персонажа
                    this.dead = false;
                    this.x = 110;
                    this.y = 210; // Обновляем позицию Y, чтобы избежать ошибок с падением
                    this.speedGravity = -7; 
                    this.respawnTimer = null; // Сброс таймера респавна
                    this.lastX = null;
                    background_music.volume = 0.2;
                
                }
        },
        checkOutside: function () {
            if (this.x < -10)
                this.x = width - this.width + 50;
            if (this.x > width + 10)
                this.x = -10;
        },
        checkCanyon: function () {
            for (let i = 0; i < canyons.length; i++) {
                if
                    (
                    this.y + this.height >= height - floor.height + 100 &&
                    this.x >= canyons[i].x &&
                    this.x + this.width <= canyons[i].x + canyons[i].width
                ) {
                    this.grounded = false;
                    this.dead = true;
                    this.fallAnimation();
                }
            }
        }

    };

    sky =
    {
        x: 0,
        y: 0,
        width: 1024,
        height: 440,
        color1: color(181, 55, 80),
        color2: color(208, 47, 83),
        color3: color(228, 41, 85),
        drawSky: function () {
            fill(this.color1);
            rect(this.x, this.y, this.width, this.height);
            fill(this.color2);
            rect(this.x, this.y, this.width, this.height - 52);
            fill(this.color3);
            rect(this.x, this.y, this.width, this.height - 104);
        },
    }

    piltover = {
        drawPiltover: function() {
            fill(151, 158, 145) //hexgate
            rect(50, 270, 100, height)
            fill(144, 153, 137)
            rect(70, 130, 60, height)
            fill(136, 145, 128)
            ellipse(100, 110, 60, 60)
            fill(144, 153, 137)
            ellipse(103, 107, 55, 55)
            fill(121, 133, 110)
            ellipse(122, 110, 12, 27)
            fill(138, 147, 130)
            rect(30, 320, 60, height)
            rect(110, 320, 60, height)
            fill(127, 137, 118) //bridge
            rect(170, 370, width, 10) 
            strokeWeight(10)
            stroke(127, 137, 118) 
            line(230, 380, 230, height)
            line(290, 380, 290, height)
            line(350, 380, 350, height)
            line(510, 380, 510, height)
            line(570, 380, 570, height)
            noStroke()
            fill(121, 132, 111)
            rect(410, 320, 40, height)
            fill(113, 124, 103)
            triangle(405, 320, 430, 290, 455, 320)
        }
    }

    clouds = {
        x: random(0, 512),
        y: random(30, 150),
        w: random(512, 1024),
        s: random(180, 300),
        borderLeft: -400,
        borderRight: 900,
        speed: random(2, 4),
        speed2: random(2, 4),
        direction: 1,
        direction2: 1,
        drawClouds: function () {
            noStroke();
            fill(226, 90, 124, 200); //cloud1
            ellipse(this.x, this.y, 150, 100);
            fill(229, 78, 115, 200);
            ellipse(this.x - 70, this.y + 20, 120, 70);
            rect(this.x - 130, this.y + 20, 120, 35, 0, 0, 20, 20);
            fill(234, 84, 121, 200);
            ellipse(this.x + 40, this.y + 30, 160, 50);
            rect(this.x - 40, this.y + 30, 160, 25, 0, 0, 20, 20);
            fill(226, 90, 124, 200);

            ellipse(this.w, this.s, 150, 100); //cloud2
            fill(229, 78, 115, 200);
            ellipse(this.w - 70, this.s + 20, 120, 70);
            rect(this.w - 130, this.s + 20, 120, 35, 0, 0, 20, 20);
            fill(234, 84, 121, 200);
            ellipse(this.w + 40, this.s + 30, 160, 50);
            rect(this.w - 40, this.s + 30, 160, 25, 0, 0, 20, 20);
        },
    
        movement: function () {
            this.x += this.speed * this.direction; //cloud1
            if (this.x <= this.borderLeft) {
                this.x += this.borderLeft - this.x;
                this.direction *= -1;
            } else if (this.x >= this.borderRight) {
                this.x -= this.x - this.borderRight;
                this.direction *= -1;
            }

            this.w += this.speed2 * this.direction2; //cloud2
            if (this.w <= this.borderLeft) {
                this.w += this.borderLeft - this.w;
                this.direction2 *= -1;
            } else if (this.w >= this.borderRight) {
                this.w -= this.w - this.borderRight;
                this.direction2 *= -1;
            }
        }
    }
        
    building = {
        drawBuilding: function () {
            fill(81, 91, 75); 
            rect(600, 0, width, height);
            fill(94, 102, 87);
            rect(580, 0, 20, height);
        }
    }

    floor = {
        height: 140,
        color: color(40, 45, 36),
        drawFloor: function () {
            noStroke();
            fill(this.color);
            rect(0, height - this.height, width, this.height);
            fill(60, 68, 54);
            rect(0, height - this.height, width, 40);
            fill(49, 56, 44);
            rect(0, height - 100, width, 30);
            rect(210, height - this.height + 40, 170, 220)
        },
    }

    enemy = {
        x: 430,
        y: 450,
        width: 20,
        height: 60,
        borderLeft: 400,
        borderRight: 900,
        speed: random(2,5),
        direction: 1,
        dead: false,
        lastX: null,
    
        draw: function () { // enforcer
            noStroke();
            fill(75, 92, 96); // legs
            rect(this.x - 33, this.y - 40, 30, 50);
            rect(this.x + 3, this.y - 40, 30, 50);
            fill(50, 76, 104);
            rect(this.x - 30, this.y - 80, this.width + 40, 40); // body
            strokeWeight(3);
            stroke(174, 124, 89);
            rect(this.x - 20, this.y - 70, this.width + 20, 30);
            noStroke();
            rect(this.x - 20, this.y - 120, 40, 40) // head
            triangle(this.x - 30, this.y - 42, this.x, this.y - 30, this.x + 30, this.y - 42)
            fill(45, 70, 94); // arms
            rect(this.x - 55, this.y - 80, 25, 50);
            rect(this.x + 30, this.y - 80, 25, 50);
            fill(174, 124, 89)
            rect(this.x - 16, this.y - 105, 32, 25); // mask
            rect(this.x - 60, this.y - 85, 32, 20); // pauldrons
            rect(this.x + 28, this.y - 85, 32, 20);
            rect(this.x - 5, this.y - 122, 10, 8); // sign
            fill(42, 53, 50);
            rect(this.x - 35, this.y - 10, 32, 23); // boots
            rect(this.x + 3, this.y - 10, 32, 23);
            rect(this.x - 57, this.y - 50, 27, 23); // gloves
            rect(this.x + 30, this.y - 50, 27, 23);
            rect(this.x - 60, this.y - 85, 16, 10); // pauldrons
            rect(this.x + 44, this.y - 85, 16, 10);
            rect(this.x - 18, this.y - 110, 36, 8); // cap
            fill(155, 114, 86);
            ellipse(this.x, this.y - 87, 12, 12);
            ellipse(this.x - 12, this.y - 87, 6, 6);
            ellipse(this.x + 12, this.y - 87, 6, 6);
            fill(101, 109, 101);
            ellipse(this.x + 9, this.y - 96, 14, 6);
            ellipse(this.x - 9, this.y - 96, 14, 6);
        },
    
        movement: function () {
            this.x += this.speed * this.direction;
            if (this.x <= this.borderLeft) {
                this.x += this.borderLeft - this.x;
                this.direction *= -1;
            } else if (this.x >= this.borderRight) {
                this.x -= this.x - this.borderRight;
                this.direction *= -1;
            }
        },

        defeatAnimation: function () {
            if (this.dead) {                
                noStroke();
                fill(66, 172, 229); 
            rect(this.x - 33, this.y - 40, 30, 50);// legs
            rect(this.x + 3, this.y - 40, 30, 50);
            rect(this.x - 30, this.y - 80, this.width + 40, 40); // body                     
            rect(this.x - 20, this.y - 120, 40, 40) // head
            triangle(this.x - 30, this.y - 42, this.x, this.y - 30, this.x + 30, this.y - 42)            
            rect(this.x - 55, this.y - 80, 25, 50);// arms
            rect(this.x + 30, this.y - 80, 25, 50);           
            rect(this.x - 16, this.y - 105, 32, 25); // mask
            rect(this.x - 60, this.y - 85, 32, 20); // pauldrons
            rect(this.x + 28, this.y - 85, 32, 20);
            rect(this.x - 5, this.y - 122, 10, 8); // sign          
            rect(this.x - 35, this.y - 10, 32, 23); // boots
            rect(this.x + 3, this.y - 10, 32, 23);
            rect(this.x - 57, this.y - 50, 27, 23); // gloves
            rect(this.x + 30, this.y - 50, 27, 23);
            rect(this.x - 60, this.y - 85, 16, 10); // pauldrons
            rect(this.x + 44, this.y - 85, 16, 10);
            rect(this.x - 18, this.y - 110, 36, 8); // cap        
            ellipse(this.x, this.y - 87, 12, 12);
            ellipse(this.x - 12, this.y - 87, 6, 6);
            ellipse(this.x + 12, this.y - 87, 6, 6);       
            ellipse(this.x + 9, this.y - 96, 14, 6);
            ellipse(this.x - 9, this.y - 96, 14, 6);
            fill(226, 97, 198);
            textSize(20);
            text("XD", this.x - 12, this.y - 90);
            }
        },
        
        respawn: function () {
            if (this.dead) {
                if (!this.respawnTimer) {
                this.respawnTimer = millis(); // Записываем время смерти врага
                this.defeatAnimation();
                this.speed = 0;
                } else {
                    const elapsedTime = millis() - enemy.respawnTimer;
                     // Проверяем, прошла ли 1 секунда с момента смерти врага
                    if (elapsedTime >= 1000) { 
                    // Возрождаем врага                
                        this.x = random(this.borderLeft,40-player.x)
                        this.y = 450;
                        this.dead = false;
                        this.direction *= -1
                        this.fallSpeed = 4
                        if (score <= 60)
                        this.speed = random(2,5);
                        if (score > 60)
                        this.speed = random(8,10)
                        this.respawnTimer = null; // Сброс таймера респавна
                        this.lastX = null;
                    }
                }
            }
        },
    };

    for (let i = 0; i < countCanyons; i++) {
        canyons.push
            (
                {
                    x: 220 + i * 400,
                    y: height - floor.height,
                    width: 150,
                    drawCanyon: function () {
                        fill(148, 64, 77)
                        rect(this.x, this.y, 150, height)
                        strokeWeight(10) // pillars
                        stroke(127, 137, 118) 
                        line(230, 380, 230, height)
                        line(290, 380, 290, height)
                        line(350, 380, 350, height)
                        noStroke();
                        fill(121, 132, 111)
                        rect(220, 485, 150, height)
                        fill(115, 127, 104)
                        rect(220, 450, 40, height)
                        rect(320, 440, 40, height)
                        rect(270, 470, 40, height)
                        fill(109, 122, 97)
                        rect(230, 480, 40, height)
                        rect(330, 460, 40, height)
                        rect(280, 500, 40, height)
                        fill(103, 117, 91)
                        rect(220, 520, 40, height)
                        rect(310, 510, 40, height)
                        rect(260, 530, 40, height)
                        fill(98, 112, 85)
                        rect(330, 530, 40, height)
                        rect(230, 540, 40, height)
                        rect(290, 555, 40, height)
                        fill(49, 56, 44)
                        triangle(this.x, this.y + 40, this.x, this.y + 70, this.x + 30, this.y + 70)
                        triangle(this.x + 150, this.y + 40, this.x + 150, this.y + 70, this.x + 120, this.y + 70)
                        fill(60, 68, 54)
                        quad(this.x, this.y, this.x + 30, this.y + 30,  this.x + 30, this.y + 70, this.x, this.y + 40)
                        quad(this.x + 120, this.y + 30,  this.x + 150, this.y, this.x + 150, this.y + 40, this.x + 120, this.y + 70)
                    }
                }
            );
    }
}

function draw() {
    background_music.play();
    background(148, 64, 77);
    sky.drawSky();
    piltover.drawPiltover();
    clouds.drawClouds();
    clouds.movement();
    building.drawBuilding();
    floor.drawFloor();
    for (let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();

    enemy.draw();
    enemy.movement();
    enemy.respawn();
    enemy.defeatAnimation();

    player.drawPlayer();
    player.caughtAnimation();
    player.checkEnemy();
    player.checkCanyon();
    player.checkOutside();
    player.gravity(floor);
    player.movement();
    textSize(15);
    text(": " + score, 10, 30);
}