/* ============================================================
   Units + skills: whole numbers, factors & multiples
   ============================================================ */

U({ id: 'whole', num: 1, name: 'Whole Number Operations', short: 'Whole Numbers', glyph: '123', color: '#db3832',
    blurb: 'Place value in action: add, subtract, multiply and divide large numbers, work with exponents, and follow the order of operations.' });
U({ id: 'factors', num: 2, name: 'Factors & Multiples', short: 'Factors', glyph: '×÷', color: '#c2410c',
    blurb: 'Primes, factors, multiples, GCF and LCM — the number theory toolkit behind simplifying fractions and solving shared-group problems.' });
U({ id: 'fracdec', num: 3, name: 'Fractions & Decimals', short: 'Fractions & Decimals', glyph: '½', color: '#0f766e',
    blurb: 'Move fluently between fractions, mixed numbers and decimals, and compare values written in different forms.' });
U({ id: 'decimal', num: 4, name: 'Decimal Operations', short: 'Decimals', glyph: '0.5', color: '#1d4ed8',
    blurb: 'Add, subtract, multiply and divide decimals accurately, estimate sensibly, and solve money and measurement problems.' });
U({ id: 'fraction', num: 5, name: 'Fraction Operations', short: 'Fractions', glyph: '¾', color: '#6d28d9',
    blurb: 'Add, subtract, multiply and divide fractions and mixed numbers, and explain what the answers mean.' });
U({ id: 'integers', num: 6, name: 'Integers & Rational Numbers', short: 'Integers', glyph: '±', color: '#be123c',
    blurb: 'Work confidently below zero: compare integers, find absolute values, and add, subtract, multiply and divide signed numbers.' });
U({ id: 'coord', num: 7, name: 'The Coordinate Plane', short: 'Coordinates', glyph: '⌖', color: '#0e7490',
    blurb: 'Plot and describe points in all four quadrants, reflect shapes, and find distances and areas on the coordinate plane.' });
U({ id: 'ratio', num: 8, name: 'Ratios, Rates & Proportions', short: 'Ratios & Rates', glyph: '∶', color: '#15803d',
    blurb: 'Compare quantities with ratios, find unit rates, solve proportions, and use scale drawings to model real situations.' });
U({ id: 'percent', num: 9, name: 'Percents & Consumer Math', short: 'Percents', glyph: '%', color: '#a16207',
    blurb: 'Find percents of numbers, convert between forms, convert units, and use percentages for prices, tax, tips and interest.' });
U({ id: 'expr', num: 10, name: 'Expressions', short: 'Expressions', glyph: 'x', color: '#4338ca',
    blurb: 'Write and evaluate algebraic expressions, identify terms and coefficients, and use properties to create equivalent expressions.' });
U({ id: 'equation', num: 11, name: 'Equations & Inequalities', short: 'Equations', glyph: '=', color: '#a21caf',
    blurb: 'Solve one-step equations and inequalities, check solutions, and describe relationships between two variables.' });
U({ id: 'geometry', num: 12, name: 'Lines, Angles & Figures', short: 'Geometry', glyph: '∠', color: '#475569',
    blurb: 'Classify angles, triangles and quadrilaterals, use angle sums, and recognise symmetry and three-dimensional solids.' });
U({ id: 'measure', num: 13, name: 'Perimeter, Area & Volume', short: 'Measurement', glyph: '□', color: '#047857',
    blurb: 'Apply formulas for perimeter, area, surface area and volume, including compound shapes and fractional side lengths.' });
U({ id: 'data', num: 14, name: 'Data, Statistics & Probability', short: 'Data & Chance', glyph: '▥', color: '#92400e',
    blurb: 'Display and interpret data, calculate measures of centre and spread, and describe chance with probability.' });

/* ---------- local helpers ---------- */
function wrongNums(r, correct, n, min, max, step) {
  const out = [];
  let guard = 0;
  while (out.length < n && guard++ < 200) {
    let v = RI(r, min, max);
    if (step) v = Math.round(v / step) * step;
    if (v !== correct && out.indexOf(v) === -1) out.push(v);
  }
  return out;
}
function roundTo(x, place) { return Math.round(x / place) * place; }
function words(n) {
  const a = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
  return n >= 0 && n <= 12 ? a[n] : String(n);
}

