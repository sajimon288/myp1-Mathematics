/* ============================================================
   Units 10-11: expressions, equations & inequalities
   ============================================================ */

/* ============================================================
   UNIT 10 — Expressions
   ============================================================ */

S('expr', 'write-one', 'Write variable expressions: one operation', r => {
  const n = RI(r, 2, 12);
  const v = pick(r, ['n', 'x', 'y', 'm', 'p']);
  const items = [
    [n + ' more than ' + v, v + ' + ' + n, [n + v, v + ' − ' + n, n + ' − ' + v]],
    [n + ' less than ' + v, v + ' − ' + n, [v + ' + ' + n, n + ' − ' + v, n + ' × ' + v]],
    ['the product of ' + n + ' and ' + v, n + v, [v + ' + ' + n, v + ' − ' + n, fh(v, n)]],
    [v + ' divided by ' + n, fh(v, n), [fh(n, v), v + ' − ' + n, v + ' × ' + n]],
    ['the sum of ' + v + ' and ' + n, v + ' + ' + n, [v + ' − ' + n, n + ' − ' + v, n + v]],
    ['twice ' + v, '2' + v, [v + ' + 2', '2 + ' + v, fh(v, 2)]]
  ];
  const it = pick(r, items);
  return choiceQ(r, 'Which expression means “' + it[0] + '”?', it[1], it[2],
    '“' + it[0] + '” translates directly to <strong>' + it[1] + '</strong>.');
}, 'Look for the operation words: more than (+), less than (−), product (×), quotient (÷).');

S('expr', 'write-two', 'Write variable expressions: two operations', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 9);
  const v = pick(r, ['n', 'x', 'y', 'm']);
  const items = [
    [a + ' times a number, minus ' + b, a + v + ' − ' + b, [a + v + ' + ' + b, a + '(' + v + ' − ' + b + ')', a + ' − ' + b + v]],
    [b + ' more than ' + a + ' times a number', a + v + ' + ' + b, [b + v + ' + ' + a, a + '(' + v + ' + ' + b + ')', a + ' − ' + b + v]],
    ['the quotient of a number and ' + b + ', plus ' + a, fh(v, b) + ' + ' + a, [fh(v, '(' + b + ' + ' + a + ')'), fh(b, v) + ' + ' + a, v + ' + ' + fh(b, a)]],
    ['twice a number, increased by ' + b, '2' + v + ' + ' + b, ['2(' + v + ' + ' + b + ')', '2' + v + ' − ' + b, v + ' + 2' + b]]
  ];
  const it = pick(r, items);
  return choiceQ(r, 'Which expression means “' + it[0] + '”?', it[1], it[2],
    'Translate step by step: “' + it[0] + '” becomes <strong>' + it[1] + '</strong>.');
}, 'Translate the words in order, using a letter for the unknown number.');

S('expr', 'evaluate', 'Evaluate variable expressions', r => {
  const x = RI(r, 2, 9), a = RI(r, 2, 7), b = RI(r, 1, 20);
  const val = a * x + b;
  return {
    q: 'Evaluate <strong>' + a + 'x + ' + b + '</strong> when <strong>x = ' + x + '</strong>.',
    type: 'num', a: val,
    sol: 'Substitute x = ' + x + ': ' + a + '(' + x + ') + ' + b + '.<br>' +
      a + ' × ' + x + ' = ' + (a * x) + ', then ' + (a * x) + ' + ' + b + ' = <strong>' + val + '</strong>.'
  };
}, 'Replace the variable with its value, then follow the order of operations.');

S('expr', 'evaluate-multi', 'Evaluate multi-variable expressions', r => {
  const a = RI(r, 2, 12), b = RI(r, 2, 12), m = RI(r, 2, 5), n = RI(r, 2, 5);
  const val = m * a + n * b;
  return {
    q: 'Evaluate <strong>' + m + 'a + ' + n + 'b</strong> when <strong>a = ' + a + '</strong> and <strong>b = ' + b + '</strong>.',
    type: 'num', a: val,
    sol: m + '(' + a + ') + ' + n + '(' + b + ') = ' + (m * a) + ' + ' + (n * b) + ' = <strong>' + val + '</strong>.'
  };
}, 'Substitute each variable separately, then add.');

