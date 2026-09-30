# Gói duyệt nội dung — công cụ 02 (bản vá) và 04–07

**Tình trạng:** đã lên production `www.vshdongyduoc.org` ngày 30/09/2026 **trước khi ký** (deploy `vshdongyduoc-rol44l32j-chinh-hoangs-projects.vercel.app`, mã nguồn nhánh `claude/laughing-goldberg-qf8odi` @ `4111107`). Người duyệt chọn giữ trên site và duyệt ngay (phương án A).

**Cách dùng gói này:** đọc từng mục "Cần tra", đối chiếu với nguồn gốc, đánh dấu ✅ hoặc ghi chỗ cần sửa. Chữ trong phần "Nguyên văn trên site" được trích tự động từ mã nguồn, không chép tay, nên đúng từng chữ với trang đang chạy.

Nếu có chỗ phải sửa: gửi lại danh sách, Claude sửa, rồi deploy lại. Nếu có chỗ **sai về y khoa** (mốc, công thức), nên rút công cụ đó xuống trước: báo Claude đổi thẻ công cụ đó về "Sắp mở" và deploy lại.

---

## Phần 1 — Công cụ 02, bản vá (đã có chữ khóa của người duyệt)

Chỉ cần xác nhận trang `/cong-cu/nguy-co-dai-thao-duong-findrisc` hiện đúng 4 chỗ đã giao:

- [ ] Citation Doan L… *J Multidiscip Healthc*. 2023;16:439–449. doi:10.2147/JMDH.S398455
- [ ] 8 câu FINDRISC đúng bản khóa (câu 6 có "thường xuyên", câu 8 có "type 1 hoặc type 2")
- [ ] Disclaimer công cụ 02 bắt đầu "Kết quả là điểm sàng lọc theo thang ModAsian FINDRISC…"
- [ ] FAQ 3 câu: chẩn đoán? / vì sao không 25 và 94/102? / thiếu vòng eo?

---

## Phần 2 — Những điểm Claude chưa đối chiếu được (ưu tiên đọc)

Gợi ý tra: gõ chuỗi trong ngoặc vào ô tìm của PubMed (pubmed.ncbi.nlm.nih.gov).

### 04 — 5 tiêu chí chuyển hóa
- [ ] Năm mốc và "đang dùng thuốc thì tính là đạt" đúng như Alberti 2009 (`Harmonizing the metabolic syndrome Alberti 2009`). Bảng 1 và 2 của bài.
- [ ] Mốc HDL 1,0 / 1,3 mmol/L tương đương 40 / 50 mg/dL; TG 1,7 mmol/L = 150 mg/dL; glucose 5,6 mmol/L = 100 mg/dL.
- [ ] Câu "có từ 3/5 tiêu chí là mốc bác sĩ dùng khi xác định hội chứng chuyển hóa" chấp nhận được (không phải chẩn đoán).
- [ ] Ví dụ thuốc hạ TG / tăng HDL "thường là fibrat hoặc niacin" — theo chú thích của bài gốc; statin không được liệt kê.
- [ ] Số trang 120:1640–1645.

### 05 — FIB-4
- [ ] Công thức: tuổi × AST ÷ (tiểu cầu [10⁹/L] × √ALT) — Sterling 2006 (`Sterling FIB-4 HIV/HCV coinfection 2006`).
- [ ] Mốc 1,30 và 2,67 cho gan nhiễm mỡ — Shah 2009 (`Shah comparison noninvasive markers fibrosis NAFLD 2009`).
- [ ] Mốc dưới 2,0 từ 65 tuổi; FIB-4 kém chính xác dưới 35 tuổi — McPherson 2017 (`McPherson age confounding non-invasive NAFLD fibrosis`).
- [ ] Câu "hỏi bác sĩ về việc tính lại sau 1–3 năm" phù hợp AASLD 2023 (`Rinella AASLD practice guidance NAFLD 2023`).
- [ ] Vùng giữa khuyên hỏi FibroScan hoặc ELF là phù hợp thực hành tại Việt Nam.

