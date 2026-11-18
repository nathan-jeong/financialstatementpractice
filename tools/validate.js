#!/usr/bin/env node
/* Validates content in data/. Usage: node tools/validate.js [data/file.js ...] [--quiet]
   With file args, only those files (plus glossary files) are loaded. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = { console, Math, Date, JSON };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
load(path.join(root, 'js/registry.js'));
const dataDir = path.join(root, 'data');
const only = process.argv.slice(2).filter((a) => a.endsWith('.js')).map((a) => path.basename(a));
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.js') && (!only.length || only.includes(f) || f.startsWith('glossary'))).sort();
for (const f of files) {
  try { load(path.join(dataDir, f)); } catch (e) {
    if (only.length && !only.includes(f)) { console.log('(skipping unfinished ' + f + ')'); continue; }
    console.error('LOAD ERROR in ' + f + ': ' + e.message); process.exit(1);
  }
}
const genDir = path.join(root, 'js/gen');
if (fs.existsSync(genDir)) {
  for (const f of fs.readdirSync(genDir).filter((f) => f.endsWith('.js')).sort()) load(path.join(genDir, f));
}
const FSQ = ctx.FSQ;
const errors = [];
const warn = [];
const topicIds = new Set(FSQ.TOPICS.map((t) => t.id));
const ALLOWED_TAGS = /<\/?(b|i|br|sub|sup)\s*\/?>/gi;
const checkText = (s, where) => {
  if (typeof s !== 'string' || !s.trim()) { errors.push(where + ': empty/missing text'); return; }
  const stripped = s.replace(ALLOWED_TAGS, '');
  if (/<[a-z\/][^>]*>/i.test(stripped)) errors.push(where + ': disallowed HTML tag in "' + s.slice(0, 60) + '"');
};

// ---- questions
const ids = new Set();
const counts = {};
FSQ.questions.forEach((q, i) => {
  const w = 'question ' + (q.id || '#' + i);
  if (!q.id) errors.push(w + ': missing id');
  else if (ids.has(q.id)) errors.push(w + ': duplicate id');
  ids.add(q.id);
  if (!topicIds.has(q.topic)) errors.push(w + ': bad topic ' + q.topic);
  if (![1, 2, 3].includes(q.difficulty)) errors.push(w + ': difficulty must be 1/2/3');
  if (!q.sub) warn.push(w + ': missing sub');
  checkText(q.prompt, w + ' prompt');
  checkText(q.explain, w + ' explain');
  if (q.table) {
    if (!Array.isArray(q.table.rows)) errors.push(w + ': table.rows must be array');
  }
  counts[q.topic] = counts[q.topic] || {};
  counts[q.topic][q.type] = (counts[q.topic][q.type] || 0) + 1;
  switch (q.type) {
    case 'mc':
      if (!Array.isArray(q.choices) || q.choices.length < 3 || q.choices.length > 5) errors.push(w + ': mc needs 3-5 choices');
      else {
        if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length)) errors.push(w + ': bad answer index');
        if (new Set(q.choices.map(String)).size !== q.choices.length) errors.push(w + ': duplicate choices');
        q.choices.forEach((c, j) => checkText(String(c), w + ' choice ' + j));
      }
      break;
    case 'tf':
      if (typeof q.answer !== 'boolean') errors.push(w + ': tf answer must be boolean');
      break;
    case 'multi':
      if (!Array.isArray(q.choices) || q.choices.length < 4) errors.push(w + ': multi needs >=4 choices');
      else if (!Array.isArray(q.answers) || !q.answers.length || q.answers.some((a) => !(a >= 0 && a < q.choices.length))) errors.push(w + ': bad answers');
      else if (new Set(q.choices).size !== q.choices.length) errors.push(w + ': duplicate choices');
      break;
    case 'match':
      if (!Array.isArray(q.pairs) || q.pairs.length < 3 || q.pairs.length > 7) errors.push(w + ': match needs 3-7 pairs');
      else {
        if (new Set(q.pairs.map((p) => p[0])).size !== q.pairs.length) errors.push(w + ': duplicate left items');
        if (new Set(q.pairs.map((p) => p[1])).size !== q.pairs.length) errors.push(w + ': duplicate right items');
      }
      break;
    case 'sort':
      if (!Array.isArray(q.buckets) || q.buckets.length < 2) errors.push(w + ': sort needs >=2 buckets');
      else if (!Array.isArray(q.items) || q.items.length < 3) errors.push(w + ': sort needs items');
      else q.items.forEach((it) => { if (!q.buckets.includes(it[1])) errors.push(w + ': item bucket "' + it[1] + '" not in buckets'); });
      break;
    case 'order':
      if (!Array.isArray(q.items) || q.items.length < 3 || q.items.length > 8) errors.push(w + ': order needs 3-8 items');
      else if (new Set(q.items).size !== q.items.length) errors.push(w + ': duplicate order items');
      break;
    default:
      errors.push(w + ': unknown type ' + q.type);
  }
});

// ---- glossary
const terms = new Set();
FSQ.glossary.forEach((g, i) => {
  const w = 'glossary ' + (g.term || '#' + i);
  if (!g.term) errors.push(w + ': missing term');
  const k = (g.term || '').toLowerCase();
  if (terms.has(k)) errors.push(w + ': duplicate term');
  terms.add(k);
  if (!['is', 'bs', 'cfs', 'general', 'ratios'].includes(g.statement)) errors.push(w + ': bad statement ' + g.statement);
  if (!g.section) warn.push(w + ': missing section');
  checkText(g.def, w + ' def');
});

// ---- lessons
FSQ.lessons.forEach((l, i) => {
  const w = 'lesson ' + (l.id || '#' + i);
  if (!topicIds.has(l.topic)) errors.push(w + ': bad topic');
  if (!Array.isArray(l.sections) || !l.sections.length) errors.push(w + ': no sections');
  if (l.example) (l.example.rows || []).forEach((r) => {
    if (r.term && !terms.has(r.term.toLowerCase())) warn.push(w + ': example term not in glossary: ' + r.term);
  });
});

// ---- generators (smoke test)
let genOk = 0;
(FSQ.generators || []).forEach((g) => {
  for (let k = 0; k < 40; k++) {
    try {
      const q = g.make();
      if (!q || !q.prompt) throw new Error('no prompt');
      genOk++;
    } catch (e) { errors.push('generator ' + g.id + ': ' + e.message); break; }
  }
});

const quiet = process.argv.includes('--quiet');
if (!quiet) {
  console.log('Questions: ' + FSQ.questions.length + '  Glossary: ' + FSQ.glossary.length + '  Lessons: ' + FSQ.lessons.length + '  Generators: ' + (FSQ.generators || []).length);
  Object.keys(counts).forEach((t) => console.log('  ' + t + ': ' + JSON.stringify(counts[t])));
  warn.slice(0, 40).forEach((x) => console.log('WARN ' + x));
  if (warn.length > 40) console.log('... ' + (warn.length - 40) + ' more warnings');
}
if (errors.length) { errors.slice(0, 80).forEach((e) => console.error('ERROR ' + e)); console.error(errors.length + ' error(s)'); process.exit(1); }
console.log('OK');