S('expr', 'terms', 'Identify terms and coefficients', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 9), c = RI(r, 2, 15);
  const v1 = pick(r, ['x', 'a', 'm']), v2 = pick(r, ['y', 'b', 'n']);
  const kind = RI(r, 1, 3);
  if (kind === 1) return {
    q: 'In the expression <strong>' + a + v1 + ' + ' + b + v2 + ' − ' + c + '</strong>, what is the coefficient of <strong>' + v2 + '</strong>?',
    type: 'num', a: b,
    sol: 'The coefficient is the number multiplying ' + v2 + ': <strong>' + b + '</strong>.'
  };
  if (kind === 2) return {
    q: 'How many terms are in <strong>' + a + v1 + ' + ' + b + v2 + ' − ' + c + '</strong>?',
    type: 'num', a: 3,
    sol: 'Terms are separated by + and − signs: ' + a + v1 + ', ' + b + v2 + ' and −' + c + '.<br>There are <strong>3 terms</strong>.'
  };
  return {
    q: 'What is the constant term in <strong>' + a + v1 + ' + ' + b + v2 + ' − ' + c + '</strong>?',
    type: 'num', a: -c,
    sol: 'The constant is the term with no variable: <strong>−' + c + '</strong>.'
  };
}, 'A coefficient multiplies a variable; a constant stands alone.');

S('expr', 'distribute', 'Multiply using the distributive property', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 9), c = RI(r, 2, 9);
  const v = pick(r, ['x', 'y', 'n']);
  const correct = a + v + ' + ' + (a * b);
  return choiceQ(r, 'Expand <strong>' + a + '(' + v + ' + ' + b + ')</strong> using the distributive property.',
    correct, [a + v + ' + ' + b, a + v + ' + ' + (a + b), (a + b) + v],
    'Multiply each term inside the brackets by ' + a + ':<br>' + a + ' × ' + v + ' = ' + a + v + ', and ' + a + ' × ' + b + ' = ' + (a * b) + '.<br>' +
    'So <strong>' + correct + '</strong>.');
}, 'Multiply the outside factor by every term inside the brackets.');

S('expr', 'factor', 'Factor expressions using the distributive property', r => {
  const g = RI(r, 2, 9);
  let m = RI(r, 2, 8), n = RI(r, 2, 8), guard = 0;
  while (gcd(m, n) !== 1 && guard++ < 50) { m = RI(r, 2, 8); n = RI(r, 2, 8); }
  const v = pick(r, ['x', 'y', 'm']);
  const correct = g + '(' + m + v + ' + ' + n + ')';
  return choiceQ(r, 'Factor <strong>' + (g * m) + v + ' + ' + (g * n) + '</strong> using the greatest common factor.',
    correct, [g + '(' + m + v + ' + ' + (g * n) + ')', (g * m) + '(' + v + ' + ' + n + ')', g + '(' + (m + n) + v + ')'],
    'The GCF of ' + (g * m) + ' and ' + (g * n) + ' is ' + g + '.<br>' +
    (g * m) + v + ' + ' + (g * n) + ' = <strong>' + correct + '</strong>.');
}, 'Take out the greatest common factor from every term.');

S('expr', 'like-terms', 'Add and subtract like terms', r => {
  const a = RI(r, 2, 9), b = RI(r, 2, 9), c = RI(r, 2, 12);
  const v = pick(r, ['x', 'y', 'n']);
  const correct = (a + b) + v + ' + ' + c;
  return choiceQ(r, 'Simplify <strong>' + a + v + ' + ' + c + ' + ' + b + v + '</strong>.',
    correct, [(a + b) + v + ' + ' + (c + 1), (a * b) + v + ' + ' + c, (a + b + c) + v],
    'Combine the like terms ' + a + v + ' and ' + b + v + ': ' + (a + b) + v + '.<br>' +
    'Keep the constant: <strong>' + correct + '</strong>.');
}, 'Only like terms (same variable) can be combined.');

S('expr', 'equivalent', 'Identify equivalent expressions', r => {
  const a = RI(r, 2, 8), b = RI(r, 2, 9), c = RI(r, 2, 9);
  const v = pick(r, ['x', 'y', 'n']);
  const correct = a + v + ' + ' + (a * b);
  return choiceQ(r, 'Which expression is equivalent to <strong>' + a + '(' + v + ' + ' + b + ')</strong>?',
    correct, [a + v + ' + ' + b, a + v + ' + ' + (b + a), (a + b) + v],
    'Distribute the ' + a + ': ' + a + ' × ' + v + ' + ' + a + ' × ' + b + ' = <strong>' + correct + '</strong>.');
}, 'Expand or factor to check whether two expressions are equivalent.');

