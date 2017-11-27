/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */

import $ from 'jquery/dist/jquery.min';
import TUIOWidget from '../../core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../core/constants';
import { radToDeg } from '../../core/helpers';
import Point from '../../src/utils/Point';

/**
 * Abstract class to manage ImageElementWidget.
 *
 * @class ElementWidget
 * @extends TUIOWidget
 */
class CircularMenu extends TUIOWidget {
  constructor(tagMenu) {
    super(0, 0, 300, 300);

    this.idTagMenu = tagMenu;
    this.isHide = true;

    this._lastTagsValues = {};
    this.menuItemCoord = [];
    this._domElem = $('<div>').attr('class', 'selector');
    this._domElem.append(
      $('<ul>').append(
        $('<li>').append(
          $('<input>').attr('id', 'c1').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c1').text('Menu1'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c3').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c2').text('Menu2'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c3').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c3').text('Menu3'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c4').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c4').text('Menu4'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c5').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c5').text('Menu5'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c6').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c6').text('Menu6'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c7').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c7').text('Menu7'),
        ),
        $('<li>').append(
          $('<input>').attr('id', 'c8').attr('type', 'checkbox'),
          $('<label>').attr('for', 'c8').text('Menu8'),
        ),
      ),
    );
    this.angleStart = -360;

    this.evt = document.createEvent("Event");
    this.evt.initEvent("onMenuClick", true, false);
    // $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'circularmenu.css'));
    // this.toggleOptions('.selector');
    // this._domElem.hide();
  }

  startMenu() {
    this.toggleOptions('.selector');
    this._domElem.hide();
  }

  rotate(li, d) {
    $({ d: this.angleStart }).animate({ d: d }, {
        step: function(now) {
            $(li)
               .css({ transform: 'rotate(' + now + 'deg)' })
               .find('label')
                  .css({ transform: 'rotate(' + (-now) + 'deg)' });
        }, duration: 0
    });
  }

  // show / hide the options
  toggleOptions(s) {
    console.log($(s));
    $(s).toggleClass('open');
    var li = $(s).find('li');
    var deg = $(s).hasClass('half') ? 180/(li.length-1) : 360/li.length;
    console.log(li);
    for(var i=0; i<li.length; i++) {
      var d = $(s).hasClass('half') ? (i*deg)-90 : i*deg;
      $(s).hasClass('open') ? this.rotate(li[i],d) : this.rotate(li[i], this.angleStart);
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
    return (x >= this.x && x <= this.width + this.x && y >= this.y && y <= this.y + this.height);
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
      //let i = 0;
      for (let i = 0; i < this.menuItemCoord.length; i += 1) {
        if (tuioTouch.x >= this.menuItemCoord[i].xmin && tuioTouch.x <= this.menuItemCoord[i].xmax && tuioTouch.y >= this.menuItemCoord[i].ymin && tuioTouch.y <= this.menuItemCoord[i].ymax) {
          
          this.evt.indexItem = i;
          window.dispatchEvent(this.evt);
          //break;
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
    if (tuioTag.id == this.idTagMenu) {
      this._x = tuioTag.x - $('.selector').width() - 80;
      this._y = tuioTag.y - $('.selector').height() - 80;
      $('.selector').css('top', tuioTag.y - $('.selector').height()/2);
      $('.selector').css('left', tuioTag.x - $('.selector').width()/2);
      this._domElem.show();

      const li = $('.selector').find('li');
      this.menuItemCoord = [];
      for (let i = 0; i < li.length; i += 1) {
        const x = $(li[i]).find('label')[0].getBoundingClientRect().left;
        const y = $(li[i]).find('label')[0].getBoundingClientRect().top;
        const width = $(li[i]).find('label').width();
        const height = $(li[i]).find('label').height();
        this.menuItemCoord.push({ xmin: x, ymin: y, xmax: x + width, ymax: y + height });
      }
    }
    // }
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
        this._x = tuioTag.x - $('.selector').width() - 80;
        this._y = tuioTag.y - $('.selector').height() - 80;
        // console.log("MENU UPDATE");
        $('.selector').css('top', tuioTag.y - $('.selector').height()/2);
        $('.selector').css('left', tuioTag.x - $('.selector').width()/2);
        const li = $('.selector').find('li');
        
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
    console.log('DELETED');
  }
}

export default CircularMenu;