### 06 — Sức khỏe nướu
- [ ] Bản dịch 8 câu khớp ý bộ câu hỏi gốc — Eke 2013 J Dent Res (`Eke self-reported measures surveillance periodontitis 2013`); bảng câu hỏi trong bài.
- [ ] Số trang 92(11):1041–1047 và Eke 2009 J Periodontol 80(9):1371–1379 (`Eke Dye self-report measures predicting population prevalence periodontitis`).
- [ ] Quyết định **không tính điểm** (mô hình gốc dùng cho cấp cộng đồng).
- [ ] Câu 9–10 do Viện bổ sung (chảy máu nướu; sưng đau/mủ/lung lay tăng dần) và cách phân màu: câu 10 "có" → đỏ; có ≥ 1 dấu hiệu → hổ phách.
- [ ] Câu "Không tự dùng kháng sinh" ở mức đỏ.

### 07 — Fitzpatrick
- [ ] Bản dịch mô tả loại I–VI khớp Fitzpatrick 1988 (`Fitzpatrick validity practicality sun-reactive skin types 1988`).
- [ ] Câu hỏi "khi da chưa rám… phơi nắng trưa 30–45 phút" là cách hỏi chấp nhận được.
- [ ] Lời khuyên: che chắn khi UV ≥ 3 (WHO UV Index 2002); kem chống nắng phổ rộng SPF ≥ 30, bôi lại khoảng mỗi 2 giờ (AAD). Không nêu tên sản phẩm.
- [ ] Câu dấu hiệu nốt ruồi / vết loét do Viện bổ sung → khuyên khám da liễu sớm.

---

## Phần 3 — Nguyên văn trên site

## Công cụ 04 — /cong-cu/hoi-chung-chuyen-hoa

**H1:** Đối chiếu 5 tiêu chí chuyển hóa từ phiếu xét nghiệm

**Mô tả (meta):** Nhập vòng eo, huyết áp, triglycerid, HDL-C và đường huyết đói để đối chiếu với 5 tiêu chí của định nghĩa hài hòa 2009, vòng eo châu Á 90/80. Không chẩn đoán.

**Đoạn dẫn:** Nhập các số trên phiếu khám và xét nghiệm gần nhất. Công cụ đếm xem bao nhiêu chỉ số đạt mốc của định nghĩa hài hòa năm 2009 (vòng eo theo ngưỡng châu Á). Đây không phải chẩn đoán bệnh.

### Câu hỏi và ô nhập

- Giới tính
- Tuổi Không bắt buộc. Công cụ dành cho người từ 18 tuổi.
- Tôi đang mang thai
- Vòng eo (cm) Cách đo
- Huyết áp (mmHg)
- Tâm thu (số trên)
- Tâm trương (số dưới)
- Đơn vị trên phiếu xét nghiệm
- Phiếu ở Việt Nam thường ghi mmol/L. Chọn đúng đơn vị trước khi nhập.
- Triglycerid (lúc đói)
- HDL-C
- Glucose (đường huyết) lúc đói
- Thuốc bác sĩ đang kê cho bạn
- Theo định nghĩa gốc, đang dùng thuốc cho chỉ số nào thì tính là đạt tiêu chí đó.
- Thuốc huyết áp
- Thuốc hạ đường huyết
- Thuốc hạ triglycerid (thường là fibrat hoặc niacin)
- Thuốc để tăng HDL-C (thường là fibrat hoặc niacin)
- Bỏ trống chỉ số chưa có. Công cụ vẫn đếm các chỉ số đã nhập và ghi rõ còn thiếu bao nhiêu.

Lựa chọn trả lời (theo thứ tự trên trang): Nam · Nữ · mmol/L · mg/dL

### Chữ kết quả (lấy từ mets.js)

