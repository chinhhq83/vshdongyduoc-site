/* Công cụ 01 — Tự đánh giá thể chất Đông y. CẤU HÌNH DUY NHẤT cho cổng pháp lý / y khoa và ngưỡng phân loại.
   Chỉ con người được đổi rightsApproved và medicalContentReviewed. Không suy ra quyền sử dụng từ việc bài báo
   đã công bố, giấy phép open-access, lịch sử Git hay bình luận. */
(function (root) {
  "use strict";

  var RIGHTS_APPROVED = false;           // quyền đăng bộ câu hỏi CCMQ bản tiếng Việt lên web: CHƯA có
  var MEDICAL_CONTENT_REVIEWED = false;  // nội dung kết quả / lời khuyên lối sống: CHƯA được người duyệt y khoa ký

  // HUMAN VERIFICATION REQUIRED:
  // Confirm scoring thresholds and item mappings against the exact licensed CCMQ version
  // before RIGHTS_APPROVED may be set to true.
  var THRESHOLDS = {
    balanced: {
      minScore: 60,          // điểm thể Bình hòa tối thiểu
      definiteBiasedMax: 30, // "Là": mọi thể lệch phải < 30
      basicBiasedMax: 40,    // "Cơ bản là": mọi thể lệch phải < 40
    },
    biased: {
      definiteMin: 40,       // "Là": điểm >= 40
      tendencyMin: 30,       // "Có xu hướng": 30 <= điểm < 40
    },
  };

  var CONSTITUTIONS = ["balanced", "qi_deficiency", "yang_deficiency", "yin_deficiency", "phlegm_dampness",
    "damp_heat", "blood_stasis", "qi_stagnation", "inherited_special"];

  var instrumentMetadata = {
    instrument: "CCMQ",
    language: "vi",
    questionnaireVersion: null,
    validationReference: "Vietnamese validation publication, 2022",
    rightsApproved: RIGHTS_APPROVED,
    rightsApprovedBy: null,
    rightsApprovalDate: null,
    medicalContentReviewed: MEDICAL_CONTENT_REVIEWED,
    medicalReviewer: null,
    medicalReviewDate: null,
  };

  var TOOL01_CONFIG = {
    rightsApproved: RIGHTS_APPROVED,
    medicalContentReviewed: MEDICAL_CONTENT_REVIEWED,
    // Suy ra, không đặt tay: chỉ mở bài tự đánh giá thật khi CẢ HAI cổng đã được con người mở.
    publicAssessmentEnabled: RIGHTS_APPROVED && MEDICAL_CONTENT_REVIEWED,
    instrumentVersion: null,
    thresholds: THRESHOLDS,
    constitutions: CONSTITUTIONS,
    instrumentMetadata: instrumentMetadata,
    answerMin: 1,
    answerMax: 5,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = TOOL01_CONFIG;
  else root.VSHTool01Config = TOOL01_CONFIG;
})(this);
