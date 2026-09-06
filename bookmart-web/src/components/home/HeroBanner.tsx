'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Slide = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  images: { src: string; alt: string; className: string }[];
};

const SLIDES: Slide[] = [
  {
    title: 'Explore Thousands of Affordable Books',
    subtitle:
      'Discover second-hand books from students in your college and nearby. Save money while building your personal library with quality pre-loved books.',
    cta: 'Browse Books',
    href: '/categories',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        alt: 'Featured book',
        className:
          'absolute inset-0 bg-white rounded-2xl shadow-2xl transform rotate-[-5deg] border border-slate-100',
      },
      {
        src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
        alt: 'Featured book 2',
        className:
          'absolute top-4 -right-4 w-32 h-44 bg-white rounded-2xl shadow-xl transform rotate-[8deg] border border-slate-100 opacity-90',
      },
      {
        src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=350',
        alt: 'Featured book 3',
        className:
          'absolute -bottom-2 -left-4 w-28 h-36 bg-white rounded-2xl shadow-lg transform rotate-[12deg] border border-slate-100 opacity-75',
      },
    ],
  },
  {
    title: 'Sell Your Books in Minutes',
    subtitle:
      'Turn your old textbooks into cash. List a book with a photo and price, and connect with buyers right on your campus.',
    cta: 'Start Selling',
    href: '/sell',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        alt: 'Books for sale',
        className:
          'absolute inset-0 bg-white rounded-2xl shadow-2xl transform rotate-[-4deg] border border-slate-100',
      },
      {
        src: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        alt: 'Featured book 2',
        className:
          'absolute top-4 -right-4 w-32 h-44 bg-white rounded-2xl shadow-xl transform rotate-[7deg] border border-slate-100 opacity-90',
      },
      {
        src: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=350',
        alt: 'Featured book 3',
        className:
          'absolute -bottom-2 -left-4 w-28 h-36 bg-white rounded-2xl shadow-lg transform rotate-[14deg] border border-slate-100 opacity-75',
      },
    ],
  },
  {
    title: 'Find Books From Your College',
    subtitle:
      'Browse listings from students around you. Pick up books nearby, meet fellow readers, and grow your shelf together.',
    cta: 'Explore Nearby',
    href: '/nearby',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        alt: 'College books',
        className:
          'absolute inset-0 bg-white rounded-2xl shadow-2xl transform rotate-[-6deg] border border-slate-100',
      },
      {
        src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        alt: 'Featured book 2',
        className:
          'absolute top-4 -right-4 w-32 h-44 bg-white rounded-2xl shadow-xl transform rotate-[9deg] border border-slate-100 opacity-90',
      },
      {
        src: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=350',
        alt: 'Featured book 3',
        className:
          'absolute -bottom-2 -left-4 w-28 h-36 bg-white rounded-2xl shadow-lg transform rotate-[11deg] border border-slate-100 opacity-75',
      },
    ],
  },
];

const AUTOPLAY_MS = 3000;

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goTo = useCallback(
    (index: number) => setCurrentSlide((index + SLIDES.length) % SLIDES.length),
    []
  );

  const next = useCallback(() => setCurrentSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setCurrentSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="px-4 md:px-6 mt-6 pb-1" aria-label="Featured promotions">
      <div className="relative max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-teal-primary/10 to-teal-primary/5 rounded-2xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full flex flex-col lg:flex-row items-center h-[350px] lg:h-[380px]"
                aria-hidden={i !== currentSlide}
              >
                <div className="flex-1 lg:flex-[3] pl-14 pr-4 py-6 lg:pl-18 lg:pr-6 lg:py-12 z-10">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-brand-dark leading-tight tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm lg:text-base text-slate-600 font-medium mt-4 mb-8 max-w-lg">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.href}
                    className="inline-block bg-teal-primary hover:bg-teal-primary/90 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-teal-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-primary"
                  >
                    {slide.cta}
                  </Link>
                </div>

                <div className="flex-1 lg:flex-[2] relative h-full w-full lg:w-auto flex items-center justify-center">
                  <div className="relative w-[280px] h-[220px] lg:w-[320px] lg:h-[260px]">
                    {slide.images.map((img, j) => (
                      <div key={j} className={img.className}>
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover rounded-2xl"
                          sizes="(max-width: 1024px) 280px, 320px"
                        />
                      </div>
                    ))}
                    <div
                      className="absolute bottom-8 -left-20 w-40 h-40 bg-teal-primary/10 rounded-full blur-3xl"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute top-10 -right-10 w-32 h-32 bg-teal-primary/5 rounded-full blur-2xl"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-dark w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-primary"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-dark w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-primary"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentSlide}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-12 bg-teal-primary'
                  : 'w-6 bg-teal-primary/40 hover:bg-teal-primary/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
