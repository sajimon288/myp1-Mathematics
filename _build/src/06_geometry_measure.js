/* ============================================================
   Units 12-13: geometry, perimeter/area/volume
   ============================================================ */

/* ============================================================
   UNIT 12 — Lines, Angles & Figures
   ============================================================ */

S('geometry', 'angle-classify', 'Measure and classify angles', r => {
  const angle = pick(r, [15, 25, 35, 45, 55, 65, 75, 90, 100, 110, 125, 135, 150, 165, 180]);
  const type = angle < 90 ? 'Acute' : angle === 90 ? 'Right' : angle < 180 ? 'Obtuse' : 'Straight';
  return choiceQ(r, 'Classify an angle that measures <strong>' + angle + '°</strong>.' + svgAngleDiagram(angle, angle + '°'), type,
    ['Acute', 'Right', 'Obtuse', 'Straight'].filter(x => x !== type),
    angle + '° is ' + (angle < 90 ? 'less than 90°' : angle === 90 ? 'exactly 90°' : angle < 180 ? 'between 90° and 180°' : 'exactly 180°') + ', so it is <strong>' + type.toLowerCase() + '</strong>.');
}, 'Acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°.');

S('geometry', 'angle-complement', 'Complementary and supplementary angles', r => {
  const a = RI(r, 10, 80);
  const kind = RI(r, 1, 2);
  if (kind === 1) return {
    q: 'What is the complement of an angle measuring <strong>' + a + '°</strong>?' + svgComplement(a),
    type: 'num', a: 90 - a, unit: '°',
    sol: 'Complementary angles add to 90°:<br>90° − ' + a + '° = <strong>' + (90 - a) + '°</strong>.'
  };
  const b = RI(r, 30, 150);
  return {
    q: 'What is the supplement of an angle measuring <strong>' + b + '°</strong>?' + svgSupplement(b),
    type: 'num', a: 180 - b, unit: '°',
    sol: 'Supplementary angles add to 180°:<br>180° − ' + b + '° = <strong>' + (180 - b) + '°</strong>.'
  };
}, 'Complement sums to 90°; supplement sums to 180°.');

S('geometry', 'angle-vertical', 'Vertical and adjacent angles', r => {
  const a = RI(r, 25, 155);
  if (r() < 0.5) return {
    q: 'Two straight lines cross. One angle is <strong>' + a + '°</strong>. What is the measure of the vertically opposite angle?' + svgIntersecting(a, 'vertical'),
    type: 'num', a: a, unit: '°',
    sol: 'Vertical angles are equal, so the opposite angle is also <strong>' + a + '°</strong>.'
  };
  return {
    q: 'Two straight lines cross. One angle is <strong>' + a + '°</strong>. What is the measure of an adjacent angle?' + svgIntersecting(a, 'adjacent'),
    type: 'num', a: 180 - a, unit: '°',
    sol: 'Adjacent angles on a straight line add to 180°:<br>180° − ' + a + '° = <strong>' + (180 - a) + '°</strong>.'
  };
}, 'Vertical angles are equal; adjacent angles on a line add to 180°.');

S('geometry', 'triangle-angle', 'Find missing angles in triangles', r => {
  const a = RI(r, 30, 70), b = RI(r, 30, 70);
  const c = 180 - a - b;
  return {
    q: 'Two angles of a triangle measure <strong>' + a + '°</strong> and <strong>' + b + '°</strong>. What is the third angle?' + svgTriangleAngles([a + '°', b + '°', '?']),
    type: 'num', a: c, unit: '°',
    sol: 'The angles in a triangle add to 180°.<br>180° − ' + a + '° − ' + b + '° = <strong>' + c + '°</strong>.'
  };
}, 'The angles in any triangle add to 180°.');

