interface BoostProgressBarProps {
  value: number;
  max: number;
}

export function BoostProgressBar({ value, max }: BoostProgressBarProps) {
  const percent = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div
      className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-brand-primary transition-[width] duration-200 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
