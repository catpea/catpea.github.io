
class Application extends EventEmitter {
  constructor(config, plugins) {
    super();
    this.config = config;
    this.plugins = plugins;
  }

  init() {
    this.unsubscribers = new Set();
    this.plugins.forEach(plugin => {
      const unsub = plugin.init(this);
      if (typeof unsub === 'function') {
        this.unsubscribers.add(unsub);
      }
    });
  }

  stop() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers.clear();
  }
}

class EventEmitter {
  #subscribers;

  constructor() {
    this.#subscribers = new Map();
  }

  on(event, callback) {
    if (!this.#subscribers.has(event)) {
      this.#subscribers.set(event, new Set());
    }
    this.#subscribers.get(event).add(callback);
  }

  emit(event, data) {
    const listeners = this.#subscribers.get(event) ?? new Set();
    const wildcardListeners = this.#subscribers.get('*') ?? new Set();

    for (const listener of listeners) {
      listener(data);
    }
    for (const listener of wildcardListeners) {
      listener(data);
    }
  }
}

class Signal {
  #value;
  #subscribers;

  constructor(value) {
    this.#value = value;
    this.#subscribers = new Set();
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    this.#value = newValue;
    for (const callback of this.#subscribers) {
      callback(newValue);
    }
  }

  subscribe(callback) {
    if (this.#value) callback(this.#value);
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }
}
