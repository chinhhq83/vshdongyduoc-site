# Kế hoạch vận hành bản tin VSH an toàn

Phiên bản: 1.2  
Ngày áp dụng: 14/08/2026  
Phạm vi: Bản tin sức khỏe và Bản tin thời sự trên vshdongyduoc.org

## 1. Mục tiêu

- Xuất bản bài phân tích nguyên bản của VSH, không vận hành như một trang đăng lại báo chí.
- Dùng dữ liệu n8n/Google Sheet để phát hiện chủ đề, không dùng làm nội dung xuất bản trực tiếp.
- Bảo đảm khả năng truy nguyên nguồn, kiểm chứng dữ kiện, quyền sử dụng hình ảnh và phê duyệt của con người.
- Viết rõ ràng cho người đọc, công cụ tìm kiếm và hệ thống trả lời AI mà không tạo nội dung hàng loạt, trùng lặp.

## 2. Nguyên tắc bắt buộc

1. Không sao chép tiêu đề, sapo, cấu trúc bài, đoạn văn, ảnh, đồ họa hoặc video của báo chí khi chưa có quyền sử dụng.
2. Không xuất bản một bài chỉ bằng cách viết lại hoặc tóm tắt một bài báo duy nhất.
3. Mỗi nhận định quan trọng phải dựa trên ít nhất hai nguồn độc lập; ưu tiên một nguồn cấp 1.
4. Chỉ trích nguyên văn khi cần để bình luận, dùng phần tối thiểu cần thiết, đặt trong ngoặc kép và ghi tác giả, cơ quan, liên kết.
5. Phân biệt rõ dữ kiện, phân tích của VSH, tác động dự kiến và khuyến nghị.
6. Chỉ được tự động xuất bản theo chế độ bán tự động tại mục 6A; ngoài phạm vi đó, hệ thống phải giữ bản nháp cho tới khi người phụ trách duyệt.
7. Mỗi visual phải mới, có hồ sơ nguồn/quyền sử dụng; không lấy ảnh báo làm ảnh minh họa.
8. Không đưa chẩn đoán hoặc lời hứa điều trị cá nhân; bài sức khỏe phải có cảnh báo giới hạn và chỉ dẫn tìm hỗ trợ chuyên môn khi phù hợp.

## 3. Phân tầng nguồn

### Nguồn cấp 1 — ưu tiên

- Văn bản và dữ liệu của cơ quan nhà nước.
- WHO, cơ quan y tế công cộng, tổ chức quốc tế liên chính phủ.
- Bài báo khoa học gốc, tổng quan hệ thống, hướng dẫn chuyên môn.
- Báo cáo, thông cáo hoặc dữ liệu chính thức của tổ chức là chủ thể của sự kiện.

### Nguồn cấp 2 — đối chiếu

- Cơ quan báo chí có giấy phép, hãng thông tấn và tạp chí chuyên ngành có quy trình biên tập.
- Chỉ dùng để phát hiện sự kiện, bổ sung bối cảnh và tìm nguồn cấp 1.

### Không dùng làm căn cứ duy nhất

- Bài đăng mạng xã hội, blog không rõ tác giả, nội dung tổng hợp lại, video ngắn và nội dung quảng cáo.
- Nguồn không ghi ngày, không dẫn dữ liệu gốc hoặc có xung đột lợi ích không được công bố.

## 3A. Nguyên tắc tuyển chọn chủ đề

### Mục tiêu tuyển chọn

- Không tối đa hóa số bài. Mặc định mỗi ngày xuất bản **0–1 bài cho mỗi nhóm** Bản tin sức khỏe hoặc Bản tin thời sự.
- Chỉ viết khi có một vấn đề đủ quan trọng, đủ nguồn và có thể chuyển thành hành động hữu ích.
- Dữ liệu crawler là “radar phát hiện tín hiệu”, không phải danh sách bài phải đăng.
- Chọn **vấn đề người đọc cần hiểu hoặc giải quyết**, không chọn một bài báo để tóm tắt.

### Bước 1 — gom tin thành cụm vấn đề

1. Loại trùng theo sự kiện, thực thể, thời gian và nội dung cốt lõi.
2. Gom các tin khác nhau vào cùng một cụm nếu chúng cùng phản ánh một vấn đề, nguyên nhân hoặc hệ quả.
3. Với mỗi cụm, ghi rõ:
   - Vấn đề trung tâm là gì?
   - Điều gì mới xảy ra hôm nay?
   - Ai bị ảnh hưởng?
   - Vì sao người đọc cần biết lúc này?
   - Có nguồn cấp 1 nào xác nhận?
   - Người đọc hoặc tổ chức có thể làm gì sau khi đọc?
4. Không xem số lượng bài lặp lại cùng một thông cáo là nhiều nguồn độc lập.

### Bước 2 — chấm điểm mức đáng đăng, tối đa 100 điểm

