"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!canSend) return;

    const userText = input.trim();
    const newUserMessage: Message = { role: "user", content: userText };
    const nextMessages = [...messages, newUserMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await res.json()) as { answer?: string; error?: string };

      if (!res.ok || !data.answer) throw new Error(data.error ?? "API error");

      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch (e: any) {
      setMessages([...nextMessages, { role: "assistant", content: `エラー: ${e?.message ?? "unknown"}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enterは改行。Ctrl+Enter or Cmd+Enter で送信
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-app-panel p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-wide">
              人事労務アクション提案チャット（MVP）
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-app-muted">
              状況（従業員数・雇用形態・発生事象など）を入力すると、一般的な対応手順や関連制度の候補を提示します。
            </p>
          </div>

          <div
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold",
              loading ? "z-accent-bg text-white" : "bg-white/10 text-app-muted",
            ].join(" ")}
          >
            {loading ? "生成中" : "準備OK"}
          </div>
        </div>

        <div className="mt-4 h-[2px] w-56 z-accent-bg" />
      </div>

      <div className="rounded-2xl bg-app-panel p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="max-h-[52vh] space-y-3 overflow-auto pr-1">
          {messages.length === 0 ? (
            <div className="rounded-xl bg-app-panel2/40 p-4 text-sm text-app-muted">
              例：従業員10名。パート1名が育休を取得したいと言っています。会社として何を準備すべき？
            </div>
          ) : (
            messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[86%]">
                    <div className={`mb-1 text-[11px] ${isUser ? "text-right text-app-muted" : "text-app-muted"}`}>
                      {isUser ? "あなた" : "アシスタント"}
                    </div>

                    <div
                      className={[
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        isUser ? "bg-app-panel2/70 text-app-text" : "bg-white/10 text-app-text",
                      ].join(" ")}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="rounded-2xl bg-app-panel p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              className="min-h-[72px] w-full resize-none rounded-2xl bg-white/10 px-4 py-3 text-sm text-app-text placeholder:text-app-muted/90 outline-none focus:ring-4 focus:ring-app-accent/25"
              placeholder="状況を入力してください（送信：ボタン または Ctrl+Enter / Cmd+Enter）"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="mt-2 text-xs text-app-muted">
              個別事情で結論が変わる可能性があります。最終判断は専門家・行政にご確認ください。
            </div>
          </div>

          <button
            className="h-[72px] shrink-0 rounded-2xl z-accent-bg px-6 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            onClick={handleSend}
            disabled={!canSend}
            title="Ctrl+Enter / Cmd+Enter でも送信できます"
          >
            {loading ? "送信中" : "送信"}
          </button>
        </div>
      </div>
    </div>
  );
}
