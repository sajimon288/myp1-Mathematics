/* ============================================================
   Geometry & measurement SVG diagrams
   ============================================================ */

function geoWrap(inner, vb, label, wide) {
  return '<svg class="qsvg geo' + (wide ? ' wide' : '') + '" viewBox="' + vb + '" role="img" aria-label="' + label + '">' + inner + '</svg>';
}
function gp(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}
function gl(x1, y1, x2, y2, color, w) {
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (color || '#374151') + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>';
}
function gt(x, y, txt, o) {
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + (o.size || 14) + '" font-weight="' + (o.weight || 600) + '" fill="' + (o.fill || '#374151') + '">' + txt + '</text>';
}
function garc(cx, cy, r, a1, a2, color) {
  const p1 = gp(cx, cy, r, a1), p2 = gp(cx, cy, r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 0 : 1;
  return '<path d="M' + p1[0] + ' ' + p1[1] + ' A' + r + ' ' + r + ' 0 ' + large + ' ' + sweep + ' ' + p2[0] + ' ' + p2[1] + '" fill="none" stroke="' + (color || '#2f6fb0') + '" stroke-width="2"/>';
}
function gpoly(points, fill, stroke, w) {
  const pts = points.map(p => p[0] + ',' + p[1]).join(' ');
  return '<polygon points="' + pts + '" fill="' + (fill || '#fdf2f0') + '" stroke="' + (stroke || '#db3832') + '" stroke-width="' + (w || 2) + '"/>';
}
function gdash(x1, y1, x2, y2) {
  return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#6b7280" stroke-width="1.6" stroke-dasharray="6 5"/>';
}

/* ---------- angles ---------- */
function svgAngleDiagram(deg, label) {
  const cx = 70, cy = 220, R = 270;
  const e = gp(cx, cy, R, deg);
  let s = gl(cx, cy, cx + R, cy) + gl(cx, cy, e[0], e[1]);
  s += garc(cx, cy, 52, 0, deg);
  const l = gp(cx, cy, 82, deg / 2);
  s += gt(l[0], l[1] + 5, label || (deg + '°'));
  return geoWrap(s, '0 0 400 260', 'Angle of ' + deg + ' degrees');
}
function svgComplement(a) {
  const cx = 90, cy = 230, R = 260;
  const e = gp(cx, cy, R, a);
  let s = gl(cx, cy, cx + R, cy) + gl(cx, cy, cx, cy - 200) + gl(cx, cy, e[0], e[1]);
  s += garc(cx, cy, 46, 0, a) + garc(cx, cy, 66, a, 90);
  const l1 = gp(cx, cy, 72, a / 2);
  const l2 = gp(cx, cy, 92, (a + 90) / 2);
  s += gt(l1[0], l1[1] + 5, a + '°') + gt(l2[0], l2[1] + 5, '?');
  s += '<rect x="' + cx + '" y="' + (cy - 14) + '" width="14" height="14" fill="none" stroke="#9ca3af" stroke-width="1.5"/>';
  return geoWrap(s, '0 0 400 270', 'Complementary angles');
}
function svgSupplement(a) {
  const cx = 90, cy = 220, R = 290;
  const e = gp(cx, cy, R, a);
  let s = gl(40, cy, 400, cy) + gl(cx, cy, e[0], e[1]);
  s += garc(cx, cy, 46, 0, a) + garc(cx, cy, 68, a, 180);
  const l1 = gp(cx, cy, 74, a / 2);
  const l2 = gp(cx, cy, 96, (a + 180) / 2);
  s += gt(l1[0], l1[1] + 5, a + '°') + gt(l2[0], l2[1] + 5, '?');
  return geoWrap(s, '0 0 440 260', 'Supplementary angles');
}
function svgIntersecting(a, mode) {
  const cx = 220, cy = 150, R = 180;
  const p1 = gp(cx, cy, R, a), p2 = gp(cx, cy, R, a + 180);
  let s = gl(cx - R, cy, cx + R, cy) + gl(p1[0], p1[1], p2[0], p2[1]);
  s += garc(cx, cy, 44, 0, a);
  const l1 = gp(cx, cy, 72, a / 2);
  s += gt(l1[0], l1[1] + 5, a + '°');
  if (mode === 'vertical') {
    s += garc(cx, cy, 58, 180, 180 + a);
    const l2 = gp(cx, cy, 86, 180 + a / 2);
    s += gt(l2[0], l2[1] + 5, '?');
  } else {
    s += garc(cx, cy, 58, a, 180);
    const l2 = gp(cx, cy, 86, (a + 180) / 2);
    s += gt(l2[0], l2[1] + 5, '?');
  }
  return geoWrap(s, '0 0 440 300', 'Two intersecting lines');
}

/* ---------- triangles & quadrilaterals ---------- */
function toward(P, C, dist) {
  const dx = C[0] - P[0], dy = C[1] - P[1], len = Math.hypot(dx, dy) || 1;
  return [P[0] + dx / len * dist, P[1] + dy / len * dist];
}
function svgTriangleAngles(labels) {
  const A = [60, 250], B = [380, 250], C = [220, 55];
  const cen = [220, 185];
  let s = gpoly([A, B, C]);
  const la = toward(A, cen, 40), lb = toward(B, cen, 40), lc = toward(C, cen, 40);
  s += gt(la[0], la[1] + 5, labels[0]) + gt(lb[0], lb[1] + 5, labels[1]) + gt(lc[0], lc[1] + 5, labels[2]);
  return geoWrap(s, '0 0 440 300', 'Triangle with labelled angles');
}
function svgTriangleSides(labels) {
  const A = [60, 250], B = [380, 250], C = [220, 55];
  let s = gpoly([A, B, C]);
  const ab = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + 22];
  const ac = [(A[0] + C[0]) / 2 - 22, (A[1] + C[1]) / 2];
  const bc = [(B[0] + C[0]) / 2 + 22, (B[1] + C[1]) / 2];
  s += gt(ab[0], ab[1], labels[0]) + gt(ac[0], ac[1], labels[1]) + gt(bc[0], bc[1], labels[2]);
  return geoWrap(s, '0 0 440 300', 'Triangle with labelled sides');
}
function svgQuadAngles(labels) {
  const A = [70, 70], B = [370, 55], C = [400, 260], D = [50, 250];
  const cen = [220, 160];
  let s = gpoly([A, B, C, D]);
  const la = toward(A, cen, 40), lb = toward(B, cen, 40), lc = toward(C, cen, 40), ld = toward(D, cen, 40);
  s += gt(la[0], la[1] + 5, labels[0]) + gt(lb[0], lb[1] + 5, labels[1]) + gt(lc[0], lc[1] + 5, labels[2]) + gt(ld[0], ld[1] + 5, labels[3]);
  return geoWrap(s, '0 0 440 300', 'Quadrilateral with labelled angles');
}
function regularPoints(n, cx, cy, r, start) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (start === undefined ? -90 : start) + i * 360 / n;
    pts.push(gp(cx, cy, r, a));
  }
  return pts;
}
function svgPolygon(n, label) {
  const pts = regularPoints(n, 220, 160, 115, -90);
  let s = gpoly(pts);
  if (label) s += gt(220, 305, label);
  return geoWrap(s, '0 0 440 330', 'Regular polygon with ' + n + ' sides');
}
function svgQuadShape(type) {
  let pts, label = type;
  if (type === 'Square') pts = [[130, 70], [310, 70], [310, 250], [130, 250]];
  else if (type === 'Rectangle') pts = [[100, 80], [340, 80], [340, 240], [100, 240]];
  else if (type === 'Rhombus') pts = [[220, 50], [380, 160], [220, 270], [60, 160]];
  else if (type === 'Trapezoid') pts = [[140, 80], [300, 80], [390, 250], [50, 250]];
  else pts = [[120, 80], [340, 80], [400, 250], [60, 250]];
  let s = gpoly(pts);
  return geoWrap(s, '0 0 440 300', label);
}
function svgQuadFamily() {
  const items = [
    ['Square', [[30, 40], [90, 40], [90, 100], [30, 100]]],
    ['Rectangle', [[150, 50], [240, 50], [240, 100], [150, 100]]],
    ['Rhombus', [[350, 40], [400, 75], [350, 110], [300, 75]]],
    ['Trapezoid', [[35, 165], [105, 165], [125, 225], [15, 225]]],
    ['Parallelogram', [[170, 165], [270, 165], [300, 225], [200, 225]]]
  ];
  let s = '';
  items.forEach(function (it) {
    s += gpoly(it[1]);
    const xs = it[1].map(function (p) { return p[0]; });
    const ys = it[1].map(function (p) { return p[1]; });
    s += gt((Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, Math.max.apply(null, ys) + 20, it[0], { size: 12 });
  });
  return geoWrap(s, '0 0 430 270', 'Family of quadrilaterals');
}
function svgSymmetry(shape) {
  let pts;
  if (shape === 'square') pts = [[130, 70], [310, 70], [310, 250], [130, 250]];
  else if (shape === 'rectangle') pts = [[90, 85], [350, 85], [350, 235], [90, 235]];
  else if (shape === 'equilateral triangle') pts = [[220, 50], [370, 260], [70, 260]];
  else if (shape === 'isosceles triangle') pts = [[220, 50], [320, 260], [120, 260]];
  else if (shape === 'regular pentagon') pts = regularPoints(5, 220, 160, 115, -90);
  else pts = regularPoints(6, 220, 160, 110, -90);
  return geoWrap(gpoly(pts), '0 0 440 300', shape + ' shape');
}

/* ---------- solids & nets ---------- */
function svgSolid(type) {
  let s = '';
  if (type === 'cube' || type === 'rectangular prism') {
    const x = 90, y = 100, w = 180, h = 130, dx = 55, dy = -45;
    s += gpoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], '#fdf2f0', '#db3832', 2);
    s += gpoly([[x + dx, y + dy], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + dx, y + h + dy]], 'none', '#374151', 1.6);
    s += gl(x, y, x + dx, y + dy, '#374151', 1.6) + gl(x + w, y, x + w + dx, y + dy, '#374151', 1.6);
    s += gl(x + w, y + h, x + w + dx, y + h + dy, '#374151', 1.6) + gl(x, y + h, x + dx, y + h + dy, '#374151', 1.6);
  } else if (type === 'triangular prism') {
    const A = [80, 240], B = [250, 240], C = [135, 90], dx = 70, dy = -35;
    s += gpoly([A, B, C]);
    s += gpoly([[A[0] + dx, A[1] + dy], [B[0] + dx, B[1] + dy], [C[0] + dx, C[1] + dy]], 'none', '#374151', 1.6);
    s += gl(A[0], A[1], A[0] + dx, A[1] + dy, '#374151', 1.6) + gl(B[0], B[1], B[0] + dx, B[1] + dy, '#374151', 1.6) + gl(C[0], C[1], C[0] + dx, C[1] + dy, '#374151', 1.6);
  } else if (type === 'square pyramid') {
    const base = [[90, 240], [300, 240], [380, 180], [170, 180]];
    s += gpoly(base);
    const apex = [235, 55];
    base.forEach(p => { s += gl(apex[0], apex[1], p[0], p[1], '#374151', 1.6); });
    s += gl(base[0][0], base[0][1], base[2][0], base[2][1], '#374151', 1.2);
    s += gl(base[1][0], base[1][1], base[3][0], base[3][1], '#374151', 1.2);
  } else {
    const base = [[90, 240], [340, 240], [220, 170]];
    s += gpoly(base);
    const apex = [215, 55];
    base.forEach(p => { s += gl(apex[0], apex[1], p[0], p[1], '#374151', 1.6); });
  }
  return geoWrap(s, '0 0 470 330', type);
}
function svgNet(type) {
  let s = '';
  if (type === 'Cube') {
    const sq = (x, y) => '<rect x="' + x + '" y="' + y + '" width="65" height="65" fill="#fdf2f0" stroke="#db3832" stroke-width="2"/>';
    s += sq(130, 60) + sq(195, 60) + sq(260, 60) + sq(130, 125) + sq(195, 125) + sq(195, 190);
  } else if (type === 'Triangular prism') {
    s += '<rect x="100" y="100" width="90" height="90" fill="#eef6fb" stroke="#2f6fb0" stroke-width="2"/>';
    s += '<rect x="190" y="100" width="90" height="90" fill="#eef6fb" stroke="#2f6fb0" stroke-width="2"/>';
    s += '<rect x="280" y="100" width="90" height="90" fill="#eef6fb" stroke="#2f6fb0" stroke-width="2"/>';
    s += gpoly([[100, 100], [145, 45], [190, 100]], '#fdf2f0', '#db3832', 2);
    s += gpoly([[100, 190], [145, 245], [190, 190]], '#fdf2f0', '#db3832', 2);
  } else if (type === 'Square pyramid') {
    s += '<rect x="175" y="115" width="90" height="90" fill="#fdf2f0" stroke="#db3832" stroke-width="2"/>';
    s += gpoly([[175, 115], [220, 50], [265, 115]], '#eef6fb', '#2f6fb0', 2);
    s += gpoly([[175, 205], [220, 270], [265, 205]], '#eef6fb', '#2f6fb0', 2);
    s += gpoly([[175, 115], [110, 160], [175, 205]], '#eef6fb', '#2f6fb0', 2);
    s += gpoly([[265, 115], [330, 160], [265, 205]], '#eef6fb', '#2f6fb0', 2);
  } else {
    s += '<rect x="85" y="110" width="80" height="80" fill="#eef6fb" stroke="#2f6fb0" stroke-width="2"/>';
    s += '<rect x="165" y="110" width="120" height="80" fill="#fdf2f0" stroke="#db3832" stroke-width="2"/>';
    s += '<rect x="285" y="110" width="80" height="80" fill="#eef6fb" stroke="#2f6fb0" stroke-width="2"/>';
    s += '<rect x="165" y="190" width="120" height="80" fill="#fdf2f0" stroke="#db3832" stroke-width="2"/>';
  }
  return geoWrap(s, '0 0 470 330', 'Net of a ' + type.toLowerCase());
}

