/**
 * @author Christian Brel <ch.brel@gmail.com>
 */
import $ from 'jquery/dist/jquery.min'
// Import TUIOManager
import TUIOManager from '../core/TUIOManager'
import TestWidget from '../widgets/TestWidget';
import MoveWidget from '../widgets/behavior/MoveWidget';
import ZoomWidget from '../widgets/behavior/ZoomWidget';

const tuioManager = new TUIOManager()

tuioManager.start()
tuioManager.showInteractions = true;

$(window)
  .ready(() => {
    // const widget = new MoveWidget(new TestWidget(50, 50, 100, 100));
    const widget = new ZoomWidget(new MoveWidget(new TestWidget(500, 500, 100, 100)));
    widget.addTo($('body'));
  });
