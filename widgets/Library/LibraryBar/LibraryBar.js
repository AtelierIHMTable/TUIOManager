/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */

import { TUIOWidget } from "../../../src/core/TUIOWidget";

/**
 * Class for a LibraryBar
 *
 * @class LibraryBar
 * @extends TUIOWidget
 */
export class LibraryBar extends TUIOWidget {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  /**
   * ImageWidget's domElem.
   *
   * @returns {HTMLElement} ImageWidget's domElem.
   */
  get domElem() {
    return this._domElem;
  }

  /**
   * Check if TUIOWidget is touched.
   *
   * @method isTouched
   * @param {number} x - Point's abscissa to test.
   * @param {number} y - Point's ordinate to test.
   */
  isTouched(x, y) {
    return (
      x >= this.x &&
      x <= this.width + this.x &&
      y >= this.y &&
      y <= this.y + this.height &&
      !this.isHide
    );
  }

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation(tuioTouch) {}

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {}

  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {}

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {}

  /**
   * Call after a TUIOTag deletion.
   *
   * @method onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  onTagDeletion(tuioTagId) {}
}