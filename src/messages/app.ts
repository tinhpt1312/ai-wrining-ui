export const appMessages = {
  name: "Viết & Chấm Văn",
  tagline: "AI Writing",
  meta: {
    title: "Viết & Chấm Văn",
    description: "Viết văn và nhận phản hồi chấm bài bằng AI",
  },
  landingMeta: {
    title: "Viết & Chấm Văn — Luyện viết & chấm bài bằng AI",
    description:
      "Nền tảng viết văn thông minh: soạn bài, nhận phản hồi AI, chữa bài theo gợi ý và theo dõi tiến bộ từng lần chỉnh sửa.",
    ogTitle: "Viết & Chấm Văn",
    ogDescription:
      "Luyện viết, chấm bài AI và cải thiện từng bài một cách có hệ thống.",
  },
  footer: "© {year} Viết & Chấm Văn — Luyện viết & phản hồi AI",
  pageTitle: "{title} | Viết & Chấm Văn",
  share: {
    analysis: {
      scoredTitle: "{title} — Điểm {score}/10",
      unavailableTitle: "Kết quả chấm bài không khả dụng",
      unavailableDescription:
        "Kết quả chấm bài này không tồn tại hoặc bài viết chưa được đặt công khai.",
    },
    writing: {
      unavailableTitle: "Bài viết không khả dụng",
      unavailableDescription:
        "Bài viết này không tồn tại hoặc chưa được đặt ở trạng thái công khai.",
      twitterDescription: "{author} — {description}",
    },
  },
} as const;
