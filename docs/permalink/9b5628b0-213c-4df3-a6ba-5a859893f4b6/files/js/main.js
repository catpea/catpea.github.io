// amber-fantasyui — main.js
// Bootstraps all dynamic FUI components on the demo page.

(function () {
  'use strict';

  // ── Numbers Station grid ─────────────────────────────────────────────────────
  // 7 rows × 7 numbers, each on its own staggered update interval.
  function buildNumbersStation() {
    var grid = document.getElementById('ns-grid');
    if (!grid) return;

    var numRows = 7;
    var numsPerRow = 7;
    var baseInterval = 2800;  // ms

    for (var r = 0; r < numRows; r++) {
      var row = document.createElement('div');
      row.className = 'ns-row';
      for (var n = 0; n < numsPerRow; n++) {
        var span = document.createElement('span');
        span.className = 'ns-num';
        // Vary digit count and update speed organically
        var digits  = (n === 4) ? 3 : 4;  // one short group in each row
        var jitter  = Math.floor(Math.random() * 1200);
        span.setAttribute('data-fui', 'number');
        span.setAttribute('data-fui-count', digits);
        span.setAttribute('data-fui-update', baseInterval + (r * 200) + (n * 150) + jitter);
        span.setAttribute('data-fui-transition', 'glitch');
        span.textContent = '0000';
        row.appendChild(span);
      }
      grid.appendChild(row);
    }
    // Init newly added elements
    FUI.init(grid);
  }

  // ── Data stream ──────────────────────────────────────────────────────────────
  // Scrolling column of hex + numbers. Two copies for seamless loop.
  function buildDataStream() {
    var inner = document.getElementById('data-stream');
    if (!inner) return;

    function makeLine() {
      var addr  = FUI.generate('addr', { bits: 16 });
      var bytes = FUI.generate('hex', { bytes: 4 });
      var val   = FUI.generate('number', { count: 4 });
      // Occasionally show a hot line
      var isHot = Math.random() < 0.12;
      return '<div' + (isHot ? ' class="hot"' : '') + '>' +
             addr + '  ' + bytes + '  ' + val +
             '</div>';
    }

    var lineCount = 18;
    var html = '';
    for (var i = 0; i < lineCount * 2; i++) html += makeLine();  // 2× for loop
    inner.innerHTML = html;

    // Refresh content mid-loop so it never repeats
    setInterval(function () {
      var fresh = '';
      for (var j = 0; j < lineCount; j++) fresh += makeLine();
      // Replace second half only (currently offscreen)
      var lines = inner.querySelectorAll('div');
      var half  = Math.floor(lines.length / 2);
      var freshLines = fresh.split('</div>').filter(Boolean);
      for (var k = 0; k < half && k < freshLines.length; k++) {
        lines[half + k].outerHTML = freshLines[k] + '</div>';
      }
    }, 6200);
  }

  // ── Operatives table ─────────────────────────────────────────────────────────
  var STATUS_CLASSES = {
    'NOMINAL':   'nominal',
    'TRACKING':  'tracking',
    'STANDBY':   'tracking',
    'HUNTING':   'tracking',
    'ACTIVE':    'nominal',
    'CLEARED':   'nominal',
    'DARK':      'dark',
    'SILENT':    'dark',
    'OFFLINE':   'dark',
    'COMPROMISED': 'critical',
    'ABORT':     'abort',
    'BURN':      'abort',
    'TANGO DOWN': 'abort',
    'EXFIL':     'abort',
    'DENIED':    'critical',
    'EXECUTE':   'critical',
    'BINGO':     'tracking',
    'WINCHESTER': 'tracking',
    'CHARLIE':   'abort',
  };

  function makeOperativeRow(index) {
    var id      = 'OP-' + String(index + 1).padStart(3, '0');
    var name    = FUI.generate('operative');
    var city    = FUI.generate('city');
    var call    = FUI.generate('callsign');
    var status  = FUI.generate('status');
    var ts      = FUI.generate('timestamp');
    var hash    = FUI.generate('hash', { len: 6 });
    var cls     = STATUS_CLASSES[status] || 'tracking';

    return '<tr>' +
      '<td class="td-mono text-ghost">' + id + '</td>' +
      '<td class="td-mono text-amber-hi">' + name + '</td>' +
      '<td>' + city + '</td>' +
      '<td class="td-mono">' + call + '</td>' +
      '<td class="td-status ' + cls + '">' + status + '</td>' +
      '<td class="td-mono text-ghost">' + ts + '</td>' +
      '<td class="td-mono text-void">' + hash + '</td>' +
    '</tr>';
  }

  function buildOperativesTable() {
    var tbody = document.getElementById('operatives-tbody');
    if (!tbody) return;

    var rowCount = 12;
    var html = '';
    for (var i = 0; i < rowCount; i++) html += makeOperativeRow(i);
    tbody.innerHTML = html;

    // Live row refresh — one random row updates every few seconds
    setInterval(function () {
      var rows = tbody.querySelectorAll('tr');
      if (!rows.length) return;
      var idx = Math.floor(Math.random() * rows.length);
      var fresh = document.createElement('tbody');
      fresh.innerHTML = makeOperativeRow(idx);
      var newRow = fresh.querySelector('tr');
      // Quick amber flash on the refreshed row
      newRow.style.backgroundColor = 'rgba(253,225,4,.08)';
      rows[idx].replaceWith(newRow);
      setTimeout(function () { newRow.style.backgroundColor = ''; }, 600);
    }, 3400);
  }

  // ── Live signal bar animation ─────────────────────────────────────────────────
  function animateSignalBars() {
    var bars = document.querySelectorAll('.fui-signal-bars span');
    if (!bars.length) return;
    setInterval(function () {
      var level = Math.floor(Math.random() * 8) + 1;
      bars.forEach(function (b, i) {
        if (i < level) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }, 1800);
  }

  // ── Boot ─────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    buildNumbersStation();
    buildDataStream();
    buildOperativesTable();
    animateSignalBars();
    // Init any remaining static [data-fui] elements in the document
    FUI.init();

    // Bootstrap tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
      new bootstrap.Tooltip(el);
    });

    // Bootstrap popovers
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
      new bootstrap.Popover(el);
    });

    // Styleguide toast trigger
    var toastTrigger = document.getElementById('sg-toast-trigger');
    var toastEl      = document.getElementById('sg-live-toast');
    if (toastTrigger && toastEl) {
      var liveToast = new bootstrap.Toast(toastEl);
      toastTrigger.addEventListener('click', function () { liveToast.show(); });
    }
  });

})();
