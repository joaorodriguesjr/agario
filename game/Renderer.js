import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { World } from './World.js';
import { Player } from './Player.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }

  /**
   * @param {Player} player
   * @return {Vector}
   */
  calculateOffset(player) {
    const x = (this.canvas.width  / 2) - player.blob.position.x
    const y = (this.canvas.height / 2) - player.blob.position.y

    return new Vector(x, y)
  }

  /**
   * @param {World} world
   * @param {Player} player
   */
  render(world, player) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const offset = this.calculateOffset(player)
    world.blobs.forEach(blob => this.renderBlob(blob, offset))
    world.players.forEach(player => this.renderBlob(player.blob, offset))
  }

  /**
   * @param {Blob} blob
   * @param {Vector} offset
   */
  renderBlob(blob, offset) {
    const offsetted = blob.position.plus(offset)

    if (this.inCullingArea(offsetted)) {
      return
    }

    this.context.beginPath()
    this.context.arc(offsetted.x, offsetted.y, blob.radius, 0, 2 * Math.PI)
    this.context.fill()
  }

  /**
   * @param {Vector} position
   * @return {Boolean}
   */
  inCullingArea(position) {
    let culled = false

    if (position.x > this.canvas.width || position.y > this.canvas.height) {
      culled = true
    }

    if (position.x < 0 || position.y < 0) {
      culled = true
    }

    return culled
  }
}
