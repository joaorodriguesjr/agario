import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Spawner } from './Spawner.js'

export class World {
  /**
   * @param {Object} config
   * @param {Spawner} spawner
   */
  constructor(config, spawner) {
    this.width  = config.world.width
    this.height = config.world.height

    this.spawner = spawner

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

      if (nearest.calculateDistanceTo(subject) < player.calculateDistanceTo(subject)) {
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

      if (nearest.calculateDistanceTo(subject) < blob.calculateDistanceTo(subject)) {
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

  /**
   * @param {Player} viewer
   */
  calculateScale(viewer) {
    for (const scale of this.scales) {
      if (! this.inTheRange(viewer.radius, scale)) {
        continue
      }

      this.updateScale(scale.value)
    }

    return this.scale
  }

  updateScale(value) {
    this.scale = this.interpolate(this.scale, value, 0.05)
  }

  inTheRange(radius, scale) {
    return (radius > scale.min && radius < scale.max)
  }

  initializeScales() {
    const height = this.height / 4

    let step = height / 25
    let iterator = step
    let scale = this.scale = 1

    this.scales = new Set()

    while (iterator < height) {
      this.scales.add({ min: iterator, max: iterator + step, value: scale })
      iterator += step
      scale -= (1 / 27.5)
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
