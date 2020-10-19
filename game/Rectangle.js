import { Point } from './Point.js'

export class Rectangle {
  /**
   * @param {Point} position
   * @param {Number} width
   * @param {Number} height
   */
  constructor(position, width, height) {
    this.position = position
    this.width  = width
    this.height = height
  }

  /**
   * @param {Point} point
   * @returns {Boolean}
   */
  contains(point) {
    return (
      point.x >= this.position.x &&
      point.x <= this.position.x + this.width &&
      point.y >= this.position.y &&
      point.y <= this.position.y + this.height
    )
  }

  /**
   * @param {Rectangle} rect
   * @returns {Boolean}
   */
  intersects(rect) {
    return ! (
      (rect.position.x - rect.width ) > (this.position.x + this.width ) ||
      (rect.position.x + rect.width ) < (this.position.x - this.width ) ||
      (rect.position.y - rect.height) > (this.position.y + this.height) ||
      (rect.position.y + rect.height) < (this.position.y - this.height)
    )
  }
}
