import { forwardRef, type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 disabled:opacity-50",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400 disabled:opacity-50",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600 disabled:opacity-50",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
