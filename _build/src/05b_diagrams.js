/* ============================================================
   Geometry & measurement diagrams (SVG)
   ============================================================ */

const DG = {
  stroke: '#374151',
  fill: '#eef3f8',
  accent: '#db3832',
  muted: '#6b7280',
  label: '#111827',
  dash: '#94a3b8'
};

function dgWrap(w, h, inner, label) {
  return '<svg class="qsvg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' + inner + '</svg>';
}
function dgText(x, y, txt, opts) {
  opts = opts || {};
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (opts.anchor || 'middle') + '" font-size="' + (opts.size || 15) + '" font-weight="' + (opts.weight || 700) + '" fill="' + (opts.fill || DG.label) + '">' + txt + '</text>';
}
function dgLine(x1, y1, x2, y2, opts) {
  opts = opts || {};
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (opts.stroke || DG.stroke) + '" stroke-width="' + (opts.width || 2.5) + '"' + (opts.dash ? ' stroke-dasharray="6 5"' : '') + '/>';
}
function dgPoly(points, opts) {
  opts = opts || {};
  return '<polygon points="' + points + '" fill="' + (opts.fill || DG.fill) + '" stroke="' + (opts.stroke || DG.stroke) + '" stroke-width="' + (opts.width || 2.5) + '"' + (opts.dash ? ' stroke-dasharray="6 5"' : '') + '/>';
}

/* ---------- angles ---------- */
function angleSVG(deg, label) {
  const W = 360, H = 230, vx = 180, vy = 185, L = 150, R = 45;
  const rad = deg * Math.PI / 180;
  const ex = vx + L * Math.cos(rad), ey = vy - L * Math.sin(rad);
  const ax = vx + R * Math.cos(rad), ay = vy - R * Math.sin(rad);
  const mx = vx + 76 * Math.cos(rad / 2), my = vy - 76 * Math.sin(rad / 2);
  let s = dgLine(vx, vy, vx + L, vy) + dgLine(vx, vy, ex, ey);
  s += '<path d="M ' + (vx + R) + ' ' + vy + ' A ' + R + ' ' + R + ' 0 0 0 ' + ax + ' ' + ay + '" fill="none" stroke="' + DG.accent + '" stroke-width="2.2"/>';
  s += '<circle cx="' + vx + '" cy="' + vy + '" r="4" fill="' + DG.stroke + '"/>';
  s += dgText(mx, my + 5, label, { fill: '#b32822', size: 17 });
  if (deg === 90) s += '<path d="M ' + (vx + 20) + ' ' + vy + ' L ' + (vx + 20) + ' ' + (vy - 20) + ' L ' + vx + ' ' + (vy - 20) + '" fill="none" stroke="' + DG.muted + '" stroke-width="1.5"/>';
  return dgWrap(W, H, s, 'Angle measuring ' + deg + ' degrees');
}

function complementSVG(a) {
  const W = 360, H = 240, vx = 80, vy = 200, L = 230;
  const rad = a * Math.PI / 180;
  const px = vx + L * Math.cos(rad), py = vy - L * Math.sin(rad);
  const kx = vx + 66 * Math.cos(rad / 2), ky = vy - 66 * Math.sin(rad / 2);
  const ux = vx + 66 * Math.cos((a + 90) / 2 * Math.PI / 180), uy = vy - 66 * Math.sin((a + 90) / 2 * Math.PI / 180);
  let s = dgLine(vx, vy, vx + L, vy) + dgLine(vx, vy, vx, vy - L) + dgLine(vx, vy, px, py, { width: 2 });
  s += '<path d="M ' + (vx + 45) + ' ' + vy + ' A 45 45 0 0 0 ' + (vx + 45 * Math.cos(rad)) + ' ' + (vy - 45 * Math.sin(rad)) + '" fill="none" stroke="' + DG.accent + '" stroke-width="2"/>';
  s += '<path d="M ' + (vx + 45 * Math.cos(rad)) + ' ' + (vy - 45 * Math.sin(rad)) + ' A 45 45 0 0 0 ' + vx + ' ' + (vy - 45) + '" fill="none" stroke="' + DG.muted + '" stroke-width="1.6" stroke-dasharray="5 4"/>';
  s += '<path d="M ' + (vx + 18) + ' ' + vy + ' L ' + (vx + 18) + ' ' + (vy - 18) + ' L ' + vx + ' ' + (vy - 18) + '" fill="none" stroke="' + DG.muted + '" stroke-width="1.5"/>';
  s += dgText(kx, ky + 5, a + '°', { fill: '#b32822', size: 16 });
  s += dgText(ux, uy + 5, '?', { fill: DG.muted, size: 18 });
  return dgWrap(W, H, s, 'Complementary angles, one measuring ' + a + ' degrees');
}

