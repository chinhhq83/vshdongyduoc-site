/* Công cụ 03 — BMI và vòng eo chuẩn châu Á. Logic thuần (không DOM), dùng chung cho trang và test.
   Ngưỡng: Quyết định 2892/QĐ-BYT ngày 22/10/2022 (Bảng 4.1; mục 4.2 vòng bụng), IDF châu Á. Copy đã khóa. */
(function (root) {
  "use strict";

  // Làm tròn 1 chữ số thập phân, 0.05 làm tròn lên (cộng epsilon để tránh sai số dấu phẩy động).
  function round1(x) {
    return Math.floor(x * 10 + 0.5 + 1e-9) / 10;
  }

  function bmi(weightKg, heightCm) {
    var m = heightCm / 100;
    return round1(weightKg / (m * m));
  }

  // Nhóm theo BMI đã làm tròn; biên bao gồm mốc trái.
  var GROUPS = [
    { key: "thieu", max: 18.5, label: "Thiếu cân" },
    { key: "thuong", max: 23.0, label: "Trong khoảng thường gặp" },
    { key: "thua", max: 25.0, label: "Thừa cân theo ngưỡng châu Á" },
    { key: "bp1", max: 30.0, label: "Béo phì độ I theo ngưỡng châu Á" },
    { key: "bp2", max: Infinity, label: "Béo phì độ II theo ngưỡng châu Á" },
  ];
  function group(b) {
    for (var i = 0; i < GROUPS.length; i++) if (b < GROUPS[i].max) return GROUPS[i];
    return GROUPS[GROUPS.length - 1];
  }

  var WAIST_CUT = { nam: 90, nu: 80 };
  function waistHigh(sex, waistCm) {
    if (!(waistCm > 0)) return null;
    return waistCm >= WAIST_CUT[sex];
  }

  // Khoảng cân tham chiếu: BMI 18.5 và 22.9 × chiều cao².
  function refRange(heightCm) {
    var m2 = Math.pow(heightCm / 100, 2);
    return { low: round1(18.5 * m2), high: round1(22.9 * m2) };
  }

  var NEXT = {
    thieu: "Cân nặng thấp hơn khoảng thường gặp. Nếu sụt cân không chủ đích, mệt, hoặc BMI dưới 17: nên khám để tìm nguyên nhân. Không tự ý dùng thuốc tăng cân.",
    thuong: "BMI đang trong khoảng thường dùng cho người châu Á. Vẫn nên xem vòng eo: mỡ bụng có thể tăng dù BMI chưa cao. Duy trì vận động và ăn đủ rau.",
    thua: "Với người Việt, nguy cơ rối loạn chuyển hóa có thể bắt đầu từ BMI 23 — sớm hơn mốc 25 của nhiều máy tính phương Tây. Nên đo vòng eo, xem lại ăn uống và vận động, và tính thêm nguy cơ đái tháo đường 10 năm (công cụ FINDRISC).",
    bp1: "Theo bảng QĐ 2892 đây là nhóm béo phì độ I ở người châu Á. Nên khám nội tiết / đa khoa để đánh giá huyết áp, đường huyết, mỡ máu — không tự chẩn đoán. Bắt đầu từ thay đổi ăn uống và vận động theo hướng dẫn nhân viên y tế.",
    bp2: "Theo bảng QĐ 2892 đây là nhóm béo phì độ II ở người châu Á. Nên đặt lịch khám trong thời gian sớm để được đánh giá toàn diện. Công cụ này không kê thực đơn, không kê thuốc, không chỉ định phẫu thuật.",
  };

  function fmt(n) {
    return String(n).replace(".", ",");
  }

  function waistText(sex, waistCm) {
    var h = waistHigh(sex, waistCm);
    if (h === null) return "Bạn chưa nhập vòng eo. BMI không cho biết mỡ tập trung ở bụng. Đo thêm 30 giây sẽ làm kết quả hữu ích hơn khi mang đi khám.";
    if (!h) return "Vòng eo " + fmt(waistCm) + " cm chưa đạt mốc vòng bụng tăng theo QĐ 2892 (nam 90 cm, nữ 80 cm).";
    return "Vòng eo " + fmt(waistCm) + " cm thuộc mức vòng bụng tăng theo QĐ 2892 và ngưỡng IDF cho người châu Á. Vòng bụng tăng liên quan mật thiết hơn với rối loạn chuyển hóa so với BMI đơn thuần. Nên tính thêm nguy cơ đái tháo đường 10 năm và mang tờ tóm tắt này khi khám.";
  }

  /**
   * @param {{sex:"nam"|"nu", heightCm:number, weightKg:number, waistCm?:number, age?:number, pregnant?:boolean}} a
   * @returns {{ok:false, reason:string, message:string} | {ok:true, ...}}
   */
  function evaluate(a) {
    if (a.pregnant) return { ok: false, reason: "pregnant", message: "Công cụ không dùng khi mang thai. Hãy dùng số đo trước khi có thai và hỏi bác sĩ sản." };
    if (a.age !== undefined && a.age !== null && a.age !== "" && Number(a.age) < 18) return { ok: false, reason: "age", message: "Công cụ này dành cho người từ 18 tuổi." };
    var h = Number(a.heightCm), w = Number(a.weightKg);
    if (!(a.sex === "nam" || a.sex === "nu") || !(h >= 120 && h <= 220) || !(w >= 30 && w <= 200)) return { ok: false, reason: "input", message: "Vui lòng nhập giới tính, chiều cao (120–220 cm) và cân nặng (30–200 kg)." };
    var waist = Number(a.waistCm) > 0 ? Number(a.waistCm) : null;
    var b = bmi(w, h);
    var g = group(b);
    return {
      ok: true,
      bmi: b,
      group: g,
      main: "Chỉ số khối cơ thể (BMI) của bạn là " + fmt(b) + " kg/m². Theo bảng phân loại dành cho người châu Á trong Hướng dẫn chẩn đoán và điều trị bệnh béo phì (Quyết định 2892/QĐ-BYT ngày 22/10/2022 của Bộ Y tế), mức này thuộc nhóm “" + g.label + "”. Đây là công cụ tự đánh giá nhân trắc, không phải kết luận bệnh và không thay thế khám bác sĩ.",
      next: NEXT[g.key],
      waist: waist,
      waistHigh: waistHigh(a.sex, waist),
      waistText: waistText(a.sex, waist),
      muscleNote: b >= 23 ? "BMI không phân biệt cơ và mỡ. Vòng eo hữu ích hơn với người nhiều cơ." : null,
      range: refRange(h),
    };
  }

  var api = { round1: round1, bmi: bmi, group: group, waistHigh: waistHigh, refRange: refRange, evaluate: evaluate, fmt: fmt, GROUPS: GROUPS, WAIST_CUT: WAIST_CUT };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.VSHBmi = api;
})(this);
