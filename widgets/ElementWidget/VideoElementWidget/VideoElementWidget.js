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
  class VideoElementWidget extends ElementWidget {
    /**
     * ImageElementWidget constructor.
     *
     * @constructor
     * @param {number} x - ImageElementWidget's upperleft coin abscissa.
     * @param {number} y - ImageElementWidget's upperleft coin ordinate.
     * @param {number} width - ImageElementWidget's width.
     * @param {number} height - ImageElementWidget's height.
     */
    constructor(x, y, width, height, src, tagMove, tagDelete, tagZoom, tagInfo, tagPlayPause, tagVolume) {
      super(x, y, width, height, tagMove, tagDelete, tagZoom, tagInfo);
      this._domElem = $('<video>');
      this._domElem.attr('src', src);
      this._domElem.attr('controls', true);
      this._domElem.css('width', `${width}px`);
      this._domElem.css('height', `${height}px`);
      this._domElem.css('position', 'absolute');
      this._domElem.css('left', `${x}px`);
      this._domElem.css('top', `${y}px`);
      this.idTagPlayPause = tagPlayPause;
      this.idTagVolume = tagVolume;
    } // constructor

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
      super.onTagUpdate(tuioTag);
      if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
        if (tuioTag.id === this.idTagPlayPause) {
          this._domElem.play();
        } else if (tuioTag.id === this.idTagVolume) {
          this._domElem.prop('volume', 0.5);
          // $("video").prop("volume", 0.5);
        }
      }
    }
  } // class ImageElementWidget

  export default VideoElementWidget;
