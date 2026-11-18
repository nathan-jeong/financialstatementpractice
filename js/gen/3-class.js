/* The exact class problem sets, rebuilt as click-through walkthroughs (fixed numbers). */
(function (root) {
  var FSQ = root.FSQ, G = FSQ.gen, M = G.money;

  function concept(prompt, right, wrongs, explain, statement) {
    var ch = G.shuffle([right].concat(wrongs));
    return { statement: statement || 'is', prompt: prompt, choices: ch, answer: ch.indexOf(right), explain: explain };
  }
  function numStep(statement, prompt, v, pool, explain, fmt) {
    var m = G.numMC(v, pool, fmt || M);
    return { statement: statement, prompt: prompt, choices: m.choices, answer: m.answer, explain: explain };
  }
  function txProblem(t, extra) {
    var e = G.effect(t.fx);
    var q = G.variants.steps(t, e);
    if (extra) q.steps = q.steps.concat(extra);
    return q;
  }

  G.classProblems = [
    { id: 'ps1-p1', set: 'PS-A', title: 'Problem 1 · Constructing an Income Statement (coffee shop)', make: function () {
      return { type: 'steps', prompt: 'A coffee shop has the following January activities:<br>(1) sells $20,000 of coffee, collecting $17,000 now and $3,000 next month;<br>(2) uses $6,000 of ingredients purchased and paid for this month;<br>(3) pays $4,000 in wages;<br>(4) incurs $2,000 in rent payable next month;<br>(5) buys a $5,000 espresso machine for cash, with no January depreciation;<br>(6) pays $1,000 for advertising.<br>Use the class default 40% tax rate.',
        steps: [
          numStep('is', 'Revenue?', 20000, [17000, 3000, 50000, 23000], 'All $20,000 is earned in January (delivered), even though $3,000 is collected next month.'),
          numStep('is', 'COGS?', 6000, [11000, 10000, 0], 'Ingredients used to make the coffee sold = $6,000.'),
          numStep('is', 'Gross profit?', 14000, [11000, 9000, 20000], '$20,000 − $6,000 = $14,000.'),
          numStep('is', 'Total operating expenses?', 7000, [12000, 5000, 13000], 'Wages $4,000 + rent $2,000 (incurred, even though unpaid) + advertising $1,000 = $7,000. The espresso machine is not an expense.'),
          numStep('is', 'Pre-tax income?', 7000, [2000, 14000, 4200], '$14,000 − $7,000 = $7,000.'),
          numStep('is', 'Net income (40% tax)?', 4200, [7000, 2800, 1200], 'Tax = 40% × $7,000 = $2,800 → NI = $4,200.'),
          numStep('is', 'Gross profit margin?', 70, [21, 35, 30], '$14,000 ÷ $20,000 = 70%.', function (x) { return G.pct(x); }),
          numStep('is', 'Net profit margin?', 21, [70, 35, 24.7], '$4,200 ÷ $20,000 = 21%.', function (x) { return G.pct(x); }),
          concept('Why is the espresso machine not immediately expensed?', 'It will generate revenue over many future periods, so it is capitalized as PP&E and expensed gradually through depreciation (matching principle).', ['Because it was paid in cash rather than on credit.', 'Because equipment is never recorded on any financial statement.', 'Because expenses only include payments to employees.'], 'Long-lived assets are capitalized and depreciated over their useful lives to match their cost with the revenue they help produce.')
        ], explain: 'Revenue 20,000 − COGS 6,000 = Gross profit 14,000 (70%). OpEx 7,000 → pre-tax 7,000 → tax 2,800 → NI 4,200 (21%). The machine is capitalized.' };
    } },
    { id: 'ps1-p2', set: 'PS-A', title: 'Problem 2 · Constructing a Balance Sheet (new company)', make: function () {
      return { type: 'steps', prompt: 'A new company:<br>(1) receives $50,000 cash from its founder in exchange for stock;<br>(2) borrows $30,000 from a bank;<br>(3) buys $20,000 of equipment for cash;<br>(4) purchases $10,000 of inventory on credit;<br>(5) buys $5,000 of office furniture for cash.<br>No revenue or expenses have been incurred.',
        steps: [
          numStep('bs', 'Ending cash?', 55000, [45000, 80000, 65000], '$50,000 + $30,000 − $20,000 − $5,000 = $55,000 (inventory was bought on credit).'),
          numStep('bs', 'Inventory?', 10000, [0, 5000, 20000], '$10,000 of inventory purchased on credit.'),
          numStep('bs', 'PP&E?', 25000, [20000, 35000, 5000], 'Equipment $20,000 + furniture $5,000 = $25,000.'),
          numStep('bs', 'Total assets?', 90000, [80000, 100000, 65000], '$55,000 + $10,000 + $25,000 = $90,000.'),
          numStep('bs', 'Total liabilities (A/P + debt)?', 40000, [30000, 10000, 90000], 'A/P $10,000 + bank debt $30,000 = $40,000.'),
          numStep('bs', 'Shareholders\' equity?', 50000, [80000, 90000, 40000], 'Only the $50,000 stock issuance; no income yet. $90,000 = $40,000 + $50,000 ✓'),
          concept('Why doesn\'t the bank loan increase net income?', 'Borrowing is a financing activity — the cash comes with an equal obligation to repay (a liability), so nothing is earned.', ['Because loans are recorded as revenue only when repaid.', 'Because the loan increases equity instead.', 'Because interest is always larger than the loan.'], 'Revenue comes from delivering goods/services. A loan raises cash and debt equally; A = L + E stays balanced with no income effect.', 'bs')
        ], explain: 'Assets 90,000 (Cash 55,000; Inventory 10,000; PP&E 25,000) = Liabilities 40,000 (A/P 10,000; Debt 30,000) + Equity 50,000.' };
    } },
    { id: 'ps1-p3', set: 'PS-A', title: 'Problem 3 · Constructing a Cash Flow Statement', make: function () {
      return { type: 'steps', prompt: 'A company reports the following annual amounts (40% tax rate). Beginning cash is $25,000.',
        table: { headers: ['Item', 'Amount'], rows: [['Net income', '$24,000'], ['Depreciation', '$5,000'], ['Increase in accounts receivable', '$8,000'], ['Increase in accounts payable', '$3,000'], ['Capital expenditures', '$15,000'], ['New debt issued', '$20,000'], ['Debt principal repaid', '$5,000'], ['Cash dividends paid', '$10,000']] },
        steps: [
          numStep('cfs', 'CFO?', 24000, [40000, 29000, 14000, 18000], '24,000 + 5,000 − 8,000 + 3,000 = 24,000. (Dividends are financing, not operating.)'),
          numStep('cfs', 'CFI?', -15000, [15000, -10000, 5000], 'Capex −15,000.'),
          numStep('cfs', 'CFF?', 5000, [15000, -5000, 25000, 35000], '+20,000 − 5,000 − 10,000 = +5,000.'),
          numStep('cfs', 'Net change in cash?', 14000, [24000, 9000, 44000, 29000], '24,000 − 15,000 + 5,000 = +14,000.'),
          numStep('cfs', 'Ending cash?', 39000, [25000, 49000, 14000, 34000], '25,000 + 14,000 = 39,000.'),
          numStep('cfs', 'Free cash flow (CFO − CapEx)?', 9000, [14000, 24000, 39000, -6000], '24,000 − 15,000 = 9,000.')
        ], explain: 'CFO 24,000; CFI −15,000; CFF +5,000 → +14,000; ending cash 39,000; FCF 9,000.' };
    } },
    { id: 'ps1-p4', set: 'PS-A', title: 'Problem 4 · Consulting on credit, taxes payable', make: function () {
      return txProblem({ base: 100, scenario: 'A company delivers $100 of consulting services on credit. The customer will pay next month. No associated costs. The company recognizes 40% income tax expense on the profit, but will pay the taxes next month. No prior related balances.',
        why: 'Revenue is earned when delivered; neither the customer cash nor the taxes have moved yet.',
        fx: { rate: 40, taxMode: 'payable', is: [['Revenue', 100]], cfoAdj: [['Increase in accounts receivable', -100]], assets: [['Accounts receivable', 100]] } });
    } },
    { id: 'ps1-p5', set: 'PS-A', title: 'Problem 5 · Cash received for next month\'s subscription', make: function () {
      return txProblem({ base: 100, scenario: 'A software company receives $100 in cash today for a subscription it will deliver entirely next month. No services provided yet. No costs; income tax is recognized only when the revenue is earned (next month).',
        noIsWhy: 'Nothing has been delivered, so no revenue is earned yet.',
        why: 'Cash arrives with an obligation to deliver: Deferred Revenue (liability).',
        fx: { rate: 40, cfoAdj: [['Increase in deferred revenue', 100]], liab: [['Deferred revenue', 100]] } },
        [concept('Next month, when the service is delivered, what happens?', 'Deferred revenue decreases by $100 and revenue of $100 is recognized; no new cash is received from the customer.', ['Cash increases by another $100 and deferred revenue increases.', 'Deferred revenue stays the same and revenue is recognized later.', 'Revenue is never recognized because cash was already received.'], 'The liability is "earned off": deferred revenue falls and revenue (then tax and NI) is recorded. The cash came in last month.', 'bs')]);
    } },
    { id: 'ps1-p6', set: 'PS-A', title: 'Problem 6 · Selling existing inventory for cash', make: function () {
      return txProblem({ base: 100, scenario: 'At the start of the period, a retailer owns inventory recorded at a cost of $60. It sells all of it for $100 cash. It pays 40% income taxes immediately in cash. No other costs or transactions.',
        why: 'COGS is recorded when the goods are sold; inventory falls by its cost.',
        fx: { rate: 40, is: [['Revenue', 100], ['Cost of goods sold', -60]], cfoAdj: [['Decrease in inventory', 60]], assets: [['Inventory', -60]] } },
        [concept('Why does the $60 appear in COGS when the goods are sold, not when they were purchased?', 'Matching principle: the cost of the goods is expensed in the same period as the revenue they generate; until then it sits on the balance sheet as inventory (an asset).', ['Because inventory purchases are always paid in cash later.', 'Because tax rules forbid expensing inventory.', 'Because COGS is only recorded at the end of the fiscal year.'], 'Buying inventory swaps cash for an asset. The expense is recognized when the revenue is earned.')]);
    } },
    { id: 'ps2-q1', set: 'PS-B', title: 'Question 1 · Accrued Expenses', make: function () {
      return txProblem({ base: 100, scenario: 'A company incurs $100 in employee salary expenses during the year but has not yet paid its employees. The salaries will be paid next year. Assume a 40% tax rate (tax effect in cash).',
        why: 'Expense recognized when incurred (matching), creating an accrued liability.',
        fx: { rate: 40, is: [['Salary expense', -100]], cfoAdj: [['Increase in accrued expenses', 100]], liab: [['Accrued expenses', 100]] } });
    } },
    { id: 'ps2-q2', set: 'PS-B', title: 'Question 2 · Gain on Sale of Equipment', make: function () {
      return txProblem({ base: 50, scenario: 'A company sells a piece of equipment for $150 in cash. The equipment has an original cost of $200 and accumulated depreciation of $100. Assume a 40% tax rate.',
        why: 'NBV = $200 − $100 = $100, so the gain is $50. The gain is subtracted in CFO and the full $150 goes in CFI.',
        fx: { rate: 40, is: [['Gain on sale of equipment', 50]], cfoAdj: [['Less: gain on sale (non-cash)', -50]], cfi: [['Proceeds from sale of equipment', 150]], assets: [['PP&E (net)', -100]] } });
    } },
    { id: 'ps2-q3', set: 'PS-B', title: 'Question 3 · PP&E Write-Down', make: function () {
      return txProblem({ base: 100, scenario: 'A company has a factory recorded at a net book value of $200. A hurricane damages the factory, and the company records a $100 PP&E write-down. Assume a 40% tax rate.',
        why: 'A non-cash expense: reduces NI and PP&E, added back on the CFS; cash rises by the $40 tax savings.',
        fx: { rate: 40, is: [['PP&E write-down', -100]], cfoAdj: [['Add back: write-down (non-cash)', 100]], assets: [['PP&E (net)', -100]] } });
    } },
    { id: 'ps2-q4', set: 'PS-B', title: 'Question 4 · Stock-Based Compensation ($120 SBC replaces $100 salary)', make: function () {
      return txProblem({ base: 120, scenario: 'A company changes a key employee\'s compensation: instead of a $100 cash salary, she now receives $120 in stock-based compensation, all recognized this year. Assume a 40% tax rate and that SBC is tax-deductible. Show the impact of the change.',
        why: 'Expense rises by $20 ($120 − $100). The whole $120 is non-cash (added back), and the $100 cash salary is no longer paid.',
        fx: { rate: 40, is: [['Compensation expense (+$120 SBC − $100 salary)', -20]], cfoAdj: [['Add back: SBC (non-cash)', 120]], equity: [['Common stock & APIC', 120]] } });
    } },
    { id: 'ps2-q5', set: 'PS-B', title: 'Question 5 · Inventory Write-Down', make: function () {
      return txProblem({ base: 40, scenario: 'A company has $100 of inventory. Due to declining demand it is now worth only $60, and the company records a $40 inventory write-down. Assume a 40% tax rate.',
        why: 'Non-cash expense: NI −$24, add back $40, inventory −$40, cash +$16 (tax savings).',
        fx: { rate: 40, is: [['Inventory write-down', -40]], cfoAdj: [['Add back: inventory write-down (non-cash)', 40]], assets: [['Inventory', -40]] } });
    } },
    { id: 'ps2-q6', set: 'PS-B', title: 'Question 6 · Payment-in-Kind (PIK) Interest', make: function () {
      return txProblem({ base: 20, scenario: 'A company has $200 of debt at 10% annual interest: 6% cash interest and 4% PIK interest. It pays the cash interest at year-end; the PIK interest is added to the debt balance. Assume a 40% tax rate. Show the impact after one year.',
        why: 'Interest expense = $12 cash + $8 PIK = $20. PIK is non-cash (added back) and increases debt to $208.',
        fx: { rate: 40, is: [['Interest expense', -20]], cfoAdj: [['Add back: PIK interest (non-cash)', 8]], liab: [['Debt', 8]] } },
        [numStep('bs', 'What is the debt balance at year-end?', 208, [200, 220, 212, 192], '$200 + $8 PIK accrued = $208.')]);
    } }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
