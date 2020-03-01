import Behavior from '../Behavior';
import TUIOManager from '../../../core/TUIOManager';

/**
 * Delete an element if a tag is directly put on the widget
 * /!\ (move the tag to the widget won't work with this behavior)
 */
class TagDeleteWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {number} idTag to delete widget
   */
  constructor(widget, idTag) {
    super(widget);
    this._idTag = idTag;
  }

  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    if (tuioTag.id === this._idTag && this.isTouched(tuioTag.x, tuioTag.y)) {
      TUIOManager.getInstance()
        .removeWidget(this);
      this.domElem.remove();
    }
  }
}

export default TagDeleteWidget;
