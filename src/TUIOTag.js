/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 * @author Joel Dibasso <joel@dibasso.fr>
 */

import { TUIOObject } from "./TUIOObject";

/**
 * Main class to manage TUIOTag.
 *
 * @class TUIOTag
 * @extends TUIOObject
 */
export class TUIOTag extends TUIOObject {
  /**
   * @type {number}
   * @default 0
   * @description TUIOTag's angle.
   */
  angle;
  /**
   * TUIOTag constructor.
   *
   * @constructor
   * @param {number} id - TUIOTag's id.
   * @param {number} x - TUIOTag's abscissa.
   * @param {number} y - TUIOTag's ordinate.
   * @param {number} angle - TUIOTag's angle.
   */
  constructor(id, x, y, angle = 0) {
    super(id, x, y);
    this.angle = angle;
  }
}
