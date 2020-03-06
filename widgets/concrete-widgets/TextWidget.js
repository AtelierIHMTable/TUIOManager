import $ from 'jquery/dist/jquery.min';
import BaseWidget from '../BaseWidget';

class TextWidget extends BaseWidget {
  constructor(x, y, maxWidth, text, fontSize = 12, color = 'black', textAlign = 'start', fontFamily = 'inherit') {
    super(x, y, maxWidth, fontSize);
    this._domElem = $('<p></p>')
      .css('position', 'absolute')
      .css('left', `${x}px`)
      .css('top', `${y}px`)
      .css('font-size', `${fontSize}px`)
      .css('max-width', this.width)
      .css('text-align', textAlign)
      .css('font-family', fontFamily)
      .css('left', `${x}px`)
      .css('color', color)
      .css('margin', 0)
      .text(text);
  }
}

export default TextWidget;
