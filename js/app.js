/* Ledger Lab — app shell, spaced repetition, quiz engine, and all views. */
(function () {
  'use strict';
  var FSQ = window.FSQ, G = FSQ.gen;
  var app = document.getElementById('app');
  var TOPIC = {}; FSQ.TOPICS.forEach(function (t) { TOPIC[t.id] = t; });
  var TYPE_NAMES = { mc: 'Multiple choice', tf: 'True / False', multi: 'Select all', match: 'Matching', sort: 'Sorting', order: 'Ordering', steps: 'Walkthrough', grid: 'Impact grid' };
  var STMT_NAMES = { is: 'Income Statement', bs: 'Balance Sheet', cfs: 'Cash Flow', general: 'Concepts', ratios: 'Ratios' };

  // ================= utilities =================
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { return G.shuffle(a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function strip(html) { return String(html || '').replace(/<[^>]+>/g, ' '); }
  function todayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function toast(msg, ms) { var t = document.getElementById('toast'); t.innerHTML = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, ms || 2200); }
  function on(root, sel, ev, fn) { root.querySelectorAll(sel).forEach(function (n) { n.addEventListener(ev, fn); }); }
  function pct(n, d) { return d ? Math.round(100 * n / d) : 0; }

  // ================= persistent state =================
  var KEY = 'ledgerlab-v1';
  var S;
  function defaults() {
    return { items: {}, topics: {}, subs: {}, xp: 0, streak: { count: 0, last: null }, days: {}, ach: {}, mistakes: [], gloss: {}, lessons: {}, best: { lightning: 0, termmatch: null }, classDone: {}, total: { n: 0, c: 0 }, settings: {} };
  }
  function load() {
    try { S = JSON.parse(localStorage.getItem(KEY)) || defaults(); } catch (e) { S = defaults(); }
    var d = defaults(); for (var k in d) if (!(k in S)) S[k] = d[k];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }
  load();

  // theme
  function applyTheme() { if (S.settings.theme) document.documentElement.setAttribute('data-theme', S.settings.theme); else document.documentElement.removeAttribute('data-theme'); }
  applyTheme();
  document.getElementById('themeBtn').addEventListener('click', function () {
    var dark = S.settings.theme ? S.settings.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    S.settings.theme = dark ? 'light' : 'dark'; save(); applyTheme();
  });

  // ================= levels / XP =================
  var TITLES = ['Intern', 'Junior Analyst', 'Analyst', 'Senior Analyst', 'Associate', 'Senior Associate', 'Vice President', 'Director', 'Managing Director', 'Partner', 'CFO', 'Legend'];
  function levelInfo(xp) {
    var lvl = Math.floor((Math.sqrt(1 + 8 * xp / 100) - 1) / 2) + 1;
    var cur = 100 * (lvl - 1) * lvl / 2, next = 100 * lvl * (lvl + 1) / 2;
    return { lvl: lvl, title: TITLES[Math.min(lvl - 1, TITLES.length - 1)], into: xp - cur, need: next - cur };
  }
  var DAILY_GOAL = 20;

  function renderHud() {
    var li = levelInfo(S.xp);
    var today = S.days[todayKey()] || { n: 0, c: 0 };
    document.getElementById('hud').innerHTML =
      '<span class="pill" title="Daily streak">🔥 ' + streakCount() + '</span>' +
      '<span class="pill hide-sm" title="Today\'s goal">🎯 ' + Math.min(today.n, DAILY_GOAL) + '/' + DAILY_GOAL + '</span>' +
      '<span class="pill" title="' + li.title + ' — ' + li.into + '/' + li.need + ' XP to next level">⭐ Lv ' + li.lvl + '</span>';
  }
  function streakCount() {
    if (!S.streak.last) return 0;
    var last = new Date(S.streak.last + 'T00:00:00'), now = new Date(todayKey() + 'T00:00:00');
    var diff = Math.round((now - last) / 86400000);
    return diff <= 1 ? S.streak.count : 0;
  }
  function touchStreak() {
    var t = todayKey();
    if (S.streak.last === t) return;
    var y = new Date(); y.setDate(y.getDate() - 1);
    S.streak.count = (S.streak.last === todayKey(y)) ? S.streak.count + 1 : 1;
    S.streak.last = t;
  }

  // ================= spaced repetition (Leitner) =================
  var INTERVALS = [0, 10 / 1440, 1, 3, 7, 16, 35]; // days per box
  function record(q, frac) {
    var id = q.id, now = Date.now();
    var it = S.items[id] || { box: 0, due: 0, n: 0, c: 0 };
    var correct = frac >= 0.999;
    it.n++; if (correct) it.c++;
    it.box = correct ? Math.min(it.box + 1, INTERVALS.length - 1) : 1;
    if (q.generated && correct) it.box = Math.min(it.box, 4); // keep generated skills cycling
    it.due = now + INTERVALS[it.box] * 86400000;
    it.last = now;
    S.items[id] = it;
    var tp = S.topics[q.topic] || { n: 0, c: 0, recent: [] };
    tp.n++; tp.c += frac; tp.recent.push(Math.round(frac * 100) / 100); if (tp.recent.length > 40) tp.recent.shift();
    S.topics[q.topic] = tp;
    var sk = q.topic + '|' + (q.sub || 'General');
    var sb = S.subs[sk] || { n: 0, c: 0 }; sb.n++; sb.c += frac; S.subs[sk] = sb;
    var d = todayKey(); S.days[d] = S.days[d] || { n: 0, c: 0 }; S.days[d].n++; if (correct) S.days[d].c++;
    S.total.n++; if (correct) S.total.c++;
    var mi = S.mistakes.indexOf(id);
    if (!correct && mi < 0) S.mistakes.unshift(id);
    if (correct && mi >= 0 && it.box >= 3) S.mistakes.splice(mi, 1);
    if (S.mistakes.length > 300) S.mistakes.length = 300;
    touchStreak();
  }
  function mastery(topic) {
    var tp = S.topics[topic];
    if (!tp || !tp.n) return 0;
    var r = tp.recent; var acc = r.reduce(function (a, b) { return a + b; }, 0) / r.length;
    var coverage = Math.min(1, tp.n / 40);
    return Math.round(100 * acc * (0.35 + 0.65 * coverage));
  }

  // ================= question sources =================
  var STATIC = FSQ.questions;
  var GENS = FSQ.generators;
  var GEN_BY_ID = {}; GENS.forEach(function (g) { GEN_BY_ID[g.id] = g; });
  var STATIC_BY_ID = {}; STATIC.forEach(function (q) { STATIC_BY_ID[q.id] = q; });

  function src(kind, ref, opts) { return { kind: kind, ref: ref, opts: opts || {} }; }
  function srcId(s) { return s.kind === 'static' ? s.ref.id : s.kind === 'gen' ? s.ref.id : s.ref.id; }
  function srcTopic(s) { return s.ref.topic; }

  function instantiate(s) {
    var q;
    if (s.kind === 'static') {
      var o = s.ref; q = JSON.parse(JSON.stringify(o));
      if (q.type === 'mc') { var idx = shuffle(q.choices.map(function (_, i) { return i; })); q.choices = idx.map(function (i) { return o.choices[i]; }); q.answer = idx.indexOf(o.answer); }
      if (q.type === 'multi') { var idx2 = shuffle(q.choices.map(function (_, i) { return i; })); q.choices = idx2.map(function (i) { return o.choices[i]; }); q.answers = o.answers.map(function (a) { return idx2.indexOf(a); }); }
    } else if (s.kind === 'gen') {
      var tries = 0;
      while (!q && tries < 5) { tries++; try { q = s.ref.make(s.opts.variant); } catch (e) { console.warn(e); } }
      if (!q) q = { type: 'tf', id: s.ref.id, topic: s.ref.topic, prompt: 'Assets = Liabilities + Equity.', answer: true, explain: 'The accounting equation.' , difficulty: 1};
    } else if (s.kind === 'class') {
      q = s.ref.make(); q.id = s.ref.id; q.topic = 'link'; q.sub = 'Class problem sets'; q.difficulty = 2; q.classTitle = s.ref.title;
    }
    return q;
  }

  function staticSources(filter) {
    return STATIC.filter(function (q) {
      if (filter.topics && filter.topics.indexOf(q.topic) < 0) return false;
      if (filter.types && filter.types.indexOf(q.type) < 0) return false;
      if (filter.diffs && filter.diffs.indexOf(q.difficulty) < 0) return false;
      return true;
    }).map(function (q) { return src('static', q); });
  }
  function genSources(filter) {
    return GENS.filter(function (g) {
      if (filter.topics && filter.topics.indexOf(g.topic) < 0) return false;
      if (filter.families && filter.families.indexOf(g.family) < 0) return false;
      if (filter.exclude && filter.exclude.indexOf(g.id) >= 0) return false;
      return true;
    }).map(function (g) { return src('gen', g, { variant: filter.variant }); });
  }

  // weighted sample without replacement
  function weightedSample(list, weightFn, n) {
    var pool = list.map(function (x) { return { x: x, w: Math.max(0.0001, weightFn(x)) }; });
    var out = [];
    while (out.length < n && pool.length) {
      var tot = pool.reduce(function (a, p) { return a + p.w; }, 0), r = Math.random() * tot, i = 0;
      for (; i < pool.length; i++) { r -= pool[i].w; if (r <= 0) break; }
      i = Math.min(i, pool.length - 1);
      out.push(pool[i].x); pool.splice(i, 1);
    }
    return out;
  }
  function srsWeight(id, topic) {
    var it = S.items[id], now = Date.now();
    var weak = 1 + (100 - mastery(topic)) / 60;
    if (!it) return 2.2 * weak;                     // new
    if (it.due <= now) return (6 + (5 - it.box)) * weak; // due
    return 0.25 / (it.box + 1) * weak;              // not due
  }

  function smartSession(n) {
    n = n || 15;
    var nGen = Math.round(n * 0.4);
    var stat = weightedSample(staticSources({}), function (s) { return srsWeight(s.ref.id, s.ref.topic); }, n - nGen);
    var gens = weightedSample(genSources({ exclude: ['gloss-match'] }), function (s) { return srsWeight(s.ref.id, s.ref.topic) * (s.ref.family === 'tx' ? 1.6 : 1); }, nGen);
    return shuffle(stat.concat(gens));
  }

  // ================= related glossary terms =================
  var GLOSS = FSQ.glossary.slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
  var GLOSS_BY = {}; GLOSS.forEach(function (g) { GLOSS_BY[g.term.toLowerCase()] = g; });
  var TERM_INDEX = GLOSS.filter(function (g) { return g.term.length >= 4; }).map(function (g) {
    var base = g.term.replace(/\s*\(.*?\)\s*/g, '').trim();
    var keys = [base.toLowerCase()];
    if (g.abbr && g.abbr.length >= 3) keys.push(g.abbr.toLowerCase());
    return { g: g, keys: keys };
  }).sort(function (a, b) { return b.keys[0].length - a.keys[0].length; });
  function relatedTerms(text, max) {
    var t = ' ' + strip(text).toLowerCase().replace(/\s+/g, ' ') + ' ';
    var found = [], used = [];
    for (var i = 0; i < TERM_INDEX.length && found.length < (max || 5); i++) {
      var e = TERM_INDEX[i];
      for (var k = 0; k < e.keys.length; k++) {
        var key = e.keys[k];
        var re = new RegExp('[^a-z0-9]' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?[^a-z0-9]');
        if (re.test(t) && !used.some(function (u) { return u.indexOf(key) >= 0; })) { found.push(e.g); used.push(key); break; }
      }
    }
    return found;
  }
  function termChips(terms) {
    if (!terms.length) return '';
    return '<div class="related"><span class="tiny muted">Key terms:</span>' + terms.map(function (g) { return '<button class="chip term-chip" data-term="' + esc(g.term) + '">' + esc(g.term) + '</button>'; }).join('') + '</div>';
  }
  var pop = document.getElementById('popover');
  function showTermPopover(term, anchor) {
    var g = GLOSS_BY[term.toLowerCase()]; if (!g) return;
    pop.innerHTML = '<h4>' + esc(g.term) + (g.abbr ? ' <span class="muted small">(' + esc(g.abbr) + ')</span>' : '') + '</h4><div class="tiny"><span class="tagline">' + esc(STMT_NAMES[g.statement] || '') + (g.section ? ' · ' + esc(g.section) : '') + '</span></div><p style="margin:6px 0">' + g.def + '</p>' + (g.formula ? '<div class="small mono">' + g.formula + '</div>' : '') + (g.example ? '<div class="small muted">e.g. ' + g.example + '</div>' : '');
    pop.hidden = false;
    var r = anchor.getBoundingClientRect();
    var top = r.bottom + 8, left = Math.min(r.left, window.innerWidth - 350);
    if (top + pop.offsetHeight > window.innerHeight - 10) top = Math.max(10, r.top - pop.offsetHeight - 8);
    pop.style.top = top + 'px'; pop.style.left = Math.max(8, left) + 'px';
  }
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.term-chip');
    if (chip) { e.stopPropagation(); showTermPopover(chip.dataset.term, chip); return; }
    if (!e.target.closest('#popover')) pop.hidden = true;
  });
  window.addEventListener('scroll', function () { pop.hidden = true; }, { passive: true });

  // ================= question renderer =================
  // renderQuestion(q, mount, {onAnswered(frac), onNext(), fast, nextLabel})
  function renderQuestion(q, mount, opts) {
    opts = opts || {};
    var t = TOPIC[q.topic] || { name: q.topic, icon: '' };
    var diff = '●●●'.slice(0, q.difficulty || 1) + '<span style="opacity:.25">' + '●●●'.slice(q.difficulty || 1) + '</span>';
    var html = '<div class="card qcard">' +
      '<div class="qmeta"><span class="tagline">' + t.icon + ' ' + esc(t.name) + '</span>' + (q.sub ? '<span class="tagline">' + esc(q.sub) + '</span>' : '') +
      '<span class="tagline">' + (TYPE_NAMES[q.type] || q.type) + '</span>' + (q.generated ? '<span class="tagline" title="Randomly generated — new numbers every time">🎲 fresh numbers</span>' : '') +
      (q.classTitle ? '<span class="tagline">📄 ' + esc(q.classTitle) + '</span>' : '') + '<span class="diff" title="Difficulty">' + diff + '</span></div>' +
      '<div class="qprompt">' + q.prompt + '</div>' + tableHtml(q.table) +
      '<div class="qbody"></div><div class="qfeedback"></div><div class="actions"><span class="hint"></span></div></div>';
    mount.innerHTML = html;
    var body = mount.querySelector('.qbody'), fb = mount.querySelector('.qfeedback'), actions = mount.querySelector('.actions'), hint = mount.querySelector('.hint');
    var answered = false;
    var ctl = { keys: null };

    function addBtn(label, cls, fn) { var b = document.createElement('button'); b.className = 'btn ' + (cls || ''); b.innerHTML = label; b.addEventListener('click', fn); actions.appendChild(b); return b; }
    function finish(frac, extraHtml) {
      if (answered) return; answered = true;
      var good = frac >= 0.999;
      if (!opts.fast) {
        var title = good ? pick(['✅ Correct!', '✅ Nice work!', '✅ Exactly right.', '✅ Nailed it.']) : (frac > 0 ? '🟡 Partially correct (' + Math.round(frac * 100) + '%)' : '❌ Not quite.');
        fb.innerHTML = '<div class="feedback ' + (good ? 'good' : 'bad') + '"><h4>' + title + '</h4>' + (extraHtml || '') + '<div class="explain">' + (q.explain || '') + '</div>' + termChips(relatedTerms(q.prompt + ' ' + (q.explain || ''), 5)) + '</div>';
      }
      actions.querySelectorAll('.btn-check').forEach(function (b) { b.remove(); });
      if (opts.onAnswered) opts.onAnswered(frac);
      if (opts.fast) { setTimeout(function () { opts.onNext && opts.onNext(); }, good ? 450 : 1400); return; }
      hint.innerHTML = 'Press <span class="kbd">Enter</span> to continue';
      var nb = addBtn(opts.nextLabel || 'Next →', 'btn-primary btn-next', function () { opts.onNext && opts.onNext(); });
      ctl.keys = function (e) { if (e.key === 'Enter') { e.preventDefault(); nb.click(); } };
      nb.focus({ preventScroll: true });
    }
    ctl.finish = finish;

    var R = RENDER[q.type];
    if (!R) { body.innerHTML = '<p class="muted">Unsupported question type.</p>'; finish(0); return ctl; }
    R(q, body, finish, { addBtn: addBtn, hint: hint, ctl: ctl, opts: opts, mount: mount });
    return ctl;
  }
  function tableHtml(t) {
    if (!t || !t.rows) return '';
    return '<table class="data-table">' + (t.headers ? '<tr>' + t.headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' : '') + t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  var LETTERS = 'ABCDEFGH';
  var RENDER = {
    mc: function (q, body, finish, x) {
      body.innerHTML = '<div class="choices">' + q.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '"><span class="key">' + LETTERS[i] + '</span><span>' + c + '</span></button>'; }).join('') + '</div>';
      x.hint.innerHTML = 'Keys <span class="kbd">1</span>–<span class="kbd">' + q.choices.length + '</span>';
      var btns = body.querySelectorAll('.choice');
      function choose(i) {
        btns.forEach(function (b) { b.disabled = true; });
        btns[q.answer].classList.add('right');
        if (i !== q.answer) btns[i].classList.add('wrong');
        finish(i === q.answer ? 1 : 0);
      }
      btns.forEach(function (b) { b.addEventListener('click', function () { choose(+b.dataset.i); }); });
      x.ctl.keys = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= q.choices.length) choose(n - 1); else { var L = LETTERS.indexOf(e.key.toUpperCase()); if (L >= 0 && L < q.choices.length && e.key.length === 1) choose(L); } };
    },
    tf: function (q, body, finish, x) {
      body.innerHTML = '<div class="choices tf"><button class="choice" data-v="1">True</button><button class="choice" data-v="0">False</button></div>';
      x.hint.innerHTML = '<span class="kbd">T</span> / <span class="kbd">F</span>';
      var btns = body.querySelectorAll('.choice');
      function choose(v) {
        btns.forEach(function (b) { b.disabled = true; });
        var rightBtn = btns[q.answer ? 0 : 1]; rightBtn.classList.add('right');
        if (v !== q.answer) btns[v ? 0 : 1].classList.add('wrong');
        finish(v === q.answer ? 1 : 0);
      }
      btns[0].addEventListener('click', function () { choose(true); });
      btns[1].addEventListener('click', function () { choose(false); });
      x.ctl.keys = function (e) { var k = e.key.toLowerCase(); if (k === 't' || k === '1') choose(true); if (k === 'f' || k === '2') choose(false); };
    },
    multi: function (q, body, finish, x) {
      body.innerHTML = '<p class="small muted" style="margin-top:-6px">Select all that apply, then check.</p><div class="choices">' + q.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '"><span class="key">' + LETTERS[i] + '</span><span>' + c + '</span></button>'; }).join('') + '</div>';
      var sel = {};
      var btns = body.querySelectorAll('.choice');
      function toggle(i) { if (btns[i].disabled) return; sel[i] = !sel[i]; btns[i].classList.toggle('sel', !!sel[i]); }
      btns.forEach(function (b) { b.addEventListener('click', function () { toggle(+b.dataset.i); }); });
      var check = x.addBtn('Check', 'btn-primary btn-check', function () {
        var right = 0, total = q.choices.length;
        btns.forEach(function (b, i) {
          b.disabled = true; var should = q.answers.indexOf(i) >= 0;
          b.classList.remove('sel');
          if (should) b.classList.add('right');
          if (sel[i] && !should) b.classList.add('wrong');
          if (!!sel[i] === should) right++;
          if (should && !sel[i]) b.style.borderStyle = 'dashed';
        });
        finish(right === total ? 1 : Math.max(0, (right - (total - right)) / total));
      });
      x.ctl.keys = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= q.choices.length) toggle(n - 1); if (e.key === 'Enter') { e.preventDefault(); check.click(); } };
    },
    match: function (q, body, finish, x) {
      var left = q.pairs.map(function (p, i) { return { t: p[0], i: i }; });
      var right = shuffle(q.pairs.map(function (p, i) { return { t: p[1], i: i }; }));
      var COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0891b2', '#65a30d', '#ca8a04'];
      body.innerHTML = '<p class="small muted" style="margin-top:-6px">Tap an item on the left, then its match on the right.</p><div class="match"><div class="match-col L">' + left.map(function (l, k) { return '<button class="match-item" data-k="' + k + '">' + l.t + '</button>'; }).join('') + '</div><div class="match-col R">' + right.map(function (r, k) { return '<button class="match-item" data-k="' + k + '">' + r.t + '</button>'; }).join('') + '</div></div>';
      var Ls = body.querySelectorAll('.L .match-item'), Rs = body.querySelectorAll('.R .match-item');
      var pairL = {}, pairR = {}, selL = null;
      function paint() {
        Ls.forEach(function (b, k) { b.classList.toggle('sel', selL === k); var r = pairL[k]; b.style.borderColor = r != null ? COLORS[k % COLORS.length] : ''; b.querySelector('.badge') && b.querySelector('.badge').remove(); if (r != null) b.insertAdjacentHTML('beforeend', '<span class="badge" style="background:' + COLORS[k % COLORS.length] + '">' + (k + 1) + '</span>'); });
        Rs.forEach(function (b, k) { var l = pairR[k]; b.style.borderColor = l != null ? COLORS[l % COLORS.length] : ''; b.querySelector('.badge') && b.querySelector('.badge').remove(); if (l != null) b.insertAdjacentHTML('beforeend', '<span class="badge" style="background:' + COLORS[l % COLORS.length] + '">' + (l + 1) + '</span>'); });
        check.disabled = Object.keys(pairL).length < left.length;
      }
      Ls.forEach(function (b, k) { b.addEventListener('click', function () { if (pairL[k] != null) { delete pairR[pairL[k]]; delete pairL[k]; } selL = selL === k ? null : k; paint(); }); });
      Rs.forEach(function (b, k) { b.addEventListener('click', function () {
        if (pairR[k] != null) { delete pairL[pairR[k]]; delete pairR[k]; paint(); if (selL == null) return; }
        if (selL == null) { var free = -1; for (var j = 0; j < left.length; j++) if (pairL[j] == null) { free = j; break; } if (free < 0) return; selL = free; }
        pairL[selL] = k; pairR[k] = selL; selL = null;
        for (var j2 = 0; j2 < left.length; j2++) if (pairL[j2] == null) { selL = j2; break; }
        paint();
      }); });
      var check = x.addBtn('Check', 'btn-primary btn-check', function () {
        var ok = 0;
        Ls.forEach(function (b, k) { b.disabled = true; var good = right[pairL[k]].i === left[k].i; if (good) ok++; b.classList.add(good ? 'right' : 'wrong'); b.style.borderColor = ''; });
        Rs.forEach(function (b, k) { b.disabled = true; var l = pairR[k]; var good = l != null && right[k].i === left[l].i; b.classList.add(good ? 'right' : 'wrong'); b.style.borderColor = ''; });
        var corr = '<div class="small" style="margin-bottom:8px">' + (ok < left.length ? '<b>Correct matches:</b><br>' + q.pairs.map(function (p) { return esc(strip(p[0])) + ' → ' + esc(strip(p[1])); }).join('<br>') : '') + '</div>';
        finish(ok / left.length, ok < left.length ? corr : '');
      });
      selL = 0; paint();
    },
    sort: function (q, body, finish, x) {
      var items = q.items.map(function (it) { return { t: it[0], b: it[1] }; });
      body.innerHTML = '<p class="small muted" style="margin-top:-6px">Choose a category for each item.</p><div class="sortbox">' + items.map(function (it, k) { return '<div class="sort-row" data-k="' + k + '"><div class="sort-item">' + it.t + '</div><div class="sort-btns">' + q.buckets.map(function (b, j) { return '<button class="chip" data-j="' + j + '">' + esc(b) + '</button>'; }).join('') + '</div></div>'; }).join('') + '</div>';
      var ans = {};
      var rows = body.querySelectorAll('.sort-row');
      rows.forEach(function (row, k) { row.querySelectorAll('.chip').forEach(function (c) { c.addEventListener('click', function () { if (c.disabled) return; ans[k] = +c.dataset.j; row.querySelectorAll('.chip').forEach(function (z) { z.classList.toggle('on', z === c); }); check.disabled = Object.keys(ans).length < items.length; }); }); });
      var check = x.addBtn('Check', 'btn-primary btn-check', function () {
        var ok = 0;
        rows.forEach(function (row, k) {
          var correctJ = q.buckets.indexOf(items[k].b);
          row.querySelectorAll('.chip').forEach(function (c) { c.disabled = true; var j = +c.dataset.j; c.classList.remove('on'); if (j === ans[k]) c.classList.add(j === correctJ ? 'right' : 'wrong'); else if (j === correctJ) c.classList.add('missed'); });
          if (ans[k] === correctJ) ok++;
        });
        finish(ok / items.length);
      });
      check.disabled = true;
    },
    order: function (q, body, finish, x) {
      var pool = shuffle(q.items.map(function (t, i) { return { t: t, i: i }; }));
      if (pool.every(function (p, k) { return p.i === k; })) pool.reverse();
      var chosen = [];
      body.innerHTML = '<p class="small muted" style="margin-top:-6px">Tap items in the correct order. Tap a placed item to remove it.</p><div class="order-area"><div class="order-list"></div><div class="order-pool"></div></div>';
      var listEl = body.querySelector('.order-list'), poolEl = body.querySelector('.order-pool');
      var locked = false;
      function paint() {
        listEl.innerHTML = chosen.length ? chosen.map(function (p, k) { return '<button class="order-item" data-k="' + k + '"><span class="n">' + (k + 1) + '</span><span>' + p.t + '</span></button>'; }).join('') : '<div class="placeholder">Your order appears here…</div>';
        poolEl.innerHTML = pool.filter(function (p) { return chosen.indexOf(p) < 0; }).map(function (p) { return '<button class="chip" data-i="' + p.i + '">' + p.t + '</button>'; }).join('');
        if (!locked) {
          listEl.querySelectorAll('.order-item').forEach(function (b) { b.addEventListener('click', function () { chosen.splice(+b.dataset.k, 1); paint(); }); });
          poolEl.querySelectorAll('.chip').forEach(function (b) { b.addEventListener('click', function () { var i = +b.dataset.i; chosen.push(pool.filter(function (p) { return p.i === i; })[0]); paint(); }); });
        }
        check.disabled = chosen.length < q.items.length;
      }
      var check = x.addBtn('Check', 'btn-primary btn-check', function () {
        locked = true;
        var ok = 0; chosen.forEach(function (p, k) { if (p.i === k) ok++; });
        paint();
        listEl.querySelectorAll('.order-item').forEach(function (b, k) { b.disabled = true; b.classList.add(chosen[k].i === k ? 'right' : 'wrong'); });
        finish(ok / q.items.length, ok < q.items.length ? '<div class="small" style="margin-bottom:8px"><b>Correct order:</b> ' + q.items.map(function (t, i) { return (i + 1) + '. ' + t; }).join(' → ') + '</div>' : '');
      });
      paint();
    },
    grid: function (q, body, finish, x) {
      body.innerHTML = '<table class="impact-grid">' + q.rows.map(function (r, k) {
        var tagc = r.statement === 'is' ? 't-is' : r.statement === 'cfs' ? 't-cfs' : 't-bs';
        return '<tr><td><span class="tagline ' + tagc + '">' + r.statement.toUpperCase() + '</span> ' + esc(r.label) + '<div class="fix" data-k="' + k + '"></div></td><td style="width:42%"><select data-k="' + k + '"><option value="">Select…</option>' + r.options.map(function (o, j) { return '<option value="' + j + '">' + o + '</option>'; }).join('') + '</select></td></tr>';
      }).join('') + '</table>';
      var sels = body.querySelectorAll('select');
      sels.forEach(function (s) { s.addEventListener('change', function () { check.disabled = [].some.call(sels, function (z) { return z.value === ''; }); }); });
      var check = x.addBtn('Check', 'btn-primary btn-check', function () {
        var ok = 0;
        sels.forEach(function (s, k) { s.disabled = true; var good = +s.value === q.rows[k].answer; if (good) ok++; s.classList.add(good ? 'right' : 'wrong'); if (!good) body.querySelector('.fix[data-k="' + k + '"]').textContent = 'Correct: ' + q.rows[k].options[q.rows[k].answer]; });
        finish(ok / q.rows.length);
      });
      check.disabled = true;
    },
    steps: function (q, body, finish, x) {
      var k = 0, firstTry = 0;
      var NAMES = { is: ['Income Statement', 't-is'], cfs: ['Cash Flow Statement', 't-cfs'], bs: ['Balance Sheet', 't-bs'] };
      body.innerHTML = '<p class="small muted" style="margin-top:-6px">Work through it step by step: Income Statement → Cash Flow Statement → Balance Sheet.</p><div class="steps"></div>';
      var wrap = body.querySelector('.steps');
      function showStep() {
        var s = q.steps[k];
        var nm = NAMES[s.statement] || ['Step', ''];
        var div = document.createElement('div');
        div.className = 'step';
        div.innerHTML = '<div class="step-head"><span class="step-n">' + (k + 1) + '/' + q.steps.length + '</span><span class="tagline ' + nm[1] + '">' + nm[0] + '</span></div><div style="font-weight:500;margin-bottom:8px">' + s.prompt + '</div><div class="choices">' + s.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '"><span class="key">' + LETTERS[i] + '</span><span>' + c + '</span></button>'; }).join('') + '</div>';
        wrap.appendChild(div);
        var btns = div.querySelectorAll('.choice');
        function choose(i) {
          btns.forEach(function (b) { b.disabled = true; });
          btns[s.answer].classList.add('right');
          var good = i === s.answer;
          if (!good) btns[i].classList.add('wrong'); else firstTry++;
          div.insertAdjacentHTML('beforeend', '<div class="step-explain ' + (good ? 'good' : 'bad') + '">' + (good ? '✓ ' : '✗ ') + (s.explain || '') + '</div>');
          div.classList.add('done');
          k++;
          x.ctl.keys = null;
          if (k < q.steps.length) {
            var nb = document.createElement('div'); nb.className = 'actions'; nb.style.marginTop = '8px';
            nb.innerHTML = '<button class="btn btn-sm btn-primary">Next step →</button>';
            div.appendChild(nb);
            var btn = nb.querySelector('button');
            btn.addEventListener('click', function () { nb.remove(); showStep(); });
            x.ctl.keys = function (e) { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } };
            btn.focus({ preventScroll: true });
          } else {
            finish(firstTry / q.steps.length, q.summary ? impact3(q.summary) : '');
          }
        }
        btns.forEach(function (b) { b.addEventListener('click', function () { choose(+b.dataset.i); }); });
        x.ctl.keys = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= s.choices.length) choose(n - 1); };
        if (k > 0) div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showStep();
    }
  };

  function impact3(e) {
    var D = G.delta;
    var ln = function (a, b, cls) { return '<div class="ln' + (cls ? ' ' + cls : '') + '"><span>' + esc(a) + '</span><span>' + D(b) + '</span></div>'; };
    var is = e.isLines.length ? e.isLines.map(function (x) { return ln(x[0], x[1]); }).join('') + ln('Pre-tax income', e.pretax, 'tot') + (e.tax ? ln('Taxes (' + e.rate + '%)', -e.tax) : '') + ln('Net income', e.ni, 'tot') : '<div class="muted">No impact</div>';
    var cf = e.cfo.map(function (x) { return ln(x[0], x[1]); }).join('') + ln('CFO', e.CFO, 'tot') + (e.cfi.length ? e.cfi.map(function (x) { return ln(x[0], x[1]); }).join('') + ln('CFI', e.CFI, 'tot') : '') + (e.cff.length ? e.cff.map(function (x) { return ln(x[0], x[1]); }).join('') + ln('CFF', e.CFF, 'tot') : '') + ln('Net change in cash', e.cash, 'tot');
    var bs = '<div class="tiny muted">Assets</div>' + (e.assets.length ? e.assets.map(function (x) { return ln(x[0], x[1]); }).join('') : '<div class="muted small">—</div>') +
      '<div class="tiny muted" style="margin-top:4px">Liabilities</div>' + (e.liab.length ? e.liab.map(function (x) { return ln(x[0], x[1]); }).join('') : '<div class="muted small">—</div>') +
      '<div class="tiny muted" style="margin-top:4px">Equity</div>' + (e.equity.length ? e.equity.map(function (x) { return ln(x[0], x[1]); }).join('') : '<div class="muted small">—</div>') +
      ln('A = L + E', e.A, 'tot');
    return '<div class="impact3"><div class="is"><h5>Income Statement</h5>' + is + '</div><div class="cfs"><h5>Cash Flow Statement</h5>' + cf + '</div><div class="bs"><h5>Balance Sheet</h5>' + bs + '</div></div><div style="height:10px"></div>';
  }

  // global keyboard dispatch
  var activeCtl = null;
  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea, select')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (activeCtl && activeCtl.keys) activeCtl.keys(e);
  });

  // ================= session runner =================
  var session = null;
  function startSession(cfg) {
    // cfg: { title, sources: [src], mode: 'normal'|'lightning', back: '#/...', onEnd }
    if (!cfg.sources.length) { toast('No questions match those filters yet.'); return; }
    session = { title: cfg.title, sources: cfg.sources, idx: 0, results: [], xp: 0, combo: 0, maxCombo: 0, mode: cfg.mode || 'normal', back: cfg.back || '#/practice', cfg: cfg, started: Date.now() };
    if (location.hash !== '#/quiz') location.hash = '#/quiz'; else route();
  }
  function viewQuiz() {
    if (!session) { location.hash = '#/practice'; return; }
    if (session.mode === 'lightning') return viewLightning();
    var s = session;
    if (s.idx >= s.sources.length) return viewResults();
    var q = instantiate(s.sources[s.idx]);
    s.current = q;
    app.innerHTML = '<div class="quiz-wrap"><div class="quiz-top"><a class="btn btn-sm btn-ghost" href="' + s.back + '">✕</a><div class="progress"><i style="width:' + pct(s.idx, s.sources.length) + '%"></i></div><span class="small muted mono">' + (s.idx + 1) + '/' + s.sources.length + '</span>' + (s.combo >= 3 ? '<span class="combo">🔥×' + s.combo + '</span>' : '') + '</div><div class="small muted" style="margin-bottom:8px">' + esc(s.title) + '</div><div id="qmount"></div></div>';
    activeCtl = renderQuestion(q, document.getElementById('qmount'), {
      onAnswered: function (frac) { afterAnswer(q, frac); },
      onNext: function () { s.idx++; viewQuiz(); window.scrollTo({ top: 0 }); },
      nextLabel: s.idx + 1 >= s.sources.length ? 'See results →' : 'Next →'
    });
  }
  function afterAnswer(q, frac) {
    var s = session;
    record(q, frac);
    var good = frac >= 0.999;
    s.combo = good ? s.combo + 1 : 0; s.maxCombo = Math.max(s.maxCombo, s.combo);
    var gained = Math.round(10 * (q.difficulty || 1) * frac + (good && s.combo >= 3 ? Math.min(10, s.combo) : 0));
    if (q.type === 'steps' || q.type === 'grid') gained += Math.round(10 * frac);
    var before = levelInfo(S.xp).lvl;
    S.xp += gained; s.xp += gained;
    s.results.push({ q: q, frac: frac });
    if (q.classTitle && good) S.classDone[q.id] = true;
    save(); renderHud();
    var after = levelInfo(S.xp);
    if (after.lvl > before) toast('⭐ Level up! You are now Lv ' + after.lvl + ' · ' + after.title, 3000);
    checkAchievements();
  }
  function viewResults() {
    var s = session;
    var n = s.results.length, score = s.results.reduce(function (a, r) { return a + r.frac; }, 0);
    var perfect = n >= 10 && s.results.every(function (r) { return r.frac >= 0.999; });
    if (perfect) { S.ach.perfect = S.ach.perfect || Date.now(); save(); }
    var p = pct(score, n);
    var msg = p >= 90 ? 'Outstanding — interview-ready.' : p >= 75 ? 'Strong work. Review the misses below.' : p >= 50 ? 'Getting there — the misses are your best study material.' : 'Tough round. Read the explanations, then try a Learn lesson.';
    app.innerHTML = '<div class="quiz-wrap"><div class="card results"><div class="small muted">' + esc(s.title) + '</div><div class="big-score">' + p + '%</div><p class="muted">' + msg + '</p>' +
      '<div class="row" style="justify-content:center;gap:8px;margin-bottom:6px"><span class="pill">✔ ' + s.results.filter(function (r) { return r.frac >= 0.999; }).length + '/' + n + ' fully correct</span><span class="pill">⭐ +' + s.xp + ' XP</span><span class="pill">🔥 best combo ' + s.maxCombo + '</span></div>' +
      '<div class="row" style="justify-content:center;margin-top:14px"><button class="btn btn-primary" id="again">Play again</button>' + (s.results.some(function (r) { return r.frac < 0.999; }) ? '<button class="btn" id="redo">Retry misses</button>' : '') + '<a class="btn" href="#/home">Home</a></div>' +
      '<div class="review-list">' + s.results.map(function (r, i) { var ok = r.frac >= 0.999; return '<details class="review-item ' + (ok ? 'ok' : 'no') + '" style="display:block"><summary style="cursor:pointer;display:flex;gap:10px"><span class="mark">' + (ok ? '✓' : (r.frac > 0 ? '½' : '✗')) + '</span><span>' + esc(strip(r.q.prompt).slice(0, 140)) + (strip(r.q.prompt).length > 140 ? '…' : '') + '</span></summary><div class="small" style="margin-top:8px">' + (r.q.explain || '') + '</div></details>'; }).join('') + '</div></div></div>';
    document.getElementById('again').addEventListener('click', function () { var c = s.cfg; if (c.rebuild) c.sources = c.rebuild(); startSession(c); });
    var redo = document.getElementById('redo');
    if (redo) redo.addEventListener('click', function () {
      var miss = s.results.map(function (r, i) { return r.frac < 0.999 ? s.sources[i] : null; }).filter(Boolean);
      startSession({ title: 'Retry misses', sources: miss, back: s.back });
    });
    activeCtl = null;
  }

  // ================= lightning round =================
  function lightningSources() {
    var st = staticSources({ types: ['mc', 'tf'] });
    var gs = GENS.filter(function (g) { return g.family === 'tx'; }).map(function (g) { return src('gen', g, { variant: pick(['single', 'tf']) }); });
    var gl = ['gloss-term', 'gloss-def'].filter(function (id) { return GEN_BY_ID[id]; }).map(function (id) { return src('gen', GEN_BY_ID[id]); });
    var out = [];
    for (var i = 0; i < 80; i++) { var r = Math.random(); out.push(r < 0.55 && st.length ? pick(st) : r < 0.85 ? pick(gs) : pick(gl)); }
    return out;
  }
  function viewLightning() {
    var s = session;
    if (!s.deadline) { s.deadline = Date.now() + 90000; s.correct = 0; }
    var left = Math.max(0, Math.round((s.deadline - Date.now()) / 1000));
    if (left <= 0 || s.idx >= s.sources.length) return endLightning();
    var q = instantiate(s.sources[s.idx]);
    if (q.type !== 'mc' && q.type !== 'tf') { s.idx++; return viewLightning(); }
    app.innerHTML = '<div class="quiz-wrap"><div class="quiz-top"><a class="btn btn-sm btn-ghost" href="#/practice">✕</a><span class="timer" id="timer">' + left + 's</span><div class="spacer"></div><span class="pill">⚡ ' + s.correct + ' correct</span>' + (s.combo >= 3 ? '<span class="combo">🔥×' + s.combo + '</span>' : '') + '</div><div id="qmount"></div></div>';
    clearInterval(s.tick);
    s.tick = setInterval(function () {
      var l = Math.max(0, Math.round((s.deadline - Date.now()) / 1000));
      var t = document.getElementById('timer'); if (t) { t.textContent = l + 's'; t.classList.toggle('low', l <= 10); }
      if (l <= 0) { clearInterval(s.tick); endLightning(); }
    }, 250);
    activeCtl = renderQuestion(q, document.getElementById('qmount'), { fast: true,
      onAnswered: function (frac) { afterAnswer(q, frac); if (frac >= 0.999) s.correct++; },
      onNext: function () { if (session !== s || location.hash !== '#/quiz') return; s.idx++; viewLightning(); } });
  }
  function endLightning() {
    var s = session; clearInterval(s.tick);
    if (s.ended) return; s.ended = true;
    var best = S.best.lightning || 0, isBest = s.correct > best;
    if (isBest) { S.best.lightning = s.correct; save(); }
    checkAchievements();
    var misses = s.results.filter(function (r) { return r.frac < 0.999; });
    app.innerHTML = '<div class="quiz-wrap"><div class="card results"><div class="small muted">⚡ Lightning Round</div><div class="big-score">' + s.correct + '</div><p class="muted">correct answers in 90 seconds' + (isBest ? ' — <b>new personal best!</b>' : ' · best ' + best) + '</p><div class="row" style="justify-content:center"><button class="btn btn-primary" id="again">Go again</button><a class="btn" href="#/home">Home</a></div>' +
      (misses.length ? '<h3 style="margin-top:20px;text-align:left">Review your misses</h3><div class="review-list">' + misses.map(function (r) { return '<details class="review-item no" style="display:block"><summary style="cursor:pointer">' + esc(strip(r.q.prompt).slice(0, 160)) + '</summary><div class="small" style="margin-top:8px">' + (r.q.type === 'mc' ? '<b>Answer:</b> ' + r.q.choices[r.q.answer] + '<br>' : '<b>Answer:</b> ' + (r.q.answer ? 'True' : 'False') + '<br>') + (r.q.explain || '') + '</div></details>'; }).join('') + '</div>' : '') + '</div></div>';
    document.getElementById('again').addEventListener('click', function () { startSession({ title: 'Lightning Round', sources: lightningSources(), mode: 'lightning' }); });
    activeCtl = null;
  }

  // ================= term match blitz =================
  function viewTermMatch() {
    var pool = GLOSS.filter(function (g) { return g.def.length < 150; });
    var rounds = 4, per = 5, round = 0, start = Date.now(), penalties = 0, misses = [];
    function next() {
      if (round >= rounds) return done();
      var set = G.sample(pool, per);
      var defs = shuffle(set.slice());
      var selT = null, matched = 0;
      app.innerHTML = '<div class="quiz-wrap"><div class="quiz-top"><a class="btn btn-sm btn-ghost" href="#/practice">✕</a><div class="progress"><i style="width:' + pct(round, rounds) + '%"></i></div><span class="timer" id="tm">0.0s</span></div><div class="card"><h3>🧩 Term Match · round ' + (round + 1) + '/' + rounds + '</h3><p class="small muted">Tap a term, then its definition. Wrong pairs add a 3-second penalty.</p><div class="match"><div class="match-col L">' + set.map(function (g, i) { return '<button class="match-item" data-i="' + i + '"><b>' + esc(g.term) + '</b></button>'; }).join('') + '</div><div class="match-col R">' + defs.map(function (g) { return '<button class="match-item" data-t="' + esc(g.term) + '">' + g.def + '</button>'; }).join('') + '</div></div></div></div>';
      var Ls = app.querySelectorAll('.L .match-item'), Rs = app.querySelectorAll('.R .match-item');
      Ls.forEach(function (b) { b.addEventListener('click', function () { if (b.disabled) return; Ls.forEach(function (z) { z.classList.remove('sel'); }); b.classList.add('sel'); selT = +b.dataset.i; }); });
      Rs.forEach(function (b) { b.addEventListener('click', function () {
        if (b.disabled || selT == null) return;
        var g = set[selT];
        if (b.dataset.t === g.term) { b.classList.add('right'); Ls[selT].classList.add('right'); Ls[selT].classList.remove('sel'); b.disabled = true; Ls[selT].disabled = true; selT = null; matched++; if (matched === per) { round++; setTimeout(next, 350); } }
        else { penalties += 3; misses.push(g.term); b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 500); toast('+3s penalty', 800); }
      }); });
    }
    var tick = setInterval(function () { var t = document.getElementById('tm'); if (!t) { clearInterval(tick); return; } t.textContent = ((Date.now() - start) / 1000 + penalties).toFixed(1) + 's'; }, 100);
    function done() {
      clearInterval(tick);
      var time = Math.round(((Date.now() - start) / 1000 + penalties) * 10) / 10;
      var best = S.best.termmatch, isBest = best == null || time < best;
      if (isBest) S.best.termmatch = time;
      S.xp += 40; S.ach.termmatch = S.ach.termmatch || Date.now(); save(); renderHud(); checkAchievements();
      var uniq = misses.filter(function (m, i) { return misses.indexOf(m) === i; });
      app.innerHTML = '<div class="quiz-wrap"><div class="card results"><div class="small muted">🧩 Term Match</div><div class="big-score">' + time + 's</div><p class="muted">' + (rounds * per) + ' terms matched' + (isBest ? ' — <b>new best time!</b>' : ' · best ' + best + 's') + ' · +40 XP</p><div class="row" style="justify-content:center"><button class="btn btn-primary" id="again">Play again</button><a class="btn" href="#/glossary">Glossary</a></div>' +
        (uniq.length ? '<h3 style="text-align:left;margin-top:18px">Terms to review</h3><div class="review-list">' + uniq.map(function (t) { var g = GLOSS_BY[t.toLowerCase()]; return '<div class="review-item no"><span><b>' + esc(g.term) + '</b>: ' + g.def + '</span></div>'; }).join('') + '</div>' : '') + '</div></div>';
      document.getElementById('again').addEventListener('click', viewTermMatch);
    }
    activeCtl = null;
    next();
  }

  // ================= flashcards =================
  function viewFlashcards(filter) {
    filter = filter || 'all';
    var pool = GLOSS.filter(function (g) { return filter === 'all' || g.statement === filter; });
    var now = Date.now();
    var deck = weightedSample(pool, function (g) { var st = S.gloss[g.term]; if (!st) return 2; return st.due <= now ? 6 : 0.2 / (st.box + 1); }, Math.min(20, pool.length));
    var i = 0, again = 0, good = 0;
    function show() {
      if (i >= deck.length) {
        S.xp += 15; save(); renderHud(); checkAchievements();
        app.innerHTML = '<div class="quiz-wrap"><div class="card results"><div class="big-score">🃏</div><h2>Deck complete</h2><p class="muted">' + good + ' known · ' + again + ' to review again · +15 XP</p><div class="row" style="justify-content:center"><button class="btn btn-primary" id="more">Another deck</button><a class="btn" href="#/practice">Practice</a></div></div></div>';
        document.getElementById('more').addEventListener('click', function () { viewFlashcards(filter); });
        return;
      }
      var g = deck[i];
      app.innerHTML = '<div class="quiz-wrap"><div class="quiz-top"><a class="btn btn-sm btn-ghost" href="#/practice">✕</a><div class="progress"><i style="width:' + pct(i, deck.length) + '%"></i></div><span class="small muted mono">' + (i + 1) + '/' + deck.length + '</span></div>' +
        '<div class="chips" style="justify-content:center;margin-bottom:14px">' + ['all', 'is', 'bs', 'cfs', 'ratios', 'general'].map(function (f) { return '<button class="chip' + (f === filter ? ' on' : '') + '" data-f="' + f + '">' + (f === 'all' ? 'All' : STMT_NAMES[f]) + '</button>'; }).join('') + '</div>' +
        '<div class="flash"><div class="flash-card" id="fc"><div class="flash-face"><span class="tagline">' + esc(STMT_NAMES[g.statement]) + (g.section ? ' · ' + esc(g.section) : '') + '</span><h2 style="margin-top:12px">' + esc(g.term) + '</h2>' + (g.abbr ? '<div class="muted">' + esc(g.abbr) + '</div>' : '') + '<p class="small faint" style="margin-top:18px">Tap or press Space to flip</p></div>' +
        '<div class="flash-face back"><h3>' + esc(g.term) + '</h3><div class="def">' + g.def + '</div>' + (g.formula ? '<div class="formula" style="margin-top:10px">' + g.formula + '</div>' : '') + (g.example ? '<div class="small muted" style="margin-top:8px">e.g. ' + g.example + '</div>' : '') + '</div></div></div>' +
        '<div class="row" style="justify-content:center;margin-top:18px"><button class="btn" id="again">↺ Again <span class="kbd">1</span></button><button class="btn" id="hard">Hard <span class="kbd">2</span></button><button class="btn btn-primary" id="good">Got it <span class="kbd">3</span></button></div></div>';
      var fc = document.getElementById('fc');
      fc.addEventListener('click', function () { fc.classList.toggle('flipped'); });
      on(app, '[data-f]', 'click', function (e) { viewFlashcards(e.currentTarget.dataset.f); });
      function grade(level) {
        var st = S.gloss[g.term] || { box: 0, due: 0 };
        if (level === 0) { st.box = 0; again++; deck.push(g); } else if (level === 1) { st.box = Math.max(1, st.box); good++; } else { st.box = Math.min(st.box + 1, INTERVALS.length - 1); good++; }
        st.due = Date.now() + INTERVALS[st.box] * 86400000;
        S.gloss[g.term] = st; S.ach.cards = (S.ach.cards || 0) + 1; save();
        i++; show();
      }
      document.getElementById('again').addEventListener('click', function () { grade(0); });
      document.getElementById('hard').addEventListener('click', function () { grade(1); });
      document.getElementById('good').addEventListener('click', function () { grade(2); });
      activeCtl = { keys: function (e) { if (e.key === ' ') { e.preventDefault(); fc.classList.toggle('flipped'); } if (e.key === '1') grade(0); if (e.key === '2') grade(1); if (e.key === '3') grade(2); } };
    }
    show();
  }

  // ================= achievements =================
  var ACH = [
    { id: 'first', e: '🌱', name: 'First Entry', d: 'Answer your first question', test: function () { return S.total.n >= 1; } },
    { id: 'q100', e: '📒', name: 'Bookkeeper', d: 'Answer 100 questions', test: function () { return S.total.n >= 100; } },
    { id: 'q500', e: '📚', name: 'Controller', d: 'Answer 500 questions', test: function () { return S.total.n >= 500; } },
    { id: 'q1500', e: '🏛️', name: 'Chief Accountant', d: 'Answer 1,500 questions', test: function () { return S.total.n >= 1500; } },
    { id: 'streak3', e: '🔥', name: 'Warming Up', d: '3-day streak', test: function () { return streakCount() >= 3; } },
    { id: 'streak7', e: '🚀', name: 'Habit Formed', d: '7-day streak', test: function () { return streakCount() >= 7; } },
    { id: 'alltopics', e: '🧭', name: 'Explorer', d: 'Answer a question in every topic', test: function () { return FSQ.TOPICS.every(function (t) { return S.topics[t.id] && S.topics[t.id].n > 0; }); } },
    { id: 'master1', e: '🎓', name: 'Specialist', d: 'Reach 80% mastery in any topic', test: function () { return FSQ.TOPICS.some(function (t) { return mastery(t.id) >= 80; }); } },
    { id: 'masterall', e: '👑', name: 'Three-Statement Master', d: '80% mastery in every topic', test: function () { return FSQ.TOPICS.every(function (t) { return mastery(t.id) >= 80; }); } },
    { id: 'perfect', e: '💯', name: 'Clean Audit', d: 'Perfect session of 10+ questions', test: function () { return !!S.ach.perfect; } },
    { id: 'light15', e: '⚡', name: 'Speed Analyst', d: '15+ in a Lightning Round', test: function () { return (S.best.lightning || 0) >= 15; } },
    { id: 'light25', e: '🌩️', name: 'Human Calculator', d: '25+ in a Lightning Round', test: function () { return (S.best.lightning || 0) >= 25; } },
    { id: 'lessons', e: '📖', name: 'Well Read', d: 'Open every lesson', test: function () { return FSQ.lessons.every(function (l) { return S.lessons[l.id]; }); } },
    { id: 'cards', e: '🃏', name: 'Flash Memory', d: 'Review 100 flashcards', test: function () { return (S.ach.cards || 0) >= 100; } },
    { id: 'match', e: '🧩', name: 'Vocab Sprinter', d: 'Finish a Term Match', test: function () { return !!S.ach.termmatch; } },
    { id: 'class', e: '📄', name: 'Problem Set Pro', d: 'Ace every class problem', test: function () { return G.classProblems.every(function (p) { return S.classDone[p.id]; }); } },
    { id: 'lvl5', e: '⭐', name: 'Associate', d: 'Reach level 5', test: function () { return levelInfo(S.xp).lvl >= 5; } },
    { id: 'lvl10', e: '🌟', name: 'Partner', d: 'Reach level 10', test: function () { return levelInfo(S.xp).lvl >= 10; } }
  ];
  function checkAchievements() {
    S.got = S.got || {};
    ACH.forEach(function (a) { if (!S.got[a.id] && a.test()) { S.got[a.id] = Date.now(); toast(a.e + ' Achievement unlocked: <b>' + a.name + '</b>', 3000); } });
    save();
  }

  // ================= views =================
  function setNav(name) {
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('active', a.dataset.nav === name); });
  }

  function dueCount() {
    var now = Date.now(), n = 0;
    for (var id in S.items) if (S.items[id].due <= now) n++;
    return n;
  }

  var MODES = [
    { id: 'smart', ico: '🧠', name: 'Smart Review', d: 'Spaced repetition: brings back what you\'re about to forget and targets your weakest topics.', tag: 'Best daily' },
    { id: 'lab', ico: '🔗', name: '3-Statement Lab', d: 'Walk any transaction through IS → CFS → BS with fresh numbers every time.', tag: 'Core skill' },
    { id: 'class', ico: '📄', name: 'Class Problem Sets', d: 'Every question from your two class problem sets as click-through walkthroughs.' },
    { id: 'builder', ico: '🏗️', name: 'Statement Builder', d: 'Build income statements, balance sheets and cash flow statements from activities.' },
    { id: 'custom', ico: '🎛️', name: 'Custom Practice', d: 'Pick topics, question types, difficulty and length.' },
    { id: 'lightning', ico: '⚡', name: 'Lightning Round', d: '90 seconds. As many as you can. Beat your best.' },
    { id: 'termmatch', ico: '🧩', name: 'Term Match', d: 'Race to match terms with definitions.' },
    { id: 'flash', ico: '🃏', name: 'Flashcards', d: 'Every glossary term, with spaced repetition.' },
    { id: 'mistakes', ico: '🩹', name: 'Mistake Review', d: 'Re-try the questions you\'ve missed until they stick.' }
  ];
  function modeCards(ids) {
    return MODES.filter(function (m) { return !ids || ids.indexOf(m.id) >= 0; }).map(function (m) {
      var extra = m.id === 'smart' ? ' · ' + dueCount() + ' due' : m.id === 'mistakes' ? ' · ' + S.mistakes.length + ' saved' : m.id === 'lightning' && S.best.lightning ? ' · best ' + S.best.lightning : '';
      return '<button class="card mode" data-mode="' + m.id + '"><span class="ico">' + m.ico + '</span>' + (m.tag ? '<span class="tag">' + m.tag + '</span>' : '') + '<h3>' + m.name + '</h3><p>' + m.d + '<span class="faint">' + extra + '</span></p></button>';
    }).join('');
  }
  function bindModes(root) {
    on(root, '[data-mode]', 'click', function (e) { launchMode(e.currentTarget.dataset.mode); });
  }
  function launchMode(id) {
    if (id === 'smart') startSession({ title: '🧠 Smart Review', sources: smartSession(15), back: '#/home', rebuild: function () { return smartSession(15); } });
    else if (id === 'lab') location.hash = '#/lab';
    else if (id === 'class') location.hash = '#/class';
    else if (id === 'builder') location.hash = '#/builder';
    else if (id === 'custom') location.hash = '#/custom';
    else if (id === 'lightning') startSession({ title: 'Lightning Round', sources: lightningSources(), mode: 'lightning' });
    else if (id === 'termmatch') location.hash = '#/termmatch';
    else if (id === 'flash') location.hash = '#/flashcards';
    else if (id === 'mistakes') {
      var srcs = S.mistakes.slice(0, 20).map(function (id) { return STATIC_BY_ID[id] ? src('static', STATIC_BY_ID[id]) : GEN_BY_ID[id] ? src('gen', GEN_BY_ID[id]) : null; }).filter(Boolean);
      if (!srcs.length) { toast('No mistakes saved yet — nice! Try Smart Review.'); return; }
      startSession({ title: '🩹 Mistake Review', sources: shuffle(srcs), back: '#/practice' });
    }
  }

  function viewHome() {
    setNav('home');
    var li = levelInfo(S.xp), today = S.days[todayKey()] || { n: 0, c: 0 };
    var totalQ = STATIC.length;
    app.innerHTML =
      '<section class="hero"><div><h1>Master the three financial statements</h1><p>Learn every line of the income statement, balance sheet and cash flow statement, then drill walkthroughs until they\'re automatic. ' + totalQ + ' hand-written questions plus ' + GENS.length + ' generators that make new problems with fresh numbers every time.</p><div class="row"><button class="btn btn-primary btn-lg" data-mode="smart">▶ Start Smart Review</button><a class="btn btn-ghost" href="#/learn">📘 Learn first</a></div></div>' +
      '<div class="hero-stats"><div class="hero-stat"><b>Lv ' + li.lvl + '</b><span>' + li.title + ' · ' + li.into + '/' + li.need + ' XP</span></div><div class="hero-stat"><b>🔥 ' + streakCount() + '</b><span>day streak</span></div><div class="hero-stat"><b>' + Math.min(today.n, DAILY_GOAL) + '/' + DAILY_GOAL + '</b><span>today\'s goal</span></div><div class="hero-stat"><b>' + pct(S.total.c, S.total.n) + '%</b><span>accuracy · ' + S.total.n + ' answered</span></div></div></section>' +
      '<div class="section"><div class="section-title"><h2>Recommended path</h2><span class="muted small">Do these in order, then keep up Smart Review daily</span></div><div class="card"><ol class="list-plain" style="counter-reset:a">' +
      pathStep(1, 'Read the lessons', 'Start with Foundations, then the Income Statement, Balance Sheet and Cash Flow lessons. Tap any line of a sample statement to see its definition.', '#/learn', FSQ.lessons.filter(function (l) { return S.lessons[l.id]; }).length + '/' + FSQ.lessons.length + ' opened') +
      pathStep(2, 'Learn the vocabulary', 'Flashcards and Term Match cover all ' + GLOSS.length + ' glossary terms.', '#/flashcards', Object.keys(S.gloss).length + ' cards seen') +
      pathStep(3, 'Drill the 3-Statement Lab', 'Walk each transaction type (accruals, write-downs, SBC, PIK…) through all three statements.', '#/lab', '') +
      pathStep(4, 'Redo your class problem sets', 'Every question from both class problem sets, as walkthroughs.', '#/class', Object.keys(S.classDone).length + '/' + G.classProblems.length + ' aced') +
      pathStep(5, 'Smart Review every day', 'About 15 questions a day. Spaced repetition brings misses back right before you\'d forget them.', null, dueCount() + ' due now') +
      '</ol></div></div>' +
      '<div class="section"><div class="section-title"><h2>Game modes</h2></div><div class="grid grid-3">' + modeCards() + '</div></div>' +
      '<div class="section"><div class="section-title"><h2>Topic mastery</h2><a class="small" href="#/stats">Details →</a></div><div class="grid grid-2">' + FSQ.TOPICS.map(topicCard).join('') + '</div></div>';
    bindModes(app);
    on(app, '[data-topic]', 'click', function (e) { var t = e.currentTarget.dataset.topic; startSession({ title: TOPIC[t].icon + ' ' + TOPIC[t].name, sources: topicSession(t, 12), back: '#/home', rebuild: function () { return topicSession(t, 12); } }); });
    on(app, '[data-path]', 'click', function (e) { var h = e.currentTarget.dataset.path; if (h === 'smart') launchMode('smart'); else location.hash = h; });
  }
  function pathStep(n, title, d, href, meta) {
    return '<li style="display:flex;gap:12px;align-items:flex-start;cursor:pointer" data-path="' + (href || 'smart') + '"><span class="step-n" style="background:var(--accent-soft);color:var(--accent)">' + n + '</span><div style="flex:1"><b>' + title + '</b> <span class="faint small">' + meta + '</span><div class="small muted">' + d + '</div></div><span class="faint">›</span></li>';
  }
  function topicCard(t) {
    var m = mastery(t.id), tp = S.topics[t.id] || { n: 0 };
    var nq = STATIC.filter(function (q) { return q.topic === t.id; }).length, ng = GENS.filter(function (g) { return g.topic === t.id; }).length;
    return '<div class="card topic-card" data-topic="' + t.id + '"><div class="topic-ico">' + t.icon + '</div><div style="flex:1;min-width:0"><div class="row" style="justify-content:space-between"><b>' + t.name + '</b><span class="small muted">' + m + '%</span></div><div class="bar" style="margin:6px 0"><i style="width:' + m + '%"></i></div><div class="tiny faint">' + tp.n + ' answered · ' + nq + ' questions + ' + ng + ' generators</div></div></div>';
  }
  function topicSession(t, n) {
    var st = weightedSample(staticSources({ topics: [t] }), function (s) { return srsWeight(s.ref.id, t); }, Math.round(n * 0.65));
    var gs = weightedSample(genSources({ topics: [t], exclude: ['gloss-match'] }), function (s) { return srsWeight(s.ref.id, t); }, n - st.length);
    var out = st.concat(gs);
    while (out.length < n && gs.length) out.push(pick(gs));
    return shuffle(out);
  }

  function viewPractice() {
    setNav('practice');
    app.innerHTML = '<h1>Practice</h1><p class="muted">Every mode uses only clicking: multiple choice, true/false, select-all, matching, sorting, ordering, dropdown impact grids and step-by-step walkthroughs. Every answer comes with an explanation.</p><div class="grid grid-3">' + modeCards() + '</div>' +
      '<div class="section"><div class="section-title"><h2>Quick topic drills</h2></div><div class="grid grid-2">' + FSQ.TOPICS.map(topicCard).join('') + '</div></div>';
    bindModes(app);
    on(app, '[data-topic]', 'click', function (e) { var t = e.currentTarget.dataset.topic; startSession({ title: TOPIC[t].icon + ' ' + TOPIC[t].name, sources: topicSession(t, 12), back: '#/practice', rebuild: function () { return topicSession(t, 12); } }); });
  }

  function viewCustom() {
    setNav('practice');
    var cfg = S.settings.custom || { topics: FSQ.TOPICS.map(function (t) { return t.id; }), types: ['mc', 'tf', 'multi', 'match', 'sort', 'order', 'gen'], diffs: [1, 2, 3], len: 20 };
    function chipRow(name, items, selected) { return '<div class="chips" data-group="' + name + '">' + items.map(function (it) { return '<button class="chip' + (selected.indexOf(it[0]) >= 0 ? ' on' : '') + '" data-v="' + it[0] + '">' + it[1] + '</button>'; }).join('') + '</div>'; }
    app.innerHTML = '<div class="quiz-wrap"><a href="#/practice" class="small">← Practice</a><h1>Custom Practice</h1><div class="card">' +
      '<div class="setup-group"><label>Topics</label>' + chipRow('topics', FSQ.TOPICS.map(function (t) { return [t.id, t.icon + ' ' + t.short]; }), cfg.topics) + '</div>' +
      '<div class="setup-group"><label>Question types</label>' + chipRow('types', [['mc', 'Multiple choice'], ['tf', 'True/False'], ['multi', 'Select all'], ['match', 'Matching'], ['sort', 'Sorting'], ['order', 'Ordering'], ['gen', '🎲 Generated numeric drills']], cfg.types) + '</div>' +
      '<div class="setup-group"><label>Difficulty</label>' + chipRow('diffs', [[1, '● Recall'], [2, '●● Apply'], [3, '●●● Tricky']], cfg.diffs) + '</div>' +
      '<div class="setup-group"><label>Length</label>' + chipRow('len', [[10, '10'], [20, '20'], [30, '30'], [50, '50']], [cfg.len]) + '</div>' +
      '<div class="row"><span class="muted small" id="avail"></span><span class="spacer"></span><button class="btn btn-primary btn-lg" id="go">Start</button></div></div></div>';
    function readCfg() {
      var g = function (n) { return [].map.call(app.querySelectorAll('[data-group="' + n + '"] .chip.on'), function (c) { return c.dataset.v; }); };
      return { topics: g('topics'), types: g('types'), diffs: g('diffs').map(Number), len: +(g('len')[0] || 20) };
    }
    function build(c) {
      var st = staticSources({ topics: c.topics, types: c.types, diffs: c.diffs });
      var gs = c.types.indexOf('gen') >= 0 ? genSources({ topics: c.topics, exclude: ['gloss-match'] }) : [];
      return { st: st, gs: gs };
    }
    function updateAvail() { var c = readCfg(), b = build(c); document.getElementById('avail').textContent = b.st.length + ' hand-written questions' + (b.gs.length ? ' + ' + b.gs.length + ' generators (endless)' : '') + ' match'; }
    on(app, '.chip', 'click', function (e) {
      var c = e.currentTarget, grp = c.parentNode.dataset.group;
      if (grp === 'len') c.parentNode.querySelectorAll('.chip').forEach(function (z) { z.classList.remove('on'); });
      c.classList.toggle('on', grp === 'len' ? true : !c.classList.contains('on'));
      updateAvail();
    });
    updateAvail();
    document.getElementById('go').addEventListener('click', function () {
      var c = readCfg(); S.settings.custom = c; save();
      var make = function () {
        var b = build(c);
        var nGen = b.gs.length ? (b.st.length ? Math.round(c.len * 0.35) : c.len) : 0;
        var st = weightedSample(b.st, function (s) { return srsWeight(s.ref.id, s.ref.topic); }, c.len - nGen);
        var gs = []; for (var i = 0; i < nGen + (c.len - nGen - st.length) && b.gs.length; i++) gs.push(pick(b.gs));
        return shuffle(st.concat(gs));
      };
      startSession({ title: '🎛️ Custom Practice', sources: make(), back: '#/custom', rebuild: make });
    });
  }

  function viewLab() {
    setNav('practice');
    var tx = GENS.filter(function (g) { return g.family === 'tx'; });
    var groups = {}; tx.forEach(function (g) { (groups[g.sub] = groups[g.sub] || []).push(g); });
    var fmt = S.settings.labFormat || 'mix';
    app.innerHTML = '<a href="#/practice" class="small">← Practice</a><h1>🔗 3-Statement Lab</h1><p class="muted">The core interview skill: <b>"Walk me through how X affects the three statements."</b> Every problem has new numbers and checks that the balance sheet balances. Use the class default (40% tax) unless a problem says otherwise.</p>' +
      '<div class="card" style="margin-bottom:14px"><div class="setup-group" style="margin-bottom:10px"><label>Format</label><div class="chips" id="fmt">' + [['mix', '🎲 Mixed'], ['steps', '🪜 Step-by-step walkthrough'], ['grid', '📋 Impact grid'], ['single', '🎯 Quick questions']].map(function (f) { return '<button class="chip' + (fmt === f[0] ? ' on' : '') + '" data-f="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="row"><button class="btn btn-primary btn-lg" id="all">▶ Random mix of all ' + tx.length + ' transactions</button><button class="btn" id="special">🧪 Accounting Part 2 topics only</button></div></div>' +
      '<div class="grid grid-2">' + Object.keys(groups).map(function (sub) { return '<div class="card"><h3>' + esc(sub) + '</h3><div class="chips">' + groups[sub].map(function (g) { var it = S.items[g.id]; return '<button class="chip" data-g="' + g.id + '">' + esc(g.name) + (it ? ' <span class="faint">' + pct(it.c, it.n) + '%</span>' : '') + '</button>'; }).join('') + '</div></div>'; }).join('') + '</div>';
    on(app, '#fmt .chip', 'click', function (e) { S.settings.labFormat = e.currentTarget.dataset.f; save(); viewLab(); });
    function variant() { return fmt === 'mix' ? undefined : fmt; }
    function mk(list, n) { return function () { var out = []; for (var i = 0; i < n; i++) out.push(src('gen', pick(list), { variant: variant() })); return out; }; }
    document.getElementById('all').addEventListener('click', function () { var f = mk(tx, 10); startSession({ title: '🔗 3-Statement Lab · mixed', sources: f(), back: '#/lab', rebuild: f }); });
    document.getElementById('special').addEventListener('click', function () { var ids = ['tx-accrued', 'tx-gain-sale', 'tx-ppe-writedown', 'tx-sbc-swap', 'tx-sbc', 'tx-inv-writedown', 'tx-pik', 'tx-loss-sale']; var f = mk(tx.filter(function (g) { return ids.indexOf(g.id) >= 0; }), 10); startSession({ title: '🧪 Accounting Part 2 topics', sources: f(), back: '#/lab', rebuild: f }); });
    on(app, '[data-g]', 'click', function (e) { var g = GEN_BY_ID[e.currentTarget.dataset.g]; var f = mk([g], 5); startSession({ title: '🔗 ' + g.name, sources: f(), back: '#/lab', rebuild: f }); });
  }

  function viewBuilder() {
    setNav('practice');
    var b = GENS.filter(function (g) { return /^build-|^roll-|^sort-|^order-|^ratio-|^match-ratios/.test(g.id); });
    app.innerHTML = '<a href="#/practice" class="small">← Practice</a><h1>🏗️ Statement Builder</h1><p class="muted">Construct statements from raw activities, like the Financial Accounting problem set. Watch for the traps: loans, equipment purchases, dividends and cash timing.</p>' +
      '<div class="row" style="margin-bottom:14px"><button class="btn btn-primary btn-lg" id="all">▶ Mixed builder session</button></div><div class="grid grid-2">' +
      b.map(function (g) { var it = S.items[g.id]; return '<button class="card mode" data-g="' + g.id + '"><span class="tag">' + esc(TOPIC[g.topic].short) + '</span><h3>' + esc(g.name) + '</h3><p>' + esc(g.sub) + (it ? ' · ' + pct(it.c, it.n) + '% accuracy' : '') + '</p></button>'; }).join('') + '</div>';
    var f = function () { var out = []; for (var i = 0; i < 10; i++) out.push(src('gen', pick(b))); return out; };
    document.getElementById('all').addEventListener('click', function () { startSession({ title: '🏗️ Statement Builder', sources: f(), back: '#/builder', rebuild: f }); });
    on(app, '[data-g]', 'click', function (e) { var g = GEN_BY_ID[e.currentTarget.dataset.g]; var ff = function () { return [0, 1, 2, 3, 4].map(function () { return src('gen', g); }); }; startSession({ title: '🏗️ ' + g.name, sources: ff(), back: '#/builder', rebuild: ff }); });
  }

  var SET_NAMES = { 'PS-A': 'Financial Accounting problem set (constructing statements & flow-throughs)', 'PS-B': 'Accounting Part 2 problem set (special transactions)' };
  function viewClass() {
    setNav('practice');
    var sets = {}; G.classProblems.forEach(function (p) { (sets[p.set] = sets[p.set] || []).push(p); });
    app.innerHTML = '<a href="#/practice" class="small">← Practice</a><h1>📄 Class Problem Sets</h1><p class="muted">Your exact class problems, turned into click-through walkthroughs. Once you\'ve aced these, the 3-Statement Lab gives you endless variations with new numbers.</p>' +
      '<div class="row" style="margin-bottom:14px"><button class="btn btn-primary btn-lg" id="all">▶ Do them all in order</button></div>' +
      Object.keys(sets).map(function (k) { return '<h2 style="margin-top:18px">' + esc(SET_NAMES[k]) + '</h2><div class="grid grid-2">' + sets[k].map(function (p) { return '<button class="card mode" data-p="' + p.id + '"><span class="tag">' + (S.classDone[p.id] ? '✓ Aced' : 'Not yet aced') + '</span><h3>' + esc(p.title) + '</h3></button>'; }).join('') + '</div>'; }).join('');
    document.getElementById('all').addEventListener('click', function () { startSession({ title: '📄 Class problem sets', sources: G.classProblems.map(function (p) { return src('class', p); }), back: '#/class' }); });
    on(app, '[data-p]', 'click', function (e) { var p = G.classProblems.filter(function (x) { return x.id === e.currentTarget.dataset.p; })[0]; startSession({ title: '📄 ' + SET_NAMES[p.set], sources: [src('class', p)], back: '#/class' }); });
  }

  // ---------- Learn
  function viewLearn() {
    setNav('learn');
    app.innerHTML = '<h1>📘 Learn</h1><p class="muted">Short, scannable lessons for each part of financial accounting. Every sample statement is interactive: tap a line to see what it means. Each lesson ends with a practice drill.</p><div class="grid grid-2">' +
      FSQ.lessons.map(function (l, i) { return '<a class="card topic-card" href="#/learn/' + l.id + '" style="color:inherit;text-decoration:none"><div class="topic-ico">' + (l.icon || TOPIC[l.topic].icon) + '</div><div style="flex:1"><div class="row" style="justify-content:space-between"><b>' + (i + 1) + '. ' + esc(l.title) + '</b>' + (S.lessons[l.id] ? '<span class="tiny" style="color:var(--good)">✓ read</span>' : '') + '</div><div class="small muted">' + esc(l.summary || '') + '</div><div class="tiny faint" style="margin-top:4px">' + l.sections.length + ' sections · mastery ' + mastery(l.topic) + '%</div></div></a>'; }).join('') + '</div>' +
      '<div class="section card"><h3>📑 Statement cheat sheet</h3>' + cheatSheet() + '</div>';
  }
  function cheatSheet() {
    return '<table class="mini" style="display:table"><tr><th></th><th>Income Statement</th><th>Balance Sheet</th><th>Cash Flow Statement</th></tr>' +
      '<tr><td><b>Question it answers</b></td><td>Was the company profitable over the period?</td><td>What does it own and owe at a single point in time?</td><td>Where did cash come from and go during the period?</td></tr>' +
      '<tr><td><b>Time frame</b></td><td>Period (quarter / year)</td><td>Point in time (last day of the period)</td><td>Period (quarter / year)</td></tr>' +
      '<tr><td><b>Key equation</b></td><td>Revenue − Expenses = Net Income</td><td>Assets = Liabilities + Equity</td><td>CFO + CFI + CFF = Net change in cash</td></tr>' +
      '<tr><td><b>Basis</b></td><td>Accrual</td><td>Accrual (cumulative)</td><td>Cash</td></tr>' +
      '<tr><td><b>Links</b></td><td>Net income → top of CFS and → retained earnings</td><td>Cash balance = beginning cash + net change in cash</td><td>Reconciles NI to cash; explains changes in BS accounts</td></tr></table>';
  }
  function viewLesson(id) {
    setNav('learn');
    var l = FSQ.lessons.filter(function (x) { return x.id === id; })[0];
    if (!l) { location.hash = '#/learn'; return; }
    S.lessons[id] = Date.now(); save(); checkAchievements();
    var idx = FSQ.lessons.indexOf(l), prev = FSQ.lessons[idx - 1], next = FSQ.lessons[idx + 1];
    app.innerHTML = '<div class="lesson"><div class="lesson-nav"><a href="#/learn" class="small">← All lessons</a></div><h1>' + (l.icon || '') + ' ' + esc(l.title) + '</h1><p class="muted">' + esc(l.summary || '') + '</p>' +
      '<div class="toc">' + l.sections.map(function (s, i) { return '<a href="javascript:void 0" data-sec="' + i + '">' + esc(s.heading) + '</a>'; }).join('') + (l.example ? '<a href="javascript:void 0" data-sec="ex">📋 Interactive statement</a>' : '') + '</div>' +
      l.sections.map(function (s, i) { return '<div class="card section-card" id="sec-' + i + '"><h2>' + esc(s.heading) + '</h2>' + s.html + '</div>'; }).join('') +
      (l.example ? '<div class="card section-card" id="sec-ex"><h2>📋 ' + esc(l.example.title || 'Example') + '</h2><p class="small muted">Tap any line marked ⓘ to see its definition.</p>' + stmtTable(l.example) + '</div>' : '') +
      (l.takeaways ? '<div class="card section-card"><h2>✅ Key takeaways</h2><ul>' + l.takeaways.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' : '') +
      (l.pitfalls ? '<div class="card section-card"><h2>⚠️ Common mistakes</h2><ul>' + l.pitfalls.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="card section-card" style="text-align:center"><h3>Ready to test yourself?</h3><div class="row" style="justify-content:center"><button class="btn btn-primary" id="drill">🎯 Practice ' + esc(TOPIC[l.topic].name) + '</button>' + (l.topic === 'link' || l.topic === 'adv' ? '<a class="btn" href="#/lab">🔗 3-Statement Lab</a>' : '') + '<a class="btn" href="#/glossary?s=' + ({ is: 'is', bs: 'bs', cfs: 'cfs', ratios: 'ratios' }[l.topic] || 'general') + '">🔎 Related terms</a></div></div>' +
      '<div class="row" style="justify-content:space-between;margin-top:10px">' + (prev ? '<a class="btn" href="#/learn/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a class="btn btn-primary" href="#/learn/' + next.id + '">' + esc(next.title) + ' →</a>' : '') + '</div></div>';
    on(app, '[data-sec]', 'click', function (e) { var el = document.getElementById('sec-' + e.currentTarget.dataset.sec); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    document.getElementById('drill').addEventListener('click', function () { startSession({ title: TOPIC[l.topic].icon + ' ' + TOPIC[l.topic].name, sources: topicSession(l.topic, 12), back: '#/learn/' + l.id, rebuild: function () { return topicSession(l.topic, 12); } }); });
    bindStmt(app);
    window.scrollTo({ top: 0 });
  }
  function stmtTable(ex) {
    return '<table class="stmt">' + ex.rows.map(function (r) {
      var g = r.term && GLOSS_BY[r.term.toLowerCase()];
      return '<tr class="' + (r.kind || 'line') + (g ? ' has-term' : '') + '"' + (g ? ' data-term="' + esc(g.term) + '"' : '') + '><td>' + esc(r.label) + '</td><td>' + esc(r.value == null ? '' : r.value) + '</td></tr>';
    }).join('') + '</table>';
  }
  function bindStmt(root) {
    on(root, '.stmt tr.has-term', 'click', function (e) {
      var tr = e.currentTarget, nx = tr.nextElementSibling;
      if (nx && nx.classList.contains('defrow')) { nx.remove(); tr.classList.remove('open'); return; }
      var g = GLOSS_BY[tr.dataset.term.toLowerCase()];
      tr.classList.add('open');
      tr.insertAdjacentHTML('afterend', '<tr class="defrow"><td colspan="2"><b>' + esc(g.term) + '</b>' + (g.abbr ? ' (' + esc(g.abbr) + ')' : '') + ': ' + g.def + (g.formula ? '<div class="mono tiny" style="margin-top:4px">' + g.formula + '</div>' : '') + (g.example ? '<div class="tiny muted" style="margin-top:2px">e.g. ' + g.example + '</div>' : '') + '</td></tr>');
    });
  }

  // ---------- Glossary
  function viewGlossary(params) {
    setNav('glossary');
    var filter = (params && params.s) || 'all', query = (params && params.q) || '';
    app.innerHTML = '<h1>🔎 Glossary</h1><p class="muted">' + GLOSS.length + ' terms: every line item on the three statements, plus core concepts and ratios. Each has a short definition.</p>' +
      '<input class="search" id="q" placeholder="Search terms, definitions, formulas…" value="' + esc(query) + '" autocomplete="off">' +
      '<div class="chips" style="margin-top:10px" id="filters">' + ['all', 'is', 'bs', 'cfs', 'ratios', 'general'].map(function (f) { var n = f === 'all' ? GLOSS.length : GLOSS.filter(function (g) { return g.statement === f; }).length; return '<button class="chip' + (f === filter ? ' on' : '') + '" data-f="' + f + '">' + (f === 'all' ? 'All' : STMT_NAMES[f]) + ' <span class="faint">' + n + '</span></button>'; }).join('') + '<span class="spacer"></span><a class="btn btn-sm" href="#/flashcards">🃏 Flashcards</a><a class="btn btn-sm" href="#/termmatch">🧩 Term Match</a></div>' +
      '<div class="gloss-list" id="gl"></div>';
    var input = document.getElementById('q');
    function paint() {
      var qq = input.value.trim().toLowerCase();
      var list = GLOSS.filter(function (g) { return (filter === 'all' || g.statement === filter) && (!qq || (g.term + ' ' + (g.abbr || '') + ' ' + strip(g.def) + ' ' + (g.formula || '') + ' ' + (g.section || '')).toLowerCase().indexOf(qq) >= 0); });
      var html = '', groupKey = null;
      var bySection = filter !== 'all' && !qq;
      if (bySection) {
        var order = []; var map = {};
        list.forEach(function (g) { var k = g.section || 'Other'; if (!map[k]) { map[k] = []; order.push(k); } map[k].push(g); });
        order.forEach(function (k) { html += '<div class="letter">' + esc(k) + '</div>' + map[k].map(termCard).join(''); });
      } else {
        list.forEach(function (g) { var L = g.term.charAt(0).toUpperCase(); if (!qq && L !== groupKey) { groupKey = L; html += '<div class="letter">' + L + '</div>'; } html += termCard(g); });
      }
      document.getElementById('gl').innerHTML = html || '<div class="empty">No terms match “' + esc(qq) + '”.</div>';
    }
    function termCard(g) {
      return '<div class="card term"><h4>' + esc(g.term) + (g.abbr ? '<span class="abbr">' + esc(g.abbr) + '</span>' : '') + '<span class="tagline ' + ({ is: 't-is', bs: 't-bs', cfs: 't-cfs' }[g.statement] || '') + '">' + esc(STMT_NAMES[g.statement]) + '</span></h4>' + (g.section ? '<div class="tiny faint">' + esc(g.section) + '</div>' : '') + '<div class="def">' + g.def + '</div>' + (g.formula ? '<div class="fx">' + g.formula + '</div>' : '') + (g.example ? '<div class="ex">e.g. ' + g.example + '</div>' : '') + '</div>';
    }
    input.addEventListener('input', paint);
    on(app, '#filters .chip', 'click', function (e) { filter = e.currentTarget.dataset.f; app.querySelectorAll('#filters .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.f === filter); }); paint(); });
    paint();
  }

  // ---------- Stats
  function viewStats() {
    setNav('stats');
    var li = levelInfo(S.xp);
    var subs = Object.keys(S.subs).map(function (k) { var v = S.subs[k], p = k.split('|'); return { topic: p[0], sub: p[1], n: v.n, acc: v.c / v.n }; }).filter(function (x) { return x.n >= 3; }).sort(function (a, b) { return a.acc - b.acc; });
    var weeks = 16, cells = '', d = new Date(); d.setDate(d.getDate() - (weeks * 7 - 1));
    for (var i = 0; i < weeks * 7; i++) { var k = todayKey(d), v = S.days[k]; var n = v ? v.n : 0; var a = n === 0 ? 0 : n < 10 ? 0.35 : n < 20 ? 0.6 : n < 40 ? 0.8 : 1; cells += '<i title="' + k + ': ' + n + ' answered" style="' + (n ? 'background:var(--accent);opacity:' + a : '') + '"></i>'; d.setDate(d.getDate() + 1); }
    S.got = S.got || {};
    app.innerHTML = '<h1>📊 Progress</h1>' +
      '<div class="grid grid-4"><div class="card"><div class="muted small">Level</div><div class="stat-num">' + li.lvl + '</div><div class="small muted">' + li.title + '</div><div class="bar" style="margin-top:8px"><i style="width:' + pct(li.into, li.need) + '%"></i></div><div class="tiny faint">' + li.into + '/' + li.need + ' XP</div></div>' +
      '<div class="card"><div class="muted small">Answered</div><div class="stat-num">' + S.total.n + '</div><div class="small muted">' + pct(S.total.c, S.total.n) + '% fully correct</div></div>' +
      '<div class="card"><div class="muted small">Streak</div><div class="stat-num">🔥 ' + streakCount() + '</div><div class="small muted">days in a row</div></div>' +
      '<div class="card"><div class="muted small">Due for review</div><div class="stat-num">' + dueCount() + '</div><div class="small muted">' + Object.keys(S.items).length + ' items tracked</div></div></div>' +
      '<div class="section"><div class="section-title"><h2>Topic mastery</h2><span class="small muted">Recent accuracy, scaled by how much you\'ve practiced</span></div><div class="grid grid-2">' + FSQ.TOPICS.map(topicCard).join('') + '</div></div>' +
      '<div class="section grid grid-2"><div class="card"><h3>🎯 Weakest subtopics</h3>' + (subs.length ? '<ul class="list-plain">' + subs.slice(0, 8).map(function (s) { return '<li class="row"><span style="flex:1">' + TOPIC[s.topic].icon + ' ' + esc(s.sub) + '</span><span class="small muted">' + Math.round(s.acc * 100) + '% · ' + s.n + '</span></li>'; }).join('') + '</ul>' : '<p class="muted small">Answer a few more questions to see your weak spots.</p>') + '</div>' +
      '<div class="card"><h3>📅 Activity (16 weeks)</h3><div class="heat">' + cells + '</div><p class="tiny faint" style="margin-top:8px">Bests: Lightning ' + (S.best.lightning || 0) + ' · Term Match ' + (S.best.termmatch != null ? S.best.termmatch + 's' : '—') + '</p></div></div>' +
      '<div class="section"><div class="section-title"><h2>Achievements</h2><span class="small muted">' + Object.keys(S.got).length + '/' + ACH.length + '</span></div><div class="badge-grid">' + ACH.map(function (a) { return '<div class="ach' + (S.got[a.id] ? ' got' : '') + '"><div class="e">' + a.e + '</div><b>' + a.name + '</b><span>' + a.d + '</span></div>'; }).join('') + '</div></div>' +
      '<div class="section card"><h3>Your data</h3><p class="small muted">Progress is saved in this browser only (localStorage). Export a backup to move it to another device.</p><div class="row"><button class="btn btn-sm" id="exp">⬇ Export progress</button><label class="btn btn-sm">⬆ Import<input type="file" id="imp" accept=".json" hidden></label><span class="spacer"></span><button class="btn btn-sm" id="reset" style="color:var(--bad)">Reset all progress</button></div></div>';
    document.getElementById('exp').addEventListener('click', function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'ledger-lab-progress-' + todayKey() + '.json'; a.click(); });
    document.getElementById('imp').addEventListener('change', function (e) { var f = e.target.files[0]; if (!f) return; f.text().then(function (t) { try { var o = JSON.parse(t); if (!o.items) throw 0; localStorage.setItem(KEY, t); load(); renderHud(); viewStats(); toast('Progress imported'); } catch (err) { toast('That file isn\'t a Ledger Lab backup.'); } }); });
    document.getElementById('reset').addEventListener('click', function () { if (confirm('Reset ALL progress? This cannot be undone.')) { S = defaults(); save(); renderHud(); viewStats(); } });
  }

  // ================= router =================
  function route() {
    pop.hidden = true;
    if (session && session.tick && location.hash !== '#/quiz') clearInterval(session.tick);
    activeCtl = null;
    var h = location.hash.replace(/^#\/?/, '') || 'home';
    var qs = {}; var qi = h.indexOf('?');
    if (qi >= 0) { h.slice(qi + 1).split('&').forEach(function (p) { var kv = p.split('='); qs[kv[0]] = decodeURIComponent(kv[1] || ''); }); h = h.slice(0, qi); }
    var parts = h.split('/');
    switch (parts[0]) {
      case 'home': viewHome(); break;
      case 'learn': parts[1] ? viewLesson(parts[1]) : viewLearn(); break;
      case 'practice': viewPractice(); break;
      case 'custom': viewCustom(); break;
      case 'lab': viewLab(); break;
      case 'builder': viewBuilder(); break;
      case 'class': viewClass(); break;
      case 'glossary': viewGlossary(qs); break;
      case 'flashcards': setNav('practice'); viewFlashcards(); break;
      case 'termmatch': setNav('practice'); viewTermMatch(); break;
      case 'stats': viewStats(); break;
      case 'quiz': setNav('practice'); viewQuiz(); break;
      default: viewHome();
    }
    if (parts[0] !== 'quiz') window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', route);
  renderHud();
  route();
})();