| Tiêu chí | Điểm tối đa | Câu hỏi đánh giá |
|---|---:|---|
| Tính thời sự và độ khẩn cấp | 15 | Vấn đề có diễn biến mới, hạn quyết định hoặc rủi ro cần hành động sớm không? |
| Quy mô người quan tâm | 15 | Vấn đề ảnh hưởng nhóm dân số lớn hoặc nhóm dễ tổn thương không? |
| Tác động sức khỏe, kinh tế, xã hội | 15 | Hậu quả có đáng kể đối với sức khỏe, chi phí, việc làm, gia đình hoặc dịch vụ công không? |
| Khả năng chuyển thành hành động | 20 | Có thể đưa ra việc làm cụ thể, an toàn và hữu ích ở cấp cá nhân, tổ chức hoặc chính sách không? |
| Độ mạnh và tính độc lập của nguồn | 15 | Có ít nhất hai nguồn độc lập và ít nhất một nguồn cấp 1 không? |
| Mức phù hợp với VSH | 10 | VSH có năng lực giải thích vấn đề theo góc nhìn sức khỏe, khoa học hoặc tác động xã hội không? |
| Giá trị mới của bản phân tích | 10 | VSH có thể kết nối dữ kiện, sửa hiểu lầm hoặc bổ sung khung hành động mà từng tin riêng lẻ chưa có không? |

### Tín hiệu cho thấy nhiều người thực sự quan tâm

Ưu tiên các tín hiệu sau, nhưng không dùng một tín hiệu riêng lẻ để quyết định:

- Cùng một vấn đề xuất hiện ở nhiều nguồn độc lập trong 24–72 giờ.
- Có thông báo, dữ liệu hoặc thay đổi chính sách mới từ cơ quan có thẩm quyền.
- Vấn đề ảnh hưởng trực tiếp đến sinh hoạt hằng ngày: thời tiết cực đoan, dịch bệnh, thuốc, thực phẩm, học đường, chi phí y tế, việc làm hoặc an sinh.
- Có câu hỏi tìm kiếm rõ ràng mà người đọc cần câu trả lời ngay: “có nguy hiểm không?”, “ai bị ảnh hưởng?”, “cần làm gì?”, “khi nào cần trợ giúp?”.
- Có khả năng người đọc hiểu sai, hoang mang hoặc thực hiện hành động có hại nếu chỉ đọc tiêu đề rời rạc.
- Khi có dữ liệu truy cập đáng tin cậy, có thể tham khảo xu hướng tìm kiếm và câu hỏi người dùng; không chạy theo từ khóa nếu nguồn yếu hoặc không có lợi ích công chúng.

### Ngưỡng quyết định

- **Từ 75 điểm:** có thể lập hồ sơ bài, nếu vượt toàn bộ cổng an toàn.
- **65–74 điểm:** theo dõi hoặc bổ sung nguồn; chỉ viết khi có lý do biên tập rõ ràng.
- **Dưới 65 điểm:** không đăng.
- Dù đủ điểm, vẫn **không đăng** nếu thiếu nguồn cấp 1 khi nguồn đó đáng lẽ phải tồn tại, không có hành động hữu ích, rủi ro pháp lý chưa giải quyết hoặc nội dung nằm ngoài năng lực VSH.
- Không bắt buộc có bài mỗi ngày. “Không có chủ đề đạt chuẩn” là một kết quả hợp lệ.

### Điểm trừ và dấu hiệu loại sớm

- Trừ 15 điểm nếu chủ đề chủ yếu dựa vào giật tít, người nổi tiếng hoặc tranh cãi mạng xã hội mà không có tác động công chúng rõ ràng.
- Trừ 15 điểm nếu nhiều bài chỉ sao chép cùng một nguồn hoặc thông cáo.
- Trừ 20 điểm nếu chưa thể phân biệt dữ kiện đã xác nhận với suy đoán.
- Loại ngay nội dung quảng cáo trá hình, tin đồn, xâm phạm đời tư, mô tả gây kỳ thị, hướng dẫn nguy hiểm hoặc tuyên bố điều trị không có bằng chứng.

## 3B. Nguyên tắc tổng hợp thành một bản tin hữu ích

- Mỗi bản tin có **một vấn đề trung tâm** và **một lời hứa giá trị**: sau khi đọc, người đọc hiểu gì hoặc làm được gì tốt hơn?
- Dùng nhiều nguồn để xây một hồ sơ dữ kiện, không xếp các bản tóm tắt rời rạc cạnh nhau.
- Kết nối thông tin theo chuỗi:

  `Diễn biến mới → nguyên nhân/bối cảnh → nhóm chịu ảnh hưởng → hậu quả → lựa chọn hành động → dấu hiệu cần theo dõi tiếp`.

- Các tin phụ chỉ được đưa vào nếu giúp giải thích nguyên nhân, quy mô, tác động hoặc giải pháp của vấn đề trung tâm.
- Mỗi khuyến nghị phải chỉ rõ:
  - Ai nên làm?
  - Làm việc gì?
  - Khi nào hoặc trong điều kiện nào?
  - Giới hạn, rủi ro hoặc khi nào cần chuyên gia?
- Nếu bằng chứng chỉ cho phép nêu lựa chọn hoặc điều cần theo dõi, không biến thành lời khuyên chắc chắn.
- Tối thiểu phải có một kết quả hữu ích: checklist, ngưỡng cảnh báo, cây quyết định, kế hoạch hành động, câu hỏi cần hỏi chuyên gia hoặc gợi ý ở cấp tổ chức/chính sách.
- Phần “điểm tin” chỉ là bối cảnh ngắn. Trọng tâm là bản tổng hợp nguyên bản và khả năng giúp người đọc ra quyết định tốt hơn.

