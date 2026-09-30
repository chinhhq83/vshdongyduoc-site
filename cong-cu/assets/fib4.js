/* Công cụ 05 — Chỉ số FIB-4 (Sterling 2006). Mốc 1,30 / 2,67 (Shah 2009); từ 65 tuổi mốc dưới 2,0 (McPherson 2017).
   Logic thuần. Chữ chờ người duyệt ký. */
(function (root) {
  "use strict";
  function n(v) { if (v === "" || v === null || v === undefined) return null; var x = Number(String(v).replace(",", ".")); return isFinite(x) ? x : NaN; }
  function round2(x) { return Math.floor(x * 100 + 0.5 + 1e-9) / 100; }
  function fmt2(x) { return x.toFixed(2).replace(".", ","); }

  function fib4(age, ast, alt, plt) { return (age * ast) / (plt * Math.sqrt(alt)); }
  var BANDS = {
    thap: { level: null, label: "Khả năng xơ hóa gan tiến triển thấp theo FIB-4",
      next: "Chỉ số này chưa gợi ý cần làm thêm xét nghiệm xơ hóa. Nếu bạn có đái tháo đường, thừa cân hoặc đã được biết có gan nhiễm mỡ, hỏi bác sĩ về việc tính lại sau 1–3 năm." },
    giua: { level: "amber", label: "Vùng chưa xác định theo FIB-4",
      next: "Nên hỏi bác sĩ về xét nghiệm bước hai, ví dụ đo độ đàn hồi gan (FibroScan) hoặc xét nghiệm ELF, để làm rõ." },
    cao: { level: "red", label: "Khả năng xơ hóa gan tiến triển cao theo FIB-4",
      next: "Nên khám chuyên khoa tiêu hóa – gan để được đánh giá thêm. Mang bản tóm tắt này và phiếu xét nghiệm." },
  };
  var ALWAYS = "FIB-4 là một phép tính từ 4 con số, dùng để phân loại ban đầu; không phải sinh thiết, không phải siêu âm và không phải chẩn đoán bệnh gan.";

  function evaluate(a) {
    if (a.age === null || isNaN(a.age)) return { ok: false, message: "Vui lòng nhập tuổi." };
    if (a.age < 18) return { ok: false, message: "Công cụ này dành cho người từ 18 tuổi." };
    if (a.age > 100) return { ok: false, message: "Kiểm tra lại tuổi." };
    var ok = function (v, lo, hi) { return v !== null && !isNaN(v) && v >= lo && v <= hi; };
    if (!ok(a.ast, 1, 5000) || !ok(a.alt, 1, 5000)) return { ok: false, message: "Nhập AST và ALT (đơn vị U/L, thường ghi là GOT và GPT trên phiếu xét nghiệm)." };
    if (!ok(a.plt, 5, 1500)) return { ok: false, message: "Nhập số lượng tiểu cầu theo G/L (bằng ×10⁹/L hoặc K/µL). Ví dụ 250. Nếu phiếu ghi 250.000/mm³ thì nhập 250." };
    var v = round2(fib4(a.age, a.ast, a.alt, a.plt));
    var low = a.age >= 65 ? 2.0 : 1.3;
    var key = v < low ? "thap" : v > 2.67 ? "cao" : "giua";
    var B = BANDS[key];
    var notes = [];
    if (a.age >= 65) notes.push("Từ 65 tuổi, mốc dưới được nâng lên 2,0 vì FIB-4 tăng theo tuổi (McPherson 2017).");
    if (a.age < 35) notes.push("Dưới 35 tuổi, FIB-4 kém chính xác hơn; nên hỏi bác sĩ nếu còn lo ngại.");
    notes.push("FIB-4 dành cho người lớn có gan nhiễm mỡ hoặc có nguy cơ (đái tháo đường, béo phì). Kết quả kém tin cậy khi đang có tổn thương gan cấp; hỏi bác sĩ nếu men gan tăng cao đột ngột.");
    return { ok: true, value: v, key: key, level: B.level, label: B.label, score: "FIB-4 = " + fmt2(v),
      main: "Chỉ số FIB-4 tính từ số bạn nhập là " + fmt2(v) + ". Mốc phân loại: dưới " + fmt2(low) + " là thấp, trên 2,67 là cao, ở giữa là vùng chưa xác định.",
      next: [B.next], notes: notes, always: ALWAYS, low: low };
  }
  function read(f) { return { age: n(f.age.value), ast: n(f.ast.value), alt: n(f.alt.value), plt: n(f.plt.value) }; }
  function summary(a, r) {
    return { input: "Số liệu đã nhập: " + a.age + " tuổi; AST (GOT) " + a.ast + " U/L; ALT (GPT) " + a.alt + " U/L; tiểu cầu " + a.plt + " G/L.",
      result: "Kết quả: FIB-4 = " + fmt2(r.value) + " — " + r.label + " (mốc dưới " + fmt2(r.low) + ", mốc trên 2,67).",
      hist: { fib4: fmt2(r.value), nhom: r.label } };
  }
  var api = { fib4: fib4, round2: round2, evaluate: evaluate, read: read, summary: summary, BANDS: BANDS, ALWAYS: ALWAYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.VSHFib4 = api;
})(this);
