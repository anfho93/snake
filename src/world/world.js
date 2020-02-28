
import * as $ from 'jquery';
import * as jcanvas from 'jcanvas';
import { Canvas } from './canvas';
import { Food } from './fruits/food';
import { interval } from 'rxjs';
import { Circle } from './fruits/circle';
import { config } from '../config/config';
import { Snake } from './snake/snake';

export class World {

    constructor() {
        $('body').append('<canvas id="canvas" style="position: absolute; top: 40px;" width="800" height="800"></canvas>');
        $('body').append(`<label id="scoreLabel" style="position: absolute; left: 10px;">Score: ${this.score}</label>`);
        this.canvas = new Canvas($('#canvas'), config.HEIGHT, config.WIDTH);
        this.lastScore = window.localStorage.getItem('score');
        this.lastScore = this.lastScore ? Number.parseInt(this.lastScore) : 0;
        this.gameOver = false;
        this.restart();
        this.restartDialog = 'Do you want to play again?';
        jcanvas($, window);
    }
    /**
     * Starts the different loops and setups the initial state of the game
     */
    start() {
        const ran = this.getRandomPosition();
        this.fruits = [new Food(ran.x, ran.y)];
        this.startLoops();
    }
    /**
     * Allow the user to restart the game after loosing
     */
    restart() {
        this.gameOver = false;
        this.direction = 'RIGHT';
        this.score = 0;
        const { x, y } = this.getRandomPosition();
        this.snake = new Snake(x, y);
        const ran = this.getRandomPosition();
        this.fruits = [];
        this.fruits.push(new Food(ran.x, ran.y));
        if (this.lastScore > 0) {
            $('body').append(`<label id="lastScoreLabel" style="position: absolute; left: 200px;">Last Score: ${this.lastScore}</label>`);
        }
    }
    /**
     * Starts the different independent loops
     */
    startLoops() {
        this.gameLoop = interval(100).subscribe(() => {
            this.update();
        });
        this.startFoodLoops();
        this.startSpecialFoodLoop();
        this.update();
    }
    /**
     * Verifies collitions and draws the objects in the canvas
     */
    update() {
        this.canvas.clear();
        this.checkWallCollitions();
        this.fruits = this.fruits.filter(food => {
            if (this.checkFoodCollition(food) || this.foodOutSideCanvas(food)) {
                return false;
            }
            return true;
        });

        this.snake.move();
        if (this.snake.checkSelfCollition()) {
            this.gameOver = true;
            this.gameLoop.unsubscribe();
            let result = confirm('Do you want to play again?');
            if (result == true) {
                this.saveScore();
                this.canvas.reset();
                this.restart();
                this.startLoops();
            } else {
                console.log('Game canceled');
            }
        }
        this.drawScore();
        this.canvas.drawElements(this.snake, ...this.fruits);


    }
    /**
     * This method returns a random x, y position that is not ocuppied for any other object
     * using the 16*16 ratio
     * @param {Number} tries, number of tries to place a element in the canvas
     */
    getRandomPosition(tries) {
        if (tries == 0) {
            return;
        }
        if (!tries)
            tries = 3;
        const x = Number.parseInt((Math.random() * (this.canvas.width - 1)));
        const y = Number.parseInt((Math.random() * (this.canvas.height - 1)));

        if (this.snake && this.snake.body.find(e => e.x == x && e.y == y) || this.fruitCollition(x, y)) {
            return this.getRandomPosition();
        }
        return { x, y };
    }
    /**
     * This method returns a random x, y position that is not ocuppied for any other object
     * using the 28*28 ratio
     * @param {Number} tries, number of tries to place a element in the canvas
     */
    getSpecialRandomPosition(tries) {
        if (tries == 0) {
            return;
        }
        if (!tries)
            tries = 3;
        const x = Number.parseInt((Math.random() * (this.canvas.specialWidth - 1)));
        const y = Number.parseInt((Math.random() * (this.canvas.specialHeight - 1)));
        if (this.snake && this.snake.body.find(e => (e.x == x && e.y == y) || new Circle(x, y).checkCollition(e)) || this.fruitCollition(x, y, true)) {
            return this.getSpecialRandomPosition(--tries);
        }
        return { x, y };
    }
    /**
     * Detects collition between fruits to avoid placing one above the other
     * @param {Number} x coordinate
     * @param {Number} y coordinate
     * @param {Boolean} special, determine if it is a special fruit
     */
    fruitCollition(x, y, special) {
        if (!special)
            return this.fruits && this.fruits.find(e => (!e.special && e.x == x && e.y == y) || (e.special && e.checkCollition(new Food(x, y))))
        return this.fruits && this.fruits.find(e => (!e.special && new Circle(x, y).checkCollition(e)) || (e.special && e.x == x && e.y == y));
    }
    /**
     * Verifies if after a reduction of the canvas there are foods outside 
     * @param {Food} f Food element
     */
    foodOutSideCanvas(f) {
        return (f.x >= this.canvas.width || f.y >= this.canvas.height) || (f.special && (f.x >= this.canvas.specialWidth || f.y >= this.canvas.specialHeight));
    }

