import { Fancy } from " I don't have a good name for the project yet ";

export default class MyPlugin extends Fancy {
  constructor(options = {}, app) {
    const disposables = app.disposables.branch('MyPlugin'); // MyPlugin is a child of app.disposables the root garbage collector
    super({ disposables, name: 'MyPlugin' }); // send some stuff up to the base class

    this.declare({
      objects: { app, options, colors: [] }, // app and options become this.app and this.options
      signals: { loaded: false, started: false, ready: false }, // signals are configured with defaults
      capture: { started: true, loaded: true }, // on event listeners are configured and feed into signals
      combine: { ready: { loaded: true, started: true } } // ready requires that both loaded and started signals (not events) are true
    });
  }

  async start() {
    if (this.started.value) return this;
    // Laod files...
    this.emit('loaded', true);
    // do things to App or UI, or Browser...
    this.emit('started', true);
    // another plugin provides log, plugins are async and well ordered
    this.app.log.info('MyPlugin Started');
    return this;
  }

  async stop() {
    if (!this.started.value && !this.loaded.value) return this;
    this.emit('started', false);
    this.emit('loaded', false);
    return this;
  }

  dispose() {
    super.dispose(); // clear all the disposable including any child disposables
  }
}
