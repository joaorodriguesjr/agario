import { Vector } from './Vector.js'

export class Blob {
  /**
   * @param {Vector} position
   * @param {Vector} velocity
   * @param {Vector} acceleration
   * @param {Number} radius
   */
  constructor(position, velocity, acceleration, radius) {
    this.position = position
    this.velocity = velocity
    this.acceleration = acceleration
    this.radius = radius
  }

  /**
   * @param {World} world
   * @param {Vector} target
   */
  move(world, target) {
    const movement = target.withLength(this.acceleration.calculateLength())
    const x = this.position.x + movement.x + this.radius
    const y = this.position.y + movement.y + this.radius

    if (x < 0 || x > world.width && y < 0 || y > world.height) {
      return
    }

    if (x < 0 || x > world.width) {
      movement.x = 0
    }

    if (y < 0 || y > world.height) {
      movement.y = 0
    }

    this.velocity = movement
    this.position.add(this.velocity)
    return
  }

  /**
   * @param {Number} growth
   */
  grow(growth) {
    this.radius = this.radius + growth
    this.speed  = this.speed  - growth / 1000
  }

  /**
   * @param {Blob} target
   * @returns {Boolean}
   */
  isBiggerThan(target) {
    return this.radius > target.radius
  }

  /**
   * @param {Blob} target
   * @returns {Number}
   */
  calculateDistanceTo(target) {
    return this.calculatePathTo(target).calculateLength() + (this.radius + target.radius)
  }

  /**
   * @param {Blob} target
   * @returns {Vector}
   */
  calculatePathTo(target) {
    return target.position.minus(this.position)
  }

  /**
   * @param {Blob} target
   * @returns {Vector}
   */
  calculatePathFrom(target) {
    return target.position.plus(this.position)
  }

  /**
   * @param {Blob} target
   * @returns {Boolean}
   */
  reached(target) {
    return (this.calculatePathTo(target).calculateLength() < (this.radius - target.radius / 2))
  }
}
