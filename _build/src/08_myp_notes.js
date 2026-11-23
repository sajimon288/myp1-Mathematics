/* ============================================================
   IB MYP unit notes — unit-by-unit curriculum framing
   ============================================================ */

const MYP_CRITERIA = {
  A: 'Knowing and understanding',
  B: 'Investigating patterns',
  C: 'Communicating',
  D: 'Applying mathematics in real-life contexts'
};

const MYP_NOTES = {
  whole: {
    key: 'Form',
    related: ['Quantity', 'Representation', 'Simplification'],
    global: 'Scientific and technical innovation',
    soi: 'The structure of place value allows us to represent, compare and operate with quantities efficiently and accurately.',
    explanation: 'This unit consolidates place value and the four operations with whole numbers, then extends to exponents, powers of ten and the order of operations. Students learn to choose efficient methods, estimate to check whether an answer is reasonable, and explain their reasoning in multi-step problems.',
    keyIdeas: [
      'Place value determines the value of every digit and underpins all written algorithms.',
      'Addition and subtraction are inverse operations, as are multiplication and division.',
      'The order of operations gives everyone the same way to evaluate an expression.'
    ],
    factual: 'How does the position of a digit affect its value?',
    conceptual: 'How do the four operations connect to the structure of the base-10 system?',
    debatable: 'When is an exact calculation more useful than an estimate?',
    atl: ['Thinking: critical thinking', 'Self-management: organisation'],
    criteria: ['A', 'C'],
    note: 'Begin with a short diagnostic on place value and regrouping; many errors in later units trace back here. Use place-value counters and number lines before moving to the standard algorithms, and ask students to estimate first so they can judge whether an answer is reasonable. This unit builds the fluency that Criterion A later assumes.'
  },
  factors: {
    key: 'Logic',
    related: ['Patterns', 'System', 'Simplification'],
    global: 'Scientific and technical innovation',
    soi: 'Number systems contain predictable patterns that help us solve problems about grouping, sharing and simplifying.',
    explanation: 'Students explore the structure of whole numbers through primes, factors and multiples. They use divisibility rules, factor pairs and prime factorisation to find greatest common factors and least common multiples, then apply these ideas to sharing, grouping and scheduling problems.',
    keyIdeas: [
      'Every composite number can be written as a product of primes in exactly one way, apart from order.',
      'Common factors describe what numbers share; common multiples describe when events coincide.',
      'Divisibility rules are efficient tests built on place-value patterns.'
    ],
    factual: 'What makes a number prime?',
    conceptual: 'How do factors and multiples help us simplify and compare numbers?',
    debatable: 'Is mathematics discovered or invented?',
    atl: ['Thinking: creative thinking', 'Research: information literacy'],
    criteria: ['A', 'B'],
    note: 'Prime factor trees and Venn diagrams make GCF and LCM visible rather than rule-based. Ask students to justify why a number is prime or composite, and connect GCF/LCM to simplifying fractions and to real scheduling problems. A short investigation into patterns in multiples supports Criterion B.'
  },
  fracdec: {
    key: 'Relationships',
    related: ['Equivalence', 'Representation', 'Quantity'],
    global: 'Personal and cultural expression',
    soi: 'Different representations of the same quantity allow us to compare, communicate and use parts of a whole.',
    explanation: 'This unit connects fractions, decimals and percentages as different ways of representing the same quantity. Students simplify fractions, convert between improper fractions and mixed numbers, move between fractions and decimals, and compare values using number sense rather than superficial digit counting.',
    keyIdeas: [
      'Equivalent fractions and decimals name the same point on a number line.',
      'Benchmarks such as 0, ½ and 1 make comparisons faster and more reliable.',
      'A fraction is also a division: the numerator divided by the denominator.'
    ],
    factual: 'How can a fraction, decimal and percentage describe the same value?',
    conceptual: 'Why do we choose different representations for different situations?',
    debatable: 'Which representation is most useful in everyday life?',
    atl: ['Communication: communication', 'Thinking: transfer'],
    criteria: ['A', 'C'],
    note: 'Use number lines and benchmark values (0, ½, 1) so students compare magnitude rather than counting digits. A common misconception is that 0.15 is larger than 0.4 because 15 > 4; targeted comparison tasks expose this. Ask students to explain their choice of representation in words to develop Criterion C.'
  },
  decimal: {
    key: 'Relationships',
    related: ['Quantity', 'Equivalence', 'Measurement'],
    global: 'Fairness and development',
    soi: 'Precise operations with decimals allow us to model and solve real-world problems involving money, measurement and fair exchange.',
    explanation: 'Students develop fluent, accurate operations with decimals and use them in money and measurement contexts. The unit emphasises place value, estimation and the relationship between decimal operations and powers of ten, before applying these skills to multi-step problems.',
    keyIdeas: [
      'The decimal point marks the ones place; aligning it aligns the place values.',
      'Multiplying or dividing by 10, 100 or 1000 shifts the decimal point.',
      'An estimate before calculating helps catch place-value errors.'
    ],
    factual: 'How do we line up decimals when adding or subtracting?',
    conceptual: 'How does place value control the size of a decimal answer?',
    debatable: 'Should we always give an exact answer, or is an estimate enough?',
    atl: ['Thinking: critical thinking', 'Self-management: reflection'],
    criteria: ['A', 'D'],
    note: 'Anchor operations in money and measurement contexts. Insist on estimation before calculating so students notice place-value errors, and use grid paper or place-value charts for multiplication and division. The unit is a natural place for a short Criterion D task such as comparing phone plans or checking a shopping receipt.'
  },
  fraction: {
    key: 'Relationships',
    related: ['Equivalence', 'Simplification', 'Quantity'],
    global: 'Personal and cultural expression',
    soi: 'Operations with fractions model fair sharing, recipes and proportional parts of a whole.',
    explanation: 'Students extend their understanding of fractions to all four operations with fractions and mixed numbers. Models and number sense come first, followed by efficient procedures, so that students can explain why common denominators and reciprocals work.',
    keyIdeas: [
      'Adding and subtracting require parts of the same size, so a common denominator is needed.',
      'Multiplying fractions finds a fraction of a fraction; dividing asks how many groups fit.',
      'Dividing by a fraction is equivalent to multiplying by its reciprocal.'
    ],
    factual: 'How do you find a common denominator?',
    conceptual: 'Why does multiplying by the reciprocal give the correct quotient?',
    debatable: 'Are fractions more useful than decimals?',
    atl: ['Communication: communication', 'Thinking: critical thinking'],
    criteria: ['A', 'C'],
    note: 'Model each operation with bar models or fraction circles before teaching the algorithm. Ask students to explain why denominators are not added and why “invert and multiply” works; rules without meaning are easily misapplied. Recipe and sharing contexts give Criterion D a natural home.'
  },
  integers: {
    key: 'Logic',
    related: ['Quantity', 'Representation', 'Equivalence'],
    global: 'Orientation in space and time',
    soi: 'Positive and negative numbers describe quantities and positions relative to a chosen reference point.',
    explanation: 'This unit introduces positive and negative numbers as positions and quantities relative to a reference point. Students compare integers, find absolute values and opposites, and develop reliable rules for adding, subtracting, multiplying and dividing signed numbers.',
    keyIdeas: [
      'A number line makes the effect of a negative sign visible.',
      'Absolute value is distance from zero, not the sign of the number.',
      'Zero pairs explain why adding a negative can move a value to the left.'
    ],
    factual: 'What is an integer?',
    conceptual: 'How does a number line show the effect of adding or subtracting a negative?',
    debatable: 'Can a quantity be less than zero?',
    atl: ['Thinking: critical thinking', 'Research: information literacy'],
    criteria: ['A', 'C'],
    note: 'Use number lines, counters and zero pairs so sign rules emerge from movement and cancellation. Temperature, elevation and banking contexts make the reference point explicit. A common error is treating −8 as greater than −3; compare absolute value and position side by side.'
  },
  coord: {
    key: 'Relationships',
    related: ['Representation', 'Patterns', 'System'],
    global: 'Orientation in space and time',
    soi: 'Coordinates provide a precise system for describing position, movement and relationships in space.',
    explanation: 'Students use the coordinate plane to describe position precisely and to explore geometric relationships. They plot and name points in all four quadrants, reflect points, find distances and use coordinates to calculate area and perimeter.',
    keyIdeas: [
      'An ordered pair gives horizontal position first, then vertical position.',
      'The signs of the coordinates identify the quadrant.',
      'Distance along a horizontal or vertical line is found by subtracting coordinates.'
    ],
    factual: 'How do you plot a point in all four quadrants?',
    conceptual: 'How does a coordinate pair communicate position and direction?',
    debatable: 'Is a map more useful than a set of coordinates?',
    atl: ['Thinking: transfer', 'Communication: communication'],
    criteria: ['A', 'C'],
    note: 'Start with first-quadrant games and maps before extending to negative coordinates. Ask students to describe routes in words and symbols, and to explain reflections using the axes. Linking coordinates to spreadsheets and simple graphs prepares students for later algebra and data work.'
  },
  ratio: {
    key: 'Relationships',
    related: ['Equivalence', 'Patterns', 'Models'],
    global: 'Globalization and sustainability',
    soi: 'Ratios and rates allow us to compare quantities and make predictions about proportional situations.',
    explanation: 'Students compare quantities multiplicatively using ratios, rates and proportions. They build ratio tables, find unit rates, solve proportions and use scale drawings, with an emphasis on recognising proportional situations and avoiding additive reasoning.',
    keyIdeas: [
      'A ratio compares quantities by multiplication, not by adding the same amount.',
      'A unit rate describes the amount for one unit and makes comparisons easy.',
      'Equivalent ratios are created by multiplying or dividing both parts by the same number.'
    ],
    factual: 'What is a unit rate?',
    conceptual: 'How can two different ratios describe the same relationship?',
    debatable: 'When is a proportional model appropriate?',
    atl: ['Thinking: critical thinking', 'Communication: communication'],
    criteria: ['A', 'D'],
    note: 'Use tape diagrams, double number lines and ratio tables before introducing cross-multiplication. Watch for additive reasoning, where students add the same amount rather than multiplying. A Criterion D task on recipe scaling, fuel efficiency or currency exchange makes the mathematics purposeful.'
  },
  percent: {
    key: 'Relationships',
    related: ['Equivalence', 'Quantity', 'Models'],
    global: 'Fairness and development',
    soi: 'Percentages help us interpret and make informed decisions about everyday financial situations.',
    explanation: 'This unit connects percentages to fractions and decimals and applies them to everyday financial decisions. Students find percentages of amounts, find the whole or the percentage, convert units, and use percentages for discounts, tax, tips and simple interest.',
    keyIdeas: [
      'Percent means “per hundred”, so percentages, fractions and decimals are interchangeable.',
      'Benchmark percentages support mental estimation and checking.',
      'Financial contexts require interpreting an answer, not just calculating it.'
    ],
    factual: 'How do you find a percentage of an amount?',
    conceptual: 'How are percentages, fractions and decimals connected?',
    debatable: 'Do discounts and advertising always help consumers?',
    atl: ['Research: information literacy', 'Thinking: critical thinking'],
    criteria: ['A', 'D'],
    note: 'Build benchmarks (10%, 25%, 50%) and mental strategies before formal methods. Use real receipts, sale signs and simple-interest examples; ask students to critique misleading “percentage off” claims. This unit supports financial literacy and a strong Criterion D investigation.'
  },
  expr: {
    key: 'Form',
    related: ['Patterns', 'Representation', 'Simplification'],
    global: 'Scientific and technical innovation',
    soi: 'Algebraic expressions use symbols and structure to generalise patterns and describe relationships.',
    explanation: 'Students move from arithmetic to algebra by using letters to represent unknown or variable quantities. They write and evaluate expressions, identify terms and coefficients, and use the distributive property and like terms to create equivalent expressions.',
    keyIdeas: [
      'A variable is a symbol for a number whose value may change.',
      'An expression describes a calculation; an equation states that two expressions are equal.',
      'Equivalent expressions have the same value for every substitution.'
    ],
    factual: 'What is a variable?',
    conceptual: 'How does an expression differ from an equation?',
    debatable: 'Is algebra a language or a tool?',
    atl: ['Thinking: transfer', 'Communication: communication'],
    criteria: ['A', 'C'],
    note: 'Bridge from arithmetic to algebra with patterns, function machines and algebra tiles. A common misconception is that 3x means 3 + x; substitution tasks and tile models correct this. Ask students to translate between words, diagrams and symbols to strengthen Criterion C.'
  },
  equation: {
    key: 'Logic',
    related: ['Equivalence', 'Models', 'System'],
    global: 'Fairness and development',
    soi: 'Equations and inequalities model balance and constraints, allowing us to solve problems and justify solutions.',
    explanation: 'Students solve one-step equations and inequalities and connect them to balance and constraint. They check solutions, translate word problems into equations, and begin to describe relationships between two variables using tables, rules and graphs.',
    keyIdeas: [
      'Solving an equation means finding the value that makes both sides equal.',
      'Inverse operations undo each other and must be applied to both sides.',
      'Multiplying or dividing an inequality by a negative reverses its direction.'
    ],
    factual: 'What does it mean for a value to satisfy an equation?',
    conceptual: 'Why must the same operation be applied to both sides?',
    debatable: 'Can a mathematical model ever be unfair?',
    atl: ['Thinking: critical thinking', 'Self-management: reflection'],
    criteria: ['A', 'C', 'D'],
    note: 'Use balance models and inverse operations rather than “move it to the other side”. Ask students to check solutions by substitution and to explain each step. Inequality direction is a common stumbling point; connect it to the number line and to real constraints such as age or budget.'
  },
  geometry: {
    key: 'Form',
    related: ['Measurement', 'Representation', 'System'],
    global: 'Personal and cultural expression',
    soi: 'Geometric figures have measurable properties and relationships that can be described, classified and justified.',
    explanation: 'Students classify lines, angles, triangles, quadrilaterals and other polygons, and use angle relationships to find unknown values. The unit builds justification and spatial reasoning through angle sums, symmetry, nets and the properties of three-dimensional solids.',
    keyIdeas: [
      'Angle facts such as “angles on a straight line sum to 180°” are tools for reasoning.',
      'Shapes are classified by their properties, not only by appearance.',
      'A net shows the faces of a solid unfolded into two dimensions.'
    ],
    factual: 'What is the angle sum of a triangle?',
    conceptual: 'How do angle relationships help us find unknown values?',
    debatable: 'Is symmetry a property of the object or of the observer?',
    atl: ['Communication: communication', 'Thinking: critical thinking'],
    criteria: ['A', 'C'],
    note: 'Use protractors, dynamic geometry and physical models so students discover angle sums before using them. Require reasons (“angles on a straight line”) rather than just answers. Architecture, art and design contexts connect the unit to the global context and to Criterion C.'
  },
  measure: {
    key: 'Relationships',
    related: ['Measurement', 'Quantity', 'Models'],
    global: 'Scientific and technical innovation',
    soi: 'Measurement formulas allow us to quantify space and solve design problems efficiently.',
    explanation: 'Students use perimeter, area, surface area and volume to quantify two- and three-dimensional space. They build formulas from models, work with composite shapes and fractional lengths, and apply measurement reasoning to design and packaging problems.',
    keyIdeas: [
      'Perimeter measures a boundary; area measures a surface; volume measures capacity.',
      'Units must match the dimension: cm, cm² or cm³.',
      'Composite shapes can be decomposed into simpler shapes or treated as a whole minus a part.'
    ],
    factual: 'How do you choose the correct unit for area or volume?',
    conceptual: 'Why does doubling a length affect area and volume differently?',
    debatable: 'Should packaging be designed for cost or for sustainability?',
    atl: ['Thinking: transfer', 'Research: information literacy'],
    criteria: ['A', 'D'],
    note: 'Build formulas from grids, nets and physical models instead of giving them as facts. Emphasise unit reasoning (cm vs cm² vs cm³) and composite shapes. A packaging or classroom-design task provides a strong Criterion D summative and links to sustainability.'
  },
  data: {
    key: 'Relationships',
    related: ['Representation', 'Patterns', 'Validity'],
    global: 'Identities and relationships',
    soi: 'Data can be collected, represented and interpreted to reveal patterns and support informed decisions.',
    explanation: 'Students collect, display and interpret data to answer statistical questions. They calculate and compare measures of centre and spread, read a range of graphs, and use probability to describe uncertainty and make predictions.',
    keyIdeas: [
      'A statistical question expects variability in the data.',
      'Mean, median and mode summarise different aspects of a data set.',
      'Probability describes long-run likelihood, not a guarantee for one trial.'
    ],
    factual: 'What is the difference between mean, median and mode?',
    conceptual: 'How does the choice of graph or average shape the story data tells?',
    debatable: 'Can statistics be trusted?',
    atl: ['Research: information literacy', 'Communication: communication'],
    criteria: ['B', 'C', 'D'],
    note: 'Begin with a statistical question students genuinely care about. Use dot plots and small data sets so students compute and interpret by hand before using technology. Discuss sampling, outliers and misleading graphs to develop data ethics and Criterion D reasoning.'
  }
};
