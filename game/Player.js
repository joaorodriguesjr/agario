import { Blob } from './Blob.js'
import { Vector } from './Vector.js'
import { Controller } from './Controller.js'

export class Player {
  /**
   * @param {Blob} blob
   * @param {Controller} controller
   */
  constructor(blob, controller) {
    this.blob = blob
    this.controller = controller
    this.enemies = new Set()
  }

  /**
   * @param {Player} player
   */
  onPlayerDelete(player) {
    this.untrack(player)
  }

  /**
   * @param {Blob} blob
   */
  onBlobDelete(blob) { }

  /**
   * @param {Player} enemy
   */
  track(enemy) {
    this.enemies.add(enemy)
  }

  /**
   * @param {Player} enemy
   */
  untrack(enemy) {
    this.enemies.delete(enemy)
  }

  /**
   * @returns {void}
   */
  executeMovement() {
    if (! this.controller.isMoving()) {
      return
    }

    this.blob.move(this.controller.nextMovement())
  }

  /**
   * @param {Vector} position
   */
  target(position) {
    this.controller.addMovement(position)
  }

  /**
   * @param {Function} onEnemyBeaten
   */
  fightEnemies(onEnemyBeaten) {
    this.enemies.forEach(enemy => this.fightEnemy(enemy, onEnemyBeaten))
  }

  /**
   * @param {Player} enemy
   * @param {Function} onEnemyBeaten
   */
  fightEnemy(enemy, onEnemyBeaten) {
    if (! this.reached(enemy.blob)) {
      return
    }

    if (! this.isBiggerThan(enemy)) {
      return
    }

    this.blob.grow(enemy.blob.radius / 5)
    onEnemyBeaten(enemy)
  }

  /**
   * @param {Blob} blob
   * @param {Function} onBlobEaten
   */
  eatBlob(blob, onBlobEaten) {
    if (! this.reached(blob)) {
      return
    }

    this.blob.grow(blob.radius / 10)
    onBlobEaten(blob)
  }

  /**
   * @param {Blob} blob
   * @returns {Boolean}
   */
  reached(blob) {
    const distance = this.blob.calculatePathTo(blob).calculateLength()
    return (distance < (this.blob.radius - blob.radius / 2))
  }

  /**
   * @param {Player} enemy
   * @returns {Boolean}
   */
  isBiggerThan(enemy) {
    return this.blob.radius > enemy.blob.radius
  }
}
