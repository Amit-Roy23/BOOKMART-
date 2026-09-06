import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({
  items,
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-6 flex flex-wrap items-center gap-2 text-sm",
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-gray-500 transition-colors duration-200 hover:text-emerald-600"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast
                    ? "font-semibold text-gray-900"
                    : "font-medium text-gray-500"
                )}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight
                size={16}
                className="text-gray-400"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
