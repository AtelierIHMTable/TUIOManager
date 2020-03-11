/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import Behavior from '../Behavior';

/**
 * @class TagMoveWidget
 */
class TagMoveWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {string} idTag to delete widget
   */
  constructor(widget, idTag) {
    super(widget);
    this.domElem.css('position', 'absolute');
    this._tagLastPosition = null;
    this._idTag = idTag;
  }

  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    if (tuioTag.id.toString() === this._idTag.toString() && this.isTouched(tuioTag.x, tuioTag.y)) {
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
      const diffX = tuioTag.x - this._tagLastPosition.x;
      const diffY = tuioTag.y - this._tagLastPosition.y;

      const newX = parseFloat(this.domElem.css('left')
        .replace(/px/g, '')) + diffX;
      const newY = parseFloat(this.domElem.css('top')
        .replace(/px/g, '')) + diffY;
      this._x = this.x + diffX;
      this._y = this.y + diffY;

      this.moveTo(newX, newY);
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

  /**
   * Move ImageWidget.
   *
   * @method moveTo
   * @param {string/number} x - New ImageWidget's abscissa.
   * @param {string/number} y - New ImageWidget's ordinate.
   */
  moveTo(x, y) {
    this.domElem.css('left', `${x}px`);
    this.domElem.css('top', `${y}px`);
  }
}

export default TagMoveWidget;
