# TEST — Công cụ 03: BMI và vòng eo chuẩn châu Á

Tự động: `node cong-cu/tests/run-tests.js --html .`. Các ca dưới đây đã có trong script (ghi [auto]) hoặc cần bấm tay trên trình duyệt ([tay]).

## Tính toán

| Ca | Nhập | Mong đợi |
|---|---|---|
| Ca chuẩn [auto] | Nữ, 158 cm, 58 kg | BMI 23,2 · "Thừa cân theo ngưỡng châu Á" |
| Biên nhóm [auto] | BMI 18,4 / 18,5 / 22,9 / 23,0 / 24,9 / 25,0 / 29,9 / 30,0 | Thiếu cân / Thường gặp / Thường gặp / Thừa cân / Thừa cân / Béo phì I / Béo phì I / Béo phì II |
| Làm tròn [auto] | 22,95 → 23,0 · 22,94 → 22,9 | 0,05 làm tròn lên, nhóm theo số đã làm tròn |
| Eo nam [auto] | 89,9 / 90,0 cm | chưa đạt / đạt mốc |
| Eo nữ [auto] | 79,9 / 80,0 cm | chưa đạt / đạt mốc |
| Không nhập eo [auto] | bỏ trống | Câu nhắc "chưa nhập vòng eo…", vẫn có kết quả BMI |
| Dòng cơ/mỡ [auto] | BMI ≥ 23 / < 23 | Có / không có |
| Khoảng cân tham chiếu [auto] | 158 cm | 46,2 – 57,2 kg (18,5 × h² và 22,9 × h²) |
| Tuổi 17 [auto] | tuổi 17 | Không tính, "Công cụ này dành cho người từ 18 tuổi." |
| Mang thai [auto][tay] | tích "đang mang thai" | Không tính, hiện lời nhắc dùng số đo trước khi có thai và hỏi bác sĩ sản, khối kết quả ẩn |
| Ngoài khoảng [auto] | cao 119 cm | Không tính, báo nhập lại |

## Giao diện ([tay], đã chạy Playwright 390 px ngày 30/09/2026)

- Màu: BMI ≥ 25 → viền đỏ. Thừa cân, thiếu cân, hoặc eo vượt mốc → hổ phách. Còn lại → xanh.
- Nút chính "Tính nguy cơ đái tháo đường 10 năm (ModAsian FINDRISC)" mở công cụ 02 với số đo điền sẵn.
- "Sao chép tóm tắt" → clipboard có đủ các dòng: tiêu đề, Viện · VSH-03, ngày, số liệu, kết quả, câu "Người dùng tự nhập…", "Ghi chú của bác sĩ".
- In → chỉ 1 trang tóm tắt + 4 dòng ghi chú.
- "Lưu kết quả" → 1 dòng trong bảng lịch sử, khóa `vsh.tool.bmi.history`. "Xóa lịch sử" → bảng ẩn.
- Tắt JavaScript → form ẩn, hiện thông báo noscript.
- 390 px: không cuộn ngang. Nút ≥ 44 px.
- Không có yêu cầu POST nào khi dùng công cụ.

## Nội dung ([auto] + [tay])

- Không có trong copy kết quả: bạn bị, bạn mắc, chẩn đoán béo phì, hội chứng chuyển hóa, tiểu đường, gan nhiễm mỡ, chữa được, hết bệnh, đốt mỡ, thải độc, liệu trình, mua ngay, `/san-pham`, tên sản phẩm của Viện, tên thể Đông y.
- Nguồn + ngày + disclaimer "…không thay thế khám bệnh…" nằm ngay dưới kết quả.
- Trang có đúng 1 H1, FAQ JSON-LD 3 câu.
