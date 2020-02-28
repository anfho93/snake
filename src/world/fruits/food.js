import { WorldObject } from '../word-object';
import { config } from '../../config/config';
/**
 * Class that represents a basic food in the game
 */
export class Food extends WorldObject {
    /**
     * 
     * @param {Number} x coordinate
     * @param {Number} y coordinate
     */
    constructor(x, y) {
        super(x, y);
        this.special = false;
        this.points = config.POINTS;
        this.pixels = config.PIXELS;
        this.color = this.randomColor().color;
        this.stroke = this.randomColor().stroke;
    }
    /**
     * Draws the object in the canvas
     * @param {Canvas} canvas
     */
    draw(canvas) {
        this.drawRect(canvas.canvas);
    }
    /**
     * Draws a square inside the canvas
     * @param {Canvas} canvas 
     */
    drawRect(canvas) {
        canvas.drawRect({
            fillStyle: this.color,
            strokeStyle: this.stroke,
            strokeWidth: 1,
            x: this.x * config.PIXELS, y: this.y * config.PIXELS,
            fromCenter: false,
            width: this._size * config.PIXELS,
            height: this._size * config.PIXELS
        });
    }

    randomColor() {
        let r = Number.parseInt(Math.random() * 255);
        let g = Number.parseInt(Math.random() * 255);
        let b = Number.parseInt(Math.random() * 255);
        
        return { color: this.fullColorHex(r, g, b), stroke: this.fullColorHex(r *0.25, g * 0.25, b* 0.25)};
    }

    rgbToHex(rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    fullColorHex(r, g, b) {
        var red = this.rgbToHex(r);
        var green = this.rgbToHex(g);
        var blue = this.rgbToHex(b);
        return '#'+red + green + blue;
    };
}