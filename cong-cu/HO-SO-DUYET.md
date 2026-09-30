# Hồ sơ duyệt nội dung — công cụ /cong-cu

Mỗi lần chữ y khoa trên công cụ đổi, thêm một dòng ở bảng dưới, ghi commit và mã băm tệp. Muốn đối chiếu chữ trên site với chữ đã ký: `git show <commit>:<tệp> | sha256sum` rồi so với cột mã băm.

## Bản chờ ký: commit `82bccfe` (82bccfeb1c4cc9b1e93b4f14e2e3da155a00c3df)

Nhánh `claude/laughing-goldberg-qf8odi`. Chưa lên production.

| Tệp | sha256 tại commit này |
|---|---|
| `cong-cu/bmi-vong-eo-chau-a.html` | `c8c682761f4402c5…` |
| `cong-cu/nguy-co-dai-thao-duong-findrisc.html` | `b8669d4f3ff8fc63…` |
| `cong-cu/assets/bmi.js` | `7117ce12ba625681…` |
| `cong-cu/assets/findrisc.js` | `87b50ab676758bfb…` |
| `cong-cu/assets/tools.js` | `34e8a79ae49daec9…` |

Nội dung bản vá so với `c83d5ab`: citation Doan L… J Multidiscip Healthc 2023;16:439–449 (doi:10.2147/JMDH.S398455); 8 câu FINDRISC theo bản khóa tiếng Việt; disclaimer riêng của công cụ 02; 3 câu FAQ của công cụ 02; nhãn trong bản tóm tắt khớp câu hỏi mới. Logic tính điểm không đổi.

### Người duyệt ký (điền tay, AI không điền)

- [ ] Mục 14 hồ sơ VSH-TOOL-03 — người ký: ______________ ngày: __________
- [ ] Đồng ý copy công cụ 02 bản vá (commit `82bccfe`) — người ký: ______________ ngày: __________
- [ ] Đã bấm lại trên preview Vercel: ca 58 kg/158 cm → 23,2 · thừa cân · 46,2–57,2 kg; ca FINDRISC 14/26 · nguy cơ trung bình — URL preview: ______________

Chỉ chạy `vercel --prod` sau khi đủ 3 ô trên.

> **Ghi nhận 30/09/2026:** bản `4111107` (gồm bản vá 02 và công cụ 04–07) đã được đưa lên production trước khi ký (deploy `vshdongyduoc-rol44l32j-chinh-hoangs-projects.vercel.app`). Người duyệt chọn giữ trên site và duyệt ngay (phương án A) theo `cong-cu/GOI-DUYET-02-07.md`.

## Bản chờ ký: công cụ 04–07, commit `94c8914`

**Đã lên production 30/09/2026 trước khi ký** (xem ghi nhận ở trên). Chữ y khoa của 4 công cụ này do Claude soạn từ nguồn đã ghi trên trang; **chưa đối chiếu được nguyên văn nguồn** vì mạng phiên làm việc chặn các trang tạp chí. Người duyệt cần kiểm tra:

- 04: mốc 5 tiêu chí theo Alberti 2009 (Circulation 120:1640–1645); cách tính "đang dùng thuốc" là đạt; câu "có từ 3/5 tiêu chí là mốc bác sĩ dùng khi xác định hội chứng chuyển hóa".
- 05: công thức và mốc 1,30 / 2,67 (Shah 2009), mốc 2,0 từ 65 tuổi (McPherson 2017), câu về tính lại sau 1–3 năm (AASLD 2023); số trang các trích dẫn.
- 06: bản dịch 8 câu CDC/AAP (Eke 2013, J Dent Res 92:1041–1047; Eke 2009, J Periodontol 80:1371–1379); câu 9–10 do Viện bổ sung, không thuộc bộ gốc; quyết định không tính điểm.
- 07: bản dịch mô tả loại I–VI (Fitzpatrick 1988); lời khuyên chống nắng (WHO UV Index 2002, AAD); câu dấu hiệu nốt ruồi do Viện bổ sung.

Đối chiếu chữ trên site: `git diff --stat 94c8914 HEAD -- cong-cu/hoi-chung-chuyen-hoa.html cong-cu/fib-4.html cong-cu/suc-khoe-nuou.html cong-cu/fitzpatrick.html cong-cu/assets` phải trống.

- [ ] Đồng ý chữ công cụ 04 — người ký: ______________ ngày: __________
- [ ] Đồng ý chữ công cụ 05 — người ký: ______________ ngày: __________
- [ ] Đồng ý chữ công cụ 06 — người ký: ______________ ngày: __________
- [ ] Đồng ý chữ công cụ 07 — người ký: ______________ ngày: __________
- [ ] Đã bấm lại trên preview các ca [tay] trong `TEST-04-07.md` — URL preview: ______________
