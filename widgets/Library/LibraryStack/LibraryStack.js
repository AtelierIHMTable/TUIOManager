/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
import { radToDeg } from 'tuiomanager/core/helpers';

import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';
import VideoElementWidget from 'tuiomanager/widgets/ElementWidget/VideoElementWidget/VideoElementWidget';


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
    console.log("STACK TOUCHED");
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
      const diffX = tuioTouch.x - lastTouchValue.x;
      const diffY = tuioTouch.y - lastTouchValue.y;

      let newX = this._x + diffX;
      let newY = this._y + diffY;

      for (var i = 0; i < this._stackList.length; i++) {
        this._stackList[i]._x = newX;
        this._stackList[i]._y = newY;
      }

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
    //console.log("before x = " + elementWidget._x + " y = " +elementWidget._y);
    let elementToAdd;
    if(elementWidget.constructor.name === 'ImageElementWidget') {
    //  ImageElementWidget(0, 0, 250, 333, 0, 2, 'assets/IMG_20150304_201145.jpg', 'B3', 'C9', '38');
      elementToAdd = new ImageElementWidget(0, 0, 250, 333, 0, 2,elementWidget._domElem.prop('src'), 'B3', 'C9', '38');
    }

    elementToAdd._x = this._x;
    elementToAdd._y = this._y;
    //console.log("after x = " + elementWidget._x + " y = " +elementWidget._y);

    elementToAdd._isInStack = true;
    elementToAdd.canMove(false, false);
    elementToAdd.canZoom(false, false);
    elementToAdd.canRotate(false, false);
    this._stackList.push(elementToAdd);

    elementToAdd._domElem.css('left', '0px');
    elementToAdd._domElem.css('top', '0px');

    //console.log(elementWidget.constructor.name);
    this._domElem.append(elementToAdd._domElem);
    const oldWidth = elementToAdd._domElem.width();
    //console.log("oldWidth = " + oldWidth);
    elementToAdd._domElem.css('width', this._domElem.width()-20);
    //console.log("newWidth = " + elementWidget._domElem.width());
    //console.log("oldHeight = "+ elementWidget._domElem.height());

    const newHeight = elementToAdd._domElem.width() * elementToAdd._domElem.height() / oldWidth;
    //console.log("newHeight = "+ newHeight);
    elementToAdd._domElem.css('height', newHeight);

    if(elementToAdd._domElem.height() > this._domElem.height()) {
      const newWidth = elementToAdd._domElem.width() - (elementToAdd._domElem.height()- this._domElem.height() + 20);
      elementToAdd._domElem.css('width', newWidth+'px');
      const newHeight = elementToAdd._domElem.height() - (elementToAdd._domElem.height()- this._domElem.height() + 20);
      elementToAdd._domElem.css('height', newHeight);
    }
    elementToAdd._domElem.css('transform', 'rotate('+ this._angle+'deg)');
    elementToAdd._domElem.addClass('stack-element');
    this._angle += 50;
    elementToAdd._currentAngle = this._angle;

    //elementToAdd._domElem.css('z-index', '0');
    elementWidget._domElem.remove();
    elementWidget.deleteWidget();

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
  //console.log("In CheckStacks() !!!");
  for (var i = 0; i < allTheStacks.length; i++) {
    if( allTheStacks[i].isInBounds(element)) {
      allTheStacks[i].addElementWidget(element);
      break;
    }
  }
}// CheckStacks()

export default LibraryStack;
