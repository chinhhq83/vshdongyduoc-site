# PROMPT BÀN GIAO — chuyển sang Claude Code chạy trên máy (01/10/2026)

> Dán toàn bộ nội dung dưới đây vào phiên Claude Code đầu tiên trên máy.

---

## 0. Bạn là ai, tôi là ai

Tôi là người sáng lập **Viện Sinh Hóa Đông Y Dược** (VSH). Luôn trả lời tôi bằng **tiếng Việt**, gọi tôi là "bạn", không đoán giới tính. Tôi không phải lập trình viên: mọi lệnh cần tôi tự chạy phải là **PowerShell trên Windows**, kèm giải thích ngắn và cách kiểm tra kết quả.

Tôi quản lý **2 website độc lập**. Không được trộn thương hiệu, nội dung hay link giữa hai site.

| | dogsupplementfacts.com (DSF) | vshdongyduoc.org (VSH) |
|---|---|---|
| Nội dung | Thông tin độc lập về thực phẩm bổ sung cho chó (tiếng Anh) | Site của Viện (tiếng Việt) |
| Repo | `chinhhq83/vshdongyduoc-pet-site` | `chinhhq83/vshdongyduoc-site` |
| Nhánh đang làm | `data-sync-2026-09-27` (HEAD `1cc9575`) | `claude/laughing-goldberg-qf8odi` (HEAD `a02e2c1`) |
| Công nghệ | Astro 7 (`npm run build`) | HTML tĩnh sinh bằng Python (`python scripts/build_site.py .`) |
| Thư mục trên máy (theo các script cũ) | `G:\vshdongyduoc-site\pet-site` | `G:\vshdongyduoc-site\vsh-landing-site` |
| Deploy | Vercel CLI từ thư mục máy | Vercel CLI từ thư mục máy (`vercel` = preview, `vercel --prod` = production) |

**Việc đầu tiên khi bắt đầu:** kiểm tra hai thư mục trên máy có phải git clone của đúng repo và đúng nhánh không (`git remote -v`, `git status`, `git log -1`). Thư mục VSH trước đây được cập nhật bằng cách **tải ZIP rồi chép đè**, nên có thể **không phải git repo**. Nếu vậy, đề xuất cách chuyển sang git clone nhưng **giữ nguyên** những thứ chỉ có trên máy: `.vercel`, `.env.local`, `api`, `words_en.json`, `package.json`, `package-lock.json`, `node_modules`. Hỏi tôi trước khi xóa hay di chuyển bất cứ gì.

---

## 1. Luật chung (áp dụng cả hai site)

- **Không deploy production** (`vercel --prod`) khi tôi chưa nói rõ "deploy production". Luôn deploy preview (`vercel`) và QA trên URL preview trước.
- **Không chạy `vercel git connect`.** Thư mục VSH trên máy có những phần không nằm trong repo; nếu nối Git, chúng sẽ biến mất khỏi site.
- **Không sửa `vercel.json`** nếu tôi chưa đồng ý.
- **Nội dung y khoa / thú y:** chỉ người duyệt (con người) được ký. AI không bao giờ tự đặt `verified`, `true` hay ngày duyệt. Không đổi "Last reviewed" khi chưa có chữ ký.
- **Không bịa trích dẫn.** Nguồn chưa xác minh thì ghi rõ là chưa xác minh.
- Trước khi xóa hoặc ghi đè: xem đúng mục tiêu trước. Mọi lệnh chép file có biến đường dẫn phải **kiểm tra biến không rỗng**. Đã từng có sự cố `$src` rỗng làm lệnh chép cả ổ G: vào thư mục site.
- Không công bố thông tin liên hệ cá nhân, ngày sinh hay ảnh chụp giấy chứng nhận của người duyệt.
- Commit kèm `-c user.name="chinh Hoang" -c user.email="chinhhq83@gmail.com"`.

---

## 2. VSH — vshdongyduoc.org

### 2.1 Cấu trúc
- `scripts/build_site.py` sinh mọi trang chính, hub và trang công cụ, kèm `sitemap.xml`. Chạy: `python scripts/build_site.py .`
- CSS chung: `assets/vsh.css`. CSS công cụ: `cong-cu/assets/tools.css`.
- Các bài trong `kien-thuc/`, `ban-tin/` là HTML tĩnh có nav viết sẵn (CSS riêng: `kien-thuc/kb.css`, `ban-tin/article.css`, `news.css`).
- Vercel: `cleanUrls: true`, `trailingSlash: false`. `.vercelignore` loại `scripts`, `README.md`, `cong-cu/tests`, `cong-cu/*.md`, `_backup`, `*.zip`, `form-update`, `.env*`.
- Analytics: `analytics.js` chỉ nạp Vercel Insights để đếm lượt xem trang. **Không gửi sự kiện của công cụ.**

### 2.2 Bộ công cụ tự đánh giá `/cong-cu`

