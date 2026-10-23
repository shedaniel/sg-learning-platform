import type { GlossaryTerm } from "@/lib/content/types";

export const orgTerms: GlossaryTerm[] = [
  {
    id: "org-security-clearance",
    ja: "セキュリティクリアランス",
    reading: "せきゅりてぃくりあらんす",
    en: "Security clearance",
    shortJa: "情報の重要度に応じて、取扱いを許す人を審査・認定する仕組み。",
    shortEn:
      "A process of vetting and authorizing people to access information according to its sensitivity.",
    explanationJa:
      "セキュリティクリアランスは、機密情報を扱う者を事前に審査し、取扱いの資格を与える仕組みである。認定は役職に自動的に付随するものではなく、情報ごと、業務ごとに必要性を判断する。異動・退職・契約変更のたびに見直し、付与の根拠と期限を記録する。",
    explanationEn:
      "Security clearance is a process of vetting personnel before granting access to sensitive information. Authorization is tied to specific information and duties, reviewed when roles or contracts change.",
    examUsage:
      "「管理職には自動的に付与される」とする選択肢は誤り。ニード・トゥ・ノウと組み合わせて出題される。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-need-to-know", "org-nda"],
    tags: ["人的セキュリティ", "アクセス制御"],
  },
  {
    id: "org-nda",
    ja: "秘密保持契約",
    reading: "ひみつほじけいやく",
    en: "Non-disclosure agreement",
    abbr: "NDA",
    shortJa: "秘密情報の範囲と取扱い、違反時の措置を定める契約。",
    shortEn:
      "A contract defining confidential information, permitted use, and remedies for breach.",
    explanationJa:
      "秘密保持契約（NDA）は、秘密情報の定義、利用目的の限定、第三者への開示の禁止、例外（公知情報、独自開発、法令に基づく開示）、有効期間、返還・破棄、違反時の措置を定める。従業者との契約では、退職後も義務が残ることを明確にする。",
    explanationEn:
      "An NDA defines confidential information, permitted purposes, prohibited disclosure, exceptions, duration, return or destruction, and remedies. Employee agreements should make clear that obligations survive retirement.",
    examUsage:
      "「退職時に秘密保持義務が当然に終了する」とする説明は誤り。委託契約では再委託先への適用も論点になる。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-security-clearance", "org-outsourcing"],
    tags: ["契約", "人的セキュリティ"],
  },
  {
    id: "org-targeted-email-training",
    ja: "標的型メール訓練",
    reading: "ひょうてきがためーるくんれん",
    en: "Targeted phishing simulation",
    shortJa: "模擬の標的型メールを送り、従業者の判断と報告を確かめる訓練。",
    shortEn:
      "A simulation that sends realistic phishing emails to measure employee judgment and reporting.",
    explanationJa:
      "標的型メール訓練は、実際の業務を模した模擬メールを送信し、添付ファイルの開封、リンクのクリック、報告の有無を測定する。目的は従業者の処分ではなく、検知と報告の改善である。クリック率だけでなく、報告率と初報までの時間を指標にする。",
    explanationEn:
      "Phishing simulations send realistic emails and measure clicks, attachment opens, and reporting. The goal is improving detection and reporting, not punishing employees; report rate and time to first report matter as much as click rate.",
    examUsage:
      "評価指標として「クリック率の低さ」だけを挙げる選択肢は不十分。報告率・初報時間が重要である。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-security-awareness", "org-tabletop-exercise"],
    tags: ["教育・訓練", "標的型攻撃"],
  },
  {
    id: "org-tabletop-exercise",
    ja: "机上演習",
    reading: "きじょうえんしゅう",
    en: "Tabletop exercise",
    shortJa: "シナリオに沿って関係者が判断と連絡を訓練する演習。",
    shortEn:
      "An exercise in which stakeholders walk through decisions and communications using a scenario.",
    explanationJa:
      "机上演習は、実際のシステムを停止せずに、インシデント対応や事業継続の手順を関係者でたどる演習である。初動連絡、被害範囲の確認、経営判断、広報、委託先との連携を時系列で確認し、手順書と実際の役割の不一致を洗い出す。",
    explanationEn:
      "A tabletop exercise walks stakeholders through incident response or continuity procedures without stopping systems. It tests notification, scoping, executive decisions, communications, and vendor coordination.",
    examUsage:
      "「実際にシステムを停止して行う訓練」は机上演習ではない。図上・討論形式である点が手がかりになる。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-targeted-email-training", "org-internal-control"],
    tags: ["教育・訓練", "インシデント対応"],
  },
  {
    id: "org-insider-fraud",
    ja: "内部不正",
    reading: "ないぶふせい",
    en: "Insider fraud",
    shortJa: "正規の権限を悪用して行われる情報窃取・不正送金などの行為。",
    shortEn:
      "Wrongdoing by authorized users, such as data theft or fraudulent payments.",
    explanationJa:
      "内部不正は、従業者、退職者、派遣労働者、委託先の従業者などが、正規に与えられた権限を悪用して行う。情報の窃取、不正送金、データの破壊、競合への持ち出しが代表例である。不正のトライアングルのうち、組織はまず機会を減らす統制に取り組む。",
    explanationEn:
      "Insider fraud is committed by employees, former employees, contractors, or temporary staff abusing legitimate access. Typical cases include data theft, fraudulent payments, sabotage, and taking information to competitors.",
    examUsage:
      "「外部からの攻撃のみを内部不正という」は誤り。退職者や委託先も行為者になり得る。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-separation-of-duties", "org-least-privilege", "org-internal-reporting"],
    tags: ["内部不正", "人的セキュリティ"],
  },
  {
    id: "org-internal-reporting",
    ja: "内部通報制度",
    reading: "ないぶつうほうせいど",
    en: "Internal reporting system",
    shortJa: "不正や違法行為を通報できる社内窓口と運用の仕組み。",
    shortEn:
      "A system of internal channels for reporting wrongdoing and protecting reporters.",
    explanationJa:
      "内部通報制度は、従業者や取引先が不正、法令違反、ハラスメントなどを通報できる窓口である。公益通報者保護法は、通報を理由とする解雇その他の不利益な取扱いを禁じている。窓口の独立性、匿名性、通報者の秘匿、通報を抑圧しない文化が実効性を左右する。",
    explanationEn:
      "Internal reporting channels allow employees and partners to report wrongdoing. Whistleblower protection law prohibits retaliation. Independence of the channel, anonymity, confidentiality, and a culture that does not suppress reports determine effectiveness.",
    examUsage:
      "「通報者を特定して処分する」「通報を人事評価に反映する」は誤り。窓口の独立性が問われる。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-insider-fraud", "org-disciplinary-action"],
    tags: ["内部統制", "コンプライアンス"],
  },
  {
    id: "org-separation-of-duties",
    ja: "職務分離",
    reading: "しょくむぶんり",
    en: "Separation of duties",
    shortJa: "一人で不正や重大な誤りを完結できないように職務を分ける統制。",
    shortEn:
      "A control that divides duties so one person cannot complete a fraud or serious error alone.",
    explanationJa:
      "職務分離は、申請と承認、開発と本番運用、入金処理と消込、権限付与とレビューなどを別の担当者に分ける。ミスの検出と不正の抑止の両方に効果がある。小規模組織で完全な分離が難しい場合は、ログレビュー、第三者承認、外部監査で補完する。",
    explanationEn:
      "Separation of duties splits request and approval, development and production operation, payment and reconciliation, and access granting and review. Small organizations compensate with log review, third-party approval, or external audit.",
    examUsage:
      "「人数が少ないので職務分離は不要」は誤り。代替統制を設計する。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-least-privilege", "org-insider-fraud"],
    tags: ["内部統制", "統制活動"],
  },
  {
    id: "org-least-privilege",
    ja: "最小権限の原則",
    reading: "さいしょうけんげんのげんそく",
    en: "Principle of least privilege",
    shortJa: "業務に必要な最小限の権限だけを、必要な期間だけ与える考え方。",
    shortEn:
      "Granting only the minimum access needed for a task, for only as long as needed.",
    explanationJa:
      "最小権限の原則は、利用者やプロセスに、業務上必要な範囲を超えた権限を与えないという考え方である。特権アカウントの管理、期限付きの権限付与、定期的な棚卸し、不要権限の削除によって実現する。内部不正と侵害後の横展開の両方を抑える。",
    explanationEn:
      "Least privilege limits access to what is needed for the task and period. It is implemented through privileged account management, time-bound grants, periodic reviews, and removal of unnecessary rights.",
    examUsage:
      "「全員に管理者権限を与えて効率化する」は誤り。特権の最小化と棚卸しが問われる。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-separation-of-duties"],
    tags: ["アクセス制御", "内部統制"],
  },
  {
    id: "org-employment-lifecycle",
    ja: "雇用ライフサイクル",
    reading: "こようらいふさいくる",
    en: "Employment lifecycle",
    shortJa: "採用・配置・異動・退職の各段階で人に係る統制を管理すること。",
    shortEn:
      "Managing people-related controls across recruitment, placement, transfer, and termination.",
    explanationJa:
      "雇用ライフサイクルは、採用、配置、異動、退職の各段階で、身元確認、権限付与、教育、権限の見直し、返却・消去を行う考え方である。退職時のアカウント無効化や媒体回収は、最終出社日に完了させる。派遣労働者や委託先の従業者も同様に扱う。",
    explanationEn:
      "The employment lifecycle covers screening, access granting, training, access review, and return or erasure at each stage. Termination controls should be completed on the last working day and applied to contractors and temporary staff as well.",
    examUsage:
      "退職日の「翌日」に権限を削除する運用は不十分。当日の失効が原則である。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-security-clearance", "org-nda", "org-disciplinary-action"],
    tags: ["人事", "人的セキュリティ"],
  },
  {
    id: "org-disciplinary-action",
    ja: "懲戒処分",
    reading: "ちょうかいしょぶん",
    en: "Disciplinary action",
    shortJa: "就業規則に基づき、規律違反に対して行う処分。",
    shortEn:
      "A sanction imposed under work rules for violations of organizational discipline.",
    explanationJa:
      "懲戒処分は、就業規則に定められた種類と手続に従って行う。事実確認、本人の弁明の機会、行為と処分の均衡（比例原則）が求められる。けん責、減給、出勤停止、降格、懲戒解雇などがある。刑事罰や民事の損害賠償とは、目的も手続も異なる。",
    explanationEn:
      "Disciplinary action follows work rules and requires fact-finding, an opportunity to respond, and proportionality. It is distinct from criminal penalties and civil damages.",
    examUsage:
      "「懲戒処分は刑事罰の一種である」は誤り。就業規則と手続が根拠になる。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-internal-reporting", "org-employment-lifecycle"],
    tags: ["人事", "コンプライアンス"],
  },
  {
    id: "org-need-to-know",
    ja: "ニード・トゥ・ノウ",
    reading: "にーどぅとぅのう",
    en: "Need to know",
    shortJa: "業務上知る必要のある者だけに情報へのアクセスを認める原則。",
    shortEn:
      "Access is granted only to those who need the information to perform their duties.",
    explanationJa:
      "ニード・トゥ・ノウは、役職や資格の有無にかかわらず、業務上その情報を知る必要がある者だけにアクセスを認める原則である。セキュリティクリアランスと組み合わせ、情報ごとにアクセス範囲を設計する。異動や業務変更のたびに見直す。",
    explanationEn:
      "Need to know limits access to those who require the information for their work, regardless of rank. It complements security clearance and is reviewed when duties change.",
    examUsage:
      "「管理職はすべての情報を見られる」は誤り。必要性は業務ごとに判断する。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-security-clearance", "org-least-privilege"],
    tags: ["アクセス制御", "人的セキュリティ"],
  },
  {
    id: "org-security-awareness",
    ja: "セキュリティ意識向上",
    reading: "せきゅりてぃいしきこうじょう",
    en: "Security awareness",
    shortJa: "教育・啓発・訓練を通じて、セキュリティ上の行動を定着させる活動。",
    shortEn:
      "Activities that build secure behavior through education, awareness, and training.",
    explanationJa:
      "セキュリティ意識向上は、知識を教える教育、意識を保つ啓発、行動を試す訓練を組み合わせて行う。経営層の関与、対象者別の内容、定期的な実施、行動指標による評価が重要である。実施回数ではなく、報告率や事故の減少などの変化で効果を測る。",
    explanationEn:
      "Security awareness combines education, awareness communication, and training. Executive involvement, role-specific content, regular delivery, and behavioral metrics matter more than counting sessions.",
    examUsage:
      "「研修を年1回実施すれば意識向上は完了する」は誤り。訓練と評価を組み合わせる。",
    lessonIds: ["org/human"],
    relatedTermIds: ["org-targeted-email-training", "org-tabletop-exercise"],
    tags: ["教育・訓練", "人的セキュリティ"],
  },
  {
    id: "org-outsourcing",
    ja: "外部委託",
    reading: "がいぶいたく",
    en: "Outsourcing",
    shortJa: "業務の一部を外部の事業者に委託すること。",
    shortEn: "Contracting part of an organization's work to an external provider.",
    explanationJa:
      "外部委託は、システム開発、運用、データ処理などを外部事業者に委ねる。委託によって業務は移るが、委託元の選定・契約・監督の責任は残る。請負と準委任では責任分界が異なるため、契約形態を踏まえて統制を設計する。",
    explanationEn:
      "Outsourcing transfers work, not accountability. The outsourcing organization remains responsible for selection, contracting, and oversight. Liability boundaries differ between fixed-deliverable and service contracts.",
    examUsage:
      "「委託したので委託元の責任はなくなる」は誤り。委託先監督は委託元の責任である。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-vendor-due-diligence", "org-vendor-monitoring", "org-nda"],
    tags: ["外部委託", "サプライチェーン"],
  },
  {
    id: "org-vendor-due-diligence",
    ja: "委託先選定",
    reading: "いたくさきせんてい",
    en: "Vendor due diligence",
    shortJa: "委託前に、委託先の体制・技術・財務・事故歴を確認すること。",
    shortEn:
      "Pre-contract assessment of a provider's organization, capability, finances, and incident history.",
    explanationJa:
      "委託先選定では、セキュリティ管理体制、技術力、認証の範囲、再委託の有無、インシデント履歴、財務の安定性、地理的条件を確認する。重要度の高い委託ほど、訪問、試行、第三者評価を組み合わせる。選定の基準と理由を記録する。",
    explanationEn:
      "Vendor selection examines security organization, technical capability, certification scope, subcontracting, incident history, financial stability, and location. Higher-risk engagements warrant site visits, pilots, or independent assessments.",
    examUsage:
      "「ISMS認証を取得していれば選定調査は不要」は誤り。スコープと運用を確認する。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-outsourcing", "org-right-to-audit", "org-subcontracting"],
    tags: ["外部委託", "リスク評価"],
  },
  {
    id: "org-sla",
    ja: "サービスレベル合意",
    reading: "さーびすれべるごうい",
    en: "Service level agreement",
    abbr: "SLA",
    shortJa: "サービスの品質水準と、達成状況の測定方法を定める合意。",
    shortEn:
      "An agreement defining service quality levels and how they are measured.",
    explanationJa:
      "SLAは、可用性、応答時間、復旧時間、サポート体制などのサービス水準を定める。セキュリティ要件は、事故報告、監査、データ返還などとして別途規定することが多い。測定方法と未達時の措置を明確にしないと、運用で争いになる。",
    explanationEn:
      "An SLA defines availability, response time, recovery time, and support levels. Security requirements such as incident reporting, audit, and data return are often specified separately.",
    examUsage:
      "SLAは可用性だけの合意ではない。セキュリティ要件や報告義務と組み合わせて考える。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-outsourcing", "org-vendor-monitoring"],
    tags: ["外部委託", "サービスマネジメント"],
  },
  {
    id: "org-subcontracting",
    ja: "再委託",
    reading: "さいいたく",
    en: "Subcontracting",
    shortJa: "委託先が、委託された業務の一部をさらに第三者に委ねること。",
    shortEn:
      "A provider entrusting part of the contracted work to another organization.",
    explanationJa:
      "再委託は、委託元の管理が届きにくい範囲を生む。情報の二次流通、再委託先の脆弱性、事故時の責任分界が問題になる。原則として事前の書面承認制とし、再委託先の名称、所在地、委託内容、管理策を把握する。再委託先の変更も届出の対象とする。",
    explanationEn:
      "Subcontracting extends the supply chain beyond the original provider. Prior written approval, a register of subcontractors, and visibility into their controls are essential.",
    examUsage:
      "「再委託は委託先の自由」は誤り。事前承認と再委託先の把握が必要である。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-outsourcing", "org-supply-chain-attack", "org-data-return-deletion"],
    tags: ["外部委託", "サプライチェーン"],
  },
  {
    id: "org-vendor-monitoring",
    ja: "委託先監督",
    reading: "いたくさきかんとく",
    en: "Vendor oversight",
    shortJa: "契約後の委託先の履行状況を継続的に確認する活動。",
    shortEn:
      "Ongoing confirmation that a provider is meeting contractual and security requirements.",
    explanationJa:
      "委託先監督は、定期報告、訪問、ログの提出、監査、是正計画の進捗確認を組み合わせて行う。委託の重要度に応じて頻度と深度を変える。監督の責任は委託元にあり、実施記録が事故時の説明責任を支える。",
    explanationEn:
      "Vendor oversight combines periodic reporting, site visits, log submission, audits, and remediation tracking. The outsourcing organization retains responsibility and should document its oversight.",
    examUsage:
      "「委託先が管理しているので委託元は監督不要」は誤り。監督義務は残る。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-right-to-audit", "org-sla", "org-incident-reporting"],
    tags: ["外部委託", "モニタリング"],
  },
  {
    id: "org-right-to-audit",
    ja: "監査権",
    reading: "かんさけん",
    en: "Right to audit",
    shortJa: "委託元が委託先の体制や記録を確認できる契約上の権利。",
    shortEn:
      "A contractual right for the outsourcing organization to examine the provider's controls and records.",
    explanationJa:
      "監査権は、委託先の施設への立入り、帳簿やログの閲覧、従業者への質問などを認める契約条項である。監査の通知期間、範囲、頻度、秘密保持、再委託先への適用を定める。権利を定めるだけでなく、実際に行使し、指摘の是正を確認する。",
    explanationEn:
      "A right-to-audit clause permits site access, record and log review, and interviews. It should define notice, scope, frequency, confidentiality, and application to subcontractors.",
    examUsage:
      "「監査権を契約に定めれば監督義務を果たした」は誤り。行使と是正確認が必要である。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-vendor-monitoring", "org-vendor-due-diligence"],
    tags: ["外部委託", "監査"],
  },
  {
    id: "org-cloud-shared-responsibility",
    ja: "責任共有モデル",
    reading: "せきにんきょうゆうもでる",
    en: "Shared responsibility model",
    shortJa: "クラウドのセキュリティ責任を事業者と利用者で分担する考え方。",
    shortEn:
      "A model that divides cloud security responsibilities between provider and customer.",
    explanationJa:
      "責任共有モデルでは、物理施設や基盤のセキュリティは事業者が担い、利用者管理、設定、データ、暗号鍵などは利用者が担う。IaaS、PaaS、SaaSの順に、利用者側の責任範囲が広がる。サービス形態ごとに責任分界を確認する。",
    explanationEn:
      "Under the shared responsibility model, providers secure facilities and infrastructure, while customers handle identity, configuration, data, and keys. Customer responsibility grows from IaaS to PaaS to SaaS.",
    examUsage:
      "「クラウドは事業者がすべて守る」は誤り。設定ミスやID管理は利用者の責任である。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-outsourcing"],
    tags: ["クラウド", "外部委託"],
  },
  {
    id: "org-supply-chain-attack",
    ja: "サプライチェーン攻撃",
    reading: "さぷらいちぇーんこうげき",
    en: "Supply chain attack",
    shortJa: "取引先やソフトウェア供給経路を侵入口として行う攻撃。",
    shortEn:
      "An attack that compromises an organization through vendors, suppliers, or software distribution paths.",
    explanationJa:
      "サプライチェーン攻撃は、委託先、取引先、ソフトウェア供給者、更新経路などを足がかりに、最終的な標的へ侵入する。中小の取引先が踏み台にされる場合もある。調達要件、SBOM、署名検証、ネットワーク分離、インシデント情報の共有でリスクを下げる。",
    explanationEn:
      "Supply chain attacks compromise vendors, suppliers, or software update paths to reach the ultimate target. Mitigations include procurement requirements, SBOM, signature verification, segmentation, and information sharing.",
    examUsage:
      "「自社の防御が堅ければサプライチェーン攻撃は防げる」は誤り。取引先経由の侵入を想定する。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-supplier-management", "org-sbom", "org-subcontracting"],
    tags: ["サプライチェーン", "脅威"],
  },
  {
    id: "org-supplier-management",
    ja: "供給者管理",
    reading: "きょうきゅうしゃかんり",
    en: "Supplier management",
    shortJa: "調達から契約終了まで、供給者のリスクを継続的に管理すること。",
    shortEn:
      "Managing supplier risk throughout procurement, delivery, and contract termination.",
    explanationJa:
      "供給者管理は、供給者の重要度を分類し、選定、契約、監督、評価、終了の各段階でリスクを管理する。単一の供給者への依存、財務の悪化、再委託の多層化を把握する。供給者の変更が自社のリスクを変えるため、定期的に再評価する。",
    explanationEn:
      "Supplier management classifies suppliers by criticality and manages risk through selection, contracting, oversight, evaluation, and exit. Dependencies, financial health, and subcontracting depth are reviewed periodically.",
    examUsage:
      "供給者管理は「契約時の一度の審査」ではなく、継続的な評価である。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-supply-chain-attack", "org-vendor-monitoring"],
    tags: ["サプライチェーン", "ガバナンス"],
  },
  {
    id: "org-incident-reporting",
    ja: "インシデント報告",
    reading: "いんしでんとほうこく",
    en: "Incident reporting",
    shortJa: "事故の発生・影響・対応状況を、定めた経路と期限で共有すること。",
    shortEn:
      "Sharing incident facts, impact, and response through defined channels and deadlines.",
    explanationJa:
      "委託先のインシデント報告は、初報、続報、最終報の段階で行う。初報では発覚した事実、影響が疑われる範囲、初動を、契約で定めた期限までに連絡する。報告を遅らせない文化、連絡先の最新化、共同での原因究明が被害の封じ込めに効く。",
    explanationEn:
      "Incident reporting proceeds through initial, interim, and final reports. The initial report covers known facts, suspected scope, and immediate actions within the contractual deadline.",
    examUsage:
      "「委託先の事故は委託元に報告不要」は誤り。契約で期限と経路を定める。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-vendor-monitoring", "org-outsourcing"],
    tags: ["インシデント対応", "外部委託"],
  },
  {
    id: "org-data-return-deletion",
    ja: "データ返還・消去",
    reading: "でーたへんかんしょうきょ",
    en: "Data return and deletion",
    shortJa: "契約終了時に、委託先からデータを返還し、確実に消去すること。",
    shortEn:
      "Returning data and ensuring its deletion when a contract ends.",
    explanationJa:
      "契約終了時には、委託先が保有するデータの返還、消去、消去証明の提出を求める。バックアップ、ログ、二次媒体、再委託先の保有分も対象にする。返還・消去の完了を確認するまでが委託の終了である。",
    explanationEn:
      "At contract end, providers should return or delete data and provide evidence of deletion, including backups, logs, secondary media, and subcontractor copies.",
    examUsage:
      "「契約終了時にデータを消去する」は、バックアップや再委託先も含めて考える。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-subcontracting", "org-outsourcing"],
    tags: ["外部委託", "データ管理"],
  },
  {
    id: "org-sbom",
    ja: "SBOM",
    reading: "えすびーおーえむ",
    en: "Software bill of materials",
    shortJa: "ソフトウェアに含まれる部品と依存関係の一覧。",
    shortEn:
      "A list of software components and dependencies contained in a product.",
    explanationJa:
      "SBOMは、ソフトウェアを構成するライブラリやコンポーネント、その版と依存関係を一覧化したものである。脆弱性が公表されたときに、影響を受ける製品と版を迅速に特定するために使う。調達要件に含めることで、供給者からの情報提供を促せる。",
    explanationEn:
      "An SBOM inventories software components, versions, and dependencies. It enables rapid identification of affected products when a vulnerability is disclosed and can be required in procurement.",
    examUsage:
      "SBOMは脆弱性そのものを修正する道具ではない。影響範囲の特定と管理に使う。",
    lessonIds: ["org/vendor"],
    relatedTermIds: ["org-supply-chain-attack", "org-supplier-management"],
    tags: ["サプライチェーン", "ソフトウェア管理"],
  },
  {
    id: "org-system-audit",
    ja: "システム監査",
    reading: "しすてむかんさ",
    en: "System audit",
    shortJa: "情報システムのガバナンス・マネジメント・コントロールを検証・評価すること。",
    shortEn:
      "Independent examination and evaluation of IT governance, management, and controls.",
    explanationJa:
      "システム監査は、情報システムの計画、開発、運用、保守を対象に、ガバナンス、マネジメント、コントロールが適切かどうかを検証する。監査人は意見を述べ、必要に応じて改善を勧告する。経済産業省のシステム監査基準が行為規範と手続を示す。",
    explanationEn:
      "A system audit examines whether IT governance, management, and controls are appropriate across planning, development, operation, and maintenance. The METI system audit standard defines auditor conduct and procedures.",
    examUsage:
      "システム監査の目的を「会計処理の適正性の保証」とする選択肢は誤り。情報システムの統制が対象である。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-information-security-audit", "org-auditor-independence", "org-audit-evidence"],
    tags: ["監査", "ガバナンス"],
  },
  {
    id: "org-information-security-audit",
    ja: "情報セキュリティ監査",
    reading: "じょうほうせきゅりてぃかんさ",
    en: "Information security audit",
    shortJa: "情報セキュリティ管理策の適切性と有効性を検証・評価すること。",
    shortEn:
      "Independent assessment of the adequacy and effectiveness of information security controls.",
    explanationJa:
      "情報セキュリティ監査は、組織の情報セキュリティ管理策が適切に設計され、有効に運用されているかを検証する。適合性を保証する保証型と、改善を提案する助言型がある。監査の目的と成果物を事前に合意することが重要である。",
    explanationEn:
      "An information security audit assesses whether controls are adequately designed and effectively operated. It may provide assurance or advisory recommendations.",
    examUsage:
      "保証型と助言型の違いが問われる。何を成果とするかを監査計画で明確にする。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-system-audit", "org-audit-evidence"],
    tags: ["監査", "情報セキュリティ"],
  },
  {
    id: "org-auditor-independence",
    ja: "監査人の独立性",
    reading: "かんさにんのどくりつせい",
    en: "Auditor independence",
    shortJa: "監査人が利害関係から独立し、客観的な判断を行える状態。",
    shortEn:
      "The state in which an auditor is free from conflicting interests and can judge objectively.",
    explanationJa:
      "監査人の独立性には、判断が利害関係に左右されない精神的独立性と、外部から見て独立している外観的独立性がある。監査対象部門の業務兼務、開発への関与、報告系統の不備は独立性を損なう。定期的なローテーションも有効である。",
    explanationEn:
      "Independence has an mental and an appearance dimension. Performing audited duties, involvement in development, or reporting to the audited department undermines it. Rotation helps.",
    examUsage:
      "「社内の監査人だから独立性はない」は誤り。報告系統と兼任状況で判断する。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-system-audit", "org-internal-control"],
    tags: ["監査", "倫理"],
  },
  {
    id: "org-audit-evidence",
    ja: "監査証拠",
    reading: "かんさしょうこ",
    en: "Audit evidence",
    shortJa: "監査の結論を裏付けるために収集・評価する記録や事実。",
    shortEn:
      "Records and facts gathered and evaluated to support audit conclusions.",
    explanationJa:
      "監査証拠は、監査人の結論を支える情報である。量が足りているかを示す十分性と、関連性・信頼性を示す適切性が求められる。文書、電磁的記録、証言、観察、統制の再実施などを組み合わせる。ヒアリングだけでは証拠として弱い。",
    explanationEn:
      "Audit evidence supports conclusions and must be sufficient and appropriate. It can include documents, electronic records, testimony, observation, and re-performance.",
    examUsage:
      "「担当者の説明だけで十分な証拠になる」は誤り。裏付けを取る。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-system-audit", "org-follow-up"],
    tags: ["監査", "証拠"],
  },
  {
    id: "org-follow-up",
    ja: "フォローアップ",
    reading: "ふぉろーあっぷ",
    en: "Follow-up",
    shortJa: "監査報告後の改善状況を確認し、是正の有効性を確かめる手続。",
    shortEn:
      "The procedure for confirming remediation and its effectiveness after an audit report.",
    explanationJa:
      "フォローアップは、監査で指摘された事項について、改善計画の進捗、是正措置の実施、有効性、再発の有無を確認する。必要に応じて再監査を行う。改善が進まない場合は、経営層や監査役会へエスカレーションする。報告書の提出は完了条件ではない。",
    explanationEn:
      "Follow-up verifies remediation progress, implementation, effectiveness, and recurrence, with re-audit when needed. Unresolved issues are escalated. Issuing the report does not complete the process.",
    examUsage:
      "「フォローアップは監査報告書の提出まで」は誤り。改善の実施と有効性の確認までを含む。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-audit-evidence", "org-monitoring"],
    tags: ["監査", "改善"],
  },
  {
    id: "org-internal-control",
    ja: "内部統制",
    reading: "ないぶとうせい",
    en: "Internal control",
    shortJa: "業務の有効性・報告の信頼性・法令遵守・資産保全を達成する仕組み。",
    shortEn:
      "Processes designed to achieve operational effectiveness, reliable reporting, compliance, and asset protection.",
    explanationJa:
      "内部統制は、経営者が定めた目標を達成するために、組織内に組み込まれたプロセスである。業務の有効性と効率性、報告の信頼性、法令遵守、資産の保全を目的とする。統制環境、リスク評価、統制活動、情報と伝達、モニタリングの5要素で整理される。",
    explanationEn:
      "Internal control is a process integrated into the organization to achieve effectiveness, reliable reporting, compliance, and asset protection. It is organized into five components.",
    examUsage:
      "内部統制の5要素に「監査」や「懲戒」を入れる選択肢は誤り。5要素は統制環境・リスク評価・統制活動・情報と伝達・モニタリングである。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-control-environment", "org-monitoring", "org-separation-of-duties"],
    tags: ["内部統制", "ガバナンス"],
  },
  {
    id: "org-control-environment",
    ja: "統制環境",
    reading: "とうせいかんきょう",
    en: "Control environment",
    shortJa: "経営者の姿勢・倫理・組織構造など、内部統制の土台となる要素。",
    shortEn:
      "The tone at the top, ethics, structure, and authority that form the foundation of internal control.",
    explanationJa:
      "統制環境は、経営者の誠実性と倫理観、権限と責任の配分、組織構造、人材の確保など、他の統制要素の土台である。行動規範、権限委譲、監査体制、人事方針が含まれる。統制環境が弱いと、個々の統制活動が形骸化しやすい。",
    explanationEn:
      "The control environment encompasses integrity and ethics, authority and responsibility, organizational structure, and people. It underpins the other components of internal control.",
    examUsage:
      "統制環境は「規程の数」ではなく、経営者の姿勢と権限の設計で判断する。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-internal-control", "org-monitoring"],
    tags: ["内部統制", "ガバナンス"],
  },
  {
    id: "org-monitoring",
    ja: "モニタリング",
    reading: "もにたりんぐ",
    en: "Monitoring",
    shortJa: "内部統制が有効に運用されているかを継続的・独立的に評価すること。",
    shortEn:
      "Ongoing and independent evaluation of whether internal controls are operating effectively.",
    explanationJa:
      "モニタリングは、内部統制の運用状況を評価し、不備を是正する活動である。日常の業務の中で行う継続的モニタリングと、内部監査などによる独立的評価がある。評価結果は経営層に報告し、改善につなげる。モニタリングが働かないと統制は形骸化する。",
    explanationEn:
      "Monitoring evaluates control operation and drives remediation through ongoing and independent assessments, such as internal audit, with results reported to management.",
    examUsage:
      "モニタリングは「統制を設計すること」ではなく「運用を評価し是正すること」である。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-internal-control", "org-follow-up"],
    tags: ["内部統制", "モニタリング"],
  },
  {
    id: "org-physical-zoning",
    ja: "物理的ゾーニング",
    reading: "ぶつりてきぞーにんぐ",
    en: "Physical zoning",
    shortJa: "情報資産の重要度に応じて区域を分け、境界ごとに管理すること。",
    shortEn:
      "Dividing facilities into zones by sensitivity and controlling each boundary.",
    explanationJa:
      "物理的ゾーニングは、公開ゾーン、受付、執務室、サーバ室、重要区画のように区域を分け、境界ごとに入退室の認証と記録を設ける。一つの境界だけに依存せず、多層的に守る。区域の重要度に応じて、認証方式と監視の強度を変える。",
    explanationEn:
      "Physical zoning separates public areas, reception, offices, server rooms, and critical areas, with authentication and logging at each boundary. Controls are layered and scaled to sensitivity.",
    examUsage:
      "ゾーニングは「部屋を分けるだけ」ではない。境界ごとの認証・記録・監視を含む。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-anti-passback", "org-clear-desk"],
    tags: ["物理的セキュリティ", "施設管理"],
  },
  {
    id: "org-anti-passback",
    ja: "アンチパスバック",
    reading: "あんちぱすばっく",
    en: "Anti-passback",
    shortJa: "入室と退室の記録の整合をとり、不正な再入室などを防ぐ仕組み。",
    shortEn:
      "A control that enforces consistent entry and exit records to prevent improper re-entry.",
    explanationJa:
      "アンチパスバックは、入室記録なしの退室や、退室記録なしの再入室を防ぐ。入退室の順序をシステムで強制し、記録の改ざんやカードの貸借を検知しやすくする。非常時の脱出や機械式ドアとの併用など、運用上の例外を決めておく。",
    explanationEn:
      "Anti-passback enforces entry and exit sequence, preventing exit without entry or re-entry without exit. Emergency egress and mechanical doors require defined exceptions.",
    examUsage:
      "アンチパスバックは共連れ防止とは別である。二人同時入室は自動的には防げない。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-physical-zoning"],
    tags: ["物理的セキュリティ", "入退室管理"],
  },
  {
    id: "org-clear-desk",
    ja: "クリアデスク",
    reading: "くりあですく",
    en: "Clear desk",
    shortJa: "離席時に機密文書や記録媒体を机上に放置せず、施錠保管すること。",
    shortEn:
      "Keeping confidential documents and media secured and off desks when unattended.",
    explanationJa:
      "クリアデスクは、離席時や退社時に、機密文書、記録媒体、鍵、手帳などを机上に放置せず、施錠された保管庫に収める運用である。盗難、紛失、のぞき見、不正な撮影を減らす。点検を日常業務に組み込み、定着を図る。",
    explanationEn:
      "Clear desk means securing confidential documents, media, keys, and notebooks when leaving a desk. It reduces theft, loss, shoulder surfing, and unauthorized photography.",
    examUsage:
      "クリアデスクは「机の整理整頓」ではなく、機密情報の施錠保管を含む。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-clear-screen", "org-physical-zoning"],
    tags: ["物理的セキュリティ", "施設管理"],
  },
  {
    id: "org-clear-screen",
    ja: "クリアスクリーン",
    reading: "くりあすくりーん",
    en: "Clear screen",
    shortJa: "離席時に画面をロックし、のぞき見や不正操作を防ぐこと。",
    shortEn:
      "Locking screens when leaving a workstation to prevent viewing and misuse.",
    explanationJa:
      "クリアスクリーンは、離席時に端末の画面をロックし、第三者が画面を見たり操作したりできないようにする。短いタイムアウトでの自動ロック、プライバシーフィルム、画面の向きの調整を組み合わせる。共有端末では、利用終了時のログアウトも徹底する。",
    explanationEn:
      "Clear screen means locking workstations when unattended, supported by short automatic lock timeouts, privacy filters, and careful screen placement.",
    examUsage:
      "クリアデスク（机上）とクリアスクリーン（画面）を区別して問う問題に注意する。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-clear-desk"],
    tags: ["物理的セキュリティ", "端末管理"],
  },
  {
    id: "org-ups",
    ja: "無停電電源装置",
    reading: "むていでんでんげんそうち",
    en: "Uninterruptible power supply",
    abbr: "UPS",
    shortJa: "停電や瞬断の際に、一定時間電力を供給する装置。",
    shortEn:
      "A device that supplies power for a period during outages or voltage fluctuations.",
    explanationJa:
      "UPSは、商用電源の停電や瞬断の際に、バッテリから電力を供給し、機器の停止やデータ破損を防ぐ。稼働時間には限りがあるため、非常用発電機や安全な停止手順と組み合わせる。バッテリは劣化するので、定期的な放電試験と交換計画が必要である。",
    explanationEn:
      "A UPS supplies battery power during outages or sags, preventing shutdowns and data corruption. Runtime is limited, so it is combined with generators and orderly shutdown. Batteries require testing and replacement.",
    examUsage:
      "UPSは「長時間の停電を支える設備」ではなく、発電機までのつなぎである。定期試験も問われる。",
    lessonIds: ["org/audit-physical"],
    relatedTermIds: ["org-physical-zoning"],
    tags: ["物理的セキュリティ", "可用性"],
  },
];
