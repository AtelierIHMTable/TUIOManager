import $ from 'jquery/dist/jquery.min';
import BaseWidget from './ElementWidget/BaseWidget';

class TestWidget extends BaseWidget {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this._domElem = $('<div></div>')
      .css('position', 'absolute')
      .css('left', `${x}px`)
      .css('top', `${y}px`)
      .width(this.width)
      .height(this.height)
      .css('background', 'blue');
  }
}

export default TestWidget
