interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-brand-700">
          <span className="text-base">{current}</span>
          <span className="text-slate-400"> / {total}</span>
        </span>
        <span className="text-xs font-medium text-slate-500">{percent}%</span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`총 ${total}문항 중 ${current}번째 문항, ${percent}퍼센트 진행`}
        aria-label="설문 진행률"
        className="h-2 w-full overflow-hidden rounded-full bg-brand-100"
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
