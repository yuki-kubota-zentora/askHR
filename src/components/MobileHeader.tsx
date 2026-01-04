"use client";

import { useState } from "react";
import SidebarNav from "@/components/SidebarNav";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-app-bg/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <div className="text-sm font-semibold tracking-wide">HR Action Assistant</div>
          <div className="mt-0.5 text-[11px] text-app-muted">MVP（一般情報提供）</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-app-text shadow-inner transition hover:bg-white/10 focus:ring-4 focus:ring-app-accent/30"
        >
          {open ? "閉じる" : "メニュー"}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="space-y-4 border-t border-white/10 px-4 pb-4">
          <div className="pt-4">
            <SidebarNav />
          </div>
          <div className="rounded-xl bg-app-panel2/40 p-3 text-xs leading-relaxed text-app-muted">
            本アプリは法的判断や手続代行を行いません。最終判断は専門家へ。
          </div>
        </div>
      ) : null}
    </div>
  );
}
