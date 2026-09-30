// node cong-cu/tests/tool01-tests.js [--html .] — kiểm tra công cụ 01: bộ tính điểm, phân loại, cổng khóa, quyền riêng tư.
"use strict";
const fs = require("fs");
const path = require("path");
const CFG = require("../assets/tool01/config.js");
const S = require("../assets/tool01/scoring.js");
const Q = require("../assets/tool01/questionnaire.js");
const R = require("../assets/tool01/results.js");
const FX = require("./fixtures/tool01-synthetic-items.TEST-FIXTURE.js");

let fail = 0;
const check = (name, ok, detail) => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail !== undefined ? `  (${detail})` : ""}`); if (!ok) fail++; };
const K = CFG.constitutions, BIASED = K.filter((k) => k !== "balanced");
const sc = (bal, over = {}) => Object.fromEntries(K.map((k) => [k, k === "balanced" ? bal : over[k] ?? 10]));

// ---- Cổng
check("RIGHTS_APPROVED = false", CFG.rightsApproved === false);
check("MEDICAL_CONTENT_REVIEWED = false", CFG.medicalContentReviewed === false);
check("publicAssessmentEnabled suy ra = rights && medical", CFG.publicAssessmentEnabled === (CFG.rightsApproved && CFG.medicalContentReviewed));
check("Chưa có quyền -> bộ câu hỏi rỗng, licensed=false", !CFG.rightsApproved ? Q.ITEMS.length === 0 && Q.licensed === false && Q.SCALE === null : true);
check("instrumentMetadata không tự điền người duyệt / ngày", CFG.instrumentMetadata.rightsApprovedBy === null && CFG.instrumentMetadata.medicalReviewer === null && CFG.instrumentMetadata.rightsApprovalDate === null && CFG.instrumentMetadata.medicalReviewDate === null && CFG.instrumentVersion === null);

// ---- Case A: Bình hòa "là"
let c = S.classify(sc(65, { qi_deficiency: 29.9 }));
check("A: bình hòa ≥60, mọi thể lệch <30 -> definite", c.balanced === "definite" && c.primary === "balanced");
// ---- Case B: Bình hòa "cơ bản là"
c = S.classify(sc(60, { yin_deficiency: 35 }));
check("B: bình hòa ≥60, có thể lệch 30–39, không ≥40 -> basic", c.balanced === "basic" && c.primary === "balanced" && c.tendency.includes("yin_deficiency"));
check("B': bình hòa 59.9 -> không phải bình hòa", S.classify(sc(59.9)).balanced === "no");
check("B'': bình hòa 70 nhưng một thể lệch 40 -> không phải bình hòa", S.classify(sc(70, { damp_heat: 40 })).balanced === "no");
// ---- Case C: một thể lệch "là"
c = S.classify(sc(20, { phlegm_dampness: 40 }));
check("C: một thể lệch ≥40 -> definite, là kết quả chính", c.primary === "biased" && c.definite[0] === "phlegm_dampness" && /Đàm thấp/.test(R.headline(c)));
// ---- Case D: xu hướng
c = S.classify(sc(20, { blood_stasis: 30 }));
check("D: 30 -> tendency; 39.9 -> tendency; 29.9 -> below", c.tendency[0] === "blood_stasis" && S.classify(sc(20, { blood_stasis: 39.9 })).tendency[0] === "blood_stasis" && S.classify(sc(20, { blood_stasis: 29.9 })).primary === "undetermined");
// ---- Case E: nhiều thể lệch
c = S.classify(sc(20, { qi_deficiency: 45, yang_deficiency: 55, qi_stagnation: 41, damp_heat: 33 }));
check("E: giữ mọi thể đạt ngưỡng, xếp theo điểm", c.definite.join(",") === "yang_deficiency,qi_deficiency,qi_stagnation" && c.tendency.join(",") === "damp_heat");
check("E: câu kết quả + dòng 'nhóm khác' không bỏ sót", R.others(c).length === 3 && R.others(c).some((t) => /Khí hư/.test(t)) && R.others(c).some((t) => /Khí uất/.test(t)) && R.others(c).some((t) => /Thấp nhiệt/.test(t)));
// ---- Case F: đảo điểm
check("F: đảo 1→5, 2→4, 3→3, 4→2, 5→1", [1, 2, 3, 4, 5].map((a) => S.itemScore({ id: "x", reverse: true, answer: a })).join("") === "54321");
check("F: không đảo giữ nguyên", [1, 2, 3, 4, 5].map((a) => S.itemScore({ id: "x", reverse: false, answer: a })).join("") === "12345");
// ---- Case G: biên 0–100
const allAns = (v, flipReverse) => FX.ITEMS.map((it) => ({ ...it, answer: flipReverse && it.reverse ? 6 - v : v }));
let r = S.assess(allAns(1, true));
check("G: toàn điểm thấp nhất -> mọi thể = 0", r.ok && K.every((k) => r.scores[k] === 0));
r = S.assess(allAns(5, true));
check("G: toàn điểm cao nhất -> mọi thể = 100", r.ok && K.every((k) => r.scores[k] === 100));
check("G: công thức (raw − n)/(4n)×100: n=8, raw=24 -> 50", S.transformed(24, 8) === 50);
// ---- Case H: trả lời không hợp lệ
for (const bad of [0, 6, null, "3", NaN, 2.5, undefined]) {
  const items = FX.ITEMS.map((it, i) => ({ ...it, answer: i === 0 ? bad : 3 }));
  const out = S.assess(items);
  check(`H: từ chối câu trả lời ${String(bad)}`, out.ok === false && out.error === "INVALID_ANSWER" && out.invalid[0] === "Q01");
}
check("H: thiếu hẳn một thể -> báo lỗi", S.assess(FX.ITEMS.filter((it) => it.constitution !== "damp_heat").map((it) => ({ ...it, answer: 3 }))).ok === false);

// ---- Chạy từ đầu đến cuối bằng câu giả
const e2e = FX.ITEMS.map((it) => ({ ...it, answer: it.constitution === "qi_stagnation" ? 5 : it.constitution === "balanced" ? (it.reverse ? 5 : 1) : 1 }));
r = S.assess(e2e);
check("E2E câu giả: chỉ Khí uất đạt -> kết quả chính Khí uất", r.ok && r.classification.definite.join() === "qi_stagnation" && r.classification.primary === "biased");

// ---- Fixture phải là câu giả
check("Fixture: 60 câu, mọi câu là 'Câu thử nghiệm Qxx — không phải câu hỏi CCMQ'", FX.ITEMS.length === 60 && FX.ITEMS.every((it) => /^Câu thử nghiệm Q\d\d — không phải câu hỏi CCMQ$/.test(it.text)) && FX.synthetic === true);

// ---- Nội dung kết quả: không chẩn đoán, không sản phẩm, không nối bệnh
const allText = JSON.stringify(R.RESULTS) + R.NOT_DIAGNOSIS + R.DISCLAIMER + R.CARE + K.map((k) => R.headline({ primary: "biased", definite: [k], tendency: [], balanced: "no" })).join(" ");
const banned = [/bạn bị/i, /bạn mắc/i, /chẩn đoán là/i, /\/san-pham/, /mua/i, /liệu trình/i, /liều/i, /bài thuốc/i, /thảo dược/i, /vị thuốc/i, /thực phẩm bảo vệ/i, /TPCN/, /hoàng kỳ/i, /nhân sâm/i, /ngừng thuốc/i, /tiểu đường|đái tháo đường|huyết áp|miễn dịch|ung thư|béo phì|gan nhiễm mỡ/i, /\bgây\b|dẫn đến/i];
const hits = banned.filter((re) => re.test(allText));
check("Kết quả không có từ cấm (chẩn đoán / sản phẩm / thảo dược / tên bệnh / 'gây')", hits.length === 0, hits.map(String).join(" "));
check("Đủ 9 thể có nội dung", K.every((k) => R.RESULTS[k] && R.RESULTS[k].name && R.RESULTS[k].about && R.RESULTS[k].guidance.length));

// ---- Quyền riêng tư: mã công cụ 01 không lưu, không gửi, không gọi analytics
const src = ["config.js", "scoring.js", "questionnaire.js", "results.js", "ui.js"].map((f) => fs.readFileSync(path.join(__dirname, "../assets/tool01", f), "utf8")).join("\n");
const leaks = [/localStorage/, /sessionStorage/, /document\.cookie/, /indexedDB/i, /fetch\s*\(/, /XMLHttpRequest/, /sendBeacon/, /VSHAnalytics/, /\bva\s*\(/, /gtag|dataLayer/, /history\.(push|replace)State/, /location\.(hash|search)\s*=/];
const leakHits = leaks.filter((re) => re.test(src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")));
check("Mã công cụ 01 không lưu trữ / gửi mạng / gọi analytics / sửa URL", leakHits.length === 0, leakHits.map(String).join(" "));

// ---- HTML (tùy chọn)
const hi = process.argv.indexOf("--html");
if (hi > -1) {
  const site = process.argv[hi + 1];
  const html = fs.readFileSync(path.join(site, "cong-cu/tu-danh-gia-the-chat-dong-y.html"), "utf8");
  check("HTML: đúng 1 H1", (html.match(/<h1[\s>]/g) || []).length === 1);
  check("HTML: có thông báo khóa hiển thị sẵn", /id="t01-locked"(?![^>]*hidden)/.test(html) && html.includes("Bộ câu hỏi chuẩn đang được hoàn thiện thủ tục quyền sử dụng"));
  check("HTML: khung câu hỏi rỗng, không có radio nào", /<div id="t01-questions"><\/div>/.test(html) && !/type="radio"/.test(html));
  check("HTML: không trỏ tới file câu giả", !html.includes("TEST-FIXTURE"));
  check("HTML: không có /san-pham, không có 'mua'", !html.includes("/san-pham") && !/\bmua\b/i.test(html.replace(/<script[\s\S]*?<\/script>/g, "")));
  check("HTML: không đánh dấu MedicalTest / MedicalDevice / DiagnosticProcedure", !/MedicalTest|MedicalDevice|DiagnosticProcedure/.test(html));
  check("HTML: có các mục giải thích tĩnh", ["Công cụ này là gì?", "9 thể chất là gì?", "Công cụ này không làm gì?", "Kết quả được tính như thế nào?", "Ai nên sử dụng?", "Thông tin có được lưu không?", "Nguồn khoa học"].every((h) => html.includes(h)));
  check("HTML: trang được index", /<meta name="robots" content="index, follow">/.test(html));
  const stub = fs.readFileSync(path.join(site, "cong-cu/the-chat-dong-y.html"), "utf8");
  check("Địa chỉ cũ chuyển sang địa chỉ mới, noindex", stub.includes('url=/cong-cu/tu-danh-gia-the-chat-dong-y') && stub.includes("noindex"));
  const sm = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
  check("Sitemap có trang công cụ 01, không có file test", sm.includes("/cong-cu/tu-danh-gia-the-chat-dong-y") && !sm.includes("/cong-cu/tests"));
  check(".vercelignore loại thư mục test (câu giả không lên site)", fs.readFileSync(path.join(site, ".vercelignore"), "utf8").split(/\r?\n/).includes("cong-cu/tests"));
}

console.log(fail ? `\n${fail} lỗi` : "\nTất cả đạt");
process.exit(fail ? 1 : 0);
