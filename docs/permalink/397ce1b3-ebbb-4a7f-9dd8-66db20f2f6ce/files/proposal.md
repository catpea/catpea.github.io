# LipSync EventEmitter System - Requirements Document

## Project Overview

Transform the existing SVG wireframe lip sync system into a modular, plugin-oriented architecture using a central EventEmitter pattern. This system will provide precise audio analysis events that can be consumed by various visualization plugins.

## Core Architecture

### Central App Object (`LipSyncApp`)
- **EventEmitter-based**: Extends or implements EventEmitter pattern
- **Plugin Management**: Register, unregister, and manage visualization plugins
- **Audio Analysis**: Core audio processing and frequency analysis
- **Event Broadcasting**: Emit precise, typed events to all registered plugins

### Audio Analysis Events

#### Primary Events
```javascript
// Volume-based events
app.emit('volume:change', { level: number, normalized: number, timestamp: number })
app.emit('volume:threshold', { crossed: boolean, threshold: number, level: number })

// Frequency analysis events
app.emit('frequency:analysis', {
  low: number,      // 0-32 Hz range average
  mid: number,      // 32-96 Hz range average
  high: number,     // 96-128 Hz range average
  dominant: 'low' | 'mid' | 'high',
  timestamp: number
})

// Mouth shape events
app.emit('mouth:shape', {
  shape: 'closed' | 'open' | 'wide' | 'round' | 'extraWide' | 'extraOpen',
  intensity: number,    // 0-1 scale
  confidence: number,   // 0-1 scale
  timestamp: number
})

// Transition events
app.emit('mouth:transition', {
  from: string,
  to: string,
  factor: number,      // 0-1 interpolation factor
  duration: number,    // expected transition time
  timestamp: number
})

// Audio lifecycle events
app.emit('audio:start', { sampleRate: number, bufferSize: number })
app.emit('audio:stop', { reason: string })
app.emit('audio:error', { error: Error, context: string })
```

#### Granular Events
```javascript
// Real-time audio data
app.emit('audio:frame', {
  frequencyData: Uint8Array,
  timeData: Uint8Array,
  timestamp: number
})

// Speech detection
app.emit('speech:start', { confidence: number, timestamp: number })
app.emit('speech:end', { duration: number, timestamp: number })
app.emit('speech:silence', { duration: number, timestamp: number })

// Phoneme approximation (advanced)
app.emit('phoneme:detected', {
  type: 'vowel' | 'consonant' | 'sibilant',
  characteristics: object,
  confidence: number,
  timestamp: number
})
```

## Plugin System Requirements

### Plugin Interface
```javascript
class LipSyncPlugin {
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
    this.app = null;
  }

  // Required methods
  init(app) { /* Subscribe to events */ }
  destroy() { /* Cleanup resources */ }

  // Optional methods
  onVolumeChange(data) { /* Handle volume changes */ }
  onMouthShape(data) { /* Handle mouth shape changes */ }
  onFrequencyAnalysis(data) { /* Handle frequency data */ }
}
```

### Plugin Registration
```javascript
const app = new LipSyncApp();

// Register plugins
app.use(new SVGVisualizerPlugin('svg-face'));
app.use(new PixelArtPlugin('pixel-face', { imageFolder: './images/' }));
app.use(new CanvasPlugin('canvas-face'));
app.use(new ThreeJSPlugin('3d-face'));

// Start system
app.start();
```

## Event Data Specifications

### Volume Data
- **level**: Raw volume level (0-255)
- **normalized**: Normalized volume (0-1)
- **threshold**: Configurable silence threshold
- **timestamp**: High-resolution timestamp

### Frequency Analysis
- **Frequency Ranges**:
  - Low: 0-32 (bass, vowels like "O", "U")
  - Mid: 32-96 (general speech)
  - High: 96-128 (consonants, "S", "T" sounds)
- **Dominant**: Which frequency range has highest energy
- **Confidence**: How certain the analysis is

