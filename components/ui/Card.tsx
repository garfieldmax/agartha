import { forwardRef, type HTMLAttributes } from "react";
import { clsx } from "clsx";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md";
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, padding = "md", ...props },
  ref
) {
  const paddingClass =
    padding === "none" ? "" : padding === "sm" ? "p-4" : "p-6";
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        paddingClass,
        className
      )}
      {...props}
    />
  );
});