- **Đạt từ 3/5 tiêu chí trở lên theo định nghĩa hài hòa 2009** (màu đỏ): Nên mang bản tóm tắt này cùng phiếu xét nghiệm đến bác sĩ để được đánh giá và tư vấn. Không tự dùng thuốc.
- **Đạt 1–2/5 tiêu chí theo định nghĩa hài hòa 2009** (màu hổ phách): Chưa tới mốc 3/5, nhưng các chỉ số đạt mốc nên được theo dõi. Mang bản tóm tắt khi khám định kỳ và hỏi bác sĩ khi nào nên xét nghiệm lại.
- **Chưa đạt tiêu chí nào trong các chỉ số đã nhập**: Tiếp tục khám sức khỏe định kỳ theo lịch của cơ sở y tế.
- Câu chính: "Số liệu bạn nhập đạt N/5 tiêu chí. Theo định nghĩa hài hòa năm 2009, có từ 3/5 tiêu chí là mốc bác sĩ dùng khi xác định hội chứng chuyển hóa. Công cụ chỉ đếm tiêu chí từ số liệu bạn tự nhập, không kết luận thay bác sĩ."
- Tiêu chí: Vòng eo (nam ≥ 90 cm, nữ ≥ 80 cm)
- Tiêu chí: Triglycerid ≥ 1,7 mmol/L (150 mg/dL) hoặc đang dùng thuốc hạ triglycerid
- Tiêu chí: HDL-C < 1,0 mmol/L (40 mg/dL) ở nam, < 1,3 mmol/L (50 mg/dL) ở nữ, hoặc đang dùng thuốc tăng HDL
- Tiêu chí: Huyết áp ≥ 130 và/hoặc ≥ 85 mmHg, hoặc đang dùng thuốc huyết áp
- Tiêu chí: Đường huyết lúc đói ≥ 5,6 mmol/L (100 mg/dL) hoặc đang dùng thuốc hạ đường huyết
- Ghi chú: Đường huyết và mỡ máu cần là kết quả xét nghiệm lúc đói; huyết áp nên đo khi đã ngồi nghỉ ít nhất 5 phút.

### Nguồn, disclaimer, FAQ

- Alberti KGMM, Eckel RH, Grundy SM, et al. Harmonizing the Metabolic Syndrome. Circulation. 2009;120:1640–1645.
- Bộ Y tế. Quyết định 2892/QĐ-BYT ngày 22/10/2022, mục 4.2 vòng bụng (nam ≥ 90 cm, nữ ≥ 80 cm).

**Disclaimer:** Kết quả chỉ đếm số tiêu chí từ số liệu bạn tự nhập, đối chiếu với định nghĩa đã công bố. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám bệnh. Nếu đạt từ 3/5 tiêu chí, hoặc bạn đang có triệu chứng, hãy đến cơ sở y tế.

- **Công cụ này có chẩn đoán hội chứng chuyển hóa không?** Không. Công cụ chỉ đếm xem bao nhiêu chỉ số bạn nhập đạt mốc của định nghĩa hài hòa 2009. Việc xác định bệnh do bác sĩ làm sau khi khám và xem xét nghiệm.
- **Vì sao vòng eo là 90/80 mà không phải 94/80 hay 102/88?** Định nghĩa hài hòa 2009 cho phép dùng mốc vòng eo theo từng dân tộc. Với người châu Á, trang này dùng nam ≥ 90 cm, nữ ≥ 80 cm, thống nhất với Quyết định 2892/QĐ-BYT.
- **Tôi chưa có đủ 5 chỉ số thì sao?** Vẫn xem được kết quả với các chỉ số đã có. Công cụ ghi rõ còn thiếu bao nhiêu chỉ số và khi nào kết quả có thể thay đổi.

## Công cụ 05 — /cong-cu/fib-4

**H1:** Tính chỉ số FIB-4 từ phiếu xét nghiệm

