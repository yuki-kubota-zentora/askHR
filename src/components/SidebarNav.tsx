"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string };

const items: Item[] = [
  { label: "チャット", href: "/" },
  { label: "参照ソース（MVP）", href: "/sources" },
  { label: "設定（後で追加）", href: "/settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((it) => {
        const active = pathname === it.href;

        return (
          <Link
            key={it.href}
            href={it.href}
            className={[
              "relative block rounded-xl px-4 py-3 transition-colors",
              "text-app-text hover:bg-app-panel2/50",
              active ? "bg-app-panel2/60" : "",
            ].join(" ")}
          >
            <span
              className={[
                "absolute left-2 top-2 h-[calc(100%-16px)] w-[3px] rounded-full",
                active ? "z-accent-bg" : "bg-transparent",
              ].join(" ")}
            />
            <div className="pl-4 text-sm">
              <span className={active ? "font-semibold" : "font-medium"}>{it.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
