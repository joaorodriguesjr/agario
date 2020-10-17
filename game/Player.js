import { Blob } from './Blob.js'
import { Vector } from './Vector.js'
import { Controller } from './Controller.js'

export class Player extends Blob {
  /**
   * @param {Vector} position
   * @param {Vector} velocity
   * @param {Vector} acceleration
   * @param {Number} radius
   * @param {Controller} controller
   */
  constructor(position, velocity, acceleration, radius, controller) {
    super(position, velocity, acceleration, radius)
    this.controller = controller

    /** @type {Set<Player>} */
    this.enemies = new Set()
  }

  /**
   * @param {Player} player
   */
  onPlayerRemove(player) {
    this.untrack(player)
  }

  /**
   * @param {Blob} blob
   */
  onBlobRemove(blob) { }

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
   * @param {Vector} position
   */
  targetDirection(position) {
    this.controller.addMovement(position)
  }

  /**
   * @param {World} world
   * @returns {void}
   */
  executeMovement(world) {
    if (! this.controller.isMoving()) {
      return
    }

    this.move(world, this.controller.nextMovement())
  }

  /**
   * @param {Function} onEnemyBeaten
   */
  fightEnemies(onEnemyBeaten) {
    for (let enemy of this.enemies) this.fightEnemy(enemy, onEnemyBeaten)
  }

  /**
   * @param {Player} enemy
   * @param {Function} onEnemyBeaten
   */
  fightEnemy(enemy, onEnemyBeaten) {
    if (! this.reached(enemy)) {
      return
    }

    if (! this.isBiggerThan(enemy)) {
      return
    }

    this.grow(enemy.radius / 5)
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

    this.grow(blob.radius / 10)
    onBlobEaten(blob)
  }
}
