import { Vector } from './Vector.js'

export class Point {
  /**
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @param {Point} target
   * @returns {Number}
   */
  calculateDistanceTo(target) {
    return this.calculatePathTo(target).calculateLength()
  }

  /**
   * @param {Point} target
   * @returns {Vector}
   */
  calculatePathTo(target) {
    return target.toVector().minus(this.toVector())
  }

  /**
   * @param {Point} target
   * @returns {Vector}
   */
  calculatePathFrom(target) {
    return this.toVector().plus(target.toVector())
  }

  /**
   * Transforms this point into a vector.
   *
   * @returns {Vector} Object capable of various calculation on itself and others of its type.
   */
  toVector() {
    return new Vector(this.x, this.y)
  }
}
