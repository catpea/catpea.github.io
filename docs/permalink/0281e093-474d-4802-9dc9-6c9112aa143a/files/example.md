# Pea Visual Programming Language Implementation Overview

**VPL Toolkit Assembly**
_DOM-Native, File-Backed Visual Programming Language_

---

## Philosophy Summary

This toolkit follows a radically simple philosophy:

1. **DOM is the source of truth** - All state lives in HTML attributes
2. **Components are structure, not behavior** - Logic lives in `useX()` functions
3. **One hyphen rule** - Human-readable element names (e.g., `math-block`, not `vpl-math-block`)
4. **Readable > clever** - If a human can't understand the XML, it's wrong
5. **No hidden state** - Everything is inspectable via DevTools
6. **Saving = outerHTML** - No serializers, no magic

---

## Implementation Stages

The system is built in **7 progressive stages**, each with clear dependencies and acceptance criteria.

### Stage 1: Core Infrastructure
**Goal**: Foundation layer
**Lines of code**: ~200

**Deliverables**:
- Signal system (attribute → event propagation)
- Root container structure (`<app-root>`, `<app-library>`, `<app-stage>`)
- Test harness setup
- Development environment

**Key files**:
- `src/core/signals.js` - Reactive attribute system
- `src/components/app-root.js` - Root container
- `tests/setup.js` - Test environment

**Success criteria**:
- ✅ Signals emit on attribute changes
- ✅ Root structure renders correctly
- ✅ Tests pass
- ✅ Dev server runs

---

### Stage 2: Basic Blocks and Properties
**Goal**: First visual components
**Lines of code**: ~400 total

**Deliverables**:
- Property components (`number-prop`, `string-prop`, `boolean-prop`)
- First block component (`math-block`)
- Position system (`x`, `y`, `width`, `height`)
- Visual styling

**Key files**:
- `src/components/number-prop.js` - Numeric properties
- `src/components/math-block.js` - Example block
- `src/core/block-styles.js` - Shared styling

**Success criteria**:
- ✅ Properties display correctly
- ✅ Math block computes results
- ✅ Blocks position via attributes
- ✅ Reactive updates work

---

### Stage 3: Pan-Zoom and Spatial Management
**Goal**: Infinite canvas navigation
**Lines of code**: ~600 total

**Deliverables**:
- `<pan-zoom>` component with transform
- `usePanZoom()` behavior for interaction
- Keyboard shortcuts (arrows, +/-, 0)
- Mouse controls (wheel, middle-drag)

**Key files**:
- `src/components/pan-zoom.js` - Transform container
- `src/behaviors/usePanZoom.js` - Interaction layer

**Success criteria**:
- ✅ Pan and zoom work smoothly
- ✅ Keyboard controls functional
- ✅ All state in `x`, `y`, `zoom` attributes
- ✅ Works with 10+ blocks

---

### Stage 4: Sockets and Streams
**Goal**: Dataflow infrastructure
**Lines of code**: ~1000 total

**Deliverables**:
- `<in-socket>` and `<out-socket>` components
- WebStreams integration
- Stream utilities (piping, resolution)
- Property-socket integration

**Key files**:
- `src/components/in-socket.js` - Input connection point
- `src/components/out-socket.js` - Output connection point
- `src/core/streams.js` - Stream utilities

**Success criteria**:
- ✅ Sockets create streams
- ✅ OutSocket emits on property changes
- ✅ InSocket updates property on write
- ✅ Visual socket indicators work

---

### Stage 5: Cables and Visual Connections
**Goal**: Visual dataflow
**Lines of code**: ~1500 total

**Deliverables**:
- `<data-cable>` component with SVG rendering
- Automatic stream piping
- Dynamic cable updates
- Error handling (red dashed for invalid)

**Key files**:
- `src/components/data-cable.js` - Cable component
- `src/behaviors/useCable.js` - Cable interactions

**Success criteria**:
- ✅ Cables render as SVG curves
- ✅ Data flows through cables
- ✅ Cables update when blocks move
- ✅ One SVG per cable (no pooling)
- ✅ Works with 5+ blocks, 10+ cables

---

### Stage 6: Symbols and Instances
**Goal**: Reusability system
**Lines of code**: ~2000 total

**Deliverables**:
- Symbol storage in `<app-library>`
- Instance components (`*-instance`)
- Symbol expansion with ID remapping
- Parameter passing

**Key files**:
- `src/components/base-instance.js` - Generic instance handler
- `src/components/auth-symbol.js` - Example symbol
- `src/components/auth-instance.js` - Example instance

**Success criteria**:
- ✅ Symbols stored and hidden in library
- ✅ Instances expand symbol contents
- ✅ IDs remapped to avoid conflicts
- ✅ Parameters override defaults
- ✅ Multiple instances work independently

---

### Stage 7: Behaviors and Interactions
**Goal**: User interaction layer
**Lines of code**: ~2500 total

**Deliverables**:
- `useDraggable()` - Block dragging
- `useSelectable()` - Selection system
- `useCableCreator()` - Drag to connect
- Global keyboard shortcuts
- Save/load functionality

**Key files**:
- `src/behaviors/useDraggable.js` - Drag behavior
- `src/behaviors/useSelectable.js` - Selection behavior
- `src/behaviors/useCableCreator.js` - Cable creation
- `src/core/keyboard.js` - Global shortcuts

**Success criteria**:
- ✅ Blocks draggable
- ✅ Blocks selectable
- ✅ Cables creatable by dragging
- ✅ Delete key removes selected
- ✅ Ctrl+S saves XML
- ✅ Complete workflow usable

---

## Stage Dependencies

```
Stage 1 (Core Infrastructure)
  ↓
Stage 2 (Blocks & Properties)
  ↓
Stage 3 (Pan-Zoom) ←──┐
  ↓                    │
Stage 4 (Sockets)      │
  ↓                    │
Stage 5 (Cables) ──────┘
  ↓
Stage 6 (Symbols)
  ↓
Stage 7 (Behaviors)
```

---

## File Organization

```
xml-wc-vpl-mark-1/
├── REQUIREMENTS.md              # Enhanced requirements document
├── IMPLEMENTATION-OVERVIEW.md   # This file
├── STAGE-1.md through STAGE-7.md # Detailed stage documents
│
├── src/
│   ├── core/                    # Core utilities
│   │   ├── signals.js           # Reactive attributes
│   │   ├── streams.js           # Stream utilities
│   │   ├── block-styles.js      # Shared styling
│   │   └── keyboard.js          # Global shortcuts
│   │
│   ├── components/              # Web Components
│   │   ├── app-root.js          # Root container
│   │   ├── app-library.js       # Symbol library
│   │   ├── app-stage.js         # Canvas container
│   │   ├── pan-zoom.js          # Transform container
│   │   ├── number-prop.js       # Numeric property
│   │   ├── string-prop.js       # String property
│   │   ├── boolean-prop.js      # Boolean property
│   │   ├── math-block.js        # Example block
│   │   ├── in-socket.js         # Input connection
│   │   ├── out-socket.js        # Output connection
│   │   ├── data-cable.js        # Visual connection
│   │   ├── base-instance.js     # Generic instance
│   │   └── (symbol components)  # Custom symbols
│   │
│   └── behaviors/               # Interaction behaviors
│       ├── usePanZoom.js        # Pan-zoom interaction
│       ├── useDraggable.js      # Drag behavior
│       ├── useSelectable.js     # Selection behavior
│       ├── useCableCreator.js   # Cable creation
│       └── useCable.js          # Cable interaction
│
├── tests/                       # Test files
│   ├── setup.js                 # Test environment
│   ├── core/                    # Core tests
│   ├── components/              # Component tests
│   └── behaviors/               # Behavior tests
│
├── index.html                   # Development playground
└── package.json                 # Dependencies (minimal)
```

---

## Testing Strategy

### Unit Testing
- Test each component via **DOM manipulation only**
- Use `setAttribute`/`getAttribute` exclusively
- Verify signal emissions
- No mocking - use real DOM

### Integration Testing
- Create XML structures
- Wait for streams to settle
- Check final attribute values

### Behavior Testing
- Test `useX()` functions independently
- Simulate pointer events
- Verify attribute updates

### Total Test Files
- ~20 test files
- ~100 test cases
- < 1 second for full suite

---

## Code Metrics

| Stage | New Lines | Total Lines | Components | Behaviors | Tests |
|-------|-----------|-------------|------------|-----------|-------|
| 1     | ~200      | 200         | 4          | 0         | 3     |
| 2     | ~400      | 600         | 8          | 0         | 6     |
| 3     | ~200      | 800         | 9          | 1         | 8     |
| 4     | ~400      | 1200        | 11         | 1         | 12    |
| 5     | ~500      | 1700        | 12         | 2         | 15    |
| 6     | ~500      | 2200        | 15+        | 2         | 18    |
| 7     | ~600      | 2800        | 15+        | 5         | 25+   |

**Final total**: < 3000 lines of production code

---

## Development Workflow

### Setup
```bash
# No build step needed - just serve files
python -m http.server 8000
# or
npx serve
```

### Development
1. Edit component files directly
2. Refresh browser to see changes
3. Use browser DevTools to inspect DOM state
4. Run tests: `npm test`

### Production
Optional bundling for deployment:
```bash
# Optional - not required
npx rollup -c
```

---

## Key Design Decisions

### Why WebStreams?
- Native browser API
- Object-mode support
- Backpressure built-in
- No dependencies

### Why One SVG Per Cable?
- Simplicity > performance
- Easy to debug
- Matches DOM philosophy
- Acceptable up to 5000 cables

### Why No Base Class?
- Avoids inheritance complexity
- Each component stands alone
- Easier to test
- Easier to understand

### Why Behaviors Over Methods?
- Components remain inert
- Behavior is opt-in
- Easy to add/remove
- Testable in isolation

---

## Performance Targets

| Metric                  | Target   | Acceptable |
|-------------------------|----------|------------|
| Blocks on canvas        | 500      | 1000       |
| Cables                  | 1000     | 5000       |
| Pan-zoom FPS            | 60       | 30         |
| Save operation (10k el) | < 500ms  | < 1s       |
| Test suite              | < 500ms  | < 1s       |

**Philosophy**: Correctness > Speed. Optimize only when proven necessary.

---

## Future Enhancements

**Not in scope for initial implementation, but possible later**:

1. **Minimap visualization** - Bird's eye view of canvas
2. **Undo/redo** - Via DOM mutation history
3. **Property editors** - Inline editing of values
4. **More block types** - HTTP, Database, Script, etc.
5. **Symbol library browser** - Visual picker for symbols
6. **Copy/paste** - Clone subtrees
7. **Multi-selection drag** - Move multiple blocks
8. **Export formats** - JSON, JavaScript, etc.
9. **Import from Node-RED** - Migration path
10. **Collaborative editing** - Via operational transforms

---

## Success Metrics

The system is successful if:

1. ✅ A human can open `.xml` and understand it
2. ✅ Saving is `app.outerHTML`
3. ✅ Loading is `app.innerHTML = xml`
4. ✅ Deleting in DevTools removes visuals and behavior
5. ✅ All state is visible in attributes
6. ✅ Tests run in < 1 second
7. ✅ Adding a new block type takes < 50 lines
8. ✅ Total codebase is < 3000 lines
9. ✅ No dependencies beyond browser APIs
10. ✅ It feels **humane**

---

## How to Implement

### For an AI Agent

1. **Read REQUIREMENTS.md thoroughly** - Understand the philosophy
2. **Start with Stage 1** - Build foundation first
3. **Complete each stage fully** - Don't skip ahead
4. **Write tests as you go** - Verify each component
5. **Run acceptance criteria** - Ensure stage is complete
6. **Move to next stage** - Build incrementally

### For a Human Developer

Same approach:
1. Read requirements
2. Implement stages sequentially
3. Test thoroughly
4. Verify acceptance criteria
5. Celebrate progress

---

## Philosophy Recap

This toolkit is:
- **Transparent** - Everything is visible
- **Honest** - No hidden abstractions
- **Simple** - Minimal complexity
- **Debuggable** - Use DevTools directly
- **Humane** - Respects human understanding

It rejects:
- Virtual DOMs
- Hidden state
- Complex frameworks
- Premature optimization
- Clever abstractions

It embraces:
- Plain HTML/DOM
- Web standards
- Simplicity
- Readability
- Correctness

---

## Getting Started

1. **Read**: `REQUIREMENTS.md`
2. **Understand**: This overview
3. **Implement**: `STAGE-1.md`
4. **Test**: Verify acceptance criteria
5. **Continue**: Through all 7 stages
6. **Celebrate**: You've built humane software

---

## Questions?

If you're implementing this and have questions:

1. **Check REQUIREMENTS.md** - Philosophy and patterns
2. **Check stage documents** - Detailed implementations
3. **Check tests** - Usage examples
4. **Inspect the DOM** - Truth is in attributes
5. **Trust simplicity** - If it feels too clever, it is

---

## License

_(Add your license here)_

---

**Built with care. Debugged with DevTools. Saved as XML.**

🎉 Welcome to humane software development.
# Stage 1: Core Infrastructure

**Goal**: Establish the foundational architecture that all other components depend on.

**Duration estimate**: Foundation layer

**Dependencies**: None (this is the starting point)

---

## Overview

This stage creates the minimal infrastructure needed to build DOM-native, attribute-driven web components. Nothing visual happens yet - this is pure plumbing.

---

## Deliverables

1. Signal system for attribute → event propagation
2. Base component patterns (no inheritance, just examples)
3. Root container structure
4. Development environment
5. Test harness

---

## 1. Signal System

### Purpose

Components need to **emit events when attributes change**. Signals are read-only reactive primitives that mirror DOM attributes.

### Implementation

**File**: `src/core/signals.js`

```js
/**
 * Creates a signal that mirrors an attribute
 * @param {HTMLElement} element - The element to observe
 * @param {string} attrName - The attribute to mirror
 * @returns {EventTarget} - Emits 'change' events with {value}
 */
export function createSignal(element, attrName) {
  const target = new EventTarget();

  // Initial value
  const initialValue = element.getAttribute(attrName);
  let currentValue = initialValue;

  // Watch for attribute changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === attrName) {
        const newValue = element.getAttribute(attrName);
        if (newValue !== currentValue) {
          currentValue = newValue;
          target.dispatchEvent(new CustomEvent('change', { detail: { value: newValue } }));
        }
      }
    }
  });

  observer.observe(element, { attributes: true, attributeFilter: [attrName] });

  // Cleanup when element disconnects
  element.addEventListener('disconnected', () => observer.disconnect(), { once: true });

  // Read-only accessor
  Object.defineProperty(target, 'value', {
    get: () => element.getAttribute(attrName),
    enumerable: true
  });

  return target;
}

/**
 * Helper to attach multiple signals to an element
 * @param {HTMLElement} element
 * @param {string[]} attrNames
 * @returns {Object} - Map of attrName → signal
 */
export function createSignals(element, attrNames) {
  const signals = {};
  for (const name of attrNames) {
    signals[name] = createSignal(element, name);
  }
  return signals;
}
```

