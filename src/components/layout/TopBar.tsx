import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 md:hidden">
      <span className="text-base font-bold tracking-tight text-foreground">
        FX Training Lab
      </span>
      <ThemeToggle />
    </header>
  );
}
