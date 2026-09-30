// node cong-cu/tests/run-tests.js — kiểm tra logic công cụ 03 (BMI) và 02 (FINDRISC). Thoát mã 1 nếu lỗi.
// Tùy chọn: node cong-cu/tests/run-tests.js --html <thư-mục-site> để quét HTML trang công cụ tìm URL/từ cấm.
"use strict";
const path = require("path");
const fs = require("fs");
const B = require("../assets/bmi.js");
const F = require("../assets/findrisc.js");

let fail = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail !== undefined ? `  (${detail})` : ""}`);
  if (!ok) fail++;
};

// ---- Công cụ 03
let r = B.evaluate({ sex: "nu", heightCm: 158, weightKg: 58 });
check("BMI 58 kg / 158 cm = 23.2", r.bmi === 23.2, r.bmi);
check("BMI 23.2 -> Thừa cân theo ngưỡng châu Á", r.group.label === "Thừa cân theo ngưỡng châu Á");
const edges = [[18.4, "Thiếu cân"], [18.5, "Trong khoảng thường gặp"], [22.9, "Trong khoảng thường gặp"], [23.0, "Thừa cân theo ngưỡng châu Á"], [24.9, "Thừa cân theo ngưỡng châu Á"], [25.0, "Béo phì độ I theo ngưỡng châu Á"], [29.9, "Béo phì độ I theo ngưỡng châu Á"], [30.0, "Béo phì độ II theo ngưỡng châu Á"]];
for (const [b, label] of edges) check(`Biên BMI ${b} -> ${label}`, B.group(b).label === label, B.group(b).label);
check("Làm tròn 0.05 lên: 22.95 -> 23.0", B.round1(22.95) === 23.0, B.round1(22.95));
check("Làm tròn 22.94 -> 22.9", B.round1(22.94) === 22.9);
check("Nam 89.9 cm chưa đạt mốc", B.waistHigh("nam", 89.9) === false);
check("Nam 90.0 cm đạt mốc", B.waistHigh("nam", 90) === true);
check("Nữ 79.9 cm chưa đạt mốc", B.waistHigh("nu", 79.9) === false);
check("Nữ 80.0 cm đạt mốc", B.waistHigh("nu", 80) === true);
check("Tuổi 17 -> không phân loại", B.evaluate({ sex: "nam", heightCm: 170, weightKg: 70, age: 17 }).ok === false);
check("Mang thai -> không phân loại", B.evaluate({ sex: "nu", heightCm: 160, weightKg: 60, pregnant: true }).ok === false);
check("Chưa nhập eo -> câu nhắc đo eo", /chưa nhập vòng eo/.test(B.evaluate({ sex: "nam", heightCm: 170, weightKg: 70 }).waistText));
check("BMI >= 23 có dòng cơ/mỡ", !!B.evaluate({ sex: "nam", heightCm: 170, weightKg: 70 }).muscleNote);
check("BMI < 23 không có dòng cơ/mỡ", B.evaluate({ sex: "nam", heightCm: 170, weightKg: 60 }).muscleNote === null);
const rr = B.refRange(158);
check("Khoảng cân tham chiếu 158 cm: 46.2–57.2 kg", rr.low === 46.2 && rr.high === 57.2, `${rr.low}–${rr.high}`);
check("Chiều cao ngoài 120–220 bị từ chối", B.evaluate({ sex: "nam", heightCm: 119, weightKg: 60 }).ok === false);

// ---- Công cụ 02
const base = { sex: "nam", age: 40, heightCm: 170, weightKg: 60, waistCm: 80, active: true, vegDaily: true, bpMeds: false, highGlucose: false, family: "khong" };
const f = (o) => F.evaluate({ ...base, ...o });
check("Điểm tối thiểu = 0, nguy cơ thấp", f({}).score === 0 && f({}).band.key === "thap");
const max = f({ age: 70, weightKg: 90, waistCm: 100, active: false, vegDaily: false, bpMeds: true, highGlucose: true, family: "gan" });
check("Điểm tối đa = 26", max.score === 26, max.score);
check("Tuổi 44/45/54/55/64/65 -> 0/2/2/3/3/4", [44, 45, 54, 55, 64, 65].map(F.agePoints).join(",") === "0,2,2,3,3,4");
check("BMI 22.9/23/27.4/27.5 -> 0/1/1/3", [22.9, 23, 27.4, 27.5].map(F.bmiPoints).join(",") === "0,1,1,3");
check("Eo nam 89.9/90 -> 0/4; nữ 79.9/80 -> 0/4", F.waistPoints("nam", 89.9) === 0 && F.waistPoints("nam", 90) === 4 && F.waistPoints("nu", 79.9) === 0 && F.waistPoints("nu", 80) === 4);
const nw = f({ waistCm: undefined });
check("Thiếu eo: vẫn tính, không tự gán 4, có ghi chú", nw.ok && nw.parts.vongEo === 0 && /chưa có/.test(nw.waistNote));
const bandAt = (s) => F.band(s).key;
check("Nhóm 6/7 -> thấp/hơi tăng", bandAt(6) === "thap" && bandAt(7) === "hoi-tang");
check("Nhóm 11/12 -> hơi tăng/trung bình", bandAt(11) === "hoi-tang" && bandAt(12) === "trung-binh");
check("Nhóm 14/15 -> trung bình/cao", bandAt(14) === "trung-binh" && bandAt(15) === "cao");
check("Nhóm 20/21 -> cao/rất cao", bandAt(20) === "cao" && bandAt(21) === "rat-cao");
check("Người thân xa = 3, gần = 5", f({ family: "xa" }).parts.nguoiThan === 3 && f({ family: "gan" }).parts.nguoiThan === 5);
check("Đã chẩn đoán -> không tính", f({ diagnosed: true }).ok === false);
check("Tuổi 17 -> không tính", f({ age: 17 }).ok === false);
check("Nhận BMI từ công cụ 03 (bridge)", F.evaluate({ ...base, heightCm: undefined, weightKg: undefined, bmi: 27.5 }).parts.bmi === 3);
check("Câu 'không phải chẩn đoán' luôn có", /không phải chẩn đoán đái tháo đường/.test(f({}).always));

// ---- Từ và URL cấm trong copy kết quả (logic)
const banned = [/bạn bị/i, /bạn mắc/i, /chẩn đoán béo phì/i, /\/san-pham/, /mua ngay/i, /liệu trình/i, /tiền tiểu đường/i, /xác suất của bạn/i, /đốt mỡ/i, /thải độc/i, /hết bệnh/i, /chữa được/i];
const texts = [];
for (const b of [16, 20, 24, 27, 32]) {
  const h = 160, w = b * 2.56;
  const e = B.evaluate({ sex: "nam", heightCm: h, weightKg: w, waistCm: 95 });
  texts.push(e.main, e.next, e.waistText, e.muscleNote || "");
}
for (const bnd of F.BANDS) texts.push(bnd.label, bnd.ref, bnd.next);
texts.push(F.ALWAYS);
const hit = banned.filter((re) => texts.some((t) => re.test(t)));
check("Copy kết quả không chứa từ/URL cấm", hit.length === 0, hit.map(String).join(" "));
const bmiOnly = texts.slice(0, 20).join(" ");
check("Kết quả BMI không có 'tiểu đường', 'hội chứng chuyển hóa', 'gan nhiễm mỡ'", !/tiểu đường|hội chứng chuyển hóa|gan nhiễm mỡ/i.test(bmiOnly));

// ---- Quét HTML đã sinh (nếu có)
const i = process.argv.indexOf("--html");
if (i > -1) {
  const site = process.argv[i + 1];
  for (const rel of ["cong-cu.html", "cong-cu/bmi-vong-eo-chau-a.html", "cong-cu/nguy-co-dai-thao-duong-findrisc.html", "cong-cu/the-chat-dong-y.html"]) {
    const html = fs.readFileSync(path.join(site, rel), "utf8");
    check(`${rel}: không có /san-pham`, !html.includes("/san-pham"));
    check(`${rel}: không có 'mua'`, !/\bmua\b/i.test(html.replace(/<script[\s\S]*?<\/script>/g, "")));
    check(`${rel}: đúng 1 H1`, (html.match(/<h1[\s>]/g) || []).length === 1);
    check(`${rel}: có <noscript>`, rel === "cong-cu.html" || rel === "cong-cu/the-chat-dong-y.html" || html.includes("<noscript>"));
  }
}

console.log(fail ? `\n${fail} lỗi` : "\nTất cả đạt");
process.exit(fail ? 1 : 0);
