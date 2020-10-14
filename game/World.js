import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { Player } from './Player.js'

export class World {

  /**
   * @param {Vector} dimensions
   */
  constructor(dimensions) {
    /**
     * @type {Vector}
     */
    this.dimensions = dimensions

    /**
     * @type {Set<Blob>}
     */
    this.blobs = new Set()

    /**
     * @type {Set<Player>}
     */
    this.players = new Set()
  }

  /**
   * @param {Blob} foodBlob
   */
  supply(foodBlob) {
    this.blobs.add(foodBlob)
  }

  /**
   * @param {Player} player
   */
  register(player) {
    this.players.forEach(rival => rival.track(player))
    this.players.forEach(rival => player.track(rival))
    this.players.add(player)
  }

  /**
   * @returns {void}
   */
  update() {
    this.players.forEach(player => this.updatePlayer(player))
  }

  /**
   * @param {Player} player
   */
  updatePlayer(player) {
    player.update()
    const onBlobEaten = (blob) => this.blobs.delete(blob)
    this.blobs.forEach(blob => player.eatBlob(blob, onBlobEaten))
    const onEnemyBeaten = (enemy) => this.removePlayer(enemy)
    player.fightEnemies(onEnemyBeaten)
  }

  /**
   * @param {Player} player
   */
  removePlayer(player) {
    this.players.delete(player)
    this.players.forEach(rival => rival.untrack(player))
  }
}
