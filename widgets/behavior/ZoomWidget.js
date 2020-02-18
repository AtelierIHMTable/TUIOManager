import Behavior from './Behavior';
import Point from '../../src/utils/Point';

class ZoomWidget extends Behavior {
  constructor(widget) {
    super(widget);
    console.log('ZoomWidget.widget', widget);
    this._lastTouchesValues = {};
    this.internX = widget.x;
    this.internY = widget.y;
    this.scale = 1;
    this.domElem.addClass(this.id);
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
        console.log('Register touch event');
        this._lastTouchesValues = {
          ...this._lastTouchesValues,
          [tuioTouch.id]: {
            x: tuioTouch.x,
            y: tuioTouch.y,
          },
        };
        this._lastTouchesValues.pinchDistance = 0;
        if (this._lastTouchesValues.scale == null) {
          this._lastTouchesValues.scale = this.scale
        }
      }
    }
    console.log(this._lastTouchesValues);
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    super.onTouchUpdate(tuioTouch);
    console.log('New touch', tuioTouch);
    if (this._lastTouchesValues[tuioTouch.id] !== undefined) {
      this._lastTouchesValues[tuioTouch.id].x = tuioTouch.x;
      this._lastTouchesValues[tuioTouch.id].y = tuioTouch.y;
      const touchesWidgets = [];
      Object.keys(this._lastTouchesValues)
        .forEach((key) => {
          if (key !== 'scale' && key !== 'pinchDistance') {
            touchesWidgets.push({
              ...this._lastTouchesValues[key],
            });
          }
        });
      console.log('TOUCHES', touchesWidgets);
      if (touchesWidgets.length === 2) {
        const touch1 = new Point(touchesWidgets[0].x, touchesWidgets[0].y);
        const touch2 = new Point(touchesWidgets[1].x, touchesWidgets[1].y);
        let newscale = this._lastTouchesValues.scale;
        // Resize d'une image
        const c = touch1.distanceTo(touch2);
        console.log(`Distance between points ${c}`);
        if (c > this._lastTouchesValues.pinchDistance) {
          newscale = this._lastTouchesValues.scale * 1.018; // new scale is 1.5 times the old scale
          this._lastTouchesValues.scale = newscale //  We save the scale
        } else if (c < this._lastTouchesValues.pinchDistance) {
          newscale = this._lastTouchesValues.scale * 0.985; // new scale is 1.5 times the old scale
          this._lastTouchesValues.scale = newscale //  We save the scale
        }
        this.scale = newscale;
        this._lastTouchesValues.pinchDistance = c;
        console.log(`New scale ${newscale}`);

        this.domElem.css('transform', `scale(${this.scale})`);
        this._width = this.domElem.width();
        this._height = this.domElem.height();
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
    if (typeof (this._lastTouchesValues[tuioTouchId]) !== 'undefined') {
      delete this._lastTouchesValues[tuioTouchId];
    }
  }

  isTouched(x, y) {
    let onDomElem = document.elementFromPoint(x, y);
    if (onDomElem) {
      // Reach all parents
      let init = onDomElem.classList.contains(this.id);
      while (onDomElem.parentElement && !init) {
        onDomElem = onDomElem.parentElement;
        init = init || onDomElem.classList.contains(this.id);
      }
      if (init) {
        console.log('Touched ', this);
        return true;
      }
    }
    return false;
  }
}

export default ZoomWidget;