S('geometry', 'quad-angle', 'Find missing angles in quadrilaterals', r => {
  const a = RI(r, 60, 100), b = RI(r, 60, 100), c = RI(r, 60, 100);
  const d = 360 - a - b - c;
  return {
    q: 'Three angles of a quadrilateral measure <strong>' + a + '°</strong>, <strong>' + b + '°</strong> and <strong>' + c + '°</strong>. What is the fourth angle?' + svgQuadAngles([a + '°', b + '°', c + '°', '?']),
    type: 'num', a: d, unit: '°',
    sol: 'The angles in a quadrilateral add to 360°.<br>360° − ' + a + '° − ' + b + '° − ' + c + '° = <strong>' + d + '°</strong>.'
  };
}, 'The angles in a quadrilateral add to 360°.');

S('geometry', 'polygon-angle', 'Sums of angles in polygons', r => {
  const n = RI(r, 5, 10);
  const sum = (n - 2) * 180;
  return {
    q: 'What is the sum of the interior angles of a polygon with <strong>' + n + ' sides</strong>?' + svgPolygon(n, n + ' sides'),
    type: 'num', a: sum, unit: '°',
    sol: 'Use (n − 2) × 180° with n = ' + n + ':<br>(' + n + ' − 2) × 180° = ' + (n - 2) + ' × 180° = <strong>' + sum + '°</strong>.'
  };
}, 'Angle sum = (number of sides − 2) × 180°.');

S('geometry', 'triangle-classify', 'Classify triangles', r => {
  if (r() < 0.5) {
    const kind = RI(r, 1, 3);
    if (kind === 1) return choiceQ(r, 'A triangle has angles <strong>60°, 60°, 60°</strong>. Classify it by its angles.' + svgTriangleAngles(['60°', '60°', '60°']), 'Equilateral',
      ['Isosceles', 'Scalene', 'Right'], 'All three angles are equal, so all three sides are equal: an equilateral triangle.');
    if (kind === 2) return choiceQ(r, 'A triangle has angles <strong>40°, 70°, 70°</strong>. Classify it by its angles.' + svgTriangleAngles(['40°', '70°', '70°']), 'Isosceles',
      ['Equilateral', 'Scalene', 'Right'], 'Two angles are equal, so two sides are equal: an isosceles triangle.');
    return choiceQ(r, 'A triangle has angles <strong>35°, 65°, 80°</strong>. Classify it by its angles.' + svgTriangleAngles(['35°', '65°', '80°']), 'Scalene',
      ['Equilateral', 'Isosceles', 'Right'], 'All three angles are different, so all three sides are different: a scalene triangle.');
  }
  const kind = RI(r, 1, 3);
  if (kind === 1) return choiceQ(r, 'A triangle has sides <strong>5 cm, 5 cm, 5 cm</strong>. Classify it by its sides.' + svgTriangleSides(['5 cm', '5 cm', '5 cm']), 'Equilateral',
    ['Isosceles', 'Scalene', 'Right'], 'All three sides are equal, so it is equilateral.');
  if (kind === 2) return choiceQ(r, 'A triangle has sides <strong>6 cm, 6 cm, 9 cm</strong>. Classify it by its sides.' + svgTriangleSides(['6 cm', '6 cm', '9 cm']), 'Isosceles',
    ['Equilateral', 'Scalene', 'Right'], 'Two sides are equal, so it is isosceles.');
  return choiceQ(r, 'A triangle has sides <strong>4 cm, 7 cm, 9 cm</strong>. Classify it by its sides.' + svgTriangleSides(['4 cm', '7 cm', '9 cm']), 'Scalene',
    ['Equilateral', 'Isosceles', 'Right'], 'All three sides are different, so it is scalene.');
}, 'Equilateral = all equal, isosceles = two equal, scalene = all different.');

S('geometry', 'triangle-inequality', 'Triangle inequality', r => {
  const a = RI(r, 2, 8), b = RI(r, 3, 9);
  const c = a + b - RI(r, 1, 3);
  const correct = [a, b, c].sort((x, y) => x - y).join(', ');
  const wrongs = [];
  let guard = 0;
  while (wrongs.length < 3 && guard++ < 100) {
    const p = RI(r, 1, 5), q = RI(r, 2, 6);
    const rr = p + q + RI(r, 0, 4);
    const w = [p, q, rr].sort((x, y) => x - y).join(', ');
    if (w !== correct && wrongs.indexOf(w) === -1 && p + q <= rr) wrongs.push(w);
  }
  return choiceQ(r, 'Which set of side lengths can form a triangle?' + svgTriangleSides(['a', 'b', 'c']), correct, wrongs,
    'For a triangle, the sum of the two shorter sides must be greater than the longest side.<br>' +
    correct + ': ' + (a + b > c ? 'the two shorter sides add to more than ' + Math.max(a, b, c) + '. ✓' : '') + 
    '<br>The other sets fail this test.');
}, 'The two shorter sides must add to more than the longest side.');

