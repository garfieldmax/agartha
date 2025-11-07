import { forwardRef, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

const baseStyles =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return <textarea ref={ref} className={clsx(baseStyles, className)} rows={rows} {...props} />;
});
