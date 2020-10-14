import { Vector } from './Vector.js'
import { Blob } from './Blob.js'
import { Bot } from './Bot.js';
import { Player } from './Player.js'
import { World } from './World.js'
import { Controller } from './Controller.js'
import { Automation } from './Automation.js';

export class Spawner {
  /**
   * @param {World} world
   */
  constructor(world) {
    this.world = world
  }

  /**
   * @returns {Player}
   */
  spawnPlayer() {
    const player = new Player(new Blob(this.randomPosition, 50), new Controller())
    this.world.register(player)

    return player
  }

  spawnBots() {
    while(this.world.players.size < 50) {
      const bot = new Bot(new Blob(this.randomPosition, 10), new Controller(), new Automation(this.world))
      this.world.register(bot)
    }
  }

  spawnFood() {
    while(this.world.blobs.size < 500) {
      this.world.supply(new Blob(this.randomPosition, this.randomRadius))
    }
  }

  /**
   * @returns {Vector}
   */
  get randomPosition() {
    const x = Math.floor(Math.random() * this.world.dimensions.x)
    const y = Math.floor(Math.random() * this.world.dimensions.y)
    return new Vector(x, y)
  }

  /**
   * @returns {Number}
   */
  get randomRadius() {
    const min = 5
    const max = 10
    return Math.floor(Math.random() * (max - min)) + min
  }
}
