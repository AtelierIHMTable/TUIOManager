/**
 * @author Kevin Duglue <kevin.duglue@gmail.com> (Base code)
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com> (Base code)
 * @author Lucas Oms <lucas.oms@hotmail.fr> (Refactoring into widget decorator)
 */
import Behavior from '../Behavior';

/**
 * @class TouchMoveWidget
 * @extends Behavior
 *
 * Allow a widget to be moved with touch events
 */
class TouchMoveWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   */
  constructor(widget) {
    super(widget);
    this.domElem.css('position', 'absolute');
    this._lastTouchesValues = {};
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

  /**
   * Move ImageWidget.
   *
   * @method moveTo
   * @param {string/number} x - New ImageWidget's abscissa.
   * @param {string/number} y - New ImageWidget's ordinate.
   */
  moveTo(x, y) {
    this.domElem.css('left', `${x}px`);
    this.domElem.css('top', `${y}px`);
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    super.onTouchUpdate(tuioTouch);
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      const touchesWidgets = [];
      const currentTouches = this.touches;
      Object.keys(this.touches)
        .forEach((key) => {
          touchesWidgets.push(currentTouches[key])
        });

      if (touchesWidgets.length === 1) {
        const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
        const diffX = tuioTouch.x - lastTouchValue.x;
        const diffY = tuioTouch.y - lastTouchValue.y;

        const newX = parseFloat(this.domElem.css('left')
          .replace(/px/g, '')) + diffX;
        const newY = parseFloat(this.domElem.css('top')
          .replace(/px/g, '')) + diffY;
        this._x = this.x + diffX;
        this._y = this.y + diffY;

        this.moveTo(newX, newY);
        this._lastTouchesValues = {
          ...this._lastTouchesValues,
          [tuioTouch.id]: {
            x: tuioTouch.x,
            y: tuioTouch.y,
          },
        }
      }
    }
  }
}

export default TouchMoveWidget;
