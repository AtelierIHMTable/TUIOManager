import Behavior from '../Behavior';
import TUIOManager from '../../../core/TUIOManager';

/**
 * On a touch creation, the widget will go on top of other based on other BaseWidget indexes
 */
class GoOnTopWidget extends Behavior {
  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch);
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      const currentZindex = parseInt(this.domElem.css('z-index'), 0);
      let maxZindex = currentZindex;
      const currentWidgets = TUIOManager.getInstance()._widgets;
      const keys = Object.keys(currentWidgets);
      for (let i = 0; i < keys.length; i += 1) {
        const widget = currentWidgets[keys[i]];
        const widgetZindex = parseInt(widget.domElem.css('z-index'), 0);
        if (widgetZindex > maxZindex) {
          maxZindex = widgetZindex;
        }
      }
      if (maxZindex > currentZindex) {
        this.domElem.css('z-index', maxZindex + 1);
      }
    }
  }
}

export default GoOnTopWidget;
