/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import Behavior from '../Behavior';
import Point from '../../../src/utils/Point';

/**
 * @class TouchRotateInteractWidget
 * @extends Behavior
 *
 * Allow a widget to have interaction on rotate behavior
 *
 * @example Rotating button
 */
class TouchRotateInteractWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {function(deltaAngle: number, currentAngle): void} callback with angle delta as parameter
   */
  constructor(widget, callback) {
    super(widget);
    this._currentAngle = 0;
    this._lastTouchesValues = [];
    this._callback = callback
  }

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch);
    if (!this._isInStack) {
      if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
        this._lastTouchesValues = {
          ...this._lastTouchesValues,
          [tuioTouch.id]: {
            x: tuioTouch.x,
            y: tuioTouch.y,
          },
        };
      }
    }
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    super.onTouchUpdate(tuioTouch);
    if (this._lastTouchesValues[tuioTouch.id] !== undefined) {
      this._lastTouchesValues[tuioTouch.id].x = tuioTouch.x;
      this._lastTouchesValues[tuioTouch.id].y = tuioTouch.y;
      const touchesWidgets = [];
      Object.keys(this._lastTouchesValues)
        .forEach((key) => {
          touchesWidgets.push({
            ...this._lastTouchesValues[key],
          });
        });
      if (touchesWidgets.length === 2) {
        const touch1 = new Point(touchesWidgets[0].x, touchesWidgets[0].y);
        const touch2 = new Point(touchesWidgets[1].x, touchesWidgets[1].y);
        if (!this.lastAngle) {
          this.lastAngle = touch1.angleWith(touch2)
        } else {
          this._currentAngle += touch1.angleWith(touch2) - this.lastAngle + 360;
          this._currentAngle %= 360;
          if (this.lastAngle < touch1.angleWith(touch2)) {
            this._callback(touch1.angleWith(touch2) - this.lastAngle, this._currentAngle);
          } else {
            this._callback(this.lastAngle - touch1.angleWith(touch2), this._currentAngle);
          }
          this.lastAngle = touch1.angleWith(touch2)
        }
      }
    }
  }

  /**
   * Call after a TUIOTouch deletion.
   *
   * @method onTouchDeletion
   * @param {number/string} tuioTouchId - TUIOTouch's id to delete.
   */
  onTouchDeletion(tuioTouchId) {
    super.onTouchDeletion(tuioTouchId);
    if (this._lastTouchesValues[tuioTouchId] !== undefined) {
      delete this._lastTouchesValues[tuioTouchId];
      this.lastAngle = undefined;
    }
  }
}

export default TouchRotateInteractWidget;
