/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import Behavior from '../Behavior';

/**
 * @class TouchInteractWidget
 * @extends Behavior
 *
 * Add a callback on simple touch. The callback won't trigger
 * if there was a touch update (touch move) to prevent triggering with other actions
 */
class TouchInteractWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {function(widget: BaseWidget): void} callback to execute on click, pass widget as parameter
   */
  constructor(widget, callback) {
    super(widget);
    this._clicCallback = callback;
    this.touchesId = [];
    this._shouldTriggerClic = true;
  }

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch);
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      this.touchesId.push(tuioTouch.id);
    }
  }

  /**
   * Prevent click callback when moving with touch
   * @param tuioTouch
   */
  onTouchUpdate(tuioTouch) {
    super.onTouchUpdate(tuioTouch);
    if (this.touchesId.indexOf(tuioTouch.id) > -1) {
      this._shouldTriggerClic = false;
    }
  }

  onTouchDeletion(tuioTouchId) {
    super.onTouchDeletion(tuioTouchId);
    const touchIndex = this.touchesId.indexOf(tuioTouchId);
    if (touchIndex > -1 && this._shouldTriggerClic) {
      this._clicCallback(this); // Not sure of this line, maybe this.widget is better
    }
    this.touchesId.splice(touchIndex, 1);
    if (this.touchesId.length === 0) {
      this._shouldTriggerClic = true;
    }
  }
}

export default TouchInteractWidget;
