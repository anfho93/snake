import { Food } from "./food";
import { config } from "../../config/config";
import { WorldObject } from "../word-object";
/**
 * Class that represents a special food in the game
 */
export class Circle extends Food {
    /**
     * 
     * @param {Number} x coordinate
     * @param {Number} y coordinate
     * @param {Number} size  size of the food
     */
    constructor(x, y, size) {
        super(x, y);
        this.special = true;
        this.pixels = size == 1 ? config.PIXELS : config.SPECIAL_PIXELS;
        this.points = config.SPECIAL_POINTS;
    }
    /**
     * Draws the object in the canvas
     * @param {Canvas} canvas
     */
    draw(canvas) {
        canvas.canvas.drawEllipse({
            fillStyle: this.color,
            x: this.x * this.pixels, y: this.y * this.pixels,
            fromCenter: false,
            strokeStyle: this.stroke,
            strokeWidth: 1,
            width: this.pixels,
            height: this.pixels
        });
    }
    /**
     * Custom collition method for this food, since it has different shapes
     * @param {WorldObject} worldObject to be compared with
     */
    checkCollition(worldObject) {
        // x + radius
        const centerX = (this.x * this.pixels) + 14;
        // y + radius
        const centerY = (this.y * this.pixels) + 14;
        // tests 4 points of the snake to check collition
        return Math.pow((worldObject.x * worldObject.pixels) - centerX, 2) +
        Math.pow((worldObject.y * worldObject.pixels) - centerY, 2) <= Math.pow(14,2) ||
        Math.pow(((worldObject.x * worldObject.pixels) + worldObject.pixels) - centerX, 2) +
        Math.pow(((worldObject.y * worldObject.pixels) + worldObject.pixels) - centerY, 2) <= Math.pow(14,2) ||
        Math.pow(((worldObject.x * worldObject.pixels) + worldObject.pixels) - centerX, 2) +
        Math.pow(((worldObject.y * worldObject.pixels)) - centerY, 2) <= Math.pow(14,2) ||
        Math.pow(((worldObject.x * worldObject.pixels)) - centerX, 2) +
        Math.pow(((worldObject.y * worldObject.pixels)+ worldObject.pixels) - centerY, 2) <= Math.pow(14,2) ;
    }
}