import type { Area } from "@/lib/content/types";

const terms = [
  {
    id: "sec-cia-confidentiality",
    ja: "機密性",
    reading: "きみつせい",
    en: "Confidentiality",
    shortJa: "許可された人だけが情報を利用できる性質。",
    shortEn: "The property that information is not disclosed to unauthorized parties.",
    explanationJa:
      "機密性は、情報へのアクセスを許可された主体だけに限定する性質です。暗号化、アクセス制御、権限管理などで確保します。可用性とのトレードオフが問われることがあります。",
    explanationEn:
      "Confidentiality limits access to authorized subjects. It is achieved through encryption, access control, and privilege management.",
    examUsage:
      "「情報漏えいを防ぐ」＝機密性、「改ざんを防ぐ」＝完全性、「止まらない」＝可用性、と目的語で判別します。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-cia-integrity", "sec-cia-availability"],
    tags: ["CIA", "基礎"],
  },
  {
    id: "sec-cia-integrity",
    ja: "完全性",
    reading: "かんぜんせい",
    en: "Integrity",
    shortJa: "情報が正確で、改ざんされていない性質。",
    shortEn: "The property of being accurate and complete, free from unauthorized modification.",
    explanationJa:
      "完全性は、情報が正確かつ完全であり、不正な変更がされていないことを保証する性質です。ハッシュ、デジタル署名、入力検証などで確保します。",
    explanationEn:
      "Integrity ensures information is accurate and complete and has not been modified without authorization.",
    examUsage:
      "「改ざん検知」「真正性の確保」と結び付けて出題されます。可用性の「完全性」と混同しないよう注意します。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-cia-confidentiality", "sec-cia-availability"],
    tags: ["CIA", "基礎"],
  },
] as const;

const lesson = {
  id: "security/cia-and-design",
  areaId: "security",
  topicIds: ["sec-cia"],
  title: "CIAとセキュリティ設計の原則",
  titleEn: "CIA and Security Design Principles",
  summary:
    "情報セキュリティの出発点である機密性・完全性・可用性を、具体的な事故例と設計原則から理解します。",
  readingMinutes: 12,
  difficulty: "easy" as const,
  prerequisites: [],
  objectives: [
    "CIAの3特性を、事故の目的語から判別できる",
    "多層防御・セキュリティバイデザイン・プライバシーバイデザインの違いを説明できる",
    "SG科目Bの事例で、どの特性が損なわれたかを特定できる",
  ],
  sections: [
    {
      id: "why",
      title: "なぜCIAから始めるのか",
      blocks: [
        {
          type: "lead",
          text: "情報セキュリティは「怖い攻撃を暗記する科目」ではありません。まず **守るべき性質** を定め、その性質を損なう要因を脅威・脆弱性として整理します。",
        },
        {
          type: "p",
          text: "SGの試験では、事故や統制の説明に対して「これは機密性・完全性・可用性のどれを守るのか」を問う問題が繰り返し出ます。用語だけでなく、**どの事故がどの特性を損なうか** を結び付けてください。",
        },
        {
          type: "diagram",
          diagram: "cia-triad",
          caption: "CIAの3特性。中心に情報資産、外側に確保する性質を置くと整理しやすい。",
        },
      ],
    },
    {
      id: "three-properties",
      title: "3つの特性を事故で読み替える",
      blocks: [
        {
          type: "table",
          caption: "CIAの定義と代表的な事故・対策",
          headers: ["特性", "定義", "損なう事故の例", "主な対策"],
          rows: [
            [
              "機密性（Confidentiality）",
              "許可された人だけが情報を利用できる",
              "顧客名簿の漏えい、盗聴、誤送信",
              "暗号化、アクセス制御、DLP、権限レビュー",
            ],
            [
              "完全性（Integrity）",
              "情報が正確で、不正に変更されていない",
              "Webページの改ざん、入金データの書換え",
              "ハッシュ、デジタル署名、入力検証、ログ",
            ],
            [
              "可用性（Availability）",
              "必要なときに情報やシステムを利用できる",
              "DDoS、ランサムウェア、長時間障害",
              "冗長化、バックアップ、UPS、監視",
            ],
          ],
          note: "可用性は「止まらない」だけでなく「必要な性能で使える」ことも含みます。",
        },
        {
          type: "terms",
          termIds: ["sec-cia-confidentiality", "sec-cia-integrity"],
        },
        {
          type: "callout",
          tone: "trap",
          title: "試験の罠：可用性と完全性",
          text: "「データが消えた」は可用性の喪失、「データが書き換えられた」は完全性の喪失です。ランサムウェアは暗号化により可用性を損ない、身代金支払い後の復号失敗は完全性も問題にします。",
        },
      ],
    },
    {
      id: "design",
      title: "設計原則：守りを重ね、最初から組み込む",
      blocks: [
        {
          type: "comparison",
          left: {
            title: "多層防御（Defense in Depth）",
            items: [
              "境界・端末・アプリ・データ・人の各層で対策",
              "一つの対策が破られても次で検知・阻止",
              "例：FW、EDR、WAF、暗号化、教育",
            ],
          },
          right: {
            title: "セキュリティバイデザイン",
            items: [
              "企画・設計段階からセキュリティを組み込む",
              "後付けの対策よりコストと事故率を下げやすい",
              "例：脅威モデリング、セキュア開発、プライバシーバイデザイン",
            ],
          },
        },
        {
          type: "interactive",
          widget: "cia-impact",
          title: "CIA影響シミュレーター",
        },
        {
          type: "callout",
          tone: "tip",
          title: "科目Bでの使い方",
          text: "事例文の「顧客に迷惑をかけた」「売上機会を失った」は可用性、「誤った請求書を送った」は完全性、「秘密情報が外部に渡った」は機密性として読み替えると、設問の意図がつかみやすくなります。",
        },
      ],
    },
  ],
  keyPoints: [
    "CIAは目的、脅威・脆弱性・リスクは原因と大きさ、管理策は手段",
    "事故の目的語から損なわれた特性を判別する",
    "多層防御は「重ねる」、セキュリティバイデザインは「最初から組み込む」",
  ],
  examTraps: [
    "真正性・責任追跡性・否認防止・信頼性はCIAの補助特性として整理する",
    "可用性を「情報が正確」と説明する選択肢は誤り",
    "多層防御とセキュリティバイデザインを同一視しない",
  ],
  relatedLessonIds: ["security/threats-and-malware"],
  termIds: ["sec-cia-confidentiality", "sec-cia-integrity"],
  sources: [
    {
      label: "IPA SG シラバス Ver.4.1",
      url: "https://www.ipa.go.jp/shiken/syllabus/nl10bi0000007tch-att/syllabus_sg_ver4_1.pdf",
      note: "重点分野 大分類1 中分類1 小分類1",
    },
  ],
} as const;

