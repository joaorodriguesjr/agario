import { Vector } from './Vector.js'

export class Blob {
  /**
   * @param {Vector} position
   * @param {Number} radius
   */
  constructor(position, radius) {
    this.position = position
    this.radius = radius
    this.speed = 2.5
  }

  /**
   * @param {Vector} target
   */
  move(target) {
    this.position.add(target.withLength(this.speed))
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
  calculatePath(blob) {
    return this.position.minus(blob.position)
  }
}
