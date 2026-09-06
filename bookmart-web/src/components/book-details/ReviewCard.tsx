import { Star, MoreVertical, BadgeCheck } from "lucide-react";

interface ReviewCardProps {
  reviewerName: string;
  rating: number;
  reviewText: string;
  date: string;
  verifiedPurchase?: boolean;
}

export default function ReviewCard({
  reviewerName,
  rating,
  reviewText,
  date,
  verifiedPurchase = false,
}: ReviewCardProps) {
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
            {reviewerName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-900">{reviewerName}</p>
              {verifiedPurchase && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck size={10} />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">{date}</span>
          <button className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{reviewText}</p>
    </div>
  );
}
