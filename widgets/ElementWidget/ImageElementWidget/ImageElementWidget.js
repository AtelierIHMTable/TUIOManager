/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


// Import JQuery
import $ from 'jquery/dist/jquery.min';
import ElementWidget from '../ElementWidget';
import TUIOManager from '../../../core/TUIOManager';


 /**
  * Main class to manage ImageElementWidget.
  *
  * @class ImageElementWidget
  * @extends ElementWidget
  */
class ImageElementWidget extends ElementWidget {
  /**
  * ImageElementWidget constructor.
  *
  * @constructor
  * @param {number} x - ImageElementWidget's upperleft coin abscissa.
  * @param {number} y - ImageElementWidget's upperleft coin ordinate.
  * @param {number} width - ImageElementWidget's width.
  * @param {number} height - ImageElementWidget's height.
  */
  constructor(x, y, width, height, initialRotation, initialScale, src, tagMove, tagDelete, tagZoom, tagDuplicate) {
    super(x, y, width, height, initialRotation, initialScale, tagMove, tagDelete, tagZoom, tagDuplicate);
    this.src = src;
    this._domElem = $('<img>');
    this._domElem.attr('src', src);
    this._domElem.css('width', `${this.width}px`);
    this._domElem.css('height', `${this.height}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('z-index', `${this.zIndex}`);
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    this._domElem.css('transform', `rotate(${initialRotation}deg)`);
    this._domElem.css('transform-origin', `scale(${initialScale})`);
    this.hasDuplicate = false;
  } // constructor

  onTagUpdate(tuioTag) {
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      if (tuioTag.id === this.tagDuplicate && !this.hasDuplicate) {
        const clone = new ImageElementWidget(this.x + 10, this.y + 10, this.width, this.height, this._currentAngle, 1, this.src, this.tagMove, this.tagDelete, this.tagZoom, this.tagDuplicate);
        TUIOManager.getInstance().addWidget(clone);
        this._domElem.parent().append(clone.domElem);
        this.hasDuplicate = true;
      }
    }
  }

  onTagDeletion(tuioTagId) {
    if (typeof (this._lastTagsValues[tuioTagId]) !== 'undefined') {
      if (tuioTagId === this.tagDuplicate) {
        this.hasDuplicate = false;
      }
    }
  }
} // class ImageElementWidget

export default ImageElementWidget;
