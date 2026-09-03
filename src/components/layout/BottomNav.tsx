"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

// Primary items for the compact bottom bar; the rest are reachable via "More".
const PRIMARY_COUNT = 4;

export function BottomNav() {
  const pathname = usePathname();
  const primary = NAV_ITEMS.slice(0, PRIMARY_COUNT);
  const more = NAV_ITEMS.slice(PRIMARY_COUNT);
  const moreActive = more.some((item) => pathname.startsWith(item.href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid grid-cols-5">
        {primary.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/menu"
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              moreActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreIcon />
            もっと
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-6 w-6"
    >
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
