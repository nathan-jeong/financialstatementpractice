# Content Guide (for anyone adding questions, glossary terms, or lessons)

All content lives in plain JS files under `data/`, loaded by `index.html` via `<script>` tags.
Each file calls a registry function defined in `js/registry.js`. **No build step.**
Validate everything with: `node tools/validate.js` (must print `OK`).

## Topics (use these exact ids)

| id | name |
|----|------|
| `basics` | Accounting Foundations (accrual vs cash, GAAP principles, revenue recognition, matching, accounting equation, debits/credits basics, fiscal periods, 10-K/10-Q) |
| `is` | Income Statement |
| `bs` | Balance Sheet |
| `cfs` | Cash Flow Statement |
| `link` | Linking the 3 Statements (flow-through / "walk me through") |
| `adv` | Special Transactions (accrued expenses, gains/losses on asset sales, PP&E & inventory write-downs, SBC, PIK interest, deferred revenue, prepaid, deferred taxes, dividends, buybacks, leases, goodwill, etc.) |
| `ratios` | Ratios & Analysis (margins, FCF, liquidity, leverage, efficiency, returns) |

## Text rules
- Plain text strings. You MAY use only these inline tags: `<b>`, `<i>`, `<br>`, `<sub>`, `<sup>`. No other HTML in questions/glossary.
- Money: `$100`, `$1,000`, negative as `−$60` or `($60)`. Use the real minus sign "−" (U+2212) for negative numbers in choices.
- **No free-text answers.** Every question must be answerable by clicking.
- Every question MUST have an `explain` that teaches *why* (1–4 sentences; show the math when numeric).
- Distractors must be plausible and reflect common mistakes (forgot taxes, wrong sign, used pretax instead of after-tax, put item in wrong CFS section, etc.).
- Keep MC answer positions varied (the app shuffles choices anyway, but don't make the right answer always the longest).
- Original wording. Don't copy text from textbooks/websites verbatim.

## Default conventions (IMPORTANT — the class uses these)
- Tax rate **40%** unless the question states otherwise. ALWAYS state the tax rate in numeric questions.
- Unless told otherwise, assume the tax effect hits **cash** (taxes paid / tax savings in cash in the same period). If a question says taxes are payable later, use Taxes Payable (liability).
- Walkthrough order: **Income Statement → Cash Flow Statement → Balance Sheet**, then check A = L + E.
- Cash flow statement uses the **indirect method**: start with Net Income, add back non-cash expenses (D&A, SBC, write-downs, impairments, PIK interest), subtract non-cash gains (gain on sale), then working-capital changes (increase in an operating asset = cash outflow; increase in an operating liability = cash inflow).
- Interest paid is in CFO (US GAAP). Dividends paid are CFF. Capex & asset-sale proceeds are CFI. Debt issuance/repayment and stock issuance/repurchase are CFF.
- SBC is treated as tax-deductible in the year expensed (simplifying class convention).

## Worked answers for the class problem sets (keep everything consistent with these)
- **Accrued expense $100 (salaries unpaid), 40% tax:** IS: OpEx +100 → pretax −100 → NI −60. CFS: NI −60, +100 increase in accrued expenses → CFO +40 → cash +40. BS: Cash +40; Accrued Expenses +100; Retained Earnings −60. A +40 = L +100 + E −60.
- **Gain on sale:** sell equipment for $150, cost $200, acc. dep. $100 (NBV $100) → gain $50. IS: pretax +50, NI +30. CFS: NI +30, subtract gain −50 → CFO −20; CFI +150 → net cash +130. BS: Cash +130, PP&E (net) −100, RE +30. A +30 = E +30.
- **PP&E write-down $100:** IS: pretax −100, NI −60. CFS: NI −60, add back +100 → CFO +40, cash +40. BS: Cash +40, PP&E −100 (A −60); RE −60.
- **SBC $120 replacing $100 cash salary (differential):** OpEx +20 → pretax −20, NI −12. CFS: NI −12, add back non-cash SBC +120 → CFO +108 (check: before, the cash salary cost −60 after tax; after, −72 + 120 = +48; difference +108). BS: Cash +108; APIC/Common stock +120; RE −12 (E +108). Standalone SBC of $120: NI −72; CFO +48; Cash +48; APIC +120; RE −72.
- **Inventory write-down $40:** NI −24; CFO −24 + 40 = +16; Cash +16, Inventory −40 (A −24); RE −24.
- **PIK interest:** debt $200, 6% cash ($12), 4% PIK ($8). Interest expense $20 → pretax −20, NI −12. CFS: NI −12, add back PIK +8 → CFO −4. BS: Cash −4; Debt +8; RE −12. A −4 = L +8 + E −12.
- **Credit sale $100, tax 40% payable next month:** Revenue +100, tax 40, NI +60. CFS: NI +60, ΔAR −100, ΔTaxes payable +40 → CFO 0. BS: AR +100; Taxes Payable +40; RE +60.
- **Cash received $100 for service next month (deferred revenue):** IS: none. CFS: +100 increase in deferred revenue → CFO +100. BS: Cash +100; Deferred Revenue +100. Next month: revenue recognized, deferred revenue falls by $100 (no new cash; tax then recognized).
- **Sell inventory (cost $60) for $100 cash, tax paid in cash:** Revenue 100, COGS 60, pretax 40, tax 16, NI 24. CFS: NI 24, decrease in inventory +60 → CFO +84. BS: Cash +84, Inventory −60 (A +24); RE +24.
- **Coffee shop:** Revenue 20,000; COGS 6,000; Gross profit 14,000 (70%); OpEx = wages 4,000 + rent 2,000 + advertising 1,000 = 7,000; pretax 7,000; tax 40% = 2,800; NI 4,200 (21%). Espresso machine is capitalized (PP&E), not expensed — it benefits many future periods (matching principle) and is depreciated.
- **New company BS:** Cash 55,000; Inventory 10,000; PP&E 25,000 → Assets 90,000 = AP 10,000 + Debt 30,000 + Equity 50,000. A loan is financing, not revenue.
- **CFS problem:** CFO = 24,000 + 5,000 − 8,000 + 3,000 = 24,000; CFI = −15,000; CFF = 20,000 − 5,000 − 10,000 = +5,000; net change +14,000; ending cash 39,000; FCF = 24,000 − 15,000 = 9,000.

## Question schema (`FSQ.addQuestions([...])`)
Common fields on every question:
```js
{ id: 'is-001',          // unique, prefix = file prefix, zero-padded
  topic: 'is',           // one of the topic ids
  sub: 'Gross profit',   // short subtopic label (used for stats & filters)
  difficulty: 1,         // 1 = recall, 2 = apply, 3 = tricky / multi-step
  type: 'mc',            // see types below
  prompt: '...',
  explain: '...',
  table: { headers: ['Item','Amount'], rows: [['Revenue','$500'],['COGS','$200']] } // OPTIONAL data table shown under prompt
}
```
Types:
1. **mc** — multiple choice, exactly one right: `choices: ['a','b','c','d'], answer: 0` (index). 3–5 choices.
2. **tf** — true/false: `answer: true`.
3. **multi** — select all that apply: `choices: [...], answers: [0,2]` (≥1 correct, ≥4 choices).
4. **match** — `pairs: [['Left','Right'], ...]` 4–6 pairs, each left/right unique. Prompt says what to match.
5. **sort** — classify items into buckets: `buckets: ['Operating','Investing','Financing'], items: [['Capex','Investing'], ...]` 5–8 items. Every bucket string used by items must be in `buckets`.
6. **order** — put in correct order: `items: ['Revenue','COGS','Gross Profit', ...]` (listed in the CORRECT order; app shuffles). 4–7 items.

## Glossary schema (`FSQ.addGlossary([...])`)
```js
{ term: 'Accounts Receivable', abbr: 'A/R',        // abbr optional
  statement: 'bs',          // 'is' | 'bs' | 'cfs' | 'general' | 'ratios'
  section: 'Current Assets',// where it lives on the statement (e.g. 'Operating Expenses', 'CFO', 'Equity', 'Concepts')
  def: 'Money customers owe the company for goods/services already delivered on credit.', // 1–2 short sentences
  example: 'Sell $100 on credit → A/R +$100.',     // optional, short
  formula: 'Gross Profit = Revenue − COGS'          // optional
}
```
`term` must be unique (case-insensitive).

## Lesson schema (`FSQ.addLessons([...])`)
```js
{ id: 'is', topic: 'is', title: 'The Income Statement', icon: '📈',
  summary: 'One-sentence hook.',
  sections: [ { heading: 'What it shows', html: '<p>...</p><ul><li>..</li></ul>' } ], // lessons MAY use full HTML: p, ul, ol, li, b, i, table, tr, td, th, div.callout, div.formula
  example: { title: 'Sample Co. Income Statement (FY2026)', rows: [
      { label: 'Revenue', value: '1,000', term: 'Revenue', kind: 'line' },   // kind: 'header' | 'line' | 'sub' (indented) | 'total' | 'grand'
      { label: 'Gross Profit', value: '600', term: 'Gross Profit', kind: 'total' } ] }, // term must match a glossary term exactly (clicking shows definition)
  takeaways: ['...', '...'],
  pitfalls: ['common mistake 1', '...'] }
```
