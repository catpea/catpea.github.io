// Simple reactive signal implementation
class EventEmitter {
  #events = new Map();

  on(event, callback) {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Set());
    }
    this.#events.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const callbacks = this.#events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.#events.delete(event);
      }
    }
  }

  emit(event, ...args) {
    const callbacks = this.#events.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(...args);
      }
    }
  }
}

class Signal {
  #value;
  #emitter;

  constructor(value) {
    this.#value = value;
    this.#emitter = new EventEmitter();
  }

  // Avoid using get()/set(*) use .value instead
  get(){
    return this.value;
  }

  set(value){
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.notify();
  }

  update(callback){
    //NOTE: assumes update, always calls notify
    this.#value = callback(this.#value);
    this.notify();
  }

  subscribe(callback) {
    if(!(this.#value === undefined)) callback(this.#value);
    return this.#emitter.on('change', callback);
  }

  notify(){
    this.#emitter.emit('change', this.#value);
  }
}



class FlowConnector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create signals
    this.x1 = new Signal(0);
    this.y1 = new Signal(0);
    this.x2 = new Signal(100);
    this.y2 = new Signal(100);

    this.color = new Signal(this.getAttribute('color') || 'black');
    this.label1 = new Signal(this.getAttribute('label1') || '');
    this.label2 = new Signal(this.getAttribute('label2') || '');
    this.lineLabel = new Signal(this.getAttribute('line-label') || '');

    // Create the shadow DOM structure
    this.shadowRoot.innerHTML = `
      <style>
        svg {
          overflow: visible;
          position: absolute;
          pointer-events: none;
        }
        text {
          font-family: sans-serif;
          font-size: 12px;
          font-weight: bold;
          fill: black;
          stroke: white;
          stroke-width: 2px;
          paint-order: stroke fill;
          dominant-baseline: middle;
          text-anchor: middle;
        }
      </style>
      <svg>
        <line stroke-width="10"/>
        <circle r="7" stroke="black" fill="white" stroke-width="2"/>
        <circle r="7" stroke="black" fill="white" stroke-width="2"/>
        <text class="label1"></text>
        <text class="label2"></text>
        <text class="line-label"></text>
      </svg>
    `;

    this.svg = this.shadowRoot.querySelector('svg');
    this.line = this.svg.querySelector('line');
    this.circles = this.svg.querySelectorAll('circle');
    this.labelEls = {
      label1: this.shadowRoot.querySelector('.label1'),
      label2: this.shadowRoot.querySelector('.label2'),
      lineLabel: this.shadowRoot.querySelector('.line-label'),
    };
  }

  connectedCallback() {
    const update = () => {
      const x1 = this.x1.value;
      const y1 = this.y1.value;
      const x2 = this.x2.value;
      const y2 = this.y2.value;
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      const padding = 10;

      // SVG size and position
      this.svg.setAttribute('style', `left: ${minX - padding}px; top: ${minY - padding}px; width: ${width + padding * 2}px; height: ${height + padding * 2}px;`);
      const sx1 = x1 - minX + padding;
      const sy1 = y1 - minY + padding;
      const sx2 = x2 - minX + padding;
      const sy2 = y2 - minY + padding;

      this.line.setAttribute('x1', sx1);
      this.line.setAttribute('y1', sy1);
      this.line.setAttribute('x2', sx2);
      this.line.setAttribute('y2', sy2);
      this.line.setAttribute('stroke', this.color.value);

      this.circles[0].setAttribute('cx', sx1);
      this.circles[0].setAttribute('cy', sy1);
      // this.circles[0].setAttribute('stroke', this.color.value);

      this.circles[1].setAttribute('cx', sx2);
      this.circles[1].setAttribute('cy', sy2);
      // this.circles[1].setAttribute('stroke', this.color.value);

      // Text Labels
      this.labelEls.label1.setAttribute('x', sx1);
      this.labelEls.label1.setAttribute('y', sy1 - 18);
      this.labelEls.label1.textContent = this.label1.value;

      this.labelEls.label2.setAttribute('x', sx2);
      this.labelEls.label2.setAttribute('y', sy2 - 18);
      this.labelEls.label2.textContent = this.label2.value;

      this.labelEls.lineLabel.setAttribute('x', (sx1 + sx2) / 2);
      this.labelEls.lineLabel.setAttribute('y', (sy1 + sy2) / 2 - 18);
      this.labelEls.lineLabel.textContent = this.lineLabel.value;
    };

    // Subscribe all signals to update
    [this.x1, this.y1, this.x2, this.y2, this.color, this.label1, this.label2, this.lineLabel]
      .forEach(signal => signal.subscribe(update));
  }

  static get observedAttributes() {
    return ['x1', 'y1', 'x2', 'y2', 'color', 'label1', 'label2', 'line-label'];
  }

