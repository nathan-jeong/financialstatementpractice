/* Statement builders (Problem Set 1 style), ratio drills, roll-forwards, classification sorts,
   and glossary-driven questions. */
(function (root) {
  var FSQ = root.FSQ, G = FSQ.gen;
  var R = G.rnd, P = G.pick, $ = G.money;
  var M = function (x) { return $(x); };

  // ============ 1. Build an Income Statement from activities (coffee-shop style) ============
  var BIZ = [
    { name: 'coffee shop', product: 'coffee', inputs: 'coffee beans and milk', equip: 'an espresso machine' },
    { name: 'bakery', product: 'pastries', inputs: 'flour, butter and sugar', equip: 'a commercial oven' },
    { name: 'bike shop', product: 'bicycles', inputs: 'bike inventory', equip: 'a repair stand and tools' },
    { name: 'food truck', product: 'tacos', inputs: 'ingredients', equip: 'a new grill' },
    { name: 'bookstore', product: 'books', inputs: 'books from publishers', equip: 'new shelving' },
    { name: 'pizzeria', product: 'pizzas', inputs: 'dough, cheese and toppings', equip: 'a pizza oven' },
    { name: 'smoothie bar', product: 'smoothies', inputs: 'fruit and yogurt', equip: 'industrial blenders' },
    { name: 'sneaker store', product: 'sneakers', inputs: 'sneaker inventory', equip: 'a point-of-sale system' }
  ];

  function buildIS() {
    var b = P(BIZ), r = G.taxRate();
    var k = P([100, 100, 1000, 1000, 10]);
    var rev = R(10, 40) * k, credit = R(1, 4) * k, cogs = Math.round(rev * R(25, 45) / 100 / k) * k;
    var wages = R(2, 6) * k, rent = R(1, 3) * k, adv = R(1, 2) * k / (k >= 1000 ? 1 : 1), util = G.chance(0.5) ? R(1, 2) * k / 2 : 0, dep = G.chance(0.4) ? R(1, 2) * k / 2 : 0;
    var equip = R(3, 8) * k, loan = R(5, 20) * k, divs = G.chance(0.4) ? R(1, 2) * k : 0, prepaid = G.chance(0.4) ? R(1, 3) * k : 0, extraInv = G.chance(0.5) ? R(2, 5) * k : 0;
    var acts = [];
    acts.push({ t: 'sells ' + M(rev) + ' of ' + b.product + ', collecting ' + M(rev - credit) + ' now and ' + M(credit) + ' next month', is: true });
    acts.push({ t: 'uses ' + M(cogs) + ' of ' + b.inputs + ' (purchased and paid for this month)', is: true });
    if (extraInv) acts.push({ t: 'buys an additional ' + M(extraInv) + ' of ' + b.inputs + ' that will be used next month', is: false, why: 'unused inventory is an asset; it becomes COGS only when used/sold' });
    acts.push({ t: 'pays ' + M(wages) + ' in wages', is: true });
    acts.push({ t: 'incurs ' + M(rent) + ' in rent, payable next month', is: true });
    acts.push({ t: 'buys ' + b.equip + ' for ' + M(equip) + ' cash' + (dep ? '' : ', with no depreciation this month'), is: false, why: 'equipment is capitalized as PP&E, not expensed' });
    if (dep) acts.push({ t: 'records ' + M(dep) + ' of depreciation on its equipment', is: true });
    acts.push({ t: 'pays ' + M(adv) + ' for advertising', is: true });
    if (util) acts.push({ t: 'receives a ' + M(util) + ' utility bill for this month, to be paid next month', is: true });
    acts.push({ t: 'borrows ' + M(loan) + ' from a bank', is: false, why: 'a loan is financing — it must be repaid, so it is not revenue' });
    if (divs) acts.push({ t: 'pays the owners a ' + M(divs) + ' dividend', is: false, why: 'dividends are distributions of profit, not expenses' });
    if (prepaid) acts.push({ t: 'prepays ' + M(prepaid) + ' of insurance covering next year', is: false, why: 'prepaid insurance is an asset until it is used up' });
    var trapIdx = acts.map(function (a, i) { return a.is ? -1 : i; }).filter(function (i) { return i >= 0; });
    // keep main lines first-ish but shuffle a bit
    var head = acts.slice(0, 2), tail = G.shuffle(acts.slice(2));
    acts = head.concat(tail);
    var opex = wages + rent + adv + util + dep;
    var gp = rev - cogs, pretax = gp - opex;
    if (pretax <= 0) return buildIS();
    var tax = G.r2(pretax * r / 100), ni = G.r2(pretax - tax);
    var list = acts.map(function (a, i) { return '(' + (i + 1) + ') ' + a.t + ';'; }).join('<br>');
    var scen = 'A ' + b.name + ' has the following activities this month:<br>' + list + '<br>Assume a ' + r + '% tax rate.';
    var opexParts = [['Wages', wages], ['Rent', rent], ['Advertising', adv]];
    if (util) opexParts.push(['Utilities', util]);
    if (dep) opexParts.push(['Depreciation', dep]);
    var traps = acts.filter(function (a) { return !a.is; });
    var expl = '<b>Revenue</b> ' + M(rev) + ' (earned when sold, regardless of when collected). <b>COGS</b> ' + M(cogs) + ' → <b>Gross profit</b> ' + M(gp) + '. <b>Operating expenses</b>: ' + opexParts.map(function (p) { return p[0] + ' ' + M(p[1]); }).join(' + ') + ' = ' + M(opex) + ' (accrued rent/utilities count even though unpaid). <b>Pre-tax income</b> ' + M(pretax) + '; taxes ' + r + '% = ' + M(tax) + '; <b>Net income</b> ' + M(ni) + '.<br><b>Not on the income statement:</b> ' + traps.map(function (a) { return a.t.replace(/^(\w+)/, function (w) { return w; }) + ' (' + a.why + ')'; }).join('; ') + '.';
    return { b: b, r: r, k: k, acts: acts, rev: rev, cogs: cogs, gp: gp, opex: opex, pretax: pretax, tax: tax, ni: ni, credit: credit, scen: scen, expl: expl, equip: equip, loan: loan, wages: wages, rent: rent };
  }

  G.register({ id: 'build-is-steps', topic: 'is', sub: 'Build an income statement', name: 'Build an income statement (walkthrough)', difficulty: 2, make: function () {
    var s = buildIS();
    var mk = function (prompt, v, pool, expl, fmt) { var m = G.numMC(v, pool, fmt || M); return { statement: 'is', prompt: prompt, choices: m.choices, answer: m.answer, explain: expl }; };
    var steps = [
      mk('What is <b>revenue</b>?', s.rev, [s.rev - s.credit, s.rev + s.loan, s.credit, s.rev - s.cogs], 'All ' + M(s.rev) + ' of sales are earned this month, including the ' + M(s.credit) + ' collected next month.'),
      mk('What is <b>gross profit</b>?', s.gp, [s.rev - s.credit - s.cogs, s.gp - s.opex, s.rev, s.gp + s.cogs / 2], 'Revenue ' + M(s.rev) + ' − COGS ' + M(s.cogs) + ' = ' + M(s.gp) + '.'),
      mk('What are total <b>operating expenses</b>?', s.opex, [s.opex + s.equip, s.opex - s.rent, s.opex + s.cogs, s.opex - s.rent + s.equip], 'Only expenses incurred this month count; the equipment purchase is capitalized. Total ' + M(s.opex) + '.'),
      mk('What is <b>pre-tax income</b>?', s.pretax, [s.pretax - s.equip, s.pretax + s.rent, s.gp, s.ni], 'Gross profit ' + M(s.gp) + ' − OpEx ' + M(s.opex) + ' = ' + M(s.pretax) + '.'),
      mk('What is <b>net income</b>? (' + s.r + '% tax)', s.ni, [s.pretax, s.tax, G.r2((s.pretax - s.equip) * (1 - s.r / 100)), G.r2(s.pretax * s.r / 100 * 1.5)], 'Pre-tax ' + M(s.pretax) + ' − tax ' + M(s.tax) + ' = ' + M(s.ni) + '.'),
      mk('What is the <b>net profit margin</b>?', G.r2(s.ni / s.rev * 100), [G.r2(s.gp / s.rev * 100), G.r2(s.pretax / s.rev * 100), G.r2(s.ni / s.gp * 100), G.r2(s.ni / (s.rev - s.credit) * 100)], 'Net income ÷ revenue = ' + M(s.ni) + ' ÷ ' + M(s.rev) + ' = ' + G.pct(s.ni / s.rev * 100) + '.', function (x) { return G.pct(x); })
    ];
    return { type: 'steps', prompt: s.scen, steps: steps, explain: s.expl };
  } });

  G.register({ id: 'build-is-single', topic: 'is', sub: 'Build an income statement', name: 'Income statement from activities', difficulty: 2, make: function () {
    var s = buildIS();
    var asks = [
      ['revenue', s.rev, [s.rev - s.credit, s.rev + s.loan, s.credit]],
      ['gross profit', s.gp, [s.rev - s.credit - s.cogs, s.gp - s.opex, s.rev]],
      ['total operating expenses', s.opex, [s.opex + s.equip, s.opex - s.rent, s.opex + s.cogs]],
      ['pre-tax income', s.pretax, [s.pretax - s.equip, s.pretax + s.rent, s.gp, s.pretax - s.equip + s.rent]],
      ['net income', s.ni, [s.pretax, G.r2((s.pretax - s.equip) * (1 - s.r / 100)), G.r2((s.pretax + s.rent) * (1 - s.r / 100)), G.r2((s.pretax - s.credit) * (1 - s.r / 100))]]
    ];
    var a = P(asks);
    var m = G.numMC(a[1], a[2], M);
    return { type: 'mc', prompt: s.scen + '<br><br>What is <b>' + a[0] + '</b> for the month?', choices: m.choices, answer: m.answer, explain: s.expl };
  } });

  G.register({ id: 'build-is-margins', topic: 'ratios', sub: 'Margins', name: 'Gross & net margin from activities', difficulty: 2, make: function () {
    var s = buildIS();
    var gm = G.r2(s.gp / s.rev * 100), nm = G.r2(s.ni / s.rev * 100);
    var which = G.chance(0.5);
    var v = which ? gm : nm;
    var m = G.numMC(v, [gm, nm, G.r2(s.pretax / s.rev * 100), G.r2(s.cogs / s.rev * 100), G.r2(s.ni / s.gp * 100), G.r2(s.gp / (s.rev - s.credit) * 100)], function (x) { return G.pct(x); });
    return { type: 'mc', prompt: s.scen + '<br><br>What is the <b>' + (which ? 'gross profit margin' : 'net profit margin') + '</b>?', choices: m.choices, answer: m.answer,
      explain: s.expl + '<br>Gross margin = ' + M(s.gp) + ' ÷ ' + M(s.rev) + ' = ' + G.pct(gm) + '. Net margin = ' + M(s.ni) + ' ÷ ' + M(s.rev) + ' = ' + G.pct(nm) + '.' };
  } });

  G.register({ id: 'build-is-which', topic: 'is', sub: 'What hits the income statement', name: 'Which activities hit the income statement?', difficulty: 2, make: function () {
    var s = buildIS();
    var choices = s.acts.map(function (a) { return a.t.charAt(0).toUpperCase() + a.t.slice(1); });
    var answers = s.acts.map(function (a, i) { return a.is ? i : -1; }).filter(function (i) { return i >= 0; });
    return { type: 'multi', prompt: 'A ' + s.b.name + ' has these activities this month. Which ones affect this month\'s <b>income statement</b>? (select all that apply)', choices: choices, answers: answers, explain: s.expl };
  } });

  // ============ 2. Build a Balance Sheet for a new company ============
  function buildBS() {
    var k = P([1000, 1000, 100, 10000]);
    var stock = R(20, 80) * k, loan = R(10, 40) * k, equip = R(5, 25) * k, inv = R(3, 15) * k, furn = R(1, 8) * k;
    var land = G.chance(0.35) ? R(5, 15) * k : 0, prepaid = G.chance(0.35) ? R(1, 3) * k : 0, repay = G.chance(0.3) ? R(1, 5) * k : 0;
    if (equip + furn + prepaid + repay > stock + loan) equip = Math.max(k, stock + loan - furn - prepaid - repay - k);
    var acts = [
      'receives ' + M(stock) + ' cash from its founders in exchange for stock',
      'borrows ' + M(loan) + ' from a bank',
      'buys ' + M(equip) + ' of equipment for cash',
      'purchases ' + M(inv) + ' of inventory on credit',
      'buys ' + M(furn) + ' of office furniture for cash'
    ];
    if (land) acts.push('buys land worth ' + M(land) + ' by signing a ' + M(land) + ' note payable to the seller');
    if (prepaid) acts.push('prepays ' + M(prepaid) + ' of rent for next year');
    if (repay) acts.push('repays ' + M(repay) + ' of the bank loan');
    var cash = stock + loan - equip - furn - prepaid - repay;
    var ppe = equip + furn + land;
    var assets = cash + inv + ppe + prepaid;
    var debt = loan - repay + land, ap = inv, liab = debt + ap, eq = stock;
    var scen = 'A brand-new company:<br>' + acts.map(function (a, i) { return '(' + (i + 1) + ') ' + a + ';'; }).join('<br>') + '<br>No revenue or expenses have been incurred yet.';
    var expl = '<b>Cash</b> = ' + M(stock) + ' + ' + M(loan) + ' − ' + M(equip) + ' − ' + M(furn) + (prepaid ? ' − ' + M(prepaid) : '') + (repay ? ' − ' + M(repay) : '') + ' = ' + M(cash) + '. <b>Inventory</b> ' + M(inv) + '. <b>PP&E</b> = ' + M(equip) + ' + ' + M(furn) + (land ? ' + land ' + M(land) : '') + ' = ' + M(ppe) + '.' + (prepaid ? ' <b>Prepaid rent</b> ' + M(prepaid) + '.' : '') + ' <b>Total assets</b> ' + M(assets) + '.<br><b>Accounts payable</b> ' + M(ap) + '; <b>Debt</b> ' + M(debt) + '; <b>Equity</b> ' + M(eq) + ' (no income yet, so retained earnings = 0). ' + M(assets) + ' = ' + M(liab) + ' + ' + M(eq) + ' ✓. Borrowing and issuing stock are financing activities — they never create revenue or net income.';
    return { scen: scen, expl: expl, cash: cash, inv: inv, ppe: ppe, assets: assets, liab: liab, debt: debt, ap: ap, eq: eq, stock: stock, loan: loan, equip: equip, furn: furn, land: land, prepaid: prepaid, repay: repay };
  }

  G.register({ id: 'build-bs-steps', topic: 'bs', sub: 'Build a balance sheet', name: 'Build a balance sheet (walkthrough)', difficulty: 2, make: function () {
    var s = buildBS();
    var mk = function (prompt, v, pool, expl) { var m = G.numMC(v, pool, M); return { statement: 'bs', prompt: prompt, choices: m.choices, answer: m.answer, explain: expl }; };
    var steps = [
      mk('Ending <b>cash</b>?', s.cash, [s.cash - s.inv, s.stock + s.loan, s.cash + s.equip, s.cash + s.repay + s.prepaid + s.furn], 'Cash in: stock ' + M(s.stock) + ' + loan ' + M(s.loan) + '; cash out: equipment, furniture' + (s.prepaid ? ', prepaid rent' : '') + (s.repay ? ', loan repayment' : '') + '. Inventory was bought on credit, so no cash left. = ' + M(s.cash) + '.'),
      mk('Ending <b>PP&E</b>?', s.ppe, [s.equip, s.ppe + s.inv, s.ppe - s.furn, s.ppe - s.land + s.prepaid], 'Equipment ' + M(s.equip) + ' + furniture ' + M(s.furn) + (s.land ? ' + land ' + M(s.land) : '') + ' = ' + M(s.ppe) + '.'),
      mk('<b>Total assets</b>?', s.assets, [s.assets - s.inv, s.assets + s.inv, s.stock + s.loan, s.assets - s.land], 'Cash + inventory + PP&E' + (s.prepaid ? ' + prepaid' : '') + ' = ' + M(s.assets) + '.'),
      mk('<b>Total liabilities</b>?', s.liab, [s.loan, s.debt, s.liab + s.stock, s.loan + s.ap + s.land + s.repay], 'A/P ' + M(s.ap) + ' + debt ' + M(s.debt) + ' = ' + M(s.liab) + '.'),
      mk('<b>Shareholders\' equity</b>?', s.eq, [s.eq + s.loan, s.assets, s.eq - s.equip, s.eq + s.inv], 'Only the ' + M(s.stock) + ' stock issuance; no net income yet. Check: ' + M(s.assets) + ' = ' + M(s.liab) + ' + ' + M(s.eq) + '.')
    ];
    return { type: 'steps', prompt: s.scen, steps: steps, explain: s.expl };
  } });

  G.register({ id: 'build-bs-single', topic: 'bs', sub: 'Build a balance sheet', name: 'Balance sheet from transactions', difficulty: 2, make: function () {
    var s = buildBS();
    var asks = [
      ['ending cash', s.cash, [s.cash - s.inv, s.stock + s.loan, s.cash + s.equip]],
      ['total assets', s.assets, [s.assets - s.inv, s.assets + s.inv, s.stock + s.loan]],
      ['total liabilities', s.liab, [s.loan, s.liab + s.stock, s.ap]],
      ['PP&E', s.ppe, [s.equip, s.ppe + s.inv, s.ppe - s.furn]],
      ['total liabilities + equity', s.assets, [s.liab, s.assets + s.loan, s.eq + s.loan]]
    ];
    var a = P(asks), m = G.numMC(a[1], a[2], M);
    return { type: 'mc', prompt: s.scen + '<br><br>What is <b>' + a[0] + '</b>?', choices: m.choices, answer: m.answer, explain: s.expl };
  } });

  // ============ 3. Build a Cash Flow Statement ============
  function buildCFS() {
    var k = P([1000, 1000, 100, 10]);
    var ni = R(5, 40) * k, dep = R(1, 10) * k, sbc = G.chance(0.35) ? R(1, 4) * k : 0;
    var dAR = R(-6, 10) * k, dInv = G.chance(0.6) ? R(-5, 8) * k : 0, dAP = R(-4, 6) * k, dAcc = G.chance(0.4) ? R(-3, 4) * k : 0, dDef = G.chance(0.3) ? R(-2, 5) * k : 0;
    var gain = G.chance(0.3) ? R(1, 3) * k : 0, proceeds = gain ? gain + R(1, 5) * k : 0;
    var capex = R(3, 25) * k, acq = G.chance(0.15) ? R(5, 20) * k : 0;
    var debtIn = G.chance(0.6) ? R(5, 30) * k : 0, debtOut = G.chance(0.6) ? R(1, 10) * k : 0, divs = G.chance(0.6) ? R(1, 12) * k : 0, buyback = G.chance(0.3) ? R(2, 10) * k : 0, stockIn = G.chance(0.2) ? R(5, 20) * k : 0;
    var beg = R(5, 50) * k;
    var rows = [['Net income', ni], ['Depreciation & amortization', dep]];
    if (sbc) rows.push(['Stock-based compensation', sbc]);
    if (gain) rows.push(['Gain on sale of equipment', gain]);
    rows.push([(dAR >= 0 ? 'Increase' : 'Decrease') + ' in accounts receivable', Math.abs(dAR)]);
    if (dInv) rows.push([(dInv >= 0 ? 'Increase' : 'Decrease') + ' in inventory', Math.abs(dInv)]);
    rows.push([(dAP >= 0 ? 'Increase' : 'Decrease') + ' in accounts payable', Math.abs(dAP)]);
    if (dAcc) rows.push([(dAcc >= 0 ? 'Increase' : 'Decrease') + ' in accrued expenses', Math.abs(dAcc)]);
    if (dDef) rows.push([(dDef >= 0 ? 'Increase' : 'Decrease') + ' in deferred revenue', Math.abs(dDef)]);
    rows.push(['Capital expenditures', capex]);
    if (proceeds) rows.push(['Proceeds from sale of equipment', proceeds]);
    if (acq) rows.push(['Acquisition of a business (cash paid)', acq]);
    if (debtIn) rows.push(['New debt issued', debtIn]);
    if (debtOut) rows.push(['Debt principal repaid', debtOut]);
    if (stockIn) rows.push(['Stock issued', stockIn]);
    if (buyback) rows.push(['Share repurchases', buyback]);
    if (divs) rows.push(['Cash dividends paid', divs]);
    var cfo = ni + dep + sbc - gain - dAR - dInv + dAP + dAcc + dDef;
    var cfi = -capex + proceeds - acq;
    var cff = debtIn - debtOut + stockIn - buyback - divs;
    var net = cfo + cfi + cff;
    if (beg + net < 0) beg += -(beg + net) + R(1, 10) * k;
    var end = beg + net, fcf = cfo - capex;
    var sg = function (x) { return (x >= 0 ? '+ ' : '− ') + G.num(Math.abs(x)); };
    var cfoTxt = G.num(ni) + ' ' + sg(dep) + (sbc ? ' ' + sg(sbc) : '') + (gain ? ' ' + sg(-gain) : '') + ' ' + sg(-dAR) + (dInv ? ' ' + sg(-dInv) : '') + ' ' + sg(dAP) + (dAcc ? ' ' + sg(dAcc) : '') + (dDef ? ' ' + sg(dDef) : '');
    var expl = '<b>CFO</b> = ' + cfoTxt + ' = ' + M(cfo) + ' (add back non-cash D&A' + (sbc ? '/SBC' : '') + (gain ? ', subtract the gain' : '') + '; an increase in an operating asset uses cash, an increase in an operating liability provides cash).<br>' +
      '<b>CFI</b> = −' + G.num(capex) + (proceeds ? ' + ' + G.num(proceeds) : '') + (acq ? ' − ' + G.num(acq) : '') + ' = ' + M(cfi) + '.<br>' +
      '<b>CFF</b> = ' + (debtIn ? '+' + G.num(debtIn) + ' ' : '') + (debtOut ? '− ' + G.num(debtOut) + ' ' : '') + (stockIn ? '+ ' + G.num(stockIn) + ' ' : '') + (buyback ? '− ' + G.num(buyback) + ' ' : '') + (divs ? '− ' + G.num(divs) + ' ' : '') + '= ' + M(cff) + '.<br>' +
      '<b>Net change in cash</b> = ' + M(net) + '; ending cash = ' + M(beg) + ' + ' + M(net) + ' = ' + M(end) + '. <b>FCF</b> = CFO − capex = ' + M(cfo) + ' − ' + M(capex) + ' = ' + M(fcf) + '.';
    var mistakes = {
      cfo: [ni + dep - dAR - dInv + dAP, ni + dep + sbc + gain - dAR - dInv + dAP + dAcc + dDef, ni + dep + sbc - gain + dAR + dInv - dAP - dAcc - dDef, ni - dep + sbc - gain - dAR - dInv + dAP + dAcc + dDef, cfo - divs, cfo + proceeds],
      cfi: [-capex, -capex - proceeds - acq, capex - proceeds, cfi - divs, cfi + gain],
      cff: [debtIn + debtOut - divs, debtIn - debtOut, cff + divs, -cff, cff - capex]
    };
    return { rows: rows, cfo: cfo, cfi: cfi, cff: cff, net: net, beg: beg, end: end, fcf: fcf, capex: capex, expl: expl, mistakes: mistakes, ni: ni, divs: divs };
  }

  G.register({ id: 'build-cfs-steps', topic: 'cfs', sub: 'Build a cash flow statement', name: 'Build a cash flow statement (walkthrough)', difficulty: 3, make: function () {
    var s = buildCFS();
    var mk = function (prompt, v, pool) { var m = G.numMC(v, pool, M); return { statement: 'cfs', prompt: prompt, choices: m.choices, answer: m.answer, explain: '' }; };
    var steps = [
      mk('Cash from operations (<b>CFO</b>)?', s.cfo, s.mistakes.cfo),
      mk('Cash from investing (<b>CFI</b>)?', s.cfi, s.mistakes.cfi),
      mk('Cash from financing (<b>CFF</b>)?', s.cff, s.mistakes.cff),
      mk('<b>Ending cash</b> (beginning cash ' + M(s.beg) + ')?', s.end, [s.beg + s.cfo, s.end - s.cff, s.end - 2 * s.cfi, s.beg - s.net]),
      mk('<b>Free cash flow</b> (CFO − CapEx)?', s.fcf, [s.cfo + s.cfi, s.ni - s.capex, s.net, s.cfo + s.capex])
    ];
    var lines = s.expl.split('<br>');
    steps[0].explain = lines[0]; steps[1].explain = lines[1]; steps[2].explain = lines[2]; steps[3].explain = lines[3]; steps[4].explain = lines[3];
    return { type: 'steps', prompt: 'A company reports the following annual amounts (beginning cash ' + M(s.beg) + '). Build its cash flow statement.', table: { headers: ['Item', 'Amount'], rows: s.rows.map(function (r) { return [r[0], M(r[1])]; }) }, steps: steps, explain: s.expl };
  } });

  G.register({ id: 'build-cfs-single', topic: 'cfs', sub: 'Build a cash flow statement', name: 'CFO / CFI / CFF from data', difficulty: 2, make: function () {
    var s = buildCFS();
    var a = P([['cash from operations (CFO)', s.cfo, s.mistakes.cfo], ['cash from investing (CFI)', s.cfi, s.mistakes.cfi], ['cash from financing (CFF)', s.cff, s.mistakes.cff], ['free cash flow (CFO − CapEx)', s.fcf, [s.cfo + s.cfi, s.ni - s.capex, s.net]], ['ending cash', s.end, [s.beg + s.cfo, s.end - s.cff, s.beg - s.net]]]);
    var m = G.numMC(a[1], a[2], M);
    return { type: 'mc', prompt: 'Using the data below (beginning cash ' + M(s.beg) + '), what is <b>' + a[0] + '</b>?', table: { headers: ['Item', 'Amount'], rows: s.rows.map(function (r) { return [r[0], M(r[1])]; }) }, choices: m.choices, answer: m.answer, explain: s.expl };
  } });

  // ============ 4. CFS classification (random subsets → endless variety) ============
  var CFS_ITEMS = [
    ['Net income', 'Operating'], ['Depreciation add-back', 'Operating'], ['Stock-based compensation add-back', 'Operating'], ['Increase in accounts receivable', 'Operating'],
    ['Increase in inventory', 'Operating'], ['Increase in accounts payable', 'Operating'], ['Increase in deferred revenue', 'Operating'], ['Interest paid on debt (US GAAP)', 'Operating'],
    ['Income taxes paid', 'Operating'], ['Gain on sale of equipment (subtracted)', 'Operating'], ['PP&E write-down add-back', 'Operating'], ['Increase in accrued expenses', 'Operating'],
    ['Capital expenditures', 'Investing'], ['Proceeds from selling a factory', 'Investing'], ['Acquiring another company for cash', 'Investing'], ['Buying marketable securities', 'Investing'],
    ['Selling marketable securities', 'Investing'], ['Purchase of a patent', 'Investing'], ['Loan made to another company', 'Investing'],
    ['Issuing bonds', 'Financing'], ['Repaying loan principal', 'Financing'], ['Paying dividends', 'Financing'], ['Share buyback', 'Financing'], ['Issuing common stock', 'Financing'],
    ['Drawing on a revolving credit line', 'Financing'], ['Paying the principal portion of a finance lease', 'Financing']
  ];
  G.register({ id: 'sort-cfs', topic: 'cfs', sub: 'CFS classification', name: 'Sort into CFO / CFI / CFF', difficulty: 1, make: function () {
    var items = G.sample(CFS_ITEMS.filter(function (x) { return x[1] === 'Operating'; }), 2).concat(G.sample(CFS_ITEMS.filter(function (x) { return x[1] === 'Investing'; }), 2), G.sample(CFS_ITEMS.filter(function (x) { return x[1] === 'Financing'; }), 2), G.sample(CFS_ITEMS, 1));
    var seen = {}; items = items.filter(function (x) { if (seen[x[0]]) return false; seen[x[0]] = 1; return true; });
    return { type: 'sort', prompt: 'Sort each item into the section of the cash flow statement where it appears.', buckets: ['Operating', 'Investing', 'Financing'], items: G.shuffle(items),
      explain: '<b>Operating</b>: net income, non-cash add-backs/subtractions, working-capital changes, and (US GAAP) interest & taxes paid. <b>Investing</b>: buying/selling long-term assets, businesses and investments. <b>Financing</b>: debt and equity flows with lenders and owners, including dividends and buybacks.' };
  } });

  var STMT_ITEMS = [
    ['Revenue', 'Income Statement'], ['Cost of goods sold', 'Income Statement'], ['SG&A expense', 'Income Statement'], ['Interest expense', 'Income Statement'], ['Income tax expense', 'Income Statement'], ['Earnings per share', 'Income Statement'], ['Depreciation expense', 'Income Statement'], ['Gain on sale of assets', 'Income Statement'],
    ['Accounts receivable', 'Balance Sheet'], ['Inventory', 'Balance Sheet'], ['Retained earnings', 'Balance Sheet'], ['Accumulated depreciation', 'Balance Sheet'], ['Deferred revenue', 'Balance Sheet'], ['Goodwill', 'Balance Sheet'], ['Treasury stock', 'Balance Sheet'], ['Accrued expenses', 'Balance Sheet'],
    ['Capital expenditures', 'Cash Flow Statement'], ['Dividends paid', 'Cash Flow Statement'], ['Change in accounts receivable', 'Cash Flow Statement'], ['Proceeds from debt issuance', 'Cash Flow Statement'], ['Share repurchases (cash paid)', 'Cash Flow Statement'], ['Net change in cash', 'Cash Flow Statement']
  ];
  G.register({ id: 'sort-statement', topic: 'basics', sub: 'Which statement?', name: 'Which statement is it on?', difficulty: 1, make: function () {
    var items = ['Income Statement', 'Balance Sheet', 'Cash Flow Statement'].reduce(function (acc, b) { return acc.concat(G.sample(STMT_ITEMS.filter(function (x) { return x[1] === b; }), 2)); }, []);
    return { type: 'sort', prompt: 'Which financial statement does each item primarily appear on?', buckets: ['Income Statement', 'Balance Sheet', 'Cash Flow Statement'], items: G.shuffle(items),
      explain: 'The <b>income statement</b> shows performance over a period (revenues, expenses, profit). The <b>balance sheet</b> is a snapshot of assets, liabilities and equity at a point in time (including contra accounts like accumulated depreciation and treasury stock). The <b>cash flow statement</b> shows cash moving in and out (changes, capex, financing flows).' };
  } });

  var BS_ITEMS = [
    ['Cash', 'Current Asset'], ['Accounts receivable', 'Current Asset'], ['Inventory', 'Current Asset'], ['Prepaid expenses', 'Current Asset'], ['Marketable securities', 'Current Asset'],
    ['PP&E', 'Non-current Asset'], ['Goodwill', 'Non-current Asset'], ['Patents (intangibles)', 'Non-current Asset'], ['Long-term investments', 'Non-current Asset'], ['Right-of-use lease asset', 'Non-current Asset'],
    ['Accounts payable', 'Liability'], ['Accrued wages', 'Liability'], ['Deferred revenue', 'Liability'], ['Income taxes payable', 'Liability'], ['Long-term debt', 'Liability'], ['Bonds payable', 'Liability'], ['Deferred tax liability', 'Liability'],
    ['Common stock', 'Equity'], ['Additional paid-in capital', 'Equity'], ['Retained earnings', 'Equity'], ['Treasury stock', 'Equity'], ['Accumulated other comprehensive income', 'Equity']
  ];
  G.register({ id: 'sort-bs', topic: 'bs', sub: 'Classification', name: 'Classify balance sheet items', difficulty: 1, make: function () {
    var b = ['Current Asset', 'Non-current Asset', 'Liability', 'Equity'];
    var items = b.reduce(function (acc, x) { return acc.concat(G.sample(BS_ITEMS.filter(function (y) { return y[1] === x; }), 2)); }, []);
    return { type: 'sort', prompt: 'Classify each balance sheet item.', buckets: b, items: G.shuffle(items),
      explain: '<b>Current assets</b> convert to cash within a year; <b>non-current assets</b> provide benefits for longer. <b>Liabilities</b> are obligations to others (including deferred revenue — owed service). <b>Equity</b> is the owners\' claim: contributed capital, retained earnings, AOCI, less treasury stock.' };
  } });

  var IS_ITEMS = [
    ['Raw materials used in production', 'COGS'], ['Factory workers\' wages', 'COGS'], ['Cost of inventory sold', 'COGS'], ['Shipping costs to get inventory into the warehouse', 'COGS'],
    ['Advertising', 'Operating Expense'], ['Office rent', 'Operating Expense'], ['Sales commissions', 'Operating Expense'], ['R&D salaries', 'Operating Expense'], ['CEO salary', 'Operating Expense'],
    ['Buying a delivery truck', 'Not an Expense'], ['Repaying a loan\'s principal', 'Not an Expense'], ['Paying dividends', 'Not an Expense'], ['Buying inventory that hasn\'t been sold', 'Not an Expense'], ['Prepaying next year\'s insurance', 'Not an Expense']
  ];
  G.register({ id: 'sort-is', topic: 'is', sub: 'Expense classification', name: 'COGS vs OpEx vs not an expense', difficulty: 2, make: function () {
    var b = ['COGS', 'Operating Expense', 'Not an Expense'];
    var items = b.reduce(function (acc, x) { return acc.concat(G.sample(IS_ITEMS.filter(function (y) { return y[1] === x; }), 2)); }, []);
    return { type: 'sort', prompt: 'For a manufacturer, classify each cost incurred (or cash payment made) this period.', buckets: b, items: G.shuffle(items),
      explain: '<b>COGS</b> = costs directly tied to producing the goods sold. <b>Operating expenses</b> = costs of running the business (selling, G&A, R&D). <b>Not an expense</b>: capex (capitalized), debt principal, dividends, unsold inventory and prepaid items are balance sheet / financing events.' };
  } });

  var WC_ITEMS = [
    ['Accounts receivable increases', 'Decreases cash'], ['Inventory increases', 'Decreases cash'], ['Prepaid expenses increase', 'Decreases cash'], ['Accounts payable decreases', 'Decreases cash'], ['Deferred revenue decreases', 'Decreases cash'], ['Accrued expenses decrease', 'Decreases cash'],
    ['Accounts receivable decreases', 'Increases cash'], ['Inventory decreases', 'Increases cash'], ['Accounts payable increases', 'Increases cash'], ['Deferred revenue increases', 'Increases cash'], ['Accrued expenses increase', 'Increases cash'], ['Income taxes payable increases', 'Increases cash']
  ];
  G.register({ id: 'sort-wc', topic: 'cfs', sub: 'Working capital', name: 'Working-capital cash effect', difficulty: 2, make: function () {
    var items = G.sample(WC_ITEMS.filter(function (x) { return x[1] === 'Decreases cash'; }), 3).concat(G.sample(WC_ITEMS.filter(function (x) { return x[1] === 'Increases cash'; }), 3));
    return { type: 'sort', prompt: 'On the cash flow statement (indirect method), does each change increase or decrease cash from operations?', buckets: ['Increases cash', 'Decreases cash'], items: G.shuffle(items),
      explain: 'Rule of thumb: an <b>increase in an operating asset</b> (A/R, inventory, prepaid) <b>uses</b> cash; an <b>increase in an operating liability</b> (A/P, accrued expenses, deferred revenue, taxes payable) <b>provides</b> cash. Decreases do the opposite.' };
  } });

  // ============ 5. Roll-forwards ============
  G.register({ id: 'roll-re', topic: 'bs', sub: 'Retained earnings', name: 'Retained earnings roll-forward', difficulty: 1, make: function () {
    var k = P([1, 10, 100, 1000]), beg = R(20, 200) * k, ni = R(-10, 60) * k, div = R(0, 15) * k, end = beg + ni - div;
    var m = G.numMC(end, [beg + ni + div, beg + ni, beg - ni - div, end - ni, end + div * 2], M);
    return { type: 'mc', prompt: 'Beginning retained earnings are ' + M(beg) + '. This year the company ' + (ni >= 0 ? 'earns net income of ' + M(ni) : 'has a net loss of ' + M(-ni)) + ' and declares and pays ' + M(div) + ' of dividends. What are <b>ending retained earnings</b>?', choices: m.choices, answer: m.answer,
      explain: 'Ending RE = Beginning RE + Net income − Dividends = ' + M(beg) + ' + ' + M(ni) + ' − ' + M(div) + ' = ' + M(end) + '.' };
  } });

  G.register({ id: 'roll-ppe', topic: 'bs', sub: 'PP&E', name: 'PP&E roll-forward', difficulty: 2, make: function () {
    var k = P([1, 10, 100, 1000]), beg = R(50, 300) * k, capex = R(5, 60) * k, dep = R(5, 40) * k, wd = G.chance(0.4) ? R(1, 20) * k : 0, sold = G.chance(0.4) ? R(1, 20) * k : 0;
    var end = beg + capex - dep - wd - sold;
    var m = G.numMC(end, [beg + capex + dep - wd - sold, beg + capex - dep, beg - capex - dep, end + wd + sold, beg + capex], M);
    return { type: 'mc', prompt: 'Net PP&E begins the year at ' + M(beg) + '. During the year: capital expenditures ' + M(capex) + ', depreciation ' + M(dep) + (wd ? ', a write-down of ' + M(wd) : '') + (sold ? ', and equipment with a net book value of ' + M(sold) + ' is sold' : '') + '. What is <b>ending net PP&E</b>?', choices: m.choices, answer: m.answer,
      explain: 'Ending PP&E = Beginning + Capex − Depreciation' + (wd ? ' − Write-downs' : '') + (sold ? ' − NBV of assets sold' : '') + ' = ' + M(end) + '.' };
  } });

  G.register({ id: 'roll-cash', topic: 'link', sub: 'Cash links', name: 'Cash ties CFS to balance sheet', difficulty: 1, make: function () {
    var k = P([1, 10, 100, 1000]), beg = R(10, 100) * k, cfo = R(-10, 50) * k, cfi = R(-40, 5) * k, cff = R(-20, 30) * k, end = beg + cfo + cfi + cff;
    var m = G.numMC(end, [beg + cfo, beg + cfo - cfi + cff, cfo + cfi + cff, beg - cfo - cfi - cff, end + 2 * cff], M);
    return { type: 'mc', prompt: 'Beginning cash on last year\'s balance sheet is ' + M(beg) + '. This year CFO = ' + M(cfo) + ', CFI = ' + M(cfi) + ', CFF = ' + M(cff) + '. What cash balance appears on this year\'s <b>balance sheet</b>?', choices: m.choices, answer: m.answer,
      explain: 'Ending cash = Beginning cash + CFO + CFI + CFF = ' + M(end) + '. The CFS explains exactly how cash on the balance sheet changed.' };
  } });

  // ============ 6. Ratios ============
  function fin() {
    var k = P([1, 10, 100, 1000]);
    var rev = R(50, 500) * k, cogs = Math.round(rev * R(30, 70) / 100), opex = Math.round(rev * R(10, 25) / 100), da = Math.round(rev * R(2, 8) / 100);
    var ebit = rev - cogs - opex, interest = Math.max(1, Math.round(ebit * R(5, 25) / 100)), pretax = ebit - interest, tax = Math.round(pretax * 0.25), ni = pretax - tax;
    var ca = R(20, 150) * k, inv = Math.round(ca * R(15, 40) / 100), ar = Math.round(ca * R(15, 35) / 100), cl = R(15, 120) * k, ta = ca + R(50, 400) * k, debt = R(10, 200) * k, eq = R(30, 300) * k;
    return { rev: rev, cogs: cogs, opex: opex, da: da, ebit: ebit, ebitda: ebit + da, interest: interest, pretax: pretax, tax: tax, ni: ni, ca: ca, inv: inv, ar: ar, cl: cl, ta: ta, debt: debt, eq: eq };
  }
  var RATIOS = [
    { name: 'gross margin', f: function (d) { return (d.rev - d.cogs) / d.rev * 100; }, fmt: 'pct', formula: 'Gross margin = (Revenue − COGS) ÷ Revenue', rows: ['rev', 'cogs', 'opex'] },
    { name: 'operating (EBIT) margin', f: function (d) { return d.ebit / d.rev * 100; }, fmt: 'pct', formula: 'Operating margin = EBIT ÷ Revenue', rows: ['rev', 'cogs', 'opex', 'interest'] },
    { name: 'EBITDA margin', f: function (d) { return d.ebitda / d.rev * 100; }, fmt: 'pct', formula: 'EBITDA margin = (EBIT + D&A) ÷ Revenue', rows: ['rev', 'ebit', 'da', 'interest'] },
    { name: 'net profit margin', f: function (d) { return d.ni / d.rev * 100; }, fmt: 'pct', formula: 'Net margin = Net income ÷ Revenue', rows: ['rev', 'ebit', 'ni', 'cogs'] },
    { name: 'current ratio', f: function (d) { return d.ca / d.cl; }, fmt: 'x', formula: 'Current ratio = Current assets ÷ Current liabilities', rows: ['ca', 'cl', 'inv', 'ta'] },
    { name: 'quick ratio', f: function (d) { return (d.ca - d.inv) / d.cl; }, fmt: 'x', formula: 'Quick ratio = (Current assets − Inventory) ÷ Current liabilities', rows: ['ca', 'inv', 'cl', 'ar'] },
    { name: 'debt-to-equity ratio', f: function (d) { return d.debt / d.eq; }, fmt: 'x', formula: 'Debt-to-equity = Total debt ÷ Shareholders\' equity', rows: ['debt', 'eq', 'ta', 'cl'] },
    { name: 'interest coverage (EBIT ÷ interest)', f: function (d) { return d.ebit / d.interest; }, fmt: 'x', formula: 'Interest coverage = EBIT ÷ Interest expense', rows: ['ebit', 'interest', 'ni', 'rev'] },
    { name: 'return on equity (ROE)', f: function (d) { return d.ni / d.eq * 100; }, fmt: 'pct', formula: 'ROE = Net income ÷ Shareholders\' equity', rows: ['ni', 'eq', 'ta', 'rev'] },
    { name: 'return on assets (ROA)', f: function (d) { return d.ni / d.ta * 100; }, fmt: 'pct', formula: 'ROA = Net income ÷ Total assets', rows: ['ni', 'ta', 'eq', 'rev'] },
    { name: 'days sales outstanding (DSO)', f: function (d) { return d.ar / d.rev * 365; }, fmt: 'days', formula: 'DSO = Accounts receivable ÷ Revenue × 365', rows: ['ar', 'rev', 'cogs', 'inv'] },
    { name: 'inventory turnover', f: function (d) { return d.cogs / d.inv; }, fmt: 'x', formula: 'Inventory turnover = COGS ÷ Inventory', rows: ['cogs', 'inv', 'rev', 'ar'] },
    { name: 'asset turnover', f: function (d) { return d.rev / d.ta; }, fmt: 'x', formula: 'Asset turnover = Revenue ÷ Total assets', rows: ['rev', 'ta', 'ni', 'eq'] }
  ];
  var LBL = { rev: 'Revenue', cogs: 'Cost of goods sold', opex: 'Operating expenses (excl. D&A)', da: 'Depreciation & amortization', ebit: 'Operating income (EBIT)', interest: 'Interest expense', ni: 'Net income', ca: 'Current assets', inv: 'Inventory', ar: 'Accounts receivable', cl: 'Current liabilities', ta: 'Total assets', debt: 'Total debt', eq: 'Shareholders\' equity' };
  G.register({ id: 'ratio-calc', topic: 'ratios', sub: 'Ratio calculation', name: 'Calculate a ratio', difficulty: 2, make: function () {
    var d = fin(); var r = P(RATIOS);
    var v = r.f(d);
    var fmt = r.fmt === 'pct' ? function (x) { return G.pct(x); } : r.fmt === 'days' ? function (x) { return Math.round(x) + ' days'; } : function (x) { return G.ratio(x); };
    var alt = RATIOS.filter(function (o) { return o.fmt === r.fmt && o !== r; }).map(function (o) { try { return o.f(d); } catch (e) { return null; } }).filter(function (x) { return isFinite(x); });
    var pool = alt.concat([v * 1.25, v * 0.8, 1 / v * (r.fmt === 'x' ? 1 : 100), v * 0.5]);
    var vals = [v]; var seen = {}; seen[fmt(v)] = 1;
    G.shuffle(pool).forEach(function (x) { if (vals.length < 4 && isFinite(x) && x > 0 && !seen[fmt(x)]) { seen[fmt(x)] = 1; vals.push(x); } });
    var mult = [1.5, 0.66, 2, 0.4, 1.1];
    for (var i = 0; vals.length < 4 && i < mult.length; i++) { var x = v * mult[i]; if (!seen[fmt(x)]) { seen[fmt(x)] = 1; vals.push(x); } }
    vals = G.shuffle(vals);
    var rowsKeys = r.rows.slice();
    if (r.name.indexOf('operating') === 0) rowsKeys = ['rev', 'cogs', 'opex', 'interest'];
    var displayOpex = r.name.indexOf('operating') === 0 || r.name === 'gross margin';
    var table = { headers: ['Item', 'Amount'], rows: G.shuffle(rowsKeys).map(function (k) { return [k === 'opex' && displayOpex ? 'Operating expenses (incl. D&A)' : LBL[k], M(d[k])]; }) };
    return { type: 'mc', prompt: 'Using the data below, calculate the <b>' + r.name + '</b>.', table: table, choices: vals.map(fmt), answer: vals.indexOf(v), explain: r.formula + ' = ' + fmt(v) + '. (Some numbers in the table are distractors.)' };
  } });

  var RATIO_FORMULAS = [
    ['Gross margin', '(Revenue − COGS) ÷ Revenue'], ['Net profit margin', 'Net income ÷ Revenue'], ['Current ratio', 'Current assets ÷ Current liabilities'],
    ['Quick ratio', '(Cash + securities + A/R) ÷ Current liabilities'], ['Debt-to-equity', 'Total debt ÷ Shareholders\' equity'], ['ROE', 'Net income ÷ Shareholders\' equity'],
    ['ROA', 'Net income ÷ Total assets'], ['Interest coverage', 'EBIT ÷ Interest expense'], ['Inventory turnover', 'COGS ÷ Average inventory'], ['DSO', 'A/R ÷ Revenue × 365'],
    ['Free cash flow', 'CFO − Capital expenditures'], ['EBITDA', 'EBIT + Depreciation & amortization'], ['Asset turnover', 'Revenue ÷ Total assets'], ['Debt-to-EBITDA', 'Total debt ÷ EBITDA'],
    ['Payout ratio', 'Dividends ÷ Net income'], ['Operating margin', 'Operating income ÷ Revenue']
  ];
  G.register({ id: 'match-ratios', topic: 'ratios', sub: 'Ratio formulas', name: 'Match ratios to formulas', difficulty: 1, make: function () {
    var pairs = G.sample(RATIO_FORMULAS, 5);
    return { type: 'match', prompt: 'Match each metric to its formula.', pairs: pairs, explain: pairs.map(function (p) { return '<b>' + p[0] + '</b> = ' + p[1]; }).join('<br>') };
  } });

  // ============ 7. Income statement ordering ============
  var IS_ORDERS = [
    ['Revenue', 'Cost of goods sold', 'Gross profit', 'Operating expenses', 'Operating income (EBIT)', 'Interest expense', 'Pre-tax income', 'Net income'],
    ['Revenue', 'Gross profit', 'SG&A', 'Operating income', 'Pre-tax income', 'Income tax expense', 'Net income'],
    ['Net sales', 'COGS', 'Gross profit', 'R&D expense', 'EBIT', 'Income taxes', 'Net income'],
    ['Net income', 'Depreciation & amortization add-back', 'Changes in working capital', 'Cash from operations', 'Cash from investing', 'Cash from financing', 'Net change in cash'],
    ['Cash', 'Accounts receivable', 'Inventory', 'PP&E', 'Goodwill'],
    ['Current assets', 'Non-current assets', 'Current liabilities', 'Long-term liabilities', 'Shareholders\' equity']
  ];
  var ORDER_PROMPTS = ['Put these income statement lines in top-to-bottom order.', 'Put these income statement lines in top-to-bottom order.', 'Put these income statement lines in top-to-bottom order.', 'Put these cash flow statement lines in top-to-bottom order.', 'Order these assets from most liquid to least liquid (typical balance sheet order).', 'Order these balance sheet sections as they typically appear (top to bottom).'];
  G.register({ id: 'order-statements', topic: 'is', sub: 'Statement structure', name: 'Put statement lines in order', difficulty: 1, make: function () {
    var i = R(0, IS_ORDERS.length - 1), items = IS_ORDERS[i];
    var topic = i <= 2 ? 'is' : i === 3 ? 'cfs' : 'bs';
    if (items.length > 7) items = items.slice(0, 7);
    return { type: 'order', topic: topic, prompt: ORDER_PROMPTS[i], items: items, explain: 'Correct order: ' + items.join(' → ') + '.' };
  } });

  // ============ 8. Glossary-driven ============
  var mapTopic = { is: 'is', bs: 'bs', cfs: 'cfs', ratios: 'ratios', general: 'basics' };
  function gloss() { return (FSQ.glossary || []).filter(function (g) { return g.def && g.def.length < 260; }); }
  G.register({ id: 'gloss-term', topic: 'basics', sub: 'Vocabulary', name: 'Which term matches the definition?', difficulty: 1, make: function () {
    var all = gloss(); if (all.length < 6) return { type: 'tf', prompt: 'Assets = Liabilities + Equity.', answer: true, explain: 'The accounting equation always holds.' };
    var g = P(all);
    var same = all.filter(function (x) { return x.statement === g.statement && x.term !== g.term; });
    var wrong = G.sample(same.length >= 3 ? same : all.filter(function (x) { return x.term !== g.term; }), 3).map(function (x) { return x.term; });
    var choices = G.shuffle([g.term].concat(wrong));
    var hide = new RegExp(g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return { type: 'mc', topic: mapTopic[g.statement] || 'basics', sub: 'Vocabulary', prompt: 'Which term is defined as: <i>"' + g.def.replace(hide, '_____') + '"</i>', choices: choices, answer: choices.indexOf(g.term), explain: '<b>' + g.term + '</b>' + (g.abbr ? ' (' + g.abbr + ')' : '') + ': ' + g.def + (g.formula ? '<br>Formula: ' + g.formula : '') + (g.example ? '<br>Example: ' + g.example : '') };
  } });
  G.register({ id: 'gloss-def', topic: 'basics', sub: 'Vocabulary', name: 'Pick the right definition', difficulty: 1, make: function () {
    var all = gloss(); if (all.length < 6) return { type: 'tf', prompt: 'Revenue is recognized when earned.', answer: true, explain: 'Revenue recognition principle.' };
    var g = P(all);
    var same = all.filter(function (x) { return x.statement === g.statement && x.term !== g.term; });
    var wrong = G.sample(same.length >= 3 ? same : all.filter(function (x) { return x.term !== g.term; }), 3).map(function (x) { return x.def; });
    var choices = G.shuffle([g.def].concat(wrong));
    return { type: 'mc', topic: mapTopic[g.statement] || 'basics', sub: 'Vocabulary', prompt: 'What is the best definition of <b>' + g.term + '</b>' + (g.abbr ? ' (' + g.abbr + ')' : '') + '?', choices: choices, answer: choices.indexOf(g.def), explain: '<b>' + g.term + '</b>: ' + g.def + (g.example ? '<br>Example: ' + g.example : '') };
  } });
  G.register({ id: 'gloss-match', topic: 'basics', sub: 'Vocabulary', name: 'Match terms to definitions', difficulty: 1, make: function () {
    var all = gloss().filter(function (g) { return g.def.length < 140; }); if (all.length < 6) return { type: 'tf', prompt: 'Dividends are an expense.', answer: false, explain: 'Dividends reduce retained earnings directly.' };
    var st = P(['is', 'bs', 'cfs', 'general', 'ratios']);
    var pool = all.filter(function (g) { return g.statement === st; }); if (pool.length < 5) pool = all;
    var pick = G.sample(pool, 4);
    return { type: 'match', topic: mapTopic[st] || 'basics', sub: 'Vocabulary', prompt: 'Match each term to its definition.', pairs: pick.map(function (g) { return [g.term, g.def]; }), explain: pick.map(function (g) { return '<b>' + g.term + '</b>: ' + g.def; }).join('<br>') };
  } });
})(typeof window !== 'undefined' ? window : globalThis);
