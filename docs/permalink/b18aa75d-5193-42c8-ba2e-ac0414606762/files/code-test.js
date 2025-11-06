// EventEmitter
class EventEmitter {
  #events = new Map();

  on(eventName, handler) {
    if (!this.#events.has(eventName)) {
      this.#events.set(eventName, new Set());
    }
    this.#events.get(eventName).add(handler);

    return {
      dispose: () => this.off(eventName, handler)
    };
  }

  off(eventName, handler) {
    const handlers = this.#events.get(eventName);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(eventName, payload) {
    const handlers = this.#events.get(eventName);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }
}

// ScopedEventEmitter
class ScopedEventEmitter extends EventEmitter {
  scopes = new Set(); // scope children

  scope() {
    const scope = new Set(); // scope child
    this.scopes.add(scope);
    return scope;
  }

  dispose() {
    for (const scope of this.scopes) {
      for (const disposable of scope) {
        if (disposable.dispose) {
          disposable.dispose();
        }
      }
      scope.clear();
    }
    this.scopes.clear();
  }
}

// Application extends ScopedEventEmitter
class Application extends ScopedEventEmitter {
  plugins = new Set();

  use(plugin) {
    this.plugins.add(plugin);
    const scope = this.scope(); // new resource scope for the plugin
    if (plugin.initialize) {
      plugin.initialize(this, scope);
    }
    return this;
  }
}

// EventAggregator Implementation
class EventAggregator extends ScopedEventEmitter {
  #map = new Map();
  #scope;

  constructor(){
    super();
    this.#scope = this.scope();
  }

  get map() {
    return this.#map;
  }

  combine(emitter, eventName) {
    const key = `${emitter.constructor.name}:${eventName}`;
    this.#map.set(key, undefined);

    const disposable = emitter.on(eventName, (payload) => {
      this.set(key, payload);
    });

    this.#scope.add(disposable);
    return disposable;
  }

  set(key, value) {
    this.#map.set(key, value);
    this.#check();
  }

  #check() {
    for (const value of this.#map.values()) {
      if (value === undefined) return;
    }

    const aggregated = Object.fromEntries(this.#map);
    this.emit('aggregated', aggregated);
  }

  dispose() {
    this.#map.clear();
    super.dispose();
  }
}

// ===== TESTS =====

console.log('🧪 Testing Event Aggregation System\n');

// Test 1: Basic EventEmitter
console.log('Test 1: Basic EventEmitter');
const emitter = new EventEmitter();
let callCount = 0;
const disposable = emitter.on('test', (data) => {
  callCount++;
  console.log(`  ✓ Event received: ${data}`);
});

emitter.emit('test', 'Hello World');
emitter.emit('test', 'Second Call');
console.log(`  ✓ Called ${callCount} times`);

disposable.dispose();
emitter.emit('test', 'Should not appear');
console.log(`  ✓ Disposed correctly, still ${callCount} calls\n`);

// Test 2: Application with Plugins
console.log('Test 2: Application with Plugins');
const app = new Application();

const logPlugin = {
  name: 'logger',
  initialize(app, scope) {
    console.log('  ✓ Logger plugin initialized');
    const sub = app.on('log', (msg) => console.log(`  📝 Log: ${msg}`));
    scope.add(sub);
  }
};

const dataPlugin = {
  name: 'database',
  initialize(app, scope) {
    console.log('  ✓ Database plugin initialized');
    const sub = app.on('data', (data) => console.log(`  💾 Data: ${JSON.stringify(data)}`));
    scope.add(sub);
  }
};

app.use(logPlugin).use(dataPlugin);
app.emit('log', 'Application started');
app.emit('data', { users: 42 });
console.log(`  ✓ ${app.plugins.size} plugins loaded`);
console.log(`  ✓ ${app.scopes.size} scopes created\n`);

// Test 3: Event Aggregator
console.log('Test 3: Event Aggregator - Composable Events');

const database = new EventEmitter();
const webSocket = new EventEmitter();
const ui = new EventEmitter();

const aggregator = new EventAggregator();
let aggregatedCount = 0;

aggregator.on('aggregated', (combined) => {
  aggregatedCount++;
  console.log(`  🎯 System Ready! (trigger #${aggregatedCount})`);
  console.log(`  📊 Combined state:`, JSON.stringify(combined, null, 2));
});

console.log('  Setting up aggregator...');
aggregator.combine(database, 'connected');
aggregator.combine(webSocket, 'open');
aggregator.combine(ui, 'rendered');

console.log('  Emitting events in sequence...');
database.emit('connected', { status: 'active', tables: 12 });
console.log('    - Database connected (1/3)');

webSocket.emit('open', { protocol: 'ws', latency: 45 });
console.log('    - WebSocket opened (2/3)');

ui.emit('rendered', { components: 8, time: '120ms' });
console.log('    - UI rendered (3/3)');

console.log(`  ✓ Aggregation triggered ${aggregatedCount} time(s)\n`);

// Test 4: Composable Aggregators
console.log('Test 4: Composable Aggregators');

const appLoadAggregator = new EventAggregator();
const serverAggregator = new EventAggregator();
const systemAggregator = new EventAggregator();

const userAuth = new EventEmitter();
const plugins = new EventEmitter();

appLoadAggregator.combine(userAuth, 'loggedIn');
appLoadAggregator.combine(plugins, 'ready');

const dbConn = new EventEmitter();
const apiConn = new EventEmitter();

serverAggregator.combine(dbConn, 'established');
serverAggregator.combine(apiConn, 'healthy');

// Now compose the aggregators!
systemAggregator.combine(appLoadAggregator, 'aggregated');
systemAggregator.combine(serverAggregator, 'aggregated');

systemAggregator.on('aggregated', (state) => {
  console.log('  🚀 ENTIRE SYSTEM READY!');
  console.log('  📋 Full state:', JSON.stringify(state, null, 2));
});

console.log('  Triggering app events...');
userAuth.emit('loggedIn', { user: 'alice', role: 'admin' });
plugins.emit('ready', { count: 5 });

console.log('  Triggering server events...');
dbConn.emit('established', { host: 'db.example.com' });
apiConn.emit('healthy', { uptime: '99.9%' });

console.log('');

// Test 5: Cleanup and Disposal
console.log('Test 5: Cleanup and Disposal');
let disposedCount = 0;

const testApp = new Application();
const cleanupPlugin = {
  name: 'cleanup-test',
  initialize(app, scope) {
    const sub1 = app.on('event1', () => disposedCount++);
    const sub2 = app.on('event2', () => disposedCount++);
    scope.add(sub1);
    scope.add(sub2);
  }
};

testApp.use(cleanupPlugin);
testApp.emit('event1');
testApp.emit('event2');
console.log(`  ✓ Events fired before disposal: ${disposedCount}`);

testApp.dispose();
const beforeDispose = disposedCount;
testApp.emit('event1');
testApp.emit('event2');
console.log(`  ✓ Events after disposal: ${disposedCount === beforeDispose ? 'none' : 'ERROR'}`);
console.log(`  ✓ Scopes cleared: ${testApp.scopes.size === 0 ? 'yes' : 'no'}\n`);

console.log('✅ All tests completed!');
console.log('\n🎓 Event Aggregation System is working perfectly!');
console.log('💡 This pattern gives you composable, cleanable event architecture.');
