import type { Question } from "@/lib/content/types";

export const auditPhysicalQuestions: Question[] = [
  {
    id: "q-org-audit-001",
    part: "A",
    topicIds: ["org-audit"],
    lessonIds: ["org/audit-physical"],
    difficulty: "easy",
    type: "knowledge",
    stem: "監査人の独立性を損なう状況として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "監査人が、監査対象部門の日常業務を兼務している。" },
      { id: "i", text: "監査人が、監査結果を経営層に直接報告している。" },
      { id: "u", text: "監査人が、一定期間ごとに担当をローテーションしている。" },
      { id: "e", text: "監査人が、監査対象の資料やログを閲覧している。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "監査対象の業務を兼務すると、自分の仕事を自分で評価する自己評価の利益相反が生じる。",
      why: [
        "独立性は、精神的な面と外観上の面の両方で確保する必要がある。",
        "経営層への直接報告やローテーションは、独立性を支える仕組みである。",
      ],
      optionNotes: {
        a: "正解である。監査対象業務の兼務は独立性を損なう。",
        i: "経営層への直接報告は、監査対象部門からの独立を保つ措置である。",
        u: "ローテーションは、長期間の関係による馴れ合いを防ぐ。",
        e: "資料やログの閲覧は監査に必要な手続であり、独立性を損なわない。",
      },
      english:
        "Performing duties in the audited area creates a self-review conflict and impairs independence.",
      termIds: ["org-auditor-independence"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["監査", "独立性"],
  },
  {
    id: "q-org-audit-002",
    part: "A",
    topicIds: ["org-audit"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "knowledge",
    stem: "システム監査の予備調査の目的として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "監査報告書を作成し、改善勧告を確定する。" },
      { id: "i", text: "組織や業務の概要、リスク、既存の統制を把握し、監査計画を策定する。" },
      { id: "u", text: "統制を再実施して、監査証拠を収集する。" },
      { id: "e", text: "指摘事項の改善状況を確認する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "予備調査では全体像とリスクを把握し、重点項目と手続を定めた監査計画を作る。",
      why: [
        "予備調査の段階で範囲を絞ることで、本調査を効率的かつ深く実施できる。",
        "証拠の収集は本調査、改善状況の確認はフォローアップで行う。",
      ],
      optionNotes: {
        a: "報告書の作成と改善勧告は、本調査と結論を経た後の工程である。",
        i: "正解である。予備調査は監査計画の策定につながる。",
        u: "統制の再実施は本調査の手続である。",
        e: "改善状況の確認はフォローアップの目的である。",
      },
      english:
        "Preliminary work builds an understanding of the organization, risks, and controls to produce the audit plan.",
      termIds: ["org-system-audit"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["監査", "予備調査"],
  },
  {
    id: "q-org-audit-003",
    part: "A",
    topicIds: ["org-audit"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "knowledge",
    stem: "監査証拠の「十分性」と「適切性」の説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "十分性は証拠の関連性と信頼性、適切性は証拠の量を指す。" },
      { id: "i", text: "十分性は証拠の量、適切性は証拠の関連性と信頼性を指す。" },
      { id: "u", text: "どちらも証拠の量だけを指す。" },
      { id: "e", text: "どちらも証拠の入手元の数だけを指す。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "十分性は結論を支えるだけの量があること、適切性は関連性と信頼性があることを指す。",
      why: [
        "量が多くても無関係な証拠は結論を支えない。",
        "関連性が高くても量が不足すれば、監査人は結論を導けない。",
      ],
      optionNotes: {
        a: "十分性と適切性の定義が逆になっている。",
        i: "正解である。十分性は量、適切性は質を指す。",
        u: "量だけでは適切性を説明できない。",
        e: "入手元の数だけでは、証拠の関連性や信頼性を説明できない。",
      },
      english:
        "Sufficiency concerns the quantity of evidence; appropriateness concerns its relevance and reliability.",
      termIds: ["org-audit-evidence"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["監査証拠", "監査"],
  },
  {
    id: "q-org-audit-004",
    part: "A",
    topicIds: ["org-audit"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "knowledge",
    stem: "監査におけるフォローアップの説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "監査報告書を経営層に提出すること" },
      { id: "i", text: "監査で指摘された事項の改善状況と、是正の有効性を確認すること" },
      { id: "u", text: "監査計画を策定すること" },
      { id: "e", text: "監査証拠を収集すること" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "フォローアップは、改善の実施と有効性を確認する手続であり、報告書の提出で完了しない。",
      why: [
        "改善計画が提出されても、実施され有効に機能しなければ指摘は解消しない。",
        "必要に応じて再監査を行い、未改善の事項は経営層へエスカレーションする。",
      ],
      optionNotes: {
        a: "報告書の提出は監査の一工程であり、フォローアップそのものではない。",
        i: "正解である。改善状況と有効性の確認を指す。",
        u: "監査計画の策定は予備調査の工程である。",
        e: "証拠の収集は本調査の工程である。",
      },
      english:
        "Follow-up confirms that remediation was implemented and is effective; issuing the report does not complete it.",
      termIds: ["org-follow-up"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["フォローアップ", "監査"],
  },
  {
    id: "q-org-audit-005",
    part: "A",
    topicIds: ["org-audit"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "knowledge",
    stem: "内部統制の5要素の組合せとして、正しいものはどれか。",
    options: [
      { id: "a", text: "統制環境、リスク評価、統制活動、情報と伝達、モニタリング" },
      { id: "i", text: "統制環境、リスク評価、監査、懲戒、モニタリング" },
      { id: "u", text: "方針、手続、教育、訓練、監査" },
      { id: "e", text: "機密性、完全性、可用性、真正性、責任追跡性" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "内部統制の5要素は、統制環境、リスク評価、統制活動、情報と伝達、モニタリングである。",
      why: [
        "統制環境が土台となり、リスク評価に基づく統制活動を、情報と伝達が支え、モニタリングが評価する。",
        "監査や懲戒は統制の手段・制度であり、5要素そのものではない。",
      ],
      optionNotes: {
        a: "正解である。5要素を正しく列挙している。",
        i: "監査と懲戒は5要素に含まれない。監査はモニタリングの一手段である。",
        u: "方針、手続、教育、訓練は統制活動等の具体例であり、5要素の分類ではない。",
        e: "機密性、完全性、可用性などは情報セキュリティの特性であり、内部統制の5要素ではない。",
      },
      english:
        "The five components are control environment, risk assessment, control activities, information and communication, and monitoring.",
      termIds: ["org-internal-control", "org-control-environment", "org-monitoring"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["内部統制", "5要素"],
  },
  {
    id: "q-org-audit-006",
    part: "A",
    topicIds: ["org-physical"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "knowledge",
    stem: "アンチパスバックの説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "二人が同時にゲートを通過する共連れを防ぐ。" },
      { id: "i", text: "入室と退室の記録の整合をとり、記録なしの退室や再入室を防ぐ。" },
      { id: "u", text: "退室時に所持品の盗難を検査する。" },
      { id: "e", text: "入室時に生体情報を登録する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "アンチパスバックは入退室の順序を強制し、記録の不整合を防ぐ統制である。",
      why: [
        "入室記録なしの退室や、退室記録なしの再入室を検知できる。",
        "共連れ防止は、一人ずつの認証やインターロックなど別の統制で対応する。",
      ],
      optionNotes: {
        a: "共連れ防止はアンチパスバックの機能ではない。別の統制が必要である。",
        i: "正解である。入退室記録の整合を保つ。",
        u: "所持品検査は、退室時の盗難防止策であり、アンチパスバックとは異なる。",
        e: "生体情報の登録は認証方式の話であり、アンチパスバックの定義ではない。",
      },
      english:
        "Anti-passback enforces entry and exit sequence; tailgating prevention requires separate controls such as interlocking gates.",
      termIds: ["org-anti-passback"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["入退室管理", "物理的セキュリティ"],
  },
  {
    id: "q-org-audit-007",
    part: "A",
    topicIds: ["org-physical"],
    lessonIds: ["org/audit-physical"],
    difficulty: "easy",
    type: "knowledge",
    stem: "クリアデスクとクリアスクリーンの説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "クリアデスクは離席時に画面をロックし、クリアスクリーンは机上を施錠保管する。" },
      { id: "i", text: "クリアデスクは機密文書や媒体を施錠保管し、クリアスクリーンは離席時に画面をロックする。" },
      { id: "u", text: "どちらもサーバ室の入退室を管理する統制である。" },
      { id: "e", text: "どちらもデータの完全性を確保する技術的統制である。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "クリアデスクは机上の機密情報の施錠保管、クリアスクリーンは画面のロックを指す。",
      why: [
        "クリアデスクは書類や媒体の盗難・紛失・のぞき見を減らす。",
        "クリアスクリーンは離席中の画面閲覧や不正操作を防ぐ。",
      ],
      optionNotes: {
        a: "クリアデスクとクリアスクリーンの説明が入れ替わっている。",
        i: "正解である。机上の施錠保管と画面ロックを区別する。",
        u: "どちらも執務環境の統制であり、サーバ室の入退室管理ではない。",
        e: "どちらも物理的・運用的な統制であり、データの完全性を直接保証する技術的統制ではない。",
      },
      english:
        "Clear desk secures documents and media; clear screen locks workstations when unattended.",
      termIds: ["org-clear-desk", "org-clear-screen"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["クリアデスク", "物理的セキュリティ"],
  },
  {
    id: "q-org-audit-008",
    part: "B",
    topicIds: ["org-audit"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "scenario",
    stem: "G社の内部監査部門は、情報システム部門の運用改善プロジェクトに設計段階から参加し、改善案を自ら作成した。その後、同じシステムの監査を担当することになった。最も適切な対応はどれか。",
    options: [
      { id: "a", text: "自ら作成した改善案であるため、効率的に監査できる。" },
      { id: "i", text: "自己評価の利益相反が生じるため、監査担当を変更するか、独立した第三者を関与させる。" },
      { id: "u", text: "監査対象部門の了解があれば、独立性の問題は生じない。" },
      { id: "e", text: "改善案の作成者であることを報告書に書かなければ問題ない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "自ら設計・改善に関与したシステムを監査すると、自己評価の利益相反が生じる。",
      why: [
        "監査人は、自分の作成した統制を客観的に評価できない。",
        "担当の変更や独立した第三者の関与により、独立性を確保する。",
      ],
      optionNotes: {
        a: "関与があるほど効率的に見えるが、客観性は損なわれる。",
        i: "正解である。利益相反を除く措置を講じる。",
        u: "監査対象部門の了解は、独立性の欠如を解消しない。",
        e: "報告書への記載は透明性を高めるが、利益相反そのものを解消しない。",
      },
      english:
        "Auditing a system you designed creates a self-review conflict; reassign the audit or involve an independent party.",
      termIds: ["org-auditor-independence", "org-internal-control"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["独立性", "監査", "科目B"],
  },
  {
    id: "q-org-audit-009",
    part: "B",
    topicIds: ["org-physical"],
    lessonIds: ["org/audit-physical"],
    difficulty: "medium",
    type: "scenario",
    stem: "H社のサーバ室はICカードで入退室を管理しているが、従業者が同僚と同時に入室する「共連れ」が常態化している。入退室記録は実際の在室状況と一致していない。改善策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "アンチパスバックを導入すれば、共連れも自動的に防止できる。" },
      { id: "i", text: "インターロックや一人ずつの認証を導入し、共連れ防止の運用と監視を徹底する。" },
      { id: "u", text: "ICカードの暗証番号を短くし、入力の負担を減らす。" },
      { id: "e", text: "監視カメラを撤去し、従業者のプライバシーを保護する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "共連れを防ぐには、一人ずつの認証と物理的なゲート制御、運用の徹底が必要である。",
      why: [
        "アンチパスバックは記録の整合を保つが、同時入室そのものは防げない。",
        "入退室記録と在室状況の不一致は、監査や災害時の安否確認にも影響する。",
      ],
      optionNotes: {
        a: "アンチパスバックだけでは共連れを防げない。",
        i: "正解である。インターロックと一人ずつの認証、運用の徹底を組み合わせる。",
        u: "暗証番号を短くすると、認証の強度が下がる。",
        e: "監視カメラの撤去は、抑止と事後検証の手段を失う。",
      },
      english:
        "Prevent tailgating with interlocking gates and one-person authentication; anti-passback alone does not stop simultaneous entry.",
      termIds: ["org-anti-passback", "org-physical-zoning"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["共連れ", "物理的セキュリティ", "科目B"],
  },
  {
    id: "q-org-audit-010",
    part: "B",
    topicIds: ["org-physical"],
    lessonIds: ["org/audit-physical"],
    difficulty: "hard",
    type: "scenario",
    stem: "I社のサーバ室ではUPSを導入しているが、停電時にサーバが正常に停止せず、データが破損した。原因と対策の組合せとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "UPSのバッテリが劣化していた可能性があり、定期試験と交換計画、停止手順の確認が必要である。" },
      { id: "i", text: "UPSを導入すれば長時間の停電にも対応できるため、発電機は不要である。" },
      { id: "u", text: "停電時にすべての機器を同時に再起動すればよい。" },
      { id: "e", text: "UPSの容量を増やせば、バッテリの点検は不要になる。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "UPSのバッテリ劣化や停止手順の不備が、停電時のデータ破損につながる。定期試験と交換、手順の確認が必要である。",
      why: [
        "UPSの稼働時間には限りがあり、バッテリは経年劣化する。",
        "サーバを安全に停止する順序と、発電機への切り替えを事前に決めておく。",
      ],
      optionNotes: {
        a: "正解である。バッテリ試験・交換と停止手順の確認を行う。",
        i: "UPSは長時間の停電を支えるものではなく、発電機等との組合せが必要である。",
        u: "同時再起動は、電源投入時の負荷集中やデータ整合性の問題を招く。",
        e: "容量を増やしても、バッテリの劣化と点検の必要性は変わらない。",
      },
      english:
        "Battery degradation and unclear shutdown procedures cause data loss; test batteries, plan replacement, and document shutdown order.",
      termIds: ["org-ups"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["UPS", "電源", "科目B"],
  },
];
