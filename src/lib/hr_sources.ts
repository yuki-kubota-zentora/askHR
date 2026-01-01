export type HrCategory =
  | "hiring_onboarding"      // 採用〜入社手続き（初めて雇う、必要書類など）
  | "labor_contract"         // 雇用契約・労働条件
  | "work_time_overtime"     // 労働時間・残業・36協定
  | "wages_min_wage"         // 賃金・最低賃金
  | "social_insurance"       // 社会保険（健保・厚年）
  | "employment_insurance"   // 雇用保険
  | "workers_comp"           // 労災
  | "leave_parenting"        // 育休・産休・介護
  | "harassment"             // ハラスメント
  | "safety_health"          // 安衛・健診・メンタル
  | "work_rules"             // 就業規則
  | "subsidy"                // 助成金
  | "e_gov";                 // e-Gov入口

export type HrSource = {
  title: string;
  url: string;
  category: HrCategory;
  priority: number;          // 1〜5（大きいほど優先）
  tags: readonly string[];
};

export const HR_SOURCES = [
  // ===== 採用〜入社（初めて雇うの体験価値を上げる）=====
  {
    title: "スタートアップ労働条件：電子申請様式作成支援ツール（厚労省）",
    url: "https://www.startup-roudou.mhlw.go.jp/support_1.html",
    category: "hiring_onboarding",
    priority: 5,
    tags: ["初めて", "雇用", "入社", "採用", "労働条件", "36協定", "就業規則", "電子申請", "テンプレ", "作成支援"],
  },
  {
    title: "労働基準法等の届出の電子申請（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000184033.html",
    category: "hiring_onboarding",
    priority: 4,
    tags: ["電子申請", "届出", "労基署", "36協定", "就業規則", "e-Gov"],
  },
  {
    title: "e-Govポータル（電子申請・法令検索の入口）",
    url: "https://www.e-gov.go.jp/",
    category: "e_gov",
    priority: 3,
    tags: ["e-Gov", "電子申請", "法令検索", "手続き"],
  },

  // ===== 雇用契約・労働条件 =====
  {
    title: "労働契約法（e-Gov）",
    url: "https://laws.e-gov.go.jp/law/419AC0000000128/",
    category: "labor_contract",
    priority: 5,
    tags: ["労働契約", "労働契約法", "契約", "変更", "解雇", "雇止め", "労働条件", "試用期間"],
  },
  {
    title: "労働基準法（e-Gov）",
    url: "https://laws.e-gov.go.jp/law/322AC0000000049/",
    category: "labor_contract",
    priority: 5,
    tags: ["労基法", "労働基準法", "労働時間", "残業", "休憩", "休日", "年休", "賃金", "解雇", "労働条件", "就業規則"],
  },

  // ===== 労働時間・残業・36協定 =====
  {
    title: "時間外労働の上限規制（働き方改革 特設サイト）",
    url: "https://hatarakikatakaikaku.mhlw.go.jp/overtime.html",
    category: "work_time_overtime",
    priority: 5,
    tags: ["残業", "上限規制", "36協定", "月45時間", "年360時間", "時間外労働"],
  },

  // ===== 賃金・最低賃金 =====
  {
    title: "最低賃金法（e-Gov）",
    url: "https://laws.e-gov.go.jp/law/334AC0000000137",
    category: "wages_min_wage",
    priority: 4,
    tags: ["最低賃金", "賃金", "時給", "地域別最低賃金", "特定最低賃金"],
  },
  {
    title: "最低賃金制度の概要（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/chingin/newpage_43875.html",
    category: "wages_min_wage",
    priority: 4,
    tags: ["最低賃金", "制度概要", "適用範囲"],
  },

  // ===== 社会保険（健保・厚年）=====
  {
    title: "就職したとき（資格取得）の手続き（日本年金機構）",
    url: "https://www.nenkin.go.jp/service/kounen/tekiyo/hihokensha1/20150422.html",
    category: "social_insurance",
    priority: 5,
    tags: ["社会保険", "資格取得", "健康保険", "厚生年金", "入社", "手続き"],
  },
  {
    title: "健康保険・厚生年金保険の適用関係届書（日本年金機構）",
    url: "https://www.nenkin.go.jp/shinsei/kounen/tekiyo/index.html",
    category: "social_insurance",
    priority: 4,
    tags: ["届書", "電子申請", "適用", "年金事務所", "事務センター"],
  },

  // ===== 雇用保険 =====
  {
    title: "雇用保険制度（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/koyouhoken/index_00003.html",
    category: "employment_insurance",
    priority: 5,
    tags: ["雇用保険", "加入", "手続き", "事業主", "給付", "基本手当"],
  },
  {
    title: "育児休業等給付について（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000135090_00001.html",
    category: "employment_insurance",
    priority: 4,
    tags: ["育児休業給付", "雇用保険", "給付金", "時短給付"],
  },

  // ===== 労災 =====
  {
    title: "労災保険法（労働者災害補償保険法）（e-Gov）",
    url: "https://laws.e-gov.go.jp/law/322AC0000000050",
    category: "workers_comp",
    priority: 4,
    tags: ["労災", "通勤災害", "業務災害", "休業補償", "給付"],
  },
  {
    title: "労災保険（厚労省：総合ページ）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/rousai/index.html",
    category: "workers_comp",
    priority: 4,
    tags: ["労災", "給付", "事業主", "保険料"],
  },

  // ===== 育休・介護休業 =====
  {
    title: "育児・介護休業法について（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000130583.html",
    category: "leave_parenting",
    priority: 5,
    tags: ["育休", "産後パパ育休", "介護休業", "両立支援"],
  },
  {
    title: "育児・介護休業法のあらまし（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/000103504.html",
    category: "leave_parenting",
    priority: 4,
    tags: ["育休", "介護休業", "制度概要", "パンフレット"],
  },

  // ===== ハラスメント =====
  {
    title: "職場のハラスメントの防止（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyoukintou/seisaku06/index.html",
    category: "harassment",
    priority: 5,
    tags: ["ハラスメント", "パワハラ", "セクハラ", "マタハラ", "カスハラ", "就活セクハラ"],
  },
  {
    title: "あかるい職場応援団（職場のハラスメント ポータル）",
    url: "https://www.no-harassment.mhlw.go.jp/",
    category: "harassment",
    priority: 4,
    tags: ["ハラスメント", "相談窓口", "社内体制", "研修"],
  },

  // ===== 安衛・健康 =====
  {
    title: "労働安全衛生法（e-Gov）",
    url: "https://laws.e-gov.go.jp/law/347AC0000000057",
    category: "safety_health",
    priority: 4,
    tags: ["安衛法", "安全衛生", "健康診断", "ストレスチェック", "産業医", "衛生管理者"],
  },
  {
    title: "心の健康問題により休業した労働者の職場復帰支援の手引き（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000055195_00005.html",
    category: "safety_health",
    priority: 4,
    tags: ["メンタルヘルス", "休職", "復職", "産業医", "主治医", "就業配慮"],
  },

  // ===== 就業規則 =====
  {
    title: "モデル就業規則について（厚労省）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/model/index.html",
    category: "work_rules",
    priority: 5,
    tags: ["就業規則", "モデル", "作成", "変更", "届出"],
  },

  // ===== 助成金（ここが“感動体験”の重要パーツ）=====
  {
    title: "雇用関係助成金（厚生労働省：総合）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/index.html",
    category: "subsidy",
    priority: 5,
    tags: ["助成金", "雇用関係助成金", "申請", "支給要件", "手続き"],
  },
  {
    title: "キャリアアップ助成金（厚労省：案内）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000082805.html",
    category: "subsidy",
    priority: 4,
    tags: ["キャリアアップ助成金", "正社員化", "有期", "パート", "処遇改善"],
  },
] as const satisfies readonly HrSource[];