/* ============================================================
   UNIT 1 — Whole Number Operations
   ============================================================ */

S('whole', 'add-sub', 'Add and subtract whole numbers', r => {
  const add = r() < 0.5;
  let a = RI(r, 1200, 98500), b = RI(r, 1200, 98500);
  if (!add && b > a) [a, b] = [b, a];
  const ans = add ? a + b : a - b;
  return {
    q: 'Calculate <strong>' + fmt(a) + '</strong> ' + (add ? '+' : '−') + ' <strong>' + fmt(b) + '</strong>.',
    type: 'num', a: ans,
    sol: (add ? 'Add the columns from right to left:' : 'Subtract the columns from right to left, regrouping when needed:') +
      '<br><span class="work">' + fmt(a) + ' ' + (add ? '+' : '−') + ' ' + fmt(b) + ' = <strong>' + fmt(ans) + '</strong></span>'
  };
}, H.add);

S('whole', 'add-sub-word', 'Add and subtract whole numbers: word problems', r => {
  const add = r() < 0.5;
  let a = RI(r, 1250, 9800), b = RI(r, 1100, 8600);
  if (!add && b > a) [a, b] = [b, a];
  const ans = add ? a + b : a - b;
  let text;
  if (add) {
    text = pick(r, [
      'A library owns <strong>' + fmt(a) + '</strong> books and buys <strong>' + fmt(b) + '</strong> more. How many books does it own now?',
      'A factory made <strong>' + fmt(a) + '</strong> toys in the morning and <strong>' + fmt(b) + '</strong> in the afternoon. How many toys did it make altogether?',
      'A school collected <strong>' + fmt(a) + '</strong> cans on Monday and <strong>' + fmt(b) + '</strong> on Tuesday. How many cans were collected altogether?',
      'A stadium has <strong>' + fmt(a) + '</strong> seats and adds <strong>' + fmt(b) + '</strong> more. How many seats are there now?'
    ]);
  } else {
    text = pick(r, [
      'A stadium has <strong>' + fmt(a) + '</strong> seats. Of these, <strong>' + fmt(b) + '</strong> are empty. How many seats are occupied?',
      'An orchard has <strong>' + fmt(a) + '</strong> apples. <strong>' + fmt(b) + '</strong> are picked. How many apples are left?',
      'A library owns <strong>' + fmt(a) + '</strong> books. <strong>' + fmt(b) + '</strong> are borrowed. How many books are left?',
      'A school collected <strong>' + fmt(a) + '</strong> cans. <strong>' + fmt(b) + '</strong> are recycled. How many cans are left?'
    ]);
  }
  return { q: text, type: 'num', a: ans, sol: 'The calculation is ' + fmt(a) + (add ? ' + ' : ' − ') + fmt(b) + ' = <strong>' + fmt(ans) + '</strong>.' };
}, H.add);

S('whole', 'multiply', 'Multiply whole numbers', r => {
  const a = RI(r, 24, 89), b = RI(r, 12, 79);
  return {
    q: 'Calculate <strong>' + a + ' × ' + b + '</strong>.',
    type: 'num', a: a * b,
    sol: 'Split the second factor: ' + b + ' = ' + (Math.floor(b / 10) * 10) + ' + ' + (b % 10) + '.<br>' +
      a + ' × ' + (Math.floor(b / 10) * 10) + ' = ' + fmt(a * Math.floor(b / 10) * 10) + ', and ' + a + ' × ' + (b % 10) + ' = ' + fmt(a * (b % 10)) + '.<br>' +
      'Add: ' + fmt(a * Math.floor(b / 10) * 10) + ' + ' + fmt(a * (b % 10)) + ' = <strong>' + fmt(a * b) + '</strong>.'
  };
}, H.mult);

