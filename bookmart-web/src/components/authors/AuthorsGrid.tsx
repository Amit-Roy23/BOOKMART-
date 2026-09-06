"use client";

import AuthorCard from "./AuthorCard";

interface AuthorsGridProps {
  authors: { id: string; name: string; slug: string; avatar: string; bio: string; bookCount: number; category: string }[];
}

export default function AuthorsGrid({ authors }: AuthorsGridProps) {
  if (authors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
  );
}