**Mô tả (meta):** Tính FIB-4 từ tuổi, AST (GOT), ALT (GPT) và tiểu cầu. Mốc 1,30 / 2,67, từ 65 tuổi mốc dưới 2,0. Phép tính phân loại ban đầu, không chẩn đoán.

**Đoạn dẫn:** FIB-4 là phép tính từ tuổi, AST, ALT và tiểu cầu, được dùng để phân loại ban đầu khả năng xơ hóa gan ở người có gan nhiễm mỡ hoặc có nguy cơ. Đây không phải chẩn đoán bệnh gan.

### Câu hỏi và ô nhập

- Tuổi
- AST (GOT), U/L
- ALT (GPT), U/L
- Tiểu cầu (PLT), G/L G/L = ×10⁹/L = K/µL. Nếu phiếu ghi 250.000/mm³ thì nhập 250.
- Dùng các số trên cùng một lần xét nghiệm.

Lựa chọn trả lời (theo thứ tự trên trang): 

### Chữ kết quả (lấy từ fib4.js)

- **Khả năng xơ hóa gan tiến triển thấp theo FIB-4**: Chỉ số này chưa gợi ý cần làm thêm xét nghiệm xơ hóa. Nếu bạn có đái tháo đường, thừa cân hoặc đã được biết có gan nhiễm mỡ, hỏi bác sĩ về việc tính lại sau 1–3 năm.
- **Vùng chưa xác định theo FIB-4** (màu hổ phách): Nên hỏi bác sĩ về xét nghiệm bước hai, ví dụ đo độ đàn hồi gan (FibroScan) hoặc xét nghiệm ELF, để làm rõ.
- **Khả năng xơ hóa gan tiến triển cao theo FIB-4** (màu đỏ): Nên khám chuyên khoa tiêu hóa – gan để được đánh giá thêm. Mang bản tóm tắt này và phiếu xét nghiệm.
- Luôn hiện: FIB-4 là một phép tính từ 4 con số, dùng để phân loại ban đầu; không phải sinh thiết, không phải siêu âm và không phải chẩn đoán bệnh gan.
- Ghi chú: Từ 65 tuổi, mốc dưới được nâng lên 2,0 vì FIB-4 tăng theo tuổi (McPherson 2017).
- Ghi chú: Dưới 35 tuổi, FIB-4 kém chính xác hơn; nên hỏi bác sĩ nếu còn lo ngại.
- Ghi chú: FIB-4 dành cho người lớn có gan nhiễm mỡ hoặc có nguy cơ (đái tháo đường, béo phì). Kết quả kém tin cậy khi đang có tổn thương gan cấp; hỏi bác sĩ nếu men gan tăng cao đột ngột.

### Nguồn, disclaimer, FAQ

- Sterling RK, Lissen E, Clumeck N, et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. Hepatology. 2006;43:1317–1325.
- Shah AG, Lydecker A, Murray K, et al. Comparison of noninvasive markers of fibrosis in patients with nonalcoholic fatty liver disease. Clin Gastroenterol Hepatol. 2009;7:1104–1112.
- McPherson S, Hardy T, Dufour JF, et al. Age as a confounding factor for the accurate non-invasive diagnosis of advanced NAFLD fibrosis. Am J Gastroenterol. 2017;112:740–751.
- Rinella ME, Neuschwander-Tetri BA, Siddiqui MS, et al. AASLD Practice Guidance on the clinical assessment and management of nonalcoholic fatty liver disease. Hepatology. 2023;77:1797–1835.

**Disclaimer:** Kết quả chỉ là phép tính từ số bạn tự nhập, đối chiếu với mốc đã công bố. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám bệnh. Nếu FIB-4 trên 2,67, ở vùng chưa xác định, hoặc bạn đang có triệu chứng như vàng da, bụng to lên, phân đen, hãy đến cơ sở y tế.