## 4. Cấu trúc sản phẩm hằng ngày

### Bản tin tổng hợp ngày

- Tóm lược điều gì đã xảy ra bằng dữ kiện do VSH tự tổng hợp.
- Nêu 3–5 chuyển động đáng theo dõi, không tạo một thẻ sao chép cho từng bài báo.
- Có mục “Nguồn và thời điểm truy cập” ở cuối bài.

### Bài phân tích nổi bật

1. Vấn đề là gì?
2. Điều đã được xác nhận và điều chưa chắc chắn.
3. Vì sao vấn đề có ý nghĩa?
4. Tác động sức khỏe, kinh tế hoặc xã hội.
5. Ai có thể bị ảnh hưởng và mức độ bằng chứng.
6. Có thể làm gì ở cấp cá nhân, tổ chức và chính sách?
7. Điều cần theo dõi tiếp.
8. Nguồn, phương pháp và giới hạn.

## 5. Quy trình hằng ngày

1. 08:00 kiểm tra ngày cập nhật của hai Google Sheet.
2. Nếu thiếu dữ liệu, khởi động n8n và chạy đúng workflow `VSH_cào tin thời sự` hoặc `health_news_collector`.
3. Loại trùng, tin quảng cáo, nguồn không xác định và nội dung không có nguồn cấp 1 để đối chiếu.
4. Gom tin thành các cụm vấn đề; không coi mỗi đường dẫn là một chủ đề riêng.
5. Chấm từng cụm theo thang 100 điểm tại mục 3A và lưu bảng điểm cùng lý do chọn/không chọn.
6. Chỉ lập hồ sơ cho chủ đề đạt ngưỡng; hồ sơ gồm vấn đề trung tâm, diễn biến mới, nguồn cấp 1, nguồn đối chiếu, dữ kiện, mức chắc chắn, nhóm bị ảnh hưởng, chuỗi tác động, hành động hữu ích và rủi ro pháp lý.
7. Xác định trước “lời hứa giá trị” và sản phẩm hành động của bài; nếu không xác định được thì không viết.
8. Viết bản nháp mới từ hồ sơ dữ kiện; không đặt bài báo gốc cạnh cửa sổ viết để diễn đạt lại từng đoạn.
9. Tạo visual mới và ghi lại prompt, ngày tạo, người tạo và nguồn dữ liệu được thể hiện.
10. Chạy kiểm tra biên tập, y khoa, bản quyền, liên kết và SEO/AI visibility.
11. Người phụ trách chọn `Duyệt`, `Yêu cầu sửa` hoặc `Không đăng`.
12. Chỉ bản `Duyệt` mới được thêm vào website, sitemap và triển khai lên Vercel.

## 6. Cổng kiểm duyệt trước xuất bản

Quy trình dùng hai tầng bắt buộc:

1. Chạy `tools/legal_review_gate.py` để kiểm tra cứng. Kết quả `BLOCK` dừng quy trình ngay.
2. Gửi hồ sơ đạt kiểm tra cứng cho AI theo `tools/legal_review_agent_prompt.md` và ép đầu ra theo `tools/legal_review_schema.json`.
3. `BLOCK` hoặc `NEEDS_HUMAN_LEGAL_REVIEW` không được chuyển sang xuất bản.
4. `PASS_TO_EDITOR` chỉ được tự đổi thành `approved` nếu bài đáp ứng đầy đủ mục 6A; mọi trường hợp khác phải chuyển người phụ trách đọc và quyết định.
5. Lưu cả báo cáo kiểm tra cứng, báo cáo AI và quyết định của người duyệt cùng phiên bản bài viết.
6. Khi cần người dùng hành động, mở popup bằng `tools/show_vsh_review_popup.ps1` với đúng `Decision`, tiêu đề bài, tóm tắt và đường dẫn báo cáo. Đóng popup hoặc sao chép phản hồi không được tính là phê duyệt.

Một bài chỉ được xuất bản khi tất cả câu trả lời dưới đây là “Có”:

- Tiêu đề và nội dung là cách diễn đạt nguyên bản của VSH?
- Có ít nhất hai nguồn độc lập và ít nhất một nguồn cấp 1 khi nguồn đó tồn tại?
- Mọi số liệu, ngày tháng và tên riêng đã được đối chiếu?
- Trích dẫn nguyên văn là tối thiểu, đúng ngữ cảnh và có ghi nguồn?
- Không sử dụng ảnh, biểu đồ hoặc đồ họa của bên thứ ba khi chưa có quyền?
- Dữ kiện, suy luận và khuyến nghị được phân biệt rõ?
- Các tuyên bố sức khỏe phản ánh đúng mức độ bằng chứng và có cảnh báo phù hợp?
- Bài viết mang lại phân tích mới, không thay thế nhu cầu đọc bài báo nguồn?
- Liên kết nguồn trỏ trực tiếp tới tài liệu gốc và có ngày truy cập?
- Bản cuối đã được người chịu trách nhiệm duyệt, hoặc có hồ sơ chứng minh đủ toàn bộ điều kiện tự xuất bản tại mục 6A?

Nếu bất kỳ câu nào là “Không” hoặc “Chưa rõ”, bài ở trạng thái bản nháp.

