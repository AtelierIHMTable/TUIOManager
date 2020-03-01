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
  new TagMoveWidget(new TagDeleteWidget(new TestWidget(500 + 100, 500 - 300, 300, 300, 'blue'), 10), 9).addTo(root);
}

$(window)
  .ready(() => {
    testForTagInteractions();
  });
