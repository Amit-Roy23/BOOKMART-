import { formatPrice } from "@/lib/utils";

interface PlanDetailsProps {
  planName: string;
  boostLimit: number;
  durationDays: number;
  price: number;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-sm font-bold text-slate-900 mt-0.5">{value}</dd>
    </div>
  );
}

export function PlanDetails({ planName, boostLimit, durationDays, price }: PlanDetailsProps) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
      <Detail label="Selected Plan" value={planName} />
      <Detail label="Boost Limit" value={`${boostLimit} books / day`} />
      <Detail label="Duration" value={`${durationDays} Days`} />
      <Detail label="Price" value={formatPrice(price)} />
    </dl>
  );
}
