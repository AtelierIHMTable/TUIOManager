import Behavior from '../Behavior';
import DragNDropManager from '../utils/DragNDropManager';

class DropWidget extends Behavior {
  /**
   *
   * @param {BaseWidget} widget
   * @param {String} dropzoneName to handle onDrop on draggable widgets
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
