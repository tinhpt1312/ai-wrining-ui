export const suggestionsMessages = {
  title: "Gợi ý sửa bài AI",
  description:
    "Xem các chỉnh sửa cụ thể, theo dõi thay đổi đã áp dụng và chạy lại AI khi bạn cập nhật bản nháp.",
  preview: {
    show: "Xem trước đã áp dụng",
    hide: "Ẩn xem trước",
    title: "Xem trước đã áp dụng",
    appliedCount: "{count} đã áp dụng",
    loading: "Đang tải xem trước...",
    loadFailed: "Không thể tải xem trước",
    original: "Bản gốc",
    refactored: "Đã chỉnh sửa",
  },
  analyze: {
    label: "Phân tích",
    loading: "Đang phân tích...",
    generate: "Tạo gợi ý",
  },
  focusAreas: "Lĩnh vực tập trung",
  stats: {
    total: "Tổng",
    open: "Chưa áp dụng",
    applied: "Đã áp dụng",
    highConfidence: "Độ tin cậy cao",
  },
  filters: {
    status: "Trạng thái",
    type: "Loại",
    severity: "Mức độ",
    allSeverity: "Tất cả mức độ",
    clear: "Xóa bộ lọc",
  },
  status: {
    open: "Chưa áp dụng",
    applied: "Đã áp dụng",
  },
  alert: {
    mutationFailed: "Thao tác gợi ý thất bại",
    updated: "Đã cập nhật",
    loadFailed: "Không tải được gợi ý",
    noStats: "Không có thống kê",
  },
  loading: "Đang tải gợi ý...",
  empty: {
    title: "Chưa có gợi ý",
    description:
      "Chạy phân tích AI để nhận các gợi ý cải thiện cụ thể cho bài viết này.",
  },
  noMatches: {
    title: "Không có gợi ý phù hợp",
    description: "Hãy điều chỉnh bộ lọc để xem thêm gợi ý.",
  },
  toast: {
    createdOne: "Đã tạo 1 gợi ý.",
    createdMany: "Đã tạo {count} gợi ý.",
    appliedToWriting: "Đã áp dụng gợi ý vào bài viết.",
    markedApplied: "Đã đánh dấu gợi ý là đã áp dụng.",
  },
  card: {
    applied: "Đã áp dụng",
    open: "Chưa áp dụng",
    createdAt: "Tạo lúc {datetime}",
    confidence: "Độ tin cậy",
    original: "Bản gốc",
    suggestion: "Gợi ý",
    noOriginal: "Không có văn bản gốc.",
    noSuggestion: "Không có văn bản gợi ý.",
    position: "Vị trí {start}-{end}",
    positionUnknown: "Không xác định được vị trí",
    markApplied: "Đánh dấu đã áp dụng",
    applyToWriting: "Áp dụng vào bài viết",
  },
} as const;
