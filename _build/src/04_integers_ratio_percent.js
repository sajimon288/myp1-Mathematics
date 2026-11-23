/* ============================================================
   Units 6-9: integers, coordinates, ratios, percents
   ============================================================ */

/* ============================================================
   UNIT 6 — Integers & Rational Numbers
   ============================================================ */

S('integers', 'understanding', 'Understanding integers', r => {
  const ctx = pick(r, [
    ['a temperature of ', '°C below zero', -1],
    ['an elevation of ', 'm below sea level', -1],
    ['a loss of $', '', -1],
    ['a withdrawal of $', '', -1],
    ['a gain of $', '', 1],
    ['a temperature of ', '°C above zero', 1]
  ]);
  const n = RI(r, 3, 40);
  const correct = ctx[2] * n;
  const wrongs = [ctx[2] * -n, 0, ctx[2] * (n + 1)];
  return choiceQ(r, 'Which integer represents ' + ctx[0] + '<strong>' + n + ctx[1] + '</strong>?', correct, wrongs,
    ctx[2] < 0 ? 'Below zero, below sea level, losses and withdrawals are negative: <strong>' + correct + '</strong>.'
      : 'Above zero and gains are positive: <strong>' + correct + '</strong>.');
}, 'Decide whether the situation is above or below zero.');

S('integers', 'compare', 'Compare integers', r => {
  const a = RI(r, -20, 20), b = RI(r, -20, 20);
  const sym = a < b ? '<' : a > b ? '>' : '=';
  return choiceQ(r, 'Compare: <strong>' + a + ' ___ ' + b + '</strong>', sym, ['<', '>', '='].filter(x => x !== sym),
    'On a number line, ' + a + ' is to the ' + (a < b ? 'left' : a > b ? 'right' : 'same position') + ' of ' + b + ', so ' + a + ' ' + sym + ' ' + b + '.');
}, 'Numbers further right on the number line are greater.');

S('integers', 'absolute', 'Absolute value', r => {
  const n = RI(r, -30, 30) || 7;
  if (r() < 0.5) {
    return {
      q: 'What is <strong>|' + n + '|</strong>?',
      type: 'num', a: Math.abs(n),
      sol: 'Absolute value is the distance from zero, so the sign is removed: <strong>' + Math.abs(n) + '</strong>.'
    };
  }
  const a = RI(r, -15, 15), b = RI(r, -15, 15);
  const correct = Math.abs(a) > Math.abs(b) ? Math.abs(a) : Math.abs(b);
  return {
    q: 'What is the greater absolute value: <strong>|' + a + '|</strong> or <strong>|' + b + '|</strong>?',
    type: 'num', a: correct,
    sol: '|' + a + '| = ' + Math.abs(a) + ' and |' + b + '| = ' + Math.abs(b) + '. The greater value is <strong>' + correct + '</strong>.'
  };
}, 'Absolute value is always non-negative.');

S('integers', 'add', 'Add integers', r => {
  const a = RI(r, -20, 20), b = RI(r, -20, 20);
  const phrase = b === 0 ? 'Adding 0 leaves the number unchanged: '
    : b < 0 ? 'Adding a negative moves left: ' : 'Adding a positive moves right: ';
  return {
    q: 'Calculate <strong>' + a + ' + (' + b + ')</strong>.',
    type: 'num', a: a + b,
    sol: phrase + a + ' + (' + b + ') = <strong>' + (a + b) + '</strong>.'
  };
}, H.integer);

S('integers', 'subtract', 'Subtract integers', r => {
  const a = RI(r, -20, 20), b = RI(r, -20, 20);
  return {
    q: 'Calculate <strong>' + a + ' − (' + b + ')</strong>.',
    type: 'num', a: a - b,
    sol: 'Subtracting ' + b + ' is the same as adding ' + (-b) + '.<br>' + a + ' + (' + (-b) + ') = <strong>' + (a - b) + '</strong>.'
  };
}, 'Subtracting a negative is the same as adding a positive.');

S('integers', 'add-sub-word', 'Add and subtract integers: word problems', r => {
  const start = RI(r, -12, 8), change = RI(r, 3, 14);
  if (r() < 0.5) {
    return {
      q: 'The temperature at 6 a.m. was <strong>' + start + '°C</strong>. By noon it had risen by <strong>' + change + '°C</strong>. What was the temperature at noon?',
      type: 'num', a: start + change, unit: '°C',
      sol: start + ' + ' + change + ' = <strong>' + (start + change) + '°C</strong>.'
    };
  }
  const depth = RI(r, 5, 20), rise = RI(r, 2, depth - 1);
  return {
    q: 'A submarine is at <strong>−' + depth + ' m</strong>. It rises <strong>' + rise + ' m</strong>. What is its new depth?',
    type: 'num', a: -depth + rise, unit: 'm',
    sol: '−' + depth + ' + ' + rise + ' = <strong>' + (-depth + rise) + ' m</strong>.'
  };
}, H.integer);

S('integers', 'multiply', 'Multiply integers', r => {
  const a = RI(r, -12, 12), b = RI(r, -12, 12);
  return {
    q: 'Calculate <strong>' + a + ' × (' + b + ')</strong>.',
    type: 'num', a: a * b,
    sol: 'Multiply the absolute values: ' + Math.abs(a) + ' × ' + Math.abs(b) + ' = ' + Math.abs(a * b) + '.<br>' +
      'The signs are ' + (a * b < 0 ? 'different, so the product is negative' : 'the same, so the product is positive') + ': <strong>' + (a * b) + '</strong>.'
  };
}, 'Same signs → positive; different signs → negative.');