S('expr', 'properties', 'Properties of operations', r => {
  const kind = RI(r, 1, 4);
  const a = RI(r, 2, 9), b = RI(r, 2, 9), c = RI(r, 2, 9);
  const cases = [
    ['Which property is shown? <strong>' + a + ' × ' + b + ' = ' + b + ' × ' + a + '</strong>', 'Commutative property of multiplication',
      ['Associative property of multiplication', 'Distributive property', 'Identity property of multiplication'],
      'Changing the order of the factors does not change the product.'],
    ['Which property is shown? <strong>(' + a + ' + ' + b + ') + ' + c + ' = ' + a + ' + (' + b + ' + ' + c + ')</strong>', 'Associative property of addition',
      ['Commutative property of addition', 'Distributive property', 'Identity property of addition'],
      'Changing the grouping of the addends does not change the sum.'],
    ['Which property is shown? <strong>' + a + ' × (' + b + ' + ' + c + ') = ' + (a * b) + ' + ' + (a * c) + '</strong>', 'Distributive property',
      ['Commutative property of multiplication', 'Associative property of addition', 'Identity property of multiplication'],
      'The factor outside is multiplied by each term inside the brackets.'],
    ['Which property is shown? <strong>' + a + ' + 0 = ' + a + '</strong>', 'Identity property of addition',
      ['Commutative property of addition', 'Associative property of addition', 'Zero property of multiplication'],
      'Adding 0 leaves a number unchanged.']
  ];
  const k = cases[kind - 1];
  return choiceQ(r, k[0], k[1], k[2], '<strong>' + k[1] + '.</strong> ' + k[3]);
}, 'Commutative → order changes; associative → grouping changes; distributive → multiply across brackets.');

/* ============================================================
   UNIT 11 — Equations & Inequalities
   ============================================================ */

S('equation', 'satisfy', 'Does x satisfy an equation?', r => {
  const x = RI(r, 2, 9), a = RI(r, 2, 7), b = RI(r, 1, 15);
  const truth = r() < 0.5;
  const c = truth ? a * x + b : a * x + b + RI(r, 1, 5);
  return choiceQ(r, 'Does <strong>x = ' + x + '</strong> satisfy <strong>' + a + 'x + ' + b + ' = ' + c + '</strong>?',
    truth ? 'Yes' : 'No', truth ? ['No'] : ['Yes'],
    'Substitute x = ' + x + ': ' + a + '(' + x + ') + ' + b + ' = ' + (a * x + b) + '.<br>' +
    (truth ? 'This equals ' + c + ', so it satisfies the equation.' : 'This does not equal ' + c + ', so it does not satisfy the equation.'));
}, 'Substitute the value for x and check whether both sides are equal.');

S('equation', 'solve-add', 'Solve one-step addition and subtraction equations', r => {
  const x = RI(r, 3, 25), a = RI(r, 3, 20);
  const add = r() < 0.5;
  const b = add ? x + a : x - a;
  const sign = add ? '+' : '−';
  const ans = add ? b - a : b + a;
  return {
    q: 'Solve for x: <strong>x ' + sign + ' ' + a + ' = ' + b + '</strong>',
    type: 'num', a: ans,
    sol: (add ? 'Subtract ' + a + ' from both sides' : 'Add ' + a + ' to both sides') + ':<br>' +
      'x = ' + b + (add ? ' − ' : ' + ') + a + ' = <strong>' + ans + '</strong>.'
  };
}, H.equation);

S('equation', 'solve-mult', 'Solve one-step multiplication and division equations', r => {
  const x = RI(r, 2, 12), a = RI(r, 2, 9);
  if (r() < 0.5) {
    return {
      q: 'Solve for x: <strong>' + a + 'x = ' + (a * x) + '</strong>',
      type: 'num', a: x,
      sol: 'Divide both sides by ' + a + ':<br>x = ' + (a * x) + ' ÷ ' + a + ' = <strong>' + x + '</strong>.'
    };
  }
  return {
    q: 'Solve for x: <strong>' + fh('x', a) + ' = ' + x + '</strong>',
    type: 'num', a: x * a,
    sol: 'Multiply both sides by ' + a + ':<br>x = ' + x + ' × ' + a + ' = <strong>' + (x * a) + '</strong>.'
  };
}, H.equation);

