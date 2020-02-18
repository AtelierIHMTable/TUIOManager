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
      throw new TypeError('ElementWidget is an abstract class. It cannot be instanciated')
    }
    super(x, y, width, height);
    BaseWidget.zIndexGlobal += 1;
    this.zIndex = BaseWidget.zIndexGlobal;
  }// constructor
}

BaseWidget.zIndexGlobal = 0;
export default BaseWidget;
