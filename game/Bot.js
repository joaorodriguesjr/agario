import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Controller } from './Controller.js'
import { Automation } from './Automation.js'

export class Bot extends Player {
  /**
   * @param {Vector} position
   * @param {Vector} velocity
   * @param {Vector} acceleration
   * @param {Number} radius
   * @param {Controller} controller
   * @param {Automation} automation
   */
  constructor(position, velocity, acceleration, radius, controller, automation) {
    super(position, velocity, acceleration, radius, controller)
    this.automation = automation
  }

  /**
   * @param {Blob} target
   */
  advanceTo(target) {
    this.controller.addMovement(this.calculatePathTo(target))
  }

  /**
   * @param {Blob} target
   */
  retreatFrom(target) {
    this.controller.addMovement(this.calculatePathFrom(target))
  }

  /**
   * @returns {void}
   */
  executeMovement(world) {
    this.automation.executeAutomatedBehaviour(this)
    super.executeMovement(world)
  }

  /**
   * @param {Player} player
   */
  onPlayerRemove(player) {
    super.onPlayerRemove(player)
    this.automation.validateMovingTarget(this, player)
  }

  /**
   * @param {Blob} blob
   */
  onBlobRemove(blob) {
    super.onBlobRemove(blob)
    this.automation.validateStaticTarget(this, blob)
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isCloseEnoughToHunt(enemy) {
    return (this.calculateDistanceTo(enemy) < (this.radius + enemy.radius) * 2.00)
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isCloseEnoughToRunFrom(enemy) {
    return (this.calculateDistanceTo(enemy) < (this.radius + enemy.radius) * 1.85)
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isFarEnoughToRunFrom(enemy) {
    return (this.calculateDistanceTo(enemy) > (this.radius + enemy.radius) * 2.50)
  }

  /**
   * @param {Player} player
   * @returns {Boolean}
   */
  shouldHunt(player) {
    return this.isCloseEnoughToHunt(player) && this.isBiggerThan(player)
  }

  /**
   * @param {Player} player
   * @returns {Boolean}
   */
  shouldRunFrom(player) {
    return this.isCloseEnoughToRunFrom(player) && player.isBiggerThan(this)
  }

  isDangerClose(blob, player) {
    return this.calculateDistanceTo(player) < this.calculateDistanceTo(blob) * 1.25
      && player.isBiggerThan(this)
  }
}