S('equation', 'solve-mixed', 'Solve one-step equations', r => {
  const x = RI(r, 2, 20);
  const kind = RI(r, 1, 4);
  if (kind === 1) {
    const a = RI(r, 2, 15);
    return { q: 'Solve for x: <strong>x + ' + a + ' = ' + (x + a) + '</strong>', type: 'num', a: x, sol: 'Subtract ' + a + ' from both sides: <strong>x = ' + x + '</strong>.' };
  }
  if (kind === 2) {
    const a = RI(r, 2, 12);
    return { q: 'Solve for x: <strong>x − ' + a + ' = ' + (x - a) + '</strong>', type: 'num', a: x, sol: 'Add ' + a + ' to both sides: <strong>x = ' + x + '</strong>.' };
  }
  if (kind === 3) {
    const a = RI(r, 2, 9);
    return { q: 'Solve for x: <strong>' + a + 'x = ' + (a * x) + '</strong>', type: 'num', a: x, sol: 'Divide both sides by ' + a + ': <strong>x = ' + x + '</strong>.' };
  }
  const a = RI(r, 2, 9);
  return { q: 'Solve for x: <strong>' + fh('x', a) + ' = ' + x + '</strong>', type: 'num', a: x * a, sol: 'Multiply both sides by ' + a + ': <strong>x = ' + (x * a) + '</strong>.' };
}, H.equation);

S('equation', 'word', 'Solve one-step equations: word problems', r => {
  const x = RI(r, 8, 45), a = RI(r, 3, 12);
  if (r() < 0.5) {
    return {
      q: 'After spending <strong>$' + a + '</strong>, Mia has <strong>$' + x + '</strong>. How much money did she start with?',
      type: 'num', a: x + a,
      sol: 'Let x be the starting amount. Then x − ' + a + ' = ' + x + '.<br>Add ' + a + ' to both sides: x = <strong>' + (x + a) + '</strong>.'
    };
  }
  return {
    q: '<strong>' + a + '</strong> friends share some stickers equally. Each friend gets <strong>' + x + '</strong> stickers. How many stickers are there?',
    type: 'num', a: a * x,
    sol: 'Let x be the number of stickers. Then x ÷ ' + a + ' = ' + x + '.<br>Multiply both sides by ' + a + ': x = <strong>' + (a * x) + '</strong>.'
  };
}, H.equation);

S('equation', 'write', 'Write an equation from words', r => {
  const x = RI(r, 3, 20), a = RI(r, 2, 15);
  const kind = RI(r, 1, 3);
  if (kind === 1) return choiceQ(r, 'Which equation represents “a number increased by ' + a + ' is ' + (x + a) + '”?',
    'x + ' + a + ' = ' + (x + a), ['x − ' + a + ' = ' + (x + a), a + 'x = ' + (x + a), 'x = ' + (x + a) + ' + ' + a],
    '“Increased by” means addition: <strong>x + ' + a + ' = ' + (x + a) + '</strong>.');
  if (kind === 2) return choiceQ(r, 'Which equation represents “' + a + ' times a number is ' + (a * x) + '”?',
    a + 'x = ' + (a * x), ['x + ' + a + ' = ' + (a * x), fh('x', a) + ' = ' + (a * x), a + ' + x = ' + (a * x)],
    '“Times” means multiplication: <strong>' + a + 'x = ' + (a * x) + '</strong>.');
  return choiceQ(r, 'Which equation represents “a number divided by ' + a + ' is ' + x + '”?',
    fh('x', a) + ' = ' + x, ['x × ' + a + ' = ' + x, 'x + ' + a + ' = ' + x, 'x − ' + a + ' = ' + x],
    '“Divided by” means division: <strong>' + fh('x', a) + ' = ' + x + '</strong>.');
}, 'Match the operation words to the symbols.');

S('equation', 'ineq-solution', 'Solutions to inequalities', r => {
  const a = RI(r, -10, 10), x = a + RI(r, -5, 5);
  const less = r() < 0.5;
  const truth = less ? x < a : x > a;
  return choiceQ(r, 'Is <strong>x = ' + x + '</strong> a solution of <strong>x ' + (less ? '<' : '>') + ' ' + a + '</strong>?',
    truth ? 'Yes' : 'No', truth ? ['No'] : ['Yes'],
    x + (less ? ' < ' : ' > ') + a + ' is ' + (truth ? 'true' : 'false') + ', so ' + (truth ? 'it is' : 'it is not') + ' a solution.');
}, 'Substitute the value and check whether the inequality is true.');

