/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


import TUIOWidget from '../../core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../core/constants';
import { radToDeg } from '../../core/helpers';
import Point from '../../src/utils/Point';

/**
 * Abstract class to manage ImageElementWidget.
 *
 * @class ElementWidget
 * @extends TUIOWidget
 */
class ElementWidget extends TUIOWidget {
  // constructor (x, y, width, height, initialRotation, tagMove, tagDelete, tagZoom, )
  constructor(x, y, width, height, initialRotation, initialScale, tagMove, tagDelete, tagZoom) {
    if (new.target === ElementWidget) {
      throw new TypeError('ElementWidget is an abstract class. It cannot be instanciated');
    }
    super(x, y, width, height);
    this.idTagMove = tagMove;
    this.idTagDelete = tagDelete;
    this.idTagZoom = tagZoom;
    this._currentAngle = initialRotation;
    this.scale = initialScale;
    this._lastTouchesValues = {};
    this._lastTagsValues = {};
    this.internX = x;
    this.internY = y;
    this.internWidth = width;
    this.internHeight = height;
    ElementWidget.zIndexGlobal += 1;
    this.zIndex = ElementWidget.zIndexGlobal;

    this.canMoveTactile = true;
    this.canZoomTactile = true;
    this.canRotateTactile = true;
    this.canDeleteTactile = true;

    this.canMoveTangible = true;
    this.canZoomTangible = true;
    this.canRotateTangible = true;
    this.canDeleteTangible = true;

    this.isDisabled = false;
  }// constructor

  /**
     * ImageWidget's domElem.
     *
     * @returns {JQuery Object} ImageWidget's domElem.
     */
  get domElem() { return this._domElem; }