S('geometry', 'quad-classify', 'Classify quadrilaterals', r => {
  const items = [
    ['four right angles and all sides equal', 'Square', ['Rectangle', 'Rhombus', 'Trapezoid']],
    ['four right angles but not all sides equal', 'Rectangle', ['Square', 'Rhombus', 'Trapezoid']],
    ['all sides equal but no right angles', 'Rhombus', ['Square', 'Rectangle', 'Trapezoid']],
    ['exactly one pair of parallel sides', 'Trapezoid', ['Parallelogram', 'Rectangle', 'Square']],
    ['both pairs of opposite sides parallel and equal, adjacent sides not equal, and no right angles', 'Parallelogram', ['Trapezoid', 'Square', 'Rectangle']]
  ];
  const it = pick(r, items);
  return choiceQ(r, 'Which quadrilateral has <strong>' + it[0] + '</strong>?' + svgQuadFamily(), it[1], it[2],
    'A shape with ' + it[0] + ' is a <strong>' + it[1].toLowerCase() + '</strong>.');
}, 'Use the parallel sides and right angles to identify the shape.');

S('geometry', 'symmetry', 'Line symmetry', r => {
  const shapes = [
    ['square', 4], ['rectangle (not a square)', 2], ['equilateral triangle', 3],
    ['regular pentagon', 5], ['regular hexagon', 6], ['isosceles triangle', 1]
  ];
  const s = pick(r, shapes);
  const symShape = s[0] === 'rectangle (not a square)' ? 'rectangle' : s[0];
  return {
    q: 'How many lines of symmetry does a <strong>' + s[0] + '</strong> have?' + svgSymmetry(symShape),
    type: 'num', a: s[1],
    sol: 'A ' + s[0] + ' has <strong>' + s[1] + '</strong> line' + (s[1] === 1 ? '' : 's') + ' of symmetry.'
  };
}, 'A line of symmetry folds the shape onto itself exactly.');

S('geometry', 'polyhedra', 'Identify polyhedra', r => {
  const solids = [
    ['cube', 6, 12, 8], ['rectangular prism', 6, 12, 8], ['triangular prism', 5, 9, 6],
    ['square pyramid', 5, 8, 5], ['triangular pyramid', 4, 6, 4]
  ];
  const s = pick(r, solids);
  const kind = RI(r, 1, 3);
  if (kind === 1) return { q: 'How many <strong>faces</strong> does a <strong>' + s[0] + '</strong> have?' + svgSolid(s[0]), type: 'num', a: s[1], sol: 'A ' + s[0] + ' has <strong>' + s[1] + ' faces</strong>.' };
  if (kind === 2) return { q: 'How many <strong>edges</strong> does a <strong>' + s[0] + '</strong> have?' + svgSolid(s[0]), type: 'num', a: s[2], sol: 'A ' + s[0] + ' has <strong>' + s[2] + ' edges</strong>.' };
  return { q: 'How many <strong>vertices</strong> does a <strong>' + s[0] + '</strong> have?' + svgSolid(s[0]), type: 'num', a: s[3], sol: 'A ' + s[0] + ' has <strong>' + s[3] + ' vertices</strong>.' };
}, 'Faces are flat surfaces, edges are where faces meet, vertices are corners.');

