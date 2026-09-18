"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [["/ask", "Ask"], ["/procedures", "Procedures"], ["/manual/MNT-001", "Manual"], ["/shift-desk", "Shift Desk"]] as const;

export function Nav({ mobile = false }: { mobile?: boolean }) {
  const path = usePathname();
  const active = (href: string) => path === href || path.startsWith(href.split("/").slice(0, 2).join("/") + "/") || (href === "/ask" && path.startsWith("/investigations"));
  return (
    <nav className={mobile ? "mobile-tabs" : "nav"} aria-label={mobile ? "Primary (mobile)" : "Primary"}>
      {ITEMS.map(([href, label]) => (
        <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