S('equation', 'ineq-graph', 'Graph inequalities on number lines', r => {
  const a = RI(r, -5, 5);
  const less = r() < 0.5;
  const open = r() < 0.5;
  const sym = open ? (less ? '<' : '>') : (less ? '≤' : '≥');
  const correct = 'x ' + sym + ' ' + a;
  const wrongs = ['x ' + (open ? (less ? '>' : '<') : (less ? '≥' : '≤')) + ' ' + a,
    'x ' + (open ? (less ? '≤' : '≥') : (less ? '<' : '>')) + ' ' + a,
    'x ' + sym + ' ' + (a + 1)];
  return choiceQ(r, 'Which inequality is shown on the number line?' +
    numberLineHTML(-8, 8, 1, [], { ray: { from: a, open: open, dir: less ? 'left' : 'right' } }),
    correct, wrongs,
    'The ray points ' + (less ? 'left, so x is less than ' : 'right, so x is greater than ') + a + '. ' +
    (open ? 'The open circle means the endpoint is not included: <strong>' + correct + '</strong>.'
      : 'The closed circle means the endpoint is included: <strong>' + correct + '</strong>.'));
}, 'Open circle → < or >; closed circle → ≤ or ≥.');

S('equation', 'ineq-solve', 'Solve one-step inequalities', r => {
  const k = RI(r, 3, 15), a = RI(r, 2, 12);
  const less = r() < 0.5;
  const rhs = less ? k + a : k - a;
  const correct = 'x ' + (less ? '<' : '>') + ' ' + k;
  return choiceQ(r, 'Solve <strong>x ' + (less ? '+' : '−') + ' ' + a + ' ' + (less ? '<' : '>') + ' ' + rhs + '</strong>.',
    correct,
    ['x ' + (less ? '>' : '<') + ' ' + k, 'x ' + (less ? '<' : '>') + ' ' + (k + a), 'x ' + (less ? '<' : '>') + ' ' + Math.abs(k - a)],
    (less ? 'Subtract ' + a + ' from both sides' : 'Add ' + a + ' to both sides') + '.<br>' +
    'x ' + (less ? '<' : '>') + ' ' + rhs + (less ? ' − ' : ' + ') + a + ' = <strong>' + k + '</strong>.');
}, H.equation);

S('equation', 'ineq-word', 'One-step inequalities: word problems', r => {
  const a = RI(r, 10, 30);
  return choiceQ(r, 'You must be at least <strong>' + a + '</strong> years old to join a club. Which inequality shows the allowed ages?',
    'x ≥ ' + a, ['x > ' + a, 'x ≤ ' + a, 'x < ' + a],
    '“At least ' + a + '” includes ' + a + ', so <strong>x ≥ ' + a + '</strong>.');
}, '“At least” means ≥; “at most” means ≤.');

S('equation', 'two-var-value', 'Find a value using two-variable equations', r => {
  const m = RI(r, 2, 6), b = RI(r, 1, 10), x = RI(r, 1, 9);
  return {
    q: 'Use the equation <strong>y = ' + m + 'x + ' + b + '</strong> to find y when <strong>x = ' + x + '</strong>.',
    type: 'num', a: m * x + b,
    sol: 'Substitute x = ' + x + ':<br>y = ' + m + '(' + x + ') + ' + b + ' = ' + (m * x) + ' + ' + b + ' = <strong>' + (m * x + b) + '</strong>.'
  };
}, 'Substitute the x-value, then calculate.');

S('equation', 'two-var-table', 'Complete a table for a two-variable relationship', r => {
  const m = RI(r, 2, 5), b = RI(r, 1, 8);
  const xs = [1, 2, 3, 4];
  const rows = xs.map(x => [String(x), String(m * x + b)]);
  const hidden = RI(r, 1, 3);
  rows[hidden] = [String(xs[hidden]), '?'];
  return {
    q: 'The table follows the rule <strong>y = ' + m + 'x + ' + b + '</strong>. What number is missing?' + tableHTML(['x', 'y'], rows),
    type: 'num', a: m * xs[hidden] + b,
    sol: 'Substitute x = ' + xs[hidden] + ': y = ' + m + '(' + xs[hidden] + ') + ' + b + ' = <strong>' + (m * xs[hidden] + b) + '</strong>.'
  };
}, 'Apply the rule to the missing x-value.');

S('equation', 'two-var-write', 'Write a two-variable equation', r => {
  const m = RI(r, 2, 5), b = RI(r, 1, 8);
  const rows = [1, 2, 3].map(x => [String(x), String(m * x + b)]);
  return choiceQ(r, 'Which equation matches the table?' + tableHTML(['x', 'y'], rows),
    'y = ' + m + 'x + ' + b,
    ['y = ' + m + 'x − ' + b, 'y = ' + b + 'x + ' + m, 'y = ' + (m + 1) + 'x + ' + b],
    'When x = 1, y = ' + (m + b) + '. The rule y = ' + m + 'x + ' + b + ' gives ' + m + '(1) + ' + b + ' = ' + (m + b) + ', and it fits every row.');
}, 'Test each equation with a row from the table.');
