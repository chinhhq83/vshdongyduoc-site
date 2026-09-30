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

// ---- Công cụ 04: 5 tiêu chí chuyển hóa
const M = require("../assets/mets.js");
const mb = { sex: "nam", unit: "mmol", age: 50, pregnant: false, waistCm: null, tg: null, hdl: null, glu: null, sbp: null, dbp: null, medTg: false, medHdl: false, medBp: false, medGlu: false };
const m = (o) => M.evaluate({ ...mb, ...o });
check("04: nam eo 90 đạt, 89.9 chưa", m({ waistCm: 90 }).criteria.eo === true && m({ waistCm: 89.9 }).criteria.eo === false);
check("04: nữ eo 80 đạt", m({ sex: "nu", waistCm: 80 }).criteria.eo === true);
check("04: TG 1.7 mmol đạt, 1.69 chưa; 150 mg/dL đạt", m({ tg: 1.7 }).criteria.tg && !m({ tg: 1.69 }).criteria.tg && m({ unit: "mg", tg: 150 }).criteria.tg);
check("04: HDL nam 0.99 đạt, 1.0 chưa; nữ 1.29 đạt, 1.3 chưa", m({ hdl: 0.99 }).criteria.hdl && !m({ hdl: 1.0 }).criteria.hdl && m({ sex: "nu", hdl: 1.29 }).criteria.hdl && !m({ sex: "nu", hdl: 1.3 }).criteria.hdl);
check("04: HA 130/80 đạt, 129/85 đạt, 129/84 chưa", m({ sbp: 130, dbp: 80 }).criteria.ha && m({ sbp: 129, dbp: 85 }).criteria.ha && !m({ sbp: 129, dbp: 84 }).criteria.ha);
check("04: glucose 5.6 đạt, 5.59 chưa; 100 mg/dL đạt", m({ glu: 5.6 }).criteria.glu && !m({ glu: 5.59 }).criteria.glu && m({ unit: "mg", glu: 100 }).criteria.glu);
check("04: thuốc tính là đạt", m({ medBp: true, medGlu: true, medTg: true }).met === 3);
check("04: 3/5 -> đỏ; 2/5 -> hổ phách; 0 -> không màu", m({ waistCm: 95, tg: 2, glu: 6 }).level === "red" && m({ waistCm: 95, tg: 2 }).level === "amber" && m({ waistCm: 70, tg: 1 }).level === null);
check("04: thiếu số liệu có ghi chú", /Còn 3\/5 chỉ số chưa nhập; kết quả có thể thay đổi/.test(m({ waistCm: 95, tg: 2 }).notes[0]));
check("04: không nhập gì -> không tính", m({}).ok === false);
check("04: mang thai -> không tính", m({ pregnant: true, waistCm: 95 }).ok === false);
check("04: đơn vị sai (TG 150 khi chọn mmol) -> báo lỗi", m({ tg: 150 }).ok === false);

// ---- Công cụ 05: FIB-4
const Fb = require("../assets/fib4.js");
const fb = (o) => Fb.evaluate({ age: 50, ast: 30, alt: 30, plt: 250, ...o });
check("05: công thức 50*30/(250*sqrt30) = 1.10", fb({}).value === 1.1, fb({}).value);
check("05: < 1.30 thấp", fb({}).key === "thap");
const at = (v) => { const age = 50, ast = 36, alt = 36, plt = age * ast / (v * 6); return Fb.evaluate({ age, ast, alt, plt }); };
check("05: 1.30 -> giữa, 2.67 -> giữa, 2.68 -> cao", at(1.3).key === "giua" && at(2.67).key === "giua" && at(2.68).key === "cao", [at(1.3).value, at(2.67).value, at(2.68).value].join(","));
const old = (v) => { const age = 70, ast = 36, alt = 36, plt = age * ast / (v * 6); return Fb.evaluate({ age, ast, alt, plt }); };
check("05: từ 65 tuổi mốc dưới 2.0 (1.99 thấp, 2.0 giữa)", old(1.99).key === "thap" && old(2.0).key === "giua");
check("05: dưới 35 tuổi có ghi chú", fb({ age: 30 }).notes.some((t) => /Dưới 35 tuổi/.test(t)));
check("05: thiếu tiểu cầu / tuổi 17 -> không tính", fb({ plt: null }).ok === false && fb({ age: 17 }).ok === false);
check("05: tiểu cầu nhập 250000 -> báo đơn vị", fb({ plt: 250000 }).ok === false);

