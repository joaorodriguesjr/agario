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
    this.context.fillStyle = "#454545";
  }

  /**
   * @param {World} world
   * @param {Player} player
   */
  render(world, player) {
    const scale = world.calculateScale(player)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.save()
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2)
    this.context.scale(scale, scale)
    this.context.translate(-player.blob.position.x, -player.blob.position.y)

    for (const blob of world.blobs) this.renderBlob(blob)
    for (const player of world.players) this.renderBlob(player.blob)

    this.context.restore()
  }

  /**
   * @param {Blob} blob
   */
  renderBlob(blob) {
    if (this.inCullingArea(blob.position)) {
      // return
    }

    this.context.beginPath()
    this.context.arc(blob.position.x, blob.position.y, blob.radius, 0, 2 * Math.PI)
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
