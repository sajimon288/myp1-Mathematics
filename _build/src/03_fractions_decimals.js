/* ============================================================
   Units 3-5: fractions, decimals and fraction operations
   ============================================================ */

const fadd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
function toImp(w, f) { return F(w * f.d + f.n, f.d); }
function randMixed(r, maxW) {
  return toImp(RI(r, 1, maxW || 4), randFrac(r, 8, true));
}
function decStr(x, dp) { return Number(x).toFixed(dp === undefined ? 1 : dp); }

/* ============================================================
   UNIT 3 — Fractions & Decimals
   ============================================================ */

S('fracdec', 'simplest-form', 'Write fractions in simplest form', r => {
  let a = RI(r, 2, 9), b = RI(r, a + 1, 12), guard = 0;
  while (gcd(a, b) !== 1 && guard++ < 50) { a = RI(r, 2, 9); b = RI(r, a + 1, 12); }
  const k = RI(r, 2, 7);
  const n = a * k, d = b * k;
  const f = F(n, d);
  return {
    q: 'Write <strong>' + fHTML({ n: n, d: d }) + '</strong> in simplest form.',
    type: 'frac', a: f,
    sol: 'The greatest common factor of ' + n + ' and ' + d + ' is ' + gcd(n, d) + '.<br>' +
      'Divide both by ' + gcd(n, d) + ': ' + n + ' ÷ ' + gcd(n, d) + ' = ' + f.n + ' and ' + d + ' ÷ ' + gcd(n, d) + ' = ' + f.d + '.<br>' +
      'Simplest form: <strong>' + fHTML(f) + '</strong>.'
  };
}, 'Divide the numerator and denominator by their greatest common factor.');

S('fracdec', 'lcd', 'Least common denominator', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 12);
  const d1 = a, d2 = b === a ? b + 1 : b;
  const l = lcm(d1, d2);
  return {
    q: 'What is the least common denominator of <strong>' + fHTML(F(1, d1)) + '</strong> and <strong>' + fHTML(F(1, d2)) + '</strong>?',
    type: 'num', a: l,
    sol: 'The least common denominator is the LCM of ' + d1 + ' and ' + d2 + '.<br>LCM(' + d1 + ', ' + d2 + ') = <strong>' + l + '</strong>.'
  };
}, 'The LCD is the least common multiple of the denominators.');

S('fracdec', 'improper-mixed', 'Convert between improper fractions and mixed numbers', r => {
  const d = RI(r, 2, 9), w = RI(r, 1, 5), n0 = RI(r, 1, d - 1);
  const n = w * d + n0;
  if (r() < 0.5) {
    return {
      q: 'Write <strong>' + fHTML({ n: n, d: d }) + '</strong> as a mixed number.',
      type: 'frac', a: F(n, d), display: mixedStr(F(n, d)),
      sol: n + ' ÷ ' + d + ' = ' + w + ' remainder ' + n0 + '.<br>So the mixed number is <strong>' + mixedHTML(F(n, d)) + '</strong>.'
    };
  }
  return {
    q: 'Write <strong>' + mixedHTML(F(n, d)) + '</strong> as an improper fraction.',
    type: 'frac', a: F(n, d),
    sol: 'Multiply the whole number by the denominator: ' + w + ' × ' + d + ' = ' + (w * d) + '.<br>' +
      'Add the numerator: ' + (w * d) + ' + ' + n0 + ' = ' + n + '.<br>The improper fraction is <strong>' + fh(n, d) + '</strong>.'
  };
}, 'Whole × denominator + numerator gives the new numerator.');

