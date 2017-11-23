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
    this._domElem = $('<div>');
    this._domElem.append(
      $('<video>').attr('src', src)
                  .css('width', '100%')
                  .css('position', 'absolute'),
      $('<div>').css('width', '100%')
                .css('height', '64px')
                .css('id', 'playbutton')
                .css('position', 'absolute')
                .css('top', '0')
                .css('bottom', '0')
                .css('right', '0')
                .css('left', '0')
                .css('margin', 'auto')
                .css('background', 'url(\'https://remykaloustian.com/pfe/playbutton.png\') center center no-repeat'));
    this._domElem.css('width', `${width}px`);
    this._domElem.css('height', `${height}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    this.idTagPlayPause = tagPlayPause;
    this.idTagVolume = tagVolume;
    this.isPlaying = false;
  } // constructor

  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    if (this.isTouched(tuioTag.x, tuioTag.y)) {
      if (tuioTag.id === this.idTagPlayPause) {
        if (this.isPlaying) {
          this._domElem.children().first()[0].pause();
          this._domElem.children().eq(1).show();
          this.isPlaying = false;
        } else {
          this._domElem.children().first()[0].play();
          this._domElem.children().eq(1).hide();
          this.isPlaying = true;
        }
        // } else if (tuioTag.id === this.idTagVolume) {
        //   this._domElem.prop('volume', 0.5);
      }
    }
  }
} // class ImageElementWidget

export default VideoElementWidget;