S('integers', 'divide', 'Divide integers', r => {
  const q = RI(r, -12, 12) || 4, d = RI(r, -9, 9) || 3;
  const n = q * d;
  return {
    q: 'Calculate <strong>' + n + ' ÷ (' + d + ')</strong>.',
    type: 'num', a: q,
    sol: 'Divide the absolute values: ' + Math.abs(n) + ' ÷ ' + Math.abs(d) + ' = ' + Math.abs(q) + '.<br>' +
      'The signs are ' + (q < 0 ? 'different, so the quotient is negative' : 'the same, so the quotient is positive') + ': <strong>' + q + '</strong>.'
  };
}, 'Same signs → positive; different signs → negative.');

S('integers', 'mixed', 'Add, subtract, multiply or divide two integers', r => {
  const a = RI(r, -12, 12), b = RI(r, -9, 9) || 3;
  const op = pick(r, ['+', '−', '×', '÷']);
  let ans, text;
  if (op === '÷') {
    const q = RI(r, -8, 8) || 3;
    const d = b;
    const n = q * d;
    return {
      q: 'Calculate <strong>' + n + ' ÷ (' + d + ')</strong>.',
      type: 'num', a: q,
      sol: 'Divide, then apply the sign rule: <strong>' + q + '</strong>.'
    };
  }
  if (op === '+') ans = a + b;
  else if (op === '−') ans = a - b;
  else ans = a * b;
  return {
    q: 'Calculate <strong>' + a + ' ' + op + ' (' + b + ')</strong>.',
    type: 'num', a: ans,
    sol: 'Apply the integer rule for ' + (op === '+' ? 'addition' : op === '−' ? 'subtraction' : 'multiplication') + ': <strong>' + ans + '</strong>.'
  };
}, H.integer);

S('integers', 'rational-compare', 'Compare rational numbers', r => {
  const d = pick(r, [2, 3, 4, 5, 8, 10, 20]);
  const n = RI(r, -d + 1, d - 1) || 1;
  const f = F(n, d);
  const dec = RI(r, -95, 95) / 100;
  const a = fval(f), b = dec;
  const sym = Math.abs(a - b) < 1e-9 ? '=' : a < b ? '<' : '>';
  return choiceQ(r, 'Compare: <strong>' + fHTML(f) + '</strong> ___ <strong>' + plain(b, 2) + '</strong>',
    sym, ['<', '>', '='].filter(x => x !== sym),
    fHTML(f) + ' = ' + plain(a, 2) + ', so ' + fHTML(f) + ' ' + sym + ' ' + plain(b, 2) + '.');
}, 'Write both numbers as decimals, then compare.');

S('integers', 'opposite', 'Opposites of rational numbers', r => {
  if (r() < 0.5) {
    const n = RI(r, -30, 30) / 10 || 2.5;
    return {
      q: 'What is the opposite of <strong>' + plain(n, 1) + '</strong>?',
      type: 'num', a: -n,
      sol: 'The opposite has the same distance from zero but the other sign: <strong>' + plain(-n, 1) + '</strong>.'
    };
  }
  const f = F(RI(r, -9, 9) || 3, RI(r, 2, 9));
  return {
    q: 'What is the opposite of <strong>' + fHTML(f) + '</strong>?',
    type: 'frac', a: F(-f.n, f.d),
    sol: 'Change the sign: <strong>' + fHTML(F(-f.n, f.d)) + '</strong>.'
  };
}, 'The opposite of a is −a.');

S('integers', 'classify', 'Classify numbers', r => {
  const correct = pick(r, [-7, -3, -12]);
  const wrongs = ['0', '5', '2.5', fh(1, 2), '−2.5'];
  return choiceQ(r, 'Which number is an <strong>integer</strong> but <strong>not</strong> a whole number?', correct, wrongs,
    'Whole numbers are 0, 1, 2, 3, … Integers also include negatives such as <strong>' + correct + '</strong>.');
}, 'Whole numbers start at 0; integers include negatives.');

/* ============================================================
   UNIT 7 — Coordinate Plane
   ============================================================ */

S('coord', 'quadrant', 'Quadrants', r => {
  const x = RI(r, -6, 6) || 3, y = RI(r, -6, 6) || -4;
  const qd = x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y < 0 ? 'III' : 'IV';
  return choiceQ(r, 'In which quadrant is the point <strong>(' + x + ', ' + y + ')</strong>?' + coordGridHTML([{ x: x, y: y, label: 'P' }]), 'Quadrant ' + qd,
    ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'].filter(v => v !== 'Quadrant ' + qd),
    'The signs are (' + (x > 0 ? '+' : '−') + ', ' + (y > 0 ? '+' : '−') + '), which is Quadrant ' + qd + '.');
}, 'Quadrant I (+,+), II (−,+), III (−,−), IV (+,−).');