S('fracdec', 'frac-to-dec', 'Convert fractions to decimals', r => {
  const d = pick(r, [2, 4, 5, 8, 10, 20, 25, 50]);
  const n = RI(r, 1, d - 1);
  const f = F(n, d);
  const v = fval(f);
  return {
    q: 'Write <strong>' + fHTML(f) + '</strong> as a decimal.',
    type: 'num', a: v,
    sol: 'Divide the numerator by the denominator: ' + f.n + ' ÷ ' + f.d + ' = <strong>' + plain(v) + '</strong>.'
  };
}, 'A fraction is a division: numerator ÷ denominator.');

S('fracdec', 'dec-to-frac', 'Convert decimals to fractions', r => {
  const dp = RI(r, 1, 2);
  const scale = Math.pow(10, dp);
  const n = RI(r, 1, scale - 1);
  const f = F(n, scale);
  return {
    q: 'Write <strong>' + plain(n / scale, dp) + '</strong> as a fraction in simplest form.',
    type: 'frac', a: f,
    sol: plain(n / scale, dp) + ' has ' + dp + ' decimal place' + (dp > 1 ? 's' : '') + ', so write it over ' + scale + ': ' + fh(n, scale) + '.<br>' +
      'Simplify: <strong>' + fHTML(f) + '</strong>.'
  };
}, 'Use 10, 100 or 1000 as the denominator, then simplify.');

S('fracdec', 'order-mixed', 'Order fractions and decimals', r => {
  const vals = [];
  let guard = 0;
  while (vals.length < 4 && guard++ < 100) {
    let v, s;
    if (r() < 0.5) {
      const d = pick(r, [2, 4, 5, 8, 10, 20, 25]);
      const n = RI(r, 1, d - 1);
      v = n / d; s = fHTML(F(n, d));
    } else {
      v = RI(r, 5, 95) / 100; s = v.toFixed(2).replace(/0$/, '');
    }
    if (!vals.some(x => Math.abs(x.v - v) < 1e-9)) vals.push({ v: v, s: s });
  }
  const sorted = vals.slice().sort((a, b) => a.v - b.v);
  const correct = sorted.map(x => x.s).join(' &lt; ');
  const wrongs = [];
  guard = 0;
  while (wrongs.length < 3 && guard++ < 100) {
    const p = shuffle(r, vals).map(x => x.s).join(' &lt; ');
    if (p !== correct && wrongs.indexOf(p) === -1) wrongs.push(p);
  }
  return choiceQ(r, 'Which list shows the values in order from least to greatest?', correct, wrongs,
    'Write each value as a decimal, then order:<br>' + sorted.map(x => x.s + ' = ' + plain(x.v)).join('<br>'));
}, 'Convert everything to decimals so the values are easy to compare.');

S('fracdec', 'fractions-division', 'Understand fractions as division', r => {
  const people = RI(r, 3, 9), items = RI(r, 1, people - 1);
  const f = F(items, people);
  return {
    q: '<strong>' + items + '</strong> pizzas are shared equally among <strong>' + people + '</strong> friends. What fraction of a pizza does each friend get?',
    type: 'frac', a: f,
    sol: 'Each friend gets ' + items + ' ÷ ' + people + ' = <strong>' + fHTML(f) + '</strong> of a pizza.'
  };
}, 'A fraction means numerator divided by denominator.');

S('fracdec', 'compare-frac-dec', 'Compare fractions and decimals', r => {
  const d = pick(r, [2, 4, 5, 8, 10, 20, 25]);
  const n = RI(r, 1, d - 1);
  const f = F(n, d);
  const equal = r() < 0.2;
  let v = equal ? fval(f) : RI(r, 5, 95) / 100;
  if (!equal && Math.abs(v - fval(f)) < 1e-9) v += 0.01;
  const a = fval(f), b = v;
  const sym = Math.abs(a - b) < 1e-9 ? '=' : a < b ? '<' : '>';
  return choiceQ(r, 'Compare: <strong>' + fHTML(f) + '</strong>  ___  <strong>' + plain(b, 2) + '</strong>',
    sym, ['<', '>', '='].filter(x => x !== sym),
    fHTML(f) + ' = ' + plain(a) + ', so ' + fHTML(f) + ' ' + sym + ' ' + plain(b, 2) + '.');
}, 'Write the fraction as a decimal, then compare place values.');