    /**
     * Draws the score in the HTML page
     */
    drawScore() {
        // verify old scores
        if (this.lastScore < this.score) {
            $('#scoreLabel').addClass('red-text');
        } else $('#scoreLabel').removeClass('red-text');
        $('#scoreLabel').text(`Score: ${this.score}`);
    }
    /**
     * Checks if the head of the snake has collitioned with a food
     * @param {Food} food 
     */
    checkFoodCollition(food) {
        if (food.checkCollition(this.snake)) {
            food.special ? this.snake.grow(config.SPECIAL_GROWTH) : this.snake.grow(config.GROWTH);
            this.score += food.points;
            return true;
        }
        return false;
    }
    /**
     * Checks if the snake has hit a wall
     */
    checkWallCollitions() {
        if ((this.snake.x <= 0 && this.snake.direction == config.LEFT) || (this.snake.x >= this.canvas.collitionWidth && this.snake.direction == config.RIGHT) ||
            (this.snake.y <= 0 && this.snake.direction == config.UP) || (this.snake.y >= this.canvas.collitionHeight && this.snake.direction == config.DOWN)) {
            this.snake.reverse();
            this.canvas.reduce();
            this.reorganizeSnake();
        }
    }
    /**
     * Reorders the snake when the canvas gets reduced after hitting the wall
     */
    reorganizeSnake() {
        let head = this.snake.body[0];
        if (head.x > this.canvas.collitionWidth) {
            this.snake.body = this.snake.body.map(el => {
                el.x -= 7;
                return el;
            });
        }
        if (head.y > this.canvas.collitionHeight) {
            this.snake.body = this.snake.body.map(el => {
                el.y -= 7;
                return el;
            });
        }
    }
    /**
     * Loop to create normal foods for the snake
     */
    async startFoodLoops() {
        while (!this.gameOver) {
            let foodTime = 4000 + (Math.random() * 6000);
            await this.wait(foodTime)
            const ran = this.getRandomPosition();
            if (ran) {
                this.fruits.push(new Food(ran.x, ran.y));
            }
        }
    }
    /**
     * Loop to create special foods for the snake
     */
    async startSpecialFoodLoop() {
        while (!this.gameOver) {
            let specialFoodTime = 1000 + (Math.random() * 5000);
            await this.wait(specialFoodTime)
            const ran = this.getSpecialRandomPosition();
            if (ran) {
                this.fruits.push(new Circle(ran.x, ran.y));
            }
        }
    }
    /**
     * Creates a timeouts based on the sent time
     * @param {Number} time 
     */
    wait(time) {
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                resolve();
                clearTimeout(timeout)
            }, time);
        });
    }
    /**
     * Saves the current score if it is higher than last stored score.
     */
    saveScore() {
        let lastScore = window.localStorage.getItem('score');
        if (lastScore) {
            lastScore = Number.parseInt(lastScore);
            if (lastScore < this.score) {
                window.localStorage.setItem('score', this.score);
            }
            this.lastScore = this.score;
        } else window.localStorage.setItem('score', this.score);

        if (this.lastScore > 0) {
            $('#lastScoreLabel').text(`Last Score: ${this.lastScore}`);
        }
    }
}