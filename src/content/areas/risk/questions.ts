import type { Question } from "@/lib/content/types";

export const questions: Question[] = [
  // ── risk/fundamentals ──────────────────────────────────────────
  {
    id: "q-risk-001",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "easy",
    type: "knowledge",
    stem: "情報資産台帳の目的として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "情報資産の所在と管理責任を明確にし、保護の対象を漏れなく管理する。",
      },
      {
        id: "i",
        text: "情報資産へのアクセスログをすべて保存し、不正アクセスを検知する。",
      },
      {
        id: "u",
        text: "情報資産の脆弱性を診断し、修正状況を記録する。",
      },
      {
        id: "e",
        text: "情報資産に関するインシデントの初動対応手順を定める。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "情報資産台帳は、資産の所在・所有者・重要度を一覧化し、保護対象の漏れを防ぐための台帳です。",
      why: [
        "台帳に載っていない資産はリスクアセスメントの対象にもインシデント調査の範囲にも入りません。",
        "アクセスログの保存は監視・証跡の管理策、脆弱性診断は技術的評価、初動対応は緊急時対応計画の役割です。",
      ],
      optionNotes: {
        a: "正解です。台帳は資産の把握と管理責任の明確化が目的です。",
        i: "アクセスログの保存はログ管理や監視の目的であり、台帳の目的ではありません。",
        u: "脆弱性診断の結果は別の台帳や管理表で追跡します。資産台帳の主目的ではありません。",
        e: "インシデントの初動対応手順は緊急時対応計画に定めます。",
      },
      english:
        "An asset inventory exists to identify assets, assign ownership, and ensure none are left unprotected.",
      termIds: ["risk-asset-inventory", "risk-information-asset"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["情報資産", "台帳"],
  },
  {
    id: "q-risk-002",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "easy",
    type: "knowledge",
    stem: "顧客名簿が外部に流出した場合に、最も強く損なわれる情報セキュリティの特性はどれか。",
    options: [
      { id: "a", text: "完全性" },
      { id: "i", text: "機密性" },
      { id: "u", text: "可用性" },
      { id: "e", text: "責任追跡性" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "許可されていない者に情報が渡ることを防ぐ性質が機密性であり、流出によって最も強く損なわれます。",
      why: [
        "顧客名簿は、正当な権限を持つ担当者だけが利用できる状態を保つ必要があります。",
        "改ざんや停止が起きていなくても、開示だけで機密性の侵害は成立します。",
      ],
      optionNotes: {
        a: "完全性は情報が正確で不正に変更されていない性質です。流出そのものでは完全性は損なわれません。",
        i: "正解です。外部への開示は機密性の侵害です。",
        u: "可用性は必要なときに利用できる性質で、流出とは異なります。",
        e: "責任追跡性は行為者を後から追跡できる性質で、CIAの主特性ではありません。",
      },
      english:
        "Disclosure of a customer list violates confidentiality, even if the data is neither altered nor unavailable.",
      termIds: ["risk-information-asset", "risk-asset-value"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["CIA", "機密性"],
  },
  {
    id: "q-risk-003",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "knowledge",
    stem: "個人情報の漏えいについて、被害者に支払った損害賠償金と訴訟費用は、どの損失に分類されるか。",
    options: [
      { id: "a", text: "財産損失" },
      { id: "i", text: "純収益損失" },
      { id: "u", text: "責任損失" },
      { id: "e", text: "人的損失" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "第三者への損害賠償や訴訟費用は、法的責任の履行に伴う損失であるため責任損失に分類されます。",
      why: [
        "責任損失は、事故によって他者に損害を与え、賠償や制裁を受けることで発生します。",
        "保険の主要な補償対象であり、事故の内容によって金額の予測が難しい点が特徴です。",
      ],
      optionNotes: {
        a: "財産損失は資産そのものの損壊・滅失と再取得費用です。賠償金は含みません。",
        i: "純収益損失は売上減少や機会損失です。賠償金の支払いは利益の逸失ではありません。",
        u: "正解です。賠償金と訴訟費用は責任損失です。",
        e: "人的損失は従業員の死傷・健康被害・休業などです。",
      },
      english:
        "Damages and litigation costs paid to third parties are liability losses, not property or revenue losses.",
      termIds: ["risk-liability-loss", "risk-property-loss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["損失分類", "責任損失"],
  },
  {
    id: "q-risk-004",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "knowledge",
    stem: "ECサイトが半日停止し、その間の売上機会を失ったことによる損失は、どれに分類されるか。",
    options: [
      { id: "a", text: "純収益損失" },
      { id: "i", text: "財産損失" },
      { id: "u", text: "責任損失" },
      { id: "e", text: "人的損失" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "事業停止によって失われた売上・利益は純収益損失です。設備が無事でも、事業が止まれば発生します。",
      why: [
        "純収益損失は、停止時間の長さや信用低下の程度に応じて拡大します。",
        "機器の再取得費は財産損失、事業を再開するための追加費用は純収益損失として整理します。",
      ],
      optionNotes: {
        a: "正解です。売上機会の喪失は純収益損失です。",
        i: "財産損失はサーバやデータなど資産そのものの損壊・滅失です。",
        u: "責任損失は第三者への賠償や訴訟費用です。",
        e: "人的損失は従業員の健康被害や休業などです。",
      },
      english:
        "Lost sales during an outage are a net income loss, even when no physical asset is damaged.",
      termIds: ["risk-net-income-loss", "risk-property-loss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["損失分類", "純収益損失"],
  },
  {
    id: "q-risk-005",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "knowledge",
    stem: "サーバ室の火災でサーバが焼失し、同じ構成の機器を再購入した。この費用はどの損失に分類されるか。",
    options: [
      { id: "a", text: "責任損失" },
      { id: "i", text: "財産損失" },
      { id: "u", text: "純収益損失" },
      { id: "e", text: "人的損失" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "資産そのものの滅失と再取得費用は財産損失です。バックアップや冗長化によって減らせます。",
      why: [
        "火災による機器の損壊は、資産価値の消失そのものです。",
        "同じ火災でも、復旧までの売上減少は純収益損失として別に計上します。",
      ],
      optionNotes: {
        a: "責任損失は第三者への賠償や訴訟費用です。自社の機器再購入は含みません。",
        i: "正解です。機器の再取得費用は財産損失です。",
        u: "純収益損失は事業停止による売上・利益の喪失です。",
        e: "人的損失は従業員の死傷や休業などです。",
      },
      english:
        "The cost of replacing burned servers is a property loss; lost sales during the outage would be a separate net income loss.",
      termIds: ["risk-property-loss", "risk-net-income-loss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["損失分類", "財産損失"],
  },
  {
    id: "q-risk-006",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "knowledge",
    stem: "業務を委託した一次請け会社が、さらに別の会社に再委託していた。その再委託先で顧客情報の漏えいが発生した。このリスクの分類として最も適切なものはどれか。",
    options: [
      { id: "a", text: "オペレーショナルリスク" },
      { id: "i", text: "外部サービスリスク" },
      { id: "u", text: "サプライチェーンリスク" },
      { id: "e", text: "SNSリスク" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "一次請け・二次請けを含む供給網の管理不足に起因するため、サプライチェーンリスクです。",
      why: [
        "サプライチェーンリスクは、委託先や部品供給者など自社の管理が及びにくい範囲の問題を含みます。",
        "再委託の承認、契約上の義務、監査権の有無が、このリスクの大きさを左右します。",
      ],
      optionNotes: {
        a: "オペレーショナルリスクは自社の業務プロセスの不備や作業ミスに起因するものです。",
        i: "外部サービスリスクはクラウドやSaaSなど外部ITサービスの停止・変更に起因します。委託先の再委託は供給網の問題です。",
        u: "正解です。再委託先の事故はサプライチェーンリスクとして整理します。",
        e: "SNSリスクはSNS投稿やアカウント乗っ取りに起因します。",
      },
      english:
        "An incident at a subcontractor arises in the supply network, so it is a supply chain risk rather than an external service risk.",
      termIds: ["risk-supply-chain-risk", "risk-external-service-risk"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスク分類", "委託"],
  },
  {
    id: "q-risk-007",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "knowledge",
    stem: "サイバー保険に加入した後、これまで実施していたパッチ適用の優先順位を下げ、点検も省略するようになった。この現象を表す用語はどれか。",
    options: [
      { id: "a", text: "逆選択" },
      { id: "i", text: "モラルハザード" },
      { id: "u", text: "内部不正" },
      { id: "e", text: "コンプライアンス違反" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "損失負担が保険に移ることで注意義務が低下する現象はモラルハザードです。故意の不正だけでなく過失も含みます。",
      why: [
        "保険による補填が、対策を続ける動機を弱めています。",
        "免責額の設定、監査、対策要件、KPIによる監視が抑止策になります。",
      ],
      optionNotes: {
        a: "逆選択は、保険加入前にリスクの高い主体ほど加入しやすくなる現象です。加入後の注意低下とは異なります。",
        i: "正解です。保険加入後の注意義務の低下はモラルハザードです。",
        u: "内部不正は意図的な窃取や不正利用であり、モラルハザードとは区別します。",
        e: "コンプライアンス違反は規則違反そのものを指し、注意義務の低下という現象名ではありません。",
      },
      english:
        "Moral hazard is the decline in care after risk is transferred, and it includes negligence, not only intentional misconduct.",
      termIds: ["risk-moral-hazard", "risk-cyber-insurance"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["モラルハザード", "保険"],
  },
  {
    id: "q-risk-008",
    part: "A",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "knowledge",
    stem: "あるリスクの単一損失期待額（SLE）が400万円、年間発生率（ARO）が0.25であるとき、年間予想損失額（ALE）はいくらか。",
    options: [
      { id: "a", text: "80万円" },
      { id: "i", text: "100万円" },
      { id: "u", text: "400万円" },
      { id: "e", text: "1,600万円" },
    ],
    correctOptionId: "i",
    explanation: {
      correct: "ALE = SLE × ARO = 400万円 × 0.25 = 100万円です。",
      why: [
        "ARO 0.25は「4年に1回」の発生頻度を意味します。",
        "1年あたりに平均して100万円の損失が見込まれる、という解釈になります。",
      ],
      optionNotes: {
        a: "AROを0.2と取り違えた場合の値です。0.25を掛ける必要があります。",
        i: "正解です。400万円 × 0.25 = 100万円です。",
        u: "SLEそのものであり、年間発生率を掛けていません。",
        e: "400万円を0.25で割った値で、掛け算と割り算を取り違えています。",
      },
      english: "ALE = SLE × ARO = 4,000,000 × 0.25 = 1,000,000 yen per year.",
      termIds: ["risk-ale"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["ALE", "計算"],
  },
  {
    id: "q-risk-009",
    part: "B",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "hard",
    type: "scenario",
    stem: "ある企業が3つのリスクを比較している。リスクXは影響額1,000万円・年間発生確率10%、リスクYは影響額200万円・年間発生確率80%、リスクZは影響額5,000万円・年間発生確率2%である。年間予想損失額（ALE）の大きい順に並べたものはどれか。",
    options: [
      { id: "a", text: "Y ＞ X ＝ Z" },
      { id: "i", text: "Z ＞ X ＞ Y" },
      { id: "u", text: "X ＞ Y ＞ Z" },
      { id: "e", text: "X ＝ Y ＝ Z" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "Xは1,000万円×0.10=100万円、Yは200万円×0.80=160万円、Zは5,000万円×0.02=100万円となり、Yが最大でXとZが同額です。",
      why: [
        "影響額が最大のZでも、発生確率が低いためALEではXと同じになります。",
        "優先順位は影響額の大きさだけでは決められず、発生確率を掛けた期待値で比較する必要があります。",
      ],
      optionNotes: {
        a: "正解です。Y 160万円 ＞ X 100万円 ＝ Z 100万円です。",
        i: "影響額の大きさで並べた順序であり、発生確率を掛けていません。",
        u: "XとYの関係が逆です。YのALEは160万円でXの100万円を上回ります。",
        e: "3つのALEは等しくありません。計算するとYだけが160万円です。",
      },
      english:
        "ALE is impact times annual probability: X 1M, Y 1.6M, Z 1M yen. The largest impact does not imply the largest ALE.",
      termIds: ["risk-ale", "risk-quantitative-analysis"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["ALE", "科目B", "優先順位"],
  },
  {
    id: "q-risk-010",
    part: "B",
    topicIds: ["risk-basics"],
    lessonIds: ["risk/fundamentals"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社の公式SNSアカウントが乗っ取られ、偽の問い合わせ窓口が掲載された。顧客がその窓口に個人情報を送信し、A社には苦情と損害賠償の要求が届いている。この事例で生じているリスクの分類と損失の組合せとして、最も適切なものはどれか。",
    options: [
      { id: "a", text: "SNSリスクと責任損失" },
      { id: "i", text: "サプライチェーンリスクと財産損失" },
      { id: "u", text: "オペレーショナルリスクと人的損失" },
      { id: "e", text: "地政学リスクと純収益損失" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "公式アカウントの乗っ取りはSNSリスクであり、顧客への賠償要求は責任損失です。",
      why: [
        "偽窓口に個人情報を送らせたことに対する説明責任と賠償が生じています。",
        "風評による売上減少も併発し得ますが、選択肢の中ではSNSリスクと責任損失の組合せが最も直接的です。",
      ],
      optionNotes: {
        a: "正解です。SNSの乗っ取りと第三者への賠償責任の組合せです。",
        i: "供給網の問題ではなく、資産の滅失も起きていません。",
        u: "自社の業務手順の不備ではなく、従業員の死傷も確認できません。",
        e: "地政学的な変化は関係せず、損失の中心は賠償責任です。",
      },
      english:
        "Account takeover is a social media risk, and compensation claims from customers are liability losses.",
      termIds: ["risk-sns-risk", "risk-liability-loss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["SNS", "科目B", "損失分類"],
  },

  // ── risk/assessment ────────────────────────────────────────────
  {
    id: "q-risk-011",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "medium",
    type: "knowledge",
    stem: "リスク分析とリスク評価の関係として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "リスク分析はリスクレベルを算定し、リスク評価は基準と比較して対応の要否を決める。",
      },
      {
        id: "i",
        text: "リスク分析は対応方針を決定し、リスク評価はその効果を測定する。",
      },
      {
        id: "u",
        text: "リスク分析はリスクを洗い出し、リスク評価はリスクレベルを算定する。",
      },
      {
        id: "e",
        text: "リスク分析とリスク評価は同義であり、呼び方だけが異なる。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "分析は発生可能性と影響度からリスクレベルを算定する段階、評価はそのレベルを基準と比較して対応の要否を決める段階です。",
      why: [
        "分析の時点では、まだ「受容するか低減するか」は決まっていません。",
        "リスクを洗い出すのはリスク特定であり、分析でも評価でもありません。",
      ],
      optionNotes: {
        a: "正解です。分析はレベル算定、評価は基準との比較による意思決定です。",
        i: "対応方針の決定はリスク評価を経てリスク対応で行います。分析ではありません。",
        u: "リスクの洗い出しはリスク特定です。分析と評価の説明が入れ替わっています。",
        e: "両者は異なる段階であり、同義ではありません。",
      },
      english:
        "Risk analysis determines the level of risk; risk evaluation compares it with criteria to decide whether treatment is needed.",
      termIds: ["risk-analysis", "risk-evaluation", "risk-identification"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスクアセスメント", "分析", "評価"],
  },
  {
    id: "q-risk-012",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "medium",
    type: "knowledge",
    stem: "リスク特定の段階で明らかにする事項として、適切でないものはどれか。",
    options: [
      { id: "a", text: "リスクの原因と、起こり得る事象" },
      { id: "i", text: "リスクが及ぼす潜在的な結果" },
      { id: "u", text: "リスク対応に必要な予算の配分" },
      { id: "e", text: "対象となる資産と既存の管理策" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "予算配分はリスク評価と対応計画の段階で決めるものであり、リスク特定の対象ではありません。",
      why: [
        "リスク特定では、リスク源、事象、原因、結果、対象資産、既存の管理策を明らかにします。",
        "予算を先に決めると、リスクの大きさではなく予算に合わせた洗い出しになり、重大リスクの漏れにつながります。",
      ],
      optionNotes: {
        a: "原因と事象はリスク特定の中心的な対象です。",
        i: "潜在的な結果はリスク記述に含めるべき要素です。",
        u: "正解です。予算配分はリスク対応の計画段階で決めます。",
        e: "対象資産と既存の管理策は、リスクの大きさを左右するため特定時に確認します。",
      },
      english:
        "Budget allocation belongs to treatment planning, not risk identification, which focuses on sources, events, causes, and consequences.",
      termIds: ["risk-identification", "risk-source"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスク特定"],
  },
  {
    id: "q-risk-013",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "medium",
    type: "knowledge",
    stem: "リスク基準の説明として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "リスクの重要性を判断するための尺度、しきい値、評価方法の全体。",
      },
      {
        id: "i",
        text: "組織が許容できるリスクレベルの境界。",
      },
      {
        id: "u",
        text: "リスク対応に割り当てる予算の上限。",
      },
      {
        id: "e",
        text: "残余リスクを保険で補填するときの支払条件。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "リスク基準は、影響と発生可能性の尺度、リスクレベルの定義、受容可否の判断方法を含む参照情報の全体です。",
      why: [
        "基準は経営者が定め、リスク選好と整合させます。",
        "基準が曖昧だと、部門ごとに評価結果がばらつき、優先順位を比較できません。",
      ],
      optionNotes: {
        a: "正解です。評価のものさし全体を指します。",
        i: "これはリスク受容基準の説明です。基準全体の一部です。",
        u: "予算の上限はリスク対応の制約条件であり、リスク基準そのものではありません。",
        e: "保険の支払条件は保険契約の内容であり、リスク基準ではありません。",
      },
      english:
        "Risk criteria comprise the scales, thresholds, and methods used to judge the significance of risk.",
      termIds: ["risk-criteria", "risk-acceptance-criteria"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスク基準"],
  },
  {
    id: "q-risk-014",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "easy",
    type: "knowledge",
    stem: "リスク受容基準の説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "リスクの重要性を判断するための尺度と評価方法。" },
      { id: "i", text: "組織が許容できるリスクレベルの境界。" },
      { id: "u", text: "リスク対応の優先順位を決めるための予算枠。" },
      { id: "e", text: "サイバー保険の支払限度額。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "リスク受容基準は、どのレベルまでなら受け入れるかを分ける境界です。",
      why: [
        "この境界を超えるリスクは、低減・移転・回避の対象になります。",
        "境界は経営者が決め、法規制や事業への影響を踏まえます。",
      ],
      optionNotes: {
        a: "これはリスク基準の説明です。受容基準はその一部です。",
        i: "正解です。許容できるリスクレベルの境界を指します。",
        u: "予算枠は対応計画の制約であり、受容基準ではありません。",
        e: "保険の支払限度額は契約条件であり、リスクの受容可否を決める基準ではありません。",
      },
      english:
        "Risk acceptance criteria define the boundary of risk levels the organization is willing to accept.",
      termIds: ["risk-acceptance-criteria", "risk-criteria"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["受容基準"],
  },
  {
    id: "q-risk-015",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "medium",
    type: "knowledge",
    stem: "得点法で、発生可能性を4、影響度を5と評価した。5×5のマトリックスで「15以上を高、8〜14を中、7以下を低」と定めている場合、このリスクのレベルはどれか。",
    options: [
      { id: "a", text: "高" },
      { id: "i", text: "中" },
      { id: "u", text: "低" },
      { id: "e", text: "得点法ではレベルを判定できない" },
    ],
    correctOptionId: "a",
    explanation: {
      correct: "4×5=20であり、15以上なので「高」に分類されます。",
      why: [
        "得点法では、発生可能性と影響度の積をリスクスコアとして使います。",
        "しきい値は組織のリスク基準で決まるため、同じ20点でも基準が変われば判定は変わります。",
      ],
      optionNotes: {
        a: "正解です。20点は15以上のため「高」です。",
        i: "「中」は8〜14点です。20点は該当しません。",
        u: "「低」は7点以下です。20点は該当しません。",
        e: "しきい値が定義されているため、判定は可能です。",
      },
      english:
        "The score is 4 × 5 = 20, which falls in the high band of 15 or above.",
      termIds: ["risk-scoring", "risk-matrix"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["得点法", "計算"],
  },
  {
    id: "q-risk-016",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "easy",
    type: "knowledge",
    stem: "定量的リスク分析の説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "専門家の経験に基づき、高・中・低の段階で評価する。" },
      { id: "i", text: "金額や確率を用いて、期待損失を算定する。" },
      { id: "u", text: "リスクの発生可能性だけを順位付けする。" },
      { id: "e", text: "過去の事故だけを根拠に、安全側へ一律に評価する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "定量分析は、金額や確率を用いてリスクを数値で表現します。ALEや期待損失が代表例です。",
      why: [
        "金額で表現できるため、対策の費用対効果を説明しやすくなります。",
        "確率と影響額の見積りには不確実性が伴う点に注意が必要です。",
      ],
      optionNotes: {
        a: "専門家の経験による段階評価は定性的リスク分析です。",
        i: "正解です。金額と確率を用いるのが定量分析です。",
        u: "発生可能性だけの順位付けでは、影響度を考慮しておらず定量分析とはいえません。",
        e: "過去の事故のみに依存し一律に評価する方法は、定量分析の説明ではありません。",
      },
      english:
        "Quantitative analysis expresses risk with monetary values and probabilities, such as expected loss.",
      termIds: ["risk-quantitative-analysis", "risk-qualitative-analysis"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["定量分析"],
  },
  {
    id: "q-risk-017",
    part: "A",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "easy",
    type: "knowledge",
    stem: "従業員へのセキュリティ教育が不足しているために、不審なメールの添付ファイルを開いてしまう問題が繰り返されている。このリスクの要因として最も適切なものはどれか。",
    options: [
      { id: "a", text: "組織的要因" },
      { id: "i", text: "人的要因" },
      { id: "u", text: "物理的要因" },
      { id: "e", text: "技術的要因" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "教育不足と従業員の操作が原因であるため、人的要因に分類されます。",
      why: [
        "人的要因には、操作ミス、教育不足、内部不正、権限の残存などが含まれます。",
        "メールフィルタやEDRの設定不備であれば技術的要因として整理します。",
      ],
      optionNotes: {
        a: "組織的要因は規程や委託管理、責任分界など組織の仕組みに起因します。",
        i: "正解です。教育不足と操作は人的要因です。",
        u: "物理的要因は入退室管理や火災、媒体の持ち出しなどです。",
        e: "技術的要因は脆弱性や設定不備、ログ未取得などです。",
      },
      english:
        "Insufficient training and user action are human factors; mail filter misconfiguration would be a technical factor.",
      termIds: ["risk-source", "risk-identification"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["4要因", "人的要因"],
  },
  {
    id: "q-risk-018",
    part: "B",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "hard",
    type: "scenario",
    stem: "A社は5×5のリスクマトリックスを使い、「15以上を高、8〜14を中、7以下を低」と定めている。リスクAは発生可能性2・影響度5（スコア10）、リスクBは発生可能性4・影響度2（スコア8）、リスクCは発生可能性3・影響度3（スコア9）である。影響度5は事業停止に直結し、影響度2は軽微な遅延である。最初に対応すべきリスクとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "リスクA" },
      { id: "i", text: "リスクB" },
      { id: "u", text: "リスクC" },
      { id: "e", text: "三つとも「中」なので、対応の優先順位は付けられない" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "三つとも「中」ですが、リスクAはスコアが最も高く、影響度が最大で事業停止に直結するため、最初に対応すべきです。",
      why: [
        "同じリスクレベルでも、影響度が大きいリスクは一度の発生で回復困難な損害を与えます。",
        "マトリックスのスコアだけでなく、事業影響の性質を併せて判断します。",
      ],
      optionNotes: {
        a: "正解です。スコア10で最大、かつ影響度5で事業停止に直結します。",
        i: "スコアは8で最も低く、影響度も2で軽微です。",
        u: "スコアは9でAより低く、影響度も3です。",
        e: "同じレベル内でも、影響度や事業への性質から優先順位を付けられます。",
      },
      english:
        "All three are medium, but A has the highest score and the maximum impact, so it should be addressed first.",
      termIds: ["risk-matrix", "risk-level", "risk-evaluation"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "マトリックス", "優先順位"],
  },
  {
    id: "q-risk-019",
    part: "B",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "hard",
    type: "scenario",
    stem: "リスクPは影響額2,000万円・年間発生確率5%、リスクQは影響額500万円・年間発生確率40%である。Pへの対策は年80万円で発生確率を1%に下げ、Qへの対策は年50万円で発生確率を10%に下げられる。年間予想損失額（ALE）と対策費の比較から、費用対効果があると判断できるものはどれか。",
    options: [
      { id: "a", text: "リスクPへの対策のみ" },
      { id: "i", text: "リスクQへの対策のみ" },
      { id: "u", text: "リスクPとリスクQの両方" },
      { id: "e", text: "どちらの対策も費用対効果がない" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "Qは対策前ALE 200万円、対策後ALE 50万円、対策費50万円で総費用100万円となり、100万円の改善があります。Pは対策前ALE 100万円、対策後ALE 20万円、対策費80万円で総費用100万円となり、改善がありません。",
      why: [
        "Pの対策前ALEは2,000万円×0.05=100万円、対策後は2,000万円×0.01=20万円です。",
        "Qの対策前ALEは500万円×0.40=200万円、対策後は500万円×0.10=50万円です。",
      ],
      optionNotes: {
        a: "Pは総費用100万円で対策前ALEと同額になり、ALE上の改善はありません。",
        i: "正解です。Qは総費用100万円で、対策前の200万円から100万円改善します。",
        u: "Pは費用対効果がなく、両方とはいえません。",
        e: "Qには100万円の改善があり、どちらも不適切ではありません。",
      },
      english:
        "Q reduces ALE from 2M to 0.5M yen at a cost of 0.5M, a net gain; P's total cost equals its pre-treatment ALE.",
      termIds: ["risk-ale", "risk-quantitative-analysis"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "ALE", "費用対効果"],
  },
  {
    id: "q-risk-020",
    part: "B",
    topicIds: ["risk-assessment"],
    lessonIds: ["risk/assessment"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社はリスクアセスメントを実施し、リスク一覧とスコアを作成した。しかし半年後、対策はほとんど進んでいない。記録には各リスクの対応欄に「情報システム部が検討中」とだけ書かれ、個人名や期限はない。この状況の原因として最も適切なものはどれか。",
    options: [
      { id: "a", text: "リスクの特定が行われていない。" },
      { id: "i", text: "リスク所有者が明確に定められていない。" },
      { id: "u", text: "リスク受容基準が厳しすぎる。" },
      { id: "e", text: "定量分析が実施されていない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "対応の責任者と期限が決まっておらず、部門名だけでは誰が意思決定し実行するかが不明です。リスク所有者の不在が原因です。",
      why: [
        "リスク所有者は、対応方針の決定、予算の確保、進捗の報告に責任を持ちます。",
        "所有者がいないと、評価結果が記録されても行動につながりません。",
      ],
      optionNotes: {
        a: "リスク一覧とスコアは作成されており、特定は行われています。",
        i: "正解です。個人の責任者と期限がないため、対応が進みません。",
        u: "受容基準の厳しさは、対策が進まない直接の原因として読み取れません。",
        e: "定量分析の有無は、責任者の不在という問題を説明しません。",
      },
      english:
        "No named owner or deadline is assigned, so the assessment never translates into action.",
      termIds: ["risk-owner", "risk-register"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "リスク所有者"],
  },

  // ── risk/response-continuity ───────────────────────────────────
  {
    id: "q-risk-021",
    part: "A",
    topicIds: ["risk-response"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "easy",
    type: "knowledge",
    stem: "リスク回避に該当する対応はどれか。",
    options: [
      { id: "a", text: "リスクが大きい新サービスの開始を中止する。" },
      { id: "i", text: "多要素認証を導入して不正ログインを防ぐ。" },
      { id: "u", text: "サイバー保険に加入して賠償に備える。" },
      { id: "e", text: "低いリスクを監視しながら受け入れる。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "リスクを生む活動自体をやめることがリスク回避です。新サービスの開始中止は典型例です。",
      why: [
        "回避はリスクを確実に減らせますが、事業機会も失います。",
        "多要素認証は低減、保険は移転、監視しながらの受入れは受容です。",
      ],
      optionNotes: {
        a: "正解です。活動をやめるためリスクは発生しません。",
        i: "多要素認証は発生可能性を下げるリスク低減です。",
        u: "保険は損失の金銭的負担を移すリスク移転です。",
        e: "リスクをそのまま受け入れるのはリスク受容です。",
      },
      english:
        "Canceling the service eliminates the activity that creates the risk, which is avoidance.",
      termIds: ["risk-avoidance", "risk-reduction"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスク対応", "回避"],
  },
  {
    id: "q-risk-022",
    part: "A",
    topicIds: ["risk-response"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "easy",
    type: "knowledge",
    stem: "リスク低減に該当する対応はどれか。",
    options: [
      { id: "a", text: "危険な取引先との契約を解除する。" },
      { id: "i", text: "パッチ管理を徹底し、脆弱性を悪用される可能性を下げる。" },
      { id: "u", text: "保険で賠償責任に備える。" },
      { id: "e", text: "リスクをそのまま受け入れて監視する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "パッチ管理は脆弱性を減らし、事故の発生可能性を下げるリスク低減です。",
      why: [
        "低減は、発生可能性または影響度を下げる管理策の導入です。",
        "契約解除は活動をやめる回避、保険は移転、そのまま受け入れるのは受容です。",
      ],
      optionNotes: {
        a: "契約解除はリスクを生む活動をやめるリスク回避です。",
        i: "正解です。パッチ管理は発生可能性を下げる低減です。",
        u: "保険は損失負担を第三者に移すリスク移転です。",
        e: "そのまま受け入れるのはリスク受容です。",
      },
      english:
        "Patching reduces the likelihood of exploitation, which is risk reduction.",
      termIds: ["risk-reduction", "risk-avoidance"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスク対応", "低減"],
  },
  {
    id: "q-risk-023",
    part: "A",
    topicIds: ["risk-response"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "medium",
    type: "knowledge",
    stem: "リスク移転に該当する対応はどれか。",
    options: [
      { id: "a", text: "新規事業への参入を見送る。" },
      { id: "i", text: "バックアップを取得し、復旧できるようにする。" },
      { id: "u", text: "サイバー保険に加入する。" },
      { id: "e", text: "残留リスクを記録して受け入れる。" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "サイバー保険は、事故で生じる損失の金銭的負担を保険会社に移すリスク移転です。",
      why: [
        "移転してもリスク自体は消えず、評判損失や顧客離れは残ります。",
        "参入見送りは回避、バックアップは低減、残留リスクの受入れは受容です。",
      ],
      optionNotes: {
        a: "新規事業への参入見送りは、活動をやめるリスク回避です。",
        i: "バックアップは影響度を下げるリスク低減です。",
        u: "正解です。保険は損失負担を移すリスク移転です。",
        e: "残留リスクを受け入れるのはリスク受容です。",
      },
      english:
        "Cyber insurance transfers the financial burden of loss to the insurer.",
      termIds: ["risk-transfer", "risk-cyber-insurance"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["リスク対応", "移転"],
  },
  {
    id: "q-risk-024",
    part: "A",
    topicIds: ["risk-response"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "medium",
    type: "knowledge",
    stem: "リスク移転とリスク共有の違いとして、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "移転は損失の金銭的負担を第三者に移し、共有は複数の当事者でリスクを分担する。",
      },
      {
        id: "i",
        text: "移転はリスクを消滅させ、共有はリスクを低減する。",
      },
      {
        id: "u",
        text: "移転は保険だけを指し、共有は委託だけを指す。",
      },
      {
        id: "e",
        text: "移転と共有は同義であり、区別する必要はない。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "移転は保険などで損失負担を他者に移すこと、共有は委託や共同事業でリスクを複数の当事者に分担させることです。",
      why: [
        "ISO 31000では保険を「リスクの共有」に含めますが、SGの4分類では保険を移転として扱います。",
        "委託しても自社の業務が止まるリスクは残るため、委託は移転ではなく共有または低減として整理します。",
      ],
      optionNotes: {
        a: "正解です。負担を移すのか、分担するのかが違いです。",
        i: "移転してもリスクは消滅しません。共有も低減とは限りません。",
        u: "移転は保険に限らず、契約上の補償もあります。共有も委託に限りません。",
        e: "両者は損失負担の持ち方が異なり、区別して整理します。",
      },
      english:
        "Transfer shifts the financial burden to a third party; sharing distributes the risk among parties.",
      termIds: ["risk-transfer", "risk-reduction"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["移転", "共有"],
  },
  {
    id: "q-risk-025",
    part: "A",
    topicIds: ["risk-response"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "medium",
    type: "knowledge",
    stem: "残留リスクの説明として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "特定したリスクに対して対応を行った後に残るリスク。",
      },
      {
        id: "i",
        text: "まだ特定されていないリスクを含め、組織に残るすべてのリスク。",
      },
      {
        id: "u",
        text: "回避した結果として新たに生じるリスク。",
      },
      {
        id: "e",
        text: "保険で補填されなかった損失額そのもの。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "残留リスクは、特定済みのリスクに対応した後に残るリスクです。未特定のリスクや回避したリスクは含みません。",
      why: [
        "未特定のリスクは、まずリスクアセスメントで特定する対象です。",
        "回避したリスクは活動の停止によって消滅しており、残留リスクには含まれません。",
      ],
      optionNotes: {
        a: "正解です。特定済みリスクへの対応後に残るものが残留リスクです。",
        i: "未特定のリスクは残留リスクに含まれません。",
        u: "回避したリスクは消滅しており、残留リスクではありません。",
        e: "保険で補填されなかった金額は自己負担額であり、残留リスクの定義ではありません。",
      },
      english:
        "Residual risk is what remains after treating an identified risk; unidentified risks and avoided risks are excluded.",
      termIds: ["risk-residual", "risk-acceptance"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["残留リスク", "定義"],
  },
  {
    id: "q-risk-026",
    part: "A",
    topicIds: ["risk-continuity"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "medium",
    type: "knowledge",
    stem: "緊急時対応計画の目的として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "事業プロセスの中断影響を分析し、復旧の優先順位を決める。",
      },
      {
        id: "i",
        text: "インシデント発生直後の初動、被害拡大の防止、連絡、封じ込めを定める。",
      },
      {
        id: "u",
        text: "システムとデータを復旧する具体的な手順を定める。",
      },
      {
        id: "e",
        text: "事業全体の継続戦略と体制を定める。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "緊急時対応計画は、発生直後の人命安全、被害拡大の防止、連絡、封じ込めを定める計画です。",
      why: [
        "復旧計画はシステムとデータを戻す手順、BCPは事業全体の継続戦略を定めます。",
        "中断影響の分析と優先順位の決定はBIAの役割です。",
      ],
      optionNotes: {
        a: "これはBIAの役割です。",
        i: "正解です。初動と封じ込めを定めるのが緊急時対応計画です。",
        u: "これは復旧計画の役割です。",
        e: "これはBCPの役割です。",
      },
      english:
        "The emergency response plan covers immediate actions, containment, and communication right after an incident.",
      termIds: ["risk-bia", "risk-rto"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["緊急時対応", "BCP"],
  },
  {
    id: "q-risk-027",
    part: "A",
    topicIds: ["risk-continuity"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "medium",
    type: "knowledge",
    stem: "BIA（ビジネスインパクト分析）の目的として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "システム復旧の具体的な手順を決定する。" },
      {
        id: "i",
        text: "事業中断の影響を分析し、復旧の優先順位と目標を決める。",
      },
      { id: "u", text: "情報資産の価値を金額で算定する。" },
      { id: "e", text: "リスクの発生可能性を統計的に推定する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "BIAは、業務ごとの中断影響と最大許容中断時間を明らかにし、復旧の優先順位とRTO/RPOの根拠を作ります。",
      why: [
        "BIAの結果を受けて、BCP、復旧計画、バックアップ要件が決まります。",
        "復旧手順そのものを決めるのは復旧計画であり、BIAではありません。",
      ],
      optionNotes: {
        a: "復旧手順の決定は復旧計画の役割です。BIAはその前提となる影響と優先順位を明らかにします。",
        i: "正解です。中断影響の分析と復旧優先度の決定がBIAの目的です。",
        u: "資産価値の算定はリスクアセスメントや資産管理の一部であり、BIAの主目的ではありません。",
        e: "発生可能性の推定はリスク分析の役割です。",
      },
      english:
        "BIA analyzes disruption impact and sets recovery priorities and targets, which then drive RTO and RPO.",
      termIds: ["risk-bia", "risk-rto", "risk-rpo"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["BIA", "事業継続"],
  },
  {
    id: "q-risk-028",
    part: "A",
    topicIds: ["risk-continuity"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "easy",
    type: "knowledge",
    stem: "RTOとRPOの説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "RTOは目標復旧時点、RPOは目標復旧時間である。" },
      { id: "i", text: "RTOは目標復旧時間、RPOは目標復旧時点である。" },
      { id: "u", text: "RTOはバックアップ間隔、RPOは復旧作業の時間である。" },
      { id: "e", text: "RTOとRPOは、どちらも復旧後の性能目標である。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "RTOは中断からいつまでに復旧するかという時間の目標、RPOはどの時点のデータまで戻すかという時点の目標です。",
      why: [
        "RTOは「未来の期限」、RPOは「過去の地点」と整理すると混同しません。",
        "RPOはバックアップの間隔によって決まります。",
      ],
      optionNotes: {
        a: "RTOとRPOの説明が入れ替わっています。",
        i: "正解です。RTOは時間、RPOは時点です。",
        u: "RTOはバックアップ間隔ではなく、復旧までの目標時間です。",
        e: "どちらも性能目標ではなく、復旧の時間と時点に関する目標です。",
      },
      english:
        "RTO is the target time to restore service; RPO is the target point in time to which data is recovered.",
      termIds: ["risk-rto", "risk-rpo"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["RTO", "RPO"],
  },
  {
    id: "q-risk-029",
    part: "B",
    topicIds: ["risk-continuity"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "hard",
    type: "scenario",
    stem: "あるシステムは毎日23時にフルバックアップを取得している。RPOは2時間と定められているが、バックアップ方式は変わっていない。ある日17時に障害が発生し、前日23時のバックアップから復旧した。この状況の説明として最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "RPOは18時間であり、目標の2時間を満たしていない。",
      },
      { id: "i", text: "RPOは6時間であり、目標を満たしている。" },
      { id: "u", text: "RTOは18時間であり、目標を満たしている。" },
      { id: "e", text: "RPOは2時間であり、目標を満たしている。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "前日23時から17時までの18時間分のデータが失われ得るため、実質のRPOは18時間で、目標の2時間を満たしていません。",
      why: [
        "RPOはバックアップの間隔で決まり、日次バックアップでは最大24時間近い損失を許容することになります。",
        "RPOを2時間にするには、バックアップ間隔を2時間以内にするか、同期レプリケーションが必要です。",
      ],
      optionNotes: {
        a: "正解です。23時から翌日17時までで18時間です。",
        i: "6時間ではありません。前日23時から起算します。",
        u: "18時間はRTOではなく、データの復旧可能な時点の遅れ（RPO）です。",
        e: "目標値と実現値が混同されています。実際のRPOは18時間です。",
      },
      english:
        "A daily 23:00 backup with a 17:00 failure implies an 18-hour RPO, which misses the two-hour objective.",
      termIds: ["risk-rpo", "risk-backup", "risk-rto"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "RPO", "バックアップ"],
  },
  {
    id: "q-risk-030",
    part: "B",
    topicIds: ["risk-response"],
    lessonIds: ["risk/response-continuity"],
    difficulty: "hard",
    type: "scenario",
    stem: "サイバー保険の契約条件が、損害8,000万円、免責額500万円、支払限度額5,000万円であるとき、保険金の支払額と企業の自己負担額の組合せとして、最も適切なものはどれか。",
    options: [
      { id: "a", text: "支払額5,000万円、自己負担3,000万円" },
      { id: "i", text: "支払額7,500万円、自己負担500万円" },
      { id: "u", text: "支払額8,000万円、自己負担0円" },
      { id: "e", text: "支払額4,500万円、自己負担3,500万円" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "免責額を差し引いた7,500万円と支払限度5,000万円の小さい方が支払額になるため、5,000万円が支払われ、自己負担は3,000万円です。",
      why: [
        "免責額500万円は企業が負担し、それを超える部分が補償の対象になります。",
        "支払限度額を超える部分も企業の自己負担になります。",
      ],
      optionNotes: {
        a: "正解です。min(8,000−500, 5,000)=5,000万円、自己負担は8,000−5,000=3,000万円です。",
        i: "免責額のみを差し引いた額で、支払限度額を超えています。",
        u: "免責額も支払限度額も考慮していません。",
        e: "免責額を差し引いた後に、さらに支払限度を誤って適用しています。",
      },
      english:
        "Payment is min(loss minus deductible, limit) = min(75M, 50M) = 50M yen, leaving 30M yen self-funded.",
      termIds: ["risk-cyber-insurance", "risk-transfer", "risk-residual"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "保険", "計算"],
  },
];
