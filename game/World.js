import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Bot } from './Bot.js'
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

    this.initializeScales()
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
    this.players.forEach(player => this.executePlayerMechanics(player))
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

    const finder = (player) => {
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

    this.players.forEach(finder)
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

    const finder = (blob) => {
      if (nearest === undefined) {
        nearest = blob
      }

      if (nearest.calculateDistanceTo(subject.blob) < blob.calculateDistanceTo(subject.blob)) {
        return
      }

      nearest = blob
    }

    this.blobs.forEach(finder)
    return nearest
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
    this.players.forEach(rival => rival.onPlayerRemove(player))
  }

  /**
   * @param {Blob} blob
   */
  removeBlob(blob) {
    this.blobs.delete(blob)
    this.players.forEach(player => player.onBlobRemove(blob))
  }

  /**
   * @param {Player} viewer
   */
  calculateScale(viewer) {
    const radius = viewer.blob.radius

    for (const scale of this.scales) {
      if (radius > scale.min && radius < scale.max) this.scale = this.interpolate(this.scale, scale.value, 0.05)
    }

    return this.scale
  }

  initializeScales() {
    this.scales = new Set()

    let step = (this.dimensions.y / 25) / 4
    let iterator = step
    let scale = this.scale = 1

    while (iterator < this.dimensions.y / 4) {
      this.scales.add({ min: iterator, max: iterator + step, value: scale })
      iterator = iterator + step
      scale = scale - 0.035
    }
  }

  /**
   * @param {Number} min
   * @param {Number} max
   * @param {Number} step
   * @return {Number}
   */
  interpolate(min, max, step) {
    return (max - min) * step + min
  }
}
