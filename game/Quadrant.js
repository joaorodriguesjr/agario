import { Point } from './Point.js'
import { Rectangle } from './Rectangle.js'

export class Quadrant extends Rectangle {
  /**
   * @param {Point} position
   * @param {Number} width
   * @param {Number} height
   * @param {Number} capacity
   */
  constructor(position, width, height, capacity) {
    super(position, width, height)
    this.capacity = capacity

    /** @type {Set<Point>} */
    this.points = new Set()
  }

  /**
   * @param {Rectangle} area
   * @param {Set<Point>} found
   * @returns {Set<Point>}
   */
  search(area, found) {
    if (! this.intersects(area)) {
      return
    }

    for (let point of this.points) {
      if (area.contains(point)) found.add(point)
    }

    if (! this.isSubdivided()) {
      return
    }

    this.northEast.search(area, found)
    this.northWest.search(area, found)
    this.southEast.search(area, found)
    this.southWest.search(area, found)
  }

  /**
   * @param {Point} point
   */
  insert(point) {
    if (! this.contains(point)) {
      return
    }

    if (this.isSubdivided()) {
      return this.delegateInsertion(point)
    }

    if (this.isFull()) {
      this.subdivide()
      this.points.forEach(point => this.delegateInsertion(point))
      return this.delegateInsertion(point)
    }

    this.points.add(point)
  }

  /**
   * @param {Point} point
   */
  delegateInsertion(point) {
    this.points.delete(point)
    this.northEast.insert(point)
    this.northWest.insert(point)
    this.southEast.insert(point)
    this.southWest.insert(point)
  }

  subdivide() {
    const {x, y} = this.position
    const width  = this.width  / 2
    const height = this.height / 2

    const ne = new Point(x + width, y)
    const nw = new Point(x, y)
    const se = new Point(x + width, y + height)
    const sw = new Point(x, y + height)

    this.northEast = new Quadrant(ne, width, height, this.capacity)
    this.northWest = new Quadrant(nw, width, height, this.capacity)
    this.southEast = new Quadrant(se, width, height, this.capacity)
    this.southWest = new Quadrant(sw, width, height, this.capacity)
  }

  /**
   * @returns {Boolean}
   */
  isFull() {
    return this.points.size + 1 > this.capacity
  }

  /**
   * @returns {Boolean}
   */
  isSubdivided() {
    return (
      this.northEast !== undefined ||
      this.northWest !== undefined ||
      this.southEast !== undefined ||
      this.southWest !== undefined
    )
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  debugRender(context) {
    context.strokeStyle = 'black'
    context.lineWidth = 2
    context.beginPath()
    context.rect(this.position.x, this.position.y, this.width, this.height)
    context.stroke()
    context.closePath()

    if (! this.isSubdivided()) return

    this.northEast.debugRender(context)
    this.northWest.debugRender(context)
    this.southEast.debugRender(context)
    this.southWest.debugRender(context)
  }

  /**
   * @param {Rectangle} area
   * @param {Set<Point>} found
   * @returns {Set<Point>}
   */
  debugSearch(area, found) {
    if (! area.intersects(this)) {
      return
    }

    for (let point of this.points) {
      if (area.contains(point)) found.add({point, quad: this})
    }

    if (this.isSubdivided()) {
      this.northEast.debugSearch(area, found)
      this.northWest.debugSearch(area, found)
      this.southEast.debugSearch(area, found)
      this.southWest.debugSearch(area, found)
    }
  }
}
