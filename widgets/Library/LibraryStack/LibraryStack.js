/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from '../../../core/TUIOWidget';
import { radToDeg } from '../../../core/helpers';

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
  constructor(x, y, size, stackTitle, allowcontentsArray) {
    super(x, y, size, size);

    this._lastTouchesValues = {};
    this._lastTagsValues = {};
    this._stackList = [];
    this._angle = 0;
    this.zIndexElem = -20000000;
    this._domElem = $('<div class="library-stack"> </div>');
    this._domElem.css('width', `${size}px`);
    this._domElem.css('height', `${size}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    this._domElem.css('z-index', -1);
    this._domElem.css('background-color', '#FF6633');
    this.stackTitle = $('<div>').text(stackTitle)
                        .css('margin-top', '-35px')
                        .css('text-align', 'center')
                        .css('width', `${size}`)
                        .css('max-width', `${size}`)
                        .css('white-space', 'nowrap')
                        .css('height', '40px')
                        .css('overflow', 'hidden')
                        .css('font-size', '100px');

    this._domElem.append(this.stackTitle);
    this.zIndex = -1;
    this.allowcontentsArray = allowcontentsArray;
    this.elementInfoArray = [];
    this.upperIndex = 0;
    this.canRemove = true;
    // this.allTheStacks.push(this);
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
    this.resizeFont(this.stackTitle.get(0));
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      };
      this.touchedTimestamp = Date.now();
      this.touchedInitX = tuioTouch.x;
      this.touchedInitY = tuioTouch.y;
    }
  }

  resizeFont() {
    const element = this.stackTitle.get(0);
    while (element.scrollWidth > element.offsetWidth || element.scrollHeight > element.offsetHeight) {
      const newSize = parseFloat($(element).css('font-size').slice(0, -2)) * 0.95;
      $(element).css('font-size', `${newSize}px`);
    }
  }

  addTo(parent) {
    super.addTo(parent);
    this.resizeFont();
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      const touchesWidgets = [];
      const currentTouches = this.touches;
      Object.keys(this.touches).forEach((key) => {
        touchesWidgets.push(currentTouches[key]);
      });
      const updateTouch = Date.now();
      if (touchesWidgets.length === 1) {
        const deltaX = Math.abs(tuioTouch.x - this.touchedInitX);
        const deltaY = Math.abs(tuioTouch.y - this.touchedInitY);
        if (((updateTouch - this.touchedTimestamp) / 1000 > 1) && deltaX < 10 && deltaY < 10) {
          if (this.canRemove) {
            this.removeElementWidget();
            this.canRemove = false;
          }
        } else {
          const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
          const diffX = tuioTouch.x - lastTouchValue.x;
          const diffY = tuioTouch.y - lastTouchValue.y;

          const newX = this._x + diffX;
          const newY = this._y + diffY;

          for (let i = 0; i < this._stackList.length; i += 1) {
            this._stackList[i].internX = newX;
            this._stackList[i].internY = newY;
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
      const endTouch = Date.now();
      const delta = endTouch - this.touchedTimestamp;
      if (delta / 1000 <= 0.5) {
        this.browseStack();
      }
      this.canRemove = true;
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

      const newX = this.x + diffX;
      const newY = this.y + diffY;

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
    let elementToAdd;
    if (this.allowcontentsArray.indexOf(elementWidget.constructor.name) !== -1 || this.allowcontentsArray.length === 0) {
      elementToAdd = elementWidget;
      elementToAdd._domElem.css('transform', 'rotate(360deg)');
      const elemWidth = elementToAdd._domElem.width();
      const elemHeight = elementToAdd._domElem.height();
      this.elementInfoArray.push(
        {
          x: elementToAdd.x,
          y: elementToAdd.y,
          width: elemWidth,
          height: elemHeight,
          angle: elementToAdd._currentAngle,
          scale: elementToAdd.scale,
          zIndex: elementToAdd.zIndex,
        },
      );
      elementToAdd._x = this._x;
      elementToAdd._y = this._y;
      this.zIndexElem += 1;
      elementToAdd.zIndex = this.zIndexElem;

      elementToAdd._isInStack = true;
      elementToAdd.disable(true);
      
      let newWidth;
      let newHeight;
      
      if (elemWidth > elemHeight) {
        newWidth = this.width - 50;
        newHeight = (elemHeight * newWidth) / elemWidth;
      } else {
        newHeight = this.width - 50;
        newWidth = (elemWidth * newHeight) / elemHeight;
      }

      const newLeft = (this.width / 2) - (newWidth / 2);
      const newTop = (this.height / 2) - (newHeight / 2);
      elementToAdd._domElem.addClass('stack-element')
                            .css('left', newLeft)
                            .css('top', newTop)
                            .css('width', newWidth)
                            .css('height', newHeight);
      const angle = this._stackList.length * 10;
      elementToAdd._domElem.css('transform', `rotate(${angle}deg)`)
                           .appendTo(this._domElem);

      this._stackList.push(elementToAdd);
    }
  }// addElementWidget()

  removeElementWidget() {
    const upperIndex = this.getUpperIndex();

    const elementToRemove = this._stackList[upperIndex];
    const elemenToRemoveInfos = this.elementInfoArray[upperIndex];

    elementToRemove.disable(false);
    elementToRemove._width = elemenToRemoveInfos.width;
    elementToRemove._height = elemenToRemoveInfos.height;
    elementToRemove._currentAngle = elemenToRemoveInfos.angle;
    elementToRemove.scale = elemenToRemoveInfos.scale;
    elementToRemove.zIndex = elemenToRemoveInfos.zIndex;
    elementToRemove._domElem.css('z-index', elemenToRemoveInfos.zIndex)
                            .css('top', elementToRemove.internY)
                            .css('left', elementToRemove.internX)
                            .css('width', elemenToRemoveInfos.width)
                            .css('height', elemenToRemoveInfos.height)
                            .css('transform', `rotate(${elemenToRemoveInfos.angle}deg) scale(${elemenToRemoveInfos.scale})`)
                            .removeClass('stack-element')
                            .appendTo(this._domElem.parent());
    elementToRemove._isInStack = false;
    this._stackList.splice(upperIndex, 1);
    this.elementInfoArray.splice(upperIndex, 1);
  }

  isInBounds(element) {
    if (element.x >= this.x && element.x <= (this.x + this.width) && element.y >= this.y && element.y <= (this.y + this.height)) {
      return true;
    }
    return false;
  }// isInBounds()

  browseStack() {
    this.upperIndex = (this.upperIndex + 1) % this._stackList.length;
    const zIndexBottom = this._stackList[this._stackList.length - 1].zIndex;
    for (let i = this._stackList.length - 1; i > 0; i -= 1) {
      this._stackList[i].zIndex = this._stackList[i - 1].zIndex;
      this._stackList[i]._domElem.css('z-index', this._stackList[i].zIndex);
    }
    this._stackList[0].zIndex = zIndexBottom;
    this._stackList[0]._domElem.css('z-index', this._stackList[0].zIndex);
  }

  getUpperIndex() {
    let maxZindex = -20000000;
    let index = 0;
    for (let i = 0; i < this._stackList.length; i += 1) {
      if (this._stackList[i].zIndex > maxZindex) {
        maxZindex = this._stackList[i].zIndex;
        index = i;
      }
    }
    return index;
  }

}// class LibraryStack

export default LibraryStack;