S('coord', 'name', 'Name points on the coordinate plane', r => {
  const x = RI(r, -5, 5) || 2, y = RI(r, -5, 5) || -3;
  return {
    q: 'Write the coordinates of the point shown.' + coordGridHTML([{ x: x, y: y, label: 'P' }]),
    type: 'point', a: [x, y],
    sol: 'Start at the origin. Move ' + Math.abs(x) + ' unit' + (Math.abs(x) === 1 ? '' : 's') + ' ' + (x >= 0 ? 'right' : 'left') +
      ' and ' + Math.abs(y) + ' unit' + (Math.abs(y) === 1 ? '' : 's') + ' ' + (y >= 0 ? 'up' : 'down') + '.<br>' +
      'The point is <strong>(' + x + ', ' + y + ')</strong>.'
  };
}, 'The x-coordinate comes first, then the y-coordinate.');

S('coord', 'plot', 'Plot points on a coordinate plane', r => {
  const pts = [];
  const used = [];
  while (pts.length < 4) {
    const x = RI(r, -5, 5), y = RI(r, -5, 5);
    if (x === 0 || y === 0) continue;
    if (used.some(p => p.x === x && p.y === y)) continue;
    used.push({ x: x, y: y });
    pts.push({ x: x, y: y, label: 'ABCD'[pts.length] });
  }
  const target = pick(r, pts);
  return choiceQ(r, 'Which point is at <strong>(' + target.x + ', ' + target.y + ')</strong>?' + coordGridHTML(pts),
    target.label, pts.filter(p => p !== target).map(p => p.label),
    'From the origin, move ' + Math.abs(target.x) + ' unit' + (Math.abs(target.x) === 1 ? '' : 's') + ' ' + (target.x > 0 ? 'right' : 'left') +
    ' and ' + Math.abs(target.y) + ' unit' + (Math.abs(target.y) === 1 ? '' : 's') + ' ' + (target.y > 0 ? 'up' : 'down') + '.<br>' +
    'That is point <strong>' + target.label + '</strong>.');
}, 'x first (horizontal), then y (vertical).');

S('coord', 'reflect', 'Reflect a point over an axis', r => {
  const x = RI(r, -6, 6) || 3, y = RI(r, -6, 6) || -2;
  const overX = r() < 0.5;
  const ans = overX ? [x, -y] : [-x, y];
  return {
    q: 'Reflect <strong>(' + x + ', ' + y + ')</strong> over the <strong>' + (overX ? 'x-axis' : 'y-axis') + '</strong>. What are the new coordinates?' + coordGridHTML([{ x: x, y: y, label: 'P' }]),
    type: 'point', a: ans,
    sol: overX
      ? 'Reflecting over the x-axis changes the sign of the y-coordinate: (' + x + ', ' + y + ') → <strong>(' + ans[0] + ', ' + ans[1] + ')</strong>.'
      : 'Reflecting over the y-axis changes the sign of the x-coordinate: (' + x + ', ' + y + ') → <strong>(' + ans[0] + ', ' + ans[1] + ')</strong>.'
  };
}, 'x-axis reflection flips y; y-axis reflection flips x.');

S('coord', 'distance', 'Distance between two points', r => {
  const x1 = RI(r, -6, 6) || -2, y1 = RI(r, -6, 6) || 4;
  const horiz = r() < 0.5;
  const x2 = horiz ? x1 + (RI(r, 2, 8) * (r() < 0.5 ? -1 : 1)) : x1;
  const y2 = horiz ? y1 : y1 + (RI(r, 2, 8) * (r() < 0.5 ? -1 : 1));
  const ans = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  return {
    q: 'Find the distance between <strong>(' + x1 + ', ' + y1 + ')</strong> and <strong>(' + x2 + ', ' + y2 + ')</strong> on the coordinate plane.' +
      coordGridHTML([{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }], { min: Math.min(x1, x2, y1, y2) - 1, max: Math.max(x1, x2, y1, y2) + 1 }),
    type: 'num', a: ans,
    sol: 'The points share ' + (horiz ? 'the same y-coordinate' : 'the same x-coordinate') + '.<br>' +
      'Count the units between them: <strong>' + ans + ' units</strong>.'
  };
}, 'For a horizontal or vertical segment, subtract the coordinates.');

S('coord', 'move', 'Directions on a coordinate plane', r => {
  const x = RI(r, -4, 4), y = RI(r, -4, 4);
  const dx = RI(r, 2, 6) * (r() < 0.5 ? -1 : 1), dy = RI(r, 2, 6) * (r() < 0.5 ? -1 : 1);
  return {
    q: 'Start at <strong>(' + x + ', ' + y + ')</strong>. Move <strong>' + Math.abs(dx) + '</strong> units ' + (dx > 0 ? 'right' : 'left') +
      ' and <strong>' + Math.abs(dy) + '</strong> units ' + (dy > 0 ? 'up' : 'down') + '. Where do you end?' +
      coordGridHTML([{ x: x, y: y, label: 'S' }], { min: Math.min(x, x + dx, y, y + dy) - 1, max: Math.max(x, x + dx, y, y + dy) + 1 }),
    type: 'point', a: [x + dx, y + dy],
    sol: 'x: ' + x + (dx > 0 ? ' + ' : ' − ') + Math.abs(dx) + ' = ' + (x + dx) + '<br>y: ' + y + (dy > 0 ? ' + ' : ' − ') + Math.abs(dy) + ' = ' + (y + dy) + '.<br>' +
      'End point: <strong>(' + (x + dx) + ', ' + (y + dy) + ')</strong>.'
  };
}, 'Change x for left/right, and y for up/down.');