/* ============================================================
   UNIT 4 — Decimal Operations
   ============================================================ */

S('decimal', 'add-sub', 'Add and subtract decimal numbers', r => {
  const add = r() < 0.5;
  let a = RI(r, 15, 9850) / 100, b = RI(r, 15, 9850) / 100;
  if (!add && b > a) [a, b] = [b, a];
  const ans = round(add ? a + b : a - b, 2);
  return {
    q: 'Calculate <strong>' + plain(a, 2) + ' ' + (add ? '+' : '−') + ' ' + plain(b, 2) + '</strong>.',
    type: 'num', a: ans,
    sol: 'Line up the decimal points, then ' + (add ? 'add' : 'subtract') + ' column by column:<br>' +
      '<span class="work">' + plain(a, 2) + ' ' + (add ? '+' : '−') + ' ' + plain(b, 2) + ' = <strong>' + plain(ans, 2) + '</strong></span>'
  };
}, H.decimal);

S('decimal', 'add-sub-word', 'Add and subtract decimals: word problems', r => {
  const a = RI(r, 150, 4800) / 100, b = RI(r, 120, 3900) / 100;
  if (r() < 0.5) {
    return {
      q: 'A bottle contains <strong>' + plain(a, 2) + ' L</strong> of water. Another contains <strong>' + plain(b, 2) + ' L</strong>. How much water is there altogether?',
      type: 'num', a: round(a + b, 2), unit: 'L',
      sol: plain(a, 2) + ' + ' + plain(b, 2) + ' = <strong>' + plain(round(a + b, 2), 2) + ' L</strong>.'
    };
  }
  const big = Math.max(a, b), small = Math.min(a, b);
  return {
    q: 'A runner completes <strong>' + plain(big, 2) + ' km</strong>. A second runner completes <strong>' + plain(small, 2) + ' km</strong>. How much farther did the first runner go?',
    type: 'num', a: round(big - small, 2), unit: 'km',
    sol: plain(big, 2) + ' − ' + plain(small, 2) + ' = <strong>' + plain(round(big - small, 2), 2) + ' km</strong>.'
  };
}, H.decimal);

S('decimal', 'money', 'Add and subtract money amounts', r => {
  const a = RI(r, 150, 8999) / 100, b = RI(r, 150, 8999) / 100;
  const add = r() < 0.6;
  if (add) return {
    q: 'A book costs <strong>' + money(a) + '</strong> and a pen costs <strong>' + money(b) + '</strong>. What is the total cost?',
    type: 'num', a: round(a + b, 2),
    sol: money(a) + ' + ' + money(b) + ' = <strong>' + money(round(a + b, 2)) + '</strong>.'
  };
  const big = Math.max(a, b), small = Math.min(a, b);
  return {
    q: 'You pay with a <strong>$20</strong> note for an item costing <strong>' + money(small) + '</strong>. How much change do you receive?',
    type: 'num', a: round(20 - small, 2),
    sol: '$20.00 − ' + money(small) + ' = <strong>' + money(round(20 - small, 2)) + '</strong>.'
  };
}, H.decimal);

S('decimal', 'complete', 'Complete the decimal addition or subtraction sentence', r => {
  const a = RI(r, 12, 89) / 10, c = RI(r, 90, 199) / 10;
  if (r() < 0.5) {
    const b = round(c - a, 1);
    return {
      q: 'Complete: <strong>' + plain(a, 1) + ' + ___ = ' + plain(c, 1) + '</strong>',
      type: 'num', a: b,
      sol: 'Subtract the known part: ' + plain(c, 1) + ' − ' + plain(a, 1) + ' = <strong>' + plain(b, 1) + '</strong>.'
    };
  }
  const b = round(a - c, 1);
  const base = Math.max(a, c), part = Math.min(a, c);
  return {
    q: 'Complete: <strong>' + plain(base, 1) + ' − ___ = ' + plain(round(base - part, 1), 1) + '</strong>',
    type: 'num', a: part,
    sol: 'The missing part is ' + plain(base, 1) + ' − ' + plain(round(base - part, 1), 1) + ' = <strong>' + plain(part, 1) + '</strong>.'
  };
}, 'Use the inverse operation to find the missing number.');

