/* ============================================================
   MYP 1 Year 7 Practice — core helpers
   ============================================================ */

/* ---------- seeded random ---------- */
function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const RI = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sample(r, arr, n) {
  return shuffle(r, arr).slice(0, n);
}

/* ---------- number theory ---------- */
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a || 1;
}
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}
function primeFactors(n) {
  const out = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    while (m % p === 0) { out.push(p); m /= p; }
  }
  if (m > 1) out.push(m);
  return out;
}

/* ---------- fractions ---------- */
function F(n, d) {
  if (d === undefined) d = 1;
  if (d === 0) d = 1;
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
function fval(f) { return f.n / f.d; }
function fstr(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
function fHTML(f) {
  if (f.d === 1) return String(f.n);
  return '<span class="frac"><span>' + f.n + '</span><span>' + f.d + '</span></span>';
}
function fh(n, d) { return fHTML({ n: n, d: d }); }
function mixedParts(f) {
  const sign = f.n < 0 ? -1 : 1;
  const n = Math.abs(f.n);
  return { whole: sign * Math.floor(n / f.d), rem: n % f.d, d: f.d, sign: sign };
}
function mixedStr(f) {
  const m = mixedParts(f);
  const a = Math.abs(m.whole);
  if (m.rem === 0) return String(f.n);
  return (f.n < 0 ? '-' : '') + (a ? a + ' ' : '') + m.rem + '/' + m.d;
}
function mixedHTML(f) {
  const m = mixedParts(f);
  if (m.rem === 0) return String(f.n);
  return (f.n < 0 ? '−' : '') + (Math.abs(m.whole) ? Math.abs(m.whole) + ' ' : '') + fHTML(F(m.rem, m.d));
}
function randFrac(r, maxD, proper) {
  const d = RI(r, 2, maxD || 12);
  const n = proper === false ? RI(r, 1, d * 2) : RI(r, 1, d - 1);
  return F(n, d);
}
function improper(f) { return F(f.d * Math.abs(f.n) + 0, 1); }

/* ---------- decimals & formatting ---------- */
function round(x, dp) {
  const p = Math.pow(10, dp === undefined ? 4 : dp);
  return Math.round((x + Number.EPSILON) * p) / p;
}
function fmt(x, dp) {
  if (typeof x !== 'number' || !isFinite(x)) return String(x);
  if (Number.isInteger(x)) return x.toLocaleString('en-US');
  const v = round(x, dp === undefined ? 4 : dp);
  return v.toLocaleString('en-US', { maximumFractionDigits: dp === undefined ? 4 : dp });
}
function plain(x, dp) {
  if (typeof x !== 'number') return String(x);
  const v = round(x, dp === undefined ? 4 : dp);
  return String(v);
}
function money(x) { return '$' + Number(x).toFixed(2); }
function pct(x, dp) {
  const v = round(x, dp === undefined ? 1 : dp);
  return String(v) + '%';
}

/* ---------- answer parsing ---------- */
function parseNumber(input) {
  let s = String(input).trim();
  s = s.replace(/[$£€]/g, '').replace(/%/g, '').replace(/,/g, '').replace(/\s+/g, ' ').trim();
  if (!s) return NaN;
  const mm = s.match(/^(-?\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/);
  if (mm) {
    const w = Number(mm[1]);
    const sign = w < 0 || /^-/.test(mm[1]) ? -1 : 1;
    const val = Math.abs(w) + Number(mm[2]) / Number(mm[3]);
    return sign * val;
  }
  if (/^-?\d+\s*\/\s*-?\d+$/.test(s)) {
    const parts = s.split('/');
    const a = Number(parts[0].trim()), b = Number(parts[1].trim());
    return b ? a / b : NaN;
  }
  if (/^-?\d+(?:\.\d+)?$/.test(s)) return Number(s);
  return NaN;
}
function parsePoint(input) {
  const m = String(input).match(/^\s*\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?\s*$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}
function parseRatio(input) {
  let s = String(input).trim().toLowerCase().replace(/\s+/g, ' ');
  let m = s.match(/^(-?\d+(?:\.\d+)?)\s*(?::|to|\/)\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  let a = Number(m[1]), b = Number(m[2]);
  if (!b) return null;
  const g = gcd(Math.round(Math.abs(a) * 1000), Math.round(Math.abs(b) * 1000)) || 1;
  return { a: a, b: b };
}
function normText(s) {
  return String(s)
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, function (d) { return '^' + '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d); })
    .replace(/\s+/g, ' ')
    .trim();
}
function superscript(n) {
  const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  return String(n).split('').map(function (ch) { return map[ch] || ch; }).join('');
}
function parsePrimeFactor(input) {
  let s = String(input).toLowerCase();
  s = s.replace(/[×·]/g, ' ').replace(/\*/g, ' ').replace(/x/g, ' ');
  s = s.replace(/[²]/g, '^2').replace(/[³]/g, '^3').replace(/[⁴]/g, '^4')
       .replace(/[⁵]/g, '^5').replace(/[⁶]/g, '^6').replace(/[⁷]/g, '^7')
       .replace(/[⁸]/g, '^8').replace(/[⁹]/g, '^9');
  const tokens = s.split(/[\s,]+/).filter(Boolean);
  const out = [];
  for (const t of tokens) {
    const m = t.match(/^(\d+)(?:\^(\d+))?$/);
    if (!m) return null;
    const base = Number(m[1]);
    const exp = m[2] ? Number(m[2]) : 1;
    if (!isPrime(base)) return null;
    for (let i = 0; i < exp; i++) out.push(base);
  }
  out.sort((a, b) => a - b);
  return out;
}

/* ---------- answer checking ---------- */
function checkAnswer(q, response) {
  if (q.type === 'choice') return Number(response) === q.a;
  if (q.type === 'num') {
    const v = parseNumber(response);
    const tol = q.tol === undefined ? 1e-6 : q.tol;
    return isFinite(v) && Math.abs(v - q.a) <= tol;
  }
  if (q.type === 'frac') {
    const v = parseNumber(response);
    return isFinite(v) && Math.abs(v - fval(q.a)) <= 1e-6;
  }
  if (q.type === 'point') {
    const p = parsePoint(response);
    return !!p && Math.abs(p[0] - q.a[0]) < 1e-9 && Math.abs(p[1] - q.a[1]) < 1e-9;
  }
  if (q.type === 'ratio') {
    const p = parseRatio(response);
    if (!p) return false;
    const t = q.a;
    return Math.abs(p.a * t.b - p.b * t.a) < 1e-9;
  }
  if (q.type === 'text') {
    const n = normText(response);
    const ok = [q.a].concat(q.accept || []).map(normText);
    return ok.indexOf(n) !== -1;
  }
  if (q.type === 'pf') {
    const p = parsePrimeFactor(response);
    if (!p) return false;
    const target = q.a.slice().sort((a, b) => a - b);
    return p.length === target.length && p.every((v, i) => v === target[i]);
  }
  return false;
}

function answerDisplay(q) {
  if (q.type === 'frac') {
    const mp = mixedParts(q.a);
    const val = q.display && mp.whole !== 0 ? mixedHTML(q.a) : fHTML(q.a);
    return val + (q.unit ? ' ' + q.unit : '');
  }
  if (q.display) return q.display;
  if (q.type === 'choice') return q.choices[q.a];
  if (q.type === 'point') return '(' + q.a[0] + ', ' + q.a[1] + ')';
  if (q.type === 'ratio') return q.a.a + ':' + q.a.b;
  if (q.type === 'pf') {
    const counts = {};
    q.a.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
    return Object.keys(counts).sort((a, b) => a - b).map(p => counts[p] > 1 ? p + '^' + counts[p] : p).join(' × ');
  }
  if (q.type === 'num') return fmt(q.a) + (q.unit ? ' ' + q.unit : '');
  return String(q.a);
}

/* ---------- multiple choice ---------- */
function mc(r, correct, wrongs) {
  const all = [String(correct)];
  for (const w of wrongs) {
    const s = String(w);
    if (all.indexOf(s) === -1) all.push(s);
  }
  const arr = shuffle(r, all);
  return { choices: arr, index: arr.indexOf(String(correct)) };
}
function choiceQ(r, prompt, correct, wrongs, sol, extra) {
  const m = mc(r, correct, wrongs);
  return Object.assign({ q: prompt, type: 'choice', a: m.index, choices: m.choices, sol: sol }, extra || {});
}

/* ---------- visual helpers ---------- */
function tableHTML(headers, rows) {
  let h = '<table class="qtable"><thead><tr>';
  headers.forEach(x => { h += '<th>' + x + '</th>'; });
  h += '</tr></thead><tbody>';
  rows.forEach(row => {
    h += '<tr>';
    row.forEach(cell => { h += '<td>' + cell + '</td>'; });
    h += '</tr>';
  });
  return h + '</tbody></table>';
}

function numberLineHTML(min, max, marks, points, opts) {
  opts = opts || {};
  const W = 560, H = 96, pad = 34;
  const span = max - min;
  const x = v => pad + ((v - min) / span) * (W - pad * 2);
  const y = 58;
  let s = '<svg class="qsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Number line from ' + min + ' to ' + max + '">';
  s += '<line x1="' + pad + '" y1="' + y + '" x2="' + (W - pad) + '" y2="' + y + '" stroke="#374151" stroke-width="2"/>';
  s += '<polygon points="' + (W - pad) + ',' + y + ' ' + (W - pad - 9) + ',' + (y - 5) + ' ' + (W - pad - 9) + ',' + (y + 5) + '" fill="#374151"/>';
  for (let v = min; v <= max; v += marks) {
    const px = x(v);
    s += '<line x1="' + px + '" y1="' + (y - 6) + '" x2="' + px + '" y2="' + (y + 6) + '" stroke="#374151" stroke-width="1.6"/>';
    s += '<text x="' + px + '" y="' + (y + 24) + '" text-anchor="middle" font-size="12" fill="#4b5563">' + v + '</text>';
  }
  (points || []).forEach(p => {
    const px = x(p.v);
    s += '<circle cx="' + px + '" cy="' + y + '" r="6" fill="' + (p.color || '#db3832') + '"/>';
    if (p.label) s += '<text x="' + px + '" y="' + (y - 14) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#111827">' + p.label + '</text>';
  });
  if (opts.ray) {
    const px = x(opts.ray.from);
    const left = opts.ray.dir === 'left';
    s += '<line x1="' + px + '" y1="' + y + '" x2="' + (left ? pad : W - pad) + '" y2="' + y + '" stroke="#db3832" stroke-width="4" opacity=".75"/>';
    s += '<circle cx="' + px + '" cy="' + y + '" r="6" fill="' + (opts.ray.open ? '#fff' : '#db3832') + '" stroke="#db3832" stroke-width="3"/>';
  }
  return s + '</svg>';
}

function coordGridHTML(points, opts) {
  opts = opts || {};
  const min = opts.min === undefined ? -6 : opts.min;
  const max = opts.max === undefined ? 6 : opts.max;
  const W = 380, H = 380, pad = 26;
  const span = max - min;
  const x = v => pad + ((v - min) / span) * (W - pad * 2);
  const y = v => H - pad - ((v - min) / span) * (H - pad * 2);
  let s = '<svg class="qsvg grid" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Coordinate grid from ' + min + ' to ' + max + '">';
  for (let v = min; v <= max; v++) {
    s += '<line x1="' + x(v) + '" y1="' + pad + '" x2="' + x(v) + '" y2="' + (H - pad) + '" stroke="#e5e7eb" stroke-width="1"/>';
    s += '<line x1="' + pad + '" y1="' + y(v) + '" x2="' + (W - pad) + '" y2="' + y(v) + '" stroke="#e5e7eb" stroke-width="1"/>';
  }
  s += '<line x1="' + pad + '" y1="' + y(0) + '" x2="' + (W - pad) + '" y2="' + y(0) + '" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + x(0) + '" y1="' + (H - pad) + '" x2="' + x(0) + '" y2="' + pad + '" stroke="#374151" stroke-width="2"/>';
  s += '<text x="' + (W - pad) + '" y="' + (y(0) - 8) + '" text-anchor="end" font-size="12" fill="#374151">x</text>';
  s += '<text x="' + (x(0) + 8) + '" y="' + (pad + 6) + '" font-size="12" fill="#374151">y</text>';
  for (let v = min + 1; v <= max - 1; v++) {
    if (v === 0) continue;
    s += '<text x="' + x(v) + '" y="' + (y(0) + 15) + '" text-anchor="middle" font-size="9" fill="#9ca3af">' + v + '</text>';
    s += '<text x="' + (x(0) - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end" font-size="9" fill="#9ca3af">' + v + '</text>';
  }
  if (opts.rect) {
    const r = opts.rect;
    const pts = [[r.x1, r.y1], [r.x2, r.y1], [r.x2, r.y2], [r.x1, r.y2]].map(p => x(p[0]) + ',' + y(p[1])).join(' ');
    s += '<polygon points="' + pts + '" fill="rgba(219,56,50,.08)" stroke="#db3832" stroke-width="2"/>';
  }
  (points || []).forEach(p => {
    s += '<circle cx="' + x(p.x) + '" cy="' + y(p.y) + '" r="6" fill="' + (p.color || '#db3832') + '" stroke="#fff" stroke-width="2"/>';
    if (p.label) s += '<text x="' + (x(p.x) + 10) + '" y="' + (y(p.y) - 8) + '" font-size="13" font-weight="700" fill="#111827">' + p.label + '</text>';
  });
  return s + '</svg>';
}

function dotPlotHTML(values, unit) {
  const counts = {};
  values.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  const keys = Object.keys(counts).map(Number).sort((a, b) => a - b);
  const maxC = Math.max(...keys.map(k => counts[k]));
  let s = '<div class="dotplot"><div class="dp-cols">';
  keys.forEach(k => {
    s += '<div class="dp-col"><div class="dp-stack">';
    for (let i = 0; i < counts[k]; i++) s += '<span class="dd"></span>';
    s += '</div><div class="dp-label">' + k + '</div></div>';
  });
  s += '</div>';
  if (unit) s += '<div class="dp-unit">' + unit + '</div>';
  return s + '</div>';
}

function barChartHTML(labels, values, unit) {
  const max = Math.max(...values);
  let s = '<div class="barchart">';
  labels.forEach((lab, i) => {
    const h = Math.max(4, Math.round((values[i] / max) * 110));
    s += '<div class="bar-col"><div class="bar-val">' + values[i] + '</div><div class="chart-bar" style="height:' + h + 'px"></div><div class="bar-lab">' + lab + '</div></div>';
  });
  s += '</div>';
  if (unit) s += '<div class="chart-unit">' + unit + '</div>';
  return s;
}

/* ---------- geometry diagrams ---------- */
function fitPoints(points, W, H, pad) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
  const minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const s = Math.min((W - 2 * pad) / w, (H - 2 * pad) / h);
  const ox = pad - minX * s + ((W - 2 * pad) - w * s) / 2;
  const oy = pad - minY * s + ((H - 2 * pad) - h * s) / 2;
  return points.map(p => [ox + p[0] * s, oy + p[1] * s]);
}
function ptsAttr(pts) { return pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '); }

function angleSVG(deg, label) {
  const W = 280, H = 180, vx = 135, vy = 150, r = 108;
  const rad = deg * Math.PI / 180;
  const x2 = vx + r * Math.cos(rad), y2 = vy - r * Math.sin(rad);
  const ar = 46, ax = vx + ar * Math.cos(rad), ay = vy - ar * Math.sin(rad);
  const lr = 72, lx = vx + lr * Math.cos(rad / 2), ly = vy - lr * Math.sin(rad / 2);
  const txt = label === undefined ? deg + '°' : label;
  return '<svg class="qsvg geo" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Angle diagram">' +
    '<line x1="' + vx + '" y1="' + vy + '" x2="' + (vx + r) + '" y2="' + vy + '" stroke="#374151" stroke-width="2.5"/>' +
    '<line x1="' + vx + '" y1="' + vy + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#374151" stroke-width="2.5"/>' +
    '<path d="M ' + (vx + ar) + ' ' + vy + ' A ' + ar + ' ' + ar + ' 0 0 0 ' + ax.toFixed(1) + ' ' + ay.toFixed(1) + '" fill="none" stroke="#db3832" stroke-width="2"/>' +
    '<circle cx="' + vx + '" cy="' + vy + '" r="3.5" fill="#374151"/>' +
    (txt ? '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#b32822">' + txt + '</text>' : '') +
  '</svg>';
}

function anglePairSVG(kind, known) {
  const W = 330, H = 190;
  const rad = known * Math.PI / 180;
  const comp = kind === 'comp';
  const vx = comp ? 62 : 165, vy = 155;
  const splitLen = comp ? 240 : 135;
  const splitX = vx + splitLen * Math.cos(rad), splitY = vy - splitLen * Math.sin(rad);
  const arcR = 44, labR = 66;
  let s = '<svg class="qsvg geo" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (comp ? 'Complementary' : 'Supplementary') + ' angle diagram">';
  if (comp) {
    s += '<line x1="' + vx + '" y1="' + vy + '" x2="300" y2="' + vy + '" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="' + vx + '" y1="' + vy + '" x2="' + vx + '" y2="22" stroke="#374151" stroke-width="2.5"/>';
    s += '<path d="M ' + (vx + 18) + ' ' + vy + ' L ' + (vx + 18) + ' ' + (vy - 18) + ' L ' + vx + ' ' + (vy - 18) + '" fill="none" stroke="#9ca3af" stroke-width="1.5"/>';
    const a1 = vx + arcR, a2x = vx + arcR * Math.cos(rad), a2y = vy - arcR * Math.sin(rad);
    s += '<path d="M ' + a1 + ' ' + vy + ' A ' + arcR + ' ' + arcR + ' 0 0 0 ' + a2x.toFixed(1) + ' ' + a2y.toFixed(1) + '" fill="none" stroke="#db3832" stroke-width="2"/>';
    const a3x = vx + (arcR + 10) * Math.cos(rad), a3y = vy - (arcR + 10) * Math.sin(rad);
    s += '<path d="M ' + a3x.toFixed(1) + ' ' + a3y.toFixed(1) + ' A ' + (arcR + 10) + ' ' + (arcR + 10) + ' 0 0 0 ' + vx + ' ' + (vy - arcR - 10) + '" fill="none" stroke="#9ca3af" stroke-width="1.5"/>';
    const m1 = rad / 2, m2 = (rad + Math.PI / 2) / 2;
    s += '<text x="' + (vx + labR * Math.cos(m1)).toFixed(1) + '" y="' + (vy - labR * Math.sin(m1)).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#b32822">' + known + '°</text>';
    s += '<text x="' + (vx + labR * Math.cos(m2)).toFixed(1) + '" y="' + (vy - labR * Math.sin(m2)).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#6b7280">?</text>';
  } else {
    s += '<line x1="20" y1="' + vy + '" x2="310" y2="' + vy + '" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="' + vx + '" y1="' + vy + '" x2="' + splitX.toFixed(1) + '" y2="' + splitY.toFixed(1) + '" stroke="#374151" stroke-width="2.5"/>';
    const a1x = vx + arcR, a2x = vx + arcR * Math.cos(rad), a2y = vy - arcR * Math.sin(rad);
    s += '<path d="M ' + a1x + ' ' + vy + ' A ' + arcR + ' ' + arcR + ' 0 0 0 ' + a2x.toFixed(1) + ' ' + a2y.toFixed(1) + '" fill="none" stroke="#db3832" stroke-width="2"/>';
    const a3x = vx - (arcR + 10), a3y = vy, a4x = vx + (arcR + 10) * Math.cos(rad), a4y = vy - (arcR + 10) * Math.sin(rad);
    s += '<path d="M ' + a3x + ' ' + a3y + ' A ' + (arcR + 10) + ' ' + (arcR + 10) + ' 0 0 1 ' + a4x.toFixed(1) + ' ' + a4y.toFixed(1) + '" fill="none" stroke="#9ca3af" stroke-width="1.5"/>';
    const m1 = rad / 2, m2 = (rad + Math.PI) / 2;
    s += '<text x="' + (vx + labR * Math.cos(m1)).toFixed(1) + '" y="' + (vy - labR * Math.sin(m1)).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#b32822">' + known + '°</text>';
    s += '<text x="' + (vx + labR * Math.cos(m2)).toFixed(1) + '" y="' + (vy - labR * Math.sin(m2)).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#6b7280">?</text>';
  }
  s += '<circle cx="' + vx + '" cy="' + vy + '" r="3.5" fill="#374151"/>';
  return s + '</svg>';
}

function triangleSVG(angles, opts) {
  opts = opts || {};
  const a = angles[0], b = angles[1], c = angles[2] == null ? 180 - a - b : angles[2];
  if (a <= 0 || b <= 0 || c <= 0) return '';
  const A = a * Math.PI / 180, B = b * Math.PI / 180, C = c * Math.PI / 180;
  const AB = 210;
  const AC = AB * Math.sin(B) / Math.sin(C);
  let pts = [[0, 0], [AB, 0], [AC * Math.cos(A), -AC * Math.sin(A)]];
  pts = fitPoints(pts, 330, 225, 32);
  const Cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
  const Cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
  let s = '<svg class="qsvg geo" viewBox="0 0 330 225" role="img" aria-label="Triangle diagram">';
  s += '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5" stroke-linejoin="round"/>';
  const labels = [angles[0], angles[1], angles[2] == null ? '?' : c];
  pts.forEach(function (p, i) {
    const lx = p[0] + (Cx - p[0]) * 0.28, ly = p[1] + (Cy - p[1]) * 0.28 + 5;
    s += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="700" fill="' + (labels[i] === '?' ? '#6b7280' : '#b32822') + '">' + (labels[i] === '?' ? '?' : labels[i] + '°') + '</text>';
  });
  return s + '</svg>';
}

function triangleSidesSVG(sides) {
  const a = sides[0], b = sides[1], c = sides[2];
  const x = (b * b + c * c - a * a) / (2 * c);
  const y = Math.sqrt(Math.max(1, b * b - x * x));
  let pts = [[0, 0], [c, 0], [x, -y]];
  pts = fitPoints(pts, 330, 225, 34);
  let s = '<svg class="qsvg geo" viewBox="0 0 330 225" role="img" aria-label="Triangle with labelled sides">';
  s += '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5" stroke-linejoin="round"/>';
  const mids = [[(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], [(pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2], [(pts[2][0] + pts[0][0]) / 2, (pts[2][1] + pts[0][1]) / 2]];
  const vals = [c, a, b];
  mids.forEach(function (p, i) {
    s += '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 16).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#b32822">' + vals[i] + ' cm</text>';
  });
  return s + '</svg>';
}

function quadSVG(angles) {
  let pts = [[0, 0], [215, 0], [255, -120], [18, -145]];
  pts = fitPoints(pts, 330, 230, 34);
  const Cx = (pts[0][0] + pts[1][0] + pts[2][0] + pts[3][0]) / 4;
  const Cy = (pts[0][1] + pts[1][1] + pts[2][1] + pts[3][1]) / 4;
  let s = '<svg class="qsvg geo" viewBox="0 0 330 230" role="img" aria-label="Quadrilateral diagram">';
  s += '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5" stroke-linejoin="round"/>';
  angles.forEach(function (v, i) {
    const p = pts[i];
    const lx = p[0] + (Cx - p[0]) * 0.24, ly = p[1] + (Cy - p[1]) * 0.24 + 5;
    s += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + (v == null ? '#6b7280' : '#b32822') + '">' + (v == null ? '?' : v + '°') + '</text>';
  });
  return s + '</svg>';
}

function polygonSVG(n, opts) {
  opts = opts || {};
  const cx = 160, cy = 112, r = 82;
  let pts = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  let s = '<svg class="qsvg geo" viewBox="0 0 320 225" role="img" aria-label="Regular polygon with ' + n + ' sides">';
  s += '<polygon points="' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5" stroke-linejoin="round"/>';
  if (opts.sideLabel) {
    const p1 = pts[0], p2 = pts[1];
    s += '<text x="' + ((p1[0] + p2[0]) / 2 + 6).toFixed(1) + '" y="' + ((p1[1] + p2[1]) / 2 + 16).toFixed(1) + '" font-size="12" font-weight="700" fill="#b32822">' + opts.sideLabel + '</text>';
  }
  return s + '</svg>';
}

function symmetryShapeSVG(kind) {
  let pts = [];
  let shape = '';
  if (kind === 'square') {
    shape = '<rect x="95" y="45" width="120" height="120" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  } else if (kind === 'rectangle') {
    shape = '<rect x="70" y="60" width="170" height="90" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  } else if (kind === 'equilateral') {
    pts = [[160, 38], [248, 170], [72, 170]];
    shape = '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  } else if (kind === 'isosceles') {
    pts = [[160, 38], [232, 170], [88, 170]];
    shape = '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  } else {
    const n = kind === 'pentagon' ? 5 : 6;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      pts.push([160 + 78 * Math.cos(a), 112 + 78 * Math.sin(a)]);
    }
    shape = '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  }
  return '<svg class="qsvg geo" viewBox="0 0 320 225" role="img" aria-label="Shape diagram">' + shape + '</svg>';
}

function solidSVG(kind) {
  let s = '<svg class="qsvg geo" viewBox="0 0 340 240" role="img" aria-label="' + kind + ' diagram">';
  if (kind === 'cube' || kind === 'rectangular prism') {
    const w = kind === 'cube' ? 110 : 130, h = 85, dx = 38, dy = -28, x = 80, y = 130;
    s += '<polygon points="' + (x + dx) + ',' + (y - h + dy) + ' ' + (x + w + dx) + ',' + (y - h + dy) + ' ' + (x + w + dx) + ',' + (y + dy) + ' ' + (x + dx) + ',' + (y + dy) + '" fill="#f3f0ea" stroke="#374151" stroke-width="2"/>';
    s += '<rect x="' + x + '" y="' + (y - h) + '" width="' + w + '" height="' + h + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="' + x + '" y1="' + (y - h) + '" x2="' + (x + dx) + '" y2="' + (y - h + dy) + '" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="' + (x + w) + '" y1="' + (y - h) + '" x2="' + (x + w + dx) + '" y2="' + (y - h + dy) + '" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="' + (x + w) + '" y1="' + y + '" x2="' + (x + w + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="1.5" stroke-dasharray="5 4"/>';
    s += '<line x1="' + (x + dx) + '" y1="' + (y - h + dy) + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="1.5" stroke-dasharray="5 4"/>';
  } else if (kind === 'triangular prism') {
    const x = 75, y = 165, w = 150, h = 100, dx = 38, dy = -28;
    s += '<polygon points="' + x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w / 2) + ',' + (y - h) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<polygon points="' + (x + dx) + ',' + (y + dy) + ' ' + (x + w + dx) + ',' + (y + dy) + ' ' + (x + w / 2 + dx) + ',' + (y - h + dy) + '" fill="#f3f0ea" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="' + (x + w) + '" y1="' + y + '" x2="' + (x + w + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="' + (x + w / 2) + '" y1="' + (y - h) + '" x2="' + (x + w / 2 + dx) + '" y2="' + (y - h + dy) + '" stroke="#374151" stroke-width="2"/>';
  } else if (kind === 'square pyramid') {
    s += '<polygon points="70,150 210,150 250,112 110,112" fill="#f3f0ea" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="160" y1="38" x2="70" y2="150" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="160" y1="38" x2="210" y2="150" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="160" y1="38" x2="250" y2="112" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="160" y1="38" x2="110" y2="112" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="110" y1="112" x2="210" y2="150" stroke="#374151" stroke-width="1.5" stroke-dasharray="5 4"/>';
  } else {
    s += '<polygon points="80,160 220,160 160,128" fill="#f8f6f2" stroke="#374151" stroke-width="2"/>';
    s += '<line x1="150" y1="40" x2="80" y2="160" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="150" y1="40" x2="220" y2="160" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="150" y1="40" x2="160" y2="128" stroke="#374151" stroke-width="2.5"/>';
    s += '<line x1="150" y1="40" x2="160" y2="128" stroke="#374151" stroke-width="1.5" stroke-dasharray="5 4"/>';
  }
  return s + '</svg>';
}

function rectSVG(l, w, opts) {
  opts = opts || {};
  const scale = Math.min(220 / Math.max(l, 1), 120 / Math.max(w, 1));
  const bw = l * scale, hh = w * scale;
  const x = (300 - bw) / 2, y = 165 - hh;
  let s = '<svg class="qsvg geo" viewBox="0 0 300 200" role="img" aria-label="Rectangle diagram">';
  s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  if (opts.area) s += '<text x="150" y="' + (y + hh / 2 + 5).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#6b7280">A = ' + opts.area + ' cm²</text>';
  s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="188" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + l + ' cm</text>';
  s += '<text x="' + (x + bw + 10).toFixed(1) + '" y="' + (y + hh / 2).toFixed(1) + '" font-size="12" font-weight="700" fill="#b32822">' + (opts.hideWidth ? '?' : w + ' cm') + '</text>';
  return s + '</svg>';
}

function parallelogramSVG(b, h) {
  const scale = Math.min(220 / b, 120 / h);
  const bw = b * scale, hh = h * scale, off = 34, x = 45, y = 165;
  let s = '<svg class="qsvg geo" viewBox="0 0 300 200" role="img" aria-label="Parallelogram diagram">';
  s += '<polygon points="' + x + ',' + y + ' ' + (x + bw) + ',' + y + ' ' + (x + bw + off) + ',' + (y - hh) + ' ' + (x + off) + ',' + (y - hh) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  s += '<line x1="' + (x + off) + '" y1="' + (y - hh) + '" x2="' + (x + off) + '" y2="' + y + '" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + (x + bw / 2) + '" y="188" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + b + ' cm</text>';
  s += '<text x="' + (x + off + 7) + '" y="' + (y - hh / 2) + '" font-size="12" font-weight="700" fill="#b32822">' + h + ' cm</text>';
  return s + '</svg>';
}

function triangleAreaSVG(b, h) {
  const scale = Math.min(220 / b, 115 / h);
  const bw = b * scale, hh = h * scale, x = 45, y = 165;
  const apex = x + bw / 2;
  let s = '<svg class="qsvg geo" viewBox="0 0 300 200" role="img" aria-label="Triangle diagram with base and height">';
  s += '<polygon points="' + x + ',' + y + ' ' + (x + bw) + ',' + y + ' ' + apex + ',' + (y - hh) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  s += '<line x1="' + apex + '" y1="' + (y - hh) + '" x2="' + apex + '" y2="' + y + '" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + (x + bw / 2) + '" y="188" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + b + ' cm</text>';
  s += '<text x="' + (apex + 8) + '" y="' + (y - hh / 2) + '" font-size="12" font-weight="700" fill="#b32822">' + h + ' cm</text>';
  return s + '</svg>';
}

function trapezoidSVG(a, b, h) {
  const scale = Math.min(210 / b, 115 / h);
  const bw = b * scale, aw = a * scale, hh = h * scale, x = 45, y = 165;
  const cx = x + bw / 2;
  let s = '<svg class="qsvg geo" viewBox="0 0 300 200" role="img" aria-label="Trapezoid diagram">';
  s += '<polygon points="' + x + ',' + y + ' ' + (x + bw) + ',' + y + ' ' + (cx + aw / 2) + ',' + (y - hh) + ' ' + (cx - aw / 2) + ',' + (y - hh) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  s += '<line x1="' + (cx - aw / 2) + '" y1="' + (y - hh) + '" x2="' + (cx - aw / 2) + '" y2="' + y + '" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + cx + '" y="188" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + b + ' cm</text>';
  s += '<text x="' + cx + '" y="' + (y - hh - 8) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + a + ' cm</text>';
  s += '<text x="' + (cx - aw / 2 + 8) + '" y="' + (y - hh / 2) + '" font-size="12" font-weight="700" fill="#b32822">' + h + ' cm</text>';
  return s + '</svg>';
}

function compoundSVG(W, H, w, h) {
  let pts = [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]];
  pts = fitPoints(pts, 310, 200, 34);
  let s = '<svg class="qsvg geo" viewBox="0 0 310 200" role="img" aria-label="L-shaped compound figure">';
  s += '<polygon points="' + ptsAttr(pts) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  s += '<text x="' + ((pts[0][0] + pts[1][0]) / 2).toFixed(1) + '" y="' + (pts[0][1] - 8).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + W + ' m</text>';
  s += '<text x="' + (pts[0][0] - 10).toFixed(1) + '" y="' + ((pts[0][1] + pts[5][1]) / 2).toFixed(1) + '" text-anchor="end" font-size="12" font-weight="700" fill="#b32822">' + H + ' m</text>';
  s += '<text x="' + ((pts[3][0] + pts[4][0]) / 2).toFixed(1) + '" y="' + (pts[4][1] + 16).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#6b7280">' + w + ' m</text>';
  s += '<text x="' + (pts[4][0] + 6).toFixed(1) + '" y="' + ((pts[3][1] + pts[4][1]) / 2).toFixed(1) + '" font-size="12" font-weight="700" fill="#6b7280">' + h + ' m</text>';
  return s + '</svg>';
}

function prismSVG(l, w, h) {
  const scale = Math.min(150 / l, 90 / h, 90 / w);
  const fw = l * scale, fh = h * scale, dx = 30, dy = -24;
  const x = 80, y = 160;
  let s = '<svg class="qsvg geo" viewBox="0 0 320 220" role="img" aria-label="Rectangular prism diagram">';
  s += '<polygon points="' + (x + dx) + ',' + (y - fh + dy) + ' ' + (x + fw + dx) + ',' + (y - fh + dy) + ' ' + (x + fw + dx) + ',' + (y + dy) + ' ' + (x + dx) + ',' + (y + dy) + '" fill="#f3f0ea" stroke="#374151" stroke-width="2"/>';
  s += '<rect x="' + x + '" y="' + (y - fh) + '" width="' + fw + '" height="' + fh + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  s += '<line x1="' + x + '" y1="' + (y - fh) + '" x2="' + (x + dx) + '" y2="' + (y - fh + dy) + '" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + (x + fw) + '" y1="' + (y - fh) + '" x2="' + (x + fw + dx) + '" y2="' + (y - fh + dy) + '" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + (x + fw) + '" y1="' + y + '" x2="' + (x + fw + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<line x1="' + (x + dx) + '" y1="' + (y - fh + dy) + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + (x + fw / 2) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#b32822">' + l + ' cm</text>';
  s += '<text x="' + (x + fw + 12) + '" y="' + (y - fh / 2) + '" font-size="12" font-weight="700" fill="#b32822">' + h + ' cm</text>';
  s += '<text x="' + (x + fw + dx - 6) + '" y="' + (y + dy / 2 + 8) + '" font-size="12" font-weight="700" fill="#6b7280">' + w + ' cm</text>';
  return s + '</svg>';
}

function triPrismSVG(a, b, c, L) {
  const scale = Math.min(110 / Math.max(a, b), 90 / L);
  const aw = a * scale, bh = b * scale, dx = 34, dy = -26, x = 75, y = 165;
  let s = '<svg class="qsvg geo" viewBox="0 0 330 225" role="img" aria-label="Triangular prism diagram">';
  s += '<polygon points="' + x + ',' + y + ' ' + (x + aw) + ',' + y + ' ' + x + ',' + (y - bh) + '" fill="#f8f6f2" stroke="#374151" stroke-width="2.5"/>';
  s += '<polygon points="' + (x + dx) + ',' + (y + dy) + ' ' + (x + aw + dx) + ',' + (y + dy) + ' ' + (x + dx) + ',' + (y - bh + dy) + '" fill="#f3f0ea" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + (x + aw) + '" y1="' + y + '" x2="' + (x + aw + dx) + '" y2="' + (y + dy) + '" stroke="#374151" stroke-width="2"/>';
  s += '<line x1="' + x + '" y1="' + (y - bh) + '" x2="' + (x + dx) + '" y2="' + (y - bh + dy) + '" stroke="#374151" stroke-width="2"/>';
  s += '<text x="' + (x + aw / 2) + '" y="' + (y + 17) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#b32822">' + a + ' cm</text>';
  s += '<text x="' + (x - 7) + '" y="' + (y - bh / 2) + '" text-anchor="end" font-size="11" font-weight="700" fill="#b32822">' + b + ' cm</text>';
  s += '<text x="' + (x + aw / 2 + 12) + '" y="' + (y - bh / 2 - 4) + '" font-size="11" font-weight="700" fill="#6b7280">' + c + ' cm</text>';
  s += '<text x="' + (x + aw + dx + 8) + '" y="' + (y + dy / 2) + '" font-size="11" font-weight="700" fill="#6b7280">' + L + ' cm</text>';
  return s + '</svg>';
}
const UNITS = [];
const SKILLS = [];
function U(def) { UNITS.push(def); }
function S(unit, id, name, gen, hint) {
  SKILLS.push({ unit: unit, id: unit + '-' + id, name: name, gen: gen, hint: hint });
}

/* ---------- common hints ---------- */
const H = {
  add: 'Line up the place values, then add or subtract column by column from the right.',
  sub: 'Line up the place values, then subtract column by column, regrouping when needed.',
  mult: 'Multiply by each digit of the second factor, then add the partial products.',
  div: 'Use long division: divide, multiply, subtract, bring down.',
  fracAdd: 'Find a common denominator, add the numerators, then simplify.',
  fracMul: 'Multiply the numerators and multiply the denominators, then simplify.',
  fracDiv: 'To divide by a fraction, multiply by its reciprocal (flip the second fraction).',
  decimal: 'Line up the decimal points before adding or subtracting.',
  percent: 'Write the percent as a decimal, then multiply: part = percent × whole.',
  equation: 'Do the inverse operation to both sides to get the variable alone.',
  integer: 'Think of a number line: adding a negative moves left; subtracting a negative moves right.',
  measure: 'Use the formula, substitute the values, and remember the square or cubic units.'
};
