import { Blob } from './Blob.js';
import { World } from './World.js';
import { Player } from './Player.js';

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
  }

  /**
   * @param {Player} subject
   */
  operate(subject) {
    if (this.staticTarget !== undefined) {
      subject.controller.addCommand(this.staticTarget.calculatePath(subject.blob))
    }
  }

  /**
   * @param {Player} subject
   */
  updateTargets(subject) {
    if (this.movingTarget !== undefined) {
      if (subject.reached(this.movingTarget.blob)) delete this.movingTarget
    }

    if (this.staticTarget !== undefined) {
      if (subject.reached(this.staticTarget)) delete this.staticTarget
    }

    this.world.players.forEach(player => this.updateMovingTarget(player, subject))
    this.world.blobs.forEach(blob => this.updateStaticTarget(blob, subject))
  }

  /**
   * @param {Player} player
   * @param {Player} subject
   */
  updateMovingTarget(player, subject) {
    if (player === subject) {
      return
    }
  }

  /**
   * @param {Blob} blob
   * @param {Player} subject
   */
  updateStaticTarget(blob, subject) {
    if (this.staticTarget === undefined) {
      this.staticTarget = blob

      return
    }

    if (blob.calculateDistance(subject.blob) > this.staticTarget.calculateDistance(subject.blob)) {
      return
    }

    this.staticTarget = blob
  }
}
