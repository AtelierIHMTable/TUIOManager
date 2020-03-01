import MoveWidget from './MoveWidget';
import DragNDropManager from '../utils/DragNDropManager';

class DragWidget extends MoveWidget {
  /**
   *
   * @param {BaseWidget} widget
   * @param {string[]} zoneForInteractions
   * @param {function(zoneDroppedOn: string):void} dropCallback
   */
  constructor(widget, zoneForInteractions, dropCallback = () => {
  }) {
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
