export const dashboardMessages = {
  loading: {
    overview: "Đang tải tổng quan...",
    progress: "Đang tải tiến độ học viết...",
  },
  header: {
    title: "Tổng quan",
    description: "Chào mừng bạn quay lại — theo dõi tiến độ viết và chấm bài.",
    newWriting: "Viết bài mới",
  },
  stats: {
    totalWritings: "Tổng bài viết",
    totalWords: "Tổng số chữ",
    totalAnalyses: "Lần chấm bài",
    tokenUsed: "Token đã dùng",
    tokenUsage: "{used} / {limit}",
    tokenPercent: "{percent}%",
  },
  quickActions: {
    title: "Thao tác nhanh",
    newWriting: "Viết bài mới",
    practicePrompts: "Luyện với đề gợi ý",
    viewAnalysis: "Xem kết quả chấm",
    writingsList: "Danh sách bài viết",
    explore: "Khám phá cộng đồng",
  },
  progress: {
    eyebrow: "Tiến bộ học viết",
    title: "Theo dõi điểm số và thói quen luyện tập",
    practicePrompts: "Luyện với đề gợi ý",
    streak: "Chuỗi ngày viết",
    streakActive: "Ngày liên tiếp có hoạt động",
    streakEmpty: "Hãy viết hôm nay",
    graded: "Lần chấm có điểm",
    trend: "Xu hướng điểm",
    recentAverage: "TB gần đây: {score}/10",
    chartTitle: "Biểu đồ điểm qua các lần chấm",
    chartEmpty:
      "Chấm ít nhất 2 bài để xem biểu đồ tiến bộ. Hãy tạo bài mới và chấm bằng AI.",
    criteriaTitle: "Tiêu chí cần luyện thêm",
    priorityBadge: "Ưu tiên luyện tập",
    criteriaEmpty:
      "Chưa đủ dữ liệu chấm bài. Hãy chấm bài để nhận phân tích tiêu chí.",
    scoreOutOf: "{score}/10",
    noData: "—",
    criteria: {
      structure: "Bố cục",
      clarity: "Diễn đạt",
      tone: "Giọng điệu",
      coherence: "Liên kết",
    },
  },
  token: {
    title: "Hạn mức token hôm nay",
    resetAt: "Làm mới {date}",
    used: "đã dùng",
    tokenCount: "{count} token",
    description:
      "Token dùng cho chấm bài AI và gợi ý sửa. Dùng hết hạn mức thì chờ đến thời điểm làm mới.",
  },
  recentWritings: {
    title: "Bài viết gần đây",
    viewAll: "Xem tất cả",
    wordCount: "{count} chữ",
    empty: "Chưa có bài viết nào",
  },
} as const;