S('whole', 'multiply-word', 'Multiply whole numbers: word problems', r => {
  const a = RI(r, 12, 48), b = RI(r, 15, 40);
  const items = [['boxes', 'pencils'], ['crates', 'apples'], ['rows', 'chairs'], ['packs', 'cards']];
  const it = pick(r, items);
  return {
    q: 'A school has <strong>' + a + '</strong> ' + it[0] + ', each containing <strong>' + b + '</strong> ' + it[1] + '. How many ' + it[1] + ' are there altogether?',
    type: 'num', a: a * b,
    sol: 'Multiply the number of groups by the number in each group: ' + a + ' × ' + b + ' = <strong>' + fmt(a * b) + '</strong>.'
  };
}, H.mult);

S('whole', 'multiply-zeros', 'Multiply numbers ending in zeros', r => {
  const a = RI(r, 2, 9) * Math.pow(10, RI(r, 1, 3));
  const b = RI(r, 2, 9) * Math.pow(10, RI(r, 1, 2));
  return {
    q: 'Calculate <strong>' + fmt(a) + ' × ' + fmt(b) + '</strong>.',
    type: 'num', a: a * b,
    sol: 'Multiply the non-zero digits: ' + (a / Math.pow(10, String(a).length - 1)) + ' × ' + (b / Math.pow(10, String(b).length - 1)) + ' = ' +
      ((a / Math.pow(10, String(a).length - 1)) * (b / Math.pow(10, String(b).length - 1))) + '.<br>Then attach all the zeros: <strong>' + fmt(a * b) + '</strong>.'
  };
}, H.mult);

S('whole', 'estimate-products', 'Estimate products', r => {
  const a = RI(r, 21, 89), b = RI(r, 21, 89);
  const ea = roundTo(a, 10), eb = roundTo(b, 10);
  return {
    q: 'Estimate <strong>' + a + ' × ' + b + '</strong> by rounding each factor to the nearest ten.',
    type: 'num', a: ea * eb,
    sol: a + ' rounds to ' + ea + ' and ' + b + ' rounds to ' + eb + '.<br>' + ea + ' × ' + eb + ' = <strong>' + fmt(ea * eb) + '</strong>.'
  };
}, 'Round each factor first, then multiply the rounded numbers.');

S('whole', 'divide', 'Divide whole numbers', r => {
  const q = RI(r, 12, 98), d = RI(r, 12, 49);
  const n = q * d;
  return {
    q: 'Calculate <strong>' + fmt(n) + ' ÷ ' + d + '</strong>.',
    type: 'num', a: q,
    sol: 'Ask: ' + d + ' × ? = ' + fmt(n) + '.<br>Since ' + d + ' × ' + q + ' = ' + fmt(n) + ', the quotient is <strong>' + q + '</strong>.'
  };
}, H.div);

S('whole', 'divide-remainder', 'Divide whole numbers: remainders as fractions', r => {
  const d = RI(r, 3, 9), q = RI(r, 4, 24), rem = RI(r, 1, d - 1);
  const n = d * q + rem;
  return {
    q: 'Calculate <strong>' + n + ' ÷ ' + d + '</strong>. Write the answer as a mixed number.',
    type: 'frac', a: F(n, d), display: mixedStr(F(n, d)),
    sol: d + ' goes into ' + n + ' ' + q + ' times with remainder ' + rem + '.<br>The remainder becomes the numerator: <strong>' + mixedHTML(F(n, d)) + '</strong>.'
  };
}, 'Write the remainder over the divisor, then combine it with the whole-number quotient.');

S('whole', 'divide-decimal', 'Divide whole numbers: decimal quotients', r => {
  const d = RI(r, 2, 9), q = RI(r, 12, 240) / 20;
  const n = round(q * d, 2);
  return {
    q: 'Calculate <strong>' + plain(n) + ' ÷ ' + d + '</strong>.',
    type: 'num', a: q,
    sol: 'Divide as usual and keep going past the decimal point if needed.<br>' + plain(n) + ' ÷ ' + d + ' = <strong>' + plain(q) + '</strong>.'
  };
}, H.div);

