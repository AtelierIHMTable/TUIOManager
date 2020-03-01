import Behavior from '../Behavior';
import Point from '../../../src/utils/Point';

/**
 * @class TagCenterRotateWidget
 *
 * Use a tag to rotate the widget. Doesn't work with another tag interact with the same id,
 * use one tag to zoom and another to move for example
 */
class TagCenterRotateWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {number} idTag to delete widget
   */
  constructor(widget, idTag) {
    super(widget);
    this.domElem.css('position', 'absolute');
    this._tagLastPosition = null;
    this._idTag = idTag;
    this._currentAngle = 0;
  }

  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    if (tuioTag.id === this._idTag && this.isTouched(tuioTag.x, tuioTag.y)) {
      this._tagLastPosition = {
        x: tuioTag.x,
        y: tuioTag.y,
      };
    }
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    super.onTagUpdate(tuioTag);
    if (this._tagLastPosition && tuioTag.id === this._idTag) {
      const center = new Point(this.domElem.position().left + this.domElem.width() / 2,
        this.domElem.position().top + this.domElem.height() / 2);
      const tagPosition = new Point(this._tagLastPosition.x, this._tagLastPosition.y);
      if (!this._lastAngle) {
        this._lastAngle = tagPosition.angleWith(center)
      } else {
        if (this._lastAngle < tagPosition.angleWith(center)) {
          this._currentAngle += tagPosition.angleWith(center) - this._lastAngle
        } else {
          this._currentAngle -= this._lastAngle - tagPosition.angleWith(center)
        }
        this._currentAngle %= 360;
        this._lastAngle = tagPosition.angleWith(center)
      }
      this.domElem.css('transform', `${this.currentTransform} rotate(360deg)`);
      this._width = this.domElem.width();
      this._height = this.domElem.height();
      const valueWithoutRotate = this.currentTransform.replace(/rotate\([-+]?[0-9]*\.?[0-9]+deg\)/g, '');
      this.currentTransform = `${valueWithoutRotate} rotate(${this._currentAngle}deg)`;
      this.domElem.css('transform', this.currentTransform);
      this._x = this.domElem.position().left;
      this._y = this.domElem.position().top;
      this._tagLastPosition = {
        x: tuioTag.x,
        y: tuioTag.y,
      };
    }
  }

  onTagDeletion(tuioTagId) {
    super.onTagDeletion(tuioTagId);
    this._tagLastPosition = null;
  }
}

export default TagCenterRotateWidget;
