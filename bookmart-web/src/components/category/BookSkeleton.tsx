export default function BookSkeleton() {
  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white animate-pulse">
      <div className="relative aspect-[3/4] bg-gray-200">
        <div className="absolute left-3 top-3 h-7 w-20 rounded-full bg-gray-300" />

        <div className="absolute right-3 top-3 h-10 w-10 rounded-full bg-gray-300" />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="h-5 w-4/5 rounded bg-gray-300" />
          <div className="h-4 w-2/5 rounded bg-gray-200" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-7 w-20 rounded bg-gray-300" />
          <div className="h-5 w-16 rounded bg-gray-200" />
        </div>

        <div className="flex gap-2">
          <div className="h-7 w-24 rounded-full bg-gray-200" />
          <div className="h-7 w-28 rounded-full bg-gray-200" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-300" />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>

            <div className="h-12 w-12 rounded-xl bg-gray-300" />
          </div>
        </div>

        <div className="h-12 w-full rounded-xl bg-gray-300" />
      </div>
    </article>
  );
}
