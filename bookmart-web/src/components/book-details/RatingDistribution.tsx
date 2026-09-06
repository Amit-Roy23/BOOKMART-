interface RatingDistributionProps {
  average: number;
  totalRatings: number;
  totalReviews: number;
  distribution: { stars: number; percentage: number }[];
}

export default function RatingDistribution({
  average,
  totalRatings,
  totalReviews,
  distribution,
}: RatingDistributionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="text-center shrink-0">
          <p className="text-[40px] font-extrabold text-slate-900 leading-none">{average}</p>
          <div className="flex items-center justify-center gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= Math.round(average) ? "text-yellow-400" : "text-slate-300"}
              >
                ★
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">{totalReviews} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-600 w-8">
                {item.stars} ★
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-10 text-right font-medium">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Based on {totalRatings.toLocaleString()} ratings
      </p>
    </div>
  );
}
