/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


 // Import JQuery
 import $ from 'jquery/dist/jquery.min';
 import ElementWidget from '../ElementWidget';


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
   constructor(x, y, width, height, src, tagMove, tagDelete, tagZoom, tagInfo) {
     super(x, y, width, height, tagMove, tagDelete, tagZoom, tagInfo);
     this._domElem = $('<img>');
     this._domElem.attr('src', src);
     this._domElem.css('width', `${width}px`);
     this._domElem.css('height', `${height}px`);
     this._domElem.css('position', 'absolute');
     this._domElem.css('left', `${x}px`);
     this._domElem.css('top', `${y}px`);
   } // constructor

 } // class ImageElementWidget

 export default ImageElementWidget;
