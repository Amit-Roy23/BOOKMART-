"use client";

interface NearbyHeroProps {
  location: string;
}

export default function NearbyHero({ location }: NearbyHeroProps) {
  return (
    <section className="mb-8 rounded-[20px] bg-white p-8 md:p-12">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-[520px]">
          <h1 className="text-[40px] md:text-[52px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            Find Books Near You
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Great books.
            <br />
            Nearby sellers.
            <br />
            Amazing deals.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            📍 {location}
          </p>
        </div>
      </div>
    </section>
  );
}
