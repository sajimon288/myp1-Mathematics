# MYP 1 — IB MYP Year 7 Mathematics Practice

A self-contained practice site for **IB MYP 1 / Year 7 Mathematics**, with 14 units, 169 auto-generated practice skills and unit notes aligned to the MYP framework.

## Open the site

Online: **https://YOUR-USERNAME.github.io/myp1-ib-maths-practice/**

Offline: open `index.html` (the same file also exists as `myp1_maths_practice.html` in the development folder).

- No server, internet connection or external files needed.
- The EtonHouse logo is embedded in the HTML.
- Progress is saved in the browser's `localStorage`.
- Use **Reset progress** in the sidebar to clear it.

## Deploying to GitHub Pages

This folder is ready to upload: `index.html` at the root is the whole site.

1. Create a public repository on GitHub (for example `myp1-ib-maths-practice`).
2. Upload the **contents** of this folder (drag them onto the upload page, or use `git push`).
3. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. Wait about a minute; the site appears at `https://YOUR-USERNAME.github.io/myp1-ib-maths-practice/`.

The `.nojekyll` file stops GitHub from running Jekyll on the site.

## What is included

- 14 units and 169 interactive skills
- Fresh, auto-generated questions with instant feedback and worked solutions
- 15-question practice sets for every skill
- **Math Sprint** game: 60 seconds, combo scoring, bonus time, saved best scores and a review of missed questions
- Geometry, coordinate and measurement questions include diagrams — angles, triangles, quadrilaterals, polygons, solids, nets, area and volume
- Fractions are shown vertically, and fraction answers are entered in numerator/denominator boxes; mixed-number answers add a whole-number box
- **Explain** and **▶ Animate** controls for every skill: a written explanation, method, unit key ideas, worked example and a step-by-step animated task that starts on click
- Animation speed control: **Very slow · Slow · Normal · Fast** (defaults to Slow)
- Hints, mastery tracking (8 correct in a row), XP and daily streaks
- Daily mix, skill search and unit practice
- **IB MYP unit notes** page
- A unit note panel on every unit page
- Responsive layout for laptop, tablet and phone
- Accessibility, best practices and SEO: Lighthouse 100

## Unit notes

The **IB MYP unit notes** page (`#/teacher`) gives each unit:

- key concept
- related concepts
- global context
- statement of inquiry
- a written explanation of the unit and its key ideas
- factual, conceptual and debatable questions
- ATL skills
- assessment criteria A–D
- a practical unit note

Edit the wording in `_build/src/08_myp_notes.js`.

## Math Sprint game

Open **Math Sprint** from the sidebar or the home page. Choose mixed topics or one unit, then answer as many questions as possible in 60 seconds.

- Correct answers add points and 2 seconds
- Consecutive correct answers build a combo up to ×5
- Best scores are saved per topic on the device
- The end screen reviews missed questions with worked solutions

## Rebuild after editing

From this folder:

```bash
python3 _build/build.py
```

The build concatenates the source files into `myp1_maths_practice.html` and checks for duplicate skill ids. Copy the result over `index.html` to publish the update (or rename the build output to `index.html` before uploading).

## Folder structure

```
myp1-ib-maths-practice/
├── index.html                   ← the finished site (GitHub Pages entry point)
├── etonhouse_logo.png           ← used only when rebuilding
├── README.md
├── .nojekyll                    ← tells GitHub Pages not to run Jekyll
└── _build/
    ├── build.py
    ├── template.html
    └── src/
        ├── 01_core.js
        ├── 02_units_number.js
        ├── 03_fractions_decimals.js
        ├── 04_integers_ratio_percent.js
        ├── 05_expressions_equations.js
        ├── 06_geometry_measure.js
        ├── 07_data_probability.js
        ├── 08_myp_notes.js
        ├── 09_app.js
        └── styles.css
```

## Adding a skill

Add a skill inside the relevant unit file in `_build/src/`:

```js
S('unit-id', 'unique-skill-id', 'Skill name', r => {
  const a = RI(r, 2, 9);
  return {
    q: 'Calculate <strong>' + a + ' + 1</strong>.',
    type: 'num',
    a: a + 1,
    sol: a + ' + 1 = <strong>' + (a + 1) + '</strong>.'
  };
}, 'A short hint shown under “Hint”.');
```

The skill id is automatically prefixed with the unit id. Supported answer types: `num`, `frac`, `choice`, `text`, `point`, `ratio`, `pf`.

## Notes

- `S()` registers a skill; `U()` registers a unit.
- Mastery = 8 first-try correct answers in a row. A wrong answer resets the run.
- MYP notes are departmental planning prompts, not official IB publications. Always check them against your school’s MYP unit planner and the current IB Mathematics guide.
