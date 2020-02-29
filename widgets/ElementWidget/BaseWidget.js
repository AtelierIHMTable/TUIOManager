/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import TUIOWidget from '../../core/TUIOWidget';

class BaseWidget extends TUIOWidget {
  /**
   * ElementWidget constructor.
   *
   * @constructor
   * @param {number} x - ElementWidget's upperleft coin abscissa.
   * @param {number} y - ElementWidget's upperleft coin ordinate.
   * @param {number} width - ElementWidget's width.
   * @param {number} height - ElementWidget's height.
   */
  constructor(x, y, width, height) {
    if (new.target === BaseWidget) {
      throw new TypeError('BaseWidget is an abstract class. It cannot be instanciated')
    }
    super(x, y, width, height);
    BaseWidget.zIndexGlobal += 1;
    this.zIndex = BaseWidget.zIndexGlobal;
    this._currentTransform = '';
  }// constructor

  get currentTransform() {
    return this._currentTransform;
  }

  set currentTransform(value) {
    this._currentTransform = value;
  }
}

BaseWidget.zIndexGlobal = 0;
export default BaseWidget;
