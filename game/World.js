import { Blob } from './Blob.js'
import { Player } from './Player.js'
import { Spawner } from './Spawner.js'
import { Quadtree } from './Quadtree.js';
import { Point } from './Point.js';

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

    /** @type {Map<Point, Blob>} */
    this.blobs = new Map()

    /** @type {Set<Player>} */
    this.players = new Set()

    this.tree = new Quadtree(this.width, this.height, config.quadtree.quadrant.capacity)
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
    this.tree.build(this.blobs.keys())
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
    const point = new Point(blob.position.x, blob.position.y)
    this.blobs.set(point, blob)
    // this.tree.build(this.blobs.keys())
  }

  /**
   * @param {Player} subject
   * @returns {Blob}
   */
  findNearestBlob(subject) {
    /** @type {Blob} **/
    let nearest

    for (let [point, blob] of this.blobs) {
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

    const onBlobEaten = (blob, key) => this.removeBlob(blob, key)
    this.blobs.forEach((blob, key) => player.eatBlob(blob, key, onBlobEaten))

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
  removeBlob(blob, key) {
    this.blobs.delete(key)
    this.players.forEach(player => player.onBlobRemove(blob))
  }
}