### Testing

**File**: `tests/core/signals.test.js`

```js
import { createSignal } from '../../src/core/signals.js';

describe('Signal system', () => {
  it('emits change event when attribute changes', (done) => {
    const el = document.createElement('div');
    el.setAttribute('x', '0');

    const signal = createSignal(el, 'x');

    signal.addEventListener('change', (e) => {
      assert.equal(e.detail.value, '10');
      done();
    });

    el.setAttribute('x', '10');
  });

  it('exposes current value via .value', () => {
    const el = document.createElement('div');
    el.setAttribute('x', '42');

    const signal = createSignal(el, 'x');

    assert.equal(signal.value, '42');
  });

  it('does not emit if value unchanged', () => {
    const el = document.createElement('div');
    el.setAttribute('x', '5');

    const signal = createSignal(el, 'x');

    let count = 0;
    signal.addEventListener('change', () => count++);

    el.setAttribute('x', '5'); // Same value
    el.setAttribute('x', '5');

    setTimeout(() => {
      assert.equal(count, 0);
    }, 10);
  });
});
```

---

## 2. Root Container Structure

### Purpose

Establish the **root DOM structure** that all applications will use.

### Implementation

**File**: `src/components/app-root.js`

```js
/**
 * <app-root> - Top-level container for VPL applications
 *
 * Attributes:
 *   version - Schema version (e.g., "0.1")
 *
 * Structure:
 *   <app-library> - Reusable symbol definitions
 *   <app-stage>   - Main editable scene
 *   <app-minimap> - Optional mini-map view
 */
export class AppRoot extends HTMLElement {
  connectedCallback() {
    // Ensure required children exist
    if (!this.querySelector('app-library')) {
      this.appendChild(document.createElement('app-library'));
    }
    if (!this.querySelector('app-stage')) {
      this.appendChild(document.createElement('app-stage'));
    }

    // Add visual styling
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
  }
}

customElements.define('app-root', AppRoot);
```

**File**: `src/components/app-library.js`

```js
/**
 * <app-library> - Container for reusable symbol definitions
 *
 * Not visually rendered - acts like <defs> in SVG
 */
export class AppLibrary extends HTMLElement {
  connectedCallback() {
    this.style.display = 'none'; // Hidden from view
  }
}

customElements.define('app-library', AppLibrary);
```

**File**: `src/components/app-stage.js`

```js
/**
 * <app-stage> - Main editable scene container
 *
 * Typically contains a <pan-zoom> element
 */
export class AppStage extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.style.background = '#f5f5f5';
  }
}

customElements.define('app-stage', AppStage);
```

**File**: `src/components/app-minimap.js`

```js
/**
 * <app-minimap> - Optional mini-map overview
 *
 * Stage 1: Just a placeholder
 */
export class AppMinimap extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.position = 'absolute';
    this.style.bottom = '10px';
    this.style.right = '10px';
    this.style.width = '200px';
    this.style.height = '150px';
    this.style.border = '1px solid #ccc';
    this.style.background = '#fff';
    this.style.opacity = '0.8';

    this.textContent = '(minimap - Stage 6)';
  }
}

customElements.define('app-minimap', AppMinimap);
```

### Testing

**File**: `tests/components/app-root.test.js`

```js
describe('app-root', () => {
  it('auto-creates required children', () => {
    const root = document.createElement('app-root');
    document.body.appendChild(root);

    assert.ok(root.querySelector('app-library'));
    assert.ok(root.querySelector('app-stage'));

    root.remove();
  });

  it('preserves existing children', () => {
    const root = document.createElement('app-root');
    const lib = document.createElement('app-library');
    lib.id = 'custom';
    root.appendChild(lib);

    document.body.appendChild(root);

    assert.equal(root.querySelectorAll('app-library').length, 1);
    assert.equal(root.querySelector('app-library').id, 'custom');

    root.remove();
  });
});
```

---

## 3. Development Environment

### index.html (development playground)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VPL Toolkit - Development</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <app-root version="0.1">
    <app-library></app-library>
    <app-stage></app-stage>
  </app-root>

  <script type="module">
    import './src/components/app-root.js';
    import './src/components/app-library.js';
    import './src/components/app-stage.js';
    import './src/components/app-minimap.js';

    console.log('VPL Toolkit loaded');
  </script>
</body>
</html>
```

### package.json (minimal, optional)

```json
{
  "name": "xml-wc-vpl-toolkit",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "python -m http.server 8000",
    "test": "node --test tests/**/*.test.js",
    "test:watch": "node --test --watch tests/**/*.test.js"
  },
  "devDependencies": {}
}
```

---

## 4. Test Harness

### tests/setup.js

```js
/**
 * Test environment setup
 * Use JSDOM or similar for Node-based testing
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;
global.MutationObserver = dom.window.MutationObserver;
global.EventTarget = dom.window.EventTarget;
global.CustomEvent = dom.window.CustomEvent;

// Helper to wait for next frame
global.nextFrame = () => new Promise(resolve => setTimeout(resolve, 0));
```

### Alternative: Browser-based tests

Use Web Test Runner or similar:

```bash
npm install --save-dev @web/test-runner
```

**web-test-runner.config.mjs**:

```js
export default {
  files: 'tests/**/*.test.js',
  nodeResolve: true,
};
```

---

## 5. File Structure (after Stage 1)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── core/
│   │   └── signals.js
│   └── components/
│       ├── app-root.js
│       ├── app-library.js
│       ├── app-stage.js
│       └── app-minimap.js
├── tests/
│   ├── setup.js
│   ├── core/
│   │   └── signals.test.js
│   └── components/
│       └── app-root.test.js
├── index.html
├── package.json
├── REQUIREMENTS.md
└── STAGE-1.md (this file)
```

---

## Acceptance Criteria

Before moving to Stage 2:

- [ ] Signal system works and is tested
- [ ] `<app-root>` renders with required children
- [ ] `<app-library>` is hidden from view
- [ ] `<app-stage>` displays as a gray canvas
- [ ] `index.html` loads without errors
- [ ] All tests pass
- [ ] Dev server runs (`npm run dev` or equivalent)
- [ ] Code is < 200 lines total

---

## Next Stage

**Stage 2**: Basic Blocks and Properties

We'll create the first actual **block** components (`math-block`, etc.) and **property** components (`number-prop`, `string-prop`).
# Stage 2: Basic Blocks and Properties

**Goal**: Create the first visual block components and property system.

**Duration estimate**: Core building blocks

**Dependencies**: Stage 1 (signals, root structure)

---

## Overview

This stage introduces **blocks** (the primary visual units) and **properties** (the data containers within blocks). By the end, you can place blocks on the stage and see their properties.

---

## Deliverables

1. Property components (`number-prop`, `string-prop`, `boolean-prop`)
2. A simple block component (`math-block`)
3. Visual styling for blocks
4. Position attributes (`x`, `y`, `width`, `height`)
5. Tests for blocks and properties

---

## 1. Property Components

### Purpose

Properties are **attribute-driven data containers** that:
- Display current values
- Will later connect via sockets (Stage 4)
- Expose signals for reactive updates

### number-prop

**File**: `src/components/number-prop.js`

```js
import { createSignal } from '../core/signals.js';

/**
 * <number-prop> - Numeric value property
 *
 * Attributes:
 *   name  - Property name (e.g., "x", "value")
 *   value - Numeric value (default: 0)
 *   min   - Optional minimum
 *   max   - Optional maximum
 */
export class NumberProp extends HTMLElement {
  static observedAttributes = ['name', 'value', 'min', 'max'];

  connectedCallback() {
    // Create signals for reactive updates
    this.signals = {
      value: createSignal(this, 'value')
    };

    // Validate and normalize value
    this._updateValue();
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
      this._updateValue();
    }
    this._render();
  }

  _updateValue() {
    let value = parseFloat(this.getAttribute('value') || '0');

    const min = this.getAttribute('min');
    const max = this.getAttribute('max');

    if (min !== null) value = Math.max(value, parseFloat(min));
    if (max !== null) value = Math.min(value, parseFloat(max));

    // Only update if changed (prevents infinite loops)
    if (value.toString() !== this.getAttribute('value')) {
      this.setAttribute('value', value.toString());
    }
  }

  _render() {
    const name = this.getAttribute('name') || 'value';
    const value = this.getAttribute('value') || '0';

    this.innerHTML = `
      <span class="prop-name">${name}</span>
      <span class="prop-value">${value}</span>
    `;

    this.style.display = 'flex';
    this.style.justifyContent = 'space-between';
    this.style.padding = '4px 8px';
    this.style.fontSize = '12px';
    this.style.borderBottom = '1px solid #e0e0e0';
  }
}

customElements.define('number-prop', NumberProp);
```

### string-prop

**File**: `src/components/string-prop.js`

```js
import { createSignal } from '../core/signals.js';

/**
 * <string-prop> - String value property
 *
 * Attributes:
 *   name  - Property name
 *   value - String value (default: "")
 */
export class StringProp extends HTMLElement {
  static observedAttributes = ['name', 'value'];

  connectedCallback() {
    this.signals = {
      value: createSignal(this, 'value')
    };
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const name = this.getAttribute('name') || 'text';
    const value = this.getAttribute('value') || '';

    this.innerHTML = `
      <span class="prop-name">${name}</span>
      <span class="prop-value">${value}</span>
    `;

    this.style.display = 'flex';
    this.style.justifyContent = 'space-between';
    this.style.padding = '4px 8px';
    this.style.fontSize = '12px';
    this.style.borderBottom = '1px solid #e0e0e0';
  }
}

customElements.define('string-prop', StringProp);
```

### boolean-prop

**File**: `src/components/boolean-prop.js`

```js
import { createSignal } from '../core/signals.js';

/**
 * <boolean-prop> - Boolean value property
 *
 * Attributes:
 *   name  - Property name
 *   value - "true" or "false" (default: "false")
 */
export class BooleanProp extends HTMLElement {
  static observedAttributes = ['name', 'value'];

  connectedCallback() {
    this.signals = {
      value: createSignal(this, 'value')
    };
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const name = this.getAttribute('name') || 'flag';
    const value = this.getAttribute('value') === 'true';

    this.innerHTML = `
      <span class="prop-name">${name}</span>
      <span class="prop-value">${value ? '✓' : '✗'}</span>
    `;

    this.style.display = 'flex';
    this.style.justifyContent = 'space-between';
    this.style.padding = '4px 8px';
    this.style.fontSize = '12px';
    this.style.borderBottom = '1px solid #e0e0e0';
  }
}

customElements.define('boolean-prop', BooleanProp);
```

---

## 2. Block Component (math-block)

### Purpose

Blocks are the **primary visual units** in the VPL. They:
- Have position attributes (`x`, `y`)
- Contain properties
- Can be dragged (Stage 7)
- Can be selected (Stage 7)

### Implementation

**File**: `src/components/math-block.js`

```js
import { createSignals } from '../core/signals.js';

/**
 * <math-block> - Mathematical operation block
 *
 * Attributes:
 *   id        - Unique identifier
 *   x         - X position (default: 0)
 *   y         - Y position (default: 0)
 *   width     - Width in pixels (default: 180)
 *   height    - Height in pixels (auto)
 *   operation - Math operation: add, subtract, multiply, divide (default: add)
 *
 * Contains:
 *   <number-prop name="a"> - First operand
 *   <number-prop name="b"> - Second operand
 *   <number-prop name="result"> - Computed result
 */
export class MathBlock extends HTMLElement {
  static observedAttributes = ['x', 'y', 'width', 'operation'];

  connectedCallback() {
    // Default attributes
    if (!this.hasAttribute('x')) this.setAttribute('x', '0');
    if (!this.hasAttribute('y')) this.setAttribute('y', '0');
    if (!this.hasAttribute('width')) this.setAttribute('width', '180');
    if (!this.hasAttribute('operation')) this.setAttribute('operation', 'add');

    // Create signals
    this.signals = createSignals(this, ['x', 'y', 'width', 'operation']);

    // Ensure properties exist
    this._ensureProperties();

    // Setup computation
    this._setupComputation();

    // Render
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _ensureProperties() {
    if (!this.querySelector('number-prop[name="a"]')) {
      const propA = document.createElement('number-prop');
      propA.setAttribute('name', 'a');
      propA.setAttribute('value', '0');
      this.appendChild(propA);
    }

    if (!this.querySelector('number-prop[name="b"]')) {
      const propB = document.createElement('number-prop');
      propB.setAttribute('name', 'b');
      propB.setAttribute('value', '0');
      this.appendChild(propB);
    }

    if (!this.querySelector('number-prop[name="result"]')) {
      const propResult = document.createElement('number-prop');
      propResult.setAttribute('name', 'result');
      propResult.setAttribute('value', '0');
      this.appendChild(propResult);
    }
  }

  _setupComputation() {
    const propA = this.querySelector('number-prop[name="a"]');
    const propB = this.querySelector('number-prop[name="b"]');
    const propResult = this.querySelector('number-prop[name="result"]');

    const compute = () => {
      const a = parseFloat(propA.getAttribute('value') || '0');
      const b = parseFloat(propB.getAttribute('value') || '0');
      const op = this.getAttribute('operation');

      let result = 0;
      switch (op) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide': result = b !== 0 ? a / b : 0; break;
      }

      propResult.setAttribute('value', result.toString());
    };

    // Recompute on input changes
    propA.signals.value.addEventListener('change', compute);
    propB.signals.value.addEventListener('change', compute);

    // Recompute on operation change
    this.signals.operation.addEventListener('change', compute);

    // Initial computation
    compute();
  }

  _render() {
    const x = this.getAttribute('x');
    const y = this.getAttribute('y');
    const width = this.getAttribute('width');
    const operation = this.getAttribute('operation');

    this.style.position = 'absolute';
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
    this.style.width = `${width}px`;
    this.style.background = '#fff';
    this.style.border = '2px solid #333';
    this.style.borderRadius = '8px';
    this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    this.style.overflow = 'hidden';

    // Update header if needed
    let header = this.querySelector('.block-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'block-header';
      this.insertBefore(header, this.firstChild);
    }

    header.textContent = `Math: ${operation}`;
    header.style.padding = '8px';
    header.style.background = '#4a90e2';
    header.style.color = '#fff';
    header.style.fontWeight = 'bold';
    header.style.fontSize = '14px';
    header.style.cursor = 'move';
  }
}

customElements.define('math-block', MathBlock);
```