## 6A. Chế độ bán tự động và quyền tự xuất bản

### Điều kiện bắt buộc để tự xuất bản

Một bài chỉ được tự xuất bản khi đồng thời đáp ứng tất cả điều kiện:

- Chủ đề đạt ít nhất 75/100 theo mục 3A và có bảng điểm được lưu.
- Thuộc nhóm rủi ro thấp, có lợi ích thực tế rõ và nằm trong chuyên môn biên tập của VSH.
- Có ít nhất hai nguồn độc lập; có ít nhất một nguồn cấp 1 khi nguồn đó tồn tại.
- Cổng kiểm tra cứng trả `READY_FOR_AI_REVIEW` và không có issue.
- Codex legal–editorial review trả `PASS_TO_EDITOR`, mức rủi ro `low`, không có finding cần người có chuyên môn.
- Không có chẩn đoán, khuyến nghị điều trị cá nhân, cáo buộc, suy đoán về động cơ hoặc thông tin riêng tư.
- Visual có quyền sử dụng rõ ràng; liên kết, metadata, sitemap và nội dung đã được kiểm tra.
- Có nhật ký tự xuất bản ghi nguồn, điểm chủ đề, kết quả hai cổng, URL và thời gian triển khai.

### Nhóm có thể tự xuất bản khi rủi ro thấp

- Hướng dẫn dịch vụ công, giao thông, thời tiết, tiện ích cộng đồng hoặc thay đổi vận hành đã được cơ quan có thẩm quyền công bố.
- Phân tích giáo dục, khoa học phổ thông hoặc phòng ngừa sức khỏe không chứa hướng dẫn điều trị và đã dựa trên hướng dẫn chính thức.
- Giải thích dữ liệu, quy trình hoặc thay đổi hành chính không liên quan cáo buộc hay tranh chấp.

### Nhóm luôn phải chờ người phụ trách duyệt

- Chính trị, quốc phòng, an ninh, ngoại giao, xung đột, biểu tình hoặc vấn đề có thể ảnh hưởng lợi ích quốc gia.
- Cáo buộc vi phạm, điều tra, xét xử, tai nạn có nạn nhân, tội phạm hoặc nội dung có thể gây tổn hại danh dự.
- Nội dung về cá nhân có thể nhận diện, đời tư, trẻ em, dữ liệu sức khỏe hoặc nhóm dễ tổn thương.
- Dự thảo chính sách chưa có hiệu lực, cách hiểu pháp luật còn tranh luận hoặc nội dung cần ý kiến luật sư.
- Thuốc, thiết bị y tế, phác đồ, chẩn đoán, cấp cứu, thay đổi điều trị hoặc tuyên bố hiệu quả sức khỏe.
- Thông tin tài chính có thể dẫn đến quyết định đầu tư, giao dịch hoặc thiệt hại đáng kể.
- Bài có mức rủi ro khác `low`, nguồn mâu thuẫn, dữ kiện chưa xác nhận hoặc bất kỳ cảnh báo nào từ cổng kiểm duyệt.

### Hành vi khi tự xuất bản

- Không mở popup xin duyệt đối với bài đủ điều kiện tự xuất bản.
- Không hỏi người phụ trách phê duyệt lại trước khi chỉnh sửa tệp, triển khai website, đăng Facebook Page, tải video hoặc chuyển video YouTube sang công khai đối với nội dung rủi ro thấp đã đáp ứng đầy đủ các điều kiện tại mục 6A.
- Việc người phụ trách yêu cầu vận hành theo workflow hằng ngày được xem là ủy quyền trước cho toàn bộ thao tác xuất bản rủi ro thấp trong phạm vi các kênh đã cấu hình. Không biến từng bước kỹ thuật thành một yêu cầu duyệt riêng.
- Sau khi hoàn tất, gửi báo cáo kết quả và URL; báo cáo sau xuất bản không phải là yêu cầu phê duyệt.
- Sau triển khai, gửi báo cáo cho người phụ trách gồm tiêu đề, lý do được xếp rủi ro thấp, bảng điểm, nguồn, URL và cách yêu cầu sửa/gỡ.
- Nếu kiểm tra công khai thất bại, tự dừng hoặc khôi phục bản an toàn; không tuyên bố thành công khi URL, ảnh hoặc sitemap lỗi.
- Người phụ trách có quyền yêu cầu tắt tự xuất bản, sửa hoặc gỡ bất kỳ lúc nào.

### Ngoại lệ bắt buộc phải dừng

- Quy tắc không cần phê duyệt không áp dụng cho các nhóm luôn phải chờ người phụ trách duyệt đã liệt kê ở trên, bài có mức rủi ro khác `low`, nguồn mâu thuẫn, cảnh báo y khoa/pháp lý, quyền hình ảnh không rõ hoặc dấu hiệu đăng nhầm kênh.
- Quy tắc này không thể bỏ qua yêu cầu đăng nhập, OAuth, xác minh hai bước, cửa sổ cấp quyền hay phê duyệt bảo mật bắt buộc của Codex, Windows, Vercel, Meta, Google hoặc nền tảng khác.
- Nếu một nền tảng từ chối hoặc trả cảnh báo, giữ nội dung ở trạng thái an toàn, không lách bằng browser bot và thông báo đúng nguyên nhân.

