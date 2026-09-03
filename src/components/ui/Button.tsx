import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-muted text-foreground hover:opacity-80",
  ghost: "text-foreground hover:bg-muted",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  className,
  variant = "primary",
  children,
}: {
  href: string;
  className?: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </Link>
  );
}
