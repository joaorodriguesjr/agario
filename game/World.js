import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Spawner } from './Spawner.js'

export class World {
  /**
   * @param {Object} config
   * @param {Spawner} spawner
   */
  constructor(config, spawner) {
    this.spawner = spawner
    this.dimensions = new Vector(config.world.width, config.world.height)

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
   * @returns {Number}
   */
  get playersCount() {
    return this.players.size
  }

  /**
   * @param {Player} player
   */
  registerPlayer(player) {
    this.players.forEach(rival => rival.track(player))
    this.players.forEach(rival => player.track(rival))
    this.players.add(player)
  }

  /**
   * @param {Player} subject
   * @returns {Player}
   */
  findNearestPlayer(subject) {
    /** @type {Player} **/
    let nearest

    const find = (player) => {
      if (player === subject) {
        return
      }

      if (nearest === undefined) {
        nearest = player
      }

      if (nearest.blob.calculateDistanceTo(subject.blob) < player.blob.calculateDistanceTo(subject.blob)) {
        return
      }

      nearest = player
    }

    this.players.forEach(find)
    return nearest
  }

  /**
   * @param {Blob} blob
   */
  registerBlob(blob) {
    this.blobs.add(blob)
  }

  /**
   * @param {Player} subject
   * @returns {Blob}
   */
  findNearestBlob(subject) {
    /** @type {Blob} **/
    let nearest

    const find = (blob) => {
      if (nearest === undefined) {
        nearest = blob
      }

      if (nearest.calculateDistanceTo(subject.blob) < blob.calculateDistanceTo(subject.blob)) {
        return
      }

      nearest = blob
    }

    this.blobs.forEach(find)
    return nearest
  }

  /**
   * @returns {void}
   */
  update() {
    this.spawner.spawnEntities(this)
    this.players.forEach(player => this.executePlayerMechanics(player))
  }

  /**
   * @param {Player} player
   */
  executePlayerMechanics(player) {
    player.executeMovement()

    const onBlobEaten = (blob) => this.removeBlob(blob)
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

  /**
   * @param {Blob} blob
   */
  removeBlob(blob) {
    this.blobs.delete(blob)
  }
}
