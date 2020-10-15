import { Vector } from './Vector.js'

export class Blob {
  /**
   * @param {Vector} position
   * @param {Number} radius
   */
  constructor(position, radius, limits) {
    this.position = position
    this.radius = radius
    this.limits = limits
    this.speed = 2.5
  }

  /**
   * @param {Vector} target
   */
  move(target) {
    const movement = target.withLength(this.speed)
    const x = this.position.x + movement.x
    const y = this.position.y + movement.y

    if (x < 0 || x > this.limits.x) {
      movement.x = 0
      this.position.add(movement)
      return
    }

    if (y < 0 || y > this.limits.y) {
      movement.y = 0
      this.position.add(movement)
      return
    }

    this.position.add(movement)
  }

  /**
   * @param {Number} growth
   */
  grow(growth) {
    this.radius += (growth)
    this.speed  -= (growth / 250)
  }

  /**
   * @param {Blob} blob
   * @returns {Number}
   */
  calculateDistance(blob) {
    return this.position.minus(blob.position).calculateLength()
  }

  /**
   * @param {Blob} blob
   * @returns {Vector}
   */
  calculatePathTo(blob) {
    return this.position.minus(blob.position)
  }

  /**
   * @param {Blob} blob
   * @returns {Vector}
   */
  calculatePathFrom(blob) {
    return blob.position.plus(this.position)
  }
}
