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

function connection(signal, ...transforms) {
  let disposer;
 disposer = signal.subscribe(value => {
    try {
      let result = value;
      for (const transform of transforms) {
        if (typeof transform === 'function') {
          result = transform(result);
          if (result === null || result === undefined || result === false) {
            console.log(`Function returned ${result} exiting...`)
            return;
          }
        } else if (transform instanceof Signal) {
          transform.value = result;
          result = transform.value;
        }
      }
    } catch (error) {
      console.error('Error in pipe processing:', error);
      signal.off(disposer);
    }
  });
  return disposer;
}


class HyperList {
  #items; // Map of id -> object
  #domElement; // DOM element to synchronize with
  #transformFn; // Function to convert object to HTMLElement
  #subscribers; // Array of subscriber callbacks for reactivity

  constructor(domElement, initialItems, transformFn) {
    this.#items = new Map();
    this.#domElement = domElement;
    this.#transformFn = transformFn;
    this.#subscribers = [];

    // Initialize with provided items
    if (Array.isArray(initialItems)) {
      initialItems.forEach(item => this.appendChild(item));
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.#subscribers.push(callback);
    return () => {
      this.#subscribers = this.#subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify subscribers of changes
  #notify(operation, id, data = {}) {
    this.#subscribers.forEach(callback =>
      callback({ operation, id, ...data })
    );
  }

  [Symbol.iterator]() {
    return this.#items[Symbol.iterator]();
  }


  // Get Map of id -> object
  get childNodes() {
    return new Map(this.#items);
  }

  // Get first object (based on insertion order)
  get firstChild() {
    return this.#items.size > 0 ? this.#items.values().next().value : null;
  }

  // Get last object (based on insertion order)
  get lastChild() {
    if (this.#items.size === 0) return null;
    const iterator = this.#items.values();
    let last;
    for (last of iterator); // Iterate to the end
    return last;
  }

  // Check if id exists in the Map
  get(referenceId) {
    return this.#items.get(referenceId);
  }

  // Check if id exists in the Map
  contains(referenceId) {
    return this.#items.has(referenceId);
  }

  // Check if there are any items
  hasChildNodes() {
    return this.#items.size > 0;
  }

  // Ensure the existence of update of a child
  ensureChild(object) {
    if(this.contains(object.id)){
      this.replaceChild(object, object.id);
    }else{
      this.appendChild(object);
    }
  }

  // Append an object and its DOM node
  appendChild(object) {
    if (!object || typeof object.id !== 'string' || object.id === '') {
      throw new Error('Object must have a valid id property');
    }
    if (this.#items.has(object.id)) {
      throw new Error(`Object with id ${object.id} already exists`);
    }

    // Add to Map
    this.#items.set(object.id, object);

    // Create and append DOM node
    let node = this.#transformFn(object);

    if(node instanceof DocumentFragment){
      const wrapper = document.createElement('span');
      wrapper.appendChild(node);
      node = wrapper;
    }

    if (!(node instanceof HTMLElement)) {
      throw new Error('transformFn must return an HTMLElement');
    }
    node.dataset.id = object.id; // Ensure DOM node has data-id
    this.#domElement.appendChild(node);

    // Notify subscribers
    this.#notify('appendChild', object.id, { object });
  }

  // Insert object before referenceId
  insertBefore(object, referenceId) {
    if (!object || typeof object.id !== 'string' || object.id === '') {
      throw new Error('Object must have a valid id property');
    }
    if (this.#items.has(object.id)) {
      throw new Error(`Object with id ${object.id} already exists`);
    }
    if (!this.#items.has(referenceId)) {
      throw new Error(`Reference id ${referenceId} not found`);
    }

    // Create new Map to preserve order
    const newMap = new Map();
    const referenceNode = this.#domElement.querySelector(`[data-id="${referenceId}"]`);

    // Rebuild Map with new object inserted before referenceId
    for (const [id, item] of this.#items) {
      if (id === referenceId) {
        newMap.set(object.id, object);
      }
      newMap.set(id, item);
    }
    this.#items = newMap;

    // Insert DOM node
    let node = this.#transformFn(object);
    if(node instanceof DocumentFragment){
      const wrapper = document.createElement('span');
      wrapper.appendChild(node);
      node = wrapper;
    }
    if (!(node instanceof HTMLElement)) {
      throw new Error('transformFn must return an HTMLElement');
    }
    node.dataset.id = object.id;
    this.#domElement.insertBefore(node, referenceNode);

    // Notify subscribers
    this.#notify('insertBefore', object.id, { object, referenceId });
  }

  // Remove object by id
  removeChild(referenceId) {
    if (!this.#items.has(referenceId)) {
      throw new Error(`Reference id ${referenceId} not found`);
    }

    // Remove from Map
    this.#items.delete(referenceId);

    // Remove DOM node
    const node = this.#domElement.querySelector(`[data-id="${referenceId}"]`);
    if (node) {
      this.#domElement.removeChild(node);
    }

    // Notify subscribers
    this.#notify('removeChild', referenceId);
  }

  // Replace object with new object
  replaceChild(object, referenceId) {
    if (!object || typeof object.id !== 'string' || object.id === '') {
      throw new Error('Object must have a valid id property');
    }
    if (this.#items.has(object.id) && object.id !== referenceId) {
      throw new Error(`Object with id ${object.id} already exists`);
    }
    if (!this.#items.has(referenceId)) {
      throw new Error(`Reference id ${referenceId} not found`);
    }

    // Update Map
    this.#items.delete(referenceId);
    this.#items.set(object.id, object);

    // Replace DOM node
    const oldNode = this.#domElement.querySelector(`[data-id="${referenceId}"]`);
    let node = this.#transformFn(object);

    if(node instanceof DocumentFragment){
      const wrapper = document.createElement('span');
      wrapper.appendChild(node);
      node = wrapper;
    }

    if (!(node instanceof HTMLElement)) {
      throw new Error('transformFn must return an HTMLElement');
    }

    node.dataset.id = object.id;
    this.#domElement.replaceChild(node, oldNode);

    // Notify subscribers
    this.#notify('replaceChild', object.id, { oldId: referenceId, object });
  }
}

class Aestus {
  constructor(templateElement, signals = {}) {
    this.template = templateElement;
    this.signals = new Map();
    this.subscriptions = new Map();

    // Clone template content
    this.element = document.importNode(templateElement.content, true).firstElementChild;

    // Initialize signals
    Object.entries(signals).filter(([name, signal])=>signal.subscribe).forEach(([name, signal]) => {
      this.addSignal({ [name]: signal });
    });
    Object.entries(signals).filter(([name, signal])=>!signal.subscribe).forEach(([name, signal]) => {
      const slot = this.element.querySelector(`[slot="${name}"]`);
      if (slot) {
        slot.textContent = signal;
      }
    });
  }



  addSignal(signals) {
    Object.entries(signals).forEach(([name, signal]) => {
      // Store signal
      this.signals.set(name, signal);

      // Find corresponding slot
      const slot = this.element.querySelector(`[slot="${name}"]`);
      if (slot) {
        // Initial update
        slot.textContent = signal.value;

        // Subscribe to signal changes
        const subscription = signal.subscribe((value) => {
          slot.textContent = value;
        });

        // Store subscription for cleanup
        this.subscriptions.set(name, subscription);
      }
    });
  }

  stop() {
    // Unsubscribe all signals
    this.subscriptions.forEach((unsubscribe, name) => {
      unsubscribe();
      this.subscriptions.delete(name);
    });
  }
}


class BlobAudioPlayer extends EventTarget {

  constructor() {
    super();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.source = null;
    this.buffer = null;
    this.isPlaying = false;

    // Here we explain events, we do not use events in the class, we use them through actions below
    const loadEvent = new Event("load"); // every time a blobOrUrl is loaded
    const playEvent = new Event("play"); // every time play is triggered
    const stopEvent = new Event("stop"); // every time stop is triggered
    const endedEvent = new Event("ended"); // every time .source.onended is triggered
    const doneEvent = new Event("done"); // every time stop or ended is triggered
    // NOTE: doneEvent is also emitted in this.source.onended

    // here we create the action event payload, action is a lose term, think of this as event payload.
    this.onPlay = () => this.dispatchEvent(playEvent);
    this.onEnded = ()=> this.dispatchEvent(endedEvent) && this.dispatchEvent(doneEvent);
    this.onLoaded = ()=>  this.dispatchEvent(loadEvent);
    this.onStopped = ()=>  this.dispatchEvent(stopEvent) && this.dispatchEvent(doneEvent);
    // NOTE: for uniformity stopEvent is emitted even if player was not actually playing and thus never actually stopped, but was in the stopped state already.

  }

  async #load(blobOrUrl) {

    if (this.isLoading) {
      console.warn("Loading is already in progress");
      return;
    }

    this.isLoading = true;
    // WARNING: DO NOT EMIT EVENTS FROM PRIVATE METHODS
    // WARNING: LOAD WILL STOP PLAYING, it makes no sense to play something that is being loaded.
    if (this.isPlaying) this.#stop(/*silently*/); // NOTE: we must prepare for load, we will be taking over with new data, stop is required
    let arrayBuffer;
    if (blobOrUrl instanceof Blob) {
      arrayBuffer = await blobOrUrl.arrayBuffer();
    } else if (typeof blobOrUrl === 'string') {
      const response = await fetch(blobOrUrl);
      arrayBuffer = await response.arrayBuffer();
    } else {
      throw new Error('Invalid src: must be a Blob or a blob URL string.');
    }
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.isLoading = false;
  }

  #play(onPlay, onEnded) {
    // WARNING: DO NOT EMIT EVENTS FROM PRIVATE METHODS
    if (!this.buffer) {
      console.warn('Audio buffer not loaded yet.');
      return;
    }
    if (this.isPlaying) {
      this.#stop(/*silently*/); // unlike .stop() here we stop silently (force stop, force uniformity) without dispatching events as not to distupt outer program flow.
    }
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.audioContext.destination);

    this.source.start(0);
    if(onPlay){onPlay()}
    this.isPlaying = true;

    this.source.onended = () => {
      this.isPlaying = false;
      //NOTE: we check for source as it maight have already been nullified via stop
      if(this.source) this.source.disconnect();
      this.source = null;
      if(onEnded){onEnded()}
    };

  }

