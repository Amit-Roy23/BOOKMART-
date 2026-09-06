interface WhyReadCardProps {
  points: string[];
}

export default function WhyReadCard({ points }: WhyReadCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="text-lg font-bold text-slate-900 mb-3">Why read this book?</h3>
      <ul className="space-y-2.5">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary mt-0.5">
              {index + 1}
            </span>
            <p className="text-sm text-slate-600 leading-relaxed">{point}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
