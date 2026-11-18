/* Transaction templates: each randomly parameterized, turned into walkthrough / grid / MC / multi / TF
   questions by core.js. All effects are auto-checked to balance (A = L + E). */
(function (root) {
  var FSQ = root.FSQ, G = FSQ.gen;
  var R = G.rnd, P = G.pick, $ = G.money;
  var taxCashTxt = function (r) { return 'Assume a ' + r + '% tax rate, with taxes paid in cash.'; };

  // ===== Special transactions (Problem Set 2 style) =====
  G.registerTx({ id: 'tx-accrued', topic: 'adv', sub: 'Accrued expenses', name: 'Accrued expense', make: function () {
    var r = G.taxRate(), x = R(20, 600, 20);
    var what = P(['employee salaries', 'utility bills', 'legal fees', 'year-end bonuses', 'interest on a loan', 'consulting fees', 'warranty repairs']);
    return { base: x, scenario: G.co() + ' incurs <b>' + $(x) + '</b> of ' + what + ' during the year but has not paid them yet; they will be paid next year. ' + taxCashTxt(r),
      why: 'The expense is recognized when incurred (matching principle), even though no cash has been paid — creating an Accrued Expenses liability.',
      fx: { rate: r, is: [[what.charAt(0).toUpperCase() + what.slice(1) + ' expense', -x]], cfoAdj: [['Increase in accrued expenses', x]], liab: [['Accrued expenses', x]] } };
  } });

  G.registerTx({ id: 'tx-pay-accrued', topic: 'adv', sub: 'Accrued expenses', name: 'Pay a previously accrued expense', difficulty: 1, make: function () {
    var x = R(20, 500, 20);
    return { base: x, scenario: 'Last year ' + G.co() + ' accrued <b>' + $(x) + '</b> of unpaid wages. This year it pays the full amount in cash.',
      noIsWhy: 'The expense was already recognized last year when it was incurred; paying it now only settles the liability.',
      why: 'Paying an accrued expense is a cash outflow that reduces a liability — no new expense.',
      fx: { rate: 40, cfoAdj: [['Decrease in accrued expenses', -x]], liab: [['Accrued expenses', -x]] } };
  } });

  G.registerTx({ id: 'tx-gain-sale', topic: 'adv', sub: 'Gain/loss on sale', name: 'Gain on sale of equipment', difficulty: 3, make: function () {
    var r = G.taxRate(), cost = R(100, 1000, 50), ad = R(1, Math.floor(cost / 50) - 1) * 50, nbv = cost - ad, proc = nbv + R(1, 8) * 10;
    var gain = proc - nbv;
    return { base: gain, scenario: G.co() + ' sells a piece of equipment for <b>' + $(proc) + '</b> in cash. The equipment originally cost <b>' + $(cost) + '</b> and has accumulated depreciation of <b>' + $(ad) + '</b>. ' + taxCashTxt(r),
      why: 'Net book value = ' + $(cost) + ' − ' + $(ad) + ' = ' + $(nbv) + ', so the gain is ' + $(proc) + ' − ' + $(nbv) + ' = ' + $(gain) + '. The gain is non-cash on its own, so it is subtracted in CFO; the full proceeds show up in CFI.',
      fx: { rate: r, is: [['Gain on sale of equipment', gain]], cfoAdj: [['Less: gain on sale (non-cash)', -gain]], cfi: [['Proceeds from sale of equipment', proc]], assets: [['PP&E (net)', -nbv]] } };
  } });

  G.registerTx({ id: 'tx-loss-sale', topic: 'adv', sub: 'Gain/loss on sale', name: 'Loss on sale of equipment', difficulty: 3, make: function () {
    var r = G.taxRate(), cost = R(200, 1200, 50), ad = R(1, Math.floor(cost / 50) - 2) * 50, nbv = cost - ad, loss = R(1, Math.min(10, nbv / 10 - 1)) * 10, proc = nbv - loss;
    return { base: loss, scenario: G.co() + ' sells old machinery for <b>' + $(proc) + '</b> cash. It cost <b>' + $(cost) + '</b> with accumulated depreciation of <b>' + $(ad) + '</b>. ' + taxCashTxt(r),
      why: 'Net book value = ' + $(nbv) + '; selling for ' + $(proc) + ' creates a ' + $(loss) + ' loss. The loss is non-cash, so it is added back in CFO, while the proceeds go in CFI.',
      fx: { rate: r, is: [['Loss on sale of machinery', -loss]], cfoAdj: [['Add: loss on sale (non-cash)', loss]], cfi: [['Proceeds from sale of machinery', proc]], assets: [['PP&E (net)', -nbv]] } };
  } });

  G.registerTx({ id: 'tx-ppe-writedown', topic: 'adv', sub: 'PP&E write-down', name: 'PP&E write-down', make: function () {
    var r = G.taxRate(), nbv = R(200, 1500, 100), w = R(1, nbv / 50 - 1) * 50;
    var cause = P(['A hurricane damages', 'A flood damages', 'A fire damages', 'Falling demand impairs', 'New technology makes obsolete part of']);
    return { base: w, scenario: G.co() + ' has a factory with a net book value of <b>' + $(nbv) + '</b>. ' + cause + ' the factory, and the company records a <b>' + $(w) + '</b> PP&E write-down. ' + taxCashTxt(r),
      why: 'A write-down is a non-cash expense: it lowers pre-tax income and PP&E, is added back in CFO, and the only cash effect is the tax savings.',
      fx: { rate: r, is: [['PP&E write-down', -w]], cfoAdj: [['Add back: write-down (non-cash)', w]], assets: [['PP&E (net)', -w]] } };
  } });

  G.registerTx({ id: 'tx-inv-writedown', topic: 'adv', sub: 'Inventory write-down', name: 'Inventory write-down', make: function () {
    var r = G.taxRate(), inv = R(100, 1000, 50), w = R(1, inv / 10 - 1) * 10;
    var why = P(['declining demand', 'spoilage', 'obsolescence', 'a competitor\'s cheaper product', 'damage in a warehouse leak']);
    return { base: w, scenario: G.co() + ' has <b>' + $(inv) + '</b> of inventory. Due to ' + why + ', it is now worth only <b>' + $(inv - w) + '</b>, so the company records a <b>' + $(w) + '</b> inventory write-down. ' + taxCashTxt(r),
      why: 'The write-down is a non-cash expense (often in COGS): added back in CFO; inventory falls by the full amount; cash rises only by the tax savings.',
      fx: { rate: r, is: [['Inventory write-down', -w]], cfoAdj: [['Add back: inventory write-down (non-cash)', w]], assets: [['Inventory', -w]] } };
  } });

  G.registerTx({ id: 'tx-sbc', topic: 'adv', sub: 'Stock-based comp', name: 'Stock-based compensation', make: function () {
    var r = G.taxRate(), x = R(20, 500, 20);
    var form = P(['stock options', 'restricted stock units (RSUs)', 'shares of stock']);
    return { base: x, scenario: G.co() + ' grants employees <b>' + $(x) + '</b> of ' + form + ' as compensation, all expensed this year. Treat SBC as tax-deductible. ' + taxCashTxt(r),
      why: 'SBC is a real expense but paid in stock, not cash: it reduces NI, is added back in CFO, and increases equity (Common stock & APIC).',
      fx: { rate: r, is: [['Stock-based compensation expense', -x]], cfoAdj: [['Add back: SBC (non-cash)', x]], equity: [['Common stock & APIC', x]] } };
  } });

  G.registerTx({ id: 'tx-sbc-swap', topic: 'adv', sub: 'Stock-based comp', name: 'Replace cash salary with SBC', difficulty: 3, make: function () {
    var r = G.taxRate(), s = R(50, 300, 10), x = s + R(0, 10) * 10;
    if (x === s) x = s + 20;
    return { base: x, scenario: G.co() + ' changes a key employee\'s pay: instead of a <b>' + $(s) + '</b> cash salary, she now receives <b>' + $(x) + '</b> in stock-based compensation, fully expensed this year. Treat SBC as tax-deductible. ' + taxCashTxt(r) + ' Show the impact of the <i>change</i> (new vs. old).',
      why: 'Expense rises by only ' + $(x - s) + ' (' + $(x) + ' SBC − ' + $(s) + ' salary), but the whole ' + $(x) + ' is non-cash and added back, and the company stops paying ' + $(s) + ' in cash.',
      fx: { rate: r, is: [['Compensation expense (SBC ' + $(x) + ' replaces ' + $(s) + ' salary)', -(x - s)]], cfoAdj: [['Add back: SBC (non-cash)', x]], equity: [['Common stock & APIC', x]] } };
  } });

  G.registerTx({ id: 'tx-pik', topic: 'adv', sub: 'PIK interest', name: 'PIK interest', difficulty: 3, make: function () {
    var r = G.taxRate(), d = R(1, 20) * 100, cashR = R(2, 9), pikR = R(2, 6);
    var ci = G.r2(d * cashR / 100), pi = G.r2(d * pikR / 100);
    return { base: G.r2(ci + pi), scenario: G.co() + ' has <b>' + $(d) + '</b> of debt at <b>' + (cashR + pikR) + '%</b> interest: <b>' + cashR + '% cash</b> interest and <b>' + pikR + '% PIK</b> (paid-in-kind) interest. It pays the cash interest at year-end; the PIK interest is added to the debt balance. ' + taxCashTxt(r) + ' Show the impact after one year.',
      why: 'Total interest expense = ' + $(ci) + ' cash + ' + $(pi) + ' PIK = ' + $(G.r2(ci + pi)) + '. The PIK portion is non-cash (added back in CFO) and increases the debt balance.',
      fx: { rate: r, is: [['Interest expense', -G.r2(ci + pi)]], cfoAdj: [['Add back: PIK interest (non-cash)', pi]], liab: [['Debt', pi]] } };
  } });

  G.registerTx({ id: 'tx-cash-interest', topic: 'link', sub: 'Interest', name: 'Cash interest expense', difficulty: 1, make: function () {
    var r = G.taxRate(), d = R(2, 20) * 100, ir = R(3, 10), i = G.r2(d * ir / 100);
    return { base: i, scenario: G.co() + ' has <b>' + $(d) + '</b> of debt at <b>' + ir + '%</b> interest, paid in cash this year. ' + taxCashTxt(r),
      why: 'Cash interest is an expense that also reduces cash (US GAAP: interest paid is in CFO). The debt principal is unchanged.',
      fx: { rate: r, is: [['Interest expense', -i]] } };
  } });

  G.registerTx({ id: 'tx-credit-sale-payable', topic: 'link', sub: 'Revenue & A/R', name: 'Credit sale (taxes payable)', make: function () {
    var r = G.taxRate(), x = R(20, 800, 20);
    var svc = P(['consulting services', 'design work', 'repair services', 'a software implementation', 'legal services']);
    return { base: x, scenario: G.co() + ' delivers <b>' + $(x) + '</b> of ' + svc + ' on credit; the customer pays next month. No associated costs. It records ' + r + '% income tax expense on the profit but will <b>pay the taxes next month</b>.',
      why: 'Revenue is earned when the service is delivered, even without cash. Both the cash from the customer (A/R) and the tax payment (Taxes payable) are deferred, so CFO is zero.',
      fx: { rate: r, taxMode: 'payable', is: [['Revenue', x]], cfoAdj: [['Increase in accounts receivable', -x]], assets: [['Accounts receivable', x]] } };
  } });

  G.registerTx({ id: 'tx-credit-sale-cash-tax', topic: 'link', sub: 'Revenue & A/R', name: 'Credit sale (taxes paid)', make: function () {
    var r = G.taxRate(), x = R(20, 800, 20);
    return { base: x, scenario: G.co() + ' sells <b>' + $(x) + '</b> of services on credit (customer pays next quarter). No associated costs. ' + taxCashTxt(r),
      why: 'Revenue is recognized now; the customer hasn\'t paid (A/R up), but the company pays taxes now — so cash actually falls by the tax.',
      fx: { rate: r, is: [['Revenue', x]], cfoAdj: [['Increase in accounts receivable', -x]], assets: [['Accounts receivable', x]] } };
  } });

  G.registerTx({ id: 'tx-collect-ar', topic: 'link', sub: 'Revenue & A/R', name: 'Collect accounts receivable', difficulty: 1, make: function () {
    var x = R(20, 800, 20);
    return { base: x, scenario: G.co() + ' collects <b>' + $(x) + '</b> in cash from customers for sales it made (and recorded) last quarter.',
      noIsWhy: 'The revenue was already recognized when the sale was made; collecting it just converts A/R into cash.',
      why: 'An asset swap: A/R down, cash up — total assets unchanged.',
      fx: { rate: 40, cfoAdj: [['Decrease in accounts receivable', x]], assets: [['Accounts receivable', -x]] } };
  } });

  G.registerTx({ id: 'tx-deferred-rev', topic: 'link', sub: 'Deferred revenue', name: 'Cash received in advance', make: function () {
    var x = R(20, 900, 20);
    var what = P(['a subscription it will deliver next month', 'a year of software access starting next quarter', 'gym memberships starting next month', 'gift cards', 'concert tickets for next month\'s show']);
    return { base: x, scenario: G.co() + ' receives <b>' + $(x) + '</b> in cash today for ' + what + '. Nothing has been delivered yet. Assume no costs, and tax is recognized only when revenue is earned.',
      noIsWhy: 'Revenue isn\'t earned until the product or service is delivered, so nothing hits the income statement yet.',
      why: 'Cash comes in but the company owes future service — a Deferred Revenue liability. CFO rises via the increase in deferred revenue.',
      fx: { rate: 40, cfoAdj: [['Increase in deferred revenue', x]], liab: [['Deferred revenue', x]] } };
  } });

  G.registerTx({ id: 'tx-deferred-earn', topic: 'adv', sub: 'Deferred revenue', name: 'Deferred revenue earned', difficulty: 3, make: function () {
    var r = G.taxRate(), x = R(20, 900, 20);
    return { base: x, scenario: 'Last month ' + G.co() + ' collected <b>' + $(x) + '</b> in advance for a service. This month it delivers the entire service. No costs. ' + taxCashTxt(r),
      why: 'Revenue is now earned: deferred revenue falls and revenue rises. No new customer cash arrives, but taxes are paid now — so cash falls by the tax.',
      fx: { rate: r, is: [['Revenue', x]], cfoAdj: [['Decrease in deferred revenue', -x]], liab: [['Deferred revenue', -x]] } };
  } });

  G.registerTx({ id: 'tx-inventory-sale', topic: 'link', sub: 'Inventory & COGS', name: 'Sell inventory for cash', make: function () {
    var r = G.taxRate(), c = R(20, 600, 20), p = c + R(1, 20) * 10;
    return { base: p, scenario: 'At the start of the period, ' + G.co() + ' owns inventory recorded at a cost of <b>' + $(c) + '</b>. It sells all of it for <b>' + $(p) + '</b> cash. ' + taxCashTxt(r) + ' No other costs.',
      why: 'COGS is recognized when the goods are sold (matching principle). Inventory falls by its cost; the decrease is added back in CFO because the cash was spent in a prior period.',
      fx: { rate: r, is: [['Revenue', p], ['Cost of goods sold', -c]], cfoAdj: [['Decrease in inventory', c]], assets: [['Inventory', -c]] } };
  } });

  G.registerTx({ id: 'tx-inventory-sale-credit', topic: 'link', sub: 'Inventory & COGS', name: 'Sell inventory on credit', difficulty: 3, make: function () {
    var r = G.taxRate(), c = R(20, 600, 20), p = c + R(1, 20) * 10;
    return { base: p, scenario: G.co() + ' sells inventory that cost <b>' + $(c) + '</b> for <b>' + $(p) + '</b> on credit. ' + taxCashTxt(r),
      why: 'Revenue and COGS are both recognized; the customer owes the money (A/R up) and inventory is used up. Cash only changes by the taxes paid.',
      fx: { rate: r, is: [['Revenue', p], ['Cost of goods sold', -c]], cfoAdj: [['Increase in accounts receivable', -p], ['Decrease in inventory', c]], assets: [['Accounts receivable', p], ['Inventory', -c]] } };
  } });

  G.registerTx({ id: 'tx-buy-inv-credit', topic: 'link', sub: 'Inventory & COGS', name: 'Buy inventory on credit', difficulty: 1, make: function () {
    var x = R(20, 900, 20);
    return { base: x, scenario: G.co() + ' purchases <b>' + $(x) + '</b> of inventory on credit (to be paid to the supplier next month).',
      noIsWhy: 'Buying inventory is not an expense — it becomes COGS only when sold.',
      why: 'Inventory (asset) and accounts payable (liability) both rise; the CFS changes offset, so cash is unchanged.',
      fx: { rate: 40, cfoAdj: [['Increase in inventory', -x], ['Increase in accounts payable', x]], assets: [['Inventory', x]], liab: [['Accounts payable', x]] } };
  } });

  G.registerTx({ id: 'tx-buy-inv-cash', topic: 'link', sub: 'Inventory & COGS', name: 'Buy inventory with cash', difficulty: 1, make: function () {
    var x = R(20, 900, 20);
    return { base: x, scenario: G.co() + ' buys <b>' + $(x) + '</b> of inventory and pays cash immediately.',
      noIsWhy: 'Buying inventory is not an expense until it is sold.',
      why: 'An increase in inventory is an operating use of cash (CFO), and cash is swapped for inventory on the balance sheet.',
      fx: { rate: 40, cfoAdj: [['Increase in inventory', -x]], assets: [['Inventory', x]] } };
  } });

  G.registerTx({ id: 'tx-pay-ap', topic: 'link', sub: 'Working capital', name: 'Pay accounts payable', difficulty: 1, make: function () {
    var x = R(20, 600, 20);
    return { base: x, scenario: G.co() + ' pays <b>' + $(x) + '</b> cash to suppliers for inventory it bought on credit last month.',
      noIsWhy: 'Paying a supplier settles a liability; no expense is recognized.',
      why: 'Cash and accounts payable both fall; CFO shows a decrease in A/P.',
      fx: { rate: 40, cfoAdj: [['Decrease in accounts payable', -x]], liab: [['Accounts payable', -x]] } };
  } });

  G.registerTx({ id: 'tx-depreciation', topic: 'link', sub: 'Depreciation', name: 'Depreciation expense', make: function () {
    var r = G.taxRate(), x = P([10, 10, 20, 50, 100, 40, 200, 30, 60, 80]);
    var lead = P(['Depreciation expense increases by', 'records depreciation of', 'records annual depreciation on its equipment of']);
    var sc = lead.indexOf('increases') >= 0 ? 'At ' + G.co() + ', depreciation expense increases by <b>' + $(x) + '</b>. ' : G.co() + ' ' + lead + ' <b>' + $(x) + '</b>. ';
    return { base: x, scenario: sc + taxCashTxt(r),
      why: 'Depreciation is a non-cash expense: NI falls by the after-tax amount, it is added back in CFO, PP&E falls, and the only cash effect is the tax savings.',
      fx: { rate: r, is: [['Depreciation expense', -x]], cfoAdj: [['Add back: depreciation (non-cash)', x]], assets: [['PP&E (net)', -x]] } };
  } });

  G.registerTx({ id: 'tx-amortization', topic: 'adv', sub: 'Depreciation & amortization', name: 'Amortization of intangibles', make: function () {
    var r = G.taxRate(), x = R(10, 300, 10);
    var what = P(['a patent', 'acquired customer relationships', 'a software license', 'a trademark with a finite life']);
    return { base: x, scenario: G.co() + ' records <b>' + $(x) + '</b> of amortization on ' + what + '. Assume the amortization is tax-deductible. ' + taxCashTxt(r),
      why: 'Amortization is the intangible-asset version of depreciation: non-cash, added back in CFO, reduces intangible assets.',
      fx: { rate: r, is: [['Amortization expense', -x]], cfoAdj: [['Add back: amortization (non-cash)', x]], assets: [['Intangible assets', -x]] } };
  } });

  G.registerTx({ id: 'tx-capex', topic: 'link', sub: 'Capex', name: 'Buy PP&E with cash', difficulty: 1, make: function () {
    var x = R(50, 2000, 50);
    var what = P(['an espresso machine', 'delivery trucks', 'a new warehouse', 'servers', 'manufacturing equipment', 'office furniture']);
    return { base: x, scenario: G.co() + ' buys <b>' + $(x) + '</b> of ' + what + ' with cash. Ignore depreciation for now.',
      noIsWhy: 'Long-lived assets are capitalized, not expensed — their cost hits the income statement over time through depreciation.',
      why: 'Capex is an investing outflow (CFI); cash is swapped for PP&E on the balance sheet.',
      fx: { rate: 40, cfi: [['Capital expenditures', -x]], assets: [['PP&E (net)', x]] } };
  } });

  G.registerTx({ id: 'tx-capex-debt', topic: 'link', sub: 'Capex', name: 'Buy PP&E with debt (non-cash)', difficulty: 3, make: function () {
    var x = R(100, 2000, 100);
    return { base: x, scenario: G.co() + ' acquires <b>' + $(x) + '</b> of equipment by signing a note payable directly with the seller (no cash changes hands). Ignore depreciation.',
      noIsWhy: 'Acquiring an asset is not an expense.',
      why: 'No cash moves, so nothing appears in CFO/CFI/CFF (it is disclosed as a non-cash investing & financing activity). PP&E and debt both rise.',
      fx: { rate: 40, assets: [['PP&E (net)', x]], liab: [['Debt', x]] } };
  }, variants: { steps: 2, grid: 2, single: 2, multi: 2, tf: 1 } });

  G.registerTx({ id: 'tx-issue-debt', topic: 'link', sub: 'Financing', name: 'Borrow money', difficulty: 1, make: function () {
    var x = R(100, 5000, 100);
    return { base: x, scenario: G.co() + ' borrows <b>' + $(x) + '</b> from a bank.',
      noIsWhy: 'Borrowing is financing, not revenue — the money must be repaid.',
      why: 'Cash in via CFF; debt (liability) rises by the same amount.',
      fx: { rate: 40, cff: [['Debt issued', x]], liab: [['Debt', x]] } };
  } });

  G.registerTx({ id: 'tx-repay-debt', topic: 'link', sub: 'Financing', name: 'Repay debt principal', difficulty: 1, make: function () {
    var x = R(100, 3000, 100);
    return { base: x, scenario: G.co() + ' repays <b>' + $(x) + '</b> of loan principal in cash (ignore interest).',
      noIsWhy: 'Repaying principal is not an expense — only interest is.',
      why: 'Cash out via CFF; debt falls by the same amount.',
      fx: { rate: 40, cff: [['Debt repaid', -x]], liab: [['Debt', -x]] } };
  } });

  G.registerTx({ id: 'tx-issue-stock', topic: 'link', sub: 'Financing', name: 'Issue stock', difficulty: 1, make: function () {
    var x = R(100, 5000, 100);
    return { base: x, scenario: G.co() + ' issues new shares to investors for <b>' + $(x) + '</b> in cash.',
      noIsWhy: 'Raising equity is not revenue — owners are investing capital.',
      why: 'Cash in via CFF; common stock & APIC rise.',
      fx: { rate: 40, cff: [['Stock issued', x]], equity: [['Common stock & APIC', x]] } };
  } });

  G.registerTx({ id: 'tx-dividends', topic: 'adv', sub: 'Dividends & buybacks', name: 'Pay dividends', difficulty: 1, make: function () {
    var x = R(20, 1000, 20);
    return { base: x, scenario: G.co() + ' pays <b>' + $(x) + '</b> of cash dividends to shareholders.',
      noIsWhy: 'Dividends are a distribution of profits to owners, not an expense.',
      why: 'Cash out via CFF; retained earnings fall directly (bypassing the income statement).',
      fx: { rate: 40, cff: [['Dividends paid', -x]], equity: [['Retained earnings', -x]] } };
  } });

  G.registerTx({ id: 'tx-buyback', topic: 'adv', sub: 'Dividends & buybacks', name: 'Share repurchase', difficulty: 1, make: function () {
    var x = R(100, 3000, 100);
    return { base: x, scenario: G.co() + ' repurchases <b>' + $(x) + '</b> of its own stock in the open market.',
      noIsWhy: 'Buying back stock is a capital transaction with owners, not an expense.',
      why: 'Cash out via CFF; treasury stock (a contra-equity account) reduces equity.',
      fx: { rate: 40, cff: [['Share repurchases', -x]], equity: [['Treasury stock', -x]] } };
  } });

  G.registerTx({ id: 'tx-prepay', topic: 'adv', sub: 'Prepaid expenses', name: 'Prepay an expense', difficulty: 1, make: function () {
    var x = R(20, 600, 20);
    var what = P(['next year\'s insurance', '6 months of rent in advance', 'an annual software subscription starting next month']);
    return { base: x, scenario: G.co() + ' pays <b>' + $(x) + '</b> in cash for ' + what + '.',
      noIsWhy: 'The benefit hasn\'t been used yet, so it\'s an asset (prepaid expense), not an expense.',
      why: 'Cash is swapped for a prepaid expense asset; CFO shows an increase in prepaid expenses (a use of cash).',
      fx: { rate: 40, cfoAdj: [['Increase in prepaid expenses', -x]], assets: [['Prepaid expenses', x]] } };
  } });

  G.registerTx({ id: 'tx-prepaid-used', topic: 'adv', sub: 'Prepaid expenses', name: 'Recognize prepaid expense', make: function () {
    var r = G.taxRate(), x = R(20, 600, 20);
    return { base: x, scenario: G.co() + ' prepaid insurance last year. This year, <b>' + $(x) + '</b> of that prepaid insurance is used up and expensed. ' + taxCashTxt(r),
      why: 'The expense is recognized as the benefit is consumed. No new cash goes out for the insurance itself; the decrease in prepaid is added back in CFO.',
      fx: { rate: r, is: [['Insurance expense', -x]], cfoAdj: [['Decrease in prepaid expenses', x]], assets: [['Prepaid expenses', -x]] } };
  } });

  G.registerTx({ id: 'tx-goodwill-impair', topic: 'adv', sub: 'Goodwill & impairment', name: 'Goodwill impairment', difficulty: 3, make: function () {
    var r = G.taxRate(), x = R(50, 1000, 50);
    return { base: x, scenario: G.co() + ' determines that goodwill from a past acquisition is impaired and records a <b>' + $(x) + '</b> goodwill impairment. For simplicity, assume the charge is tax-deductible. ' + taxCashTxt(r),
      why: 'Impairment is a non-cash charge: reduces NI and goodwill, is added back in CFO. (In reality goodwill impairments are often not tax-deductible — then there would be no tax savings.)',
      fx: { rate: r, is: [['Goodwill impairment', -x]], cfoAdj: [['Add back: impairment (non-cash)', x]], assets: [['Goodwill', -x]] } };
  } });

  G.registerTx({ id: 'tx-cash-sale', topic: 'link', sub: 'Revenue & A/R', name: 'Cash sale of services', difficulty: 1, make: function () {
    var r = G.taxRate(), x = R(20, 800, 20);
    return { base: x, scenario: G.co() + ' provides <b>' + $(x) + '</b> of services and is paid in cash immediately. No associated costs. ' + taxCashTxt(r),
      why: 'Revenue and cash arrive together; after taxes, NI and cash rise by the same amount.',
      fx: { rate: r, is: [['Revenue', x]] } };
  } });

  G.registerTx({ id: 'tx-cash-expense', topic: 'link', sub: 'Expenses', name: 'Pay an expense in cash', difficulty: 1, make: function () {
    var r = G.taxRate(), x = R(20, 600, 20);
    var what = P(['advertising', 'employee wages', 'rent for this month', 'utilities for this month', 'R&D salaries']);
    return { base: x, scenario: G.co() + ' pays <b>' + $(x) + '</b> in cash for ' + what + '. ' + taxCashTxt(r),
      why: 'A cash expense: NI falls by the after-tax amount and cash falls by the same amount (taxes are lower).',
      fx: { rate: r, is: [[what.charAt(0).toUpperCase() + what.slice(1) + ' expense', -x]] } };
  } });

  G.registerTx({ id: 'tx-pay-taxes', topic: 'adv', sub: 'Deferred taxes', name: 'Pay taxes payable', difficulty: 1, make: function () {
    var x = R(10, 400, 10);
    return { base: x, scenario: G.co() + ' pays <b>' + $(x) + '</b> of income taxes it recorded as taxes payable last year.',
      noIsWhy: 'The tax expense was already recorded last year.',
      why: 'Settling a liability: cash and income taxes payable both fall.',
      fx: { rate: 40, cfoAdj: [['Decrease in income taxes payable', -x]], liab: [['Income taxes payable', -x]] } };
  } });

  G.registerTx({ id: 'tx-buy-securities', topic: 'link', sub: 'Investing', name: 'Buy marketable securities', difficulty: 1, make: function () {
    var x = R(100, 3000, 100);
    return { base: x, scenario: G.co() + ' invests <b>' + $(x) + '</b> of excess cash in short-term marketable securities (Treasury bills).',
      noIsWhy: 'Buying an investment swaps one asset for another.',
      why: 'Investing outflow (CFI); cash down, marketable securities up.',
      fx: { rate: 40, cfi: [['Purchase of marketable securities', -x]], assets: [['Marketable securities', x]] } };
  } });

  G.registerTx({ id: 'tx-dta-nol', topic: 'adv', sub: 'Deferred taxes', name: 'Accrue a bonus, tax deduction later', difficulty: 3, make: function () {
    var r = G.taxRate(), x = R(20, 500, 20);
    return { base: x, scenario: G.co() + ' accrues a <b>' + $(x) + '</b> employee bonus (unpaid until next year). Tax rules only allow the deduction when it is paid, so this year\'s <i>cash</i> taxes do not change; instead the company records a deferred tax asset. Book tax rate ' + r + '%.',
      why: 'Book tax expense falls by the tax effect, but cash taxes don\'t — the difference becomes a Deferred Tax Asset (a future tax saving).',
      fx: { rate: r, taxMode: 'deferred', is: [['Bonus expense', -x]], cfoAdj: [['Increase in accrued expenses', x]], liab: [['Accrued expenses', x]] } };
  }, variants: { steps: 2, single: 3, multi: 2 } });
})(typeof window !== 'undefined' ? window : globalThis);