## 7. Quy tắc visual

- Tạo visual riêng cho từng bài; không tái sử dụng visual như ảnh đại diện của một bài mới.
- Ưu tiên sơ đồ, bản đồ khái niệm, timeline hoặc hình minh họa mang tính giáo dục do VSH tạo.
- Không mô phỏng giao diện, watermark, logo hoặc phong cách nhận diện đặc trưng của tờ báo.
- Không tạo hình người thật trong sự kiện nhạy cảm nếu có thể khiến người xem hiểu đó là ảnh tư liệu.
- Với hình AI, ghi chú “Hình minh họa do VSH tạo bằng AI” khi có nguy cơ bị hiểu là ảnh chụp sự kiện.
- Alt text mô tả nội dung hình, không nhồi từ khóa.

## 8. AI-friendly search writing

- Mỗi trang có một câu trả lời ngắn, trực tiếp cho câu hỏi chính ngay phần đầu.
- Dùng tiêu đề mô tả đúng nội dung; không sao chép tiêu đề báo và không giật tít.
- Dùng các đề mục theo câu hỏi thực tế của người đọc.
- Nêu ngày cập nhật, tác giả/biên tập viên, phương pháp chọn nguồn và mức độ bằng chứng.
- Dùng bảng hoặc danh sách khi giúp so sánh dữ kiện; không kéo dài bài chỉ để tăng số từ.
- Thêm dữ liệu có cấu trúc phù hợp với loại trang, nhưng không khai báo `NewsArticle` nếu VSH không hoạt động như cơ quan báo chí.
- Xây liên kết nội bộ theo chủ đề sức khỏe và chuyên môn của Viện.

## 9. Thay đổi kỹ thuật cần triển khai

### Giai đoạn 1 — an toàn tức thời

- Gỡ nội dung thời sự cũ có rủi ro khỏi trang công khai.
- Gắn `noindex` và bỏ trang tạm rà soát khỏi sitemap.
- Giữ dữ liệu crawler ngoài thư mục triển khai công khai.

### Giai đoạn 2 — bản nháp có cấu trúc

- Tạo schema dữ liệu gồm `status`, `sources`, `primarySources`, `factChecks`, `quotes`, `visualRights`, `reviewer`, `approvedAt`.
- Chỉ renderer các bản ghi có `status: approved`.
- Tạo mẫu riêng cho bản tin ngày và bài phân tích nổi bật.

### Giai đoạn 3 — kiểm tra tự động

- Cảnh báo tiêu đề/đoạn văn quá giống nguồn.
- Chặn ảnh từ tên miền báo chí và ảnh không có hồ sơ quyền sử dụng.
- Kiểm tra liên kết chết, thiếu ngày nguồn, thiếu người duyệt và thiếu cảnh báo y khoa.
- Tạo báo cáo trước triển khai; lỗi nghiêm trọng phải dừng deploy.

### Giai đoạn 4 — xuất bản có kiểm soát

- Xem trước bản nháp trên URL không công khai.
- Người phụ trách duyệt bằng một thao tác rõ ràng.
- Deploy, kiểm tra URL, sitemap, metadata và lưu nhật ký phiên bản.
- Có quy trình sửa, đính chính và gỡ bài sau xuất bản.

## 10. Tiêu chí hoàn thành

- Không có nội dung báo chí hoặc ảnh báo được đăng lại khi chưa có quyền.
- Không có bản ghi chưa duyệt xuất hiện trên website hoặc sitemap.
- 100% bài có hồ sơ nguồn và người duyệt.
- 100% visual có nguồn gốc/quyền sử dụng được ghi nhận.
- Mỗi bài phân tích có giá trị mới rõ ràng và dẫn người đọc tới nguồn gốc.
- Có nhật ký đính chính và cơ chế gỡ bài trong ngày khi phát hiện vấn đề.

## 11. Trạng thái xuất bản mặc định

Mọi nội dung do quy trình tạo vẫn mặc định là `draft`. Chỉ bài có hồ sơ chứng minh đủ toàn bộ điều kiện tại mục 6A mới được chuyển tự động sang `approved` và triển khai; các bài còn lại không workflow nào được tự động commit, deploy hoặc xuất bản.

## 12. Phân phối sau xuất bản và nguyên tắc không làm phiền

- Với tác vụ rủi ro thấp trong phạm vi quy trình đã duyệt — đọc nguồn công khai, mở liên kết, chỉnh sửa tệp website, kiểm thử, triển khai bài đủ mục 6A và tạo nội dung phân phối — Codex tiếp tục làm mà không xin xác nhận biên tập thêm.
- Quy tắc này không vô hiệu hóa cửa sổ bảo mật bắt buộc của Codex, Windows, Vercel hoặc nền tảng bên thứ ba. Ưu tiên quyền hẹp, lâu dài và kết nối tài khoản một lần để giảm tương tác.
- Sau mỗi bài đã xác minh công khai, tạo gói gồm URL chuẩn, tiêu đề, mô tả, visual, Facebook post, mô tả video và trạng thái từng kênh.
- Facebook cá nhân: chỉ tạo bản post sẵn để chủ tài khoản chia sẻ; không dùng browser bot hoặc cơ chế không chính thức để tự đăng vào hồ sơ cá nhân.
- Facebook Page: được tự đăng khi Page đã kết nối bằng API chính thức và bài thuộc nhóm rủi ro thấp.
- Bản tin sức khỏe: phân phối lên fanpage, YouTube và TikTok của Viện. Video tuân thủ skill `write-viral-health-video`, có cảnh báo phù hợp và không thay thế tư vấn y tế.
- Bản tin thời sự: chỉ phân phối lên fanpage thời sự riêng để không làm loãng nhận diện chuyên môn sức khỏe của Viện. Không tự đưa lên YouTube/TikTok của Viện nếu chưa có quyết định riêng.
- Không tuyên bố “đã đăng” khi chưa nhận URL hoặc mã bài đăng. Nếu thiếu kết nối, lưu gói ở trạng thái `READY_TO_PUBLISH` và báo đúng một lần về cấu hình còn thiếu.

