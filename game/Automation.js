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
    this.hunting = 0
  }

  /**
   * @param {Bot} subject
   */
  operate(subject) {
    this.updateTargets(subject)

    if (this.behaviour === 'Feeding') subject.advanceTo(this.staticTarget)
    if (this.behaviour === 'Running') subject.retreatFrom(this.movingTarget.blob)
    if (this.behaviour === 'Hunting') subject.advanceTo(this.movingTarget.blob)
  }

  /**
   * @param {Bot} subject
   */
  updateTargets(subject) {
    if (this.behaviour === 'Running') this.validateRunningBehaviour(subject)
    if (this.behaviour === 'Hunting') this.validateHuntingBehaviour(subject)
    if (this.behaviour === 'Feeding') this.validateFeedingBehaviour(subject)

    this.world.players.forEach(rival => this.updateMovingTarget(subject, rival))
    this.world.blobs.forEach(blob => this.updateStaticTarget(blob, subject))
  }

  /**
   * @param {Bot} subject
   */
  validateHuntingBehaviour(subject) {
    if (this.stillHunting(subject)) {
      this.hunting++
      return
    }

    this.hunting = 0
    this.behaviour = 'Feeding'
    delete this.movingTarget
  }

  /**
   * @param {Bot} subject
   * @return {Boolean}
   */
  stillHunting(subject) {
    let hunting = true

    // if (subject.isCloseEnoughToHunt(this.movingTarget)) hunting = true
    if (subject.reached(this.movingTarget.blob)) hunting = false
    if (this.hunting > 60) hunting = false

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
    delete this.movingTarget
  }

  /**
   * @param {Bot} subject
   */
  validateFeedingBehaviour(subject) {
    if (this.staticTarget === undefined) {
      return
    }

    if (! subject.reached(this.staticTarget)) {
      return
    }

    delete this.staticTarget
  }

  /**
   * @param {Bot} subject
   * @param {Player} rival
   */
  updateMovingTarget(subject, rival) {
    if (rival === subject) {
      return
    }

    if (! subject.isCloseEnoughToHunt(rival) || ! subject.isCloseEnoughToRunFrom(rival)) {
      return
    }

    if (subject.shouldRunFrom(rival)) {
      this.behaviour = 'Running'
    }

    if (subject.shouldHunt(rival)) {
      this.behaviour = 'Hunting'
    }

    this.movingTarget = rival
  }

  /**
   * @param {Blob} blob
   * @param {Bot} subject
   */
  updateStaticTarget(blob, subject) {
    if (this.behaviour === 'Hunting' || this.behaviour === 'Running') {
      return
    }

    if (this.staticTarget === undefined) {
      this.staticTarget = blob
    }

    if (blob.calculateDistanceTo(subject.blob) < this.staticTarget.calculateDistanceTo(subject.blob)) {
      this.staticTarget = blob
    }
  }
}
