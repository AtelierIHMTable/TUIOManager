/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import Behavior from '../Behavior';

/**
 * @class InitialRotationWidget
 *
 * Use to add rotate effect on the widget (only set the rotation for widget creation)
 * Can change the x,y position resulting
 */
class InitialRotationWidget extends Behavior {
  /**
   * @param {BaseWidget} widget
   * @param {number} angle to rotate
   */
  constructor(widget, angle) {
    super(widget);
    const valueWithoutRotate = this.currentTransform.replace(/rotate\([-+]?[0-9]*\.?[0-9]+deg\)/g, '');
    this.currentTransform = `${valueWithoutRotate} rotate(${angle}deg)`;
    this.domElem.css('transform', this.currentTransform);
  }
}

export default InitialRotationWidget;
