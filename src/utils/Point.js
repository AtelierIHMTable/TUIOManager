/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */

/**
 * Class representing a Point.
 *
 * @class Point
 */
class Point {

  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  /**
   * get the distance to another Point
   *
   * @method distanceTo
   * @param {Point} p2 - A Point instance.
   */
  distanceTo(p2) {
    const a = this.x - p2.x;
    const b = this.y - p2.y;
    return Math.sqrt((a * a) + (b * b));
  }

  /**
   * get the angle of the vector with another Point
   *
   * @method angleWith
   * @param {Point} p2 - A Point instance.
   */
  angleWith(p2) {
    return (Math.atan2(p2.y - this.y, p2.x - this.x)) * (180 / Math.PI);
  }
}

export default Point;