S('coord', 'area', 'Area on the coordinate plane', r => {
  const x1 = RI(r, -5, 1), y1 = RI(r, -5, 1);
  const w = RI(r, 3, 7), h = RI(r, 3, 7);
  return {
    q: 'A rectangle has opposite corners at <strong>(' + x1 + ', ' + y1 + ')</strong> and <strong>(' + (x1 + w) + ', ' + (y1 + h) + ')</strong>. What is its area?' +
      coordGridHTML([{ x: x1, y: y1, label: 'A' }, { x: x1 + w, y: y1 + h, label: 'B' }], { min: Math.min(x1, y1) - 1, max: Math.max(x1 + w, y1 + h) + 1 }),
    type: 'num', a: w * h, unit: 'square units',
    sol: 'Width = ' + w + ' units and height = ' + h + ' units.<br>Area = ' + w + ' × ' + h + ' = <strong>' + (w * h) + ' square units</strong>.'
  };
}, 'Count the units along each side, then multiply.');

S('coord', 'perimeter', 'Perimeter on the coordinate plane', r => {
  const x1 = RI(r, -5, 1), y1 = RI(r, -5, 1);
  const w = RI(r, 3, 7), h = RI(r, 3, 7);
  return {
    q: 'A rectangle has corners at <strong>(' + x1 + ', ' + y1 + ')</strong>, <strong>(' + (x1 + w) + ', ' + y1 + ')</strong>, <strong>(' + (x1 + w) + ', ' + (y1 + h) + ')</strong> and <strong>(' + x1 + ', ' + (y1 + h) + ')</strong>. What is its perimeter?' +
      coordGridHTML([{ x: x1, y: y1, label: 'A' }, { x: x1 + w, y: y1, label: 'B' }, { x: x1 + w, y: y1 + h, label: 'C' }, { x: x1, y: y1 + h, label: 'D' }], { min: Math.min(x1, y1) - 1, max: Math.max(x1 + w, y1 + h) + 1 }),
    type: 'num', a: 2 * (w + h), unit: 'units',
    sol: 'Width = ' + w + ', height = ' + h + '.<br>Perimeter = 2(' + w + ' + ' + h + ') = <strong>' + (2 * (w + h)) + ' units</strong>.'
  };
}, 'Perimeter of a rectangle = 2(length + width).');

/* ============================================================
   UNIT 8 — Ratios, Rates & Proportions
   ============================================================ */

S('ratio', 'write', 'Write a ratio', r => {
  const a = RI(r, 3, 15), b = RI(r, 3, 15);
  const g = gcd(a, b);
  return {
    q: 'There are <strong>' + a + '</strong> boys and <strong>' + b + '</strong> girls in a class. Write the ratio of boys to girls in simplest form.',
    type: 'ratio', a: { a: a / g, b: b / g },
    sol: 'Boys : girls = ' + a + ' : ' + b + '.<br>' +
      (g === 1 ? 'The parts have no common factor, so the ratio is already in simplest form: <strong>' + a + ' : ' + b + '</strong>.'
        : 'Divide both by ' + g + ': <strong>' + (a / g) + ' : ' + (b / g) + '</strong>.')
  };
}, 'Divide both parts by their greatest common factor.');

S('ratio', 'equivalent', 'Equivalent ratios', r => {
  const a = RI(r, 2, 7), b = RI(r, 2, 7), k = RI(r, 2, 6);
  return {
    q: 'Complete the equivalent ratio: <strong>' + a + ' : ' + b + ' = ' + (a * k) + ' : ?</strong>',
    type: 'num', a: b * k,
    sol: 'The first part is multiplied by ' + k + ': ' + a + ' × ' + k + ' = ' + (a * k) + '.<br>' +
      'Multiply the second part by the same number: ' + b + ' × ' + k + ' = <strong>' + (b * k) + '</strong>.'
  };
}, 'Multiply or divide both parts by the same number.');

S('ratio', 'table', 'Ratio tables', r => {
  const a = RI(r, 2, 6), b = RI(r, 2, 9), k = RI(r, 3, 6);
  const rows = [1, 2, 3, 4].map(i => [a * i, b * i]);
  const missingRow = RI(r, 1, 3);
  const shown = rows.map((row, i) => i === missingRow ? [String(row[0]), '?'] : [String(row[0]), String(row[1])]);
  return {
    q: 'The table shows equivalent ratios. What number is missing?' + tableHTML(['First quantity', 'Second quantity'], shown),
    type: 'num', a: b * (missingRow + 1),
    sol: 'Use the ratio ' + a + ' : ' + b + '.<br>When the first quantity is ' + a * (missingRow + 1) + ', the second is ' + b + ' × ' + (missingRow + 1) + ' = <strong>' + (b * (missingRow + 1)) + '</strong>.'
  };
}, 'Find the multiplier for the first quantity, then apply it to the second.');

S('ratio', 'unit-rate', 'Unit rates', r => {
  const rate = RI(r, 3, 18), qty = RI(r, 2, 9);
  const total = rate * qty;
  const ctx = pick(r, [
    ['A machine produces', 'pages', 'hours'],
    ['A car travels', 'kilometres', 'hours'],
    ['A tap fills', 'litres', 'minutes'],
    ['A printer uses', 'sheets', 'minutes']
  ]);
  return {
    q: ctx[0] + ' <strong>' + total + ' ' + ctx[1] + '</strong> in <strong>' + qty + ' ' + ctx[2] + '</strong>. What is the unit rate?',
    type: 'num', a: rate, unit: ctx[1] + ' per ' + ctx[2].replace(/s$/, ''),
    sol: 'Divide the total by the number of ' + ctx[2] + ':<br>' + total + ' ÷ ' + qty + ' = <strong>' + rate + ' ' + ctx[1] + ' per ' + ctx[2].replace(/s$/, '') + '</strong>.'
  };
}, 'A unit rate tells you the amount for one unit.');

