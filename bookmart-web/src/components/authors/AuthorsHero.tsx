"use client";

export default function AuthorsHero() {
  return (
    <section className="mb-8 rounded-[20px] bg-white p-8 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-semibold text-primary mb-3">Check the</p>
          <h1 className="text-[40px] md:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            Authors
          </h1>
          <p className="text-base md:text-[20px] text-slate-500 leading-relaxed max-w-[520px]">
            Discover writers, poets, playwrights and more. Explore their books and works.
          </p>
        </div>

        <div className="hidden lg:flex items-end justify-end">
          <div className="relative w-64 h-48">
            <div className="absolute bottom-0 right-4 w-40 h-44 bg-slate-100 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
              <div className="text-4xl">📚</div>
            </div>
            <div className="absolute bottom-0 right-24 w-32 h-40 bg-slate-50 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
              <div className="text-3xl">📖</div>
            </div>
            <div className="absolute bottom-4 right-36 w-16 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
              <div className="text-2xl">🌿</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
