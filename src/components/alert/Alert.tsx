import { cn } from "@/lib/utils";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const styles = {
    success: "bg-success-soft border-success/20 text-success",
    error: "bg-error-soft border-error/20 text-error",
    warning: "bg-warning-soft border-warning/20 text-warning",
    info: "bg-info-soft border-info/20 text-info",
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-xl flex items-start justify-between gap-4",
        styles[type],
      )}
    >
      <div className="flex flex-col gap-0.5">
        {title && <h4 className="font-semibold text-sm">{title}</h4>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity shrink-0"
          aria-label="Đóng"
        >
          ✕
        </button>
      )}
    </div>
  );
}