S('ratio', 'rate-word', 'Rates: word problems', r => {
  const rate = RI(r, 4, 15), qty = RI(r, 3, 12);
  const total = rate * qty;
  const ctx = pick(r, [
    ['pages', 'minutes', 'reading speed'],
    ['words', 'minutes', 'typing speed'],
    ['metres', 'seconds', 'speed']
  ]);
  return {
    q: 'A machine produces <strong>' + total + ' ' + ctx[0] + '</strong> in <strong>' + qty + ' ' + ctx[1] + '</strong>. At the same rate, how many ' + ctx[0] + ' will it produce in <strong>' + (qty * 2) + ' ' + ctx[1] + '</strong>?',
    type: 'num', a: total * 2,
    sol: 'The rate is ' + total + ' ÷ ' + qty + ' = ' + rate + ' ' + ctx[0] + ' per ' + ctx[1].replace(/s$/, '') + '.<br>' +
      'In ' + (qty * 2) + ' ' + ctx[1] + ': ' + rate + ' × ' + (qty * 2) + ' = <strong>' + (total * 2) + '</strong>.'
  };
}, 'Find the unit rate first, then multiply.');

S('ratio', 'speed', 'Speed, distance and time', r => {
  const speed = RI(r, 20, 90), time = RI(r, 2, 8);
  const dist = speed * time;
  if (r() < 0.5) {
    return {
      q: 'A train travels at <strong>' + speed + ' km/h</strong> for <strong>' + time + ' hours</strong>. How far does it travel?',
      type: 'num', a: dist, unit: 'km',
      sol: 'Distance = speed × time = ' + speed + ' × ' + time + ' = <strong>' + dist + ' km</strong>.'
    };
  }
  return {
    q: 'A cyclist travels <strong>' + dist + ' km</strong> at <strong>' + speed + ' km/h</strong>. How long does the journey take?',
    type: 'num', a: time, unit: 'hours',
    sol: 'Time = distance ÷ speed = ' + dist + ' ÷ ' + speed + ' = <strong>' + time + ' hours</strong>.'
  };
}, 'Use distance = speed × time.');

S('ratio', 'compare-rates', 'Compare rates', r => {
  const rA = RI(r, 3, 12);
  let rB = rA + RI(r, 1, 4) * (r() < 0.5 ? -1 : 1);
  if (rB < 2) rB = rA + RI(r, 1, 4);
  if (rB === rA) rB = rA + 1;
  const qA = RI(r, 2, 5), qB = RI(r, 2, 5);
  const pA = rA * qA, pB = rB * qB;
  return choiceQ(r, 'Store A sells <strong>' + qA + '</strong> items for <strong>$' + pA + '</strong>. Store B sells <strong>' + qB + '</strong> items for <strong>$' + pB + '</strong>. Which store has the lower unit price?',
    rA < rB ? 'Store A' : 'Store B', ['Store A', 'Store B', 'They are the same'],
    'Store A: $' + pA + ' ÷ ' + qA + ' = $' + plain(rA, 2) + ' per item.<br>Store B: $' + pB + ' ÷ ' + qB + ' = $' + plain(rB, 2) + ' per item.');
}, 'Compare the cost of one item at each store.');

S('ratio', 'proportion', 'Solve the proportion', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 9), k = RI(r, 2, 8);
  const d = b * k;
  return {
    q: 'Solve the proportion: <strong>' + fh(a, b) + ' = <span class="frac"><span>x</span><span>' + d + '</span></span></strong>',
    type: 'num', a: a * k,
    sol: 'Cross-multiply: ' + a + ' × ' + d + ' = ' + b + ' × x.<br>' +
      a + ' × ' + d + ' = ' + (a * d) + ', so x = ' + (a * d) + ' ÷ ' + b + ' = <strong>' + (a * k) + '</strong>.'
  };
}, 'Cross-multiply, then divide.');

S('ratio', 'scale', 'Scale drawings', r => {
  const k = pick(r, [2, 5, 10, 20, 50]);
  const len = RI(r, 2, 9);
  return {
    q: 'A map uses a scale of <strong>1 cm : ' + k + ' m</strong>. A path measures <strong>' + len + ' cm</strong> on the map. What is its actual length?',
    type: 'num', a: len * k, unit: 'm',
    sol: 'Each centimetre represents ' + k + ' metres.<br>' + len + ' × ' + k + ' = <strong>' + (len * k) + ' m</strong>.'
  };
}, 'Multiply the map length by the scale factor.');

S('ratio', 'proportional', 'Identify proportional relationships', r => {
  const k = RI(r, 2, 6);
  const proportional = r() < 0.5;
  const xs = [1, 2, 3, 4];
  const ys = xs.map(x => x * k);
  if (!proportional) ys[3] += RI(r, 1, 3);
  const rows = xs.map((x, i) => [String(x), String(ys[i])]);
  return choiceQ(r, 'Is the relationship in the table proportional?' + tableHTML(['x', 'y'], rows),
    proportional ? 'Yes' : 'No', proportional ? ['No', 'Cannot tell'] : ['Yes', 'Cannot tell'],
    proportional
      ? 'Every y-value is ' + k + ' times the x-value, so y = ' + k + 'x. The relationship is proportional.'
      : 'Check y ÷ x: ' + xs.map((x, i) => ys[i] + ' ÷ ' + x + ' = ' + plain(ys[i] / x, 2)).join(', ') + '.<br>The ratios are not equal, so it is not proportional.');
}, 'A proportional table has the same ratio y ÷ x in every row.');