S('decimal', 'estimate', 'Estimate sums and differences of decimals', r => {
  const a = RI(r, 15, 89) / 10, b = RI(r, 12, 79) / 10;
  const ea = Math.round(a), eb = Math.round(b);
  const add = r() < 0.5;
  return {
    q: 'Estimate <strong>' + plain(a, 1) + (add ? ' + ' : ' − ') + plain(b, 1) + '</strong> by rounding each number to the nearest whole number.',
    type: 'num', a: add ? ea + eb : ea - eb,
    sol: plain(a, 1) + ' rounds to ' + ea + ' and ' + plain(b, 1) + ' rounds to ' + eb + '.<br>' +
      ea + (add ? ' + ' : ' − ') + eb + ' = <strong>' + (add ? ea + eb : ea - eb) + '</strong>.'
  };
}, 'Round each decimal to the nearest whole number first.');

S('decimal', 'multiply', 'Multiply decimals', r => {
  const a = RI(r, 12, 89) / 10, b = RI(r, 12, 79) / 10;
  const ans = round(a * b, 4);
  return {
    q: 'Calculate <strong>' + plain(a, 1) + ' × ' + plain(b, 1) + '</strong>.',
    type: 'num', a: ans,
    sol: 'Multiply as whole numbers: ' + Math.round(a * 10) + ' × ' + Math.round(b * 10) + ' = ' + (Math.round(a * 10) * Math.round(b * 10)) + '.<br>' +
      'There are 2 decimal places in total, so the answer is <strong>' + plain(ans, 2) + '</strong>.'
  };
}, 'Multiply ignoring the decimal point, then count the total decimal places.');

S('decimal', 'point', 'Where does the decimal point go?', r => {
  const a = RI(r, 2, 9) / 10, b = RI(r, 11, 99) / 100;
  const places = 3;
  return {
    q: 'Without calculating, how many decimal places will the product <strong>' + plain(a, 1) + ' × ' + plain(b, 2) + '</strong> have?',
    type: 'num', a: places,
    sol: plain(a, 1) + ' has 1 decimal place and ' + plain(b, 2) + ' has 2 decimal places.<br>1 + 2 = <strong>3 decimal places</strong>.'
  };
}, 'The number of decimal places in a product is the sum of the decimal places in the factors.');

S('decimal', 'divide-whole', 'Divide decimals by whole numbers', r => {
  const d = RI(r, 2, 9), q = RI(r, 12, 240) / 20;
  const n = round(q * d, 2);
  return {
    q: 'Calculate <strong>' + plain(n, 2) + ' ÷ ' + d + '</strong>.',
    type: 'num', a: q,
    sol: 'Divide as usual, keeping the decimal point in line: ' + plain(n, 2) + ' ÷ ' + d + ' = <strong>' + plain(q, 2) + '</strong>.'
  };
}, H.div);

S('decimal', 'powers', 'Multiply and divide decimals by powers of ten', r => {
  const a = RI(r, 12, 899) / 100;
  const p = pick(r, [10, 100, 1000]);
  const mult = r() < 0.5;
  const ans = round(mult ? a * p : a / p, 6);
  const places = Math.round(Math.log10(p));
  return {
    q: 'Calculate <strong>' + plain(a, 2) + (mult ? ' × ' : ' ÷ ') + fmt(p) + '</strong>.',
    type: 'num', a: ans,
    sol: (mult ? 'Multiplying by ' : 'Dividing by ') + fmt(p) + ' moves the decimal point ' + (mult ? 'right' : 'left') + ' ' + places + ' place' + (places > 1 ? 's' : '') + '.<br>' +
      'Answer: <strong>' + plain(ans, 6) + '</strong>.'
  };
}, 'Each power of ten shifts the decimal point one place.');

