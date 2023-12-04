/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */

import { TUIOWidget } from "../../../src/index.js";

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
   * @protected @method _onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  _onTouchCreation(tuioTouch) {
    super._onTouchCreation(tuioTouch);
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @protected @method _onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  _onTouchUpdate(tuioTouch) {
    super._onTouchUpdate(tuioTouch);
  }

  /**
   * Call after a TUIOTag creation.
   *
   * @protected @method _onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  _onTagCreation(tuioTag) {
    super._onTagCreation(tuioTag);
  }

  /**
   * Call after a TUIOTag update.
   *
   * @protected @method #onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  _onTagUpdate(tuioTag) {
    super._onTagUpdate(tuioTag);
  }

  /**
   * Call after a TUIOTag deletion.
   *
   * @protected @method _onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  _onTagDeletion(tuioTagId) {
    super._onTagDeletion(tuioTagId);
  }
}