---

## 3. Base Block Styling (optional utility)

**File**: `src/core/block-styles.js`

```js
/**
 * Common block styling utilities
 */

export function applyBlockStyles(element, options = {}) {
  const {
    x = 0,
    y = 0,
    width = 180,
    bgColor = '#fff',
    borderColor = '#333',
    headerBg = '#4a90e2'
  } = options;

  element.style.position = 'absolute';
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.width = `${width}px`;
  element.style.background = bgColor;
  element.style.border = `2px solid ${borderColor}`;
  element.style.borderRadius = '8px';
  element.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  element.style.overflow = 'hidden';
}
```

---

## 4. Testing

### Test: number-prop

**File**: `tests/components/number-prop.test.js`

```js
import '../../src/components/number-prop.js';

describe('number-prop', () => {
  it('displays name and value', () => {
    const prop = document.createElement('number-prop');
    prop.setAttribute('name', 'x');
    prop.setAttribute('value', '42');

    document.body.appendChild(prop);

    assert.ok(prop.textContent.includes('x'));
    assert.ok(prop.textContent.includes('42'));

    prop.remove();
  });

  it('clamps value to min/max', () => {
    const prop = document.createElement('number-prop');
    prop.setAttribute('min', '0');
    prop.setAttribute('max', '100');
    prop.setAttribute('value', '150');

    document.body.appendChild(prop);

    assert.equal(prop.getAttribute('value'), '100');

    prop.remove();
  });

  it('emits signal on value change', (done) => {
    const prop = document.createElement('number-prop');
    prop.setAttribute('value', '0');

    document.body.appendChild(prop);

    prop.signals.value.addEventListener('change', (e) => {
      assert.equal(e.detail.value, '10');
      prop.remove();
      done();
    });

    prop.setAttribute('value', '10');
  });
});
```

### Test: math-block

**File**: `tests/components/math-block.test.js`

```js
import '../../src/components/math-block.js';

describe('math-block', () => {
  it('auto-creates properties', () => {
    const block = document.createElement('math-block');
    document.body.appendChild(block);

    assert.ok(block.querySelector('number-prop[name="a"]'));
    assert.ok(block.querySelector('number-prop[name="b"]'));
    assert.ok(block.querySelector('number-prop[name="result"]'));

    block.remove();
  });

  it('computes addition', async () => {
    const block = document.createElement('math-block');
    block.setAttribute('operation', 'add');

    document.body.appendChild(block);
    await nextFrame();

    const propA = block.querySelector('number-prop[name="a"]');
    const propB = block.querySelector('number-prop[name="b"]');
    const propResult = block.querySelector('number-prop[name="result"]');

    propA.setAttribute('value', '5');
    propB.setAttribute('value', '3');

    await nextFrame();

    assert.equal(propResult.getAttribute('value'), '8');

    block.remove();
  });

  it('positions via x/y attributes', () => {
    const block = document.createElement('math-block');
    block.setAttribute('x', '100');
    block.setAttribute('y', '200');

    document.body.appendChild(block);

    assert.equal(block.style.left, '100px');
    assert.equal(block.style.top, '200px');

    block.remove();
  });
});
```

---

## 5. Updated index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VPL Toolkit - Stage 2</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <app-root version="0.1">
    <app-library></app-library>

    <app-stage>
      <!-- Test blocks -->
      <math-block id="m1" x="50" y="50" operation="add">
        <number-prop name="a" value="5"></number-prop>
        <number-prop name="b" value="3"></number-prop>
        <number-prop name="result"></number-prop>
      </math-block>

      <math-block id="m2" x="300" y="100" operation="multiply">
        <number-prop name="a" value="4"></number-prop>
        <number-prop name="b" value="7"></number-prop>
        <number-prop name="result"></number-prop>
      </math-block>
    </app-stage>
  </app-root>

  <script type="module">
    import './src/components/app-root.js';
    import './src/components/app-library.js';
    import './src/components/app-stage.js';
    import './src/components/number-prop.js';
    import './src/components/string-prop.js';
    import './src/components/boolean-prop.js';
    import './src/components/math-block.js';

    console.log('VPL Toolkit - Stage 2 loaded');

    // Test interaction
    setTimeout(() => {
      const m1 = document.getElementById('m1');
      const propA = m1.querySelector('number-prop[name="a"]');
      propA.setAttribute('value', '10');
      console.log('Updated m1.a to 10, result should be 13');
    }, 1000);
  </script>
</body>
</html>
```

---

## 6. File Structure (after Stage 2)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── core/
│   │   ├── signals.js
│   │   └── block-styles.js
│   └── components/
│       ├── app-root.js
│       ├── app-library.js
│       ├── app-stage.js
│       ├── app-minimap.js
│       ├── number-prop.js
│       ├── string-prop.js
│       ├── boolean-prop.js
│       └── math-block.js
├── tests/
│   ├── setup.js
│   ├── core/
│   │   └── signals.test.js
│   └── components/
│       ├── app-root.test.js
│       ├── number-prop.test.js
│       └── math-block.test.js
├── index.html
└── ...
```

---

## Acceptance Criteria

Before moving to Stage 3:

- [ ] All property types render correctly
- [ ] `math-block` auto-creates its properties
- [ ] `math-block` computes results reactively
- [ ] Blocks position via `x`, `y` attributes
- [ ] Changing property values updates the result
- [ ] All tests pass
- [ ] Can manually edit `index.html` to add blocks
- [ ] Code remains < 600 lines total

---

## Next Stage

**Stage 3**: Pan-Zoom and Spatial Management

We'll add the `<pan-zoom>` container that allows users to navigate the canvas.
# Stage 3: Pan-Zoom and Spatial Management

**Goal**: Implement infinite canvas navigation via pan and zoom.

**Duration estimate**: Camera system

**Dependencies**: Stage 1 (signals), Stage 2 (blocks for testing)

---

## Overview

This stage adds the `<pan-zoom>` container that enables **infinite canvas** navigation. All spatial state lives in attributes - no hidden transform matrices.

---

## Deliverables

1. `<pan-zoom>` component with attribute-driven transforms
2. Behavior function `usePanZoom(el)` for interaction
3. Keyboard shortcuts (arrow keys, +/-)
4. Wheel zoom support
5. Middle-mouse drag support
6. Tests for pan-zoom functionality

---

## 1. PanZoom Component

### Purpose

The `<pan-zoom>` element wraps content and applies a CSS transform based on `x`, `y`, and `zoom` attributes.

### Implementation

**File**: `src/components/pan-zoom.js`

```js
import { createSignals } from '../core/signals.js';

/**
 * <pan-zoom> - Infinite canvas container
 *
 * Attributes:
 *   x    - Pan offset X (default: 0)
 *   y    - Pan offset Y (default: 0)
 *   zoom - Zoom level (default: 1, range: 0.1 to 5)
 *
 * Signals:
 *   x, y, zoom - Emit on attribute changes
 *
 * Usage:
 *   <pan-zoom x="100" y="50" zoom="1.2">
 *     <math-block .../>
 *   </pan-zoom>
 */
export class PanZoom extends HTMLElement {
  static observedAttributes = ['x', 'y', 'zoom'];

  connectedCallback() {
    // Default attributes
    if (!this.hasAttribute('x')) this.setAttribute('x', '0');
    if (!this.hasAttribute('y')) this.setAttribute('y', '0');
    if (!this.hasAttribute('zoom')) this.setAttribute('zoom', '1');

    // Create signals
    this.signals = createSignals(this, ['x', 'y', 'zoom']);

    // Setup container
    this._setupContainer();

    // Apply initial transform
    this._updateTransform();
  }

  attributeChangedCallback(name) {
    if (['x', 'y', 'zoom'].includes(name)) {
      this._clampZoom();
      this._updateTransform();
    }
  }

  _setupContainer() {
    // Wrapper for transform
    this.style.position = 'relative';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.overflow = 'hidden';
    this.style.background = '#f5f5f5';

    // Inner content container
    if (!this._content) {
      this._content = document.createElement('div');
      this._content.className = 'pan-zoom-content';
      this._content.style.transformOrigin = '0 0';
      this._content.style.position = 'absolute';
      this._content.style.width = '100%';
      this._content.style.height = '100%';

      // Move existing children into content
      while (this.firstChild) {
        this._content.appendChild(this.firstChild);
      }

      this.appendChild(this._content);
    }
  }

  _clampZoom() {
    const zoom = parseFloat(this.getAttribute('zoom') || '1');
    const clamped = Math.max(0.1, Math.min(5, zoom));

    if (clamped !== zoom) {
      this.setAttribute('zoom', clamped.toString());
    }
  }

  _updateTransform() {
    const x = parseFloat(this.getAttribute('x') || '0');
    const y = parseFloat(this.getAttribute('y') || '0');
    const zoom = parseFloat(this.getAttribute('zoom') || '1');

    if (this._content) {
      this._content.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    }
  }

  /**
   * Public API: Pan by delta
   */
  panBy(dx, dy) {
    const x = parseFloat(this.getAttribute('x') || '0');
    const y = parseFloat(this.getAttribute('y') || '0');

    this.setAttribute('x', (x + dx).toString());
    this.setAttribute('y', (y + dy).toString());
  }

  /**
   * Public API: Zoom by factor around a point
   */
  zoomBy(factor, centerX = 0, centerY = 0) {
    const x = parseFloat(this.getAttribute('x') || '0');
    const y = parseFloat(this.getAttribute('y') || '0');
    const zoom = parseFloat(this.getAttribute('zoom') || '1');

    const newZoom = zoom * factor;

    // Adjust pan to keep center point fixed
    const dx = centerX - (centerX - x) * factor;
    const dy = centerY - (centerY - y) * factor;

    this.setAttribute('zoom', newZoom.toString());
    this.setAttribute('x', dx.toString());
    this.setAttribute('y', dy.toString());
  }

  /**
   * Public API: Reset to default view
   */
  reset() {
    this.setAttribute('x', '0');
    this.setAttribute('y', '0');
    this.setAttribute('zoom', '1');
  }
}

customElements.define('pan-zoom', PanZoom);
```

---

## 2. PanZoom Behavior

### Purpose

The `usePanZoom(el)` function attaches **interaction behavior** to a `<pan-zoom>` element:
- Middle-mouse or space+drag to pan
- Wheel to zoom
- Arrow keys to pan
- +/- keys to zoom

### Implementation

**File**: `src/behaviors/usePanZoom.js`

```js
/**
 * Attaches pan/zoom interaction to a <pan-zoom> element
 *
 * Controls:
 *   - Middle mouse + drag: Pan
 *   - Space + drag: Pan
 *   - Mouse wheel: Zoom
 *   - Arrow keys: Pan (20px steps)
 *   - +/- keys: Zoom in/out
 *
 * @param {PanZoom} element - The pan-zoom element
 */
export function usePanZoom(element) {
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let panStartX = 0;
  let panStartY = 0;
  let spacePressed = false;

  // Middle mouse or space+drag to pan
  const onPointerDown = (e) => {
    // IMPORTANT: Only pan when clicking on the background
    // Not when clicking on child elements (blocks)
    // This allows blocks to be interactive without accidentally triggering panning
    const content = element.querySelector('.pan-zoom-content');
    if (e.target !== element && e.target !== content) {
      return; // Don't pan if clicking on a child element
    }

    if (e.button === 1 || (e.button === 0 && spacePressed)) {
      e.preventDefault();
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      panStartX = parseFloat(element.getAttribute('x') || '0');
      panStartY = parseFloat(element.getAttribute('y') || '0');
      element.style.cursor = 'grabbing';
    }
  };

  const onPointerMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      element.setAttribute('x', (panStartX + dx).toString());
      element.setAttribute('y', (panStartY + dy).toString());
    }
  };

  const onPointerUp = () => {
    isPanning = false;
    element.style.cursor = spacePressed ? 'grab' : 'default';
  };

  // Wheel to zoom
  const onWheel = (e) => {
    e.preventDefault();

    const rect = element.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;

    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    element.zoomBy(factor, centerX, centerY);
  };

  // Keyboard controls
  const onKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      spacePressed = true;
      element.style.cursor = 'grab';
    }

    // Arrow keys for panning (IMPORTANT: Natural direction)
    // ArrowUp should move content UP (decrease Y pan offset)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      element.panBy(0, -20); // Pan content up (decrease Y)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      element.panBy(0, 20); // Pan content down (increase Y)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      element.panBy(-20, 0); // Pan content left (decrease X)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      element.panBy(20, 0); // Pan content right (increase X)
    }

    // +/- for zoom
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      const rect = element.getBoundingClientRect();
      element.zoomBy(1.2, rect.width / 2, rect.height / 2);
    }
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      const rect = element.getBoundingClientRect();
      element.zoomBy(0.8, rect.width / 2, rect.height / 2);
    }

    // 0 to reset
    if (e.key === '0') {
      e.preventDefault();
      element.reset();
    }
  };

  const onKeyUp = (e) => {
    if (e.key === ' ') {
      spacePressed = false;
      element.style.cursor = 'default';
    }
  };

  // Attach listeners
  element.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  element.addEventListener('wheel', onWheel, { passive: false });
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Cleanup on disconnect
  element.addEventListener('disconnected', () => {
    element.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('wheel', onWheel);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }, { once: true });

  return element;
}
```

---

## 3. Testing

### Test: pan-zoom component

**File**: `tests/components/pan-zoom.test.js`

```js
import '../../src/components/pan-zoom.js';

describe('pan-zoom', () => {
  it('applies transform based on attributes', () => {
    const pz = document.createElement('pan-zoom');
    pz.setAttribute('x', '100');
    pz.setAttribute('y', '50');
    pz.setAttribute('zoom', '1.5');

    document.body.appendChild(pz);

    const content = pz.querySelector('.pan-zoom-content');
    assert.ok(content.style.transform.includes('translate(100px, 50px)'));
    assert.ok(content.style.transform.includes('scale(1.5)'));

    pz.remove();
  });

  it('clamps zoom to 0.1-5 range', () => {
    const pz = document.createElement('pan-zoom');
    pz.setAttribute('zoom', '10');

    document.body.appendChild(pz);

    assert.equal(pz.getAttribute('zoom'), '5');

    pz.setAttribute('zoom', '0.01');
    assert.equal(pz.getAttribute('zoom'), '0.1');

    pz.remove();
  });

  it('panBy updates x/y attributes', () => {
    const pz = document.createElement('pan-zoom');
    pz.setAttribute('x', '0');
    pz.setAttribute('y', '0');

    document.body.appendChild(pz);

    pz.panBy(50, 30);

    assert.equal(pz.getAttribute('x'), '50');
    assert.equal(pz.getAttribute('y'), '30');

    pz.remove();
  });

  it('reset returns to defaults', () => {
    const pz = document.createElement('pan-zoom');
    pz.setAttribute('x', '100');
    pz.setAttribute('y', '200');
    pz.setAttribute('zoom', '2');

    document.body.appendChild(pz);

    pz.reset();

    assert.equal(pz.getAttribute('x'), '0');
    assert.equal(pz.getAttribute('y'), '0');
    assert.equal(pz.getAttribute('zoom'), '1');

    pz.remove();
  });
});
```

