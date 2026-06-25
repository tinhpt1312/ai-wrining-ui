import { WritingType } from "@/types/api";
import { isActiveWritingType } from "../constants/active-writing-types";

export type PromptDifficulty = "dễ" | "trung bình" | "khó";

export interface WritingPrompt {
  id: string;
  type: WritingType;
  title: string;
  topic: string;
  hint: string;
  difficulty: PromptDifficulty;
  starterContent: string;
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  // Bài luận xã hội
  {
    id: "social-1",
    type: WritingType.SOCIAL_ESSAY,
    title: "Vai trò của gia đình trong xã hội hiện đại",
    topic: "Vai trò của gia đình trong xã hội hiện đại",
    hint: "Nêu khái niệm, phân tích vai trò giáo dục – tinh thần – kinh tế, đưa ví dụ và kết luận.",
    difficulty: "dễ",
    starterContent:
      "Trong bối cảnh xã hội hiện đại đầy biến động, gia đình vẫn giữ vai trò quan trọng...\n\n",
  },
  {
    id: "social-2",
    type: WritingType.SOCIAL_ESSAY,
    title: "Ảnh hưởng của mạng xã hội đến giới trẻ",
    topic: "Ảnh hưởng của mạng xã hội đến giới trẻ",
    hint: "Luận theo hai mặt tích cực – tiêu cực, có dẫn chứng cụ thể.",
    difficulty: "trung bình",
    starterContent:
      "Mạng xã hội đã trở thành phần không thể thiếu trong đời sống giới trẻ...\n\n",
  },
  {
    id: "social-3",
    type: WritingType.SOCIAL_ESSAY,
    title: "Lòng yêu nước trong thời đại toàn cầu hóa",
    topic: "Lòng yêu nước trong thời đại toàn cầu hóa",
    hint: "Định nghĩa lòng yêu nước, phân tích biểu hiện và thách thức hiện nay.",
    difficulty: "trung bình",
    starterContent:
      "Toàn cầu hóa mở ra nhiều cơ hội nhưng cũng đặt ra câu hỏi về bản sắc và lòng yêu nước...\n\n",
  },
  {
    id: "social-4",
    type: WritingType.SOCIAL_ESSAY,
    title: "Đạo đức trong kinh doanh",
    topic: "Đạo đức trong kinh doanh",
    hint: "Nêu vấn đề, phân tích nguyên nhân và đề xuất giải pháp.",
    difficulty: "khó",
    starterContent:
      "Kinh doanh không chỉ là hành trình tìm kiếm lợi nhuận mà còn là thử thách về đạo đức...\n\n",
  },
  {
    id: "social-5",
    type: WritingType.SOCIAL_ESSAY,
    title: "Giá trị của sự trung thực",
    topic: "Giá trị của sự trung thực",
    hint: "Mở bài bằng ví dụ, thân bài phân tích ý nghĩa, kết bài khẳng định.",
    difficulty: "dễ",
    starterContent: "Trung thực là một trong những phẩm chất nền tảng của con người...\n\n",
  },
  {
    id: "social-6",
    type: WritingType.SOCIAL_ESSAY,
    title: "Trách nhiệm của người trẻ với môi trường",
    topic: "Trách nhiệm của người trẻ với môi trường",
    hint: "Liên hệ thực trạng, nêu hành động cụ thể người trẻ có thể làm.",
    difficulty: "trung bình",
    starterContent:
      "Biến đổi khí hậu và ô nhiễm môi trường đang là thách thức cấp bách...\n\n",
  },
  // Bài luận công giáo
  {
    id: "catholic-1",
    type: WritingType.CATHOLIC_ESSAY,
    title: "Tình yêu thương trong đời sống Kitô hữu",
    topic: "Tình yêu thương trong đời sống Kitô hữu",
    hint: "Dựa trên Lời Chúa, liên hệ đời sống thực tế hằng ngày.",
    difficulty: "dễ",
    starterContent:
      "Tình yêu thương là trọng tâm của đức tin Công giáo và là nền tảng của đời sống Kitô hữu...\n\n",
  },
  {
    id: "catholic-2",
    type: WritingType.CATHOLIC_ESSAY,
    title: "Giá trị của sự cầu nguyện",
    topic: "Giá trị của sự cầu nguyện",
    hint: "Giải thích cầu nguyện là gì, vai trò và cách sống cầu nguyện.",
    difficulty: "dễ",
    starterContent:
      "Cầu nguyện là khoảnh khắc con người lắng đọng để trò chuyện với Chúa...\n\n",
  },
  {
    id: "catholic-3",
    type: WritingType.CATHOLIC_ESSAY,
    title: "Sống đức tin giữa thế giới hiện đại",
    topic: "Sống đức tin giữa thế giới hiện đại",
    hint: "Nêu thách thức, chia sẻ cách sống đức tin chân thực.",
    difficulty: "trung bình",
    starterContent:
      "Thế giới hiện đại với nhiều cám dỗ khiến việc sống đức tin không còn dễ dàng...\n\n",
  },
  {
    id: "catholic-4",
    type: WritingType.CATHOLIC_ESSAY,
    title: "Lòng bác ái với người nghèo",
    topic: "Lòng bác ái với người nghèo",
    hint: "Tham chiếu Tin Mừng, phân tích ý nghĩa và việc làm cụ thể.",
    difficulty: "trung bình",
    starterContent:
      "Lòng bác ái với người nghèo là dấu chỉ đích thực của đức tin sống động...\n\n",
  },
  {
    id: "catholic-5",
    type: WritingType.CATHOLIC_ESSAY,
    title: "Gia đình là tế bào của xã hội và Giáo hội",
    topic: "Gia đình là tế bào của xã hội và Giáo hội",
    hint: "Phân tích vai trò gia đình Công giáo trong giáo dục đức tin.",
    difficulty: "khó",
    starterContent:
      "Giáo hội luôn nhấn mạnh gia đình là tế bào đầu tiên và quan trọng nhất...\n\n",
  },
  {
    id: "catholic-6",
    type: WritingType.CATHOLIC_ESSAY,
    title: "Hy vọng trong những lúc thử thách",
    topic: "Hy vọng trong những lúc thử thách",
    hint: "Kể câu chuyện cá nhân hoặc tấm gương, rút ra bài học đức tin.",
    difficulty: "trung bình",
    starterContent:
      "Khi đối diện với thử thách, hy vọng trở thành ngọn đèn soi đường cho tâm hồn...\n\n",
  },
  // Truyện ngắn
  {
    id: "story-1",
    type: WritingType.SHORT_STORY,
    title: "Bức thư chưa gửi",
    topic: "Bức thư chưa gửi",
    hint: "Xây dựng nhân vật, xung đột và cái kết bất ngờ.",
    difficulty: "trung bình",
    starterContent:
      "Trên bàn học, tờ giấy đã được gấp cẩn thận suốt ba lần. Hùng chưa dám bỏ vào phong bì...\n\n",
  },
  {
    id: "story-2",
    type: WritingType.SHORT_STORY,
    title: "Ngày mưa cuối hè",
    topic: "Ngày mưa cuối hè",
    hint: "Dùng không khí và chi tiết cảm xúc để dẫn dắt câu chuyện.",
    difficulty: "dễ",
    starterContent:
      "Cơn mưa đầu mùa rơi lộp độp trên mái tôn, mang theo mùi đất thơm của ký ức...\n\n",
  },
  {
    id: "story-3",
    type: WritingType.SHORT_STORY,
    title: "Chiếc đồng hồ của ông",
    topic: "Chiếc đồng hồ của ông",
    hint: "Gắn vật kỷ niệm với thông điệp về thời gian và tình thương.",
    difficulty: "trung bình",
    starterContent:
      "Chiếc đồng hồ cũ vẫn nằm im trên kệ, kim giờ đã ngừng từ lâu nhưng ký ức thì chưa...\n\n",
  },
  {
    id: "story-4",
    type: WritingType.SHORT_STORY,
    title: "Hành lang lúc nửa đêm",
    topic: "Hành lang lúc nửa đêm",
    hint: "Tạo không khí hồi hộp, để cao trào ở cuối truyện.",
    difficulty: "khó",
    starterContent:
      "Tiếng đèn huỳnh quang rít lên đều đều, là âm thanh duy nhất trong hành lang tối om...\n\n",
  },
  {
    id: "story-5",
    type: WritingType.SHORT_STORY,
    title: "Món quà nhỏ",
    topic: "Món quà nhỏ",
    hint: "Tập trung vào chi tiết nhỏ thể hiện tình cảm lớn.",
    difficulty: "dễ",
    starterContent:
      "Gói quà nhỏ xíu được bọc bằng giấy báo cũ, nhưng đôi tay đưa nó lại run run...\n\n",
  },
  {
    id: "story-6",
    type: WritingType.SHORT_STORY,
    title: "Chuyến xe đêm",
    topic: "Chuyến xe đêm",
    hint: "Hai nhân vật gặp nhau trên chuyến xe, cuộc trò chuyện thay đổi suy nghĩ.",
    difficulty: "trung bình",
    starterContent:
      "Chuyến xe khuya chỉ còn vài hành khách. Ngoài kia, đèn đường lướt qua như những vệt sáng vội vã...\n\n",
  },
  // Bài báo
  {
    id: "article-1",
    type: WritingType.ARTICLE,
    title: "Xu hướng đọc sách của giới trẻ",
    topic: "Xu hướng đọc sách của giới trẻ",
    hint: "Mở đầu thu hút, thân bài có số liệu/góc nhìn, kết có khuyến nghị.",
    difficulty: "trung bình",
    starterContent:
      "Trong kỷ nguyên số, thói quen đọc sách của giới trẻ đang có những chuyển biến đáng chú ý...\n\n",
  },
  {
    id: "article-2",
    type: WritingType.ARTICLE,
    title: "Lợi ích của việc tập thể dục buổi sáng",
    topic: "Lợi ích của việc tập thể dục buổi sáng",
    hint: "Trình bày theo góc nhìn phóng viên, có ví dụ thực tế.",
    difficulty: "dễ",
    starterContent:
      "Nhiều người bắt đầu ngày mới bằng vài động tác thể dục nhẹ — và nhận thấy sự thay đổi rõ rệt...\n\n",
  },
  {
    id: "article-3",
    type: WritingType.ARTICLE,
    title: "An toàn thông tin cho học sinh",
    topic: "An toàn thông tin cho học sinh",
    hint: "Nêu vấn đề, phân tích nguy cơ, đưa khuyến cáo cụ thể.",
    difficulty: "trung bình",
    starterContent:
      "Internet mang lại kho tài liệu khổng lồ nhưng cũng tiềm ẩn nhiều rủi ro với học sinh...\n\n",
  },
  {
    id: "article-4",
    type: WritingType.ARTICLE,
    title: "Văn hóa đọc trong trường học",
    topic: "Văn hóa đọc trong trường học",
    hint: "Phỏng vấn tưởng tượng, số liệu minh họa, lời kêu gọi hành động.",
    difficulty: "khó",
    starterContent:
      "Xây dựng văn hóa đọc trong trường học không chỉ là treo khẩu hiệu trên tường...\n\n",
  },
  {
    id: "article-5",
    type: WritingType.ARTICLE,
    title: "Ẩm thực địa phương và bản sắc",
    topic: "Ẩm thực địa phương và bản sắc",
    hint: "Kể chuyện qua món ăn, liên hệ văn hóa và con người.",
    difficulty: "dễ",
    starterContent:
      "Mỗi món ăn địa phương đều mang trong mình một câu chuyện về đất trời và con người nơi đó...\n\n",
  },
  {
    id: "article-6",
    type: WritingType.ARTICLE,
    title: "Ứng dụng AI trong giáo dục",
    topic: "Ứng dụng AI trong giáo dục",
    hint: "Cân bằng ưu – nhược điểm, nêu quan điểm rõ ràng.",
    difficulty: "khó",
    starterContent:
      "Trí tuệ nhân tạo đang len lỏi vào lớp học với tốc độ chưa từng có...\n\n",
  },
];

export const PROMPT_DIFFICULTY_LABELS: Record<PromptDifficulty, string> = {
  dễ: "Dễ",
  "trung bình": "Trung bình",
  khó: "Khó",
};

export function getPromptsByType(type?: WritingType): WritingPrompt[] {
  const activePrompts = WRITING_PROMPTS.filter((prompt) =>
    isActiveWritingType(prompt.type),
  );
  if (!type) return activePrompts;
  return activePrompts.filter((prompt) => prompt.type === type);
}
