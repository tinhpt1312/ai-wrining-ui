export const exportMessages = {
  writing: {
    button: "Xuất bài",
    docx: "Xuất Word (.docx)",
    pdf: "Xuất PDF",
    toast: {
      docx: 'Đã tải "{title}" (.docx)',
      pdf: 'Đã tải "{title}" (.pdf)',
      failed: "Không thể xuất bài viết. Vui lòng thử lại.",
    },
  },
  report: {
    button: "Xuất báo cáo",
    toast: {
      docx: "Đã tải báo cáo Word (.docx)",
      pdf: "Đã tải báo cáo PDF",
      failed: "Không thể xuất báo cáo. Vui lòng thử lại.",
    },
  },
  facebook: {
    label: "Chia sẻ Facebook",
    privateError:
      "Vui lòng đặt bài ở trạng thái Công khai trước khi chia sẻ lên Facebook.",
  },
} as const;