const questions = [
  {
    id: "q-security-cia-001",
    part: "A" as const,
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "easy" as const,
    type: "knowledge" as const,
    stem: "情報セキュリティの3特性のうち、Webサーバ上の顧客データが攻撃者によって書き換えられた場合に、主として損なわれるものはどれか。",
    options: [
      { id: "a" as const, text: "可用性" },
      { id: "i" as const, text: "完全性" },
      { id: "u" as const, text: "機密性" },
      { id: "e" as const, text: "責任追跡性" },
    ],
    correctOptionId: "i" as const,
    explanation: {
      correct: "完全性が損なわれます。データが不正に変更されていない性質が完全性です。",
      why: [
        "書き換えは「正確で完全な状態」を壊す行為であり、完全性の侵害に当たります。",
        "機密性は許可されない開示、可用性は利用できない状態に関する特性です。",
      ],
      optionNotes: {
        a: "可用性は、必要なときに利用できる性質です。書き換えられても利用できる場合は可用性の侵害とは限りません。",
        i: "正解です。改ざんは完全性の侵害です。",
        u: "機密性は、許可されていない者に情報が開示されることで損なわれます。",
        e: "責任追跡性は、行為者を後から追跡できる性質です。改ざん自体の影響を直接表すものではありません。",
      },
      english:
        "Unauthorized modification of data violates integrity. Confidentiality concerns disclosure, and availability concerns access to the service.",
      termIds: ["sec-cia-integrity"],
    },
    source: {
      kind: "original" as const,
      attribution: "本サイト独自問題",
    },
    tags: ["CIA", "完全性"],
  },
  {
    id: "q-security-cia-002",
    part: "B" as const,
    topicIds: ["sec-cia", "risk-response"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "medium" as const,
    type: "scenario" as const,
    stem: "A社では、顧客向けWebサイトがDDoS攻撃を受け、平日の午前中に約3時間利用できなくなった。復旧後、データベースの内容に不正な変更は確認されなかった。このインシデントで主として損なわれた情報セキュリティの特性はどれか。",
    options: [
      { id: "a" as const, text: "機密性" },
      { id: "i" as const, text: "完全性" },
      { id: "u" as const, text: "可用性" },
      { id: "e" as const, text: "否認防止" },
    ],
    correctOptionId: "u" as const,
    explanation: {
      correct: "サービスが3時間利用できなくなったため、可用性が損なわれています。",
      why: [
        "DDoS攻撃はサービスを利用不能にする攻撃で、可用性への影響が中心的です。",
        "データの不正変更がないと明記されているため、完全性の侵害は確認されていません。",
      ],
      optionNotes: {
        a: "情報の開示は起きていないため、機密性の侵害は確認できません。",
        i: "不正な変更は確認されていないため、完全性は主要な侵害ではありません。",
        u: "正解です。サービス停止は可用性の侵害です。",
        e: "否認防止は、行為者が後から行為を否認できない性質で、可用性とは異なります。",
      },
      termIds: ["sec-cia-confidentiality"],
    },
    source: {
      kind: "original" as const,
      attribution: "本サイト独自問題",
    },
    tags: ["CIA", "DDoS", "科目B"],
  },
] as const;

export const exampleArea: Area = {
  id: "security",
  order: 1,
  title: "情報セキュリティの基礎",
  titleEn: "Security Fundamentals",
  shortTitle: "基礎",
  description:
    "CIAを出発点に、脅威・脆弱性・攻撃手法・暗号・認証まで、SG全体を支える土台を築きます。",
  color: "var(--c1)",
  lessons: [lesson],
  terms: [...terms],
  questions: [...questions],
};
