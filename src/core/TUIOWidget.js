/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import $ from "jquery/dist/jquery.min";
import { v4 as uuidV4 } from "uuid";

import { TUIOManager } from "./TUIOManager";

/**
 * Main class to manage TUIOWidget.
 *
 * @class TUIOWidget
 */
export class TUIOWidget {
  /**
   * TUIOWidget constructor.
   *
   * @constructor
   * @param {number} x - TUIOWidget's upperleft corner abscissa.
   * @param {number} y - TUIOWidget's upperleft corner ordinate.
   * @param {number} width - TUIOWidget's width.
   * @param {number} height - TUIOWidget's height.
   */
  constructor(x, y, width, height) {
    this._id = uuidV4();
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._touches = {};
    this._tags = {};
    /** @type {{[p: string]: ((any)=>any)[]}} */
    this._callbacks = {
      onTouchCreation: [],
      onTagCreation: [],
      onTouchDeletion: [],
      onTagDeletion: [],
      onTouchUpdate: [],
      onTagUpdate: [],
    };
    TUIOManager.getInstance().addWidget(this);
  }

  /**
   * TUIOWidget's id.
   *
   * @returns {string} TUIOWidget's id.
   */
  get id() {
    return this._id;
  }

  /**
   * TUIOWidget's DOM element.
   */
  get domElem() {
    return this._domElem;
  }

  /**
   * TUIOWidget's upperleft corner abscissa getter.
   *
   * @returns {number} TUIOWidget's upperleft corner abscissa.
   */
  get x() {
    return this._x;
  }

  /**
   * TUIOWidget's upperleft corner ordinate getter.
   *
   * @returns {number} TUIOWidget's upperleft corner ordinate.
   */
  get y() {
    return this._y;
  }

  /**
   * TUIOWidget's width.
   *
   * @returns {number} TUIOWidget's width.
   */
  get width() {
    return this._width;
  }

  /**
   * TUIOWidget's height.
   *
   * @returns {number} TUIOWidget's height.
   */
  get height() {
    return this._height;
  }

  /**
   * TUIOWidget's touches.
   *
   * @returns {Object} TUIOWidget's touches.
   */
  get touches() {
    return this._touches;
  }

  /**
   * TUIOWidget's tags.
   *
   * @returns {Object} TUIOWidget's tags.
   */
  get tags() {
    return this._tags;
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
      x >= this._x &&
      x <= this._x + this._width &&
      y >= this._y &&
      y <= this._y + this._height
    );
  }

  /**
   * Called on touch creation on the widget.
   * @param {(touch: TUIOTouch) => any} callback - Callback to call on touch creation.
   */
  onTouchCreation(callback) {
    this._callbacks.onTouchCreation.push(callback);
  }

  /**
   * Call after a TUIOTouch creation.
   *
   * @protected @method _onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  _onTouchCreation(tuioTouch) {
    if (!this.isTouched(tuioTouch.x, tuioTouch.y)) return;
    this._touches = {
      ...this._touches,
      [tuioTouch.id]: tuioTouch,
    };
    this._touches[tuioTouch.id].addWidget(this);
    this._callbacks.onTouchCreation.forEach((callback) => callback(tuioTouch));
  }

  /**
   * Called on tag creation on the widget.
   * @param {(tag: TUIOTag) => any} callback - Callback to call on tag creation.
   */
  onTagCreation(callback) {
    this._callbacks.onTagCreation.push(callback);
  }

  /**
   * Call after a TUIOTag creation.
   *
   * @protected @method _onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  _onTagCreation(tuioTag) {
    if (!this.isTouched(tuioTag.x, tuioTag.y)) return;
    this._tags = {
      ...this._tags,
      [tuioTag.id]: tuioTag,
    };
    this._tags[tuioTag.id].addWidget(this);
    this._callbacks.onTagCreation.forEach((callback) => callback(tuioTag));
  }

  /**
   * Called on touch deletion on the widget.
   * @param {(touchId: string) => any} callback - Callback to call on touch deletion.
   */
  onTouchDeletion(callback) {
    this._callbacks.onTouchDeletion.push(callback);
  }

  /**
   * Call after a TUIOTouch deletion.
   *
   * @protected @method _onTouchDeletion
   * @param {number/string} tuioTouchId - TUIOTouch's id to delete.
   */
  _onTouchDeletion(tuioTouchId) {
    if (typeof this._touches[tuioTouchId] !== "undefined") {
      delete this._touches[tuioTouchId];
      this._callbacks.onTouchDeletion.forEach((callback) =>
        callback(tuioTouchId),
      );
    }
  }

  /**
   * Called on tag deletion on the widget.
   * @param {(tagId: string) => any} callback - Callback to call on tag deletion.
   */
  onTagDeletion(callback) {
    this._callbacks.onTagDeletion.push(callback);
  }

  /**
   * Call after a TUIOTag deletion.
   *
   * @protected @method _onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  _onTagDeletion(tuioTagId) {
    if (typeof this._tags[tuioTagId] !== "undefined") {
      delete this._tags[tuioTagId];
      this._callbacks.onTagDeletion.forEach((callback) => callback(tuioTagId));
    }
  }

  /**
   * Called on touch update on the widget.
   * @param {(touch: TUIOTouch) => any} callback - Callback to call on touch update.
   */
  onTouchUpdate(callback) {
    this._callbacks.onTouchUpdate.push(callback);
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
  /**
   * Call after a TUIOTouch update.
   *
   * @protected @method _onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  _onTouchUpdate(tuioTouch) {
    this._callbacks.onTouchUpdate.forEach((callback) => callback(tuioTouch));
  }

  /**
   * Called on tag update on the widget.
   * @param {(tag: TUIOTag) => any} callback - Callback to call on tag update.
   */
  onTagUpdate(callback) {
    this._callbacks.onTagUpdate.push(callback);
  }

  /**
   * Call after a TUIOTag update.
   *
   * @protected @method _onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  _onTagUpdate(tuioTag) {
    this._callbacks.onTagUpdate.forEach((callback) => callback(tuioTag));
  }

  /**
   * Call to delete a widget
   *
   * @method deleteWidget
   */
  deleteWidget() {
    TUIOManager.getInstance().removeWidget(this);
  }

  /**
   * Call to add the widget to a DOM element
   *
   * @method addTo
   * @param {HTMLElement} element - A TUIOTag instance.
   */
  addTo(element) {
    $(element).append(this.domElem);
  }

  /* eslint-enable no-unused-vars,class-methods-use-this */
}
