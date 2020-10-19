import { Quadrant } from './Quadrant.js'
import { Point } from './Point.js'

export class Quadtree {
  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Number} quadrantCapacity
   */
  constructor(width, height, quadrantCapacity) {
    this.width  = width
    this.height = height
    this.quadrantCapacity = quadrantCapacity
  }

  /**
   * @param {Iterable<Point>} points
   */
  build(points) {
    this.root = new Quadrant(new Point(0, 0), this.width, this.height, this.quadrantCapacity)
    for (let point of points) this.root.insert(point)
  }

  /**
   * @param {Rectangle} area
   * @returns {Set<Point>}
   */
  query(area) {
    /** @type {Set<Point>} */
    const found = new Set()
    this.root.search(area, found)

    return found
  }
}
