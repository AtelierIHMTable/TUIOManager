/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

import io from 'socket.io-client';

import TUIOTouch from './TUIOTouch';
import TUIOTag from './TUIOTag';

import {
  CREATE_SOCKETIO_ACTION, UPDATE_SOCKETIO_ACTION, DELETE_SOCKETIO_ACTION,
  TOUCH_SOCKETIO_TYPE, TAG_SOCKETIO_TYPE,
} from './constants';

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
    this._touches = {};
    this._tags = {};
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
      this.handleCreate(data);
    });
    socketIOClient.on(UPDATE_SOCKETIO_ACTION, (data) => {
      this.handleUpdate(data);
    });
    socketIOClient.on(DELETE_SOCKETIO_ACTION, (data) => {
      this.handleDelete(data);
    });
  }

  /**
   * Handle CREATE Action from socket.
   *
   * @method handleCreate
   * @param {JSON} socketData - 'Create' data from TUIOClient.
   */
  handleCreate(socketData) {
    switch (socketData.type) {
      case TOUCH_SOCKETIO_TYPE: {
        this._touches[socketData.id] = new TUIOTouch(socketData.id, socketData.x, socketData.y);
        console.log('add touch :', this._touches[socketData.id]);
        break;
      }
      case TAG_SOCKETIO_TYPE: {
        this._tags[socketData.id] = new TUIOTag(socketData.id, socketData.tagId, socketData.x, socketData.y, socketData.angle);
        console.log('add tag :', this._tags[socketData.id]);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Handle UPDATE Action from socket.
   *
   * @method handleUpdate
   * @param {JSON} socketData - 'Update' data from TUIOClient.
   */
  handleUpdate(socketData) {
    switch (socketData.type) {
      case TOUCH_SOCKETIO_TYPE: {
        if (typeof (this._touches[socketData.id]) !== 'undefined') {
          this._touches[socketData.id].moveTo(socketData.x, socketData.y);
          console.log('update touch :', this._touches[socketData.id]);
        }

        // touchAlive[socketData.id].updateSub();

        break;
      }
      case TAG_SOCKETIO_TYPE: {
        if (typeof (this._tags[socketData.id]) !== 'undefined') {
          this._tags[socketData.id].moveTo(socketData.x, socketData.y);
          this._tags[socketData.id].rotate(socketData.angle);
          console.log('update tag :', this._tags[socketData.id]);
        }
        break;
      }
      default:
        break;
    }
  }

  /**
   * Handle DELETE Action from socket.
   *
   * @method handleDelete
   * @param {JSON} socketData - 'Delete' data from TUIOClient.
   */
  handleDelete(socketData) {
    switch (socketData.type) {
      case TOUCH_SOCKETIO_TYPE: {
        if (typeof (this._touches[socketData.id]) !== 'undefined') {
          delete this._touches[socketData.id];
          console.log('delete touch :', socketData.id);
        }
        break;
      }
      case TAG_SOCKETIO_TYPE: {
        if (typeof (this._tags[socketData.id]) !== 'undefined') {
          delete this._tags[socketData.id];
          console.log('delete tag :', socketData.id);
        }
        break;
      }
      default:
        break;
    }
  }
}

export default TUIOManager;
