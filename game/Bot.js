import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Controller } from './Controller.js'
import { Automation } from './Automation.js'

export class Bot extends Player {
  /**
   * @param {Blob} blob
   * @param {Controller} controller
   * @param {Automation} automation
   */
  constructor(blob, controller, automation) {
    super(blob, controller)
    this.automation = automation
  }

  /**
   * @returns {void}
   */
  update() {
    this.automation.updateTargets(this)
    this.automation.operate(this)
    super.update()
  }
}
