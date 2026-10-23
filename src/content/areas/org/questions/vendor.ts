import type { Question } from "@/lib/content/types";

export const vendorQuestions: Question[] = [
  {
    id: "q-org-vendor-001",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "easy",
    type: "knowledge",
    stem: "外部委託における委託元の責任として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "委託契約を締結すれば、委託先の事故に関する責任はすべて委託先に移る。" },
      { id: "i", text: "委託先の選定、契約条件の設定、履行状況の監督の責任が残る。" },
      { id: "u", text: "委託先の従業者に対する指揮命令権を常に行使し、人事評価を行う。" },
      { id: "e", text: "委託先のセキュリティ対策は委託先の自主性に委ね、委託元は確認しない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "外部委託では業務は移るが、選定・契約・監督の責任は委託元に残る。",
      why: [
        "委託先で漏えいが起きた場合、委託元は顧客への説明と再発防止を求められる。",
        "個人情報を委託する場合は、委託先に対する必要かつ適切な監督も求められる。",
      ],
      optionNotes: {
        a: "契約によって委託元の監督責任や説明責任がなくなるわけではない。",
        i: "正解である。選定・契約・監督の三段階で責任が残る。",
        u: "委託先の従業者への指揮命令は、原則として委託先が行う。委託元が直接人事評価することは適切でない。",
        e: "委託先の対策を確認しないことは、監督義務を怠る行為である。",
      },
      english:
        "Outsourcing transfers work, not accountability; selection, contracting, and oversight remain with the client.",
      termIds: ["org-outsourcing", "org-vendor-monitoring"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["外部委託", "責任"],
  },
  {
    id: "q-org-vendor-002",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "knowledge",
    stem: "委託先の選定でISMS認証を確認する際の留意点として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "認証を取得していれば、委託業務の品質も保証される。" },
      { id: "i", text: "認証のスコープに委託する業務が含まれるか、最新の審査結果を確認する。" },
      { id: "u", text: "認証の有無だけを比較し、実際の運用は確認しない。" },
      { id: "e", text: "認証取得社の中から、価格が最も低い社を無条件に選ぶ。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "認証はマネジメントシステムの適合性を示すもので、対象範囲と最新の状態を確認する必要がある。",
      why: [
        "認証のスコープが委託業務を含まなければ、その業務の管理水準は保証されない。",
        "認証後も運用が変化するため、サーベイランス結果や指摘事項を確認する。",
      ],
      optionNotes: {
        a: "認証は個々の業務品質や技術的対策を保証するものではない。",
        i: "正解である。スコープと最新の審査結果を確認する。",
        u: "書類上の認証だけでなく、実際の運用と記録を確認する必要がある。",
        e: "価格だけで選定すると、セキュリティ要件を満たさない委託先を選ぶ可能性がある。",
      },
      english:
        "Certification is not a guarantee of service quality; verify the scope and current surveillance results.",
      termIds: ["org-vendor-due-diligence"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["委託先選定", "ISMS"],
  },
  {
    id: "q-org-vendor-003",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "knowledge",
    stem: "外部委託契約に盛り込む内容として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "再委託は委託先の裁量に任せ、委託元には通知しない。" },
      { id: "i", text: "再委託の事前承認、事故報告の期限、監査権、データの返還・消去を定める。" },
      { id: "u", text: "事故報告は契約に定めず、発生後の協議に委ねる。" },
      { id: "e", text: "契約終了時のデータ消去は、委託先の判断に任せる。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "再委託、事故報告、監査、返還・消去は、委託先の管理に必要な契約上の要求事項である。",
      why: [
        "事前承認と報告期限がないと、委託元は被害の拡大を把握できない。",
        "監査権と返還・消去の定めは、契約終了後も含めた情報管理を支える。",
      ],
      optionNotes: {
        a: "再委託を委託先の裁量に任せると、委託元の管理が届かない範囲が生じる。",
        i: "正解である。要求事項を契約に明記する。",
        u: "報告期限を定めないと、初動が遅れ、被害が拡大する。",
        e: "データ消去を委託先の判断に任せると、残留データのリスクを管理できない。",
      },
      english:
        "Contracts should specify subcontracting approval, incident reporting deadlines, audit rights, and data return or deletion.",
      termIds: ["org-subcontracting", "org-right-to-audit", "org-data-return-deletion"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["契約", "再委託"],
  },
  {
    id: "q-org-vendor-004",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "knowledge",
    stem: "クラウドの責任共有モデルについて、最も適切なものはどれか。",
    options: [
      { id: "a", text: "IaaSでは、利用者はデータとID管理の責任を負わない。" },
      { id: "i", text: "サービス形態にかかわらず、利用者管理、設定、データの責任は利用者側に残る。" },
      { id: "u", text: "SaaSでは、利用者がOSのパッチ適用を行う。" },
      { id: "e", text: "クラウド事業者がすべてのセキュリティ責任を負う。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "責任共有モデルでは、利用者管理、設定、データの責任は利用者側に残る。",
      why: [
        "IaaS、PaaS、SaaSの順に、利用者が担う範囲は広がる。",
        "設定ミスやID管理の不備は、事業者ではなく利用者の責任となる。",
      ],
      optionNotes: {
        a: "IaaSでも、利用者はOS以上の設定、データ、ID管理の責任を負う。",
        i: "正解である。利用者側の責任はサービス形態に応じて広がる。",
        u: "SaaSではOSの管理は事業者側であり、利用者がパッチ適用を行うわけではない。",
        e: "クラウド事業者が施設や基盤を守っても、利用者側の責任は残る。",
      },
      english:
        "Under the shared responsibility model, customer responsibilities for identity, configuration, and data persist across service models.",
      termIds: ["org-cloud-shared-responsibility"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["クラウド", "責任分界"],
  },
  {
    id: "q-org-vendor-005",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "knowledge",
    stem: "委託先の監督として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "契約締結時の一度の審査で完了する。" },
      { id: "i", text: "定期報告、訪問、監査、是正計画の進捗確認を継続的に行う。" },
      { id: "u", text: "委託先の自己申告のみに依存し、記録を残さない。" },
      { id: "e", text: "委託先の再委託先は監督の対象外とする。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "監督は契約後の履行状況を継続的に確認する活動であり、複数の方法を組み合わせる。",
      why: [
        "委託先の体制やリスクは時間とともに変化するため、一度の審査では足りない。",
        "再委託先を含めて確認しないと、情報の流れの全体を把握できない。",
      ],
      optionNotes: {
        a: "契約時の審査は選定の一部であり、その後の監督を代替しない。",
        i: "正解である。定期報告・訪問・監査・是正確認を継続する。",
        u: "自己申告だけでは証拠として弱く、監督の記録も残らない。",
        e: "再委託先も情報を扱うため、監督の対象に含める必要がある。",
      },
      english:
        "Oversight is continuous and combines reporting, visits, audits, and remediation tracking, including subcontractors.",
      termIds: ["org-vendor-monitoring", "org-subcontracting"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["委託先監督", "モニタリング"],
  },
  {
    id: "q-org-vendor-006",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "knowledge",
    stem: "サプライチェーン攻撃への対策として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "自社の境界防御を強化すれば、取引先経由の侵入も防げる。" },
      { id: "i", text: "調達要件にSBOMや脆弱性対応を盛り込み、供給経路の署名検証と分離を行う。" },
      { id: "u", text: "取引先のセキュリティ対策は取引先の問題として関与しない。" },
      { id: "e", text: "ソフトウェアの更新を停止し、旧版を使い続ける。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "サプライチェーン全体の可視化と、調達・検証・分離の対策を組み合わせる必要がある。",
      why: [
        "攻撃者は委託先や更新経路など、自社の境界の外側から侵入する。",
        "SBOMは脆弱性の影響範囲を特定し、署名検証は改ざんされた配布物を排除する。",
      ],
      optionNotes: {
        a: "境界防御だけでは、正規の取引先や更新経路を経由する攻撃を防げない。",
        i: "正解である。調達要件、SBOM、署名検証、分離を組み合わせる。",
        u: "取引先の対策に関与しないと、自社のリスクは低減できない。",
        e: "更新を停止すると、既知の脆弱性が残り、かえってリスクが高まる。",
      },
      english:
        "Supply chain defense requires procurement requirements, SBOM, signature verification, and segmentation across suppliers.",
      termIds: ["org-supply-chain-attack", "org-sbom"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["サプライチェーン", "調達"],
  },
  {
    id: "q-org-vendor-007",
    part: "A",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "knowledge",
    stem: "委託先でインシデントが発生した際の委託元の対応として、最も適切なものはどれか。",
    options: [
      { id: "a", text: "委託先の責任であるため、委託元は顧客への説明を行わない。" },
      { id: "i", text: "契約に基づく初報を受け、被害範囲を確認し、自社のインシデントとして対応する。" },
      { id: "u", text: "原因究明が完了するまで、社内への報告を控える。" },
      { id: "e", text: "委託先との契約を直ちに解除し、原因究明を打ち切る。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "委託先のインシデントも委託元のインシデントとして扱い、被害範囲の確認と説明責任を果たす。",
      why: [
        "委託元は顧客や取引先に対する説明責任を負い、被害の全体像を把握する必要がある。",
        "初報を契機に封じ込めと原因究明を進め、再発防止までを委託先と共同で行う。",
      ],
      optionNotes: {
        a: "原因が委託先にあっても、委託元の説明責任はなくならない。",
        i: "正解である。初報を受け、自社のインシデントとして対応する。",
        u: "原因究明の完了を待つと、初動と公表が遅れ、被害と信頼の損失が拡大する。",
        e: "契約解除だけでは被害の封じ込めや原因究明にならない。",
      },
      english:
        "A vendor incident is the client's incident too: receive the initial report, scope the impact, and communicate.",
      termIds: ["org-incident-reporting", "org-outsourcing"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["インシデント報告", "外部委託"],
  },
  {
    id: "q-org-vendor-008",
    part: "B",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "scenario",
    stem: "D社は、顧客データの処理を外部に委託する。候補社は価格が最も低いが、ISMS認証を取得しておらず、再委託先の一覧も開示できない。委託先選定の対応として最も適切なものはどれか。",
    options: [
      { id: "a", text: "価格が最も低いため、そのまま契約する。" },
      { id: "i", text: "委託する情報の重要度を踏まえ、再委託先の開示と管理策の確認を求め、満たさなければ他社を検討する。" },
      { id: "u", text: "認証がないことだけを理由に、交渉せず候補から除外する。" },
      { id: "e", text: "委託先に一任し、委託元は選定に関与しない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "情報の重要度に応じて必要な管理策を求め、再委託先の可視性を確認する。",
      why: [
        "再委託先の一覧を開示できないことは、情報の流れを把握できないことを意味する。",
        "認証の有無だけでなく、実際の管理策と是正の意思を確認して判断する。",
      ],
      optionNotes: {
        a: "価格だけで選定すると、情報漏えい時の損害と監督コストを見落とす。",
        i: "正解である。重要度に応じた要求と再委託先の確認を行う。",
        u: "認証の有無だけでの一律除外は、代替となる管理策を評価しない点で不十分である。",
        e: "委託元が選定に関与しないことは、委託元の責任を果たさない。",
      },
      english:
        "Match assurance to data sensitivity; require subcontractor transparency and evaluate alternative controls, not just certification.",
      termIds: ["org-vendor-due-diligence", "org-subcontracting"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["委託先選定", "科目B"],
  },
  {
    id: "q-org-vendor-009",
    part: "B",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "medium",
    type: "scenario",
    stem: "E社はIaaSを利用して顧客データを保管している。担当者がストレージの公開設定を変更したままにしていたため、第三者がデータを閲覧できる状態になっていた。責任分界に関する記述として最も適切なものはどれか。",
    options: [
      { id: "a", text: "クラウド事業者の基盤障害が原因であり、E社に責任はない。" },
      { id: "i", text: "利用者側の設定管理の不備であり、E社が責任を負う。" },
      { id: "u", text: "IaaSではデータの管理は事業者の責任である。" },
      { id: "e", text: "責任分界は契約で決められず、常に利用者が全責任を負う。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "ストレージの公開設定は利用者側の設定管理に属し、E社が責任を負う。",
      why: [
        "責任共有モデルでは、施設や基盤は事業者、設定・データ・ID管理は利用者が担う。",
        "設定変更の承認と監視を運用に組み込むことが、再発防止になる。",
      ],
      optionNotes: {
        a: "基盤障害ではなく設定ミスであるため、事業者の責任に転嫁できない。",
        i: "正解である。利用者側の設定管理の不備である。",
        u: "IaaSでも、データと設定の管理は利用者の責任である。",
        e: "責任分界は契約とサービス形態に応じて定まる。常に利用者が全責任を負うわけではない。",
      },
      english:
        "A public storage setting is a customer-side configuration error; the customer bears responsibility under the shared responsibility model.",
      termIds: ["org-cloud-shared-responsibility"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["クラウド", "設定管理", "科目B"],
  },
  {
    id: "q-org-vendor-010",
    part: "B",
    topicIds: ["org-vendor"],
    lessonIds: ["org/vendor"],
    difficulty: "hard",
    type: "scenario",
    stem: "F社は業務をG社に委託している。G社はF社の承認を得ずに業務の一部をH社に再委託し、H社で顧客情報の漏えいが発生した。F社の対応として最も適切なものはどれか。",
    options: [
      { id: "a", text: "G社の責任であるため、F社は何もしなくてよい。" },
      { id: "i", text: "契約上の再委託の承認違反を確認し、被害範囲の調査、監督責任の説明、再発防止をG社と進める。" },
      { id: "u", text: "直ちにH社を告訴し、G社との契約はそのまま継続する。" },
      { id: "e", text: "再委託は委託先の自由であるため、F社に説明責任はない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "再委託の承認違反と被害範囲を確認し、委託元としての監督責任と説明責任を果たす。",
      why: [
        "委託元は再委託先を含む情報の流れを把握し、監督する責任を負う。",
        "契約違反の確認と再発防止を並行して進め、必要に応じて契約の見直しや委託先の変更を判断する。",
      ],
      optionNotes: {
        a: "G社の違反があっても、F社の監督責任と顧客への説明責任は残る。",
        i: "正解である。違反確認、被害調査、説明、再発防止を進める。",
        u: "告訴の可否だけで判断せず、被害の封じ込めと契約関係の見直しが必要である。",
        e: "再委託は委託元の承認を要する場合が多く、自由ではない。",
      },
      english:
        "The client must investigate the unauthorized subcontracting, scope the breach, explain its oversight, and drive remediation.",
      termIds: ["org-subcontracting", "org-incident-reporting", "org-vendor-monitoring"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["再委託", "インシデント", "科目B"],
  },
];
