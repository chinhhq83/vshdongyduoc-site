# TEST — Công cụ 02: ModAsian FINDRISC

Tự động: `node cong-cu/tests/run-tests.js --html .`. [auto] = có trong script, [tay] = bấm trên trình duyệt.

## Điểm

| Ca | Nhập | Mong đợi |
|---|---|---|
| Tối thiểu [auto] | 40 tuổi, BMI < 23, eo dưới mốc, có vận động, ăn rau mọi ngày, không thuốc HA, không đường huyết cao, không người thân | 0 điểm · "Nguy cơ thấp theo thang FINDRISC" |
| Tối đa [auto] | ≥ 65 tuổi, BMI ≥ 27,5, eo ≥ mốc, không vận động, không ăn rau mọi ngày, có thuốc HA, có đường huyết cao, người thân gần | 26 điểm |
| Tuổi [auto] | 44 / 45 / 54 / 55 / 64 / 65 | 0 / 2 / 2 / 3 / 3 / 4 |
| BMI [auto] | 22,9 / 23 / 27,4 / 27,5 | 0 / 1 / 1 / 3 |
| Vòng eo [auto] | nam 89,9 / 90 · nữ 79,9 / 80 | 0 / 4 · 0 / 4 |
| Thiếu eo [auto][tay] | bỏ trống | Vẫn tính, eo = 0 điểm, hiện "Điểm vòng eo chưa có — kết quả có thể thấp hơn thực tế." |
| Người thân [auto] | xa / gần | 3 / 5 |
| Biên nhóm [auto] | 6/7 · 11/12 · 14/15 · 20/21 | thấp/hơi tăng · hơi tăng/trung bình · trung bình/cao · cao/rất cao |
| Đã chẩn đoán [auto][tay] | tích ô | Không tính, "Nếu bạn đã có chẩn đoán, hãy theo bác sĩ đang điều trị; công cụ này dành cho người chưa được chẩn đoán." |
| Tuổi 17 [auto] | 17 | Không tính |
| Thiếu câu trả lời [tay] | bỏ một câu Có/Không hoặc Chưa/Rồi | Báo "Vui lòng trả lời đủ các câu hỏi." |
| Ca Playwright [tay] | Nữ 50 tuổi, 158 cm/58 kg (BMI 23,2), eo 82, không vận động, ăn rau, không thuốc HA, không đường huyết cao, người thân gần | 14/26 · Nguy cơ trung bình (2+1+4+2+0+0+0+5). Bỏ eo → 10/26 + ghi chú |

## Chữ khóa (bản vá 30/09/2026) [auto]

- 8 câu đánh số 1–8 theo bản khóa tiếng Việt (bám bản tiếng Anh FINDRISC). Câu 2 không hỏi bằng lời, chỉ ghi "BMI được tính từ chiều cao và cân nặng bạn nhập".
- Câu 3 có dòng: bản châu Âu 3 mốc (94/102), bản ModAsian 2 mốc châu Á.
- Câu 6 giữ "thuốc huyết áp thường xuyên". Câu 8 giữ "(type 1 hoặc type 2)".
- Citation Doan L… J Multidiscip Healthc 2023;16:439–449, doi:10.2147/JMDH.S398455. Không còn "Doan et al.".
- Disclaimer 02 là bản riêng (mốc 12 và 15 điểm), không chép từ 03.
- FAQ 3 câu: chẩn đoán? / vì sao không 25 và 94/102? / thiếu vòng eo?
- Kiểm tra "không có chữ mua" loại trừ đúng câu khóa "Không tự mua thuốc hạ đường huyết."

## Cầu nối và giao diện ([tay])

- Từ công cụ 03 bấm nút chính → trang 02 điền sẵn giới tính, tuổi, cao, nặng, eo. Hiện dòng "Đã điền sẵn…" + link quay lại. Sửa được mọi ô.
- Mở trực tiếp trang 02 (tab mới, chưa qua 03) → không có dòng cầu nối, form trống.
- Luôn hiện câu: "Đây là thang sàng lọc dựa trên câu hỏi, không phải xét nghiệm máu và không phải chẩn đoán đái tháo đường."
- Tỷ lệ tham chiếu kèm câu "…không phải xác suất cá nhân của bạn."
- Màu: 12–20 điểm hổ phách, > 20 đỏ.
- Tóm tắt VSH-02 có điểm thành phần. In 1 trang. Lịch sử `vsh.tool.findrisc.history` tối đa 12.
- Không POST. Không có `/san-pham`, "mua", tên sản phẩm. Đúng 1 H1, FAQ JSON-LD.
