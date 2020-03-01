/**
 * Manage DragNDropManager singleton class.
 *
 * @type DragNDropManager
 * @private
 */
let instance = null;


class DragNDropManager {
  constructor() {
    if (instance !== null) {
      return instance
    }

    instance = this;

    this._dropWidgets = [];
    return instance
  }

  static getInstance() {
    return new DragNDropManager();
  }

  dropsOn(dragWidget) {
    const res = [];
    for (let i = 0; i < this._dropWidgets.length; i += 1) {
      if (this._collides(dragWidget, this._dropWidgets[i])) {
        res.push(this._dropWidgets[i]);
      }
    }
    return res;
  }

  move(dragWidget) {
    const res = [];
    for (let i = 0; i < this._dropWidgets.length; i += 1) {
      if (dragWidget.zones.indexOf(this._dropWidgets[i].dropzoneName) > -1 && this._collides(dragWidget, this._dropWidgets[i])) {
        if (!this._dropWidgets[i].isHighlight) {
          this._dropWidgets[i].highlight(this._dropWidgets[i]);
          this._dropWidgets[i].isHighlight = true;
        }
      } else if (this._dropWidgets[i].isHighlight) {
        this._dropWidgets[i].unhighlight(this._dropWidgets[i]);
        this._dropWidgets[i].isHighlight = false;
        console.log('Unhighlight');
      }
    }
    return res;
  }

  addDropWidget(widget) {
    this._dropWidgets.push(widget);
  }

  /**
   * @param widget1
   * @param widget2
   * @returns {boolean}
   * @private
   */
  _collides(widget1, widget2) {
    const w1Top = widget1.domElem.position().top;
    const w1Left = widget1.domElem.position().left;
    const w2Top = widget2.domElem.position().top;
    const w2Left = widget2.domElem.position().left;
    return !(w2Left > (w1Left + widget1.width)
      || (w2Left + widget2.width) < w1Left
      || w2Top > (w1Top + widget1.height)
      || (w2Top + widget2.height) < w1Top)
  }
}

export default DragNDropManager;
