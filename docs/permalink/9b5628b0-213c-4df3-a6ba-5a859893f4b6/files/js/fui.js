/*!
 * FUI.js — Fantasy User Interface Data Generator
 * Part of amber-fantasyui. Standalone, no dependencies.
 *
 * Usage:
 *   <span data-fui="number" data-fui-count="4">0000</span>
 *   <span data-fui="codename" data-fui-update="3000" data-fui-transition="glitch">KRYPTOS</span>
 *   FUI.init();          // auto-process all [data-fui] in document
 *   FUI.generate('hex', { bytes: 4 });   // returns "A4 2F E9 1B"
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.FUI = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ── Word Banks ───────────────────────────────────────────────────────────────

  var CODENAMES = [
    'KRYPTOS',    'SETEC',      'AQUARIUS',   'MAJESTIC',   'ZODIAC',
    'BLUEBOOK',   'PRISM',      'CARNIVORE',  'ECHELON',    'STUXNET',
    'EQUATION',   'LAZARUS',    'TRITON',     'OLYMPIC',    'SNOWDEN',
    'VAULT7',     'MUSCULAR',   'BULLRUN',    'MANASSAS',   'STARGATE',
    'GRILL FLAME','SUNSTREAK',  'LILYPAD',    'BLACKBIRD',  'NIGHTHAWK',
    'DARKSTAR',   'TEMPEST',    'NOMAD',      'HYDRA',      'MEDUSA',
    'CHIMERA',    'SPECTER',    'NEXUS',      'PALADIN',    'RAGNAROK',
    'MONARCH',    'ARCADIA',    'MERIDIAN',   'SOLSTICE',   'PERIHELION',
  ];

  var CALLSIGNS = [
    'SYS/4',  'OS-B',   'SPY-7',  'TX-0',   'NET-9',
    'K-7',    'X-11',   'QR-3',   'VX-2',   'MK-5',
    'HEX-1',  'BIN-0',  'RX-8',   'TX-6',   'SUB-Z',
    'ALF-1',  'OMG-9',  'SIG-3',  'DLT-7',  'THT-4',
    'NULL',   'VOID',   'ROOT',   'SUDO',   'EXEC',
    'FORK',   'TRAP',   'CORE',   'HEAP',   'STACK',
  ];

  var OPERATIVES = [
    'CIPHER',   'GHOST',    'VIPER',    'SHADE',    'ATLAS',
    'WRAITH',   'BANSHEE',  'VECTOR',   'PROXY',    'REAPER',
    'SPECTER',  'ANVIL',    'FORGE',    'BLADE',    'SPARK',
    'ZERO',     'NULL',     'VOID',     'FLUX',     'DAEMON',
    'PIXEL',    'STATIC',   'GLITCH',   'NOISE',    'ENTROPY',
    'SIGNAL',   'CARRIER',  'MONITOR',  'CONSOLE',  'TERMINAL',
  ];

  var CITIES = [
    'MOSCOW',       'ODESSA',       'MINSK',        'KYIV',         'RIGA',
    'BUDAPEST',     'ISTANBUL',     'TANGIER',       'VLADIVOSTOK',  'MURMANSK',
    'NORILSK',      'BRATISLAVA',   'SARAJEVO',      'TIRANA',       'TBILISI',
    'KOWLOON',      'MACAU',        'PANAMA CITY',   'HAVANA',       'TEHRAN',
    'PYONGYANG',    'UTAH',         'LANGLEY',       'VAUXHALL',     'CHELTENHAM',
    'FORT MEADE',   'QUANTICO',     'AREA 51',       'CHEYENNE MTN', 'WHITE SANDS',
  ];

  var STATUSES = [
    'NOMINAL',      'STANDBY',      'ACTIVE',       'TRACKING',     'LOCKED',
    'HUNTING',      'DARK',         'SILENT',        'OFFLINE',      'COMPROMISED',
    'ABORT',        'EXECUTE',      'DENIED',        'CLEARED',      'BURN',
    'EXFIL',        'BINGO',        'WINCHESTER',    'CHARLIE',      'TANGO DOWN',
  ];

  var PROJECT_NAMES = [
    'TOO MANY SECRETS',  'PALE FIRE',       'WINTER SOLDIER',  'RED OCTOBER',
    'IRON HAND',         'DEAD DROP',       'TRADECRAFT',      'COLD IRON',
    'BLACK SITE',        'NUMBERS STATION', 'CARRIER WAVE',    'DEAD RECKONING',
    'LONG TELEGRAM',     'BROKEN ARROW',    'EMPTY QUIVER',    'BENT SPEAR',
    'NUCFLASH',          'DULL SWORD',      'FADED GIANT',     'SILVER BULLET',
  ];

  var SYSTEMS = [
    'AMBER.OS',     'NEXUS-9',      'PRISM-4',      'ORACLE-7',     'HYDRA-2',
    'SPECTER-6',    'VOID-3',       'SIGNAL-8',     'CIPHER-1',     'GHOST-5',
  ];

  // ── Utilities ────────────────────────────────────────────────────────────────

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pad(n, len) { return String(n).padStart(len, '0'); }
  function hexByte() { return pad(randInt(0, 255).toString(16).toUpperCase(), 2); }

  // ── Generators ───────────────────────────────────────────────────────────────

  var generators = {

    // "number" — plain decimal number string(s)
    // data-fui-count: digits per group (default 4)
    // data-fui-groups: how many space-separated groups (default 1)
    number: function (opts) {
      var count  = parseInt(opts.count  || 4, 10);
      var groups = parseInt(opts.groups || 1, 10);
      var parts  = [];
      for (var g = 0; g < groups; g++) {
        parts.push(pad(randInt(0, Math.pow(10, count) - 1), count));
      }
      return parts.join(' ');
    },

    // "hex" — space-separated uppercase hex bytes
    // data-fui-bytes: how many bytes (default 4)
    hex: function (opts) {
      var bytes = parseInt(opts.bytes || 4, 10);
      var arr   = [];
      for (var i = 0; i < bytes; i++) arr.push(hexByte());
      return arr.join(' ');
    },

    // "addr" — hex memory address
    addr: function (opts) {
      var bits = parseInt(opts.bits || 32, 10);
      var val  = randInt(0, Math.pow(2, bits) - 1);
      return '0x' + pad(val.toString(16).toUpperCase(), bits / 4);
    },

    codename:  function () { return rand(CODENAMES); },
    callsign:  function () { return rand(CALLSIGNS); },
    operative: function () { return rand(OPERATIVES); },
    city:      function () { return rand(CITIES); },
    status:    function () { return rand(STATUSES); },
    project:   function () { return rand(PROJECT_NAMES); },
    system:    function () { return rand(SYSTEMS); },

    // GPS-style coordinate
    coord: function () {
      var lat  = randInt(10, 75);
      var latM = pad(randInt(0, 59), 2);
      var latH = Math.random() > 0.5 ? 'N' : 'S';
      var lon  = randInt(10, 179);
      var lonM = pad(randInt(0, 59), 2);
      var lonH = Math.random() > 0.5 ? 'E' : 'W';
      return lat + '°' + latM + '’' + latH + ' ' + lon + '°' + lonM + '’' + lonH;
    },

    // Fictional future timestamp: YYYY.DDD.HH:MM
    timestamp: function () {
      return randInt(2190, 2399) + '.' +
             pad(randInt(1, 365), 3) + '.' +
             pad(randInt(0, 23), 2)  + ':' +
             pad(randInt(0, 59), 2);
    },

    // Short hash
    hash: function (opts) {
      var len   = parseInt(opts.len || 8, 10);
      var chars = '0123456789abcdef';
      var h = '';
      for (var i = 0; i < len; i++) h += chars[randInt(0, 15)];
      return h;
    },

    // Signal strength readout
    signal: function () {
      var bars  = randInt(1, 8);
      var db    = -randInt(55, 110);
      var bstr  = '█'.repeat(bars) + '░'.repeat(8 - bars);
      return bstr + ' ' + db + 'dBm';
    },

    // Frequency in MHz
    freq: function () {
      var mhz = (randInt(2000, 9999) / 10).toFixed(1);
      return mhz + ' MHz';
    },
  };

  // ── Attribute parser: "number count=4 groups=2" → {type, opts} ──────────────

  function parseAttr(str) {
    var parts = str.trim().split(/\s+/);
    var type  = parts[0];
    var opts  = {};
    for (var i = 1; i < parts.length; i++) {
      var kv = parts[i].split('=');
      opts[kv[0]] = kv.length > 1 ? kv[1] : true;
    }
    return { type: type, opts: opts };
  }

  // ── Glitch transition ────────────────────────────────────────────────────────

  var GLITCH = '!<>-_\\/[]{}=+*^?#░▒▓│┤╣║╗╝┐└┴┬├─┼';

  function glitch(el, finalText, duration) {
    duration = duration || 420;
    var start = performance.now();
    var len   = finalText.length;

    function frame(now) {
      var p       = Math.min((now - start) / duration, 1);
      var reveal  = Math.floor(p * len);
      var out     = '';
      for (var i = 0; i < len; i++) {
        if (i < reveal) {
          out += finalText[i];
        } else if (finalText[i] === ' ') {
          out += ' ';
        } else {
          out += GLITCH[randInt(0, GLITCH.length - 1)];
        }
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ── Render a single element ──────────────────────────────────────────────────

  function render(el) {
    var attrStr = el.getAttribute('data-fui');
    if (!attrStr) return;
    var parsed  = parseAttr(attrStr);
    var gen     = generators[parsed.type];
    if (!gen) return;
    var value   = gen(parsed.opts);
    var trans   = el.getAttribute('data-fui-transition');
    if (trans === 'glitch') {
      glitch(el, value);
    } else {
      el.textContent = value;
    }
  }

  // ── Auto-update ──────────────────────────────────────────────────────────────

  function startUpdate(el) {
    var interval = parseInt(el.getAttribute('data-fui-update') || '0', 10);
    if (!interval) return;
    setInterval(function () { render(el); }, interval);
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  function init(scope) {
    scope = scope || document;
    var els = scope.querySelectorAll('[data-fui]');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
      startUpdate(els[i]);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  return {
    init:     init,
    render:   render,
    glitch:   glitch,
    generate: function (type, opts) {
      var gen = generators[type];
      return gen ? gen(opts || {}) : '';
    },
    banks: {
      CODENAMES:    CODENAMES,
      CALLSIGNS:    CALLSIGNS,
      OPERATIVES:   OPERATIVES,
      CITIES:       CITIES,
      STATUSES:     STATUSES,
      PROJECT_NAMES: PROJECT_NAMES,
      SYSTEMS:      SYSTEMS,
    },
  };
}));