- **FIB-4 có chẩn đoán xơ gan không?** Không. FIB-4 chỉ phân loại ban đầu: thấp, chưa xác định, hoặc cao. Khi không ở nhóm thấp, bác sĩ thường chỉ định thêm xét nghiệm như đo độ đàn hồi gan.
- **Vì sao từ 65 tuổi mốc dưới là 2,0?** Tuổi nằm trong công thức nên FIB-4 tự tăng theo tuổi. Nghiên cứu McPherson 2017 đề xuất mốc dưới 2,0 cho người từ 65 tuổi để giảm kết quả dương tính giả.
- **Tôi lấy số AST, ALT, tiểu cầu ở đâu?** Trên phiếu xét nghiệm máu: AST thường ghi là GOT, ALT ghi là GPT (đơn vị U/L), tiểu cầu trong phần công thức máu (PLT, đơn vị G/L).

## Công cụ 06 — /cong-cu/suc-khoe-nuou

**H1:** Tự kiểm tra sức khỏe nướu

**Mô tả (meta):** 8 câu hỏi tự trả lời về răng và nướu theo bộ câu hỏi của CDC/AAP, cộng 2 câu dấu hiệu. Không tính điểm, không chẩn đoán, có bản mang đến nha sĩ.

**Đoạn dẫn:** Tám câu hỏi đầu theo bộ câu hỏi tự trả lời mà CDC và Hội Nha chu Hoa Kỳ (AAP) dùng trong giám sát bệnh nha chu. Công cụ không tính điểm; kết quả là các dấu hiệu nên để nha sĩ xem. Đây không phải chẩn đoán.

### Câu hỏi và ô nhập

- 1. Bạn có nghĩ mình có thể đang có bệnh nướu (bệnh quanh răng) không?
- 2. Nhìn chung, bạn đánh giá sức khỏe răng và nướu của mình thế nào?
- 3. Bạn đã từng được điều trị bệnh nướu, ví dụ cạo vôi và làm sạch sâu mặt chân răng?
- 4. Bạn đã từng có răng tự lung lay mà không do chấn thương?
- 5. Nha sĩ đã từng cho bạn biết có tiêu xương quanh răng?
- 6. Trong 3 tháng qua, bạn có thấy chiếc răng nào trông không bình thường?
- 7. Trong 7 ngày qua, ngoài bàn chải, bạn dùng chỉ nha khoa hoặc dụng cụ làm sạch kẽ răng bao nhiêu lần?
- 8. Trong 7 ngày qua, bạn dùng nước súc miệng bao nhiêu lần?
- Hai câu dưới do Viện bổ sung để nhận ra dấu hiệu nên khám sớm; không thuộc bộ câu hỏi gốc.
- 9. Nướu bạn có chảy máu khi chải răng hoặc làm sạch kẽ răng không?
- 10. Hiện bạn có sưng đau nướu, có mủ, hoặc răng lung lay tăng dần không?

Lựa chọn trả lời (theo thứ tự trên trang): Không · Có · Không rõ · Tuyệt vời · Rất tốt · Tốt · Tạm được · Kém · Không · Có · Không · Có · Không · Có · Không · Có · Không · Có · Không · Có

### Chữ kết quả (lấy từ nuou.js)

