import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { Bot } from './Bot.js'
import { Player } from './Player.js'
import { World } from './World.js'
import { Controller } from './Controller.js'
import { Automation } from './Automation.js'

export class Spawner {
  /**
   * @param {Object} config
   */
  constructor(config) {
    this.config = config.spawn
  }

  /**
   * @param {World} world
   */
  spawnEntities(world) {
    while (world.playersCount < this.config.players) this.spawnBot(world)
    while (world.blobs.size < this.config.blobs) this.spawnBlob(world)
  }

  /**
   * @param {World} world
   * @returns {Player}
   */
  spawnPlayer(world) {
    const blob = new Blob(this.calculateRandomPosition(world), this.config.player.radius)
    const player = new Player(blob, new Controller())
    world.registerPlayer(player)

    return player
  }

  /**
   * @param {World} world
   */
  spawnBot(world) {
    const blob = new Blob(this.calculateRandomPosition(world), this.config.bot.radius)
    const bot = new Bot(blob, new Controller(), new Automation(world))
    world.registerPlayer(bot)
  }

  /**
   * @param {World} world
   */
  spawnBlob(world) {
    const blob = new Blob(this.calculateRandomPosition(world), this.calculateRandomRadius())
    world.registerBlob(blob)
  }

  /**
   * @param {World} world
   * @returns {Vector}
   */
  calculateRandomPosition(world) {
    const x = Math.floor(Math.random() * world.dimensions.x)
    const y = Math.floor(Math.random() * world.dimensions.y)
    return new Vector(x, y)
  }

  /**
   * @returns {Number}
   */
  calculateRandomRadius() {
    const min = this.config.blob.radius.min
    const max = this.config.blob.radius.max
    return Math.floor(Math.random() * (max - min)) + min
  }
}