export class Vector {
  /**
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @param {Vector} vector
   */
  add(vector) {
    this.x += vector.x
    this.y += vector.y
  }

  /**
   * @param {Vector} vector
   */
  sub(vector) {
    this.x -= vector.x
    this.y -= vector.y
  }

  /**
   * @param {Vector} vector
   */
  plus(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }

  /**
   * @param {Vector} vector
   */
  minus(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }

  multipliedBy(scalar) {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  dividedBy(scalar) {
    return new Vector(this.x / scalar, this.y / scalar)
  }

  calculateLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalized() {
    return this.dividedBy(this.calculateLength())
  }

  withLength(scalar) {
    return this.normalized().multipliedBy(scalar)
  }
}
