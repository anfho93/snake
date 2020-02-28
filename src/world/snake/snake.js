import * as $ from "jquery";
import { WorldObject } from "../word-object";
import { config } from "../../config/config";
import { SnakeSection } from "./section-snake";
/**
 * Class that represents the snake inside the game
 */
export class Snake extends WorldObject {

    constructor(x, y) {
        super(x, y);
        this.color = 'green';
        const head = new SnakeSection(x, y, this.color, true);
        head.direction = this.direction;
        this.body = [head]; // creates a initial body
        this.init();
        this.grow(1);
    }    
    /**
     * Increases the size of the snake by X units
     * @param {Number} units number of units to grow
     */
    grow(units) {
        const last = this.body[this.body.length -1];
        let newOne = new SnakeSection(last.x, last.y, this.color);
        if (last.direction == config.UP) {
            newOne.y += 1;
        }
        if (last.direction == config.DOWN) {
            newOne.y -= 1;
        }
        if (last.direction == config.LEFT) {
            newOne.x += 1;
        }
        if (last.direction == config.RIGHT) {
            newOne.x -= 1;
        }
        newOne.direction = last.direction;
        newOne.pixels = 16;
        this.body.push(newOne);
        if(units && units > 0) {
            this.grow(--units);
        }
    }
    /**
     * Draws the snake in the canvas
     * @param {JQuery} canvas Jquery object representing the canvas
     */
    draw(canvas) {
        this.body.forEach(e => {
            e.draw(canvas);
        });
    }
    /**
     * Moves the snake in a given direction
     */
    move() {
        this.enableKeyboard = true;
        // old x and y
        let { x, y, direction } = this.body[0];
        if (this.direction == config.RIGHT) {
            this.body[0].x += (this.size * 1);            
        }
        if (this.direction == config.LEFT) {
            this.body[0].x -= (this.size * 1);
        }
        if (this.direction == config.UP) {
            this.body[0].y -= (this.size * 1);
        }
        if (this.direction == config.DOWN) {
            this.body[0].y += (this.size * 1);
        }
        let first = false;        
        this.x = this.body[0].x;
        this.y = this.body[0].y;
        
        this.body = this.body.map(elem => {
            if (first) {
                const newX = elem.x;
                const newY = elem.y;
                const newD = elem.direction;
                elem.x = x;
                elem.y = y;
                elem.direction = direction;
                x = newX;
                y = newY;
                direction = newD;
            }
            first = true;
            return elem;
        });

    }
    /**
     * Prepares the event listeners of the keyboard
     */
    init() {
        $(document).keydown((e) => {
            e.stopPropagation();
            if(!this.enableKeyboard)
                return;
            var key = e.which;
            if (key == "37" && this.direction != config.RIGHT) {
                this.direction = config.LEFT;
                this.enableKeyboard = false;
            }
            if (key == "38" && this.direction != config.DOWN) {
                this.direction = config.UP;
                this.enableKeyboard = false;
            }
            if (key == "39" && this.direction != config.LEFT) {
                this.direction = config.RIGHT;
                this.enableKeyboard = false;
            }
            if (key == "40" && this.direction != config.UP) {
                this.direction = config.DOWN;
                this.enableKeyboard = false;
            }
            this.body[0].direction = this.direction;
        });
    }
    /**
     * Reverses the snake and its directions
     */
    reverse() {
        this.body.reverse();
        this.body = this.body.map(elem => {
            elem.head = false;
            if(elem.direction == config.RIGHT) {
                elem.direction = config.LEFT;
            } else if(elem.direction == config.LEFT) {
                elem.direction = config.RIGHT;
            } else if(elem.direction == config.UP) {
                elem.direction = config.DOWN;
            } else if(elem.direction == config.DOWN) {
                elem.direction = config.UP;
            }
            return elem;
        });
        this.direction = this.body[0].direction;
        this.body[0].head = true;
    }
    
    checkSelfCollition(){
        const head = this.body[0]; // next position
        let start = false;
        let collition = false;
        if(this.body.length > 2) {
            this.body.forEach(el => {            
                if(start && head.checkCollition(el)) {
                    collition = true;
                }
                start = true;
            });
        }
        
        return collition;
    }

}