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
   * @param {Blob} target
   */
  advanceTo(target) {
    this.controller.addMovement(this.blob.calculatePathTo(target))
  }

  /**
   * @param {Blob} target
   */
  retreatFrom(target) {
    this.controller.addMovement(this.blob.calculatePathFrom(target))
  }

  /**
   * @returns {void}
   */
  executeMovement() {
    this.automation.executeBehaviour(this)
    super.executeMovement()
  }

  /**
   * @param {Player} player
   */
  onPlayerDelete(player) {
    super.onPlayerDelete(player)
    this.automation.checkMovingTarget(this, player)
  }

  /**
   * @param {Blob} blob
   */
  onBlobDelete(blob) {
    super.onBlobDelete(blob)
    this.automation.checkStaticTarget(this, blob)
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isCloseEnoughToHunt(enemy) {
    return (this.blob.calculateDistanceTo(enemy.blob) < (this.blob.radius + enemy.blob.radius) * 2.00)
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isCloseEnoughToRunFrom(enemy) {
    return (this.blob.calculateDistanceTo(enemy.blob) < (this.blob.radius + enemy.blob.radius) * 1.85)
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isFarEnoughToRunFrom(enemy) {
    return (this.blob.calculateDistanceTo(enemy.blob) > (this.blob.radius + enemy.blob.radius) * 2.50)
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
    return this.blob.calculateDistanceTo(player.blob) < this.blob.calculateDistanceTo(blob) * 1.25
      && player.isBiggerThan(this)
  }
}
