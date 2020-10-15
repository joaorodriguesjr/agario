import { World } from './World.js'
import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Bot } from './Bot.js'

export class Automation {
  /**
   * @param {World} world
   */
  constructor(world) {
    this.world = world

    /**
     * @type {Player}
     */
    this.movingTarget

    /**
     * @type {Blob}
     */
    this.staticTarget

    this.behaviour = 'Feeding'
  }

  /**
   * @param {Bot} subject
   */
  executeBehaviour(subject) {
    this.updateTargets(subject)

    if (this.behaviour === 'Feeding') subject.advanceTo(this.staticTarget)
    if (this.behaviour === 'Running') subject.retreatFrom(this.movingTarget.blob)
    if (this.behaviour === 'Hunting') subject.advanceTo(this.movingTarget.blob)
  }

  /**
   * @param {Bot} subject
   */
  updateTargets(subject) {
    this.staticTarget = this.world.findNearestBlob(subject)
    this.updateMovingTarget(subject, this.world.findNearestPlayer(subject))

    if (this.behaviour === 'Running') this.validateRunningBehaviour(subject)
    if (this.behaviour === 'Hunting') this.validateHuntingBehaviour(subject)
    if (this.behaviour === 'Feeding') this.validateFeedingBehaviour(subject)
  }

  /**
   * @param {Bot} subject
   */
  validateHuntingBehaviour(subject) {
    if (this.stillHunting(subject)) {
      return
    }

    this.behaviour = 'Feeding'
  }

  /**
   * @param {Bot} subject
   * @return {Boolean}
   */
  stillHunting(subject) {
    let hunting = subject.isCloseEnoughToHunt(this.movingTarget)
    if (subject.reached(this.movingTarget.blob)) hunting = false

    return hunting
  }

  /**
   * @param {Bot} subject
   */
  validateRunningBehaviour(subject) {
    if (! subject.isFarEnoughTo(this.movingTarget)) {
      return
    }

    this.behaviour = 'Feeding'
  }

  /**
   * @param {Bot} subject
   */
  validateFeedingBehaviour(subject) {
    if (this.staticTarget === undefined || this.movingTarget === undefined) {
      return
    }

    if (subject.isDangerClose(this.staticTarget, this.movingTarget)) {
      this.behaviour = 'Running'
    }
  }

  /**
   * @param {Bot} subject
   * @param {Player} rival
   */
  updateMovingTarget(subject, rival) {
    this.movingTarget = rival

    if (! subject.isCloseEnoughToHunt(rival) || ! subject.isCloseEnoughToRunFrom(rival)) {
      return
    }

    if (subject.shouldRunFrom(rival)) {
      this.behaviour = 'Running'
    }

    if (subject.shouldHunt(rival)) {
      this.behaviour = 'Hunting'
    }
  }
}
