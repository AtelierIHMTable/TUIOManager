/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

import $ from 'jquery/dist/jquery.min';

import { CREATE_SOCKETIO_ACTION, UPDATE_SOCKETIO_ACTION, DELETE_SOCKETIO_ACTION } from './constants';

/**
 * Main class to manage TUIOManager.
 *
 * @class TUIOManager
 */
class TUIOManager {

  /**
   * TUIOManager constructor.
   *
   * @constructor
   */
  constructor() {
    const socketIOScriptNode = $('<script>');
    socketIOScriptNode.attr('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.2/socket.io.min.js');
    $(document).find('head').first().prepend(socketIOScriptNode)
  }

  /**
   * Init and start TUIOManager.
   *
   * @method start
   * @param {string} socketIOUrl - Socket IO Server's url. Default : 'http://localhost:9000/'
   */
  start(socketIOUrl = 'http://localhost:9000/') {
    const socketIOClient = io(socketIOUrl);
    socketIOClient.on(CREATE_SOCKETIO_ACTION, (data) => {
      console.log('CREATE_SOCKETIO_ACTION: ' , data);
    });
    socketIOClient.on(UPDATE_SOCKETIO_ACTION, (data) => {
      console.log('UPDATE_SOCKETIO_ACTION:', data);
    });
    socketIOClient.on(DELETE_SOCKETIO_ACTION, (data) => {
      console.log('DELETE_SOCKETIO_ACTION:', data);
    });
  }
}

export default TUIOManager;
