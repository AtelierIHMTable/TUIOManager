/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 * @author Joel Dibasso <joel@dibasso.fr>
 */

/**
 * Main class to manage TUIOObject.
 *
 * @class TUIOObject
 */
export class TUIOObject {
  /**
   * @type {number}
   * The id of the TUIOObject.
   */
  id;
  /**
   * @type {number}
   * The absolute x coordinate of the TUIOObject.
   */
  x;
  /**
   * @type {number}
   * The absolute y coordinate of the TUIOObject.
   */
  y;

  /**
   * TUIOObject constructor.
   *
   * @constructor
   * @param {number} id - TUIOObject's id.
   * @param {number} x - TUIOObject's abscissa.
   * @param {number} y - TUIOObject's ordinate.
   */
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
