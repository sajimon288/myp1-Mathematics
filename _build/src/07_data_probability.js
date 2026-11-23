/* ============================================================
   Unit 14 — Data, Statistics & Probability
   ============================================================ */

function medianOf(arr) {
  const a = arr.slice().sort((x, y) => x - y);
  const n = a.length;
  return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
}
function modeOf(arr) {
  const c = {};
  arr.forEach(v => { c[v] = (c[v] || 0) + 1; });
  let best = null, bestN = 0;
  Object.keys(c).forEach(k => { if (c[k] > bestN) { bestN = c[k]; best = Number(k); } });
  return best;
}
function pieChartHTML(items) {
  let acc = 0;
  const stops = items.map(it => {
    const start = acc;
    acc += it.value;
    return it.color + ' ' + start + '% ' + acc + '%';
  }).join(', ');
  let legend = '<div class="pie-legend">';
  items.forEach(it => {
    legend += '<span><i style="background:' + it.color + '"></i>' + it.label + ' — ' + it.value + '%</span>';
  });
  legend += '</div>';
  return '<div class="pie-row"><div class="pie" style="background:conic-gradient(' + stops + ')"></div>' + legend + '</div>';
}

S('data', 'center', 'Mean, median, mode and range', r => {
  const m = RI(r, 4, 12);
  const vals = shuffle(r, [m, m, m - 1, m + 1, m + 2, m - 2]);
  const mean = m, median = m, mode = m, range = 4;
  const kind = RI(r, 1, 4);
  const label = kind === 1 ? 'mean' : kind === 2 ? 'median' : kind === 3 ? 'mode' : 'range';
  const ans = kind === 1 ? mean : kind === 2 ? median : kind === 3 ? mode : range;
  return {
    q: 'Find the <strong>' + label + '</strong> of the data set:<br><span class="datalist">' + vals.join(', ') + '</span>',
    type: 'num', a: ans,
    sol: 'Order the data: ' + vals.slice().sort((a, b) => a - b).join(', ') + '.<br>' +
      (kind === 1 ? 'Mean = sum ÷ 6 = ' + (m * 6) + ' ÷ 6 = <strong>' + mean + '</strong>.'
        : kind === 2 ? 'With 6 values, the median is the mean of the 3rd and 4th values: <strong>' + median + '</strong>.'
        : kind === 3 ? 'The value that appears most often is <strong>' + mode + '</strong>.'
        : 'Range = greatest − least = ' + (m + 2) + ' − ' + (m - 2) + ' = <strong>4</strong>.')
  };
}, 'Mean = sum ÷ count; median = middle; mode = most frequent; range = greatest − least.');

S('data', 'dot-plot', 'Interpret dot plots', r => {
  const base = [1, 2, 3, 4, 5, 6, 7];
  const mode = RI(r, 2, 6);
  const vals = [mode, mode, mode, mode - 1, mode + 1, mode + 2, mode - 2, 1, 7].sort((a, b) => a - b);
  const kind = RI(r, 1, 3);
  const med = medianOf(vals), rng = Math.max(...vals) - Math.min(...vals);
  const label = kind === 1 ? 'mode' : kind === 2 ? 'median' : 'range';
  const ans = kind === 1 ? modeOf(vals) : kind === 2 ? med : rng;
  return {
    q: 'The dot plot shows the number of books read by students. Find the <strong>' + label + '</strong>.' + dotPlotHTML(vals, 'books'),
    type: 'num', a: ans,
    sol: (kind === 1 ? 'The tallest stack is above <strong>' + ans + '</strong>, so that is the mode.'
      : kind === 2 ? 'There are ' + vals.length + ' values. The middle value is <strong>' + ans + '</strong>.'
      : 'Greatest = ' + Math.max(...vals) + ', least = ' + Math.min(...vals) + ', so range = <strong>' + ans + '</strong>.')
  };
}, 'Read the values from the dot plot, then calculate.');