S('whole', 'divide-word', 'Divide whole numbers: word problems', r => {
  const d = RI(r, 12, 36), q = RI(r, 8, 45), n = d * q;
  const ctx = pick(r, [
    ['students', 'buses', 'How many students are on each bus?'],
    ['books', 'shelves', 'How many books are on each shelf?'],
    ['seats', 'rows', 'How many seats are in each row?'],
    ['marbles', 'bags', 'How many marbles are in each bag?']
  ]);
  return {
    q: 'A total of <strong>' + fmt(n) + '</strong> ' + ctx[0] + ' are shared equally among <strong>' + d + '</strong> ' + ctx[1] + '. ' + ctx[2],
    type: 'num', a: q,
    sol: 'Share ' + fmt(n) + ' equally into ' + d + ' groups: ' + fmt(n) + ' ÷ ' + d + ' = <strong>' + q + '</strong>.'
  };
}, H.div);

S('whole', 'exponents-write', 'Write multiplication expressions using exponents', r => {
  const b = RI(r, 2, 9), e = RI(r, 2, 5);
  const parts = Array(e).fill(b).join(' × ');
  return {
    q: 'Write <strong>' + parts + '</strong> using an exponent.',
    type: 'text', a: b + '^' + e, accept: [b + '^' + e, b + '**' + e],
    sol: 'The base is ' + b + '. It is used as a factor ' + e + ' times, so the exponent is ' + e + '.<br><strong>' + b + '^' + e + '</strong>'
  };
}, 'The base is the repeated factor; the exponent counts how many times it is used.');

S('whole', 'exponents-evaluate', 'Evaluate powers', r => {
  const b = RI(r, 2, 6), e = RI(r, 2, 4);
  const val = Math.pow(b, e);
  return {
    q: 'Evaluate <strong>' + b + '^' + e + '</strong>.',
    type: 'num', a: val,
    sol: b + '^' + e + ' means ' + Array(e).fill(b).join(' × ') + ' = <strong>' + val + '</strong>.'
  };
}, 'Write the power as repeated multiplication, then multiply.');

S('whole', 'powers-of-ten', 'Powers of ten', r => {
  const e = RI(r, 2, 6);
  if (r() < 0.5) {
    return {
      q: 'Write <strong>' + Array(e).fill('10').join(' × ') + '</strong> using an exponent.',
      type: 'text', a: '10^' + e, accept: ['10^' + e, '10**' + e],
      sol: '10 is used as a factor ' + e + ' times, so the exponent is ' + e + ': <strong>10^' + e + '</strong>.'
    };
  }
  const val = Math.pow(10, e);
  return {
    q: 'Evaluate <strong>10^' + e + '</strong>.',
    type: 'num', a: val,
    sol: '10^' + e + ' is a 1 followed by ' + e + ' zeros: <strong>' + fmt(val) + '</strong>.'
  };
}, 'Each power of ten adds one zero.');

S('whole', 'missing-exponent', 'Find the missing exponent or base', r => {
  const b = RI(r, 2, 6), e = RI(r, 2, 4), val = Math.pow(b, e);
  if (r() < 0.5) {
    return {
      q: 'Find the missing exponent: <strong>' + b + '^? = ' + val + '</strong>.',
      type: 'num', a: e,
      sol: b + ' × ' + b + ' × … needs ' + e + ' factors to reach ' + val + '. The exponent is <strong>' + e + '</strong>.'
    };
  }
  return {
    q: 'Find the missing base: <strong>?^' + e + ' = ' + val + '</strong>.',
    type: 'num', a: b,
    sol: 'Look for a number that multiplied by itself ' + e + ' times gives ' + val + '. That number is <strong>' + b + '</strong>.'
  };
}, 'Use what you know about repeated multiplication.');

