/* Công cụ 02 — ModAsian FINDRISC (nguy cơ đái tháo đường type 2 trong 10 năm). Logic thuần.
   Khung: Lindström & Tuomilehto 2003; BMI/vòng eo theo ngưỡng châu Á (thống nhất với công cụ 03). Điểm và copy đã khóa. */
(function (root) {
  "use strict";

  function round1(x) {
    return Math.floor(x * 10 + 0.5 + 1e-9) / 10;
  }

  function agePoints(age) {
    if (age < 45) return 0;
    if (age < 55) return 2;
    if (age < 65) return 3;
    return 4;
  }
  function bmiPoints(bmi) {
    if (bmi < 23) return 0;
    if (bmi < 27.5) return 1;
    return 3;
  }
  // null khi chưa có vòng eo: không tự gán điểm.
  function waistPoints(sex, waistCm) {
    if (!(waistCm > 0)) return null;
    return waistCm >= (sex === "nam" ? 90 : 80) ? 4 : 0;
  }

  var BANDS = [
    { max: 6, key: "thap", label: "Nguy cơ thấp theo thang FINDRISC", ref: "khoảng < 1% / 10 năm theo bảng gốc", next: "Duy trì vận động và ăn rau hàng ngày. Lặp lại tự đánh giá nếu cân nặng hoặc vòng eo đổi." },
    { max: 11, key: "hoi-tang", label: "Nguy cơ hơi tăng theo thang FINDRISC", ref: "khoảng 4% / 10 năm theo bảng gốc", next: "Nên đo lại vòng eo, tăng vận động, ăn rau mỗi ngày. Mang tóm tắt này khi khám định kỳ." },
    { max: 14, key: "trung-binh", label: "Nguy cơ trung bình theo thang FINDRISC", ref: "khoảng 17% / 10 năm theo bảng gốc", next: "Nên đến cơ sở y tế làm xét nghiệm đường huyết theo chỉ định nhân viên y tế. Công cụ này không thay được xét nghiệm." },
    { max: 20, key: "cao", label: "Nguy cơ cao theo thang FINDRISC", ref: "khoảng 33% / 10 năm theo bảng gốc", next: "Nên đặt lịch khám trong thời gian sớm để được xét nghiệm. Không tự mua thuốc hạ đường huyết." },
    { max: Infinity, key: "rat-cao", label: "Nguy cơ rất cao theo thang FINDRISC", ref: "khoảng 50% / 10 năm theo bảng gốc", next: "Nên khám sớm. Nếu có khát nhiều, đái nhiều, sụt cân: đừng chờ. Công cụ không chẩn đoán và không kê đơn." },
  ];
  function band(score) {
    for (var i = 0; i < BANDS.length; i++) if (score <= BANDS[i].max) return BANDS[i];
    return BANDS[BANDS.length - 1];
  }

  var ALWAYS = "Đây là thang sàng lọc dựa trên câu hỏi, không phải xét nghiệm máu và không phải chẩn đoán đái tháo đường.";
  var REF_NOTE = "Tỷ lệ tham chiếu lấy từ bảng của tài liệu gốc (Phần Lan), không phải xác suất cá nhân của bạn.";

  /**
   * @param {{sex:"nam"|"nu", age:number, heightCm?:number, weightKg?:number, bmi?:number, waistCm?:number,
   *          active:boolean, vegDaily:boolean, bpMeds:boolean, highGlucose:boolean,
   *          family:"khong"|"xa"|"gan", diagnosed?:boolean}} a
   */
  function evaluate(a) {
    if (a.diagnosed) return { ok: false, reason: "diagnosed", message: "Nếu bạn đã có chẩn đoán, hãy theo bác sĩ đang điều trị; công cụ này dành cho người chưa được chẩn đoán." };
    var age = Number(a.age);
    if (!(age >= 18 && age <= 110)) return { ok: false, reason: age > 0 && age < 18 ? "age" : "input", message: age > 0 && age < 18 ? "Công cụ này dành cho người từ 18 tuổi." : "Vui lòng nhập tuổi (từ 18)." };
    if (!(a.sex === "nam" || a.sex === "nu")) return { ok: false, reason: "input", message: "Vui lòng chọn giới tính." };
    var bmi = Number(a.bmi) > 0 ? round1(Number(a.bmi)) : null;
    var h = Number(a.heightCm), w = Number(a.weightKg);
    if (bmi === null && h >= 120 && h <= 220 && w >= 30 && w <= 200) bmi = round1(w / Math.pow(h / 100, 2));
    if (bmi === null) return { ok: false, reason: "input", message: "Vui lòng nhập chiều cao và cân nặng." };
    var need = ["active", "vegDaily", "bpMeds", "highGlucose"];
    for (var i = 0; i < need.length; i++) if (typeof a[need[i]] !== "boolean") return { ok: false, reason: "input", message: "Vui lòng trả lời đủ các câu hỏi." };
    if (["khong", "xa", "gan"].indexOf(a.family) < 0) return { ok: false, reason: "input", message: "Vui lòng trả lời câu hỏi về người thân." };

    var wp = waistPoints(a.sex, Number(a.waistCm));
    var parts = {
      tuoi: agePoints(age),
      bmi: bmiPoints(bmi),
      vongEo: wp === null ? 0 : wp,
      vanDong: a.active ? 0 : 2,
      rauQua: a.vegDaily ? 0 : 1,
      thuocHuyetAp: a.bpMeds ? 2 : 0,
      duongHuyetCao: a.highGlucose ? 5 : 0,
      nguoiThan: a.family === "gan" ? 5 : a.family === "xa" ? 3 : 0,
    };
    var score = 0;
    for (var k in parts) score += parts[k];
    var b = band(score);
    return {
      ok: true,
      score: score,
      band: b,
      bmi: bmi,
      parts: parts,
      waistMissing: wp === null,
      waistNote: wp === null ? "Điểm vòng eo chưa có — kết quả có thể thấp hơn thực tế." : null,
      always: ALWAYS,
      refNote: REF_NOTE,
    };
  }

  var api = { agePoints: agePoints, bmiPoints: bmiPoints, waistPoints: waistPoints, band: band, evaluate: evaluate, BANDS: BANDS, ALWAYS: ALWAYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.VSHFindrisc = api;
})(this);