S('data', 'mad', 'Mean absolute deviation', r => {
  const m = RI(r, 5, 15);
  const vals = [m - 3, m - 1, m + 1, m + 3];
  return {
    q: 'Find the mean absolute deviation of the data set:<br><span class="datalist">' + vals.join(', ') + '</span>',
    type: 'num', a: 2,
    sol: 'Mean = (' + vals.join(' + ') + ') ÷ 4 = ' + m + '.<br>' +
      'Deviations: |' + (m - 3) + ' − ' + m + '| = 3, |' + (m - 1) + ' − ' + m + '| = 1, |' + (m + 1) + ' − ' + m + '| = 1, |' + (m + 3) + ' − ' + m + '| = 3.<br>' +
      'MAD = (3 + 1 + 1 + 3) ÷ 4 = <strong>2</strong>.'
  };
}, 'Find the mean, then average the distances from the mean.');

S('data', 'quartiles', 'Quartiles and interquartile range', r => {
  const a = RI(r, 2, 5);
  const mid = a + 6;
  const b = mid + 3;
  const vals = [a, a + 1, a + 2, a + 3, a + 4, mid, b, b + 1, b + 2, b + 3, b + 4];
  const q1 = a + 2, q3 = b + 2;
  const kind = RI(r, 1, 3);
  const label = kind === 1 ? 'first quartile (Q1)' : kind === 2 ? 'third quartile (Q3)' : 'interquartile range (IQR)';
  const ans = kind === 1 ? q1 : kind === 2 ? q3 : q3 - q1;
  return {
    q: 'Find the <strong>' + label + '</strong> of the data set:<br><span class="datalist">' + vals.join(', ') + '</span>',
    type: 'num', a: ans,
    sol: 'The median is ' + mid + '. The lower half is ' + vals.slice(0, 5).join(', ') + ', so Q1 = ' + q1 + '.<br>' +
      'The upper half is ' + vals.slice(6).join(', ') + ', so Q3 = ' + q3 + '.<br>' +
      'IQR = Q3 − Q1 = ' + q3 + ' − ' + q1 + ' = <strong>' + (q3 - q1) + '</strong>.'
  };
}, 'Q1 and Q3 are the medians of the lower and upper halves.');

S('data', 'outlier', 'Identify an outlier', r => {
  const base = 10, vals = [];
  for (let i = 0; i < 6; i++) vals.push(base + RI(r, -3, 3));
  vals.push(base + RI(r, 20, 35));
  const out = Math.max(...vals);
  return {
    q: 'Which value is an outlier in the data set?<br><span class="datalist">' + shuffle(r, vals).join(', ') + '</span>',
    type: 'num', a: out,
    sol: 'Most values are close to ' + base + '. The value <strong>' + out + '</strong> is far away from the rest, so it is the outlier.'
  };
}, 'An outlier is a value much smaller or larger than the rest.');

S('data', 'bar-graph', 'Interpret bar graphs', r => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const vals = [RI(r, 4, 10), RI(r, 4, 10), RI(r, 4, 10), RI(r, 4, 10), RI(r, 4, 10)];
  vals[RI(r, 0, 4)] = 12;
  const kind = RI(r, 1, 3);
  const total = vals.reduce((a, b) => a + b, 0);
  const max = Math.max(...vals), min = Math.min(...vals);
  if (kind === 1) return {
    q: 'The bar graph shows books sold each day. How many books were sold altogether?' + barChartHTML(labels, vals, 'books'),
    type: 'num', a: total,
    sol: 'Add the five bars: ' + vals.join(' + ') + ' = <strong>' + total + '</strong>.'
  };
  if (kind === 2) return {
    q: 'The bar graph shows books sold each day. How many more books were sold on the best day than on the worst day?' + barChartHTML(labels, vals, 'books'),
    type: 'num', a: max - min,
    sol: 'Best day = ' + max + ', worst day = ' + min + '.<br>' + max + ' − ' + min + ' = <strong>' + (max - min) + '</strong>.'
  };
  return {
    q: 'The bar graph shows books sold each day. On which day were the most books sold?' + barChartHTML(labels, vals, 'books'),
    type: 'choice', a: vals.indexOf(max),
    choices: labels,
    sol: 'The tallest bar is on <strong>' + labels[vals.indexOf(max)] + '</strong> (' + max + ' books).'
  };
}, 'Read the height of each bar from the scale.');

