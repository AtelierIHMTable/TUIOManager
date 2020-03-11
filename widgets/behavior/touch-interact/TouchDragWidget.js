/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import TouchMoveWidget from './TouchMoveWidget';
import DragNDropManager from '../utils/DragNDropManager';

/**
 * @class TouchDragWidget
 * @extends TouchMoveWidget
 *
 * Add touch move interaction on the widget.
 * When the TouchDragWidget is dropped on a DropWidget calls a callback with the dropzone name
 *
 * You can supply dropzoneNames that the widget will listen to allow DropWidget highlight itself
 * to show to the user the future interaction
 * @see {DropWidget}
 */
class TouchDragWidget extends TouchMoveWidget {
  /**
   *
   * @param {BaseWidget} widget
   * @param {function(zoneDroppedOn: string, dropWidget: BaseWidget):void} dropCallback to call, pass dropzoneName and dropwidget as parameter
   * @param {string[]} zoneForInteractions allows to higlight dropzone when move this widget
   *
   * If you supply zoneForInteractions, DropWidget with the name of these dropzones will highlight
   * when this TouchDragWidget would interact on drop
   */
  constructor(widget, dropCallback = () => {
  }, zoneForInteractions = []) {
    super(widget);
    this.onDrop = dropCallback;
    this.zones = zoneForInteractions;
  }

  onTouchUpdate(tuioTouch) {
    super.onTouchUpdate(tuioTouch);
    DragNDropManager.getInstance()
      .move(this);
  }

  onTouchDeletion(tuioTouchId) {
    const touch = this.touches[tuioTouchId];
    // Stop there if the touch release isn't on this widget
    if (!touch) {
      return;
    }
    // Check if the widget is within a drop zone
    const dropOnWidgets = DragNDropManager.getInstance()
      .dropsOn(this);

    if (dropOnWidgets.length > 0) {
      for (let i = 0; i < dropOnWidgets.length; i += 1) {
        this.onDrop(dropOnWidgets[i].dropzoneName, dropOnWidgets[i]);
      }
    }
    super.onTouchDeletion(tuioTouchId);
  }
}

export default TouchDragWidget;
