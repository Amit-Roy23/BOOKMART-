'use client';

/* eslint-disable @next/next/no-img-element -- backend media comes from arbitrary hosts (local, Cloudinary, S3) */
import { forwardRef, useId, useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline, IoStar, IoStarOutline } from 'react-icons/io5';
import { cn, conditionLabel, FALLBACK_COVER, initials } from '@/lib/utils';

// Styles follow bookmart-app/src/components/ui (Button, Input, Header) so both look the same.

// ── Button ──────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:brightness-95 disabled:bg-gray-heavy disabled:text-muted',
  secondary: 'bg-secondary text-primary hover:bg-darker-teal',
  outline: 'border border-gray-heavy bg-white text-text hover:border-primary hover:text-primary',
  ghost: 'text-text hover:bg-secondary',
  danger: 'bg-app-red text-white hover:brightness-95',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'lg', loading, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'font-heading inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed',
        size === 'sm' && 'h-9 px-4 text-xs',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-14 px-6 text-base',
        BUTTON_VARIANTS[variant],
        className
      )}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4 border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
});

// ── Form fields ─────────────────────────────────────────────

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label?: string;
  required?: boolean;
}) {
  if (!label) return null;
  return (
    <label htmlFor={htmlFor} className="font-heading mb-1 block text-sm font-semibold text-muted">
      {label}
      {required && <span className="text-app-red"> *</span>}
    </label>
  );
}

function FieldMessage({ error, hint }: { error?: string; hint?: string }) {
  if (error) return <p className="mt-1 text-xs text-app-red">{error}</p>;
  if (hint) return <p className="mt-1 text-xs text-muted">{hint}</p>;
  return null;
}

const fieldBox = (error?: string) =>
  cn(
    'flex w-full items-center gap-3 rounded-2xl border bg-white px-4 transition focus-within:border-primary',
    error ? 'border-app-red' : 'border-gray-heavy'
  );

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & FieldProps
>(function Input({ label, error, hint, icon, className, id, type, required, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="w-full">
      <FieldLabel htmlFor={inputId} label={label} required={required} />
      <div className={cn(fieldBox(error), 'h-14', props.disabled && 'bg-gray-light')}>
        {icon && <span className="text-muted">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          required={required}
          aria-invalid={!!error}
          className={cn(
            'h-full w-full min-w-0 bg-transparent text-base font-medium text-ink placeholder:text-muted focus:outline-none disabled:text-muted',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-muted"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
          </button>
        )}
      </div>
      <FieldMessage error={error} hint={hint} />
    </div>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ label, error, hint, className, id, required, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  return (
    <div className="w-full">
      <FieldLabel htmlFor={inputId} label={label} required={required} />
      <textarea
        ref={ref}
        id={inputId}
        required={required}
        className={cn(
          'min-h-[100px] w-full rounded-2xl border bg-white px-4 py-3 text-base font-medium text-ink placeholder:text-muted focus:border-primary focus:outline-none',
          error ? 'border-app-red' : 'border-gray-heavy',
          className
        )}
        {...props}
      />
      <FieldMessage error={error} hint={hint} />
    </div>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(function Select({ label, error, className, id, children, required, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  return (
    <div className="w-full">
      <FieldLabel htmlFor={inputId} label={label} required={required} />
      <select
        ref={ref}
        id={inputId}
        required={required}
        className={cn(
          'h-14 w-full rounded-2xl border border-gray-heavy bg-white px-4 text-base font-medium text-ink focus:border-primary focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <FieldMessage error={error} />
    </div>
  );
});

// ── Feedback ────────────────────────────────────────────────

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block h-7 w-7 animate-spin rounded-full border-[3px] border-primary border-t-transparent',
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="h-9 w-9" />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-[#e6eeee]', className)} />;
}

/** Centered empty state like the app's (icon in a soft circle, Montserrat title, muted copy). */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-card">
        <Icon size={40} className="text-muted" />
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-xs text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl bg-app-red-light px-6 py-10 text-center">
      <p className="text-sm font-semibold text-app-red">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

// ── Media ───────────────────────────────────────────────────

export function BookCover({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={!src || failed ? FALLBACK_COVER : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('h-full w-full bg-app-bg object-cover', className)}
    />
  );
}

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.34 };
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name ?? 'User avatar'}
        style={style}
        onError={() => setFailed(true)}
        className={cn('shrink-0 rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      style={style}
      className={cn(
        'font-heading inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-primary',
        className
      )}
      aria-label={name ?? 'User'}
    >
      {initials(name)}
    </span>
  );
}

// ── Badges & rating ─────────────────────────────────────────

const CONDITION_COLORS: Record<string, string> = {
  NEW: 'text-app-green bg-app-green-light',
  LIKE_NEW: 'text-primary bg-secondary',
  GOOD: 'text-app-blue bg-app-blue-light',
  FAIR: 'text-[#c49a00] bg-app-yellow-light',
  POOR: 'text-app-red bg-app-red-light',
  ACCEPTABLE: 'text-[#c49a00] bg-app-yellow-light',
};

export function ConditionBadge({
  condition,
  className,
}: {
  condition: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase',
        CONDITION_COLORS[condition] ?? 'bg-gray-light text-muted',
        className
      )}
    >
      {conditionLabel(condition)}
    </span>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        n <= Math.round(value) ? (
          <IoStar key={n} size={size} className="text-app-yellow" />
        ) : (
          <IoStarOutline key={n} size={size} className="text-gray-heavy" />
        )
      )}
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="flex gap-2"
      onMouseLeave={() => setHover(0)}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
          >
            {on ? (
              <IoStar size={28} className="text-app-yellow" />
            ) : (
              <IoStarOutline size={28} className="text-app-yellow" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Layout helpers ──────────────────────────────────────────

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-gray-light bg-white p-4 shadow-card', className)}>
      {children}
    </div>
  );
}

/** Small section heading used inside screens, e.g. “Seller Tools”. */
export function SectionTitle({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-3 flex items-center justify-between gap-3', className)}>
      <h2 className="text-[15px] font-bold text-text md:text-base">{children}</h2>
      {action}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl animate-fade-in sm:max-w-md sm:rounded-3xl',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-heavy sm:hidden" />
        <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/** Filter chip like the app’s (teal fill when active, white pill otherwise). */
export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'font-heading shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-[#e5eaea] bg-white text-muted hover:border-primary hover:text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}

/** Rounded icon tile used in the app’s lists (e.g. profile menu rows). */
export function IconTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full', className)}
    >
      {children}
    </span>
  );
}
