export const writingMessages = {
  type: {
    socialEssay: "Nghị luận xã hội",
    catholicEssay: "Nghị luận công giáo",
    shortStory: "Truyện ngắn",
    article: "Bài báo",
    deprecatedSuffix: "(không còn hỗ trợ tạo mới)",
  },
  status: {
    draft: "Bản Nháp",
    public: "Công Khai",
    draftFilter: "Bản nháp",
    publicFilter: "Công khai",
  },
  prompt: {
    defaultHint: "Viết bài theo đề bạn đã nhập.",
    difficulty: {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
      all: "Đa dạng độ khó",
    },
  },
} as const;
