import { ReactNode } from "react";

interface CategoryIconProps {
  id: string;
  className?: string;
}

const ICONS: Record<string, ReactNode> = {
  romance: (
    <>
      <path d="M12 6c-1.7-1.9-4.6-.8-3.9 1.5.5 1.6 2.3 3 3.9 4.1 1.6-1.1 3.4-2.5 3.9-4.1C16.6 5.2 13.7 4.1 12 6Z" />
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5Z" />
      <path d="M20 5.5C20 4.7 19.3 4 18.5 4H13v15h5.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </>
  ),
  "science-fiction": (
    <>
      <path d="M12 3c2.5 1.2 4 4.2 4 8 0 2-.8 4-1.8 5.4V19l-2.2-1.3L10.8 19v-2.6C9.8 15 9 13 9 11c0-3.8 1.5-6.8 3-8Z" />
      <circle cx="12" cy="10" r="1.4" />
      <path d="M9 13.5 6.5 16c1 1.1 2.4 1.6 3.8.4M15 13.5 17.5 16c-1 1.1-2.4 1.6-3.8.4" />
    </>
  ),
  "self-help": (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z" />
      <path d="M12 13c0-2.5-1.8-4.5-4.5-4.5C7.5 11 9.3 13 12 13Z" />
    </>
  ),
  business: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12h17" />
    </>
  ),
  biographies: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
    </>
  ),
  history: (
    <>
      <path d="M7 4h10" />
      <path d="M7 20h10" />
      <path d="M8 4c0 4 3 5 3 8s-3 4-3 8M16 4c0 4-3 5-3 8s3 4 3 8" />
    </>
  ),
  academic: (
    <>
      <path d="M12 5 3 9l9 4 9-4-9-4Z" />
      <path d="M6.5 11v4c0 1.3 2.5 2.5 5.5 2.5s5.5-1.2 5.5-2.5v-4" />
      <path d="M21 9v4" />
    </>
  ),
  comics: (
    <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 19 15H9l-4 3.5V15H5a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 5 5Z" />
  ),
  children: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="8.5" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  cooking: (
    <>
      <path d="M7 3v7a2 2 0 0 0 4 0V3" />
      <path d="M9 3v18" />
      <path d="M16 3c-1.5 0-2.5 2-2.5 4.5S14.5 12 16 12V3Z" />
      <path d="M18.5 3v18" />
    </>
  ),
  travel: <path d="M3 13l18-7-7 18-2.5-7.5L3 13Z" />,
  art: (
    <>
      <path d="M12 4a8 8 0 1 0 0 16c1 0 1.5-.8 1.5-1.5 0-.5-.3-.8-.3-1.3 0-.6.5-1.2 1.2-1.2H16a4 4 0 0 0 4-4c0-3.3-3.6-8-8-8Z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16" cy="10" r="1" />
    </>
  ),
};

export function CategoryIcon({ id, className }: CategoryIconProps) {
  const paths = ICONS[id] ?? ICONS["self-help"];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
