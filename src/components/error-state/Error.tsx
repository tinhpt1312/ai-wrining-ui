"use client";

interface ErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function Error({ title = "Đã xảy ra lỗi", message, retry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-error-soft border border-error/20 rounded-xl text-center">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-error">{title}</h3>
        <p className="text-sm text-fg/85">{message}</p>
      </div>
      {retry && (
        <button
          onClick={retry}
          className="px-4 h-9 bg-error text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