S('whole', 'order-ops', 'Order of operations', r => {
  const a = RI(r, 2, 12), b = RI(r, 2, 9), c = RI(r, 2, 9), d = RI(r, 2, 9);
  const type = RI(r, 1, 6);
  let text, val, sol;
  if (type === 1) {
    val = a + b * c; text = a + ' + ' + b + ' × ' + c;
    sol = 'Multiply first: ' + b + ' × ' + c + ' = ' + (b * c) + '.<br>Then add: ' + a + ' + ' + (b * c) + ' = <strong>' + val + '</strong>.';
  } else if (type === 2) {
    val = a * b - c; text = a + ' × ' + b + ' − ' + c;
    sol = 'Multiply first: ' + a + ' × ' + b + ' = ' + (a * b) + '.<br>Then subtract: ' + (a * b) + ' − ' + c + ' = <strong>' + val + '</strong>.';
  } else if (type === 3) {
    const bc = b * c; const big = Math.max(bc, a); const small = Math.min(bc, a);
    val = big - small; text = big + ' − ' + small;
    sol = 'Work left to right for subtraction: <strong>' + val + '</strong>.';
  } else if (type === 4) {
    const times = Math.floor(b / c) * c;
    val = a + Math.floor(b / c); text = a + ' + ' + times + ' ÷ ' + c;
    sol = 'Divide first: ' + times + ' ÷ ' + c + ' = ' + Math.floor(b / c) + '.<br>Then add: ' + a + ' + ' + Math.floor(b / c) + ' = <strong>' + val + '</strong>.';
  } else if (type === 5) {
    val = a * (b + c); text = a + ' × (' + b + ' + ' + c + ')';
    sol = 'Evaluate the brackets first: ' + b + ' + ' + c + ' = ' + (b + c) + '.<br>Then multiply: ' + a + ' × ' + (b + c) + ' = <strong>' + val + '</strong>.';
  } else {
    val = (a + b) * c; text = '(' + a + ' + ' + b + ') × ' + c;
    sol = 'Evaluate the brackets first: ' + a + ' + ' + b + ' = ' + (a + b) + '.<br>Then multiply: ' + (a + b) + ' × ' + c + ' = <strong>' + val + '</strong>.';
  }
  return { q: 'Evaluate <strong>' + text + '</strong>.', type: 'num', a: val, sol: sol };
}, 'Use PEMDAS: brackets, exponents, multiply or divide left to right, then add or subtract.');

S('whole', 'order-ops-nested', 'Evaluate expressions with brackets', r => {
  const a = RI(r, 2, 8), b = RI(r, 2, 9), c = RI(r, 2, 9), d = RI(r, 2, 9);
  const inner = b + c;
  const first = a * inner;
  const val = first + d;
  return {
    q: 'Evaluate <strong>[' + a + ' × (' + b + ' + ' + c + ')] + ' + d + '</strong>.',
    type: 'num', a: val,
    sol: 'Innermost brackets: ' + b + ' + ' + c + ' = ' + inner + '.<br>' +
      'Square brackets: ' + a + ' × ' + inner + ' = ' + first + '.<br>' +
      'Add: ' + first + ' + ' + d + ' = <strong>' + val + '</strong>.'
  };
}, 'Work from the innermost brackets outwards.');

S('whole', 'multi-step-word', 'Multi-step word problems', r => {
  const boxes = RI(r, 8, 24), per = RI(r, 12, 30), sold = RI(r, 40, 200);
  const total = boxes * per;
  const left = total - sold;
  return {
    q: 'A shop receives <strong>' + boxes + '</strong> boxes with <strong>' + per + '</strong> pens in each box. It sells <strong>' + sold + '</strong> pens. How many pens are left?',
    type: 'num', a: left,
    sol: 'Pens received: ' + boxes + ' × ' + per + ' = ' + fmt(total) + '.<br>Pens left: ' + fmt(total) + ' − ' + sold + ' = <strong>' + fmt(left) + '</strong>.'
  };
}, 'Break the problem into steps: find the total first, then subtract.');

/* ============================================================
   UNIT 2 — Factors & Multiples
   ============================================================ */

S('factors', 'divisibility', 'Divisibility rules', r => {
  const d = pick(r, [2, 3, 4, 5, 6, 9]);
  const correct = d * RI(r, 12, 80);
  const wrongs = [];
  let guard = 0;
  while (wrongs.length < 3 && guard++ < 100) {
    const v = correct + RI(r, 1, 9);
    if (v % d !== 0 && wrongs.indexOf(v) === -1) wrongs.push(v);
  }
  const rule = d === 2 ? 'ends in an even digit' : d === 3 ? 'digit sum is a multiple of 3' :
    d === 4 ? 'last two digits form a multiple of 4' : d === 5 ? 'ends in 0 or 5' :
    d === 6 ? 'divisible by both 2 and 3' : 'digit sum is a multiple of 9';
  return choiceQ(r, 'Which number is divisible by <strong>' + d + '</strong>?', correct, wrongs,
    'A number is divisible by ' + d + ' when its ' + rule + '.<br><strong>' + correct + '</strong> is divisible by ' + d + '.',
    { qNote: rule });
}, 'Test each option using the divisibility rule.');

