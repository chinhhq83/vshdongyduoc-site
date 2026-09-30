/* Công cụ 01 — Bộ tính điểm và bộ phân loại. KHÔNG phụ thuộc chữ câu hỏi: chỉ nhận
   { id, constitution, reverse, answer }. Ngưỡng lấy từ config.js, không có số "ma thuật" ở đây. */
(function (root) {
  "use strict";
  var CFG = typeof module !== "undefined" && module.exports ? require("./config.js") : root.VSHTool01Config;

  function isValidAnswer(v) {
    return typeof v === "number" && isFinite(v) && Math.floor(v) === v && v >= CFG.answerMin && v <= CFG.answerMax;
  }
  // Điểm đảo: 1↔5, 2↔4, 3↔3 (tổng quát: min + max − v).
  function itemScore(item) {
    if (!isValidAnswer(item.answer)) throw new Error("INVALID_ANSWER:" + item.id);
    return item.reverse ? CFG.answerMin + CFG.answerMax - item.answer : item.answer;
  }
  // transformed = (raw − n) / (n × 4) × 100, trên thang 0–100.
  function transformed(raw, n) {
    return ((raw - n) / (n * (CFG.answerMax - CFG.answerMin))) * 100;
  }

  /** @param {{id:string, constitution:string, reverse:boolean, answer:number}[]} items
   *  @returns {{ok:true, scores:Object<string,number>, counts:Object<string,number>} | {ok:false, error:string, invalid:string[]}} */
  function scoreItems(items) {
    if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "NO_ITEMS", invalid: [] };
    var invalid = items.filter(function (it) { return !isValidAnswer(it.answer); }).map(function (it) { return it.id; });
    if (invalid.length) return { ok: false, error: "INVALID_ANSWER", invalid: invalid };
    var raw = {}, n = {};
    items.forEach(function (it) {
      if (CFG.constitutions.indexOf(it.constitution) < 0) throw new Error("UNKNOWN_CONSTITUTION:" + it.constitution);
      raw[it.constitution] = (raw[it.constitution] || 0) + itemScore(it);
      n[it.constitution] = (n[it.constitution] || 0) + 1;
    });
    var missing = CFG.constitutions.filter(function (c) { return !n[c]; });
    if (missing.length) return { ok: false, error: "MISSING_CONSTITUTION", invalid: missing };
    var scores = {};
    CFG.constitutions.forEach(function (c) { scores[c] = transformed(raw[c], n[c]); });
    return { ok: true, scores: scores, counts: n };
  }

  /** Phân loại theo ngưỡng cấu hình. Không bỏ sót: trả về mọi thể lệch đạt "definite" hoặc "tendency".
   *  @returns {{balanced:"definite"|"basic"|"no", biased:{constitution:string, score:number, level:"definite"|"tendency"|"below"}[],
   *            primary:"balanced"|"biased"|"undetermined", definite:string[], tendency:string[]}} */
  function classify(scores) {
    var T = CFG.thresholds;
    var biasedKeys = CFG.constitutions.filter(function (c) { return c !== "balanced"; });
    var biased = biasedKeys.map(function (c) {
      var s = scores[c];
      var level = s >= T.biased.definiteMin ? "definite" : s >= T.biased.tendencyMin ? "tendency" : "below";
      return { constitution: c, score: s, level: level };
    });
    var maxBiased = Math.max.apply(null, biased.map(function (b) { return b.score; }));
    var bal = "no";
    if (scores.balanced >= T.balanced.minScore) {
      if (maxBiased < T.balanced.definiteBiasedMax) bal = "definite";
      else if (maxBiased < T.balanced.basicBiasedMax) bal = "basic";
    }
    var byScore = function (a, b) { return b.score - a.score; };
    var definite = biased.filter(function (b) { return b.level === "definite"; }).sort(byScore).map(function (b) { return b.constitution; });
    var tendency = biased.filter(function (b) { return b.level === "tendency"; }).sort(byScore).map(function (b) { return b.constitution; });
    var primary = bal !== "no" ? "balanced" : definite.length || tendency.length ? "biased" : "undetermined";
    return { balanced: bal, biased: biased, primary: primary, definite: definite, tendency: tendency };
  }

  function assess(items) {
    var s = scoreItems(items);
    if (!s.ok) return s;
    return { ok: true, scores: s.scores, counts: s.counts, classification: classify(s.scores) };
  }

  var api = { isValidAnswer: isValidAnswer, itemScore: itemScore, transformed: transformed, scoreItems: scoreItems, classify: classify, assess: assess };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.VSHTool01Scoring = api;
})(this);