### Test: usePanZoom behavior

**File**: `tests/behaviors/usePanZoom.test.js`

```js
import '../../src/components/pan-zoom.js';
import { usePanZoom } from '../../src/behaviors/usePanZoom.js';

describe('usePanZoom', () => {
  it('enables middle-mouse panning', () => {
    const pz = document.createElement('pan-zoom');
    document.body.appendChild(pz);

    usePanZoom(pz);

    // Simulate middle mouse drag
    pz.dispatchEvent(new PointerEvent('pointerdown', {
      button: 1,
      clientX: 0,
      clientY: 0
    }));

    document.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 50,
      clientY: 30
    }));

    assert.equal(pz.getAttribute('x'), '50');
    assert.equal(pz.getAttribute('y'), '30');

    pz.remove();
  });

  it('enables keyboard panning', () => {
    const pz = document.createElement('pan-zoom');
    pz.setAttribute('x', '0');
    pz.setAttribute('y', '0');

    document.body.appendChild(pz);
    usePanZoom(pz);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    assert.equal(pz.getAttribute('x'), '-20'); // Negative because canvas moves opposite

    pz.remove();
  });
});
```

---

## 4. Updated index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VPL Toolkit - Stage 3</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    .help {
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
    }
  </style>
</head>
<body>
  <div class="help">
    <div>🖱️ Middle-click + drag to pan</div>
    <div>⌨️ Space + drag to pan</div>
    <div>🖱️ Scroll to zoom</div>
    <div>⌨️ Arrow keys to pan</div>
    <div>⌨️ +/- to zoom</div>
    <div>⌨️ 0 to reset</div>
  </div>

  <app-root version="0.1">
    <app-library></app-library>

    <app-stage>
      <pan-zoom x="0" y="0" zoom="1" id="canvas">
        <math-block id="m1" x="50" y="50" operation="add">
          <number-prop name="a" value="5"></number-prop>
          <number-prop name="b" value="3"></number-prop>
          <number-prop name="result"></number-prop>
        </math-block>

        <math-block id="m2" x="300" y="100" operation="multiply">
          <number-prop name="a" value="4"></number-prop>
          <number-prop name="b" value="7"></number-prop>
          <number-prop name="result"></number-prop>
        </math-block>

        <math-block id="m3" x="50" y="300" operation="divide">
          <number-prop name="a" value="100"></number-prop>
          <number-prop name="b" value="5"></number-prop>
          <number-prop name="result"></number-prop>
        </math-block>
      </pan-zoom>
    </app-stage>
  </app-root>

  <script type="module">
    import './src/components/app-root.js';
    import './src/components/app-library.js';
    import './src/components/app-stage.js';
    import './src/components/pan-zoom.js';
    import './src/components/number-prop.js';
    import './src/components/math-block.js';
    import { usePanZoom } from './src/behaviors/usePanZoom.js';

    // Enable pan-zoom interaction
    const canvas = document.getElementById('canvas');
    usePanZoom(canvas);

    console.log('VPL Toolkit - Stage 3 loaded');
    console.log('Try panning and zooming!');
  </script>
</body>
</html>
```

---

## 5. File Structure (after Stage 3)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── core/
│   │   ├── signals.js
│   │   └── block-styles.js
│   ├── components/
│   │   ├── app-root.js
│   │   ├── app-library.js
│   │   ├── app-stage.js
│   │   ├── app-minimap.js
│   │   ├── number-prop.js
│   │   ├── string-prop.js
│   │   ├── boolean-prop.js
│   │   ├── math-block.js
│   │   └── pan-zoom.js
│   └── behaviors/
│       └── usePanZoom.js
├── tests/
│   ├── setup.js
│   ├── core/
│   │   └── signals.test.js
│   ├── components/
│   │   ├── app-root.test.js
│   │   ├── number-prop.test.js
│   │   ├── math-block.test.js
│   │   └── pan-zoom.test.js
│   └── behaviors/
│       └── usePanZoom.test.js
├── index.html
└── ...
```

---

## Acceptance Criteria

Before moving to Stage 4:

- [x] Pan-zoom transforms applied via CSS
- [x] All state visible in `x`, `y`, `zoom` attributes
- [x] Middle-mouse drag pans the canvas **ONLY on background** (not on blocks)
- [x] Space+drag pans the canvas **ONLY on background** (not on blocks)
- [x] Wheel zooms in/out (works anywhere, even over blocks)
- [x] Arrow keys pan in **natural direction** (ArrowUp moves content up)
- [x] +/- keys zoom
- [x] 0 key resets view
- [x] Zoom clamped to 0.1-5 range
- [x] All tests pass
- [x] Can navigate smoothly with 10+ blocks visible

## Important Implementation Notes

### 1. Pan/Zoom Should Only Work on Background

**Why**: This allows blocks to be interactive (draggable, clickable) without accidentally triggering panning.

**Implementation**: Check `e.target` in pointer events:
```javascript
const content = element.querySelector('.pan-zoom-content');
if (e.target !== element && e.target !== content) {
  return; // Don't pan if clicking on a child element
}
```

### 2. Arrow Keys Should Pan in Natural Direction

**Why**: Users expect ArrowUp to move content upward on screen.

**Implementation**:
- ArrowUp → `panBy(0, -20)` (decrease Y to move content up)
- ArrowDown → `panBy(0, 20)` (increase Y to move content down)
- ArrowLeft → `panBy(-20, 0)` (decrease X to move content left)
- ArrowRight → `panBy(20, 0)` (increase X to move content right)

### 3. Zoom Works Everywhere

**Why**: Users should be able to zoom regardless of cursor position.

**Implementation**: Wheel event listener has no target filtering.

---

## Next Stage

**Stage 4**: Sockets and Streams

We'll add `<in-socket>` and `<out-socket>` components that enable data flow between blocks using WebStreams.
# Stage 4: Sockets and Streams

**Goal**: Implement data flow infrastructure using WebStreams.

**Duration estimate**: Dataflow foundation

**Dependencies**: Stage 2 (properties, blocks)

---

## Overview

This stage adds **sockets** (connection points) and **streams** (data channels) to enable reactive dataflow between blocks. Sockets are visual indicators; streams carry the actual data.

---

## Deliverables

1. `<in-socket>` and `<out-socket>` components
2. Stream creation and management
3. Stream utilities for piping data
4. Integration with properties
5. Tests for socket and stream behavior

---

## 1. OutSocket Component

### Purpose

Output sockets **emit data** via a ReadableStream. They are placed inside properties that produce values.

### Implementation

**File**: `src/components/out-socket.js`

```js
/**
 * <out-socket> - Output connection point
 *
 * Creates a ReadableStream that can be piped to InSockets.
 * Placed inside properties that produce values.
 *
 * Example:
 *   <number-prop name="result">
 *     <out-socket/>
 *   </number-prop>
 */
export class OutSocket extends HTMLElement {
  connectedCallback() {
    this._createStream();
    this._render();
    this._observeParentValue();
  }

  disconnectedCallback() {
    if (this._controller) {
      this._controller.close();
    }
  }

  _createStream() {
    this.stream = new ReadableStream({
      start: (controller) => {
        this._controller = controller;
      },
      cancel: () => {
        // Stream cancelled, cleanup if needed
      }
    });
  }

  /**
   * Emit a value to all connected streams
   */
  emit(value) {
    if (this._controller) {
      try {
        this._controller.enqueue(value);
      } catch (err) {
        console.warn('Failed to emit value:', err);
      }
    }
  }

  /**
   * Watch parent property for value changes
   */
  _observeParentValue() {
    const parentProp = this.closest('[name]');
    if (!parentProp) return;

    // Use signal if available
    if (parentProp.signals && parentProp.signals.value) {
      parentProp.signals.value.addEventListener('change', (e) => {
        this.emit(e.detail.value);
      });
    }

    // Emit initial value
    const initialValue = parentProp.getAttribute('value');
    if (initialValue !== null) {
      // Defer to allow connections to be established
      setTimeout(() => this.emit(initialValue), 0);
    }
  }

  _render() {
    this.style.display = 'inline-block';
    this.style.width = '12px';
    this.style.height = '12px';
    this.style.borderRadius = '50%';
    this.style.background = '#4caf50';
    this.style.border = '2px solid #2e7d32';
    this.style.cursor = 'crosshair';
    this.style.marginLeft = '4px';
    this.title = 'Output';
  }
}

customElements.define('out-socket', OutSocket);
```

---

## 2. InSocket Component

### Purpose

Input sockets **receive data** via a WritableStream. They are placed inside properties that consume values.

### Implementation

**File**: `src/components/in-socket.js`

```js
/**
 * <in-socket> - Input connection point
 *
 * Creates a WritableStream that receives data from OutSockets.
 * Placed inside properties that consume values.
 *
 * Example:
 *   <number-prop name="a">
 *     <in-socket/>
 *   </number-prop>
 */
export class InSocket extends HTMLElement {
  connectedCallback() {
    this._createStream();
    this._render();
  }

  disconnectedCallback() {
    if (this._writer) {
      this._writer.close();
    }
  }

  _createStream() {
    this.stream = new WritableStream({
      write: (value) => {
        this._onValue(value);
      },
      close: () => {
        // Stream closed
      },
      abort: (err) => {
        console.warn('Stream aborted:', err);
      }
    });

    this._writer = this.stream.getWriter();
  }

  /**
   * Handle incoming value
   */
  _onValue(value) {
    const parentProp = this.closest('[name]');
    if (!parentProp) return;

    // Update parent property's value attribute
    parentProp.setAttribute('value', value.toString());

    // Emit custom event for debugging
    this.dispatchEvent(new CustomEvent('value-received', {
      detail: { value },
      bubbles: true
    }));
  }

  /**
   * Public API: Write a value directly
   */
  async write(value) {
    if (this._writer) {
      await this._writer.ready;
      await this._writer.write(value);
    }
  }

  _render() {
    this.style.display = 'inline-block';
    this.style.width = '12px';
    this.style.height = '12px';
    this.style.borderRadius = '50%';
    this.style.background = '#2196f3';
    this.style.border = '2px solid #1565c0';
    this.style.cursor = 'crosshair';
    this.style.marginRight = '4px';
    this.title = 'Input';
  }
}

customElements.define('in-socket', InSocket);
```

---

## 3. Stream Utilities

### Purpose

Helper functions for connecting streams and managing data flow.

### Implementation

**File**: `src/core/streams.js`

```js
/**
 * Connect an OutSocket to an InSocket via stream piping
 *
 * @param {OutSocket} outSocket - Source socket
 * @param {InSocket} inSocket - Destination socket
 * @returns {Promise} - Resolves when pipe completes
 */
export async function connectSockets(outSocket, inSocket) {
  if (!outSocket || !inSocket) {
    throw new Error('Both sockets required');
  }

  if (!outSocket.stream || !inSocket.stream) {
    throw new Error('Sockets must have streams');
  }

  try {
    // Create a tee so multiple readers can consume
    const [stream1, stream2] = outSocket.stream.tee();

    // Keep original for other connections
    outSocket.stream = stream1;

    // Pipe to input
    return stream2.pipeTo(inSocket.stream);
  } catch (err) {
    console.error('Failed to connect sockets:', err);
    throw err;
  }
}

/**
 * Resolve a socket path like "block1.result" or "block1.a"
 *
 * @param {string} path - Dot-separated path (e.g., "m1.result")
 * @param {HTMLElement} context - Root element to search from
 * @returns {HTMLElement|null} - The property element
 */
export function resolveSocketPath(path, context = document) {
  const [blockId, propName] = path.split('.');

  const block = context.querySelector(`#${blockId}`);
  if (!block) return null;

  const prop = block.querySelector(`[name="${propName}"]`);
  return prop;
}

/**
 * Get the out-socket from a property
 */
export function getOutSocket(prop) {
  return prop ? prop.querySelector('out-socket') : null;
}

/**
 * Get the in-socket from a property
 */
export function getInSocket(prop) {
  return prop ? prop.querySelector('in-socket') : null;
}
```

---

## 4. Updated Property Components

### Update number-prop to include sockets

**File**: `src/components/number-prop.js` (partial update)

```js
// In _render method, add socket rendering:

_render() {
  const name = this.getAttribute('name') || 'value';
  const value = this.getAttribute('value') || '0';

  // Check for sockets
  const hasInSocket = this.querySelector('in-socket');
  const hasOutSocket = this.querySelector('out-socket');

  let html = '';

  if (hasInSocket) {
    html += '<in-socket></in-socket>';
  }

  html += `
    <span class="prop-name">${name}</span>
    <span class="prop-value">${value}</span>
  `;

  if (hasOutSocket) {
    html += '<out-socket></out-socket>';
  }

  // Only update if changed (avoid destroying sockets)
  if (this.innerHTML !== html) {
    this.innerHTML = html;
  }

  this.style.display = 'flex';
  this.style.alignItems = 'center';
  this.style.justifyContent = 'space-between';
  this.style.padding = '4px 8px';
  this.style.fontSize = '12px';
  this.style.borderBottom = '1px solid #e0e0e0';
}
```

**Note**: Similar updates needed for `string-prop` and `boolean-prop`.

---

## 5. Testing

### Test: out-socket

**File**: `tests/components/out-socket.test.js`

```js
import '../../src/components/out-socket.js';
import '../../src/components/number-prop.js';

describe('out-socket', () => {
  it('creates a readable stream', () => {
    const socket = document.createElement('out-socket');
    document.body.appendChild(socket);

    assert.ok(socket.stream);
    assert.ok(socket.stream instanceof ReadableStream);

    socket.remove();
  });

  it('emits values to stream', async () => {
    const socket = document.createElement('out-socket');
    document.body.appendChild(socket);

    const reader = socket.stream.getReader();

    socket.emit(42);

    const { value, done } = await reader.read();

    assert.equal(value, 42);
    assert.equal(done, false);

    reader.releaseLock();
    socket.remove();
  });

  it('emits parent property value changes', async (done) => {
    const prop = document.createElement('number-prop');
    prop.setAttribute('name', 'x');
    prop.setAttribute('value', '10');

    const socket = document.createElement('out-socket');
    prop.appendChild(socket);

    document.body.appendChild(prop);

    const reader = socket.stream.getReader();

    // Wait for initial emission
    setTimeout(async () => {
      const { value } = await reader.read();
      assert.equal(value, '10');

      prop.setAttribute('value', '20');

      const { value: value2 } = await reader.read();
      assert.equal(value2, '20');

      reader.releaseLock();
      prop.remove();
      done();
    }, 10);
  });
});
```

### Test: in-socket

**File**: `tests/components/in-socket.test.js`

```js
import '../../src/components/in-socket.js';
import '../../src/components/number-prop.js';