S('data', 'circle-graph', 'Interpret circle graphs', r => {
  const total = 20 * RI(r, 5, 15);
  const parts = [40, 25, 20, 15];
  const colors = ['#db3832', '#2563eb', '#0f766e', '#d97706'];
  const labels = ['Cats', 'Dogs', 'Birds', 'Fish'];
  const i = RI(r, 0, 3);
  const items = labels.map((label, j) => ({ label: label, value: parts[j], color: colors[j] }));
  return {
    q: 'The circle graph shows favourite pets in a school of ' + total + ' students. How many students chose <strong>' + labels[i] + '</strong>?' +
      pieChartHTML(items),
    type: 'num', a: parts[i] * total / 100,
    sol: labels[i] + ' = ' + parts[i] + '% of ' + total + '.<br>' + parts[i] + '% × ' + total + ' = <strong>' + (parts[i] * total / 100) + '</strong>.'
  };
}, 'Find the percent of the total for that sector.');

S('data', 'probability', 'Probability of one event', r => {
  const red = RI(r, 2, 8), blue = RI(r, 2, 8), green = RI(r, 2, 6);
  const total = red + blue + green;
  const f = F(red, total);
  return {
    q: 'A bag contains <strong>' + red + '</strong> red, <strong>' + blue + '</strong> blue and <strong>' + green + '</strong> green marbles. What is the probability of drawing a red marble? Write as a fraction in simplest form.',
    type: 'frac', a: f,
    sol: 'P(red) = number of red ÷ total = ' + fh(red, total) + ' = <strong>' + fHTML(f) + '</strong>.'
  };
}, 'Probability = favourable outcomes ÷ total outcomes.');

S('data', 'complement', 'Probability of opposite events', r => {
  const red = RI(r, 2, 8), blue = RI(r, 2, 8);
  const total = red + blue;
  const f = F(blue, total);
  return {
    q: 'A bag contains <strong>' + red + '</strong> red and <strong>' + blue + '</strong> blue marbles. What is the probability of <strong>not</strong> drawing a red marble?',
    type: 'frac', a: f,
    sol: 'P(not red) = 1 − P(red) = 1 − ' + fh(red, total) + ' = ' + fh(blue, total) + ' = <strong>' + fHTML(f) + '</strong>.'
  };
}, 'P(not A) = 1 − P(A).');

S('data', 'counting', 'Counting principle', r => {
  const a = RI(r, 2, 5), b = RI(r, 2, 5);
  return {
    q: 'A café offers <strong>' + a + '</strong> main dishes and <strong>' + b + '</strong> desserts. How many different main-and-dessert combinations are possible?',
    type: 'num', a: a * b,
    sol: 'Multiply the choices: ' + a + ' × ' + b + ' = <strong>' + (a * b) + '</strong> combinations.'
  };
}, 'Multiply the number of options at each stage.');

S('data', 'predictions', 'Make predictions', r => {
  const sections = pick(r, [4, 5, 8, 10]);
  const red = RI(r, 1, sections - 1);
  const trials = sections * RI(r, 10, 60);
  const f = F(red, sections);
  const expected = red * trials / sections;
  return {
    q: 'A spinner has <strong>' + sections + '</strong> equal sections, and <strong>' + red + '</strong> of them are red. If you spin <strong>' + trials + '</strong> times, about how many times should you land on red?',
    type: 'num', a: expected,
    sol: 'P(red) = ' + fh(red, sections) + '.<br>Expected = ' + fh(red, sections) + ' × ' + trials + ' = <strong>' + expected + '</strong>.'
  };
}, 'Expected count = probability × number of trials.');

S('data', 'statistical', 'Identify statistical questions', r => {
  const items = [
    ['How tall are the students in my class?', ['How tall is my teacher?', 'What is the height of the door?', 'How many students are in my class?'], true],
    ['How many pets does each student in Year 7 own?', ['How many pets does Sam own?', 'What is the most popular pet?', 'How old is the school cat?'], true],
    ['What is the favourite sport of each student in the class?', ['What sport does Maria play?', 'How many sports are in the Olympics?', 'What is the school’s address?'], true],
    ['How many minutes do students spend on homework each night?', ['How long is the maths lesson?', 'How many minutes are in an hour?', 'When does school start?'], true]
  ];
  const it = pick(r, items);
  return choiceQ(r, 'Which of these is a <strong>statistical question</strong>?', it[0], it[1],
    'A statistical question expects variety in the answers, so you collect data. <strong>' + it[0] + '</strong> does this.');
}, 'A statistical question anticipates different answers from different people.');