- **Có dấu hiệu nên đi khám nha khoa sớm** (màu đỏ): Sưng đau nướu, có mủ, hoặc răng lung lay tăng dần là lý do nên đi khám nha khoa sớm, không chờ lịch định kỳ. Không tự dùng kháng sinh.
- **Có dấu hiệu nên để nha sĩ xem** (màu hổ phách): Nên đặt lịch khám nha khoa và mang bản tóm tắt này. Nha sĩ sẽ khám nướu và đo túi nướu để đánh giá.
- **Chưa ghi nhận dấu hiệu nào trong các câu đã trả lời**: Tiếp tục chải răng hằng ngày, làm sạch kẽ răng và khám nha khoa định kỳ theo lịch nha sĩ khuyên.
- Dấu hiệu: Bạn nghĩ mình có thể đang có bệnh nướu
- Dấu hiệu: Bạn tự đánh giá răng và nướu ở mức tạm được hoặc kém
- Dấu hiệu: Từng có răng tự lung lay, không do chấn thương
- Dấu hiệu: Từng được nha sĩ cho biết có tiêu xương quanh răng
- Dấu hiệu: Trong 3 tháng qua thấy có răng trông không bình thường
- Dấu hiệu: Nướu chảy máu khi chải răng hoặc làm sạch kẽ răng
- Luôn hiện: Đây là bộ câu hỏi tự trả lời, không thay được việc nha sĩ khám và đo túi nướu. Công cụ không tính điểm và không chẩn đoán bệnh nha chu.
- Ghi chú: Bạn từng điều trị bệnh nướu: nên tái khám theo lịch nha sĩ hẹn, kể cả khi không thấy gì bất thường.
- Ghi chú: Bàn chải không làm sạch hết kẽ răng. Hỏi nha sĩ cách làm sạch kẽ răng phù hợp với bạn.

### Nguồn, disclaimer, FAQ

- Eke PI, Dye BA, Wei L, et al. Self-reported measures for surveillance of periodontitis. J Dent Res. 2013;92(11):1041–1047.
- Eke PI, Dye B. Assessment of self-report measures for predicting population prevalence of periodontitis. J Periodontol. 2009;80(9):1371–1379.

**Disclaimer:** Kết quả chỉ phản ánh câu bạn tự trả lời. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám nha khoa. Nếu có sưng đau, có mủ, răng lung lay, hoặc chảy máu nướu kéo dài, hãy đến cơ sở nha khoa.

- **Vì sao công cụ không cho điểm?** Bộ câu hỏi gốc của CDC/AAP được xây dựng để ước tính tỷ lệ bệnh nha chu trong cộng đồng, không phải để kết luận cho từng người. Vì vậy công cụ chỉ liệt kê các dấu hiệu nên để nha sĩ xem.
- **Chảy máu nướu khi chải răng có đáng lo không?** Chảy máu nướu là dấu hiệu nướu đang bị kích thích hoặc viêm và nên để nha sĩ xem. Nó không tự nói lên mức độ bệnh; nha sĩ cần khám và đo túi nướu.
- **Công cụ này có thay khám nha khoa không?** Không. Công cụ giúp bạn chuẩn bị câu trả lời để mang đến nha sĩ.

## Công cụ 07 — /cong-cu/fitzpatrick

**H1:** Loại da và mức nhạy nắng (thang Fitzpatrick)

**Mô tả (meta):** Chọn mô tả gần nhất với phản ứng của da bạn khi ra nắng để biết loại da Fitzpatrick I–VI và cách che chắn nắng phù hợp. Không chẩn đoán bệnh da.

**Đoạn dẫn:** Thang Fitzpatrick chia da thành 6 loại theo cách da phản ứng với nắng: dễ bỏng hay dễ rám. Biết loại da giúp chọn cách che chắn nắng phù hợp. Đây không phải chẩn đoán bệnh da.

### Câu hỏi và ô nhập

- Khi da chưa rám (ví dụ sau một thời gian ít ra nắng), nếu phơi nắng trưa khoảng 30–45 phút mà không che chắn, da bạn thường thế nào?
- Bạn có nốt ruồi mới, nốt ruồi đổi màu hoặc đổi kích thước, chảy máu, hoặc vết loét lâu không lành trên da?

Lựa chọn trả lời (theo thứ tự trên trang): Luôn bị bỏng nắng (đỏ, rát), không bao giờ rám · Thường bị bỏng nắng, rám rất ít · Đôi khi bỏng nắng nhẹ, rám dần và đều · Ít khi bỏng nắng, luôn rám dễ · Rất hiếm khi bỏng nắng, rám rất nhanh và sẫm · Không bao giờ bỏng nắng; da sẫm màu tự nhiên · Không · Có