S('decimal', 'divisor', 'Division with decimal divisors', r => {
  const d = pick(r, [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 2.5]);
  const q = RI(r, 3, 24);
  const n = round(d * q, 2);
  return {
    q: 'Calculate <strong>' + plain(n, 2) + ' ÷ ' + plain(d, 1) + '</strong>.',
    type: 'num', a: q,
    sol: 'Make the divisor a whole number by multiplying both numbers by 10:<br>' +
      plain(n, 2) + ' ÷ ' + plain(d, 1) + ' = ' + plain(n * 10, 1) + ' ÷ ' + plain(d * 10, 1) + ' = <strong>' + q + '</strong>.'
  };
}, 'Multiply both the dividend and divisor by 10 until the divisor is a whole number.');

S('decimal', 'mixed', 'Add, subtract, multiply or divide two decimals', r => {
  const a = RI(r, 12, 89) / 10, b = RI(r, 12, 49) / 10;
  const op = pick(r, ['+', '−', '×', '÷']);
  let ans;
  if (op === '+') ans = round(a + b, 2);
  else if (op === '−') ans = round(a - b, 2);
  else if (op === '×') ans = round(a * b, 4);
  else ans = round(a / b, 4);
  return {
    q: 'Calculate <strong>' + plain(a, 1) + ' ' + op + ' ' + plain(b, 1) + '</strong>.',
    type: 'num', a: ans, tol: 1e-4,
    sol: op === '×' ? 'Multiply, then place the decimal point: <strong>' + plain(ans, 4) + '</strong>.'
      : op === '÷' ? 'Divide carefully, keeping the decimal point in line: <strong>' + plain(ans, 4) + '</strong>.'
      : 'Line up the decimal points and ' + (op === '+' ? 'add' : 'subtract') + ': <strong>' + plain(ans, 2) + '</strong>.'
  };
}, 'Identify the operation first, then apply the right decimal rule.');

S('decimal', 'expr', 'Evaluate numerical expressions involving decimals', r => {
  const a = RI(r, 12, 49) / 10, b = RI(r, 2, 9) / 10, c = RI(r, 2, 8) / 10;
  const ans = round(a + b * c, 4);
  return {
    q: 'Evaluate <strong>' + plain(a, 1) + ' + ' + plain(b, 1) + ' × ' + plain(c, 1) + '</strong>.',
    type: 'num', a: ans, tol: 1e-4,
    sol: 'Multiply first: ' + plain(b, 1) + ' × ' + plain(c, 1) + ' = ' + plain(round(b * c, 4), 4) + '.<br>' +
      'Then add: ' + plain(a, 1) + ' + ' + plain(round(b * c, 4), 4) + ' = <strong>' + plain(ans, 4) + '</strong>.'
  };
}, 'Follow the order of operations: multiply before adding.');

S('decimal', 'word', 'Decimal word problems', r => {
  const price = RI(r, 125, 899) / 100, qty = RI(r, 2, 6);
  const cost = round(price * qty, 2);
  const paid = Math.ceil(cost / 10) * 10;
  return {
    q: 'A notebook costs <strong>' + money(price) + '</strong>. You buy <strong>' + qty + '</strong> notebooks and pay with a <strong>$' + paid + '</strong> note. How much change do you receive?',
    type: 'num', a: round(paid - cost, 2),
    sol: 'Cost of notebooks: ' + money(price) + ' × ' + qty + ' = ' + money(cost) + '.<br>' +
      'Change: $' + paid + '.00 − ' + money(cost) + ' = <strong>' + money(round(paid - cost, 2)) + '</strong>.'
  };
}, 'Find the total cost first, then subtract from the amount paid.');

