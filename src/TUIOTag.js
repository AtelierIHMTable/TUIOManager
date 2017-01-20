/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

import TUIOObject from './TUIOObject';

/**
 * Main class to manage TUIOTag.
 *
 * @class TUIOTag
 * @extends TUIOObject
 */
class TUIOTag extends TUIOObject {

  /**
   * TUIOTag constructor.
   *
   * @constructor
   * @param {string/number} id - TUIOTag's id.
   * @param {string/number} tagId - TUIOTag's tagId.
   * @param {string/number} x - TUIOTag's abscissa.
   * @param {string/number} y - TUIOTag's ordinate.
   * @param {string/number} angle - TUIOTag's angle.
   */
  constructor(id, tagId, x, y, angle) {
    super(id, x, y);
    this._tagId = tagId;
    this._angle = angle;
  }

  /**
   * TUIOTag's tagId getter.
   *
   * @returns {string|number} TUIOTag's tagId.
   */
  get tagId() { return this._tagId; }

  /**
   * TUIOTag's angle getter.
   *
   * @returns {string|number} TUIOTag's angle.
   */
  get angle() { return this._angle; }

  /**
   * Update TUIOTag's angle.
   *
   * @method rotate
   * @param {string/number} angle - New TUIOTag's angle.
   */
  rotate(angle) {
    this._angle = angle;
  }
}

export default TUIOTag;
