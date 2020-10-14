import { Controller } from './Controller.js';
import { Vector } from './Vector.js';

export class Input {
  /**
   * @param {Controller} controller
   */
  constructor(controller) {
    this.controller = controller
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @returns {Function}
   */
  createMouseMoveListener(canvas) {
    return (event) => {
      const follow = new Vector(event.offsetX - canvas.width / 2, event.offsetY - canvas.height / 2)
      this.controller.addCommand(follow)
    }
  }
}
