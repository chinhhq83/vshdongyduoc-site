/* TEST FIXTURES — NOT CCMQ QUESTION TEXT
   Câu giả để thử bộ tính điểm và giao diện. Cách chia câu cho từng thể và cờ đảo điểm ở đây là TÙY Ý,
   KHÔNG phải cách chia của CCMQ. Không dùng file này cho người dùng thật.
   Thư mục cong-cu/tests không được deploy (xem .vercelignore). */
(function (root) {
  "use strict";
  var KEYS = ["balanced", "qi_deficiency", "yang_deficiency", "yin_deficiency", "phlegm_dampness", "damp_heat", "blood_stasis", "qi_stagnation", "inherited_special"];
  var PER = [7, 7, 7, 7, 7, 7, 6, 6, 6]; // tổng 60, tùy ý
  var items = [], k = 1;
  KEYS.forEach(function (c, ci) {
    for (var j = 0; j < PER[ci]; j++) {
      var id = "Q" + (k < 10 ? "0" : "") + k;
      items.push({ id: id, constitution: c, reverse: c === "balanced" && j % 2 === 1, text: "Câu thử nghiệm " + id + " — không phải câu hỏi CCMQ" });
      k++;
    }
  });
  var data = { licensed: false, synthetic: true, ITEMS: items,
    SCALE: ["Mức 1 (thử nghiệm)", "Mức 2 (thử nghiệm)", "Mức 3 (thử nghiệm)", "Mức 4 (thử nghiệm)", "Mức 5 (thử nghiệm)"] };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else root.VSHTool01Fixture = data;
})(this);