## 13. Đo lường và quyền riêng tư

- Dùng Vercel Web Analytics để đo ẩn danh: lượt xem, thời điểm, nguồn giới thiệu, thiết bị/trình duyệt và vị trí gần đúng ở mức tổng hợp.
- Không thu thập hoặc suy đoán tuổi, giới tính, địa chỉ cụ thể, danh tính hay dữ liệu sức khỏe của từng người đọc.
- Nếu cần nghiên cứu tuổi/giới tính, ưu tiên khảo sát tự nguyện, tối thiểu hóa dữ liệu, công bố mục đích và chỉ dùng kết quả tổng hợp. Công cụ có cookie hoặc quảng cáo phải có đánh giá pháp lý và cơ chế đồng ý trước khi kích hoạt.
- Duy trì trang quyền riêng tư công khai, giới hạn quyền truy cập dashboard và không dùng dữ liệu phân tích để nhận diện cá nhân.

## 14. Hạ tầng phân phối mạng xã hội không thuê bao

### Quyết định kiến trúc

- Không phụ thuộc Postiz Cloud hoặc dịch vụ lập lịch trả phí.
- Tận dụng n8n đang tự lưu trữ và gọi API chính thức của từng nền tảng.
- Không dùng browser bot, giả lập thao tác người dùng, chia sẻ mật khẩu hoặc cách lách hạn chế của nền tảng.
- Postiz tự lưu trữ chỉ là phương án dự phòng; chưa triển khai vì làm tăng vận hành, tài nguyên và bề mặt bảo mật trong khi n8n đã đáp ứng vai trò điều phối.

### Facebook

- Facebook Page sức khỏe của Viện và Page thời sự riêng: n8n đăng qua Meta Graph API sau khi ứng dụng Meta được cấp đúng quyền.
- Quyền tối thiểu dự kiến: `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`; chỉ bổ sung quyền khi có nhu cầu đã được xác minh.
- Facebook cá nhân: chỉ sinh bản post hoàn chỉnh có URL bài viết; chủ tài khoản tự chia sẻ. Không cố tự đăng vào hồ sơ cá nhân.
- Lưu Page ID, thời gian, post ID, release URL và phản hồi API; không tuyên bố thành công nếu thiếu post ID/URL.

### YouTube

- Video sức khỏe đã qua QA được tải bằng YouTube Data API và OAuth của kênh Viện.
- Giai đoạn thử nghiệm mặc định `unlisted`; chỉ chuyển sang `public` sau khi kiểm tra toàn bộ tiêu đề, mô tả, thumbnail, âm thanh, cảnh báo sức khỏe và liên kết bài web.
- Lưu video ID, URL, chế độ hiển thị và phản hồi API. Tôn trọng hạn mức API; không lặp upload khi kết quả trước chưa được đối soát.
- Bản tin thời sự không tự đăng lên kênh YouTube sức khỏe của Viện.

### TikTok

- Dùng TikTok Content Posting API chính thức.
- Trước khi ứng dụng vượt qua kiểm duyệt Direct Post, ưu tiên Upload API để đưa video vào bản nháp; người phụ trách kiểm tra và bấm đăng trong TikTok.
- Chỉ bật tự đăng công khai khi ứng dụng đã được TikTok phê duyệt, tài khoản/kênh đúng, URL media HTTPS thuộc miền đã xác minh và lượt thử riêng tư thành công.
- Không coi một video bị buộc `SELF_ONLY` là đã xuất bản công khai.

### Luồng sau khi bài web được xuất bản

1. Xác minh URL, ảnh, canonical, Open Graph, sitemap và Analytics trên production.
2. Tạo Facebook post, metadata video, hashtag và gói media mới cho bài.
3. Với bản tin sức khỏe, tạo video hoàn chỉnh theo `write-viral-health-video`; chỉ phân phối khi đã qua voice, visual và health-safety QA.
4. Gửi tới từng nhánh: Facebook Page sức khỏe, YouTube và TikTok Draft/Direct Post theo trạng thái quyền hiện có.
5. Với bản tin thời sự, chỉ gửi tới Facebook Page thời sự.
6. Lưu trạng thái độc lập cho từng kênh: `READY`, `UPLOADED_PRIVATE`, `PUBLISHED`, `BLOCKED_CONFIGURATION` hoặc `FAILED`.
7. Một kênh thất bại không được làm mất nhật ký hoặc khiến workflow đăng trùng ở kênh đã thành công.

### Thứ tự triển khai đã thống nhất