function supplementSVG(b) {
  const W = 360, H = 230, vx = 180, vy = 190, L = 150;
  const rad = b * Math.PI / 180;
  const px = vx + L * Math.cos(rad), py = vy - L * Math.sin(rad);
  const kx = vx + 70 * Math.cos(rad / 2), ky = vy - 70 * Math.sin(rad / 2);
  const ux = vx + 70 * Math.cos((b + 180) / 2 * Math.PI / 180), uy = vy - 70 * Math.sin((b + 180) / 2 * Math.PI / 180);
  let s = dgLine(20, vy, 340, vy) + dgLine(vx, vy, px, py, { width: 2 });
  s += '<path d="M ' + (vx + 50) + ' ' + vy + ' A 50 50 0 0 0 ' + (vx + 50 * Math.cos(rad)) + ' ' + (vy - 50 * Math.sin(rad)) + '" fill="none" stroke="' + DG.accent + '" stroke-width="2"/>';
  s += '<path d="M ' + (vx + 50 * Math.cos(rad)) + ' ' + (vy - 50 * Math.sin(rad)) + ' A 50 50 0 0 0 ' + (vx - 50) + ' ' + vy + '" fill="none" stroke="' + DG.muted + '" stroke-width="1.6" stroke-dasharray="5 4"/>';
  s += '<circle cx="' + vx + '" cy="' + vy + '" r="4" fill="' + DG.stroke + '"/>';
  s += dgText(kx, ky + 5, b + '°', { fill: '#b32822', size: 16 });
  s += dgText(ux, uy + 5, '?', { fill: DG.muted, size: 18 });
  return dgWrap(W, H, s, 'Supplementary angles, one measuring ' + b + ' degrees');
}

function verticalAnglesSVG(a, opposite) {
  const W = 360, H = 260, cx = 180, cy = 130, L = 125;
  const rad = a * Math.PI / 180;
  const x1 = cx - L * Math.cos(rad), y1 = cy + L * Math.sin(rad);
  const x2 = cx + L * Math.cos(rad), y2 = cy - L * Math.sin(rad);
  let s = dgLine(40, cy, 320, cy) + dgLine(x1, y1, x2, y2, { width: 2 });
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + DG.stroke + '"/>';
  const r1 = 52;
  const kx = cx + r1 * Math.cos(rad / 2), ky = cy - r1 * Math.sin(rad / 2);
  s += '<path d="M ' + (cx + r1) + ' ' + cy + ' A ' + r1 + ' ' + r1 + ' 0 0 0 ' + (cx + r1 * Math.cos(rad)) + ' ' + (cy - r1 * Math.sin(rad)) + '" fill="none" stroke="' + DG.accent + '" stroke-width="2"/>';
  s += dgText(kx, ky + 5, a + '°', { fill: '#b32822', size: 15 });
  let qx, qy, label;
  if (opposite) {
    qx = cx + r1 * Math.cos((a + 180) / 2 * Math.PI / 180) * 1.25;
    qy = cy - r1 * Math.sin((a + 180) / 2 * Math.PI / 180) * 1.25;
    label = '?';
  } else {
    qx = cx + r1 * Math.cos((a + 180) / 2 * Math.PI / 180) * 1.25;
    qy = cy - r1 * Math.sin((a + 180) / 2 * Math.PI / 180) * 1.25;
    label = '?';
  }
  s += dgText(qx, qy + 5, label, { fill: DG.muted, size: 18 });
  return dgWrap(W, H, s, 'Two intersecting lines with one angle of ' + a + ' degrees');
}