S('geometry', 'nets', 'Nets of three-dimensional figures', r => {
  const items = [
    ['six congruent squares', 'Cube', ['Triangular prism', 'Square pyramid', 'Cylinder']],
    ['two triangles and three rectangles', 'Triangular prism', ['Cube', 'Square pyramid', 'Rectangular prism']],
    ['one square and four triangles', 'Square pyramid', ['Cube', 'Triangular prism', 'Cylinder']],
    ['six rectangles, with opposite faces equal', 'Rectangular prism', ['Cube', 'Square pyramid', 'Triangular prism']]
  ];
  const it = pick(r, items);
  return choiceQ(r, 'A net is made of <strong>' + it[0] + '</strong>. Which solid does it fold into?' + svgNet(it[1]), it[1], it[2],
    'The faces match the surface of a <strong>' + it[1].toLowerCase() + '</strong>.');
}, 'Count the shapes in the net and match them to the solid’s faces.');

/* ============================================================
   UNIT 13 — Perimeter, Area & Volume
   ============================================================ */

S('measure', 'perimeter', 'Perimeter', r => {
  if (r() < 0.5) {
    const l = RI(r, 4, 20), w = RI(r, 2, 15);
    return {
      q: 'Find the perimeter of a rectangle with length <strong>' + l + ' cm</strong> and width <strong>' + w + ' cm</strong>.' + svgRectShape(l, w),
      type: 'num', a: 2 * (l + w), unit: 'cm',
      sol: 'P = 2(l + w) = 2(' + l + ' + ' + w + ') = <strong>' + (2 * (l + w)) + ' cm</strong>.'
    };
  }
  const n = RI(r, 3, 8), s = RI(r, 3, 12);
  return {
    q: 'Find the perimeter of a regular polygon with <strong>' + n + ' sides</strong>, each <strong>' + s + ' cm</strong> long.' + svgPolygon(n, 'each side ' + s + ' cm'),
    type: 'num', a: n * s, unit: 'cm',
    sol: 'Perimeter = number of sides × side length = ' + n + ' × ' + s + ' = <strong>' + (n * s) + ' cm</strong>.'
  };
}, 'Perimeter is the distance around the outside.');

S('measure', 'area-rect', 'Area of rectangles and squares', r => {
  const l = RI(r, 4, 20), w = RI(r, 3, 15);
  return {
    q: 'Find the area of a rectangle with length <strong>' + l + ' cm</strong> and width <strong>' + w + ' cm</strong>.' + svgRectShape(l, w),
    type: 'num', a: l * w, unit: 'cm²',
    sol: 'A = length × width = ' + l + ' × ' + w + ' = <strong>' + (l * w) + ' cm²</strong>.'
  };
}, 'Area of a rectangle = length × width.');

S('measure', 'area-parallelogram', 'Area of parallelograms', r => {
  const b = RI(r, 4, 18), h = RI(r, 3, 12);
  return {
    q: 'Find the area of a parallelogram with base <strong>' + b + ' cm</strong> and height <strong>' + h + ' cm</strong>.' + svgParallelogramShape(b, h),
    type: 'num', a: b * h, unit: 'cm²',
    sol: 'A = base × height = ' + b + ' × ' + h + ' = <strong>' + (b * h) + ' cm²</strong>.'
  };
}, 'Area of a parallelogram = base × perpendicular height.');

S('measure', 'area-triangle', 'Area of triangles', r => {
  const b = RI(r, 4, 18), h = RI(r, 3, 14);
  const area = b * h / 2;
  return {
    q: 'Find the area of a triangle with base <strong>' + b + ' cm</strong> and height <strong>' + h + ' cm</strong>.' + svgTriangleShape(b, h),
    type: 'num', a: area, unit: 'cm²',
    sol: 'A = ½ × base × height = ½ × ' + b + ' × ' + h + ' = <strong>' + plain(area, 1) + ' cm²</strong>.'
  };
}, 'Area of a triangle = ½ × base × height.');

S('measure', 'area-trapezoid', 'Area of trapezoids', r => {
  const a = RI(r, 3, 10), b = a + RI(r, 2, 8), h = RI(r, 3, 10);
  const area = (a + b) * h / 2;
  return {
    q: 'Find the area of a trapezoid with parallel sides <strong>' + a + ' cm</strong> and <strong>' + b + ' cm</strong>, and height <strong>' + h + ' cm</strong>.' + svgTrapezoidShape(a, b, h),
    type: 'num', a: area, unit: 'cm²',
    sol: 'A = ½(a + b)h = ½(' + a + ' + ' + b + ') × ' + h + ' = ½ × ' + (a + b) + ' × ' + h + ' = <strong>' + plain(area, 1) + ' cm²</strong>.'
  };
}, 'Area of a trapezoid = ½ × (sum of parallel sides) × height.');

