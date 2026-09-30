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
check("PUBLIC_ASSESSMENT_ENABLED = false", CFG.publicAssessmentEnabled === false);
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
// ---- B1–B4: ranh giới Bình hòa, "là" và "cơ bản là" loại trừ nhau
const allBiased = (v, over = {}) => sc(60, Object.fromEntries(BIASED.map((k) => [k, over[k] ?? v])));
let b1 = S.classify(allBiased(29.9));
check("B1: bình hòa 60, mọi thể lệch 29.9 -> definite, KHÔNG basic", b1.balanced === "definite" && b1.balanced !== "basic", b1.balanced);
let b2 = S.classify(allBiased(10, { qi_deficiency: 30 }));
check("B2: bình hòa 60, một thể lệch 30, còn lại <30 -> basic, KHÔNG definite", b2.balanced === "basic" && b2.balanced !== "definite", b2.balanced);
let b3 = S.classify(allBiased(10, { qi_deficiency: 39.9 }));
check("B3: bình hòa 60, một thể lệch 39.9 -> basic", b3.balanced === "basic", b3.balanced);
let b4 = S.classify(allBiased(10, { qi_deficiency: 40 }));
check("B4: bình hòa 60, một thể lệch 40 -> không definite, không basic", b4.balanced === "no", b4.balanced);
check("B4: khi đó thể lệch 40 được báo đạt ngưỡng", b4.definite.join() === "qi_deficiency" && /đạt ngưỡng của nhóm Khí hư/.test(R.headline(b4)));
check("B1–B4 in ra", true, `B1=${b1.balanced} B2=${b2.balanced} B3=${b3.balanced} B4=${b4.balanced}`);

// ---- Case C: một thể lệch "là"
c = S.classify(sc(20, { phlegm_dampness: 40 }));
check("C: một thể lệch ≥40 -> câu 'đạt ngưỡng của nhóm Đàm thấp'", c.primary === "biased" && c.definite.join() === "phlegm_dampness" && R.headline(c) === "Kết quả tự đánh giá của bạn đạt ngưỡng của nhóm Đàm thấp theo hệ thống phân loại được sử dụng trong công cụ này.");
// ---- Case D: xu hướng
c = S.classify(sc(20, { blood_stasis: 30 }));
check("D: 30 -> tendency; 39.9 -> tendency; 29.9 -> below", c.tendency[0] === "blood_stasis" && S.classify(sc(20, { blood_stasis: 39.9 })).tendency[0] === "blood_stasis" && S.classify(sc(20, { blood_stasis: 29.9 })).primary === "undetermined");
check("D: một nhóm xu hướng -> 'đạt ngưỡng xu hướng của nhóm Huyết ứ'", /đạt ngưỡng xu hướng của nhóm Huyết ứ/.test(R.headline(c)));
check("Không nhóm nào đạt ngưỡng -> câu trung tính, không ép nhóm", R.headline(S.classify(sc(20))) === "Kết quả tự đánh giá của bạn chưa đạt ngưỡng phân loại của nhóm nào trong công cụ này." && R.contentKeys(S.classify(sc(20))).length === 0);
// ---- Case E: nhiều thể lệch cùng ≥ 40 — điểm cố ý đặt NGƯỢC thứ tự cố định để bắt lỗi xếp theo điểm
c = S.classify(sc(20, { qi_deficiency: 41, phlegm_dampness: 48, qi_stagnation: 72, damp_heat: 33 }));
const fixedOrder = CFG.constitutions.filter((k) => ["qi_deficiency", "phlegm_dampness", "qi_stagnation"].includes(k));
check("E: trả về đủ 3 nhóm ≥ 40", c.definite.length === 3 && ["qi_deficiency", "phlegm_dampness", "qi_stagnation"].every((k) => c.definite.includes(k)), c.definite.join());
check("E: thứ tự = thứ tự cố định của công cụ, không theo điểm", c.definite.join() === fixedOrder.join() && c.definite.join() !== "qi_stagnation,phlegm_dampness,qi_deficiency", c.definite.join());
check("E: nhóm xu hướng 30–39 không bị bỏ", c.tendency.join() === "damp_heat");
const eHead = R.headline(c), eList = R.groupList(c);
check("E: câu kết quả là 'đạt ngưỡng của nhiều nhóm', không nêu tên nhóm nào", eHead === "Kết quả tự đánh giá của bạn đạt ngưỡng của nhiều nhóm thể chất." && !/Khí hư|Đàm thấp|Khí uất/.test(eHead));
check("E: danh sách hiển thị đủ 4 nhóm (3 đạt + 1 xu hướng), theo thứ tự cố định", eList.title === "Các nhóm đạt ngưỡng:" && eList.items.join("|") === "Khí hư|Đàm thấp|Thấp nhiệt (xu hướng)|Khí uất", eList.items.join("|"));
check("E: nội dung giới thiệu + lối sống hiện cho mọi nhóm đạt ngưỡng", R.contentKeys(c).join() === "qi_deficiency,phlegm_dampness,damp_heat,qi_stagnation");
check("B2: bình hòa cơ bản vẫn liệt kê nhóm xu hướng", R.groupList(b2).items.join() === "Khí hư" && /“cơ bản” của nhóm Bình hòa/.test(R.headline(b2)));
check("E in ra", true, `definite=${c.definite.join(",")} tendency=${c.tendency.join(",")} headline="${eHead}" list=${eList.items.join("; ")}`);

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
check("E2E câu giả: chỉ Khí uất đạt ngưỡng", r.ok && r.classification.definite.join() === "qi_stagnation" && r.classification.primary === "biased");