/* ---------- triangles and quadrilaterals ---------- */
function triangleSVG(opts) {
  const W = 360, H = 250;
  const angles = opts.angles || [60, 60, 60];
  const labels = opts.labels || [];
  const sideLabels = opts.sides || [];
  const A = Math.max(12, Math.min(90, angles[0]));
  const B = Math.max(12, Math.min(90, angles[1]));
  const C = 180 - A - B;
  const base = 240, lx = 60, rx = 300, by = 205;
  const t = base * Math.sin(B * Math.PI / 180) / Math.sin((A + B) * Math.PI / 180);
  const ax = lx + t * Math.cos(A * Math.PI / 180);
  const ay = by - t * Math.sin(A * Math.PI / 180);
  const P = [[lx, by], [rx, by], [ax, ay]];
  let s = dgPoly(P.map(p => p[0] + ',' + p[1]).join(' '));
  const cen = [(lx + rx + ax) / 3, (by + by + ay) / 3];
  if (labels.length) {
    P.forEach((p, i) => {
      if (!labels[i]) return;
      const dx = cen[0] - p[0], dy = cen[1] - p[1];
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      s += dgText(p[0] + dx / d * 27, p[1] + dy / d * 27 + 5, labels[i], { size: 15 });
    });
  }
  if (sideLabels.length) {
    const mids = [
      [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2],
      [(P[1][0] + P[2][0]) / 2, (P[1][1] + P[2][1]) / 2],
      [(P[2][0] + P[0][0]) / 2, (P[2][1] + P[0][1]) / 2]
    ];
    mids.forEach((m, i) => {
      if (!sideLabels[i]) return;
      const dx = m[0] - cen[0], dy = m[1] - cen[1];
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      s += dgText(m[0] + dx / d * 17, m[1] + dy / d * 17 + 5, sideLabels[i], { size: 13, fill: DG.muted });
    });
  }
  return dgWrap(W, H, s, opts.aria || 'Triangle diagram');
}

function quadAnglesSVG(labels) {
  const W = 360, H = 250;
  const P = [[70, 55], [300, 75], [275, 215], [85, 195]];
  let s = dgPoly(P.map(p => p[0] + ',' + p[1]).join(' '));
  const cen = [(70 + 300 + 275 + 85) / 4, (55 + 75 + 215 + 195) / 4];
  P.forEach((p, i) => {
    const dx = cen[0] - p[0], dy = cen[1] - p[1];
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    s += dgText(p[0] + dx / d * 30, p[1] + dy / d * 30 + 5, labels[i], { size: 15 });
  });
  return dgWrap(W, H, s, 'Quadrilateral with labelled angles');
}

function regularPolygonSVG(n, sideLabel) {
  const W = 360, H = 250, cx = 180, cy = 120, rad = 82;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
    pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]);
  }
  let s = dgPoly(pts.map(p => p[0] + ',' + p[1]).join(' '));
  s += dgText(cx, 228, n + ' sides', { size: 13, fill: DG.muted, weight: 600 });
  if (sideLabel) {
    const p = pts[0], q = pts[1];
    s += dgText((p[0] + q[0]) / 2 + 18, (p[1] + q[1]) / 2, sideLabel, { size: 13, fill: DG.muted, anchor: 'start' });
  }
  return dgWrap(W, H, s, 'Regular polygon with ' + n + ' sides');
}

