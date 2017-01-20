/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

/**
 * Main class to manage TUIOWidget.
 *
 * @class TUIOWidget
 */
class TUIOWidget {

  /**
   * TUIOWidget constructor.
   *
   * @constructor
   * @param {any} domElem - TUIOWidget's domElem.
   * @param {number} x - TUIOWidget's upperleft coin abscissa.
   * @param {number} y - TUIOWidget's upperleft coin ordinate.
   * @param {number} width - TUIOWidget's width.
   * @param {number} height - TUIOWidget's height.
   */
  constructor(domElem, x, y, width, height) {
    this._domElem = domElem;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  /**
   * TUIOWidget's domElem getter.
   *
   * @returns {any} TUIOWidget's domElem.
   */
  get domElem() { return this._domElem; }

  /**
   * TUIOWidget's upperleft coin abscissa getter.
   *
   * @returns {number} TUIOWidget's upperleft coin abscissa.
   */
  get x() { return this._x; }

  /**
   * TUIOWidget's upperleft coin ordinate getter.
   *
   * @returns {number} TUIOWidget's upperleft coin ordinate.
   */
  get y() { return this._y; }

  /**
   * TUIOWidget's width.
   *
   * @returns {number} TUIOWidget's width.
   */
  get width() { return this._width; }

  /**
   * TUIOWidget's height.
   *
   * @returns {number} TUIOWidget's height.
   */
  get height() { return this._height; }

  /**
   * Check if TUIOWidget is touched.
   *
   * @method isTouched
   * @param {number} x - Point's abscissa to test.
   * @param {number} y - Point's ordinate to test.
   */
  isTouched(x, y) {
    return (x >= this._x && x <= this._x + this._width && y >= this._y && y <= this._y + this._height);
  }
}

export default TUIOWidget;
