import Behavior from '../Behavior';
import Point from '../../../src/utils/Point';

/**
 * @class TagCenterZoomWidget
 *
 * Use a tag to zoom widget. Doesn't work with another tag interact with the same id,
 * use one tag to zoom and another to move for example
 */
class TagCenterZoomWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {number} idTag to delete widget
   */
  constructor(widget, idTag) {
    super(widget);
    this.domElem.css('position', 'absolute');
    this._tagLastPosition = null;
    this._idTag = idTag;
    this._scale = 1;
    this._distanceToCenter = 0;
  }

  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    if (tuioTag.id === this._idTag && this.isTouched(tuioTag.x, tuioTag.y)) {
      this._tagLastPosition = {
        x: tuioTag.x,
        y: tuioTag.y,
      };
      const center = new Point(this.domElem.position().left + this.domElem.width() / 2,
        this.domElem.position().top + this.domElem.height() / 2);
      const tagPosition = new Point(this._tagLastPosition.x, this._tagLastPosition.y);
      this._distanceToCenter = center.distanceTo(tagPosition);
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
      let newscale = this._scale;
      const c = center.distanceTo(tagPosition);
      if (c > this._distanceToCenter) {
        newscale = this._scale * 1.018; // new scale is 1.5 times the old scale
        this._scale = newscale //  We save the scale
      } else if (c < this._distanceToCenter) {
        newscale = this._scale * 0.985; // new scale is 1.5 times the old scale
        this._scale = newscale //  We save the scale
      }
      this._scale = newscale;
      this._distanceToCenter = c;
      const transformWithoutScale = this.currentTransform.replace(/scale\([0-9]*\.?[0-9]+\)/g, '');
      this.currentTransform = `${transformWithoutScale} scale(${this._scale})`;
      this.domElem.css('transform', this.currentTransform);
      this._width = this.domElem.width();
      this._height = this.domElem.height();
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

export default TagCenterZoomWidget;