S('factors', 'prime-composite', 'Prime or composite', r => {
  const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  const composite = pick(r, [12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99]);
  const usePrime = r() < 0.5;
  const n = usePrime ? pick(r, primes) : composite;
  const isP = isPrime(n);
  const nf = isP ? n : primeFactors(n)[0];
  const sol = isP
    ? n + ' has exactly two factors, 1 and ' + n + ', so it is <strong>prime</strong>.'
    : n + ' has more than two factors (for example 1, ' + nf + ' and ' + n + '), so it is <strong>composite</strong>.';
  return choiceQ(r, 'Is <strong>' + n + '</strong> prime or composite?', isP ? 'Prime' : 'Composite', [isP ? 'Composite' : 'Prime', 'Neither'], sol);
}, 'A prime has exactly two factors: 1 and itself.');

S('factors', 'identify-factors', 'Identify factors', r => {
  const n = pick(r, [24, 30, 36, 40, 42, 45, 48, 54, 56, 60, 63, 64, 72, 81, 84, 90, 96, 100]);
  const divisors = [];
  for (let i = 2; i < n; i++) if (n % i === 0) divisors.push(i);
  const correct = pick(r, divisors);
  const wrongs = [];
  let guard = 0;
  while (wrongs.length < 3 && guard++ < 200) {
    const v = RI(r, 2, n - 2);
    if (n % v !== 0 && wrongs.indexOf(v) === -1) wrongs.push(v);
  }
  return choiceQ(r, 'Which number is a factor of <strong>' + n + '</strong>?', correct, wrongs,
    n + ' ÷ ' + correct + ' = ' + (n / correct) + ', so ' + correct + ' is a factor.<br>The factor pair is ' + correct + ' × ' + (n / correct) + ' = ' + n + '.');
}, 'A factor divides the number exactly, with no remainder.');

S('factors', 'factor-pairs', 'Find factor pairs', r => {
  const n = pick(r, [36, 40, 42, 48, 54, 56, 60, 63, 72, 80, 84, 90, 96, 100, 108, 120]);
  const pairs = [];
  for (let i = 2; i * i <= n; i++) if (n % i === 0) pairs.push([i, n / i]);
  const correct = pick(r, pairs);
  const wrongs = [];
  let guard = 0;
  while (wrongs.length < 3 && guard++ < 100) {
    const a = RI(r, 2, 12), b = RI(r, 2, 12);
    const key = a + ' and ' + b;
    if (a * b !== n && !wrongs.some(w => w === key) && key !== correct[0] + ' and ' + correct[1]) wrongs.push(key);
  }
  return choiceQ(r, 'Which pair is a factor pair of <strong>' + n + '</strong>?', correct[0] + ' and ' + correct[1], wrongs,
    correct[0] + ' × ' + correct[1] + ' = ' + n + ', so this is a factor pair.');
}, 'The two numbers in a factor pair multiply to give the number.');

S('factors', 'prime-factorization', 'Prime factorization', r => {
  const n = pick(r, [24, 36, 40, 45, 48, 54, 56, 60, 63, 72, 75, 80, 84, 90, 96, 98, 100, 108, 126, 144]);
  const pf = primeFactors(n);
  return {
    q: 'Write the prime factorization of <strong>' + n + '</strong>. Use × between factors (for example 2^3 × 3).',
    type: 'pf', a: pf,
    sol: 'Divide by primes until only 1 remains:<br><span class="work">' + n + ' = ' + pf.join(' × ') + '</span>'
  };
}, 'Divide repeatedly by the smallest prime that works.');