S('measure', 'area-compound', 'Area of compound figures', r => {
  const W = RI(r, 8, 16), H = RI(r, 8, 14), w = RI(r, 3, 6), h = RI(r, 2, 5);
  const area = W * H - w * h;
  return {
    q: 'An L-shaped room is <strong>' + W + ' m</strong> by <strong>' + H + ' m</strong>, with a <strong>' + w + ' m</strong> by <strong>' + h + ' m</strong> rectangular corner removed. What is the area of the room?' + svgCompoundShape(W, H, w, h, { unit: 'm' }),
    type: 'num', a: area, unit: 'm²',
    sol: 'Large rectangle: ' + W + ' × ' + H + ' = ' + (W * H) + ' m².<br>' +
      'Corner removed: ' + w + ' × ' + h + ' = ' + (w * h) + ' m².<br>' +
      'Area = ' + (W * H) + ' − ' + (w * h) + ' = <strong>' + area + ' m²</strong>.'
  };
}, 'Split the shape into rectangles, or subtract the missing corner.');

S('measure', 'area-missing', 'Find a missing side length', r => {
  const l = RI(r, 4, 15), w = RI(r, 3, 12);
  return {
    q: 'A rectangle has area <strong>' + (l * w) + ' cm²</strong> and length <strong>' + l + ' cm</strong>. What is its width?' + svgRectShape(l, '?'),
    type: 'num', a: w, unit: 'cm',
    sol: 'A = l × w, so w = A ÷ l.<br>' + (l * w) + ' ÷ ' + l + ' = <strong>' + w + ' cm</strong>.'
  };
}, 'Divide the area by the known side.');

S('measure', 'volume-prism', 'Volume of cubes and rectangular prisms', r => {
  const l = RI(r, 3, 12), w = RI(r, 2, 10), h = RI(r, 2, 9);
  return {
    q: 'Find the volume of a rectangular prism with length <strong>' + l + ' cm</strong>, width <strong>' + w + ' cm</strong> and height <strong>' + h + ' cm</strong>.' + svgPrismShape(l, w, h),
    type: 'num', a: l * w * h, unit: 'cm³',
    sol: 'V = l × w × h = ' + l + ' × ' + w + ' × ' + h + ' = <strong>' + (l * w * h) + ' cm³</strong>.'
  };
}, 'Volume of a rectangular prism = length × width × height.');

S('measure', 'volume-frac', 'Volume with fractional side lengths', r => {
  const l = RI(r, 3, 8) / 2, w = RI(r, 3, 8), h = RI(r, 3, 7) / 2;
  const ans = round(l * w * h, 3);
  return {
    q: 'Find the volume of a rectangular prism with length <strong>' + plain(l, 1) + ' m</strong>, width <strong>' + w + ' m</strong> and height <strong>' + plain(h, 1) + ' m</strong>.' + svgPrismShape(plain(l, 1), w, plain(h, 1), { unit: 'm' }),
    type: 'num', a: ans, unit: 'm³',
    sol: 'V = l × w × h = ' + plain(l, 1) + ' × ' + w + ' × ' + plain(h, 1) + ' = <strong>' + plain(ans, 3) + ' m³</strong>.'
  };
}, 'Multiply the three side lengths, including the fractions.');

S('measure', 'surface-rect', 'Surface area of rectangular prisms', r => {
  const l = RI(r, 3, 10), w = RI(r, 2, 8), h = RI(r, 2, 7);
  const sa = 2 * (l * w + l * h + w * h);
  return {
    q: 'Find the surface area of a rectangular prism with length <strong>' + l + ' cm</strong>, width <strong>' + w + ' cm</strong> and height <strong>' + h + ' cm</strong>.' + svgPrismShape(l, w, h, { label: 'Surface area' }),
    type: 'num', a: sa, unit: 'cm²',
    sol: 'SA = 2(lw + lh + wh)<br>= 2(' + (l * w) + ' + ' + (l * h) + ' + ' + (w * h) + ')<br>= 2(' + (l * w + l * h + w * h) + ') = <strong>' + sa + ' cm²</strong>.'
  };
}, 'Surface area = sum of the areas of all six faces.');

