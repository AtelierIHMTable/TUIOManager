/**
 * @author Christian Brel <ch.brel@gmail.com>
 */
import $ from 'jquery/dist/jquery.min'
// Import TUIOManager
import TUIOManager from '../core/TUIOManager'
import TestWidget from '../widgets/TestWidget';
import TouchDragWidget from '../widgets/behavior/touch-interact/TouchDragWidget';
import DropWidget from '../widgets/behavior/utils/DropWidget';
import TouchInteractWidget from '../widgets/behavior/touch-interact/TouchInteractWidget';
import TouchMoveWidget from '../widgets/behavior/touch-interact/TouchMoveWidget';
import TouchGoOnTopWidget from '../widgets/behavior/touch-interact/TouchGoOnTopWidget';
import TouchCenterRotateWidget from '../widgets/behavior/touch-interact/TouchCenterRotateWidget';
import WrapperWidget from '../widgets/WrapperWidget';
import TagDeleteWidget from '../widgets/behavior/tag-interact/TagDeleteWidget';
import TagMoveWidget from '../widgets/behavior/tag-interact/TagMoveWidget';
import TagCenterZoomWidget from '../widgets/behavior/tag-interact/TagCenterZoomWidget';
import TagCenterRotateWidget from '../widgets/behavior/tag-interact/TagCenterRotateWidget';
import TouchRotateWidget from '../widgets/behavior/touch-interact/TouchRotateWidget';

const tuioManager = new TUIOManager();

tuioManager.start();
// TODO Don't let this in prod !
tuioManager.showInteractions = true;

// eslint-disable-next-line no-unused-vars
function testForComplexInteractions() {
  const root = $('body');
  const list = [];
  const offsetX = 300;
  const offsetY = 50;
  const width = 80;
  const margin = 10;
  const color = 'rgb(0, 0, 255)'; // must be a properly formatted rgb
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      list.push(
        new TouchInteractWidget(
          new TestWidget(offsetX + i * width + ((i - 1) * margin) + margin, offsetY + j * width + ((j - 1) * margin),
            width, width, color),
          (widget) => {
            console.log(`${i + 1}, ${j + 1}`);
            if (widget.domElem.css('background-color') === color) {
              widget.domElem.css('background-color', 'orange')
            } else {
              widget.domElem.css('background-color', color)
            }
          },
        ),
      )
    }
  }
  const widget3 = new TouchCenterRotateWidget(new WrapperWidget(...list));
  widget3.addTo(root)
}

// eslint-disable-next-line no-unused-vars
function testForDragNDrop() {
  const root = $('body');

  const widget2 = new DropWidget(new TestWidget(500, 500, 300, 300, 'red'), 'TEST', (w) => {
    w.domElem.css('background', 'green')
  }, (w) => {
    w.domElem.css('background', 'red')
  });
  const widget = new TouchInteractWidget(new TouchDragWidget(new TestWidget(50, 50, 100, 100), ((name) => {
    if (name === 'TEST') {
      widget2.domElem.css('background', 'orange')
    }
  }), ['TEST', 'TEST2']), (widgetC) => {
    if (widgetC.domElem.css('background-color') === 'rgb(0, 0, 255)') {
      widgetC.domElem.css('background-color', 'orange')
    } else {
      widgetC.domElem.css('background-color', 'blue')
    }
  });
  widget2.addTo(root);
  widget.addTo(root);
  new DropWidget(new TestWidget(500, 700, 300, 300, 'orange'), 'TEST2', (w) => {
    w.domElem.css('background', 'pink')
  }, (w) => {
    w.domElem.css('background', 'orange')
  }).addTo(root);
}

// eslint-disable-next-line no-unused-vars
function testForGoOnTop() {
  const root = $('body');
  new TouchGoOnTopWidget(new TouchMoveWidget(new TestWidget(500 - 300, 500 - 300, 300, 300, 'pink'))).addTo(root);
  new TouchGoOnTopWidget(new TouchMoveWidget(new TestWidget(900 - 300, 500 - 300, 300, 300, 'orange'))).addTo(root);
  new TouchGoOnTopWidget(new TouchMoveWidget(new TestWidget(500 - 300, 900 - 300, 300, 300, 'blue'))).addTo(root);
  new TouchGoOnTopWidget(new TouchMoveWidget(new TestWidget(900 - 300, 900 - 300, 300, 300, 'green'))).addTo(root);
}

// eslint-disable-next-line no-unused-vars
function testForTagInteractions() {
  const root = $('body');
  // test with final wrapper
  // new TagDeleteWidget(new TouchMoveWidget(new TestWidget(500 - 300, 500 - 300, 300, 300, 'pink')), 9).addTo(root);
  // test with middle wrapper
  // new TouchMoveWidget(new TagDeleteWidget(new TestWidget(500 + 100, 500 - 300, 300, 300, 'blue'), 10)).addTo(root);
  new TagCenterRotateWidget(
    new TagCenterZoomWidget(
      new TagMoveWidget(
        new TagDeleteWidget(
          new TestWidget(500 + 100, 500 - 300, 300, 300, 'blue'),
          10,
        ),
        9,
      ),
      8,
    ),
    7,
  ).addTo(root);
}

/**
 * Construct a 2 * 2 of 2 * 2 squares (8*8 square total).
 * Each square goes cyan on touch and goes back to default on retouch
 * Each square can be deleted with tag 10
 * 2*2 inner squares can rotates with one finger interaction
 * 2*2 inner square goes on top on interact with touch
 * 8*8 square can rotate using tag 9
 *
 * Allows to test : deletion, compound widgets inside compound widgets, interactions combining tags and touches
 */
function demo() {
  function createSquare(x, y, width, height, color) {
    const defaultColor = color;
    return new TagDeleteWidget(new TouchInteractWidget(new TestWidget(x, y, width, height, color), (widget) => {
      if (widget.domElem.css('background-color') === defaultColor) {
        widget.domElem.css('background-color', 'cyan')
      } else {
        widget.domElem.css('background-color', defaultColor)
      }
    }), 10);
  }

  function create2x2Square(startX, startY) {
    return new TouchGoOnTopWidget(new TouchRotateWidget(new WrapperWidget(
      createSquare(startX, startY, 125, 125, 'rgb(0, 0, 255)'),
      createSquare(startX + 135, startY, 125, 125, 'rgb(105,25,128)'),
      createSquare(startX, startY + 135, 125, 125, 'rgb(255, 165, 0)'),
      createSquare(startX + 135, startY + 135, 125, 125, 'rgb(255, 123, 146)'),
    )));
  }

  const root = $('body');
  const offsetX = 700;
  const offsetY = 280;
  const square1 = create2x2Square(offsetX, offsetY);
  const square2 = create2x2Square(offsetX + 270, offsetY);
  const square3 = create2x2Square(offsetX, offsetY + 270);
  const square4 = create2x2Square(offsetX + 270, offsetY + 270);
  const finalWidget = new TagCenterRotateWidget(
    new WrapperWidget(
      square1,
      square2,
      square3,
      square4,
    ),
    9,
  );
  finalWidget.addTo(root);
}

$(window)
  .ready(() => {
    demo();
  });
