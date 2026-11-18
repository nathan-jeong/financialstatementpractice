# Ledger Lab · Financial Statements Trainer

A free, click-only study game for financial accounting: the **income statement**, **balance sheet**, **cash flow statement**, three-statement **walkthroughs**, and special transactions (accrued expenses, gains on sale, write-downs, stock-based comp, PIK interest, deferred revenue and more).

**Play it:** https://nathan-jeong.github.io/financialstatementpractice/

## What's inside
- **798 hand-written questions** across 7 topics, each with an explanation.
- **59 generators** that build new problems with fresh numbers every time. Every generated 3-statement effect is checked automatically so the balance sheet always balances.
- **306-term glossary**: every line item on all three statements, plus concepts and ratios, each with a short definition, and examples/formulas where useful.
- **7 lessons** with interactive sample statements (tap any line to see its definition), key takeaways and common mistakes.
- **Question types (no typing):** multiple choice, true/false, select-all, matching, sorting, ordering, impact-grid dropdowns, and step-by-step IS → CFS → BS walkthroughs.

## Modes
| Mode | What it's for |
|---|---|
| 🧠 Smart Review | Daily spaced repetition (Leitner boxes) weighted toward your weakest topics |
| 🔗 3-Statement Lab | "Walk me through…" any of 37 transaction types, as walkthrough, grid, or quick questions |
| 📄 Class Problem Sets | The class problem sets, rebuilt as click-through walkthroughs |
| 🏗️ Statement Builder | Build an IS / BS / CFS from activities; roll-forwards; ratios |
| 🎛️ Custom Practice | Filter by topic, type, difficulty, length |
| ⚡ Lightning Round | 90-second speed drill |
| 🧩 Term Match | Timed term ↔ definition matching |
| 🃏 Flashcards | All glossary terms with spaced repetition |
| 🩹 Mistake Review | Re-try what you missed |

Progress, XP, streaks and achievements are saved in your browser (localStorage). Export or import a backup from the Progress page.

## Conventions
40% tax rate unless stated otherwise; the tax effect hits cash unless a question says taxes are payable; indirect-method cash flow statement; US GAAP classification (interest paid in CFO, dividends in CFF).

## Development
Plain HTML/CSS/JS with no build step. Open `index.html` or run `python3 -m http.server`.
- Content lives in `data/*.js` (see `CONTENT_GUIDE.md` for the schema).
- Generators live in `js/gen/`.
- Validate everything with `node tools/validate.js`.