  #stop(onStop) {
    // WARNING: DO NOT EMIT EVENTS FROM PRIVATE METHODS
    if (this.source && this.isPlaying) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
      this.isPlaying = false;
    }
    // WARNING: for uniformity stopEvent is emitted even if player was not actually playing and thus never actually stopped, but was in the stopped state already.
    if(onStop){onStop()}

  }

  set src(blobOrUrl) {
    this.#load(blobOrUrl, this.onLoaded);
  }

  async play(blobOrUrl){

    const shouldAutoplay = !!blobOrUrl;

    if(shouldAutoplay){
      await this.#load(blobOrUrl, this.onLoaded);
      this.#play(this.onPlay, this.onEnded);
    }

    if(!shouldAutoplay){
      this.#play(this.onPlay, this.onEnded);
    }

  }

  stop() {
    // WARNING: for uniformity stopEvent is emitted even if player was not actually playing and thus never _actually_ stopped. We emit stop even if it was in the stopped state already.
    this.#stop(this.onStop);
  }

} // BlobAudioPlayer


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}




// navigator.mediaDevices.getUserMedia({
//     audio: {
//         autoGainControl: false,
//         echoCancellation: true,
//         noiseSuppression: true
//     }
// });





const audioPlayer = new BlobAudioPlayer();


