/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


import TUIOWidget from '../../core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../core/constants';
import { radToDeg } from '../../core/helpers';

/**
 * Abstract class to manage ImageElementWidget.
 *
 * @class ElementWidget
 * @extends TUIOWidget
 */
class ElementWidget extends TUIOWidget {

  constructor(x, y, width, height, tagMove, tagDelete, tagZoom, tagInfo) {
    if (new.target === ElementWidget) {
      throw new TypeError('ElementWidget is an abstract class. It cannot be instanciated');
    }
    super(x, y, width, height);
    this.idTagMove = tagMove;
    this.idTagDelete = tagDelete;
    this.idTagZoom = tagZoom;
    this.idTagInfo = tagInfo;
    this._lastTouchesValues = {};
    this._lastTagsValues = {};
  }// constructor


    /**
     * ImageWidget's domElem.
     *
     * @returns {JQuery Object} ImageWidget's domElem.
     */
  get domElem() { return this._domElem; }

    /**
     * Call after a TUIOTouch creation.
     *
     * @method onTouchCreation
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch);
    if (this.isTouched(tuioTouch.x, tuioTouch.y) && !ElementWidget.isAlreadyTouched) {
      ElementWidget.isAlreadyTouched = true;
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      };
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
      console.log(tuioTouch);
      const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
      const diffX = tuioTouch.x - lastTouchValue.x;
      const diffY = tuioTouch.y - lastTouchValue.y;

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

      this.moveTo(newX, newY);
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      };
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
  }

    /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    console.log(tuioTag);
    if (this.isTouched(tuioTag.x, tuioTag.y) && !ElementWidget.isAlreadyTouched) {
      this._lastTagsValues = {
        ...this._lastTagsValues,
        [tuioTag.id]: {
          x: tuioTag.x,
          y: tuioTag.y,
          angle: tuioTag.angle,

        },
      };
      //This will be used to save the last angle recorded and make a comparison in onTagUpdate
      this._lastTagsValues.angle = 0;
      //Setting the scale only at the start
      if(this._lastTagsValues.scale == null){
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
    console.log(this._lastTagsValues);
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {

      if (tuioTag.id === this.idTagDelete) {
        this._domElem.remove();
        this.deleteWidget();
      } else if (tuioTag.id === this.idTagMove) {
        const lastTagValue = this._lastTagsValues[tuioTag.id];
        const diffX = tuioTag.x - lastTagValue.x;
        const diffY = tuioTag.y - lastTagValue.y;

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

        this.moveTo(newX, newY, radToDeg(tuioTag.angle));
        this._lastTagsValues = {
          ...this._lastTagsValues,
          [tuioTag.id]: {
            x: tuioTag.x,
            y: tuioTag.y,
          },
        };
      }
      else if (tuioTag.id == this.idTagZoom  ) {
        //console.log('Recognized TagZoom');
        //console.log('angle = ' + tuioTag.angle);
        if (tuioTag.angle > this._lastTagsValues.angle) {
          var newscale = this._lastTagsValues.scale * 1.5;
          //console.log("this._lastTagsValues.scale = " + this._lastTagsValues.scale);
          //console.log('Gettin bigger, new scale is ' + newscale );

          this._lastTagsValues.angle = tuioTag.angle;
          this._domElem.css('transform', `scale(${newscale})`);
          this._lastTagsValues.scale = newscale;
          //console.log(`New angle  = , ${this._lastTagsValues.angle}`);
        }
        else if (tuioTag.angle < this._lastTagsValues.angle) {
          var newscale = this._lastTagsValues.scale * 0.75;
          //console.log("this._lastTagsValues.scale = " + this._lastTagsValues.scale);
          //console.log('Gettin smaller, new scale = ' + newscale);
          this._lastTagsValues.angle = tuioTag.angle;
          this._domElem.css('transform', `scale(${newscale})`);

          //console.log(`New angle  = , ${this._lastTagsValues.angle}`);
          this._lastTagsValues.scale = newscale;

        }
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
    ElementWidget.isAlreadyTouched = false;
    console.log('Tag Deleted');
  }
}

ElementWidget.isAlreadyTouched = true;
export default ElementWidget;
