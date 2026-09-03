import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  optional,
}: {
  label: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">
        {label}
        {optional && (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            任意
          </span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const controlClasses =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlClasses, "min-h-24 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClasses, className)} {...props} />;
}