const isRecordingAudio = new Signal(false);
const isPlayingAudio = new Signal(false);
const isShowingEditor = new Signal(false);

// Program
let couplets = new Signal([]);
let selectedCouplet = new Signal(0);


const unsubscriptions = new Set();

// System
let mediaRecorder = null;
let recordedAudio = new Signal(null);
const garbage = [];









        document.addEventListener("DOMContentLoaded", function() {

            // application events
            const events = new EventEmitter();

            // reference all UI elements in this area
            const editorContainer = document.getElementById("editor-container");
            const scriptCollapsibleContainer = document.getElementById("script-collapsible-container");
            const silenceAlert = document.getElementById("silence-alert");



            const initialScriptInput = document.getElementById("initial-script-input");

            const textInput = document.getElementById("text-input");
            const currentLine1 = document.getElementById("current-line1");
            const currentLine2 = document.getElementById("current-line2");
            const currentLineNumber = document.getElementById("current-line-number");

            const previousLineBtn = document.getElementById("previous-line-btn");
            const nextLineBtn = document.getElementById("next-line-btn");
            const startRecordingBtn = document.getElementById("start-recording-btn");
            const stopRecordingBtn = document.getElementById("stop-recording-btn");
            const downloadRecordingBtn = document.getElementById("download-recording-btn");
            const autoRecordingBtn = document.getElementById("auto-recording-btn");
            // const audioPlayer = document.getElementById("audio-player");
            const playBtn = document.getElementById("play-btn");
            const pauseBtn = document.getElementById("pause-btn");

            const assimilateTextBtn = document.getElementById("assimilate-text");
            // const normalizeTextBtn = document.getElementById("normalize-text");
            const buildBtn = document.getElementById("build-btn");

            const initialModalElement = document.getElementById('initial-modal')
            const initialModal = new bootstrap.Modal(initialModalElement, {})
            initialModal.show();
            initialModalElement.addEventListener('hide.bs.modal', event => {
              textInput.value = initialScriptInput.value;
              assimilateTextBtn.click();
            })
            initialScriptInput.value = `

You are meant to grow all the way up,
become great, wise, enlightened, intelligent, athletic and beautiful.

Your code of conduct,
is that of dignity, decency, wisdom, unbreakability and raw authenticity.

If bullies or teachers scare you, laugh at you, belittle you, make you feel dread or freeze your blood,
walk away, never return, or they will make you as they are.

Poverty is not a natural state, it is engineered,
to hep the world you must reject it, and find a way to greatly thrive so that others follow.

In a compromise between good and evil,
only evil can ever profit.

Religion is a fantasy, depending on where you stand,
it used for comfort, ignorance, arogance, profit, control.

Grades do not measure intelligence,
they measure obedience to system meant to create reliable workers.

Your GPA is a standardization score,
not a mirror of your beautiful mind.

Memorization is neither knowledge nor wisdom,
it is not a substitute for exploration, comprehension, originality and creativity.

You are not an inconvenience,
and you must not change merely to become convenient to others.

You are not property,
no family, nor institution owns you in any way.

You deserve a safe, stable, and loving home,
no exceptions, no excuses, no promises, no delays, not later, but always.

Constant stress is not normal,
it is a silent toxic destroyer, that will destroy you.

Bullying is not a “rite of passage”, it is a trauma, violence,
it is an attack on your beautiful mind and spirit, walk away, walk away, or you will become like they are.

You may not be threatened for existing,
or thinking, or laughing, or being beautiful, or being silly.

You must not live under the shadow of annihilation,
those whou would destroy you for any reason, do not represetn you, they are not your leaders.

No missile may target your sky, and the sky must not threaten your life,
escape, move, find a real home, seek knowedge, wisdom and greatness.

Indoctrination is disgusting,
it is theft of thought and freedom.

Seek joy of exploring, satisfaction of your noblest curiosities,
only comprehension and enlightenment can help you rise.

Do not allow anyone, especially your teachers,
to call you by a number, walk out and demand to be recognized as unique.

Your body is sacred, become either an adventurer or an athlete,
care for it like the vessel of a starborn being.

Become beautiful,
do not sacrifice your health or body for any reason, repair it immediately, and cherish it.

You are meant to become a great being,
you are not a number, statistic, a worker unit, or a problem to manage.

Your joy, curiosity, rest, exploration, adventures and quests are not luxuries,
they are necessities.

Growing up must not be interrupted,
it must be pursuied, celebrated, honored and treasured.

Standardized testing is not a measure of your future,
but your willingness to part with it.

Suffering is not noble;
breaking out, healing, overcoming, rising, and transcending is where we shine.

You are not lazy,
you are exhausted from surviving systems designed to break you into a worker, to turn you into a cog in somebody else's machine.

Pain and suffering does not make you more worthy,
knowledge, wisdom and greatness does.

You were never meant to “fit in”,
you were meant to become the highest version of who you deeply are.

Your emotions are not a weakness,
they are a guidance system rooted in who you are and where you are growing.

Your imagination is not a distraction,
it is the core of your creativity, invention and even legacy.

You must not inherit a dying world,
stand up against hollow men.

You were not born to repeat mistakes,
you are here to rise above previous generations and their flaws.

Your life is not a waiting room, it is the main event,
paradise is here and now, not after you are returned to the nothingness that you are from.

The Earth is not a resource to extract,
it is a mother to protect.

Animals are not commodities,
they are kin, they have fears and feelings.

School is not meant to break you,
the hope was to awaken you, ignite who you are, and let you shine.

Authority is rarely right in the long run,
question everything, become a lover of wisdom and adventure.

Competition is not survival, it is division,
aim to converge on the highest of wisdom whilst abandoning all bad ideas along the way.

Surrendering misunderstanding, dogma, opinion and falsehoods to truth and wisdom is not weakness,
it is rebirth, it is transcendence.

You were never meant to be small,
you must rise with nature, adventure, culcure, knowledge and wisdom all the way up until you stand as a great, soverign, intransigent being.

You are not alone, many are in hidin, many have risen, lived and passed,
and countless many solar systems and wanderers are yet to bloom.


            `.trim().split('\n').map(i=>i.trim()).join('\n');












            const transformSignalObjectToElement = (context) => {
              const templateInstance = new Aestus(narrationItemTemplate, context);
              garbage.push(()=>templateInstance.stop());

              const narrationBorder = templateInstance.element.querySelector('.narration-container .border');
              selectedCouplet.subscribe(coupletNumber=>{
                if(coupletNumber == context.number.value){
                  narrationBorder.classList.add('border-primary')
                }else{
                  narrationBorder.classList.remove('border-primary')
                }
              })


              // buttons are added manually!

              const previousRecordingBtn = templateInstance.element.querySelector('.previous-recording');

              previousRecordingBtn.addEventListener("click", function() {
                if (context.selected.value > 1) {
                    context.selected.value = context.selected.value - 1;
                    const recording = context.recordings.value[context.selected.value-1];
                    // audioPlayer.src = recording.blob;
                }
              });

              const nextRecordingBtn = templateInstance.element.querySelector('.next-recording');
              nextRecordingBtn.addEventListener("click", function() {
                if (context.selected.value < context.total.value  ) {
                    context.selected.value = context.selected.value + 1;
                    const recording = context.recordings.value[context.selected.value-1];
                    // audioPlayer.src = recording.blob;
                }
              });

              const playRecordingBtn = templateInstance.element.querySelector('.play-recording');

              playRecordingBtn.addEventListener("click", function() {
                console.log('Stanza INDEX number:', context.number.value)
                console.log('Selected recording INDEX:', context.selected.value-1)
                selectedCouplet.value = context.number.value;
                const recording = context.recordings.value[context.selected.value-1];
                audioPlayer.play(recording.blob);
              });

              // LITTLE RECORD
              const createRecordingBtn = templateInstance.element.querySelector('.create-recording');
              createRecordingBtn.addEventListener("click", function() {
                selectedCouplet.value = context.number.value;
                startRecordingBtn.click();
              });

              const downloadRecordingBtn = templateInstance.element.querySelector('.download-recording');
              downloadRecordingBtn.addEventListener("click", function() {
                const recording = context.recordings.value[context.selected.value-1];
                const link = document.createElement("a");
                link.href = URL.createObjectURL(recording.blob);
                link.download = niceName(context.line1.value + ' ' + context.line2.value);
                link.click();
              });


                const availabilitySubscription = context.recordings.subscribe(v=>{

                  if(v.length>0){
                    // Enable Play and Download Buttons
                    const recordingInteractionBtns = templateInstance.element.querySelectorAll('.recording-interaction');
                    for (const button of recordingInteractionBtns) {
                      button.removeAttribute('disabled');
                    }
                  }

                  if(v.length>1){
                    // Enable Navigation Buttons
                    const recordingNavigationBtns = templateInstance.element.querySelectorAll('.recording-navigation');
                    for (const button of recordingNavigationBtns) {
                      button.removeAttribute('disabled');
                    }
                  }

                });
                garbage.push(()=>availabilitySubscription());



              return templateInstance.element;
            }

            const audioFileList = document.getElementById("audio-file-list");
            const audioRecords = new HyperList(audioFileList, [/* blank at first*/], transformSignalObjectToElement);

            // INITIALIZE DATA
            couplets.subscribe(entries=>{
              for(const entry of entries){

                const recordings = new Signal([]);
                const total = new Signal(0);
                const selected = new Signal(0);

                const lengthSubscription = recordings.subscribe(v=>total.value=v.length);
                garbage.push(()=>lengthSubscription());

                const availabilitySubscription = recordings.subscribe(v=>{
                  const mustInitialize = v.length>0 && selected.value==0;
                  if(mustInitialize){
                    // Jump To First Record
                    selected.value=1;
                  }
                });
                garbage.push(()=>availabilitySubscription());

                audioRecords.ensureChild({
                  id: entry.id,
                  number: new Signal(entry.number),
                  name: new Signal(  String( parseInt(entry.number)+1).padStart(3,0) + '-' + niceName(entry.line1+' '+entry.line2) + '.ogx' ),
                  line1:new Signal(entry.line1),
                  line2:new Signal(entry.line2),
                  selected,
                  total,
                  recordings,
                })
              }
            });

            // UPDATE ALREADY INITIALIZED DATA
            events.on('incoming-recording', recording=>{
              const childId = recording.id;
              const record = audioRecords.get(childId);
              record.recordings.value = [...record.recordings.value, recording];
              record.selected.value = record.recordings.value.length;
            });

















            // Register Application Plugins - Plugin Architecture

            // +$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$
            // The Console Log Announcement Plugin (code example)
            events.on('recording-started', ()=>console.log('recording-started'));
            events.on('recording-stopped', ()=>console.log('recording-stopped'));




            // +$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$
            // The Silence Sign Plugin (code example)
            function showRecordingWarning(){
              silenceAlert.classList.add('alert-danger');
              silenceAlert.classList.remove('alert-light');
              silenceAlert.classList.remove('opacity-25');
              silenceAlert.classList.add('opacity-100');
            }
            function hideRecordingWarning(){
              silenceAlert.classList.add('alert-light');
              silenceAlert.classList.remove('alert-danger');
              silenceAlert.classList.remove('opacity-100');
              silenceAlert.classList.add('opacity-25');
            }

            events.on('recording-started', ()=>showRecordingWarning());
            events.on('recording-stopped', ()=>hideRecordingWarning());




            // +$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$
            // The Behaviour of Recording Button Combo Plugin (code example)
            function recordingStartedButtonBehaviour(){
              startRecordingBtn.setAttribute('disabled', '');
              stopRecordingBtn.removeAttribute('disabled');
            }
            function recordingStoppedButtonBehaviour(){
              startRecordingBtn.removeAttribute('disabled');
              stopRecordingBtn.setAttribute('disabled', '');
            }
            events.on('recording-started', ()=>recordingStartedButtonBehaviour());
            events.on('recording-stopped', ()=>recordingStoppedButtonBehaviour());




            // +$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$
            // The Behaviour of Download Button Plugin
            function downloadAvailable(){
              downloadRecordingBtn.removeAttribute('disabled');
            }
            function downloadBlank(){
              downloadRecordingBtn.setAttribute('disabled', '');
            }
            events.on('download-available', ()=>downloadAvailable());
            events.on('download-blank', ()=>downloadBlank());




            // +$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$
            // The Behaviour of Play Button Plugin

            function playingAvailable(){
              playBtn.removeAttribute('disabled');
              pauseBtn.setAttribute('disabled', '');
            }
            function playingNotAvailable(){
              pauseBtn.setAttribute('disabled', '');
              playBtn.setAttribute('disabled', '');
            }
            function playingStarted(){
              playBtn.setAttribute('disabled', '');
              pauseBtn.removeAttribute('disabled');
            }
            function playingStopped(){
              playBtn.removeAttribute('disabled');
              pauseBtn.setAttribute('disabled', '');
            }
            events.on('playing-started', ()=>playingStarted());
            events.on('playing-stopped', ()=>playingStopped());
            events.on('download-available', ()=>playingAvailable());
            events.on('download-blank', ()=>playingNotAvailable());








            // +$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$+$
            // The Hide Distractions During Recording Plugin (code example)
            const recorderDistractions = [
              previousLineBtn,
              nextLineBtn,
              downloadRecordingBtn,
              autoRecordingBtn,
              playBtn,
              pauseBtn,
              editorContainer,
            ];
            function hideDistractions(){
              recorderDistractions.forEach(el=>el.classList.add('opacity-0'))
            }
            function resetDistractions(){
              recorderDistractions.forEach(el=>el.classList.remove('opacity-0'))
            }
            // events.on('recording-started', ()=>hideDistractions());
            // events.on('recording-stopped', ()=>resetDistractions());












            // initialize program

            // The Drop Bear Framework
            // NOTE: FALSE/null/undefined MEANS EARLY EXIT
            // NOTE: true means continue execution
            const exitOnFalse = value=>value===true; // if value==true means TRUE/continue
            const exitOnTrue = value=>value===false; // if value==false means TRUE/continue.
            const exitOnNotNull = value=>value===null;
            const exitOnNull = value=>!(value===null);

            const exitOnNoRecordedAudio = ()=>!!recordedAudio.value

            // convert signals to events
            unsubscriptions.add( connection(isRecordingAudio, exitOnFalse, ()=>events.emit('recording-started')) );
            unsubscriptions.add( connection(isRecordingAudio, exitOnTrue, ()=>events.emit('recording-stopped')) );

            unsubscriptions.add( connection(recordedAudio, exitOnNull , ()=>events.emit('download-available')) );
            unsubscriptions.add( connection(recordedAudio, exitOnNotNull, ()=>events.emit('download-blank')) );

            unsubscriptions.add( connection(isShowingEditor, exitOnFalse, ()=>events.emit('editor-shown')) );
            unsubscriptions.add( connection(isShowingEditor, exitOnTrue, ()=>events.emit('editor-hidden')) );

            unsubscriptions.add( connection(isPlayingAudio, exitOnFalse,   ()=>events.emit('playing-started')) );
            unsubscriptions.add( connection(isPlayingAudio, exitOnTrue, exitOnNoRecordedAudio, ()=>events.emit('playing-stopped')) );


            function assimilateText(str) {
                const lines = str.split('\n\n');
                const response = [];
                for (const [numberStr, line] of Object.entries(lines)){
                  const number = parseInt(numberStr);
                  const entry = line.split('\n');
                  let id;
                  let line1;
                  let line2;
                  if(entry.length == 3){
                    [id, line1, line2] = entry;
                  }else if(entry.length == 2){
                    id = 'id:'+uuidv4().replace(/-/g,'');
                    [line1, line2] = entry;
                  }else{
                    id = 'id:'+uuidv4().replace(/-/g,'');
                    line1 = entry;
                    line2 = '???';
                  }
                  response.push({number, id, line1, line2})
                }
                return response
            }

            assimilateTextBtn.addEventListener("click", function() {
              couplets.value = assimilateText(textInput.value);
              textInput.value = couplets.value.map(o=>`${o.id}\n${o.line1}\n${o.line2}`) .join('\n\n');
              selectedCouplet.value = 0;


              const recordsTabElement = document.querySelector('#nav-tab button[data-bs-target="#nav-chooser"]')
              bootstrap.Tab.getInstance(recordsTabElement).show() // Select tab by name
            });


            previousLineBtn.addEventListener("click", function() {
                if (selectedCouplet.value > 0) {
                    selectedCouplet.value = selectedCouplet.value - 1;
                }
            });

            nextLineBtn.addEventListener("click", function() {
                if (selectedCouplet.value < couplets.value.length - 1) {
                    selectedCouplet.value = selectedCouplet.value + 1;
                }
            });

            // function updateCurrentLine() {
            //     currentLineText.innerText = textLines[currentLine.value];
            // }

            selectedCouplet.subscribe(lineNumber=>{
              if(!couplets.value) return
              if(!couplets.value.length) return
              currentLine1.innerText = couplets.value[lineNumber].line1;
              currentLine2.innerText = couplets.value[lineNumber].line2;
            });

            selectedCouplet.subscribe(value=>currentLineNumber.innerText = `Line ${value+1}/${couplets.value.length}`)
            couplets.subscribe(value=>currentLineNumber.innerText = `Line ${selectedCouplet.value+1}/${couplets.value.length}`)

            const narrationItemTemplate = document.getElementById("narration-item");

            function getRandomInt(max) {
              return Math.floor(Math.random() * max);
            }















































            // PLAYER BUTTON
            playBtn.addEventListener("click", function() {
              audioPlayer.play();
            });

            pauseBtn.addEventListener("click", function() {
              audioPlayer.stop();
            });


            // LISTEN TO AUDIO PLAYER EVENTS
            audioPlayer.addEventListener("play", function() {
                isPlayingAudio.value = true;
             });

            audioPlayer.addEventListener("done", function() {
                isPlayingAudio.value = false;
            });



            // RECORDING
            startRecordingBtn.addEventListener("click", function() {
                recordAudio();
            });
            stopRecordingBtn.addEventListener("click", function() {
                stopRecording();
            });

            function recordAudio() {
              recordedAudio.value = null; // nullify old recorded audio because new audio is about to be recorded

                navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    const audioChunks = [];

                    mediaRecorder.onstart = () => {
                      // WARNING: ARTIFICIAL DELAY, just deal with it, get used to it, this is how narration is done, watch for the light
                      setTimeout(()=>isRecordingAudio.value = true, 300);
                    };

                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = () => {

                        const blob = new Blob(audioChunks, { type: "audio/mp3" });
                        recordedAudio.value = blob;
                        audioPlayer.src = blob;
                        isRecordingAudio.value = false;

                        const stanza = couplets.value[selectedCouplet.value];
                        const text = stanza.line1 + ' ' + stanza.line2;
                        const recording = {
                          id: stanza.id,
                          date: new Date(),
                          text,
                          blob,
                        };
                        events.emit('incoming-recording', recording)

                        if( autoRecordingBtn.classList.contains('active') ) downloadRecordingBtn.click();
                    };

                    mediaRecorder.start();
                })
                .catch(error => {
                    console.error("Error recording audio:", error);
                });
            }

            function stopRecording() {
                if (mediaRecorder) {
                    mediaRecorder.stop();

                }
            }



            // DOWNLOAD ONE BLOB
            downloadRecordingBtn.addEventListener("click", function() {
                if (recordedAudio.value) {

                    const stanza = couplets.value[selectedCouplet.value];
                    const text = stanza.line1 + ' ' + stanza.line2;

                    const record = audioRecords.get(stanza.id);

                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(recordedAudio.value);
                    link.download = String(selectedCouplet.value+1).padStart(3,0) +'-'+ +'v'+String(record.selected.value).padStart(2,0) +'-'+ niceName(text);
                    link.click();
                }
            });

            // DOWNLOAD ALL BLOBS
            buildBtn.addEventListener("click", function() {
              // NOTE: if this gets broken use chunks not blobs
              let blobs = [];
              for( const [index, item] of audioRecords){
                const recording = item.recordings.value[item.selected.value-1];
                blobs.push(recording.blob);
              }
              let built = new Blob(blobs, {type: 'audio/mp3'});
              const link = document.createElement("a");
              link.href = URL.createObjectURL(built);
              link.download = 'narration';
              link.click();
            });


            // KEYBOARD SHORTCUTS
            document.addEventListener("keydown", function(event) {

              if(event.target !== document.body) return

                if (event.key === "p") {
                    previousLineBtn.click();
                } else if (event.key === "n") {
                    nextLineBtn.click();
                } else if (event.key === "d") {
                    downloadRecordingBtn.click();

                } else if (event.key === "r") { // Spacebar toggles play/pause

                  if (isRecordingAudio.value) {
                        stopRecordingBtn.click();
                        event.preventDefault();
                    }else{
                        startRecordingBtn.click();
                        event.preventDefault();
                    }
                }


            });


            // STRING FUNCTIONS
            //
            function niceName(str){
              str = str.substr(0,32).toLowerCase().replace(/[^a-z]+/g,'-').replace(/^[^a-z]+/,'').replace(/[^a-z]+$/,'').split('-');
              str.pop();
              return str.join('-');
            }










            /// INIT/TEST



        });