S('factors', 'gcf', 'Greatest common factor', r => {
  const g = RI(r, 2, 12);
  const m = pick(r, [2, 3, 5, 7, 11, 13]), n = pick(r, [3, 4, 5, 7, 9, 11]);
  const a = g * m, b = g * n;
  const gg = gcd(a, b);
  return {
    q: 'Find the greatest common factor (GCF) of <strong>' + a + '</strong> and <strong>' + b + '</strong>.',
    type: 'num', a: gg,
    sol: 'Factors of ' + a + ' include 1, ' + m + ', ' + g + ', …<br>Factors of ' + b + ' include 1, ' + n + ', ' + g + ', …<br>The greatest shared factor is <strong>' + gg + '</strong>.'
  };
}, 'List the factors of both numbers and choose the largest shared one.');

S('factors', 'gcf-three', 'Greatest common factor of three numbers', r => {
  const g = RI(r, 2, 9);
  const a = g * pick(r, [2, 3, 5, 7]), b = g * pick(r, [2, 5, 7, 11]), c = g * pick(r, [2, 3, 7, 13]);
  const gg = gcd(gcd(a, b), c);
  return {
    q: 'Find the greatest common factor of <strong>' + a + '</strong>, <strong>' + b + '</strong> and <strong>' + c + '</strong>.',
    type: 'num', a: gg,
    sol: 'The largest number that divides all three is <strong>' + gg + '</strong>.',
  };
}, 'Find the GCF of two numbers first, then the GCF of that result and the third number.');

S('factors', 'lcm', 'Least common multiple', r => {
  const g = RI(r, 2, 9);
  const a = g * pick(r, [2, 3, 5, 7]), b = g * pick(r, [3, 4, 5, 7]);
  const l = lcm(a, b);
  return {
    q: 'Find the least common multiple (LCM) of <strong>' + a + '</strong> and <strong>' + b + '</strong>.',
    type: 'num', a: l,
    sol: 'List multiples of ' + a + ': ' + a + ', ' + (2 * a) + ', ' + (3 * a) + ', …<br>' +
      'The first multiple also divisible by ' + b + ' is <strong>' + l + '</strong>.'
  };
}, 'List multiples of the larger number until you find one the other divides.');

S('factors', 'lcm-three', 'Least common multiple of three numbers', r => {
  const a = pick(r, [4, 6, 8, 9, 10, 12]), b = pick(r, [5, 6, 8, 9, 10, 15]), c = pick(r, [3, 4, 5, 6, 7, 8]);
  const l = lcm(lcm(a, b), c);
  return {
    q: 'Find the least common multiple of <strong>' + a + '</strong>, <strong>' + b + '</strong> and <strong>' + c + '</strong>.',
    type: 'num', a: l,
    sol: 'The smallest number divisible by all three is <strong>' + l + '</strong>.'
  };
}, 'Find the LCM of two numbers, then the LCM of that result and the third.');

S('factors', 'gcf-lcm-word', 'GCF and LCM: word problems', r => {
  if (r() < 0.5) {
    const g = RI(r, 3, 12), m = pick(r, [2, 3, 5, 7]), n = pick(r, [3, 4, 5, 7]);
    const a = g * m, b = g * n;
    return {
      q: 'Two ribbons are <strong>' + a + ' cm</strong> and <strong>' + b + ' cm</strong> long. They are cut into equal pieces with no ribbon left over. What is the greatest possible length of each piece?',
      type: 'num', a: gcd(a, b), unit: 'cm',
      sol: 'The greatest possible piece length is the GCF of ' + a + ' and ' + b + '.<br>GCF(' + a + ', ' + b + ') = <strong>' + gcd(a, b) + ' cm</strong>.'
    };
  }
  const a = pick(r, [4, 6, 8, 9, 10, 12]), b = pick(r, [5, 6, 8, 9, 10, 15]);
  return {
    q: 'One bus leaves every <strong>' + a + ' minutes</strong> and another leaves every <strong>' + b + ' minutes</strong>. They leave together at 8:00 a.m. How many minutes later will they next leave together?',
    type: 'num', a: lcm(a, b), unit: 'minutes',
    sol: 'Find the LCM of ' + a + ' and ' + b + '.<br>LCM(' + a + ', ' + b + ') = <strong>' + lcm(a, b) + ' minutes</strong>.'
  };
}, '“Greatest shared piece” means GCF; “next time together” means LCM.');
