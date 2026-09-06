import { BookOpen, Users, Building2, ShoppingBag, TrendingUp } from "lucide-react";

const STATISTICS = [
  { value: "20K+", label: "Books Listed", icon: BookOpen, color: "text-teal-primary" },
  { value: "5K+", label: "Students", icon: Users, color: "text-blue-500" },
  { value: "150+", label: "Colleges", icon: Building2, color: "text-purple-500" },
  { value: "12K+", label: "Successful Sales", icon: ShoppingBag, color: "text-amber-500" },
];

export function StatisticsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20" aria-label="Platform statistics">
      <div className="bg-white rounded-2xl p-8 lg:p-12 border border-slate-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATISTICS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}