# Công cụ 01 — Checklist phát hành bài tự đánh giá thể chất Đông y

Trang: `/cong-cu/tu-danh-gia-the-chat-dong-y`. Cổng nằm ở `cong-cu/assets/tool01/config.js`:

```
RIGHTS_APPROVED = false
MEDICAL_CONTENT_REVIEWED = false
publicAssessmentEnabled = RIGHTS_APPROVED && MEDICAL_CONTENT_REVIEWED   // suy ra, không đặt tay
```

Cổng này cũng quyết định SEO: khi còn khóa, `scripts/build_site.py` đọc `config.js`, đặt trang `noindex,follow` và không đưa vào `sitemap.xml`. Khi cả hai giá trị là `true`, lần build sau tự chuyển sang `index,follow` và thêm URL vào sitemap (không cần sửa chỗ khác).

Chỉ con người được đổi hai giá trị trên, và chỉ sau khi các ô liên quan dưới đây đã có bằng chứng lưu trong hồ sơ. Không suy ra quyền sử dụng từ việc bài báo đã công bố hay có giấy phép open-access.

## Quyền sử dụng
- [ ] Exact questionnaire version identified
- [ ] Rights holder identified
- [ ] Permission to reproduce questionnaire online documented
- [ ] Permission covers Vietnamese version
- [ ] Citation requirements recorded

## Dữ liệu bộ câu hỏi và tính điểm
- [ ] Licensed questionnaire text inserted unchanged (vào `ITEMS`, `SCALE` của `questionnaire.js`, đặt `licensed: true`)
- [ ] Item-to-constitution mapping verified
- [ ] Reverse-scored items verified
- [ ] Scoring thresholds verified (sửa trong `config.js` → `THRESHOLDS` nếu phiên bản được cấp phép khác)
- [ ] Golden tests passed (`node cong-cu/tests/tool01-tests.js --html .`, thêm ca vàng tính tay từ bộ câu hỏi thật)

## Nội dung y khoa
- [ ] Medical result copy reviewed (`results.js`: 9 phần giới thiệu, câu kết quả)
- [ ] Lifestyle guidance reviewed (`results.js`: gợi ý lối sống)
- [ ] Nguồn khoa học trên trang được điền đủ và xác minh (bảng hỏi gốc, nghiên cứu thẩm định bản tiếng Việt, tài liệu lối sống)

## Quyền riêng tư, pháp lý, vận hành
- [ ] Privacy implementation reviewed
- [ ] Analytics verified not to receive health data
- [ ] Regulatory/device-status review completed
- [ ] RIGHTS_APPROVED set by human
- [ ] MEDICAL_CONTENT_REVIEWED set by human
- [ ] Sau khi mở cổng: build lại, xác nhận trang `index,follow` và có trong sitemap
- [ ] Production QA passed

## Ghi nhận người thực hiện (điền tay)

| Mục | Người | Ngày | Bằng chứng / ghi chú |
|---|---|---|---|
| Quyền sử dụng | | | |
| Duyệt y khoa | | | |
| Pháp lý / thiết bị y tế | | | |
| QA production | | | |

## Chạy thử trên máy (không cần quyền)

Chạy site ở `localhost`, mở `/cong-cu/tu-danh-gia-the-chat-dong-y?demo=1`. Trang nạp 60 câu giả từ `cong-cu/tests/fixtures/` (TEST FIXTURES — NOT CCMQ QUESTION TEXT). Thư mục `cong-cu/tests` không được deploy, và chế độ thử chỉ bật trên `localhost` / `127.0.0.1`, nên trên site thật luôn hiện thông báo khóa.
