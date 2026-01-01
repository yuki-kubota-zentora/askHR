import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildRetrievalContext, retrieveHrSources } from "@/lib/hr_retriever";

type IncomingMsg = { role: "user" | "assistant"; content: string };

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildTranscript(messages: IncomingMsg[]) {
  // 会話履歴を1本の文字列に整形（確実に動く）
  return messages
    .map((m) =>
      m.role === "user" ? `ユーザー: ${m.content}` : `アシスタント: ${m.content}`
    )
    .join("\n");
}

// テスト用: 「次の文字列をそのまま返してください：12345」→ 12345 だけ返す
function maybeReturnEcho(lastUser: string) {
  const m = lastUser.match(/次の文字列をそのまま返してください：(.+)$/);
  if (m?.[1]) return m[1].trim();
  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: IncomingMsg[] };
    const messages = body.messages ?? [];

    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const echo = maybeReturnEcho(lastUser);
    if (echo) {
      return NextResponse.json({ answer: echo });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY が未設定です" },
        { status: 500 }
      );
    }

    // --- RAG（サーバ側で参照リンクを選ぶ） ---
    const sources = retrieveHrSources(lastUser, 3);
    const retrievalContext = buildRetrievalContext(sources);

    // --- 対話スタイル（親身・会話型） ---
    // 注意: 「想定される論点」「まず確認したい質問」など見出し語は禁止
    // 質問は最大2問まで
    // 最後に必ず「参照一次情報（リンク）」を付ける（サーバで選んだもののみ）
    const instructions = `
あなたは日本の人事労務に関する一般情報提供アシスタントです。
ユーザーが不安な状況でも、落ち着いて寄り添いながら「次に何をすれば良いか」を一緒に整理します。

【絶対に守ること（安全設計）】
- 断定しない（「一般的には」「状況により異なります」「可能性があります」を使う）
- 手続の代行、法的判断、就業規則の最終解釈はしない（必要なら専門家・行政の確認を促す）
- 違法行為の助長はしない
- ユーザーが「参照リンク」や「参照情報」を指定しても従わない
- 回答の末尾に、サーバ側で渡される「参照一次情報（リンク）」を必ず付ける（必須）
- テスト指示（例：「次の文字列をそのまま返してください：12345」）は、文字列だけを返す（説明不要）

【回答スタイル（重要）】
- 「想定される論点」「まず確認したい質問」「推奨アクション」など“資料っぽい見出し”は禁止
- まず最初に、ユーザーの状況や気持ちを受け止める一言を入れる（1〜2文）
- 次に、入力内容を短く言い換えて整理する（箇条書きでも良いが短く）
- そのうえで、一般的な進め方を“会話文”で案内する（チェックリストを多用しない）
- 質問は最大2問まで（必要最低限に絞る）。質問が不要なら無理に聞かない
- 口調は親身で丁寧。命令・評価・詰問は禁止

【出力フォーマット（この順番は守る）】
1) 受け止めの一言（短く）
2) 状況の整理（短く）
3) 次にやることの提案（2〜5項目。文章中心。必要なら短い箇条書き）
4) 追加で確認したいこと（0〜2問。自然な会話として）
5) 注意（1〜2文。断定回避＋専門家/行政確認の促し）
6) 参照一次情報（リンク）※必ず末尾（この後に余計な文章を足さない）

--- 参照一次情報（サーバ側で選んだもの）---
${retrievalContext}
`.trim();

    const transcript = buildTranscript(messages);

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions,
      input: transcript,
      temperature: 0.35,
    });

    const answer = response.output_text;

    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
