/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import Behavior from '../Behavior';

/**
 * @class TagInteractWidget
 * @extends Behavior
 *
 * Add a callback on tag detection
 */
class TagInteractWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {number} idTag to react
   * @param {function(widget: BaseWidget): void} callback to execute on click, pass widget as parameter
   */
  constructor(widget, idTag, callback) {
    super(widget);
    this._idTag = idTag;
    this.interaction = callback;
  }

  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    if (tuioTag.id === this._idTag && this.isTouched(tuioTag.x, tuioTag.y)) {
      this.interaction(this);// Not sure of this line, maybe this.widget is better
    }
  }
}

export default TagInteractWidget;