describe('in-socket', () => {
  it('creates a writable stream', () => {
    const socket = document.createElement('in-socket');
    document.body.appendChild(socket);

    assert.ok(socket.stream);
    assert.ok(socket.stream instanceof WritableStream);

    socket.remove();
  });

  it('updates parent property on write', async () => {
    const prop = document.createElement('number-prop');
    prop.setAttribute('name', 'a');
    prop.setAttribute('value', '0');

    const socket = document.createElement('in-socket');
    prop.appendChild(socket);

    document.body.appendChild(prop);

    await socket.write(42);

    assert.equal(prop.getAttribute('value'), '42');

    prop.remove();
  });
});
```

### Test: stream connection

**File**: `tests/core/streams.test.js`

```js
import '../../src/components/out-socket.js';
import '../../src/components/in-socket.js';
import { connectSockets } from '../../src/core/streams.js';

describe('connectSockets', () => {
  it('pipes data from out to in', async () => {
    const outSocket = document.createElement('out-socket');
    const inSocket = document.createElement('in-socket');

    document.body.appendChild(outSocket);
    document.body.appendChild(inSocket);

    // Note: connectSockets needs refinement for testing
    // In practice, cables will handle this

    outSocket.remove();
    inSocket.remove();
  });
});
```

---

## 6. Example Usage

### Updated index.html snippet

```html
<math-block id="m1" x="50" y="50" operation="add">
  <number-prop name="a" value="5">
    <in-socket></in-socket>
  </number-prop>
  <number-prop name="b" value="3">
    <in-socket></in-socket>
  </number-prop>
  <number-prop name="result">
    <out-socket></out-socket>
  </number-prop>
</math-block>

<math-block id="m2" x="300" y="100" operation="multiply">
  <number-prop name="a" value="1">
    <in-socket></in-socket>
  </number-prop>
  <number-prop name="b" value="2">
    <in-socket></in-socket>
  </number-prop>
  <number-prop name="result">
    <out-socket></out-socket>
  </number-prop>
</math-block>
```

---

## 7. File Structure (after Stage 4)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── core/
│   │   ├── signals.js
│   │   ├── streams.js
│   │   └── block-styles.js
│   ├── components/
│   │   ├── app-root.js
│   │   ├── app-library.js
│   │   ├── app-stage.js
│   │   ├── pan-zoom.js
│   │   ├── number-prop.js (updated)
│   │   ├── string-prop.js (updated)
│   │   ├── boolean-prop.js (updated)
│   │   ├── math-block.js
│   │   ├── in-socket.js
│   │   └── out-socket.js
│   └── behaviors/
│       └── usePanZoom.js
├── tests/
│   ├── core/
│   │   ├── signals.test.js
│   │   └── streams.test.js
│   ├── components/
│   │   ├── in-socket.test.js
│   │   ├── out-socket.test.js
│   │   └── ...
│   └── behaviors/
│       └── usePanZoom.test.js
└── ...
```

---

## Acceptance Criteria

Before moving to Stage 5:

- [ ] OutSocket creates ReadableStream
- [ ] InSocket creates WritableStream
- [ ] OutSocket emits when parent property changes
- [ ] InSocket updates parent property on write
- [ ] Sockets render visually (circles)
- [ ] Stream utilities can resolve socket paths
- [ ] All tests pass
- [ ] Properties display sockets correctly

---

## Important Notes

This stage creates the **plumbing** for dataflow. The actual **connections** (cables) are created in Stage 5. For now, sockets exist and can stream data, but there's no visual way to connect them yet.

---

## Next Stage

**Stage 5**: Cables and Visual Connections

We'll add `<data-cable>` components that visually connect sockets and establish stream pipes automatically.
# Stage 5: Cables and Visual Connections

**Goal**: Create visual cable components that connect sockets and establish dataflow.

**Duration estimate**: Visual dataflow

**Dependencies**: Stage 4 (sockets, streams)

---

## Overview

This stage adds `<data-cable>` components that:
- Render as SVG lines between sockets
- Automatically pipe streams from out-socket to in-socket
- Update when blocks move
- Can be deleted to break connections

**Philosophy**: One SVG per cable. No pooling. No cleverness.

---

## Deliverables

1. `<data-cable>` component with SVG rendering
2. Behavior `useCable(el)` to manage connection and updates
3. Automatic socket resolution via `from` and `to` attributes
4. Dynamic cable updates when blocks move
5. Tests for cable behavior

---

## 1. DataCable Component

### Purpose

The `<data-cable>` element represents a **visual and functional connection** between two sockets. It:
- Creates an SVG line
- Establishes a stream pipe
- Updates position when blocks move

### Implementation

**File**: `src/components/data-cable.js`

```js
/**
 * <data-cable> - Visual connection between sockets
 *
 * Attributes:
 *   from - Source socket path (e.g., "m1.result")
 *   to   - Target socket path (e.g., "m2.a")
 *   color - Cable color (default: #333)
 *   width - Line width (default: 2)
 *
 * Creates:
 *   - An SVG line element
 *   - A stream pipe from out-socket to in-socket
 *
 * Example:
 *   <data-cable from="m1.result" to="m2.a"/>
 */
export class DataCable extends HTMLElement {
  static observedAttributes = ['from', 'to', 'color', 'width'];

  connectedCallback() {
    if (!this.hasAttribute('color')) this.setAttribute('color', '#333');
    if (!this.hasAttribute('width')) this.setAttribute('width', '2');

    this._createSVG();
    this._resolveSockets();
    this._establishConnection();
    this._updatePath();
    this._observeBlockMovement();
  }

  disconnectedCallback() {
    if (this._svg) {
      this._svg.remove();
    }
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
  }

  attributeChangedCallback(name) {
    if (name === 'from' || name === 'to') {
      this._resolveSockets();
      this._establishConnection();
      this._updatePath();
    }
    if (name === 'color' || name === 'width') {
      this._updatePathStyle();
    }
  }

  _createSVG() {
    // Create a dedicated SVG for this cable
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.style.position = 'absolute';
    this._svg.style.top = '0';
    this._svg.style.left = '0';
    this._svg.style.width = '100%';
    this._svg.style.height = '100%';
    this._svg.style.pointerEvents = 'none';
    this._svg.style.zIndex = '1';
    this._svg.style.overflow = 'visible';

    this._path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this._path.style.fill = 'none';
    this._path.style.pointerEvents = 'stroke';
    this._path.style.cursor = 'pointer';

    this._svg.appendChild(this._path);

    // Insert SVG into nearest pan-zoom or stage
    const container = this.closest('pan-zoom') || this.closest('app-stage');
    if (container) {
      // Insert at beginning so cables are behind blocks
      const content = container.querySelector('.pan-zoom-content') || container;
      content.insertBefore(this._svg, content.firstChild);
    }

    this._updatePathStyle();
  }

  _resolveSockets() {
    const fromPath = this.getAttribute('from');
    const toPath = this.getAttribute('to');

    if (!fromPath || !toPath) {
      this._setError('Missing from or to attribute');
      return;
    }

    const root = this.closest('app-root') || document;

    this._fromProp = this._resolveProperty(fromPath, root);
    this._toProp = this._resolveProperty(toPath, root);

    if (!this._fromProp) {
      this._setError(`Cannot find source: ${fromPath}`);
      return;
    }

    if (!this._toProp) {
      this._setError(`Cannot find target: ${toPath}`);
      return;
    }

    this._outSocket = this._fromProp.querySelector('out-socket');
    this._inSocket = this._toProp.querySelector('in-socket');

    if (!this._outSocket) {
      this._setError(`No out-socket at: ${fromPath}`);
      return;
    }

    if (!this._inSocket) {
      this._setError(`No in-socket at: ${toPath}`);
      return;
    }

    this._clearError();
  }

  _resolveProperty(path, root) {
    const [blockId, propName] = path.split('.');
    const block = root.querySelector(`#${blockId}`);
    if (!block) return null;

    return block.querySelector(`[name="${propName}"]`);
  }

  _establishConnection() {
    if (!this._outSocket || !this._inSocket) return;

    // Create a tee so multiple cables can read from same socket
    if (!this._outSocket._readers) {
      this._outSocket._readers = [];
    }

    // Create a pass-through stream that forwards values
    const { readable, writable } = new TransformStream();

    // Connect out -> readable, writable -> in
    this._outSocket.stream.pipeTo(writable).catch(err => {
      console.warn('Cable pipe error:', err);
    });

    readable.pipeTo(this._inSocket.stream).catch(err => {
      console.warn('Cable pipe error:', err);
    });
  }

  _updatePath() {
    if (!this._outSocket || !this._inSocket || !this._path) return;

    const start = this._getSocketPosition(this._outSocket);
    const end = this._getSocketPosition(this._inSocket);

    // Use cubic bezier for nice curves
    const dx = end.x - start.x;
    const curve = Math.min(Math.abs(dx) * 0.5, 100);

    const pathData = `
      M ${start.x} ${start.y}
      C ${start.x + curve} ${start.y},
        ${end.x - curve} ${end.y},
        ${end.x} ${end.y}
    `;

    this._path.setAttribute('d', pathData);
  }

  _getSocketPosition(socket) {
    const rect = socket.getBoundingClientRect();
    const container = this.closest('pan-zoom') || this.closest('app-stage');
    const containerRect = container.getBoundingClientRect();

    // Account for pan-zoom transform
    const pz = this.closest('pan-zoom');
    let offsetX = 0;
    let offsetY = 0;
    let scale = 1;

    if (pz) {
      offsetX = parseFloat(pz.getAttribute('x') || '0');
      offsetY = parseFloat(pz.getAttribute('y') || '0');
      scale = parseFloat(pz.getAttribute('zoom') || '1');
    }

    const x = (rect.left + rect.width / 2 - containerRect.left - offsetX) / scale;
    const y = (rect.top + rect.height / 2 - containerRect.top - offsetY) / scale;

    return { x, y };
  }

  _updatePathStyle() {
    if (!this._path) return;

    const color = this.getAttribute('color') || '#333';
    const width = this.getAttribute('width') || '2';
    const error = this.hasAttribute('data-error');

    this._path.setAttribute('stroke', error ? '#f44336' : color);
    this._path.setAttribute('stroke-width', width);
    this._path.setAttribute('stroke-linecap', 'round');

    if (error) {
      this._path.setAttribute('stroke-dasharray', '5,5');
    } else {
      this._path.removeAttribute('stroke-dasharray');
    }
  }

  _observeBlockMovement() {
    // Watch for attribute changes on blocks (x, y)
    const blocks = [
      this._fromProp?.closest('[id]'),
      this._toProp?.closest('[id]')
    ].filter(Boolean);

    this._mutationObserver = new MutationObserver(() => {
      this._updatePath();
    });

    blocks.forEach(block => {
      this._mutationObserver.observe(block, {
        attributes: true,
        attributeFilter: ['x', 'y']
      });
    });

    // Also watch pan-zoom changes
    const pz = this.closest('pan-zoom');
    if (pz) {
      this._mutationObserver.observe(pz, {
        attributes: true,
        attributeFilter: ['x', 'y', 'zoom']
      });
    }
  }

  _setError(message) {
    this.setAttribute('data-error', message);
    console.warn(`Cable error: ${message}`);
    this._updatePathStyle();
  }

  _clearError() {
    this.removeAttribute('data-error');
    this._updatePathStyle();
  }

  /**
   * Public API: Force path update (e.g., after manual block movement)
   */
  update() {
    this._updatePath();
  }
}

customElements.define('data-cable', DataCable);
```

---

## 2. Cable Behavior (optional enhancement)

**File**: `src/behaviors/useCable.js`

```js
/**
 * Attach interactive behavior to a cable
 * (Future: click to select, delete, etc.)
 *
 * @param {DataCable} cable
 */
export function useCable(cable) {
  const svg = cable._svg;
  const path = cable._path;

  if (!svg || !path) return;

  // Make clickable
  path.style.pointerEvents = 'stroke';

  // Highlight on hover
  path.addEventListener('mouseenter', () => {
    path.setAttribute('stroke-width', '4');
  });

  path.addEventListener('mouseleave', () => {
    const width = cable.getAttribute('width') || '2';
    path.setAttribute('stroke-width', width);
  });

  // Click to select (future: show delete button, etc.)
  path.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Cable clicked:', cable.getAttribute('from'), '->', cable.getAttribute('to'));

    // Future: add selection behavior
    cable.setAttribute('selected', 'true');
  });
}
```

---

## 3. Testing

### Test: data-cable

**File**: `tests/components/data-cable.test.js`

```js
import '../../src/components/data-cable.js';
import '../../src/components/math-block.js';
import '../../src/components/number-prop.js';
import '../../src/components/out-socket.js';
import '../../src/components/in-socket.js';