function shapeSVG(shape) {
  const W = 360, H = 250;
  let points = '';
  let label = shape;
  if (shape === 'square') points = '110,45 230,45 230,165 110,165';
  else if (shape === 'rectangle') points = '80,65 280,65 280,185 80,185';
  else if (shape === 'rhombus') points = '180,35 285,120 180,205 75,120';
  else if (shape === 'trapezoid') points = '85,185 275,185 230,65 130,65';
  else if (shape === 'parallelogram') points = '95,185 305,185 265,65 55,65';
  else if (shape === 'equilateral triangle') points = '180,40 280,200 80,200';
  else if (shape === 'isosceles triangle') points = '180,40 275,200 85,200';
  else {
    const n = shape === 'regular pentagon' ? 5 : shape === 'regular hexagon' ? 6 : 6;
    points = '';
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      points += (180 + 82 * Math.cos(ang)) + ',' + (120 + 82 * Math.sin(ang)) + ' ';
    }
  }
  let s = dgPoly(points.trim());
  return dgWrap(W, H, s, label);
}

/* ---------- solids ---------- */
function solidSVG(type, dims) {
  dims = dims || {};
  const W = 380, H = 280;
  let s = '';
  if (type === 'cube' || type === 'rect') {
    const x = 65, y = 125, w = 165, h = 105, dx = 75, dy = -55;
    const A = [x, y], B = [x + w, y], C = [x + w, y + h], D = [x, y + h];
    const A2 = [x + dx, y + dy], B2 = [x + w + dx, y + dy], C2 = [x + w + dx, y + h + dy], D2 = [x + dx, y + h + dy];
    s += dgPoly([A, B, C, D].map(p => p.join(',')).join(' '), { fill: '#eef3f8' });
    s += dgPoly([A, B, B2, A2].map(p => p.join(',')).join(' '), { fill: '#f8fafc' });
    s += dgPoly([B, C, C2, B2].map(p => p.join(',')).join(' '), { fill: '#e3ecf5' });
    s += dgLine(A[0], A[1], A2[0], A2[1]) + dgLine(D[0], D[1], D2[0], D2[1]) + dgLine(B[0], B[1], B2[0], B2[1]) + dgLine(B2[0], B2[1], C2[0], C2[1]);
    if (dims.l) s += dgText((A[0] + B[0]) / 2, A[1] + 24, dims.l, { size: 13, fill: DG.muted, weight: 600 });
    if (dims.h) s += dgText(A[0] - 14, (A[1] + D[1]) / 2, dims.h, { size: 13, fill: DG.muted, weight: 600, anchor: 'end' });
    if (dims.w) s += dgText((C[0] + C2[0]) / 2 + 18, (C[1] + C2[1]) / 2, dims.w, { size: 13, fill: DG.muted, weight: 600, anchor: 'start' });
  } else if (type === 'triprism') {
    const A = [85, 205], B = [250, 205], C = [165, 95], dx = 65, dy = -45;
    const A2 = [A[0] + dx, A[1] + dy], B2 = [B[0] + dx, B[1] + dy], C2 = [C[0] + dx, C[1] + dy];
    s += dgPoly([A, B, C].map(p => p.join(',')).join(' '), { fill: '#eef3f8' });
    s += dgPoly([A, B, B2, A2].map(p => p.join(',')).join(' '), { fill: '#f8fafc' });
    s += dgPoly([B, C, C2, B2].map(p => p.join(',')).join(' '), { fill: '#e3ecf5' });
    s += dgLine(A[0], A[1], A2[0], A2[1]) + dgLine(B[0], B[1], B2[0], B2[1]) + dgLine(C[0], C[1], C2[0], C2[1]) + dgLine(A2[0], A2[1], B2[0], B2[1]) + dgLine(B2[0], B2[1], C2[0], C2[1]);
    if (dims.a) s += dgText(75, 220, dims.a, { size: 12, fill: DG.muted, weight: 600 });
    if (dims.b) s += dgText(260, 222, dims.b, { size: 12, fill: DG.muted, weight: 600 });
    if (dims.L) s += dgText((B[0] + B2[0]) / 2 + 22, (B[1] + B2[1]) / 2, dims.L, { size: 12, fill: DG.muted, weight: 600, anchor: 'start' });
  } else if (type === 'square pyramid') {
    const A = [90, 205], B = [285, 205], C = [315, 155], D = [120, 155], T = [200, 70];
    s += dgPoly([A, B, C, D].map(p => p.join(',')).join(' '), { fill: '#e3ecf5' });
    s += dgPoly([A, B, T].map(p => p.join(',')).join(' '), { fill: '#f8fafc' });
    s += dgPoly([B, C, T].map(p => p.join(',')).join(' '), { fill: '#eef3f8' });
    s += dgLine(D[0], D[1], T[0], T[1]) + dgLine(C[0], C[1], T[0], T[1]);
  } else if (type === 'triangular pyramid') {
    const A = [90, 210], B = [290, 210], C = [190, 155], T = [195, 60];
    s += dgPoly([A, B, C].map(p => p.join(',')).join(' '), { fill: '#e3ecf5' });
    s += dgPoly([A, B, T].map(p => p.join(',')).join(' '), { fill: '#f8fafc' });
    s += dgLine(A[0], A[1], T[0], T[1]) + dgLine(C[0], C[1], T[0], T[1]);
  }
  return dgWrap(W, H, s, 'Three-dimensional solid: ' + type);
}

