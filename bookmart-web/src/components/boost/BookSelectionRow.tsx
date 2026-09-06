import { memo } from "react";
import Image from "next/image";
import { Check, Rocket } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { BoostBook } from "@/types/boost";

interface BookSelectionRowProps {
  book: BoostBook;
  selected: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
}

function BookSelectionRowBase({ book, selected, disabled, onToggle }: BookSelectionRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
      <div className="relative w-[60px] h-[80px] rounded-lg overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover"
          sizes="60px"
          loading="lazy"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-slate-900 truncate">{book.title}</h3>
        <p className="text-xs text-slate-400 truncate">{book.author}</p>
        <p className="text-sm font-extrabold text-slate-900 mt-1">{formatPrice(book.price)}</p>
      </div>

      {book.boosted ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold px-2.5 py-1">
          <Rocket className="w-3 h-3" aria-hidden="true" />
          Boosted
        </span>
      ) : (
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={`Select ${book.title} to boost`}
          disabled={disabled}
          onClick={() => onToggle(book.id)}
          className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
            selected
              ? "bg-brand-primary border-brand-primary text-white"
              : "border-slate-300 bg-white hover:border-brand-primary"
          } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {selected && <Check className="w-4 h-4" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

export const BookSelectionRow = memo(BookSelectionRowBase);