/* ============================================================
   UNIT 5 — Fraction Operations
   ============================================================ */

S('fraction', 'add-like', 'Add and subtract fractions with like denominators', r => {
  const d = RI(r, 4, 12);
  const a = RI(r, 1, d - 1), b = RI(r, 1, d - 1);
  const add = r() < 0.5;
  const hi = Math.max(a, b), lo = Math.min(a, b);
  const f = add ? fadd(F(a, d), F(b, d)) : fsub(F(hi, d), F(lo, d));
  const left = add ? a : hi, right = add ? b : lo;
  return {
    q: 'Calculate <strong>' + fHTML(F(left, d)) + (add ? ' + ' : ' − ') + fHTML(F(right, d)) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: (add ? 'Add' : 'Subtract') + ' the numerators and keep the denominator:<br>' +
      fHTML(F(left, d)) + (add ? ' + ' : ' − ') + fHTML(F(right, d)) + ' = ' + fh(add ? a + b : hi - lo, d) + '.<br>' +
      'Simplify: <strong>' + fHTML(f) + '</strong>.'
  };
}, H.fracAdd);

S('fraction', 'add-unlike', 'Add and subtract fractions with unlike denominators', r => {
  const d1 = RI(r, 2, 8), d2 = RI(r, 2, 9);
  const dd1 = d2 === d1 ? d2 + 1 : d2;
  const a = RI(r, 1, d1 - 1), b = RI(r, 1, dd1 - 1);
  const add = r() < 0.5;
  let f1 = F(a, d1), f2 = F(b, dd1);
  if (!add && fval(f1) < fval(f2)) { const t = f1; f1 = f2; f2 = t; }
  const f = add ? fadd(f1, f2) : fsub(f1, f2);
  const den = lcm(f1.d, f2.d);
  return {
    q: 'Calculate <strong>' + fHTML(f1) + (add ? ' + ' : ' − ') + fHTML(f2) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: 'The least common denominator is ' + den + '.<br>' +
      'Rewrite: ' + fHTML(f1) + ' = ' + fh(f1.n * den / f1.d, den) + ' and ' + fHTML(f2) + ' = ' + fh(f2.n * den / f2.d, den) + '.<br>' +
      (add ? 'Add' : 'Subtract') + ': <strong>' + fHTML(f) + '</strong>.'
  };
}, H.fracAdd);

S('fraction', 'add-mixed', 'Add and subtract mixed numbers', r => {
  const w1 = RI(r, 1, 4), f1 = randFrac(r, 8, true);
  const w2 = RI(r, 1, 3), f2 = randFrac(r, 8, true);
  const add = r() < 0.5;
  let m1 = toImp(w1, f1), m2 = toImp(w2, f2);
  if (!add && fval(m1) < fval(m2)) { const t = m1; m1 = m2; m2 = t; }
  const f = add ? fadd(m1, m2) : fsub(m1, m2);
  return {
    q: 'Calculate <strong>' + mixedHTML(m1) + (add ? ' + ' : ' − ') + mixedHTML(m2) + '</strong>. Write your answer as a mixed number.',
    type: 'frac', a: f, display: mixedStr(f),
    sol: 'Convert to improper fractions: ' + mixedHTML(m1) + ' = ' + fHTML(m1) + ' and ' + mixedHTML(m2) + ' = ' + fHTML(m2) + '.<br>' +
      (add ? 'Add' : 'Subtract') + ': ' + fHTML(f) + ' = <strong>' + mixedHTML(f) + '</strong>.'
  };
}, H.fracAdd);

