/* ============================================================
   App shell, routing, progress and practice engine
   ============================================================ */

const STORE_KEY = 'etx-myp1-maths-v1';
const MASTERY_STREAK = 8;
const SESSION_LEN = 15;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const SKILL_MAP = {};
SKILLS.forEach(s => { SKILL_MAP[s.id] = s; });
const UNIT_MAP = {};
UNITS.forEach(u => { UNIT_MAP[u.id] = u; });

/* ---------- storage ---------- */
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        s.skills = s.skills || {};
        s.xp = s.xp || 0;
        s.gameBest = s.gameBest || {};
        return s;
      }
    }
  } catch (e) { /* ignore */ }
  return { skills: {}, xp: 0, sessions: 0, lastSkill: null, dayStreak: 0, lastDay: null, gameBest: {} };
}
let store = loadStore();
store.gameBest = store.gameBest || {};
function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
}
function stateOf(id) {
  if (!store.skills[id]) store.skills[id] = { a: 0, c: 0, s: 0, b: 0, m: false };
  return store.skills[id];
}
function isMastered(id) { return !!stateOf(id).m; }
function progressOf(id) {
  const st = stateOf(id);
  if (st.m) return 100;
  return Math.min(100, Math.round(((st.s || 0) / MASTERY_STREAK) * 100));
}
function masteredCount() { return SKILLS.filter(s => isMastered(s.id)).length; }
function unitSkills(uid) { return SKILLS.filter(s => s.unit === uid); }
function unitProgress(uid) {
  const list = unitSkills(uid);
  const n = list.filter(s => isMastered(s.id)).length;
  return { done: n, total: list.length, pct: list.length ? Math.round(n / list.length * 100) : 0 };
}
function localDay(offset) {
  const d = new Date();
  if (offset) d.setDate(d.getDate() + offset);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function touchDay() {
  const today = localDay(0);
  if (store.lastDay !== today) {
    const y = localDay(-1);
    store.dayStreak = store.lastDay === y ? (store.dayStreak || 0) + 1 : 1;
    store.lastDay = today;
    saveStore();
  }
}

/* ---------- helpers ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function ix(n) { return String(n).padStart(2, '0'); }
function ringSVG(pct, size, stroke, color) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return '<svg class="ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-opacity=".15" stroke-width="' + stroke + '"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
    '</svg>';
}

/* ---------- session ---------- */
let session = null;
let selectedChoice = null;

function seedQ(skill, seed) {
  let q = null;
  for (let t = 0; t < 8; t++) {
    try {
      q = skill.gen(makeRng((seed + t * 7919) >>> 0));
    } catch (e) { q = null; }
    if (q && q.q && q.type) break;
  }
  if (!q) {
    q = { q: 'Which number is <strong>7 + 5</strong>?', type: 'num', a: 12, sol: '7 + 5 = 12.' };
  }
  q.skillId = skill.id;
  return q;
}

function makeSession(ids, mode, title) {
  const base = (Date.now() % 1000000007) + Math.floor(Math.random() * 100000);
  const questions = [];
  for (let i = 0; i < SESSION_LEN; i++) {
    const id = ids[i % ids.length];
    questions.push(seedQ(SKILL_MAP[id], base + i * 104729 + Math.floor(Math.random() * 5000)));
  }
  session = {
    ids: ids.slice(), mode: mode, title: title, questions: questions,
    idx: 0, correct: 0, results: [], answered: false, lastOk: false,
    input: '', fracWhole: '', fracNum: '', fracDen: '', showHint: false, finished: false, xp: 0
  };
  selectedChoice = null;
}

function startSkill(id, silent) {
  const skill = SKILL_MAP[id];
  if (!skill) { navigate('#/home'); return; }
  makeSession(Array(SESSION_LEN).fill(id), 'skill', skill.name);
  store.lastSkill = id;
  saveStore();
  if (!silent) {
    renderNav();
    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
function startUnit(uid) {
  const ids = unitSkills(uid).map(s => s.id);
  if (!ids.length) return;
  makeSession(ids, 'unit', UNIT_MAP[uid].name);
  renderNav(); renderView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function startMix() {
  const weak = SKILLS.filter(s => !isMastered(s.id));
  const pool = weak.length ? weak : SKILLS;
  const ids = [];
  for (let i = 0; i < SESSION_LEN; i++) {
    ids.push(pool[Math.floor(Math.random() * pool.length)].id);
  }
  makeSession(ids, 'mix', 'Daily mix');
  renderNav(); renderView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function currentQ() { return session ? session.questions[session.idx] : null; }

function recordAnswer(q, ok) {
  const st = stateOf(q.skillId);
  st.a = (st.a || 0) + 1;
  if (ok) {
    st.c = (st.c || 0) + 1;
    st.s = (st.s || 0) + 1;
    st.b = Math.max(st.b || 0, st.s);
    if (st.s >= MASTERY_STREAK) st.m = true;
    store.xp = (store.xp || 0) + 10;
    session.xp += 10;
  } else {
    st.s = 0;
    store.xp = (store.xp || 0) + 2;
    session.xp += 2;
  }
  session.correct += ok ? 1 : 0;
  saveStore();
}

/* ---------- routing ---------- */
function navigate(hash) {
  if (location.hash === hash) { route(); }
  else { location.hash = hash; }
}
function route() {
  const h = (location.hash || '').replace(/^#\/?/, '');
  if (guide) closeGuide();
  if (sprint) stopSprint();
  document.body.classList.remove('nav-open');
  const root = document.documentElement;
  const prevBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = prevBehavior;
  if (h.indexOf('skill/') === 0) {
    const id = h.slice(6);
    if (SKILL_MAP[id]) { startSkill(id, true); renderNav(); renderView(); return; }
  }
  if (h.indexOf('unit/') === 0) {
    const id = h.slice(5);
    if (UNIT_MAP[id]) { renderNav(); renderUnit(id); return; }
  }
  if (h === 'mix') { startMix(); return; }
  if (h === 'game') { renderNav(); renderGameSetup(); return; }
  if (h === 'teacher') { renderNav(); renderTeacherNotes(); return; }
  renderNav(); renderHome();
}
window.addEventListener('hashchange', route);

/* ---------- shell ---------- */
function headerHTML() {
  return '<header class="topbar">' +
    '<div class="brand">' +
      '<img class="logo" src="__LOGO__" alt="EtonHouse International Education Group">' +
      '<div class="brand-text"><strong>MYP 1 Mathematics</strong><span>IB MYP · Year 7 practice</span></div>' +
    '</div>' +
    '<div class="topstats">' +
      '<span class="chip" id="stat-xp">0 XP</span>' +
      '<span class="chip" id="stat-mastered">0 mastered</span>' +
      '<span class="chip chip-streak" id="stat-streak">1-day streak</span>' +
    '</div>' +
    '<button class="menu-btn" data-action="menu" aria-label="Open menu">☰</button>' +
  '</header>';
}
function sidebarHTML() {
  return '<aside class="sidebar" id="sidebar"><div class="side-inner">' +
    '<label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Search skills…" autocomplete="off" aria-label="Search skills"></label>' +
    '<div id="search-results" class="search-results" hidden></div>' +
    '<nav class="nav">' +
      '<p class="nav-label">Learn</p>' +
      '<button class="nav-link" data-action="home"><span>⌂</span> Home</button>' +
      '<button class="nav-link" data-action="mix"><span>⚡</span> Daily mix</button>' +
      '<button class="nav-link" data-action="game"><span>🚀</span> Math Sprint</button>' +
      '<p class="nav-label">For teachers</p>' +
      '<button class="nav-link" data-action="teacher"><span>✎</span> IB MYP unit notes</button>' +
      '<p class="nav-label">Units</p>' +
      '<div id="nav-units"></div>' +
    '</nav>' +
    '<div class="side-foot">' +
      '<div class="overall"><span>Overall progress</span><strong id="side-pct">0%</strong></div>' +
      '<div class="bar"><i id="side-bar" style="width:0%"></i></div>' +
      '<button class="reset" data-action="reset">Reset progress</button>' +
    '</div>' +
  '</div></aside>' +
  '<div class="scrim" data-action="menu"></div>';
}
function mount() {
  touchDay();
  document.getElementById('app').innerHTML =
    headerHTML() + '<div class="shell">' + sidebarHTML() + '<main id="main" class="main"></main></div>';
  renderNav();
  route();
}

function renderNav() {
  const pct = SKILLS.length ? Math.round(masteredCount() / SKILLS.length * 100) : 0;
  const xp = document.getElementById('stat-xp');
  if (!xp) return;
  xp.textContent = (store.xp || 0).toLocaleString('en-US') + ' XP';
  document.getElementById('stat-mastered').textContent = masteredCount() + ' / ' + SKILLS.length + ' mastered';
  document.getElementById('stat-streak').textContent = (store.dayStreak || 1) + '-day streak';
  document.getElementById('side-pct').textContent = pct + '%';
  document.getElementById('side-bar').style.width = pct + '%';

  let nav = '';
  UNITS.forEach(u => {
    const p = unitProgress(u.id);
    nav += '<button class="nav-unit" data-action="unit" data-unit="' + u.id + '" style="--uc:' + u.color + '">' +
      '<span class="nu-glyph">' + u.glyph + '</span>' +
      '<span class="nu-text"><span class="nu-name">' + u.name + '</span>' +
      '<span class="nu-bar"><i style="width:' + p.pct + '%"></i></span></span>' +
      '<span class="nu-pct">' + p.pct + '%</span>' +
    '</button>';
  });
  document.getElementById('nav-units').innerHTML = nav;
}

/* ---------- home ---------- */
function renderHome() {
  const pct = SKILLS.length ? Math.round(masteredCount() / SKILLS.length * 100) : 0;
  const answered = SKILLS.reduce((n, s) => n + (stateOf(s.id).a || 0), 0);
  const last = store.lastSkill && SKILL_MAP[store.lastSkill];
  const lastUnit = last ? UNIT_MAP[last.unit] : null;

  let units = '';
  UNITS.forEach(u => {
    const p = unitProgress(u.id);
    units += '<article class="unit-card" style="--uc:' + u.color + '">' +
      '<div class="uc-top"><span class="uc-glyph">' + u.glyph + '</span><span class="uc-num">Unit ' + u.num + '</span></div>' +
      '<h3>' + u.name + '</h3>' +
      '<p>' + u.blurb + '</p>' +
      '<div class="uc-progress"><div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
      '<span>' + p.done + ' / ' + p.total + ' skills</span></div>' +
      '<button class="uc-open" data-action="unit" data-unit="' + u.id + '">Open unit <span>→</span></button>' +
    '</article>';
  });

  document.getElementById('main').innerHTML =
    '<section class="hero">' +
      '<div class="hero-copy">' +
        '<p class="eyebrow">IB MYP 1 · Year 7</p>' +
        '<h1>Build real confidence in maths.</h1>' +
        '<p class="hero-sub">A complete Year 7 course, rebuilt as ' + SKILLS.length + ' interactive skills across 14 teachable units. Fresh questions every time, worked solutions, and progress that saves on this device.</p>' +
        '<div class="hero-actions">' +
          '<button class="btn btn-primary" data-action="mix">Start daily mix <span>⚡</span></button>' +
          (last ? '<button class="btn btn-ghost" data-action="resume">Continue: ' + last.name + '</button>' : '') +
        '</div>' +
      '</div>' +
      '<div class="hero-ring">' +
        '<div class="ring-holder">' + ringSVG(pct, 132, 12, '#ffffff') + '<div class="ring-label"><strong>' + pct + '%</strong><span>mastered</span></div></div>' +
        '<p>' + masteredCount() + ' of ' + SKILLS.length + ' skills</p>' +
        (lastUnit ? '<p class="hero-last">Last unit: ' + lastUnit.name + '</p>' : '') +
      '</div>' +
    '</section>' +

    '<section class="stat-row">' +
      statCard('Skills mastered', masteredCount() + '<small> / ' + SKILLS.length + '</small>', '◆') +
      statCard('Questions answered', answered.toLocaleString('en-US'), '✎') +
      statCard('Experience points', (store.xp || 0).toLocaleString('en-US') + ' XP', '✦') +
      statCard('Daily streak', (store.dayStreak || 1) + ' day' + ((store.dayStreak || 1) === 1 ? '' : 's'), '☀') +
    '</section>' +

    '<section class="sprint-banner">' +
      '<div class="sprint-banner-copy">' +
        '<p class="eyebrow">Game mode</p>' +
        '<h2>Math Sprint</h2>' +
        '<p>60 seconds. Answer as many questions as you can, build a combo, and earn bonus time for every correct answer.</p>' +
      '</div>' +
      '<div class="sprint-banner-action">' +
        '<span class="sprint-best">Best mixed score: <strong>' + (store.gameBest.mix || 0).toLocaleString('en-US') + '</strong></span>' +
        '<button class="btn btn-primary" data-action="game">Play Math Sprint <span>🚀</span></button>' +
      '</div>' +
    '</section>' +

    '<section class="section-head">' +
      '<div><p class="eyebrow dark">The full map</p><h2>Fourteen units, one clear path</h2></div>' +
      '<p class="section-note">A complete path through the Year 7 course. Pick a unit, or let the daily mix choose for you. <button class="inline-link" data-action="teacher">IB MYP unit notes →</button></p>' +
    '</section>' +
    '<section class="unit-grid">' + units + '</section>' +
    '<footer class="page-foot">Built for MYP 1 · Year 7. Progress is stored only in this browser.</footer>';
  renderNav();
}

function statCard(label, value, glyph) {
  return '<div class="stat-card"><span class="sc-glyph">' + glyph + '</span><div><strong>' + value + '</strong><span>' + label + '</span></div></div>';
}

/* ---------- IB MYP unit notes ---------- */
function mypMeta(label, value) {
  return '<div><span>' + label + '</span><strong>' + value + '</strong></div>';
}
function criteriaText(list) {
  return list.map(c => c + ' — ' + MYP_CRITERIA[c]).join('<br>');
}
function mypPanelHTML(u) {
  const n = MYP_NOTES[u.id];
  if (!n) return '';
  return '<section class="myp-panel" style="--uc:' + u.color + '">' +
    '<div class="mp-head"><div><p class="eyebrow dark">IB MYP connection</p><h2>Unit note</h2></div>' +
    '<button class="inline-link" data-action="teacher">All unit notes →</button></div>' +
    '<div class="mp-grid">' +
      mypMeta('Key concept', n.key) +
      mypMeta('Related concepts', n.related.join(' · ')) +
      mypMeta('Global context', n.global) +
      mypMeta('ATL skills', n.atl.join(' · ')) +
      mypMeta('Assessment criteria', criteriaText(n.criteria)) +
    '</div>' +
    '<p class="mp-overview"><strong>Explanation</strong>' + n.explanation + '</p>' +
    '<p class="mp-soi"><strong>Statement of inquiry</strong>' + n.soi + '</p>' +
    '<p class="mp-note"><strong>Unit note</strong>' + n.note + '</p>' +
  '</section>';
}
function renderTeacherNotes() {
  let cards = '';
  UNITS.forEach(u => {
    const n = MYP_NOTES[u.id];
    cards += '<article class="myp-card" id="myp-' + u.id + '" style="--uc:' + u.color + '">' +
      '<header class="mc-head">' +
        '<span class="mc-glyph">' + u.glyph + '</span>' +
        '<div class="mc-title"><p class="eyebrow dark">Unit ' + u.num + '</p><h2>' + u.name + '</h2></div>' +
        '<span class="mc-key">Key concept · ' + n.key + '</span>' +
      '</header>' +
      '<div class="mc-grid">' +
        mypMeta('Related concepts', n.related.join(' · ')) +
        mypMeta('Global context', n.global) +
        mypMeta('ATL skills', n.atl.join(' · ')) +
        mypMeta('Assessment criteria', criteriaText(n.criteria)) +
      '</div>' +
      '<div class="mc-explanation"><strong>Explanation</strong>' +
        '<p>' + n.explanation + '</p>' +
        '<div class="mc-keyideas"><b>Key ideas</b><ul>' + n.keyIdeas.map(k => '<li>' + k + '</li>').join('') + '</ul></div>' +
      '</div>' +
      '<p class="mc-soi"><span>Statement of inquiry</span>' + n.soi + '</p>' +
      '<div class="mc-questions">' +
        '<p><b>Factual</b>' + n.factual + '</p>' +
        '<p><b>Conceptual</b>' + n.conceptual + '</p>' +
        '<p><b>Debatable</b>' + n.debatable + '</p>' +
      '</div>' +
      '<div class="mc-note"><strong>Unit note</strong><p>' + n.note + '</p></div>' +
    '</article>';
  });
  const legend = Object.keys(MYP_CRITERIA).map(k => '<span><b>' + k + '</b> ' + MYP_CRITERIA[k] + '</span>').join('');
  document.getElementById('main').innerHTML =
    '<button class="back" data-action="home">← Home</button>' +
    '<section class="teacher-hero">' +
      '<p class="eyebrow">IB Middle Years Programme · Mathematics</p>' +
      '<h1>Unit notes &amp; MYP alignment</h1>' +
      '<p>Every unit includes a written explanation and key ideas, plus an MYP key concept, related concepts, a global context, a statement of inquiry, inquiry questions, ATL skills and assessment criteria.</p>' +
      '<div class="criteria-legend">' + legend + '</div>' +
    '</section>' +
    '<div class="teacher-intro">' +
      '<div><h2>Plan with the MYP in mind</h2><p>Use the statement of inquiry to shape the unit’s conceptual focus, then select related concepts and a global context that make the mathematics meaningful.</p></div>' +
      '<div><h2>Teach through inquiry</h2><p>Use the factual, conceptual and debatable questions to move students from recall to explanation and critique. The ATL focus suggests skills to model explicitly.</p></div>' +
      '<div><h2>Assess with criteria</h2><p>Match formative and summative tasks to Criteria A–D. The suggested criteria show where each unit naturally provides evidence.</p></div>' +
    '</div>' +
    '<div class="teacher-disclaimer"><strong>Planning note</strong><span>These are departmental planning prompts, not official IB publications. Always refer to your school’s MYP unit planner and the current IB Mathematics guide.</span></div>' +
    '<section class="myp-cards">' + cards + '</section>' +
    '<footer class="page-foot">Built for MYP 1 · Year 7. Unit notes are planning prompts for departmental use.</footer>';
  renderNav();
}

/* ---------- unit view ---------- */
function renderUnit(uid) {
  const u = UNIT_MAP[uid];
  if (!u) { renderHome(); return; }
  const list = unitSkills(uid);
  const p = unitProgress(uid);
  let rows = '';
  list.forEach((s, i) => {
    const st = stateOf(s.id);
    const pr = progressOf(s.id);
    const status = st.m ? 'Mastered' : st.s > 0 ? 'In progress · ' + st.s + ' correct in a row' : st.a > 0 ? 'Practised · keep going' : 'Not started';
    rows += '<div class="skill-row">' +
      '<button class="sr-open" data-action="skill" data-id="' + s.id + '">' +
        '<span class="sr-idx">' + ix(i + 1) + '</span>' +
        '<span class="sr-main"><span class="sr-name">' + s.name + '</span><span class="sr-status">' + status + '</span></span>' +
        '<span class="sr-progress"><span class="bar"><i style="width:' + pr + '%"></i></span><span class="sr-pct">' + pr + '%</span></span>' +
        '<span class="sr-arrow">→</span>' +
      '</button>' +
      '<div class="sr-tools">' +
        '<button class="sr-tool" data-action="guide" data-id="' + s.id + '" data-mode="explain" aria-label="Explain: ' + s.name + '">Explain</button>' +
        '<button class="sr-tool sr-tool-play" data-action="guide" data-id="' + s.id + '" data-mode="animate" aria-label="▶ Animate: ' + s.name + '">▶ Animate</button>' +
      '</div>' +
    '</div>';
  });

  document.getElementById('main').innerHTML =
    '<div class="unit-hero" style="--uc:' + u.color + '">' +
      '<button class="back" data-action="home">← All units</button>' +
      '<div class="uh-row"><span class="uh-glyph">' + u.glyph + '</span><div>' +
        '<p class="eyebrow light">Unit ' + u.num + '</p>' +
        '<h1>' + u.name + '</h1>' +
        '<p class="uh-blurb">' + u.blurb + '</p>' +
      '</div></div>' +
      '<div class="uh-foot"><div class="uh-progress"><div class="bar"><i style="width:' + p.pct + '%"></i></div><span>' + p.done + ' of ' + p.total + ' skills mastered</span></div>' +
      '<button class="btn btn-light" data-action="unit-practice" data-unit="' + u.id + '">Practise this unit</button></div>' +
    '</div>' +
    mypPanelHTML(u) +
    '<div class="skill-list-head"><h2>' + list.length + ' skills in this unit</h2><p>Tap a skill to practise, <strong>Explain</strong> for the method, or <strong>▶ Animate</strong> for a step-by-step walkthrough.</p></div>' +
    '<section class="skill-list">' + rows + '</section>' +
    '<div class="unit-tip"><strong>How mastery works.</strong> Answer 8 questions correctly in a row — without a wrong answer — and the skill turns gold. A wrong answer resets the run, but your XP and practice history stay.</div>';
  renderNav();
}

/* ---------- skill guide: explanation + animated worked example ---------- */
let guide = null;
let guideRoot = null;
let guideSpeed = 4500;
try {
  const savedSpeed = Number(localStorage.getItem('etx-guide-speed'));
  if (savedSpeed) guideSpeed = savedSpeed;
} catch (e) { /* ignore */ }

function guideSeed() {
  return (Date.now() + Math.floor(Math.random() * 100000)) >>> 0;
}
function guideSteps(skill, q) {
  const steps = [
    { label: 'Question', html: q.q },
    { label: 'Method', html: skill.hint || 'Read the question, choose a method, then work step by step.' }
  ];
  const lines = String(q.sol || '').split(/<br\s*\/?>/i).map(function (s) { return s.trim(); }).filter(Boolean);
  lines.forEach(function (line, i) {
    steps.push({ label: 'Step ' + (i + 1), html: line });
  });
  steps.push({ label: 'Answer', html: '<strong>' + answerDisplay(q) + '</strong>' });
  return steps;
}
function ensureModalRoot() {
  if (!guideRoot) {
    guideRoot = document.getElementById('modal-root');
    if (!guideRoot) {
      guideRoot = document.createElement('div');
      guideRoot.id = 'modal-root';
      document.body.appendChild(guideRoot);
    }
  }
  return guideRoot;
}
function openGuide(id, mode, existingQ) {
  const skill = SKILL_MAP[id];
  if (!skill) return;
  const q = existingQ || seedQ(skill, guideSeed());
  guide = {
    skill: skill, q: q, steps: guideSteps(skill, q), index: 0,
    tab: mode === 'animate' ? 'animate' : 'explain',
    playing: false, timer: null, speed: guideSpeed, returnFocus: document.activeElement
  };
  document.body.classList.add('modal-open');
  if (guide.tab === 'animate') startGuidePlay();
  else renderGuide();
  setTimeout(function () { const x = document.querySelector('.modal-x'); if (x) x.focus(); }, 40);
}
function renderGuide() {
  if (!guide) return;
  const root = ensureModalRoot();
  const u = UNIT_MAP[guide.skill.unit];
  const n = MYP_NOTES[u.id];
  const speeds = [[6000, 'Very slow'], [4500, 'Slow'], [3000, 'Normal'], [2200, 'Fast']];
  const speedSelect = '<label class="guide-speed"><span>Speed</span><select id="guide-speed" aria-label="Animation speed">' +
    speeds.map(function (s) { return '<option value="' + s[0] + '"' + (guide.speed === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') +
  '</select></label>';
  const tabs = '<div class="guide-tabs">' +
    '<button class="guide-tab ' + (guide.tab === 'explain' ? 'active' : '') + '" data-action="guide-tab" data-tab="explain">Explanation</button>' +
    '<button class="guide-tab ' + (guide.tab === 'animate' ? 'active' : '') + '" data-action="guide-tab" data-tab="animate">Animated task</button>' +
  '</div>';
  let body = '';
  if (guide.tab === 'explain') {
    const keyIdeas = n && n.keyIdeas
      ? '<div class="guide-keyideas"><strong>Key ideas from this unit</strong><ul>' + n.keyIdeas.map(function (k) { return '<li>' + k + '</li>'; }).join('') + '</ul></div>'
      : '';
    body = '<div class="guide-about"><strong>What this guide covers</strong><p>This guide focuses on <strong>' + guide.skill.name.toLowerCase() + '</strong> within ' + u.name + '. ' +
      (n ? n.explanation : '') + ' Use the method below, then follow the animated example.</p></div>' +
      '<div class="guide-method"><strong>Method</strong><p>' + (guide.skill.hint || 'Follow the worked example step by step.') + '</p></div>' +
      keyIdeas +
      '<div class="guide-example"><p class="guide-label">Worked example</p>' +
        '<div class="guide-q">' + guide.q.q + '</div>' +
        '<div class="guide-sol">' + (guide.q.sol || '') + '</div>' +
        '<p class="guide-answer">Answer: <strong>' + answerDisplay(guide.q) + '</strong></p>' +
      '</div>' +
      '<div class="guide-actions">' +
        '<button class="guide-btn primary" data-action="guide-tab" data-tab="animate">▶ Play animated task</button>' +
        '<button class="guide-btn" data-action="guide-new">New example</button>' +
        '<button class="guide-btn" data-action="guide-practice">Practise this skill →</button>' +
      '</div>';
  } else {
    const step = guide.steps[guide.index];
    const last = guide.index >= guide.steps.length - 1;
    const dots = guide.steps.map(function (s, i) {
      return '<span class="guide-dot ' + (i < guide.index ? 'done' : i === guide.index ? 'now' : '') + '"></span>';
    }).join('');
    body = '<div class="guide-player">' +
      '<div class="guide-step-label">Step ' + (guide.index + 1) + ' of ' + guide.steps.length + ' · ' + step.label + '</div>' +
      '<div class="guide-step" aria-live="polite">' + step.html + '</div>' +
      '<div class="guide-dots">' + dots + '</div>' +
      '<div class="guide-controls">' +
        '<button class="guide-btn" data-action="guide-prev"' + (guide.index === 0 ? ' disabled' : '') + '>← Back</button>' +
        '<button class="guide-btn primary" data-action="guide-play">' + (guide.playing ? 'Pause' : (last ? 'Replay' : 'Play')) + '</button>' +
        '<button class="guide-btn" data-action="guide-next"' + (last ? ' disabled' : '') + '>Next →</button>' +
        '<button class="guide-btn" data-action="guide-new">New example</button>' +
        '<button class="guide-btn" data-action="guide-practice">Practise this skill →</button>' +
        speedSelect +
      '</div>' +
      '<p class="guide-meta"><span>A fresh example each time</span><span>' + guide.steps.length + ' steps</span></p>' +
    '</div>';
  }
  root.innerHTML = '<div class="modal-scrim"><div class="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">' +
    '<button class="modal-x" data-action="close-guide" aria-label="Close guide">×</button>' +
    '<p class="eyebrow dark">Unit ' + u.num + ' · ' + u.name + '</p>' +
    '<h2 id="guide-title">' + guide.skill.name + '</h2>' +
    tabs + body +
  '</div></div>';
}
function stopGuideTimer() {
  if (guide && guide.timer) { clearInterval(guide.timer); guide.timer = null; }
}
function guideTick() {
  if (!guide) return;
  if (guide.index < guide.steps.length - 1) {
    guide.index++;
    renderGuide();
  } else {
    pauseGuide();
  }
}
function startGuideTimer() {
  if (!guide) return;
  stopGuideTimer();
  guide.timer = setInterval(guideTick, guide.speed || 4500);
}
function startGuidePlay() {
  if (!guide) return;
  stopGuideTimer();
  if (guide.index >= guide.steps.length - 1) guide.index = 0;
  guide.tab = 'animate';
  guide.playing = true;
  renderGuide();
  startGuideTimer();
}
function pauseGuide() {
  if (!guide) return;
  guide.playing = false;
  stopGuideTimer();
  renderGuide();
}
function guideStep(delta) {
  if (!guide) return;
  stopGuideTimer();
  guide.playing = false;
  guide.index = Math.max(0, Math.min(guide.steps.length - 1, guide.index + delta));
  renderGuide();
}
function closeGuide() {
  stopGuideTimer();
  const returnFocus = guide && guide.returnFocus;
  guide = null;
  document.body.classList.remove('modal-open');
  if (guideRoot) guideRoot.innerHTML = '';
  if (returnFocus && returnFocus.focus) { try { returnFocus.focus(); } catch (e) { /* ignore */ } }
}
function newGuideExample() {
  if (!guide) return;
  const wasPlaying = guide.playing;
  stopGuideTimer();
  guide.q = seedQ(guide.skill, guideSeed());
  guide.steps = guideSteps(guide.skill, guide.q);
  guide.index = 0;
  guide.playing = false;
  if (wasPlaying || guide.tab === 'animate') startGuidePlay();
  else renderGuide();
}

/* ---------- practice view ---------- */
function practiceHeaderHTML() {
  const q = currentQ();
  const skill = SKILL_MAP[q.skillId];
  const u = UNIT_MAP[skill.unit];
  const back = session.mode === 'skill' ? '<button class="back" data-action="back-unit" data-unit="' + u.id + '">← ' + u.name + '</button>'
    : '<button class="back" data-action="home">← Home</button>';
  return '<div class="practice-top">' + back +
    '<span class="practice-mode">' + (session.mode === 'mix' ? 'Daily mix' : session.mode === 'unit' ? 'Unit practice' : 'Skill practice') + '</span>' +
    '<span class="q-count">Question <strong>' + (session.idx + 1) + '</strong> of ' + session.questions.length + '</span>' +
    '<span class="q-score">✓ ' + session.correct + '</span>' +
  '</div>';
}
function dotsHTML() {
  let s = '<div class="dots">';
  for (let i = 0; i < session.questions.length; i++) {
    let cls = 'dot';
    if (i < session.idx) cls += session.results[i] ? ' ok' : ' no';
    if (i === session.idx && !session.finished) cls += ' now';
    s += '<span class="' + cls + '"></span>';
  }
  return s + '</div>';
}
function fractionResponse() {
  const w = String(session.fracWhole || '').trim();
  const n = String(session.fracNum || '').trim();
  const d = String(session.fracDen || '').trim();
  if (!n || !d) return null;
  if (!Number(d)) return null;
  if (w && Number(w) !== 0) return w + ' ' + n + '/' + d;
  return n + '/' + d;
}
function fractionAnswerHTML(q) {
  const disabled = session.answered ? ' disabled' : '';
  const suffix = q.unit ? '<span class="unit-suffix">' + q.unit + '</span>' : '';
  if (q.a.d === 1) {
    return '<div class="answer-row"><input id="answer" class="answer-input" type="text" inputmode="numeric" aria-label="Whole number answer" autocomplete="off" spellcheck="false" placeholder="Whole number" value="' + esc(session.input) + '"' + disabled + '>' + suffix + '</div>';
  }
  const mp = mixedParts(q.a);
  const showWhole = !!q.display && mp.whole !== 0;
  let h = '<div class="frac-answer">';
  if (showWhole) {
    h += '<input id="frac-whole" class="whole-input" type="text" inputmode="numeric" aria-label="Whole number" autocomplete="off" spellcheck="false" placeholder="whole" value="' + esc(session.fracWhole) + '"' + disabled + '>';
  }
  h += '<div class="frac-input-box">' +
    '<input id="frac-num" class="frac-part" type="text" inputmode="numeric" aria-label="Numerator" autocomplete="off" spellcheck="false" placeholder="?" value="' + esc(session.fracNum) + '"' + disabled + '>' +
    '<span class="frac-input-line"></span>' +
    '<input id="frac-den" class="frac-part" type="text" inputmode="numeric" aria-label="Denominator" autocomplete="off" spellcheck="false" placeholder="?" value="' + esc(session.fracDen) + '"' + disabled + '>' +
  '</div>' + suffix + '</div>';
  return h;
}
function answerAreaHTML(q) {
  if (q.type === 'choice') {
    let s = '<div class="choice-grid">';
    q.choices.forEach((c, i) => {
      const sel = selectedChoice === i ? ' sel' : '';
      s += '<button class="choice' + sel + '" data-action="choose" data-i="' + i + '"' + (session.answered ? ' disabled' : '') + '>' +
        '<span class="choice-key">' + String.fromCharCode(65 + i) + '</span><span class="choice-body">' + c + '</span></button>';
    });
    return s + '</div>';
  }
  if (q.type === 'frac') return fractionAnswerHTML(q);
  const ph = q.type === 'point' ? '(x, y)' : q.type === 'ratio' ? 'a : b' : q.type === 'pf' ? 'e.g. 2^3 × 3' : q.type === 'text' ? 'e.g. 5^3' : 'Your answer';
  const unit = q.unit ? '<span class="unit-suffix">' + q.unit + '</span>' : '';
  return '<div class="answer-row"><input id="answer" class="answer-input" type="text" aria-label="Your answer" inputmode="' + (q.type === 'text' || q.type === 'pf' || q.type === 'ratio' || q.type === 'point' ? 'text' : 'decimal') + '"' +
    ' autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + ph + '" value="' + esc(session.input) + '"' + (session.answered ? ' disabled' : '') + '>' + unit + '</div>';
}
function practiceHTML() {
  const q = currentQ();
  const skill = SKILL_MAP[q.skillId];
  const u = UNIT_MAP[skill.unit];
  let feedback = '';
  if (session.answered) {
    feedback = '<div class="feedback ' + (session.lastOk ? 'ok' : 'no') + '" role="status">' +
      '<div class="fb-head"><span class="fb-icon">' + (session.lastOk ? '✓' : '✕') + '</span>' +
      '<strong>' + (session.lastOk ? 'Correct!' : 'Not quite.') + '</strong>' +
      '<span class="fb-xp">+' + (session.lastOk ? 10 : 2) + ' XP</span></div>' +
      (session.lastOk ? '' : '<p class="fb-correct">Correct answer: <strong>' + answerDisplay(q) + '</strong></p>') +
      '<div class="solution">' + (q.sol || '') + '</div>' +
    '</div>';
  } else if (session.showHint) {
    feedback = '<div class="hint-box"><strong>Hint</strong><p>' + (q.hint || skill.hint || 'Break the problem into smaller steps.') + '</p></div>';
  }
  const guideBtn = '<button class="btn btn-ghost" data-action="guide-current" data-mode="explain">Explain</button>' +
    '<button class="btn btn-ghost" data-action="guide-current" data-mode="animate">▶ Animate</button>';
  const actions = session.answered
    ? '<button class="btn btn-primary" data-action="next">' + (session.idx === session.questions.length - 1 ? 'See results' : 'Next question') + ' <span>→</span></button>' + guideBtn
    : '<button class="btn btn-primary" data-action="check">Check answer</button>' +
      '<button class="btn btn-ghost" data-action="hint">' + (session.showHint ? 'Hide hint' : 'Hint') + '</button>' + guideBtn;

  document.getElementById('main').innerHTML = practiceHeaderHTML() +
    '<div class="practice-wrap">' +
      '<section class="practice-card">' +
        dotsHTML() +
        '<div class="q-meta"><span class="q-unit" style="--uc:' + u.color + '">Unit ' + u.num + ' · ' + u.short + '</span><span class="q-skill">' + skill.name + '</span></div>' +
        '<div class="question">' + q.q + '</div>' +
        answerAreaHTML(q) +
        feedback +
        '<div class="practice-actions">' + actions + '</div>' +
      '</section>' +
      '<aside class="practice-side">' +
        '<div class="streak-card"><span class="sc-glyph">✦</span><div><strong>' + session.correct + ' / ' + session.questions.length + '</strong><span>correct this set</span></div></div>' +
        '<div class="tip-card"><h4>Mastery target</h4><p>Answer <strong>' + MASTERY_STREAK + ' in a row</strong> correctly to master a skill. Wrong answers reset the run — but not your XP.</p><div class="bar"><i style="width:' + progressOf(skill.id) + '%"></i></div></div>' +
        '<div class="tip-card soft"><h4>Need a reminder?</h4><p>' + (skill.hint || 'Read the question carefully and identify what is being asked.') + '</p></div>' +
      '</aside>' +
    '</div>';
  focusAnswer();
}
function focusAnswer() {
  if (session.answered) return;
  const el = document.getElementById('frac-whole') || document.getElementById('frac-num') || document.getElementById('answer');
  if (el) setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }, 30);
}

/* ---------- summary ---------- */
function renderSummary() {
  const total = session.questions.length;
  const pct = Math.round(session.correct / total * 100);
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
  const skill = session.mode === 'skill' ? SKILL_MAP[session.ids[0]] : null;
  const mastered = skill ? isMastered(skill.id) : false;
  const thirdValue = skill ? (mastered ? 'Mastered' : progressOf(skill.id) + '%') : String(new Set(session.ids).size);
  const thirdLabel = skill ? (mastered ? 'skill complete' : 'toward mastery') : 'skills practised';
  let starHTML = '';
  for (let i = 0; i < 3; i++) starHTML += '<span class="star ' + (i < stars ? 'on' : '') + '">★</span>';
  let actions = '<button class="btn btn-primary" data-action="again">Practise again</button>';
  if (session.mode === 'skill') {
    actions += '<button class="btn btn-ghost" data-action="next-skill">Next skill →</button>';
    actions += '<button class="btn btn-ghost" data-action="back-unit" data-unit="' + UNIT_MAP[skill.unit].id + '">Back to unit</button>';
  } else {
    actions += '<button class="btn btn-ghost" data-action="home">Back to home</button>';
  }
  document.getElementById('main').innerHTML =
    '<section class="summary">' +
      '<div class="summary-stars">' + starHTML + '</div>' +
      '<p class="eyebrow dark">Set complete</p>' +
      '<h1>' + (pct >= 70 ? 'Strong work!' : pct >= 50 ? 'Good effort — keep going.' : 'Every attempt builds skill.') + '</h1>' +
      '<p class="summary-sub">' + (session.mode === 'skill' ? skill.name : session.mode === 'unit' ? 'Unit practice' : 'Daily mix') + '</p>' +
      '<div class="summary-ring">' + ringSVG(pct, 150, 14, '#db3832') + '<div class="ring-label"><strong>' + pct + '%</strong><span>accuracy</span></div></div>' +
      '<div class="summary-stats">' +
        '<div><strong>' + session.correct + ' / ' + total + '</strong><span>correct first time</span></div>' +
        '<div><strong>+' + session.xp + '</strong><span>XP earned</span></div>' +
        '<div><strong>' + thirdValue + '</strong><span>' + thirdLabel + '</span></div>' +
      '</div>' +
      '<div class="summary-actions">' + actions + '</div>' +
      '<p class="summary-note">' + (session.correct === total ? 'Perfect set. ' : '') + 'Aim for 8 correct in a row to master this skill.</p>' +
    '</section>';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Math Sprint game ---------- */
let sprint = null;
let sprintTimer = null;

function gameFracText(f, q) {
  const body = q.display && mixedParts(f).whole !== 0 ? mixedHTML(f) : fHTML(f);
  return body + (q.unit ? ' ' + q.unit : '');
}
function gameChoices(q, skill, rng) {
  if (q.type === 'choice') {
    const opts = q.choices.map(function (html, i) { return { html: html, ok: i === q.a }; });
    const sh = shuffle(rng, opts);
    return { options: sh.map(function (o) { return o.html; }), correctIndex: sh.findIndex(function (o) { return o.ok; }) };
  }
  const correct = answerDisplay(q);
  const wrongs = [];
  if (q.type === 'num') {
    const v = q.a, u = q.unit ? ' ' + q.unit : '';
    [1, 2, 3, 5, 10, 0.1, 0.5].forEach(function (d) {
      const up = round(v + d, 2), down = round(v - d, 2);
      if (v < 0 || up > 0) wrongs.push(fmt(up) + u);
      if (v < 0 || down > 0) wrongs.push(fmt(down) + u);
    });
    wrongs.push(fmt(round(v * 2, 2)) + u, fmt(round(v / 2, 2)) + u);
  } else if (q.type === 'frac') {
    const f = q.a;
    [F(f.n + 1, f.d), F(f.n, f.d + 1), F(f.n + 1, f.d + 1), F(f.n - 1, f.d), F(f.n, f.d - 1 || 1), F(f.n * 2, f.d), F(f.n, f.d * 2)].forEach(function (g) {
      if (Math.abs(fval(g) - fval(f)) > 1e-9) wrongs.push(gameFracText(g, q));
    });
  } else if (q.type === 'point') {
    const p = q.a;
    [[p[0] + 1, p[1]], [p[0], p[1] + 1], [p[0] - 1, p[1]], [p[0], p[1] - 1], [p[0] + 2, p[1]], [p[0], p[1] + 2]].forEach(function (a) {
      wrongs.push('(' + a[0] + ', ' + a[1] + ')');
    });
  } else if (q.type === 'ratio') {
    const r = q.a;
    [[r.a + 1, r.b], [r.a, r.b + 1], [r.a + 1, r.b + 1], [r.b, r.a], [r.a * 2, r.b], [r.a, r.b * 2]].forEach(function (a) {
      wrongs.push(a[0] + ':' + a[1]);
    });
  }
  for (let i = 0; i < 10 && wrongs.length < 10; i++) {
    const alt = seedQ(skill, (Date.now() + i * 7919 + Math.floor(Math.random() * 1000000)) >>> 0);
    const txt = answerDisplay(alt);
    if (txt !== correct) wrongs.push(txt);
  }
  if (wrongs.length < 3) wrongs.push('None of these', 'Cannot be determined', 'Not enough information');
  const uniq = [];
  wrongs.forEach(function (w) {
    const s = String(w);
    if (s !== String(correct) && uniq.indexOf(s) === -1) uniq.push(s);
  });
  const fallbacks = ['None of these', 'Cannot be determined', 'Not enough information'];
  while (uniq.length < 3) {
    const f = fallbacks[uniq.length] || 'Not enough information';
    uniq.push(uniq.indexOf(f) === -1 ? f : f + ' ');
  }
  const options = shuffle(rng, [String(correct)].concat(shuffle(rng, uniq).slice(0, 3)));
  return { options: options, correctIndex: options.indexOf(String(correct)) };
}
function startSprint(unitId) {
  stopSprint();
  const pool = unitId === 'mix' ? SKILLS.slice() : unitSkills(unitId);
  if (!pool.length) { renderGameSetup(); return; }
  sprint = {
    unitId: unitId, pool: pool, score: 0, combo: 1, bestCombo: 1,
    correct: 0, attempts: 0, timeLeft: 60, running: true, locked: false,
    missed: [], lastSkill: null, current: null, finished: false
  };
  nextSprintQuestion();
  sprintTimer = setInterval(sprintTick, 1000);
}
function stopSprint() {
  if (sprintTimer) { clearInterval(sprintTimer); sprintTimer = null; }
  sprint = null;
}
function sprintTick() {
  if (!sprint || !sprint.running) return;
  sprint.timeLeft--;
  if (sprint.timeLeft <= 0) {
    sprint.timeLeft = 0;
    updateSprintHUD();
    endSprint();
    return;
  }
  updateSprintHUD();
}
function updateSprintHUD() {
  if (!sprint) return;
  const setText = function (id, val) { const e = document.getElementById(id); if (e) e.textContent = val; };
  setText('sprint-score', sprint.score.toLocaleString('en-US'));
  setText('sprint-time', sprint.timeLeft);
  const combo = document.getElementById('sprint-combo');
  if (combo) {
    combo.textContent = 'Combo ×' + sprint.combo;
    combo.classList.toggle('hot', sprint.combo > 1);
  }
  const timebar = document.getElementById('sprint-timebar');
  if (timebar) timebar.style.width = (sprint.timeLeft / 60 * 100) + '%';
  const timer = document.getElementById('sprint-timer');
  if (timer) timer.classList.toggle('low', sprint.timeLeft <= 10);
  const fillPct = Math.min(100, Math.round(sprint.score / 1500 * 100));
  const rocketPct = Math.min(98, Math.max(2, fillPct));
  const fill = document.getElementById('sprint-fill');
  if (fill) fill.style.width = fillPct + '%';
  const rocket = document.getElementById('sprint-rocket');
  if (rocket) rocket.style.left = rocketPct + '%';
}
function nextSprintQuestion() {
  if (!sprint || !sprint.running) return;
  let skill = pick(Math.random, sprint.pool);
  if (sprint.pool.length > 1 && sprint.lastSkill) {
    let guard = 0;
    while (skill.id === sprint.lastSkill && guard++ < 10) skill = pick(Math.random, sprint.pool);
  }
  sprint.lastSkill = skill.id;
  const q = seedQ(skill, (Date.now() + Math.floor(Math.random() * 1000000000)) >>> 0);
  const choices = gameChoices(q, skill, makeRng((Date.now() + Math.floor(Math.random() * 1000000000)) >>> 0));
  sprint.current = { skill: skill, q: q, choices: choices };
  sprint.locked = false;
  renderSprintGame();
}
function renderSprintGame() {
  if (!sprint || !sprint.current) return;
  const cur = sprint.current;
  const u = UNIT_MAP[cur.skill.unit];
  const letters = 'ABCD';
  const buttons = cur.choices.options.map(function (html, i) {
    return '<button class="sprint-choice" data-action="game-answer" data-i="' + i + '"><span class="sc-key">' + letters[i] + '</span><span class="sc-body">' + html + '</span></button>';
  }).join('');
  const fillPct = Math.min(100, Math.round(sprint.score / 1500 * 100));
  const rocketPct = Math.min(98, Math.max(2, fillPct));
  document.getElementById('main').innerHTML =
    '<div class="sprint">' +
      '<div class="sprint-top">' +
        '<button class="back" data-action="game-quit">← Quit</button>' +
        '<span class="sprint-stat">Score <strong id="sprint-score">' + sprint.score + '</strong></span>' +
        '<span class="sprint-stat sprint-combo" id="sprint-combo">Combo ×' + sprint.combo + '</span>' +
        '<span class="sprint-stat sprint-timer" id="sprint-timer"><strong id="sprint-time">' + sprint.timeLeft + '</strong>s</span>' +
        '<button class="sprint-finish" data-action="game-finish">Finish</button>' +
      '</div>' +
      '<div class="sprint-timebar"><i id="sprint-timebar" style="width:' + (sprint.timeLeft / 60 * 100) + '%"></i></div>' +
      '<div class="sprint-track"><div class="sprint-fill" id="sprint-fill" style="width:' + fillPct + '%"></div><span class="sprint-rocket" id="sprint-rocket" style="left:' + rocketPct + '%">🚀</span></div>' +
      '<section class="sprint-card" id="sprint-card">' +
        '<p class="sprint-topic">' + u.name + ' · ' + cur.skill.name + '</p>' +
        '<div class="sprint-question">' + cur.q.q + '</div>' +
        '<div class="sprint-choices">' + buttons + '</div>' +
        '<div class="sprint-feedback" id="sprint-feedback" aria-live="polite"></div>' +
      '</section>' +
    '</div>';
  updateSprintHUD();
}
function answerSprint(i) {
  if (!sprint || sprint.locked || sprint.finished) return;
  sprint.locked = true;
  sprint.attempts++;
  const cur = sprint.current;
  const ok = i === cur.choices.correctIndex;
  const buttons = document.querySelectorAll('.sprint-choice');
  buttons.forEach(function (b, idx) {
    b.disabled = true;
    if (idx === cur.choices.correctIndex) b.classList.add('correct');
    else if (idx === i) b.classList.add('wrong');
  });
  const card = document.getElementById('sprint-card');
  if (card) card.classList.add(ok ? 'flash-ok' : 'flash-no');
  const fb = document.getElementById('sprint-feedback');
  if (ok) {
    const points = 100 * sprint.combo;
    sprint.score += points;
    sprint.correct++;
    sprint.timeLeft = Math.min(60, sprint.timeLeft + 2);
    sprint.combo = Math.min(5, sprint.combo + 1);
    sprint.bestCombo = Math.max(sprint.bestCombo, sprint.combo);
    if (fb) { fb.className = 'sprint-feedback ok'; fb.textContent = 'Correct! +' + points + ' points · +2 seconds'; }
    updateSprintHUD();
    setTimeout(function () { if (sprint && sprint.running) nextSprintQuestion(); }, 700);
  } else {
    sprint.combo = 1;
    sprint.missed.push({ skill: cur.skill, q: cur.q, answer: answerDisplay(cur.q) });
    if (fb) { fb.className = 'sprint-feedback no'; fb.innerHTML = 'Not quite. Correct answer: <strong>' + answerDisplay(cur.q) + '</strong>'; }
    updateSprintHUD();
    setTimeout(function () { if (sprint && sprint.running) nextSprintQuestion(); }, 1600);
  }
}
function endSprint() {
  if (!sprint) return;
  sprint.running = false;
  sprint.finished = true;
  if (sprintTimer) { clearInterval(sprintTimer); sprintTimer = null; }
  const best = store.gameBest[sprint.unitId] || 0;
  sprint.newBest = sprint.score > best;
  if (sprint.newBest) {
    store.gameBest[sprint.unitId] = sprint.score;
    saveStore();
  }
  renderSprintEnd();
}
function renderSprintEnd() {
  if (!sprint) return;
  const best = store.gameBest[sprint.unitId] || 0;
  const accuracy = sprint.attempts ? Math.round(sprint.correct / sprint.attempts * 100) : 0;
  const stars = sprint.score >= 1500 ? 3 : sprint.score >= 800 ? 2 : sprint.score >= 300 ? 1 : 0;
  let starHTML = '';
  for (let i = 0; i < 3; i++) starHTML += '<span class="star ' + (i < stars ? 'on' : '') + '">★</span>';
  let review = '';
  if (sprint.missed.length) {
    review = '<div class="sprint-review"><h2>Review these questions</h2>' +
      sprint.missed.slice(0, 5).map(function (m) {
        return '<div class="review-item">' +
          '<p class="review-topic">' + UNIT_MAP[m.skill.unit].name + ' · ' + m.skill.name + '</p>' +
          '<div class="review-q">' + m.q.q + '</div>' +
          '<p class="review-answer">Correct answer: <strong>' + m.answer + '</strong></p>' +
          '<details class="review-sol"><summary>Show solution</summary><div>' + (m.q.sol || '') + '</div></details>' +
        '</div>';
      }).join('') +
      (sprint.missed.length > 5 ? '<p class="review-more">+ ' + (sprint.missed.length - 5) + ' more missed questions.</p>' : '') +
    '</div>';
  } else {
    review = '<div class="sprint-review"><h2>Perfect run!</h2><p class="review-more">You did not miss a question. Try a harder topic or beat your score.</p></div>';
  }
  const practiceLabel = sprint.unitId === 'mix' ? 'Practise a unit' : 'Practise this unit';
  document.getElementById('main').innerHTML =
    '<section class="sprint-end">' +
      '<div class="sprint-stars">' + starHTML + '</div>' +
      '<p class="eyebrow dark">Time!</p>' +
      '<h1>Math Sprint complete</h1>' +
      '<div class="score-big">' + sprint.score.toLocaleString('en-US') + '</div>' +
      '<p class="summary-sub">' + (sprint.unitId === 'mix' ? 'Mixed topics' : UNIT_MAP[sprint.unitId].name) + (sprint.newBest ? ' · <strong>New best!</strong>' : ' · best ' + best.toLocaleString('en-US')) + '</p>' +
      '<div class="sprint-stats">' +
        '<div><strong>' + sprint.correct + '</strong><span>correct</span></div>' +
        '<div><strong>' + accuracy + '%</strong><span>accuracy</span></div>' +
        '<div><strong>×' + sprint.bestCombo + '</strong><span>best combo</span></div>' +
        '<div><strong>' + best.toLocaleString('en-US') + '</strong><span>best score</span></div>' +
      '</div>' +
      review +
      '<div class="sprint-actions">' +
        '<button class="btn btn-primary" data-action="game-again">Play again</button>' +
        '<button class="btn btn-ghost" data-action="game-practice">' + practiceLabel + '</button>' +
        '<button class="btn btn-ghost" data-action="game-quit">Choose another topic</button>' +
        '<button class="btn btn-ghost" data-action="game-home">Home</button>' +
      '</div>' +
    '</section>';
  renderNav();
}
function renderGameSetup() {
  if (sprint) stopSprint();
  const mixBest = store.gameBest.mix || 0;
  let topics = '<button class="game-topic game-mixed" data-action="game-start" data-unit="mix">' +
    '<span class="game-topic-glyph">🚀</span>' +
    '<span class="game-topic-text"><strong>Mixed topics</strong><span>All 14 units · the full challenge</span></span>' +
    '<span class="game-topic-best">Best ' + mixBest.toLocaleString('en-US') + '</span>' +
  '</button>';
  UNITS.forEach(function (u) {
    const best = store.gameBest[u.id] || 0;
    topics += '<button class="game-topic" data-action="game-start" data-unit="' + u.id + '">' +
      '<span class="game-topic-glyph">' + u.glyph + '</span>' +
      '<span class="game-topic-text"><strong>' + u.name + '</strong><span>Unit ' + u.num + ' · ' + unitSkills(u.id).length + ' skills</span></span>' +
      '<span class="game-topic-best">Best ' + best.toLocaleString('en-US') + '</span>' +
    '</button>';
  });
  document.getElementById('main').innerHTML =
    '<button class="back" data-action="home">← Home</button>' +
    '<section class="game-hero">' +
      '<p class="eyebrow">Arcade challenge</p>' +
      '<h1>Math Sprint</h1>' +
      '<p>Answer as many questions as you can in 60 seconds. Every correct answer earns points, builds your combo, and adds 2 seconds to the clock.</p>' +
      '<div class="game-rules">' +
        '<div class="game-rule"><strong>60s</strong><span>Beat the clock</span></div>' +
        '<div class="game-rule"><strong>×5</strong><span>Build a combo for bonus points</span></div>' +
        '<div class="game-rule"><strong>+2s</strong><span>Every correct answer adds time</span></div>' +
      '</div>' +
      '<p class="game-keyhint">Tip: press <strong>1–4</strong> or <strong>A–D</strong> to answer quickly.</p>' +
    '</section>' +
    '<div class="section-head">' +
      '<div><p class="eyebrow dark">Choose a topic</p><h2>Start a sprint</h2></div>' +
      '<p class="section-note">Your best scores are saved on this device. Mixed topics draw from all 14 units.</p>' +
    '</div>' +
    '<section class="game-topics">' + topics + '</section>' +
    '<footer class="page-foot">Math Sprint is a practice game — not a graded assessment.</footer>';
  renderNav();
}

/* ---------- search ---------- */
function renderSearch(term) {
  const box = document.getElementById('search-results');
  if (!box) return;
  const t = term.trim().toLowerCase();
  if (!t) { box.hidden = true; box.innerHTML = ''; return; }
  const hits = SKILLS.filter(s => s.name.toLowerCase().indexOf(t) !== -1 || UNIT_MAP[s.unit].name.toLowerCase().indexOf(t) !== -1).slice(0, 12);
  if (!hits.length) {
    box.innerHTML = '<p class="no-hit">No skills match “' + esc(term) + '”.</p>';
  } else {
    box.innerHTML = hits.map(s => {
      const u = UNIT_MAP[s.unit];
      return '<button class="search-hit" data-action="skill" data-id="' + s.id + '"><span class="sh-glyph" style="background:' + u.color + ';background:color-mix(in srgb, ' + u.color + ' 78%, #111827)">' + u.glyph + '</span><span><strong>' + s.name + '</strong><small>' + u.name + '</small></span></button>';
    }).join('');
  }
  box.hidden = false;
}

/* ---------- actions ---------- */
function submitAnswer() {
  if (!session || session.answered) return;
  const q = currentQ();
  let resp;
  if (q.type === 'choice') resp = selectedChoice;
  else if (q.type === 'frac' && q.a.d !== 1) {
    resp = fractionResponse();
    if (resp === null) { toast('Enter the numerator and denominator.'); return; }
  } else resp = session.input || '';
  if (q.type === 'choice' && (resp === null || resp === undefined)) { toast('Choose an answer first.'); return; }
  if (q.type !== 'choice' && !String(resp).trim()) { toast('Type an answer first.'); return; }
  const ok = checkAnswer(q, resp);
  session.answered = true;
  session.lastOk = ok;
  session.results[session.idx] = ok;
  recordAnswer(q, ok);
  const y = window.scrollY;
  renderNav();
  renderView();
  window.scrollTo(0, y);
}
function nextQuestion() {
  if (!session || !session.answered) return;
  if (session.idx >= session.questions.length - 1) {
    session.finished = true;
    store.sessions = (store.sessions || 0) + 1;
    saveStore();
    renderSummary();
    return;
  }
  session.idx++;
  session.answered = false;
  session.lastOk = false;
  session.input = '';
  session.fracWhole = '';
  session.fracNum = '';
  session.fracDen = '';
  session.showHint = false;
  selectedChoice = null;
  renderView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function nextSkill() {
  if (!session || session.mode !== 'skill') { navigate('#/home'); return; }
  const skill = SKILL_MAP[session.ids[0]];
  const list = unitSkills(skill.unit);
  const i = list.findIndex(s => s.id === skill.id);
  const target = list[(i + 1) % list.length];
  navigate('#/skill/' + target.id);
}
function renderView() {
  if (!session) { renderHome(); return; }
  if (session.finished) { renderSummary(); return; }
  practiceHTML();
}

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
}

/* ---------- events ---------- */
document.addEventListener('click', function (e) {
  if (e.target.classList && e.target.classList.contains('modal-scrim')) { closeGuide(); return; }
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.getAttribute('data-action');
  if (a === 'menu') { document.body.classList.toggle('nav-open'); return; }
  if (a === 'home') { navigate('#/home'); return; }
  if (a === 'mix') { navigate('#/mix'); return; }
  if (a === 'teacher') { navigate('#/teacher'); return; }
  if (a === 'game') { navigate('#/game'); return; }
  if (a === 'game-start') { startSprint(el.getAttribute('data-unit')); return; }
  if (a === 'game-answer') { answerSprint(Number(el.getAttribute('data-i'))); return; }
  if (a === 'game-finish') { if (sprint && sprint.running) endSprint(); return; }
  if (a === 'game-quit') { stopSprint(); renderGameSetup(); return; }
  if (a === 'game-again') {
    const unit = sprint ? sprint.unitId : 'mix';
    stopSprint();
    startSprint(unit);
    return;
  }
  if (a === 'game-practice') {
    const unit = sprint ? sprint.unitId : 'mix';
    stopSprint();
    if (unit === 'mix') navigate('#/home');
    else navigate('#/unit/' + unit);
    return;
  }
  if (a === 'game-home') { stopSprint(); navigate('#/home'); return; }
  if (a === 'guide') { openGuide(el.getAttribute('data-id'), el.getAttribute('data-mode') || 'explain'); return; }
  if (a === 'guide-current') { openGuide(currentQ().skillId, el.getAttribute('data-mode') || 'explain', currentQ()); return; }
  if (a === 'close-guide') { closeGuide(); return; }
  if (a === 'guide-tab') {
    if (!guide) return;
    const tab = el.getAttribute('data-tab');
    stopGuideTimer();
    guide.playing = false;
    if (tab === 'animate') { guide.tab = 'animate'; guide.index = 0; startGuidePlay(); }
    else { guide.tab = 'explain'; renderGuide(); }
    return;
  }
  if (a === 'guide-play') {
    if (!guide) return;
    if (guide.playing) pauseGuide(); else startGuidePlay();
    return;
  }
  if (a === 'guide-next') { guideStep(1); return; }
  if (a === 'guide-prev') { guideStep(-1); return; }
  if (a === 'guide-new') { newGuideExample(); return; }
  if (a === 'guide-practice') {
    if (!guide) return;
    const id = guide.skill.id;
    closeGuide();
    navigate('#/skill/' + id);
    return;
  }
  if (a === 'unit') { navigate('#/unit/' + el.getAttribute('data-unit')); return; }
  if (a === 'unit-practice') { startUnit(el.getAttribute('data-unit')); return; }
  if (a === 'skill') {
    const id = el.getAttribute('data-id');
    const box = document.getElementById('search-results');
    if (box) { box.hidden = true; box.innerHTML = ''; }
    const search = document.getElementById('search');
    if (search) search.value = '';
    navigate('#/skill/' + id);
    return;
  }
  if (a === 'back-unit') { navigate('#/unit/' + el.getAttribute('data-unit')); return; }
  if (a === 'resume') {
    if (store.lastSkill && SKILL_MAP[store.lastSkill]) navigate('#/skill/' + store.lastSkill);
    else navigate('#/mix');
    return;
  }
  if (a === 'choose') {
    selectedChoice = Number(el.getAttribute('data-i'));
    document.querySelectorAll('.choice').forEach(function (btn, i) {
      btn.classList.toggle('sel', i === selectedChoice);
    });
    return;
  }
  if (a === 'check') { submitAnswer(); return; }
  if (a === 'hint') {
    session.showHint = !session.showHint;
    const y = window.scrollY;
    renderView();
    window.scrollTo(0, y);
    return;
  }
  if (a === 'next') { nextQuestion(); return; }
  if (a === 'again') {
    if (session.mode === 'mix') startMix();
    else if (session.mode === 'unit') startUnit(SKILL_MAP[session.ids[0]].unit);
    else startSkill(session.ids[0]);
    return;
  }
  if (a === 'next-skill') { nextSkill(); return; }
  if (a === 'reset') {
    if (window.confirm('Reset all progress, XP and streaks on this device?')) {
      store = { skills: {}, xp: 0, sessions: 0, lastSkill: null, dayStreak: 1, lastDay: localDay(0), gameBest: {} };
      saveStore();
      renderNav();
      route();
      toast('Progress reset.');
    }
    return;
  }
});

document.addEventListener('input', function (e) {
  if (e.target.id === 'answer') { session.input = e.target.value; }
  if (e.target.id === 'frac-whole') { session.fracWhole = e.target.value; }
  if (e.target.id === 'frac-num') { session.fracNum = e.target.value; }
  if (e.target.id === 'frac-den') { session.fracDen = e.target.value; }
  if (e.target.id === 'search') { renderSearch(e.target.value); }
});

document.addEventListener('change', function (e) {
  if (e.target.id === 'guide-speed' && guide) {
    guideSpeed = Number(e.target.value) || 4500;
    guide.speed = guideSpeed;
    try { localStorage.setItem('etx-guide-speed', String(guideSpeed)); } catch (err) { /* ignore */ }
    if (guide.playing) startGuideTimer();
  }
});

document.addEventListener('keydown', function (e) {
  if (guide) {
    if (e.key === 'Escape') { closeGuide(); return; }
    if (e.key === 'ArrowRight') { guideStep(1); return; }
    if (e.key === 'ArrowLeft') { guideStep(-1); return; }
  }
  if (sprint && sprint.running && !sprint.locked && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const key = e.key.toLowerCase();
    const choiceKeys = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    if (choiceKeys[key] !== undefined) {
      e.preventDefault();
      answerSprint(choiceKeys[key]);
      return;
    }
  }
  const answerIds = ['answer', 'frac-whole', 'frac-num', 'frac-den'];
  if (answerIds.indexOf(e.target.id) !== -1 && e.key === 'Enter') {
    e.preventDefault();
    if (session && session.answered) { nextQuestion(); return; }
    if (e.target.id === 'frac-whole') {
      const num = document.getElementById('frac-num');
      if (num) { num.focus(); return; }
    }
    if (e.target.id === 'frac-num') {
      const den = document.getElementById('frac-den');
      if (den) { den.focus(); return; }
    }
    submitAnswer();
    return;
  }
  if (session && session.answered && e.key === 'Enter' && session.finished === false) {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag !== 'input' && tag !== 'textarea') nextQuestion();
  }
  if (e.key === 'Escape') { document.body.classList.remove('nav-open'); }
});

/* ---------- boot ---------- */
mount();
