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
import ImageWidget from '../widgets/widgets/ImageWidget';
import InitialRotationWidget from '../widgets/behavior/utils/InitialRotationWidget';

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
// eslint-disable-next-line no-unused-vars
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

function testImageWidget() {
  const root = $('body');
  // eslint-disable-next-line max-len
  const img = new ImageWidget(50, 50, 300, 300, 'data:image/jpeg;base64,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');
  new TouchMoveWidget(new InitialRotationWidget(img, 80)).addTo(root);
}

$(window)
  .ready(() => {
    testImageWidget();
  });
