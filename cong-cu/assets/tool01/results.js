/* Công cụ 01 — Nội dung kết quả cho 9 thể. MEDICAL_CONTENT_REVIEWED = false: đây là bản giáo dục thận trọng,
   do Claude soạn, CHỜ người duyệt y khoa. Không chẩn đoán, không nối thể chất với bệnh, không thảo dược,
   không bài thuốc, không TPCN, không sản phẩm của Viện, không liều, không bảo ngừng thuốc. */
(function (root) {
  "use strict";
  var CARE = "Nếu bạn có triệu chứng bất thường, kéo dài hoặc đang điều trị bệnh, hãy trao đổi với nhân viên y tế phù hợp.";
  var R = {
    balanced: { name: "Bình hòa",
      about: "Trong y học cổ truyền, Bình hòa là cách gọi trạng thái cơ thể được mô tả là cân bằng, không nghiêng hẳn về một xu hướng nào.",
      guidance: ["Duy trì các thói quen đang giúp bạn khỏe: ăn uống điều độ, đa dạng thực phẩm.", "Vận động đều đặn và tránh ngồi lâu liên tục.", "Ngủ đủ giấc, uống đủ nước, dành thời gian thư giãn."] },
    qi_deficiency: { name: "Khí hư",
      about: "Trong lý luận Đông y, “khí” dùng để chỉ năng lượng hoạt động của cơ thể. Khí hư là cách gọi một xu hướng được mô tả là thiếu hụt về khí.",
      guidance: ["Ăn đúng bữa, không bỏ bữa; chế độ ăn cân đối.", "Tăng vận động từ từ, vừa sức, đều đặn.", "Giữ giờ ngủ ổn định và nghỉ ngơi hợp lý."] },
    yang_deficiency: { name: "Dương hư",
      about: "Trong lý luận Đông y, âm và dương là hai mặt cân bằng của cơ thể. Dương hư là cách gọi một xu hướng được mô tả là thiếu hụt về phần dương.",
      guidance: ["Ăn uống đều đặn, đúng bữa, chế độ ăn cân đối.", "Duy trì vận động vừa sức hằng ngày, tránh ngồi lâu.", "Ngủ đủ giấc."] },
    yin_deficiency: { name: "Âm hư",
      about: "Trong lý luận Đông y, âm và dương là hai mặt cân bằng của cơ thể. Âm hư là cách gọi một xu hướng được mô tả là thiếu hụt về phần âm.",
      guidance: ["Uống đủ nước trong ngày.", "Giữ giờ ngủ đều đặn, hạn chế thức khuya.", "Dành thời gian thư giãn, quản lý căng thẳng."] },
    phlegm_dampness: { name: "Đàm thấp",
      about: "Đàm thấp là một khái niệm của y học cổ truyền, dùng để mô tả một xu hướng liên quan đến sự ứ đọng “đàm” và “thấp” theo lý luận Đông y.",
      guidance: ["Ăn uống điều độ, chế độ ăn cân đối.", "Vận động đều đặn; tránh ngồi lâu liên tục.", "Ngủ đủ giấc, uống đủ nước."] },
    damp_heat: { name: "Thấp nhiệt",
      about: "Thấp nhiệt là một khái niệm của y học cổ truyền, dùng để mô tả một xu hướng kết hợp giữa “thấp” và “nhiệt” theo lý luận Đông y.",
      guidance: ["Chế độ ăn cân đối, ăn uống điều độ.", "Uống đủ nước trong ngày.", "Vận động đều đặn và ngủ đủ giấc."] },
    blood_stasis: { name: "Huyết ứ",
      about: "Huyết ứ là một khái niệm của y học cổ truyền, dùng để mô tả một xu hướng liên quan đến sự lưu thông của “huyết” theo lý luận Đông y.",
      guidance: ["Vận động đều đặn; tránh ngồi hoặc nằm lâu một tư thế.", "Chế độ ăn cân đối, uống đủ nước.", "Dành thời gian thư giãn, quản lý căng thẳng."] },
    qi_stagnation: { name: "Khí uất",
      about: "Khí uất là một khái niệm của y học cổ truyền, dùng để mô tả một xu hướng liên quan đến sự lưu thông của “khí” theo lý luận Đông y, thường được bàn cùng với yếu tố cảm xúc.",
      guidance: ["Dành thời gian thư giãn; tìm cách quản lý căng thẳng phù hợp với bạn.", "Vận động đều đặn, có thể đi bộ ngoài trời.", "Giữ giờ ngủ ổn định."] },
    inherited_special: { name: "Đặc bẩm",
      about: "Đặc bẩm là cách gọi của y học cổ truyền cho một xu hướng thể chất được mô tả là mang tính đặc thù, liên quan đến yếu tố bẩm sinh.",
      guidance: ["Ăn uống điều độ, chế độ ăn cân đối.", "Vận động đều đặn, ngủ đủ giấc.", "Nếu cơ thể có phản ứng bất thường hoặc kéo dài, trao đổi với nhân viên y tế thay vì tự xử lý."] },
  };
  var LEVEL = { definite: "đạt ngưỡng", tendency: "đạt ngưỡng xu hướng", basic: "đạt ngưỡng “cơ bản”" };
  var NOT_DIAGNOSIS = "Thể chất là một khái niệm phân loại sức khỏe truyền thống. Thể chất không phải là chẩn đoán bệnh.";
  var DISCLAIMER = "Công cụ này cung cấp thông tin tự đánh giá phục vụ giáo dục sức khỏe. Kết quả không phải là chẩn đoán bệnh, không thay thế khám, chẩn đoán hoặc điều trị bởi nhân viên y tế.";
  var SYSTEM = " theo hệ thống phân loại được sử dụng trong công cụ này.";
  var GENERAL = ["Ăn uống điều độ, chế độ ăn cân đối.", "Vận động đều đặn, tránh ngồi lâu liên tục.", "Ngủ đủ giấc, uống đủ nước, dành thời gian thư giãn."];

  // Mọi thể lệch đạt ngưỡng, theo thứ tự cố định mà classify() trả về (không theo điểm).
  function qualifyingBiased(cls) {
    return cls.biased.filter(function (b) { return b.level !== "below"; }).map(function (b) { return { key: b.constitution, level: b.level }; });
  }
  // Câu kết quả. Không chọn nhóm thắng theo điểm: chỉ báo nhóm nào đạt ngưỡng.
  function headline(cls) {
    if (cls.balanced === "definite") return "Kết quả tự đánh giá của bạn " + LEVEL.definite + " của nhóm " + R.balanced.name + SYSTEM;
    if (cls.balanced === "basic") return "Kết quả tự đánh giá của bạn " + LEVEL.basic + " của nhóm " + R.balanced.name + SYSTEM;
    var q = qualifyingBiased(cls);
    if (q.length === 1) return "Kết quả tự đánh giá của bạn " + LEVEL[q[0].level] + " của nhóm " + R[q[0].key].name + SYSTEM;
    if (q.length > 1) return "Kết quả tự đánh giá của bạn đạt ngưỡng của nhiều nhóm thể chất.";
    return "Kết quả tự đánh giá của bạn chưa đạt ngưỡng phân loại của nhóm nào trong công cụ này.";
  }
  // Danh sách đầy đủ, không xếp hạng. Bình hòa "cơ bản" vẫn liệt kê các nhóm đạt ngưỡng xu hướng.
  function groupList(cls) {
    var q = qualifyingBiased(cls);
    if (cls.balanced !== "no") {
      return q.length ? { title: "Các nhóm đạt ngưỡng xu hướng:", items: q.map(function (x) { return R[x.key].name; }) } : null;
    }
    if (q.length > 1) return { title: "Các nhóm đạt ngưỡng:", items: q.map(function (x) { return R[x.key].name + (x.level === "tendency" ? " (xu hướng)" : ""); }) };
    return null;
  }
  // Nhóm nào được hiện phần giới thiệu + gợi ý lối sống: mọi nhóm đạt ngưỡng, cùng thứ tự cố định.
  function contentKeys(cls) {
    if (cls.balanced !== "no") return ["balanced"];
    return qualifyingBiased(cls).map(function (x) { return x.key; });
  }

  var api = { RESULTS: R, LEVEL: LEVEL, CARE: CARE, NOT_DIAGNOSIS: NOT_DIAGNOSIS, DISCLAIMER: DISCLAIMER, GENERAL: GENERAL, headline: headline, groupList: groupList, contentKeys: contentKeys, qualifyingBiased: qualifyingBiased };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.VSHTool01Results = api;
})(this);
