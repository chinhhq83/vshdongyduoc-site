/* Công cụ 06 — Tự kiểm tra sức khỏe nướu. Câu 1–8 theo bộ câu hỏi tự báo cáo CDC/AAP (Eke 2013).
   Không tính điểm: mô hình gốc ước tính tỷ lệ ở cấp cộng đồng, không dùng để kết luận cho từng người.
   Hai câu dấu hiệu (chảy máu nướu; sưng đau / mủ / lung lay tăng dần) do Viện bổ sung. Chữ chờ người duyệt ký. */
(function (root) {
  "use strict";
  function n(v) { if (v === "" || v === null || v === undefined) return null; var x = Number(String(v).replace(",", ".")); return isFinite(x) ? x : NaN; }
  var SIGNALS = {
    nghiBenh: "Bạn nghĩ mình có thể đang có bệnh nướu",
    tuDanhGia: "Bạn tự đánh giá răng và nướu ở mức tạm được hoặc kém",
    lungLay: "Từng có răng tự lung lay, không do chấn thương",
    tieuXuong: "Từng được nha sĩ cho biết có tiêu xương quanh răng",
    rangLa: "Trong 3 tháng qua thấy có răng trông không bình thường",
    chayMau: "Nướu chảy máu khi chải răng hoặc làm sạch kẽ răng",
  };
  var LEVELS = {
    red: { level: "red", label: "Có dấu hiệu nên đi khám nha khoa sớm",
      next: "Sưng đau nướu, có mủ, hoặc răng lung lay tăng dần là lý do nên đi khám nha khoa sớm, không chờ lịch định kỳ. Không tự dùng kháng sinh." },
    amber: { level: "amber", label: "Có dấu hiệu nên để nha sĩ xem",
      next: "Nên đặt lịch khám nha khoa và mang bản tóm tắt này. Nha sĩ sẽ khám nướu và đo túi nướu để đánh giá." },
    none: { level: null, label: "Chưa ghi nhận dấu hiệu nào trong các câu đã trả lời",
      next: "Tiếp tục chải răng hằng ngày, làm sạch kẽ răng và khám nha khoa định kỳ theo lịch nha sĩ khuyên." },
  };
  var ALWAYS = "Đây là bộ câu hỏi tự trả lời, không thay được việc nha sĩ khám và đo túi nướu. Công cụ không tính điểm và không chẩn đoán bệnh nha chu.";

  function evaluate(a) {
    var need = ["q1", "q2", "q3", "q4", "q5", "q6", "v1", "v2"];
    for (var i = 0; i < need.length; i++) if (!a[need[i]]) return { ok: false, message: "Vui lòng trả lời đủ các câu có lựa chọn." };
    if (a.q7 !== null && (isNaN(a.q7) || a.q7 < 0 || a.q7 > 50)) return { ok: false, message: "Câu 7: nhập số lần từ 0 đến 50." };
    if (a.q8 !== null && (isNaN(a.q8) || a.q8 < 0 || a.q8 > 50)) return { ok: false, message: "Câu 8: nhập số lần từ 0 đến 50." };
    var hits = [];
    if (a.q1 === "co") hits.push(SIGNALS.nghiBenh);
    if (a.q2 === "tamduoc" || a.q2 === "kem") hits.push(SIGNALS.tuDanhGia);
    if (a.q4 === "co") hits.push(SIGNALS.lungLay);
    if (a.q5 === "co") hits.push(SIGNALS.tieuXuong);
    if (a.q6 === "co") hits.push(SIGNALS.rangLa);
    if (a.v1 === "co") hits.push(SIGNALS.chayMau);
    var L = a.v2 === "co" ? LEVELS.red : hits.length ? LEVELS.amber : LEVELS.none;
    var notes = [];
    if (a.q3 === "co") notes.push("Bạn từng điều trị bệnh nướu: nên tái khám theo lịch nha sĩ hẹn, kể cả khi không thấy gì bất thường.");
    if (a.q7 === 0) notes.push("Bàn chải không làm sạch hết kẽ răng. Hỏi nha sĩ cách làm sạch kẽ răng phù hợp với bạn.");
    return { ok: true, hits: hits, level: L.level, label: L.label, score: hits.length + " dấu hiệu",
      main: hits.length ? "Bạn trả lời có " + hits.length + " dấu hiệu mà nha sĩ nên xem: " + hits.join("; ") + "." : "Trong các câu đã trả lời, bạn chưa ghi nhận dấu hiệu nào trong danh sách.",
      next: [L.next], notes: notes, always: ALWAYS };
  }
  function read(f) {
    var r = function (name) { var x = f.querySelector('input[name="' + name + '"]:checked'); return x ? x.value : null; };
    return { q1: r("q1"), q2: r("q2"), q3: r("q3"), q4: r("q4"), q5: r("q5"), q6: r("q6"), q7: n(f.q7.value), q8: n(f.q8.value), v1: r("v1"), v2: r("v2") };
  }
  var Q2 = { tuyetvoi: "tuyệt vời", ratot: "rất tốt", tot: "tốt", tamduoc: "tạm được", kem: "kém" };
  var YN = { co: "có", khong: "không", khongro: "không rõ" };
  function summary(a, r) {
    return { input: "Câu trả lời: nghĩ có bệnh nướu: " + YN[a.q1] + "; tự đánh giá răng nướu: " + Q2[a.q2] + "; từng điều trị bệnh nướu: " + YN[a.q3] + "; răng tự lung lay: " + YN[a.q4] +
        "; được báo tiêu xương quanh răng: " + YN[a.q5] + "; răng trông bất thường (3 tháng): " + YN[a.q6] + "; làm sạch kẽ răng (7 ngày): " + (a.q7 === null ? "không trả lời" : a.q7 + " lần") +
        "; nước súc miệng (7 ngày): " + (a.q8 === null ? "không trả lời" : a.q8 + " lần") + "; chảy máu nướu: " + YN[a.v1] + "; sưng đau / mủ / lung lay tăng dần: " + YN[a.v2] + ".",
      result: "Kết quả: " + r.label + (r.hits.length ? " — " + r.hits.join("; ") : "") + ". Không tính điểm.",
      hist: { dauhieu: String(r.hits.length), nhom: r.label } };
  }
  var api = { evaluate: evaluate, read: read, summary: summary, LEVELS: LEVELS, SIGNALS: SIGNALS, ALWAYS: ALWAYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.VSHNuou = api;
})(this);