function netSVG(type) {
  const W = 360, H = 270;
  let s = '';
  if (type === 'cube' || type === 'rect') {
    const u = 50, x = 105, y = 55;
    const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
    cells.forEach(c => {
      s += '<rect x="' + (x + c[0] * u) + '" y="' + (y + c[1] * u) + '" width="' + u + '" height="' + u + '" fill="#eef3f8" stroke="' + DG.stroke + '" stroke-width="2"/>';
    });
  } else if (type === 'triprism') {
    const x = 55, y = 95, w = 70, h = 70;
    for (let i = 0; i < 3; i++) s += '<rect x="' + (x + i * w) + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#eef3f8" stroke="' + DG.stroke + '" stroke-width="2"/>';
    s += '<polygon points="' + x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w / 2) + ',' + (y - 55) + '" fill="#f8fafc" stroke="' + DG.stroke + '" stroke-width="2"/>';
    s += '<polygon points="' + x + ',' + (y + h) + ' ' + (x + w) + ',' + (y + h) + ' ' + (x + w / 2) + ',' + (y + h + 55) + '" fill="#f8fafc" stroke="' + DG.stroke + '" stroke-width="2"/>';
  } else if (type === 'square pyramid') {
    const cx = 180, cy = 135, u = 64;
    s += '<rect x="' + (cx - u / 2) + '" y="' + (cy - u / 2) + '" width="' + u + '" height="' + u + '" fill="#eef3f8" stroke="' + DG.stroke + '" stroke-width="2"/>';
    s += '<polygon points="' + (cx - u / 2) + ',' + (cy - u / 2) + ' ' + (cx + u / 2) + ',' + (cy - u / 2) + ' ' + cx + ',' + (cy - u / 2 - 58) + '" fill="#f8fafc" stroke="' + DG.stroke + '" stroke-width="2"/>';
    s += '<polygon points="' + (cx - u / 2) + ',' + (cy + u / 2) + ' ' + (cx + u / 2) + ',' + (cy + u / 2) + ' ' + cx + ',' + (cy + u / 2 + 58) + '" fill="#f8fafc" stroke="' + DG.stroke + '" stroke-width="2"/>';
    s += '<polygon points="' + (cx - u / 2) + ',' + (cy - u / 2) + ' ' + (cx - u / 2) + ',' + (cy + u / 2) + ' ' + (cx - u / 2 - 58) + ',' + cy + '" fill="#f8fafc" stroke="' + DG.stroke + '" stroke-width="2"/>';
    s += '<polygon points="' + (cx + u / 2) + ',' + (cy - u / 2) + ' ' + (cx + u / 2) + ',' + (cy + u / 2) + ' ' + (cx + u / 2 + 58) + ',' + cy + '" fill="#f8fafc" stroke="' + DG.stroke + '" stroke-width="2"/>';
  }
  return dgWrap(W, H, s, 'Net of a three-dimensional figure');
}