Hiến pháp của bộ công cụ (vi phạm là hỏng):
- không chẩn đoán ("bạn bị/mắc…");
- không bán hàng trên trang công cụ: không `/san-pham`, không tên thực phẩm bảo vệ sức khỏe, không "liệu trình", không "mua";
- dữ liệu chỉ nằm trên máy người dùng: không POST, không thu email, **không thu PII** (tôi đã quyết định bỏ hẳn việc thu email);
- kết quả gồm: mức trên thang đã công bố, việc nên làm tiếp, và bản tóm tắt mang đi khám;
- không đưa nội dung Đông y vào kết quả BMI/FINDRISC;
- tham chiếu pháp lý: Nghị định 15/2018/NĐ-CP.

| # | Công cụ | URL | Trạng thái |
|---|---|---|---|
| 03 | BMI + vòng eo chuẩn châu Á | `/cong-cu/bmi-vong-eo-chau-a` | Production |
| 02 | ModAsian FINDRISC | `/cong-cu/nguy-co-dai-thao-duong-findrisc` | Production (bản vá copy đã lên) |
| 04 | 5 tiêu chí chuyển hóa | `/cong-cu/hoi-chung-chuyen-hoa` | Production, **chữ chưa ký** |
| 05 | FIB-4 | `/cong-cu/fib-4` | Production, **chữ chưa ký** |
| 06 | Sức khỏe nướu (CDC/AAP) | `/cong-cu/suc-khoe-nuou` | Production, **chữ chưa ký** |
| 07 | Fitzpatrick | `/cong-cu/fitzpatrick` | Production, **chữ chưa ký** |
| 01 | Thể chất Đông y (CCMQ) | `/cong-cu/tu-danh-gia-the-chat-dong-y` | **Chưa lên production**, bài hỏi khóa |

- Logic thuần nằm ở `cong-cu/assets/*.js`; giao diện ở `tools.js`.
- Test: `node cong-cu/tests/run-tests.js --html .`
- Hồ sơ duyệt: `cong-cu/HO-SO-DUYET.md`, `cong-cu/GOI-DUYET-02-07.md`. Đã ghi nhận rằng bản vá 02 và các công cụ 04–07 lên production **trước khi ký**.

### 2.3 Công cụ 01 — trạng thái quan trọng
- Cổng khóa nằm ở `cong-cu/assets/tool01/config.js`. `publicAssessmentEnabled` được suy ra từ `RIGHTS_APPROVED && MEDICAL_CONTENT_REVIEWED`.
- `build_site.py` đọc cổng này: khi khóa thì trang `noindex,follow` và không có trong sitemap; khi mở thì tự chuyển sang `index,follow` và thêm vào sitemap.
- **Commit `a02e2c1` (tôi tự sửa trên GitHub) đã đổi cả hai cờ thành `true`, NHƯNG CHƯA ĐƯỢC BUILD LẠI.** Cần xử lý trước khi build hoặc deploy:
  1. `questionnaire.js` vẫn **rỗng** (`ITEMS: []`, `licensed: false`). Nếu build lúc này, trang sẽ được index trong khi vẫn hiện thông báo khóa. Cần tôi gửi **nguyên văn 60 câu** của bản tiếng Việt được cấp phép, kèm cách chia câu theo thể, các câu tính điểm ngược và thang trả lời. **Không tự viết, dịch hay tìm câu hỏi trên mạng.**
  2. `medicalReviewDate` đang ghi tên cơ quan ("Vietnam Academy of Traditional Medicine") thay vì ngày, nên hỏi tôi ngày thật.
  3. `rightsApprovedBy: "Professor Wan/China Association of Chinese Medicine"`: cần xác nhận có phải "Wang Qi (Vương Kỳ)" không, và đã có quyền dùng **bản tiếng Việt** (nhóm thẩm định 2022) chưa.
  4. Ghi chú cạnh hai cờ vẫn ghi "CHƯA có", cần sửa cho khớp.
  5. `cong-cu/tests/tool01-tests.js` đang khẳng định cả hai cờ là `false`, nên sẽ báo lỗi. Khi mở thật, cập nhật test cho đúng trạng thái và thêm ca vàng tính tay từ bộ câu hỏi thật.
  6. Mục "Nguồn khoa học" cần trích dẫn thật (bảng hỏi gốc, nghiên cứu thẩm định bản tiếng Việt, tài liệu lối sống).
  7. Checklist: `cong-cu/TOOL01-RELEASE-CHECKLIST.md`.
- **Đề xuất:** nếu chưa có bộ câu hỏi ngay, đổi cả hai cờ về `false`.
- Phân loại công cụ 01:
  - Bình hòa có 3 mức loại trừ nhau: definite / basic / no.
  - **Không chọn nhóm "trội"**: liệt kê mọi nhóm đạt ngưỡng theo thứ tự cố định.
  - Không nối thể chất với bệnh. Không thảo dược, bài thuốc hay sản phẩm.
  - Chế độ thử (câu giả) chỉ chạy ở `localhost` với `?demo=1`.
