/* eslint-disable no-use-before-define,no-plusplus */
import $ from 'jquery/dist/jquery.min';
import BaseWidget from './BaseWidget';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../core/constants';

class WrapperWidget extends BaseWidget {
  constructor(...widgets) {
    const minX = getMinX(widgets);
    const minY = getMinY(widgets);
    const width = computeWidth(widgets) - minX;
    const height = computeHeight(widgets) - minY;
    super(minX, minY, width, height);
    this._widgets = widgets;
    this.internX = minX;
    this.internY = minY;
    this._domElem = $('<div/>')
      .css('position', 'absolute')
      .css('left', `${this.x}px`)
      .css('top', `${this.y}px`)
      .css('width', `${this.width}px`)
      .css('height', `${this.height}px`);
    for (let i = 0; i < widgets.length; i++) {
      this._toRelativePosition(widgets[i]);
      this._domElem.append(widgets[i].domElem);
    }

    function computeWidth(widgetsList) {
      let maxX = 0;
      for (let i = 0; i < widgetsList.length; i++) {
        const left = parseFloat(widgetsList[i].domElem
          .css('left')
          .replace(/px/g, ''));
        const widgetWidth = widgetsList[i].domElem.width();
        const x2 = left + widgetWidth;
        if (x2 > maxX) maxX = x2;
      }
      return maxX;
    }

    function computeHeight(widgetsList) {
      let maxY = 0;
      for (let i = 0; i < widgetsList.length; i++) {
        const top = parseFloat(widgetsList[i].domElem
          .css('top')
          .replace(/px/g, ''));
        const widgetHeight = widgetsList[i].domElem.height();
        const y2 = top + widgetHeight;
        if (y2 > maxY) maxY = y2;
      }
      return maxY;
    }

    function getMinX(widgetsList) {
      let computedMinX = WINDOW_WIDTH;
      for (let i = 0; i < widgetsList.length; i++) {
        const left = parseFloat(widgetsList[i].domElem
          .css('left')
          .replace(/px/g, ''));
        computedMinX = left < computedMinX ? left : computedMinX;
      }
      return computedMinX;
    }

    function getMinY(widgetsList) {
      let computedMinY = WINDOW_HEIGHT;
      for (let i = 0; i < widgetsList.length; i++) {
        const top = parseFloat(widgetsList[i].domElem
          .css('top')
          .replace(/px/g, ''));
        computedMinY = top < computedMinY ? top : computedMinY;
      }
      return computedMinY;
    }
  }

  /**
   * Convert a widget absolute abscissa into a widget with relative position from the wrapper
   * @param widget to convert
   * @private
   */
  _toRelativePosition(widget) {
    const top = parseFloat(widget.domElem
      .css('top')
      .replace(/px/g, ''));
    widget.domElem.css('top', `${top - this.internY}px`);
    const left = parseFloat(widget.domElem
      .css('left')
      .replace(/px/g, ''));
    widget.domElem.css('left', `${left - this.internX}px`);
  }


  deleteWidget() {
    for (let i = 0; i < this._widgets.length; i++) {
      this._widgets[i].deleteWidget();
    }
    super.deleteWidget();
  }
}

export default WrapperWidget;
