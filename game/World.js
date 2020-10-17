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

    /** @type {Number} */
    this.width  = config.world.width

    /** @type {Number} */
    this.height = config.world.height

    /** @type {Set<Blob>} */
    this.blobs = new Set()

    /** @type {Set<Player>} */
    this.players = new Set()
  }

  /**
   * @returns {Number}
   */
  get playersCount() {
    return this.players.size
  }

  /**
   * @returns {Number}
   */
  get blobsCount() {
    return this.blobs.size
  }

  /**
   * @returns {void}
   */
  update() {
    this.spawner.spawnEntities(this)
    for (let player of this.players) this.executePlayerMechanics(player)
  }

  /**
   * @param {Player} player
   */
  registerPlayer(player) {
    for (let rival of this.players) {
      rival.track(player)
      player.track(rival)
    }

    this.players.add(player)
  }

  /**
   * @param {Player} subject
   * @returns {Player}
   */
  findNearestPlayer(subject) {
    /** @type {Player} **/
    let nearest

    for (let player of this.players) {
      if (player === subject) {
        continue
      }

      if (nearest === undefined) {
        nearest = player
      }

      if (nearest.calculateDistanceTo(subject) < player.calculateDistanceTo(subject)) {
        continue
      }

      nearest = player
    }

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

    for (let blob of this.blobs) {
      if (nearest === undefined) {
        nearest = blob
      }

      if (nearest.calculateDistanceTo(subject) < blob.calculateDistanceTo(subject)) {
        continue
      }

      nearest = blob
    }

    return nearest
  }

  /**
   * @param {Player} player
   */
  executePlayerMechanics(player) {
    player.executeMovement(this)

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
    this.players.forEach(rival => rival.onPlayerRemove(player))
  }

  /**
   * @param {Blob} blob
   */
  removeBlob(blob) {
    this.blobs.delete(blob)
    this.players.forEach(player => player.onBlobRemove(blob))
  }
}
