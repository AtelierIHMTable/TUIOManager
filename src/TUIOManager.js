/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 * @author Lucas Oms <lucas.oms@hotmail.fr>
 * @author Joel Dibasso <joel@dibasso.fr>
 */

import io from "socket.io-client";

import { ACTION_MAP, TUIO_EVENT_ACTION, TUIO_EVENT_SOURCE } from "./constants";

/** @typedef {"CREATE"|"UPDATE"|"DELETE"} TUIOEventAction */
/** @typedef Position
 * @property {number} x - X position.
 * @property {number} y - Y position.
 * @property {number|undefined} [angle] - Angle.
 */

/** @typedef TUIOEventData
 * @property {"TOUCH"|"TAG"} type - Event type.
 * @property {number} id - Touch or Tag id.
 * @property {number} x - X position of touch or tag.
 * @property {number} y - Y position of touch or tag.
 * @property {number} angle - Angle of the tag.
 */

/**
 * Main class to manage TUIOManager.
 *
 * @class TUIOManager
 */
export class TUIOManager {
  /**
   * @typedef {Object} TUIOManagerOptions
   * @property {HTMLElement|undefined} anchor - The HTML element to use as anchor for the TUIOManager.
   * @property {boolean|undefined} showInteractions - Show interactions on screen.
   * @property {string|undefined} socketIOUrl - Socket IO Server's url. Default : 'http://localhost:9000/'
   */

  /**
   * TUIOManager constructor.
   * @private
   * @constructor
   * @param {TUIOManagerOptions} options - Options for the TUIOManager.
   */
  constructor({
    anchor = undefined,
    showInteractions = true,
    socketIOUrl = "http://localhost:9000/",
  } = {}) {
    /**
     * @type {number}
     * @description Width of the window.
     */
    this.windowWidth = 0;
    /**
     * @type {number}
     * @description Height of the window.
     */
    this.windowHeight = 0;
    /**
     * @type {Map<number, TUIOTouch>}
     * @description Map of TUIOTouches.
     */
    this.touches = new Map();
    /**
     * @type {Map<number, TUIOTag>}
     * @description Map of TUIOTags.
     */
    this.tags = new Map();
    /**
     * @type {boolean}
     * @description Show interactions on screen.
     */
    this.showInteractions = showInteractions;
    /**
     * @type {string}
     * @description Socket IO Server's url.
     */
    this.socketIOUrl = socketIOUrl;
    this.initResizeListener(anchor);
    this.initSocketIOListeners();
    this.addPointerDrawingListeners();
    this.addCss();
  }

  /**
   * Init and start TUIOManager.
   * @param {TUIOManagerOptions} options - Options for the TUIOManager.
   */
  static start(options) {
    if (!TUIOManager.instance) {
      TUIOManager.instance = new TUIOManager(options);
    }
  }

  /**
   * Init resize listener.
   * @param {HTMLElement|null} anchor - The HTML element to use as anchor for the TUIOManager.
   */
  initResizeListener(anchor) {
    this.updateWindowSize(anchor);
    window.addEventListener("resize", () => {
      this.updateWindowSize(anchor);
    });
  }

