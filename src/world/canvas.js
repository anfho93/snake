import { config } from "../config/config";
import { WorldObject } from "./word-object";


export class Canvas {
    /**
     * 
     * @param {JQuery} canvas Jquery object containing details of the canvas
     * @param {Number} width width of the canvas
     * @param {Number} height height of the
     */
    constructor(canvas, width, height) {
        this.width = width;
        this.height = height;
        this._canvas = canvas;
        this.reset();
    }
    /**
     * Resets the canvas to its initial values
     */
    reset() {
        this.width = config.WIDTH;
        this.height = config.HEIGHT;
        this._canvas.height = this.height * config.PIXELS;
        this._canvas.width = this.width * config.PIXELS;
        this.collitionWidth = this.width - 1;
        this.collitionHeight = this.height - 1;
        this.specialWidth = config.SPECIAL_WIDTH;
        this.specialHeight = config.SPECIAL_HEIGHT;
    }

    
    get canvas() {
        return this._canvas;
    }
    /**
     * Draws the outside of the canvas (playable area)
     */
    drawOutside() {
        this.canvas.drawRect({
            strokeStyle: 'black',
            fillStyle: '#646262',
            strokeWidth: 5,
            fromCenter: false,
            x: 0, y: 0,
            width: this.width * config.PIXELS,
            height: this.height * config.PIXELS
        });
    }
    /**
     * Draws all the elements sent inside the canvas
     * @param  {...WorldObject} elements 
     */
    drawElements(...elements) {
        this.drawOutside();
        elements.forEach(elem => {
            elem.draw(this);
        });
    }
    /**
     * Clears the canvas
     */
    clear() {
        this.canvas.clearCanvas();
    }
    /**
     * Reduces the game area
     */
    reduce() {
        if (this.width >= 21 && this.height >= 21) {
            this.height -= 7;
            this.collitionHeight = this.height - 1;
            this.width -= 7;
            this.collitionWidth = this.width - 1;
            this.specialWidth -= 4;
            this.specialHeight -= 4;
        }
    }
}