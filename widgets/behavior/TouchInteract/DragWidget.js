/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import MoveWidget from './MoveWidget';
import DragNDropManager from '../utils/DragNDropManager';

class DragWidget extends MoveWidget {
  /**
   *
   * @param {BaseWidget} widget
   * @param {function(zoneDroppedOn: string):void} dropCallback
   * @param {string[]} zoneForInteractions allows to higlight dropzone when move this widget
   *
   * If you supply zoneForInteractions, DropWidget with the name of these dropzones will highlight
   * when this DragWidget would interact on drop
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
        this.onDrop(dropOnWidgets[i].dropzoneName);
      }
    }
    super.onTouchDeletion(tuioTouchId);
  }
}

export default DragWidget;
