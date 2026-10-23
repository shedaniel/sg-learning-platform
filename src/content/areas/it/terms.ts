import type { GlossaryTerm } from "@/lib/content/types";

export const IT_TERMS = [
  {
    id: "it-tcpip",
    ja: "TCP/IP",
    reading: "ティーシーピーアイピー",
    en: "Transmission Control Protocol / Internet Protocol",
    shortJa: "インターネットで標準的に使われるプロトコル群。",
    shortEn: "The standard protocol suite used on the Internet.",
    explanationJa:
      "TCP/IPは、アプリケーション層、トランスポート層、インターネット層、ネットワークインタフェース層の4層からなるプロトコル群である。上位層のデータに下位層のヘッダーを付けるカプセル化によって、層ごとに役割を分離している。",
    explanationEn:
      "TCP/IP is a four-layer protocol suite. Each layer encapsulates data from the layer above, separating addressing, transport, and application concerns.",
    examUsage:
      "「TCPは信頼性、TLSは暗号化」と役割を分けて覚える。層の名称と代表プロトコルの対応が問われる。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-ip-address", "it-port-number", "it-https"],
    tags: ["ネットワーク", "プロトコル"],
  },
  {
    id: "it-ip-address",
    ja: "IPアドレス",
    reading: "アイピーアドレス",
    en: "IP address",
    shortJa: "ネットワーク上で機器を識別する番地。",
    shortEn: "An address that identifies a device on a network.",
    explanationJa:
      "IPv4は32ビット、IPv6は128ビットのアドレスを持つ。IPv4はネットワーク部とホスト部に分かれ、サブネットマスクで境界を定める。プライベートアドレスは組織内で利用でき、インターネット接続にはNAT/NAPTによる変換が必要になる。",
    explanationEn:
      "IPv4 uses 32-bit addresses and IPv6 uses 128 bits. A subnet mask separates the network and host portions. Private addresses require NAT/NAPT for Internet access.",
    examUsage:
      "プライベートアドレスの範囲（10/8、172.16/12、192.168/16）と、IPv6が128ビットであることが問われる。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-subnet-mask", "it-default-gateway", "it-tcpip"],
    tags: ["ネットワーク", "IPv4", "IPv6"],
  },
  {
    id: "it-subnet-mask",
    ja: "サブネットマスク",
    reading: "サブネットマスク",
    en: "Subnet mask",
    shortJa: "IPアドレスのネットワーク部の長さを示す値。",
    shortEn: "A value indicating how many leading bits identify the network.",
    explanationJa:
      "サブネットマスクは、IPアドレスのうちネットワーク部とホスト部の境界を示す。`255.255.255.192` は `/26` と同じ意味で、1ブロック64アドレス、収容ホスト62台となる。収容台数は 2^(32-プレフィックス長) - 2 で求める。",
    explanationEn:
      "The subnet mask defines the boundary between the network and host portions. A /26 mask (255.255.255.192) provides 64 addresses and 62 usable hosts.",
    examUsage:
      "ネットワークアドレス、ブロードキャストアドレス、収容台数の計算が頻出する。ネットワークアドレスとブロードキャストアドレスは端末に割り当てられない。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-ip-address", "it-default-gateway"],
    tags: ["ネットワーク", "計算問題"],
  },
  {
    id: "it-default-gateway",
    ja: "デフォルトゲートウェイ",
    reading: "デフォルトゲートウェイ",
    en: "Default gateway",
    shortJa: "自ネットワーク外へ通信する際の出口となる機器。",
    shortEn: "The router used to reach destinations outside the local network.",
    explanationJa:
      "デフォルトゲートウェイは、送信先が同一ネットワークにない場合に通信を転送するルータのIPアドレスである。通常はDHCPで配布される。偽のゲートウェイを配布されると通信が盗聴されるため、DHCPサーバの管理とスイッチポートの制限が重要になる。",
    explanationEn:
      "The default gateway is the router address used when the destination is outside the local subnet. It is commonly delivered by DHCP, which makes rogue DHCP servers a man-in-the-middle risk.",
    examUsage:
      "「同一サブネット内の通信には不要」「外部通信に必要」という条件で正誤を判断する。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-ip-address", "it-dhcp", "it-subnet-mask"],
    tags: ["ネットワーク", "ルータ"],
  },
  {
    id: "it-dns",
    ja: "DNS",
    reading: "ディーエヌエス",
    en: "Domain Name System",
    shortJa: "ドメイン名とIPアドレスを対応付ける仕組み。",
    shortEn: "The system that maps domain names to IP addresses.",
    explanationJa:
      "DNSは、ルートサーバからTLD、権威DNSサーバへと問い合わせをたどって名前を解決する。AはIPv4、AAAAはIPv6、MXはメール、CNAMEは別名を表す。応答はTTLの間キャッシュされる。DNSSECは応答の署名を検証し、改ざんを検知する。",
    explanationEn:
      "DNS resolves names by following referrals from the root to authoritative servers. Records include A, AAAA, MX, and CNAME. DNSSEC validates signatures; it does not encrypt traffic.",
    examUsage:
      "「DNSは暗号化する」は誤り。DNSSECは改ざん検知、DoH/DoTは通信の暗号化である。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-dhcp", "it-port-number", "it-https"],
    tags: ["ネットワーク", "名前解決"],
  },
  {
    id: "it-dhcp",
    ja: "DHCP",
    reading: "ディーエイチシーピー",
    en: "Dynamic Host Configuration Protocol",
    shortJa: "IPアドレスなどを自動的に配布するプロトコル。",
    shortEn: "A protocol that automatically assigns IP configuration to hosts.",
    explanationJa:
      "DHCPはIPアドレス、サブネットマスク、デフォルトゲートウェイ、DNSサーバを自動配布する。クライアントはDiscover、Offer、Request、Ackの順にやり取りする。リース期間を過ぎると再取得が必要になる。",
    explanationEn:
      "DHCP automatically provides an IP address, mask, gateway, and DNS servers. Clients use the DORA sequence, and leases must be renewed.",
    examUsage:
      "「配布されるのはIPアドレスだけ」は誤り。ゲートウェイとDNSも配布され、偽DHCPサーバによる経路の乗っ取りが成立する。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-ip-address", "it-default-gateway", "it-dns"],
    tags: ["ネットワーク", "自動設定"],
  },
  {
    id: "it-port-number",
    ja: "ポート番号",
    reading: "ポートばんごう",
    en: "Port number",
    shortJa: "同一IPアドレス上のサービスを識別する番号。",
    shortEn: "A number identifying a service on a host.",
    explanationJa:
      "ポート番号は0から65535まであり、0から1023がwell-known、1024から49151が登録済み、49152から65535が動的である。HTTPは80、HTTPSは443、SSHは22、RDPは3389など、用途ごとに標準的な番号が割り当てられている。",
    explanationEn:
      "Port numbers range from 0 to 65535. Well-known ports (0-1023) include HTTP 80, HTTPS 443, SSH 22, and RDP 3389.",
    examUsage:
      "ファイアウォールの許可設計とセットで問われる。443を開放しても宛先を限定しなければ持ち出しは防げない。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-tcpip", "it-https", "it-dns"],
    tags: ["ネットワーク", "ファイアウォール"],
  },
  {
    id: "it-https",
    ja: "HTTPS",
    reading: "エイチティーティーピーエス",
    en: "Hypertext Transfer Protocol Secure",
    shortJa: "HTTPをTLSで保護した通信。",
    shortEn: "HTTP protected by TLS.",
    explanationJa:
      "HTTPSはHTTPの通信をTLSで暗号化し、改ざん検知とサーバ認証を提供する。サーバ証明書の検証が前提であり、証明書の警告を無視すると中間者攻撃を許す。HSTSは以降の接続をHTTPSに限定する仕組みである。",
    explanationEn:
      "HTTPS encrypts HTTP with TLS and provides integrity and server authentication, contingent on certificate validation. HSTS forces future connections to HTTPS.",
    examUsage:
      "「HTTPSはクライアントを認証する」は通常誤り。サーバ認証が基本で、クライアント認証は別途設定する。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-dns", "it-port-number", "it-tcpip"],
    tags: ["ネットワーク", "TLS"],
  },
  {
    id: "it-relational-database",
    ja: "関係データベース",
    reading: "かんけいデータベース",
    en: "Relational database",
    shortJa: "データを表として管理するデータベース。",
    shortEn: "A database that stores data in tables.",
    explanationJa:
      "関係データベースは、行と列からなる表でデータを管理し、主キーと外部キーによって整合性を保つ。SQLで定義・操作・権限制御を行う。正規化によって更新時の矛盾を減らすが、分析用途では結合コストを下げるために非正規化する場合がある。",
    explanationEn:
      "A relational database stores data in tables and enforces consistency with primary and foreign keys. SQL handles definition, manipulation, and access control.",
    examUsage:
      "主キー（一意・NULL不可）と外部キー（参照整合性）の役割、正規化の目的が問われる。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-primary-key", "it-transaction"],
    tags: ["データベース", "SQL"],
  },
  {
    id: "it-primary-key",
    ja: "主キー",
    reading: "しゅキー",
    en: "Primary key",
    shortJa: "表中の行を一意に識別する列または列の組。",
    shortEn: "A column or set of columns that uniquely identifies each row.",
    explanationJa:
      "主キーは行を一意に識別するため、重複した値とNULLを許さない。他の表から外部キーで参照され、参照先に存在しない値の登録を防ぐ。主キーの設計は、データの同一性をどう定義するかという業務判断でもある。",
    explanationEn:
      "A primary key uniquely identifies rows and disallows duplicates and NULLs. Foreign keys reference it to enforce referential integrity.",
    examUsage:
      "「主キーはNULLを許す」は誤り。複合主キーの一部にNULLがある場合も制約違反になる。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-relational-database", "it-transaction"],
    tags: ["データベース", "制約"],
  },
  {
    id: "it-transaction",
    ja: "トランザクション",
    reading: "トランザクション",
    en: "Transaction",
    shortJa: "複数の更新を1つの処理単位として扱う仕組み。",
    shortEn: "A unit of work that groups multiple operations.",
    explanationJa:
      "トランザクションはACID特性を持つ。原子性（すべて実行かすべて取消）、一貫性（制約を壊さない）、独立性（中間状態を見せない）、永続性（確定した更新を失わない）である。COMMITで確定し、ROLLBACKで取り消す。",
    explanationEn:
      "Transactions provide ACID properties: atomicity, consistency, isolation, and durability. COMMIT makes changes permanent; ROLLBACK undoes them.",
    examUsage:
      "銀行振込の例で、引落しと預入の両方が実行されるか、片方だけなら取り消されるかを判断させる問題が定番である。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-exclusive-control", "it-rollforward", "it-primary-key"],
    tags: ["データベース", "ACID"],
  },
  {
    id: "it-exclusive-control",
    ja: "排他制御",
    reading: "はいたせいぎょ",
    en: "Concurrency control",
    shortJa: "同時実行するトランザクションの競合を防ぐ制御。",
    shortEn: "Control that prevents conflicts between concurrent transactions.",
    explanationJa:
      "排他制御は、ロックによって同時実行の競合を防ぐ。共有ロックは読み取りを許可し更新を禁止する。専有ロックは他の読み取りも更新も禁止する。互いにロック解放を待つ状態がデッドロックであり、DBMSは一方をロールバックして解消する。",
    explanationEn:
      "Locking prevents conflicting concurrent access. Shared locks allow reads but block writes; exclusive locks block both. Deadlocks are resolved by rolling back one transaction.",
    examUsage:
      "共有ロックと専有ロックの許可行為、デッドロックの解消方法が問われる。デッドロックはデータ破壊ではない。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-transaction", "it-rollforward"],
    tags: ["データベース", "同時実行"],
  },
  {
    id: "it-rollforward",
    ja: "ロールフォワード",
    reading: "ロールフォワード",
    en: "Roll forward",
    shortJa: "確定済みの更新をジャーナルから再反映する復旧処理。",
    shortEn: "Recovery that reapplies committed transactions from the log.",
    explanationJa:
      "ロールフォワードは、障害発生前に確定したトランザクションを更新後ログから再実行し、データを最新の状態に戻す処理である。未確定のトランザクションはロールバックで取り消す。チェックポイント以降のログを適用するため、復旧時間はログ量に依存する。",
    explanationEn:
      "Roll forward reapplies committed transactions from the redo log. Uncommitted work is rolled back. Recovery time depends on the volume of log records since the checkpoint.",
    examUsage:
      "「確定済みはやり直す（REDO）、未確定は取り消す（UNDO）」と対で覚える。逆にすると誤答になる。",
    lessonIds: ["it/network-db"],
    relatedTermIds: ["it-transaction", "it-exclusive-control"],
    tags: ["データベース", "障害回復"],
  },
  {
    id: "it-cluster",
    ja: "クラスタ",
    reading: "クラスタ",
    en: "Cluster",
    shortJa: "複数のサーバを連携させ1つのサービスを提供する構成。",
    shortEn: "Multiple servers working together as one service.",
    explanationJa:
      "クラスタは、可用性を高めるHAクラスタと、処理を分散する負荷分散クラスタに大別される。HAクラスタでは、故障したノードの処理を他のノードが引き継ぐフェイルオーバーが行われる。共有ディスクやハートビートの設計が切り替えの成否を左右する。",
    explanationEn:
      "Clusters are used for high availability or load distribution. HA clusters fail over workloads to surviving nodes, relying on shared storage and heartbeat monitoring.",
    examUsage:
      "フェイルオーバー（切替）とフェイルバック（切戻し）の用語、HAクラスタと負荷分散クラスタの目的の違いが問われる。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-duplex", "it-hot-standby", "it-availability"],
    tags: ["システム構成", "冗長化"],
  },
  {
    id: "it-duplex",
    ja: "デュプレックスシステム",
    reading: "デュプレックスシステム",
    en: "Duplex system",
    shortJa: "2系統を同時に稼働させ、相互に同期する構成。",
    shortEn: "Two systems running simultaneously and kept in sync.",
    explanationJa:
      "デュプレックスシステムは、2系統を常時稼働させ、一方の更新内容をもう一方に反映する。障害時は自動または手動で切り替える。待機系を平常時に止めておくデュアルシステムとは異なり、切替時間を短くしやすい。",
    explanationEn:
      "A duplex system runs two systems concurrently and keeps them synchronized, enabling fast takeover. A dual system keeps the standby side idle.",
    examUsage:
      "「デュアルは待機系、デュプレックスは同時稼働」と区別する。名称の類似による引っかけが多い。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-cluster", "it-hot-standby", "it-availability"],
    tags: ["システム構成", "冗長化"],
  },
  {
    id: "it-hot-standby",
    ja: "ホットスタンバイ",
    reading: "ホットスタンバイ",
    en: "Hot standby",
    shortJa: "待機系を常時起動しておく冗長構成。",
    shortEn: "A standby system kept running and ready to take over.",
    explanationJa:
      "ホットスタンバイは、待機系を常時起動し、データを同期しておく。切替時間を短くできるが、待機系のリソースとライセンスのコストがかかる。コールドスタンバイは待機系を停止しておくため、復旧に時間がかかる。",
    explanationEn:
      "Hot standby keeps the standby running and synchronized, shortening failover time at the cost of duplicate resources. Cold standby is cheaper but slower to recover.",
    examUsage:
      "RTOの短さとコストのトレードオフとして問われる。ホットスタンバイでも切替訓練がなければ目標を達成できない。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-duplex", "it-cluster", "it-availability"],
    tags: ["システム構成", "冗長化"],
  },
  {
    id: "it-raid",
    ja: "RAID",
    reading: "レイド",
    en: "Redundant Array of Independent Disks",
    shortJa: "複数ディスクを組み合わせて性能と耐障害性を高める技術。",
    shortEn: "Combining multiple disks for performance and fault tolerance.",
    explanationJa:
      "RAID0はストライピングで冗長性がない。RAID1はミラーリング、RAID5はパリティを分散して1台、RAID6は2台の故障に耐える。RAID10はミラーとストライプの組合せである。RAIDはディスク故障にしか効かず、バックアップの代替にはならない。",
    explanationEn:
      "RAID 0 stripes without redundancy. RAID 1 mirrors. RAID 5 tolerates one disk failure with distributed parity; RAID 6 tolerates two. RAID 10 combines mirroring and striping. RAID is not a backup.",
    examUsage:
      "実効容量の計算（RAID5はn-1、RAID6はn-2、RAID10は50%）と、最低台数が問われる。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-availability", "it-virtualization"],
    tags: ["ストレージ", "冗長化"],
  },
  {
    id: "it-rasis",
    ja: "RASIS",
    reading: "ラシス",
    en: "Reliability, Availability, Serviceability, Integrity, Security",
    shortJa: "システムの信頼性を表す5つの指標。",
    shortEn: "Five qualities describing system reliability.",
    explanationJa:
      "RASISは、Reliability（信頼性）、Availability（可用性）、Serviceability（保守性）、Integrity（完全性）、Security（安全性）の頭文字である。信頼性は故障しにくさ、可用性は使える割合、保守性は修理のしやすさを表す。",
    explanationEn:
      "RASIS stands for Reliability, Availability, Serviceability, Integrity, and Security. It summarizes system quality beyond raw performance.",
    examUsage:
      "Securityの意味を「安全性」と答える点が問われる。同じSでもServiceabilityは保守性であり、機密性（Confidentiality）とも異なる。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-mtbf", "it-mttr", "it-availability"],
    tags: ["信頼性", "指標"],
  },
  {
    id: "it-mtbf",
    ja: "MTBF",
    reading: "エムティービーエフ",
    en: "Mean Time Between Failures",
    shortJa: "平均故障間隔。正常に動き続ける平均時間。",
    shortEn: "The average time a system operates between failures.",
    explanationJa:
      "MTBFは、故障から次の故障までの稼働時間の平均である。値が大きいほど壊れにくい。稼働率は MTBF/(MTBF+MTTR) で計算されるため、MTBFの向上は可用性の向上に直結する。",
    explanationEn:
      "MTBF is the average operating time between failures. Availability equals MTBF / (MTBF + MTTR), so a larger MTBF improves availability.",
    examUsage:
      "MTTRとの区別が最重要。「平均故障間隔」はMTBF、「平均修復時間」はMTTRである。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-mttr", "it-availability", "it-rasis"],
    tags: ["信頼性", "計算問題"],
  },
  {
    id: "it-mttr",
    ja: "MTTR",
    reading: "エムティーティーアール",
    en: "Mean Time To Repair",
    shortJa: "平均修復時間。故障から復旧までの平均時間。",
    shortEn: "The average time needed to restore a failed system.",
    explanationJa:
      "MTTRは、故障の検知から修復完了までの平均時間である。交換作業だけでなく、検知、連絡、切り分け、復旧確認までの時間を含む。MTTRを短縮すると稼働率が上がるため、監視の強化や手順の整備が有効である。",
    explanationEn:
      "MTTR covers detection, escalation, diagnosis, repair, and verification. Reducing MTTR raises availability without changing failure frequency.",
    examUsage:
      "「MTTRを短縮すると稼働率が上がる」という因果が問われる。MTBFを延ばす場合との違いを説明できるようにする。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-mtbf", "it-availability", "it-rasis"],
    tags: ["信頼性", "計算問題"],
  },
  {
    id: "it-availability",
    ja: "稼働率",
    reading: "かどうりつ",
    en: "Availability",
    shortJa: "必要なときにシステムが使える割合。",
    shortEn: "The proportion of time a system is usable.",
    explanationJa:
      "稼働率は MTBF/(MTBF+MTTR) で求める。直列構成では各要素の稼働率の積、並列構成では 1-(1-A)^n になる。99.9%は年間約8.76時間、99.99%は年間約52.6分の停止に相当する。",
    explanationEn:
      "Availability is MTBF/(MTBF+MTTR). Series systems multiply; parallel systems use 1-(1-A)^n. 99.9% means about 8.76 hours of downtime per year.",
    examUsage:
      "直列と並列の計算式の使い分けが問われる。並列は「全台故障の確率」を1から引く。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-mtbf", "it-mttr", "it-cluster"],
    tags: ["信頼性", "計算問題"],
  },
  {
    id: "it-virtualization",
    ja: "仮想化",
    reading: "かそうか",
    en: "Virtualization",
    shortJa: "1台の物理サーバ上で複数の仮想マシンを動かす技術。",
    shortEn: "Running multiple virtual machines on one physical server.",
    explanationJa:
      "仮想化は、ハイパーバイザがCPU、メモリ、ストレージ、ネットワークを分割し、複数の仮想マシンに割り当てる。ゲストOSごとに分離されるため、異なるOSを同居させやすい。物理台数の削減と引き換えに、障害の集約リスクと管理コンソールの保護が課題になる。",
    explanationEn:
      "A hypervisor partitions hardware resources among virtual machines. Guests are isolated by their own OS, but consolidation increases the impact of a single host failure.",
    examUsage:
      "Type1（ハイパーバイザ型）とType2（ホスト型）の違い、スナップショットやテンプレートの管理リスクが問われる。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-container", "it-raid", "it-hot-standby"],
    tags: ["仮想化", "クラウド"],
  },
  {
    id: "it-container",
    ja: "コンテナ",
    reading: "コンテナ",
    en: "Container",
    shortJa: "OSのカーネルを共有してプロセスを分離する技術。",
    shortEn: "Isolated processes sharing the host OS kernel.",
    explanationJa:
      "コンテナは、ゲストOSを持たずホストのカーネルを共有するため、起動が速くイメージも小さい。アプリケーションと依存ライブラリをまとめて配布できる。一方、カーネルを共有するため、カーネル脆弱性の影響はホスト全体に及ぶ。",
    explanationEn:
      "Containers share the host kernel, making them fast and lightweight. Isolation is weaker than virtual machines, and kernel vulnerabilities affect all containers on the host.",
    examUsage:
      "仮想マシンとの違い（ゲストOSの有無、分離の強さ、起動時間）が問われる。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-virtualization"],
    tags: ["仮想化", "コンテナ"],
  },
  {
    id: "it-ups",
    ja: "UPS",
    reading: "ユーピーエス",
    en: "Uninterruptible Power Supply",
    shortJa: "停電時に電力を供給する無停電電源装置。",
    shortEn: "A device that supplies power during outages.",
    explanationJa:
      "UPSは、停電や瞬断の際に一定時間電力を供給し、システムを安全に停止させる時間を稼ぐ。長時間の停電には発電機を組み合わせる。容量はサーバだけでなく、ネットワーク機器、冷却、監視装置を含めて見積もる。",
    explanationEn:
      "A UPS provides temporary power during outages so systems can shut down safely. Generators cover longer outages. Capacity must include network and cooling equipment.",
    examUsage:
      "「UPSがあれば長時間の停電にも耐えられる」は誤り。UPSは短時間の保障であり、発電機と役割が異なる。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-availability", "it-fail-safe"],
    tags: ["設備", "電源"],
  },
  {
    id: "it-fail-safe",
    ja: "フェールセーフ",
    reading: "フェールセーフ",
    en: "Fail-safe",
    shortJa: "故障時に安全側の状態へ移行する設計。",
    shortEn: "A design that moves to a safe state on failure.",
    explanationJa:
      "フェールセーフは、機器やシステムが故障したときに、危険側ではなく安全側へ制御する設計である。信号機が故障時に赤になる、遮断器が開放されるなどの例がある。可用性よりも安全性を優先する場面で用いる。",
    explanationEn:
      "Fail-safe design drives a system to a safe state when it fails, such as a signal turning red. Safety takes priority over availability.",
    examUsage:
      "フェールソフト（機能を落として継続）との違いが問われる。「止める」か「続ける」かで判断する。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-foolproof", "it-ups"],
    tags: ["安全設計", "信頼性"],
  },
  {
    id: "it-foolproof",
    ja: "フールプルーフ",
    reading: "フールプルーフ",
    en: "Foolproof",
    shortJa: "誤操作しても危険な状態にならない設計。",
    shortEn: "A design that prevents human error from causing harm.",
    explanationJa:
      "フールプルーフは、利用者が誤った操作をしても、危険な状態や重大な障害に至らないようにする設計である。カバーでスイッチを保護する、削除前に確認を求める、二重の操作を要求するなどの例がある。",
    explanationEn:
      "Foolproofing makes incorrect operation harmless through physical guards, confirmations, or two-step actions.",
    examUsage:
      "フェールセーフ（故障時の安全側制御）と混同しない。フールプルーフは「人為的な誤り」への対策である。",
    lessonIds: ["it/systems"],
    relatedTermIds: ["it-fail-safe"],
    tags: ["安全設計", "ヒューマンエラー"],
  },
  {
    id: "it-wbs",
    ja: "WBS",
    reading: "ダブリュービーエス",
    en: "Work Breakdown Structure",
    shortJa: "成果物を階層的に分解した作業構成図。",
    shortEn: "A hierarchical decomposition of project deliverables.",
    explanationJa:
      "WBSは、プロジェクトの成果物を作業パッケージまで階層的に分解する。見積り、担当割当て、進捗管理の基礎になる。上位の成果物が下位の合計と一致することを100%ルールといい、作業の漏れと重複を防ぐ。",
    explanationEn:
      "A WBS decomposes deliverables into work packages, forming the basis for estimating and tracking. The 100% rule ensures lower levels fully cover the parent.",
    examUsage:
      "「WBSは作業手順を時系列に並べたもの」は誤り。時系列の表現はガントチャートである。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-critical-path", "it-scope-creep"],
    tags: ["プロジェクトマネジメント", "計画"],
  },
  {
    id: "it-critical-path",
    ja: "クリティカルパス",
    reading: "クリティカルパス",
    en: "Critical path",
    shortJa: "プロジェクト全体の工期を決める最長の経路。",
    shortEn: "The longest path that determines project duration.",
    explanationJa:
      "クリティカルパスは、開始から終了までの経路のうち所要時間が最長のものである。この経路上の作業が遅れると、全体の工期がそのまま遅れる。余裕時間（フロート）が0の作業が連なる。短縮策はクリティカルパス上の作業に集中させる。",
    explanationEn:
      "The critical path is the longest sequence of dependent tasks. Any delay there delays the whole project; crashing or fast tracking elsewhere has no effect.",
    examUsage:
      "「最短経路」と説明する選択肢は誤り。最長経路であり、遅延が全体に波及する。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-wbs", "it-evm"],
    tags: ["プロジェクトマネジメント", "スケジュール"],
  },
  {
    id: "it-evm",
    ja: "EVM",
    reading: "イーブイエム",
    en: "Earned Value Management",
    shortJa: "出来高とコストを金額で比較する進捗管理手法。",
    shortEn: "A method comparing earned value with planned value and actual cost.",
    explanationJa:
      "EVMは、PV（計画価値）、EV（出来高）、AC（実コスト）を用いる。SV=EV-PV、CV=EV-AC、SPI=EV/PV、CPI=EV/AC で進捗とコストの効率を測る。CPIが1未満なら、完成時のコストは予算を超えると予測できる。",
    explanationEn:
      "EVM uses planned value (PV), earned value (EV), and actual cost (AC). SPI = EV/PV and CPI = EV/AC. A CPI below 1 indicates cost overrun.",
    examUsage:
      "SPIとCPIの式、SVとCVの符号の意味が問われる。分子はどちらもEVである。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-critical-path", "it-wbs"],
    tags: ["プロジェクトマネジメント", "計算問題"],
  },
  {
    id: "it-scope-creep",
    ja: "スコープクリープ",
    reading: "スコープクリープ",
    en: "Scope creep",
    shortJa: "承認なしに要求が増え、作業範囲が膨らむこと。",
    shortEn: "Uncontrolled growth of project scope.",
    explanationJa:
      "スコープクリープは、変更管理の手続を経ずに要求が追加され、作業範囲が徐々に拡大する現象である。工期遅延、コスト超過、品質低下の原因になる。変更は影響評価と承認を経て取り込む。",
    explanationEn:
      "Scope creep is uncontrolled scope growth without change control, leading to schedule and cost overruns. Changes must be evaluated and approved.",
    examUsage:
      "「顧客の要望はすべて受け入れる」という選択肢は誤り。変更管理の重要性とセットで出題される。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-wbs", "it-change-management"],
    tags: ["プロジェクトマネジメント", "変更管理"],
  },
  {
    id: "it-change-management",
    ja: "変更管理",
    reading: "へんこうかんり",
    en: "Change management",
    shortJa: "変更の影響を評価し、承認して実施する仕組み。",
    shortEn: "A process for evaluating, approving, and implementing changes.",
    explanationJa:
      "変更管理は、変更要求（RFC）を受け付け、影響範囲、リスク、切戻し手順を評価し、承認して実施する。緊急変更は事後に承認する場合があるが、記録は省略しない。構成管理と連携し、変更対象のCIと依存関係を把握する。",
    explanationEn:
      "Change management assesses impact, risk, and rollback before approval. Emergency changes may be approved retroactively but must still be recorded.",
    examUsage:
      "CAB（変更諮問委員会）の役割、緊急変更でも記録が必要である点が問われる。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-scope-creep", "it-incident-management"],
    tags: ["サービスマネジメント", "統制"],
  },
  {
    id: "it-sla",
    ja: "SLA",
    reading: "エスエルエー",
    en: "Service Level Agreement",
    shortJa: "サービス提供者と顧客の間で合意したサービス水準。",
    shortEn: "An agreement on service levels between provider and customer.",
    explanationJa:
      "SLAは、可用性、応答時間、復旧時間、サポート時間などの水準を、提供者と顧客の間で合意したものである。測定方法、対象期間、除外条件を明確にしないと、達成の可否を判断できない。",
    explanationEn:
      "An SLA defines agreed service levels such as availability and response time, including measurement methods and exclusions.",
    examUsage:
      "SLO（内部目標）、OLA（内部合意）、UC（下流契約）との関係が問われる。SLAは顧客との契約である。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-slo", "it-rto", "it-rpo"],
    tags: ["サービスマネジメント", "契約"],
  },
  {
    id: "it-slo",
    ja: "サービスレベル目標",
    reading: "サービスレベルもくひょう",
    en: "Service Level Objective",
    abbr: "SLO",
    shortJa: "SLAを満たすために設定する内部目標値。",
    shortEn: "An internal target used to meet an SLA.",
    explanationJa:
      "SLOは、SLAで合意した水準を達成するために、提供者側が設定する具体的な目標値である。SLAより厳しい値を設定し、達成状況を監視する。運用上の余裕を確保することで、顧客との約束を守りやすくする。",
    explanationEn:
      "SLOs are internal targets, usually stricter than the SLA, used to monitor and ensure the agreed service level.",
    examUsage:
      "「SLOは顧客との契約」は誤り。契約はSLA、内部目標がSLOである。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-sla"],
    tags: ["サービスマネジメント", "目標管理"],
  },
  {
    id: "it-service-desk",
    ja: "サービスデスク",
    reading: "サービスデスク",
    en: "Service desk",
    shortJa: "利用者からの問い合わせを受ける単一窓口。",
    shortEn: "The single point of contact for users.",
    explanationJa:
      "サービスデスクは、利用者との単一窓口（SPOC）として、受付、記録、一次切り分け、回避策の提示、エスカレーションを行う。すべての問い合わせを同じ経路で記録することで、傾向分析とSLAの測定が可能になる。",
    explanationEn:
      "The service desk is the single point of contact, handling intake, logging, first-line diagnosis, workarounds, and escalation.",
    examUsage:
      "「専門部門が個別に受ける方が速い」という選択肢は、記録と分析の観点から誤りとされることが多い。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-incident-management", "it-sla"],
    tags: ["サービスマネジメント", "窓口"],
  },
  {
    id: "it-incident-management",
    ja: "インシデント管理",
    reading: "インシデントかんり",
    en: "Incident management",
    shortJa: "サービスの中断を早期に復旧させる活動。",
    shortEn: "Restoring service as quickly as possible.",
    explanationJa:
      "インシデント管理は、サービスの中断や品質低下に対して、原因の追究より早期復旧を優先する。暫定的な回避策でサービスを戻し、恒久対策は問題管理へ引き継ぐ。優先度は影響度と緊急度で決める。",
    explanationEn:
      "Incident management prioritizes restoring service, using workarounds if needed, and hands root-cause work to problem management.",
    examUsage:
      "問題管理との目的の違いが問われる。インシデントは「復旧」、問題は「再発防止」である。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-problem-management", "it-service-desk", "it-change-management"],
    tags: ["サービスマネジメント", "障害対応"],
  },
  {
    id: "it-problem-management",
    ja: "問題管理",
    reading: "もんだいかんり",
    en: "Problem management",
    shortJa: "インシデントの根本原因を除去し再発を防ぐ活動。",
    shortEn: "Eliminating root causes to prevent recurring incidents.",
    explanationJa:
      "問題管理は、複数のインシデントの背後にある根本原因を特定し、恒久的な対策を行う。原因と回避策を既知のエラーとして記録し、ナレッジベースに蓄積する。対策は変更要求として変更管理へ渡す。",
    explanationEn:
      "Problem management finds and removes root causes, records known errors, and raises change requests for permanent fixes.",
    examUsage:
      "「インシデント管理は根本原因を除去する」は誤り。復旧と再発防止の役割を入れ替えた選択肢に注意する。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-incident-management", "it-change-management"],
    tags: ["サービスマネジメント", "原因分析"],
  },
  {
    id: "it-rto",
    ja: "RTO",
    reading: "アールティーオー",
    en: "Recovery Time Objective",
    shortJa: "目標復旧時間。いつまでに復旧するかの目標。",
    shortEn: "The target time within which service must be restored.",
    explanationJa:
      "RTOは、災害や障害の発生から、業務やシステムを復旧させるまでの目標時間である。BIAの結果に基づいて決める。RTOが短いほど、待機系や代替拠点など高い対策コストが必要になる。",
    explanationEn:
      "RTO is the target duration for restoring service after a disruption, derived from business impact analysis. Shorter RTOs cost more.",
    examUsage:
      "RPO（目標復旧時点）との混同に注意。「時間」がRTO、「時点」がRPOである。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-rpo", "it-sla"],
    tags: ["事業継続", "目標"],
  },
  {
    id: "it-rpo",
    ja: "RPO",
    reading: "アールピーオー",
    en: "Recovery Point Objective",
    shortJa: "目標復旧時点。どの時点のデータまで戻すかの目標。",
    shortEn: "The maximum acceptable amount of data loss measured in time.",
    explanationJa:
      "RPOは、障害時に許容できるデータ損失の大きさを、時点で表した目標である。RPOが15分なら、復旧には15分前以降のデータが必要になる。バックアップ間隔やログ転送の頻度が、RPOの達成を左右する。",
    explanationEn:
      "RPO defines how much data loss is acceptable in time terms. A 15-minute RPO requires recovery to a point no older than 15 minutes before the failure.",
    examUsage:
      "「日次バックアップでRPO 15分を満たす」は誤り。間隔と目標の整合性を計算させる問題が出る。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-rto", "it-sla"],
    tags: ["事業継続", "バックアップ"],
  },
  {
    id: "it-ukeoi",
    ja: "請負",
    reading: "うけおい",
    en: "Contract for work (Ukeoi)",
    shortJa: "仕事の完成を目的とする契約。",
    shortEn: "A contract whose purpose is completion of a specified work.",
    explanationJa:
      "請負は、受託者が仕事を完成させ、注文者がその結果に対して報酬を支払う契約である。注文者は作業の方法について指揮命令できない。成果物に契約不適合があれば、修補や損害賠償を請求できる。",
    explanationEn:
      "In a work-for-hire contract, the contractor completes the work and the customer pays for the result. The customer cannot direct the workers.",
    examUsage:
      "「請負では注文者が作業者に直接指示できる」は誤り。実際に指示すると偽装請負になる。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-haken"],
    tags: ["契約", "委託"],
  },
  {
    id: "it-haken",
    ja: "労働者派遣",
    reading: "ろうどうしゃはけん",
    en: "Worker dispatch",
    shortJa: "派遣元の労働者が派遣先の指揮命令で働く形態。",
    shortEn: "An arrangement where workers work under the client's direction.",
    explanationJa:
      "労働者派遣では、派遣元が労働者と雇用契約を結び、派遣先が指揮命令を行う。雇用主は派遣元である。請負と異なり、派遣先が日々の作業を指示できるが、派遣可能期間などの制限がある。",
    explanationEn:
      "In worker dispatch, the agency employs the worker while the client directs daily work. Statutory limits on dispatch periods apply.",
    examUsage:
      "「指揮命令は派遣元にある」は誤り。指揮命令は派遣先、雇用関係は派遣元である。",
    lessonIds: ["it/management"],
    relatedTermIds: ["it-ukeoi"],
    tags: ["契約", "労働法"],
  },
  {
    id: "it-bpr",
    ja: "BPR",
    reading: "ビーピーアール",
    en: "Business Process Reengineering",
    shortJa: "業務プロセスを根本から再設計すること。",
    shortEn: "Radical redesign of business processes.",
    explanationJa:
      "BPRは、既存の業務の流れを前提とせず、組織、制度、ITを一体で見直して業務プロセスを再設計する。部分最適ではなく全体最適を目指す。IT化の前に業務の無駄を除くことで、効果を最大化できる。",
    explanationEn:
      "BPR redesigns processes from first principles, aligning organization, rules, and IT for overall optimization rather than local efficiency.",
    examUsage:
      "「現行業務をそのままシステム化する」はBPRではない。RPAやDXとの違いも問われる。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-rpa", "it-dx"],
    tags: ["経営戦略", "業務改善"],
  },
  {
    id: "it-rpa",
    ja: "RPA",
    reading: "アールピーエー",
    en: "Robotic Process Automation",
    shortJa: "定型的なPC操作をソフトウェアで自動化する技術。",
    shortEn: "Software that automates repetitive computer tasks.",
    explanationJa:
      "RPAは、規則性のある定型的な画面操作やデータ入力をソフトウェアが代行する。大量、定型、ルールが明確、例外が少ない業務に向く。既存システムを変更せずに自動化できる一方、画面変更に弱く、例外処理は人やAIとの連携が必要になる。",
    explanationEn:
      "RPA automates rule-based, repetitive UI operations. It suits high-volume, stable processes and struggles with frequent screen changes and exceptions.",
    examUsage:
      "「非定型業務や高度な判断に向く」は誤り。適用業務の選択が頻出する。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-bpr", "it-dx"],
    tags: ["経営戦略", "自動化"],
  },
  {
    id: "it-dx",
    ja: "DX",
    reading: "ディーエックス",
    en: "Digital Transformation",
    shortJa: "デジタル技術で事業や組織を変革すること。",
    shortEn: "Transforming business and organization with digital technology.",
    explanationJa:
      "DXは、データとデジタル技術を活用し、製品、サービス、ビジネスモデル、業務、組織、文化を変革して競争優位を確立することである。単なるシステム導入や業務効率化とは区別される。経営層のコミットメントと人材の変革が不可欠である。",
    explanationEn:
      "DX uses data and digital technology to transform products, services, business models, and culture. It is more than installing systems.",
    examUsage:
      "「基幹システムの刷新＝DX」と断定する選択肢は誤り。事業や組織の変革まで含むかを確認する。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-bpr", "it-rpa"],
    tags: ["経営戦略", "変革"],
  },
  {
    id: "it-roi",
    ja: "ROI",
    reading: "アールオーアイ",
    en: "Return on Investment",
    shortJa: "投資に対するリターンの割合。",
    shortEn: "The ratio of return to investment.",
    explanationJa:
      "ROIは、(効果-投資)/投資 で計算する。投資1,000万円で効果1,500万円なら50%である。期間や運用コストをそろえないと比較できない。複数案の優先順位付けに用いるが、金額に換算しにくいリスク低減効果は別途評価する。",
    explanationEn:
      "ROI = (benefit - investment) / investment. It requires consistent periods and cost assumptions when comparing options.",
    examUsage:
      "計算問題では分子が「効果-投資」であることを確認する。「効果/投資」と混同しない。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-tco", "it-break-even-point"],
    tags: ["投資評価", "計算問題"],
  },
  {
    id: "it-tco",
    ja: "TCO",
    reading: "ティーシーオー",
    en: "Total Cost of Ownership",
    shortJa: "導入から廃棄までの総所有コスト。",
    shortEn: "The total cost of owning a system over its life cycle.",
    explanationJa:
      "TCOは、導入費用、運用費用、保守費用、教育費用、廃棄費用を合計した総コストである。初期費用が安くても、運用や教育に費用がかかればTCOは高くなる。クラウドでは利用量に応じた費用の見積りが重要になる。",
    explanationEn:
      "TCO includes acquisition, operation, maintenance, training, and disposal. Low initial cost can hide high running costs.",
    examUsage:
      "「イニシャルコストだけを比較する」選択肢は誤り。ランニングコストを含める。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-roi"],
    tags: ["投資評価", "コスト"],
  },
  {
    id: "it-break-even-point",
    ja: "損益分岐点",
    reading: "そんえきぶんきてん",
    en: "Break-even point",
    shortJa: "利益が0になる売上高。",
    shortEn: "The sales level at which profit is zero.",
    explanationJa:
      "損益分岐点売上高は、固定費/(1-変動費率) で求める。1-変動費率は限界利益率である。固定費900万円、変動費率40%なら、900/0.6=1,500万円が損益分岐点になる。固定費の削減は分岐点を下げ、変動費率の改善は限界利益率を高める。",
    explanationEn:
      "Break-even sales = fixed costs / (1 - variable cost ratio). The denominator is the contribution margin ratio.",
    examUsage:
      "固定費と変動費率を取り違える誤答が多い。売上高から変動費を引いた限界利益で固定費を回収すると理解する。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-roi", "it-financial-statements"],
    tags: ["会計", "計算問題"],
  },
  {
    id: "it-cio",
    ja: "CIO",
    reading: "シーアイオー",
    en: "Chief Information Officer",
    shortJa: "情報システム戦略とIT投資を統括する経営層。",
    shortEn: "The executive responsible for IT strategy and investment.",
    explanationJa:
      "CIOは、経営戦略に沿って情報システムの方向性を定め、IT投資の優先順位を決める。情報システム部門の長ではなく、経営の一員として意思決定に参画する。ITガバナンスの実効性を左右する立場である。",
    explanationEn:
      "The CIO aligns IT strategy with business strategy and prioritizes IT investment as a member of the executive team.",
    examUsage:
      "CISO（セキュリティ）やCDO（デジタル・データ）との役割の違いが問われる。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-cdo", "it-bcp"],
    tags: ["経営", "組織"],
  },
  {
    id: "it-cdo",
    ja: "CDO",
    reading: "シーディーオー",
    en: "Chief Digital Officer / Chief Data Officer",
    shortJa: "デジタル変革やデータ利活用を推進する経営層。",
    shortEn: "The executive leading digital transformation or data initiatives.",
    explanationJa:
      "CDOは、最高デジタル責任者（Chief Digital Officer）としてDXを推進する役割と、最高データ責任者（Chief Data Officer）としてデータ利活用とデータガバナンスを担う役割がある。いずれも事業変革とデータの価値創出が目的である。",
    explanationEn:
      "CDO can mean Chief Digital Officer, driving transformation, or Chief Data Officer, governing and leveraging data. Both focus on business value from digital assets.",
    examUsage:
      "文脈によって意味が異なる点に注意。CISO（セキュリティ）との混同を狙った問題が出る。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-cio"],
    tags: ["経営", "データ"],
  },
  {
    id: "it-bcp",
    ja: "BCP",
    reading: "ビーシーピー",
    en: "Business Continuity Plan",
    shortJa: "災害時に重要業務を継続・復旧するための計画。",
    shortEn: "A plan for continuing critical operations during disruptions.",
    explanationJa:
      "BCPは、災害や大規模障害の発生時に、重要業務を継続し、または目標時間内に復旧するための手順と体制を定める。BIAに基づいて重要業務、RTO、RPOを決め、代替拠点や連絡体制を整備する。",
    explanationEn:
      "A BCP defines procedures and organization to continue or restore critical operations, based on BIA-derived RTO and RPO targets.",
    examUsage:
      "BCM（計画を維持・改善する活動）との違いが問われる。BCPは文書、BCMは継続的な取組みである。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-bcm", "it-rto", "it-rpo"],
    tags: ["事業継続", "計画"],
  },
  {
    id: "it-bcm",
    ja: "BCM",
    reading: "ビーシーエム",
    en: "Business Continuity Management",
    shortJa: "BCPを策定・訓練・見直しする継続的な活動。",
    shortEn: "The ongoing process of building and improving continuity capability.",
    explanationJa:
      "BCMは、BCPの策定、訓練、評価、見直しをPDCAで回すマネジメント活動である。計画の存在だけでなく、実行できる状態を維持することを目的とする。訓練の結果や組織変更を反映し、計画を更新し続ける。",
    explanationEn:
      "BCM is the management cycle that builds, tests, and improves business continuity capability, not just the document itself.",
    examUsage:
      "「BCPを策定すればBCMは完了する」は誤り。訓練と見直しまで含む。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-bcp"],
    tags: ["事業継続", "マネジメント"],
  },
  {
    id: "it-financial-statements",
    ja: "財務諸表",
    reading: "ざいむしょひょう",
    en: "Financial statements",
    shortJa: "企業の財政状態と経営成績を示す書類。",
    shortEn: "Documents showing a company's financial position and performance.",
    explanationJa:
      "財務諸表は、貸借対照表（B/S）、損益計算書（P/L）、キャッシュフロー計算書（C/F）が中心である。B/Sは一時点の資産・負債・純資産、P/Lは期間の収益・費用・利益、C/Fは現金の増減を示す。",
    explanationEn:
      "Financial statements center on the balance sheet, income statement, and cash flow statement, covering position, performance, and cash movement.",
    examUsage:
      "3表の役割の組合せが問われる。「B/Sは一定期間の収益」は誤りで、一時点の状態を示す。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-depreciation", "it-break-even-point"],
    tags: ["会計", "財務"],
  },
  {
    id: "it-depreciation",
    ja: "減価償却",
    reading: "げんかしょうきゃく",
    en: "Depreciation",
    shortJa: "固定資産の取得費用を耐用年数に配分する処理。",
    shortEn: "Allocating the cost of a fixed asset over its useful life.",
    explanationJa:
      "減価償却は、固定資産の取得費用を、耐用年数にわたって費用として配分する。定額法は毎年同額、定率法は初年度に多く計上する。300万円のシステムを5年で定額償却すると、毎年60万円が費用になる。",
    explanationEn:
      "Depreciation spreads an asset's cost over its useful life. The straight-line method records equal annual amounts; the declining-balance method front-loads expense.",
    examUsage:
      "減価償却費は費用だが現金支出を伴わない点が問われる。キャッシュフローとの違いを押さえる。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-financial-statements"],
    tags: ["会計", "資産"],
  },
  {
    id: "it-data-warehouse",
    ja: "データウェアハウス",
    reading: "データウェアハウス",
    en: "Data warehouse",
    shortJa: "分析用に整形したデータを蓄積する基盤。",
    shortEn: "A repository of integrated data prepared for analysis.",
    explanationJa:
      "データウェアハウスは、業務システムから抽出したデータを、分析しやすい形に整形して時系列で蓄積する。データマートは部門別の小規模な抽出、データレイクは形式を問わず生データを蓄積する。ETLは抽出・変換・格納の処理である。",
    explanationEn:
      "A data warehouse stores integrated, time-stamped data prepared for analysis. Data marts are departmental subsets; data lakes keep raw data in various formats.",
    examUsage:
      "データウェアハウス、データマート、データレイクの違いと、ETLの役割が問われる。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-qc-tools"],
    tags: ["データ活用", "分析基盤"],
  },
  {
    id: "it-qc-tools",
    ja: "QC七つ道具",
    reading: "キューシーななつどうぐ",
    en: "Seven QC tools",
    shortJa: "数値データを整理・分析する7つの手法。",
    shortEn: "Seven basic tools for analyzing numerical quality data.",
    explanationJa:
      "QC七つ道具は、パレート図、特性要因図、チェックシート、ヒストグラム、散布図、管理図、層別である（グラフを含める場合もある）。数値データの整理、原因の探索、ばらつきの把握、異常の検知に用いる。",
    explanationEn:
      "The seven QC tools are the Pareto chart, cause-and-effect diagram, check sheet, histogram, scatter diagram, control chart, and stratification.",
    examUsage:
      "各手法の用途の対応が問われる。特性要因図は原因の整理、パレート図は重点の特定である。",
    lessonIds: ["it/strategy"],
    relatedTermIds: ["it-data-warehouse"],
    tags: ["品質管理", "改善"],
  },
] as const satisfies readonly GlossaryTerm[];
