/**
 * @author Christian Brel <ch.brel@gmail.com>
 */
import $ from 'jquery/dist/jquery.min'
// Import TUIOManager
import TUIOManager from '../core/TUIOManager'
import TestWidget from '../widgets/TestWidget';
import ClickWidget from '../widgets/behavior/TouchInteract/ClickWidget';
import WrapperWidget from '../widgets/ElementWidget/WrapperWidget';
import CenterRotateWidget from '../widgets/behavior/TouchInteract/CenterRotateWidget';

const tuioManager = new TUIOManager();

tuioManager.start();
// TODO Don't let this in prod !
tuioManager.showInteractions = true;

$(window)
  .ready(() => {
    const root = $('body');
    // const widget = new MoveWidget(new TestWidget(50, 50, 100, 100));
    // const widget = new MoveWidget(new RotateWidget(new ZoomWidget(new TestWidget(500, 500, 300, 300))));
    // const widget2 = new ClickWidget(new MoveWidget(new RotateWidget(new ZoomWidget(new TestWidget(1000, 200, 300, 300, 'green')))),
    //   (clic) => {
    //     console.log(clic);
    //   });
    const list = [];
    const offsetX = 300;
    const offsetY = 50;
    const width = 80;
    const margin = 10;
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        list.push(
          new ClickWidget(
            new TestWidget(offsetX + i * width + ((i - 1) * margin) + margin, offsetY + j * width + ((j - 1) * margin),
              width, width, 'blue'),
            () => {
              console.log(`${i + 1}, ${j + 1}`);
            },
          ),
        )
      }
    }
    const widget3 = new CenterRotateWidget(new WrapperWidget(...list));
    widget3.addTo(root)
  });