S('ratio', 'share', 'Share in a ratio', r => {
  const a = RI(r, 1, 5), b = RI(r, 1, 5);
  const k = RI(r, 4, 15);
  const total = (a + b) * k;
  return {
    q: 'Share <strong>$' + total + '</strong> between two people in the ratio <strong>' + a + ' : ' + b + '</strong>. What is the larger share?',
    type: 'num', a: Math.max(a, b) * k,
    sol: 'Total parts = ' + a + ' + ' + b + ' = ' + (a + b) + '.<br>Each part = $' + total + ' ÷ ' + (a + b) + ' = $' + k + '.<br>' +
      'The larger share is ' + Math.max(a, b) + ' × $' + k + ' = <strong>$' + (Math.max(a, b) * k) + '</strong>.'
  };
}, 'Add the ratio parts, divide the total, then multiply.');

S('ratio', 'word', 'Ratios and rates: word problems', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 9), k = RI(r, 2, 8);
  return {
    q: 'The ratio of red to blue marbles is <strong>' + a + ' : ' + b + '</strong>. There are <strong>' + (a * k) + '</strong> red marbles. How many blue marbles are there?',
    type: 'num', a: b * k,
    sol: 'Red marbles are ' + a + ' × ' + k + ' = ' + (a * k) + ', so the multiplier is ' + k + '.<br>' +
      'Blue marbles = ' + b + ' × ' + k + ' = <strong>' + (b * k) + '</strong>.'
  };
}, 'Find the multiplier from the known quantity.');

/* ============================================================
   UNIT 9 — Percents, Units & Consumer Math
   ============================================================ */

S('percent', 'of-number', 'Percents of numbers', r => {
  const p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
  const n = 20 * RI(r, 2, 30);
  const ans = p * n / 100;
  return {
    q: 'Find <strong>' + p + '%</strong> of <strong>' + fmt(n) + '</strong>.',
    type: 'num', a: ans,
    sol: p + '% = ' + plain(p / 100, 2) + '.<br>' + plain(p / 100, 2) + ' × ' + fmt(n) + ' = <strong>' + fmt(ans) + '</strong>.'
  };
}, H.percent);

S('percent', 'word', 'Percents of numbers: word problems', r => {
  const p = pick(r, [10, 15, 20, 25, 30, 40, 50]);
  const price = 20 * RI(r, 3, 40);
  const saved = p * price / 100;
  if (r() < 0.5) {
    return {
      q: 'A jacket costs <strong>$' + fmt(price) + '</strong>. It is reduced by <strong>' + p + '%</strong>. How much money is saved?',
      type: 'num', a: saved,
      sol: p + '% of $' + fmt(price) + ' = ' + plain(p / 100, 2) + ' × ' + fmt(price) + ' = <strong>$' + fmt(saved) + '</strong>.'
    };
  }
  return {
    q: 'A jacket costs <strong>$' + fmt(price) + '</strong>. It is reduced by <strong>' + p + '%</strong>. What is the sale price?',
    type: 'num', a: price - saved,
    sol: 'Saving = ' + plain(p / 100, 2) + ' × ' + fmt(price) + ' = $' + fmt(saved) + '.<br>' +
      'Sale price = $' + fmt(price) + ' − $' + fmt(saved) + ' = <strong>$' + fmt(price - saved) + '</strong>.'
  };
}, H.percent);

S('percent', 'find', 'Find what percent one number is of another', r => {
  const p = pick(r, [10, 20, 25, 30, 40, 50, 60, 75, 80]);
  const total = 20 * RI(r, 2, 25);
  const part = p * total / 100;
  return {
    q: '<strong>' + fmt(part) + '</strong> is what percent of <strong>' + fmt(total) + '</strong>?',
    type: 'num', a: p, unit: '%',
    sol: 'Write the comparison as a fraction: ' + fh(part, total) + '.<br>' +
      fmt(part) + ' ÷ ' + fmt(total) + ' = ' + plain(p / 100, 2) + ' = <strong>' + p + '%</strong>.'
  };
}, 'Part ÷ whole × 100 gives the percent.');

S('percent', 'total', 'Find the total given a part and a percent', r => {
  const p = pick(r, [10, 20, 25, 40, 50, 60, 75, 80]);
  const total = 20 * RI(r, 2, 25);
  const part = p * total / 100;
  return {
    q: '<strong>' + fmt(part) + '</strong> is <strong>' + p + '%</strong> of what number?',
    type: 'num', a: total,
    sol: 'Let the total be t. Then ' + plain(p / 100, 2) + ' × t = ' + fmt(part) + '.<br>' +
      't = ' + fmt(part) + ' ÷ ' + plain(p / 100, 2) + ' = <strong>' + fmt(total) + '</strong>.'
  };
}, 'Divide the part by the percent written as a decimal.');