### Mouth Shape Detection
- **Shape Types**: closed, open, wide, round, extraWide, extraOpen
- **Intensity**: How pronounced the shape should be (0-1)
- **Confidence**: Certainty of shape detection (0-1)
- **Interpolation**: Smooth transitions between shapes

## Configuration System

### Audio Settings
```javascript
const config = {
  audio: {
    fftSize: 512,
    smoothingTimeConstant: 0.3,
    sampleRate: 44100,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  },

  analysis: {
    volumeThreshold: 15,
    frequencyRanges: {
      low: [0, 32],
      mid: [32, 96],
      high: [96, 128]
    },
    sensitivityCurve: 0.7, // Power curve for intensity scaling
    transitionSmoothness: 0.8
  },

  events: {
    throttleMs: 16, // ~60fps event emission
    enableGranular: true,
    enablePhonemes: false
  }
}
```

### Plugin Settings
```javascript
const pluginConfig = {
  pixelArt: {
    imageFolder: './assets/mouth-shapes/',
    imageFormat: 'png',
    transitionDuration: 100, // ms
    scaleFactor: 2,
    interpolation: 'nearest-neighbor'
  },

  svg: {
    strokeWidth: 4,
    glowEffect: true,
    animationEasing: 'ease-out'
  }
}
```

## Implementation Requirements

### Core Features
1. **Modular Architecture**: Clean separation between audio analysis and visualization
2. **Event-Driven**: All communication via typed events
3. **Plugin System**: Hot-swappable visualization plugins
4. **Performance**: Efficient audio processing, 60fps event emission
5. **Configuration**: Extensive configuration options
6. **Error Handling**: Graceful error handling and recovery

### Advanced Features
1. **Multiple Visualizers**: Support multiple active plugins simultaneously
2. **Event Filtering**: Plugins can subscribe to specific event types
3. **Custom Events**: Plugins can emit custom events
4. **Middleware**: Pre/post processing of events
5. **Recording**: Record and playback event streams
6. **Analytics**: Track performance metrics and usage

### File Structure
```
lip-sync-system/
├── core/
│   ├── LipSyncApp.js
│   ├── AudioAnalyzer.js
│   ├── EventEmitter.js
│   └── PluginManager.js
├── plugins/
│   ├── SVGVisualizerPlugin.js
│   ├── PixelArtPlugin.js
│   ├── CanvasPlugin.js
│   └── ThreeJSPlugin.js
├── assets/
│   └── mouth-shapes/
│       ├── closed.png
│       ├── open.png
│       ├── wide.png
│       ├── round.png
│       ├── extraWide.png
│       └── extraOpen.png
├── config/
│   ├── default.json
│   └── plugins.json
└── examples/
    ├── basic-usage.html
    ├── multi-plugin.html
    └── custom-plugin.html
```

## Success Criteria

1. **Modularity**: Easy to create new visualization plugins
2. **Performance**: Smooth 60fps animation with minimal CPU usage
3. **Extensibility**: Support for custom events and middleware
4. **Documentation**: Comprehensive API documentation and examples
5. **Testing**: Unit tests for core functionality and plugin interfaces
6. **Compatibility**: Works across modern browsers and devices

## Future Enhancements

1. **Machine Learning**: ML-based phoneme detection
2. **3D Support**: WebGL/Three.js integration
3. **Networking**: Real-time collaboration features
4. **Mobile**: Touch-based interaction modes
5. **Accessibility**: Screen reader and keyboard navigation support
6. **Themes**: Customizable visual themes and styles

## Technical Specifications

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dependencies
- Web Audio API
- EventEmitter (or custom implementation)
- Canvas API (for pixel art plugin)
- Optional: Three.js for 3D plugins

### Performance Targets
- < 5ms event processing latency
- < 10% CPU usage during active lip sync
- < 50MB memory footprint
- 60fps smooth animation
