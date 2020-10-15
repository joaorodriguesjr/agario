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

    if (x < 0 || x > this.limits.x && y < 0 || y > this.limits.y) {
      return
    }

    if (x < 0 || x > this.limits.x) {
      movement.x = 0
      this.position.add(movement.multipliedBy(1.5))
      return
    }

    if (y < 0 || y > this.limits.y) {
      movement.y = 0
      this.position.add(movement.multipliedBy(1.5))
      return
    }

    this.position.add(movement)
  }

  /**
   * @param {Number} growth
   */
  grow(growth) {
    this.radius = this.radius + growth
    this.speed  = this.speed  - growth / 100
  }

  /**
   * @param {Blob} blob
   * @returns {Number}
   */
  calculateDistanceTo(blob) {
    return this.calculatePathTo(blob).calculateLength() + (this.radius + blob.radius)
  }

  /**
   * @param {Blob} blob
   * @returns {Vector}
   */
  calculatePathTo(blob) {
    return blob.position.minus(this.position)
  }

  /**
   * @param {Blob} blob
   * @returns {Vector}
   */
  calculatePathFrom(blob) {
    return blob.position.plus(this.position)
  }
}
