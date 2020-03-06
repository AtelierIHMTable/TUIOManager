/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import Behavior from '../Behavior';
import TUIOManager from '../../../core/TUIOManager';

/**
 * Delete an element if a touch is directly detected on the widget
 * /!\ (move the tag to the widget won't work with this behavior)
 */
class TouchDeleteWidget extends Behavior {
  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch);
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      TUIOManager.getInstance()
        .removeWidget(this);
      this.domElem.remove();
    }
  }
}

export default TouchDeleteWidget;
