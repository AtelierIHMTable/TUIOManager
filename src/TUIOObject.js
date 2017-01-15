/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

/**
 * Main class to manage TUIOObject.
 *
 * @class TUIOObject
 */
class TUIOObject {

  /**
   * TUIOObject constructor.
   *
   * @constructor
   * @param {string/number} id - TUIOObject's id.
   * @param {string/number} x - TUIOObject's abscissa.
   * @param {string/number} y - TUIOObject's ordinate.
   */
  constructor(id, x, y) {
    this._id = id;
    this._x = x;
    this._y = y;
  }

  /**
   * TUIOObject's id getter.
   *
   * @returns {string|number} TUIOObject's id.
   */
  get id() { return this._id; }

  /**
   * TUIOObject's abscissa getter.
   *
   * @returns {string|number} TUIOObject's abscissa.
   */
  get x() { return this._x };

  /**
   * TUIOObject's ordinate getter.
   *
   * @returns {string|number} TUIOObject's ordinate.
   */
  get y() { return this._y };

  /**
   * Update TUIOObject's position.
   *
   * @method moveTo
   * @param {string/number} x - New TUIOObject's abscissa.
   * @param {string/number} y - New TUIOObject's ordinate.
   */
  moveTo(x, y) {
    this._x = x;
    this._y = y;
  }
}

export default TUIOObject;