S('fraction', 'add-word', 'Add and subtract fractions: word problems', r => {
  const d = RI(r, 4, 10);
  const a = RI(r, 1, d - 1), b = RI(r, 1, d - 1);
  const f = fadd(F(a, d), F(b, d));
  return {
    q: 'Maya walks <strong>' + fHTML(F(a, d)) + ' km</strong> to school and <strong>' + fHTML(F(b, d)) + ' km</strong> home again. How far does she walk in total?',
    type: 'frac', a: f, unit: 'km',
    sol: fHTML(F(a, d)) + ' + ' + fHTML(F(b, d)) + ' = ' + fHTML(F(a + b, d)) + ' = <strong>' + fHTML(f) + ' km</strong>.'
  };
}, H.fracAdd);

S('fraction', 'mult-whole', 'Multiply fractions by whole numbers', r => {
  const d = RI(r, 3, 9), a = RI(r, 1, d - 1), w = RI(r, 2, 8);
  const f = fmul(F(a, d), F(w, 1));
  return {
    q: 'Calculate <strong>' + fHTML(F(a, d)) + ' × ' + w + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: 'Write the whole number as ' + fh(w, 1) + ', then multiply:<br>' + fHTML(F(a, d)) + ' × ' + fh(w, 1) + ' = ' + fh(a * w, d) + ' = <strong>' + fHTML(f) + '</strong>.'
  };
}, H.fracMul);

S('fraction', 'mult', 'Multiply two fractions', r => {
  const a = randFrac(r, 9, true), b = randFrac(r, 9, true);
  const f = fmul(a, b);
  return {
    q: 'Calculate <strong>' + fHTML(a) + ' × ' + fHTML(b) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: 'Multiply numerators and denominators:<br>' + fHTML(a) + ' × ' + fHTML(b) + ' = ' + fh(a.n * b.n, a.d * b.d) + ' = <strong>' + fHTML(f) + '</strong>.'
  };
}, H.fracMul);

S('fraction', 'mult-mixed', 'Multiply mixed numbers', r => {
  const m1 = randMixed(r, 3), m2 = randMixed(r, 3);
  const f = fmul(m1, m2);
  return {
    q: 'Calculate <strong>' + mixedHTML(m1) + ' × ' + mixedHTML(m2) + '</strong>. Write your answer as a mixed number.',
    type: 'frac', a: f, display: mixedStr(f),
    sol: 'Convert to improper fractions: ' + mixedHTML(m1) + ' = ' + fHTML(m1) + ' and ' + mixedHTML(m2) + ' = ' + fHTML(m2) + '.<br>' +
      'Multiply: ' + fHTML(m1) + ' × ' + fHTML(m2) + ' = ' + fh(m1.n * m2.n, m1.d * m2.d) + ' = <strong>' + mixedHTML(f) + '</strong>.'
  };
}, H.fracMul);

S('fraction', 'reciprocal', 'Reciprocals', r => {
  const a = randFrac(r, 12, true);
  const f = F(a.d, a.n);
  return {
    q: 'What is the reciprocal of <strong>' + fHTML(a) + '</strong>?',
    type: 'frac', a: f,
    sol: 'Swap the numerator and denominator: the reciprocal of ' + fHTML(a) + ' is <strong>' + fHTML(f) + '</strong>.'
  };
}, 'Flip the fraction upside down.');

S('fraction', 'div-unit', 'Divide whole numbers by unit fractions', r => {
  const d = RI(r, 2, 8), w = RI(r, 2, 9);
  return {
    q: 'How many <strong>' + fHTML(F(1, d)) + '</strong>s are in <strong>' + w + '</strong>?',
    type: 'num', a: w * d,
    sol: 'Each whole contains ' + d + ' pieces of size ' + fHTML(F(1, d)) + '.<br>' + w + ' × ' + d + ' = <strong>' + (w * d) + '</strong>.'
  };
}, 'Dividing by a unit fraction is the same as multiplying by its denominator.');

