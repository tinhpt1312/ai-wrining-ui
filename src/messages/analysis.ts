export const analysisMessages = {
  loading: "Đang tải kết quả chấm bài...",
  error: {
    loadDetailTitle: "Không tải được kết quả",
    loadDetailMessage: "Không thể lấy dữ liệu chấm bài. Vui lòng thử lại.",
    loadList: "Không thể tải danh sách chấm bài",
  },
  delete: {
    title: "Xóa kết quả chấm bài",
    description:
      "Bạn có chắc muốn xóa kết quả chấm bài này? Hành động này không thể hoàn tác.",
    confirm: "Xóa",
    success: "Đã xóa kết quả chấm bài",
    failed: "Không thể xóa kết quả chấm bài",
    deleting: "Đang xóa...",
    ariaLabel: "Xóa",
  },
  empty: {
    noFeedback: "Chưa có phản hồi cho lần chấm bài này.",
    noResults: "Chưa có kết quả chấm bài",
    noResultsDescription: "Hãy chấm một bài viết để xem phản hồi AI tại đây.",
    goToWritings: "Đến danh sách bài viết",
  },
  list: {
    title: "Kết quả chấm bài",
    description:
      "{count} lần chấm đã lưu — theo dõi tiến bộ qua từng báo cáo.",
    goToWritings: "Đến bài viết",
  },
  header: {
    reportLabel: "Báo cáo chấm bài AI",
    defaultTitle: "Bài viết đã chấm",
    gradedAt: "Chấm lúc {datetime}",
    revise: "Chữa bài",
    writing: "Bài viết",
    list: "Danh sách",
  },
  card: {
    reportTitle: "Báo cáo chấm bài",
    originalWriting: "Bài viết gốc",
    defaultSummary: "Đã có phản hồi AI cho bài viết này.",
    revise: "Chữa bài",
    detail: "Chi tiết",
  },
  scoreCompare: {
    title: "So sánh lần chấm",
    titleWithRevision: "So sánh lần chấm #{number}",
    before: "Trước",
    current: "Hiện tại",
    viewPrevious: "Xem lần chấm trước →",
  },
  feedback: {
    reportUnavailable: "Không hiển thị được báo cáo",
    reportUnavailableDescription:
      "Dữ liệu phản hồi không đúng định dạng. Hãy mở bài viết và chấm lại bằng AI để nhận báo cáo mới.",
    tabs: {
      overview: "Tổng quan",
      criteria: "Tiêu chí",
      sample: "Bài mẫu",
      compare: "So sánh",
    },
    criteria: {
      structure: "Bố cục & Tổ chức",
      clarity: "Rõ ràng & Diễn đạt",
      tone: "Giọng điệu & Phong cách",
      coherence: "Sự liên kết",
    },
    overallFeedback: "Nhận xét chung",
    strengths: "Điểm mạnh",
    areasForImprovement: "Cần cải thiện",
    actionItems: "Việc nên làm tiếp theo",
    startRevision: "Bắt đầu chữa bài",
    sample: {
      gateTitle: "Tự sửa trước khi xem bài mẫu",
      gateDescription:
        "Vào không gian chữa bài và tự chỉnh sửa ít nhất 50 ký tự trước khi xem bài mẫu — giúp bạn chủ động học hơn.",
      title: "Bài viết mẫu",
      description:
        "Phiên bản tham khảo áp dụng các gợi ý cải thiện — giúp bạn hình dung bài viết hoàn chỉnh hơn.",
      copy: "Sao chép",
      copySuccess: "Đã sao chép bài mẫu",
      reviseWithSample: "Chữa bài với bài mẫu",
    },
    compare: {
      gateTitle: "Tự sửa trước khi so sánh với bài mẫu",
      gateDescription:
        "Vào không gian chữa bài và tự chỉnh sửa ít nhất 50 ký tự trước khi xem so sánh chi tiết.",
    },
  },
  sampleComparison: {
    noSample: "Chưa có bài mẫu để so sánh.",
    title: "So sánh từng đoạn với bài mẫu",
    description:
      "Xem bài của bạn và bài mẫu song song — chú thích gợi ý cách cải thiện từng phần.",
    paragraph: "Đoạn {number}",
    yourWriting: "Bài của bạn",
    sampleWriting: "Bài mẫu",
    notAvailable: "(Chưa có)",
    none: "(Không có)",
    annotation: {
      opening:
        "Đoạn mở bài mẫu thường nêu luận điểm hoặc vấn đề rõ ràng hơn.",
      closing:
        "Kết bài mẫu tổng kết ý chính và có câu chốt mạch lạc.",
      default:
        "Bài mẫu diễn đạt cụ thể hơn và có liên kết giữa các ý.",
    },
    diff: {
      missingParagraph:
        "Bạn chưa có đoạn tương ứng — bài mẫu có thêm nội dung ở phần này.",
      similar:
        "Đoạn này khá gần với bài mẫu về cấu trúc câu.",
      changed:
        "Khác biệt chính: thêm {added} cụm từ, bớt {removed} cụm từ so với bài mẫu.",
    },
  },
  scoreProgress: {
    title: "Tiến bộ điểm số",
    subtitle: "{count} lần chấm · so với lần trước",
    attemptLabel: "L{number}",
  },
} as const;
