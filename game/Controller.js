import { Vector } from './Vector.js';

export class Controller {
  constructor() {
    /**
     * @type {Array<Vector>}
     */
    this.commands = new Array()

    /**
     * @type {Vector}
     */
    this.cache
  }

  /**
   * @param {Vector} command
   */
  addCommand(command) {
    this.commands.push(command)
  }

  /**
   * @returns {Boolean}
   */
  hasCommand() {
    return this.commands.length > 0
  }

  /**
   * @returns {Boolean}
   */
  hasCache() {
    return this.cache !== undefined
  }

  /**
   * @returns {Vector}
   */
  nextCommand() {
    if (this.hasCommand()) {
      this.cache = this.commands.shift()
    }

    return this.cache
  }
}