  attributeChangedCallback(name, _, newVal) {

    if (name === 'x1') this.x1.value = newVal;
    if (name === 'y1') this.y1.value = newVal;
    if (name === 'x2') this.x2.value = newVal;
    if (name === 'y2') this.y2.value = newVal;

    if (name === 'color') this.color.value = newVal;
    if (name === 'label1') this.label1.value = newVal;
    if (name === 'label2') this.label2.value = newVal;
    if (name === 'line-label') this.lineLabel.value = newVal;
  }

  setCoordinates(x1, y1, x2, y2) {
    this.x1.value = x1;
    this.y1.value = y1;
    this.x2.value = x2;
    this.y2.value = y2;
  }
}

customElements.define('flow-connector', FlowConnector);


class PositionSignal extends EventTarget {
  /**
   * Create a new PositionSignal for a given HTMLElement.
   * @param {HTMLElement} element
   */
  constructor(element) {
    super();
    if (!(element instanceof HTMLElement)) {
      throw new Error('PositionSignal expects an HTMLElement');
    }
    this._element = element;
    this._listeners = new Set();
    this._active = false;
    this._lastRect = null;
    this._mutationObserver = null;
    this._resizeObserver = null;
    this._boundCheck = this._checkPosition.bind(this);
    this._boundScroll = this._checkPosition.bind(this);

    // EventTarget-based subscription management
    this.addEventListener('subscribe', () => {
      if (!this._active) this._start();
    });
    this.addEventListener('unsubscribe', () => {
      if (this._listeners.size === 0 && this._active) this._stop();
    });
  }

  get value() {
    return this._getRect();
  }

  set value(_) {
    // No-op: Position is read-only, but setter defined for Signal compatibility
  }

  /**
   * Subscribe to position changes.
   * @param {(x: number, y: number, w: number, h: number) => void} callback
   * @returns {() => void} Unsubscribe function
   */
  subscribe(callback) {
    if (typeof callback !== 'function') throw new Error('Callback must be a function');
    this._listeners.add(callback);

    // Begin monitoring if not already active
    if (!this._active) this._start();

    // Immediately call with current value
    const { x, y, width, height } = this._getRect();
    callback(x, y, width, height);

    // For EventTarget-based management (notify subscribe)
    this.dispatchEvent(new Event('subscribe'));

    // Unsubscribe function
    return () => {
      this._listeners.delete(callback);
      this.dispatchEvent(new Event('unsubscribe'));
    };
  }

  /**
   * Stop all listeners and monitoring.
   */
  stop() {
    this._listeners.clear();
    this._stop();
  }

  /**
   * @private
   * Get the current bounding rect considering border, not margin.
   */
  _getRectBug1() {
    // Use getBoundingClientRect for position (accounts for scroll, zoom, etc.)
    // Use offsetWidth/offsetHeight for size (includes borders/padding, not margin)
    const rect = this._element.getBoundingClientRect();
    const width = this._element.offsetWidth;
    const height = this._element.offsetHeight;
    return {
      x: rect.left,
      y: rect.top,
      width,
      height
    };
  }
  _getRect() {
    const rect = this._element.getBoundingClientRect();
    const width = this._element.offsetWidth;
    const height = this._element.offsetHeight;
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width,
      height
    };
  }
  /**
   * @private
   * Check element position and notify listeners if changed.
   */
  _checkPosition() {
    const rect = this._getRect();
    const last = this._lastRect;
    // Compare all values, including size
    if (
      !last ||
      rect.x !== last.x ||
      rect.y !== last.y ||
      rect.width !== last.width ||
      rect.height !== last.height
    ) {
      this._lastRect = rect;
      for (const cb of this._listeners) {
        cb(rect.x, rect.y, rect.width, rect.height);
      }
    }
  }

  /**
   * @private
   * Start monitoring all relevant events
   */
  _start() {
    if (this._active) return;
    this._active = true;

    // Observe DOM mutations (attributes/structure) which may affect position
    this._mutationObserver = new MutationObserver(this._boundCheck);
    this._mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class', 'hidden']
    });

    // Observe element resizes
    this._resizeObserver = new ResizeObserver(this._boundCheck);
    this._resizeObserver.observe(this._element);

    // Window resize/scroll, document scroll, and ancestor scroll
    window.addEventListener('resize', this._boundCheck, true);
    window.addEventListener('scroll', this._boundCheck, true);
    document.addEventListener('scroll', this._boundCheck, true);

    // Ancestor scroll: monitor scroll events on all ancestor elements
    this._scrollAncestors = [];
    let parent = this._element.parentElement;
    while (parent) {
      parent.addEventListener('scroll', this._boundScroll, true);
      this._scrollAncestors.push(parent);
      parent = parent.parentElement;
    }

    // Periodic fallback in case something is missed (rare edge cases)
    this._interval = setInterval(this._boundCheck, 250);

    // Initial call
    this._checkPosition();
  }

  /**
   * @private
   * Stop all monitoring
   */
  _stop() {
    if (!this._active) return;
    this._active = false;

    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    window.removeEventListener('resize', this._boundCheck, true);
    window.removeEventListener('scroll', this._boundCheck, true);
    document.removeEventListener('scroll', this._boundCheck, true);

    if (this._scrollAncestors) {
      for (const ancestor of this._scrollAncestors) {
        ancestor.removeEventListener('scroll', this._boundScroll, true);
      }
      this._scrollAncestors = null;
    }

    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    this._lastRect = null;
  }
}

