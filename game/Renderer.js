import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { World } from './World.js';
import { Player } from './Player.js';
import { Scaler } from './Scaler.js';
import { Rectangle } from './Rectangle.js';
import { Point } from './Point.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Scaler} scaler
   */
  constructor(canvas, scaler) {
    this.scaler = scaler
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.context.fillStyle = "#454545";
  }

  /**
   * @param {Player} player
   * @return {Vector}
   */
  calculateOffset(world, player) {
    const x = (this.canvas.width  / 2) - player.position.x
    const y = (this.canvas.height / 2) - player.position.y

    return new Vector(x, y)
  }

  /**
   * @param {World} world
   * @param {Player} player
   */
  render(world, player) {
    const scale = this.scaler.calculateScale(player, this.canvas)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const offset = this.calculateOffset(world, player)
    this.context.offset = offset

    this.context.save()
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2)
    this.context.scale(scale, scale)
    this.context.translate(-player.position.x, -player.position.y)

    // for (let [point, blob] of world.blobs) this.renderBlob(blob, offset)

    const w = this.canvas.width  * 0.85
    const h = this.canvas.height * 0.85
    const x = player.position.x - (w / 2)
    const y = player.position.y - (h / 2)
    const area = new Rectangle(new Point(x, y), w, h)

    this.context.fillStyle = 'rgba(255, 165, 0, 0.5)'
    this.context.beginPath()
    this.context.rect(area.position.x, area.position.y, area.width, area.height)
    this.context.fill()
    this.context.closePath()
    this.context.fillStyle = "rgba(60, 179, 113, 0.5)";

    const points = world.tree.query(area)
    for (let point of points) this.renderBlob(world.blobs.get(point))
    this.context.fillStyle = "#454545";

    for (let player of world.players) this.renderBlob(player, offset)

    world.tree.root.debugRender(this.context)
    this.context.restore()
  }

  /**
   * @param {Blob} blob
   */
  renderBlob(blob, offset) {
    // if (this.inCullingArea(blob.position.plus(offset))) {
      // return
    // }

    this.context.beginPath()
    this.context.arc(blob.position.x, blob.position.y, blob.radius, 0, 2 * Math.PI)
    this.context.fill()
    this.context.closePath()
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
