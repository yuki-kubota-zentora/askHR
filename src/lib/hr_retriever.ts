import { HR_SOURCES, HrSource, HrCategory } from "./hr_sources";

type CatHint = {
  category: HrCategory;
  keywords: readonly string[];
};

// 相談文から「何を知りたいか」を推定するためのヒント
const CATEGORY_HINTS: readonly CatHint[] = [
  {
    category: "subsidy",
    keywords: ["助成金", "補助金", "支給", "申請", "キャリアアップ"],
  },
  {
    category: "hiring_onboarding",
    keywords: ["初めて", "雇用", "採用", "入社", "雇い", "社員を雇う", "手順", "必要書類"],
  },
  {
    category: "social_insurance",
    keywords: [
      "社会保険",
      "健康保険",
      "厚生年金",
      "年金",
      "資格取得",
      "年金事務所",
      "協会けんぽ",
      "算定基礎",
    ],
  },
  {
    category: "employment_insurance",
    keywords: [
      "雇用保険",
      "ハローワーク",
      "離職票",
      "被保険者",
      "基本手当",
      "適用事業所",
      "資格取得届",
    ],
  },
  {
    category: "work_time_overtime",
    keywords: ["残業", "時間外", "36協定", "上限規制", "休日出勤", "所定労働時間"],
  },
  {
    category: "labor_contract",
    keywords: ["労働条件", "契約書", "雇用契約", "試用期間", "解雇", "雇止め", "内定"],
  },
  {
    category: "wages_min_wage",
    keywords: ["賃金", "給与", "最低賃金", "時給", "手当"],
  },
  {
    category: "workers_comp",
    keywords: ["労災", "通勤災害", "業務災害", "休業補償"],
  },
  {
    category: "leave_parenting",
    keywords: ["育休", "産休", "介護休業", "両立支援"],
  },
  {
    category: "harassment",
    keywords: ["ハラスメント", "パワハラ", "セクハラ", "マタハラ", "カスハラ"],
  },
  {
    category: "work_rules",
    keywords: ["就業規則", "規程", "ルール", "服務規律"],
  },
];

function normalize(s: string) {
  return s.toLowerCase();
}

function guessCategories(query: string): HrCategory[] {
  const q = normalize(query);

  const hits = CATEGORY_HINTS
    .map((h) => ({
      category: h.category,
      score: h.keywords.reduce((acc, kw) => (q.includes(normalize(kw)) ? acc + 1 : acc), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // 何もヒットしない場合は「初めて雇用」系 + 雇用契約を優先（MVPとして最も価値が出やすい）
  if (hits.length === 0)
    return ["hiring_onboarding", "labor_contract", "social_insurance", "subsidy"];

  // 上位2カテゴリくらいを主軸にする（多すぎるとブレる）
  const top = hits.slice(0, 2).map((x) => x.category);

  // 助成金が含まれていたら優先的に混ぜる
  if (!top.includes("subsidy") && hits.some((x) => x.category === "subsidy")) {
    top.push("subsidy");
  }

  // 「初めて雇う」「採用」などの相談は助成金の興味が強い前提で混ぜる
  if (
    top.includes("hiring_onboarding") &&
    !top.includes("subsidy") &&
    q.includes("雇")
  ) {
    top.push("subsidy");
  }

  return top;
}

export function retrieveHrSources(query: string, limit = 5): HrSource[] {
  const q = normalize(query);
  const cats = guessCategories(query);

  // 1) 全ソースにスコアを付ける（タグ一致 + カテゴリ一致 + priority）
  const scored = HR_SOURCES.map((s) => {
    const tagScore = s.tags.reduce(
      (acc, t) => (q.includes(normalize(t)) ? acc + 2 : acc),
      0
    );

    const catScore = cats.includes(s.category) ? 6 : 0;
    const priScore = s.priority ?? 1;

    // 合計スコア
    const score = tagScore + catScore + priScore;

    return { s, score };
  }).sort((a, b) => b.score - a.score);

  // 2) 多様性確保：同じカテゴリが連続しないように「カテゴリごとに上位を集めて混ぜる」
  const buckets = new Map<HrCategory, HrSource[]>();
  for (const { s } of scored) {
    const arr = buckets.get(s.category) ?? [];
    arr.push(s);
    buckets.set(s.category, arr);
  }

  // 3) 優先カテゴリから順に1つずつ取っていく（ラウンドロビン）
  const result: HrSource[] = [];
  const used = new Set<string>();

  // 優先カテゴリ（推定結果）→ その他カテゴリ の順
  const allCats: HrCategory[] = [
    ...cats,
    ...Array.from(buckets.keys()).filter((c) => !cats.includes(c)),
  ];

  while (result.length < limit) {
    let progressed = false;

    for (const c of allCats) {
      const list = buckets.get(c);
      if (!list || list.length === 0) continue;

      // 未使用のものを1つ
      const next = list.find((x) => !used.has(x.url));
      if (!next) continue;

      result.push(next);
      used.add(next.url);
      progressed = true;

      if (result.length >= limit) break;
    }

    // もう追加できない
    if (!progressed) break;
  }

  // 4) それでも不足する場合は、スコア上位から埋める（ただし重複は除外）
  if (result.length < limit) {
    for (const { s } of scored) {
      if (result.length >= limit) break;
      if (used.has(s.url)) continue;
      result.push(s);
      used.add(s.url);
    }
  }

  return result.slice(0, limit);
}

export function buildRetrievalContext(sources: HrSource[]): string {
  const lines = sources.map((s, i) => `- [${i + 1}] ${s.title}: ${s.url}`);
  return `参照一次情報（リンク）:\n${lines.join("\n")}`;
}
