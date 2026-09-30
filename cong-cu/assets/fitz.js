/* Công cụ 07 — Loại da theo phản ứng với nắng (Fitzpatrick 1988, loại I–VI). Logic thuần. Chữ chờ người duyệt ký. */
(function (root) {
  "use strict";
  var TYPES = {
    I: "Luôn bị bỏng nắng (đỏ, rát), không bao giờ rám.",
    II: "Thường bị bỏng nắng, rám rất ít.",
    III: "Đôi khi bỏng nắng nhẹ, rám dần và đều.",
    IV: "Ít khi bỏng nắng, luôn rám dễ.",
    V: "Rất hiếm khi bỏng nắng, rám rất nhanh và sẫm.",
    VI: "Không bao giờ bỏng nắng; da sẫm màu tự nhiên.",
  };
  var BASE = "Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.";
  var NEXT = {
    I: "Da bạn rất dễ bỏng nắng. " + BASE,
    II: "Da bạn dễ bỏng nắng. " + BASE,
    III: "Da bạn vẫn có thể bỏng nắng, và tia UV góp phần làm da lão hóa sớm. " + BASE,
    IV: "Da bạn ít bỏng nắng nhưng tia UV vẫn góp phần làm da lão hóa sớm và sạm màu. " + BASE,
    V: "Da bạn hiếm khi bỏng nắng, nhưng tia UV vẫn góp phần làm da lão hóa sớm và tăng sắc tố. " + BASE,
    VI: "Da bạn hầu như không bỏng nắng, nhưng tia UV vẫn góp phần làm da lão hóa sớm và tăng sắc tố. " + BASE,
  };
  var RED = "Nốt ruồi mới, nốt ruồi đổi màu hoặc đổi kích thước, chảy máu, hoặc vết loét lâu không lành trên da là lý do nên khám da liễu sớm.";
  var ALWAYS = "Thang Fitzpatrick mô tả phản ứng của da với nắng, không phải màu da hay dân tộc, và không dùng để chẩn đoán bệnh da.";

  function evaluate(a) {
    if (!TYPES[a.type]) return { ok: false, message: "Vui lòng chọn mô tả gần nhất với da bạn." };
    if (!(a.flag === "co" || a.flag === "khong")) return { ok: false, message: "Vui lòng trả lời câu về nốt ruồi và vết loét trên da." };
    return { ok: true, type: a.type, level: a.flag === "co" ? "red" : null,
      label: "Loại da Fitzpatrick " + a.type, score: "Loại " + a.type,
      main: "Mô tả bạn chọn tương ứng loại da " + a.type + " trong thang Fitzpatrick: " + TYPES[a.type],
      next: a.flag === "co" ? [RED, NEXT[a.type]] : [NEXT[a.type]], notes: [], always: ALWAYS };
  }
  function read(f) {
    var r = function (name) { var x = f.querySelector('input[name="' + name + '"]:checked'); return x ? x.value : null; };
    return { type: r("type"), flag: r("flag") };
  }
  function summary(a, r) {
    return { input: "Câu trả lời: phản ứng với nắng — " + TYPES[a.type] + " Nốt ruồi đổi màu/kích thước, chảy máu hoặc vết loét lâu lành: " + (a.flag === "co" ? "có" : "không") + ".",
      result: "Kết quả: loại da Fitzpatrick " + r.type + " (tự đánh giá)." + (a.flag === "co" ? " Có dấu hiệu da nên khám da liễu sớm." : ""),
      hist: { loai: r.type, dauhieu: a.flag === "co" ? "có" : "không" } };
  }
  var api = { evaluate: evaluate, read: read, summary: summary, TYPES: TYPES, NEXT: NEXT, RED: RED, ALWAYS: ALWAYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.VSHFitz = api;
})(this);