// ---- Công cụ 06: nướu
const N = require("../assets/nuou.js");
const nb = { q1: "khong", q2: "tot", q3: "khong", q4: "khong", q5: "khong", q6: "khong", q7: 3, q8: null, v1: "khong", v2: "khong" };
const nu = (o) => N.evaluate({ ...nb, ...o });
check("06: không dấu hiệu -> không màu", nu({}).level === null && nu({}).hits.length === 0);
check("06: răng lung lay -> hổ phách", nu({ q4: "co" }).level === "amber");
check("06: tự đánh giá kém / tạm được là dấu hiệu", nu({ q2: "kem" }).hits.length === 1 && nu({ q2: "tamduoc" }).hits.length === 1);
check("06: sưng đau/mủ -> đỏ", nu({ v2: "co" }).level === "red");
check("06: thiếu câu -> không tính", nu({ q3: null }).ok === false);
check("06: không làm sạch kẽ -> ghi chú", nu({ q7: 0 }).notes.length === 1);

// ---- Công cụ 07: Fitzpatrick
const Z = require("../assets/fitz.js");
check("07: loại II, không dấu hiệu", Z.evaluate({ type: "II", flag: "khong" }).label === "Loại da Fitzpatrick II" && Z.evaluate({ type: "II", flag: "khong" }).level === null);
check("07: nốt ruồi thay đổi -> đỏ, khuyên khám da liễu", Z.evaluate({ type: "IV", flag: "co" }).level === "red" && /khám da liễu/.test(Z.evaluate({ type: "IV", flag: "co" }).next[0]));
check("07: chưa chọn -> không tính", Z.evaluate({ type: null, flag: "khong" }).ok === false);

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
for (const L of Object.values(M.LEVELS)) texts.push(L.label, L.next); texts.push(M.MAIN_TAIL);
for (const L of Object.values(Fb.BANDS)) texts.push(L.label, L.next); texts.push(Fb.ALWAYS);
for (const L of Object.values(N.LEVELS)) texts.push(L.label, L.next); texts.push(N.ALWAYS, ...Object.values(N.SIGNALS));
texts.push(...Object.values(Z.NEXT), Z.RED, Z.ALWAYS);
const hit = banned.filter((re) => texts.some((t) => re.test(t)));
check("Copy kết quả không chứa từ/URL cấm", hit.length === 0, hit.map(String).join(" "));
const bmiOnly = texts.slice(0, 20).join(" ");
check("Kết quả BMI không có 'tiểu đường', 'hội chứng chuyển hóa', 'gan nhiễm mỡ'", !/tiểu đường|hội chứng chuyển hóa|gan nhiễm mỡ/i.test(bmiOnly));

// ---- Quét HTML đã sinh (nếu có)
const i = process.argv.indexOf("--html");
if (i > -1) {
  const site = process.argv[i + 1];
  for (const rel of ["cong-cu.html", "cong-cu/bmi-vong-eo-chau-a.html", "cong-cu/nguy-co-dai-thao-duong-findrisc.html", "cong-cu/tu-danh-gia-the-chat-dong-y.html", "cong-cu/hoi-chung-chuyen-hoa.html", "cong-cu/fib-4.html", "cong-cu/suc-khoe-nuou.html", "cong-cu/fitzpatrick.html"]) {
    const html = fs.readFileSync(path.join(site, rel), "utf8");
    check(`${rel}: không có /san-pham`, !html.includes("/san-pham"));
    // Câu khóa "Không tự mua thuốc hạ đường huyết." là lời cảnh báo, không phải bán hàng — loại trừ đúng câu đó.
    check(`${rel}: không có 'mua'`, !/\bmua\b/i.test(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/Không tự mua thuốc hạ đường huyết/g, "")));
    if (rel.includes("findrisc")) {
      for (const t of ["J Multidiscip Healthc</i>. 2023;16:439–449. doi:10.2147/JMDH.S398455", "(type 1 hoặc type 2)", "thuốc huyết áp thường xuyên", "Tỷ lệ % 10 năm trên trang là số liệu của tài liệu gốc", "Thiếu vòng eo thì sao?"])
        check(`${rel}: có "${t.slice(0, 40)}"`, html.includes(t));
      check(`${rel}: không còn citation chung chung`, !html.includes("Doan et al."));
    }
    check(`${rel}: đúng 1 H1`, (html.match(/<h1[\s>]/g) || []).length === 1);
    check(`${rel}: có <noscript>`, rel === "cong-cu.html" || html.includes("<noscript>"));
  }
}

console.log(fail ? `\n${fail} lỗi` : "\nTất cả đạt");
process.exit(fail ? 1 : 0);
