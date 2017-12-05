/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


import TUIOWidget from '../../core/TUIOWidget';
import TUIOManager from '../../core/TUIOManager';
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
    this._width *= initialScale;
    this._height *= initialScale;
    this.idTagMove = tagMove;
    this.idTagDelete = tagDelete;
    this.idTagZoom = tagZoom;
    this._currentAngle = initialRotation;
    this._lastTouchesValues = {};
    this._lastTagsValues = {};
    this.internX = x;
    this.internY = y;
    this.internWidth = this.width;
    this.internHeight = this.height;
    this.scale = 1;
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
    this._domElem.css('transform', `rotate(360deg) scale(${this.scale})`);
    const nx = this._domElem[0].getBoundingClientRect().left;
    const ny = this._domElem[0].getBoundingClientRect().top;
    const width = this._domElem.width();
    const height = this._domElem.height();
    const ox = (nx + (width / 2));
    const oy = (ny + (height / 2));
    const p = new Point(x, y);
    p.rotate((360 - this._currentAngle), ox, oy);
    this._domElem.css('transform', `rotate(${this._currentAngle}deg) scale(${this.scale})`);
    return (p.x >= nx && p.x <= nx + width && p.y >= ny && p.y <= ny + height);
    // return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) && !this.isDisabled;
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
        this._lastTouchesValues.scale = 1;
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
    this.internX = x;
    this.internY = y;
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
    console.log("Movin");
    console.log(TUIOManager.getInstance()._widgets);
    



    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      if (this.zIndex !== ElementWidget.zIndexGlobal) {
        ElementWidget.zIndexGlobal += 1;
        this.zIndex = ElementWidget.zIndexGlobal;
      }
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

        const newX = this.internX + diffX;
        const newY = this.internY + diffY;
        this._x = this.x + diffX;
        this._y = this.y + diffY;

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
          this.scale = newscale;
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
        this._domElem.css('transform', `rotate(${this._currentAngle}deg) scale(${this.scale})`);
        this._x = this._domElem.position().left;
        this._y = this._domElem.position().top;
        this._width = this._domElem.width();
        this._height = this._domElem.height();
      // } else if (touchesWidgets.length === 5 && this.canDeleteTactile) {
      //   this._domElem.remove();
      //   this.deleteWidget();
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
      const lastTouchValue = this._lastTouchesValues[tuioTouchId];
      console.log(tuioTouchId);
      console.log(lastTouchValue);
      const x = lastTouchValue.x;
      const y = lastTouchValue.y;
      if(!this._isInStack){
        Object.keys(TUIOManager.getInstance()._widgets).forEach((widgetId) => {
          //console.log(widgetId);
        //console.log(TUIOManager.getInstance()._widgets[widgetId].constructor.name);
          if(TUIOManager.getInstance()._widgets[widgetId].constructor.name === 'LibraryStack') {
            //console.log("found a stack !!! at "+ TUIOManager.getInstance()._widgets[widgetId]._x);
            if ( this.isInBounds(TUIOManager.getInstance()._widgets[widgetId], x, y)) {
              //console.log("pic is in bounds !!!");
              this._isInStack= true;
              TUIOManager.getInstance()._widgets[widgetId].addElementWidget(this);
              return;
            }
          }
        });
      }
    }
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
        this._lastTagsValues.scale = 1;
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
        if (this.zIndex !== ElementWidget.zIndexGlobal) {
          ElementWidget.zIndexGlobal += 1;
          this.zIndex = ElementWidget.zIndexGlobal;
        }
        this._domElem.css('z-index', this.zIndex);
        const lastTagValue = this._lastTagsValues[tuioTag.id];
        const diffX = tuioTag.x - lastTagValue.x;
        const diffY = tuioTag.y - lastTagValue.y;

        const newX = this.internX + diffX;
        const newY = this.internY + diffY;

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
        this._x = this._domElem.position().left;
        this._y = this._domElem.position().top;
        this._width = this._domElem.width();
        this._height = this._domElem.height();
      } else if (tuioTag.id === this.idTagZoom && this.canZoomTangible) { //  When the zoom tag is recognized
        let newscale;
        if (tuioTag.angle > this._lastTagsValues.angle) { // Increasing angle superior to last saved angle (clockwise)
          newscale = this._lastTagsValues.scale * 1.5; // new scale is 1.5 times the old scale
          this.scale = newscale;
          this._lastTagsValues.angle = tuioTag.angle;// We save the new angle
          this._domElem.css('transform', `scale(${newscale})`); // We set the dom element scale
          this._lastTagsValues.scale = newscale; //  We save the scale
        } else if (tuioTag.angle < this._lastTagsValues.angle) { //  Decreasing angle inferior to the last saved angle(counterclockwise)
          newscale = this._lastTagsValues.scale * 0.75;// new scale is 0.75 times the old scale
          this.scale = newscale;
          this._lastTagsValues.angle = tuioTag.angle;// We save the new angle
          this._domElem.css('transform', `scale(${newscale})`); // We set the dom element scale
          this._lastTagsValues.scale = newscale;// We save the scale
        }
        this._x = this._domElem.position().left;
        this._y = this._domElem.position().top;
        this._width = this._domElem.width();
        this._height = this._domElem.height();
      } //  else if
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
    console.log('TAG DELETED');
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

  isInBounds(libStack, x, y) {
    console.log(x, y);
    if(x >= libStack._x && x <= (libStack._x + libStack._width) && y >= libStack._y && y <= (libStack._y + libStack._height) ) {
      return true;
    }
    return false;
  }//isInBounds

}// class

ElementWidget.zIndexGlobal = 0;

export default ElementWidget;
