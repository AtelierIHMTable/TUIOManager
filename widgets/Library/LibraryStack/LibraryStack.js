/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
import { radToDeg } from 'tuiomanager/core/helpers';




/**
 * Main class to manage LibraryStack.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class LibraryStack
 * @extends TUIOWidget
 */
class LibraryStack extends TUIOWidget {
  /**
   * ImageWidget constructor.
   *
   * @constructor
   * @param {number} x - ImageWidget's upperleft coin abscissa.
   * @param {number} y - ImageWidget's upperleft coin ordinate.
   * @param {number} width - ImageWidget's width.
   * @param {number} height - ImageWidget's height.
   */
  constructor(x, y, width, height) {
    super(x, y, width, height);

    this._lastTouchesValues = {};
    this._lastTagsValues = {};
    this._stackList = [];
    this._angle = 0;

    this._domElem = $('<div class="library-stack"> </div>');
    //this._domElem.attr('src', imgSrc);
    this._domElem.css('width', `${width}px`);
    this._domElem.css('height', `${height}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    this._domElem.css('background-color', '#FF6633');

    allTheStacks.push(this);
  }

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

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
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
        },
      };
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
  }//moveTo()

  addElementWidget(elementWidget) {
    elementWidget._isInStack = true;
    elementWidget.canMove(false, false);
    elementWidget.canZoom(false, false);
    elementWidget.canRotate(false, false);
    this._stackList.push(elementWidget);

    console.log(elementWidget.constructor.name);
    this._domElem.append(elementWidget._domElem);
    const oldWidth = elementWidget._domElem.width();
    console.log("oldWidth = " + oldWidth);
    elementWidget._domElem.css('width', this._domElem.width()-20);
    console.log("newWidth = " + elementWidget._domElem.width());
    console.log("oldHeight = "+ elementWidget._domElem.height());

    const newHeight = elementWidget._domElem.width() * elementWidget._domElem.height() / oldWidth;
    console.log("newHeight = "+ newHeight);
    elementWidget._domElem.css('height', newHeight);

    if(elementWidget._domElem.height() > this._domElem.height()) {
      const newWidth = elementWidget._domElem.width() - (elementWidget._domElem.height()- this._domElem.height() + 20);
      elementWidget._domElem.css('width', newWidth+'px');
      const newHeight = elementWidget._domElem.height() - (elementWidget._domElem.height()- this._domElem.height() + 20);
      elementWidget._domElem.css('height', newHeight);
    }
    elementWidget._domElem.css('transform', 'rotate('+ this._angle+'deg)');
    elementWidget._domElem.addClass('stack-element');
    this._angle += 50;
  }// addElementWidget()

  isInBounds(element) {
    if(element.x >= this.x && element.x <= (this.x + this.width) && element.y >= this.y && element.y <= (this.y + this.height)) {
      return true;
    }
    return false;
  }// isInBounds()

}// class LibraryStack

var maglobal = "baybay";

var allTheStacks = [];

var CheckStacks = function (element) {
  console.log("In CheckStacks() !!!");
  for (var i = 0; i < allTheStacks.length; i++) {
    if( allTheStacks[i].isInBounds(element)) {
      allTheStacks[i].addElementWidget(element);
      break;
    }
  }
}// CheckStacks()

export default LibraryStack;
