import type { IconType } from 'react-icons';
import {
  IoBook,
  IoBriefcase,
  IoColorPalette,
  IoFingerPrint,
  IoGrid,
  IoLeaf,
  IoPlanet,
  IoSchool,
} from 'react-icons/io5';

/** The same eight categories, icons and colours as bookmart-app/src/components/ui/GenreSection.tsx. */
export interface Category {
  slug: string;
  label: string;
  icon: IconType;
  background: string;
  border: string;
  iconColor: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'fiction',
    label: 'Fiction',
    icon: IoPlanet,
    background: '#EFF6FF',
    border: '#DBEAFE',
    iconColor: '#2563EB',
  },
  {
    slug: 'academic',
    label: 'Academic',
    icon: IoSchool,
    background: '#F0FDF4',
    border: '#DCFCE7',
    iconColor: '#16A34A',
  },
  {
    slug: 'self-help',
    label: 'Self Help',
    icon: IoLeaf,
    background: '#ECFDF5',
    border: '#D1FAE5',
    iconColor: '#059669',
  },
  {
    slug: 'biography',
    label: 'Biography',
    icon: IoFingerPrint,
    background: '#FEF3C7',
    border: '#FDE68A',
    iconColor: '#D97706',
  },
  {
    slug: 'business',
    label: 'Business',
    icon: IoBriefcase,
    background: '#FDF4FF',
    border: '#FAE8FF',
    iconColor: '#9333EA',
  },
  {
    slug: 'literature',
    label: 'Literature',
    icon: IoBook,
    background: '#FFF7ED',
    border: '#FFEDD5',
    iconColor: '#EA580C',
  },
  {
    slug: 'comics',
    label: 'Comics',
    icon: IoColorPalette,
    background: '#FFF1F2',
    border: '#FFE4E6',
    iconColor: '#E11D48',
  },
  {
    slug: 'others',
    label: 'Others',
    icon: IoGrid,
    background: '#F8FAFC',
    border: '#E2E8F0',
    iconColor: '#475569',
  },
];

export function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

const ACADEMIC_HINTS = [
  'engineering',
  'exam',
  'science',
  'computer',
  'academic',
  'physics',
  'math',
];

/**
 * Whether a book with these genre names belongs in a category — the same rule the app's
 * GenreMasonryLayout uses: "Others" shows everything, books without genres show everywhere,
 * otherwise the names must overlap (Academic also covers engineering, exams, sciences…).
 */
export function matchesCategory(category: Category, genres: string[]) {
  const target = category.label.toLowerCase();
  if (category.slug === 'others') return true;
  if (genres.length === 0) return true;
  return genres.some((g) => {
    const name = g.toLowerCase();
    return (
      name.includes(target) ||
      target.includes(name) ||
      (category.slug === 'academic' && ACADEMIC_HINTS.some((hint) => name.includes(hint)))
    );
  });
}
