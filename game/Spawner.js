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
    while (world.blobsCount < this.config.blobs) this.spawnBlob(world)
  }

  /**
   * @param {World} world
   * @returns {Player}
   */
  spawnPlayer(world) {
    // const position = this.calculateRandomPosition(world)
    const position = new Vector(world.width / 2, world.height / 2)
    const velocity = new Vector(0, 0)
    const acceleration = new Vector(this.config.player.speed, this.config.player.speed)
    const player = new Player(position, velocity, acceleration, this.config.player.radius, new Controller())
    world.registerPlayer(player)

    return player
  }

  /**
   * @param {World} world
   */
  spawnBot(world) {
    const position = this.calculateRandomPosition(world)
    const velocity = new Vector(0, 0)
    const acceleration = new Vector(this.config.bot.speed, this.config.bot.speed)
    const bot = new Bot(position, velocity, acceleration, this.config.bot.radius, new Controller(), new Automation(world))
    world.registerPlayer(bot)
  }

  /**
   * @param {World} world
   */
  spawnBlob(world) {
    const position = this.calculateRandomPosition(world)
    const velocity = new Vector(0, 0)
    const acceleration = new Vector(0, 0)
    const radius = this.calculateRandomRadius()
    const blob = new Blob(position, velocity, acceleration, radius)
    world.registerBlob(blob)
  }

  /**
   * @param {World} world
   * @returns {Vector}
   */
  calculateRandomPosition(world) {
    const x = Math.floor(Math.random() * world.width )
    const y = Math.floor(Math.random() * world.height)
    return new Vector(x, y)
  }

  /**
   * @returns {Number}
   */
  calculateRandomRadius() {
    const min = this.config.blob.radius.min
    const max = this.config.blob.radius.max
    return Math.random() * (max - min) + min
  }
}