S('fraction', 'divide', 'Divide fractions', r => {
  const a = randFrac(r, 9, true), b = randFrac(r, 9, true);
  const f = fdiv(a, b);
  return {
    q: 'Calculate <strong>' + fHTML(a) + ' ÷ ' + fHTML(b) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: 'Multiply by the reciprocal of the second fraction:<br>' + fHTML(a) + ' × ' + fHTML(F(b.d, b.n)) + ' = ' + fh(a.n * b.d, a.d * b.n) + ' = <strong>' + fHTML(f) + '</strong>.'
  };
}, H.fracDiv);

S('fraction', 'divide-mixed', 'Divide fractions and mixed numbers', r => {
  const m = randMixed(r, 3), b = randFrac(r, 8, true);
  const f = fdiv(m, b);
  return {
    q: 'Calculate <strong>' + mixedHTML(m) + ' ÷ ' + fHTML(b) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f, display: mixedStr(f),
    sol: 'Write the mixed number as an improper fraction: ' + mixedHTML(m) + ' = ' + fHTML(m) + '.<br>' +
      'Multiply by the reciprocal: ' + fHTML(m) + ' × ' + fHTML(F(b.d, b.n)) + ' = <strong>' + mixedHTML(f) + '</strong>.'
  };
}, H.fracDiv);

S('fraction', 'div-word', 'Divide fractions: word problems', r => {
  const d = pick(r, [2, 3, 4, 5, 6, 8]);
  const w = RI(r, 3, 9);
  return {
    q: 'A recipe uses <strong>' + fHTML(F(1, d)) + ' cup</strong> of sugar per batch. How many batches can you make with <strong>' + w + ' cups</strong> of sugar?',
    type: 'num', a: w * d,
    sol: w + ' ÷ ' + fHTML(F(1, d)) + ' = ' + w + ' × ' + d + ' = <strong>' + (w * d) + ' batches</strong>.'
  };
}, H.fracDiv);

S('fraction', 'mixed-ops', 'Add, subtract, multiply or divide two fractions', r => {
  const op = pick(r, ['+', '−', '×', '÷']);
  let a = randFrac(r, 8, true), b = randFrac(r, 8, true);
  if ((op === '−') && fval(a) < fval(b)) { const t = a; a = b; b = t; }
  let f;
  if (op === '+') f = fadd(a, b);
  else if (op === '−') f = fsub(a, b);
  else if (op === '×') f = fmul(a, b);
  else f = fdiv(a, b);
  return {
    q: 'Calculate <strong>' + fHTML(a) + ' ' + op + ' ' + fHTML(b) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: op === '+' ? 'Common denominator, add, simplify: <strong>' + fHTML(f) + '</strong>.'
      : op === '−' ? 'Common denominator, subtract, simplify: <strong>' + fHTML(f) + '</strong>.'
      : op === '×' ? 'Multiply numerators and denominators: <strong>' + fHTML(f) + '</strong>.'
      : 'Multiply by the reciprocal: <strong>' + fHTML(f) + '</strong>.'
  };
}, 'Choose the correct fraction rule for the operation.');

S('fraction', 'expr', 'Evaluate numerical expressions involving fractions', r => {
  const a = randFrac(r, 6, true), b = randFrac(r, 6, true), c = randFrac(r, 6, true);
  const f = fadd(a, fmul(b, c));
  return {
    q: 'Evaluate <strong>' + fHTML(a) + ' + ' + fHTML(b) + ' × ' + fHTML(c) + '</strong>. Write your answer in simplest form.',
    type: 'frac', a: f,
    sol: 'Multiply first: ' + fHTML(b) + ' × ' + fHTML(c) + ' = ' + fHTML(fmul(b, c)) + '.<br>' +
      'Then add: ' + fHTML(a) + ' + ' + fHTML(fmul(b, c)) + ' = <strong>' + fHTML(f) + '</strong>.'
  };
}, 'Follow the order of operations: multiply before adding.');
