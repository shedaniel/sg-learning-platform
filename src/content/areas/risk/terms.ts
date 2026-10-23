import type { GlossaryTerm } from "@/lib/content/types";

export const terms: GlossaryTerm[] = [
  // ── risk/fundamentals ──────────────────────────────────────────
  {
    id: "risk-information-asset",
    ja: "情報資産",
    reading: "じょうほうしさん",
    en: "Information asset",
    shortJa: "情報そのものと、情報を扱う媒体・装置・人・サービスの総称。",
    shortEn:
      "Information itself plus the media, devices, people, and services that handle it.",
    explanationJa:
      "情報資産には、文書やデータだけでなく、記録媒体、サーバや端末、業務マニュアル、情報を扱う要員、クラウドサービスも含まれる。リスクマネジメントは、まず何が情報資産かを決めることから始まる。",
    explanationEn:
      "Information assets include documents, data, storage media, servers, endpoints, procedures, personnel, and cloud services. Risk management begins by deciding what counts as an asset.",
    examUsage:
      "「情報資産はデータだけ」と限定する選択肢は誤り。媒体・装置・人・外部サービスまで含めて考える。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-asset-inventory", "risk-asset-value"],
    tags: ["情報資産", "基礎"],
  },
  {
    id: "risk-asset-inventory",
    ja: "情報資産台帳",
    reading: "じょうほうしさんだいちょう",
    en: "Information asset inventory",
    shortJa: "情報資産の所在・管理者・重要度を一覧で管理する台帳。",
    shortEn:
      "A register that lists each information asset with its location, owner, and criticality.",
    explanationJa:
      "情報資産台帳には、資産ID、資産名、分類、所有者と管理者、保管場所、関連業務、CIA評価、保存期間、廃棄方法などを記録する。台帳に載っていない資産は保護対象から漏れるため、棚卸しと更新の仕組みが重要である。",
    explanationEn:
      "An inventory records asset ID, name, classification, owner, location, related business processes, CIA rating, retention, and disposal. Assets missing from the inventory fall outside protection.",
    examUsage:
      "台帳の目的は「資産の把握と管理責任の明確化」。ログ保存や脆弱性診断の記録とは目的が異なる。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-information-asset", "risk-asset-value"],
    tags: ["情報資産", "台帳"],
  },
  {
    id: "risk-asset-value",
    ja: "情報資産の価値",
    reading: "じょうほうしさんのかち",
    en: "Asset value",
    shortJa: "資産を失ったときの事業への影響の大きさ。取得価格とは限らない。",
    shortEn:
      "The business impact of losing an asset, which is not necessarily its purchase price.",
    explanationJa:
      "資産の価値は、機密性・完全性・可用性の3特性ごとに評価する。再取得原価、業務停止の影響、法的な保存義務、代替可能性を組み合わせ、金額に換算できないものは重要度の区分で扱う。",
    explanationEn:
      "Value is assessed per confidentiality, integrity, and availability, using replacement cost, business interruption impact, legal obligations, and substitutability.",
    examUsage:
      "「重要度が高い＝機密性が高い」と決めつけない。可用性が重要な制御システムもある。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-information-asset", "risk-property-loss"],
    tags: ["情報資産", "CIA"],
  },
  {
    id: "risk-property-loss",
    ja: "財産損失",
    reading: "ざいさんそんしつ",
    en: "Property loss",
    shortJa: "建物・設備・データなど資産そのものが損壊・滅失する損失。",
    shortEn:
      "Loss from damage to or destruction of buildings, equipment, or data.",
    explanationJa:
      "火災によるサーバ焼失、機器の故障、データの消失と再作成費用などが該当する。再取得費用として金額を把握しやすい。バックアップや冗長化はこの損失を減らす。",
    explanationEn:
      "Examples include servers destroyed by fire, hardware failure, and data loss with re-creation costs. Backups and redundancy reduce this loss.",
    examUsage:
      "「資産そのものの損壊・再取得費用」が財産損失。「賠償」は責任損失、「売上減」は純収益損失と区別する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-liability-loss", "risk-net-income-loss"],
    tags: ["損失", "基礎"],
  },
  {
    id: "risk-liability-loss",
    ja: "責任損失",
    reading: "せきにんそんしつ",
    en: "Liability loss",
    shortJa: "第三者への損害賠償や訴訟費用など、法的責任から生じる損失。",
    shortEn:
      "Loss from legal liability, such as damages paid to third parties and litigation costs.",
    explanationJa:
      "個人情報の漏えいによる損害賠償、取引先への賠償、訴訟費用、行政上の制裁などが該当する。サイバー保険の主要な補償対象であり、事故の規模が大きいほど金額が読めない点に特徴がある。",
    explanationEn:
      "Examples include damages for personal data breaches, compensation to business partners, litigation costs, and regulatory penalties. Cyber insurance commonly covers this category.",
    examUsage:
      "「被害者への賠償金」「訴訟費用」は責任損失。同じ漏えい事故でも、売上減少は純収益損失に分ける。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-property-loss", "risk-cyber-insurance"],
    tags: ["損失", "賠償"],
  },
  {
    id: "risk-net-income-loss",
    ja: "純収益損失",
    reading: "じゅんしゅうえきそんしつ",
    en: "Net income loss",
    shortJa: "事業停止や信用低下によって失われる利益・売上機会の損失。",
    shortEn:
      "Lost profit and sales opportunities caused by downtime or reputational damage.",
    explanationJa:
      "システム停止中の売上減少、復旧までの代替手段の費用、信用低下による顧客離れなどが該当する。在庫や設備が無事でも、事業が止まれば発生する。停止時間が長いほど拡大する。",
    explanationEn:
      "This includes lost sales during outages, costs of workarounds, and customer churn from reputational damage. It grows with outage duration even when physical assets are intact.",
    examUsage:
      "「機会損失」「売上減少」「顧客離れ」は純収益損失。再開のための追加費用も純収益損失に含めて整理する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-property-loss", "risk-human-loss"],
    tags: ["損失", "事業停止"],
  },
  {
    id: "risk-human-loss",
    ja: "人的損失",
    reading: "じんてきそんしつ",
    en: "Human loss",
    shortJa: "従業員の死傷・健康被害・休業・士気低下による損失。",
    shortEn:
      "Loss involving injury, illness, absence, or lowered morale of personnel.",
    explanationJa:
      "事故や過重労働による休業、退職、生産性の低下、技術者の喪失などが該当する。金額に換算しにくいが、復旧を担う人材が失われると事業継続に直結する。労働安全や働き方の管理も情報セキュリティの一部として扱う。",
    explanationEn:
      "This covers absence, turnover, and productivity loss from accidents or overwork. Though hard to quantify, losing the people who perform recovery directly threatens continuity.",
    examUsage:
      "「従業員の休業・健康被害」は人的損失。顧客への賠償と混同しない。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-net-income-loss", "risk-liability-loss"],
    tags: ["損失", "人材"],
  },
  {
    id: "risk-operational-risk",
    ja: "オペレーショナルリスク",
    reading: "おぺれーしょなるりすく",
    en: "Operational risk",
    shortJa: "業務プロセスの不備や作業ミスなど、日常業務に起因するリスク。",
    shortEn:
      "Risk arising from flawed processes, operational errors, and daily work practices.",
    explanationJa:
      "手順の抜け、担当者の作業ミス、属人化、チェック体制の不足などが原因となる。システム障害だけでなく、業務の回し方そのものがリスク源になる。手順の標準化、自動化、ダブルチェック、記録の徹底で低減する。",
    explanationEn:
      "Causes include missing procedures, human error, key-person dependence, and weak checks. Standardization, automation, dual checks, and record keeping reduce it.",
    examUsage:
      "「業務手順の不備」「担当者のミス」はオペレーショナルリスク。外部サービスや委託先に起因するものと区別する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-supply-chain-risk", "risk-external-service-risk"],
    tags: ["リスク分類", "業務"],
  },
  {
    id: "risk-supply-chain-risk",
    ja: "サプライチェーンリスク",
    reading: "さぷらいちぇーんりすく",
    en: "Supply chain risk",
    shortJa: "取引先・委託先・部品供給者など供給網の途絶や問題によるリスク。",
    shortEn:
      "Risk from disruption or failure anywhere in the network of suppliers and contractors.",
    explanationJa:
      "一次請けだけでなく、二次請け・三次請けのセキュリティ事故、部品やサービスの供給停止、品質問題を含む。自社の管理が及ばない範囲が広いほど、把握と契約上の手当てが重要になる。",
    explanationEn:
      "It includes incidents at second- and third-tier suppliers, supply disruption, and quality failures. The less visibility a company has, the more contracts and monitoring matter.",
    examUsage:
      "「再委託先で発生した事故」はサプライチェーンリスク。クラウド事業者の障害は外部サービスリスクとして整理する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-external-service-risk", "risk-operational-risk"],
    tags: ["リスク分類", "委託"],
  },
  {
    id: "risk-external-service-risk",
    ja: "外部サービスリスク",
    reading: "がいぶさーびすりすく",
    en: "External service risk",
    shortJa: "クラウドやSaaSなど外部ITサービスの停止・変更・契約終了によるリスク。",
    shortEn:
      "Risk from outage, change, or termination of external IT services such as cloud and SaaS.",
    explanationJa:
      "サービス障害、仕様変更、値上げ、契約終了、データの所在地変更などが該当する。自社で制御できない部分が大きいため、SLA、データの持ち出し、代替手段、終了時の移行計画を契約段階で確認する。",
    explanationEn:
      "Examples include outages, specification changes, price increases, contract termination, and data location changes. SLA, exportability, fallback, and exit plans must be checked at contract time.",
    examUsage:
      "クラウド事業者の大規模障害は外部サービスリスク。委託先の下請け管理不備はサプライチェーンリスクとして区別する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-supply-chain-risk", "risk-net-income-loss"],
    tags: ["リスク分類", "クラウド"],
  },
  {
    id: "risk-sns-risk",
    ja: "SNSリスク",
    reading: "えすえぬえすりすく",
    en: "Social media risk",
    shortJa: "SNS投稿やアカウント乗っ取りによる情報漏えい・風評・なりすましのリスク。",
    shortEn:
      "Risk of data leakage, reputational damage, or impersonation through social media.",
    explanationJa:
      "従業員の私的投稿からの情報漏えい、公式アカウントの乗っ取り、偽アカウントによる顧客の誘導、投稿内容による炎上などを含む。アカウントの多要素認証、投稿ルール、監視、削除依頼の手順を整備する。",
    explanationEn:
      "This includes leaks from employee posts, hijacked official accounts, fake accounts targeting customers, and online backlash. Countermeasures include MFA, posting rules, monitoring, and takedown procedures.",
    examUsage:
      "公式アカウント乗っ取りで顧客が偽窓口に個人情報を送った事例は、SNSリスクと責任損失の組合せで整理する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-liability-loss", "risk-external-service-risk"],
    tags: ["リスク分類", "SNS"],
  },
  {
    id: "risk-geopolitical-risk",
    ja: "地政学リスク",
    reading: "ちせいがくりすく",
    en: "Geopolitical risk",
    shortJa: "国家間の対立・制裁・法規制など地政学的変化によるリスク。",
    shortEn:
      "Risk from geopolitical change such as conflict, sanctions, and regulation.",
    explanationJa:
      "国家間の対立、経済制裁、輸出入規制、データの越境規制、海外拠点や海外データセンターの停止などが該当する。サプライチェーンの集中や特定国への依存は、このリスクを増幅させる。調達先の分散と法規制の継続的な確認が必要である。",
    explanationEn:
      "Examples include conflict, sanctions, export controls, data localization rules, and shutdowns of overseas sites. Concentration in one country amplifies the risk.",
    examUsage:
      "「経済制裁で海外の取引先と取引できなくなった」は地政学リスク。技術的な脆弱性とは原因の軸が異なる。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-supply-chain-risk", "risk-external-service-risk"],
    tags: ["リスク分類", "地政学"],
  },
  {
    id: "risk-moral-hazard",
    ja: "モラルハザード",
    reading: "もらるはざーど",
    en: "Moral hazard",
    shortJa: "保険や委託で損失負担が移ると、当事者の注意が緩む現象。",
    shortEn:
      "The tendency for care to decline when insurance or outsourcing shifts the loss burden.",
    explanationJa:
      "保険加入後にパッチ適用を後回しにする、委託先の点検を省く、損失を隠すといった行動が該当する。故意の不正だけでなく、注意義務の低下も含む。免責額、監査権、報告義務、KPIなどで抑止する。",
    explanationEn:
      "Examples include deferring patching after buying insurance or skipping contractor checks. It includes negligence, not only intentional fraud. Deductibles, audit rights, reporting duties, and KPIs mitigate it.",
    examUsage:
      "「保険に入ったので対策を後回しにした」はモラルハザード。内部不正（故意の窃取）とは区別する。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-cyber-insurance", "risk-transfer"],
    tags: ["行動", "保険"],
  },
  {
    id: "risk-ale",
    ja: "年間予想損失額",
    reading: "ねんかんよそうそんしつがく",
    en: "Annualized loss expectancy",
    abbr: "ALE",
    shortJa: "1回あたりの損失額に年間発生回数を掛けた、1年あたりの期待損失額。",
    shortEn:
      "Expected yearly loss, calculated as single loss expectancy times annualized rate of occurrence.",
    explanationJa:
      "ALE = SLE（単一損失期待額）× ARO（年間発生率）。対策の費用対効果を比較する指標として使う。平均値であるため、低頻度・巨大損失のリスクは過小評価になりやすく、最大想定損失との併用が必要である。",
    explanationEn:
      "ALE = SLE × ARO. It is used to compare treatment costs, but as an average it understates rare catastrophic events, so maximum loss estimates should be used alongside it.",
    examUsage:
      "計算問題ではAROを年間回数として扱う。%で与えられたら100で割る。ALEは「平均」であり、最悪ケースではない。",
    lessonIds: ["risk/fundamentals"],
    relatedTermIds: ["risk-quantitative-analysis", "risk-property-loss"],
    tags: ["定量", "計算"],
  },

  // ── risk/assessment ────────────────────────────────────────────
  {
    id: "risk-assessment-process",
    ja: "リスクアセスメント",
    reading: "りすくあせすめんと",
    en: "Risk assessment",
    shortJa: "リスク特定・リスク分析・リスク評価からなる一連のプロセス。",
    shortEn:
      "The process consisting of risk identification, risk analysis, and risk evaluation.",
    explanationJa:
      "リスクアセスメントは、リスクマネジメントの中核であり、特定・分析・評価の3段階で構成される。評価結果を受けてリスク対応が行われる。リスクコミュニケーションとモニタリングは、このプロセスと並行して実施する。",
    explanationEn:
      "It consists of identification, analysis, and evaluation, feeding risk treatment. Communication and monitoring run in parallel with the process.",
    examUsage:
      "3段階の順序と役割を問う問題が多い。分析はリスクレベルの算定、評価は基準との比較による判断である。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-identification", "risk-analysis", "risk-evaluation"],
    tags: ["リスクアセスメント", "プロセス"],
  },
  {
    id: "risk-identification",
    ja: "リスク特定",
    reading: "りすくとくてい",
    en: "Risk identification",
    shortJa: "リスク源・事象・原因・潜在的結果を発見し、記述する段階。",
    shortEn:
      "Finding and describing risk sources, events, causes, and potential consequences.",
    explanationJa:
      "資産、脅威、脆弱性、既存の管理策を突き合わせ、起こり得る事象を洗い出す。リスクの記述には、原因、事象、結果、対象資産、リスク所有者を含める。洗い出しの漏れは、その後の分析と評価をすべて無効にする。",
    explanationEn:
      "Assets, threats, vulnerabilities, and existing controls are compared to enumerate events. Each risk description should include cause, event, consequence, asset, and owner.",
    examUsage:
      "リスク特定では「リスクレベルを算定する」ところまでは行わない。算定はリスク分析である。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-source", "risk-analysis", "risk-owner"],
    tags: ["リスクアセスメント", "特定"],
  },
  {
    id: "risk-analysis",
    ja: "リスク分析",
    reading: "りすくぶんせき",
    en: "Risk analysis",
    shortJa: "リスクの性質を理解し、リスクレベルを決定・算定する段階。",
    shortEn:
      "Understanding the nature of risk and determining the level of risk.",
    explanationJa:
      "発生可能性と影響度を評価し、リスクレベルを求める。定性分析と定量分析があり、得点法やマトリックス、ALEなどが用いられる。分析の時点では、対応するかどうかの意思決定はまだ行わない。",
    explanationEn:
      "Likelihood and impact are assessed to derive a risk level, using qualitative or quantitative methods such as scoring, matrices, and ALE. No treatment decision is made yet.",
    examUsage:
      "「リスクレベルを算定する」はリスク分析。「基準と比較して対応要否を決める」はリスク評価。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-evaluation", "risk-level", "risk-scoring"],
    tags: ["リスクアセスメント", "分析"],
  },
  {
    id: "risk-evaluation",
    ja: "リスク評価",
    reading: "りすくひょうか",
    en: "Risk evaluation",
    shortJa: "分析結果をリスク基準と比較し、対応の要否と優先順位を決める段階。",
    shortEn:
      "Comparing analysis results with risk criteria to decide whether and how to treat risks.",
    explanationJa:
      "リスク評価では、リスクレベルとリスク基準を比較し、受容できるか、対応が必要かを判断する。対応が必要な場合は、回避・低減・移転・受容の方向性と優先順位を決める。判断の根拠と残留リスクの見込みを記録する。",
    explanationEn:
      "Risk levels are compared with criteria to decide acceptance and treatment needs, then direction and priority are set. The rationale and expected residual risk are recorded.",
    examUsage:
      "リスク評価は「意思決定」の段階。分析結果をそのまま評価結果としない。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-analysis", "risk-criteria", "risk-acceptance-criteria"],
    tags: ["リスクアセスメント", "評価"],
  },
  {
    id: "risk-criteria",
    ja: "リスク基準",
    reading: "りすくきじゅん",
    en: "Risk criteria",
    shortJa: "リスクの重要性を判断するための尺度・しきい値・評価方法。",
    shortEn:
      "Scales, thresholds, and methods used to judge the significance of risk.",
    explanationJa:
      "影響と発生可能性の尺度、リスクレベルの定義、受容可否の判断基準、複数リスクの比較方法などを含む。経営者が定め、リスク選好と整合させる。基準が曖昧だと、部門ごとに評価結果がばらつく。",
    explanationEn:
      "It includes impact and likelihood scales, risk level definitions, acceptance thresholds, and comparison methods. Management sets it consistently with risk appetite.",
    examUsage:
      "リスク基準は評価のものさし全体、リスク受容基準は「許容できる境界」である。両者を同一視しない。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-acceptance-criteria", "risk-appetite", "risk-level"],
    tags: ["基準", "リスクアセスメント"],
  },
  {
    id: "risk-acceptance-criteria",
    ja: "リスク受容基準",
    reading: "りすくじゅようきじゅん",
    en: "Risk acceptance criteria",
    shortJa: "組織が許容できるリスクレベルの境界。",
    shortEn:
      "The boundary of risk levels an organization is willing to accept.",
    explanationJa:
      "リスク評価において、対応が必要かどうかを分けるしきい値である。受容基準は経営者が決め、法規制や事業への影響を踏まえる。基準内のリスクは監視しながら受け入れ、基準を超えるリスクは対応を検討する。",
    explanationEn:
      "It is the threshold separating acceptable from unacceptable risk. Management sets it based on regulation and business impact; risks above it require treatment.",
    examUsage:
      "「受容基準内だから対応不要」は正しいが、「受容＝放置」ではない。監視と記録が必要である。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-criteria", "risk-acceptance", "risk-residual"],
    tags: ["基準", "受容"],
  },
  {
    id: "risk-matrix",
    ja: "リスクマトリックス",
    reading: "りすくまとりっくす",
    en: "Risk matrix",
    shortJa: "発生可能性と影響度を2軸にとり、リスクレベルを可視化した表。",
    shortEn:
      "A grid plotting likelihood against impact to visualize risk levels.",
    explanationJa:
      "縦軸に影響度、横軸に発生可能性をとり、各セルにリスクレベルを割り当てる。多数のリスクを一望でき、関係者間の合意形成に使いやすい。境界付近のリスクの見落としと、評価の主観性が弱点である。",
    explanationEn:
      "Impact on one axis and likelihood on the other, with a risk level per cell. It gives an overview and supports consensus, but risks near boundaries can be missed and ratings are subjective.",
    examUsage:
      "マトリックスの境界は組織のリスク基準で決まる。普遍的なくくりはない。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-scoring", "risk-level", "risk-criteria"],
    tags: ["分析手法", "可視化"],
  },
  {
    id: "risk-scoring",
    ja: "得点法",
    reading: "とくてんほう",
    en: "Risk scoring",
    shortJa: "発生可能性と影響度を数値で採点し、掛け合わせてリスクを順位付ける方法。",
    shortEn:
      "Scoring likelihood and impact numerically and multiplying them to rank risks.",
    explanationJa:
      "5段階などの尺度で発生可能性と影響度を評価し、その積をリスクスコアとする。計算が単純で説明しやすく、多数のリスクを同じ土俵で比較できる。尺度の間隔が等間隔とは限らず、金額に基づく定量分析ではなく半定量または定性として扱われる。",
    explanationEn:
      "Likelihood and impact are rated, often on a five-point scale, and multiplied. It is simple and comparable across many risks, but the scale intervals are not guaranteed equal and the method is semi-quantitative or qualitative rather than monetary.",
    examUsage:
      "得点法は数値を使うが、金額に基づく定量分析ではない。半定量または定性として扱い、ALEなどの定量分析と区別する。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-matrix", "risk-qualitative-analysis", "risk-level"],
    tags: ["分析手法", "得点"],
  },
  {
    id: "risk-quantitative-analysis",
    ja: "定量的リスク分析",
    reading: "ていりょうてきりすくぶんせき",
    en: "Quantitative risk analysis",
    shortJa: "金額や確率を用いてリスクを数値で表現する分析。",
    shortEn:
      "Risk analysis that expresses risk numerically using monetary values and probabilities.",
    explanationJa:
      "ALE、期待損失、最大想定損失などを用いる。対策の費用対効果を金額で説明できる一方、確率と影響額の見積りに不確実性が伴う。低頻度巨大損失は平均値に埋もれるため、シナリオ分析や最悪ケースの検討を併用する。",
    explanationEn:
      "It uses ALE, expected loss, and maximum loss. It supports cost-benefit explanation, but estimates are uncertain and rare catastrophes are hidden by averages.",
    examUsage:
      "「金額で表す」「ALEを計算する」は定量分析。「専門家の判断で高・中・低を付ける」は定性分析。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-ale", "risk-qualitative-analysis", "risk-analysis"],
    tags: ["分析手法", "定量"],
  },
  {
    id: "risk-qualitative-analysis",
    ja: "定性的リスク分析",
    reading: "ていせいてきりすくぶんせき",
    en: "Qualitative risk analysis",
    shortJa: "経験や専門家の判断により、リスクを段階や順位で評価する分析。",
    shortEn:
      "Risk analysis that rates risk in levels or ranks using experience and expert judgment.",
    explanationJa:
      "「高・中・低」や順位でリスクを表現する。数値の根拠を必要とせず、迅速かつ多数のリスクに適用できる。金額換算できない影響や、データが不足している段階に向く。定量分析と組み合わせて使う。",
    explanationEn:
      "Risks are expressed as high, medium, or low, or ranked. It is fast and applicable to many risks without monetary data, and suits impacts that cannot be monetized.",
    examUsage:
      "定性分析は「根拠がない」のではなく、数値化を前提としない手法である。定量との違いを説明できるようにする。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-quantitative-analysis", "risk-matrix", "risk-scoring"],
    tags: ["分析手法", "定性"],
  },
  {
    id: "risk-owner",
    ja: "リスク所有者",
    reading: "りすくしょゆうしゃ",
    en: "Risk owner",
    shortJa: "リスク対応の意思決定と実施に責任を持つ者。",
    shortEn:
      "The person accountable for deciding and implementing risk treatment.",
    explanationJa:
      "リスク所有者は、リスクを管理する権限と責任を持ち、対応方針の決定、予算の確保、実施状況の報告を行う。資産の管理者や業務の責任者がなることが多い。所有者を決めないと、評価結果が対応につながらない。",
    explanationEn:
      "The owner has authority and accountability for the risk, decides treatment, secures budget, and reports progress. Without an owner, assessments do not lead to action.",
    examUsage:
      "リスク所有者は「リスクを生じさせる源」ではない。リスク源と混同しない。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-source", "risk-evaluation", "risk-register"],
    tags: ["責任", "リスクアセスメント"],
  },
  {
    id: "risk-source",
    ja: "リスク源",
    reading: "りすくげん",
    en: "Risk source",
    shortJa: "リスクを生じさせる源。人・組織・環境・技術など。",
    shortEn:
      "The source of risk, such as people, organizations, environment, or technology.",
    explanationJa:
      "リスク源は、単独または組み合わさってリスクを発生させる。人為的なもの（誤操作、内部不正）、組織的なもの（手順不備、委託管理）、物理的なもの（火災、盗難）、技術的なもの（脆弱性、設定不備）に分けて洗い出すと漏れが減る。",
    explanationEn:
      "Sources include human error, insider fraud, procedural gaps, contractor management, fire, theft, vulnerabilities, and misconfiguration. Grouping them helps completeness.",
    examUsage:
      "リスク源は原因、リスク所有者は責任者。設問が「誰が責任を持つか」か「何が原因か」で読み分ける。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-identification", "risk-owner", "risk-operational-risk"],
    tags: ["原因", "リスクアセスメント"],
  },
  {
    id: "risk-level",
    ja: "リスクレベル",
    reading: "りすくれべる",
    en: "Risk level",
    shortJa: "発生可能性と影響度を組み合わせて表されるリスクの大きさ。",
    shortEn:
      "The magnitude of a risk expressed as a combination of likelihood and impact.",
    explanationJa:
      "リスク分析で算定され、リスク評価で基準と比較される。数値、段階、順位などで表現する。同じリスクでも、評価の尺度や基準が変わればレベルは変わるため、算定方法と前提を記録する必要がある。",
    explanationEn:
      "It is derived in risk analysis and compared with criteria in evaluation. It may be numeric, ordinal, or ranked, and the method and assumptions must be recorded.",
    examUsage:
      "リスクレベルは分析の出力。評価はレベルと基準の比較である。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-analysis", "risk-evaluation", "risk-matrix"],
    tags: ["分析", "尺度"],
  },
  {
    id: "risk-appetite",
    ja: "リスク選好",
    reading: "りすくせんこう",
    en: "Risk appetite",
    shortJa: "目標達成のために組織が進んで受け入れるリスクの量と種類。",
    shortEn:
      "The amount and type of risk an organization is willing to pursue to meet its objectives.",
    explanationJa:
      "リスク選好は経営者が定め、リスク基準や受容基準に反映される。事業拡大の局面では選好が高まり、事故後の局面では低くなることがある。選好と現場の判断がずれると、投資判断とリスク管理が矛盾する。",
    explanationEn:
      "Management sets risk appetite, which is reflected in criteria and acceptance thresholds. A mismatch with front-line decisions creates inconsistent investment and risk management.",
    examUsage:
      "リスク選好は「進んで取るリスク」、リスク許容度は「許容できる変動の幅」。文脈で使い分ける。",
    lessonIds: ["risk/assessment"],
    relatedTermIds: ["risk-criteria", "risk-acceptance-criteria"],
    tags: ["経営", "基準"],
  },

  // ── risk/response-continuity ───────────────────────────────────
  {
    id: "risk-avoidance",
    ja: "リスク回避",
    reading: "りすくかいひ",
    en: "Risk avoidance",
    shortJa: "リスクを生む活動自体をやめる、または方法を変える対応。",
    shortEn:
      "Treatment that eliminates the activity that generates the risk or changes its approach.",
    explanationJa:
      "新サービスの開始中止、危険な取引先との契約解除、リスクの高い機能の廃止などが該当する。リスクは確実に減るが、事業機会や既存の投資も失う。回避したリスクは残留リスクには含めない。",
    explanationEn:
      "Examples include canceling a new service, terminating a risky contract, or removing a feature. Risk is eliminated, but business opportunity is lost. Avoided risks are not residual risks.",
    examUsage:
      "「活動をやめる」が回避。「対策を追加する」は低減。「保険に入る」は移転。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-reduction", "risk-residual", "risk-acceptance"],
    tags: ["リスク対応", "4分類"],
  },
  {
    id: "risk-reduction",
    ja: "リスク低減",
    reading: "りすくていげん",
    en: "Risk reduction",
    shortJa: "管理策によって発生可能性または影響度を下げる対応。",
    shortEn:
      "Treatment that lowers likelihood or impact through controls.",
    explanationJa:
      "多要素認証、パッチ管理、バックアップ、教育、監視などが該当する。情報セキュリティで最も多用される。低減後もリスクは残るため、残留リスクを評価し、必要なら追加の対策を検討する。",
    explanationEn:
      "Controls such as MFA, patching, backups, training, and monitoring reduce likelihood or impact. Residual risk remains and must be evaluated.",
    examUsage:
      "予防・検知・是正のどの段階の管理策かを意識すると、科目Bの事例で対策を選びやすい。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-control", "risk-residual", "risk-avoidance"],
    tags: ["リスク対応", "4分類"],
  },
  {
    id: "risk-transfer",
    ja: "リスク移転",
    reading: "りすくいてん",
    en: "Risk transfer",
    shortJa: "損失の金銭的負担を保険など第三者に移す対応。",
    shortEn:
      "Treatment that shifts the financial burden of loss to a third party such as an insurer.",
    explanationJa:
      "サイバー保険、損害賠償保険、契約上の補償などが該当する。リスク自体は消えず、評判損失や顧客離れまで移転できるわけではない。移転先の破綻や免責条件にも注意する。",
    explanationEn:
      "Examples include cyber insurance and contractual indemnities. The risk itself remains; reputational loss cannot be fully transferred, and deductibles and insurer limits matter.",
    examUsage:
      "移転は「金銭的負担」の移動。委託先に業務を任せても、自社の事業停止リスクは移転しない。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-cyber-insurance", "risk-reduction", "risk-residual"],
    tags: ["リスク対応", "4分類"],
  },
  {
    id: "risk-acceptance",
    ja: "リスク受容",
    reading: "りすくじゅよう",
    en: "Risk acceptance",
    shortJa: "リスクを低減せず、経営判断として受け入れる対応。",
    shortEn:
      "The decision to accept a risk without further treatment.",
    explanationJa:
      "対応コストが損失を上回る場合や、発生可能性が十分低い場合に選ぶ。受容は放置ではなく、判断の根拠と残留リスクを記録し、監視を続ける。受容基準を超えるリスクを根拠なく受容してはならない。",
    explanationEn:
      "It is chosen when treatment costs exceed losses or likelihood is low. Acceptance is a recorded, monitored decision, not neglect; risks above criteria must not be accepted without justification.",
    examUsage:
      "「リスク受容」と「残留リスクの受容」は段階が違う。前者は対応方針、後者は対応後の確認である。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-acceptance-criteria", "risk-residual", "risk-avoidance"],
    tags: ["リスク対応", "4分類"],
  },
  {
    id: "risk-residual",
    ja: "残留リスク",
    reading: "ざんりゅうりすく",
    en: "Residual risk",
    shortJa: "特定したリスクに対応した後に残るリスク。",
    shortEn:
      "The risk remaining after treatment of an identified risk.",
    explanationJa:
      "残留リスクは、特定済みのリスクに対して回避・低減・移転・受容を行った結果として残るリスクである。まだ特定されていないリスクや、回避によって消滅したリスクは含めない。受容したリスクは低減されていないだけで、対応方針を決めた結果として残留リスクになる。",
    explanationEn:
      "Residual risk is what remains after treating an identified risk. It excludes unidentified risks and risks eliminated by avoidance. Accepted risks remain as residual risk because they were consciously not reduced.",
    examUsage:
      "「未特定のリスクを含む」「回避したリスクを含む」とする選択肢は誤り。特定済みリスクの対応後の残りである。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-acceptance", "risk-reduction", "risk-transfer"],
    tags: ["残留", "定義"],
  },
  {
    id: "risk-control",
    ja: "リスクコントロール",
    reading: "りすくこんとろーる",
    en: "Risk control",
    shortJa: "損失の発生や拡大を防ぐ管理策。予防・検知・是正に分かれる。",
    shortEn:
      "Controls that prevent or limit loss, categorized as preventive, detective, and corrective.",
    explanationJa:
      "予防は事故を起こさない対策、検知は発生を早く見つける対策、是正は被害を戻す対策である。アクセス制御や教育は予防、ログ監視やIDSは検知、バックアップや復旧手順は是正に近い。",
    explanationEn:
      "Preventive controls stop incidents, detective controls find them early, and corrective controls restore operations. Access control and training are preventive; monitoring is detective; backups are corrective.",
    examUsage:
      "バックアップはリスクコントロール、保険はリスクファイナンシング。両者を混同しない。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-financing", "risk-reduction"],
    tags: ["管理策", "リスク対応"],
  },
  {
    id: "risk-financing",
    ja: "リスクファイナンシング",
    reading: "りすくふぁいなんしんぐ",
    en: "Risk financing",
    shortJa: "事故で生じる損失に備えて資金を手当てする対応。",
    shortEn:
      "Arranging funds to cover losses when an incident occurs.",
    explanationJa:
      "保険による移転と、自己資金・引当金による保持に分かれる。事故の発生を防ぐものではなく、発生後の資金繰りを支える。コントロールで損失を減らし、残った部分をファイナンシングで支えるのが基本である。",
    explanationEn:
      "It includes transfer through insurance and retention through reserves. It does not prevent incidents; it protects cash flow afterward.",
    examUsage:
      "「保険」「引当金」はファイナンシング。「バックアップ」「多要素認証」はコントロール。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-control", "risk-cyber-insurance", "risk-hedge"],
    tags: ["資金", "リスク対応"],
  },
  {
    id: "risk-hedge",
    ja: "リスクヘッジ",
    reading: "りすくへっじ",
    en: "Risk hedging",
    shortJa: "反対の取引などで損失を相殺し、価格変動などのリスクを減らす手法。",
    shortEn:
      "Offsetting exposure, for example with an opposite transaction, to reduce financial risk.",
    explanationJa:
      "為替や金利、商品価格の変動に対して、先物やオプションで反対のポジションを取る。情報セキュリティでは、保険、契約上の補償、SLAの補償が近い役割を果たす。損失を相殺しても、事故対応の負荷や評判損失は残る。",
    explanationEn:
      "Futures or options offset currency, interest rate, or commodity exposure. In security, insurance, indemnities, and SLA credits play a similar role, but response workload and reputation remain.",
    examUsage:
      "ヘッジは「損失の相殺」。リスクそのものをなくす回避とは異なる。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-financing", "risk-transfer"],
    tags: ["金融", "リスク対応"],
  },
  {
    id: "risk-cyber-insurance",
    ja: "サイバー保険",
    reading: "さいばーほけん",
    en: "Cyber insurance",
    shortJa: "情報漏えいの賠償や事故対応費用などを補償する保険。",
    shortEn:
      "Insurance covering liability and incident response costs from cyber incidents.",
    explanationJa:
      "賠償責任、フォレンジックや弁護士費用、通知費用、ネットワーク中断損失、サイバー恐喝などを補償する。免責額、支払限度額、通知義務、対策要件などの条件がある。発生確率は下げないため、管理策と組み合わせる。",
    explanationEn:
      "Coverage may include liability, forensics, legal and notification costs, business interruption, and extortion. Deductibles, limits, notification duties, and control requirements apply; it does not reduce likelihood.",
    examUsage:
      "保険はリスク移転の代表例。モラルハザードとセットで問われることが多い。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-transfer", "risk-moral-hazard", "risk-residual"],
    tags: ["保険", "移転"],
  },
  {
    id: "risk-register",
    ja: "リスク登録簿",
    reading: "りすくとうろくぼ",
    en: "Risk register",
    shortJa: "特定したリスクと評価・対応状況を一元的に記録する台帳。",
    shortEn:
      "A record of identified risks with their assessment and treatment status.",
    explanationJa:
      "リスクID、リスクの記述、対象資産、リスク所有者、評価結果、対応方針、期限、状態、残留リスク、監視指標を記録する。対応の進捗と判断の根拠を追跡できるようにし、定期的に更新する。",
    explanationEn:
      "It records ID, description, asset, owner, assessment, treatment, due date, status, residual risk, and monitoring indicators, and is updated regularly.",
    examUsage:
      "登録簿は「一覧」であり、対応計画は「誰がいつまでに何をするか」。両者を区別する。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-owner", "risk-residual", "risk-acceptance"],
    tags: ["記録", "リスク対応"],
  },
  {
    id: "risk-bia",
    ja: "BIA（ビジネスインパクト分析）",
    reading: "びじねすいんぱくとぶんせき",
    en: "Business impact analysis",
    abbr: "BIA",
    shortJa: "事業中断の影響を分析し、復旧優先度と目標を決めるための分析。",
    shortEn:
      "Analysis of the impact of disruption to set recovery priorities and targets.",
    explanationJa:
      "業務プロセスごとに、中断が財務・法規・信用・人に与える影響を評価し、最大許容中断時間（MTPD）と復旧の優先順位を明らかにする。BIAの結果からRTOとRPOを導き、BCPや復旧計画、バックアップ要件を決める。",
    explanationEn:
      "It assesses financial, legal, reputational, and human impact per process, identifies maximum tolerable downtime, and sets recovery priorities. RTO and RPO are derived from it.",
    examUsage:
      "BIAの目的は「復旧手段の決定」ではなく「影響と優先順位の明確化」。リスクアセスメントとは視点が違う。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-rto", "risk-rpo", "risk-backup"],
    tags: ["BCP", "事業影響"],
  },
  {
    id: "risk-rto",
    ja: "RTO（目標復旧時間）",
    reading: "もくひょうふっきゅうじかん",
    en: "Recovery time objective",
    abbr: "RTO",
    shortJa: "中断からいつまでに復旧させるかという時間の目標。",
    shortEn:
      "The target duration within which a service must be restored after disruption.",
    explanationJa:
      "RTOは「未来の期限」であり、時間の長さで表す。BIAで定めたMTPDを超えないように設定する。RTOは目標であり実測値ではないため、演習で達成可能性を確認し、達成できなければ手順や体制を見直す。",
    explanationEn:
      "RTO is a future deadline expressed as a duration and must not exceed the MTPD. It is a target, not a measurement, so exercises must verify achievability.",
    examUsage:
      "RTOは「時間」、RPOは「時点」。日本語の名称と英語の意味をセットで覚える。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-rpo", "risk-bia", "risk-backup"],
    tags: ["BCP", "目標"],
  },
  {
    id: "risk-rpo",
    ja: "RPO（目標復旧時点）",
    reading: "もくひょうふっきゅうじてん",
    en: "Recovery point objective",
    abbr: "RPO",
    shortJa: "どの時点のデータまで戻すかという復旧の目標。",
    shortEn:
      "The target point in time to which data must be recovered.",
    explanationJa:
      "RPOは「過去の時点」であり、バックアップの間隔によって決まる。日次バックアップなら最大24時間分のデータ損失を許容することになる。RPOを短くするには、バックアップ頻度を上げるか、同期レプリケーションを使う。",
    explanationEn:
      "RPO is a point in the past determined by backup frequency. Daily backups imply up to 24 hours of data loss; shortening RPO requires more frequent backups or synchronous replication.",
    examUsage:
      "「どこまで遡ってよいか」がRPO。「いつまでに復旧するか」がRTO。計算問題では障害時刻とバックアップ時刻の差を取る。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-rto", "risk-backup", "risk-bia"],
    tags: ["BCP", "目標"],
  },
  {
    id: "risk-backup",
    ja: "バックアップ",
    reading: "ばっくあっぷ",
    en: "Backup",
    shortJa: "データやシステムを複製し、障害時に復旧できるようにする対策。",
    shortEn:
      "Copies of data and systems kept so they can be restored after failure.",
    explanationJa:
      "フル・差分・増分の方式があり、復旧時間と保存容量のトレードオフがある。3-2-1規則、世代管理、暗号化、遠隔地保管、オフラインまたはイミュータブル保管、定期的なリストアテストを組み合わせる。取得だけでなく復旧できることが目的である。",
    explanationEn:
      "Full, differential, and incremental schemes trade restore time against storage. Combine the 3-2-1 rule, retention, encryption, offsite and offline or immutable copies, and restore tests.",
    examUsage:
      "差分は「前回フルからの変更分」、増分は「前回バックアップからの変更分」。復旧時の本数が異なる。",
    lessonIds: ["risk/response-continuity"],
    relatedTermIds: ["risk-rpo", "risk-rto", "risk-control"],
    tags: ["バックアップ", "復旧"],
  },
];
