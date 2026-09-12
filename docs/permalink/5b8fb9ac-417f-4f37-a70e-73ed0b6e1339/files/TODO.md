# Undercity 2.0 — Design Questions & Blockers

These are the open problems I encountered while upgrading to Signal/Concern
throughout.  Each section names the issue, shows where it surfaces, and
proposes one or more solutions for you to decide on.

---

## 1 — Concern has no multi-signal subscribe

**Where it hurts:** every component with more than one observed attribute
(e.g. `af-ask-for-text` has 10).

**Current pattern:** the free-form `combineLatest(...signals)` from
`concerns.js` is the only way — the instance method was removed because it
registered child ownership on the parent signal, causing accumulation on each
reconnect.  The free-form version inverts ownership correctly: the child owns
its subscriptions; the concern owns the child.

```js
const config = combineLatest(this.#key, this.#label, ...);
this.#concern.collect(config);                   // concern owns lifecycle
this.#concern.collect(config.subscribe(([...]) => { ... }));
```

**Proposed addition to `Concern`** — sugar over the pattern above:
```js
subscribeAll(names, fn) {
  const signals = names.map(n => this.signal(n));
  const config = combineLatest(...signals);
  this.collect(config);
  this.collect(config.subscribe(fn));
}
```

Usage:
```js
this.#concern.subscribeAll(
  ['key', 'label', 'placeholder', ...],
  ([key, label, placeholder, ...]) => { ... }
);
```

---

## 2 — Signal has no peek()

**Where it hurts:** `FieldValidationController` callbacks use
`this.#label.peek()` and `this.#key.peek()` for synchronous reads without
triggering reactivity.

**Current workaround:** `signal.value` (the getter) is used instead.
It returns the current value without notifying anyone, so it's functionally
equivalent to `peek()`.  The only semantic difference is intent clarity.

**Proposed addition to `Signal`:**
```js
peek() { return this.#value; }
```

One line.  Makes the intent clear: "I am reading, not subscribing."

---

## 3 — Concern.bind() is one-directional (element → signal only)

**Where it hurts:** input components need two-way binding:
  - Signal → `element.value` (reactive read)
  - `element` `input` event → `Inventory.set()` (write)

**Current workaround in `af-ask-for-text`:**
```js
// Signal → element (reactive read — via subscribe)
inventoryConcern.subscribe('value', v => { el.value = String(v); });

// element → Inventory (write — manual, collected)
const handler = () => { Inventory.set(key, el.value); this.#validation.refresh(); };
el.addEventListener('input', handler);
inventoryConcern.collect(() => el.removeEventListener('input', handler));
```

**Why not use `concern.bind(signal, el)` for the write direction?**
`bind` writes to the Signal directly (`signal.value = el.value`).  For
Inventory-backed signals that would bypass `Inventory.set()`, losing
persistence and cache-upload.

**Proposed addition to `Concern`:**
```js
// Two-way: signal→element + element→signal (pure in-memory, no Inventory)
bindTwo(signal, element) {
  this.collect(signal.subscribe(v => { element.value = String(v); }));
  this.bind(signal, element); // existing: element → signal
}
```

For Inventory-backed inputs, the current manual pattern is correct and
should stay — `Inventory.set()` is the authoritative write path.

---

## 4 — Inventory.clear() is broken under Signal law

**The problem:** `Signal` silently ignores `null` and `undefined` (LAW 1).
`Inventory.clear()` wants to notify all subscribers that their key is empty,
but there is no valid non-null "empty" sentinel in the current Signal design.

**Three options:**

### Option A — Symbol sentinel
```js
export const EMPTY = Symbol('empty');
// Signal allows Symbols (they are not null/undefined)
// Display components check: if (v === EMPTY) { render empty state; return; }
```
Pros: clean one-liner in components.
Cons: every component must know about `EMPTY`.  Leaks a concept into all subscribers.

