"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface AuthorBiographyProps {
  about: string;
}

export default function AuthorBiography({ about }: AuthorBiographyProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <h2 className="text-[22px] font-bold text-slate-900 mb-4">About</h2>
      <div className="relative">
        <p
          className={`text-base text-slate-600 leading-relaxed ${
            expanded ? "" : "line-clamp-5"
          }`}
        >
          {about}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline transition-colors"
        >
          {expanded ? (
            <>
              Read less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Read more <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
