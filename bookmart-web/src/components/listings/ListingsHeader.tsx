interface ListingsHeaderProps {
  title?: string;
  subtitle?: string;
}

export function ListingsHeader({
  title = "My Active Listings",
  subtitle = "Manage your listed books and track their performance.",
}: ListingsHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
      <p className="text-base text-slate-500 mt-2">{subtitle}</p>
    </header>
  );
}