### Option B — Inventory clears the Signal itself
```js
clear() {
  _sigs.clear(); // drop all signals — existing subscribers lose their connection
  // Concern's connectedCallback re-subscribes on the next render cycle
}
```
Pros: signals stay clean (no null, no sentinel).
Cons: components must be designed to survive silent unsubscription.  Currently
they are not — they would keep rendering stale values.

### Option C — Add a "reset" event alongside the Signal
```js
// Each Signal gets a companion Emitter that fires 'reset' on clear
inventorySignal.onReset(fn);  // fn() called when key is cleared
```
Pros: clean separation — value channel vs control channel.
Cons: complexity grows.  Subscribers must handle two channels.

**Recommendation:** Option A is the least invasive change.  Define
`export const EMPTY = Symbol('empty')` in `concerns.js`, teach Signal to
pass it through, and add a one-liner check at the top of every `#renderValue`.

---

## 5 — Scalar values and the .type Law

**The law:** every structured Inventory value MUST have `.type` (MIME string).

**The problem:** scalars (string, number, boolean) are stored directly and
have no `.type`.  `af-display-value` currently uses optional chaining
(`v?.type?.startsWith(...)`) as a graceful fallback to the text renderer.
This is acceptable but is still a defensive pattern.

**Options:**

### Option A — Inventory auto-wraps scalars on set()
```js
// Inside Inventory.set():
if (typeof value !== 'object') value = { type: 'text/plain', value };
```
Then all stored values are objects with `.type`, and `af-display-value` can
do `v.type.startsWith(...)` without optional chaining.
Cons: `Inventory.peek(key)` returns a wrapper object, not the raw string.
Callers doing `String(Inventory.peek('name'))` would get `[object Object]`.

### Option B — Accept scalars as-is; keep the optional chaining fallback
The current approach.  Structured values have `.type`; scalars fall through
to the text renderer.  The optional chaining `v?.type?.startsWith(...)` is
minimal and does not proliferate into complex conditionals.

**Recommendation:** Option B for now.  The scalar fallback is one line and
the optional chaining reads cleanly.  Revisit when a use case arises where
all values genuinely need a uniform shape.

---

## 6 — concerns.js: Concern does not dispose its own stored Signals

**The problem:** `concern.signal('key', sig)` stores `sig` in `#signals` Map.
When `concern.dispose()` is called, only `#destructibles` and `#children`
are cleaned up.  The signals in `#signals` are NOT disposed.

**Why this usually does not matter:**
Signals stored in a Concern are typically class fields on the component
(`#key`, `#label`, etc.) that live for the component's lifetime.  The
Concern only owns the *subscriptions to those signals*, not the signals
themselves.  Disposing the subscriptions (via `subscribe()` → `collect()`)
is correct.

**When it WOULD matter:**
If a Concern creates new signals internally (e.g.
`concern.signal('config', combineLatest(...))`) and those signals have
their own child resources, they would not be cleaned up on `concern.dispose()`.

**Proposed fix:** When a signal is registered via `concern.signal(name, sig)`,
optionally mark it as owned:
```js
signal(name, sig, { owned = false } = {}) {
  this.#signals.set(name, sig);
  if (owned) this.collect(sig); // concern disposes sig
  return this.#signals.get(name);
}
```

---

## Files created in 2.0

| File | Status | Notes |
|---|---|---|
| `src/lib/concerns.js` | Complete | Canonical Signal/Scope/Concern primitives |
| `runtime/inventory.js` | Complete | `get(key)` returns Signal; `clear()` is a TODO |
| `library/display/text/af-display-text.js` | Complete | Single-attribute, clean |
| `library/display/value/af-display-value.js` | Complete | Concern + Inventory.get() → Signal |
| `library/input/text/af-ask-for-text.js` | Complete | Uses free-form combineLatest; see §1 |
| All other input components | Not ported | Same pattern as af-ask-for-text |
| All other display components | Not ported | Same pattern as af-display-text |
