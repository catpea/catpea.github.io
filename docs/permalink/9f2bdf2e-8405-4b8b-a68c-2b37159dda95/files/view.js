

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
    console.log(this.#value)
    this.#emitter.emit('change', this.#value);
  }
}





/**
 * Class representing coordinate transformations typically for graphical manipulations.
 */
class Magnification {
  /**
   * Scales coordinates by a specified magnification factor.
   * @param {number} factor - The magnification factor to scale the coordinates.
   * @param {number} x - The x-coordinate.
   * @param {number} [y] - The optional y-coordinate.
   * @returns {number | number[]} - The transformed coordinate(s).
   */
  static transformCoordinates(factor, x, y) {
    if (typeof factor !== 'number' || typeof x !== 'number' || (y !== undefined && typeof y !== 'number')) {
      throw new TypeError("All inputs must be numbers or 'y' can be omitted.");
    }

    return y !== undefined ? [x * factor, y * factor] : x * factor;
  }

  /**
   * Reverses the scaling transformation of coordinates by a specified magnification factor.
   * @param {number} factor - The magnification factor used previously to scale the coordinates.
   * @param {number} x - The x-coordinate.
   * @param {number} [y] - The optional y-coordinate.
   * @returns {number | number[]} - The reverse-transformed coordinate(s).
   */
  static reverseCoordinateTransform(factor, x, y) {
    if (typeof factor !== 'number' || typeof x !== 'number' || (y !== undefined && typeof y !== 'number')) {
      throw new TypeError("All inputs must be numbers or 'y' can be omitted.");
    }

    return y !== undefined ? [x / factor, y / factor] : x / factor;
  }
}




/**
 * Combines multiple signals into a single signal. The new signal’s value is an array of the values from the input signals.
 * This new signal updates whenever any of the input signals emit a new value.
 * @param {...Signal} signals - A list of Signal instances to combine.
 * @returns {Signal} - The combined signal.
 */
