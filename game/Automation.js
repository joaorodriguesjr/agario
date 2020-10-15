import { World } from './World.js'
import { Blob } from './Blob.js'
import { Player } from './Player.js'

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

    this.mode = 'Feeding'
  }

  /**
   * @param {Player} subject
   */
  operate(subject) {
    this.updateTargets(subject)

    if (this.mode === 'Feeding') subject.controller.addMovement(this.staticTarget.calculatePathTo(subject.blob))
    if (this.mode === 'Hunting') subject.controller.addMovement(this.movingTarget.blob.calculatePathTo(subject.blob))
    if (this.mode === 'Running') subject.controller.addMovement(subject.blob.calculatePathFrom(this.movingTarget.blob))
  }

  /**
   * @param {Player} subject
   */
  updateTargets(subject) {
    if (this.mode === 'Hunting') this.validateHuntingState(subject)
    if (this.mode === 'Running') this.validateRunningState(subject)
    if (this.mode === 'Feeding') this.validateFeedingState(subject)

    this.world.players.forEach(rival => this.updateMovingTarget(subject, rival))
    this.world.blobs.forEach(blob => this.updateStaticTarget(blob, subject))
  }

  /**
   * @param {Player} subject
   */
  validateHuntingState(subject) {
    if (this.stillHunting(subject)) {
      return
    }

    this.mode = 'Feeding'
    delete this.movingTarget
  }

  /**
   * @param {Player} subject
   * @return {Boolean}
   */
  stillHunting(subject) {
    let hunting = true

    if (subject.isCloseEnoughTo(this.movingTarget)) hunting = true
    if (subject.reached(this.movingTarget.blob)) hunting = false

    return hunting
  }

  /**
   * @param {Player} subject
   */
  validateRunningState(subject) {
    if (! subject.isFarEnoughTo(this.movingTarget)) {
      return
    }

    this.mode = 'Feeding'
    delete this.movingTarget
  }

  /**
   * @param {Player} subject
   */
  validateFeedingState(subject) {
    if (this.staticTarget === undefined) {
      return
    }

    if (! subject.reached(this.staticTarget)) {
      return
    }

    delete this.staticTarget
  }

  /**
   * @param {Player} subject
   * @param {Player} rival
   */
  updateMovingTarget(subject, rival) {
    if (rival === subject) {
      return
    }

    if (! subject.isCloseEnoughTo(rival)) {
      return
    }

    delete this.staticTarget
    this.movingTarget = rival
    this.mode = subject.isBiggerThan(rival) ? 'Hunting' : 'Running'
  }

  /**
   * @param {Blob} blob
   * @param {Player} subject
   */
  updateStaticTarget(blob, subject) {
    if (this.mode === 'Hunting' || this.mode === 'Running') {
      return
    }

    if (this.staticTarget === undefined) {
      this.staticTarget = blob
    }

    if (blob.calculateDistance(subject.blob) < this.staticTarget.calculateDistance(subject.blob)) {
      this.staticTarget = blob
    }
  }
}
