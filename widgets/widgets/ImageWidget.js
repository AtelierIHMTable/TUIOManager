/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import $ from 'jquery/dist/jquery.min';
import BaseWidget from '../BaseWidget';

class ImageWidget extends BaseWidget {
  /**
   * ImageWidget constructor.
   *
   * By default, the widget will contain the image, so you can use the widget
   * as a tile and the image will take the place it can
   *
   * @constructor
   * @param {number} x - ImageWidget's upperleft coin abscissa.
   * @param {number} y - ImageWidget's upperleft coin ordinate.
   * @param {number} width - ImageWidget's width.
   * @param {number} height - ImageWidget's height.
   * @param {string} src - image source
   * @param {string} objectFit - How the image should fit if heigth and width doesn't match img ratio
   */
  constructor(x, y, width, height, src, objectFit = 'contain') {
    super(x, y, width, height);
    this._domElem = $('<img/>')
      .attr('src', src)
      .css('position', 'absolute')
      .css('left', `${x}px`)
      .css('top', `${y}px`)
      .css('object-fit', objectFit)
      .width(this.width)
      .height(this.height);
  }
}

export default ImageWidget;