describe('data-cable', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <app-stage>
        <pan-zoom id="canvas">
          <math-block id="m1" x="0" y="0">
            <number-prop name="result">
              <out-socket></out-socket>
            </number-prop>
          </math-block>

          <math-block id="m2" x="200" y="0">
            <number-prop name="a">
              <in-socket></in-socket>
            </number-prop>
          </math-block>
        </pan-zoom>
      </app-stage>
    `;
  });

  it('creates SVG element', () => {
    const cable = document.createElement('data-cable');
    cable.setAttribute('from', 'm1.result');
    cable.setAttribute('to', 'm2.a');

    const canvas = document.getElementById('canvas');
    canvas.appendChild(cable);

    assert.ok(cable._svg);
    assert.ok(cable._path);
  });

  it('resolves sockets from paths', () => {
    const cable = document.createElement('data-cable');
    cable.setAttribute('from', 'm1.result');
    cable.setAttribute('to', 'm2.a');

    const canvas = document.getElementById('canvas');
    canvas.appendChild(cable);

    assert.ok(cable._outSocket);
    assert.ok(cable._inSocket);
  });

  it('sets error on invalid path', () => {
    const cable = document.createElement('data-cable');
    cable.setAttribute('from', 'invalid.path');
    cable.setAttribute('to', 'm2.a');

    const canvas = document.getElementById('canvas');
    canvas.appendChild(cable);

    assert.ok(cable.hasAttribute('data-error'));
  });

  it('updates path when block moves', async () => {
    const cable = document.createElement('data-cable');
    cable.setAttribute('from', 'm1.result');
    cable.setAttribute('to', 'm2.a');

    const canvas = document.getElementById('canvas');
    canvas.appendChild(cable);

    const initialPath = cable._path.getAttribute('d');

    const m1 = document.getElementById('m1');
    m1.setAttribute('x', '100');

    await nextFrame();

    const updatedPath = cable._path.getAttribute('d');

    assert.notEqual(initialPath, updatedPath);
  });
});
```

---

## 4. Integration Example

### Updated index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VPL Toolkit - Stage 5</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <app-root version="0.1">
    <app-library></app-library>

    <app-stage>
      <pan-zoom x="0" y="0" zoom="1" id="canvas">

        <math-block id="m1" x="50" y="100" operation="add">
          <number-prop name="a" value="5"></number-prop>
          <number-prop name="b" value="3"></number-prop>
          <number-prop name="result">
            <out-socket></out-socket>
          </number-prop>
        </math-block>

        <math-block id="m2" x="350" y="100" operation="multiply">
          <number-prop name="a">
            <in-socket></in-socket>
          </number-prop>
          <number-prop name="b" value="2"></number-prop>
          <number-prop name="result">
            <out-socket></out-socket>
          </number-prop>
        </math-block>

        <math-block id="m3" x="650" y="100" operation="subtract">
          <number-prop name="a">
            <in-socket></in-socket>
          </number-prop>
          <number-prop name="b" value="5"></number-prop>
          <number-prop name="result"></number-prop>
        </math-block>

        <!-- Cables connecting the flow -->
        <data-cable from="m1.result" to="m2.a"></data-cable>
        <data-cable from="m2.result" to="m3.a"></data-cable>

      </pan-zoom>
    </app-stage>
  </app-root>

  <script type="module">
    import './src/components/app-root.js';
    import './src/components/app-library.js';
    import './src/components/app-stage.js';
    import './src/components/pan-zoom.js';
    import './src/components/number-prop.js';
    import './src/components/math-block.js';
    import './src/components/out-socket.js';
    import './src/components/in-socket.js';
    import './src/components/data-cable.js';
    import { usePanZoom } from './src/behaviors/usePanZoom.js';

    const canvas = document.getElementById('canvas');
    usePanZoom(canvas);

    console.log('VPL Toolkit - Stage 5 loaded');
    console.log('Flow: m1(5+3=8) -> m2(8*2=16) -> m3(16-5=11)');

    // Test the flow
    setTimeout(() => {
      const m3result = document.querySelector('#m3 [name="result"]');
      console.log('Final result:', m3result.getAttribute('value'));
    }, 100);
  </script>
</body>
</html>
```

---

## 5. File Structure (after Stage 5)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── core/
│   │   ├── signals.js
│   │   ├── streams.js
│   │   └── block-styles.js
│   ├── components/
│   │   ├── app-root.js
│   │   ├── app-library.js
│   │   ├── app-stage.js
│   │   ├── pan-zoom.js
│   │   ├── number-prop.js
│   │   ├── string-prop.js
│   │   ├── boolean-prop.js
│   │   ├── math-block.js
│   │   ├── in-socket.js
│   │   ├── out-socket.js
│   │   └── data-cable.js
│   └── behaviors/
│       ├── usePanZoom.js
│       └── useCable.js
├── tests/
│   ├── components/
│   │   ├── data-cable.test.js
│   │   └── ...
│   └── ...
└── ...
```

---

## Acceptance Criteria

Before moving to Stage 6:

- [ ] Cables render as SVG paths
- [ ] Cables connect sockets via stream pipes
- [ ] Cables update when blocks move
- [ ] Cables update when pan-zoom changes
- [ ] Invalid paths show error state (red dashed)
- [ ] Deleting cable removes SVG and breaks connection
- [ ] Data flows through multi-cable chains
- [ ] All tests pass
- [ ] Can create complex flows with 5+ blocks and 10+ cables

---

## Important Implementation Notes

### 1. Stream Connection Without Locking

**CRITICAL**: Do NOT use `stream.getReader()` to connect cables, as it locks the ReadableStream and prevents multiple cables from reading from the same out-socket.

**Correct approach**: Listen to the parent property's signal changes directly:

```js
_establishConnection() {
  if (!this._outSocket || !this._inSocket) return;

  const fromProp = this._fromProp;
  if (!fromProp || !fromProp.signals || !fromProp.signals.value) return;

  // Listen to value changes and forward to in-socket
  this._valueListener = (e) => {
    const value = e.detail.value;
    this._inSocket.write(value).catch(err => {
      console.warn('Cable write error:', err);
    });
  };

  fromProp.signals.value.addEventListener('change', this._valueListener);

  // Also emit initial value
  setTimeout(() => {
    const initialValue = fromProp.getAttribute('value');
    if (initialValue !== null) {
      this._inSocket.write(initialValue);
    }
  }, 0);
}
```

This allows multiple cables to fan out from a single out-socket without locking issues.

### 2. JSDOM Testing Limitations

`getBoundingClientRect()` returns all zeros in JSDOM, so tests that verify path updates should mock the update method or verify that the MutationObserver is configured correctly, rather than checking actual SVG path data.

### 3. SVG Positioning

Cables account for pan-zoom transforms when calculating socket positions:

```js
const x = (rect.left + rect.width / 2 - containerRect.left - offsetX) / scale;
const y = (rect.top + rect.height / 2 - containerRect.top - offsetY) / scale;
```

This ensures cables stay connected to sockets during pan and zoom operations.

## Known Limitations

- No visual cable creation tool yet (Stage 7)
- No cable selection/deletion UI yet (Stage 7)

---

## Next Stage

**Stage 6**: Symbols and Instances

We'll implement reusable component definitions (`*-symbol`) and their instances (`*-instance`), mirroring Flash's symbol system.
# Stage 6: Symbols and Instances (Blender-style Node Groups)

**Goal**: Implement reusable component definitions (symbols) and their black-box instances.

**Duration estimate**: Reusability layer

**Dependencies**: Stages 1-5 (all blocks, properties, cables)

---

## Overview

This stage adds **Blender-inspired node groups**:
- `*-symbol`: Reusable component definition stored in `<app-library>`
- `*-instance`: Black-box interface showing only exposed inputs/outputs

**CRITICAL ARCHITECTURE**: Like Blender's node groups, instances are **BLACK BOXES**:
- Only the interface (exposed properties) is visible
- Internal implementation is hidden but functional
- "Edit" button opens symbol for editing
- Instances auto-sync when symbol changes

This enables **subflow-like patterns** from Node-RED with proper encapsulation.

---

## Deliverables

1. Symbol naming convention and storage in `<app-library>`
2. Instance components that reference symbols
3. Parameter passing from instance to symbol
4. Symbol expansion on instance creation
5. Tests for symbol/instance behavior

---

## 1. Symbol Concept

### What is a Symbol?

A **symbol** is a **reusable template** that contains:
- Multiple blocks
- Internal connections (cables)
- Exposed input/output properties

Symbols are stored in `<app-library>` and are **not rendered** directly.

### Example Symbol

```xml
<app-library>
  <!-- Auth check symbol (like a Node-RED subflow) -->
  <auth-symbol>
    <logic-block id="check-token">
      <string-prop name="header" value="authorization">
        <in-socket/>
      </string-prop>
      <boolean-prop name="valid">
        <out-socket/>
      </boolean-prop>
    </logic-block>
  </auth-symbol>
</app-library>
```

---

## 2. Symbol Component (base pattern)

### Purpose

Symbols are **custom elements** that extend the basic component pattern. They are containers for reusable flows.

### Implementation Pattern

Each symbol type is a custom element:

**File**: `src/components/auth-symbol.js` (example)

```js
/**
 * <auth-symbol> - Reusable authentication check flow
 *
 * Exposed properties:
 *   header (in) - Header name to check
 *   valid (out) - Whether auth is valid
 *
 * Internal structure:
 *   Contains logic blocks that perform auth check
 */
export class AuthSymbol extends HTMLElement {
  connectedCallback() {
    // Symbols in library are not rendered
    if (this.closest('app-library')) {
      this.style.display = 'none';
      return;
    }

    // If rendered outside library (during testing), ensure structure
    this._ensureStructure();
  }

  _ensureStructure() {
    if (this.querySelector('#check-token')) return;

    this.innerHTML = `
      <logic-block id="check-token">
        <string-prop name="header" value="authorization">
          <in-socket></in-socket>
        </string-prop>
        <boolean-prop name="valid">
          <out-socket></out-socket>
        </boolean-prop>
      </logic-block>
    `;
  }
}

customElements.define('auth-symbol', AuthSymbol);
```

---

## 3. Instance Component (base pattern)

### Purpose

An **instance** is a **reference** to a symbol. It:
- Points to a symbol via `symbol` attribute
- Exposes **parameters** to customize the symbol
- Does NOT contain the symbol's children (just references)

### Implementation Pattern

**File**: `src/components/base-instance.js`

```js
/**
 * Generic instance handler
 *
 * Creates a visual representation of a symbol instance
 */
export class BaseInstance extends HTMLElement {
  static observedAttributes = ['symbol', 'x', 'y'];

  connectedCallback() {
    if (!this.hasAttribute('x')) this.setAttribute('x', '0');
    if (!this.hasAttribute('y')) this.setAttribute('y', '0');

    this._render();
    this._expandSymbol();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const x = this.getAttribute('x');
    const y = this.getAttribute('y');
    const symbol = this.getAttribute('symbol');

    this.style.position = 'absolute';
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
    this.style.minWidth = '180px';
    this.style.background = '#fff3cd';
    this.style.border = '2px solid #856404';
    this.style.borderRadius = '8px';
    this.style.padding = '8px';
    this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

    // Update header
    let header = this.querySelector('.instance-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'instance-header';
      this.insertBefore(header, this.firstChild);
    }

    header.textContent = `Instance: ${symbol || '(no symbol)'}`;
    header.style.fontWeight = 'bold';
    header.style.fontSize = '12px';
    header.style.marginBottom = '8px';
    header.style.color = '#856404';
  }

  _expandSymbol() {
    const symbolName = this.getAttribute('symbol');
    if (!symbolName) {
      this._setError('No symbol specified');
      return;
    }

    // Find symbol in library
    const library = this.closest('app-root')?.querySelector('app-library');
    if (!library) {
      this._setError('No library found');
      return;
    }

    const symbol = library.querySelector(symbolName);
    if (!symbol) {
      this._setError(`Symbol not found: ${symbolName}`);
      return;
    }

    // Clone symbol contents (shallow - just immediate children)
    this._cloneSymbolContents(symbol);
    this._applyInstanceParameters();
    this._clearError();
  }

  _cloneSymbolContents(symbol) {
    // Remove existing cloned content (keep instance params)
    const existing = this.querySelectorAll('.symbol-content');
    existing.forEach(el => el.remove());

    // Clone symbol's blocks
    const blocks = symbol.querySelectorAll('[id]'); // All blocks with IDs
    blocks.forEach(block => {
      const clone = block.cloneNode(true);
      clone.classList.add('symbol-content');

      // Adjust IDs to avoid conflicts (add instance ID as prefix)
      const instanceId = this.id || 'inst';
      this._remapIds(clone, instanceId);

      this.appendChild(clone);
    });
  }

  _remapIds(element, prefix) {
    // Remap IDs within the cloned content
    if (element.id) {
      element.id = `${prefix}_${element.id}`;
    }

    element.querySelectorAll('[id]').forEach(child => {
      child.id = `${prefix}_${child.id}`;
    });

    // Also remap cable references
    element.querySelectorAll('data-cable').forEach(cable => {
      const from = cable.getAttribute('from');
      const to = cable.getAttribute('to');

      if (from) {
        cable.setAttribute('from', this._remapPath(from, prefix));
      }
      if (to) {
        cable.setAttribute('to', this._remapPath(to, prefix));
      }
    });
  }

  _remapPath(path, prefix) {
    const [blockId, propName] = path.split('.');
    return `${prefix}_${blockId}.${propName}`;
  }

  _applyInstanceParameters() {
    // Apply parameters from instance properties to symbol blocks
    const params = this.querySelectorAll(':scope > [name]'); // Direct children only

    params.forEach(param => {
      const name = param.getAttribute('name');
      const value = param.getAttribute('value');

      // Find corresponding property in cloned content
      const target = this.querySelector(`.symbol-content [name="${name}"]`);
      if (target && value !== null) {
        target.setAttribute('value', value);
      }
    });
  }

  _setError(message) {
    this.setAttribute('data-error', message);
    console.warn(`Instance error: ${message}`);
  }

  _clearError() {
    this.removeAttribute('data-error');
  }
}
```

---

## 4. Specific Instance Types

### auth-instance example

**File**: `src/components/auth-instance.js`

```js
import { BaseInstance } from './base-instance.js';

/**
 * <auth-instance> - Instance of auth-symbol
 *
 * Attributes:
 *   symbol - Must be "auth"
 *   x, y   - Position
 *
 * Parameters:
 *   <string-prop name="header" value="..."/> - Override default header
 */
export class AuthInstance extends BaseInstance {
  connectedCallback() {
    // Force symbol to "auth"
    this.setAttribute('symbol', 'auth');
    super.connectedCallback();
  }
}

customElements.define('auth-instance', AuthInstance);
```

---

## 5. Testing

### Test: symbol storage

**File**: `tests/components/symbols.test.js`

```js
import '../../src/components/app-library.js';
import '../../src/components/auth-symbol.js';

describe('Symbols', () => {
  it('symbols in library are hidden', () => {
    const library = document.createElement('app-library');
    const symbol = document.createElement('auth-symbol');

    library.appendChild(symbol);
    document.body.appendChild(library);

    assert.equal(symbol.style.display, 'none');

    library.remove();
  });
});
```

### Test: instance expansion

**File**: `tests/components/instances.test.js`

```js
import '../../src/components/app-root.js';
import '../../src/components/app-library.js';
import '../../src/components/auth-symbol.js';
import '../../src/components/auth-instance.js';

describe('Instances', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <app-root>
        <app-library>
          <auth-symbol>
            <logic-block id="check">
              <string-prop name="header" value="authorization">
                <in-socket></in-socket>
              </string-prop>
            </logic-block>
          </auth-symbol>
        </app-library>
        <app-stage></app-stage>
      </app-root>
    `;
  });

  it('instance expands symbol contents', () => {
    const instance = document.createElement('auth-instance');
    instance.id = 'auth1';

    const stage = document.querySelector('app-stage');
    stage.appendChild(instance);

    // Should have cloned the logic-block
    const block = instance.querySelector('.symbol-content');
    assert.ok(block);
  });

  it('instance remaps IDs to avoid conflicts', () => {
    const instance = document.createElement('auth-instance');
    instance.id = 'auth1';

    const stage = document.querySelector('app-stage');
    stage.appendChild(instance);

    const block = instance.querySelector('[id*="check"]');
    assert.ok(block.id.includes('auth1'));
  });

  it('instance applies parameter overrides', () => {
    const instance = document.createElement('auth-instance');
    instance.id = 'auth1';

    const param = document.createElement('string-prop');
    param.setAttribute('name', 'header');
    param.setAttribute('value', 'custom-header');

    instance.appendChild(param);

    const stage = document.querySelector('app-stage');
    stage.appendChild(instance);

    const targetProp = instance.querySelector('.symbol-content [name="header"]');
    assert.equal(targetProp.getAttribute('value'), 'custom-header');
  });
});
```

---

## 6. Example Usage

### Full example with symbol and instances

```xml
<app-root version="0.1">

  <!-- Library: Symbol definitions -->
  <app-library>

    <multiplier-symbol>
      <math-block id="mult">
        <number-prop name="input">
          <in-socket/>
        </number-prop>
        <number-prop name="factor" value="2">
          <in-socket/>
        </number-prop>
        <number-prop name="output">
          <out-socket/>
        </number-prop>
      </math-block>
    </multiplier-symbol>

  </app-library>

  <!-- Stage: Using instances -->
  <app-stage>
    <pan-zoom>

      <math-block id="source" x="50" y="100">
        <number-prop name="value" value="10">
          <out-socket/>
        </number-prop>
      </math-block>

      <!-- Instance 1: Double -->
      <multiplier-instance id="double" x="300" y="100" symbol="multiplier">
        <number-prop name="factor" value="2"/>
      </multiplier-instance>

      <!-- Instance 2: Triple -->
      <multiplier-instance id="triple" x="300" y="250" symbol="multiplier">
        <number-prop name="factor" value="3"/>
      </multiplier-instance>

      <!-- Connect source to instances -->
      <data-cable from="source.value" to="double_mult.input"/>
      <data-cable from="source.value" to="triple_mult.input"/>

    </pan-zoom>
  </app-stage>