  /**
   * Update window size.
   * @param {HTMLElement|null} anchor - The HTML element to use as anchor for the TUIOManager.
   */
  updateWindowSize(anchor) {
    if (anchor) {
      this.windowWidth = anchor.clientWidth;
      this.windowHeight = anchor.clientHeight;
    } else {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  /**
   * Init socket IO listeners.
   */
  initSocketIOListeners() {
    const socketIOClient = io(this.socketIOUrl);
    socketIOClient.on(TUIO_EVENT_ACTION.CREATE, (data) => {
      this.handleSocketEvent(data, TUIO_EVENT_ACTION.CREATE);
    });
    socketIOClient.on(TUIO_EVENT_ACTION.UPDATE, (data) => {
      this.handleSocketEvent(data, TUIO_EVENT_ACTION.UPDATE);
    });
    socketIOClient.on(TUIO_EVENT_ACTION.DELETE, (data) => {
      this.handleSocketEvent(data, TUIO_EVENT_ACTION.DELETE);
    });
  }

  /**
   * Add CSS for pointers to the document.
   */
  addCss() {
    const style = document.createElement("style");
    style.innerHTML = `
    .tuio-pointer {
      position: absolute;
      z-index: 1000;
      backdrop-filter: blur(10px);
      transition: scale 90ms ease-out;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }
    
    .tuio-pointer.touch {
      border: 1px solid rgba(196,196,196,0.4);
      height: 25px;
      width: 25px;
      border-radius: 50%;
      background: rgba(59, 59, 59, 0.7);
    }
    
    .tuio-pointer.tag {
      height: 30px;
      width: 30px;
    }
    
    .tuio-pointer.small {
      scale: 0.5;
    }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add listeners for drawing pointers on screen.
   */
  addPointerDrawingListeners() {
    if (!this.showInteractions) return;
    document.addEventListener(
      "tuiotouchdown",
      /** @param {TUIOTouch } touch */
      ({ detail: touch }) => {
        this.drawPointer(
          `${touch.id}`,
          { x: touch.x, y: touch.y },
          TUIO_EVENT_SOURCE.TOUCH,
        );
      },
    );
    document.addEventListener(
      "tuiotouchmove",
      /** @param {TUIOTouch} touch */
      ({ detail: touch }) => {
        this.updatePointer(touch.id, { x: touch.x, y: touch.y });
      },
    );
    document.addEventListener(
      "tuiotouchup",
      /** @param {number} touchId */
      ({ detail: touchId }) => {
        this.removePointer(touchId);
      },
    );

    document.addEventListener(
      "tuiotagdown",
      /** @param {TUIOTag} tag */
      ({ detail: tag }) => {
        this.drawPointer(
          `${tag.id}`,
          { x: tag.x, y: tag.y, angle: tag.angle },
          TUIO_EVENT_SOURCE.TAG,
        );
      },
    );
    document.addEventListener(
      "tuiotagmove",
      /** @param {TUIOTag} tag */
      ({ detail: tag }) => {
        this.updatePointer(`${tag.id}`, {
          x: tag.x,
          y: tag.y,
          angle: tag.angle,
        });
      },
    );
    document.addEventListener(
      "tuiotagup",
      /** @param {number} tagId */
      ({ detail: tagId }) => {
        this.removePointer(`${tagId}`);
      },
    );
  }

  /**
   * Handle CREATE Action from socket.
   * @method handleSocketEvent
   * @param {TUIOEventData} socketData - 'Create' data from TUIOClient.
   * @param {TUIOEventAction} action - Event type.
   */
  handleSocketEvent(socketData, action) {
    const id = socketData.id;
    const x = Math.round(socketData.x * this.windowWidth);
    const y = Math.round(socketData.y * this.windowHeight);
    const angle = socketData.angle;
    const map =
      socketData.type === TUIO_EVENT_SOURCE.TOUCH ? this.touches : this.tags;
    if (action !== TUIO_EVENT_ACTION.CREATE && !map.has(socketData.id)) return;
    if (action === TUIO_EVENT_ACTION.DELETE) map.delete(id);
    else map.set(id, { id, x, y, angle });
    const eventName = this.getEventName(socketData.type, action);
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail: map.get(id) ?? id,
      }),
    );
    document.elementsFromPoint(x, y).forEach((elem) => {
      elem.dispatchEvent(
        new CustomEvent(eventName, {
          detail: map.get(id) ?? id,
        }),
      );
    });
  }

  /**
   * Get event name from source and type.
   * @param {"TOUCH"|"TAG"} source
   * @param {TUIOEventAction} eventType
   * @returns {string}
   * @private
   */
  getEventName(source, eventType) {
    return `tuio${source.toLowerCase()}${ACTION_MAP[eventType]}`;
  }

  /**
   * Draw pointer on screen.
   * @param {string} id - ID of the event
   * @param {Position} position - Position of the Touch object
   * @param {"TOUCH"|"TAG"} source - Source of the Touch object
   */
  drawPointer(id, position, source) {
    const pointer = document.createElement("div");
    pointer.id = id;
    pointer.classList.add("tuio-pointer");
    pointer.classList.add(source.toLowerCase());
    pointer.classList.add("small");
    pointer.style.top = `${position.y}px`;
    pointer.style.left = `${position.x}px`;
    if (source === TUIO_EVENT_SOURCE.TAG) {
      const svg = document.createElement("svg");
      pointer.appendChild(svg);
      svg.outerHTML = `<svg width="30" height="30" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M10 0C4.47715 0 0 4.47715 0 10V70C0 75.5229 4.47715 80 10 80H70C75.5229 80 80 75.5229 80 70V10C80 4.47715 75.5229 0 70 0H10ZM22.1667 15.5C22.1667 19.1819 19.1819 22.1667 15.5 22.1667C11.8181 22.1667 8.83333 19.1819 8.83333 15.5C8.83333 11.8181 11.8181 8.83334 15.5 8.83334C19.1819 8.83334 22.1667 11.8181 22.1667 15.5ZM54.8333 15.5C54.8333 19.1819 51.8486 22.1667 48.1667 22.1667C44.4848 22.1667 41.5 19.1819 41.5 15.5C41.5 11.8181 44.4848 8.83334 48.1667 8.83334C51.8486 8.83334 54.8333 11.8181 54.8333 15.5ZM64.5 22.1667C68.1819 22.1667 71.1667 19.1819 71.1667 15.5C71.1667 11.8181 68.1819 8.83334 64.5 8.83334C60.8181 8.83334 57.8333 11.8181 57.8333 15.5C57.8333 19.1819 60.8181 22.1667 64.5 22.1667ZM71.1667 31.8333C71.1667 35.5152 68.1819 38.5 64.5 38.5C60.8181 38.5 57.8333 35.5152 57.8333 31.8333C57.8333 28.1514 60.8181 25.1667 64.5 25.1667C68.1819 25.1667 71.1667 28.1514 71.1667 31.8333ZM15.5 54.8333C19.1819 54.8333 22.1667 51.8486 22.1667 48.1667C22.1667 44.4848 19.1819 41.5 15.5 41.5C11.8181 41.5 8.83333 44.4848 8.83333 48.1667C8.83333 51.8486 11.8181 54.8333 15.5 54.8333ZM54.8333 48.1667C54.8333 51.8486 51.8486 54.8333 48.1667 54.8333C44.4848 54.8333 41.5 51.8486 41.5 48.1667C41.5 44.4848 44.4848 41.5 48.1667 41.5C51.8486 41.5 54.8333 44.4848 54.8333 48.1667ZM64.5 71.1667C68.1819 71.1667 71.1667 68.1819 71.1667 64.5C71.1667 60.8181 68.1819 57.8333 64.5 57.8333C60.8181 57.8333 57.8333 60.8181 57.8333 64.5C57.8333 68.1819 60.8181 71.1667 64.5 71.1667Z"
              fill="#3B3B3B" fill-opacity="0.7" />
      </svg>`;
    }
    document.body.appendChild(pointer);
    setTimeout(() => pointer.classList.remove("small"), 1);
  }

  /**
   * Update pointer position on screen.
   * @param {string} id
   * @param {Position} position
   */
  updatePointer(id, position) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.style.top = `${position.y}px`;
      elem.style.left = `${position.x}px`;
      if (position.angle) elem.style.transform = `rotate(${position.angle}rad)`;
    }
  }

  /**
   * Remove pointer from screen.
   * @param {string} id
   */
  removePointer(id) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.classList.add("small");
      setTimeout(() => elem.remove(), 20);
    }
  }
}
