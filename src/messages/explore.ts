export const exploreMessages = {
  loading: "Đang tải bài viết công khai...",
  error: {
    title: "Không tải được danh sách",
    message: "Không thể lấy bài viết công khai. Vui lòng thử lại.",
  },
  page: {
    description: "{total} bài viết công khai từ cộng đồng",
  },
  search: {
    placeholder: "Tìm tiêu đề, nội dung...",
    ariaLabel: "Tìm kiếm bài viết",
    submit: "Tìm kiếm",
  },
  filter: {
    sectionTitle: "Lọc theo loại bài",
    resultsFor: 'Kết quả cho "{query}"',
  },
  empty: {
    title: "Chưa có bài viết phù hợp",
    filteredDescription: "Thử đổi từ khóa hoặc chọn loại bài khác.",
    defaultDescription:
      "Hãy chia sẻ bài viết của bạn ở chế độ Công khai để cộng đồng tham khảo.",
  },
  card: {
    readButton: "Đọc bài",
  },
  userProfile: {
    loading: "Đang tải hồ sơ...",
    error: {
      title: "Không tìm thấy người dùng",
      message: "Tài khoản này không tồn tại hoặc đã bị vô hiệu hóa.",
    },
    publicWritingsTitle: "Bài viết công khai",
    writingsCount: "{count} bài",
    writingsLoading: "Đang tải bài viết...",
    emptyTitle: "Chưa có bài công khai",
    emptyDescription:
      "Người dùng này chưa chia sẻ bài viết nào ở chế độ công khai.",
    publicWritingsLabel: "bài công khai",
    joinedAt: "Tham gia {date}",
  },
  publicBanner: {
    title: "Bài viết công khai",
    description: "Bạn đang đọc bài được chia sẻ bởi thành viên khác.",
  },
} as const;
