export function FeedbackListCard({
  title,
  items,
  marker,
  markerClass,
}: {
  title: string;
  items: string[];
  marker: string;
  markerClass: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="panel-glass p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-fg mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
            <span className={`flex-shrink-0 font-bold ${markerClass}`}>
              {marker}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
