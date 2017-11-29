/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */

import $ from 'jquery/dist/jquery.min';
import TUIOWidget from '../../core/TUIOWidget';
import { radToDeg } from '../../core/helpers';

/**
 * Abstract class to manage ImageElementWidget.
 *
 * @class ElementWidget
 * @extends TUIOWidget
 */
class CircularMenu extends TUIOWidget {
  constructor(tagMenu, size) {
    super(0, 0, 300, 300);

    this.idTagMenu = tagMenu;
    this.isHide = true;
    this.size = size;
    this._lastTagsValues = {};
    this.menuItemCoord = [];
    this.itemsCallBack = [];
    this.nbItems = 0;
    this._domElem = $('<div>').attr('class', 'selector');
    this._domElem.append(
      $('<ul>'),
    ).css('z-index', 2147483647);
    this.zIndex = 2147483647;
    this.angleStart = -360;
  }

  startMenu() {
    this.toggleOptions(this.domElem);
    this._domElem.hide();
  }

  rotate(li, d) {
    $({ d: this.angleStart }).animate({ d: d }, {
      step: (now) => {
        $(li).css({ transform: `rotate( ${now}deg)` });
      },
      duration: 0,
    });
  }

  // show / hide the options
  toggleOptions(s) {
    $(s).toggleClass('open');
    const li = $(s).find('li');
    const deg = $(s).hasClass('half') ? 180 / (li.length - 1) : 360 / li.length;
    for (let i = 0; i < li.length; i += 1) {
      const d = $(s).hasClass('half') ? (i * deg) - 90 : i * deg;
      $(s).hasClass('open') ? this.rotate(li[i], d) : this.rotate(li[i], this.angleStart);
    }
  }

  addMenuItemText(itemName, textColor, backgroundColor, callback) {
    if (this.nbItems < this.size) {
      this.domElem.find('ul').append(
        $('<li>').append(
          $('<input>').attr('id', `c ${this.nbItems}`).attr('type', 'checkbox'),
          $('<label>')
            .attr('for', `c ${this.nbItems}`)
            .text(itemName)
            .css('color', textColor)
            .css('background-color', backgroundColor),
        ),
      );
      this.nbItems += 1;
      this.itemsCallBack.push(callback);
      if (this.nbItems === this.size) {
        this.startMenu();
      }
    }
  }

  addMenuItemIcon(iconName, iconColor, backgroundColor, callback) {
    if (this.nbItems < this.size) {
      this.domElem.find('ul').append(
        $('<li>').append(
          $('<input>').attr('id', `c ${this.nbItems}`).attr('type', 'checkbox'),
          $('<label>')
            .attr('for', `c ${this.nbItems}`)
            .append(
              $('<i>')
                .attr('class', iconName),
            )
            .css('color', iconColor)
            .css('background-color', backgroundColor),
        ),
      );
      this.itemsCallBack.push(callback);
      this.nbItems += 1;
      if (this.nbItems === this.size) {
        this.startMenu();
      }
    }
  }

  /**
     * ImageWidget's domElem.
     *
     * @returns {JQuery Object} ImageWidget's domElem.
     */
  get domElem() { return this._domElem; }

  /**
   * Check if TUIOWidget is touched.
   *
   * @method isTouched
   * @param {number} x - Point's abscissa to test.
   * @param {number} y - Point's ordinate to test.
   */
  isTouched(x, y) {
    return (x >= this.x && x <= this.width + this.x && y >= this.y && y <= this.y + this.height) && !this.isHide;
  }

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation(tuioTouch) {
    super.onTouchCreation(tuioTouch);
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      for (let i = 0; i < this.menuItemCoord.length; i += 1) {
        if (tuioTouch.x >= this.menuItemCoord[i].xmin && tuioTouch.x <= this.menuItemCoord[i].xmax && tuioTouch.y >= this.menuItemCoord[i].ymin && tuioTouch.y <= this.menuItemCoord[i].ymax) {
          this.itemsCallBack[i]();
          break;
        }
      }
    }
  }

  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    this._tags = {
      ...this._tags,
      [tuioTag.id]: tuioTag,
    };
    this._tags[tuioTag.id].addWidget(this);

    this._lastTagsValues = {
      ...this._lastTagsValues,
      [tuioTag.id]: {
        x: tuioTag.x,
        y: tuioTag.y,
      },
    };
    if (tuioTag.id === this.idTagMenu) {
      this._x = tuioTag.x - (this.domElem.width() / 2) - 80;
      this._y = tuioTag.y - (this.domElem.height() / 2) - 80;
      this.topSelector = tuioTag.y - (this.domElem.height() / 2);
      this.leftSelector = tuioTag.x - (this.domElem.width() / 2);
      this.domElem.css('top', this.topSelector);
      this.domElem.css('left', this.leftSelector);
      this._domElem.show();
      this.isHide = false;
      const li = this.domElem.find('li');
      this.menuItemCoord = [];
      for (let i = 0; i < li.length; i += 1) {
        const x = $(li[i]).find('label')[0].getBoundingClientRect().left;
        const y = $(li[i]).find('label')[0].getBoundingClientRect().top;
        const width = $(li[i]).find('label').width();
        const height = $(li[i]).find('label').height();
        this.menuItemCoord.push({ xmin: x, ymin: y, xmax: x + width, ymax: y + height });
      }
    }
  }

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      if (tuioTag.id === this.idTagMenu) {
        const lastTagValue = this._lastTagsValues[tuioTag.id];
        const diffX = tuioTag.x - lastTagValue.x;
        const diffY = tuioTag.y - lastTagValue.y;

        this._x = this.x + diffX;
        this._y = this.y + diffY;
        this.topSelector = this.topSelector + diffY;
        this.leftSelector = this.leftSelector + diffX;
        this.domElem.css('top', this.topSelector);
        this.domElem.css('left', this.leftSelector);
        this._domElem.css('transform', `rotate(${radToDeg(tuioTag.angle)}deg)`);
        const li = this.domElem.find('li');

        this.menuItemCoord = [];
        for (let i = 0; i < li.length; i += 1) {
          const x = $(li[i]).find('label')[0].getBoundingClientRect().left;
          const y = $(li[i]).find('label')[0].getBoundingClientRect().top;
          const width = $(li[i]).find('label').width();
          const height = $(li[i]).find('label').height();
          this.menuItemCoord.push({ xmin: x, ymin: y, xmax: x + width, ymax: y + height });
        }

        this._lastTagsValues = {
          ...this._lastTagsValues,
          [tuioTag.id]: {
            x: tuioTag.x,
            y: tuioTag.y,
          },
        };
      }
    }
  }

  /**
   * Call after a TUIOTag deletion.
   *
   * @method onTagDeletion
   * @param {number/string} tuioTagId - TUIOTag's id to delete.
   */
  onTagDeletion(tuioTagId) {
    super.onTagDeletion(tuioTagId);
    this._domElem.hide();
    this.isHide = true;
    console.log('DELETED');
  }
}

export default CircularMenu;
