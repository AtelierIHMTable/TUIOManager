/**
 * @author Kevin Duglue <kevin.duglue@gmail.com> (Base code)
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com> (Base code)
 * @author Lucas Oms <lucas.oms@hotmail.fr> (Refactoring into widget decorator)
 */
import Behavior from '../Behavior';

class ClickWidget extends Behavior {
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
      console.log('disable clic');
    }
  }

  onTouchDeletion(tuioTouchId) {
    super.onTouchDeletion(tuioTouchId);
    const touchIndex = this.touchesId.indexOf(tuioTouchId);
    if (touchIndex > -1 && this._shouldTriggerClic) {
      this._clicCallback();
    }
    this.touchesId.splice(touchIndex, 1);
    if (this.touchesId.length === 0) {
      this._shouldTriggerClic = true;
    }
  }
}

export default ClickWidget;
