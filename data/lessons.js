/* Learn section: one lesson per topic (basics, is, bs, cfs, link, adv, ratios).
   Lesson HTML may use p, ul, ol, li, b, i, table.mini, div.callout, div.callout.warn, div.formula.
   Conventions follow CONTENT_GUIDE.md: 40% tax, indirect CFS, IS -> CFS -> BS walkthrough order. */
FSQ.addLessons([
  /* =====================================================================
     1. ACCOUNTING FOUNDATIONS
     ===================================================================== */
  {
    id: 'basics', topic: 'basics', title: 'Accounting Foundations', icon: '🧱',
    summary: 'Accounting is how a business tells its financial story. Before you can read the three statements, you need a few rules: accrual timing, the accounting equation, and the fact that every transaction has two sides.',
    sections: [
      {
        heading: 'Why financial statements exist',
        html: `<p>A company is a big pile of transactions: sales, purchases, paychecks, loans. Financial statements <b>summarize those transactions in a standard format</b>, so someone outside the company can answer three questions:</p>
<ol>
  <li><b>Is it profitable?</b> → Income Statement</li>
  <li><b>What does it own and owe?</b> → Balance Sheet</li>
  <li><b>Where did the cash actually come from and go?</b> → Cash Flow Statement</li>
</ol>
<p><b>Who reads them?</b></p>
<table class="mini">
  <tr><th>User</th><th>What they care about</th></tr>
  <tr><td>Equity investors</td><td>Growth, margins, returns, free cash flow. Is the stock worth buying?</td></tr>
  <tr><td>Lenders / bondholders</td><td>Can the company pay interest and repay principal? (cash flow, leverage, coverage)</td></tr>
  <tr><td>Management</td><td>Which products or regions make money, and where to spend</td></tr>
  <tr><td>Suppliers &amp; customers</td><td>Will this company still be around and paying its bills?</td></tr>
  <tr><td>Regulators &amp; tax authorities</td><td>Accurate, honest reporting</td></tr>
</table>
<div class="callout">Think of the statements as a <b>common language</b>. Every US public company has to use the same rules, so you can compare Apple to Microsoft, or this year to last year.</div>`
      },
      {
        heading: 'Where to find them: 10-K, 10-Q & friends',
        html: `<p>US public companies file reports with the <b>SEC</b>. They are free to read on the SEC's <b>EDGAR</b> database and on each company's investor-relations site.</p>
<table class="mini">
  <tr><th>Filing</th><th>What it is</th></tr>
  <tr><td><b>10-K</b></td><td>Annual report. Full-year statements <b>audited</b> by an independent accounting firm, plus business description, risk factors, and MD&amp;A.</td></tr>
  <tr><td><b>10-Q</b></td><td>Quarterly report for Q1–Q3. Statements are <b>reviewed but not audited</b>, and shorter. (Q4 is covered by the 10-K.)</td></tr>
  <tr><td><b>8-K</b></td><td>"Something big just happened" report: an acquisition, a CEO change, an earnings release.</td></tr>
  <tr><td><b>Proxy (DEF 14A)</b></td><td>Executive pay and shareholder votes.</td></tr>
</table>
<ul>
  <li><b>MD&amp;A</b> (Management's Discussion &amp; Analysis) is management explaining the numbers in words. Read it.</li>
  <li><b>Notes to the financial statements</b> hold the details: debt schedules, revenue by segment, lease terms, accounting policies.</li>
  <li><b>Fiscal year</b> = the company's 12-month reporting year. It doesn't have to match the calendar year (many retailers end in late January, Apple ends in late September).</li>
</ul>
<div class="callout">Pro habit: when you analyze a company, open the latest 10-K, skim the business section, then go straight to the three statements and their notes.</div>`
      },
      {
        heading: 'GAAP vs IFRS',
        html: `<p>Accounting standards are the rulebook for how transactions get recorded.</p>
<ul>
  <li><b>US GAAP</b> (Generally Accepted Accounting Principles) is set by the <b>FASB</b> and required for US public companies.</li>
  <li><b>IFRS</b> (International Financial Reporting Standards) is set by the <b>IASB</b> and used in the EU, the UK, Canada, Australia, and well over 100 other jurisdictions.</li>
</ul>
<p>The two are mostly alike. A few differences come up a lot:</p>
<table class="mini">
  <tr><th>Topic</th><th>US GAAP</th><th>IFRS</th></tr>
  <tr><td>LIFO inventory</td><td>Allowed</td><td>Not allowed</td></tr>
  <tr><td>Interest paid on CFS</td><td>Operating (CFO)</td><td>Operating <i>or</i> Financing</td></tr>
  <tr><td>Reversing an inventory or PP&amp;E write-down</td><td>Not allowed</td><td>Allowed (in some cases)</td></tr>
  <tr><td>Development costs</td><td>Usually expensed</td><td>Capitalized if criteria met</td></tr>
  <tr><td>Leases (lessee)</td><td>Operating vs finance leases</td><td>One model (all treated like finance leases)</td></tr>
</table>
<div class="callout">Unless a problem says otherwise, this class uses <b>US GAAP</b>. For example, interest paid goes in CFO.</div>`
      },
      {
        heading: 'Accrual vs cash accounting',
        html: `<p><b>Cash accounting</b> records revenue when cash comes in and expenses when cash goes out. <b>Accrual accounting</b> records revenue when it is <b>earned</b> and expenses when they are <b>incurred</b>, whenever the cash moves. GAAP and IFRS both require accrual accounting.</p>
<p><b>Example: a landscaping business</b></p>
<ul>
  <li>December: finishes a $1,000 job. The customer pays in January.</li>
  <li>December: pays the crew $400 cash for that job.</li>
  <li>December: prepays $200 cash for January's truck rental.</li>
</ul>
<table class="mini">
  <tr><th></th><th>Cash basis</th><th>Accrual basis</th></tr>
  <tr><td><b>December</b></td><td>$0 in − $600 out = <b>−$600</b></td><td>$1,000 revenue − $400 wages = <b>$600</b></td></tr>
  <tr><td><b>January</b></td><td>$1,000 in = <b>$1,000</b></td><td>$200 rent expense = <b>−$200</b></td></tr>
  <tr><td><b>Two-month total</b></td><td><b>$400</b></td><td><b>$400</b></td></tr>
</table>
<div class="callout">Both methods get to the <b>same total over time</b>. They only differ on <b>timing</b>. Accrual shows that December was the profitable month, because December is when the work happened.</div>
<p>Because the Income Statement uses accruals, <b>Net Income ≠ cash</b>. The Cash Flow Statement exists to bridge that gap.</p>`
      },
      {
        heading: 'Revenue recognition & the matching principle',
        html: `<p><b>Revenue recognition</b> answers <i>when</i> revenue counts. The rule (ASC 606 / IFRS 15) is: recognize revenue when you <b>transfer the promised good or service to the customer</b>, in the amount you expect to receive. The standard has five steps:</p>
<ol>
  <li>Identify the contract</li>
  <li>Identify the performance obligations (what you promised)</li>
  <li>Determine the transaction price</li>
  <li>Allocate the price to each obligation</li>
  <li>Recognize revenue when (or as) each obligation is satisfied</li>
</ol>
<p><b>The matching principle</b> says expenses should be recorded <b>in the same period as the revenue they helped produce</b>.</p>
<ul>
  <li>Inventory sits on the BS as an asset and becomes <b>COGS only when it is sold</b>.</li>
  <li>A machine that works for 10 years is <b>depreciated</b> over those 10 years. It is not expensed all at once.</li>
  <li>Salaries employees earned this month are expensed this month, even if payday is next month (an <b>accrued expense</b>).</li>
</ul>
<div class="callout warn">Cash timing doesn't decide recognition. A customer prepaying for a service creates <b>deferred revenue</b> (a liability), not revenue. Selling on credit <b>is</b> revenue right away, even though no cash came in.</div>`
      },
      {
        heading: 'The accounting equation: A = L + E',
        html: `<div class="formula">Assets = Liabilities + Shareholders' Equity</div>
<ul>
  <li><b>Assets</b>: resources the company controls that will bring future benefit (cash, receivables, inventory, equipment).</li>
  <li><b>Liabilities</b>: what it owes to outsiders (suppliers, lenders, employees, customers who prepaid).</li>
  <li><b>Equity</b>: what's left for owners = money they put in + profits kept in the business.</li>
</ul>
<p>Read it as: <b>everything the company owns was paid for by someone</b>, either creditors (L) or owners (E). That's why the equation <i>always</i> holds.</p>
<div class="formula">Equity = Assets − Liabilities</div>
<div class="callout">After every transaction you analyze, check that ΔAssets = ΔLiabilities + ΔEquity. If it doesn't, you made an error somewhere.</div>`
      },
      {
        heading: 'Every transaction has two sides (debits & credits)',
        html: `<p>Under <b>double-entry bookkeeping</b>, every transaction touches at least two accounts, and the equation stays balanced. Accountants call the two sides <b>debits (Dr)</b> and <b>credits (Cr)</b>. "Debit" just means the left column and "credit" the right column. Neither word means good or bad.</p>
<table class="mini">
  <tr><th>Account type</th><th>Debit</th><th>Credit</th></tr>
  <tr><td>Assets</td><td>↑ Increase</td><td>↓ Decrease</td></tr>
  <tr><td>Expenses</td><td>↑ Increase</td><td>↓ Decrease</td></tr>
  <tr><td>Liabilities</td><td>↓ Decrease</td><td>↑ Increase</td></tr>
  <tr><td>Equity</td><td>↓ Decrease</td><td>↑ Increase</td></tr>
  <tr><td>Revenue</td><td>↓ Decrease</td><td>↑ Increase</td></tr>
</table>
<p><b>Examples</b> (total debits always = total credits):</p>
<table class="mini">
  <tr><th>Transaction</th><th>Debit</th><th>Credit</th></tr>
  <tr><td>Borrow $1,000</td><td>Cash $1,000</td><td>Loan payable $1,000</td></tr>
  <tr><td>Buy $500 inventory for cash</td><td>Inventory $500</td><td>Cash $500</td></tr>
  <tr><td>Sell $300 of services on credit</td><td>Accounts receivable $300</td><td>Revenue $300</td></tr>
  <tr><td>Record $50 depreciation</td><td>Depreciation expense $50</td><td>Accumulated depreciation $50</td></tr>
</table>
<div class="callout">For this class you mostly need the <b>"two sides" idea</b>, not the Dr/Cr labels. When something changes, ask "what's the other side?" Cash went up, so did a liability rise (loan), did equity rise (revenue or stock issued), or did another asset fall (sold equipment)?</div>`
      },
      {
        heading: 'Capitalize vs expense',
        html: `<p>When a company spends money, the cost either goes on the <b>Income Statement now</b> (expense) or on the <b>Balance Sheet as an asset</b> (capitalize) and gets expensed gradually later.</p>
<table class="mini">
  <tr><th></th><th>Expense</th><th>Capitalize</th></tr>
  <tr><td>Benefit lasts</td><td>This period only</td><td>Multiple future periods (&gt; 1 year)</td></tr>
  <tr><td>Examples</td><td>Rent, wages, ads, utilities, repairs</td><td>Machines, buildings, vehicles, purchased software</td></tr>
  <tr><td>Hits IS</td><td>Immediately, in full</td><td>Over time via <b>depreciation</b> / <b>amortization</b></td></tr>
  <tr><td>On CFS</td><td>CFO (through Net Income)</td><td>CFI (as capex)</td></tr>
</table>
<div class="callout">Coffee-shop example: the <b>espresso machine is capitalized</b> as PP&amp;E because it will make coffee for years. Expensing it all in month one would make that month look terrible and later months look too good, which breaks the matching principle.</div>
<div class="callout warn">Capitalizing doesn't make the cost go away. It moves the expense into future periods through depreciation. Companies that capitalize aggressively can look more profitable today than they really are.</div>`
      },
      {
        heading: 'How the three statements fit together',
        html: `<table class="mini">
  <tr><th>Statement</th><th>Covers</th><th>Key question</th></tr>
  <tr><td><b>Income Statement</b></td><td>A period (quarter/year)</td><td>Did we make a profit?</td></tr>
  <tr><td><b>Balance Sheet</b></td><td>A single date</td><td>What do we own and owe right now?</td></tr>
  <tr><td><b>Cash Flow Statement</b></td><td>A period</td><td>How did cash change, and why?</td></tr>
</table>
<p><b>The big links</b> (covered in depth in the Linking lesson):</p>
<ul>
  <li><b>Net Income</b> (bottom of IS) → top of the CFS <i>and</i> added to <b>Retained Earnings</b> on the BS.</li>
  <li>Non-cash expenses like <b>depreciation</b> reduce NI, get added back on the CFS, and reduce PP&amp;E on the BS.</li>
  <li>Changes in BS working-capital accounts (A/R, inventory, A/P) show up in CFO.</li>
  <li><b>Ending cash</b> on the CFS = <b>Cash</b> on the BS.</li>
</ul>
<div class="callout">One-liner: the IS measures profit, the CFS turns profit into cash, and the BS records where everything stands at the end.</div>`
      },
      {
        heading: 'Practice-problem conventions (read this!)',
        html: `<p>The class problem sets use these simplifying assumptions. Use them unless a question says otherwise:</p>
<ul>
  <li><b>Tax rate = 40%.</b> A pretax change of X changes Net Income by <b>X × (1 − 40%) = 0.6X</b>.</li>
  <li><b>Taxes are paid in cash</b> in the same period, unless the problem says they are payable later. Then use <b>Taxes Payable</b>.</li>
  <li>Walk through in this order: <b>Income Statement → Cash Flow Statement → Balance Sheet</b>, then check A = L + E.</li>
  <li>The CFS uses the <b>indirect method</b>.</li>
  <li><b>SBC</b> is treated as tax-deductible in the year it is expensed.</li>
</ul>
<div class="formula">ΔNet Income = ΔPretax Income × (1 − 0.40)</div>
<table class="mini">
  <tr><th>Pretax change</th><th>Tax (40%)</th><th>NI change</th></tr>
  <tr><td>+$100</td><td>+$40</td><td>+$60</td></tr>
  <tr><td>−$100</td><td>−$40 (tax saving)</td><td>−$60</td></tr>
  <tr><td>−$40</td><td>−$16</td><td>−$24</td></tr>
  <tr><td>+$50</td><td>+$20</td><td>+$30</td></tr>
</table>`
      }
    ],
    takeaways: [
      'The three statements answer three questions: profitable? (IS), what do we own and owe? (BS), where did cash go? (CFS).',
      '10-K = annual and audited; 10-Q = quarterly and reviewed (not audited). Both are free on SEC EDGAR.',
      'Accrual accounting records revenue when earned and expenses when incurred, so Net Income usually ≠ cash flow.',
      'The matching principle puts expenses in the same period as the revenue they helped generate (COGS when sold, depreciation over useful life).',
      'Assets = Liabilities + Equity always holds, because every transaction has two sides.',
      'Long-lived purchases (equipment) are capitalized and depreciated. Short-lived costs (rent, wages) are expensed.',
      'Class default: 40% tax, paid in cash, so ΔNI = 0.6 × Δpretax income.'
    ],
    pitfalls: [
      'Thinking "debit" means bad or "credit" means good. They are just left and right sides of an entry.',
      'Recording revenue when cash arrives instead of when it is earned (e.g., booking a customer prepayment as revenue).',
      'Expensing a long-lived asset all at once instead of capitalizing and depreciating it.',
      'Forgetting the tax effect: a $100 pretax change is a $60 Net Income change at 40%, not $100.',
      'Treating a loan or a stock issuance as revenue. Both are financing, and neither touches the Income Statement.'
    ]
  },

  /* =====================================================================
     2. INCOME STATEMENT
     ===================================================================== */
  {
    id: 'is', topic: 'is', title: 'The Income Statement', icon: '📈',
    summary: 'The Income Statement shows whether a company made a profit over a period, starting from revenue at the top and subtracting costs layer by layer down to net income.',
    sections: [
      {
        heading: 'What it shows',
        html: `<p>The Income Statement (also called the <b>P&amp;L</b>, profit and loss statement, or statement of operations) measures <b>performance over a period of time</b>: a quarter or a year.</p>
<div class="formula">Revenue − Expenses = Net Income</div>
<ul>
  <li>It is built on <b>accrual accounting</b>: revenue when earned, expenses when incurred.</li>
  <li>It covers a <b>period</b> ("for the year ended Dec 31"), unlike the BS, which is one date ("as of Dec 31").</li>
  <li>It only contains items that affect <b>profit</b>. Some cash movements never appear on it at all.</li>
</ul>
<div class="callout">Think of the IS as a <b>waterfall</b>. Revenue pours in at the top, and each layer of cost takes a share until Net Income is left at the bottom.</div>`
      },
      {
        heading: 'Top-to-bottom structure',
        html: `<ol>
  <li><b>Revenue</b> (sales, the "top line")</li>
  <li>− <b>Cost of Goods Sold (COGS)</b>: direct cost of what was sold</li>
  <li>= <b>Gross Profit</b></li>
  <li>− <b>Operating Expenses</b>: SG&amp;A, R&amp;D, D&amp;A (if shown separately)</li>
  <li>= <b>Operating Income (EBIT)</b></li>
  <li>− Interest expense + interest income ± other income/expense</li>
  <li>= <b>Pre-Tax Income (EBT)</b></li>
  <li>− <b>Income Tax Expense</b></li>
  <li>= <b>Net Income</b> (the "bottom line")</li>
  <li>÷ shares outstanding = <b>Earnings Per Share (EPS)</b></li>
</ol>
<div class="formula">Gross Profit = Revenue − COGS<br>EBIT = Gross Profit − Operating Expenses<br>Pre-Tax Income = EBIT − Interest Expense + Interest Income ± Other<br>Net Income = Pre-Tax Income − Taxes</div>`
      },
      {
        heading: 'Each line, explained',
        html: `<table class="mini">
  <tr><th>Line</th><th>What goes in it</th></tr>
  <tr><td><b>Revenue</b></td><td>Sales of goods/services earned in the period, net of returns and discounts.</td></tr>
  <tr><td><b>COGS</b></td><td>Direct costs of producing what was sold: materials, factory labor, coffee beans and cups. Tied to units sold.</td></tr>
  <tr><td><b>SG&amp;A</b></td><td>Selling, General &amp; Administrative: salaries of non-production staff, rent, marketing, office costs.</td></tr>
  <tr><td><b>R&amp;D</b></td><td>Research &amp; development: designing new products, engineering. Usually expensed under GAAP.</td></tr>
  <tr><td><b>D&amp;A</b></td><td>Depreciation (tangible assets like machines) and amortization (intangibles like patents). Often buried inside COGS/SG&amp;A rather than shown as its own line.</td></tr>
  <tr><td><b>Interest expense</b></td><td>Cost of borrowing. Below EBIT because it depends on how the company is <i>financed</i>, not how it <i>operates</i>.</td></tr>
  <tr><td><b>Other income/expense</b></td><td>Non-core items: gains/losses on asset sales, investment income, FX gains/losses.</td></tr>
  <tr><td><b>Income tax expense</b></td><td>Taxes on pretax income (40% in class problems).</td></tr>
</table>
<div class="callout">EBIT = <b>E</b>arnings <b>B</b>efore <b>I</b>nterest and <b>T</b>axes. It measures the core business before any financing decisions, which makes it useful for comparing companies with different amounts of debt.</div>`
      },
      {
        heading: 'What does NOT belong on the Income Statement',
        html: `<p>Only revenue and expenses (things that change <i>profit</i>) go on the IS. These common items <b>skip it entirely</b>:</p>
<table class="mini">
  <tr><th>Item</th><th>Why not on IS</th><th>Where it goes</th></tr>
  <tr><td>Buying equipment (capex)</td><td>Long-lived asset; it is depreciated over time instead</td><td>CFI; PP&amp;E on BS</td></tr>
  <tr><td>Taking out / repaying a loan (principal)</td><td>Financing, not earnings</td><td>CFF; Debt on BS</td></tr>
  <tr><td>Issuing or buying back stock</td><td>Transactions with owners</td><td>CFF; Equity on BS</td></tr>
  <tr><td>Paying dividends</td><td>Distribution of profit, not a cost of earning it</td><td>CFF; reduces Retained Earnings</td></tr>
  <tr><td>Collecting A/R</td><td>Revenue was already recorded at the sale</td><td>CFO (working capital)</td></tr>
  <tr><td>Buying inventory</td><td>Becomes COGS only when sold</td><td>Inventory on BS; CFO</td></tr>
  <tr><td>Customer prepayment</td><td>Not earned yet</td><td>Deferred Revenue (liability)</td></tr>
</table>
<div class="callout warn">The <b>interest</b> on a loan goes on the IS. The <b>principal</b> (borrowing or repaying it) does not.</div>`
      },
      {
        heading: 'Single-step vs multi-step',
        html: `<ul>
  <li><b>Single-step:</b> add all revenues and gains, subtract all expenses and losses, done. Simple, but hides useful subtotals.</li>
  <li><b>Multi-step:</b> shows subtotals such as <b>Gross Profit</b>, <b>Operating Income</b>, and <b>Pre-Tax Income</b>. Most public companies and nearly all analysts use this format.</li>
</ul>
<table class="mini">
  <tr><th>Single-step</th><th>Multi-step</th></tr>
  <tr><td>Revenue 1,000<br>Total expenses (868)<br><b>Net Income 132</b></td><td>Revenue 1,000 → Gross Profit 600 → EBIT 250 → Pretax 220 → <b>NI 132</b></td></tr>
</table>
<div class="callout">Both formats reach the <b>same Net Income</b>. Multi-step tells you <i>where</i> the money is made or lost: production (gross margin), overhead (operating margin), or financing (interest).</div>`
      },
      {
        heading: 'EBITDA & margins',
        html: `<div class="formula">EBITDA = EBIT + Depreciation + Amortization</div>
<p><b>EBITDA</b> (Earnings Before Interest, Taxes, Depreciation &amp; Amortization) is a rough proxy for operating cash flow. It removes the main non-cash expense, D&amp;A, and ignores financing and taxes. Analysts use it a lot in valuation (EV/EBITDA) and in debt analysis (Debt/EBITDA).</p>
<p><b>Margins</b> divide a profit line by revenue, so you can compare companies of any size:</p>
<table class="mini">
  <tr><th>Margin</th><th>Formula</th><th>Sample Co.</th></tr>
  <tr><td>Gross margin</td><td>Gross Profit ÷ Revenue</td><td>600 ÷ 1,000 = 60%</td></tr>
  <tr><td>Operating (EBIT) margin</td><td>EBIT ÷ Revenue</td><td>250 ÷ 1,000 = 25%</td></tr>
  <tr><td>EBITDA margin</td><td>EBITDA ÷ Revenue</td><td>300 ÷ 1,000 = 30%</td></tr>
  <tr><td>Net margin</td><td>Net Income ÷ Revenue</td><td>132 ÷ 1,000 = 13.2%</td></tr>
</table>
<div class="callout warn">EBITDA is <b>not cash flow</b>. It ignores capex, working capital, interest, and taxes, all of which cost real cash. A capital-intensive company can have strong EBITDA and still burn cash.</div>`
      },
      {
        heading: 'Worked example: the coffee shop',
        html: `<p>A coffee shop's first year: sales of $20,000; beans, milk, and cups cost $6,000; wages $4,000; rent $2,000; advertising $1,000. It also bought an espresso machine. Tax rate 40%.</p>
<table class="mini">
  <tr><th>Line</th><th>Amount</th><th>Note</th></tr>
  <tr><td>Revenue</td><td>$20,000</td><td></td></tr>
  <tr><td>COGS</td><td>($6,000)</td><td>Beans, milk, cups</td></tr>
  <tr><td><b>Gross Profit</b></td><td><b>$14,000</b></td><td>70% gross margin</td></tr>
  <tr><td>Wages</td><td>($4,000)</td><td>OpEx</td></tr>
  <tr><td>Rent</td><td>($2,000)</td><td>OpEx</td></tr>
  <tr><td>Advertising</td><td>($1,000)</td><td>OpEx</td></tr>
  <tr><td><b>Operating Income = Pretax Income</b></td><td><b>$7,000</b></td><td>No interest, so EBIT = pretax (35% margin)</td></tr>
  <tr><td>Taxes (40%)</td><td>($2,800)</td><td>7,000 × 0.40</td></tr>
  <tr><td><b>Net Income</b></td><td><b>$4,200</b></td><td>21% net margin</td></tr>
</table>
<div class="callout"><b>Where's the espresso machine?</b> Not in OpEx. It is <b>capitalized</b> as PP&amp;E on the Balance Sheet because it will make coffee for years, and the matching principle spreads its cost over those years through <b>depreciation</b>. (This problem's numbers don't include a depreciation charge. If they did, it would be one more operating expense and would lower pretax income.)</div>`
      },
      {
        heading: 'Non-cash items on the Income Statement',
        html: `<p>Some expenses reduce Net Income but <b>don't use cash in the period</b>. On the CFS (indirect method) you add them back:</p>
<ul>
  <li><b>Depreciation &amp; amortization</b>: the cash left when the asset was bought (capex) in an earlier period.</li>
  <li><b>Stock-based compensation (SBC)</b>: employees are paid in stock, not cash. It is usually embedded inside COGS, SG&amp;A, and R&amp;D and disclosed in the notes.</li>
  <li><b>Impairments / write-downs</b>: an asset's value is cut on paper.</li>
  <li><b>PIK interest</b>: interest paid by adding to the loan balance instead of in cash.</li>
  <li><b>Gains / losses on asset sales</b>: an accounting difference between sale price and book value. The real cash (the full proceeds) shows up in CFI.</li>
</ul>
<div class="callout">Non-cash <b>expenses</b> still lower <b>taxes</b>, which <i>does</i> save cash. That's why a $10 depreciation increase raises cash by $4 at a 40% tax rate.</div>`
      },
      {
        heading: 'One-time items & EPS',
        html: `<p><b>One-time (non-recurring) items</b> are unusual events that won't happen every year: restructuring charges, lawsuit settlements, big impairments, gains on selling a division.</p>
<ul>
  <li>Analysts often <b>exclude</b> them to see "normal" earning power. This gives <b>Adjusted EBITDA</b>, <b>adjusted EPS</b>, or "non-GAAP" metrics.</li>
  <li>Be skeptical when a company has "one-time" charges <i>every</i> year. At that point they're recurring.</li>
</ul>
<div class="formula">Basic EPS = (Net Income − Preferred Dividends) ÷ Weighted Avg. Shares Outstanding</div>
<ul>
  <li><b>Diluted EPS</b> also counts shares that <i>could</i> exist from options, RSUs, and convertible bonds, so it is ≤ basic EPS.</li>
  <li>Sample Co.: NI $132 ÷ 100 shares = <b>$1.32 EPS</b>.</li>
</ul>
<div class="callout warn">Adding back SBC in "adjusted" earnings is common but controversial. Paying employees in stock is a real cost to shareholders (dilution).</div>`
      }
    ],
    example: {
      title: 'Sample Co. Income Statement (FY2026, $ in millions)',
      rows: [
        { label: 'Revenue', value: '1,000', term: 'Revenue', kind: 'line' },
        { label: 'Cost of Goods Sold', value: '(400)', term: 'Cost of Goods Sold', kind: 'line' },
        { label: 'Gross Profit', value: '600', term: 'Gross Profit', kind: 'total' },
        { label: 'Operating Expenses', value: '', term: 'Operating Expenses', kind: 'header' },
        { label: 'SG&A', value: '(180)', term: 'SG&A', kind: 'sub' },
        { label: 'Research & Development', value: '(100)', term: 'Research & Development', kind: 'sub' },
        { label: 'Stock-Based Compensation (shown separately here)', value: '(20)', term: 'Stock-Based Compensation', kind: 'sub' },
        { label: 'Depreciation', value: '(40)', term: 'Depreciation', kind: 'sub' },
        { label: 'Amortization', value: '(10)', term: 'Amortization', kind: 'sub' },
        { label: 'Total Operating Expenses', value: '(350)', term: 'Operating Expenses', kind: 'total' },
        { label: 'Operating Income (EBIT)', value: '250', term: 'Operating Income', kind: 'total' },
        { label: 'Interest Expense', value: '(30)', term: 'Interest Expense', kind: 'line' },
        { label: 'Interest Income', value: '5', term: 'Interest Income', kind: 'line' },
        { label: 'Other Income / Expense', value: '', term: 'Other Income / Expense', kind: 'header' },
        { label: 'Gain on Sale of Assets', value: '10', term: 'Gain on Sale of Assets', kind: 'sub' },
        { label: 'Impairment', value: '(15)', term: 'Impairment', kind: 'sub' },
        { label: 'Pre-Tax Income', value: '220', term: 'Pre-Tax Income', kind: 'total' },
        { label: 'Income Tax Expense (40%)', value: '(88)', term: 'Income Tax Expense', kind: 'line' },
        { label: 'Net Income', value: '132', term: 'Net Income', kind: 'grand' },
        { label: 'Earnings Per Share (100 shares)', value: '$1.32', term: 'Earnings Per Share', kind: 'line' },
        { label: 'Memo: EBITDA (250 + 40 + 10)', value: '300', term: 'EBITDA', kind: 'line' }
      ]
    },
    takeaways: [
      'The IS measures profit over a period: Revenue − Expenses = Net Income.',
      'Order: Revenue → COGS → Gross Profit → OpEx → EBIT → Interest/Other → Pretax → Taxes → Net Income → EPS.',
      'Only revenue and expenses belong on the IS. Capex, loan principal, stock issuance, dividends, and A/R collections do not.',
      'EBIT measures the core business before financing. EBITDA = EBIT + D&A.',
      'Margins (profit ÷ revenue) let you compare companies of different sizes.',
      'Coffee shop: $20,000 revenue → $14,000 gross profit (70%) → $7,000 pretax → $4,200 net income (21%).',
      'Non-cash expenses (D&A, SBC, impairments) reduce NI, so they are added back on the CFS.'
    ],
    pitfalls: [
      'Putting a big equipment purchase in OpEx instead of capitalizing it.',
      'Putting loan principal or dividends on the IS. Only interest belongs there.',
      'Calculating taxes on revenue or gross profit instead of on pretax income.',
      'Treating EBITDA as if it were cash flow (it ignores capex, working capital, interest, and taxes).',
      'Forgetting that interest expense sits below EBIT, so EBIT is unaffected by how much debt a company has.',
      'Counting inventory purchases as COGS before the goods are sold.'
    ]
  },

  /* =====================================================================
     3. BALANCE SHEET
     ===================================================================== */
  {
    id: 'bs', topic: 'bs', title: 'The Balance Sheet', icon: '⚖️',
    summary: 'The Balance Sheet is a snapshot of what a company owns (assets), what it owes (liabilities), and what belongs to its owners (equity) on one specific date.',
    sections: [
      {
        heading: 'A snapshot at a point in time',
        html: `<p>The IS is like a video of the year. The Balance Sheet is a <b>photo</b> taken on one date ("as of December 31, 2026").</p>
<ul>
  <li>It shows <b>balances</b>, meaning how much of each account exists right now.</li>
  <li>Comparing two balance sheets (this year vs last year) shows what <b>changed</b>, and those changes drive the Cash Flow Statement.</li>
  <li>Also called the <b>statement of financial position</b>.</li>
</ul>
<div class="callout">Flows (IS and CFS) explain how you got from last year's photo to this year's photo.</div>`
      },
      {
        heading: 'A = L + E: why it always balances',
        html: `<div class="formula">Assets = Liabilities + Shareholders' Equity</div>
<ul>
  <li><b>Left side (assets)</b>: what the company has.</li>
  <li><b>Right side (L + E)</b>: who funded it. Creditors funded the liabilities and owners funded the equity.</li>
</ul>
<p>Every transaction keeps the two sides equal:</p>
<table class="mini">
  <tr><th>Transaction</th><th>Assets</th><th>Liabilities</th><th>Equity</th></tr>
  <tr><td>Issue $100 of stock</td><td>Cash +100</td><td></td><td>+100</td></tr>
  <tr><td>Borrow $100</td><td>Cash +100</td><td>Debt +100</td><td></td></tr>
  <tr><td>Buy $100 machine with cash</td><td>Cash −100, PP&amp;E +100</td><td></td><td></td></tr>
  <tr><td>Buy $100 inventory on credit</td><td>Inventory +100</td><td>A/P +100</td><td></td></tr>
  <tr><td>Pay $100 dividend</td><td>Cash −100</td><td></td><td>RE −100</td></tr>
</table>`
      },
      {
        heading: 'Current vs non-current & liquidity order',
        html: `<ul>
  <li><b>Current</b> = expected to turn into cash (assets) or be paid (liabilities) <b>within one year</b> (or one operating cycle).</li>
  <li><b>Non-current (long-term)</b> = longer than one year.</li>
</ul>
<p>US balance sheets list assets in <b>order of liquidity</b>, meaning how quickly each converts to cash. Cash comes first, then the items that take longer, with long-lived assets like PP&amp;E and goodwill near the bottom. Liabilities are listed by <b>when they come due</b>.</p>
<table class="mini">
  <tr><th>Most liquid →</th><th></th><th>→ Least liquid</th></tr>
  <tr><td>Cash, securities</td><td>A/R → Inventory → Prepaids</td><td>PP&amp;E → Intangibles → Goodwill</td></tr>
</table>
<div class="callout">Why it matters: current assets vs current liabilities tells you whether the company can pay its <b>near-term bills</b> (current ratio, working capital).</div>
<div class="formula">Working Capital = Current Assets − Current Liabilities</div>
<div class="callout warn">IFRS companies often list the order in reverse, with non-current assets first and equity before liabilities. Same items, different order.</div>`
      },
      {
        heading: 'Assets, line by line',
        html: `<p><b>Current assets</b></p>
<table class="mini">
  <tr><th>Item</th><th>What it is</th></tr>
  <tr><td>Cash &amp; equivalents</td><td>Cash plus very safe, very short-term investments (≤ 3 months, e.g., T-bills, money market funds)</td></tr>
  <tr><td>Marketable securities</td><td>Short-term investments that can be sold quickly (bonds, stocks)</td></tr>
  <tr><td>Accounts receivable</td><td>Money customers owe for sales already made on credit</td></tr>
  <tr><td>Inventory</td><td>Goods waiting to be sold (raw materials, work in progress, finished goods)</td></tr>
  <tr><td>Prepaid expenses</td><td>Costs paid in advance (insurance, rent) that will be expensed later</td></tr>
</table>
<p><b>Non-current assets</b></p>
<table class="mini">
  <tr><th>Item</th><th>What it is</th></tr>
  <tr><td>PP&amp;E (net)</td><td>Property, plant &amp; equipment at cost minus <b>accumulated depreciation</b></td></tr>
  <tr><td>Goodwill</td><td>Premium paid in an acquisition above the fair value of the net assets bought</td></tr>
  <tr><td>Intangible assets</td><td>Patents, trademarks, customer lists (mostly from acquisitions), amortized over time</td></tr>
  <tr><td>Right-of-use asset</td><td>The right to use leased property (from a lease contract)</td></tr>
</table>
<div class="callout"><b>Accumulated depreciation</b> is a <b>contra-asset</b>: a negative number that sits next to gross PP&amp;E. Gross PP&amp;E 600 − Acc. Dep. 200 = Net PP&amp;E 400.</div>`
      },
      {
        heading: 'Liabilities, line by line',
        html: `<p><b>Current liabilities</b> (due within a year)</p>
<table class="mini">
  <tr><th>Item</th><th>What it is</th></tr>
  <tr><td>Accounts payable</td><td>Bills owed to suppliers for goods/services already received</td></tr>
  <tr><td>Accrued expenses</td><td>Expenses incurred but not yet billed or paid (wages earned, utilities)</td></tr>
  <tr><td>Deferred revenue</td><td>Cash received from customers for goods/services not yet delivered</td></tr>
  <tr><td>Income taxes payable</td><td>Taxes owed but not yet paid</td></tr>
  <tr><td>Current portion of LT debt</td><td>Debt principal due within the next 12 months</td></tr>
</table>
<p><b>Long-term liabilities</b></p>
<table class="mini">
  <tr><th>Item</th><th>What it is</th></tr>
  <tr><td>Long-term debt</td><td>Loans and bonds due after one year</td></tr>
  <tr><td>Operating lease liability</td><td>Present value of future lease payments</td></tr>
  <tr><td>Deferred tax liability</td><td>Taxes owed in the future because tax rules let the company deduct expenses faster than book rules (e.g., accelerated tax depreciation)</td></tr>
</table>
<div class="callout warn">Deferred revenue is a <b>liability</b>. The company owes the customer a product or service (or a refund). It becomes revenue only when delivered.</div>`
      },
      {
        heading: "Shareholders' equity",
        html: `<table class="mini">
  <tr><th>Item</th><th>What it is</th></tr>
  <tr><td>Common stock (par)</td><td>Tiny "par value" of shares issued (often $0.01/share)</td></tr>
  <tr><td>Additional paid-in capital (APIC)</td><td>Cash received from investors above par, plus SBC</td></tr>
  <tr><td>Retained earnings</td><td>All past net income minus all dividends ever paid</td></tr>
  <tr><td>Treasury stock</td><td>Shares the company bought back. A <b>negative</b> (contra-equity) number</td></tr>
  <tr><td>AOCI</td><td>Accumulated other comprehensive income: certain unrealized gains/losses (FX translation, some securities) that skip the IS</td></tr>
</table>
<p>Equity grows two ways: owners <b>put money in</b> (stock issuance → common stock/APIC) or the company <b>earns and keeps profit</b> (retained earnings).</p>
<div class="callout">Equity is a <b>residual</b>: Assets − Liabilities. It is <b>not</b> a pile of cash. Retained earnings of $380 doesn't mean $380 is sitting in the bank. That profit may already have been spent on machines or inventory.</div>`
      },
      {
        heading: 'Retained earnings roll-forward',
        html: `<div class="formula">Ending RE = Beginning RE + Net Income − Dividends</div>
<p>This is the main link between the IS and the BS. Each period's profit flows into equity, and dividends flow out.</p>
<table class="mini">
  <tr><th>Sample Co.</th><th>$</th></tr>
  <tr><td>Beginning retained earnings</td><td>278</td></tr>
  <tr><td>+ Net Income (from IS)</td><td>+132</td></tr>
  <tr><td>− Dividends paid</td><td>(30)</td></tr>
  <tr><td><b>Ending retained earnings</b></td><td><b>380</b></td></tr>
</table>
<div class="callout warn">Dividends reduce retained earnings <b>directly</b>. They are not an expense and never touch the IS. A net loss also reduces RE, and RE can go negative (an "accumulated deficit").</div>`
      },
      {
        heading: 'PP&E roll-forward',
        html: `<div class="formula">Ending PP&amp;E = Beginning PP&amp;E + Capex − Depreciation − Disposals − Write-downs</div>
<table class="mini">
  <tr><th>Sample Co. (net PP&amp;E)</th><th>$</th><th>Where you see it</th></tr>
  <tr><td>Beginning PP&amp;E</td><td>380</td><td>Last year's BS</td></tr>
  <tr><td>+ Capital expenditures</td><td>+90</td><td>CFI</td></tr>
  <tr><td>− Depreciation</td><td>(40)</td><td>IS / CFS add-back</td></tr>
  <tr><td>− Disposals (book value of assets sold)</td><td>(15)</td><td>CFI proceeds; gain/loss on IS</td></tr>
  <tr><td>− Write-downs / impairments</td><td>(15)</td><td>IS / CFS add-back</td></tr>
  <tr><td><b>Ending PP&amp;E</b></td><td><b>400</b></td><td>This year's BS</td></tr>
</table>
<div class="callout">Roll-forwards work for almost any BS account: <b>Beginning + Additions − Reductions = Ending</b>. Debt (beg + new borrowing − repayments + PIK), inventory (beg + purchases − COGS), A/R (beg + credit sales − collections).</div>`
      },
      {
        heading: 'Book value vs market value',
        html: `<ul>
  <li><b>Book value of equity</b> = Total Assets − Total Liabilities, as recorded on the BS (mostly at historical cost).</li>
  <li><b>Market value of equity (market cap)</b> = Share price × Shares outstanding. It reflects what investors think future cash flows are worth.</li>
</ul>
<table class="mini">
  <tr><th>Sample Co.</th><th></th></tr>
  <tr><td>Book equity</td><td>$570</td></tr>
  <tr><td>Shares outstanding</td><td>100</td></tr>
  <tr><td>Book value per share</td><td>$5.70</td></tr>
  <tr><td>Share price</td><td>$25</td></tr>
  <tr><td>Market cap</td><td>$2,500</td></tr>
  <tr><td>Price-to-book (P/B)</td><td>2,500 ÷ 570 ≈ 4.4x</td></tr>
</table>
<div class="callout">Market value is usually <b>above</b> book value because the BS leaves out brand, talent, and customer loyalty, and it records assets at old historical costs. Software companies often trade at many times book. Banks often trade near 1x.</div>`
      },
      {
        heading: 'Worked example: building a new company\'s balance sheet',
        html: `<p>A brand-new company does four things:</p>
<ol>
  <li>Founders invest <b>$50,000</b> cash for stock.</li>
  <li>It borrows <b>$30,000</b> from a bank.</li>
  <li>It buys equipment for <b>$25,000</b> cash.</li>
  <li>It buys <b>$10,000</b> of inventory on credit (pays the supplier later).</li>
</ol>
<table class="mini">
  <tr><th>Step</th><th>Assets</th><th>Liabilities</th><th>Equity</th></tr>
  <tr><td>1</td><td>Cash +50,000</td><td></td><td>+50,000</td></tr>
  <tr><td>2</td><td>Cash +30,000</td><td>Debt +30,000</td><td></td></tr>
  <tr><td>3</td><td>Cash −25,000; PP&amp;E +25,000</td><td></td><td></td></tr>
  <tr><td>4</td><td>Inventory +10,000</td><td>A/P +10,000</td><td></td></tr>
</table>
<table class="mini">
  <tr><th>Assets</th><th>$</th><th>Liabilities &amp; Equity</th><th>$</th></tr>
  <tr><td>Cash (50k + 30k − 25k)</td><td>55,000</td><td>Accounts payable</td><td>10,000</td></tr>
  <tr><td>Inventory</td><td>10,000</td><td>Debt</td><td>30,000</td></tr>
  <tr><td>PP&amp;E</td><td>25,000</td><td>Equity</td><td>50,000</td></tr>
  <tr><td><b>Total assets</b></td><td><b>90,000</b></td><td><b>Total L + E</b></td><td><b>90,000</b></td></tr>
</table>
<div class="callout warn">The $30,000 loan is <b>financing, not revenue</b>. No sales happened yet, so the IS shows zero revenue and zero profit. Equity is still exactly what the founders put in.</div>`
      }
    ],
    example: {
      title: 'Sample Co. Balance Sheet (as of Dec 31, 2026, $ in millions)',
      rows: [
        { label: 'Current Assets', value: '', kind: 'header' },
        { label: 'Cash & Cash Equivalents', value: '150', term: 'Cash & Cash Equivalents', kind: 'sub' },
        { label: 'Marketable Securities', value: '50', term: 'Marketable Securities', kind: 'sub' },
        { label: 'Accounts Receivable', value: '120', term: 'Accounts Receivable', kind: 'sub' },
        { label: 'Inventory', value: '100', term: 'Inventory', kind: 'sub' },
        { label: 'Prepaid Expenses', value: '20', term: 'Prepaid Expenses', kind: 'sub' },
        { label: 'Total Current Assets', value: '440', kind: 'total' },
        { label: 'Non-Current Assets', value: '', kind: 'header' },
        { label: 'Property, Plant & Equipment (gross)', value: '600', term: 'Property, Plant & Equipment', kind: 'sub' },
        { label: 'Less: Accumulated Depreciation', value: '(200)', term: 'Accumulated Depreciation', kind: 'sub' },
        { label: 'PP&E, net', value: '400', term: 'Property, Plant & Equipment', kind: 'sub' },
        { label: 'Goodwill', value: '150', term: 'Goodwill', kind: 'sub' },
        { label: 'Intangible Assets', value: '60', term: 'Intangible Assets', kind: 'sub' },
        { label: 'Right-of-Use Asset', value: '50', term: 'Right-of-Use Asset', kind: 'sub' },
        { label: 'Total Assets', value: '1,100', term: 'Total Assets', kind: 'grand' },
        { label: 'Current Liabilities', value: '', kind: 'header' },
        { label: 'Accounts Payable', value: '80', term: 'Accounts Payable', kind: 'sub' },
        { label: 'Accrued Expenses', value: '40', term: 'Accrued Expenses', kind: 'sub' },
        { label: 'Deferred Revenue', value: '30', term: 'Deferred Revenue', kind: 'sub' },
        { label: 'Income Taxes Payable', value: '10', term: 'Income Taxes Payable', kind: 'sub' },
        { label: 'Current Portion of Long-Term Debt', value: '20', term: 'Current Portion of Long-Term Debt', kind: 'sub' },
        { label: 'Total Current Liabilities', value: '180', kind: 'total' },
        { label: 'Non-Current Liabilities', value: '', kind: 'header' },
        { label: 'Long-Term Debt', value: '280', term: 'Long-Term Debt', kind: 'sub' },
        { label: 'Operating Lease Liability', value: '45', term: 'Operating Lease Liability', kind: 'sub' },
        { label: 'Deferred Tax Liability', value: '25', term: 'Deferred Tax Liability', kind: 'sub' },
        { label: 'Total Liabilities', value: '530', term: 'Total Liabilities', kind: 'total' },
        { label: "Shareholders' Equity", value: '', kind: 'header' },
        { label: 'Common Stock (par)', value: '10', term: 'Common Stock', kind: 'sub' },
        { label: 'Additional Paid-In Capital', value: '240', term: 'Additional Paid-In Capital', kind: 'sub' },
        { label: 'Retained Earnings', value: '380', term: 'Retained Earnings', kind: 'sub' },
        { label: 'Treasury Stock', value: '(70)', term: 'Treasury Stock', kind: 'sub' },
        { label: 'Accumulated Other Comprehensive Income', value: '10', term: 'Accumulated Other Comprehensive Income', kind: 'sub' },
        { label: "Total Shareholders' Equity", value: '570', term: "Shareholders' Equity", kind: 'total' },
        { label: 'Total Liabilities & Equity (530 + 570)', value: '1,100', kind: 'grand' }
      ]
    },
    takeaways: [
      'The BS is a snapshot on one date. The IS and CFS cover a period.',
      'Assets = Liabilities + Equity, always. Every transaction keeps both sides equal.',
      'Current = within one year. Assets are listed from most to least liquid.',
      'Ending RE = Beginning RE + Net Income − Dividends.',
      'Ending PP&E = Beginning PP&E + Capex − Depreciation − Disposals − Write-downs.',
      'Deferred revenue is a liability. Accumulated depreciation and treasury stock are negative (contra) accounts.',
      'Book value (BS equity) usually differs from market value (share price × shares).',
      'New company: Cash 55,000 + Inventory 10,000 + PP&E 25,000 = 90,000 = A/P 10,000 + Debt 30,000 + Equity 50,000.'
    ],
    pitfalls: [
      'Treating a bank loan as revenue or as equity. It is a liability.',
      'Thinking retained earnings is a cash balance.',
      'Classifying deferred revenue as an asset because cash came in. The obligation to deliver makes it a liability.',
      'Forgetting that dividends reduce retained earnings directly and never appear on the IS.',
      'Adding accumulated depreciation to PP&E instead of subtracting it.',
      'Forgetting the current portion of long-term debt when adding up total debt.'
    ]
  },

  /* =====================================================================
     4. CASH FLOW STATEMENT
     ===================================================================== */
  {
    id: 'cfs', topic: 'cfs', title: 'The Cash Flow Statement', icon: '💵',
    summary: 'The Cash Flow Statement converts accrual-based net income into actual cash, splits every cash movement into operating, investing, and financing, and ends with the change in the cash balance.',
    sections: [
      {
        heading: 'Why Net Income ≠ cash',
        html: `<p>Accrual accounting records revenue and expenses when they are <i>earned or incurred</i>, not when cash moves. So a profitable company can run out of cash, and a money-losing one can have plenty of it. Common gaps:</p>
<ul>
  <li><b>Non-cash expenses</b> (depreciation, SBC, write-downs) reduce NI but use no cash this period.</li>
  <li><b>Credit sales</b> count as revenue now, but the cash arrives later (A/R).</li>
  <li><b>Inventory</b> bought now becomes COGS only when sold.</li>
  <li><b>Capex</b> uses lots of cash but only shows up on the IS slowly, as depreciation.</li>
  <li><b>Borrowing / issuing stock</b> brings cash in with zero effect on NI.</li>
</ul>
<div class="callout">"Cash is king." Companies go bankrupt because they <b>run out of cash</b>, not because of low accounting profit. The CFS shows where cash is really coming from.</div>`
      },
      {
        heading: 'The three sections',
        html: `<table class="mini">
  <tr><th>Section</th><th>What's in it</th><th>Typical items</th></tr>
  <tr><td><b>CFO</b><br>Operating</td><td>Cash from running the core business</td><td>Net income, D&amp;A, SBC, other non-cash items, changes in A/R, inventory, prepaids, A/P, accrued expenses, deferred revenue, taxes payable. Interest paid (US GAAP).</td></tr>
  <tr><td><b>CFI</b><br>Investing</td><td>Buying and selling long-term assets and investments</td><td>Capex (−), proceeds from selling PP&amp;E (+), acquisitions (−), buying/selling securities</td></tr>
  <tr><td><b>CFF</b><br>Financing</td><td>Transactions with lenders and owners</td><td>Issue debt (+), repay debt (−), issue stock (+), buy back stock (−), dividends paid (−)</td></tr>
</table>
<div class="formula">Net Change in Cash = CFO + CFI + CFF</div>
<div class="callout warn">Class conventions (US GAAP): <b>interest paid = CFO</b>, <b>dividends paid = CFF</b>, <b>asset-sale proceeds = CFI</b> (the full proceeds, not just the gain).</div>`
      },
      {
        heading: 'The indirect method, step by step',
        html: `<p>Almost every company uses the <b>indirect method</b> for CFO. It starts with Net Income and adjusts it back to cash:</p>
<ol>
  <li><b>Start with Net Income</b> (from the IS).</li>
  <li><b>Add back non-cash expenses</b>: D&amp;A, SBC, impairments/write-downs, PIK interest, deferred tax expense.</li>
  <li><b>Subtract non-cash gains</b> (and add back losses) on asset sales. The real cash goes in CFI.</li>
  <li><b>Adjust for changes in working capital</b> (operating assets and liabilities).</li>
  <li>= <b>Cash Flow from Operations</b>.</li>
  <li>Add <b>CFI</b> (capex, asset sales) and <b>CFF</b> (debt, equity, dividends).</li>
  <li>= <b>Net change in cash</b> → Beginning cash + change = Ending cash, which matches the BS.</li>
</ol>
<div class="formula">CFO = NI + Non-cash expenses − Non-cash gains − ΔOperating assets + ΔOperating liabilities</div>`
      },
      {
        heading: 'Add-backs: non-cash items',
        html: `<table class="mini">
  <tr><th>Item</th><th>CFS adjustment</th><th>Why</th></tr>
  <tr><td>Depreciation &amp; amortization</td><td>+ Add back</td><td>Cash left at purchase (capex in CFI) in an earlier period</td></tr>
  <tr><td>Stock-based compensation</td><td>+ Add back</td><td>Paid in shares, not cash</td></tr>
  <tr><td>Impairment / write-down</td><td>+ Add back</td><td>Paper reduction in asset value</td></tr>
  <tr><td>PIK interest</td><td>+ Add back</td><td>Added to the loan balance, not paid in cash</td></tr>
  <tr><td>Loss on sale of assets</td><td>+ Add back</td><td>Non-cash. Full proceeds are in CFI</td></tr>
  <tr><td>Gain on sale of assets</td><td>− Subtract</td><td>Already counted in the CFI proceeds; avoid double-counting</td></tr>
</table>
<div class="callout">You add back the <b>full pretax amount</b> (e.g., +$100 of depreciation), not the after-tax amount. NI already includes the tax saving, so the net cash effect = add-back − after-tax hit = the tax saving.</div>`
      },
      {
        heading: 'Working capital: the sign rules',
        html: `<table class="mini">
  <tr><th>Change</th><th>Cash effect</th><th>Intuition</th></tr>
  <tr><td>Operating <b>asset ↑</b><br>(A/R, inventory, prepaids)</td><td><b>Cash ↓</b> (subtract)</td><td>You tied up cash: sold on credit and haven't collected, or bought stock that's sitting on the shelf</td></tr>
  <tr><td>Operating <b>asset ↓</b></td><td><b>Cash ↑</b> (add)</td><td>You collected receivables or sold inventory you'd already paid for</td></tr>
  <tr><td>Operating <b>liability ↑</b><br>(A/P, accrued exp., deferred rev., taxes payable)</td><td><b>Cash ↑</b> (add)</td><td>You kept the cash. Bills aren't paid yet, or a customer paid you early</td></tr>
  <tr><td>Operating <b>liability ↓</b></td><td><b>Cash ↓</b> (subtract)</td><td>You paid off bills, or delivered on prepaid orders (no new cash)</td></tr>
</table>
<div class="callout"><b>Memory trick:</b> assets move <b>opposite</b> to cash; liabilities move the <b>same way</b> as cash. A/R +$100 → CFS −$100. A/P +$50 → CFS +$50.</div>
<div class="callout warn">Use the <b>change</b> in each account (ending − beginning), not the ending balance. And keep <b>cash itself</b> and <b>debt</b> out of working capital in CFO: debt changes go in CFF.</div>`
      },
      {
        heading: 'Net change in cash ties to the Balance Sheet',
        html: `<div class="formula">Beginning Cash + Net Change in Cash = Ending Cash (= BS cash)</div>
<p>This is the final check that the three statements are linked correctly. In Sample Co.'s CFS below: beginning cash 133 + net change 17 = <b>150</b>, the same as Cash &amp; Cash Equivalents on its balance sheet.</p>
<div class="callout">If you build a model and the cash doesn't match, one of the BS changes is either missing from the CFS or has the wrong sign.</div>`
      },
      {
        heading: 'Free cash flow',
        html: `<div class="formula">Free Cash Flow (FCF) = Cash Flow from Operations − Capital Expenditures</div>
<ul>
  <li>FCF is the cash the business generates <b>after reinvesting to maintain and grow its asset base</b>. It is cash available to repay debt, pay dividends, buy back stock, or make acquisitions.</li>
  <li>Investors often care more about FCF than about Net Income, because it is harder to manipulate.</li>
  <li>Sample Co.: CFO 172 − Capex 90 = <b>FCF 82</b>.</li>
</ul>
<div class="callout">Variants you'll hear: <b>Unlevered FCF</b> (before interest; used in DCF valuation) vs <b>Levered FCF</b> (after interest). The basic class formula is CFO − Capex.</div>`
      },
      {
        heading: 'Direct vs indirect method',
        html: `<table class="mini">
  <tr><th></th><th>Direct method</th><th>Indirect method</th></tr>
  <tr><td>CFO shows</td><td>Actual cash receipts and payments (cash from customers, cash paid to suppliers/employees)</td><td>NI adjusted for non-cash items and working capital</td></tr>
  <tr><td>Used by</td><td>Rare (FASB encourages it)</td><td>Almost all companies</td></tr>
  <tr><td>Strength</td><td>Intuitive. Shows where cash came from</td><td>Shows <b>why</b> NI and cash differ, and links the statements</td></tr>
</table>
<div class="callout">Both methods produce the <b>same CFO</b>. Only the presentation differs. CFI and CFF look identical either way. This class uses the indirect method.</div>`
      },
      {
        heading: 'Worked example: the 24,000 Net Income problem',
        html: `<p>A company had: Net Income <b>24,000</b>; depreciation <b>5,000</b>; A/R increased <b>8,000</b>; A/P increased <b>3,000</b>; bought equipment for <b>15,000</b>; borrowed <b>20,000</b>; repaid <b>5,000</b> of debt principal; paid cash dividends of <b>10,000</b>. Beginning cash 25,000.</p>
<table class="mini">
  <tr><th>Cash Flow from Operations</th><th>$</th></tr>
  <tr><td>Net Income</td><td>24,000</td></tr>
  <tr><td>+ Depreciation (non-cash)</td><td>+5,000</td></tr>
  <tr><td>− Increase in A/R (asset ↑ = cash ↓)</td><td>−8,000</td></tr>
  <tr><td>+ Increase in A/P (liability ↑ = cash ↑)</td><td>+3,000</td></tr>
  <tr><td><b>CFO</b></td><td><b>24,000</b></td></tr>
  <tr><th>Cash Flow from Investing</th><th></th></tr>
  <tr><td>Capex (equipment)</td><td>−15,000</td></tr>
  <tr><td><b>CFI</b></td><td><b>−15,000</b></td></tr>
  <tr><th>Cash Flow from Financing</th><th></th></tr>
  <tr><td>New borrowing</td><td>+20,000</td></tr>
  <tr><td>Dividends paid</td><td>−10,000</td></tr>
  <tr><td>Debt repayment</td><td>−5,000</td></tr>
  <tr><td><b>CFF</b></td><td><b>+5,000</b></td></tr>
  <tr><td><b>Net change in cash</b> (24,000 − 15,000 + 5,000)</td><td><b>+14,000</b></td></tr>
  <tr><td>Beginning cash</td><td>25,000</td></tr>
  <tr><td><b>Ending cash</b></td><td><b>39,000</b></td></tr>
</table>
<div class="formula">FCF = CFO − Capex = 24,000 − 15,000 = 9,000</div>
<div class="callout">CFO happens to equal NI here (24,000) because the +5,000 depreciation and +3,000 A/P exactly offset the −8,000 A/R build. That's a coincidence, not a rule.</div>`
      }
    ],
    example: {
      title: 'Sample Co. Cash Flow Statement (FY2026, $ in millions)',
      rows: [
        { label: 'Cash Flow from Operations', value: '', term: 'Cash Flow from Operations', kind: 'header' },
        { label: 'Net Income', value: '132', term: 'Net Income', kind: 'line' },
        { label: 'Depreciation', value: '40', term: 'Depreciation', kind: 'sub' },
        { label: 'Amortization', value: '10', term: 'Amortization', kind: 'sub' },
        { label: 'Stock-Based Compensation', value: '20', term: 'Stock-Based Compensation', kind: 'sub' },
        { label: 'Impairment', value: '15', term: 'Impairment', kind: 'sub' },
        { label: 'Less: Gain on Sale of Assets', value: '(10)', term: 'Gain on Sale of Assets', kind: 'sub' },
        { label: 'Changes in Working Capital', value: '', term: 'Changes in Working Capital', kind: 'header' },
        { label: '(Increase) in Accounts Receivable', value: '(30)', term: 'Accounts Receivable', kind: 'sub' },
        { label: '(Increase) in Inventory', value: '(20)', term: 'Inventory', kind: 'sub' },
        { label: 'Increase in Accounts Payable', value: '15', term: 'Accounts Payable', kind: 'sub' },
        { label: 'Cash Flow from Operations', value: '172', term: 'Cash Flow from Operations', kind: 'total' },
        { label: 'Investing Activities', value: '', kind: 'header' },
        { label: 'Capital Expenditures', value: '(90)', term: 'Capital Expenditures', kind: 'sub' },
        { label: 'Proceeds from Sale of Assets', value: '25', kind: 'sub' },
        { label: 'Cash Flow from Investing', value: '(65)', term: 'Cash Flow from Investing', kind: 'total' },
        { label: 'Financing Activities', value: '', kind: 'header' },
        { label: 'Repayment of Long-Term Debt', value: '(20)', term: 'Long-Term Debt', kind: 'sub' },
        { label: 'Share Repurchase', value: '(40)', term: 'Share Repurchase', kind: 'sub' },
        { label: 'Dividends Paid', value: '(30)', term: 'Dividends', kind: 'sub' },
        { label: 'Cash Flow from Financing', value: '(90)', term: 'Cash Flow from Financing', kind: 'total' },
        { label: 'Net Change in Cash (172 − 65 − 90)', value: '17', term: 'Net Change in Cash', kind: 'grand' },
        { label: 'Beginning Cash', value: '133', kind: 'line' },
        { label: 'Ending Cash (ties to BS)', value: '150', kind: 'total' },
        { label: 'Free Cash Flow (CFO 172 − Capex 90)', value: '82', term: 'Free Cash Flow', kind: 'line' }
      ]
    },
    takeaways: [
      'The CFS bridges accrual net income to actual cash: CFO + CFI + CFF = net change in cash.',
      'Indirect method: NI → add back non-cash expenses → subtract gains → adjust for working capital = CFO.',
      'Operating asset ↑ = cash ↓; operating liability ↑ = cash ↑.',
      'Interest paid is CFO, dividends are CFF, capex and asset-sale proceeds are CFI (US GAAP).',
      'Ending cash on the CFS must equal cash on the BS.',
      'FCF = CFO − Capex: cash available to lenders and owners after reinvestment.',
      'Worked problem: CFO 24,000; CFI −15,000; CFF +5,000; net change +14,000; ending cash 39,000; FCF 9,000.'
    ],
    pitfalls: [
      'Getting working-capital signs backwards (e.g., adding an increase in A/R).',
      'Adding back the after-tax amount of depreciation instead of the full amount.',
      'Forgetting to subtract a gain on sale in CFO, which double-counts it with the CFI proceeds.',
      'Putting dividends in CFO, or interest paid in CFF (under US GAAP interest is CFO).',
      'Using ending balances instead of changes for working-capital items.',
      'Subtracting capex from CFO and then also counting it in CFI when computing net change in cash.'
    ]
  },

  /* =====================================================================
     5. LINKING THE 3 STATEMENTS
     ===================================================================== */
  {
    id: 'link', topic: 'link', title: 'Linking the 3 Statements', icon: '🔗',
    summary: 'Every transaction ripples through all three statements in a set order (IS → CFS → BS), and once you learn the 3-step method you can "walk through" any change and prove the balance sheet still balances.',
    sections: [
      {
        heading: 'How the statements connect',
        html: `<table class="mini">
  <tr><th>Link</th><th>From</th><th>To</th></tr>
  <tr><td><b>Net Income</b></td><td>Bottom of IS</td><td>Top of CFS <i>and</i> Retained Earnings on BS</td></tr>
  <tr><td><b>D&amp;A / non-cash charges</b></td><td>Expense on IS</td><td>Added back on CFS; reduces PP&amp;E / intangibles on BS</td></tr>
  <tr><td><b>Working capital</b></td><td>Changes in BS current accounts</td><td>CFO adjustments (asset ↑ = cash ↓)</td></tr>
  <tr><td><b>Capex</b></td><td>CFI outflow</td><td>Increases PP&amp;E on BS</td></tr>
  <tr><td><b>Debt flows</b></td><td>CFF (issue / repay)</td><td>Debt on BS; interest → IS</td></tr>
  <tr><td><b>Equity flows</b></td><td>CFF (issue stock, buybacks, dividends)</td><td>Common stock/APIC, treasury stock, RE on BS</td></tr>
  <tr><td><b>Ending cash</b></td><td>Bottom of CFS</td><td>Cash on BS</td></tr>
</table>
<div class="callout">The IS and CFS are <b>flows</b> over a period. The BS holds the <b>stocks</b> (balances). Flows change the stocks: last year's BS + this year's flows = this year's BS.</div>`
      },
      {
        heading: 'The 3-step "walk me through" method',
        html: `<p>Use this every time. Interviewers and the class problem sets expect this order.</p>
<p><b>Step 1: Income Statement</b></p>
<ul>
  <li>Does it hit the IS at all? (Capex, loans, stock issuance, dividends: <b>no</b>.)</li>
  <li>Which line changes, and what is the <b>pretax</b> effect?</li>
  <li>Tax at 40% → <b>ΔNI = pretax × 0.6</b>.</li>
</ul>
<p><b>Step 2: Cash Flow Statement</b></p>
<ul>
  <li>Start with ΔNI.</li>
  <li>Add back non-cash expenses (D&amp;A, SBC, write-downs, PIK) / subtract non-cash gains.</li>
  <li>Working capital: operating asset ↑ → subtract; operating liability ↑ → add.</li>
  <li>CFI (capex, asset sales) and CFF (debt, stock, dividends).</li>
  <li>Sum = <b>net change in cash</b>.</li>
</ul>
<p><b>Step 3: Balance Sheet</b></p>
<ul>
  <li>Cash = the CFS bottom line.</li>
  <li>Every other CFS line maps to a BS account (A/R, PP&amp;E, debt…). For <b>assets</b>, flip the CFS sign. For <b>liabilities</b>, keep it.</li>
  <li>Retained Earnings changes by ΔNI (minus any dividends).</li>
</ul>
<p><b>Step 4: Check.</b> ΔAssets = ΔLiabilities + ΔEquity.</p>
<div class="callout">Say it out loud in interviews: "On the income statement… which flows to the cash flow statement… so on the balance sheet… and both sides go up/down by $X, so it balances."</div>`
      },
      {
        heading: 'Fully worked: depreciation goes up by $10 (40% tax)',
        html: `<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Depreciation +10<br>Pretax income −10<br>Taxes −4<br><b>Net Income −6</b></td><td>NI −6<br>Add back depreciation +10<br><b>CFO +4</b><br>Net change in cash <b>+4</b></td><td>Cash +4<br>PP&amp;E −10<br><b>Assets −6</b><br>RE −6<br><b>L + E −6</b> ✓</td></tr>
</table>
<p><b>Why does cash go <i>up</i>?</b> Depreciation itself uses no cash, but it is tax-deductible, so the company pays $4 less in taxes (10 × 40%). That tax saving is the only real cash effect.</p>
<div class="callout">General rule: a non-cash expense of X raises cash by <b>X × tax rate</b> and lowers NI by <b>X × (1 − tax rate)</b>.</div>`
      },
      {
        heading: 'Credit sale of $100 (tax payable next month)',
        html: `<p>Sell $100 of services on credit. Tax at 40% is <b>owed but not paid yet</b>.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Revenue +100<br>Pretax +100<br>Tax expense +40<br><b>NI +60</b></td><td>NI +60<br>Increase in A/R −100<br>Increase in taxes payable +40<br><b>CFO 0</b> → cash unchanged</td><td>A/R +100<br><b>Assets +100</b><br>Taxes payable +40<br>RE +60<br><b>L + E +100</b> ✓</td></tr>
</table>
<div class="callout">The company is $60 "richer" on paper but has not received a dollar. Customers owe it $100 and it owes the government $40. Later, collecting the A/R brings in +100 and paying the tax sends out −40.</div>`
      },
      {
        heading: 'Deferred revenue: $100 cash for next month\'s service',
        html: `<p><b>This month</b>: a customer pays $100 now for a service delivered next month.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td><b>No impact</b><br>(not earned yet)</td><td>Increase in deferred revenue +100<br><b>CFO +100</b></td><td>Cash +100<br>Deferred revenue +100<br>A +100 = L +100 ✓</td></tr>
</table>
<p><b>Next month</b>: the service is delivered, so the revenue is earned. Tax at 40% is paid in cash.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Revenue +100<br>Tax +40<br><b>NI +60</b></td><td>NI +60<br>Decrease in deferred revenue −100<br><b>CFO −40</b> (just the tax paid)</td><td>Cash −40<br>Deferred revenue −100<br>RE +60<br>A −40 = L −100 + E +60 ✓</td></tr>
</table>
<div class="callout">Over both months: cash +60, revenue $100, NI +60. They match in total, but cash came <b>first</b> and profit came <b>later</b>.</div>`
      },
      {
        heading: 'Selling inventory: cost $60, sold for $100 cash',
        html: `<p>Inventory bought earlier for $60 is sold for $100 cash. Tax at 40% is paid in cash.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Revenue +100<br>COGS +60<br>Pretax +40<br>Tax +16<br><b>NI +24</b></td><td>NI +24<br>Decrease in inventory +60<br><b>CFO +84</b></td><td>Cash +84<br>Inventory −60<br><b>Assets +24</b><br>RE +24<br><b>E +24</b> ✓</td></tr>
</table>
<div class="callout">Check cash directly: received $100, paid $16 tax → +$84. The inventory was paid for in an <i>earlier</i> period, so it doesn't use cash now. On the CFS the inventory decrease adds +60 back to NI.</div>`
      },
      {
        heading: 'Common interview questions',
        html: `<p><b>"If you could only use one statement to judge a company, which would you pick?"</b><br>The <b>Cash Flow Statement</b>. It shows how much cash the business actually generates and is hard to fake. (If you can pick two, choose the <b>IS + BS</b>, because you can rebuild the CFS from them.)</p>
<p><b>"Depreciation goes up by $10. Walk me through it."</b><br>NI −6; CFO +4 (−6 + 10); cash +4, PP&amp;E −10, assets −6; RE −6. Balanced.</p>
<p><b>"A company buys $100 of PP&amp;E with cash."</b><br>IS: nothing at first. CFS: CFI −100. BS: cash −100, PP&amp;E +100, so total assets are unchanged.</p>
<p><b>"Can a company have positive Net Income and still go bankrupt?"</b><br>Yes. If customers pay slowly (A/R grows), inventory piles up, or debt comes due, cash can run out even while the IS shows profit.</p>
<p><b>"A company issues $100 of debt and uses it to buy PP&amp;E."</b><br>No IS effect. CFS: CFF +100, CFI −100, net cash 0. BS: PP&amp;E +100, debt +100.</p>
<p><b>"What happens when a company pays a $50 dividend?"</b><br>No IS effect. CFF −50. Cash −50; RE −50.</p>`
      },
      {
        heading: 'Shortcuts & sanity checks',
        html: `<ul>
  <li><b>No IS impact?</b> Then NI and RE don't change, and the transaction is purely a BS swap or a financing/investing flow.</li>
  <li><b>Cash check:</b> ask "what actually crossed the bank account?" (cash received − cash paid, including taxes). It should equal your CFS total.</li>
  <li><b>Equity check:</b> ΔEquity = ΔNI − dividends + stock issued (incl. SBC) − buybacks.</li>
  <li><b>Pretax/after-tax:</b> at 40% tax, every pretax $100 is $60 of NI and $40 of tax.</li>
  <li>If assets ≠ L + E, look for a <b>missed working-capital account</b> (taxes payable, accrued expenses) or a <b>sign flip</b>.</li>
</ul>
<div class="callout warn">Don't forget <b>taxes</b> on the BS. If tax is paid in cash, it's already in the cash number. If tax is payable later, add a <b>Taxes Payable</b> liability.</div>`
      }
    ],
    example: {
      title: 'Flow-through: Depreciation +$10 (40% tax)',
      rows: [
        { label: 'Income Statement', value: '', kind: 'header' },
        { label: 'Depreciation', value: '+10', term: 'Depreciation', kind: 'sub' },
        { label: 'Pre-Tax Income', value: '−10', term: 'Pre-Tax Income', kind: 'sub' },
        { label: 'Income Tax Expense (40%)', value: '−4', term: 'Income Tax Expense', kind: 'sub' },
        { label: 'Net Income', value: '−6', term: 'Net Income', kind: 'total' },
        { label: 'Cash Flow Statement', value: '', kind: 'header' },
        { label: 'Net Income', value: '−6', term: 'Net Income', kind: 'sub' },
        { label: 'Add back: Depreciation', value: '+10', term: 'Depreciation', kind: 'sub' },
        { label: 'Cash Flow from Operations', value: '+4', term: 'Cash Flow from Operations', kind: 'total' },
        { label: 'Net Change in Cash', value: '+4', term: 'Net Change in Cash', kind: 'total' },
        { label: 'Balance Sheet', value: '', kind: 'header' },
        { label: 'Cash & Cash Equivalents', value: '+4', term: 'Cash & Cash Equivalents', kind: 'sub' },
        { label: 'Property, Plant & Equipment (net)', value: '−10', term: 'Property, Plant & Equipment', kind: 'sub' },
        { label: 'Total Assets', value: '−6', term: 'Total Assets', kind: 'total' },
        { label: 'Retained Earnings', value: '−6', term: 'Retained Earnings', kind: 'sub' },
        { label: "Shareholders' Equity (L + E)", value: '−6', term: "Shareholders' Equity", kind: 'grand' }
      ]
    },
    takeaways: [
      'Net Income links the IS to the CFS (top line) and to the BS (retained earnings).',
      'Ending cash on the CFS becomes cash on the BS.',
      'Always walk through IS → CFS → BS, then check ΔA = ΔL + ΔE.',
      'Depreciation +$10 at 40% tax: NI −6, cash +4, PP&E −10, RE −6.',
      'Credit sale $100 (tax payable): NI +60, CFO 0, A/R +100, taxes payable +40, RE +60.',
      'Deferred revenue $100: no IS impact now; cash +100 and deferred revenue +100.',
      'Inventory (cost $60) sold for $100: NI +24, CFO +84, inventory −60, RE +24.'
    ],
    pitfalls: [
      'Starting with the balance sheet instead of the income statement.',
      'Forgetting the tax effect, or forgetting that taxes paid in cash change the cash number.',
      'Flipping signs when mapping CFS lines to BS asset accounts (CFS −100 for A/R means A/R +100 on the BS).',
      'Recording revenue for a customer prepayment instead of deferred revenue.',
      'Not checking that assets equal liabilities plus equity at the end.',
      'Saying cash falls when depreciation rises. It rises by the tax saving.'
    ]
  },

  /* =====================================================================
     6. SPECIAL TRANSACTIONS
     ===================================================================== */
  {
    id: 'adv', topic: 'adv', title: 'Special Transactions', icon: '🧪',
    summary: 'Accruals, gains, write-downs, SBC, PIK interest, and the rest all follow the same 3-statement logic; learn the pattern once and every "special" transaction becomes routine.',
    sections: [
      {
        heading: 'The pattern behind every special transaction',
        html: `<p>Almost every tricky transaction falls into one of three groups:</p>
<table class="mini">
  <tr><th>Group</th><th>Examples</th><th>CFS treatment</th><th>Cash result (40% tax)</th></tr>
  <tr><td><b>Non-cash expense</b></td><td>Depreciation, write-downs, SBC, PIK</td><td>Add back the full amount</td><td>Cash ↑ by the tax saving (40% of X)</td></tr>
  <tr><td><b>Timing difference</b></td><td>Accrued expenses, prepaids, deferred revenue, credit sales</td><td>Working-capital line</td><td>Cash moves before or after the IS</td></tr>
  <tr><td><b>No IS impact</b></td><td>Dividends, buybacks, issuing debt/stock</td><td>CFF only</td><td>Cash = the transaction amount</td></tr>
</table>
<div class="callout">Ask two questions: <b>(1) Does it hit the IS?</b> <b>(2) Did cash actually move?</b> The answers tell you where every number goes. All examples use <b>40% tax paid in cash</b> unless noted.</div>`
      },
      {
        heading: 'Accrued & prepaid expenses',
        html: `<p><b>Accrued expense</b>: $100 of salaries are earned by employees but <b>not yet paid</b>.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>OpEx +100<br>Pretax −100<br><b>NI −60</b></td><td>NI −60<br>Increase in accrued exp. +100<br><b>CFO +40</b></td><td>Cash +40<br>Accrued expenses +100<br>RE −60<br>A +40 = L +100 + E −60 ✓</td></tr>
</table>
<p>Cash goes <i>up</i> $40 because the company deducted the expense for taxes (saving $40) but hasn't paid the salaries. When it pays them later: accrued expenses −100, cash −100, no IS effect.</p>
<p><b>Prepaid expense</b>: pay $100 cash up front for next period's rent. When paid: no IS effect; CFO −100 (prepaid ↑); cash −100, prepaid +100. When the rent is used up (expensed):</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>OpEx +100<br>Pretax −100<br><b>NI −60</b></td><td>NI −60<br>Decrease in prepaid +100<br><b>CFO +40</b></td><td>Cash +40<br>Prepaid −100<br>A −60 = RE −60 ✓</td></tr>
</table>
<div class="callout">Accrued = <b>expense now, pay later</b> (liability). Prepaid = <b>pay now, expense later</b> (asset). They mirror each other.</div>`
      },
      {
        heading: 'Gain (and loss) on sale of equipment',
        html: `<p><b>Gain</b>: equipment cost $200, accumulated depreciation $100 → <b>net book value $100</b>. Sold for <b>$150</b> → gain = 150 − 100 = <b>$50</b>.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Gain +50<br>Pretax +50<br>Tax +20<br><b>NI +30</b></td><td>NI +30<br>Less gain −50<br><b>CFO −20</b> (tax paid)<br>CFI: proceeds +150<br><b>Net cash +130</b></td><td>Cash +130<br>PP&amp;E (net) −100<br><b>A +30</b><br>RE +30 ✓</td></tr>
</table>
<p><b>Why subtract the gain?</b> The full $150 of cash is already in CFI. Leaving the $50 gain inside CFO would count it twice. CFO ends up −20, which is the tax paid on the gain.</p>
<p><b>Loss</b>: same machine (NBV $100) sold for only <b>$70</b> → loss of <b>$30</b>.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Loss −30<br>Pretax −30<br>Tax −12<br><b>NI −18</b></td><td>NI −18<br>Add back loss +30<br><b>CFO +12</b> (tax saving)<br>CFI +70<br><b>Net cash +82</b></td><td>Cash +82<br>PP&amp;E (net) −100<br><b>A −18</b><br>RE −18 ✓</td></tr>
</table>
<div class="callout warn">Remove the <b>net book value</b> (cost − accumulated depreciation) from PP&amp;E, not the original cost and not the sale price.</div>`
      },
      {
        heading: 'Write-downs: PP&E impairment & inventory',
        html: `<p>A <b>write-down / impairment</b> happens when an asset is worth less than its book value (damaged, obsolete, or the business case changed). It is a <b>non-cash expense</b>. (Class convention: assume it is tax-deductible.)</p>
<p><b>PP&amp;E write-down of $100</b></p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Impairment +100<br>Pretax −100<br><b>NI −60</b></td><td>NI −60<br>Add back write-down +100<br><b>CFO +40</b></td><td>Cash +40<br>PP&amp;E −100<br><b>A −60</b><br>RE −60 ✓</td></tr>
</table>
<p><b>Inventory write-down of $40</b> (goods spoiled or obsolete; usually hits COGS)</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>COGS/expense +40<br>Pretax −40<br><b>NI −24</b></td><td>NI −24<br>Add back write-down +40 (or shown as a decrease in inventory)<br><b>CFO +16</b></td><td>Cash +16<br>Inventory −40<br><b>A −24</b><br>RE −24 ✓</td></tr>
</table>
<div class="callout">Same shape as depreciation: non-cash charge X → NI −0.6X, cash +0.4X, asset −X.</div>`
      },
      {
        heading: 'Stock-based compensation (SBC)',
        html: `<p>Paying employees with <b>shares or options</b> instead of cash. It is a real expense on the IS, but non-cash, so it is added back on the CFS. The offset goes to <b>equity (APIC/common stock)</b>. (Class convention: tax-deductible when expensed.)</p>
<p><b>Standalone SBC of $120</b></p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>OpEx +120<br>Pretax −120<br><b>NI −72</b></td><td>NI −72<br>Add back SBC +120<br><b>CFO +48</b></td><td>Cash +48<br>APIC +120<br>RE −72<br>A +48 = E +48 ✓</td></tr>
</table>
<p><b>Differential: replace a $100 cash salary with $120 of SBC</b></p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>OpEx +20 (120 − 100)<br>Pretax −20<br><b>NI −12</b></td><td>NI −12<br>Add back SBC +120<br><b>CFO +108</b></td><td>Cash +108<br>APIC +120<br>RE −12<br>A +108 = E +108 ✓</td></tr>
</table>
<p><b>Check the +108:</b> Before, the $100 cash salary cost 100 × 0.6 = <b>−60</b> of cash after tax. After, the cash effect is −72 + 120 = <b>+48</b>. Difference: 48 − (−60) = <b>+108</b>.</p>
<div class="callout warn">SBC isn't free. Cash goes up, but existing shareholders are <b>diluted</b> because there are more shares outstanding. That's why many investors subtract SBC when judging "adjusted" earnings.</div>`
      },
      {
        heading: 'PIK interest vs cash interest',
        html: `<p><b>PIK ("payment-in-kind") interest</b> is paid by <b>adding it to the loan balance</b> instead of paying cash. It is common in leveraged buyouts and riskier debt.</p>
<p>Example: debt <b>$200</b>; <b>6% cash</b> interest = $12; <b>4% PIK</b> = $8. Total interest expense = <b>$20</b>.</p>
<table class="mini">
  <tr><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td>Interest expense +20<br>Pretax −20<br><b>NI −12</b></td><td>NI −12<br>Add back PIK +8<br><b>CFO −4</b></td><td>Cash −4<br>Debt +8<br>RE −12<br>A −4 = L +8 + E −12 ✓</td></tr>
</table>
<p><b>Cash check:</b> paid $12 cash interest, saved $8 in taxes (20 × 40%) → net −$4.</p>
<table class="mini">
  <tr><th>Compare</th><th>All $20 in cash</th><th>$12 cash + $8 PIK</th></tr>
  <tr><td>NI</td><td>−12</td><td>−12</td></tr>
  <tr><td>CFO / cash</td><td>−12</td><td>−4</td></tr>
  <tr><td>Debt</td><td>no change</td><td>+8</td></tr>
</table>
<div class="callout">PIK saves cash today, but the debt <b>compounds</b>: next year's interest is calculated on $208.</div>`
      },
      {
        heading: 'Deferred revenue (recognized next period)',
        html: `<p>Customer pays $100 today for a service delivered next month.</p>
<table class="mini">
  <tr><th></th><th>Income Statement</th><th>Cash Flow Statement</th><th>Balance Sheet</th></tr>
  <tr><td><b>Month 1</b> (cash received)</td><td>None</td><td>Deferred rev. ↑ +100<br>CFO +100</td><td>Cash +100<br>Deferred revenue +100</td></tr>
  <tr><td><b>Month 2</b> (service delivered, tax paid)</td><td>Revenue +100<br>Tax +40<br>NI +60</td><td>NI +60<br>Deferred rev. ↓ −100<br>CFO −40</td><td>Cash −40<br>Deferred revenue −100<br>RE +60</td></tr>
</table>
<div class="callout">Subscription businesses (software, gyms, airlines selling tickets early) carry big deferred revenue balances. Growing deferred revenue <b>boosts CFO</b> above Net Income.</div>`
      },
      {
        heading: 'Dividends, buybacks & issuing debt or stock',
        html: `<p>None of these hit the IS. (Interest on new debt will hit the IS <i>later</i>.)</p>
<table class="mini">
  <tr><th>Transaction ($100)</th><th>IS</th><th>CFS</th><th>Balance Sheet</th></tr>
  <tr><td>Pay dividend</td><td>None</td><td>CFF −100</td><td>Cash −100; RE −100</td></tr>
  <tr><td>Buy back stock</td><td>None</td><td>CFF −100</td><td>Cash −100; Treasury stock −100 (equity ↓)</td></tr>
  <tr><td>Issue debt</td><td>None</td><td>CFF +100</td><td>Cash +100; Debt +100</td></tr>
  <tr><td>Repay debt principal</td><td>None</td><td>CFF −100</td><td>Cash −100; Debt −100</td></tr>
  <tr><td>Issue stock</td><td>None</td><td>CFF +100</td><td>Cash +100; Common stock/APIC +100</td></tr>
</table>
<div class="callout">Dividends and buybacks both return cash to shareholders. Buybacks also <b>reduce share count</b>, which raises EPS even when Net Income is flat.</div>
<div class="callout warn">Interest on $100 of new debt at 5% → interest expense $5 → NI −3 (40% tax). The <b>principal</b> never touches the IS.</div>`
      },
      {
        heading: 'Deferred taxes, goodwill & leases (brief)',
        html: `<p><b>Deferred taxes.</b> Companies keep two sets of books: <b>book</b> (GAAP, for investors) and <b>tax</b> (for the IRS). Tax rules often allow faster (accelerated) depreciation.</p>
<ul>
  <li>Example: book depreciation $100, tax depreciation $150 → taxable income is $50 lower → the company pays 50 × 40% = <b>$20 less tax now</b>, but owes it later.</li>
  <li>That future obligation is a <b>Deferred Tax Liability (DTL)</b> +20. The non-cash deferred portion of tax expense is added back in CFO.</li>
  <li>A <b>Deferred Tax Asset (DTA)</b> is the reverse, e.g., net operating losses (NOLs) that reduce future taxes.</li>
</ul>
<p><b>Goodwill.</b> Created only in an <b>acquisition</b>:</p>
<div class="formula">Goodwill = Purchase Price − Fair Value of Net Identifiable Assets</div>
<ul>
  <li>Example: pay $500 for a company whose assets minus liabilities are worth $350 at fair value → goodwill = <b>$150</b>.</li>
  <li>Under US GAAP (public companies) goodwill is <b>not amortized</b>. It is tested for <b>impairment</b> at least yearly. An impairment works like a PP&amp;E write-down: non-cash, added back on the CFS. (In real life goodwill impairments are often <i>not</i> tax-deductible, so check what the problem says.)</li>
</ul>
<p><b>Leases.</b> Since ASC 842, most leases put a <b>Right-of-Use asset</b> and a matching <b>lease liability</b> on the BS. An operating lease still shows one straight-line rent expense on the IS.</p>`
      }
    ],
    takeaways: [
      'Non-cash charges (write-downs, SBC, PIK): NI falls 0.6X, add back X, cash rises 0.4X.',
      'Accrued expense $100: NI −60, CFO +40, accrued expenses +100, RE −60.',
      'Gain on sale: subtract the gain in CFO and put the full proceeds in CFI ($150 sale, $50 gain → NI +30, CFO −20, CFI +150, cash +130).',
      'SBC $120 alone: NI −72, CFO +48, APIC +120. Replacing a $100 cash salary with $120 SBC: NI −12, CFO +108.',
      'PIK: $20 interest ($12 cash + $8 PIK) → NI −12, CFO −4, debt +8.',
      'Dividends, buybacks, and debt/stock issuance skip the IS and go straight to CFF.',
      'Goodwill = price paid − fair value of net assets. It is impairment-tested, not amortized (US GAAP).'
    ],
    pitfalls: [
      'Leaving the gain on sale inside CFO (double-counting the proceeds in CFI).',
      'Removing the original cost (or the sale price) from PP&E instead of the net book value.',
      'Forgetting the APIC/equity offset for SBC, so the BS doesn\'t balance.',
      'Treating all of the interest as cash when part is PIK, or forgetting the PIK amount increases debt.',
      'Recording dividends as an expense on the IS.',
      'Booking deferred revenue as revenue when the cash arrives.'
    ]
  },

  /* =====================================================================
     7. RATIOS & ANALYSIS
     ===================================================================== */
  {
    id: 'ratios', topic: 'ratios', title: 'Ratios & Analysis', icon: '📊',
    summary: 'Ratios turn raw financial statement numbers into comparable measures of profitability, liquidity, leverage, efficiency, and returns, so you can judge a company against its past and its peers.',
    sections: [
      {
        heading: 'How to use ratios',
        html: `<ul>
  <li>A ratio alone means little. Compare it to the <b>company's own history</b> (trend) and to <b>peers in the same industry</b>.</li>
  <li>Use <b>average</b> balances (beginning + ending ÷ 2) for BS items when you divide by an IS figure. Quick examples (and this lesson) use ending balances.</li>
  <li>Ratios fall into five families:</li>
</ul>
<table class="mini">
  <tr><th>Family</th><th>Question</th></tr>
  <tr><td>Profitability</td><td>How much of each sales dollar becomes profit?</td></tr>
  <tr><td>Liquidity</td><td>Can it pay bills due in the next year?</td></tr>
  <tr><td>Leverage</td><td>How much debt does it carry, and can it handle it?</td></tr>
  <tr><td>Efficiency</td><td>How fast does it turn assets and working capital into cash?</td></tr>
  <tr><td>Returns</td><td>How much profit does it earn on its assets and equity?</td></tr>
</table>
<div class="callout">All examples below use <b>Sample Co.</b> (from the IS, BS, and CFS lessons): Revenue 1,000; COGS 400; EBIT 250; EBITDA 300; Interest 30; NI 132; Total assets 1,100; Equity 570; Debt 300 (20 current + 280 long-term); CFO 172; Capex 90.</div>`
      },
      {
        heading: 'Profitability: margins',
        html: `<table class="mini">
  <tr><th>Ratio</th><th>Formula</th><th>Sample Co.</th><th>Tells you</th></tr>
  <tr><td>Gross margin</td><td>Gross Profit ÷ Revenue</td><td>600 ÷ 1,000 = <b>60%</b></td><td>Pricing power vs production cost</td></tr>
  <tr><td>Operating margin</td><td>EBIT ÷ Revenue</td><td>250 ÷ 1,000 = <b>25%</b></td><td>Core profitability after overhead</td></tr>
  <tr><td>EBITDA margin</td><td>EBITDA ÷ Revenue</td><td>300 ÷ 1,000 = <b>30%</b></td><td>Operating profit before non-cash D&amp;A</td></tr>
  <tr><td>Net margin</td><td>Net Income ÷ Revenue</td><td>132 ÷ 1,000 = <b>13.2%</b></td><td>What's left for shareholders</td></tr>
</table>
<div class="callout">Coffee shop check: gross margin 14,000 ÷ 20,000 = 70%; net margin 4,200 ÷ 20,000 = 21%.</div>
<div class="callout warn">Software firms often have 70–80%+ gross margins, while grocery stores run around 25% gross and 1–3% net. A "low" margin isn't bad if the business model is high volume.</div>`
      },
      {
        heading: 'Liquidity: current & quick ratios',
        html: `<div class="formula">Current Ratio = Current Assets ÷ Current Liabilities</div>
<div class="formula">Quick Ratio = (Cash + Marketable Securities + A/R) ÷ Current Liabilities</div>
<ul>
  <li>Sample Co. current ratio = 440 ÷ 180 = <b>2.44x</b>.</li>
  <li>Quick ratio = (150 + 50 + 120) ÷ 180 = 320 ÷ 180 = <b>1.78x</b>.</li>
  <li>The quick ratio ("acid test") leaves out <b>inventory and prepaids</b> because they can't be turned into cash quickly.</li>
</ul>
<div class="callout">Rule of thumb: current ratio &gt; 1 means short-term assets cover short-term bills. Too high (say 5x) can mean idle cash or bloated inventory.</div>
<div class="callout warn">Some strong companies (e.g., retailers or restaurants that collect cash instantly and pay suppliers later) run current ratios <b>below 1</b> on purpose. Context matters.</div>`
      },
      {
        heading: 'Leverage: D/E, Debt/EBITDA, interest coverage',
        html: `<table class="mini">
  <tr><th>Ratio</th><th>Formula</th><th>Sample Co.</th></tr>
  <tr><td>Debt-to-Equity</td><td>Total Debt ÷ Shareholders' Equity</td><td>300 ÷ 570 = <b>0.53x</b></td></tr>
  <tr><td>Debt / EBITDA</td><td>Total Debt ÷ EBITDA</td><td>300 ÷ 300 = <b>1.0x</b></td></tr>
  <tr><td>Net Debt / EBITDA</td><td>(Debt − Cash − Securities) ÷ EBITDA</td><td>(300 − 150 − 50) ÷ 300 = <b>0.33x</b></td></tr>
  <tr><td>Interest coverage</td><td>EBIT ÷ Interest Expense</td><td>250 ÷ 30 = <b>8.3x</b></td></tr>
</table>
<ul>
  <li><b>Debt/EBITDA</b> ≈ "how many years of EBITDA to pay off the debt." Lenders watch it closely. Above ~4–5x is usually considered highly leveraged (LBOs often run 5–7x).</li>
  <li><b>Interest coverage</b>: how many times operating profit covers interest. Below ~2x is a warning sign.</li>
</ul>
<div class="callout warn">"Total debt" includes the <b>current portion</b> of long-term debt (Sample Co.: 20 + 280 = 300). Don't count A/P or accrued expenses as debt.</div>`
      },
      {
        heading: 'Efficiency: DSO, DIO, DPO, CCC & asset turnover',
        html: `<table class="mini">
  <tr><th>Ratio</th><th>Formula</th><th>Sample Co.</th><th>Meaning</th></tr>
  <tr><td>DSO</td><td>A/R ÷ Revenue × 365</td><td>120 ÷ 1,000 × 365 ≈ <b>44 days</b></td><td>Days to collect from customers</td></tr>
  <tr><td>DIO</td><td>Inventory ÷ COGS × 365</td><td>100 ÷ 400 × 365 ≈ <b>91 days</b></td><td>Days inventory sits before being sold</td></tr>
  <tr><td>DPO</td><td>A/P ÷ COGS × 365</td><td>80 ÷ 400 × 365 = <b>73 days</b></td><td>Days to pay suppliers</td></tr>
  <tr><td>Asset turnover</td><td>Revenue ÷ Total Assets</td><td>1,000 ÷ 1,100 = <b>0.91x</b></td><td>Sales generated per $1 of assets</td></tr>
</table>
<div class="formula">Cash Conversion Cycle (CCC) = DSO + DIO − DPO</div>
<p>Sample Co.: 43.8 + 91.3 − 73.0 ≈ <b>62 days</b>. Cash is tied up for about two months between paying suppliers and collecting from customers.</p>
<div class="callout"><b>Lower CCC = better</b> (less cash stuck in working capital). Some companies, Amazon famously among them, have had a <b>negative</b> CCC: they collect from customers before they pay suppliers.</div>
<div class="callout warn">DSO uses <b>revenue</b>; DIO and DPO use <b>COGS</b>, because inventory and payables are recorded at cost.</div>`
      },
      {
        heading: 'Returns: ROA, ROE & DuPont',
        html: `<div class="formula">ROA = Net Income ÷ Total Assets &nbsp;&nbsp;|&nbsp;&nbsp; ROE = Net Income ÷ Shareholders' Equity</div>
<ul>
  <li>Sample Co. ROA = 132 ÷ 1,100 = <b>12.0%</b>.</li>
  <li>ROE = 132 ÷ 570 = <b>23.2%</b>.</li>
</ul>
<p><b>DuPont analysis</b> breaks ROE into three drivers:</p>
<div class="formula">ROE = Net Margin × Asset Turnover × Equity Multiplier<br>= (NI ÷ Revenue) × (Revenue ÷ Assets) × (Assets ÷ Equity)</div>
<table class="mini">
  <tr><th>Driver</th><th>Sample Co.</th><th>Lever</th></tr>
  <tr><td>Net margin</td><td>13.2%</td><td>Profitability</td></tr>
  <tr><td>Asset turnover</td><td>0.909x</td><td>Efficiency</td></tr>
  <tr><td>Equity multiplier</td><td>1,100 ÷ 570 = 1.93x</td><td>Leverage</td></tr>
  <tr><td><b>ROE</b></td><td>13.2% × 0.909 × 1.93 ≈ <b>23.2%</b></td><td></td></tr>
</table>
<div class="callout warn">A high ROE driven by <b>leverage</b> (big equity multiplier) is riskier than one driven by margins or turnover. Buybacks shrink equity and can inflate ROE too.</div>`
      },
      {
        heading: 'Free cash flow & FCF conversion',
        html: `<div class="formula">FCF = CFO − Capex &nbsp;&nbsp;|&nbsp;&nbsp; FCF Conversion = FCF ÷ Net Income</div>
<ul>
  <li>Sample Co. FCF = 172 − 90 = <b>82</b>. FCF margin = 82 ÷ 1,000 = <b>8.2%</b>.</li>
  <li>FCF conversion = 82 ÷ 132 = <b>62%</b>. Only about 62 cents of each dollar of NI became free cash, mainly because of heavy capex and the A/R and inventory build.</li>
  <li>Some analysts measure conversion as FCF ÷ EBITDA (82 ÷ 300 ≈ 27%).</li>
  <li><b>FCF yield</b> = FCF ÷ Market Cap = 82 ÷ 2,500 ≈ 3.3%. This is the cash "return" an investor earns at today's price.</li>
</ul>
<div class="callout">Conversion consistently near or above 100% is a sign of high-quality earnings. Conversion well below 100% for years suggests profits are tied up in receivables, inventory, or heavy reinvestment, so dig deeper.</div>`
      },
      {
        heading: 'Sample Co. scorecard',
        html: `<table class="mini">
  <tr><th>Category</th><th>Ratio</th><th>Value</th></tr>
  <tr><td>Profitability</td><td>Gross / EBIT / EBITDA / Net margin</td><td>60% / 25% / 30% / 13.2%</td></tr>
  <tr><td>Liquidity</td><td>Current / Quick</td><td>2.44x / 1.78x</td></tr>
  <tr><td>Leverage</td><td>D/E / Debt÷EBITDA / Coverage</td><td>0.53x / 1.0x / 8.3x</td></tr>
  <tr><td>Efficiency</td><td>DSO / DIO / DPO / CCC</td><td>44 / 91 / 73 / 62 days</td></tr>
  <tr><td>Efficiency</td><td>Asset turnover</td><td>0.91x</td></tr>
  <tr><td>Returns</td><td>ROA / ROE</td><td>12.0% / 23.2%</td></tr>
  <tr><td>Cash</td><td>FCF / FCF conversion</td><td>82 / 62%</td></tr>
</table>
<div class="callout">Reading it: Sample Co. is profitable with low leverage and solid liquidity. The weak spot is <b>working capital</b>: 91 days of inventory and growing receivables drag FCF conversion down to 62%.</div>`
      },
      {
        heading: "What's \"good\" depends on the industry",
        html: `<table class="mini">
  <tr><th>Industry</th><th>Typical profile</th></tr>
  <tr><td>Software / SaaS</td><td>Very high gross margin; low capex; deferred revenue boosts CFO; heavy SBC</td></tr>
  <tr><td>Grocery / discount retail</td><td>Thin margins; high asset &amp; inventory turnover; often low or negative CCC</td></tr>
  <tr><td>Utilities / telecom</td><td>Stable cash flow; heavy capex; higher Debt/EBITDA is normal</td></tr>
  <tr><td>Manufacturing</td><td>Moderate margins; big inventory &amp; PP&amp;E; watch DIO and capex</td></tr>
  <tr><td>Banks</td><td>Standard ratios don't apply well. Use ROE, net interest margin, and capital ratios instead</td></tr>
</table>
<div class="callout warn">Never call a ratio good or bad in isolation. Ask: <b>compared to what?</b> (Peers, history, the business model.)</div>`
      }
    ],
    takeaways: [
      'Always compare ratios against peers in the same industry and against the company\'s own history.',
      'Margins = profit line ÷ revenue (gross, operating, EBITDA, net).',
      'Current ratio = CA ÷ CL. The quick ratio excludes inventory and prepaids.',
      'Leverage: D/E, Debt/EBITDA (years of EBITDA to repay debt), interest coverage = EBIT ÷ interest.',
      'CCC = DSO + DIO − DPO. Lower means less cash tied up in operations.',
      'DuPont: ROE = Net Margin × Asset Turnover × Equity Multiplier.',
      'FCF = CFO − Capex. FCF conversion (FCF ÷ NI) measures earnings quality.'
    ],
    pitfalls: [
      'Using revenue instead of COGS for DIO or DPO.',
      'Leaving the current portion of long-term debt out of total debt.',
      'Calling a ratio good or bad without industry context.',
      'Assuming a high ROE is always good when it may come from heavy leverage or buybacks.',
      'Mixing a period figure (IS) with a single-date balance without considering average balances.',
      'Treating EBITDA margin as cash margin while ignoring capex and working capital.'
    ]
  }
]);