  /**
   * Check if TUIOWidget is touched.
   *
   * @method isTouched
   * @param {number} x - Point's abscissa to test.
   * @param {number} y - Point's ordinate to test.
   */
  isTouched(x, y) {
    return (x >= this.internX && x <= this.internX + this.internWidth && y >= this.internY && y <= this.internY + this.internHeight) && !this.isDisabled;
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
        this._lastTouchesValues.scale = this.scale;
      }
    }
  }

  /**
   * Move ImageWidget.
   *
   * @method moveTo
   * @param {string/number} x - New ImageWidget's abscissa.
   * @param {string/number} y - New ImageWidget's ordinate.
   * @param {number} angle - New ImageWidget's angle.
   */
  moveTo(x, y, angle = null) {
    this._x = x;
    this._y = y;
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    if (angle !== null) {
      this._domElem.css('transform', `rotate(${angle}deg)`);
    }
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      ElementWidget.zIndexGlobal += 1;
      this.zIndex = ElementWidget.zIndexGlobal;
      this._domElem.css('z-index', this.zIndex);
      const touchesWidgets = [];
      const currentTouches = this.touches;
      Object.keys(this.touches).forEach((key) => {
        touchesWidgets.push(currentTouches[key]);
      });

      if (touchesWidgets.length === 1 && this.canMoveTactile) {
        const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
        const diffX = tuioTouch.x - lastTouchValue.x;
        const diffY = tuioTouch.y - lastTouchValue.y;

        let newX = this.x + diffX;
        let newY = this.y + diffY;
        this.internX = this.internX + diffX;
        this.internY = this.internY + diffY;

        if (newX < 0) {
          newX = 0;
        }

        if (newX > (WINDOW_WIDTH - this.width)) {
          newX = WINDOW_WIDTH - this.width;
        }

        if (newY < 0) {
          newY = 0;
        }

        if (newY > (WINDOW_HEIGHT - this.height)) {
          newY = WINDOW_HEIGHT - this.height;
        }

        this.moveTo(newX, newY);
        this._lastTouchesValues = {
          ...this._lastTouchesValues,
          [tuioTouch.id]: {
            x: tuioTouch.x,
            y: tuioTouch.y,
          },
        };
      } else if (touchesWidgets.length === 2) {
        const touch1 = new Point(touchesWidgets[0].x, touchesWidgets[0].y);
        const touch2 = new Point(touchesWidgets[1].x, touchesWidgets[1].y);
        let newscale = this._lastTouchesValues.scale;
        // Resize d'une image
        if (this.canZoomTactile) {
          const c = touch1.distanceTo(touch2);
          if (c > this._lastTouchesValues.pinchDistance) {
            newscale = this._lastTouchesValues.scale * 1.018; // new scale is 1.5 times the old scale
            this._lastTouchesValues.scale = newscale; //  We save the scale
          } else if (c < this._lastTouchesValues.pinchDistance) {
            newscale = this._lastTouchesValues.scale * 0.985; // new scale is 1.5 times the old scale
            this._lastTouchesValues.scale = newscale; //  We save the scale
          }
          this._lastTouchesValues.pinchDistance = c;
        }

        // Rotation d'une image
        if (this.canRotateTactile) {
          if (!this.lastAngle) {
            this.lastAngle = touch1.angleWith(touch2);
          } else {
            if (this.lastAngle < touch1.angleWith(touch2)) {
              this._currentAngle += touch1.angleWith(touch2) - this.lastAngle;
            } else {
              this._currentAngle -= this.lastAngle - touch1.angleWith(touch2);
            }
            this._currentAngle = this._currentAngle % 360;
            this.lastAngle = touch1.angleWith(touch2);
          }
        }
        this._domElem.css('transform', `rotate(${this._currentAngle}deg) scale(${newscale})`);
        this.internX = this._domElem.position().left;
        this.internY = this._domElem.position().top;
        this.internWidth = this._domElem.width();
        this.internHeight = this._domElem.height();
      } else if (touchesWidgets.length === 3 && this.canDeleteTactile) {
        this._domElem.remove();
        this.deleteWidget();
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
    ElementWidget.isAlreadyTouched = false;
    this.lastAngle = null;
  }

  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);

    if (this.isTouched(tuioTag.x, tuioTag.y)) {
      this._lastTagsValues = {
        ...this._lastTagsValues,
        [tuioTag.id]: {
          x: tuioTag.x,
          y: tuioTag.y,
          angle: tuioTag.angle,

        },
      };
      //  This will be used to save the last angle recorded and make a comparison in onTagUpdate
      this._lastTagsValues.angle = 0;
      //  Setting the scale only at the start
      if (this._lastTagsValues.scale == null) {
        this._lastTagsValues.scale = this.scale;
      }
    }
  }

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      if (tuioTag.id === this.idTagDelete && this.canDeleteTangible) {
        this._domElem.remove();
        this.deleteWidget();
      } else if (tuioTag.id === this.idTagMove && this.canMoveTangible) {
        ElementWidget.zIndexGlobal += 1;
        this.zIndex = ElementWidget.zIndexGlobal;
        this._domElem.css('z-index', this.zIndex);
        const lastTagValue = this._lastTagsValues[tuioTag.id];
        const diffX = tuioTag.x - lastTagValue.x;
        const diffY = tuioTag.y - lastTagValue.y;

        this.internX = this.internX + diffX;
        this.internY = this.internY + diffY;
        let newX = this.x + diffX;
        let newY = this.y + diffY;

        if (newX < 0) {
          newX = 0;
        }

        if (newX > (WINDOW_WIDTH - this.width)) {
          newX = WINDOW_WIDTH - this.width;
        }

        if (newY < 0) {
          newY = 0;
        }

        if (newY > (WINDOW_HEIGHT - this.height)) {
          newY = WINDOW_HEIGHT - this.height;
        }

        this._currentAngle = radToDeg(tuioTag.angle);
        if (this.canRotateTangible) {
          this.moveTo(newX, newY, this._currentAngle);
        } else {
          this.moveTo(newX, newY);
        }

        this._lastTagsValues = {
          ...this._lastTagsValues,
          [tuioTag.id]: {
            x: tuioTag.x,
            y: tuioTag.y,
          },
        };
      } else if (tuioTag.id === this.idTagZoom && this.canZoomTangible) { //  When the zoom tag is recognized
        let newscale;
        if (tuioTag.angle > this._lastTagsValues.angle) { // Increasing angle superior to last saved angle (clockwise)
          newscale = this._lastTagsValues.scale * 1.5; // new scale is 1.5 times the old scale
          this._lastTagsValues.angle = tuioTag.angle;// We save the new angle
          this._domElem.css('transform', `scale(${newscale})`); // We set the dom element scale
          this._lastTagsValues.scale = newscale; //  We save the scale
        } else if (tuioTag.angle < this._lastTagsValues.angle) { //  Decreasing angle inferior to the last saved angle(counterclockwise)
          newscale = this._lastTagsValues.scale * 0.75;// new scale is 0.75 times the old scale
          this._lastTagsValues.angle = tuioTag.angle;// We save the new angle
          this._domElem.css('transform', `scale(${newscale})`); // We set the dom element scale
          this._lastTagsValues.scale = newscale;// We save the scale
        }
      } //  else if
      this.internX = this._domElem.position().left;
      this.internY = this._domElem.position().top;
      this.internWidth = this._domElem.width();
      this.internHeight = this._domElem.height();
    }
  }

  /**
   * Call after a TUIOTag deletion.
   *
   * @method onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  onTagDeletion(tuioTagId) {
    super.onTagDeletion(tuioTagId);
  }

  /**
   * Call to enable/disable rotation
   *
   * @method rotate
   * @param {boolean} canRotateTangible - Enable/disable tangible rotation
   * @param {boolean} canRotateTactile - Enable/disable tactile rotation
  */
  canRotate(canRotateTangible, canRotateTactile) {
    this.canRotateTangible = canRotateTangible;
    this.canRotateTactile = canRotateTactile;
  }

  /**
   * Call to enable/disable rotation
   *
   * @method rotate
   * @param {boolean} canMoveTangible - Enable/disable tangible movement
   * @param {boolean} canMoveTactile - Enable/disable tactile movement
  */
  canMove(canMoveTangible, canMoveTactile) {
    this.canMoveTangible = canMoveTangible;
    this.canMoveTactile = canMoveTactile;
  }

  /**
   * Call to enable/disable rotation
   *
   * @method rotate
   * @param {boolean} canZoomTangible - Enable/disable tangible zoom
   * @param {boolean} canZoomTactile - Enable/disable tactile zoom
  */
  canZoom(canZoomTangible, canZoomTactile) {
    this.canZoomTangible = canZoomTangible;
    this.canZoomTactile = canZoomTactile;
  }

  /**
   * Call to enable/disable rotation
   *
   * @method rotate
   * @param {boolean} canZoomTangible - Enable/disable tangible delete
   * @param {boolean} canZoomTactile - Enable/disable tactile delete
  */
  canDelete(canDeleteTangible, canDeleteTactile) {
    this.canDeleteTangible = canDeleteTangible;
    this.canDeleteTactile = canDeleteTactile;
  }

  /**
   * Call to enable/disable rotation
   *
   * @method rotate
   * @param {boolean} isDisabled - Enable/disable interaction with the widget
  */
  disable(isDisabled) {
    this.isDisabled = isDisabled;
  }

  // Hide
  // Show
  // Delete
  // MoveTo
  // Rotate
  // Resize
  // Activer/Desactiver tangible/tactile
}

ElementWidget.zIndexGlobal = 0;

export default ElementWidget;
