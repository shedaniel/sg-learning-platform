import type { GlossaryTerm } from "@/lib/content/types";

export const terms: GlossaryTerm[] = [
  // ── policy-isms ──────────────────────────────────────────────
  {
    id: "mgmt-policy",
    ja: "情報セキュリティポリシー",
    reading: "じょうほうセキュリティポリシー",
    en: "Information security policy",
    shortJa: "経営陣が定める、情報セキュリティに関する組織の基本方針。",
    shortEn: "Top management's overall intention and direction for information security.",
    explanationJa:
      "情報セキュリティポリシーは、組織が情報資産をどのように守るかについての経営陣の意思を文書化したものである。単なるスローガンではなく、目的・適用範囲・責任体制・違反時の扱いまで含み、下位の規程や手順を拘束する。策定と承認は経営層の責任であり、現場の担当者が独断で変更してはならない。",
    explanationEn:
      "An information security policy documents top management's intent for protecting information assets. It defines purpose, scope, responsibilities and consequences of violation, and binds lower-level standards and procedures.",
    examUsage:
      "「経営陣が策定する基本方針」と「現場が使う手順」を区別させる問題が定番である。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-policy-hierarchy", "mgmt-isms", "mgmt-exception"],
    tags: ["管理", "ポリシー"],
  },
  {
    id: "mgmt-policy-hierarchy",
    ja: "ポリシー階層",
    reading: "ポリシーかいそう",
    en: "Policy hierarchy",
    shortJa: "基本方針・対策基準・実施手順の3層からなる規程体系。",
    shortEn: "The three-tier structure of policy, standards and procedures.",
    explanationJa:
      "情報セキュリティポリシーは、最上位の基本方針（ポリシー）、それを実現する具体的な遵守事項である対策基準（スタンダード）、日々の作業手順である実施手順（プロシージャ）の3層で構成する。上位の文書が下位の文書を拘束し、下位の文書は上位に反してはならない。3層に分けることで、経営が決める事項と現場が改善できる事項を切り分けられる。",
    explanationEn:
      "The policy hierarchy consists of the top-level policy, standards that specify mandatory requirements, and procedures that describe day-to-day operations. Lower documents must not contradict higher ones.",
    examUsage:
      "「対策基準」は遵守すべき基準、「実施手順」は具体的な作業の流れ、と役割で判別する。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-policy", "mgmt-exception", "mgmt-sns-guideline"],
    tags: ["管理", "規程"],
  },
  {
    id: "mgmt-exception",
    ja: "例外規程",
    reading: "れいがいきてい",
    en: "Exception procedure",
    shortJa: "規程で禁止された行為を、条件付きで例外的に認めるための手続。",
    shortEn: "A procedure for granting conditional, time-bound exceptions to policy.",
    explanationJa:
      "例外規程は、業務上の必要から規程に沿えない行為を、申請・リスク評価・承認・代替措置・有効期限・記録という手続を経て例外的に認めるものである。例外を認めること自体が目的ではなく、例外的な状態を可視化し、期限までに解消させることに意義がある。例外を私的判断で認めると、規程が形骸化し、事故時の説明責任も果たせなくなる。",
    explanationEn:
      "An exception procedure allows a documented, risk-assessed and time-limited deviation from policy. Its purpose is to make exceptions visible and ensure they are resolved, not to legitimize non-compliance.",
    examUsage:
      "「例外は現場判断で認める」「一度認めたら無期限」という選択肢は誤りである。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-policy-hierarchy", "mgmt-nonconformity"],
    tags: ["管理", "規程"],
  },
  {
    id: "mgmt-sns-guideline",
    ja: "SNSガイドライン",
    reading: "エスエヌエスガイドライン",
    en: "Social media guideline",
    shortJa: "従業員のSNS利用と情報発信に関するルール。",
    shortEn: "Rules on employees' use of social media and external posting.",
    explanationJa:
      "SNSガイドラインは、私的利用の範囲、業務情報や顧客情報の投稿禁止、公式アカウントの運用、炎上時の対応、取材への窓口などを定める。技術的な対策では防ぎにくい「人の発信」による情報漏えいや風評被害を抑えるための管理策である。禁止事項だけでなく、投稿前に確認する手順と相談窓口を併せて定めることが実効性の鍵となる。",
    explanationEn:
      "A social media guideline defines acceptable personal use, prohibits posting confidential or customer information, and sets rules for official accounts and crisis communication.",
    examUsage:
      "SNS起因の漏えいは技術的対策ではなく、規程・教育・監視で抑える点が問われる。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-policy-hierarchy", "mgmt-public-statement"],
    tags: ["管理", "規程", "SNS"],
  },
  {
    id: "mgmt-isms",
    ja: "ISMS",
    reading: "アイエスエムエス",
    en: "Information Security Management System",
    abbr: "ISMS",
    shortJa: "組織の情報セキュリティを継続的に管理する仕組み。",
    shortEn: "A systematic approach to managing information security continuously.",
    explanationJa:
      "ISMSは、組織が情報セキュリティリスクを特定・評価し、適切な管理策を選んで運用し、その結果を監視・見直しして改善する一連の仕組みである。JIS Q 27001 が要求事項を定め、認証制度ではその適合性を第三者が審査する。認証取得は目的ではなく、リスクに応じた管理が継続していることを内外に示す手段である。",
    explanationEn:
      "An ISMS is a management system that identifies and evaluates information security risks, applies controls, monitors results and improves continuously. JIS Q 27001 specifies its requirements.",
    examUsage:
      "ISMSは「PDCAを回す仕組み」であり、単発の対策や製品導入ではない点を押さえる。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-isms-scope", "mgmt-pdca", "mgmt-iso27001"],
    tags: ["管理", "ISMS"],
  },
  {
    id: "mgmt-isms-scope",
    ja: "ISMS適用範囲",
    reading: "アイエスエムエスてきようはんい",
    en: "ISMS scope",
    shortJa: "ISMSの対象となる組織・拠点・業務・システムの境界。",
    shortEn: "The boundaries of the organization, sites, services and systems covered by the ISMS.",
    explanationJa:
      "ISMS適用範囲は、どの組織単位・拠点・業務・情報システム・委託先を管理の対象にするかの境界である。広げすぎると運用負荷が増えて形骸化し、狭めすぎると重要なリスクが管理から漏れる。境界を決めたら、除外した部分とその理由を文書化し、認証審査でも説明できる状態にしておく必要がある。",
    explanationEn:
      "The ISMS scope defines which organizational units, sites, services, systems and suppliers are covered. It must be documented, justified and reflected in the risk assessment.",
    examUsage:
      "適用範囲の内外は「リスク対策の有無」ではなく「ISMSの管理対象かどうか」の違いである。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-isms", "mgmt-iso27001"],
    tags: ["管理", "ISMS"],
  },
  {
    id: "mgmt-pdca",
    ja: "PDCAサイクル",
    reading: "ピーディーシーエーサイクル",
    en: "PDCA cycle",
    shortJa: "Plan・Do・Check・Actを繰り返して継続的に改善する考え方。",
    shortEn: "A continuous improvement cycle of Plan, Do, Check and Act.",
    explanationJa:
      "PDCAは、Plan（適用範囲の決定、リスクアセスメント、リスク対応計画）、Do（管理策の運用）、Check（内部監査やマネジメントレビューによる評価）、Act（不適合の是正と継続的改善）を繰り返す枠組みである。ISMSでは1回転で終わらせず、事業環境やリスクの変化に合わせて繰り返すことが要求される。",
    explanationEn:
      "PDCA in an ISMS covers planning risk treatment, operating controls, checking performance through audit and management review, and acting on nonconformities to improve.",
    examUsage:
      "内部監査とマネジメントレビューはCheck、是正処置と改善はActに位置付けると整理しやすい。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-isms", "mgmt-internal-audit", "mgmt-management-review"],
    tags: ["管理", "ISMS", "PDCA"],
  },
  {
    id: "mgmt-internal-audit",
    ja: "内部監査",
    reading: "ないぶかんさ",
    en: "Internal audit",
    shortJa: "組織自らが、ISMSが規格や自社規程に適合しているか検証する活動。",
    shortEn: "An internal, independent assessment of ISMS conformity and effectiveness.",
    explanationJa:
      "内部監査は、ISMSが JIS Q 27001 や自社規程に適合しているか、意図したとおり機能しているかを組織自身が計画的に検証する活動である。監査員は自分の担当業務を監査してはならず、独立性と客観性を確保する必要がある。指摘は是正処置につなげ、その有効性まで確認する。",
    explanationEn:
      "Internal audit independently verifies ISMS conformity and effectiveness. Auditors must not audit their own work, and findings must lead to corrective action.",
    examUsage:
      "「自部門を自分で監査する」「監査結果を是正に結び付けない」選択肢は不適切である。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-pdca", "mgmt-management-review", "mgmt-nonconformity"],
    tags: ["管理", "監査"],
  },
  {
    id: "mgmt-management-review",
    ja: "マネジメントレビュー",
    reading: "マネジメントレビュー",
    en: "Management review",
    shortJa: "トップマネジメントがISMSの適切性・妥当性・有効性を評価する活動。",
    shortEn: "Top management's review of the suitability, adequacy and effectiveness of the ISMS.",
    explanationJa:
      "マネジメントレビューは、トップマネジメントが監査結果、リスク評価の結果、インシデント、改善状況などを入力として、ISMSが自社の事業とリスクに適合しているかを評価する場である。単なる報告会ではなく、資源配分や方針変更などの意思決定を行う。実施したことと決定事項を記録として残す必要がある。",
    explanationEn:
      "Management review is where top management evaluates ISMS inputs such as audit results, risks and incidents, and makes decisions on resources and improvements.",
    examUsage:
      "「現場の作業手順を確認する会議」ではなく「経営層による見直し」である点に注意する。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-internal-audit", "mgmt-pdca", "mgmt-governance"],
    tags: ["管理", "ISMS", "経営"],
  },
  {
    id: "mgmt-nonconformity",
    ja: "不適合と是正処置",
    reading: "ふてきごうとぜせいしょち",
    en: "Nonconformity and corrective action",
    shortJa: "要求事項を満たさない状態と、その原因を除去して再発を防ぐ処置。",
    shortEn: "A failure to meet a requirement, and action taken to eliminate its cause.",
    explanationJa:
      "不適合は、規格や自社規程の要求事項を満たしていない状態である。その場の手当てである修正（correction）に対し、是正処置は原因を分析して除去し、再発を防ぐ活動を指す。是正処置は実施して終わりではなく、有効性を確認し、必要に応じて他の業務へ水平展開する。",
    explanationEn:
      "A nonconformity is a failure to meet a requirement. Correction fixes the immediate problem; corrective action eliminates the root cause and prevents recurrence.",
    examUsage:
      "「修正」と「是正処置」の区別、および是正処置に「原因の除去」が含まれる点が問われる。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-internal-audit", "mgmt-root-cause", "mgmt-exception"],
    tags: ["管理", "監査", "改善"],
  },
  {
    id: "mgmt-iso27001",
    ja: "JIS Q 27001",
    reading: "ジェイアイエスキュー27001",
    en: "ISO/IEC 27001",
    abbr: "JIS Q 27001",
    shortJa: "ISMSの要求事項を定めた規格。認証の基準となる。",
    shortEn: "The international standard specifying requirements for an ISMS.",
    explanationJa:
      "JIS Q 27001 は ISO/IEC 27001 を日本語化した規格で、ISMSを構築・運用・維持・改善するための要求事項を定める。認証機関によるISMS認証はこの規格への適合性を審査する。要求事項であり、個々の管理策の実装方法を詳細に解説するガイドではない。附属書Aには管理策の一覧が示されている。",
    explanationEn:
      "JIS Q 27001 (ISO/IEC 27001) specifies requirements for establishing, operating, maintaining and improving an ISMS. Certification is assessed against these requirements.",
    examUsage:
      "27001＝要求事項（認証基準）、27002＝実践規範、と役割で区別する問題が頻出する。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-iso27002", "mgmt-annex-controls", "mgmt-isms"],
    tags: ["管理", "ISMS", "規格"],
  },
  {
    id: "mgmt-iso27002",
    ja: "JIS Q 27002",
    reading: "ジェイアイエスキュー27002",
    en: "ISO/IEC 27002",
    abbr: "JIS Q 27002",
    shortJa: "情報セキュリティ管理策の実践のための規範。",
    shortEn: "A code of practice for information security controls.",
    explanationJa:
      "JIS Q 27002 は、JIS Q 27001 の附属書Aに示された管理策について、その目的、適用の指針、実装のポイントを解説する実践規範である。認証の要求事項ではなく、管理策を選び実装する際の参照資料として使う。27001が「何を要求するか」、27002が「管理策をどう実践するか」と整理するとよい。",
    explanationEn:
      "JIS Q 27002 explains the purpose and implementation guidance for the controls listed in Annex A of JIS Q 27001. It is guidance, not a certification requirement.",
    examUsage:
      "「実践規範」「管理策の解説」という表現があれば27002と判断できる。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-iso27001", "mgmt-annex-controls"],
    tags: ["管理", "ISMS", "規格"],
  },
  {
    id: "mgmt-iso27017",
    ja: "JIS Q 27017",
    reading: "ジェイアイエスキュー27017",
    en: "ISO/IEC 27017",
    abbr: "JIS Q 27017",
    shortJa: "クラウドサービスにおける情報セキュリティ管理策の実践規範。",
    shortEn: "Code of practice for information security controls for cloud services.",
    explanationJa:
      "JIS Q 27017 は、クラウドサービスの利用者と提供者の双方を対象に、JIS Q 27002 の管理策をクラウド環境でどう適用するかを補足する規格である。責任分界、仮想環境の分離、クラウド特有のログ取得などが扱われる。クラウドでは、利用者と提供者のどちらがどの管理策に責任を持つかを明確にすることが重要になる。",
    explanationEn:
      "JIS Q 27017 provides cloud-specific guidance on applying information security controls, addressing shared responsibility and cloud-specific risks for providers and customers.",
    examUsage:
      "「クラウド」と「責任分界」が出たら27017、と結び付けて覚える。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-iso27002", "mgmt-iso27001"],
    tags: ["管理", "ISMS", "クラウド", "規格"],
  },
  {
    id: "mgmt-annex-controls",
    ja: "管理策の4分類",
    reading: "かんりさくのよんぶんるい",
    en: "Annex A control themes",
    shortJa: "組織的・人的・物理的・技術的の4つのテーマによる管理策の分類。",
    shortEn: "The four themes of Annex A controls: organizational, people, physical and technological.",
    explanationJa:
      "JIS Q 27001 の附属書Aでは、管理策を組織的（37項目）、人的（8項目）、物理的（14項目）、技術的（34項目）の4テーマ、合計93項目に分類している。テーマで分類することで、対策の抜けや偏りを確認しやすくなる。例えば、規程や委託先管理は組織的、教育や懲戒は人的、入退室管理は物理的、暗号やログは技術的に整理される。",
    explanationEn:
      "Annex A groups 93 controls into organizational (37), people (8), physical (14) and technological (34) themes, helping organizations check for gaps.",
    examUsage:
      "「教育」「退職時の手続」は人的、「入退室管理」「クリアデスク」は物理的、と分類させる問題が出る。",
    lessonIds: ["management/policy-isms"],
    relatedTermIds: ["mgmt-iso27001", "mgmt-iso27002"],
    tags: ["管理", "ISMS", "管理策"],
  },

  // ── governance-org ───────────────────────────────────────────
  {
    id: "mgmt-governance",
    ja: "情報セキュリティガバナンス",
    reading: "じょうほうセキュリティガバナンス",
    en: "Information security governance",
    shortJa: "経営層が情報セキュリティを統治するための方針・体制・監督の仕組み。",
    shortEn: "The system by which top management directs and controls information security.",
    explanationJa:
      "情報セキュリティガバナンスは、経営層が情報セキュリティの方針を示し、資源を配分し、実行状況を監視し、結果に責任を負う仕組みである。技術部門に任せるのではなく、事業目標とリスクのバランスを経営判断として扱う点が特徴である。評価・方向付け・監視と、関係者へのコミュニケーション・保証を通じて実現する。",
    explanationEn:
      "Information security governance is how top management sets direction, allocates resources, monitors performance and remains accountable for information security.",
    examUsage:
      "ガバナンスは「経営層の責任」、マネジメントは「日々の運用」と層を分けて理解する。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-committee", "mgmt-ciso", "mgmt-iso27001"],
    tags: ["管理", "ガバナンス", "経営"],
  },
  {
    id: "mgmt-committee",
    ja: "情報セキュリティ委員会",
    reading: "じょうほうセキュリティいいんかい",
    en: "Information security committee",
    shortJa: "経営層と部門長が情報セキュリティの方針・予算・リスク対応を審議する会議体。",
    shortEn: "A cross-functional committee that decides security policy, budget and risk responses.",
    explanationJa:
      "情報セキュリティ委員会は、経営層、部門長、CISO、事務局などで構成され、方針の審議、予算の配分、重要リスクへの対応、インシデントの報告と指示、部門間の調整を行う。現場の作業を決める場ではなく、組織横断の意思決定を行う場である。議事録を残し、決定事項を経営会議や現場へ確実に伝達することが実効性の条件となる。",
    explanationEn:
      "An information security committee brings together executives and department heads to decide policy, budgets, risk responses and incident direction across the organization.",
    examUsage:
      "委員会は「審議・決定・調整」、CSIRTは「インシデント対応」、SOCは「監視」と役割を分ける。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-ciso", "mgmt-governance", "mgmt-csirt"],
    tags: ["管理", "組織", "ガバナンス"],
  },
  {
    id: "mgmt-ciso",
    ja: "CISO",
    reading: "シーアイエスオー",
    en: "Chief Information Security Officer",
    abbr: "CISO",
    shortJa: "経営層の立場で情報セキュリティの方針と資源配分を統括する責任者。",
    shortEn: "The executive responsible for information security strategy and oversight.",
    explanationJa:
      "CISOは最高情報セキュリティ責任者として、経営戦略と整合したセキュリティ方針の策定、予算と人材の確保、リスクの監視、経営会議への報告を行う。技術的な実務の指揮だけでなく、事業リスクとして経営層に説明する役割が中心である。権限と予算を持たないCISOは形骸化しやすく、経営層からの任命と委任が欠かせない。",
    explanationEn:
      "A CISO leads information security strategy at the executive level, aligning policy with business goals, securing resources and reporting risk to the board.",
    examUsage:
      "CISOは「経営層」、情報セキュリティ管理者は「実務の管理」、CSIRTは「対応」と区別する。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-governance", "mgmt-committee", "mgmt-csirt"],
    tags: ["管理", "組織", "経営"],
  },
  {
    id: "mgmt-csirt",
    ja: "CSIRT",
    reading: "シーサート",
    en: "Computer Security Incident Response Team",
    abbr: "CSIRT",
    shortJa: "組織内で発生した情報セキュリティインシデントに対応するチーム。",
    shortEn: "A team that responds to information security incidents within an organization.",
    explanationJa:
      "CSIRTは、組織内のインシデントについて、受付、トリアージ、調査、封じ込め、復旧の支援、関係者への連絡を行う。技術的な対応だけでなく、経営層への報告や対外説明の調整も担う。日本全体の調整を行う JPCERT/CC とは役割が異なり、CSIRTはあくまで自組織の守備範囲を担当する。",
    explanationEn:
      "A CSIRT handles incidents within its own organization: intake, triage, investigation, containment, recovery support and communication. JPCERT/CC coordinates nationally.",
    examUsage:
      "CSIRT＝組織内対応、PSIRT＝製品の脆弱性、SOC＝監視、JPCERT/CC＝国内調整、と対象で判別する。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-psirt", "mgmt-soc", "mgmt-incident", "mgmt-jpcert"],
    tags: ["管理", "組織", "インシデント"],
  },
  {
    id: "mgmt-psirt",
    ja: "PSIRT",
    reading: "ピーサート",
    en: "Product Security Incident Response Team",
    abbr: "PSIRT",
    shortJa: "自社製品・サービスの脆弱性に対応する専門チーム。",
    shortEn: "A team that handles vulnerabilities in an organization's own products and services.",
    explanationJa:
      "PSIRTは、自社が開発・提供する製品やサービスに含まれる脆弱性について、受付、影響評価、修正プログラムの提供、注意喚起、顧客への説明を行う。自社の業務システムを守るCSIRTとは守る対象が異なる。製品の脆弱性は顧客の環境に影響するため、開示の時期と内容を調整する責任が大きい。",
    explanationEn:
      "A PSIRT manages vulnerabilities in the organization's own products: intake, impact assessment, patches, advisories and customer communication.",
    examUsage:
      "「自社製品の脆弱性」ならPSIRT、「自社の情報システムへの攻撃」ならCSIRTである。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-csirt", "mgmt-soc", "mgmt-jvn"],
    tags: ["管理", "組織", "脆弱性"],
  },
  {
    id: "mgmt-soc",
    ja: "SOC",
    reading: "ソック",
    en: "Security Operation Center",
    abbr: "SOC",
    shortJa: "ログや通信を24時間監視し、不正な活動を検知・分析する組織。",
    shortEn: "A team that monitors logs and traffic to detect and analyze malicious activity.",
    explanationJa:
      "SOCは、ネットワーク、端末、サーバ、クラウドのログを集約し、監視・検知・分析を行う。異常を検知したら、影響度を評価してCSIRTや管理者へエスカレーションする。SOCは監視と一次分析が中心で、封じ込めや復旧の実行主体ではない。監視対象と連絡体制を事前に定めておかないと、検知しても対応が遅れる。",
    explanationEn:
      "A SOC aggregates and monitors logs to detect and analyze suspicious activity, escalating confirmed incidents to the CSIRT or system owners.",
    examUsage:
      "SOCは「監視・検知」、CSIRTは「対応」、PSIRTは「製品脆弱性」と役割を分ける。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-csirt", "mgmt-psirt", "mgmt-escalation"],
    tags: ["管理", "組織", "監視"],
  },
  {
    id: "mgmt-jpcert",
    ja: "JPCERT/CC",
    reading: "ジェイピーサートシーシー",
    en: "Japan Computer Emergency Response Team Coordination Center",
    abbr: "JPCERT/CC",
    shortJa: "国内のインシデント対応を調整し、脆弱性情報を発信する機関。",
    shortEn: "Japan's national coordination center for incident response and vulnerability information.",
    explanationJa:
      "JPCERT/CCは、国内で発生した情報セキュリティインシデントの報告を受け付け、関係組織間の調整や技術支援を行う。JVNの運営をIPAと共同で担い、注意喚起や脆弱性情報を発信する。個々の組織の内部対応を代行する機関ではなく、組織間の調整と情報共有が主な役割である。",
    explanationEn:
      "JPCERT/CC coordinates incident response among organizations in Japan, provides technical support and publishes vulnerability information, including through JVN.",
    examUsage:
      "「国内の調整機関」がJPCERT/CC、「政府機関の統括」がNISC、「制度運営」がIPAである。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-jvn", "mgmt-csirt", "mgmt-nisc"],
    tags: ["管理", "機関", "インシデント"],
  },
  {
    id: "mgmt-nisc",
    ja: "NISC",
    reading: "ニスク",
    en: "National Center of Incident Readiness and Strategy for Cybersecurity",
    abbr: "NISC",
    shortJa: "政府機関のサイバーセキュリティ対策を統括する内閣官房の機関。",
    shortEn: "Japan's cabinet-level center for cybersecurity strategy and government coordination.",
    explanationJa:
      "NISC（内閣サイバーセキュリティセンター）は、政府機関等のサイバーセキュリティ対策の統括、政府統一基準の策定、重要インフラ事業者との情報共有、国際連携を担う。個別企業のインシデントを直接支援する窓口ではなく、政策と政府内の調整が中心である。所管省庁を通じた報告ルートの起点として押さえておきたい。",
    explanationEn:
      "NISC leads Japan's cybersecurity strategy and coordinates government agencies, critical infrastructure operators and international partners.",
    examUsage:
      "NISCは「政府の統括・政策」、JPCERT/CCは「民間の調整」と役割が異なる。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-jpcert", "mgmt-governance"],
    tags: ["管理", "機関", "政府"],
  },
  {
    id: "mgmt-cryptrec",
    ja: "CRYPTREC",
    reading: "クリプトレック",
    en: "Cryptography Research and Evaluation Committees",
    abbr: "CRYPTREC",
    shortJa: "国が利用する暗号技術の安全性を評価する委員会。",
    shortEn: "Japan's committee for evaluating cryptographic techniques for government use.",
    explanationJa:
      "CRYPTRECは、電子政府推奨暗号の選定や、暗号技術の安全性評価を行う委員会である。総務省と経済産業省が所管し、IPAと情報通信研究機構が事務局を担う。自組織で暗号方式を選ぶ際の参考になる暗号リストを公開している。暗号の実装上の不具合と、暗号アルゴリズム自体の安全性評価は別の話である点に注意する。",
    explanationEn:
      "CRYPTREC evaluates cryptographic techniques and publishes recommended cipher lists for government use, with IPA and NICT supporting its secretariat.",
    examUsage:
      "「暗号技術の評価・推奨暗号リスト」はCRYPTREC、「脆弱性情報のポータル」はJVNである。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-jvn", "mgmt-jpcert"],
    tags: ["管理", "機関", "暗号"],
  },
  {
    id: "mgmt-ismap",
    ja: "ISMAP",
    reading: "イズマップ",
    en: "Information system Security Management and Assessment Program",
    abbr: "ISMAP",
    shortJa: "政府情報システムに用いるクラウドサービスのセキュリティ評価制度。",
    shortEn: "Japan's security assessment scheme for cloud services used by government.",
    explanationJa:
      "ISMAPは、政府情報システムで利用するクラウドサービスのセキュリティ水準を評価し、登録する制度である。政府機関が調達する際の判断材料となり、事業者は登録のために管理策の実装状況を説明する必要がある。利用者が個別に審査する負担を減らし、一定の水準を満たすサービスを選びやすくする仕組みである。",
    explanationEn:
      "ISMAP assesses and registers cloud services for government procurement, reducing duplicate security reviews and raising the baseline for providers.",
    examUsage:
      "ISMAPは「政府調達のクラウド評価」、SECURITY ACTIONは「中小企業の宣言」である。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-security-action", "mgmt-iso27017"],
    tags: ["管理", "制度", "クラウド"],
  },
  {
    id: "mgmt-security-action",
    ja: "SECURITY ACTION",
    reading: "セキュリティアクション",
    en: "SECURITY ACTION",
    shortJa: "中小企業が情報セキュリティ対策に取り組むことを宣言する制度。",
    shortEn: "A self-declaration scheme for SMEs committing to information security measures.",
    explanationJa:
      "SECURITY ACTIONは、中小企業が情報セキュリティ対策に取り組む意思を表明し、実施状況に応じて一つ星・二つ星の宣言を行う制度である。IPAが推進し、宣言した企業はロゴマークを利用できる。認証制度ではないため、宣言だけで安全が保証されるわけではなく、実際の対策と組み合わせる必要がある。",
    explanationEn:
      "SECURITY ACTION is IPA's self-declaration scheme in which SMEs pledge to work on information security, using one-star or two-star declarations.",
    examUsage:
      "「認証」ではなく「自己宣言」である点、対象が中小企業である点が問われる。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-ismap", "mgmt-pci-dss"],
    tags: ["管理", "制度", "中小企業"],
  },
  {
    id: "mgmt-pci-dss",
    ja: "PCI DSS",
    reading: "ピーシーアイディーエスエス",
    en: "Payment Card Industry Data Security Standard",
    abbr: "PCI DSS",
    shortJa: "クレジットカード情報を扱う事業者向けの国際的なセキュリティ基準。",
    shortEn: "An international security standard for organizations handling payment card data.",
    explanationJa:
      "PCI DSSは、クレジットカード会員データを保護するためにカードブランドが定めた国際基準である。カード情報の保存・暗号化、アクセス制御、ネットワーク監視、脆弱性管理など複数の要件からなる。カード情報を扱う加盟店や決済事業者は、対象範囲を減らす工夫（非保持化・トークン化）と合わせて準拠することが求められる。",
    explanationEn:
      "PCI DSS sets requirements for protecting cardholder data, covering storage, encryption, access control, monitoring and vulnerability management.",
    examUsage:
      "PCI DSSは「カード情報」、ISMAPは「政府クラウド」、ISMSは「組織全体」と対象で判別する。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-ismap", "mgmt-governance"],
    tags: ["管理", "制度", "決済"],
  },
  {
    id: "mgmt-nist-csf",
    ja: "NISTサイバーセキュリティフレームワーク",
    reading: "ニストサイバーセキュリティフレームワーク",
    en: "NIST Cybersecurity Framework",
    abbr: "NIST CSF",
    shortJa: "米国NISTが策定した、サイバーセキュリティ対策を整理する任意の枠組み。",
    shortEn: "A voluntary framework by NIST for organizing cybersecurity activities.",
    explanationJa:
      "NIST CSFは、特定（Identify）、防御（Protect）、検知（Detect）、対応（Respond）、復旧（Recover）の機能で対策を整理する枠組みである。2024年のCSF 2.0では、これらに統制（Govern）を加えた6機能となった。認証基準ではなく、自組織の対策の全体像を把握し、優先順位を付けるために使う。",
    explanationEn:
      "The NIST CSF organizes cybersecurity activities into Identify, Protect, Detect, Respond and Recover; CSF 2.0 adds Govern as a sixth function.",
    examUsage:
      "CSF 1.1の5機能と、CSF 2.0で追加された「統制（Govern）」の違いに注意する。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-iso27001", "mgmt-governance"],
    tags: ["管理", "基準", "フレームワーク"],
  },
  {
    id: "mgmt-jvn",
    ja: "JVN",
    reading: "ジェイブイエヌ",
    en: "Japan Vulnerability Notes",
    abbr: "JVN",
    shortJa: "脆弱性情報と対策情報を公開する国内のポータルサイト。",
    shortEn: "Japan's portal for vulnerability information and countermeasures.",
    explanationJa:
      "JVNは、ソフトウェアや機器の脆弱性について、影響範囲、深刻度、対策方法を日本語で公開するポータルである。IPAとJPCERT/CCが共同で運営している。製品の利用者と開発者の双方が参照し、修正プログラムの適用や回避策の実施に役立てる。脆弱性の届出や調整を行う窓口も関連して運用されている。",
    explanationEn:
      "JVN is a Japanese portal run by IPA and JPCERT/CC that publishes vulnerability details, severity and countermeasures.",
    examUsage:
      "JVNは「脆弱性情報のポータル」、JPCERT/CCは「調整機関」、CRYPTRECは「暗号評価」である。",
    lessonIds: ["management/governance-org"],
    relatedTermIds: ["mgmt-jpcert", "mgmt-psirt", "mgmt-cryptrec"],
    tags: ["管理", "機関", "脆弱性"],
  },

  // ── incident ─────────────────────────────────────────────────
  {
    id: "mgmt-incident",
    ja: "情報セキュリティインシデント",
    reading: "じょうほうセキュリティインシデント",
    en: "Information security incident",
    shortJa: "情報セキュリティを害する、またはそのおそれがある事象。",
    shortEn: "An event that adversely affects, or may affect, information security.",
    explanationJa:
      "情報セキュリティインシデントは、情報の機密性・完全性・可用性を害する、または害するおそれがある事象を指す。実際の情報漏えい、改ざん、サービス停止だけでなく、その兆候や未遂も含まれる。すべての警告がインシデントになるわけではなく、事象を調査した結果としてインシデントと判断する場合がある。",
    explanationEn:
      "An information security incident is an event that harms or threatens confidentiality, integrity or availability, including attempted and suspected cases.",
    examUsage:
      "「事象」は広い概念、「インシデント」はセキュリティを害する事象、と包含関係で整理する。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-event", "mgmt-triage", "mgmt-csirt"],
    tags: ["管理", "インシデント"],
  },
  {
    id: "mgmt-event",
    ja: "情報セキュリティ事象",
    reading: "じょうほうセキュリティじしょう",
    en: "Information security event",
    shortJa: "情報セキュリティに関係する、望ましくないまたは予期しない事象。",
    shortEn: "An unwanted or unexpected information security occurrence.",
    explanationJa:
      "情報セキュリティ事象は、システムやネットワークで観測される、情報セキュリティに関係する望ましくない、または予期しない出来事である。ウイルス検知、ログイン失敗の多発、不審な通信などが該当する。事象を分析した結果、セキュリティを害するおそれがあると判断されたものがインシデントとなる。",
    explanationEn:
      "An information security event is an unwanted or unexpected occurrence observed in systems, such as malware detection or repeated login failures.",
    examUsage:
      "「すべての事象がインシデントである」とする選択肢は誤りである。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-incident", "mgmt-triage"],
    tags: ["管理", "インシデント"],
  },
  {
    id: "mgmt-triage",
    ja: "トリアージ",
    reading: "トリアージ",
    en: "Triage",
    shortJa: "発生した事象の影響度と緊急度を評価し、対応の優先順位を決めること。",
    shortEn: "Prioritizing incidents by impact and urgency to allocate limited resources.",
    explanationJa:
      "トリアージは、限られた人員と時間の中で、どのインシデントから対応するかを決める活動である。影響範囲、業務への重要度、被害の進行性、攻撃が成立している確度などを基準に判断する。トリアージは対応を放棄するための言い訳ではなく、重大な案件を見逃さず、適切な順番で資源を配分するために行う。",
    explanationEn:
      "Triage assesses impact and urgency to decide the order of incident response. It allocates scarce resources and prevents critical cases from being missed.",
    examUsage:
      "「対応しない案件を選ぶ」のではなく「対応順序とエスカレーションを決める」と理解する。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-incident", "mgmt-escalation", "mgmt-containment"],
    tags: ["管理", "インシデント", "対応"],
  },
  {
    id: "mgmt-containment",
    ja: "封じ込め",
    reading: "ふうじこめ",
    en: "Containment",
    shortJa: "被害の拡大を防ぐため、感染端末や影響範囲を切り離す処置。",
    shortEn: "Isolating affected systems to prevent an incident from spreading.",
    explanationJa:
      "封じ込めは、マルウェア感染や不正アクセスの被害が他のシステムへ広がるのを防ぐ処置である。ネットワークからの隔離、アカウントの停止、該当サービスの一時停止などを行う。封じ込めは証拠を失う可能性と表裏の関係にあるため、実施前に保全すべき情報を確認し、業務への影響も考慮して判断する。",
    explanationEn:
      "Containment isolates affected systems through network segmentation, account suspension or service shutdown to stop the spread of an incident.",
    examUsage:
      "「原因を除去する」のは根絶、「業務を戻す」のは復旧、封じ込めは「広がりを止める」段階である。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-triage", "mgmt-evidence", "mgmt-root-cause"],
    tags: ["管理", "インシデント", "対応"],
  },
  {
    id: "mgmt-evidence",
    ja: "証拠保全",
    reading: "しょうこほぜん",
    en: "Evidence preservation",
    shortJa: "原因究明や法的措置に備え、ログや記憶装置の状態を保全すること。",
    shortEn: "Preserving logs and system state for investigation and legal proceedings.",
    explanationJa:
      "証拠保全は、インシデントの原因究明、被害範囲の特定、刑事手続や民事訴訟に備えて、ログ、メモリ、ディスク、通信記録などを改変されない形で確保する活動である。揮発性の高い情報から順に取得し、取得日時、取得者、ハッシュ値を記録する。端末の電源を切るとメモリ上の証拠が失われるため、手順を事前に定めておく必要がある。",
    explanationEn:
      "Evidence preservation secures logs, memory and disk images in a forensically sound way, recording who collected what, when and with which hash.",
    examUsage:
      "「電源を切ってから調査」「復旧を優先してログを削除」は証拠保全を損なう行為である。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-chain-of-custody", "mgmt-containment", "mgmt-incident"],
    tags: ["管理", "インシデント", "フォレンジック"],
  },
  {
    id: "mgmt-chain-of-custody",
    ja: "チェーンオブカストディ",
    reading: "チェーンオブカストディ",
    en: "Chain of custody",
    shortJa: "証拠の取得から保管・引渡しまでの履歴を記録したもの。",
    shortEn: "A documented record of who handled evidence and when.",
    explanationJa:
      "チェーンオブカストディは、証拠となる資料について、誰が、いつ、どこで取得し、誰が保管し、誰に引き渡したかを連続して記録したものである。記録が途切れると、証拠の同一性や真正性が疑われ、法的な場面で証拠能力が損なわれるおそれがある。封緘、保管場所の施錠、複数人での確認などの運用と組み合わせる。",
    explanationEn:
      "Chain of custody records the collection, storage and transfer of evidence so its integrity and authenticity can be demonstrated.",
    examUsage:
      "「証拠の同一性を保つ記録」と説明されたらチェーンオブカストディである。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-evidence", "mgmt-incident-report"],
    tags: ["管理", "インシデント", "フォレンジック"],
  },
  {
    id: "mgmt-incident-report",
    ja: "インシデント報告と届出",
    reading: "インシデントほうこくととどけで",
    en: "Incident reporting and notification",
    shortJa: "社内外の関係者へ被害状況を報告し、法令に基づき所管機関へ届け出ること。",
    shortEn: "Reporting incidents internally and notifying authorities as required by law.",
    explanationJa:
      "インシデント発生時は、社内の経営層・委員会・CSIRTへ速やかに報告し、法令に基づく届出を検討する。個人情報の漏えい等は個人情報保護委員会への報告と本人への通知、不正アクセスは都道府県公安委員会への届出、重要インフラでは所管省庁への報告が対象となる。報告の要否と期限を事前に整理し、判断に迷う場合の相談先を決めておく。",
    explanationEn:
      "Incident reporting covers internal escalation and legally required notifications, such as personal data breach reports and unauthorized access notifications.",
    examUsage:
      "個人情報保護法は「委員会への報告＋本人通知」、不正アクセス禁止法は「公安委員会への届出」である。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-public-statement", "mgmt-incident", "mgmt-escalation"],
    tags: ["管理", "インシデント", "法規"],
  },
  {
    id: "mgmt-public-statement",
    ja: "対外説明",
    reading: "たいがいせつめい",
    en: "External communication",
    shortJa: "顧客・取引先・報道など外部の関係者に対する事故の説明。",
    shortEn: "Communicating incident facts to customers, partners, media and the public.",
    explanationJa:
      "対外説明は、インシデントの影響を受ける顧客、取引先、株主、報道機関などに対して、確認できた事実、影響範囲、講じた措置、今後の見通しを伝える活動である。推測を事実として発表すると信用を損なうため、事実と推測を区別し、統一した窓口から一貫した内容を発信する。初報では、分かっていることと次回の更新時期を示すことが重要である。",
    explanationEn:
      "External communication informs customers, partners and the public about confirmed facts, impact, actions taken and next steps, avoiding speculation.",
    examUsage:
      "「調査が終わるまで一切公表しない」は、隠蔽と受け取られ信頼を損なう対応である。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-incident-report", "mgmt-sns-guideline", "mgmt-cyber-insurance"],
    tags: ["管理", "インシデント", "広報"],
  },
  {
    id: "mgmt-cyber-insurance",
    ja: "サイバー保険",
    reading: "サイバーほけん",
    en: "Cyber insurance",
    shortJa: "サイバー事故による損害や対応費用を補償する保険。",
    shortEn: "Insurance covering losses and response costs from cyber incidents.",
    explanationJa:
      "サイバー保険は、情報漏えいやサイバー攻撃によって生じた賠償責任、事故調査費用、復旧費用、通知費用、場合によっては身代金・脅迫対応費用などを補償する。保険はリスクの移転であり、事故を防ぐ対策ではない。免責事項や支払限度額、加入条件として求められる事前対策を確認し、他の管理策と組み合わせて使う。",
    explanationEn:
      "Cyber insurance transfers risks such as liability, investigation, recovery and notification costs. It complements, but does not replace, preventive controls.",
    examUsage:
      "保険はリスク対応の「移転」に分類される。低減や回避と混同しない。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-incident", "mgmt-public-statement", "mgmt-governance"],
    tags: ["管理", "リスク", "保険"],
  },
  {
    id: "mgmt-root-cause",
    ja: "原因分析と再発防止",
    reading: "げんいんぶんせきとさいはつぼうし",
    en: "Root cause analysis and recurrence prevention",
    shortJa: "インシデントの根本原因を特定し、再発を防ぐ対策を講じること。",
    shortEn: "Identifying root causes and implementing measures to prevent recurrence.",
    explanationJa:
      "原因分析は、インシデントの直接原因だけでなく、なぜそれが起きたのかを掘り下げて根本原因を特定する活動である。原因を「担当者の注意不足」で終わらせると、手順や体制の欠陥が残り再発する。特定した原因に対して是正処置を講じ、有効性を確認し、同様の業務へ水平展開するまでが再発防止である。",
    explanationEn:
      "Root cause analysis goes beyond the immediate cause to find systemic weaknesses. Corrective actions are then verified and applied to similar operations.",
    examUsage:
      "「個人の処分」や「注意喚起のみ」は再発防止として不十分である。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-nonconformity", "mgmt-incident-drill", "mgmt-containment"],
    tags: ["管理", "インシデント", "改善"],
  },
  {
    id: "mgmt-escalation",
    ja: "エスカレーション",
    reading: "エスカレーション",
    en: "Escalation",
    shortJa: "判断や権限を上位者・関係部署へ引き上げ、迅速な決定を促すこと。",
    shortEn: "Raising an issue to higher authority or another team for timely decisions.",
    explanationJa:
      "エスカレーションは、対応者が判断に迷う場合や、影響が大きいと判明した場合に、上位の責任者や関係部署へ事案を引き上げることである。基準を事前に定めておかないと、現場が抱え込んで対応が遅れる。技術的な深刻度だけでなく、経営判断が必要か、法的な報告が必要かという観点でもエスカレーションする。",
    explanationEn:
      "Escalation moves an incident to higher authority or specialist teams when impact, uncertainty or legal obligations exceed the responder's remit.",
    examUsage:
      "トリアージの結果として「誰に、いつ、何を報告するか」を決めるのがエスカレーションである。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-triage", "mgmt-incident-report", "mgmt-soc"],
    tags: ["管理", "インシデント", "体制"],
  },
  {
    id: "mgmt-incident-drill",
    ja: "インシデント対応訓練",
    reading: "インシデントたいおうくんれん",
    en: "Incident response exercise",
    shortJa: "机上・実地でインシデント対応手順を検証し、改善する活動。",
    shortEn: "Tabletop or practical exercises that test and improve incident response.",
    explanationJa:
      "インシデント対応訓練は、シナリオに基づいて検知、連絡、トリアージ、封じ込め、報告、対外説明の手順を演習し、体制や連絡先、判断基準の不足を洗い出す活動である。訓練で見つかった課題を手順書や体制の見直しに反映することが目的であり、実施すること自体が目的ではない。経営層を含めた訓練は、意思決定の練習にもなる。",
    explanationEn:
      "Incident response exercises rehearse detection, communication, triage and containment, revealing gaps in plans, contacts and decision-making.",
    examUsage:
      "訓練は「手順の有効性を確認し改善する」活動であり、監査や認証のための形式的な行事ではない。",
    lessonIds: ["management/incident"],
    relatedTermIds: ["mgmt-root-cause", "mgmt-incident", "mgmt-escalation"],
    tags: ["管理", "インシデント", "訓練"],
  },
];
