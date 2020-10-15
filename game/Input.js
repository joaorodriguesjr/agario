import { Player } from './Player.js'
import { Vector } from './Vector.js'

export class Input {
  /**
   * @param {Player} player
   */
  constructor(player) {
    this.player = player
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @returns {Function}
   */
  createMouseMoveListener(canvas) {
    return (event) => {
      const direction = new Vector(event.offsetX - canvas.width / 2, event.offsetY - canvas.height / 2)
      this.player.targetDirection(direction)
    }
  }
}
