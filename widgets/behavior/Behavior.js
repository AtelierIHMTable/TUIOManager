import TUIOManager from '../../core/TUIOManager';
import TUIOWidget from '../../core/TUIOWidget';

class Behavior extends TUIOWidget {
  /**
   * @param {TUIOWidget} widget to add behavior
   */
  constructor(widget) {
    super(widget.x, widget.y, widget.width, widget.height);
    TUIOManager.getInstance()
      .removeWidget(widget);
    this.widget = widget;
    this.domElem.addClass(this.id);
  }

  get domElem() {
    return this.widget.domElem;
  }

  get touches() {
    return this.widget.touches;
  }

  addTo(element) {
    this.widget.addTo(element);
  }


  onTouchCreation(tuioTouch) {
    this.widget.onTouchCreation(tuioTouch);
  }

  onTagCreation(tuioTag) {
    this.widget.onTagCreation(tuioTag);
  }

  onTouchDeletion(tuioTouchId) {
    this.widget.onTouchDeletion(tuioTouchId);
  }

  onTagDeletion(tuioTagId) {
    this.widget.onTagDeletion(tuioTagId);
  }

  onTouchUpdate(tuioTouch) {
    this.widget.onTouchUpdate(tuioTouch);
  }

  onTagUpdate(tuioTag) {
    this.widget.onTagUpdate(tuioTag);
  }

  isTouched(x, y) {
    return this.widget.isTouched(x, y);
  }
}

export default Behavior