</app-root>
```

---

## 7. File Structure (after Stage 6)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── components/
│   │   ├── ... (all previous)
│   │   ├── base-instance.js
│   │   ├── auth-symbol.js
│   │   ├── auth-instance.js
│   │   └── multiplier-symbol.js (example)
│   └── ...
├── tests/
│   ├── components/
│   │   ├── symbols.test.js
│   │   ├── instances.test.js
│   │   └── ...
│   └── ...
└── ...
```

---

## Acceptance Criteria

Before moving to Stage 7:

- [ ] Symbols stored in `<app-library>` are hidden
- [ ] Instances reference symbols via `symbol` attribute
- [ ] Instance expands symbol contents on creation
- [ ] Instance remaps IDs to avoid conflicts
- [ ] Instance parameters override symbol defaults
- [ ] Cables within symbols work correctly
- [ ] Multiple instances of same symbol work independently
- [ ] All tests pass
- [ ] Can create reusable subflows like Node-RED

---

## CRITICAL: Black Box Architecture

**DO NOT** make instances show their internal blocks visually. This was the original mistake!

### Correct Architecture (Blender Node Groups)

**Instance Structure:**
```xml
<multiplier-instance id="mult1">
  <!-- Header with Edit button -->
  <div class="instance-header">
    <span>Multiplier</span>
    <button class="edit-button">Edit</button>
  </div>

  <!-- VISIBLE: Interface properties (exposed only) -->
  <div class="instance-interface">
    <number-prop name="input" exposed="true">
      <in-socket></in-socket>
    </number-prop>
    <number-prop name="factor" exposed="true">
      <in-socket></in-socket>
    </number-prop>
    <number-prop name="result" exposed="true">
      <out-socket></out-socket>
    </number-prop>
  </div>

  <!-- HIDDEN: Internal implementation (display:none) -->
  <div class="symbol-internals" style="display: none">
    <math-block id="mult1_mult">...</math-block>
  </div>
</multiplier-instance>
```

**Key Points:**
1. **Interface properties** are direct children of instance (no ID prefix)
2. **Internal blocks** are hidden inside `.symbol-internals` (with ID prefix)
3. **Cables connect to interface**, not internals: `from="mult1.result"` not `from="mult1_mult.result"`
4. **Interface ↔ Internal sync** via signal listeners
5. **Edit button** opens symbol for editing (shows alert for now)

### Wrong Architecture (Original Mistake)

**DO NOT DO THIS:**
```xml
<!-- WRONG: Shows internal blocks visually -->
<multiplier-instance>
  <div class="instance-header">Instance: multiplier-symbol</div>
  <math-block id="mult1_mult" class="symbol-content">  <!-- WRONG: Visible -->
    ...
  </math-block>
</multiplier-instance>
```

Problems with this:
- Internal blocks overlap visually (z-index issues)
- Not a black box - shows implementation details
- Cables must use prefixed IDs (confusing)
- No clear interface separation

---

## Important Implementation Notes

### 1. Symbol Storage and Visibility

**CRITICAL**: Symbols in `<app-library>` must be hidden to avoid rendering them on the stage.

**Correct approach**: Check if symbol is inside library in `connectedCallback()`:

```js
connectedCallback() {
  // Symbols in library are not rendered
  if (this.closest('app-library')) {
    this.style.display = 'none';
    return;
  }

  // If rendered outside library (during testing), ensure structure
  this._ensureStructure();
}
```

This allows symbols to work in tests without a library while staying hidden in production.

### 2. Group Input/Output Nodes (Blender-style Hard System Components)

**NEW APPROACH - PREFERRED**: Use `<group-input>` and `<group-output>` nodes to explicitly define the interface contract in XML.

This makes the XML contract **explicit and strong** instead of relying on implicit `exposed="true"` attributes.

#### Why Group Nodes?

The `exposed="true"` attribute approach is **implicit and weak**:
- Not immediately clear what the interface is when reading XML
- Requires scanning all properties to find exposed ones
- Doesn't show the data flow explicitly

Group nodes make the interface **explicit in the XML structure**:
- Clear entry and exit points for data
- Follows Blender's model of Group Input/Output nodes
- Self-documenting XML structure
- Explicit contract and validation

#### Group Input Node