### Chữ kết quả (lấy từ fitz.js)

- Loại I: Luôn bị bỏng nắng (đỏ, rát), không bao giờ rám. → Da bạn rất dễ bỏng nắng. Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.
- Loại II: Thường bị bỏng nắng, rám rất ít. → Da bạn dễ bỏng nắng. Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.
- Loại III: Đôi khi bỏng nắng nhẹ, rám dần và đều. → Da bạn vẫn có thể bỏng nắng, và tia UV góp phần làm da lão hóa sớm. Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.
- Loại IV: Ít khi bỏng nắng, luôn rám dễ. → Da bạn ít bỏng nắng nhưng tia UV vẫn góp phần làm da lão hóa sớm và sạm màu. Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.
- Loại V: Rất hiếm khi bỏng nắng, rám rất nhanh và sẫm. → Da bạn hiếm khi bỏng nắng, nhưng tia UV vẫn góp phần làm da lão hóa sớm và tăng sắc tố. Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.
- Loại VI: Không bao giờ bỏng nắng; da sẫm màu tự nhiên. → Da bạn hầu như không bỏng nắng, nhưng tia UV vẫn góp phần làm da lão hóa sớm và tăng sắc tố. Khi chỉ số UV từ 3 trở lên: hạn chế ra nắng giữa trưa, che chắn bằng mũ rộng vành, áo dài tay, kính râm, và dùng kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ hoặc sau khi bơi, ra nhiều mồ hôi.
- Dấu hiệu đỏ: Nốt ruồi mới, nốt ruồi đổi màu hoặc đổi kích thước, chảy máu, hoặc vết loét lâu không lành trên da là lý do nên khám da liễu sớm.
- Luôn hiện: Thang Fitzpatrick mô tả phản ứng của da với nắng, không phải màu da hay dân tộc, và không dùng để chẩn đoán bệnh da.

### Nguồn, disclaimer, FAQ

- Fitzpatrick TB. The validity and practicality of sun-reactive skin types I through VI. Arch Dermatol. 1988;124(6):869–871.
- World Health Organization. Global Solar UV Index: A Practical Guide. 2002 (che chắn khi chỉ số UV từ 3 trở lên).
- American Academy of Dermatology. Sunscreen FAQs (kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ).

**Disclaimer:** Kết quả chỉ phản ánh mô tả bạn tự chọn. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám da liễu. Nếu có nốt ruồi thay đổi, chảy máu, hoặc vết loét lâu lành, hãy đến cơ sở y tế.

- **Loại da Fitzpatrick có phải là màu da không?** Không hẳn. Thang được xây dựng theo cách da phản ứng với nắng (dễ bỏng hay dễ rám). Hai người cùng màu da có thể thuộc hai loại khác nhau.
- **Da tôi loại IV–VI thì có cần chống nắng không?** Có. Da sẫm màu ít bỏng nắng hơn nhưng tia UV vẫn góp phần làm da lão hóa sớm và tăng sắc tố. Nên che chắn khi chỉ số UV từ 3 trở lên.
- **Công cụ này có đánh giá ung thư da không?** Không. Công cụ chỉ xác định loại da theo phản ứng với nắng. Mọi nốt ruồi thay đổi hoặc vết loét lâu lành cần được bác sĩ da liễu khám.

---

## Ký duyệt

Ghi chú: ký sau khi các trang đã lên production ngày 30/09/2026.

| Mục | Kết luận (đồng ý / sửa / rút xuống) | Người ký | Ngày |
|---|---|---|---|
| 02 bản vá | | | |
| 04 | | | |
| 05 | | | |
| 06 | | | |
| 07 | | | |
| Mục 14 hồ sơ VSH-TOOL-03 | | | |