1. Meta Developer App và hai Facebook Page.
2. Google Cloud project, YouTube Data API và OAuth; thử upload `unlisted`.
3. TikTok Developer App; trước mắt tải vào Draft, sau đó mới xin kiểm duyệt Direct Post.
4. Kết nối các nhánh vào workflow 08:00 sau khi từng kênh đã vượt qua bài thử riêng.

## 15. Giai đoạn ổn định và thử nghiệm video 7 ngày

### Nhịp xuất bản

- Giai đoạn thử nghiệm: mỗi ngày tối đa 1 bản tin sức khỏe và 1 bản tin thời sự, chỉ đăng khi đạt ngưỡng chất lượng và qua cổng kiểm duyệt.
- Sau tối thiểu 7 ngày vận hành ổn định, mục tiêu có thể nâng lên 3 bản tin sức khỏe và 3 bản tin thời sự tại ba khung giờ: 08:00, 13:00 và 19:30.
- Số lượng là mục tiêu, không phải nghĩa vụ. Không có chủ đề đạt chuẩn thì để trống khung giờ; không viết bài yếu để đủ số.
- Mỗi bài là một chủ đề tổng hợp nhiều nguồn, có một vấn đề trung tâm và một sản phẩm hành động hữu ích; không coi mỗi đường dẫn crawler là một bài.

### Ma trận kênh

- Sức khỏe tiếng Việt: website VSH, Facebook Page Viện Sinh Hóa Đông Y Dược và YouTube Viện Sinh Hóa Đông Y Dược.
- Sức khỏe tiếng Anh: Facebook Page VSH Health News và YouTube Institute of Traditional Medicine Biochemistry.
- Thời sự tiếng Việt: website VSH và Facebook Page VSH Thời Sự Việt Nam.
- Thời sự tiếng Anh: Facebook Page VSH Current Affairs.
- Không tự đưa thời sự lên hai kênh YouTube sức khỏe nếu chưa có quyết định riêng.

### Thử nghiệm công thức video

- Trong 7 ngày đầu, mỗi chủ đề sức khỏe tạo một video tiếng Việt và một bản tiếng Anh được bản địa hóa, không dịch máy nguyên văn.
- Luân phiên ba nhóm hook: hiểu lầm phổ biến; dấu hiệu/con số đáng chú ý; vấn đề dẫn tới hành động ngay.
- Trước mỗi video, tạo ba hook, chấm theo thang của skill `write-viral-health-video` và lưu cả ba cùng lý do chọn.
- Giữ tương đối ổn định thời lượng, nhận diện, giọng đọc, nhịp dựng và khung giờ để việc so sánh hook có ý nghĩa.
- Không đăng nhiều video gần như giống nhau trong cùng ngày chỉ để thử hook.
- Theo dõi tối thiểu: tỷ lệ giữ người xem đầu video, thời lượng xem trung bình, tỷ lệ xem hết, lượt chia sẻ/lưu, bình luận có nội dung, người đăng ký mới và lượt truy cập về website.
- Sau ngày thứ bảy, tổng hợp dữ liệu, giữ 1–2 mẫu hook tốt nhất và chạy vòng thử nghiệm tiếp theo trước khi sản xuất hàng loạt.

### Trạng thái YouTube

- Video mới được tải lên ở chế độ `unlisted` chỉ trong thời gian kiểm tra kỹ thuật ngắn.
- Nếu đúng kênh, ngôn ngữ, âm thanh, phụ đề, thumbnail, nguồn và không có cảnh báo nền tảng, hệ thống tự chuyển sang `public` mà không cần xin phê duyệt lại.
- Nếu có lỗi hoặc cảnh báo, giữ `unlisted`, dừng phân phối và thông báo rõ nguyên nhân.
- Không tính video là đã xuất bản khi chưa xác minh trạng thái `public` và URL công khai.

### Điều kiện chuyển sang sáu bài mỗi ngày

- Hoàn thành ít nhất 7 ngày thử nghiệm hoặc 7 chu kỳ xuất bản liên tiếp không đăng nhầm kênh, không trùng bài và không có lỗi kiểm duyệt nghiêm trọng.
- Nhật ký của từng bài có URL website, post ID Facebook, video ID YouTube, ngôn ngữ, thời gian và trạng thái cuối.
- Có quy trình chống đăng trùng và cho phép một nhánh lỗi mà không đăng lại các nhánh đã thành công.
- Có báo cáo tuần xác định năng lực sản xuất thực tế và chất lượng nguồn; chỉ tăng sản lượng khi không làm giảm tiêu chuẩn biên tập.

## 16. Theo dõi hiệu quả và tự động thu thập số liệu

### Mốc kiểm tra bắt buộc

- Sau 15 phút: kiểm tra URL, đúng kênh/ngôn ngữ, trạng thái công khai, HD, âm thanh, thumbnail và lỗi hiển thị.
- Sau 1 giờ: kiểm tra cảnh báo bản quyền/nền tảng, bình luận bất thường và dấu hiệu cần đính chính.
- Sau 24 giờ: ghi hiệu quả ban đầu của chủ đề, tiêu đề, hook, thumbnail và khung giờ.
- Sau 72 giờ: ghi khả năng tiếp tục được đề xuất, chia sẻ và đưa người đọc về website.
- Sau 7 ngày: so sánh với các bài cùng nhóm hook và quyết định giữ, sửa hoặc loại công thức.
- Sau 30 ngày: đánh giá giá trị tìm kiếm dài hạn và lượng truy cập tiếp tục phát sinh.

