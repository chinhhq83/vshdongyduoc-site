/* Công cụ 04 — Đối chiếu 5 tiêu chí hội chứng chuyển hóa (định nghĩa hài hòa, Alberti 2009; vòng eo châu Á 90/80).
   Logic thuần. Không kết luận bệnh: chỉ đếm số tiêu chí số liệu nhập đạt mốc. Chữ chờ người duyệt ký. */
(function (root) {
  "use strict";
  function n(v) { if (v === "" || v === null || v === undefined) return null; var x = Number(String(v).replace(",", ".")); return isFinite(x) ? x : NaN; }
  function fmt(x) { return String(x).replace(".", ","); }

  // Mốc theo đơn vị gốc, so sánh ở đúng đơn vị người dùng chọn (tránh sai số quy đổi).
  var CUT = {
    tg: { mmol: 1.7, mg: 150 },
    hdl: { nam: { mmol: 1.0, mg: 40 }, nu: { mmol: 1.3, mg: 50 } },
    glu: { mmol: 5.6, mg: 100 },
    waist: { nam: 90, nu: 80 },
    sbp: 130, dbp: 85,
  };
  var NAMES = {
    eo: "Vòng eo (nam ≥ 90 cm, nữ ≥ 80 cm)",
    tg: "Triglycerid ≥ 1,7 mmol/L (150 mg/dL) hoặc đang dùng thuốc hạ triglycerid",
    hdl: "HDL-C < 1,0 mmol/L (40 mg/dL) ở nam, < 1,3 mmol/L (50 mg/dL) ở nữ, hoặc đang dùng thuốc tăng HDL",
    ha: "Huyết áp ≥ 130 và/hoặc ≥ 85 mmHg, hoặc đang dùng thuốc huyết áp",
    glu: "Đường huyết lúc đói ≥ 5,6 mmol/L (100 mg/dL) hoặc đang dùng thuốc hạ đường huyết",
  };
  var LEVELS = {
    ba: { level: "red", label: "Đạt từ 3/5 tiêu chí trở lên theo định nghĩa hài hòa 2009",
      next: "Nên mang bản tóm tắt này cùng phiếu xét nghiệm đến bác sĩ để được đánh giá và tư vấn. Không tự dùng thuốc." },
    mot: { level: "amber", label: "Đạt 1–2/5 tiêu chí theo định nghĩa hài hòa 2009",
      next: "Chưa tới mốc 3/5, nhưng các chỉ số đạt mốc nên được theo dõi. Mang bản tóm tắt khi khám định kỳ và hỏi bác sĩ khi nào nên xét nghiệm lại." },
    khong: { level: null, label: "Chưa đạt tiêu chí nào trong các chỉ số đã nhập",
      next: "Tiếp tục khám sức khỏe định kỳ theo lịch của cơ sở y tế." },
  };
  var MAIN_TAIL = "Theo định nghĩa hài hòa năm 2009, có từ 3/5 tiêu chí là mốc bác sĩ dùng khi xác định hội chứng chuyển hóa. Công cụ chỉ đếm tiêu chí từ số liệu bạn tự nhập, không kết luận thay bác sĩ.";

  function evaluate(a) {
    if (a.pregnant) return { ok: false, message: "Công cụ không dùng khi mang thai, vì các chỉ số thay đổi theo thai kỳ. Hãy hỏi bác sĩ sản." };
    if (!(a.sex === "nam" || a.sex === "nu")) return { ok: false, message: "Vui lòng chọn giới tính." };
    if (a.age !== null && a.age !== undefined && a.age < 18) return { ok: false, message: "Công cụ này dành cho người từ 18 tuổi." };
    var unit = a.unit === "mg" ? "mg" : "mmol";
    var bad = function (v, lo, hi) { return v !== null && (isNaN(v) || v < lo || v > hi); };
    var lim = unit === "mmol" ? { tg: [0.1, 50], hdl: [0.1, 5], glu: [1, 40] } : { tg: [10, 4500], hdl: [5, 200], glu: [20, 700] };
    if (bad(a.waistCm, 50, 160) || bad(a.tg, lim.tg[0], lim.tg[1]) || bad(a.hdl, lim.hdl[0], lim.hdl[1]) || bad(a.glu, lim.glu[0], lim.glu[1]) || bad(a.sbp, 70, 260) || bad(a.dbp, 40, 160))
      return { ok: false, message: "Có số ngoài khoảng hợp lý. Kiểm tra lại đơn vị (mmol/L hay mg/dL) và số đã nhập." };

    // true = đạt, false = chưa đạt, null = chưa có số liệu
    var c = {};
    c.eo = a.waistCm === null ? null : a.waistCm >= CUT.waist[a.sex];
    c.tg = a.medTg ? true : a.tg === null ? null : a.tg >= CUT.tg[unit];
    c.hdl = a.medHdl ? true : a.hdl === null ? null : a.hdl < CUT.hdl[a.sex][unit];
    c.ha = a.medBp ? true : (a.sbp === null && a.dbp === null) ? null : ((a.sbp !== null && a.sbp >= CUT.sbp) || (a.dbp !== null && a.dbp >= CUT.dbp));
    c.glu = a.medGlu ? true : a.glu === null ? null : a.glu >= CUT.glu[unit];
    var met = 0, unknown = 0;
    for (var k in c) { if (c[k] === true) met++; if (c[k] === null) unknown++; }
    if (unknown === 5) return { ok: false, message: "Hãy nhập ít nhất một chỉ số." };
    var L = met >= 3 ? LEVELS.ba : met >= 1 ? LEVELS.mot : LEVELS.khong;
    var notes = [];
    if (unknown > 0) notes.push("Còn " + unknown + "/5 chỉ số chưa nhập" + (met < 3 && met + unknown >= 3 ? "; kết quả có thể thay đổi khi có đủ số liệu." : "."));
    notes.push("Đường huyết và mỡ máu cần là kết quả xét nghiệm lúc đói; huyết áp nên đo khi đã ngồi nghỉ ít nhất 5 phút.");
    var list = Object.keys(NAMES).map(function (k) { return (c[k] === true ? "Đạt: " : c[k] === false ? "Chưa đạt: " : "Chưa có số liệu: ") + NAMES[k]; });
    return {
      ok: true, met: met, unknown: unknown, criteria: c, level: L.level, label: L.label,
      score: met + " / 5 tiêu chí",
      main: "Số liệu bạn nhập đạt " + met + "/5 tiêu chí. " + MAIN_TAIL,
      next: [L.next], notes: notes, list: list, unit: unit,
    };
  }

  function read(f) {
    var r = function (name) { var x = f.querySelector('input[name="' + name + '"]:checked'); return x ? x.value : null; };
    return { sex: r("sex"), unit: r("unit"), age: n(f.age.value), pregnant: f.pregnant.checked, waistCm: n(f.waist.value), tg: n(f.tg.value), hdl: n(f.hdl.value),
      glu: n(f.glu.value), sbp: n(f.sbp.value), dbp: n(f.dbp.value), medTg: f.medTg.checked, medHdl: f.medHdl.checked, medBp: f.medBp.checked, medGlu: f.medGlu.checked };
  }
  function summary(a, r) {
    var u = r.unit === "mg" ? " mg/dL" : " mmol/L", v = function (x, s) { return x === null ? "chưa nhập" : fmt(x) + s; };
    var meds = [a.medTg && "hạ triglycerid", a.medHdl && "tăng HDL", a.medBp && "huyết áp", a.medGlu && "hạ đường huyết"].filter(Boolean);
    return {
      input: "Số liệu đã nhập: " + (a.sex === "nam" ? "Nam" : "Nữ") + (a.age ? ", " + a.age + " tuổi" : "") + "; vòng eo " + v(a.waistCm, " cm") + "; triglycerid " + v(a.tg, u) + "; HDL-C " + v(a.hdl, u) +
        "; huyết áp " + (a.sbp === null && a.dbp === null ? "chưa nhập" : (a.sbp === null ? "?" : a.sbp) + "/" + (a.dbp === null ? "?" : a.dbp) + " mmHg") + "; đường huyết đói " + v(a.glu, u) + "; thuốc đang dùng: " + (meds.length ? meds.join(", ") : "không khai") + ".",
      result: "Kết quả: " + r.met + "/5 tiêu chí — " + r.label + ". " + r.list.join(" · ") + ".",
      hist: { tieuchi: r.met + "/5", nhom: r.label },
    };
  }

  var api = { evaluate: evaluate, read: read, summary: summary, LEVELS: LEVELS, MAIN_TAIL: MAIN_TAIL, NAMES: NAMES };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.VSHMets = api;
})(this);
