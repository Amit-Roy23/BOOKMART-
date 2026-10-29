'use client';

import { useRef } from 'react';

/** Four-box OTP entry matching the backend's 4-digit codes. */
export function OtpInput({
  value,
  onChange,
  length = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  return (
    <div className="flex justify-center gap-4">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className="font-heading h-16 w-14 rounded-xl border border-gray-heavy bg-white text-center text-2xl font-bold text-ink focus:border-primary focus:outline-none"
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            setDigit(i, d);
            if (d && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digit && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (pasted) {
              e.preventDefault();
              onChange(pasted);
              refs.current[Math.min(pasted.length, length - 1)]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
