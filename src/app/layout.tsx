import "./globals.css";
import type { Metadata } from "next";
import SidebarNav from "@/components/SidebarNav";

export const metadata: Metadata = {
  title: "HR Action Assistant (MVP)",
  description: "人事労務の状況から次アクションを提案するAIチャット",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-app-bg text-app-text">
        {/* 上部アクセントライン（確実にオレンジ） */}
        <div className="fixed left-0 right-0 top-0 z-10 h-[3px] z-accent-bg" />

        {/* subtle glow */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full z-accent-bg opacity-20 blur-3xl" />
          <div className="absolute -bottom-72 -right-72 h-[700px] w-[700px] rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="flex min-h-screen">
          <aside className="w-72 shrink-0 bg-app-panel">
            <div className="px-6 pt-8 pb-5">
              <div className="text-sm font-semibold tracking-wide">HR Action Assistant</div>
              <div className="mt-1 text-xs text-app-muted">MVP（一般情報提供）</div>
              <div className="mt-4 h-px bg-white/10" />
            </div>

            <div className="px-3">
              <SidebarNav />
            </div>

            <div className="mt-6 px-6 text-xs leading-relaxed text-app-muted">
              本アプリは法的判断や手続代行を行いません。最終判断は専門家へ。
            </div>
          </aside>

          <main className="flex-1 p-10">
            <div className="mx-auto max-w-4xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