### Chỉ số website

- Page views, visitors, bounce rate, referrer, route, quốc gia/khu vực gần đúng, thiết bị, hệ điều hành và trình duyệt ở mức tổng hợp.
- Custom events cho các hành động quan trọng: nhấp xem video, nhấp nguồn, nhấp bài liên quan và chia sẻ bài.
- Không thu thập danh tính, tuổi, giới tính, vị trí chính xác hoặc dữ liệu sức khỏe cá nhân.

### Chỉ số YouTube

- Views, estimated minutes watched, average view duration, average percentage viewed, likes, comments, shares, subscribers gained/lost và nguồn truy cập khi API hỗ trợ.
- Theo dõi riêng từng video bằng `videoId`; so sánh tiếng Việt và tiếng Anh theo tỷ lệ, không chỉ số tuyệt đối.
- Ưu tiên retention phần mở đầu, tỷ lệ xem hết, chia sẻ/lưu và người đăng ký mới hơn tổng lượt xem đơn lẻ.

### Chỉ số Facebook Page

- Reach, impressions, video views, thời gian xem, reactions, comments, shares, link clicks và người theo dõi mới khi metric còn được Meta hỗ trợ.
- Chỉ đọc dữ liệu Page do VSH quản lý bằng Page access token và quyền tối thiểu cần thiết.
- Tên metric có thể thay đổi theo phiên bản Graph API; workflow phải ghi lỗi metric riêng và không làm hỏng toàn bộ báo cáo.

### Kết nối YouTube Analytics API

1. Trong Google Cloud project `vsh-social-publisher`, bật **YouTube Analytics API** bên cạnh YouTube Data API v3.
2. Bổ sung OAuth scope `https://www.googleapis.com/auth/yt-analytics.readonly` cho cả token kênh Việt và token kênh Anh; phải chạy lại màn hình đồng ý một lần cho từng danh tính kênh.
3. Không dùng service account cho hai kênh thông thường; lưu refresh token riêng theo Channel ID và không commit vào Git.
4. Gọi `youtubeAnalytics.reports.query` với `ids=channel==MINE`, ngày bắt đầu/kết thúc, metrics và filter theo `video==VIDEO_ID`.
5. Lưu snapshot tại các mốc 24 giờ, 72 giờ, 7 ngày và 30 ngày; không ghi đè snapshot cũ.

### Kết nối Facebook Insights

1. Dùng Meta App `VSH Social Publisher`, Page access token chính thức và đúng Page ID.
2. Quyền đọc dự kiến tối thiểu: `pages_show_list`, `pages_read_engagement` và `read_insights`; quyền đăng giữ `pages_manage_posts`.
3. Lưu token dưới dạng secret/biến môi trường, tách theo Page; không đưa token vào mã nguồn, Markdown, JSON nhật ký hoặc output hiển thị.
4. Dùng endpoint Insights của Page/Post/Video theo phiên bản Graph API đang cấu hình; lưu `post_id`, `video_id`, metric, kỳ đo, thời gian truy vấn và phản hồi lỗi.
5. Nếu token hết hạn hoặc quyền bị thu hồi, chuyển nhánh Facebook thành `BLOCKED_CONFIGURATION`, giữ nguyên dữ liệu các kênh khác và thông báo đúng một lần.

### Kết nối Vercel Web Analytics API

1. Web Analytics đã bật cho dự án VSH; dùng Vercel token quyền hẹp, `teamId` và `projectId` dưới dạng biến môi trường.
2. Dùng Web Analytics API nhóm `visits` để lấy page views/visitors và nhóm `events` cho custom events.
3. Lọc theo `requestPath` của từng bài, nhóm theo thời gian, route, referrer, country hoặc device khi cần.
4. Dashboard/CSV là phương án đối soát thủ công; API là nguồn cho báo cáo tự động. Dữ liệu thô chỉ đưa sang hạ tầng riêng qua Drains khi có nhu cầu và đánh giá quyền riêng tư riêng.

### Lịch tự động và lưu trữ

- Workflow kiểm tra xuất bản chạy sau 15 phút và 1 giờ.
- Workflow số liệu chạy hằng ngày sau mốc 24 giờ; mỗi bài được truy vấn lại ở ngày 3, ngày 7 và ngày 30.
- Mỗi snapshot gồm `articleId`, URL/video/post ID, kênh, ngôn ngữ, hook, thời điểm đăng, thời điểm đo, cửa sổ đo, metrics và trạng thái API.
- Không cộng dồn snapshot sai kỳ; báo cáo phải phân biệt giá trị tích lũy và chênh lệch theo kỳ.
- Báo cáo tuần xếp hạng theo điểm tổng hợp: 30% giữ người xem, 20% tỷ lệ xem hết, 20% chia sẻ/lưu, 15% bình luận có nội dung, 10% người đăng ký mới và 5% truy cập về website.
- Chỉ kết luận một nhóm hook tốt hơn khi có ít nhất hai video trong nhóm; không suy rộng từ một video đơn lẻ.
