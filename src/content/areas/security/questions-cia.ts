import type { Question } from "@/lib/content/types";

export const ciaQuestions: Question[] = [
  {
    id: "q-security-cia-001",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "easy",
    type: "knowledge",
    stem: "Webサーバ上の商品価格データが、攻撃者によって不正に書き換えられた。このとき主として損なわれた情報セキュリティの特性はどれか。",
    options: [
      { id: "a", text: "可用性" },
      { id: "i", text: "完全性" },
      { id: "u", text: "機密性" },
      { id: "e", text: "責任追跡性" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は完全性である。データが正確で、許可なく変更されていない性質が完全性であり、価格の書き換えはその侵害に当たる。",
      why: [
        "改ざんは、情報の正確さと完全さを損なう行為である。",
        "機密性は情報の開示、可用性は利用可能性に関する特性であり、改ざんそのものを表すものではない。",
      ],
      optionNotes: {
        a: "可用性は、必要なときに情報やサービスを利用できる性質である。書き換え後も閲覧できる場合、可用性の侵害とは限らない。",
        i: "正解である。価格データの不正な変更は完全性の侵害である。",
        u: "機密性は、許可されていない者に情報が開示されることで損なわれる。今回は開示の事実が示されていない。",
        e: "責任追跡性は、誰が操作したかを後から追跡できる性質であり、データの正確さを直接表すものではない。",
      },
      english:
        "Unauthorized modification of price data violates integrity. Confidentiality concerns disclosure, availability concerns access, and accountability concerns traceability.",
      termIds: ["sec-cia-integrity"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["CIA", "完全性"],
  },
  {
    id: "q-security-cia-002",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "easy",
    type: "knowledge",
    stem: "ランサムウェアによってファイルサーバ上のデータが暗号化され、業務システムが2日間利用できなくなった。情報の外部送信は確認されていない。このとき主として損なわれた特性はどれか。",
    options: [
      { id: "a", text: "機密性" },
      { id: "i", text: "完全性" },
      { id: "u", text: "可用性" },
      { id: "e", text: "真正性" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "正解は可用性である。暗号化によってデータを業務に利用できなくなり、サービスが停止したことが中心的影響である。",
      why: [
        "ランサムウェアはファイルを使用不能にすることで、業務の継続を妨げる。",
        "外部送信が確認されていないため、機密性の侵害は主要な影響として認定できない。",
      ],
      optionNotes: {
        a: "情報の外部送信や漏えいが確認されていないため、機密性の侵害は中心ではない。",
        i: "暗号化はファイルの内容を変化させるが、SGではランサムウェアによる業務停止を可用性の侵害として整理する。改ざんの意図や内容の正確性が主眼ではない。",
        u: "正解である。データが利用できず業務が停止したため、可用性が損なわれている。",
        e: "真正性は、利用者やデータが主張どおり本物であることを指す。今回はなりすましが主題ではない。",
      },
      english:
        "Ransomware primarily harms availability by making data unusable. Without confirmed exfiltration, confidentiality is not the main impact.",
      termIds: ["sec-cia-availability", "sec-ransomware"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["CIA", "ランサムウェア", "可用性"],
  },
  {
    id: "q-security-cia-003",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "medium",
    type: "knowledge",
    stem: "監査ログに利用者ID、日時、操作内容を記録し、後から「誰がいつ顧客情報を閲覧したか」を特定できるようにした。この管理策が主として高める特性はどれか。",
    options: [
      { id: "a", text: "真正性" },
      { id: "i", text: "責任追跡性" },
      { id: "u", text: "否認防止" },
      { id: "e", text: "信頼性" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は責任追跡性である。一意の利用者IDと操作記録により、行為者と行為を後から追跡できる。",
      why: [
        "責任追跡性は、誰がいつ何を行ったかを後から特定できる性質である。",
        "否認防止は、行為者が後から行為を否認できないことまで保証する。ログだけでは、行為者自身による改ざんや否認を防げない場合がある。",
      ],
      optionNotes: {
        a: "真正性は、利用者や送信元が本物であることを確認する性質である。ログは事後の追跡には役立つが、認証そのものではない。",
        i: "正解である。監査ログによる操作者の特定は責任追跡性を高める。",
        u: "否認防止には、デジタル署名やタイムスタンプなど、行為者が否認できない仕組みが必要である。単なるログでは不十分な場合がある。",
        e: "信頼性は、正確で安定した動作を指す。操作者の追跡とは異なる。",
      },
      english:
        "Audit logs with unique IDs and timestamps provide accountability by enabling actions to be traced to a user. They do not by themselves provide non-repudiation.",
      termIds: ["sec-accountability", "sec-non-repudiation"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["CIA拡張", "監査"],
  },
  {
    id: "q-security-cia-004",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "medium",
    type: "knowledge",
    stem: "電子契約サービスにおいて、契約者が後から「署名していない」と否認できないようにしたい。最も適切な組合せはどれか。",
    options: [
      { id: "a", text: "共通鍵で生成したMACと、契約書のハッシュ値の保存" },
      { id: "i", text: "契約書のハッシュ値だけをデータベースに保存する" },
      { id: "u", text: "契約者の秘密鍵によるデジタル署名と、信頼できるタイムスタンプ" },
      { id: "e", text: "契約者のパスワードによるログイン記録だけを保存する" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "正解は、秘密鍵によるデジタル署名とタイムスタンプの組合せである。署名は契約者だけが生成でき、公開鍵で検証できるため否認防止に資する。",
      why: [
        "デジタル署名は、完全性・真正性に加えて否認防止を提供する。",
        "タイムスタンプは、署名がいつ存在したかを第三者が証明する助けになる。",
      ],
      optionNotes: {
        a: "MACは共通鍵方式であり、受信者も同じMACを生成できるため、否認防止にはならない。",
        i: "ハッシュ値だけでは、契約者との結び付きを証明できず、否認防止にならない。",
        u: "正解である。秘密鍵による署名とタイムスタンプが否認防止を支える。",
        e: "ログイン記録は操作の手がかりになるが、契約内容への署名を証明するものではない。",
      },
      english:
        "A digital signature made with the signer's private key, combined with a trusted timestamp, supports non-repudiation. A MAC uses a shared key and cannot provide it.",
      termIds: ["sec-non-repudiation", "sec-digital-signature"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["否認防止", "デジタル署名"],
  },
  {
    id: "q-security-cia-005",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "medium",
    type: "knowledge",
    stem: "多層防御の考え方として最も適切なものはどれか。",
    options: [
      { id: "a", text: "境界、ネットワーク、端末、アプリケーションなど異なる層に、性質の異なる対策を重ねる" },
      { id: "i", text: "同じ機能のファイアウォールを2台並べて冗長化する" },
      { id: "u", text: "外部からの通信をすべて遮断し、内部の対策を省略する" },
      { id: "e", text: "すべての端末に同じ種類のウイルス対策ソフトを導入する" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、異なる層に性質の異なる対策を重ねることである。一つの対策が破られても、次の層で検知・阻止・被害局限できる。",
      why: [
        "多層防御の目的は、単一の対策の失敗が全体の失敗にならないようにすることである。",
        "層ごとに守る対象と攻撃の段階が異なるため、異なる種類の対策を組み合わせる。",
      ],
      optionNotes: {
        a: "正解である。層の違いを生かして対策を重ねる。",
        i: "同じ機能の装置を2台並べるのは冗長化であり、多層防御とは目的が異なる。",
        u: "外部を遮断しても、内部不正やマルウェア感染、設定不備には対応できない。",
        e: "同じ種類の対策だけでは、その対策を回避する攻撃に対して弱い。",
      },
      english:
        "Defense in depth layers different types of controls across boundaries, networks, endpoints, and applications. Duplicating the same device is redundancy, not defense in depth.",
      termIds: ["sec-defense-in-depth"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["多層防御", "設計"],
  },
  {
    id: "q-security-cia-006",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "hard",
    type: "knowledge",
    stem: "ゼロトラストの考え方として最も適切なものはどれか。",
    options: [
      { id: "a", text: "社内ネットワークからのアクセスは、無条件に信頼する" },
      { id: "i", text: "アクセスごとに利用者・端末・文脈を検証し、最小権限を適用する" },
      { id: "u", text: "単一のゼロトラスト製品を導入すれば、設計は完成する" },
      { id: "e", text: "VPNを廃止することだけを指す" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、アクセスごとの検証と最小権限の適用である。ネットワークの位置ではなく、利用者・端末・リクエストの状態を評価する。",
      why: [
        "ゼロトラストは、境界の内側も侵害されうるという前提に立つ。",
        "NIST SP 800-207は、明示的な検証、最小権限、侵害前提を原則として挙げている。",
      ],
      optionNotes: {
        a: "社内ネットワークを無条件に信頼するのは、従来の境界防御の発想であり、ゼロトラストではない。",
        i: "正解である。アクセスごとの検証と最小権限が中心にある。",
        u: "ゼロトラストは製品ではなく、ID管理、端末管理、ログ、ネットワーク制御を組み合わせた設計思想である。",
        e: "VPNの廃止は目的ではなく、VPNを残す構成もありうる。アクセス制御の考え方が本質である。",
      },
      english:
        "Zero trust verifies every access request and applies least privilege rather than trusting network location. It is an architecture, not a single product or the mere removal of VPNs.",
      termIds: ["sec-zero-trust"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["ゼロトラスト", "設計"],
  },
  {
    id: "q-security-cia-007",
    part: "A",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "hard",
    type: "knowledge",
    stem: "プライバシーバイデザインの取組みとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "取得する個人情報を必要最小限にし、初期設定では非公開とし、保存期間と削除方法を設計する" },
      { id: "i", text: "将来利用する可能性がある個人情報を、目的を定めずにすべて取得する" },
      { id: "u", text: "個人情報の保護は、リリース後の追加機能で対応する" },
      { id: "e", text: "個人情報を部門ごとの表計算ソフトで自由に共有できるようにする" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、データ最小化、既定の非公開、保存期間と削除の設計である。これらは個人情報の保護を設計段階から組み込む取組みである。",
      why: [
        "プライバシーバイデザインは、取得・利用・保管・廃棄の各段階で保護を組み込む。",
        "必要以上の個人情報を取得せず、既定で保護される設計にすることで、漏えい時の影響を減らす。",
      ],
      optionNotes: {
        a: "正解である。データ最小化と保存期間の設計は代表的な原則である。",
        i: "目的を定めずにすべて取得することは、データ最小化と目的制限に反する。",
        u: "リリース後の追加対応は後付けであり、プライバシーバイデザインの考え方に反する。",
        e: "管理されていない共有は、漏えいや目的外利用のリスクを高める。",
      },
      english:
        "Privacy by design includes data minimization, privacy by default, and designing retention and deletion. Collecting everything for unspecified future use is the opposite.",
      termIds: ["sec-privacy-by-design", "sec-security-by-design"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["プライバシー", "設計"],
  },
  {
    id: "q-security-cia-008",
    part: "B",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社は、境界ファイアウォールと端末のEDRを導入していたが、VPN装置のパッチを長期間適用していなかった。攻撃者はVPN装置の既知の脆弱性を突いて社内に侵入し、顧客データベースから情報を窃取した。多層防御の観点で、A社に不足していた対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "境界ファイアウォールの台数を増やす" },
      { id: "i", text: "VPN装置の脆弱性管理と、内部ネットワークのセグメント分割" },
      { id: "u", text: "すべての端末に同じウイルス対策ソフトを追加導入する" },
      { id: "e", text: "バックアップの暗号化を強化する" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、VPN装置の脆弱性管理とセグメント分割である。入口の既知脆弱性を塞ぎ、侵入後の横展開を制限する組合せが必要である。",
      why: [
        "パッチ未適用は典型的な脆弱性であり、入口の対策として優先度が高い。",
        "セグメント分割は、侵入されても到達できる範囲を狭め、被害を局限する。",
      ],
      optionNotes: {
        a: "同じ層の装置を増やしても、VPN装置の脆弱性という入口の問題は解消しない。",
        i: "正解である。入口の脆弱性管理と、被害局限のための分割が不足している。",
        u: "端末対策は重要だが、VPN装置の脆弱性を突いた侵入には直接効かない。",
        e: "バックアップの暗号化は機密性に資するが、侵入経路の遮断や横展開の防止にはならない。",
      },
      english:
        "The missing controls are vulnerability management for the VPN appliance and network segmentation. Patching closes the entry point; segmentation limits lateral movement.",
      termIds: ["sec-defense-in-depth", "sec-vulnerability"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["多層防御", "科目B", "脆弱性管理"],
  },
  {
    id: "q-security-cia-009",
    part: "B",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "medium",
    type: "scenario",
    stem: "B社ではテレワークが定着し、従業員が自宅や外出先から顧客管理システムを利用している。役員から「社内ネットワークの内側は安全という前提を見直したい」との指示があった。ゼロトラストの考え方に沿った取組みとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "VPNに接続した利用者には、すべての社内システムへのアクセスを許可する" },
      { id: "i", text: "アクセスごとに利用者・端末の状態・要求内容を検証し、業務に必要な権限だけを与える" },
      { id: "u", text: "社内LANから接続する場合だけ利用を許可し、テレワークを禁止する" },
      { id: "e", text: "パスワードの桁数を増やすだけで、端末の状態確認は行わない" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、アクセスごとの検証と最小権限である。場所ではなく、利用者・端末・要求の文脈を評価する。",
      why: [
        "テレワークやクラウドでは、社内ネットワークの内側という境界が意味を持ちにくい。",
        "端末がマルウェアに感染している場合でも、アクセスごとの検証と権限制限で被害を抑えられる。",
      ],
      optionNotes: {
        a: "VPN接続後に全システムへ自由にアクセスさせるのは、境界防御の発想であり、侵害後の横展開を許す。",
        i: "正解である。明示的な検証と最小権限がゼロトラストの中心である。",
        u: "テレワークを禁止しても、社内端末の感染や内部不正のリスクは残る。",
        e: "パスワード強化だけでは、端末の状態やアクセス先の妥当性を確認できない。",
      },
      english:
        "Zero trust evaluates each access request based on user, device, and context, granting only the necessary privileges, rather than trusting users once they are on the VPN.",
      termIds: ["sec-zero-trust", "sec-authenticity"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["ゼロトラスト", "科目B", "テレワーク"],
  },
  {
    id: "q-security-cia-010",
    part: "B",
    topicIds: ["sec-cia"],
    lessonIds: ["security/cia-and-design"],
    difficulty: "hard",
    type: "scenario",
    stem: "C社は、会員向けに生年月日・住所・購買履歴を収集する新サービスを設計している。個人情報保護の責任者として、プライバシーバイデザインの観点から最初に行うべきことはどれか。",
    options: [
      { id: "a", text: "将来の施策に使えるよう、取得可能な個人情報をすべて取得する仕様にする" },
      { id: "i", text: "会員プロフィールを初期設定で公開し、利用者同士の交流を促す" },
      { id: "u", text: "利用目的を明確にし、必要最小限の項目だけを取得したうえで、保存期間と削除方法を設計する" },
      { id: "e", text: "個人情報を部門ごとの表計算ソフトで共有し、分析を自由に行えるようにする" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "正解は、利用目的の明確化、データ最小化、保存期間と削除方法の設計である。設計段階で保護を組み込むことがプライバシーバイデザインの出発点になる。",
      why: [
        "目的を明確にし、必要最小限の取得にすることで、目的外利用と漏えい時の影響を抑えられる。",
        "保存期間と削除方法を設計しておくことで、不要になった個人情報を確実に廃棄できる。",
      ],
      optionNotes: {
        a: "目的を定めずにすべて取得するのは、データ最小化と目的制限に反する。",
        i: "初期設定で公開する設計は、プライバシーバイデザインの「既定の保護」に反する。",
        u: "正解である。目的の明確化、最小化、保存期間の設計が適切である。",
        e: "管理されていない表計算ソフトでの共有は、漏えいと目的外利用のリスクを高める。",
      },
      english:
        "Privacy by design starts with purpose limitation, data minimization, and designing retention and deletion before launch, not with collecting everything or defaulting to public profiles.",
      termIds: ["sec-privacy-by-design"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["プライバシー", "科目B", "設計"],
  },
];
