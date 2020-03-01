/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import TUIOManager from '../../core/TUIOManager';
import BaseWidget from '../BaseWidget';

/**
 * @class Behavior
 * @extends BaseWidget
 *
 * Decorator, delegates all method to widget it decorates
 * When extended, dont forget to call super.function() on overrides functions to allows decorator
 * to do his job by calling nested decorators or widget react to events
 */
class Behavior extends BaseWidget {
  /**
   * @param {BaseWidget} widget to add behavior
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

  get currentTransform() {
    return this.widget.currentTransform;
  }

  set currentTransform(value) {
    this.widget.currentTransform = value;
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
