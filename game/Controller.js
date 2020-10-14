import { Vector } from './Vector.js';

export class Controller {
  constructor() {
    /**
     * @type {Array<Vector>}
     */
    this.movements = new Array()

    /**
     * @type {Vector}
     */
    this.cache
  }

  /**
   * @param {Vector} movement
   */
  addMovement(movement) {
    this.movements.push(movement)
  }

  /**
   * @returns {Boolean}
   */
  hasMovement() {
    return this.movements.length > 0
  }

  /**
   * @returns {Boolean}
   */
  hasCache() {
    return this.cache !== undefined
  }

  /**
   * @returns {Boolean}
   */
  isMoving() {
    return (this.hasMovement() || this.hasCache())
  }

  /**
   * @returns {Vector}
   */
  nextMovement() {
    if (this.hasMovement()) {
      this.cache = this.movements.shift()
    }

    return this.cache
  }
}
