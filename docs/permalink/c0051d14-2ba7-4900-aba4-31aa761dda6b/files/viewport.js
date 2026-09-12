

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


class PanZoom extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'zoom', 'left', 'top', 'min-zoom', 'max-zoom'];
  }

  #iframe;
  #zoom = new Signal(1);
  #left = new Signal(0);
  #top = new Signal(0);
  #minZoom = 0.1;
  #maxZoom = 10;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.#iframe = document.createElement('iframe');
    this.#iframe.style.border = 'none';
    this.#iframe.style.width = '100%';
    this.#iframe.style.height = '100%';
    this.#iframe.style.transformOrigin = 'top left';
    this.#iframe.style.pointerEvents = 'auto';

    const style = document.createElement('style');
    style.textContent = `
      :host {
      border: 5px solid red;
        display: block;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
      }
      iframe {
        border: 5px solid green;
        position: absolute;
        top: 0;
        left: 0;

      }
    `;

    this.shadowRoot.append(style, this.#iframe);

    this.#zoom.subscribe(() => this.#applyTransform());
    this.#left.subscribe(() => this.#applyTransform());
    this.#top.subscribe(() => this.#applyTransform());

    this.#attachPanZoomEvents();
  }

  connectedCallback() {

    this.#applyAttributes();
    this.#applyTransform();

    // const ro = new ResizeObserver(entries => {
    //   for (let entry of entries) {
    //     const { width, height } = entry.contentRect;
    //     this.#iframe.style.width = `${width}px`;
    //     this.#iframe.style.height = `${height}px`;
    //   }
    // });

    // ro.observe(this);

    // const width = `${this.getBoundingClientRect().width}px`;
    // const height = `${this.getBoundingClientRect().height}px`;
    // console.log(width, height);
    // this.#iframe.style.width = width;
    // this.#iframe.style.height = height;

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
    if (this.hasAttribute('src')) this.#iframe.src = this.getAttribute('src');
    if (this.hasAttribute('zoom')) this.#zoom.value = parseFloat(this.getAttribute('zoom'));
    if (this.hasAttribute('left')) this.#left.value = parseFloat(this.getAttribute('left'));
    if (this.hasAttribute('top')) this.#top.value = parseFloat(this.getAttribute('top'));
    if (this.hasAttribute('min-zoom')) this.#minZoom = parseFloat(this.getAttribute('min-zoom'));
    if (this.hasAttribute('max-zoom')) this.#maxZoom = parseFloat(this.getAttribute('max-zoom'));
  }

  #applyTransform() {
    const scale = this.#zoom.value;
    const x = this.#left.value;
    const y = this.#top.value;

    this.#iframe.style.scale = scale;
    this.#iframe.style.left = `${x}px`;
    this.#iframe.style.top = `${y}px`;
  }

  #attachPanZoomEvents() {
    let lastX = 0;
    let lastY = 0;
    let isDragging = false;

    // this.#iframe.addEventListener('load', () => {
    //   this.#iframe.contentWindow.addEventListener('blur', () => {
    //     console.log('contentWindow blur')
    //     this.#iframe.blur();
    //   });
    // });

    const specialOn = () => {
      console.log('specialOn');
         this.#iframe.style.pointerEvents = 'none';
    }
    const specialOff = () => {
      console.log('specialOff');
         this.#iframe.style.pointerEvents = 'auto';

    }

    // Add event listeners to document to handle Shift focus adjustments
     document.addEventListener("keydown", (e) => {
       if (e.key === 'Shift') {
         specialOn()
         // this.#iframe.style.pointerEvents = 'none';
         // console.log(`pointerEvents set to 'none' to prevent iframe taking focus`);
         // this.#iframe.blur();
       }
     });

     document.addEventListener("keyup", (e) => {
       if (e.key === 'Shift') {
         specialOff()
         // this.#iframe.style.pointerEvents = 'auto';
         // console.log(`pointerEvents reset to 'auto'`);
       }
     });

     window.addEventListener('message', (e) => {
       console.log('mess', e)
       if (e.data && e.data.type === 'special-on') {
         specialOn()
       }
     });
     window.addEventListener('message', (e) => {
       console.log('mess', e)
       if (e.data && e.data.type === 'special-off') {
         specialOff()
       }
     });


    // document.addEventListener("keydown", (e)=>{
    //   if (e.shiftKey){
    //    this.#iframe.style.pointerEvents = 'none';
    //    console.log(`pointerEvents = 'none'`)
    //   }

    // });
    // document.addEventListener("keyup", (e)=>{
    //   if (e.key == 'Shift'){
    //    this.#iframe.style.pointerEvents = 'auto';
    //    console.log(`pointerEvents = 'auto'`)
    //   }

    // });




    this.addEventListener('wheel', (e) => {
      if (!e.shiftKey) return;
      e.preventDefault();

      const delta = (e.deltaY < 0) ? 0.1 : -0.1;
      const center = { x: e.offsetX, y: e.offsetY };


      const newZoom = Math.min(this.#maxZoom, Math.max(this.#minZoom, this.#zoom.value + delta));

       // Adjust pan so the zoom focus point stays under the mouse
       const prevZoom = this.#zoom.value;
       if (newZoom !== prevZoom) {
         const rect = this.#iframe.getBoundingClientRect();
         const currentX = this.#left.value;
         const currentY = this.#top.value;

         // Calculate new left and top
         const newX = (currentX - center.x) * (newZoom / prevZoom) + center.x;
         const newY = (currentY - center.y) * (newZoom / prevZoom) + center.y;

         this.#left.value = newX;
         this.#top.value = newY;
         this.#zoom.value = newZoom;
       }




    }, { passive: false });









    this.addEventListener('mousedown', (e) => {
      console.log('mousedown')
      if (!e.shiftKey) return;
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
      this.#left.value += dx;
      this.#top.value += dy;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
}

customElements.define('pan-zoom', PanZoom);