S('measure', 'volume-tri-prism', 'Volume of triangular prisms', r => {
  const a = RI(r, 3, 8), b = RI(r, 4, 10), L = RI(r, 5, 12);
  const vol = a * b / 2 * L;
  return {
    q: 'A triangular prism has a right-triangle base with legs <strong>' + a + ' cm</strong> and <strong>' + b + ' cm</strong>, and length <strong>' + L + ' cm</strong>. Find its volume.' + svgTriPrismShape(a, b, L),
    type: 'num', a: vol, unit: 'cm³',
    sol: 'Area of base = ½ × ' + a + ' × ' + b + ' = ' + plain(a * b / 2, 1) + ' cm².<br>' +
      'V = base area × length = ' + plain(a * b / 2, 1) + ' × ' + L + ' = <strong>' + plain(vol, 1) + ' cm³</strong>.'
  };
}, 'Volume of a prism = area of the base × length.');

S('measure', 'surface-tri-prism', 'Surface area of triangular prisms', r => {
  const k = RI(r, 1, 3);
  const a = 3 * k, b = 4 * k, c = 5 * k, L = RI(r, 4, 10);
  const B = a * b / 2, P = a + b + c;
  const sa = 2 * B + P * L;
  return {
    q: 'A triangular prism has a 3-4-5 right-triangle base with legs <strong>' + a + ' cm</strong> and <strong>' + b + ' cm</strong>, hypotenuse <strong>' + c + ' cm</strong>, and length <strong>' + L + ' cm</strong>. Find its surface area.' + svgTriPrismShape(a, b, L, { label: 'Surface area' }),
    type: 'num', a: sa, unit: 'cm²',
    sol: 'Base area B = ½ × ' + a + ' × ' + b + ' = ' + plain(B, 1) + ' cm².<br>' +
      'Perimeter P = ' + a + ' + ' + b + ' + ' + c + ' = ' + P + ' cm.<br>' +
      'SA = 2B + PL = 2(' + plain(B, 1) + ') + ' + P + ' × ' + L + ' = <strong>' + plain(sa, 1) + ' cm²</strong>.'
  };
}, 'Surface area = 2 × base area + perimeter of base × length.');

S('measure', 'word', 'Perimeter, area and volume: word problems', r => {
  if (r() < 0.5) {
    const l = RI(r, 4, 12), w = RI(r, 3, 9), h = RI(r, 2, 6);
    return {
      q: 'A fish tank is <strong>' + l + ' dm</strong> long, <strong>' + w + ' dm</strong> wide and <strong>' + h + ' dm</strong> high. How many cubic decimetres of water can it hold?' + svgPrismShape(l, w, h, { unit: 'dm', label: 'Capacity' }),
      type: 'num', a: l * w * h, unit: 'dm³',
      sol: 'Capacity equals volume: ' + l + ' × ' + w + ' × ' + h + ' = <strong>' + (l * w * h) + ' dm³</strong>.'
    };
  }
  const l = RI(r, 5, 15), w = RI(r, 3, 10);
  return {
    q: 'A garden is <strong>' + l + ' m</strong> long and <strong>' + w + ' m</strong> wide. Fencing costs $8 per metre. What is the cost of fencing the whole garden?' + svgRectShape(l, w, { unit: 'm' }),
    type: 'num', a: 2 * (l + w) * 8,
    sol: 'Perimeter = 2(' + l + ' + ' + w + ') = ' + (2 * (l + w)) + ' m.<br>' +
      'Cost = ' + (2 * (l + w)) + ' × $8 = <strong>$' + (2 * (l + w) * 8) + '</strong>.'
  };
}, 'Decide whether the problem needs perimeter, area or volume.');
