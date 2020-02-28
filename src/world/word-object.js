import { config } from "../config/config";

export class WorldObject {
    constructor(x, y, color) {
        this._x = x;
        this._y = y;
        this._size = 1;
        this._color = color || 'steelblue';
        this.direction = 'RIGHT';
        this.pixels = config.PIXELS;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(x) {
        this._x = x;
    }

    set y(y) {
        this._y = y;
    }

    get size() {
        return this._size;
    }

    set size(size) {
        this._size = size;
    }

    set color(color) {
        this._color = color;
    }

    get color() {
        return this._color;
    }
    /**
     * Draws the object in the canvas
     * @param {Canvas} canvas
     */
    draw(canvas) {
        if(this.x >= canvas.width || this.y >= canvas.height)
            return;
        canvas.canvas.drawRect({
            fillStyle: this.color,
            x: this.x * config.PIXELS, y: this.y * config.PIXELS,
            fromCenter: false,
            width: this._size * config.PIXELS,
            height: this._size * config.PIXELS
        });
    }
    /**
     * Basic method to detect collition for a world object
     * @param {WorldObject} worldObject object to compare and check collitions
     */
    checkCollition(worldObject) {
        // are the the same?
        if(this.x == worldObject.x && this.y == worldObject.y) {
            return true;
        }        
        return false;
    }
}