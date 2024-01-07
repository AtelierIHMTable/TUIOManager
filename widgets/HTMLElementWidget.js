import { v4 as uuidV4 } from "uuid";
import { TUIOManager } from "../src/index.js";

export class HTMLElementWidget {
  /**
   * @param {HTMLElement} element - The HTML element to use as anchor for the TUIOManager.
   */
  constructor(element) {
    this._id = uuidV4();
    this._domElem = element;

    this._updateCoordinates();
    this._touches = {};
    /** @type {Map<string, {id: number, x: number, y: number, angle: number}>} */
    this._tags = new Map();
    this._callbacks = {
      onTouchCreation: [],
      onTagCreation: [],
      onTouchDeletion: [],
      onTagDeletion: [],
      onTouchUpdate: [],
      onTagDrag: [],
      onTagRotate: [],
    };
    this._angle = 0;
    TUIOManager.getInstance().addWidget(this);
  }

  get id() {
    return this._id;
  }

  get domElem() {
    return this._domElem;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get angle() {
    return this._angle;
  }

  get touches() {
    return this._touches;
  }

  get tags() {
    return this._tags;
  }

  _updateCoordinates() {
    const boundingRect = this._domElem.getBoundingClientRect();
    this._x = boundingRect.x;
    this._y = boundingRect.y;
    this._width = boundingRect.width;
    this._height = boundingRect.height;
  }

  _updateAngle() {
    const transform = this._domElem.style.transform;
    const angleRegex = /rotate\((.*)rad\)/;
    const angle = transform.match(angleRegex);
    if (angle) {
      this._angle = +angle[1];
    }
  }

  /**
   * Check if widget is touched.
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
  addOnTouchDownListener(callback) {
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
  addOnTagDownListener(callback) {
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
    this._tags.set(tuioTag.id, {
      id: tuioTag.id,
      x: tuioTag.x,
      y: tuioTag.y,
      angle: tuioTag.angle,
    });
    tuioTag.addWidget(this);
    this._callbacks.onTagCreation.forEach((callback) => callback(tuioTag));
  }

  /**
   * Called on touch deletion on the widget.
   * @param {(touchId: string) => any} callback - Callback to call on touch deletion.
   */
  addOnTouchUpListener(callback) {
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
  addOnTagUpListener(callback) {
    this._callbacks.onTagDeletion.push(callback);
  }

  /**
   * Call after a TUIOTag deletion.
   *
   * @protected @method _onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  _onTagDeletion(tuioTagId) {
    if (this._tags.has(tuioTagId)) {
      this._tags.delete(tuioTagId);
      this._callbacks.onTagDeletion.forEach((callback) => callback(tuioTagId));
    }
  }

  /**
   * Called on touch update on the widget.
   * @param {(touch: TUIOTouch) => any} callback - Callback to call on touch update.
   */
  addOnTouchDragListener(callback) {
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
   * @param {(tag: TUIOTag, oldPos: {x: number, y: number}) => any} callback - Callback to call on tag update.
   */
  addOnTagDragListener(callback) {
    this._callbacks.onTagDrag.push(callback);
  }

  /**
   * Called on tag rotation on the widget.
   * @param {(tag: TUIOTag, oldAngle: number) => any} callback - Callback to call on tag rotation.
   */
  addOnTagRotateListener(callback) {
    this._callbacks.onTagRotate.push(callback);
  }

  /**
   * Call after a TUIOTag update.
   *
   * @protected @method _onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  _onTagUpdate(tuioTag) {
    if (!this._tags.has(tuioTag.id)) return;
    const oldTag = this._tags.get(tuioTag.id);
    if (tuioTag.angle !== oldTag.angle) {
      this._callbacks.onTagRotate.forEach((callback) =>
        callback(tuioTag, oldTag.angle),
      );
    }
    this._callbacks.onTagDrag.forEach((callback) =>
      callback(tuioTag, { x: oldTag.x, y: oldTag.y }),
    );
    this._tags.set(tuioTag.id, oldTag);
    this._updateCoordinates();
    this._updateAngle();
  }

  /**
   * Call to delete a widget
   *
   * @method deleteWidget
   */
  deleteWidget() {
    TUIOManager.getInstance().removeWidget(this);
  }
}