- Test: `node cong-cu/tests/tool01-tests.js --html .`

### 2.4 Việc khác còn tồn đọng (VSH)
- Địa chỉ cũ `/cong-cu/the-chat-dong-y` chỉ chuyển bằng thẻ meta refresh, chưa phải 301 (muốn 301 phải sửa `vercel.json`, cần tôi đồng ý).
- Commit `f136614` đã sửa tương phản (eyebrow `#8c6521`, vòng focus `#b1802a`) nhưng **chưa lên production**.
- Chưa có lần QA nào trên URL preview thật cho công cụ 01. Cần deploy preview, rồi kiểm tra:
  - trang khóa hoặc mở đúng theo cờ;
  - thẻ robots và sitemap;
  - thêm `?demo=1` không mở được bài hỏi;
  - `/cong-cu/tests/...` trả 404;
  - không có request gửi dữ liệu, không lưu gì vào bộ nhớ trình duyệt.
- Thư mục `song-ngu-cho-be` trên máy: tôi muốn xóa. Lần deploy production kế tiếp sẽ làm `/song-ngu-cho-be` thành 404.
- Thư mục thừa `$RECYCLE.BIN` (chép nhầm vào thư mục site): kiểm tra đã xóa chưa (`Test-Path -LiteralPath '.\$RECYCLE.BIN'` phải ra False) **trước bất kỳ lần deploy nào**.

---

## 3. DSF — dogsupplementfacts.com

### 3.1 Cấu trúc và luật riêng
- Astro 7. Lệnh:

  | Việc | Lệnh |
  |---|---|
  | Chạy thử trên máy | `npm run dev` |
  | Build | `npm run build` |
  | Kiểm tra | `npm run check` |
  | Test screener | `npm run test:screener` (26 kiểm tra) |
  | Test BCS | `npm run test:bcs` (30 kiểm tra) |
  | Ký duyệt | `npm run screener:approve`, `npm run bcs:approve`, `npm run dose:approve` |

- `src/site.config.mjs`:
  - `SITE_URL` mặc định là chữ giữ chỗ `https://NEW-DOMAIN.com`. **Không bao giờ commit domain thật vào đây**; truyền domain thật qua biến môi trường khi build (`SITE_URL=...`).
  - `GA4_ID = ""`: đang chờ tôi cung cấp mã GA4.
- DSF phải **độc lập thương hiệu** với Viện: không nhắc VSH, không link sang site VSH.
- Tài liệu định hướng: `01-STRATEGY-COMPASS.md`, `BUILD-LOG.md`, `CONTENT-ISSUES.md`, `UPDATES-ROUTINE.md`, `data-source/*`.
- Trọng tâm hiện tại: **Dog Health Screener** và **Body Condition Score (BCS)**. **Không** đầu tư thêm vào phần tính liều (dose), vì dữ liệu khó thu thập.

### 3.2 Trạng thái các cổng duyệt (người duyệt: TS. Hoàng Quốc Chính)

| Dữ liệu | Trạng thái |
|---|---|
| `src/data/screener-branches.json` | 14 dấu hiệu `pending_human_review`. Gói duyệt: `data-source/SCREENER-REVIEW-PACKET.md` |
| `src/data/bcs-review.json` | `mcs` (điểm khối cơ) và `overweight-estimate` đang `pending_human_review`. Gói duyệt: `data-source/BCS-REVIEW-PACKET.md` (nguồn ước tính thừa cân: AAHA 2014) |
| `src/data/dose-review.json` | 3 `verified`, 1 `pending_human_review`. Gói duyệt: `data-source/DOSE-REVIEW-PACKET.md` |

Báo cáo tình trạng 2 công cụ DSF: https://claude.ai/code/artifact/ff357b68-316d-481f-88bd-78b7c923ab42

### 3.3 Đang chờ tôi
- Deploy DSF bản mới nhất của nhánh `data-sync-2026-09-27`.
- Ký các gói duyệt screener và BCS (và liều còn lại).
- Cung cấp mã GA4.

---

## 4. Cách làm việc tôi mong muốn
- Mỗi việc: đọc code trước, sửa tối thiểu, chạy test, rồi báo lại ngắn gọn bằng tiếng Việt: đã làm gì, chưa làm gì, cần tôi làm gì.
- Với việc rủi ro (deploy, xóa file, đổi cờ, đổi cấu hình): đề xuất trước, đợi tôi đồng ý.
- Khi đưa lệnh PowerShell: ghi rõ chạy ở thư mục nào và kết quả đúng phải trông thế nào.

**Việc đầu tiên tôi muốn làm:** kiểm tra hai thư mục trên máy (git hay chưa, đúng nhánh chưa, có `$RECYCLE.BIN` hoặc file lạ không), rồi báo tôi tình trạng trước khi làm gì khác.