S('percent', 'convert', 'Convert between percents, fractions and decimals', r => {
  const kind = RI(r, 1, 4);
  if (kind === 1) {
    const d = pick(r, [2, 4, 5, 10, 20, 25, 50]);
    const n = RI(r, 1, d - 1);
    const val = round(n / d * 100, 2);
    return choiceQ(r, 'Write <strong>' + fHTML(F(n, d)) + '</strong> as a percent.', val + '%',
      [(n * 10) + '%', (d * 10) + '%', plain(100 - val, 2) + '%'],
      fHTML(F(n, d)) + ' = ' + plain(n / d, 4) + ' = <strong>' + val + '%</strong>.');
  }
  if (kind === 2) {
    const v = RI(r, 5, 95) / 100;
    return choiceQ(r, 'Write <strong>' + plain(v, 2) + '</strong> as a percent.', (v * 100) + '%',
      [plain(v, 2) + '%', plain(v * 10, 2) + '%', plain(v / 10, 2) + '%'],
      plain(v, 2) + ' × 100 = <strong>' + plain(v * 100, 2) + '%</strong>.');
  }
  if (kind === 3) {
    const p = RI(r, 5, 95);
    return choiceQ(r, 'Write <strong>' + p + '%</strong> as a decimal.', plain(p / 100, 2),
      [plain(p, 2), plain(p / 10, 2), plain(p * 10, 2)],
      p + '% ÷ 100 = <strong>' + plain(p / 100, 2) + '</strong>.');
  }
  const p = pick(r, [10, 20, 25, 40, 50, 60, 75, 80]);
  const f = F(p, 100);
  return choiceQ(r, 'Write <strong>' + p + '%</strong> as a fraction in simplest form.', fHTML(f),
    [fh(p, 10), fHTML(F(p, 10)), fh(1, p)],
    p + '% = ' + fh(p, 100) + ' = <strong>' + fHTML(f) + '</strong>.');
}, 'Percent means “out of 100”.');

S('percent', 'compare', 'Compare percents and fractions', r => {
  const p = pick(r, [25, 30, 40, 50, 60, 75, 80]);
  const d = pick(r, [2, 4, 5, 10, 20]);
  const n = RI(r, 1, d - 1);
  const a = p / 100, b = n / d;
  const sym = Math.abs(a - b) < 1e-9 ? '=' : a < b ? '<' : '>';
  return choiceQ(r, 'Compare: <strong>' + p + '%</strong> ___ <strong>' + fHTML(F(n, d)) + '</strong>',
    sym, ['<', '>', '='].filter(x => x !== sym),
    p + '% = ' + plain(a, 2) + ' and ' + fHTML(F(n, d)) + ' = ' + plain(b, 2) + ', so ' + p + '% ' + sym + ' ' + fHTML(F(n, d)) + '.');
}, 'Convert both to decimals before comparing.');

S('percent', 'frac-word', 'Percents and fractions: word problems', r => {
  const total = 20 * RI(r, 2, 20);
  const p = pick(r, [10, 20, 25, 40, 50, 60, 75]);
  const part = p * total / 100;
  return {
    q: 'In a school of <strong>' + fmt(total) + '</strong> students, <strong>' + p + '%</strong> travel by bus. How many students travel by bus?',
    type: 'num', a: part,
    sol: p + '% of ' + fmt(total) + ' = ' + plain(p / 100, 2) + ' × ' + fmt(total) + ' = <strong>' + fmt(part) + '</strong>.'
  };
}, H.percent);