function combineLatest(...signals) {
  const combinedSignal = new Signal(signals.map(signal => signal.value));
  const subscriptions = [];

  signals.forEach((signal, index) => {
    const subscription = signal.subscribe(newValue => {
      // Update the combined signal value array at the specific index
      const values = combinedSignal.value;
      values[index] = newValue;
      combinedSignal.value = values.slice(); // Create a shallow copy to ensure change detection
    });
    subscriptions.push(subscription);
  });

  combinedSignal.subscribe = (callback) => {
    // Ensure the callback fires immediately with the current value
    const unsubscribeOriginal = Signal.prototype.subscribe.call(combinedSignal, callback);

    // Return a new unsubscribe function that unsubscribes from all original signals
    return () => {
      unsubscribeOriginal();
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  };

  return combinedSignal;
}




class PanZoom extends HTMLElement {

  static get observedAttributes() {
    return ['src', 'zoom', 'left', 'top', 'min-zoom', 'max-zoom'];
  }

  #specialMode = new Signal(false);

  #iframe;
  #specialToggleBtn;

  #width = new Signal(0);
  #height = new Signal(0);

  #zoom = new Signal(0);
  #left = new Signal(0);
  #top = new Signal(0);
  #position = new Signal(); // Atomic pair

  #minZoom = 0.1;
  #maxZoom = 10;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.importGlobalStyleSheets();


    this.#iframe = document.createElement('iframe');
    this.#iframe.style.border = 'none';
    this.#iframe.style.width = '100%';
    this.#iframe.style.height = '100%';
    this.#iframe.style.transformOrigin = 'top left';
    this.#iframe.style.pointerEvents = 'auto';

    this.#specialToggleBtn = document.createElement('button');
    this.#specialToggleBtn.id = 'specialToggleBtn';
    this.#specialToggleBtn.classList.add('btn', 'btn-success', 'btn-sm');
    this.#specialToggleBtn.innerText = 'Enable Pan Zoom Control';

    this.#specialToggleBtn.addEventListener('click', (e) => {
      this.#specialMode.value = !this.#specialMode.value;
    });

    this.#specialMode.subscribe(v=>{
      if(v===true){
        console.log('specialOn');
        this.#specialToggleBtn.innerText = 'Disable Pan Zoom Control';

        this.#specialToggleBtn.classList.toggle('btn-primary');
        this.#specialToggleBtn.classList.toggle('btn-success');
        this.#iframe.style.pointerEvents = 'none';
      }else{
        console.log('specialOff');
        this.#specialToggleBtn.innerText = 'Enable Pan Zoom Control';

        this.#specialToggleBtn.classList.toggle('btn-primary');
        this.#specialToggleBtn.classList.toggle('btn-success');
        this.#iframe.style.pointerEvents = 'auto';
      }
    })

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }

      iframe {
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
      }

      #specialToggleBtn {
        position: fixed;
        top: 0;
        left: 0;
      }
    `;

    this.shadowRoot.append(style,   this.#iframe, this.#specialToggleBtn,);


    this.#attachPanZoomEvents();
  }

  connectedCallback() {

  // Initialize upon connectedCallback;
  this.#width.value = this.clientWidth;
  this.#height.value = this.clientHeight;
  // Begin monitoring
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      this.#width.value = entry.contentRect.width;
      this.#height.value = entry.contentRect.height;
    }
  });
  resizeObserver.observe(this);

  //  Define Composite Signals
  const horizontal = combineLatest(this.#width, this.#zoom);
  const vertical   = combineLatest(this.#height, this.#zoom);


  // Scale The IFrame
  // Resize The Iframe To 100%
  horizontal.subscribe(([w,z]=v)=> this.#iframe.style.width=(w/z) + 'px')
  vertical.subscribe(([h,z]=v)=> this.#iframe.style.height=(h/z) + 'px')

  // Pan The IFrame
  // this.#position.subscribe( v => console.log('#POSITION', v, '*'));
  // this.#position.subscribe(([left,top]=v) => console.log('#POSITION RAW', { type: 'scroll-to', left, top }, '*'));
  this.#position.subscribe(([left,top]=v) => this.#iframe.contentWindow.postMessage({ type: 'scroll-to', left, top }, '*'));
  this.#zoom.subscribe(v => this.#iframe.style.scale = v );
  // this.#left.subscribe(value=>this.#iframe.contentWindow.postMessage({ type: 'scroll-left', value }, '*'));
  // this.#top.subscribe(value=>this.#iframe.contentWindow.postMessage({ type: 'scroll-top', value }, '*'));


  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'iframe-scroll'){
      //this.#left.value = e.data.left;
      //this.#top.value = e.data.top;
    }
  });

//     this.#applyAttributes();

  }

  attributeChangedCallback(name, _, newValue) {
    if (name === 'src') this.#iframe.src = newValue;
    if (name === 'zoom') this.#zoom.value = parseFloat(newValue || 1);
    if (name === 'left') this.#left.value = parseFloat(newValue || 0);
    if (name === 'top') this.#top.value = parseFloat(newValue || 0);
    if (name === 'min-zoom') this.#minZoom = parseFloat(newValue || 0.1);
    if (name === 'max-zoom') this.#maxZoom = parseFloat(newValue || 10);
  }

  #applyAttributes() {
    if (this.hasAttribute('src'))  this.#iframe.src = this.getAttribute('src');
    if (this.hasAttribute('zoom')) this.#zoom.value = parseFloat(this.getAttribute('zoom'));
    if (this.hasAttribute('left')) this.#left.value = parseFloat(this.getAttribute('left'));
    if (this.hasAttribute('top'))  this.#top.value = parseFloat(this.getAttribute('top'));
    if (this.hasAttribute('min-zoom')) this.#minZoom = parseFloat(this.getAttribute('min-zoom'));
    if (this.hasAttribute('max-zoom')) this.#maxZoom = parseFloat(this.getAttribute('max-zoom'));
  }

  #attachPanZoomEvents() {
    let lastX = 0;
    let lastY = 0;
    let isDragging = false;

    // Add event listeners to document to handle Shift focus adjustments
    document.addEventListener("keydown", (e) => {if (e.key === 'Shift') this.#specialMode.value = true});
    document.addEventListener("keyup", (e) => {if (e.key === 'Shift') this.#specialMode.value = false});
    window.addEventListener('message', (e) => { if (e.data && e.data.type === 'special-on') this.#specialMode.value = true });
    window.addEventListener('message', (e) => { if (e.data && e.data.type === 'special-off') this.#specialMode.value = false });

    // this.addEventListener('wheel', (e) => {
    //   if (!this.#specialMode.value === true) return;
    //   e.preventDefault();
    //   const zoomDelta = (e.deltaY < 0) ? 0.1 : -0.1;

    //   const oldScrollbarX = this.#left.value;
    //   const oldScrollbarY = this.#top.value;
    //   const oldZoom = this.#zoom.value;

    //   // NOTE: newScrollbarX and newScrollbarY are the distance that scrollbar has to move to reposition the same viewport area under cursor
    //   const newScrollbarX = ...
    //   const newScrollbarY = ...
    //   const newZoom = ...

    //   // NOTE: negative newX, newY is reset to 0 because we don't want browser viewport scrolling out of bounds
    //   this.#left.value = Math.max(0,newScrollbarX);
    //   this.#top.value  = Math.max(0,newScrollbarY);
    //   this.#zoom.value = newZoom;
    // }

    // }, { passive: false });


    this.addEventListener('wheel', (e) => {
      console.log('WHEEL!')
      if (this.#specialMode.value !== true) return;
      e.preventDefault();

      console.log('this.#zoom.value', this.#zoom.value)

      // Zoom delta
      const zoomDelta = (e.deltaY < 0) ? 0.1 : -0.1;
      const oldZoom = this.#zoom.value;
      // const newZoom = Math.max(0.1, oldZoom + zoomDelta); // Clamp to minimum zoom

      const newZoom = Math.min(this.#maxZoom, Math.max(this.#minZoom, this.#zoom.value + zoomDelta));


      // Mouse position in viewport coordinates
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      // Current scroll positions
      const oldScrollbarX = this.#left.value;
      const oldScrollbarY = this.#top.value;

      // The content position under the mouse before zoom
      const contentX = oldScrollbarX + mouseX / oldZoom;
      const contentY = oldScrollbarY + mouseY / oldZoom;

      // To keep that content point under the mouse after zoom:
      // newScrollbar + mousePos / newZoom = contentPos
      // => newScrollbar = contentPos - mousePos / newZoom

      const newScrollbarX = contentX - mouseX / newZoom;
      const newScrollbarY = contentY - mouseY / newZoom;

      this.#zoom.value = newZoom;
      this.#left.value = Math.max(0, newScrollbarX);
      this.#top.value  = Math.max(0, newScrollbarY);
      this.#position.value = [this.#left.value, this.#top.value];

    }, { passive: false });






    this.addEventListener('mousedown', (e) => {
      if (!this.#specialMode.value === true) return;
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      // this.#left.value -= (dx/this.#zoom.value);
      // this.#top.value -= (dy/this.#zoom.value);

      const newX = this.#left.value - (dx/this.#zoom.value);
      const newY = this.#top.value - (dy/this.#zoom.value);

      this.#left.value = Math.max(0, newX);
      this.#top.value = Math.max(0, newY);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

  } // #attachPanZoomEvents


  // HELPER



  importGlobalStyleSheets(){
    const globalSheets = Array.from(document.styleSheets)
    .map(x => {
      const sheet = new CSSStyleSheet();
      const css = Array.from(x.cssRules).map(rule => rule.cssText).join(' ');
      sheet.replaceSync(css);
      return sheet;
    });
    this.shadowRoot.adoptedStyleSheets.push(...globalSheets);
  }

}

customElements.define('pan-zoom', PanZoom);
