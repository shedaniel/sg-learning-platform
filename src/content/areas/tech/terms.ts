import type { GlossaryTerm } from "@/lib/content/types";

export const techTerms: GlossaryTerm[] = [
  // ── アクセス制御と特権管理 ─────────────────────────────
  {
    id: "tech-least-privilege",
    ja: "最小権限の原則",
    reading: "さいしょうけんげんのげんそく",
    en: "Principle of Least Privilege",
    shortJa: "業務に必要な最小限の権限だけを、必要な期間だけ与える原則。",
    shortEn:
      "The principle of granting only the minimum privileges needed, for only as long as needed.",
    explanationJa:
      "利用者やプログラムに、業務を遂行するために必要な最小限の権限だけを付与する原則です。権限が小さければ、認証情報が漏えいしても被害の範囲を限定できます。付与する範囲だけでなく、付与する期間を限定することも含みます。",
    explanationEn:
      "Least privilege limits both the scope and the duration of access so that a compromised account cannot reach unrelated resources.",
    examUsage:
      "「必要以上に強い権限を与えない」とあれば最小権限です。情報の閲覧範囲を絞るニードトゥノウとは着目点が異なります。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-need-to-know", "tech-pam", "tech-jit-access"],
    tags: ["アクセス制御", "原則"],
  },
  {
    id: "tech-need-to-know",
    ja: "ニードトゥノウ",
    reading: "にーどとぅのう",
    en: "Need-to-Know",
    shortJa: "職務上知る必要がある情報だけを開示する考え方。",
    shortEn:
      "The practice of disclosing information only to those who need it to perform their duties.",
    explanationJa:
      "同じ部署・同じ役職であっても、職務上知る必要のない情報にはアクセスさせない考え方です。最小権限が「できる操作」を制限するのに対し、ニードトゥノウは「見える情報」を制限します。人事評価や医療情報など、機密度の高い情報の取扱いで重要になります。",
    explanationEn:
      "Need-to-know restricts the information a person may see, even when they are authorized to use the system.",
    examUsage:
      "「同一部署の全員に同じ顧客情報を見せる必要はない」という記述はニードトゥノウの適用例です。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-least-privilege"],
    tags: ["アクセス制御", "原則"],
  },
  {
    id: "tech-rbac",
    ja: "ロールベースアクセス制御",
    reading: "ろーるべーすあくせすせいぎょ",
    en: "Role-Based Access Control",
    abbr: "RBAC",
    shortJa: "職務（ロール）に権限をまとめ、利用者にロールを割り当てる方式。",
    shortEn:
      "An access control model that assigns permissions to roles and roles to users.",
    explanationJa:
      "経理担当・人事担当といった職務単位でロールを定義し、ロールに権限をまとめて付与します。利用者にはロールを割り当てるだけで済むため、人事異動のたびに個別の権限を付け替える必要がありません。ロールの設計が業務の実態とずれると、過剰な権限が生まれます。",
    explanationEn:
      "RBAC simplifies administration by binding permissions to job roles rather than to individual accounts.",
    examUsage:
      "「異動時にロールを変更する」「職務に応じた権限を一括で付与する」はRBACの記述です。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-abac", "tech-acl", "tech-sod"],
    tags: ["アクセス制御", "認可"],
  },
  {
    id: "tech-abac",
    ja: "属性ベースアクセス制御",
    reading: "ぞくせいべーすあくせすせいぎょ",
    en: "Attribute-Based Access Control",
    abbr: "ABAC",
    shortJa: "部門・時刻・場所・端末状態などの属性でアクセス可否を都度判定する方式。",
    shortEn:
      "An access control model that evaluates attributes of the subject, resource, and environment.",
    explanationJa:
      "利用者の所属や役職、資源の機密区分、アクセスする時刻や場所、端末の状態といった属性を組み合わせて、アクセスのたびに可否を判定します。状況に応じた細かい制御ができる一方、ポリシーの設計と属性情報の管理が複雑になります。",
    explanationEn:
      "ABAC makes dynamic decisions from attributes, enabling context-aware policies such as time or device restrictions.",
    examUsage:
      "「場所や時間帯などの条件で動的に制御する」はABAC、「職務に基づいて制御する」はRBACです。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-rbac", "tech-zero-trust"],
    tags: ["アクセス制御", "認可"],
  },
  {
    id: "tech-acl",
    ja: "アクセス制御リスト",
    reading: "あくせすせいぎょりすと",
    en: "Access Control List",
    abbr: "ACL",
    shortJa: "資源ごとに、アクセスを許可する主体と操作を列挙した一覧。",
    shortEn:
      "A list attached to a resource that names the subjects allowed to perform specific operations.",
    explanationJa:
      "ファイルやフォルダ、ネットワーク機器のインタフェースなどに設定し、どの利用者・グループにどの操作を許可するかを列挙します。資源の所有者が設定する任意アクセス制御（DAC）の代表的な実装です。設定が増えると全体像を把握しにくくなるため、定期的な見直しが必要です。",
    explanationEn:
      "ACLs are simple and precise for individual resources but become hard to audit at scale.",
    examUsage:
      "「ファイルごとに利用者と権限を設定する」はACLです。ロールにまとめるRBACとは粒度が異なります。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-rbac", "tech-access-review"],
    tags: ["アクセス制御"],
  },
  {
    id: "tech-pam",
    ja: "特権アクセス管理",
    reading: "とっけんあくせすかんり",
    en: "Privileged Access Management",
    abbr: "PAM",
    shortJa: "管理者IDのパスワード秘匿・払い出し・操作記録を統合的に管理する仕組み。",
    shortEn:
      "A set of controls for vaulting, issuing, monitoring, and revoking privileged credentials.",
    explanationJa:
      "OSやデータベース、クラウドの管理者アカウントは影響範囲が大きく、攻撃者の主要な標的になります。PAMでは、特権パスワードを保管庫に格納して作業者に値を見せずに自動注入し、作業の申請・承認、セッションの録画、終了後の権限返却を行います。共有パスワードによる運用を廃止し、行為者を特定できる状態にします。",
    explanationEn:
      "PAM removes standing privileged credentials and records administrative sessions so that actions can be attributed.",
    examUsage:
      "「管理者パスワードを共有している」「操作者を特定できない」という課題に対する対策として選ばれます。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-jit-access", "tech-credential-management", "tech-sod"],
    tags: ["特権管理", "アクセス制御"],
  },
  {
    id: "tech-jit-access",
    ja: "ジャストインタイムアクセス",
    reading: "じゃすといんたいむあくせす",
    en: "Just-in-Time Access",
    shortJa: "作業が必要なときだけ、必要な時間に限って権限を有効化する方式。",
    shortEn:
      "Granting privileges only for the duration of an approved task and revoking them automatically.",
    explanationJa:
      "管理者権限を常時付与するのではなく、作業の申請と承認に基づいて一時的に有効化し、終了後は自動的に剥奪します。常時管理者権限のアカウントが侵害されるリスクを減らし、作業と権限付与の記録を対応付けられます。",
    explanationEn:
      "JIT access eliminates standing privileges and ties every elevation to an approved request.",
    examUsage:
      "「作業時だけ管理者権限を付与し、終了後に自動で戻す」はジャストインタイムアクセスの説明です。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-pam", "tech-least-privilege"],
    tags: ["特権管理"],
  },
  {
    id: "tech-sod",
    ja: "職務分掌",
    reading: "しょくむぶんしょう",
    en: "Separation of Duties",
    shortJa: "申請と承認、実行と監査などを異なる担当者に分ける統制。",
    shortEn:
      "Dividing critical tasks among different people so that no single person can complete a sensitive process alone.",
    explanationJa:
      "一つの業務プロセスを一人で完結できないようにし、不正や誤りを相互に牽制します。例えば、経費の申請者と承認者、システムの開発者と本番環境への反映者を分けます。権限を最小化しても、同一人物が複数の役割を兼ねると統制が形骸化します。",
    explanationEn:
      "Separation of duties prevents fraud and accidental error by requiring more than one person for sensitive operations.",
    examUsage:
      "「担当者が申請と承認の両方を行える」状態は職務分掌の不備です。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-least-privilege", "tech-pam", "tech-access-review"],
    tags: ["内部統制", "アクセス制御"],
  },
  {
    id: "tech-credential-management",
    ja: "認証情報管理",
    reading: "にんしょうじょうほうかんり",
    en: "Credential Management",
    shortJa: "パスワードやトークンの発行・保管・変更・失効を一貫して管理すること。",
    shortEn:
      "Managing the issuance, storage, rotation, and revocation of passwords and tokens throughout their lifecycle.",
    explanationJa:
      "パスワードの強度だけでなく、初期配布の方法、保管場所、使い回しの防止、退職・異動時の失効までを含みます。多要素認証やパスワードマネージャの利用も、認証情報管理の一部です。配布と失効の手順が曖昧だと、退職者のIDが長期間残ります。",
    explanationEn:
      "Credential management covers the whole lifecycle, including secure issuance and timely revocation.",
    examUsage:
      "「初期パスワードを推測されにくい値にして初回変更を求める」「退職時に即日失効する」は認証情報管理の統制です。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-secret-management", "tech-pam", "tech-id-lifecycle"],
    tags: ["認証", "運用"],
  },
  {
    id: "tech-secret-management",
    ja: "シークレット管理",
    reading: "しーくれっとかんり",
    en: "Secrets Management",
    shortJa: "APIキーやトークンなどの秘匿情報を、コードから分離して安全に配布・更新する仕組み。",
    shortEn:
      "Storing and distributing secrets such as API keys outside source code with controlled access and rotation.",
    explanationJa:
      "APIキー、データベースの接続パスワード、証明書の秘密鍵などを、ソースコードや設定ファイルに直書きせず、専用の保管庫で管理します。アプリケーションは実行時に取得し、権限を限定し、定期的にローテーションします。コードリポジトリへの埋め込みは、公開・共有時にそのまま漏えいします。",
    explanationEn:
      "Secrets management keeps credentials out of code and gives each workload only the secrets it needs.",
    examUsage:
      "「ソースコードにAPIキーを埋め込まない」「シークレット管理サービスから実行時に取得する」が対策です。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-credential-management", "tech-key-management"],
    tags: ["認証", "開発"],
  },
  {
    id: "tech-tde",
    ja: "透過的データ暗号化",
    reading: "とうかてきでーたあんごうか",
    en: "Transparent Data Encryption",
    abbr: "TDE",
    shortJa: "データベースのファイルを、アプリケーションの改修なしに暗号化する仕組み。",
    shortEn:
      "Encrypting database files at rest without requiring changes to the application.",
    explanationJa:
      "データベースの記憶域を暗号化し、アプリケーションからは通常どおりSQLでアクセスできます。バックアップ媒体の紛失には有効ですが、データベース管理者の権限で復号できるため、管理者からデータを隠すことはできません。列単位で保護したい場合はカラム暗号化を併用します。",
    explanationEn:
      "TDE protects data at rest against media loss but does not hide data from database administrators.",
    examUsage:
      "「TDEを導入すればDB管理者もデータを見られない」という選択肢は誤りです。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-key-management", "tech-least-privilege"],
    tags: ["暗号化", "データベース"],
  },
  {
    id: "tech-key-management",
    ja: "暗号鍵管理",
    reading: "あんごうかぎかんり",
    en: "Key Management",
    shortJa: "暗号鍵の生成・保管・配布・ローテーション・廃棄を統制すること。",
    shortEn:
      "The lifecycle control of cryptographic keys: generation, storage, distribution, rotation, and destruction.",
    explanationJa:
      "暗号化の強度は、鍵の守り方に依存します。データ暗号鍵（DEK）を上位の鍵（KEK）で保護するエンベロープ暗号化、KMSやHSMへの鍵の分離、利用者ごとの権限、定期的なローテーションを設計します。鍵をデータと同じ場所に置くと、サーバ侵害時に両方奪われます。",
    explanationEn:
      "Key management determines whether encryption actually protects data; keys must be separated from the data they protect.",
    examUsage:
      "「暗号化されているから安全」ではなく「鍵を誰が管理するか」を問う設問に注意します。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-tde", "tech-secret-management", "tech-crypto-erase"],
    tags: ["暗号化", "鍵管理"],
  },
  {
    id: "tech-access-review",
    ja: "アクセス権レビュー",
    reading: "あくせすけんれびゅー",
    en: "Access Review",
    shortJa: "付与済みの権限を定期的に棚卸し、不要な権限を削除する統制。",
    shortEn:
      "A periodic recertification of existing access rights to remove what is no longer needed.",
    explanationJa:
      "利用者本人、上長、システム所有者が権限の一覧を確認し、現在の職務に照らして必要かどうかを判断します。異動や退職のたびに行う即時の見直しと、四半期・年次の定期レビューを組み合わせます。特権IDと機密性の高い資源を優先すると、限られた工数を有効に使えます。",
    explanationEn:
      "Access reviews catch privilege creep that accumulates through transfers and temporary assignments.",
    examUsage:
      "「年1回の自己申告だけ」では不十分です。三者確認と、異動・退職時の都度見直しが問われます。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-id-lifecycle", "tech-least-privilege", "tech-sod"],
    tags: ["アクセス制御", "運用"],
  },
  {
    id: "tech-id-lifecycle",
    ja: "IDライフサイクル管理",
    reading: "あいでぃーらいふさいくるかんり",
    en: "Identity Lifecycle Management",
    shortJa: "入社から異動、退職まで、アカウントと権限の状態を一貫して管理すること。",
    shortEn:
      "Managing accounts and entitlements consistently from onboarding through transfers to departure.",
    explanationJa:
      "入社時の発行、異動時の権限変更、退職時の無効化を、人事システムと連携して確実に行います。特に退職時の無効化は、最も基本的かつ見落とされやすい統制です。アカウントの有効期限や最終ログインの監視も、放置されたIDの発見に有効です。",
    explanationEn:
      "Lifecycle management ensures accounts are created, changed, and removed in step with employment events.",
    examUsage:
      "入社・異動・退職の3局面で必要な統制を整理して覚えます。",
    lessonIds: ["tech/access-control"],
    relatedTermIds: ["tech-access-review", "tech-credential-management"],
    tags: ["ID管理", "運用"],
  },

  // ── ネットワーク防御とセキュアプロトコル ───────────────
  {
    id: "tech-firewall",
    ja: "ファイアウォール",
    reading: "ふぁいあうぉーる",
    en: "Firewall",
    shortJa: "通過する通信を、IPアドレスやポートなどの条件で許可・拒否する装置。",
    shortEn:
      "A device that permits or blocks traffic based on addresses, ports, and connection state.",
    explanationJa:
      "ネットワークの境界や区画の間に設置し、あらかじめ定めたルールに合致する通信だけを通します。パケットフィルタ型、コネクションの状態を保持するステートフル型、アプリケーション層で代理する型があります。原則は「既定で拒否し、必要な通信だけ許可する」です。",
    explanationEn:
      "Firewalls enforce network-level policy, but they do not inspect the content of encrypted application traffic.",
    examUsage:
      "ファイアウォールはポートとIP、WAFはHTTPの中身を見る、と層で区別します。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-dmz", "tech-waf", "tech-ips"],
    tags: ["ネットワーク", "境界防御"],
  },
  {
    id: "tech-dmz",
    ja: "DMZ",
    reading: "でぃーえむぜっと",
    en: "Demilitarized Zone",
    abbr: "DMZ",
    shortJa: "外部公開サーバを内部ネットワークから分離して置く中間区画。",
    shortEn:
      "A segmented network zone that hosts externally reachable servers apart from the internal network.",
    explanationJa:
      "インターネットからアクセスされるWebサーバやメールサーバを、内部ネットワークとは別の区画に置きます。外部からはDMZの公開ポートだけを許可し、DMZから内部へは必要な通信だけを許可します。公開サーバが侵害されても、内部への横展開を遅らせられます。",
    explanationEn:
      "A DMZ limits the blast radius of a compromised public-facing server by isolating it from internal systems.",
    examUsage:
      "DMZは「サーバを置く常設の区画」、検疫ネットワークは「端末を検査する一時的な区画」です。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-firewall", "tech-quarantine-network", "tech-waf"],
    tags: ["ネットワーク", "境界防御"],
  },
  {
    id: "tech-quarantine-network",
    ja: "検疫ネットワーク",
    reading: "けんえきねっとわーく",
    en: "Quarantine Network",
    shortJa: "接続前の端末を一時的に隔離し、安全性を検査するための区画。",
    shortEn:
      "An isolated network where devices are checked for compliance before being admitted to the production network.",
    explanationJa:
      "社内ネットワークに接続しようとする端末を、OSの更新状況、マルウェア対策ソフトの定義ファイル、EDRの導入状況などの観点で検査し、合格するまで本番ネットワークから隔離します。NACやIEEE 802.1Xと組み合わせて実現します。来訪者や私物端末だけでなく、社員の端末も対象です。",
    explanationEn:
      "Quarantine networks enforce endpoint compliance at connection time and block unhealthy devices.",
    examUsage:
      "「検査に合格するまで社内LANに接続させない」は検疫ネットワークの説明です。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-dmz", "tech-mdm"],
    tags: ["ネットワーク", "端末管理"],
  },
  {
    id: "tech-ids",
    ja: "侵入検知システム",
    reading: "しんにゅうけんちしすてむ",
    en: "Intrusion Detection System",
    abbr: "IDS",
    shortJa: "通信やホストの挙動を監視し、不正の兆候を検知して通知する仕組み。",
    shortEn:
      "A monitoring system that detects suspicious activity and alerts administrators without blocking it.",
    explanationJa:
      "ネットワーク型はミラーポートなどで通信を複製して監視し、ホスト型はサーバや端末上の挙動を監視します。既知のパターンと照合するシグネチャ方式と、通常との差異で判断するアノマリ方式があります。検知して通知することが役割で、通信の遮断は行いません。",
    explanationEn:
      "IDS provides visibility and alerting; it is passive by design and does not stop traffic.",
    examUsage:
      "「検知するが遮断はしない」がIDS、「検知して遮断する」がIPSです。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-ips", "tech-siem"],
    tags: ["ネットワーク", "監視"],
  },
  {
    id: "tech-ips",
    ja: "侵入防止システム",
    reading: "しんにゅうぼうししすてむ",
    en: "Intrusion Prevention System",
    abbr: "IPS",
    shortJa: "通信経路上で不正な通信を検知し、その場で遮断する仕組み。",
    shortEn:
      "An inline system that detects malicious traffic and blocks it in real time.",
    explanationJa:
      "通信経路上にインラインで配置し、シグネチャやアノマリの判定に基づいて該当する通信を遮断します。自動で攻撃を止められる一方、誤検知が正規の業務通信を止めるおそれがあります。導入時は検知のみの運用で誤検知を確認し、段階的に遮断へ移行します。",
    explanationEn:
      "IPS blocks attacks automatically but introduces availability risk when signatures produce false positives.",
    examUsage:
      "IPSは可用性への影響と隣り合わせである点が、科目Bの事例で問われます。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-ids", "tech-firewall", "tech-dmz"],
    tags: ["ネットワーク", "監視"],
  },
  {
    id: "tech-waf",
    ja: "Webアプリケーションファイアウォール",
    reading: "うぇぶあぷりけーしょんふぁいあうぉーる",
    en: "Web Application Firewall",
    abbr: "WAF",
    shortJa: "HTTP/HTTPSの内容を検査し、Webアプリケーションへの攻撃を遮断する仕組み。",
    shortEn:
      "A proxy or inline device that inspects HTTP requests and responses for application-layer attacks.",
    explanationJa:
      "SQLインジェクションやクロスサイトスクリプティングなど、アプリケーション層の攻撃パターンを検査して遮断します。リバースプロキシ型、インライン型、クラウド型などの形態があります。既知のパターンには有効ですが、アプリケーション固有の認可の欠落やビジネスロジックの悪用は検知できません。",
    explanationEn:
      "A WAF mitigates known attack patterns but cannot replace secure implementation and authorization checks.",
    examUsage:
      "「WAFを導入すればアプリの脆弱性は不要になる」は誤りです。緩和策であり、根本対策は実装の修正です。",
    lessonIds: ["tech/network", "tech/app-logging"],
    relatedTermIds: ["tech-firewall", "tech-secure-coding", "tech-output-escaping"],
    tags: ["ネットワーク", "Web", "境界防御"],
  },
  {
    id: "tech-vpn",
    ja: "VPN",
    reading: "ぶいぴーえぬ",
    en: "Virtual Private Network",
    abbr: "VPN",
    shortJa: "公衆網の上に、暗号化された論理的な専用通信路を作る技術。",
    shortEn:
      "An encrypted logical tunnel over a public network that connects sites or remote users.",
    explanationJa:
      "拠点間を結ぶ方式と、端末から社内へ接続するリモートアクセス方式があります。IPsecを使うものと、TLSを使うSSL-VPNがあります。通信路は暗号化されますが、接続する端末の安全性は別に確認する必要があり、検疫や端末管理と組み合わせます。",
    explanationEn:
      "VPNs protect data in transit; they do not by themselves make an endpoint trustworthy.",
    examUsage:
      "VPNは「通信経路の保護」、端末の健全性確認は「検疫・MDM」と役割を分けます。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-ipsec", "tech-tls", "tech-quarantine-network"],
    tags: ["ネットワーク", "暗号化"],
  },
  {
    id: "tech-tls",
    ja: "TLS",
    reading: "てぃーえるえす",
    en: "Transport Layer Security",
    abbr: "TLS",
    shortJa: "通信の暗号化・完全性の検証・サーバ認証を提供するプロトコル。",
    shortEn:
      "A protocol providing encrypted, integrity-protected, and authenticated transport sessions.",
    explanationJa:
      "ハンドシェイクでサーバ証明書を検証し、鍵交換によって共通鍵を共有したうえで、以降の通信を暗号化します。証明書の検証は認証局の電子署名をたどって行い、通信データの完全性はMACまたはAEADで担保します。TLS 1.3では鍵交換が(EC)DHEに限定され、1往復で完了します。",
    explanationEn:
      "TLS authenticates the server through certificate validation and protects records with symmetric keys.",
    examUsage:
      "証明書検証（電子署名）と、通信の完全性（MAC/AEAD）を混同しないことが頻出です。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-ipsec", "tech-ssh", "tech-dkim"],
    tags: ["暗号化", "プロトコル"],
  },
  {
    id: "tech-ipsec",
    ja: "IPsec",
    reading: "あいぴーせっく",
    en: "IP Security",
    abbr: "IPsec",
    shortJa: "IP層で通信を認証・暗号化するプロトコル群。",
    shortEn:
      "A suite of protocols that authenticates and encrypts IP packets, commonly used for site-to-site VPNs.",
    explanationJa:
      "拠点間のVPNで広く使われ、AHとESPという2つのプロトコルを持ちます。AHは認証と完全性の保護を行い、暗号化は行いません。ESPは暗号化と認証の両方を行います。接続の確立にはIKEを使い、トンネルモードでは元のIPパケットを丸ごと保護します。",
    explanationEn:
      "IPsec ESP provides confidentiality and integrity at the IP layer; AH provides integrity only.",
    examUsage:
      "「AHは暗号化しない」は狙われやすい知識です。暗号化が必要ならESPを選びます。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-vpn", "tech-tls"],
    tags: ["暗号化", "プロトコル"],
  },
  {
    id: "tech-ssh",
    ja: "SSH",
    reading: "えすえすえいち",
    en: "Secure Shell",
    abbr: "SSH",
    shortJa: "暗号化された通信路でサーバを遠隔操作するプロトコル。",
    shortEn:
      "A protocol for encrypted remote login and file transfer, replacing insecure Telnet and FTP.",
    explanationJa:
      "パスワード認証だけでなく公開鍵認証を利用でき、接続先サーバの正当性はホスト鍵で確認します。ポートフォワーディングによる通信の転送や、SFTP・SCPによるファイル転送にも使われます。公開鍵の秘密鍵は端末上で厳重に管理し、パスフレーズを設定します。",
    explanationEn:
      "SSH secures remote administration through encryption and server host key verification.",
    examUsage:
      "Telnetの置き換えとして整理し、ホスト鍵の確認を省略しないことが重要です。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-tls", "tech-vpn"],
    tags: ["プロトコル", "暗号化"],
  },
  {
    id: "tech-wpa3",
    ja: "WPA3",
    reading: "だぶりゅーぴーえーすりー",
    en: "Wi-Fi Protected Access 3",
    abbr: "WPA3",
    shortJa: "SAEを用いて辞書攻撃に強めた無線LANの暗号化規格。",
    shortEn:
      "A Wi-Fi security standard that uses SAE to resist offline dictionary attacks on pre-shared keys.",
    explanationJa:
      "WPA2-PersonalのPSK方式は、通信を傍受して得た情報からパスワードをオフラインで推測される余地がありました。WPA3-PersonalはSAE（Simultaneous Authentication of Equals）を用い、通信から推測に使える情報を得にくくします。オープンネットワーク向けにはOWEによる暗号化もあります。",
    explanationEn:
      "WPA3 strengthens passphrase-based Wi-Fi against offline guessing and adds encryption for open networks via OWE.",
    examUsage:
      "WPA3は「暗号方式の強化」であり、認証局や証明書とは直接関係しません。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-tls", "tech-vpn"],
    tags: ["無線LAN", "暗号化"],
  },
  {
    id: "tech-smtp-auth",
    ja: "SMTP-AUTH",
    reading: "えすえむてぃーぴーおーす",
    en: "SMTP Authentication",
    abbr: "SMTP-AUTH",
    shortJa: "メール送信時に利用者を認証する仕組み。",
    shortEn:
      "An SMTP extension that requires the sender to authenticate before the server accepts mail for relay.",
    explanationJa:
      "メール送信時に利用者名とパスワードなどで認証を行い、認証された利用者だけが外部宛のメールを送信できるようにします。不正な中継（オープンリレー）や、部外者による送信を防ぎます。OP25Bと組み合わせ、正規のメールサーバ経由の送信を徹底します。",
    explanationEn:
      "SMTP-AUTH authenticates senders so that only authorized users can relay mail through the server.",
    examUsage:
      "SMTP-AUTHは「送信者の認証」、SPF/DKIM/DMARCは「送信ドメインの検証」です。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-spf", "tech-dkim", "tech-dmarc"],
    tags: ["メール", "認証"],
  },
  {
    id: "tech-spf",
    ja: "SPF",
    reading: "えすぴーえふ",
    en: "Sender Policy Framework",
    abbr: "SPF",
    shortJa: "送信元IPアドレスをDNSに登録し、送信ドメインのなりすましを抑止する仕組み。",
    shortEn:
      "A DNS-based mechanism that declares which IP addresses are allowed to send mail for a domain.",
    explanationJa:
      "ドメインのDNSに、そのドメインのメールを送信してよいサーバのIPアドレスを列挙します。受信側はエンベロープFromのドメインと送信元IPを照合します。メール転送の途中で送信元が変わると失敗しやすいため、単独では完全ななりすまし対策になりません。",
    explanationEn:
      "SPF validates the sending IP against a DNS policy but can break when messages are forwarded.",
    examUsage:
      "SPFは「IPアドレス」の検証、DKIMは「署名」の検証と区別します。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-dkim", "tech-dmarc", "tech-smtp-auth"],
    tags: ["メール", "なりすまし"],
  },
  {
    id: "tech-dkim",
    ja: "DKIM",
    reading: "でぃーきむ",
    en: "DomainKeys Identified Mail",
    abbr: "DKIM",
    shortJa: "送信ドメインの秘密鍵でメールに署名し、受信側が公開鍵で検証する仕組み。",
    shortEn:
      "A signature scheme that lets the receiving side verify that a message was signed for the claimed domain.",
    explanationJa:
      "メールの本文と一部のヘッダのハッシュに、送信ドメインの秘密鍵で署名します。受信側はDNSに公開された公開鍵で署名を検証し、改ざんの有無とドメインの正当性を確認します。転送に対して比較的強い一方、署名鍵の管理と、署名後の改変への対応が必要です。",
    explanationEn:
      "DKIM signs message content so receivers can detect modification and validate the signing domain.",
    examUsage:
      "DKIMは「改ざん検知」と「ドメインの正当性」、電子署名の一種として理解します。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-spf", "tech-dmarc", "tech-tls"],
    tags: ["メール", "電子署名"],
  },
  {
    id: "tech-dmarc",
    ja: "DMARC",
    reading: "でぃーまーく",
    en: "Domain-based Message Authentication, Reporting and Conformance",
    abbr: "DMARC",
    shortJa: "SPFとDKIMの結果と表示上のFromを照合し、失敗時の扱いを宣言する仕組み。",
    shortEn:
      "A policy framework that aligns SPF and DKIM with the visible From domain and tells receivers how to handle failures.",
    explanationJa:
      "SPFまたはDKIMが成功し、かつFromヘッダのドメインと整合しているかを評価します。失敗したメールを拒否・隔離・監視のどれにするかをDNSで宣言し、受信側はレポートを送ります。いきなり拒否にすると正規メールも失われるため、監視から段階的に強めます。",
    explanationEn:
      "DMARC ties SPF and DKIM results to the visible From domain and publishes a handling policy.",
    examUsage:
      "DMARCは「暗号化」ではなく「なりすまし対策のポリシー」です。",
    lessonIds: ["tech/network"],
    relatedTermIds: ["tech-spf", "tech-dkim"],
    tags: ["メール", "なりすまし"],
  },

  // ── エンドポイントとクラウド ───────────────────────────
  {
    id: "tech-epp",
    ja: "エンドポイント保護プラットフォーム",
    reading: "えんどぽいんとほごぷらっとふぉーむ",
    en: "Endpoint Protection Platform",
    abbr: "EPP",
    shortJa: "端末上でマルウェアの実行を防ぎ、感染を未然に遮断する製品群。",
    shortEn:
      "Endpoint security software focused on preventing malicious execution and blocking threats.",
    explanationJa:
      "定義ファイルとの照合やビヘイビア分析を用いて、マルウェアの実行や不審な動作を実行前・実行時に遮断します。近年の製品はEDR機能を併せ持つものが多く、検知した事象の調査や隔離までを一つの管理画面で行えます。",
    explanationEn:
      "EPP emphasizes prevention, while EDR emphasizes detection, investigation, and response.",
    examUsage:
      "EPPは「予防」、EDRは「検知・調査・対応」と役割を分けて理解します。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-edr", "tech-pattern-file", "tech-behavior-detection"],
    tags: ["エンドポイント", "マルウェア"],
  },
  {
    id: "tech-edr",
    ja: "エンドポイント検知・対応",
    reading: "えんどぽいんとけんちたいおう",
    en: "Endpoint Detection and Response",
    abbr: "EDR",
    shortJa: "端末上の挙動を記録し、侵害の検知・調査・封じ込めを行う仕組み。",
    shortEn:
      "A solution that records endpoint activity and supports detecting, investigating, and containing intrusions.",
    explanationJa:
      "プロセスの起動、ファイル操作、ネットワーク通信などを継続的に記録し、不審な振る舞いを検知します。管理者は感染の経路や横展開をさかのぼって調査し、該当端末のネットワーク隔離やプロセスの停止を行えます。記録を取るため、未知のマルウェアへの対応に強い反面、運用と分析の負荷が伴います。",
    explanationEn:
      "EDR provides the telemetry and response actions needed to investigate incidents that prevention alone misses.",
    examUsage:
      "「感染後の調査と隔離」を目的とするのがEDRです。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-epp", "tech-behavior-detection", "tech-sandbox"],
    tags: ["エンドポイント", "監視"],
  },
  {
    id: "tech-pattern-file",
    ja: "定義ファイル",
    reading: "ていぎふぁいる",
    en: "Signature File",
    shortJa: "既知のマルウェアの特徴を記録し、検体との照合に使うデータ。",
    shortEn:
      "A database of known malware signatures used for matching during scans.",
    explanationJa:
      "パターンファイルとも呼ばれ、既知のマルウェアのコードやハッシュの特徴を保持します。検知精度は高い一方、定義ファイルの更新前に現れた未知の検体や、特徴を変えた検体には対応できません。更新の配布遅延と、更新されていない端末の存在が弱点になります。",
    explanationEn:
      "Signature files are effective against known malware but blind to new or heavily modified samples.",
    examUsage:
      "「定義ファイルを最新にすれば未知のマルウェアも防げる」は誤りです。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-epp", "tech-heuristic", "tech-behavior-detection"],
    tags: ["マルウェア", "検知"],
  },
  {
    id: "tech-behavior-detection",
    ja: "ビヘイビア検知",
    reading: "びへいびあけんち",
    en: "Behavior Detection",
    shortJa: "プログラムの実行時の振る舞いから不審な活動を検知する方式。",
    shortEn:
      "Detecting malicious activity by observing runtime behavior rather than matching known code.",
    explanationJa:
      "ファイルの暗号化、権限の昇格、外部への通信、他のプロセスの改変など、攻撃に共通する振る舞いを監視します。未知のマルウェアにも対応できますが、正規の業務ソフトウェアの動作を誤検知する場合があります。振る舞いの基準を環境に合わせて調整することが運用上重要です。",
    explanationEn:
      "Behavior detection catches novel malware but requires tuning to limit false positives.",
    examUsage:
      "「暗号化処理を連続して行うプロセスを検知する」はビヘイビア検知の例です。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-heuristic", "tech-sandbox", "tech-edr"],
    tags: ["マルウェア", "検知"],
  },
  {
    id: "tech-heuristic",
    ja: "ヒューリスティック検知",
    reading: "ひゅーりすてぃっくけんち",
    en: "Heuristic Detection",
    shortJa: "コードの特徴や類似性から、未知のマルウェアの可能性を推定する方式。",
    shortEn:
      "Estimating whether code is malicious from structural features and similarity to known threats.",
    explanationJa:
      "既知の検体と完全一致しなくても、難読化のパターンや不審なAPI呼び出しなどから脅威の可能性を判断します。未知の検体に一定の対応ができる一方、誤検知と見逃しの両方が起こり得ます。単独ではなく、ビヘイビア検知やサンドボックスと組み合わせて使います。",
    explanationEn:
      "Heuristics generalize from known patterns and therefore trade some accuracy for coverage of unknown threats.",
    examUsage:
      "「未知のマルウェアを推測して検知する」はヒューリスティックまたはビヘイビアです。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-behavior-detection", "tech-pattern-file", "tech-sandbox"],
    tags: ["マルウェア", "検知"],
  },
  {
    id: "tech-sandbox",
    ja: "サンドボックス",
    reading: "さんどぼっくす",
    en: "Sandbox",
    shortJa: "隔離した環境で検体を実行し、その挙動を観察する仕組み。",
    shortEn:
      "An isolated environment where suspicious files are executed and observed safely.",
    explanationJa:
      "業務端末やサーバとは切り離した仮想環境でファイルを実行し、通信先やファイル変更などの挙動を記録します。未知のマルウェアの分析に有効ですが、実行完了まで時間がかかること、仮想環境を検知して挙動を変えるマルウェアが存在することが限界です。",
    explanationEn:
      "Sandboxes reveal runtime behavior safely but can be evaded by malware that detects analysis environments.",
    examUsage:
      "メール添付ファイルの事前検査など、実行を伴う検査として整理します。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-behavior-detection", "tech-edr"],
    tags: ["マルウェア", "分析"],
  },
  {
    id: "tech-mdm",
    ja: "モバイルデバイス管理",
    reading: "もばいるでばいすかんり",
    en: "Mobile Device Management",
    abbr: "MDM",
    shortJa: "スマートフォンやノートPCの構成・暗号化・アプリを一元管理する仕組み。",
    shortEn:
      "Centralized management of device configuration, encryption, applications, and remote actions.",
    explanationJa:
      "端末に管理プロファイルを配布し、パスコードの強制、ストレージの暗号化、アプリの配布制限、紛失時のリモートワイプを行います。BYODでは私的データと業務データの境界を設計する必要があり、アプリ単位で管理するMAMやコンテナ分離を併用します。",
    explanationEn:
      "MDM enforces device-level policy and enables remote actions, but BYOD requires careful separation of personal data.",
    examUsage:
      "MDMは「端末全体」、MAMは「業務アプリとそのデータ」を管理する点で区別します。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-dlp", "tech-crypto-erase", "tech-quarantine-network"],
    tags: ["端末管理", "クラウド"],
  },
  {
    id: "tech-dlp",
    ja: "情報漏えい防止",
    reading: "じょうほうろうえいぼうし",
    en: "Data Loss Prevention",
    abbr: "DLP",
    shortJa: "機密情報の外部送信を検査し、持ち出しを検知・阻止する仕組み。",
    shortEn:
      "Inspecting outbound content and blocking or logging movements of sensitive data.",
    explanationJa:
      "個人情報や機密区分の高い情報をパターンやラベルで識別し、メール、Web、USB、クラウドストレージへの送信を検査します。端末側、ネットワーク側、クラウド側の設置点があります。誤検知が多いと業務を妨げるため、検知から開始してルールを調整します。",
    explanationEn:
      "DLP identifies sensitive content and controls where it can be sent, requiring careful tuning to avoid disrupting work.",
    examUsage:
      "DLPは「中身の検査」、ファイアウォールは「通信の制御」です。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-usb-control", "tech-mdm", "tech-tenant-isolation"],
    tags: ["データ保護", "端末管理"],
  },
  {
    id: "tech-crypto-erase",
    ja: "暗号化消去",
    reading: "あんごうかしょうきょ",
    en: "Cryptographic Erase",
    shortJa: "暗号化されたストレージの鍵を破棄し、短時間でデータを読めなくする方法。",
    shortEn:
      "Destroying the encryption key so that the data on a device becomes unreadable almost immediately.",
    explanationJa:
      "あらかじめストレージ全体を暗号化しておき、廃棄や返却の際に鍵を破棄します。物理破壊に比べて時間とコストがかからず、媒体を再利用できる利点があります。ただし、暗号化されていない領域や外部媒体にデータが残る可能性があるため、対象範囲の確認が必要です。",
    explanationEn:
      "Cryptographic erase is fast and supports media reuse, but only if all data resides in encrypted volumes.",
    examUsage:
      "「鍵の破棄によってデータを復元不能にする」が暗号化消去です。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-key-management", "tech-mdm"],
    tags: ["データ保護", "端末管理"],
  },
  {
    id: "tech-usb-control",
    ja: "USBデバイス制御",
    reading: "ゆーえすびーでばいすせいぎょ",
    en: "USB Device Control",
    shortJa: "USBメモリなどの接続を許可制にし、感染と持ち出しを防ぐ統制。",
    shortEn:
      "Allowing only approved removable devices and blocking unauthorized USB connections.",
    explanationJa:
      "許可した機器の識別情報を登録し、それ以外の接続を拒否します。私物USBからのマルウェア感染と、機密情報の持ち出しの両方を抑止できます。業務上必要な機器には暗号化USBを限定して許可するなど、利便性とのバランスを設計します。",
    explanationEn:
      "USB control reduces both malware introduction and data exfiltration through removable media.",
    examUsage:
      "「私物USBの接続を禁止する」はUSBデバイス制御の例です。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-dlp", "tech-mdm"],
    tags: ["端末管理", "データ保護"],
  },
  {
    id: "tech-shared-responsibility",
    ja: "責任共有モデル",
    reading: "せきにんきょうゆうもでる",
    en: "Shared Responsibility Model",
    shortJa: "クラウドのセキュリティ責任を事業者と利用者で分担する考え方。",
    shortEn:
      "The division of security responsibilities between a cloud provider and its customers.",
    explanationJa:
      "事業者は物理施設、ハードウェア、仮想化層など基盤のセキュリティを担い、利用者はデータ、アカウント、アクセス設定、利用するサービスの設定を担います。サービスモデルがIaaSからPaaS、SaaSへ上がるほど事業者の範囲は広がりますが、データとアクセス設定は常に利用者の責任です。",
    explanationEn:
      "Providers secure the cloud infrastructure; customers remain responsible for their data, identities, and configuration.",
    examUsage:
      "「クラウドは事業者がすべて守る」は誤り。責任分界はサービスモデルごとに変わります。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-cloud-service-model", "tech-tenant-isolation", "tech-cspm"],
    tags: ["クラウド", "責任分界"],
  },
  {
    id: "tech-tenant-isolation",
    ja: "テナント分離",
    reading: "てなんとぶんり",
    en: "Tenant Isolation",
    shortJa: "同一基盤を利用する複数の利用者（テナント）のデータと処理を分離すること。",
    shortEn:
      "Separating the data and workloads of different customers that share the same cloud infrastructure.",
    explanationJa:
      "クラウド事業者は、仮想化層やネットワーク、ストレージのレベルでテナント間の分離を実装します。利用者側の設定ミス（共有範囲の誤り、認証情報の漏えい）によって、意図せず他テナントからアクセス可能な状態を作ってしまう場合があります。機密性の高い処理では専有オプションも検討します。",
    explanationEn:
      "Isolation is provided by the platform, but customer configuration errors can still expose data across tenants.",
    examUsage:
      "テナント分離は事業者の対策であると同時に、利用者の設定管理が前提になります。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-shared-responsibility", "tech-cloud-service-model", "tech-cspm"],
    tags: ["クラウド", "分離"],
  },
  {
    id: "tech-cloud-service-model",
    ja: "クラウドサービスモデル",
    reading: "くらうどさーびすもでる",
    en: "Cloud Service Models",
    shortJa: "IaaS・PaaS・SaaSという、提供範囲によるクラウドの分類。",
    shortEn:
      "The IaaS, PaaS, and SaaS categories that describe how much of the stack the provider manages.",
    explanationJa:
      "IaaSは仮想マシンやストレージなどの基盤を提供し、利用者はOS以上を管理します。PaaSは実行環境やデータベースを提供し、利用者はアプリケーションとデータを管理します。SaaSはアプリケーションを提供し、利用者は利用設定とデータを管理します。管理範囲が広がるほど、利用者の責任は小さくなります。",
    explanationEn:
      "The service model determines the boundary of management responsibility between provider and customer.",
    examUsage:
      "「OSのパッチを誰が当てるか」をサービスモデルごとに整理すると判断しやすくなります。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-shared-responsibility", "tech-region", "tech-tenant-isolation"],
    tags: ["クラウド", "基礎"],
  },
  {
    id: "tech-region",
    ja: "リージョン",
    reading: "りーじょん",
    en: "Region",
    shortJa: "クラウドのデータセンターが位置する地理的な区域。",
    shortEn:
      "A geographic area in which a cloud provider operates data centers and stores customer data.",
    explanationJa:
      "データが保存される場所を決める単位で、遅延、災害対策、法規制、データの越境移転の観点から選択します。バックアップや複製が別リージョンに作られる場合があるため、保存場所は設定だけでなく契約と実際の構成を確認します。",
    explanationEn:
      "Region choice affects latency, resilience, and legal constraints on where data may be stored.",
    examUsage:
      "「データの保存場所」を問う設問では、リージョンとバックアップ先の両方を確認します。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-cloud-service-model", "tech-shared-responsibility"],
    tags: ["クラウド", "データ所在地"],
  },
  {
    id: "tech-cspm",
    ja: "クラウドセキュリティ態勢管理",
    reading: "くらうどせきゅりてぃたいせいかんり",
    en: "Cloud Security Posture Management",
    abbr: "CSPM",
    shortJa: "クラウド設定の不備を継続的に検出し、是正を支援する仕組み。",
    shortEn:
      "Continuous detection and remediation support for misconfigured cloud resources.",
    explanationJa:
      "公開されたストレージ、過剰な権限、MFA未設定、暗号化の欠如といった設定不備を、定義したポリシーに照らして継続的に検査します。クラウドの設定は変更が速く、構築時のレビューだけでは漏れるため、定期的な診断と自動修復を組み合わせます。",
    explanationEn:
      "CSPM continuously checks cloud configuration against policy because manual review cannot keep pace with change.",
    examUsage:
      "「構築後に設定が変更され、公開状態になった」という事故への対策として挙げられます。",
    lessonIds: ["tech/endpoint-cloud"],
    relatedTermIds: ["tech-shared-responsibility", "tech-tenant-isolation", "tech-dlp"],
    tags: ["クラウド", "設定管理"],
  },

  // ── アプリケーションとログ ─────────────────────────────
  {
    id: "tech-secure-coding",
    ja: "セキュアプログラミング",
    reading: "せきゅあぷろぐらみんぐ",
    en: "Secure Coding",
    shortJa: "脆弱性を作り込まないために、設計・実装段階で守る開発手法。",
    shortEn:
      "Development practices that prevent vulnerabilities from being introduced during design and implementation.",
    explanationJa:
      "入力の検証、出力のエスケープ、認可のサーバ側確認、安全なエラー処理、依存ライブラリの管理などを、開発標準として徹底します。実装後の検査だけに頼らず、設計段階での脅威分析とコードレビューを組み合わせることで、修正コストの高い手戻りを減らします。",
    explanationEn:
      "Secure coding shifts security work into design and implementation, where fixes are cheaper than after release.",
    examUsage:
      "「開発標準の策定」「コードレビュー」「静的解析」がセキュアプログラミングの統制です。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-input-validation", "tech-output-escaping", "tech-sca"],
    tags: ["アプリケーション", "開発"],
  },
  {
    id: "tech-input-validation",
    ja: "入力検証",
    reading: "にゅうりょくけんしょう",
    en: "Input Validation",
    shortJa: "受け取るデータが想定した形式・範囲に合致するか確認すること。",
    shortEn:
      "Checking that incoming data matches the expected type, length, format, and range.",
    explanationJa:
      "許可した文字種・長さ・範囲だけを受け付ける許可リスト方式を基本とします。クライアント側の検証は操作性のために行うものであり、改変できるため、サーバ側で必ず再検証します。入力段階での一律な文字除去は、正当な入力の破壊や、別の文脈での脆弱性につながります。",
    explanationEn:
      "Server-side allowlist validation is mandatory because client-side checks can be bypassed.",
    examUsage:
      "入力検証は「受け付ける値の妥当性」、出力エスケープは「出力先での安全な埋め込み」です。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-output-escaping", "tech-secure-coding"],
    tags: ["アプリケーション", "検証"],
  },
  {
    id: "tech-output-escaping",
    ja: "出力エスケープ",
    reading: "しゅつりょくえすけーぷ",
    en: "Output Escaping",
    shortJa: "出力先の文脈に応じて、データを安全な形式に変換して埋め込むこと。",
    shortEn:
      "Encoding data for its output context so that it cannot be interpreted as code.",
    explanationJa:
      "HTML本文、属性値、JavaScript、URL、SQLといった出力先ごとに、意味を持つ文字を無害化します。クロスサイトスクリプティングは、入力の問題ではなく出力の問題として捉えるのが正しい理解です。テンプレートエンジンの自動エスケープを有効にし、無効化する箇所を最小限にします。",
    explanationEn:
      "Context-specific output encoding is the primary defense against cross-site scripting.",
    examUsage:
      "「HTMLエスケープをすればどの文脈でも安全」は誤りです。文脈ごとに方式が異なります。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-input-validation", "tech-secure-coding", "tech-waf"],
    tags: ["アプリケーション", "XSS"],
  },
  {
    id: "tech-sbom",
    ja: "SBOM",
    reading: "えすぼむ",
    en: "Software Bill of Materials",
    abbr: "SBOM",
    shortJa: "ソフトウェアに含まれる部品とバージョンの一覧。",
    shortEn:
      "A machine-readable inventory of the components and versions that make up a software product.",
    explanationJa:
      "利用しているOSSやライブラリの名称、バージョン、供給元、依存関係を記録します。脆弱性が公表されたときに、影響を受けるシステムを迅速に特定するために使います。SPDXやCycloneDXといった形式で生成し、新しい部品を追加するたびに更新します。",
    explanationEn:
      "An SBOM makes it possible to answer quickly which systems contain a newly disclosed vulnerable component.",
    examUsage:
      "SBOMは「構成部品の一覧」、SCAは「依存関係の脆弱性検査」です。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-sca", "tech-secure-coding"],
    tags: ["サプライチェーン", "開発"],
  },
  {
    id: "tech-sca",
    ja: "ソフトウェア構成分析",
    reading: "そふとうぇあこうせいぶんせき",
    en: "Software Composition Analysis",
    abbr: "SCA",
    shortJa: "依存ライブラリの脆弱性とライセンスを検査する手法。",
    shortEn:
      "Analyzing third-party dependencies for known vulnerabilities and license obligations.",
    explanationJa:
      "アプリケーションが取り込んでいるOSSや外部ライブラリを特定し、既知の脆弱性情報と照合します。あわせてライセンス条件の確認も行います。開発パイプラインに組み込み、依存関係を追加した時点で検査できるようにすると、後工程での手戻りを減らせます。",
    explanationEn:
      "SCA finds vulnerable or improperly licensed dependencies before they reach production.",
    examUsage:
      "「OSSの脆弱性を管理する」文脈ではSCAとSBOMがセットで登場します。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-sbom", "tech-secure-coding"],
    tags: ["サプライチェーン", "開発"],
  },
  {
    id: "tech-audit-log",
    ja: "監査ログ",
    reading: "かんさろぐ",
    en: "Audit Log",
    shortJa: "誰がいつ何をしたかを追跡できるように記録したログ。",
    shortEn:
      "Records of who did what and when, kept for accountability and investigation.",
    explanationJa:
      "認証の成功・失敗、権限の変更、データへのアクセス、管理操作などを記録します。インシデント調査では、侵入の入口、横展開、影響範囲を推定する材料になります。記録すべき項目と保存期間をあらかじめ定め、改ざんされない場所へ転送します。",
    explanationEn:
      "Audit logs provide accountability and the evidence needed to reconstruct an incident.",
    examUsage:
      "「行為者を特定する」「操作の痕跡を残す」は監査ログの目的です。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-log-retention", "tech-siem", "tech-log-integrity"],
    tags: ["ログ", "監査"],
  },
  {
    id: "tech-log-retention",
    ja: "ログ保存期間",
    reading: "ろぐほぞんきかん",
    en: "Log Retention Period",
    shortJa: "ログを保持しておく期間。用途・法令・容量から設計する。",
    shortEn:
      "The period for which logs are kept, determined by investigation needs, regulation, and storage cost.",
    explanationJa:
      "日常監視には直近数週間、インシデント調査や監査対応には数か月から1年、長期の傾向分析にはそれ以上が必要になります。保存期間を短くしすぎると、侵害の発見が遅れた場合に原因を追えません。個人情報を含むログは、目的外利用を避けるためのマスキングとアクセス制限を伴います。",
    explanationEn:
      "Retention must balance investigative needs, legal requirements, privacy risk, and storage cost.",
    examUsage:
      "「容量が大きいから3日で削除する」は調査能力を損なう設計として問われます。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-audit-log", "tech-log-integrity", "tech-worm"],
    tags: ["ログ", "運用"],
  },
  {
    id: "tech-ntp",
    ja: "NTP",
    reading: "えぬてぃーぴー",
    en: "Network Time Protocol",
    abbr: "NTP",
    shortJa: "ネットワーク上の機器の時刻を同期させるプロトコル。",
    shortEn:
      "A protocol that synchronizes clocks across networked devices.",
    explanationJa:
      "複数の機器のログを突き合わせるには、時刻の一貫性が不可欠です。NTPで基準時刻に同期し、タイムゾーンの設定も統一します。なりすましを防ぐにはNTS（Network Time Security）によるサーバ認証を併用します。時刻が数分ずれるだけで、相関分析は成立しなくなります。",
    explanationEn:
      "Accurate, consistent time is a prerequisite for correlating logs across systems.",
    examUsage:
      "ログ管理の設問で「時刻同期」が出たら、NTPとUTC統一が要点です。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-siem", "tech-correlation-analysis"],
    tags: ["ログ", "時刻"],
  },
  {
    id: "tech-siem",
    ja: "SIEM",
    reading: "しーむ",
    en: "Security Information and Event Management",
    abbr: "SIEM",
    shortJa: "多様なログを集約・正規化し、相関分析とアラートを行う仕組み。",
    shortEn:
      "A platform that collects, normalizes, correlates, and alerts on security events from many sources.",
    explanationJa:
      "サーバ、ネットワーク機器、クラウド、認証基盤などのログを一元的に収集し、共通の形式に正規化します。相関ルールによって単体では目立たない事象の組み合わせを検知し、ダッシュボードとアラートを提供します。ログの網羅性と時刻の正確さが分析品質を左右します。",
    explanationEn:
      "SIEM turns scattered logs into correlated alerts, but its value depends on source coverage and time accuracy.",
    examUsage:
      "SIEMは「収集・正規化・相関」、EDRは「端末の挙動」と守備範囲が異なります。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-correlation-analysis", "tech-audit-log", "tech-ntp"],
    tags: ["ログ", "監視"],
  },
  {
    id: "tech-correlation-analysis",
    ja: "相関分析",
    reading: "そうかんぶんせき",
    en: "Correlation Analysis",
    shortJa: "複数のログや事象を組み合わせ、攻撃の兆候を判断する分析。",
    shortEn:
      "Combining events from multiple sources to identify attack patterns that single events would not reveal.",
    explanationJa:
      "認証失敗の連続の後に成功した、権限変更の直後に新しいAPIキーが作られた、といった時系列と主体の関係を評価します。単体のログでは正常に見える行為も、組み合わせで意味を持ちます。ルールを増やしすぎると誤検知が増え、アラート疲れを招きます。",
    explanationEn:
      "Correlation adds context across sources but must be tuned to avoid alert fatigue.",
    examUsage:
      "「複数のログを突き合わせて判断する」が相関分析です。単一ログの監視とは区別します。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-siem", "tech-ntp", "tech-audit-log"],
    tags: ["ログ", "分析"],
  },
  {
    id: "tech-log-integrity",
    ja: "ログの完全性",
    reading: "ろぐのかんぜんせい",
    en: "Log Integrity",
    shortJa: "ログが改ざん・削除されていないことを確保し、検知できる状態にすること。",
    shortEn:
      "Ensuring logs are complete and unaltered, and that tampering can be detected.",
    explanationJa:
      "生成元とは別のホストへリアルタイムに転送し、追記のみ可能な保存域に置きます。ハッシュチェーンや電子署名、タイムスタンプを用いて、改ざんの検知と存在時刻の証明を行います。ハッシュ値もログと同じ場所に置くと一緒に書き換えられるため、外部への退避が必要です。",
    explanationEn:
      "Log integrity requires off-host storage plus cryptographic evidence such as signatures or timestamps.",
    examUsage:
      "「ハッシュは改ざん検知、電子署名は真正性と否認防止」と役割を分けます。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-worm", "tech-audit-log", "tech-log-retention"],
    tags: ["ログ", "完全性"],
  },
  {
    id: "tech-worm",
    ja: "WORM",
    reading: "わーむ",
    en: "Write Once Read Many",
    abbr: "WORM",
    shortJa: "一度書き込んだデータを上書き・削除できない保存方式。",
    shortEn:
      "A storage mode in which written data cannot be modified or deleted for a retention period.",
    explanationJa:
      "ログやバックアップの保存域に用い、保持期間中の改ざんや削除を防ぎます。攻撃者が管理者権限を奪っても、保存済みのログを消せない構成にできます。クラウドのオブジェクトストレージでは、保持期間を固定する機能として提供されます。",
    explanationEn:
      "WORM storage protects log and backup evidence even if an attacker gains administrative access.",
    examUsage:
      "「改ざん防止」の文脈で、WORMは保存域の性質として整理します。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-log-integrity", "tech-log-retention"],
    tags: ["ログ", "保存"],
  },
  {
    id: "tech-zero-trust",
    ja: "ゼロトラスト",
    reading: "ぜろとらすと",
    en: "Zero Trust",
    shortJa: "境界の内外を問わず、アクセスごとに検証する考え方。",
    shortEn:
      "A security model that verifies every access request regardless of network location.",
    explanationJa:
      "社内ネットワークにいるという理由だけで信頼せず、利用者、端末、資源、状況を都度確認してアクセスを許可します。境界防御を廃止するのではなく、境界の内側の通信も検証の対象にします。アプリケーションでは、認可の徹底、セッション管理、最小権限が中心になります。",
    explanationEn:
      "Zero trust treats network location as insufficient evidence of trust and validates each request.",
    examUsage:
      "「社内LANからのアクセスは信頼する」という前提を置かない考え方です。",
    lessonIds: ["tech/app-logging"],
    relatedTermIds: ["tech-abac", "tech-least-privilege", "tech-tenant-isolation"],
    tags: ["原則", "アーキテクチャ"],
  },
];