/* ---------- measurement ---------- */
function svgRectShape(l, w, opts) {
  opts = opts || {};
  const u = opts.unit || 'cm';
  let s = gpoly([[80, 80], [360, 80], [360, 240], [80, 240]]);
  s += gt(220, 65, l + ' ' + u);
  s += gt(385, 165, w + ' ' + u, { anchor: 'start' });
  if (opts.missing) s += gt(220, 165, opts.missing, { size: 16 });
  return geoWrap(s, '0 0 440 300', 'Rectangle with dimensions');
}
function svgParallelogramShape(b, h, opts) {
  opts = opts || {};
  const u = opts.unit || 'cm';
  let s = gpoly([[70, 240], [340, 240], [390, 80], [120, 80]]);
  s += gdash(120, 80, 120, 240);
  s += gt(205, 265, b + ' ' + u) + gt(105, 165, h + ' ' + u, { anchor: 'end' });
  return geoWrap(s, '0 0 440 300', 'Parallelogram with base and height');
}
function svgTriangleShape(b, h, opts) {
  opts = opts || {};
  const u = opts.unit || 'cm';
  let s = gpoly([[70, 245], [380, 245], [200, 65]]);
  s += gdash(200, 65, 200, 245);
  s += gt(225, 270, b + ' ' + u) + gt(215, 160, h + ' ' + u, { anchor: 'start' });
  return geoWrap(s, '0 0 440 300', 'Triangle with base and height');
}
function svgTrapezoidShape(a, b, h, opts) {
  opts = opts || {};
  const u = opts.unit || 'cm';
  let s = gpoly([[140, 85], [310, 85], [390, 245], [55, 245]]);
  s += gdash(140, 85, 140, 245);
  s += gt(225, 70, a + ' ' + u) + gt(225, 270, b + ' ' + u) + gt(122, 165, h + ' ' + u, { anchor: 'end' });
  return geoWrap(s, '0 0 440 300', 'Trapezoid with parallel sides and height');
}
function svgCompoundShape(W, H, w, h, opts) {
  opts = opts || {};
  const u = opts.unit || 'm';
  const pts = [[60, 60], [220, 60], [220, 160], [340, 160], [340, 260], [60, 260]];
  let s = gpoly(pts);
  s += gt(200, 285, W + ' ' + u) + gt(42, 165, H + ' ' + u, { anchor: 'end' });
  s += gt(280, 148, w + ' ' + u) + gt(358, 210, h + ' ' + u, { anchor: 'start' });
  return geoWrap(s, '0 0 440 310', 'L-shaped compound figure');
}
function svgPrismShape(l, w, h, opts) {
  opts = opts || {};
  const u = opts.unit || 'cm';
  const x = 90, y = 110, W = 160, H = 110, dx = 60, dy = -45;
  let s = gpoly([[x, y], [x + W, y], [x + W, y + H], [x, y + H]]);
  s += gpoly([[x + dx, y + dy], [x + W + dx, y + dy], [x + W + dx, y + H + dy], [x + dx, y + H + dy]], 'none', '#374151', 1.6);
  s += gl(x, y, x + dx, y + dy, '#374151', 1.6) + gl(x + W, y, x + W + dx, y + dy, '#374151', 1.6);
  s += gl(x + W, y + H, x + W + dx, y + H + dy, '#374151', 1.6) + gl(x, y + H, x + dx, y + H + dy, '#374151', 1.6);
  s += gt(x + W / 2, y - 12, l + ' ' + u) + gt(x + W + 66, y + H / 2 + 5, w + ' ' + u, { anchor: 'start' }) + gt(x + dx + 10, y + dy + H / 2, h + ' ' + u, { anchor: 'end' });
  if (opts.label) s += gt(235, 300, opts.label, { size: 13, fill: '#6b7280' });
  return geoWrap(s, '0 0 470 330', 'Rectangular prism with dimensions');
}
function svgTriPrismShape(a, b, L, opts) {
  opts = opts || {};
  const u = opts.unit || 'cm';
  const A = [70, 245], B = [260, 245], C = [130, 100], dx = 75, dy = -35;
  let s = gpoly([A, B, C]);
  s += gpoly([[A[0] + dx, A[1] + dy], [B[0] + dx, B[1] + dy], [C[0] + dx, C[1] + dy]], 'none', '#374151', 1.6);
  s += gl(A[0], A[1], A[0] + dx, A[1] + dy, '#374151', 1.6) + gl(B[0], B[1], B[0] + dx, B[1] + dy, '#374151', 1.6) + gl(C[0], C[1], C[0] + dx, C[1] + dy, '#374151', 1.6);
  s += gt(160, 270, a + ' ' + u) + gt(285, 200, b + ' ' + u) + gt(245, 80, L + ' ' + u);
  if (opts.label) s += gt(235, 305, opts.label, { size: 13, fill: '#6b7280' });
  return geoWrap(s, '0 0 470 330', 'Triangular prism with dimensions');
}
