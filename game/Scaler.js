import { Player } from './Player.js';

export class Scale {
  /**
   * @param {Number} min
   * @param {Number} max
   * @param {Number} value
   */
  constructor(min, max, value) {
    this.min = min
    this.max = max
    this.value = value
  }

  /**
   * @param {Player} subject
   */
  inTheRange(subject) {
    return (subject.radius > this.min && subject.radius < this.max)
  }
}

export class Scaler {
  constructor() {
    /** @type {Map<Player, Set<Scale>>} */
    this.scales = new Map()

    /** @type {Map<Player, Number>} */
    this.cache = new Map()
  }

  /**
   * @param {Player} subject
   * @param {HTMLCanvasElement} canvas
   */
  calculateScale(subject, canvas) {
    if (! this.scales.has(subject)) {
      this.initializeScales(subject, canvas)
    }

    for (let scale of this.scales.get(subject)) {
      if (! scale.inTheRange(subject)) {
        continue
      }

      this.updateScale(subject, scale)
    }

    return this.cache.get(subject)
  }

  /**
   * @param {Player} subject
   * @param {HTMLCanvasElement} canvas
   */
  initializeScales(subject, canvas) {
    /** @type {Set<Scale>} */
    const scales = new Set()

    const divisions = 5, step = (canvas.height / divisions)
    let current = step, iterations = divisions

    while (current <= canvas.height) {
      const min = (current - step)
      const max = current
      const value = (1 / divisions) * iterations
      scales.add(new Scale(min, max, value))

      current += step
      iterations -= 1
    }

    this.scales.set(subject, scales)
    this.cache.set(subject, 1)
  }

  /**
   * @param {Player} subject
   * @param {Scale} scale
   */
  updateScale(subject, scale) {
    this.cache.set(subject, this.interpolate(this.cache.get(subject), scale.value, 0.025))
  }

  /**
   * @param {Number} min
   * @param {Number} max
   * @param {Number} step
   * @returns {Number}
   */
  interpolate(min, max, step) {
    return (max - min) * step + min
  }
}