// ---- Fixture phải là câu giả
check("Fixture: 60 câu, mọi câu là 'Câu thử nghiệm Qxx — không phải câu hỏi CCMQ'", FX.ITEMS.length === 60 && FX.ITEMS.every((it) => /^Câu thử nghiệm Q\d\d — không phải câu hỏi CCMQ$/.test(it.text)) && FX.synthetic === true);

// ---- Nội dung kết quả: không chẩn đoán, không sản phẩm, không nối bệnh
const allText = JSON.stringify(R.RESULTS) + R.NOT_DIAGNOSIS + R.DISCLAIMER + R.CARE + BIASED.map((k) => R.headline(S.classify(sc(20, { [k]: 50 })))).join(" ") + R.GENERAL.join(" ") + R.headline(S.classify(sc(65)));
const banned = [/bạn bị/i, /bạn mắc/i, /chẩn đoán là/i, /\/san-pham/, /mua/i, /liệu trình/i, /liều/i, /bài thuốc/i, /thảo dược/i, /vị thuốc/i, /thực phẩm bảo vệ/i, /TPCN/, /hoàng kỳ/i, /nhân sâm/i, /ngừng thuốc/i, /tiểu đường|đái tháo đường|huyết áp|miễn dịch|ung thư|béo phì|gan nhiễm mỡ/i, /\bgây\b|dẫn đến/i];
const hits = banned.filter((re) => re.test(allText));
check("Kết quả không có từ cấm (chẩn đoán / sản phẩm / thảo dược / tên bệnh / 'gây')", hits.length === 0, hits.map(String).join(" "));
check("Đủ 9 thể có nội dung", K.every((k) => R.RESULTS[k] && R.RESULTS[k].name && R.RESULTS[k].about && R.RESULTS[k].guidance.length));

// ---- Không có chữ "nhóm thắng"
const t01Src = ["results.js", "ui.js", "scoring.js"].map((f) => fs.readFileSync(path.join(__dirname, "../assets/tool01", f), "utf8")).join("\n");
const winner = /phù hợp nhất|nhóm chính|thể chính|trội|dominant|nổi bật nhất|cao nhất/i;
check("Mã công cụ 01 không có chữ 'phù hợp nhất / chính / trội / dominant'", !winner.test(t01Src), (t01Src.match(winner) || [""])[0]);
check("Không còn sắp xếp theo điểm", !/\.sort\(/.test(t01Src));

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
  const locked = !CFG.publicAssessmentEnabled;
  check("HTML: đang khóa -> noindex,follow", locked ? html.includes('<meta name="robots" content="noindex,follow">') : html.includes('<meta name="robots" content="index,follow">'));
  check("HTML: không có chữ nhóm thắng", !winner.test(html));
  const refs = html.slice(html.indexOf("<h2>Nguồn khoa học</h2>"));
  check("HTML: mục nguồn ghi rõ đang hoàn thiện, không liệt kê trích dẫn", refs.includes("Nguồn khoa học đang được hoàn thiện trước khi công cụ được phát hành chính thức.") && !/<li>/.test(refs.slice(0, refs.indexOf("</section>"))) && !/2009|2022|Vương Kỳ/.test(refs.slice(0, refs.indexOf("</section>"))));
  const stub = fs.readFileSync(path.join(site, "cong-cu/the-chat-dong-y.html"), "utf8");
  check("Địa chỉ cũ chuyển sang địa chỉ mới, noindex", stub.includes('url=/cong-cu/tu-danh-gia-the-chat-dong-y') && stub.includes("noindex"));
  const sm = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
  check("Sitemap: đang khóa -> không có công cụ 01; không có file test", (locked ? !sm.includes("/cong-cu/tu-danh-gia-the-chat-dong-y") : sm.includes("/cong-cu/tu-danh-gia-the-chat-dong-y")) && !sm.includes("/cong-cu/tests"));
  check(".vercelignore loại thư mục test (câu giả không lên site)", fs.readFileSync(path.join(site, ".vercelignore"), "utf8").split(/\r?\n/).includes("cong-cu/tests"));
}

console.log(fail ? `\n${fail} lỗi` : "\nTất cả đạt");
process.exit(fail ? 1 : 0);