S('percent', 'metric-convert', 'Convert and compare metric units', r => {
  const pair = pick(r, [
    ['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000]
  ]);
  const v = RI(r, 12, 95) / 10;
  const ans = round(v * pair[2], 4);
  return {
    q: 'Convert <strong>' + plain(v, 1) + ' ' + pair[0] + '</strong> to <strong>' + pair[1] + '</strong>.',
    type: 'num', a: ans, unit: pair[1],
    sol: '1 ' + pair[0] + ' = ' + fmt(pair[2]) + ' ' + pair[1] + '.<br>' +
      plain(v, 1) + ' × ' + fmt(pair[2]) + ' = <strong>' + fmt(ans) + ' ' + pair[1] + '</strong>.'
  };
}, 'Multiply when converting to a smaller unit.');

S('percent', 'customary-convert', 'Convert and compare customary units', r => {
  const pair = pick(r, [
    ['feet', 'inches', 12], ['yards', 'feet', 3], ['pounds', 'ounces', 16],
    ['gallons', 'quarts', 4], ['hours', 'minutes', 60], ['minutes', 'seconds', 60]
  ]);
  const v = RI(r, 2, 12);
  const ans = v * pair[2];
  return {
    q: 'Convert <strong>' + v + ' ' + pair[0] + '</strong> to <strong>' + pair[1] + '</strong>.',
    type: 'num', a: ans, unit: pair[1],
    sol: '1 ' + pair[0].replace(/s$/, '') + ' = ' + pair[2] + ' ' + pair[1] + '.<br>' +
      v + ' × ' + pair[2] + ' = <strong>' + fmt(ans) + ' ' + pair[1] + '</strong>.'
  };
}, 'Multiply by the number of smaller units in one larger unit.');

S('percent', 'temp-convert', 'Convert between Celsius and Fahrenheit', r => {
  const c = 5 * RI(r, -4, 8);
  if (r() < 0.5) {
    const f = c * 9 / 5 + 32;
    return {
      q: 'Convert <strong>' + c + '°C</strong> to degrees Fahrenheit.',
      type: 'num', a: f, unit: '°F',
      sol: 'F = (' + fh(9, 5) + ')C + 32 = (' + fh(9, 5) + ')(' + c + ') + 32 = ' + (c * 9 / 5) + ' + 32 = <strong>' + f + '°F</strong>.'
    };
  }
  const m = RI(r, -3, 8);
  const f = 9 * m + 32;
  const cc = 5 * m;
  return {
    q: 'Convert <strong>' + f + '°F</strong> to degrees Celsius.',
    type: 'num', a: cc, unit: '°C',
    sol: 'C = (F − 32) × ' + fh(5, 9) + ' = (' + f + ' − 32) × ' + fh(5, 9) + ' = ' + (f - 32) + ' × ' + fh(5, 9) + ' = <strong>' + cc + '°C</strong>.'
  };
}, 'F = (' + fh(9, 5) + ')C + 32 and C = (F − 32) × ' + fh(5, 9) + '.');

S('percent', 'unit-price', 'Unit prices', r => {
  const count = RI(r, 2, 9);
  const unitCents = RI(r, 45, 425);
  const total = unitCents * count / 100;
  return {
    q: 'A pack of <strong>' + count + '</strong> items costs <strong>' + money(total) + '</strong>. What is the unit price?',
    type: 'num', a: unitCents / 100,
    sol: 'Divide the total cost by the number of items:<br>' + money(total) + ' ÷ ' + count + ' = <strong>' + money(unitCents / 100) + '</strong> per item.'
  };
}, 'Unit price = total cost ÷ number of items.');

S('percent', 'sale-price', 'Sale prices', r => {
  const original = 20 * RI(r, 3, 40);
  const p = pick(r, [10, 15, 20, 25, 30, 40, 50]);
  const sale = original - original * p / 100;
  return {
    q: 'A jacket originally costs <strong>$' + fmt(original) + '</strong>. It is on sale for <strong>' + p + '% off</strong>. What is the sale price?',
    type: 'num', a: sale,
    sol: 'Discount = ' + plain(p / 100, 2) + ' × $' + fmt(original) + ' = $' + fmt(original * p / 100) + '.<br>' +
      'Sale price = $' + fmt(original) + ' − $' + fmt(original * p / 100) + ' = <strong>$' + fmt(sale) + '</strong>.'
  };
}, 'Find the discount, then subtract it from the original price.');

S('percent', 'tax-tip', 'Calculate tax and tips', r => {
  const subtotal = 20 * RI(r, 2, 30);
  const p = pick(r, [5, 8, 10, 12, 15, 20]);
  const tax = round(subtotal * p / 100, 2);
  if (r() < 0.5) {
    return {
      q: 'A meal costs <strong>' + money(subtotal) + '</strong>. Tax is <strong>' + p + '%</strong>. How much is the tax?',
      type: 'num', a: tax,
      sol: 'Tax = ' + plain(p / 100, 2) + ' × ' + money(subtotal) + ' = <strong>' + money(tax) + '</strong>.'
    };
  }
  return {
    q: 'A meal costs <strong>' + money(subtotal) + '</strong>. Tax is <strong>' + p + '%</strong>. What is the total bill?',
    type: 'num', a: round(subtotal + tax, 2),
    sol: 'Tax = ' + plain(p / 100, 2) + ' × ' + money(subtotal) + ' = ' + money(tax) + '.<br>' +
      'Total = ' + money(subtotal) + ' + ' + money(tax) + ' = <strong>' + money(round(subtotal + tax, 2)) + '</strong>.'
  };
}, 'Tax and tips are percents of the subtotal.');

S('percent', 'interest', 'Simple interest', r => {
  const P = 100 * RI(r, 3, 25);
  const rate = pick(r, [2, 3, 4, 5, 6]);
  const t = RI(r, 1, 4);
  const I = P * rate * t / 100;
  return {
    q: 'Find the simple interest on <strong>$' + fmt(P) + '</strong> at <strong>' + rate + '%</strong> per year for <strong>' + t + ' year' + (t > 1 ? 's' : '') + '</strong>.',
    type: 'num', a: I,
    sol: 'I = P × r × t = ' + fmt(P) + ' × ' + plain(rate / 100, 2) + ' × ' + t + ' = <strong>$' + fmt(I) + '</strong>.'
  };
}, 'Simple interest: I = P × r × t.');

S('percent', 'coupon', 'Which is the better coupon?', r => {
  const price = 20 * RI(r, 2, 20);
  const off = pick(r, [5, 10, 15, 20]);
  const p = pick(r, [10, 15, 20, 25]);
  const a = price - off;
  const b = price - price * p / 100;
  let correct, wrongs;
  if (Math.abs(a - b) < 1e-9) {
    correct = 'They are the same';
    wrongs = ['$' + off + ' off', p + '% off'];
  } else {
    correct = a < b ? '$' + off + ' off' : p + '% off';
    wrongs = ['$' + off + ' off', p + '% off'].filter(x => x !== correct);
  }
  return choiceQ(r, 'A $' + fmt(price) + ' item has two coupons: <strong>$' + off + ' off</strong> or <strong>' + p + '% off</strong>. Which gives the lower price?',
    correct, wrongs,
    '$' + off + ' off: $' + fmt(a) + '.<br>' + p + '% off: $' + fmt(b) + '.<br>' +
    (correct === 'They are the same' ? 'The prices are equal.' : 'The lower price comes from <strong>' + correct + '</strong>.'));
}, 'Work out the final price with each coupon and compare.');
