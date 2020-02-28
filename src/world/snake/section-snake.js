
import { WorldObject } from "../word-object";
import { config } from "../../config/config";
/**
 * Represents a part of the snake, a section  specifically
 */
export class SnakeSection extends WorldObject {
    constructor(x, y, color, head) {
        super(x, y);
        this.color = color;
        this.head = head;
    }
    /**
     * Draws the section of the snake
     * @param {Canvas} canvas 
     */
    draw(canvas) {
        if (this.x >= canvas.width || this.y >= canvas.height)
            return;

        let rect = canvas.canvas.drawRect({
            fillStyle: this.color,
            strokeStyle: 'black',
            strokeWidth: 2,
            x: this.x * config.PIXELS, y: this.y * config.PIXELS,
            fromCenter: false,
            width: this._size * config.PIXELS,
            height: this._size * config.PIXELS,
            rotate: this.getRotation()
        });

        if (this.head) {
            const pos = this.getXYPosition();
            rect.drawEllipse({
                fillStyle: 'red',
                x: this.x * config.PIXELS + (config.PIXELS * pos.x1), y: this.y * config.PIXELS + (config.PIXELS * pos.y1),
                width: 3, height: 3,
                fromCenter: false,
                rotate: this.getRotation()
            });
            
            rect.drawEllipse({
                fillStyle: 'red',
                x: this.x * config.PIXELS + (config.PIXELS * pos.x2), y: this.y * config.PIXELS + (config.PIXELS * pos.y2),
                width: 3, height: 3,
                fromCenter: false,
                rotate: this.getRotation()
            });

        }

    }

    getXYPosition() {
        switch (this.direction) {
            case config.RIGHT: return { x1: 0.6, x2: 0.6, y1: 0.3, y2: 0.6 };
            case config.LEFT:return { x1: 0.3, x2: 0.3, y1: 0.3, y2: 0.6 };
            case config.UP: return { x1: 0.3, x2: 0.6, y1: 0.3, y2: 0.3 };
            case config.DOWN: return { x1: 0.3, x2: 0.6, y1: 0.6, y2: 0.6 };
        }
    }

    getRotation() {
        switch (this.direction) {
            case config.RIGHT: return 0;
            case config.LEFT: return 180;
            case config.UP: return -90;
            case config.DOWN: return 90;
        }
    }
}