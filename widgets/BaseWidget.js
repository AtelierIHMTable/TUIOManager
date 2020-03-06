/**
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 */
import TUIOWidget from '../core/TUIOWidget';

class BaseWidget extends TUIOWidget {
  /**
   * BaseWidget constructor.
   *
   * Note : z-index is defined on Widget creation and not Widget addition to DOM
   *
   * @constructor
   * @param {number} x - BaseWidget's upperleft coin abscissa.
   * @param {number} y - BaseWidget's upperleft coin ordinate.
   * @param {number} width - BaseWidget's width.
   * @param {number} height - BaseWidget's height.
   */
  constructor(x, y, width, height) {
    if (new.target === BaseWidget) {
      throw new TypeError('BaseWidget is an abstract class. It cannot be instanciated')
    }
    super(x, y, width, height);
    BaseWidget.zIndexGlobal += 1;
    this.zIndex = BaseWidget.zIndexGlobal;
    this._currentTransform = '';
    this._isSetZindex = false;
  }// constructor

  get currentTransform() {
    return this._currentTransform;
  }

  set currentTransform(value) {
    this._currentTransform = value;
  }

  get domElem() {
    if (!this._isSetZindex) {
      super.domElem.css('z-index', this.zIndex);
      this._isSetZindex = true;
    }
    return super.domElem;
  }
}

BaseWidget.zIndexGlobal = 0;
export default BaseWidget;
