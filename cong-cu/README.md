# Công cụ tự đánh giá sức khỏe (/cong-cu)

Tĩnh, không backend. Số đo chỉ nằm trong trình duyệt người dùng. Trang không gửi (POST) dữ liệu sức khỏe đi đâu. Analytics chỉ đếm lượt xem trang, không gửi sự kiện của công cụ.

## Tệp

| Tệp | Vai trò |
|---|---|
| `scripts/build_site.py` (mục "CÔNG CỤ TỰ ĐÁNH GIÁ") | Sinh `cong-cu.html` (hub), `cong-cu/bmi-vong-eo-chau-a.html` (03), `cong-cu/nguy-co-dai-thao-duong-findrisc.html` (02), `cong-cu/the-chat-dong-y.html` (01, noindex). Nội dung y khoa khóa nằm ở đây và trong 2 file logic. |
| `cong-cu/assets/bmi.js` | Logic thuần công cụ 03 (`window.VSHBmi` / `module.exports`). |
| `cong-cu/assets/findrisc.js` | Logic thuần công cụ 02 (`window.VSHFindrisc`). |
| `cong-cu/assets/mets.js`, `fib4.js`, `nuou.js`, `fitz.js` | Logic thuần công cụ 04–07. Mỗi file có `read(form)`, `evaluate(a)`, `summary(a, r)`. |
| `cong-cu/assets/tools.js` | Nối DOM: đọc form, hiện kết quả, tóm tắt, lịch sử, cầu nối. Chọn công cụ theo `<body data-tool="bmi|findrisc">`. |
| `cong-cu/assets/tools.css` | Giao diện công cụ + CSS in (chỉ in bản tóm tắt). |
| `cong-cu/tests/run-tests.js` | Kiểm tra logic + quét HTML. |

Sau khi sửa: `python3 scripts/build_site.py .` rồi `node cong-cu/tests/run-tests.js --html .` (phải "Tất cả đạt").

## Gắn vào site

- Trang công cụ dùng `page(..., tool=True)`: nav, chân trang và dòng pháp lý **không** có link `/san-pham` hay câu về sản phẩm (hiến pháp: không bán hàng trên trang kết quả). Các trang khác của site giữ nguyên.
- Nav chung có mục "Công cụ" → `/cong-cu`. Chân trang cột Kiến thức có "Công cụ tự đánh giá".
- Sitemap có `/cong-cu`, `/cong-cu/bmi-vong-eo-chau-a`, `/cong-cu/nguy-co-dai-thao-duong-findrisc`. Trang công cụ 01 để `noindex` và không vào sitemap cho tới khi mở.
- URL theo quy ước site (Vercel `cleanUrls`, không dấu `/` cuối): `/cong-cu/<slug>`.

## Khóa lưu trữ (chỉ trên máy người dùng)

| Khóa | Nơi | Nội dung |
|---|---|---|
| `vsh.tool.bmi.history` | localStorage | Tối đa 12 lần: ngày, BMI, nhóm, vòng eo. Chỉ lưu khi bấm "Lưu kết quả trên máy này". |
| `vsh.tool.findrisc.history` | localStorage | Tối đa 12 lần: ngày, điểm, nhóm. |
| `vsh.tool.mets.history`, `vsh.tool.fib4.history`, `vsh.tool.nuou.history`, `vsh.tool.fitz.history` | localStorage | Tối đa 12 lần mỗi công cụ. |
| `vsh.tool.bridge` | sessionStorage | Cầu nối 03 → 02 (xem dưới). Mất khi đóng tab. |

Nút "Xóa lịch sử" xóa khóa history của công cụ đó. Không lưu tên, số điện thoại, email hay dữ liệu định danh nào.

## Cầu nối 03 → 02

Mỗi lần bấm tính ở công cụ 03, `tools.js` ghi `sessionStorage["vsh.tool.bridge"]`:

```json
{"from":"bmi","sex":"nu","age":50,"heightCm":158,"weightKg":58,"bmi":23.2,"waistCm":82}
```

Công cụ 02 đọc khóa này khi mở trang, điền sẵn giới tính, tuổi, chiều cao, cân nặng, vòng eo, hiện dòng "Đã điền sẵn số đo…" kèm nút quay lại. Người dùng sửa được mọi ô. BMI ở 02 luôn tính lại từ chiều cao/cân nặng đang có trong form.

## Tóm tắt, in, tải về

- `#print-summary` là các dòng `[data-line]`. "Sao chép tóm tắt" ghép text các dòng này, cách nhau bằng xuống dòng. Nếu trình duyệt chặn clipboard thì hiện ô văn bản để chép tay.
- In (nút In hoặc Ctrl+P): sự kiện `beforeprint` chép tóm tắt vào `#print-root` ngay dưới `<body>`. CSS in ẩn mọi thứ khác. Muốn PDF thì chọn "Lưu thành PDF" trong hộp thoại in.
- "Tải bản HTML": tạo file `tom-tat-vsh-03-DD-MM-YYYY.html` ngay trong trình duyệt (Blob). Không có máy chủ.

## Cố ý chưa làm

- PDF tạo ở máy chủ, gửi Zalo/email, tài khoản, đồng bộ nhiều máy, CMS.
- Công cụ 01 (CCMQ 9 thể): chỉ trang chờ. Không đưa 60 câu hỏi lên cho tới khi có xác nhận quyền sử dụng.
- Sự kiện analytics cho công cụ.
