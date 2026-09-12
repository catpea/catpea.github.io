export class Pulse {
  #value;
  #subscribers;
  #disposables;

  constructor(value) {
    this.#value = value;
    this.#subscribers = new Set();
    this.#disposables = new Set();
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    if (newValue == this.#value) return; // IMPORTANT FEATURE: if value is the same, exit early, don't disturb if you don't need to
    this.#value = newValue;
    this.notify(); // all observers
  }

  subscribe(subscriber) {
    if (this.#value != null) subscriber(this.#value); // IMPORTANT FEATURE: instant notification (initialization on subscribe), but don't notify on null/undefined, predicate functions will look simpler, less error prone
    this.#subscribers.add(subscriber);
    return () => this.#subscribers.delete(subscriber); // IMPORTANT FEATURE: return unsubscribe function, execute this to stop getting notifications.
  }

  notify() {
    for (const subscriber of this.#subscribers) subscriber(this.#value);
  }

  clear() {
    // TODO: memory management keep track of .parent and use a .children Set(), find tree root by looking up parents, and then descens down all children to run clear on them.
    // NOTE: memory management should not be forced on users, they may have their own idea/app that handles it.

    // shutdown procedure
    this.#subscribers.clear(); // destroy subscribers
    this.#disposables.forEach((disposable) => disposable());
    this.#disposables.clear(); // execute and clear disposables
  }

  // add related trash that makes sense to clean when the signal is shutdown
  collect(...input) {
    [input].flat(Infinity).forEach((disposable) => this.#disposables.add(disposable));
  }
}

export class Signal extends Pulse {
  // we are making the pulse into a Signal
  map(mapFunctionPredicate) {
    return map(this, mapFunctionPredicate);
  }

  filter(filterFunction) {}
  scan(accumulator, seed) {}

  debounce(ms) {}
  delay(ms) {}
  throttle(ms) {}

  merge(signal) {}

  combineLatest(...signals) {
    return combineLatest(this, ...signals);
  }

  fromEvent(...a) {
    return fromEvent(...a);
  }

  // NOTE: to* methods return subscriptions not signals
  toInnerTextOf(el) { return toInnerTextOf(this, el); }
  toSignal(destination){ return toSignal(this, destination) }
}

// THIS IS THE MAP FUNCTION, it can be used standalone as map(usernameSignal, v=>`Hello ${v}`),
// but it looks nicer when you use the method: usernameSignal.map(v=>`Hello ${v}`).subscribe(v=>console.log(v))

export function map(parentSignal, mapFunction) {
  const mappedSignal = new Signal();
  const subscription = parentSignal.subscribe((parentSignalValue) => (mappedSignal.value = mapFunction(parentSignalValue)));
  mappedSignal.collect(subscription);
  return mappedSignal;
}

export function combineLatest(...signals) {
  const combinedSignal = new Signal();
  const updateCombinedValue = () => {
    const values = [...signals.map((signal) => signal.value)];
    const nullish = values.some((value) => value == null);
    if (!nullish) combinedSignal.value = values;
  };
  const subscriptions = signals.map((signal) => signal.subscribe(updateCombinedValue));
  combinedSignal.collect(subscriptions);
  return combinedSignal;
}

export function fromEvent(el, eventType, options = {}) {
  const signal = new Signal();
  const handler = (event) => (signal.value = event);
  el.addEventListener(eventType, handler, options);
  return signal;
}

// NOTE: to* functions return subscriptions not signals

export function toInnerTextOf(signal, el) {
  const subscription = signal.subscribe((v) => (el.innerText = v));
  return subscription;
}

export function toSignal(source, destination) {
  const subscription = source.subscribe(v => destination.value = v);
  return subscription;
}
