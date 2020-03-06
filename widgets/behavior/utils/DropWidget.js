import Behavior from '../Behavior';
import DragNDropManager from './DragNDropManager';

/**
 * @class DropWidget
 * @extends Behavior
 *
 * Only define a widget as drop zone
 * Can define how to highlight and remove highlight to the component to make user
 * understand that drop the TouchDragWidget moving will trigger something
 */
class DropWidget extends Behavior {
  /**
   *
   * @param {BaseWidget} widget
   * @param {String} dropzoneName to handle onDrop on draggable concrete-widgets
   * @param {function(widget: BaseWidget):void} highlightMethod to highlight that an interaction will occurs
   * @param {function(widget: BaseWidget):void} unhighlightMethod to remove the highlight
   */
  constructor(widget, dropzoneName, highlightMethod = () => {
  }, unhighlightMethod = () => {
  }) {
    super(widget);
    // Remove position of wrapped widget
    this.dropzoneName = dropzoneName;
    DragNDropManager.getInstance()
      .addDropWidget(this);
    this.highlight = highlightMethod;
    this.unhighlight = unhighlightMethod;
    this.isHighlight = false;
  }
}

export default DropWidget;
