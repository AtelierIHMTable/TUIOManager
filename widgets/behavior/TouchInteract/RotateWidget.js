/**
 * @author Kevin Duglue <kevin.duglue@gmail.com> (Base code)
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com> (Base code)
 * @author Lucas Oms <lucas.oms@hotmail.fr> (Refactoring into widget decorator)
 */
import Behavior from '../Behavior';
import Point from '../../../src/utils/Point';

class RotateWidget extends Behavior {
  constructor(widget) {
    super(widget);
    this._currentAngle = 0;
    this._lastTouchesValues = [];
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

        // Rotation d'une image
        if (!this.lastAngle) {
          this.lastAngle = touch1.angleWith(touch2)
        } else {
          if (this.lastAngle < touch1.angleWith(touch2)) {
            this._currentAngle += touch1.angleWith(touch2) - this.lastAngle
          } else {
            this._currentAngle -= this.lastAngle - touch1.angleWith(touch2)
          }
          this._currentAngle %= 360;
          this.lastAngle = touch1.angleWith(touch2)
        }
        this.domElem.css('transform', `${this.currentTransform} rotate(360deg)`);
        this._width = this.domElem.width();
        this._height = this.domElem.height();
        const valueWithoutRotate = this.currentTransform.replace(/rotate\([-+]?[0-9]*\.?[0-9]+deg\)/g, '');
        this.currentTransform = `${valueWithoutRotate} rotate(${this._currentAngle}deg)`;
        this.domElem.css('transform', this.currentTransform);
        this._x = this.domElem.position().left;
        this._y = this.domElem.position().top
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
    }
  }
}

export default RotateWidget;
