import type { GlossaryTerm } from "@/lib/content/types";

export const securityTerms: GlossaryTerm[] = [
  {
    id: "sec-cia-confidentiality",
    ja: "機密性",
    reading: "きみつせい",
    en: "Confidentiality",
    shortJa: "許可された人だけが情報を利用できる性質。",
    shortEn: "The property that information is not disclosed to unauthorized parties.",
    explanationJa:
      "機密性は、情報へのアクセスを許可された主体だけに限定する性質である。暗号化、アクセス制御、権限管理、DLPなどで確保する。可用性とのトレードオフが問われることがあり、暗号化によって正規利用者まで締め出す設計は機密性を高めても可用性を損なう。",
    explanationEn:
      "Confidentiality limits information access to authorized subjects. It is achieved through encryption, access control, privilege management, and data loss prevention.",
    examUsage:
      "「漏えい」「盗聴」「のぞき見」は機密性、「改ざん」は完全性、「停止」「使えない」は可用性と、動詞で判別する。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-cia-integrity", "sec-cia-availability"],
    tags: ["CIA", "基礎"],
  },
  {
    id: "sec-cia-integrity",
    ja: "完全性",
    reading: "かんぜんせい",
    en: "Integrity",
    shortJa: "情報が正確で、不正に変更されていない性質。",
    shortEn: "The property of being accurate and complete and free from unauthorized modification.",
    explanationJa:
      "完全性は、情報が正確かつ完全であり、不正な変更や削除がされていないことを保証する性質である。ハッシュ、デジタル署名、入力検証、アクセス制御、ログで確保する。可用性の議論でいう「完全性」とは異なり、情報セキュリティではデータの正確さを指す。",
    explanationEn:
      "Integrity ensures that information is accurate, complete, and has not been modified or deleted without authorization, using hashes, digital signatures, input validation, and logs.",
    examUsage:
      "「改ざん検知」「データの正確性」「署名検証」と結び付ける。可用性の文脈の「完全性（途切れないこと）」と混同しない。",
    lessonIds: ["security/cia-and-design", "security/crypto-auth"],
    relatedTermIds: ["sec-hash", "sec-digital-signature", "sec-cia-confidentiality"],
    tags: ["CIA", "基礎"],
  },
  {
    id: "sec-cia-availability",
    ja: "可用性",
    reading: "かようせい",
    en: "Availability",
    shortJa: "必要なときに、必要な性能で情報やシステムを利用できる性質。",
    shortEn: "The property of being accessible and usable on demand by authorized users.",
    explanationJa:
      "可用性は、許可された利用者が必要なときに情報やサービスを利用できる性質である。冗長化、バックアップ、UPS、監視、DDoS対策で確保する。「動いている」だけでなく「実用的な速度で使える」ことも含み、性能劣化や容量不足も可用性の問題になる。",
    explanationEn:
      "Availability ensures authorized users can access information and services when needed, including adequate performance. It is supported by redundancy, backups, UPS, monitoring, and DDoS mitigation.",
    examUsage:
      "「サービス停止」「応答が極端に遅い」「復旧に時間がかかる」は可用性。ランサムウェアによる暗号化も可用性の侵害として出題される。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-cia-confidentiality", "sec-cia-integrity"],
    tags: ["CIA", "基礎"],
  },
  {
    id: "sec-authenticity",
    ja: "真正性",
    reading: "しんせいせい",
    en: "Authenticity",
    shortJa: "情報や利用者が、主張どおりの本人・本物である性質。",
    shortEn: "The property that an entity or data is genuine and is what it claims to be.",
    explanationJa:
      "真正性は、利用者、送信元、データが主張どおりのものであることを保証する性質である。パスワードや生体認証による本人確認、デジタル証明書、デジタル署名で確保する。完全性が「内容が変わっていない」ことを扱うのに対し、真正性は「誰の・どの主体のものか」を扱う。",
    explanationEn:
      "Authenticity assures that a user, sender, or datum is genuine. It is supported by authentication, digital certificates, and digital signatures.",
    examUsage:
      "「なりすましを防ぐ」「送信元が本物であることを確認する」は真正性。「改ざんを防ぐ」は完全性として区別する。",
    lessonIds: ["security/cia-and-design", "security/crypto-auth"],
    relatedTermIds: ["sec-non-repudiation", "sec-digital-signature", "sec-pki"],
    tags: ["CIA拡張", "認証"],
  },
  {
    id: "sec-accountability",
    ja: "責任追跡性",
    reading: "せきにんついせきせい",
    en: "Accountability",
    shortJa: "行為者と行為を後から追跡できる性質。",
    shortEn: "The property enabling actions to be traced back to the responsible entity.",
    explanationJa:
      "責任追跡性は、誰がいつ何を行ったかを後から特定できる性質である。利用者IDの一意性、認証、時刻同期、改ざん防止された監査ログ、操作記録で確保する。否認防止が「行為者が後から否認できない」ことを扱うのに対し、責任追跡性は追跡可能性そのものを指す。",
    explanationEn:
      "Accountability enables actions to be traced to a responsible entity through unique IDs, authentication, synchronized time, and tamper-resistant audit logs.",
    examUsage:
      "「監査ログから操作者を特定できる」は責任追跡性。「本人が行ったと証明でき、否認できない」は否認防止として区別する。",
    lessonIds: ["security/cia-and-design", "security/crypto-auth"],
    relatedTermIds: ["sec-non-repudiation", "sec-authenticity"],
    tags: ["CIA拡張", "監査"],
  },
  {
    id: "sec-non-repudiation",
    ja: "否認防止",
    reading: "ひにんぼうし",
    en: "Non-repudiation",
    shortJa: "行為者が後から行為を否認できないようにする性質。",
    shortEn: "The property preventing an entity from denying a performed action.",
    explanationJa:
      "否認防止は、送信や承認などの行為を行った主体が、後から「行っていない」と否認できないようにする性質である。公開鍵暗号を用いたデジタル署名、タイムスタンプ、受領証、改ざん防止されたログで確保する。共通鍵によるMACは、鍵を双方が共有するため否認防止にはならない。",
    explanationEn:
      "Non-repudiation prevents an entity from denying an action. It relies on digital signatures with asymmetric keys, timestamps, receipts, and tamper-evident logs; a shared-key MAC cannot provide it.",
    examUsage:
      "「電子契約で後から署名を否認させない」は否認防止。MACとデジタル署名の違いを問う問題が定番である。",
    lessonIds: ["security/cia-and-design", "security/crypto-auth"],
    relatedTermIds: ["sec-digital-signature", "sec-authenticity", "sec-accountability"],
    tags: ["CIA拡張", "暗号"],
  },
  {
    id: "sec-reliability",
    ja: "信頼性",
    reading: "しんらいせい",
    en: "Reliability",
    shortJa: "期待どおりに正確に動作し続ける性質。",
    shortEn: "The property of consistent, correct, and dependable operation.",
    explanationJa:
      "信頼性は、システムや情報が期待どおりに正確に動作し、利用者の意図した結果を安定して返す性質である。可用性・完全性・性能・保守性が組み合わさって実現される。JIS Q 27000では情報セキュリティの特性の一つとして扱われ、可用性と混同されやすい。",
    explanationEn:
      "Reliability is the property of consistent, correct operation. It combines availability, integrity, performance, and maintainability, and is listed among information security properties in ISO/IEC 27000.",
    examUsage:
      "「誤動作しない」「正確な結果を安定して返す」は信頼性。「止まらず使える」は可用性として区別する。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-cia-availability", "sec-cia-integrity"],
    tags: ["CIA拡張", "品質"],
  },
  {
    id: "sec-defense-in-depth",
    ja: "多層防御",
    reading: "たそうぼうぎょ",
    en: "Defense in Depth",
    shortJa: "異なる層・種類の対策を重ねて侵入と被害を防ぐ考え方。",
    shortEn: "Layering independent controls so that failure of one does not defeat the defense.",
    explanationJa:
      "多層防御は、境界、ネットワーク、端末、アプリケーション、データ、人・運用といった複数の層に、性質の異なる対策を重ねる考え方である。一つの対策が突破されても、次の層で検知・阻止・被害局限できるようにする。同じ機能の装置を二重化する冗長化とは目的が異なる。",
    explanationEn:
      "Defense in depth layers independent controls across perimeter, network, endpoint, application, data, and people. If one layer fails, others detect, block, or limit damage.",
    examUsage:
      "「FWを入れたので端末対策は不要」は誤り。層の違いと、突破後の検知・被害局限まで含めて評価する。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-zero-trust", "sec-security-by-design"],
    tags: ["設計", "対策"],
  },
  {
    id: "sec-zero-trust",
    ja: "ゼロトラスト",
    reading: "ぜろとらすと",
    en: "Zero Trust",
    shortJa: "境界の内側も信頼せず、都度検証する設計思想。",
    shortEn: "A security model that verifies every request instead of trusting network location.",
    explanationJa:
      "ゼロトラストは、「社内ネットワークだから安全」という前提を置かず、利用者・端末・リクエストごとに身元と文脈を検証し、最小権限でアクセスさせる設計思想である。NIST SP 800-207は、明示的な検証、最小権限、侵害前提の3原則を挙げる。単一の製品ではなく、ID管理、端末管理、ネットワーク、ログを組み合わせて実現する。",
    explanationEn:
      "Zero Trust verifies identity and context for every request rather than trusting network location. NIST SP 800-207 describes verify explicitly, least privilege, and assume breach; it is an architecture, not a single product.",
    examUsage:
      "「VPNを廃止すること」と同一視する選択肢は誤り。境界防御の否定ではなく、検証をアクセスごとに行う考え方である。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-defense-in-depth", "sec-authenticity", "sec-mfa"],
    tags: ["設計", "NIST"],
  },
  {
    id: "sec-security-by-design",
    ja: "セキュリティバイデザイン",
    reading: "せきゅりてぃばいでざいん",
    en: "Security by Design",
    shortJa: "企画・設計段階からセキュリティを組み込む考え方。",
    shortEn: "Building security into systems from the earliest design stages.",
    explanationJa:
      "セキュリティバイデザインは、システムの企画、要件定義、設計の段階からセキュリティ要件を組み込み、後付けの対策に頼らない考え方である。脅威モデリング、セキュアコーディング、設計レビュー、受入要件の明確化などで実践する。後工程で見つかった脆弱性の修正は、設計変更や再テストのコストが大きくなる。",
    explanationEn:
      "Security by design incorporates security requirements from planning and design, using threat modeling, secure coding, design reviews, and acceptance criteria rather than bolt-on fixes.",
    examUsage:
      "「リリース直前に脆弱性診断を追加する」は後付け対策。「要件定義でセキュリティ要件を定める」がセキュリティバイデザインである。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-privacy-by-design", "sec-defense-in-depth"],
    tags: ["設計", "開発"],
  },
  {
    id: "sec-privacy-by-design",
    ja: "プライバシーバイデザイン",
    reading: "ぷらいばしーばいでざいん",
    en: "Privacy by Design",
    shortJa: "個人情報の保護を当初から仕組みに埋め込む考え方。",
    shortEn: "Embedding privacy protection into systems and processes from the outset.",
    explanationJa:
      "プライバシーバイデザインは、個人情報の取得・利用・保管・廃棄の各段階で、プライバシー保護を設計に埋め込む考え方である。データ最小化、目的外利用の防止、デフォルトでの保護、透明性、利用者中心の設計などが原則として挙げられる。セキュリティバイデザインが情報全般の保護を扱うのに対し、個人情報の適正な取扱いを中心に据える。",
    explanationEn:
      "Privacy by design embeds privacy protection into systems: data minimization, purpose limitation, privacy by default, transparency, and user-centric design. It focuses on personal data handling.",
    examUsage:
      "「個人情報を集めすぎない」「初期設定で公開しない」はプライバシーバイデザイン。「攻撃に強い設計」はセキュリティバイデザインである。",
    lessonIds: ["security/cia-and-design"],
    relatedTermIds: ["sec-security-by-design", "sec-cia-confidentiality"],
    tags: ["設計", "プライバシー"],
  },
  {
    id: "sec-threat",
    ja: "脅威",
    reading: "きょうい",
    en: "Threat",
    shortJa: "情報資産に損害を与える可能性のある要因。",
    shortEn: "A potential cause of harm to an information asset.",
    explanationJa:
      "脅威は、情報資産の confidentiality・integrity・availability を損なう可能性のある要因である。意図的なもの（攻撃、内部不正）と偶発的なもの（誤操作、故障、災害）に分けられ、人的・技術的・環境的という分類もされる。脅威そのものは排除できないことが多く、脆弱性を減らすことでリスクを下げる。",
    explanationEn:
      "A threat is any potential cause of harm to an asset, whether intentional (attack, insider fraud) or accidental (error, failure, disaster), and may be human, technical, or environmental.",
    examUsage:
      "「泥棒」が脅威、「鍵をかけていない窓」が脆弱性、「盗まれる可能性と損失の大きさ」がリスクである。3語を入れ替えた選択肢に注意する。",
    lessonIds: ["security/cia-and-design", "security/threats-and-malware"],
    relatedTermIds: ["sec-vulnerability", "sec-insider-threat", "sec-malware"],
    tags: ["基礎", "リスク"],
  },
  {
    id: "sec-vulnerability",
    ja: "脆弱性",
    reading: "ぜいじゃくせい",
    en: "Vulnerability",
    shortJa: "脅威によって悪用されうる、資産や仕組みの弱点。",
    shortEn: "A weakness that a threat can exploit to harm an asset.",
    explanationJa:
      "脆弱性は、脅威に悪用される可能性がある弱点である。ソフトウェアのバグ、設定不備、パッチ未適用、弱いパスワード、権限の過剰付与、手順の不在、シャドーITなどが含まれる。脅威は外部要因として与えられることが多いのに対し、脆弱性は組織が管理・低減できる対象である。",
    explanationEn:
      "A vulnerability is a weakness exploitable by a threat: bugs, misconfiguration, missing patches, weak passwords, excessive privileges, missing procedures, or shadow IT. Organizations can manage vulnerabilities.",
    examUsage:
      "「パッチ未適用」「設定ミス」「権限過多」は脆弱性。「攻撃者」「災害」は脅威である。",
    lessonIds: [
      "security/cia-and-design",
      "security/threats-and-malware",
      "security/attacks",
    ],
    relatedTermIds: ["sec-threat", "sec-shadow-it", "sec-cvss"],
    tags: ["基礎", "リスク"],
  },
  {
    id: "sec-fraud-triangle",
    ja: "不正のトライアングル",
    reading: "ふせいのとらいあんぐる",
    en: "Fraud Triangle",
    shortJa: "機会・動機・正当化の3要素が揃うと不正が起きるというモデル。",
    shortEn: "A model in which opportunity, incentive, and rationalization together lead to fraud.",
    explanationJa:
      "不正のトライアングルは、不正行為が、実行可能な機会、金銭や不満などの動機、行為を正当化する心理の3要素が揃ったときに起こりやすくなると説明するモデルである。組織が直接減らしやすいのは機会であり、職務分離、承認、アクセス制御、監視、ログ、教育によって機会を狭める。動機や正当化には、人事施策や相談窓口、倫理教育が関わる。",
    explanationEn:
      "Fraud occurs more easily when opportunity, incentive, and rationalization coincide. Organizations can most directly reduce opportunity through segregation of duties, approvals, access control, monitoring, and education.",
    examUsage:
      "事例で「不満」「借金」「自分は正当化できる」が動機・正当化、「一人で入金と承認をしている」が機会に対応する。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-insider-threat", "sec-situational-crime-prevention"],
    tags: ["不正", "内部統制"],
  },
  {
    id: "sec-situational-crime-prevention",
    ja: "状況的犯罪予防",
    reading: "じょうきょうてきはんざいよぼう",
    en: "Situational Crime Prevention",
    shortJa: "犯罪の機会を環境・手順の設計で減らす考え方。",
    shortEn: "Reducing criminal opportunity by designing environments and procedures.",
    explanationJa:
      "状況的犯罪予防は、犯罪者の性格や動機を変えるのではなく、犯罪を実行しにくい状況を設計することで犯罪を防ぐ考え方である。標的の保護、アクセスの制限、監視、行為の見えやすさ、利益の減少などを組み合わせる。情報セキュリティでは、職務分離、最小権限、入退室管理、操作ログ、承認手続がこれに当たる。",
    explanationEn:
      "Situational crime prevention reduces opportunity rather than changing offenders: hardening targets, restricting access, surveillance, visibility of actions, and removing benefits. In security this maps to segregation of duties, least privilege, and audit logs.",
    examUsage:
      "「不正をしにくい業務プロセスにする」は状況的犯罪予防。「倫理教育で動機を下げる」は環境設計ではなく教育・意識付けである。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-fraud-triangle", "sec-insider-threat"],
    tags: ["不正", "統制"],
  },
  {
    id: "sec-insider-threat",
    ja: "内部不正",
    reading: "ないぶふせい",
    en: "Insider Threat",
    shortJa: "組織の内部者が権限や知識を悪用して行う不正。",
    shortEn: "Fraud or abuse committed by someone inside the organization.",
    explanationJa:
      "内部不正は、従業員、委託先、退職者など組織の内部者が、正規の権限や内部知識を利用して情報を持ち出したり、改ざんしたりする行為である。故意のものだけでなく、過失による漏えいも広く内部者のリスクとして扱う。最小権限、職務分離、退職時の権限削除、持ち出し制限、監査ログ、相談窓口などで機会と動機の両面から対策する。",
    explanationEn:
      "Insider threat is abuse by employees, contractors, or former staff using legitimate access or knowledge. Controls include least privilege, segregation of duties, timely deprovisioning, data loss prevention, audit logs, and reporting channels.",
    examUsage:
      "「外部からの攻撃」と対比されるが、過失による漏えいも含む点に注意する。退職者のアカウント削除は定番の対策である。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-fraud-triangle", "sec-shadow-it", "sec-accountability"],
    tags: ["不正", "人"],
  },
  {
    id: "sec-shadow-it",
    ja: "シャドーIT",
    reading: "しゃどーあいてぃー",
    en: "Shadow IT",
    shortJa: "情報システム部門の承認を得ずに導入・利用されるIT。",
    shortEn: "IT systems and services used without the approval of the IT department.",
    explanationJa:
      "シャドーITは、部門や個人が業務の効率化のために、情報システム部門の承認や管理を経ずに導入するクラウドサービスや機器である。データの所在が把握できず、漏えい、アカウント管理の欠落、バックアップ不在、契約・ライセンス違反などのリスクを生む。禁止一辺倒では利用が隠れるため、可視化、承認しやすいルール、安全な代替サービスの提供、教育を組み合わせる。",
    explanationEn:
      "Shadow IT is technology adopted without IT approval. It creates unknown data locations, weak access control, missing backups, and compliance risks. Visibility, usable approval processes, sanctioned alternatives, and education work better than blanket bans.",
    examUsage:
      "「利用を禁止する」だけでは不十分で、「把握して管理下に置く」方向の選択肢が正解になりやすい。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-vulnerability", "sec-insider-threat"],
    tags: ["クラウド", "統制"],
  },
  {
    id: "sec-malware",
    ja: "マルウェア",
    reading: "まるうぇあ",
    en: "Malware",
    shortJa: "不正な動作を行うソフトウェアの総称。",
    shortEn: "Software designed to cause harm or perform unauthorized actions.",
    explanationJa:
      "マルウェアは、ウイルス、ワーム、トロイの木馬、ボット、ランサムウェア、スパイウェア、ルートキットなど、不正な目的で動作するソフトウェアの総称である。分類は排他的ではなく、一つのマルウェアが複数の性質を持つ。感染経路の遮断、端末保護、検知、バックアップ、教育を組み合わせて対策する。",
    explanationEn:
      "Malware is an umbrella term for viruses, worms, trojans, bots, ransomware, spyware, and rootkits. Categories overlap; a single sample may combine traits. Countermeasures combine prevention, endpoint protection, detection, backups, and awareness.",
    examUsage:
      "「マルウェア＝ウイルス」と狭く捉えない。ワームやトロイの木馬もマルウェアである。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-virus", "sec-worm", "sec-trojan", "sec-ransomware"],
    tags: ["マルウェア", "基礎"],
  },
  {
    id: "sec-virus",
    ja: "ウイルス",
    reading: "ういるす",
    en: "Virus",
    shortJa: "他のファイルに寄生して自己複製し、感染を広げるプログラム。",
    shortEn: "Malicious code that attaches to files and replicates when they are executed.",
    explanationJa:
      "ウイルスは、実行ファイルや文書など他のファイルに寄生し、そのファイルが実行・開封されたときに自己複製して感染を広げるプログラムである。単体では自己伝播せず、宿主の実行が必要である点がワームとの違いである。定義ファイルによる検知が有効だが、亜種やファイルレス化への対策として振る舞い検知も併用する。",
    explanationEn:
      "A virus attaches to a host file and replicates when that file is executed. Unlike a worm, it does not self-propagate independently. Signature detection is effective but is complemented by behavior-based detection.",
    examUsage:
      "「宿主ファイルが必要」「開封・実行で感染」はウイルス。「ネットワーク経由で自律的に増殖」はワームである。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-worm", "sec-malware"],
    tags: ["マルウェア", "分類"],
  },
  {
    id: "sec-worm",
    ja: "ワーム",
    reading: "わーむ",
    en: "Worm",
    shortJa: "宿主なしで自己複製し、ネットワークを介して広がるプログラム。",
    shortEn: "Self-replicating malware that spreads across networks without a host file.",
    explanationJa:
      "ワームは、他のファイルに寄生せず、自身のコピーを作ってネットワーク経由で自律的に広がるマルウェアである。脆弱性を突いて感染を拡大することが多く、利用者の操作を必要としない場合がある。感染拡大の速度が速く、帯域やCPUを消費して可用性を損なう。パッチ適用、セグメント分割、不要ポートの閉鎖が有効である。",
    explanationEn:
      "A worm self-replicates and spreads over networks without a host file or user action, often exploiting vulnerabilities. It can rapidly consume bandwidth and CPU. Patching, segmentation, and closing unused ports help.",
    examUsage:
      "「利用者が開かなくても感染が広がる」はワーム。ウイルスとの違いは自己伝播の独立性である。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-virus", "sec-malware", "sec-dos-ddos"],
    tags: ["マルウェア", "分類"],
  },
  {
    id: "sec-trojan",
    ja: "トロイの木馬",
    reading: "とろいのもくば",
    en: "Trojan Horse",
    shortJa: "正規のソフトに見せかけて不正動作を行うプログラム。",
    shortEn: "Malware disguised as legitimate software that performs malicious actions.",
    explanationJa:
      "トロイの木馬は、一見すると正規のアプリケーションやユーティリティに見せかけて、利用者に実行させるマルウェアである。自己複製はせず、バックドアの設置、情報窃取、遠隔操作などを行う。遠隔操作機能を持つものはRAT（Remote Access Trojan）と呼ばれる。入手元の確認、署名検証、実行制限が対策となる。",
    explanationEn:
      "A trojan disguises itself as legitimate software and relies on the user to run it. It does not self-replicate; it may install backdoors, steal data, or enable remote control. Remote-access trojans are called RATs.",
    examUsage:
      "「自己複製しないが、正規ソフトに見せかける」はトロイの木馬。ウイルスやワームと混同させる選択肢に注意する。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-malware", "sec-rootkit", "sec-spyware"],
    tags: ["マルウェア", "分類"],
  },
  {
    id: "sec-botnet",
    ja: "ボットネット",
    reading: "ぼっとねっと",
    en: "Botnet",
    shortJa: "乗っ取られた多数の端末が遠隔操作されるネットワーク。",
    shortEn: "A network of compromised devices controlled remotely.",
    explanationJa:
      "ボットネットは、マルウェアに感染して攻撃者の遠隔操作下に置かれた多数の端末（ボット）の集合である。C2サーバからの指令で、DDoS攻撃、スパム送信、認証情報の窃取、暗号資産の採掘などに悪用される。端末の利用者は感染に気付きにくい。通信の監視、感染端末の隔離、パッチ適用、EDRによる検知が対策となる。",
    explanationEn:
      "A botnet is a set of compromised devices controlled remotely, often via C2 servers, used for DDoS, spam, credential theft, or mining. Detection relies on traffic monitoring, isolation, patching, and EDR.",
    examUsage:
      "「多数の端末が踏み台にされる」「C2サーバから指令を受ける」はボットネット。DDoSの攻撃元として登場することが多い。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-malware", "sec-dos-ddos"],
    tags: ["マルウェア", "ネットワーク"],
  },
  {
    id: "sec-ransomware",
    ja: "ランサムウェア",
    reading: "らんさむうぇあ",
    en: "Ransomware",
    shortJa: "データを暗号化・窃取し、復旧や公開の対価を要求するマルウェア。",
    shortEn: "Malware that encrypts or steals data and demands payment.",
    explanationJa:
      "ランサムウェアは、端末やサーバ上のファイルを暗号化して利用不能にし、復号のための身代金を要求するマルウェアである。近年は、窃取した情報を公開すると脅す二重恐喝、取引先への圧力、バックアップの破壊も行う。暗号化は可用性の侵害、情報公開は機密性の侵害に当たる。バックアップの分離保管、EDR、ネットワーク分割、復旧訓練が重要である。",
    explanationEn:
      "Ransomware encrypts or steals data and demands payment, increasingly using double extortion and destroying backups. Encryption harms availability; exposure harms confidentiality. Isolated backups, EDR, segmentation, and recovery drills are key.",
    examUsage:
      "「暗号化されて使えない」は可用性、「窃取したデータを公開すると脅す」は機密性。身代金支払いが復旧を保証しない点も問われる。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-malware", "sec-cia-availability", "sec-cia-confidentiality"],
    tags: ["マルウェア", "インシデント"],
  },
  {
    id: "sec-spyware",
    ja: "スパイウェア",
    reading: "すぱいうぇあ",
    en: "Spyware",
    shortJa: "利用者に気付かれずに情報を収集・送信するソフトウェア。",
    shortEn: "Software that secretly collects and transmits information.",
    explanationJa:
      "スパイウェアは、利用者の操作履歴、入力内容、認証情報、画面情報などを秘密裏に収集し、外部へ送信するマルウェアである。キーロガーは入力情報を記録するスパイウェアの一種である。正規アプリに同梱される場合もあり、入手元の信頼性、権限の確認、端末スキャンが対策となる。",
    explanationEn:
      "Spyware secretly collects and transmits activity, keystrokes, credentials, or screen data. Keyloggers are a subtype. Countermeasures include trusted sources, permission review, and endpoint scanning.",
    examUsage:
      "「利用者に気付かれず情報を盗む」はスパイウェア。「暗号化して身代金」はランサムウェアである。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-malware", "sec-trojan", "sec-cia-confidentiality"],
    tags: ["マルウェア", "分類"],
  },
  {
    id: "sec-rootkit",
    ja: "ルートキット",
    reading: "るーときっと",
    en: "Rootkit",
    shortJa: "OSの奥深くに潜伏し、自身の存在を隠す仕組み。",
    shortEn: "Tools that hide malware by subverting the operating system.",
    explanationJa:
      "ルートキットは、OSのカーネルやドライバ、ブート領域などに組み込まれ、自身や他のマルウェアのファイル、プロセス、通信を隠蔽する仕組みである。管理者権限を奪った後に導入されることが多く、通常のファイルスキャンでは検知しにくい。OSの再インストール、セキュアブート、メモリ分析、整合性監視が対策となる。",
    explanationEn:
      "A rootkit hides itself and other malware by subverting the OS kernel, drivers, or boot process. It often follows privilege escalation and evades file scans. Reinstallation, secure boot, memory analysis, and integrity monitoring help.",
    examUsage:
      "「管理者権限を奪った後に、検知されないよう潜伏する」はルートキット。バックドアそのものではなく隠蔽機構である点に注意する。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-trojan", "sec-fileless-malware", "sec-malware"],
    tags: ["マルウェア", "潜伏"],
  },
  {
    id: "sec-fileless-malware",
    ja: "ファイルレスマルウェア",
    reading: "ふぁいるれすまるうぇあ",
    en: "Fileless Malware",
    shortJa: "ファイルを残さずメモリや正規機能を悪用して動作するマルウェア。",
    shortEn: "Malware that operates in memory or through legitimate tools without dropping files.",
    explanationJa:
      "ファイルレスマルウェアは、実行ファイルをディスクに保存せず、メモリ上や、PowerShell、WMI、レジストリ、署名済みの正規ツールといった既存の仕組みを悪用して動作するマルウェアである。従来のファイルベースのシグネチャ検知を回避しやすい。振る舞い検知、EDR、スクリプトの実行制限、メモリフォレンジックが有効である。",
    explanationEn:
      "Fileless malware avoids writing executables to disk and abuses memory, PowerShell, WMI, the registry, or signed system tools. Behavior detection, EDR, script controls, and memory forensics are effective.",
    examUsage:
      "「ファイルが作成されないためウイルス対策ソフトで検知しにくい」はファイルレス。対策はシグネチャではなく振る舞い検知である。",
    lessonIds: ["security/threats-and-malware"],
    relatedTermIds: ["sec-rootkit", "sec-malware"],
    tags: ["マルウェア", "検知"],
  },
  {
    id: "sec-sql-injection",
    ja: "SQLインジェクション",
    reading: "えすきゅーえるいんじぇくしょん",
    en: "SQL Injection",
    shortJa: "入力値を通じて不正なSQL文を実行させる攻撃。",
    shortEn: "An attack that injects SQL through unsanitized input.",
    explanationJa:
      "SQLインジェクションは、Webアプリの入力欄などにSQL文の一部を注入し、データベースを不正に操作する攻撃である。認証回避、個人情報の窃取、データの改ざん・削除、OSコマンド実行につながる。対策の基本は、プレースホルダ（バインド機構）によるSQL文と値の分離、入力値の検証、DBアカウントの最小権限、エラーメッセージの非表示である。",
    explanationEn:
      "SQL injection inserts SQL through unsanitized input to bypass authentication, steal or alter data, or execute commands. Primary defenses are prepared statements with bind parameters, input validation, least-privilege database accounts, and generic error messages.",
    examUsage:
      "「' OR '1'='1」のような入力例や、「プレースホルダを使う」が対策として出る。エスケープだけに頼る選択肢は不十分である。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-xss", "sec-csrf", "sec-vulnerability"],
    tags: ["Web", "インジェクション"],
  },
  {
    id: "sec-xss",
    ja: "クロスサイトスクリプティング",
    reading: "くろすさいとすくりぷてぃんぐ",
    en: "Cross-Site Scripting",
    abbr: "XSS",
    shortJa: "Webページに悪意あるスクリプトを埋め込み、利用者のブラウザで実行させる攻撃。",
    shortEn: "Injecting script into pages so it executes in another user's browser.",
    explanationJa:
      "クロスサイトスクリプティング（XSS）は、掲示板や検索結果などに悪意あるスクリプトを埋め込み、閲覧した利用者のブラウザ上で実行させる攻撃である。反射型、格納型、DOM型に分類される。セッションIDやCookieの窃取、フィッシング画面の表示、CSRFとの組み合わせによる操作が起きる。対策は、出力時の文脈に応じたエスケープ、入力値の検証、CSP、CookieへのHttpOnly属性付与である。",
    explanationEn:
      "XSS injects scripts into pages viewed by other users. Reflected, stored, and DOM-based variants exist. It can steal session IDs, display phishing forms, or enable CSRF. Defenses include context-aware output encoding, input validation, CSP, and HttpOnly cookies.",
    examUsage:
      "「利用者のブラウザでスクリプトが実行される」はXSS。「利用者に意図しないリクエストを送らせる」はCSRFとして区別する。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-csrf", "sec-session-hijacking", "sec-sql-injection"],
    tags: ["Web", "XSS"],
  },
  {
    id: "sec-csrf",
    ja: "クロスサイトリクエストフォージェリ",
    reading: "くろすさいとりくえすとふぉーじぇり",
    en: "Cross-Site Request Forgery",
    abbr: "CSRF",
    shortJa: "ログイン済み利用者に、意図しない操作を送信させる攻撃。",
    shortEn: "Forcing an authenticated user's browser to send an unintended request.",
    explanationJa:
      "CSRFは、利用者が対象サイトにログインした状態を悪用し、別のサイトに仕込んだリンクやフォームから、意図しないリクエストを送信させる攻撃である。パスワード変更、送金、投稿などが実行される。XSSがスクリプトの実行であるのに対し、CSRFは正規のリクエストを偽造する点が異なる。対策は、推測困難なCSRFトークンの検証、SameSite属性、Origin/Refererの確認、重要操作での再認証である。",
    explanationEn:
      "CSRF abuses a logged-in session to send unintended requests from another site. It differs from XSS in that it forges legitimate requests rather than executing script. Defenses include unpredictable CSRF tokens, SameSite cookies, Origin checks, and re-authentication for sensitive actions.",
    examUsage:
      "「本人が意図しない送金処理を勝手に実行される」はCSRF。トークン検証が定番の対策である。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-xss", "sec-session-hijacking"],
    tags: ["Web", "CSRF"],
  },
  {
    id: "sec-directory-traversal",
    ja: "ディレクトリトラバーサル",
    reading: "でぃれくとりとらばーさる",
    en: "Directory Traversal",
    shortJa: "「../」などで公開領域の外のファイルを読み出す攻撃。",
    shortEn: "An attack using path sequences to access files outside the intended directory.",
    explanationJa:
      "ディレクトリトラバーサルは、ファイル名を受け取る処理に「../」などの相対パスを注入し、公開ディレクトリの外にある設定ファイルや認証情報を読み出す攻撃である。パスの正規化後に許可ディレクトリ配下であることを検証する、ファイル名を固定する、OSやフレームワークの安全なAPIを使うといった対策が必要である。",
    explanationEn:
      "Directory traversal injects path sequences such as ../ to read files outside the intended directory. Defenses include canonicalization followed by allowlist validation, fixed filenames, and safe framework APIs.",
    examUsage:
      "「../../etc/passwd」のような入力例や、「パスを正規化して許可範囲を検証する」が対策として問われる。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-sql-injection", "sec-buffer-overflow"],
    tags: ["Web", "パス"],
  },
  {
    id: "sec-buffer-overflow",
    ja: "バッファオーバーフロー",
    reading: "ばっふぁおーばーふろー",
    en: "Buffer Overflow",
    shortJa: "領域を超えたデータ書き込みで、プログラムの動作を乗っ取る攻撃。",
    shortEn: "Overwriting memory beyond a buffer to hijack program execution.",
    explanationJa:
      "バッファオーバーフローは、プログラムが確保したメモリ領域を超えるデータを書き込むことで、隣接する領域の変数や戻りアドレスを書き換え、任意のコードを実行させる攻撃である。C言語などの境界チェックが弱い処理で発生しやすい。安全な関数の利用、境界チェック、コンパイラの保護機能（スタック保護、DEP、ASLR）、実行権限の制限が対策となる。",
    explanationEn:
      "Buffer overflow writes beyond allocated memory to overwrite adjacent data or return addresses and execute arbitrary code. Defenses include bounds checks, safe functions, stack protection, DEP, ASLR, and least privilege.",
    examUsage:
      "「メモリ領域を超える入力」「戻りアドレスの書き換え」はバッファオーバーフロー。Webの入力検証だけでは防げない点に注意する。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-directory-traversal", "sec-vulnerability"],
    tags: ["メモリ", "脆弱性"],
  },
  {
    id: "sec-brute-force",
    ja: "総当たり攻撃",
    reading: "そうあたりこうげき",
    en: "Brute Force Attack",
    shortJa: "考えられるすべての組み合わせを試して認証を突破する攻撃。",
    shortEn: "Trying all possible credential combinations to break authentication.",
    explanationJa:
      "総当たり攻撃は、パスワードや暗号鍵の候補をすべて順に試して認証の突破を図る攻撃である。文字種と桁数が多いほど試行回数が膨大になり、成功までの時間が長くなる。対策は、十分な長さのパスワード、試行回数の制限、アカウントロック、遅延の導入、多要素認証である。オフライン攻撃では、ハッシュの計算コストを高めることも有効である。",
    explanationEn:
      "Brute force tries every possible credential or key. Longer passwords and larger character sets increase the search space. Defenses include attempt limits, lockouts, delays, MFA, and high-cost password hashing for offline attacks.",
    examUsage:
      "「すべての組み合わせを試す」は総当たり。「よく使われるパスワードの候補を試す」は辞書攻撃・パスワードリスト攻撃である。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-password-list", "sec-mfa", "sec-session-hijacking"],
    tags: ["認証", "パスワード"],
  },
  {
    id: "sec-password-list",
    ja: "パスワードリスト攻撃",
    reading: "ぱすわーどりすとこうげき",
    en: "Password List Attack",
    shortJa: "他サービスから流出したID・パスワードの組を別サイトで試す攻撃。",
    shortEn: "Reusing leaked credential pairs against other services.",
    explanationJa:
      "パスワードリスト攻撃は、他のサービスから流出したIDとパスワードの組み合わせのリストを用いて、別のサービスへのログインを試す攻撃である。利用者が複数のサービスで同じパスワードを使い回していると成立する。クレデンシャルスタッフィングとも呼ばれる。対策は、パスワードの使い回しを避けること、漏えいパスワードの照合、多要素認証、ログイン試行の監視である。",
    explanationEn:
      "A password list attack replays leaked username-password pairs against other services. It succeeds when users reuse passwords. Defenses include avoiding reuse, checking against breach lists, MFA, and login monitoring.",
    examUsage:
      "「他社の漏えい情報を使い回す」はパスワードリスト攻撃。サービス側の対策として多要素認証が重要になる。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-brute-force", "sec-mfa"],
    tags: ["認証", "パスワード"],
  },
  {
    id: "sec-session-hijacking",
    ja: "セッションハイジャック",
    reading: "せっしょんはいじゃっく",
    en: "Session Hijacking",
    shortJa: "セッションIDを盗んで、利用者になりすます攻撃。",
    shortEn: "Stealing a session identifier to impersonate a logged-in user.",
    explanationJa:
      "セッションハイジャックは、ログイン後に発行されるセッションIDを窃取し、攻撃者がそのIDを使って正規利用者になりすます攻撃である。XSSによるCookie窃取、通信の盗聴、セッション固定攻撃などが手口となる。対策は、TLSによる通信の暗号化、CookieへのSecure/HttpOnly/SameSite属性の付与、ログイン成功時のセッションID再発行、一定時間でのタイムアウトである。",
    explanationEn:
      "Session hijacking steals a session ID to impersonate a user, via XSS, eavesdropping, or session fixation. Defenses include TLS, Secure/HttpOnly/SameSite cookies, session ID renewal after login, and idle timeouts.",
    examUsage:
      "「セッションIDを盗んでなりすます」はセッションハイジャック。「セッションIDを固定してログインさせる」はセッション固定攻撃である。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-xss", "sec-csrf", "sec-mitm"],
    tags: ["認証", "セッション"],
  },
  {
    id: "sec-mitm",
    ja: "中間者攻撃",
    reading: "ちゅうかんしゃこうげき",
    en: "Man-in-the-Middle Attack",
    abbr: "MITM",
    shortJa: "通信経路の途中に割り込み、盗聴や改ざんを行う攻撃。",
    shortEn: "Intercepting communications between two parties to eavesdrop or alter them.",
    explanationJa:
      "中間者攻撃は、利用者とサーバの間の通信経路に攻撃者が割り込み、通信内容の盗聴、改ざん、なりすましを行う攻撃である。偽のWi-Fiアクセスポイント、ARPスプーフィング、DNS偽装、証明書の不正利用などが手口となる。対策は、TLSによる暗号化と証明書の厳格な検証、HSTS、信頼できるネットワークの利用、802.1XやARP監視である。",
    explanationEn:
      "MITM intercepts traffic between parties to eavesdrop, alter, or impersonate. Attacks use rogue access points, ARP spoofing, DNS spoofing, or fraudulent certificates. Defenses include TLS with strict certificate validation, HSTS, trusted networks, and network access control.",
    examUsage:
      "「通信の途中に割り込む」は中間者攻撃。暗号化していても、証明書検証を無視すると成立する点が問われる。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-dns-cache-poisoning", "sec-session-hijacking", "sec-pki"],
    tags: ["ネットワーク", "盗聴"],
  },
  {
    id: "sec-dns-cache-poisoning",
    ja: "DNSキャッシュポイズニング",
    reading: "でぃーえぬえすきゃっしゅぽいずにんぐ",
    en: "DNS Cache Poisoning",
    shortJa: "DNSのキャッシュに偽の名前解決結果を覚えさせる攻撃。",
    shortEn: "Corrupting DNS caches with forged name-resolution records.",
    explanationJa:
      "DNSキャッシュポイズニングは、DNSサーバのキャッシュに偽のIPアドレスを登録させ、利用者を攻撃者のサーバへ誘導する攻撃である。正規サイトそっくりの偽サイトに接続させ、認証情報を窃取したりマルウェアを配布したりする。対策は、DNSSECによる応答の検証、DNSサーバソフトの更新、キャッシュのランダム化、信頼できるDNSリゾルバの利用である。",
    explanationEn:
      "DNS cache poisoning inserts forged records into DNS caches to redirect users to attacker servers for phishing or malware. Defenses include DNSSEC validation, patched DNS software, source-port randomization, and trusted resolvers.",
    examUsage:
      "「正しいURLなのに偽サイトへ誘導される」はDNSキャッシュポイズニング。DNSSECが対策として問われる。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-mitm", "sec-dos-ddos"],
    tags: ["ネットワーク", "DNS"],
  },
  {
    id: "sec-dos-ddos",
    ja: "DoS攻撃・DDoS攻撃",
    reading: "どすこうげき・でぃーどすこうげき",
    en: "Denial of Service / Distributed Denial of Service",
    abbr: "DoS / DDoS",
    shortJa: "大量の通信や処理要求でサービスを利用不能にする攻撃。",
    shortEn: "Overwhelming a service with traffic or requests to deny availability.",
    explanationJa:
      "DoS攻撃は、大量の通信や計算要求を送り、サービスを利用不能にしたり著しく遅くしたりする攻撃である。多数の端末から分散して行うものをDDoS攻撃と呼び、ボットネットが使われることが多い。SYNフラッド、UDPフラッド、アンプ攻撃、HTTPリクエスト floodingなどがある。対策は、帯域の余裕確保、CDNやスクラビングサービスの利用、レート制限、異常検知、ボット対策である。",
    explanationEn:
      "DoS overwhelms a service with traffic or requests; DDoS uses many distributed devices, often a botnet. Variants include SYN floods, UDP floods, amplification, and HTTP floods. Defenses include capacity, CDN/scrubbing, rate limiting, anomaly detection, and bot mitigation.",
    examUsage:
      "「サービスが停止する」は可用性の侵害。「多数の端末から一斉に」はDDoSで、ボットネットとの関連が問われる。",
    lessonIds: ["security/attacks"],
    relatedTermIds: ["sec-botnet", "sec-cia-availability"],
    tags: ["ネットワーク", "可用性"],
  },
  {
    id: "sec-common-key",
    ja: "共通鍵暗号",
    reading: "きょうつうかぎあんごう",
    en: "Symmetric Key Cryptography",
    shortJa: "暗号化と復号に同じ鍵を使う暗号方式。",
    shortEn: "Encryption using the same key for both encryption and decryption.",
    explanationJa:
      "共通鍵暗号は、暗号化と復号に同一の鍵を用いる方式である。AESが代表例で、高速なため大量データの暗号化に向く。課題は鍵配送と鍵管理であり、通信相手ごとに鍵を安全に共有する必要がある。ハイブリッド暗号では、公開鍵暗号で共通鍵を安全に配送し、本文は共通鍵暗号で処理する。",
    explanationEn:
      "Symmetric cryptography uses one key for encryption and decryption. AES is the standard example and is fast for bulk data. The main challenge is secure key distribution and management, solved in hybrid schemes by wrapping the symmetric key with public-key cryptography.",
    examUsage:
      "「同じ鍵」「高速」「大量データ」は共通鍵。「鍵配送が課題」もセットで覚える。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-public-key", "sec-hash"],
    tags: ["暗号", "方式"],
  },
  {
    id: "sec-public-key",
    ja: "公開鍵暗号",
    reading: "こうかいかぎあんごう",
    en: "Public Key Cryptography",
    shortJa: "公開鍵と秘密鍵の対を使い、鍵配送の問題を緩和する暗号方式。",
    shortEn: "Asymmetric cryptography using a public and private key pair.",
    explanationJa:
      "公開鍵暗号は、公開してよい公開鍵と、本人だけが管理する秘密鍵の対を用いる方式である。RSAや楕円曲線暗号（ECC）が代表例である。公開鍵で暗号化したデータは秘密鍵で復号し、秘密鍵で署名したデータは公開鍵で検証する。共通鍵暗号より計算コストが高いため、鍵交換や署名に使うことが多い。",
    explanationEn:
      "Public-key cryptography uses a public key and a private key, as in RSA or ECC. Data encrypted with the public key is decrypted with the private key; signatures made with the private key are verified with the public key. It is slower and mainly used for key exchange and signatures.",
    examUsage:
      "「公開鍵で暗号化→秘密鍵で復号」「秘密鍵で署名→公開鍵で検証」の向きを逆にした選択肢が頻出である。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-common-key", "sec-digital-signature", "sec-pki"],
    tags: ["暗号", "方式"],
  },
  {
    id: "sec-hash",
    ja: "ハッシュ関数",
    reading: "はっしゅかんすう",
    en: "Hash Function",
    shortJa: "任意長のデータから固定長の値を生成する一方向関数。",
    shortEn: "A one-way function mapping arbitrary data to a fixed-length value.",
    explanationJa:
      "ハッシュ関数は、任意の長さのデータから固定長のハッシュ値を生成する関数である。一方向性（ハッシュ値から元データを求めにくい）、衝突耐性（異なるデータが同じ値になりにくい）、雪崩効果（少しの変更で値が大きく変わる）が求められる。SHA-256が広く使われ、改ざん検知、デジタル署名、パスワード保管に利用される。パスワードにはsaltと計算コストの高い方式（bcrypt、Argon2など）を用いる。",
    explanationEn:
      "A hash function produces a fixed-length digest with one-wayness, collision resistance, and the avalanche effect. SHA-256 is widely used for integrity checks, signatures, and password storage; passwords require salts and slow hashes such as bcrypt or Argon2.",
    examUsage:
      "「改ざん検知」はハッシュ。「暗号化」と混同しない。パスワード保管でSHA-256をそのまま使う選択肢は不十分である。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-digital-signature", "sec-cia-integrity", "sec-common-key"],
    tags: ["暗号", "完全性"],
  },
  {
    id: "sec-digital-signature",
    ja: "デジタル署名",
    reading: "でじたるしょめい",
    en: "Digital Signature",
    shortJa: "秘密鍵で署名し、公開鍵で検証する電子的な署名。",
    shortEn: "An electronic signature created with a private key and verified with a public key.",
    explanationJa:
      "デジタル署名は、データのハッシュ値を送信者の秘密鍵で暗号化して署名とし、受信者が送信者の公開鍵で検証する仕組みである。改ざん検知（完全性）、送信者の確認（真正性）、否認防止を提供する。共通鍵によるMACは完全性と真正性を提供するが、鍵を共有するため否認防止にはならない。",
    explanationEn:
      "A digital signature encrypts a hash with the sender's private key; the receiver verifies it with the public key. It provides integrity, authenticity, and non-repudiation, unlike a shared-key MAC, which cannot provide non-repudiation.",
    examUsage:
      "「秘密鍵で署名、公開鍵で検証」はデジタル署名。「共通鍵でMAC」との違い（否認防止の有無）が最重要である。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-hash", "sec-public-key", "sec-non-repudiation", "sec-pki"],
    tags: ["暗号", "署名"],
  },
  {
    id: "sec-pki",
    ja: "PKI",
    reading: "ぴーけーあい",
    en: "Public Key Infrastructure",
    shortJa: "公開鍵の正当性を証明書と認証局で保証する仕組み。",
    shortEn: "An infrastructure of certificates and authorities that vouches for public keys.",
    explanationJa:
      "PKIは、公開鍵が誰のものかを証明するデジタル証明書を、認証局（CA）が発行・管理する仕組みである。利用者はCAの署名をたどって証明書チェーンを検証し、失効情報をCRLやOCSPで確認する。TLSのサーバ証明書、電子署名、クライアント認証などで使われる。ルートCAの信頼、証明書の有効期限、ホスト名一致、失効確認が検証の要点である。",
    explanationEn:
      "PKI uses certificate authorities to issue and manage digital certificates that bind public keys to identities. Users validate certificate chains, expiry, hostnames, and revocation via CRL or OCSP. It underpins TLS, signatures, and client authentication.",
    examUsage:
      "「認証局が公開鍵の正当性を保証する」はPKI。証明書の失効確認（CRL/OCSP）が対策として問われる。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-public-key", "sec-digital-signature", "sec-authenticity"],
    tags: ["暗号", "証明書"],
  },
  {
    id: "sec-mfa",
    ja: "多要素認証",
    reading: "たようそにんしょう",
    en: "Multi-Factor Authentication",
    abbr: "MFA",
    shortJa: "知識・所持・生体のうち異なる2つ以上を組み合わせる認証。",
    shortEn: "Authentication using two or more different factor categories.",
    explanationJa:
      "多要素認証は、知識（パスワード、PIN）、所持（スマートフォン、ICカード、ハードウェアトークン）、生体（指紋、顔）という異なる要素を2つ以上組み合わせる認証である。パスワードと秘密の質問はどちらも知識に属するため、多要素にはならない。同じ要素を2回使う方式は多段階認証と呼び、多要素認証とは区別する。",
    explanationEn:
      "MFA combines two or more different factor categories: knowledge, possession, and inherence. Two knowledge factors do not constitute MFA. Repeated use of the same category is multi-step authentication, not multi-factor.",
    examUsage:
      "「パスワード＋秘密の質問」は多要素ではない。「パスワード＋スマホのワンタイムパスワード」は多要素である。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-biometrics", "sec-authenticity", "sec-zero-trust"],
    tags: ["認証", "MFA"],
  },
  {
    id: "sec-biometrics",
    ja: "生体認証",
    reading: "せいたいにんしょう",
    en: "Biometric Authentication",
    shortJa: "指紋や顔など身体的特徴で本人を確認する認証。",
    shortEn: "Authentication using physiological or behavioral characteristics.",
    explanationJa:
      "生体認証は、指紋、顔、虹彩、声紋、筆跡など、本人の身体的特徴や行動的特徴を用いて本人確認を行う方式である。忘れにくく盗みにくい一方、経年変化、ケガ、環境による誤差、模倣、プライバシーへの配慮が課題となる。FRR（本人を誤って拒否する率）とFAR（他人を誤って受理する率）はトレードオフの関係にあり、用途に応じて閾値を設計する。",
    explanationEn:
      "Biometric authentication uses fingerprints, faces, irises, voices, or handwriting. It is hard to lose or share but has issues with aging, injury, environmental variation, spoofing, and privacy. FRR and FAR trade off against each other, so thresholds must fit the use case.",
    examUsage:
      "「本人拒否率（FRR）を下げると他人受入率（FAR）が上がる」トレードオフが問われる。生体情報は変更できないため漏えい時の影響が大きい。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-mfa", "sec-authenticity"],
    tags: ["認証", "生体"],
  },
  {
    id: "sec-cvss",
    ja: "CVSS",
    reading: "しーぶいえすえす",
    en: "Common Vulnerability Scoring System",
    shortJa: "脆弱性の深刻度を0.0〜10.0で評価する共通指標。",
    shortEn: "A common framework scoring vulnerability severity from 0.0 to 10.0.",
    explanationJa:
      "CVSSは、脆弱性の技術的な深刻度を0.0から10.0のスコアで表す共通指標である。基本評価基準（Base）は脆弱性自体の性質、現状評価基準（Temporal）は攻撃コードの公開状況や修正状況、環境評価基準（Environmental）は組織固有の構成や重要度を反映する。基本評価基準だけで自組織のリスクが決まるわけではなく、環境に応じた調整と、CVEやJVNなどの情報と組み合わせて判断する。",
    explanationEn:
      "CVSS scores technical severity from 0.0 to 10.0. Base metrics describe the vulnerability, Temporal metrics reflect exploit maturity and fixes, and Environmental metrics adjust for the organization's context. Base scores alone do not determine organizational risk.",
    examUsage:
      "「基本評価基準・現状評価基準・環境評価基準」の3分類と、「CVSSは組織固有のリスクそのものではない」点が問われる。",
    lessonIds: ["security/crypto-auth"],
    relatedTermIds: ["sec-vulnerability", "sec-threat"],
    tags: ["評価", "脆弱性"],
  },
];