// Example usage
// const elementPosition = new PositionSignal(element);
// const unsubscribe = elementPosition.subscribe((x, y, w, h) => { ... });
// elementPosition.stop();

// export default PositionSignal;



class WindowContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Signals
    this.left = new Signal(parseInt(this.getAttribute('left') || 100));
    this.top = new Signal(parseInt(this.getAttribute('top') || 100));
    this.width = new Signal(parseInt(this.getAttribute('width') || 400));
    this.height = new Signal(parseInt(this.getAttribute('height') || 300));

    // Template with slot for content
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          display: block;
          box-shadow: 0 0 8px rgba(0,0,0,0.2);
          background: rgba(1,1,1,0.1);
        }
        .resize-handle {
          position: absolute;
          width: 16px;
          height: 16px;
          bottom: 0;
          right: 0;
          cursor: se-resize;
          z-index: 10;
        }
      </style>
      <slot></slot>
      <div class="resize-handle" data-js-feature="resizable"></div>
    `;

    this.resizeHandle = this.shadowRoot.querySelector('[data-js-feature="resizable"]');
  }

  connectedCallback() {
    // Initial position and size
    const updatePosition = () => {

      this.style.left = this.left.value + 'px';
      this.style.top = this.top.value + 'px';

      this.style.width = Math.max(320, this.width.value) + 'px';
      this.style.height = Math.max(320, this.height.value) + 'px';

    };

    [this.left, this.top, this.width, this.height].forEach(signal =>
      signal.subscribe(updatePosition)
    );

    this._initDrag();
    this._initResize();
  }

  _initDrag() {
    const header = this.querySelector('[data-js-feature="draggable"]');
    if (!header) return;

    let offsetX = 0, offsetY = 0;
    const onMouseDown = (e) => {
      offsetX = e.clientX - this.left.value;
      offsetY = e.clientY - this.top.value;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = (e) => {
      this.left.value = e.clientX - offsetX;
      this.top.value = e.clientY - offsetY;
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    header.style.cursor = 'move';
    header.addEventListener('mousedown', onMouseDown);
  }

  _initResize() {
    let startX, startY, startWidth, startHeight;

    const onMouseDown = (e) => {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = this.width.value;
      startHeight = this.height.value;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      this.width.value = startWidth + (e.clientX - startX);
      this.height.value = startHeight + (e.clientY - startY);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    this.resizeHandle.addEventListener('mousedown', onMouseDown);
  }
}

customElements.define('window-container', WindowContainer);








      const connector1 = document.getElementById('connector1');
      connector1.setCoordinates(100, 100, 300, 200);

      const connector2 = document.getElementById('connector2');
      connector2.setCoordinates(130, 130, 1234, 100);

      const window1Input = document.getElementById('window-1-input');

      const window1InputPosition = new PositionSignal(window1Input);
      const window1InputPositionUnsubscribe = window1InputPosition.subscribe((x, y, w, h) => {
        connector1.setAttribute('x2', x+(w/2));
        connector1.setAttribute('y2', y+(h/2));
      });

      const window1Output = document.getElementById('window-1-output');
      const window1OutputPosition = new PositionSignal(window1Output);
      const window1OutputPositionUnsubscribe = window1OutputPosition.subscribe((x, y, w, h) => {
        connector2.setAttribute('x1', x+(w/2));
        connector2.setAttribute('y1', y+(h/2));
      });




      const window2Input = document.getElementById('window-2-input');

      const window2InputPosition = new PositionSignal(window2Input);
      const window2InputPositionUnsubscribe = window2InputPosition.subscribe((x, y, w, h) => {
        connector2.setAttribute('x2', x+(w/2));
        connector2.setAttribute('y2', y+(h/2));
      });

      window.addEventListener('keydown', (e) => {
        if (e.shiftKey) window.parent.postMessage({ type: 'special-on' }, '*');
      });

      window.addEventListener('keyup', (e) => {
        if (e.key == 'Shift') window.parent.postMessage({ type: 'special-off' }, '*');
      });
