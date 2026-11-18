/* Global content registry. Data files call these functions; the app reads FSQ.* */
(function (root) {
  var FSQ = root.FSQ || {};
  FSQ.questions = FSQ.questions || [];
  FSQ.glossary = FSQ.glossary || [];
  FSQ.lessons = FSQ.lessons || [];
  FSQ.generators = FSQ.generators || [];
  FSQ.addQuestions = function (arr) { Array.prototype.push.apply(FSQ.questions, arr); };
  FSQ.addGlossary = function (arr) { Array.prototype.push.apply(FSQ.glossary, arr); };
  FSQ.addLessons = function (arr) { Array.prototype.push.apply(FSQ.lessons, arr); };
  FSQ.addGenerators = function (arr) { Array.prototype.push.apply(FSQ.generators, arr); };
  FSQ.TOPICS = [
    { id: 'basics', name: 'Accounting Foundations', short: 'Foundations', icon: '🧱' },
    { id: 'is', name: 'Income Statement', short: 'Income Stmt', icon: '📈' },
    { id: 'bs', name: 'Balance Sheet', short: 'Balance Sheet', icon: '⚖️' },
    { id: 'cfs', name: 'Cash Flow Statement', short: 'Cash Flow', icon: '💵' },
    { id: 'link', name: 'Linking the 3 Statements', short: 'Linking', icon: '🔗' },
    { id: 'adv', name: 'Special Transactions', short: 'Special Txns', icon: '🧪' },
    { id: 'ratios', name: 'Ratios & Analysis', short: 'Ratios', icon: '📊' }
  ];
  root.FSQ = FSQ;
  if (typeof module !== 'undefined') module.exports = FSQ;
})(typeof window !== 'undefined' ? window : globalThis);
