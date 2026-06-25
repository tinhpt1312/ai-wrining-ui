const STEPS = [
  {
    step: "01",
    title: "Viết bài",
    description: "Tạo bài mới, chọn loại văn bản và soạn nội dung trong trình soạn thảo.",
  },
  {
    step: "02",
    title: "Chấm bằng AI",
    description: "Nhận điểm, nhận xét theo tiêu chí và danh sách điểm cần cải thiện.",
  },
  {
    step: "03",
    title: "Chữa & gợi ý",
    description: "Mở không gian chữa bài, áp dụng gợi ý AI và lưu từng phiên chỉnh sửa.",
  },
  {
    step: "04",
    title: "Chấm lại & tiến bộ",
    description: "So sánh điểm trước–sau, xem hành trình và chia sẻ bài khi sẵn sàng.",
  },
];

export function LandingSteps() {
  return (
    <section className="border-y border-border/60 bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Quy trình
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Bốn bước đơn giản
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STEPS.map((item, index) => (
            <li key={item.step} className="panel-glass relative p-5 sm:p-6">
              <span className="stat-value text-2xl font-bold text-primary/40">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 bg-primary/30 lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
