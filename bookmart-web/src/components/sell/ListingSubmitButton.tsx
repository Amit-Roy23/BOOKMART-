"use client";

export default function ListingSubmitButton({
  isSubmitting,
  isValid,
}: {
  isSubmitting: boolean;
  isValid: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting}
      className="h-14 w-full inline-flex items-center justify-center gap-2 rounded-[12px] bg-brand-primary px-6 py-3 text-base font-bold text-white transition-all duration-200 hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,128,128,0.25)]"
    >
      {isSubmitting ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Listing...
        </>
      ) : (
        "List Your Book"
      )}
    </button>
  );
}