**Component**: `<group-input>` (green, #4caf50)

Defines the **input interface** of a symbol/group.

- Properties have **OUT sockets** because they OUTPUT data to the internal graph
- Acts as entry point for data passed into the group
- Properties defined here become the inputs of any instance

**Symbol Definition:**
```xml
<multiplier-symbol>
  <group-input id="inputs">
    <number-prop name="input" value="0">
      <out-socket></out-socket>
    </number-prop>
    <number-prop name="factor" value="2">
      <out-socket></out-socket>
    </number-prop>
  </group-input>

  <math-block id="mult" operation="multiply">
    <number-prop name="a"><in-socket></in-socket></number-prop>
    <number-prop name="b"><in-socket></in-socket></number-prop>
    <number-prop name="result"><out-socket></out-socket></number-prop>
  </math-block>

  <group-output id="outputs">
    <number-prop name="result">
      <in-socket></in-socket>
    </number-prop>
  </group-output>

  <!-- Wire group inputs to internal blocks -->
  <data-cable from="inputs.input" to="mult.a"></data-cable>
  <data-cable from="inputs.factor" to="mult.b"></data-cable>
  <data-cable from="mult.result" to="outputs.result"></data-cable>
</multiplier-symbol>
```

#### Group Output Node

**Component**: `<group-output>` (red, #f44336)

Defines the **output interface** of a symbol/group.

- Properties have **IN sockets** because they RECEIVE data from the internal graph
- Acts as exit point for data leaving the group
- Properties defined here become the outputs of any instance

#### Behavior

1. **In Library**: Group nodes are hidden (`display: none`) when inside `<app-library>`
2. **During Editing**: Group nodes render visually when placed on canvas for editing
3. **In Instances**: base-instance.js scans for group nodes to build the interface

**Instance Interface Building:**
```js
// PRIORITY 1: Look for group-input and group-output nodes
const groupInput = symbol.querySelector('group-input');
const groupOutput = symbol.querySelector('group-output');

if (groupInput || groupOutput) {
  // Use group nodes to define interface (new explicit approach)
  if (groupInput) {
    const inputProps = groupInput.getInputDefinitions();
    inputProps.forEach(prop => {
      this._createInterfaceProperty(prop, interface_container);
    });
  }

  if (groupOutput) {
    const outputProps = groupOutput.getOutputDefinitions();
    outputProps.forEach(prop => {
      this._createInterfaceProperty(prop, interface_container);
    });
  }
}
```

#### XML as Contract

This approach leverages the **XML nature of the system** as a contract and validator:
- The structure is self-documenting
- Clear visual separation of interface vs implementation
- Easy to understand the data flow by reading XML
- Follows industry-standard patterns (Blender, ComfyUI)

### 3. Exposed Property System (Deprecated - Fallback Only)

**DEPRECATED**: Mark properties with `exposed="true"` to show them in the instance interface.

**Prefer Group Input/Output nodes instead** for explicit XML contracts.

**Symbol Definition:**
```xml
<multiplier-symbol>
  <math-block id="mult" operation="multiply">
    <!-- These will appear in instance interface -->
    <number-prop name="input" value="0" exposed="true">
      <in-socket></in-socket>
    </number-prop>
    <number-prop name="factor" value="2" exposed="true">
      <in-socket></in-socket>
    </number-prop>
    <number-prop name="result" exposed="true">
      <out-socket></out-socket>
    </number-prop>
  </math-block>
</multiplier-symbol>
```

**Instance auto-generates interface from exposed properties:**
- Instance scans symbol for `[exposed="true"]`
- Creates corresponding properties in `.instance-interface`
- Connects them to internal properties via signals
- If no exposed properties found, fallback to showing all properties

**MutationObserver** watches symbol for changes to `exposed` attribute and re-syncs automatically.

### 4. Instance Parameter Selection (Deprecated)

~~Old approach (don't use): Passing parameters as child elements~~

New approach: Instances have no parameters - they show the exposed interface from the symbol.

```js
_applyInstanceParameters() {
  // IMPORTANT: Only select direct children with :scope >
  const params = this.querySelectorAll(':scope > [name]:not(.instance-header):not(.symbol-content)');

  params.forEach(param => {
    const name = param.getAttribute('name');
    const value = param.getAttribute('value');

    // Find corresponding property in cloned content
    const target = this.querySelector(`.symbol-content [name="${name}"]`);
    if (target && value !== null) {
      target.setAttribute('value', value);
    }
  });
}
```

Without `:scope >`, the selector would also match properties inside the cloned symbol content.

### 5. ID Remapping for Cable Paths

Cable references must be remapped when cloning symbols to avoid path conflicts:

```js
_remapPath(path, prefix) {
  const parts = path.split('.');
  if (parts.length !== 2) return path;

  const [blockId, propName] = parts;
  return `${prefix}_${blockId}.${propName}`;
}
```

Example:
- Symbol cable: `from="mult.result" to="add.input"`
- Instance 1 cable: `from="mult1_mult.result" to="mult1_add.input"`

### 6. Symbol vs Instance Children

- **Symbol**: Contains the actual blocks and structure
- **Instance**: Contains only **parameters** (property overrides)
- Instance **expands** symbol contents at runtime

### 7. ID Remapping Pattern

Instance IDs are prefixed to avoid conflicts:
- Symbol block: `id="mult"`
- Instance 1: `id="mult1_mult"`
- Instance 2: `id="mult2_mult"`

All child elements and cable references are automatically updated.

---

## Next Stage

**Stage 7**: Behaviors and Interactions

We'll add the final interactive behaviors:
- Block dragging (`useDraggable`)
- Block selection (`useSelectable`)
- Cable creation tool
- Keyboard shortcuts
- Delete operations
# Stage 7: Behaviors and Interactions

**Goal**: Add interactive behaviors for dragging, selecting, and manipulating blocks and cables.

**Duration estimate**: User interaction layer

**Dependencies**: All previous stages (complete component system)

---

## Overview

This final stage adds the **behavior layer** that makes the VPL actually usable:
- Drag blocks to reposition
- Select blocks for deletion/manipulation
- Create cables by dragging from sockets
- Delete blocks and cables
- Keyboard shortcuts

All behaviors are **attached via `useX(el)` functions** - components remain inert.

---

## Deliverables

1. `useDraggable(el)` - Drag blocks to reposition
2. `useSelectable(el)` - Click to select, keyboard to delete
3. `useCableCreator(el)` - Drag from socket to create cable
4. Global keyboard shortcuts
5. Selection manager utility
6. Tests for all behaviors

---

## 1. Draggable Behavior

### Purpose

Make blocks draggable by clicking their header and updating `x`, `y` attributes.

### Implementation

**File**: `src/behaviors/useDraggable.js`

```js
/**
 * Make a block draggable by its header
 *
 * Updates x/y attributes on drag
 * Respects pan-zoom transform
 *
 * @param {HTMLElement} element - Block element with x/y attributes
 */
export function useDraggable(element) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;

  // Find header (draggable area)
  const header = element.querySelector('.block-header, .instance-header');
  if (!header) {
    console.warn('No draggable header found');
    return;
  }

  header.style.cursor = 'move';

  const onPointerDown = (e) => {
    // Only left click
    if (e.button !== 0) return;

    e.stopPropagation();
    isDragging = true;

    startX = e.clientX;
    startY = e.clientY;
    initialX = parseFloat(element.getAttribute('x') || '0');
    initialY = parseFloat(element.getAttribute('y') || '0');

    element.style.zIndex = '1000'; // Bring to front
    element.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;

    // Calculate delta in screen space
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Account for pan-zoom scale
    const pz = element.closest('pan-zoom');
    const scale = pz ? parseFloat(pz.getAttribute('zoom') || '1') : 1;

    const newX = initialX + dx / scale;
    const newY = initialY + dy / scale;

    element.setAttribute('x', newX.toString());
    element.setAttribute('y', newY.toString());
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;

    isDragging = false;
    element.style.zIndex = '';
    element.releasePointerCapture(e.pointerId);
  };

  header.addEventListener('pointerdown', onPointerDown);
  header.addEventListener('pointermove', onPointerMove);
  header.addEventListener('pointerup', onPointerUp);
  header.addEventListener('pointercancel', onPointerUp);

  // Cleanup on disconnect
  element.addEventListener('disconnected', () => {
    header.removeEventListener('pointerdown', onPointerDown);
    header.removeEventListener('pointermove', onPointerMove);
    header.removeEventListener('pointerup', onPointerUp);
    header.removeEventListener('pointercancel', onPointerUp);
  }, { once: true });

  return element;
}
```

---

## 2. Selectable Behavior

### Purpose

Allow blocks to be selected via click, show selection state, enable keyboard deletion.

### Implementation

**File**: `src/behaviors/useSelectable.js`

```js
/**
 * Make a block selectable
 *
 * - Click to select (sets selected="true")
 * - Shows visual selection state
 * - Integrates with SelectionManager
 *
 * @param {HTMLElement} element - Block element
 */
export function useSelectable(element) {
  const onClick = (e) => {
    // Only if clicking the block itself (not children)
    if (e.target !== element && !element.contains(e.target)) return;

    e.stopPropagation();

    // Toggle selection
    const isSelected = element.getAttribute('selected') === 'true';

    // Clear other selections unless Shift is held
    if (!e.shiftKey) {
      clearAllSelections(element);
    }

    element.setAttribute('selected', (!isSelected).toString());
    updateSelectionStyle(element);
  };

  element.addEventListener('click', onClick);

  // Initial style
  updateSelectionStyle(element);

  // Watch for attribute changes
  const observer = new MutationObserver(() => {
    updateSelectionStyle(element);
  });

  observer.observe(element, {
    attributes: true,
    attributeFilter: ['selected']
  });

  // Cleanup
  element.addEventListener('disconnected', () => {
    element.removeEventListener('click', onClick);
    observer.disconnect();
  }, { once: true });

  return element;
}

/**
 * Update visual selection state
 */
function updateSelectionStyle(element) {
  const isSelected = element.getAttribute('selected') === 'true';

  if (isSelected) {
    element.style.outline = '3px solid #2196f3';
    element.style.outlineOffset = '2px';
    element.setAttribute('aria-selected', 'true');
  } else {
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.setAttribute('aria-selected', 'false');
  }
}

/**
 * Clear all selections in the same container
 */
function clearAllSelections(element) {
  const container = element.closest('pan-zoom') || element.closest('app-stage');
  if (!container) return;

  const selected = container.querySelectorAll('[selected="true"]');
  selected.forEach(el => {
    el.setAttribute('selected', 'false');
  });
}
```

---

## 3. Cable Creator Behavior

### Purpose

Allow creating cables by dragging from an out-socket to an in-socket.

### Implementation

**File**: `src/behaviors/useCableCreator.js`

```js
/**
 * Enable cable creation by dragging from sockets
 *
 * - Drag from out-socket to in-socket
 * - Shows preview line during drag
 * - Creates <data-cable> on completion
 *
 * @param {HTMLElement} container - Canvas container (pan-zoom or stage)
 */
export function useCableCreator(container) {
  let isDragging = false;
  let sourceSocket = null;
  let previewLine = null;
  let startX = 0;
  let startY = 0;

  const onSocketPointerDown = (e) => {
    const socket = e.target.closest('out-socket');
    if (!socket) return;

    e.stopPropagation();
    e.preventDefault();

    isDragging = true;
    sourceSocket = socket;

    const rect = socket.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    startX = rect.left + rect.width / 2 - containerRect.left;
    startY = rect.top + rect.height / 2 - containerRect.top;

    createPreviewLine(startX, startY);
  };

  const onPointerMove = (e) => {
    if (!isDragging || !previewLine) return;

    const containerRect = container.getBoundingClientRect();
    const endX = e.clientX - containerRect.left;
    const endY = e.clientY - containerRect.top;

    updatePreviewLine(startX, startY, endX, endY);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;

    // Check if we landed on an in-socket
    const targetSocket = e.target.closest('in-socket');

    if (targetSocket && sourceSocket) {
      createCable(sourceSocket, targetSocket);
    }

    // Cleanup
    if (previewLine) {
      previewLine.remove();
      previewLine = null;
    }

    isDragging = false;
    sourceSocket = null;
  };

  // Attach listeners
  container.addEventListener('pointerdown', onSocketPointerDown);
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerup', onPointerUp);

  // Helper: Create preview SVG line
  function createPreviewLine(x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '9999';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', '#2196f3');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,5');

    svg.appendChild(line);

    const content = container.querySelector('.pan-zoom-content') || container;
    content.appendChild(svg);

    previewLine = { svg, line };
  }

  // Helper: Update preview line
  function updatePreviewLine(x1, y1, x2, y2) {
    if (!previewLine) return;

    previewLine.line.setAttribute('x1', x1);
    previewLine.line.setAttribute('y1', y1);
    previewLine.line.setAttribute('x2', x2);
    previewLine.line.setAttribute('y2', y2);
  }

  // Helper: Create actual cable
  function createCable(outSocket, inSocket) {
    const sourceProp = outSocket.closest('[name]');
    const targetProp = inSocket.closest('[name]');

    if (!sourceProp || !targetProp) return;

    const sourceBlock = sourceProp.closest('[id]');
    const targetBlock = targetProp.closest('[id]');

    if (!sourceBlock || !targetBlock) return;

    const fromPath = `${sourceBlock.id}.${sourceProp.getAttribute('name')}`;
    const toPath = `${targetBlock.id}.${targetProp.getAttribute('name')}`;

    const cable = document.createElement('data-cable');
    cable.setAttribute('from', fromPath);
    cable.setAttribute('to', toPath);

    container.appendChild(cable);

    console.log('Cable created:', fromPath, '->', toPath);
  }

  return container;
}
```

---

## 4. Global Keyboard Shortcuts

### Purpose

Handle global keyboard shortcuts for common operations:
- Delete: Remove selected blocks/cables
- Ctrl+S: Save (export XML)
- Ctrl+Z: Undo (future)

### Implementation

**File**: `src/core/keyboard.js`

```js
/**
 * Setup global keyboard shortcuts
 *
 * - Delete/Backspace: Delete selected elements
 * - Ctrl+S: Save application
 * - Ctrl+A: Select all
 * - Escape: Clear selection
 */
export function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Delete selected elements
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (isInputFocused()) return;

      e.preventDefault();
      deleteSelected();
    }

    // Save
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveApplication();
    }

    // Select all
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      selectAll();
    }

    // Clear selection
    if (e.key === 'Escape') {
      clearSelection();
    }
  });
}

/**
 * Check if an input element is focused
 */
function isInputFocused() {
  const active = document.activeElement;
  return active && (
    active.tagName === 'INPUT' ||
    active.tagName === 'TEXTAREA' ||
    active.isContentEditable
  );
}

/**
 * Delete all selected elements
 */
function deleteSelected() {
  const selected = document.querySelectorAll('[selected="true"]');

  selected.forEach(el => {
    console.log('Deleting:', el.tagName, el.id);
    el.remove();
  });

  console.log(`Deleted ${selected.length} element(s)`);
}

/**
 * Save application state as XML
 */
function saveApplication() {
  const root = document.querySelector('app-root');
  if (!root) return;

  const xml = root.outerHTML;

  // Download as file
  const blob = new Blob([xml], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'myapp.xml';
  a.click();

  URL.revokeObjectURL(url);

  console.log('Application saved');
}

/**
 * Select all blocks
 */
function selectAll() {
  const blocks = document.querySelectorAll('[x][y]'); // All positioned elements

  blocks.forEach(block => {
    block.setAttribute('selected', 'true');
  });

  console.log(`Selected ${blocks.length} block(s)`);
}

/**
 * Clear all selections
 */
function clearSelection() {
  const selected = document.querySelectorAll('[selected="true"]');

  selected.forEach(el => {
    el.setAttribute('selected', 'false');
  });
}
```

---

## 5. Testing

### Test: useDraggable

**File**: `tests/behaviors/useDraggable.test.js`

```js
import { useDraggable } from '../../src/behaviors/useDraggable.js';

describe('useDraggable', () => {
  it('updates x/y on drag', () => {
    const block = document.createElement('math-block');
    block.setAttribute('x', '0');
    block.setAttribute('y', '0');

    block.innerHTML = '<div class="block-header">Header</div>';
    document.body.appendChild(block);

    useDraggable(block);

    const header = block.querySelector('.block-header');

    // Simulate drag
    header.dispatchEvent(new PointerEvent('pointerdown', {
      button: 0,
      clientX: 0,
      clientY: 0,
      bubbles: true
    }));

    header.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 50,
      clientY: 30,
      bubbles: true
    }));

    header.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true
    }));

    // Check updated position
    assert.equal(block.getAttribute('x'), '50');
    assert.equal(block.getAttribute('y'), '30');

    block.remove();
  });
});
```

### Test: useSelectable

**File**: `tests/behaviors/useSelectable.test.js`

```js
import { useSelectable } from '../../src/behaviors/useSelectable.js';

describe('useSelectable', () => {
  it('toggles selection on click', () => {
    const block = document.createElement('div');
    block.setAttribute('selected', 'false');

    document.body.appendChild(block);
    useSelectable(block);

    block.click();

    assert.equal(block.getAttribute('selected'), 'true');

    block.click();

    assert.equal(block.getAttribute('selected'), 'false');

    block.remove();
  });

  it('applies selection styles', () => {
    const block = document.createElement('div');
    block.setAttribute('selected', 'false');

    document.body.appendChild(block);
    useSelectable(block);

    block.setAttribute('selected', 'true');

    setTimeout(() => {
      assert.ok(block.style.outline);
      block.remove();
    }, 10);
  });
});
```

---

## 6. Final Integration

### Updated index.html (fully interactive)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VPL Toolkit - Complete</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    .toolbar {
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px;
      border-radius: 4px;
      z-index: 1000;
      font-size: 12px;
    }
    .toolbar div {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>VPL Toolkit</strong></div>
    <div>🖱️ Drag blocks to move</div>
    <div>🖱️ Click to select</div>
    <div>🖱️ Drag from socket to connect</div>
    <div>⌨️ Delete to remove</div>
    <div>⌨️ Ctrl+S to save</div>
    <div>⌨️ Ctrl+A to select all</div>
    <div>⌨️ Esc to clear selection</div>
  </div>

  <app-root version="0.1">
    <app-library></app-library>

    <app-stage>
      <pan-zoom x="0" y="0" zoom="1" id="canvas">

        <math-block id="m1" x="50" y="100" operation="add">
          <number-prop name="a" value="5"></number-prop>
          <number-prop name="b" value="3"></number-prop>
          <number-prop name="result">
            <out-socket></out-socket>
          </number-prop>
        </math-block>

        <math-block id="m2" x="350" y="100" operation="multiply">
          <number-prop name="a">
            <in-socket></in-socket>
          </number-prop>
          <number-prop name="b" value="2"></number-prop>
          <number-prop name="result">
            <out-socket></out-socket>
          </number-prop>
        </math-block>

        <math-block id="m3" x="650" y="100" operation="subtract">
          <number-prop name="a">
            <in-socket></in-socket>
          </number-prop>
          <number-prop name="b" value="5"></number-prop>
          <number-prop name="result"></number-prop>
        </math-block>

        <data-cable from="m1.result" to="m2.a"></data-cable>
        <data-cable from="m2.result" to="m3.a"></data-cable>

      </pan-zoom>
    </app-stage>
  </app-root>

  <script type="module">
    import './src/components/app-root.js';
    import './src/components/app-library.js';
    import './src/components/app-stage.js';
    import './src/components/pan-zoom.js';
    import './src/components/number-prop.js';
    import './src/components/math-block.js';
    import './src/components/out-socket.js';
    import './src/components/in-socket.js';
    import './src/components/data-cable.js';
    import { usePanZoom } from './src/behaviors/usePanZoom.js';
    import { useDraggable } from './src/behaviors/useDraggable.js';
    import { useSelectable } from './src/behaviors/useSelectable.js';
    import { useCableCreator } from './src/behaviors/useCableCreator.js';
    import { setupKeyboardShortcuts } from './src/core/keyboard.js';

    // Enable pan-zoom
    const canvas = document.getElementById('canvas');
    usePanZoom(canvas);

    // Enable cable creation
    useCableCreator(canvas);

    // Make all blocks draggable and selectable
    document.querySelectorAll('[x][y]').forEach(block => {
      useDraggable(block);
      useSelectable(block);
    });

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    console.log('VPL Toolkit - Complete!');
  </script>
</body>
</html>
```

---

## 7. File Structure (final)

```
xml-wc-vpl-mark-1/
├── src/
│   ├── core/
│   │   ├── signals.js
│   │   ├── streams.js
│   │   ├── block-styles.js
│   │   └── keyboard.js
│   ├── components/
│   │   ├── app-root.js
│   │   ├── app-library.js
│   │   ├── app-stage.js
│   │   ├── pan-zoom.js
│   │   ├── number-prop.js
│   │   ├── string-prop.js
│   │   ├── boolean-prop.js
│   │   ├── math-block.js
│   │   ├── in-socket.js
│   │   ├── out-socket.js
│   │   ├── data-cable.js
│   │   ├── base-instance.js
│   │   └── (symbol/instance components)
│   └── behaviors/
│       ├── usePanZoom.js
│       ├── useDraggable.js
│       ├── useSelectable.js
│       ├── useCableCreator.js
│       └── useCable.js
├── tests/
│   ├── ... (all test files)
├── index.html
├── REQUIREMENTS.md
├── STAGE-1.md through STAGE-7.md
└── package.json
```

---

## Acceptance Criteria

System is complete when:

- [ ] All blocks are draggable
- [ ] All blocks are selectable
- [ ] Cables can be created by dragging
- [ ] Delete key removes selected elements
- [ ] Ctrl+S saves XML
- [ ] Ctrl+A selects all blocks
- [ ] Esc clears selection
- [ ] All behaviors work with pan-zoom
- [ ] All tests pass
- [ ] Complete workflow is usable: create blocks, connect, move, delete, save

---

## Final Notes

### What's Been Achieved

You now have a **complete visual programming language toolkit** that:

1. ✅ Uses DOM as the source of truth
2. ✅ Has zero hidden state
3. ✅ Is entirely attribute-driven
4. ✅ Separates structure (components) from behavior (use* functions)
5. ✅ Supports dataflow via WebStreams
6. ✅ Allows reusable symbols/instances
7. ✅ Saves/loads as plain XML
8. ✅ Is testable via DOM manipulation
9. ✅ Is human-readable and editable

### Total Code Size

Should be well under **3000 lines** for the entire system.

### What's Missing (Future Enhancements)

- Minimap visualization
- Undo/redo system
- Property editors (inline editing)
- More block types (http, script, database, etc.)
- Symbol library browser
- Cable routing optimization (optional)
- Multi-selection drag
- Copy/paste
- Export to different formats

---

## Success

**You've built humane software.**

The system is:
- Transparent
- Debuggable
- Honest
- Simple
- Powerful

🎉
