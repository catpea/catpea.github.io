// Standalone Signal class as you provided, with EventEmitter using EventTarget internally.
class EventEmitter {
  constructor() {
    this._et = new EventTarget();
  }
  emit(type, ...args) {
    this._et.dispatchEvent(new CustomEvent(type, { detail: args }));
  }
  on(type, cb) {
    const handler = e => cb(...e.detail);
    this._et.addEventListener(type, handler);
    // Return unsubscribe function
    return () => this._et.removeEventListener(type, handler);
  }
}

class Signal {
  #value;
  #emitter;

  constructor(value) {
    this.#value = value;
    this.#emitter = new EventEmitter();
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.notify();
  }

  update(callback){
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



class PanZoomFrame extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'width', 'height', 'min-scale', 'max-scale', 'initial-scale'];
  }

  constructor() {
    super();
    // Shadow DOM
    this.attachShadow({ mode: 'open' });

    // Default attributes
    this.src = '';
    this.width = 800;
    this.height = 600;
    this.minScale = 0.2;
    this.maxScale = 4;
    this.initialScale = 1;

    // State signals
    this.scaleSignal = new Signal(this.initialScale);
    this.panSignal = new Signal({ x: 0, y: 0 });

    // Internal state for dragging
    this._isPanning = false;
    this._lastMouse = null;
    this._ctrlDown = false;

    // Bindings
    this._onWheel = this._onWheel.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

    // Setup DOM
    this._setupDOM();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attr) {
      case 'src':
        this.src = newValue;
        if (this.iframe) this.iframe.src = this.src;
        break;
      case 'width':
        this.width = parseInt(newValue, 10) || 800;
        if (this.container) this.container.style.width = `${this.width}px`;
        if (this.iframe) this.iframe.width = this.width;
        break;
      case 'height':
        this.height = parseInt(newValue, 10) || 600;
        if (this.container) this.container.style.height = `${this.height}px`;
        if (this.iframe) this.iframe.height = this.height;
        break;
      case 'min-scale':
        this.minScale = parseFloat(newValue) || 0.2;
        break;
      case 'max-scale':
        this.maxScale = parseFloat(newValue) || 4;
        break;
      case 'initial-scale':
        this.initialScale = parseFloat(newValue) || 1;
        this.scaleSignal.value = this.initialScale;
        break;
    }
  }

  connectedCallback() {
    this._addListeners();
    this._refresh();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  _setupDOM() {
    // Clean up
    this.shadowRoot.innerHTML = '';

    // Styles: Hide scrollbars of iframe, host is display:inline-block
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        user-select: none;
        -webkit-user-select: none;
        position: relative;
      }
      .frame-container {
        width: ${this.width}px;
        height: ${this.height}px;
        overflow: hidden;
        position: relative;
            background-color: #f1e9d4;

        border-radius: 4px;
        box-shadow: 0 2px 10px #0004;
      }
      iframe {
        border: none;
        position: absolute;
        left: 0; top: 0; right: 0; bottom: 0;
        pointer-events: auto;
        background: #fff;
        /* Hide scrollbars for most browsers */
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      iframe::-webkit-scrollbar {
        display: none !important;
      }
      .overlay {
        position: absolute;
        left: 0; top: 0; right: 0; bottom: 0;
        cursor: grab;
        z-index: 10;
        /* Transparent hit layer */
      }
      .overlay.panning {
        cursor: grabbing;
      }
    `;

    // Container for pan/zoom
    const container = document.createElement('div');
    container.className = 'frame-container';
    container.style.width = `${this.width}px`;
    container.style.height = `${this.height}px`;

    // Iframe
    const iframe = document.createElement('iframe');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('frameborder', '0');
    iframe.src = this.src;
    iframe.width = this.width;
    iframe.height = this.height;
    iframe.style.display = 'block';
    iframe.style.position = 'absolute';
    iframe.style.left = '0';
    iframe.style.top = '0';

    // Overlay for capturing mouse events (so iframe doesn't eat input)
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    container.appendChild(iframe);
    container.appendChild(overlay);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    // Save refs
    this.container = container;
    this.iframe = iframe;
    this.overlay = overlay;
  }

  _addListeners() {
    // Mouse events for pan/zoom
    this.overlay.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
    this.overlay.addEventListener('wheel', this._onWheel, { passive: false });

    // Track CTRL for panning
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);

    // Signals: react to pan/zoom changes
    this.unsubscribePan = this.panSignal.subscribe(() => this._refresh());
    this.unsubscribeZoom = this.scaleSignal.subscribe(() => this._refresh());
  }

  _removeListeners() {
    this.overlay.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    this.overlay.removeEventListener('wheel', this._onWheel);

    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);

    if (this.unsubscribePan) this.unsubscribePan();
    if (this.unsubscribeZoom) this.unsubscribeZoom();
  }

  // ---- PAN & ZOOM EVENTS ----
  _onMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse
    if (!this._ctrlDown) return; // Only pan with CTRL
    this._isPanning = true;
    this.overlay.classList.add('panning');
    this._lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }

  _onMouseMove(e) {
    if (!this._isPanning) return;
    const dx = e.clientX - this._lastMouse.x;
    const dy = e.clientY - this._lastMouse.y;
    this.panBy(dx, dy);
    this._lastMouse = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }

  _onMouseUp(e) {
    if (!this._isPanning) return;
    this._isPanning = false;
    this.overlay.classList.remove('panning');
    e.preventDefault();
  }

  _onWheel(e) {
    if (e.ctrlKey) {
      // Zoom with wheel (prevent browser zoom)
      e.preventDefault();
      let delta = (e.deltaY < 0) ? 0.1 : -0.1;
      this.zoomBy(delta, { x: e.offsetX, y: e.offsetY });
    }
    // Otherwise allow normal scrolling (if any)
  }

  _onKeyDown(e) {
    if (e.key === 'Control') this._ctrlDown = true;
  }
  _onKeyUp(e) {
    if (e.key === 'Control') this._ctrlDown = false;
  }

  // ---- EXPOSED PUBLIC API ----

  /**
   * Pan by dx, dy (in pixels, screen coords)
   */
  panBy(dx, dy) {
    this.panSignal.update(({ x, y }) => {
      const newPan = { x: x + dx, y: y + dy };
      this.dispatchEvent(new CustomEvent('pan', { detail: newPan }));
      return newPan;
    });
  }

  /**
   * Set pan to x, y
   */
  setPan(x, y) {
    this.panSignal.value = { x, y };
    this.dispatchEvent(new CustomEvent('pan', { detail: { x, y }}));
  }

  /**
   * Zoom by delta (positive for zoom in, negative for zoom out).
   * Optionally center zoom on a point (relative to frame).
   */
  zoomBy(delta, center = { x: this.width/2, y: this.height/2 }) {
    let targetScale = Math.max(this.minScale, Math.min(this.maxScale, this.scaleSignal.value + delta));
    // Pan so zoom is centered at mouse
    let { x, y } = this.panSignal.value;
    const prevScale = this.scaleSignal.value;
    if (targetScale !== prevScale) {
      // Adjust pan so the zoom focus point stays under the mouse
      x = (x - center.x) * (targetScale / prevScale) + center.x;
      y = (y - center.y) * (targetScale / prevScale) + center.y;
      this.panSignal.value = { x, y };
    }
    this.scaleSignal.value = targetScale;
    this.dispatchEvent(new CustomEvent('zoom', { detail: targetScale }));
  }

  /**
   * Set zoom to scale (number)
   */
  setZoom(scale) {
    scale = Math.max(this.minScale, Math.min(this.maxScale, scale));
    this.scaleSignal.value = scale;
    this.dispatchEvent(new CustomEvent('zoom', { detail: scale }));
  }

  // ---- UI UPDATE ----
  _refresh() {
    // Set transform on iframe for pan and zoom
    const scale = this.scaleSignal.value;
    const { x, y } = this.panSignal.value;
    this.iframe.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    this.iframe.style.transformOrigin = 'top left';
    // container width/height remain constant
  }

  // --- PROPERTY ACCESSORS for pan/zoom (optional) ---
  get pan() {
    return this.panSignal.value;
  }
  set pan(val) {
    this.setPan(val.x, val.y);
  }
  get zoom() {
    return this.scaleSignal.value;
  }
  set zoom(val) {
    this.setZoom(val);
  }
}

customElements.define('pan-zoom-frame', PanZoomFrame);
