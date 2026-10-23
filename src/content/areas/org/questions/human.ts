import type { Question } from "@/lib/content/types";

export const humanQuestions: Question[] = [
  {
    id: "q-org-human-001",
    part: "A",
    topicIds: ["org-human"],
    lessonIds: ["org/human"],
    difficulty: "easy",
    type: "knowledge",
    stem: "情報セキュリティ教育における「訓練」の説明として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "規程や脅威に関する知識の習得を目的とし、理解度テストで評価する。" },
      { id: "i", text: "実際の業務を模した状況で行動を試し、判断や手順の実効性を確かめる。" },
      { id: "u", text: "経営層の指示を文書で周知し、遵守状況を監査で確認する。" },
      { id: "e", text: "事故の原因を分析し、懲戒処分の要否を判断する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "訓練は、知識の確認ではなく、実際の状況で適切に行動できるかを試す活動である。",
      why: [
        "教育は知識、啓発は意識、訓練は行動を対象とする。",
        "標的型メール訓練や机上演習は、判断と手順の実効性を確かめる訓練に当たる。",
      ],
      optionNotes: {
        a: "これは教育の説明である。理解度テストは知識の評価に用いる。",
        i: "正解である。訓練は行動と手順の実効性を確かめる。",
        u: "文書の周知は啓発や規程の伝達であり、行動を試す訓練ではない。",
        e: "原因分析や懲戒判断は事故後の対応であり、訓練の定義ではない。",
      },
      english:
        "Education targets knowledge, awareness targets mindset, and training tests behavior in realistic situations.",
      termIds: ["org-security-awareness", "org-targeted-email-training"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["教育・訓練", "基礎"],
  },
  {
    id: "q-org-human-002",
    part: "A",
    topicIds: ["org-human"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "knowledge",
    stem: "標的型メール訓練の効果を測る指標として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "送信した模擬メールの件数と、訓練の実施回数" },
      { id: "i", text: "模擬メールのクリック率と、不審メールの報告率および初報までの時間" },
      { id: "u", text: "eラーニングの受講率と、理解度テストの平均点" },
      { id: "e", text: "インシデントの発生件数と、懲戒処分の件数" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "訓練の目的は検知と報告の改善であるため、クリック率に加えて報告率と初報までの時間を見る。",
      why: [
        "クリック率が低くても、不審メールを報告できなければ被害の封じ込めは遅れる。",
        "実施回数や受講率は活動量であり、行動の変化を直接示す指標ではない。",
      ],
      optionNotes: {
        a: "送信件数と実施回数は活動量であり、従業者の判断や報告の改善を示さない。",
        i: "正解である。クリック率、報告率、初報時間を組み合わせて評価する。",
        u: "受講率と理解度は教育の指標であり、訓練での行動評価ではない。",
        e: "インシデント件数は結果指標になり得るが、訓練の直接の評価にはならない。懲戒件数は不適切である。",
      },
      english:
        "Phishing simulation should be evaluated by click rate together with reporting rate and time to first report.",
      termIds: ["org-targeted-email-training"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["標的型メール訓練", "評価指標"],
  },
  {
    id: "q-org-human-003",
    part: "A",
    topicIds: ["org-human"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "knowledge",
    stem: "内部不正の「機会」を減らす統制として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "従業者の動機を把握するために、私生活の情報を収集して管理する。" },
      { id: "i", text: "申請と承認を同一の担当者が行えるようにし、業務を効率化する。" },
      { id: "u", text: "特権操作を含むログを取得し、業務部門から独立した者が定期的にレビューする。" },
      { id: "e", text: "不正が疑われるまで、権限の棚卸しを実施しない。" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "特権操作のログを独立した者がレビューすることで、不正の実行と隠蔽が難しくなる。",
      why: [
        "不正のトライアングルのうち、組織が直接減らせるのは機会である。",
        "ログの取得だけでなく、業務部門から独立した者による確認が抑止になる。",
      ],
      optionNotes: {
        a: "私生活の情報収集はプライバシー侵害となり、機会を減らす統制として不適切である。",
        i: "申請と承認を同一人物が行うと、不正を一人で完結できる機会を増やす。",
        u: "正解である。独立したレビューが不正の機会を狭める。",
        e: "権限の棚卸しを怠ると、不要な権限が残り、機会が拡大する。",
      },
      english:
        "Reducing opportunity through independent log review and least privilege is more appropriate than collecting private information.",
      termIds: ["org-insider-fraud", "org-least-privilege"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["内部不正", "統制活動"],
  },
  {
    id: "q-org-human-004",
    part: "A",
    topicIds: ["org-human", "org-hr"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "knowledge",
    stem: "セキュリティクリアランスの運用として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "管理職になった時点で、すべての機密情報へのアクセス権を自動的に付与する。" },
      { id: "i", text: "情報の重要度と業務上の必要性に応じて認定し、異動のたびに見直す。" },
      { id: "u", text: "一度認定した従業者には、退職するまで無条件で資格を更新する。" },
      { id: "e", text: "認定の有無にかかわらず、全従業者に同一のアクセス権を与える。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "クリアランスは情報と業務の必要性に紐づけて付与し、異動や退職のたびに見直す。",
      why: [
        "役職は情報を見る必要性の根拠にならない。ニード・トゥ・ノウと組み合わせる。",
        "認定を固定すると、異動後の不要な権限が残り、漏えいの影響が広がる。",
      ],
      optionNotes: {
        a: "管理職という属性だけで全情報へのアクセスを認めるのは、最小権限とニード・トゥ・ノウに反する。",
        i: "正解である。情報ごと・業務ごとに認定し、定期的に見直す。",
        u: "退職まで無条件に更新すると、必要性を確認しないまま権限が残る。",
        e: "全従業者に同一の権限を与えると、機密性が確保できない。",
      },
      english:
        "Clearance should be tied to specific information and duties and reviewed whenever roles change.",
      termIds: ["org-security-clearance", "org-need-to-know"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["セキュリティクリアランス", "人事"],
  },
  {
    id: "q-org-human-005",
    part: "A",
    topicIds: ["org-hr"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "knowledge",
    stem: "従業者と締結する秘密保持契約（NDA）の内容として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "在職中の秘密保持のみを定め、退職後の義務は定めない。" },
      { id: "i", text: "秘密の範囲、例外、期間、返還・破棄、違反時の措置を定める。" },
      { id: "u", text: "違反時の措置は契約に定めず、すべて懲戒処分に一本化する。" },
      { id: "e", text: "公知情報であっても、自社が一度利用した後は秘密として扱うと定める。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "NDAは、秘密の範囲、例外、期間、返還・破棄、違反時の措置を定めることで実効性を持つ。",
      why: [
        "退職後も秘密情報の保護が必要なため、義務の存続を明記する。",
        "公知情報や法令に基づく開示など、例外を定めないと契約が過度に広がる。",
      ],
      optionNotes: {
        a: "退職後の義務を定めないと、退職者による持ち出しを契約上防止できない。",
        i: "正解である。秘密の範囲と例外、期間、措置を明確にする。",
        u: "懲戒処分は雇用関係に基づく措置であり、契約上の違反措置を代替しない。",
        e: "公知情報を秘密として扱うことはできず、例外の定めが必要である。",
      },
      english:
        "An NDA should define scope, exceptions, duration, return or destruction, and remedies, and should survive retirement.",
      termIds: ["org-nda"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["秘密保持契約", "人事"],
  },
  {
    id: "q-org-human-006",
    part: "A",
    topicIds: ["org-hr"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "knowledge",
    stem: "退職者のアカウント管理として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "最終出社日の翌営業日に、まとめて無効化する。" },
      { id: "i", text: "最終出社日中に無効化し、媒体の返却と秘密情報の消去を確認する。" },
      { id: "u", text: "業務引継ぎのため、退職後3か月間はすべての権限を残す。" },
      { id: "e", text: "退職者リストは人事部門だけが保有し、システム管理者には共有しない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "退職日の当日に権限を失効させ、媒体返却と情報の消去まで確認するのが原則である。",
      why: [
        "翌営業日まで権限が残ると、退職者が社内システムにアクセスできる余地が生じる。",
        "人事とシステム管理が退職情報を共有しないと、失効漏れが発生する。",
      ],
      optionNotes: {
        a: "翌営業日までの空白は、不正アクセスや情報持ち出しの機会になる。",
        i: "正解である。当日失効と返却・消去の確認を組み合わせる。",
        u: "引継ぎのために全権限を残すと、必要以上のアクセスを許すことになる。",
        e: "退職情報を共有しないと、アカウントや入退室カードの失効漏れにつながる。",
      },
      english:
        "Accounts should be disabled on the last working day, with media return and data erasure verified.",
      termIds: ["org-employment-lifecycle"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["退職時対応", "人事"],
  },
  {
    id: "q-org-human-007",
    part: "A",
    topicIds: ["org-hr"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "knowledge",
    stem: "内部通報制度の運用として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "通報内容の調査を始める前に、通報者の氏名を全従業者に開示する。" },
      { id: "i", text: "通報窓口を人事部門に限定し、経営層への報告を禁止する。" },
      { id: "u", text: "通報者を特定できないように配慮し、通報を理由とする不利益な取扱いを禁止する。" },
      { id: "e", text: "通報が虚偽であった場合に備え、通報者を常に懲戒処分の対象と定める。" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "通報者の秘匿と不利益取扱いの禁止が、内部通報制度の実効性を支える。",
      why: [
        "公益通報者保護法は、通報を理由とする解雇その他の不利益な取扱いを禁じている。",
        "窓口の独立性を確保し、通報者が安心して相談できる体制が必要である。",
      ],
      optionNotes: {
        a: "通報者の氏名を開示すると、報復や不利益な取扱いの危険が生じる。",
        i: "人事部門だけに限定し経営層への報告を禁じると、重大事案の対応が遅れる。",
        u: "正解である。秘匿と不利益取扱いの禁止が原則となる。",
        e: "虚偽通報を一律に懲戒対象とすると、正当な通報まで抑制される。",
      },
      english:
        "Whistleblower protection requires confidentiality and a prohibition on retaliation.",
      termIds: ["org-internal-reporting"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["内部通報", "コンプライアンス"],
  },
  {
    id: "q-org-human-008",
    part: "B",
    topicIds: ["org-human"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社では、標的型メール訓練を年1回、全従業者に事前通告して実施している。クリック率は年々下がっているが、実際の不審メールの報告はほとんどなく、インシデントの初動も遅い。改善策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "訓練の実施回数を増やし、クリックした従業者を人事評価で減点する。" },
      { id: "i", text: "無通告の訓練を定期的に行い、報告率と初報時間を指標に、報告導線を改善する。" },
      { id: "u", text: "訓練を中止し、メールフィルタの導入だけに切り替える。" },
      { id: "e", text: "クリック率が下がるまで、全従業者に同じeラーニングを繰り返す。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "事前通告された訓練では実際の判断を測れない。無通告の訓練と報告指標の改善が必要である。",
      why: [
        "報告が少なく初動が遅いという課題は、報告導線と報告文化の問題である。",
        "クリックした個人を減点すると、報告をためらう方向に働く。",
      ],
      optionNotes: {
        a: "人事評価での減点は、報告を抑制し、被害の封じ込めを遅らせる。",
        i: "正解である。無通告訓練と報告指標、導線の改善を組み合わせる。",
        u: "技術的対策だけでは、従業者の判断と報告の問題を解決できない。",
        e: "同じ教育の反復は、行動の変化を生みにくい。",
      },
      english:
        "Announced simulations measure compliance, not real judgment. Unannounced drills plus reporting metrics address the actual gap.",
      termIds: ["org-targeted-email-training", "org-security-awareness"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["標的型メール訓練", "科目B"],
  },
  {
    id: "q-org-human-009",
    part: "B",
    topicIds: ["org-human", "org-hr"],
    lessonIds: ["org/human"],
    difficulty: "medium",
    type: "scenario",
    stem: "B社の経理部門は3名で、支払データの作成、承認、送金を同一の担当者が行っている。担当者は長期休暇を取らず、監査も受け入れていない。改善策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "担当者の勤務態度を理由に、直ちに懲戒解雇する。" },
      { id: "i", text: "申請・承認・送金を分離し、困難な部分はログレビューと第三者承認で補完する。" },
      { id: "u", text: "担当者を信頼し、業務の効率化を優先して現状を維持する。" },
      { id: "e", text: "支払額の上限を引き上げ、承認手続を簡素化する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "職務分離を原則とし、小規模組織ではログレビューや第三者承認で補完する。",
      why: [
        "作成・承認・送金の兼任は、不正を一人で完結できる状態である。",
        "長期休暇を取らないことや監査拒否は、不正の兆候として確認すべき行動である。",
      ],
      optionNotes: {
        a: "疑いだけで直ちに懲戒解雇することは、事実確認と弁明の機会を欠く。",
        i: "正解である。分離と代替統制を組み合わせる。",
        u: "信頼を理由に統制を省くと、不正や重大な誤りを防げない。",
        e: "承認手続の簡素化は、統制をさらに弱める。",
      },
      english:
        "Separate preparation, approval, and payment; compensate for limited staff with log review and third-party approval.",
      termIds: ["org-separation-of-duties", "org-insider-fraud"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["職務分離", "科目B"],
  },
  {
    id: "q-org-human-010",
    part: "B",
    topicIds: ["org-hr"],
    lessonIds: ["org/human"],
    difficulty: "hard",
    type: "scenario",
    stem: "C社では、退職した元従業者が、退職後も有効なクラウドストレージのアカウントを使って顧客資料をダウンロードしていた。原因と対策の組合せとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "原因は退職者の倫理観の欠如のみであり、対策は退職者へのeラーニング再受講である。" },
      { id: "i", text: "原因は退職時の権限失効の漏れであり、対策は人事とシステム管理の連携による当日失効と定期点検である。" },
      { id: "u", text: "原因はクラウドの仕様であり、対策はクラウドの利用を全面禁止する。" },
      { id: "e", text: "原因はパスワードの複雑さであり、対策はパスワードの桁数を増やす。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "退職時にクラウドの権限が失効していなかったことが直接の原因であり、人事とシステム管理の連携が必要である。",
      why: [
        "退職者のアカウントが有効なままでは、正当な資格情報でアクセスでき、不正アクセス検知も遅れる。",
        "当日失効、媒体返却、定期的な権限棚卸しを組み合わせることで再発を防ぐ。",
      ],
      optionNotes: {
        a: "倫理教育だけでは、退職後に残った権限を除去できない。",
        i: "正解である。権限失効の漏れを人事とシステム管理の連携で防ぐ。",
        u: "クラウドの利用禁止は業務を損ない、原因への対策にもなっていない。",
        e: "パスワードの桁数を増やしても、有効なアカウントが残ればアクセスできる。",
      },
      english:
        "The root cause is incomplete revocation at offboarding; HR and IT must coordinate same-day deactivation and periodic reviews.",
      termIds: ["org-employment-lifecycle"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["退職時対応", "クラウド", "科目B"],
  },
];