/* ---------- measurement shapes ---------- */
function rectSVG(l, w, areaLabel) {
  const W = 360, H = 240, x = 75, y = 65, ww = 210, hh = 120;
  let s = dgPoly([x + ',' + y, (x + ww) + ',' + y, (x + ww) + ',' + (y + hh), x + ',' + (y + hh)].join(' '));
  s += dgText(x + ww / 2, y + hh + 24, l, { size: 13, fill: DG.muted, weight: 600 });
  s += dgText(x - 14, y + hh / 2 + 5, w, { size: 13, fill: DG.muted, weight: 600, anchor: 'end' });
  if (areaLabel) s += dgText(x + ww / 2, y + hh / 2 + 5, areaLabel, { size: 14, fill: DG.accent });
  return dgWrap(W, H, s, 'Rectangle diagram');
}

function parallelogramSVG(b, h) {
  const W = 360, H = 240;
  const P = [[85, 185], [305, 185], [255, 70], [35, 70]];
  let s = dgPoly(P.map(p => p.join(',')).join(' '));
  s += dgLine(115, 70, 115, 185, { dash: true, width: 2, stroke: DG.dash });
  s += '<path d="M 115 170 L 127 170 L 127 185" fill="none" stroke="' + DG.dash + '" stroke-width="1.4"/>';
  s += dgText(195, 210, b, { size: 13, fill: DG.muted, weight: 600 });
  s += dgText(105, 130, h, { size: 13, fill: DG.muted, weight: 600, anchor: 'end' });
  return dgWrap(W, H, s, 'Parallelogram with base and height');
}

function triangleAreaSVG(b, h) {
  const W = 360, H = 240;
  const P = [[70, 195], [290, 195], [170, 60]];
  let s = dgPoly(P.map(p => p.join(',')).join(' '));
  s += dgLine(170, 60, 170, 195, { dash: true, width: 2, stroke: DG.dash });
  s += '<path d="M 170 180 L 182 180 L 182 195" fill="none" stroke="' + DG.dash + '" stroke-width="1.4"/>';
  s += dgText(180, 220, b, { size: 13, fill: DG.muted, weight: 600 });
  s += dgText(158, 130, h, { size: 13, fill: DG.muted, weight: 600, anchor: 'end' });
  return dgWrap(W, H, s, 'Triangle with base and height');
}

function trapezoidSVG(a, b, h) {
  const W = 360, H = 240;
  const P = [[65, 195], [305, 195], [245, 65], [125, 65]];
  let s = dgPoly(P.map(p => p.join(',')).join(' '));
  s += dgLine(185, 65, 185, 195, { dash: true, width: 2, stroke: DG.dash });
  s += '<path d="M 185 180 L 197 180 L 197 195" fill="none" stroke="' + DG.dash + '" stroke-width="1.4"/>';
  s += dgText(185, 220, b, { size: 13, fill: DG.muted, weight: 600 });
  s += dgText(185, 52, a, { size: 13, fill: DG.muted, weight: 600 });
  s += dgText(173, 132, h, { size: 13, fill: DG.muted, weight: 600, anchor: 'end' });
  return dgWrap(W, H, s, 'Trapezoid with parallel sides and height');
}

function lShapeSVG(W, H, w, h) {
  const Wd = 380, Hd = 280, x = 55, y = 45, ww = 260, hh = 170, cw = 95, ch = 60;
  const pts = [[x, y], [x + ww, y], [x + ww, y + hh - ch], [x + ww - cw, y + hh - ch], [x + ww - cw, y + hh], [x, y + hh]];
  let s = dgPoly(pts.map(p => p.join(',')).join(' '));
  s += dgText(x + ww / 2, y - 10, W, { size: 12, fill: DG.muted, weight: 600 });
  s += dgText(x - 14, y + hh / 2, H, { size: 12, fill: DG.muted, weight: 600, anchor: 'end' });
  s += dgText(x + ww - cw / 2, y + hh - ch - 8, w, { size: 12, fill: DG.muted, weight: 600 });
  s += dgText(x + ww + 12, y + hh - ch / 2, h, { size: 12, fill: DG.muted, weight: 600, anchor: 'start' });
  return dgWrap(Wd, Hd, s, 'L-shaped compound figure');
}
