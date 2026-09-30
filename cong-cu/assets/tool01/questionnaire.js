/* Công cụ 01 — Dữ liệu bộ câu hỏi.
   RIGHTS_APPROVED = false: file này CỐ Ý không chứa câu hỏi nào (không bản gốc, không bản dịch, không diễn giải lại).
   Khi con người đã có văn bản cho phép, bộ câu hỏi bản quyền được chèn NGUYÊN VĂN vào ITEMS theo dạng
   { id: "Q01", constitution: "<khóa trong config.js>", reverse: <true|false>, text: "<nguyên văn>" }
   và thang trả lời vào SCALE, kèm questionnaireVersion trong config.js. Xem cong-cu/TOOL01-RELEASE-CHECKLIST.md. */
(function (root) {
  "use strict";
  var data = {
    licensed: false,
    ITEMS: [],
    SCALE: null,
    PLACEHOLDER: "Bộ câu hỏi chuẩn đang được hoàn thiện thủ tục quyền sử dụng. Công cụ hiện chưa mở cho người dùng.",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else root.VSHTool01Questionnaire = data;
})(this);
