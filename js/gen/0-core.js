/* Generator core: random helpers, money formatting, 3-statement effect builder, and
   question-variant factories (steps walkthrough, impact grid, single MC, multi, TF). */
(function (root) {
  var FSQ = root.FSQ;
  var G = (FSQ.gen = FSQ.gen || {});

  // ---------- random helpers
  G.rnd = function (lo, hi, step) {
    step = step || 1;
    var n = Math.floor((hi - lo) / step) + 1;
    return lo + step * Math.floor(Math.random() * n);
  };
  G.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  G.chance = function (p) { return Math.random() < p; };
  G.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  G.sample = function (arr, n) { return G.shuffle(arr).slice(0, n); };
  G.r2 = function (x) { return Math.round(x * 100) / 100; };
  G.taxRate = function () { return G.pick([40, 40, 40, 40, 30, 25, 20]); };

  // ---------- formatting
  var MINUS = '−';
  G.num = function (x) {
    x = G.r2(Math.abs(x));
    var s = (Math.round(x) === x) ? String(x) : x.toFixed(2).replace(/0$/, '');
    var parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };
  G.money = function (x) { x = G.r2(x); return (x < 0 ? MINUS : '') + '$' + G.num(x); };
  G.delta = function (x) { x = G.r2(x); if (x === 0) return 'No change'; return (x > 0 ? '+' : MINUS) + '$' + G.num(x); };
  G.pct = function (x, d) { d = d == null ? 1 : d; var v = Math.round(x * Math.pow(10, d)) / Math.pow(10, d); return (v < 0 ? MINUS : '') + Math.abs(v).toFixed(d).replace(/\.0+$/, '') + '%'; };
  G.ratio = function (x, d) { d = d == null ? 2 : d; return (x < 0 ? MINUS : '') + Math.abs(x).toFixed(d) + 'x'; };

  // Build distinct numeric distractors around a correct value from a pool of "mistake" values.
  G.distract = function (correct, pool, n, fmt) {
    n = n || 3; fmt = fmt || G.delta;
    var seen = {}; var out = [];
    var key = function (v) { return fmt(v); };
    seen[key(correct)] = 1;
    G.shuffle(pool).forEach(function (v) {
      if (v == null || isNaN(v)) return;
      v = G.r2(v);
      var k = key(v);
      if (!seen[k] && out.length < n) { seen[k] = 1; out.push(v); }
    });
    var base = Math.abs(correct) || 10;
    var tries = 0;
    while (out.length < n && tries < 60) {
      tries++;
      var mult = G.pick([0.5, 1.5, 2, -1, 0.6, 0.4, 1.4, 0.8, 1.2, 0.25]);
      var v2 = G.r2((correct || base) * mult + (tries > 30 ? G.rnd(1, 9) * (base / 10) : 0));
      var k2 = key(v2);
      if (!seen[k2]) { seen[k2] = 1; out.push(v2); }
    }
    return out;
  };

  // MC from numbers: returns {choices, answer}
  G.numMC = function (correct, pool, fmt, n) {
    fmt = fmt || G.delta;
    var ds = G.distract(correct, pool, n || 3, fmt);
    var vals = G.shuffle([correct].concat(ds));
    return { choices: vals.map(fmt), answer: vals.indexOf(correct) };
  };

  // ---------- 3-statement effect builder
  function sum(list) { return G.r2(list.reduce(function (a, x) { return a + x[1]; }, 0)); }
  function merge(list) {
    var map = {}, order = [];
    list.forEach(function (x) { if (!(x[0] in map)) { map[x[0]] = 0; order.push(x[0]); } map[x[0]] = G.r2(map[x[0]] + x[1]); });
    return order.map(function (k) { return [k, map[k]]; }).filter(function (x) { return x[1] !== 0; });
  }
  G.sum = sum;

  /* o = { rate (percent), taxMode: 'cash'|'payable'|'none', is: [[label, effectOnPretax]],
           cfoAdj: [[label, amt]], cfi: [[..]], cff: [[..]], assets: [[..]], liab: [[..]], equity: [[..]] } */
  G.effect = function (o) {
    var rate = (o.rate || 0) / 100;
    var isLines = (o.is || []).filter(function (x) { return x[1] !== 0; });
    var pretax = sum(isLines);
    var taxMode = o.taxMode || (pretax ? 'cash' : 'none');
    var tax = (taxMode === 'none' || !pretax) ? 0 : G.r2(pretax * rate);
    var ni = G.r2(pretax - tax);
    var cfoAdj = (o.cfoAdj || []).slice();
    var liab = (o.liab || []).slice();
    var assets = (o.assets || []).slice();
    var equity = (o.equity || []).slice();
    if (taxMode === 'deferred' && tax) {
      if (tax < 0) { cfoAdj.push(['Increase in deferred tax asset', tax]); assets.push(['Deferred tax asset', -tax]); }
      else { cfoAdj.push(['Increase in deferred tax liability', tax]); liab.push(['Deferred tax liability', tax]); }
    }
    if (taxMode === 'payable' && tax) {
      cfoAdj.push([tax > 0 ? 'Increase in income taxes payable' : 'Decrease in income taxes payable', tax]);
      liab.push(['Income taxes payable', tax]);
    }
    var cfo = (ni ? [['Net income', ni]] : []).concat(cfoAdj.filter(function (x) { return x[1] !== 0; }));
    var cfi = (o.cfi || []).filter(function (x) { return x[1] !== 0; });
    var cff = (o.cff || []).filter(function (x) { return x[1] !== 0; });
    var CFO = sum(cfo), CFI = sum(cfi), CFF = sum(cff);
    var cash = G.r2(CFO + CFI + CFF);
    assets = merge([['Cash', cash]].concat(assets));
    if (ni) equity.push(['Retained earnings', ni]);
    equity = merge(equity);
    liab = merge(liab);
    var A = sum(assets), L = sum(liab), E = sum(equity);
    if (Math.abs(A - (L + E)) > 0.011) throw new Error('Unbalanced effect: A=' + A + ' L=' + L + ' E=' + E + ' in ' + (o.name || '?'));
    return {
      rate: o.rate, taxMode: taxMode, isLines: isLines, pretax: pretax, tax: tax, ni: ni,
      cfo: cfo, cfi: cfi, cff: cff, CFO: CFO, CFI: CFI, CFF: CFF, cash: cash,
      assets: assets, liab: liab, equity: equity, A: A, L: L, E: E
    };
  };

  G.bsLine = function (e, label) {
    var all = e.assets.concat(e.liab, e.equity);
    for (var i = 0; i < all.length; i++) if (all[i][0] === label) return all[i][1];
    return 0;
  };

  // ---------- explanations
  G.explainEffect = function (e, why) {
    var parts = [];
    if (e.isLines.length) {
      var items = e.isLines.map(function (x) { return x[0] + ' (' + G.delta(x[1]) + ' to pre-tax income)'; }).join(', ');
      var taxTxt = e.tax ? ' Tax at ' + e.rate + '%: tax expense ' + G.delta(e.tax) + (e.taxMode === 'payable' ? ' (recorded as taxes payable, not yet paid)' : e.taxMode === 'deferred' ? ' (a deferred tax item — cash taxes do not change this year)' : ' (cash taxes change by the same amount)') + '.' : '';
      parts.push('<b>Income Statement:</b> ' + items + ' → pre-tax income ' + G.delta(e.pretax) + '.' + taxTxt + ' Net income ' + G.delta(e.ni) + '.');
    } else {
      parts.push('<b>Income Statement:</b> No impact — nothing is earned or incurred as an expense.');
    }
    var cf = [];
    e.cfo.forEach(function (x) { cf.push(x[0] + ' ' + G.delta(x[1])); });
    var cfTxt = '<b>Cash Flow Statement:</b> ' + (cf.length ? 'CFO: ' + cf.join('; ') + ' → CFO ' + G.delta(e.CFO) + '. ' : 'No CFO impact. ');
    if (e.cfi.length) cfTxt += 'CFI: ' + e.cfi.map(function (x) { return x[0] + ' ' + G.delta(x[1]); }).join('; ') + '. ';
    if (e.cff.length) cfTxt += 'CFF: ' + e.cff.map(function (x) { return x[0] + ' ' + G.delta(x[1]); }).join('; ') + '. ';
    cfTxt += 'Net change in cash ' + G.delta(e.cash) + '.';
    parts.push(cfTxt);
    var fmtList = function (l) { return l.length ? l.map(function (x) { return x[0] + ' ' + G.delta(x[1]); }).join(', ') : 'no change'; };
    parts.push('<b>Balance Sheet:</b> Assets: ' + fmtList(e.assets) + '. Liabilities: ' + fmtList(e.liab) + '. Equity: ' + fmtList(e.equity) +
      '. Check: assets ' + G.delta(e.A) + ' = liabilities + equity ' + G.delta(G.r2(e.L + e.E)) + ' ✓');
    var txt = parts.join('<br>');
    if (why) txt = '<i>' + why + '</i><br>' + txt;
    return txt;
  };

  G.bsString = function (lines) {
    var l = lines.filter(function (x) { return x[1] !== 0; });
    if (!l.length) return 'No balance sheet change';
    return l.map(function (x) { return x[0] + ' ' + G.delta(x[1]); }).join('; ');
  };

  // Generate wrong-but-plausible balance sheet descriptions
  G.bsOptions = function (e, base) {
    var correctLines = e.assets.concat(e.liab, e.equity);
    var correct = G.bsString(correctLines);
    var variants = [];
    var mod = function (fn) {
      var copy = correctLines.map(function (x) { return [x[0], x[1]]; });
      var r = fn(copy);
      if (r) variants.push(G.bsString(r));
    };
    // RE uses pre-tax income (forgot taxes)
    if (e.ni && e.pretax) mod(function (c) { c.forEach(function (x) { if (x[0] === 'Retained earnings') x[1] = G.r2(x[1] - e.ni + e.pretax); if (x[0] === 'Cash' && e.taxMode === 'cash') x[1] = G.r2(x[1] + e.tax); }); return c; });
    // Cash = net income (forgot add-backs / working capital)
    if (e.ni && e.cash !== e.ni) mod(function (c) { var f = false; c.forEach(function (x) { if (x[0] === 'Cash') { x[1] = e.ni; f = true; } }); if (!f) c.unshift(['Cash', e.ni]); return c; });
    // Flip sign on cash
    if (e.cash) mod(function (c) { c.forEach(function (x) { if (x[0] === 'Cash') x[1] = -x[1]; }); return c; });
    // Drop a non-cash line
    var nonCash = correctLines.filter(function (x) { return x[0] !== 'Cash' && x[0] !== 'Retained earnings'; });
    if (nonCash.length) mod(function (c) { var drop = G.pick(nonCash)[0]; return c.filter(function (x) { return x[0] !== drop; }); });
    // Flip sign on a non-cash line
    if (nonCash.length) mod(function (c) { var t = G.pick(nonCash)[0]; c.forEach(function (x) { if (x[0] === t) x[1] = -x[1]; }); return c; });
    // Extra wrong line
    mod(function (c) { var extra = G.pick(['Accounts receivable', 'Accounts payable', 'Inventory', 'Deferred revenue', 'Common stock & APIC']); if (c.some(function (x) { return x[0] === extra; })) return null; c.push([extra, base || 10]); return c; });
    // RE uses full amount (ignoring both tax and the line)
    if (base && e.ni) mod(function (c) { c.forEach(function (x) { if (x[0] === 'Retained earnings') x[1] = e.ni > 0 ? base : -base; }); return c; });
    var seen = {}; seen[correct] = 1;
    var wrong = [];
    G.shuffle(variants).forEach(function (v) { if (!seen[v] && wrong.length < 3) { seen[v] = 1; wrong.push(v); } });
    var all = G.shuffle([correct].concat(wrong));
    return { choices: all, answer: all.indexOf(correct) };
  };

  var BS_POOL = ['Cash', 'Accounts receivable', 'Inventory', 'Prepaid expenses', 'PP&E (net)', 'Accounts payable', 'Accrued expenses', 'Deferred revenue', 'Income taxes payable', 'Debt', 'Common stock & APIC', 'Retained earnings', 'Treasury stock'];

  // ---------- question variants from an effect
  function metricPool(e, base) {
    return [e.pretax, -e.pretax, e.ni, -e.ni, e.CFO, -e.CFO, e.cash, -e.cash, base, -base, e.tax, -e.tax, 0, G.r2(e.ni + e.tax), G.r2(e.CFO - e.tax), G.r2(e.cash - e.CFO)];
  }

  G.variants = {
    steps: function (t, e) {
      var steps = [];
      var pool = metricPool(e, t.base);
      var mk = function (statement, prompt, correct, extraPool, explain) {
        var m = G.numMC(correct, (extraPool || []).concat(pool));
        steps.push({ statement: statement, prompt: prompt, choices: m.choices, answer: m.answer, explain: explain });
      };
      if (e.isLines.length) {
        mk('is', 'Income Statement: how does <b>pre-tax income</b> change?', e.pretax, [], e.isLines.map(function (x) { return x[0] + ' ' + G.delta(x[1]); }).join('; ') + ' → pre-tax ' + G.delta(e.pretax) + '.');
        mk('is', 'Income Statement: how does <b>net income</b> change? (tax rate ' + e.rate + '%)', e.ni, [e.pretax], 'Net income = pre-tax × (1 − ' + e.rate + '%) = ' + G.delta(e.pretax) + ' × ' + (1 - e.rate / 100).toFixed(2).replace(/0$/, '') + ' = ' + G.delta(e.ni) + '.');
      } else {
        steps.push({ statement: 'is', prompt: 'Income Statement: what is the impact?', choices: G.shuffle(['No impact on the income statement', 'Revenue increases', 'An expense increases', 'Net income increases by the after-tax amount']), answer: -1, correctText: 'No impact on the income statement', explain: t.noIsWhy || 'Nothing is earned or expensed in this transaction, so the income statement is unchanged.' });
      }
      mk('cfs', 'Cash Flow Statement: what is the change in <b>cash from operations (CFO)</b>?', e.CFO, [], e.cfo.length ? e.cfo.map(function (x) { return x[0] + ' ' + G.delta(x[1]); }).join('; ') + ' → CFO ' + G.delta(e.CFO) + '.' : 'No operating cash flow impact.');
      if (e.cfi.length || e.cff.length) {
        mk('cfs', 'Cash Flow Statement: what is the <b>net change in cash</b> (CFO + CFI + CFF)?', e.cash, [e.CFI, e.CFF, G.r2(e.CFO - e.CFI)],
          'CFO ' + G.delta(e.CFO) + (e.cfi.length ? ', CFI ' + G.delta(e.CFI) + ' (' + e.cfi.map(function (x) { return x[0]; }).join(', ') + ')' : '') + (e.cff.length ? ', CFF ' + G.delta(e.CFF) + ' (' + e.cff.map(function (x) { return x[0]; }).join(', ') + ')' : '') + ' → net change in cash ' + G.delta(e.cash) + '.');
      }
      var bo = G.bsOptions(e, t.base);
      steps.push({ statement: 'bs', prompt: 'Balance Sheet: which set of changes is correct?', choices: bo.choices, answer: bo.answer, explain: G.bsString(e.assets.concat(e.liab, e.equity)) + '. Check: assets ' + G.delta(e.A) + ' = liabilities ' + (e.L ? G.delta(e.L) : '$0') + ' + equity ' + (e.E ? G.delta(e.E) : '$0') + ' ✓' });
      steps.forEach(function (s) { if (s.answer === -1) s.answer = s.choices.indexOf(s.correctText); delete s.correctText; });
      return { type: 'steps', prompt: t.scenario, steps: steps, explain: G.explainEffect(e, t.why), summary: e, difficulty: Math.max(2, t.difficulty || 2) };
    },
    grid: function (t, e) {
      var rows = [];
      var pool = metricPool(e, t.base);
      var add = function (label, statement, v) {
        var ds = G.distract(v, pool.concat([0]), 4, G.delta);
        var vals = [v].concat(ds).sort(function (a, b) { return a - b; });
        var opts = vals.map(G.delta);
        rows.push({ label: label, statement: statement, options: opts, answer: opts.indexOf(G.delta(v)) });
      };
      add('Pre-tax income', 'is', e.pretax);
      add('Net income', 'is', e.ni);
      add('Cash from operations (CFO)', 'cfs', e.CFO);
      if (e.cfi.length || G.chance(0.3)) add('Cash from investing (CFI)', 'cfs', e.CFI);
      if (e.cff.length || G.chance(0.3)) add('Cash from financing (CFF)', 'cfs', e.CFF);
      add('Cash (balance sheet)', 'bs', e.cash);
      e.assets.concat(e.liab, e.equity).forEach(function (x) { if (x[0] !== 'Cash') add(x[0], 'bs', x[1]); });
      if (!e.equity.some(function (x) { return x[0] === 'Retained earnings'; })) add('Retained earnings', 'bs', 0);
      return { type: 'grid', prompt: t.scenario + '<br><br>Fill in the impact on each line.', rows: rows, explain: G.explainEffect(e, t.why), difficulty: Math.max(2, t.difficulty || 2) };
    },
    single: function (t, e) {
      var opts = [
        ['net income', e.ni, 'Net income ' + G.delta(e.ni) + '.'],
        ['cash from operations (CFO)', e.CFO, 'CFO ' + G.delta(e.CFO) + '.'],
        ['the cash balance on the balance sheet', e.cash, 'Cash ' + G.delta(e.cash) + '.']
      ];
      if (e.isLines.length) opts.push(['pre-tax income', e.pretax, 'Pre-tax income ' + G.delta(e.pretax) + '.']);
      e.liab.concat(e.equity, e.assets).forEach(function (x) { if (x[0] !== 'Cash') opts.push([x[0].replace(/^[A-Z](?![A-Z&])/, function (c) { return c.toLowerCase(); }) + ' (balance sheet)', x[1], x[0] + ' ' + G.delta(x[1]) + '.']); });
      if (e.cfi.length) opts.push(['cash from investing (CFI)', e.CFI, 'CFI ' + G.delta(e.CFI) + '.']);
      if (e.cff.length) opts.push(['cash from financing (CFF)', e.CFF, 'CFF ' + G.delta(e.CFF) + '.']);
      var o = G.pick(opts);
      var m = G.numMC(o[1], metricPool(e, t.base));
      return { type: 'mc', prompt: t.scenario + '<br><br>What is the change in <b>' + o[0] + '</b>?', choices: m.choices, answer: m.answer, explain: G.explainEffect(e, t.why), difficulty: t.difficulty || 2 };
    },
    multi: function (t, e) {
      var changed = e.assets.concat(e.liab, e.equity).map(function (x) { return x[0]; });
      var others = BS_POOL.filter(function (x) { return changed.indexOf(x) < 0; });
      var nWrong = Math.max(2, 6 - changed.length);
      var choices = G.shuffle(changed.concat(G.sample(others, nWrong)));
      var answers = choices.map(function (c, i) { return changed.indexOf(c) >= 0 ? i : -1; }).filter(function (i) { return i >= 0; });
      if (!answers.length) return G.variants.single(t, e);
      return { type: 'multi', prompt: t.scenario + '<br><br>Which <b>balance sheet</b> line items change? (select all that apply)', choices: choices, answers: answers, explain: G.explainEffect(e, t.why), difficulty: t.difficulty || 2 };
    },
    tf: function (t, e) {
      var claims = [
        ['net income', e.ni], ['cash', e.cash], ['cash from operations', e.CFO]
      ];
      if (e.isLines.length) claims.push(['pre-tax income', e.pretax]);
      var c = G.pick(claims);
      var truth = G.chance(0.5);
      var shown = c[1];
      if (!truth) { var d = G.distract(c[1], metricPool(e, t.base), 1); shown = d[0]; }
      var verb = shown === 0 ? ' does not change' : (shown > 0 ? ' increases by $' + G.num(shown) : ' decreases by $' + G.num(shown));
      return { type: 'tf', prompt: t.scenario + '<br><br>True or false: ' + c[0] + verb + '.', answer: truth, explain: G.explainEffect(e, t.why), difficulty: t.difficulty || 2 };
    }
  };

  // Register a transaction template as a generator
  G.registerTx = function (def) {
    // def: { id, topic, sub, name, difficulty, make: () => ({scenario, effect inputs..., base, why, noIsWhy}), variants: weights }
    FSQ.addGenerators([{
      id: def.id, topic: def.topic, sub: def.sub, name: def.name, family: 'tx',
      make: function (forceVariant) {
        var t = def.make();
        t.difficulty = t.difficulty || def.difficulty || 2;
        var e = G.effect(t.fx);
        var weights = def.variants || { steps: 3, grid: 2, single: 3, multi: 1, tf: 1 };
        var v = forceVariant;
        if (!v) {
          var tot = 0, k; for (k in weights) tot += weights[k];
          var r = Math.random() * tot;
          for (k in weights) { r -= weights[k]; if (r <= 0) { v = k; break; } }
        }
        var q = G.variants[v](t, e);
        q.id = def.id; q.topic = def.topic; q.sub = def.sub; q.generated = true; q.genName = def.name;
        return q;
      }
    }]);
  };

  // Register a free-form generator
  G.register = function (def) {
    FSQ.addGenerators([{
      id: def.id, topic: def.topic, sub: def.sub, name: def.name, family: def.family || 'build',
      make: function () {
        var q = def.make();
        q.id = def.id; q.topic = q.topic || def.topic; q.sub = q.sub || def.sub; q.generated = true; q.genName = def.name;
        q.difficulty = q.difficulty || def.difficulty || 2;
        return q;
      }
    }]);
  };

  // Company / context names for variety
  G.co = function () {
    return G.pick(['Maple Bikes', 'Orbit Software', 'Harbor Coffee', 'Summit Outfitters', 'Pixel Forge Games', 'Greenleaf Grocers', 'Nova Robotics', 'Bluefin Seafood', 'Cobalt Logistics', 'Juniper Labs', 'Atlas Fitness', 'Lumen Lighting', 'Redwood Furniture', 'Kite Airlines', 'Copper Kettle Bakery', 'Northstar Consulting', 'Velvet Audio', 'Quarry Cement', 'Tidal Surf Co.', 'Ember Restaurants', 'Prism Optics', 'Falcon Drones', 'Willow Pharmacy', 'Granite Builders', 'Sparrow Media']);
  };
})(typeof window !== 'undefined' ? window : globalThis);
