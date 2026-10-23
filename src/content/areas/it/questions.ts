import type { Question } from "@/lib/content/types";

export const IT_QUESTIONS = [
  // ── it/network-db ─────────────────────────────────────────────
  {
    id: "q-it-network-db-001",
    part: "A",
    topicIds: ["it-network"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "knowledge",
    stem: "192.168.20.100/26 のホストが属するネットワークアドレスはどれか。",
    options: [
      { id: "a", text: "192.168.20.0" },
      { id: "i", text: "192.168.20.64" },
      { id: "u", text: "192.168.20.96" },
      { id: "e", text: "192.168.20.128" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "/26のブロックサイズは64なので、ネットワークは0、64、128、192に分かれます。100は64以上128未満であるため、ネットワークアドレスは192.168.20.64です。",
      why: [
        "プレフィックス長26は、ホスト部が6ビットであることを意味し、2^6=64個ずつ区切られます。",
        "100を64で割ると商が1、余りが36になるため、属するブロックの先頭は64です。",
      ],
      optionNotes: {
        a: "192.168.20.0は最初のブロックのネットワークアドレスです。100はこのブロックに属しません。",
        i: "正解です。64以上128未満のアドレスは192.168.20.64のネットワークに属します。",
        u: "96は64の倍数ではありません。ブロックの先頭にはなり得ません。",
        e: "128は次のブロックの先頭です。100は128未満なので属しません。",
      },
      english:
        "A /26 block size is 64, so 192.168.20.100 belongs to the 192.168.20.64 network.",
      termIds: ["it-subnet-mask", "it-ip-address"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["サブネット", "計算問題"],
  },
  {
    id: "q-it-network-db-002",
    part: "A",
    topicIds: ["it-network"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "knowledge",
    stem: "サブネットマスクが 255.255.255.224 のネットワークで、端末に割り当てることができるIPv4アドレスは最大何個か。",
    options: [
      { id: "a", text: "30個" },
      { id: "i", text: "32個" },
      { id: "u", text: "62個" },
      { id: "e", text: "64個" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "255.255.255.224は/27であり、1ブロックは32アドレスです。ネットワークアドレスとブロードキャストアドレスを除く30個が端末に割り当てられます。",
      why: [
        "ホスト部は5ビットなので、2^5=32個のアドレスが1つのブロックに含まれます。",
        "先頭のネットワークアドレスと末尾のブロードキャストアドレスは端末に割り当てられないため、32-2=30個になります。",
      ],
      optionNotes: {
        a: "正解です。32個からネットワークアドレスとブロードキャストアドレスを引いた30個です。",
        i: "32個はブロックに含まれるアドレス総数であり、端末に割り当てられる数ではありません。",
        u: "62個は/26（255.255.255.192）の場合の収容数です。",
        e: "64個は/26のブロックに含まれるアドレス総数です。",
      },
      english:
        "A 255.255.255.224 mask is /27: 32 addresses per block, 30 usable hosts.",
      termIds: ["it-subnet-mask", "it-ip-address"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["サブネット", "計算問題"],
  },
  {
    id: "q-it-network-db-003",
    part: "A",
    topicIds: ["it-network"],
    lessonIds: ["it/network-db"],
    difficulty: "easy",
    type: "knowledge",
    stem: "TCPとUDPの説明として適切なものはどれか。",
    options: [
      { id: "a", text: "TCPは通信内容を暗号化し、UDPは圧縮を行う。" },
      { id: "i", text: "TCPは再送制御などで信頼性を提供し、UDPはそれらを行わず遅延を抑える。" },
      { id: "u", text: "UDPはコネクションを確立して順序制御を行う。" },
      { id: "e", text: "TCPはポート番号を使わず、UDPだけがポート番号を使う。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "TCPはコネクションを確立し、順序制御・再送・フロー制御によって信頼性を提供します。UDPはこれらを行わないため、遅延を抑えたい通信に向きます。",
      why: [
        "TCPの主な役割は信頼性の確保であり、暗号化はTLSが担います。",
        "UDPはコネクションレスで、再送や順序保証を行いません。",
      ],
      optionNotes: {
        a: "暗号化はTCPの機能ではなく、TLSなどの上位の仕組みが担います。",
        i: "正解です。TCPは信頼性、UDPは低遅延が特徴です。",
        u: "コネクションの確立と順序制御はTCPの機能です。UDPは行いません。",
        e: "TCPもUDPもポート番号を使ってサービスを識別します。",
      },
      english:
        "TCP provides reliability through sequencing and retransmission; UDP avoids that overhead for low-latency traffic.",
      termIds: ["it-tcpip", "it-port-number"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["TCP", "UDP"],
  },
  {
    id: "q-it-network-db-004",
    part: "A",
    topicIds: ["it-network"],
    lessonIds: ["it/network-db"],
    difficulty: "easy",
    type: "knowledge",
    stem: "社内のWebサーバでHTTPSを公開する場合、ファイアウォールで許可するポート番号として適切なものはどれか。",
    options: [
      { id: "a", text: "22番" },
      { id: "i", text: "80番" },
      { id: "u", text: "443番" },
      { id: "e", text: "3389番" },
    ],
    correctOptionId: "u",
    explanation: {
      correct: "HTTPSは443番ポートを使用します。HTTPの80番とは異なります。",
      why: [
        "HTTPSはHTTPをTLSで保護した通信であり、IANAにより443番が割り当てられています。",
        "80番はHTTP、22番はSSH、3389番はRDPのポートです。",
      ],
      optionNotes: {
        a: "22番はSSHのポートで、遠隔管理に使われます。",
        i: "80番は暗号化されないHTTPのポートです。",
        u: "正解です。HTTPSは443番を使用します。",
        e: "3389番はRDP（遠隔デスクトップ）のポートです。",
      },
      english:
        "HTTPS uses TCP port 443; HTTP uses 80, SSH uses 22, and RDP uses 3389.",
      termIds: ["it-https", "it-port-number"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["ポート番号", "HTTPS"],
  },
  {
    id: "q-it-network-db-005",
    part: "A",
    topicIds: ["it-network"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "knowledge",
    stem: "DNSのリソースレコードの説明として適切なものはどれか。",
    options: [
      { id: "a", text: "AレコードはIPv6アドレスを表す。" },
      { id: "i", text: "MXレコードはそのドメインのメールサーバを表す。" },
      { id: "u", text: "PTRレコードはドメイン名の別名を表す。" },
      { id: "e", text: "CNAMEレコードはIPv4アドレスを表す。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "MXレコードはメールの配送先となるメールサーバを指定します。AはIPv4、AAAAはIPv6、CNAMEは別名、PTRは逆引きです。",
      why: [
        "MXはMail eXchangerの略であり、メール配送先の優先度とホスト名を保持します。",
        "AレコードとAAAAレコードがアドレスを保持し、CNAMEは別名を指します。",
      ],
      optionNotes: {
        a: "AレコードはIPv4アドレスを表します。IPv6はAAAAです。",
        i: "正解です。MXはメールサーバを指定するレコードです。",
        u: "PTRはIPアドレスからホスト名を引く逆引き用のレコードです。",
        e: "CNAMEは別名を表します。IPv4アドレスはAレコードです。",
      },
      english:
        "MX records designate mail servers; A and AAAA hold IPv4 and IPv6 addresses, CNAME holds an alias, and PTR supports reverse lookup.",
      termIds: ["it-dns"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["DNS", "レコード"],
  },
  {
    id: "q-it-network-db-006",
    part: "A",
    topicIds: ["it-db"],
    lessonIds: ["it/network-db"],
    difficulty: "easy",
    type: "knowledge",
    stem: "関係データベースの主キーの説明として適切なものはどれか。",
    options: [
      { id: "a", text: "重複する値を許すが、NULLは許さない。" },
      { id: "i", text: "行を一意に識別し、重複する値とNULLを許さない。" },
      { id: "u", text: "他の表の行を参照する列である。" },
      { id: "e", text: "検索を高速化するために自動的に作られる索引である。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "主キーは表の行を一意に識別する列または列の組であり、重複とNULLを許しません。",
      why: [
        "主キーに重複を許すと、どの行を指しているか特定できなくなります。",
        "NULLを許すと、値が未設定の行を一意に識別できなくなります。",
      ],
      optionNotes: {
        a: "主キーは重複もNULLも許しません。",
        i: "正解です。一意性とNOT NULLが主キーの条件です。",
        u: "他の表の行を参照するのは外部キーです。",
        e: "検索を高速化する索引はインデックスであり、主キーとは別の概念です。",
      },
      english:
        "A primary key uniquely identifies rows and disallows both duplicates and NULLs.",
      termIds: ["it-primary-key", "it-relational-database"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["データベース", "主キー"],
  },
  {
    id: "q-it-network-db-007",
    part: "A",
    topicIds: ["it-db"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "knowledge",
    stem: "共有ロックと専有ロックに関する記述として適切なものはどれか。",
    options: [
      { id: "a", text: "共有ロックを取得している行でも、他のトランザクションは更新できる。" },
      { id: "i", text: "専有ロックを取得している行は、他のトランザクションは読み取りもできない。" },
      { id: "u", text: "共有ロック同士は競合するため、同時に取得できない。" },
      { id: "e", text: "デッドロックはデータを破壊する障害であり、自動復旧できない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "専有ロックは排他的なロックであり、他のトランザクションは読み取りも更新もできません。共有ロックは読み取りを許可し、更新を禁止します。",
      why: [
        "共有ロックは複数の読み取りを許可するが、更新には専有ロックが必要です。",
        "デッドロックは相互にロック解放を待つ状態で、DBMSが一方をロールバックして解消します。",
      ],
      optionNotes: {
        a: "共有ロック中の行を更新するには専有ロックが必要であり、そのままでは更新できません。",
        i: "正解です。専有ロックは読み取りもブロックします。",
        u: "共有ロック同士は競合せず、同時に取得できます。",
        e: "デッドロックは待ち状態であり、DBMSが一方を取り消して解消します。データ破壊ではありません。",
      },
      english:
        "An exclusive lock blocks both reads and writes from other transactions; shared locks are compatible with each other.",
      termIds: ["it-exclusive-control", "it-transaction"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["排他制御", "デッドロック"],
  },
  {
    id: "q-it-network-db-008",
    part: "A",
    topicIds: ["it-db"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "knowledge",
    stem: "差分バックアップと増分バックアップの説明として適切なものはどれか。",
    options: [
      { id: "a", text: "差分は前回のバックアップ以降の変更、増分は前回のフルバックアップ以降の変更を取得する。" },
      { id: "i", text: "差分は前回のフルバックアップ以降の変更、増分は前回のバックアップ以降の変更を取得する。" },
      { id: "u", text: "どちらも毎回データ全体を取得する。" },
      { id: "e", text: "増分の方が、復旧に必要な媒体数が少ない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "差分は基準となるフルバックアップからの変更を毎回取得し、増分は直前のバックアップからの変更を取得します。",
      why: [
        "差分は取得のたびにサイズが増えるが、復旧はフルと最新の差分の2本で済みます。",
        "増分は取得が速いが、復旧にはフルとすべての増分を順に適用する必要があります。",
      ],
      optionNotes: {
        a: "基準が逆です。差分の基準は前回のフル、増分の基準は前回のバックアップです。",
        i: "正解です。基準の違いが復旧手順と容量に影響します。",
        u: "毎回全体を取得するのはフルバックアップです。",
        e: "増分の方が復旧に必要な媒体数は多くなります。",
      },
      english:
        "Differential backups capture changes since the last full backup; incremental backups capture changes since the last backup of any kind.",
      termIds: ["it-rollforward"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["バックアップ", "障害回復"],
  },
  {
    id: "q-it-network-db-009",
    part: "B",
    topicIds: ["it-network"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社は新拠点に60台の端末と8台のネットワーク機器（プリンタ、IP電話など）を設置する。各機器にIPアドレスを1つずつ割り当て、1つのサブネットに収める。使用可能なプレフィックス長のうち、アドレスを最も節約できるものはどれか。ここで、ネットワークアドレスとブロードキャストアドレスは機器に割り当てない。",
    options: [
      { id: "a", text: "/24" },
      { id: "i", text: "/25" },
      { id: "u", text: "/26" },
      { id: "e", text: "/27" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "必要なアドレスは60+8=68個です。/26の収容数は62個で不足し、/25は126個で足ります。/24は254個で過剰です。",
      why: [
        "収容数は 2^(32-プレフィックス長) - 2 で計算します。/26は64-2=62、/25は128-2=126です。",
        "68個を収容できる最小のブロックは128アドレス、すなわち/25です。",
      ],
      optionNotes: {
        a: "/24は254個を収容でき、要件は満たしますが、186個が未使用になり最も節約とはいえません。",
        i: "正解です。126個の収容で68個を満たし、無駄も最小です。",
        u: "/26は62個しか収容できず、68個に足りません。",
        e: "/27は30個しか収容できず、大きく不足します。",
      },
      english:
        "Sixty-eight addresses are required. /26 provides only 62 usable addresses, so /25 is the smallest sufficient subnet.",
      termIds: ["it-subnet-mask", "it-ip-address"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["サブネット設計", "科目B"],
  },
  {
    id: "q-it-network-db-010",
    part: "B",
    topicIds: ["it-db"],
    lessonIds: ["it/network-db"],
    difficulty: "medium",
    type: "scenario",
    stem: "小売業のB社では、夜間バッチで日次の売上を集計している。月初の処理で、同じ伝票が二重に集計される事象が発生した。調査の結果、集計プログラムが伝票テーブルを読み取っている最中に、別のオンライン処理が同じ伝票を更新していたことが分かった。再発防止として最も適切なものはどれか。",
    options: [
      { id: "a", text: "集計対象を分割し、バッチの実行時間を短くする。" },
      { id: "i", text: "集計対象の読み取りに共有ロックを掛け、更新処理と排他する。" },
      { id: "u", text: "バッチ実行中はオンライン処理をすべて停止する。" },
      { id: "e", text: "伝票テーブルにインデックスを追加する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "読み取り中のデータが更新されると、集計結果が一貫しなくなります。共有ロックで読み取りを保護し、更新処理を待たせることで一貫性を保てます。",
      why: [
        "共有ロックは他の読み取りを許可し、更新には専有ロックを要求させるため、集計中の変更を防げます。",
        "処理の高速化や全面停止は、一貫性の原因そのものを除いていません。",
      ],
      optionNotes: {
        a: "実行時間の短縮は事故の確率を下げますが、読み取り中の更新という原因は残ります。",
        i: "正解です。読み取り一貫性をロックで確保します。",
        u: "全面停止は可用性を大きく損なう過剰な対策で、他の業務にも影響します。",
        e: "インデックスは検索性能を改善しますが、同時更新による不整合は防げません。",
      },
      english:
        "A shared lock on the rows being aggregated prevents concurrent updates and keeps the batch result consistent.",
      termIds: ["it-exclusive-control", "it-transaction"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["トランザクション", "科目B"],
  },

  // ── it/systems ────────────────────────────────────────────────
  {
    id: "q-it-systems-001",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "easy",
    type: "knowledge",
    stem: "MTBFが990時間、MTTRが10時間のシステムの稼働率はどれか。",
    options: [
      { id: "a", text: "90.0%" },
      { id: "i", text: "99.0%" },
      { id: "u", text: "99.9%" },
      { id: "e", text: "99.99%" },
    ],
    correctOptionId: "i",
    explanation: {
      correct: "稼働率は MTBF/(MTBF+MTTR) = 990/1,000 = 0.99、すなわち99.0%です。",
      why: [
        "MTBFは平均故障間隔、MTTRは平均修復時間であり、合計が総時間になります。",
        "990÷(990+10)=0.99となるため、99.0%が正解です。",
      ],
      optionNotes: {
        a: "90.0%はMTBFとMTTRの比率が9:1になる場合です。990:10は99:1です。",
        i: "正解です。990/1,000=0.99です。",
        u: "99.9%はMTTRを1時間程度まで短縮した場合に近い値です。",
        e: "99.99%はMTTRを0.1時間程度まで短縮した場合に近い値です。",
      },
      english:
        "Availability = MTBF / (MTBF + MTTR) = 990 / 1,000 = 99.0%.",
      termIds: ["it-mtbf", "it-mttr", "it-availability"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["稼働率", "計算問題"],
  },
  {
    id: "q-it-systems-002",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "medium",
    type: "knowledge",
    stem: "MTBFが990時間、MTTRが10時間のシステムで、MTTRを5時間に短縮した。稼働率に最も近いものはどれか。",
    options: [
      { id: "a", text: "99.0%" },
      { id: "i", text: "99.5%" },
      { id: "u", text: "99.9%" },
      { id: "e", text: "99.95%" },
    ],
    correctOptionId: "i",
    explanation: {
      correct: "990/(990+5) = 990/995 ≒ 0.99497 であり、約99.5%です。",
      why: [
        "MTTRの短縮は分母を小さくするため、稼働率は上がります。",
        "990/995は0.99497...となるため、99.5%が最も近い値です。",
      ],
      optionNotes: {
        a: "99.0%はMTTRが10時間のときの値です。",
        i: "正解です。990/995 ≒ 99.5%になります。",
        u: "99.9%はMTTRを約1時間まで短縮する必要があります。",
        e: "99.95%はMTTRを約0.5時間まで短縮する必要があります。",
      },
      english:
        "Reducing MTTR to 5 hours gives 990/995 ≈ 99.5% availability.",
      termIds: ["it-mtbf", "it-mttr", "it-availability"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["稼働率", "MTTR"],
  },
  {
    id: "q-it-systems-003",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "easy",
    type: "knowledge",
    stem: "1TBのディスク4台でRAID5を構成したとき、実効容量と耐障害性の組合せとして適切なものはどれか。",
    options: [
      { id: "a", text: "3TB、1台の故障まで耐える。" },
      { id: "i", text: "4TB、1台の故障まで耐える。" },
      { id: "u", text: "3TB、2台の故障まで耐える。" },
      { id: "e", text: "2TB、1台の故障まで耐える。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "RAID5はパリティ1台分を除いた容量が使えるため、4台×1TBで3TBです。同時に1台の故障まで耐えます。",
      why: [
        "実効容量は (n-1)×ディスク容量であり、4台なら3TBです。",
        "RAID5のパリティは1台分であり、2台同時故障には耐えられません。",
      ],
      optionNotes: {
        a: "正解です。3TBで1台故障まで耐えます。",
        i: "4TBはパリティを考慮していません。RAID5では1台分が冗長化に使われます。",
        u: "2台の故障に耐えるのはRAID6です。RAID5は1台までです。",
        e: "2TBはRAID10（4台）の実効容量です。",
      },
      english:
        "RAID 5 with four 1TB disks yields 3TB usable capacity and tolerates one disk failure.",
      termIds: ["it-raid"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RAID", "計算問題"],
  },
  {
    id: "q-it-systems-004",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "medium",
    type: "knowledge",
    stem: "RAID6の最低必要台数と耐障害性の組合せとして適切なものはどれか。",
    options: [
      { id: "a", text: "3台、1台の故障まで耐える。" },
      { id: "i", text: "4台、2台の故障まで耐える。" },
      { id: "u", text: "4台、1台の故障まで耐える。" },
      { id: "e", text: "5台、2台の故障まで耐える。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "RAID6は2台分のパリティを持つため、最低4台が必要で、2台の同時故障まで耐えます。",
      why: [
        "データ用に2台、パリティ用に2台が必要なため、最低構成は4台です。",
        "パリティが2系統あるため、2台の故障まで復元できます。",
      ],
      optionNotes: {
        a: "3台で1台故障までなのはRAID5です。",
        i: "正解です。最低4台で2台故障まで耐えます。",
        u: "1台故障までなのはRAID5です。RAID6は2台まで耐えます。",
        e: "5台でも構成できますが、最低台数は4台です。",
      },
      english:
        "RAID 6 requires at least four disks and survives two simultaneous disk failures.",
      termIds: ["it-raid"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RAID", "冗長化"],
  },
  {
    id: "q-it-systems-005",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "medium",
    type: "knowledge",
    stem: "デュプレックスシステムの説明として適切なものはどれか。",
    options: [
      { id: "a", text: "2系統を用意し、平常時は片系を停止して待機させる。" },
      { id: "i", text: "2系統を同時に稼働させ、相互にデータを同期する。" },
      { id: "u", text: "複数のサーバに処理を分散し、負荷に応じて台数を増減する。" },
      { id: "e", text: "故障時に安全側の状態へ停止する設計である。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "デュプレックスシステムは2系統を同時に稼働させ、一方の更新内容を他方に反映します。障害時は切り替えて処理を継続します。",
      why: [
        "平常時から両系が動く点が、片系を待機させるデュアルシステムとの違いです。",
        "同時稼働により切替時間を短くできますが、リソースは2倍必要です。",
      ],
      optionNotes: {
        a: "片系を停止して待機させるのはデュアルシステムです。",
        i: "正解です。2系統同時稼働とデータ同期が特徴です。",
        u: "負荷分散クラスタの説明です。",
        e: "フェールセーフの説明です。",
      },
      english:
        "A duplex system runs both sides concurrently and keeps them synchronized, enabling fast takeover.",
      termIds: ["it-duplex", "it-cluster"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["冗長化", "デュプレックス"],
  },
  {
    id: "q-it-systems-006",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "easy",
    type: "knowledge",
    stem: "RASISの構成要素として適切なものはどれか。",
    options: [
      { id: "a", text: "Security（安全性）" },
      { id: "i", text: "Scalability（拡張性）" },
      { id: "u", text: "Usability（使用性）" },
      { id: "e", text: "Portability（移植性）" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "RASISはReliability（信頼性）、Availability（可用性）、Serviceability（保守性）、Integrity（完全性）、Security（安全性）の頭文字です。",
      why: [
        "5つの指標は、故障しにくさ、使える割合、直しやすさ、データの正確さ、安全性を表します。",
        "拡張性、使用性、移植性はRASISには含まれません。",
      ],
      optionNotes: {
        a: "正解です。SecurityはRASISのSの一つで、安全性を表します。",
        i: "Scalability（拡張性）はRASISに含まれません。",
        u: "Usability（使用性）はRASISに含まれません。",
        e: "Portability（移植性）はRASISに含まれません。",
      },
      english:
        "RASIS stands for Reliability, Availability, Serviceability, Integrity, and Security.",
      termIds: ["it-rasis"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RASIS", "信頼性"],
  },
  {
    id: "q-it-systems-007",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "medium",
    type: "knowledge",
    stem: "フェールセーフの例として適切なものはどれか。",
    options: [
      { id: "a", text: "信号機が故障したときに赤信号を点灯させる。" },
      { id: "i", text: "誤ってボタンを押さないよう、蓋で操作部を保護する。" },
      { id: "u", text: "一部の機能が停止しても、残りの機能で処理を続ける。" },
      { id: "e", text: "停電時にUPSから電力を供給する。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "フェールセーフは、故障時に危険側ではなく安全側へ制御する設計です。信号機が赤になるのは代表例です。",
      why: [
        "赤信号は通行を止める安全側の状態であり、故障時の危険を避けています。",
        "蓋による保護はフールプルーフ、機能縮退はフェールソフト、電力供給はUPSの役割です。",
      ],
      optionNotes: {
        a: "正解です。故障時に安全側へ倒す設計です。",
        i: "誤操作を物理的に防ぐのはフールプルーフです。",
        u: "機能を落として継続するのはフェールソフトです。",
        e: "UPSは電源の可用性を高める設備であり、フェールセーフとは目的が異なります。",
      },
      english:
        "Fail-safe design moves to a safe state on failure; a traffic signal turning red is the classic example.",
      termIds: ["it-fail-safe", "it-foolproof"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["安全設計", "フェールセーフ"],
  },
  {
    id: "q-it-systems-008",
    part: "A",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "medium",
    type: "knowledge",
    stem: "コンテナの特徴として適切なものはどれか。",
    options: [
      { id: "a", text: "コンテナごとにゲストOSを持つため、仮想マシンより分離が強い。" },
      { id: "i", text: "ホストのカーネルを共有するため、起動が速く軽量である。" },
      { id: "u", text: "カーネルを共有しないため、カーネルの脆弱性の影響を受けない。" },
      { id: "e", text: "仮想マシンより多くの記憶域を必要とする。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "コンテナはホストのカーネルを共有し、プロセスを分離します。ゲストOSを持たないため、起動が速くイメージも小さくなります。",
      why: [
        "ゲストOSの分だけ仮想マシンは重くなります。コンテナはその分を省略できます。",
        "カーネルを共有するため、カーネルの脆弱性はホスト上のコンテナ全体に影響します。",
      ],
      optionNotes: {
        a: "ゲストOSを持つのは仮想マシンです。コンテナの分離は仮想マシンより弱いとされます。",
        i: "正解です。カーネル共有により軽量で起動が速くなります。",
        u: "カーネルを共有するため、カーネル脆弱性の影響は受けます。",
        e: "コンテナは仮想マシンより少ない記憶域で済むのが一般的です。",
      },
      english:
        "Containers share the host kernel, making them lightweight and fast to start, but isolation is weaker than with virtual machines.",
      termIds: ["it-container", "it-virtualization"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["コンテナ", "仮想化"],
  },
  {
    id: "q-it-systems-009",
    part: "B",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "medium",
    type: "scenario",
    stem: "稼働率99%のWebサーバを2台用意し、どちらか1台が稼働していればサービスを提供できる構成にした。この構成の稼働率に最も近いものはどれか。ここで、2台の故障は独立に発生するものとする。",
    options: [
      { id: "a", text: "99%" },
      { id: "i", text: "99.9%" },
      { id: "u", text: "99.99%" },
      { id: "e", text: "99.999%" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "並列構成の稼働率は 1-(1-A)^2 = 1-(0.01)^2 = 0.9999、すなわち99.99%です。",
      why: [
        "両方が同時に故障する確率は0.01×0.01=0.0001であり、これを1から引きます。",
        "年間では約52.6分の停止に相当し、単体の99%（約87.6時間）から大きく改善します。",
      ],
      optionNotes: {
        a: "99%は1台だけの場合の稼働率です。",
        i: "99.9%は並列化の効果を過小評価した値です。",
        u: "正解です。1-(0.01)^2=0.9999になります。",
        e: "99.999%は3台以上を並列化した場合に近い値です。",
      },
      english:
        "Two parallel servers with 99% availability each give 1 - 0.01² = 99.99%.",
      termIds: ["it-availability", "it-cluster"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["稼働率", "並列構成", "科目B"],
  },
  {
    id: "q-it-systems-010",
    part: "B",
    topicIds: ["it-system"],
    lessonIds: ["it/systems"],
    difficulty: "hard",
    type: "scenario",
    stem: "C社のファイルサーバは、1TBのディスク5台でRAID5を構成している。夜間に1台のディスクが故障し、翌朝に交換して再構築を開始した。再構築中に別の1台が故障し、データを失った。この状況から導ける対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "RAID5の台数を増やせば、同時に2台故障してもデータを失わない。" },
      { id: "i", text: "日次バックアップを別媒体・別拠点に取得し、復旧手順を訓練する。" },
      { id: "u", text: "再構築時間を短縮するため、ディスク容量を増やす。" },
      { id: "e", text: "RAID0に変更して性能を上げ、再構築を不要にする。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "RAID5は1台の故障までしか耐えられず、再構築中は無防備になります。ディスク故障以外も含めたデータ保護には、バックアップと復旧訓練が必要です。",
      why: [
        "RAIDは冗長化であり、バックアップではありません。誤削除や災害、二重故障には対応できません。",
        "台数を増やしてもRAID5の耐障害性は1台のままであり、再構築中のリスクは残ります。",
      ],
      optionNotes: {
        a: "RAID5は台数を増やしても1台故障までです。2台故障に耐えるのはRAID6です。",
        i: "正解です。バックアップと復旧訓練が最終的なデータ保護になります。",
        u: "大容量化は再構築時間を長くし、リスクをむしろ高めます。",
        e: "RAID0は冗長性がなく、1台の故障で全データを失います。",
      },
      english:
        "RAID 5 tolerates only one failure, so backups on separate media and offsite copies remain essential.",
      termIds: ["it-raid", "it-availability"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RAID", "バックアップ", "科目B"],
  },

  // ── it/management ─────────────────────────────────────────────
  {
    id: "q-it-management-001",
    part: "A",
    topicIds: ["it-pm"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "knowledge",
    stem: "クリティカルパスの説明として適切なものはどれか。",
    options: [
      { id: "a", text: "所要時間が最も短い経路である。" },
      { id: "i", text: "所要時間が最も長く、その遅延が全体の遅延になる経路である。" },
      { id: "u", text: "費用が最も大きい作業の集まりである。" },
      { id: "e", text: "余裕時間が最も大きい経路である。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "クリティカルパスは開始から終了までの最長経路であり、そこにある作業の遅延は全体の工期の遅延になります。",
      why: [
        "全体の工期は最も長い経路で決まるため、短い経路には余裕時間があります。",
        "短縮策はクリティカルパス上の作業に集中させないと、工期は短くなりません。",
      ],
      optionNotes: {
        a: "最短経路ではありません。最長経路である点が重要です。",
        i: "正解です。最長経路であり、遅延が全体に波及します。",
        u: "費用の大きさではなく、依存関係と所要時間で決まります。",
        e: "余裕時間が最も大きいのはクリティカルパス以外の経路です。",
      },
      english:
        "The critical path is the longest path through the project; any delay on it delays the entire project.",
      termIds: ["it-critical-path", "it-wbs"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["プロジェクトマネジメント", "スケジュール"],
  },
  {
    id: "q-it-management-002",
    part: "A",
    topicIds: ["it-pm"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "knowledge",
    stem: "予算1,000万円のプロジェクトで、現在までのPVが400万円、EVが360万円、ACが400万円である。CPIの値として適切なものはどれか。",
    options: [
      { id: "a", text: "0.90" },
      { id: "i", text: "0.96" },
      { id: "u", text: "1.00" },
      { id: "e", text: "1.11" },
    ],
    correctOptionId: "a",
    explanation: {
      correct: "CPI = EV/AC = 360/400 = 0.90 です。コスト効率は1未満で、予算超過を示します。",
      why: [
        "CPIは出来高を実コストで割った値であり、1未満なら使ったコストに対して出来高が不足しています。",
        "360÷400=0.9となるため、0.90が正解です。",
      ],
      optionNotes: {
        a: "正解です。CPI=EV/AC=0.90です。",
        i: "0.96はEVをPVで割った値（SPI=360/400=0.9）とは異なります。計算式を取り違えています。",
        u: "1.00はEVとACが同額の場合です。ここではEVがACを下回っています。",
        e: "1.11はACをEVで割った値であり、CPIの式ではありません。",
      },
      english:
        "CPI = EV / AC = 360 / 400 = 0.90, indicating a cost overrun.",
      termIds: ["it-evm"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["EVM", "計算問題"],
  },
  {
    id: "q-it-management-003",
    part: "A",
    topicIds: ["it-pm"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "knowledge",
    stem: "SVが-40万円、CVが-40万円であるときのプロジェクトの状態として適切なものはどれか。",
    options: [
      { id: "a", text: "進捗は計画より進み、コストは余剰である。" },
      { id: "i", text: "進捗は計画より遅れ、コストは超過している。" },
      { id: "u", text: "進捗は計画より遅れ、コストは余剰である。" },
      { id: "e", text: "進捗は計画より進み、コストは超過している。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "SV=EV-PVが負なので進捗は遅れ、CV=EV-ACが負なのでコストは超過しています。",
      why: [
        "SVが負とは、出来高が計画価値を下回っている状態です。",
        "CVが負とは、出来高に対して実コストが大きい状態です。",
      ],
      optionNotes: {
        a: "両方の符号を逆に解釈しています。負はそれぞれ遅延と超過を意味します。",
        i: "正解です。SVもCVも負であり、遅延とコスト超過が同時に起きています。",
        u: "CVが負なのでコストは余剰ではなく超過です。",
        e: "SVが負なので進捗は進みではなく遅れです。",
      },
      english:
        "Negative SV means schedule delay; negative CV means cost overrun.",
      termIds: ["it-evm"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["EVM", "進捗管理"],
  },
  {
    id: "q-it-management-004",
    part: "A",
    topicIds: ["it-service"],
    lessonIds: ["it/management"],
    difficulty: "easy",
    type: "knowledge",
    stem: "SLAとSLOの関係について適切なものはどれか。",
    options: [
      { id: "a", text: "SLAは内部目標であり、SLOは顧客との契約である。" },
      { id: "i", text: "SLAは顧客との合意であり、SLOはそれを達成するための内部目標である。" },
      { id: "u", text: "SLAとSLOは同一の内容を指す。" },
      { id: "e", text: "SLOは下流の委託先との契約である。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "SLAは顧客との間で合意するサービス水準、SLOはSLAを満たすために提供者側が設定する内部目標です。",
      why: [
        "SLOはSLAより厳しい値に設定し、運用の余裕を確保するのが一般的です。",
        "下流の委託先との契約はUC（アンダーピニングコントラクト）です。",
      ],
      optionNotes: {
        a: "関係が逆です。顧客との合意がSLA、内部目標がSLOです。",
        i: "正解です。SLAが契約、SLOが内部目標です。",
        u: "SLAとSLOは当事者と目的が異なります。",
        e: "下流の委託先との契約はUCです。",
      },
      english:
        "The SLA is the customer agreement; SLOs are internal targets used to meet it.",
      termIds: ["it-sla", "it-slo"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["SLA", "サービスレベル"],
  },
  {
    id: "q-it-management-005",
    part: "A",
    topicIds: ["it-service"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "knowledge",
    stem: "インシデント管理と問題管理の説明として適切なものはどれか。",
    options: [
      { id: "a", text: "インシデント管理は根本原因を除去し、問題管理は暫定的に復旧させる。" },
      { id: "i", text: "インシデント管理は早期復旧を優先し、問題管理は再発防止のために根本原因を追究する。" },
      { id: "u", text: "どちらも変更要求の承認を主な目的とする。" },
      { id: "e", text: "問題管理はSLAの測定を主な目的とする。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "インシデント管理はサービスを早期に復旧させ、問題管理は根本原因を特定して再発を防ぎます。",
      why: [
        "インシデント管理では、原因究明より影響の停止を優先し、回避策を用いる場合があります。",
        "問題管理の結果は既知のエラーとして記録され、変更要求につながります。",
      ],
      optionNotes: {
        a: "役割が逆です。復旧がインシデント管理、原因除去が問題管理です。",
        i: "正解です。目的の違いが両者を分けます。",
        u: "変更要求の承認は変更管理の役割です。",
        e: "SLAの測定はサービスレベルの管理であり、問題管理の目的ではありません。",
      },
      termIds: ["it-incident-management", "it-problem-management"],
      english:
        "Incident management restores service quickly; problem management removes root causes to prevent recurrence.",
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["インシデント管理", "問題管理"],
  },
  {
    id: "q-it-management-006",
    part: "A",
    topicIds: ["it-pm"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "knowledge",
    stem: "請負契約と労働者派遣の違いについて適切なものはどれか。",
    options: [
      { id: "a", text: "請負では注文者が作業者へ直接指示できる。" },
      { id: "i", text: "請負では注文者は作業方法を指示できず、派遣では派遣先が指揮命令する。" },
      { id: "u", text: "派遣では派遣元が指揮命令し、雇用主は派遣先である。" },
      { id: "e", text: "請負では受託者は成果物の完成責任を負わない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "請負は仕事の完成を目的とし、注文者は作業方法に指揮命令できません。派遣は派遣先が指揮命令し、雇用主は派遣元です。",
      why: [
        "請負で注文者が作業者へ直接指示すると、実態が派遣となり偽装請負になります。",
        "派遣では雇用関係が派遣元、指揮命令関係が派遣先に分かれます。",
      ],
      optionNotes: {
        a: "請負で直接指示すると偽装請負になります。",
        i: "正解です。指揮命令関係の違いが契約形態の判断基準です。",
        u: "指揮命令は派遣先、雇用主は派遣元です。逆になっています。",
        e: "請負では受託者が成果物の完成責任を負います。",
      },
      english:
        "Contract work forbids direct instruction by the client; in dispatch, the client directs the worker while the agency employs them.",
      termIds: ["it-ukeoi", "it-haken"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["請負", "労働者派遣"],
  },
  {
    id: "q-it-management-007",
    part: "A",
    topicIds: ["it-service"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "knowledge",
    stem: "サービスデスクの役割として適切なものはどれか。",
    options: [
      { id: "a", text: "システムの設計変更を承認する。" },
      { id: "i", text: "利用者からの問い合わせを単一窓口で受け付け、記録し、一次切り分けを行う。" },
      { id: "u", text: "根本原因を特定し、恒久的な対策を実施する。" },
      { id: "e", text: "本番環境へのリリースを実施する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "サービスデスクは利用者との単一窓口として、受付、記録、一次切り分け、回避策の提示、エスカレーションを行います。",
      why: [
        "窓口を一本化することで、対応の抜け漏れを防ぎ、傾向分析とSLA測定が可能になります。",
        "設計変更の承認は変更管理、原因究明は問題管理、リリースはリリース管理の役割です。",
      ],
      optionNotes: {
        a: "設計変更の承認は変更管理（CAB）の役割です。",
        i: "正解です。単一窓口としての受付と一次切り分けが中心です。",
        u: "根本原因の特定と恒久対策は問題管理の役割です。",
        e: "本番環境へのリリースはリリース管理の役割です。",
      },
      english:
        "The service desk is the single point of contact for intake, logging, first-line diagnosis, and escalation.",
      termIds: ["it-service-desk", "it-incident-management"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["サービスデスク", "窓口"],
  },
  {
    id: "q-it-management-008",
    part: "B",
    topicIds: ["it-service"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社は基幹システムのSLAで、月間可用性99.9%を約束している。30日を43,200分として、計画停止を除いた場合に許容される停止時間は何分か。",
    options: [
      { id: "a", text: "4.32分" },
      { id: "i", text: "43.2分" },
      { id: "u", text: "216分" },
      { id: "e", text: "432分" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "43,200分の0.1%は43.2分です。99.9%の可用性では、月間43.2分まで停止が許されます。",
      why: [
        "許容停止時間は 対象時間×(1-可用性) で計算します。",
        "43,200×0.001=43.2となるため、43.2分が正解です。",
      ],
      optionNotes: {
        a: "4.32分は99.99%の場合の許容停止時間です。",
        i: "正解です。43,200×0.001=43.2分です。",
        u: "216分は99.5%の場合の許容停止時間です。",
        e: "432分は99%の場合の許容停止時間です。",
      },
      english:
        "99.9% availability over 43,200 minutes allows 43.2 minutes of downtime.",
      termIds: ["it-sla", "it-availability"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["SLA", "可用性", "科目B"],
  },
  {
    id: "q-it-management-009",
    part: "B",
    topicIds: ["it-pm"],
    lessonIds: ["it/management"],
    difficulty: "medium",
    type: "scenario",
    stem: "B社はシステム開発を請負契約で委託している。B社の課長が、委託先の作業者に毎日の作業手順を直接指示し、勤務時間の管理も行っていた。この状態について適切なものはどれか。",
    options: [
      { id: "a", text: "請負契約であるため、直接指示しても問題ない。" },
      { id: "i", text: "実態が労働者派遣に該当する可能性があり、偽装請負として是正が必要である。" },
      { id: "u", text: "請負契約でも作業指示は注文者の権限であるため問題ない。" },
      { id: "e", text: "委託先の作業者をB社の従業員として扱えば問題ない。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "請負では注文者が作業者へ指揮命令できません。実際に直接指示し勤務時間を管理していると、実態は労働者派遣であり、偽装請負に該当する可能性があります。",
      why: [
        "契約形態は契約書の表題ではなく、実際の指揮命令関係で判断されます。",
        "偽装請負は労働者派遣法や職業安定法に違反する恐れがあります。",
      ],
      optionNotes: {
        a: "請負契約でも直接指示すれば偽装請負になります。",
        i: "正解です。実態に応じた契約形態への是正が必要です。",
        u: "請負では注文者は作業方法を指示できません。",
        e: "雇用関係を形式的に変えても、指揮命令関係の実態が解消されなければ問題は残ります。",
      },
      english:
        "Direct daily instruction and time management by the client indicate disguised dispatch, not a genuine work contract.",
      termIds: ["it-ukeoi", "it-haken"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["偽装請負", "科目B"],
  },
  {
    id: "q-it-management-010",
    part: "B",
    topicIds: ["it-service"],
    lessonIds: ["it/management"],
    difficulty: "hard",
    type: "scenario",
    stem: "C社は基幹システムのRTOを4時間、RPOを15分と定めた。現在は毎日23時にフルバックアップを取得している。目標を満たすための対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "バックアップの取得時刻を毎日2時に変更する。" },
      { id: "i", text: "更新ログを15分間隔で遠隔地へ転送し、4時間以内に起動できる待機環境を用意する。" },
      { id: "u", text: "フルバックアップの頻度を週1回に減らし、容量を節約する。" },
      { id: "e", text: "バックアップ媒体を同一データセンター内に保管する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "RPO 15分を満たすには15分以内の間隔でデータを保護する必要があり、RTO 4時間を満たすには4時間以内に起動できる環境が必要です。",
      why: [
        "日次バックアップだけでは、最大24時間分のデータ損失が生じ、RPOを満たしません。",
        "更新ログの転送と待機環境の組合せが、両方の目標を同時に満たします。",
      ],
      optionNotes: {
        a: "取得時刻を変えても間隔は24時間のままで、RPO 15分を満たしません。",
        i: "正解です。ログ転送でRPOを、待機環境でRTOを満たします。",
        u: "頻度を下げるとデータ損失が拡大し、RPOに反します。",
        e: "同一データセンター内では、拠点全体の被災時に復旧できずRTOを満たせません。",
      },
      english:
        "Meeting a 15-minute RPO and 4-hour RTO requires frequent log shipping and a standby environment ready within four hours.",
      termIds: ["it-rto", "it-rpo"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RTO", "RPO", "科目B"],
  },

  // ── it/strategy ───────────────────────────────────────────────
  {
    id: "q-it-strategy-001",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "固定費が900万円、変動費率が40%の事業の損益分岐点売上高はどれか。",
    options: [
      { id: "a", text: "1,000万円" },
      { id: "i", text: "1,350万円" },
      { id: "u", text: "1,500万円" },
      { id: "e", text: "2,250万円" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "限界利益率は1-0.4=0.6です。損益分岐点売上高は900/0.6=1,500万円になります。",
      why: [
        "売上高1,500万円のとき変動費は600万円、限界利益は900万円で固定費と一致し、利益は0になります。",
        "固定費を限界利益率で割ることで、利益0の売上高を求められます。",
      ],
      optionNotes: {
        a: "1,000万円では限界利益が600万円にとどまり、固定費900万円を回収できません。",
        i: "1,350万円は固定費を変動費率で割った値に近く、式を取り違えています。",
        u: "正解です。900/(1-0.4)=1,500万円です。",
        e: "2,250万円は900/0.4の計算であり、限界利益率ではなく変動費率で割っています。",
      },
      english:
        "Break-even sales = fixed costs / (1 - variable cost ratio) = 900 / 0.6 = 1,500.",
      termIds: ["it-break-even-point"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["損益分岐点", "計算問題"],
  },
  {
    id: "q-it-strategy-002",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "RPAの適用に最も適した業務はどれか。",
    options: [
      { id: "a", text: "顧客との価格交渉" },
      { id: "i", text: "毎日大量に届く注文書の内容を基幹システムへ転記する定型業務" },
      { id: "u", text: "新製品の企画を検討する業務" },
      { id: "e", text: "例外の多い苦情対応を担当者が判断する業務" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "RPAは、大量・定型・ルールが明確・例外が少ない業務に向きます。注文書の転記は代表的な適用業務です。",
      why: [
        "転記作業は判断が少なく、手順が安定しているため、自動化の効果が出やすいです。",
        "交渉、企画、例外判断の多い対応は、人による判断が必要でRPAには向きません。",
      ],
      optionNotes: {
        a: "価格交渉は相手の反応に応じた判断が必要で、定型化できません。",
        i: "正解です。大量で定型的な転記業務はRPAの典型例です。",
        u: "企画検討は非定型で創造的な判断を伴います。",
        e: "例外が多く判断を伴う業務は、RPAの適用に適しません。",
      },
      english:
        "RPA fits high-volume, rule-based, repetitive tasks such as transferring order data into a core system.",
      termIds: ["it-rpa"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RPA", "業務改善"],
  },
  {
    id: "q-it-strategy-003",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "初期投資1,000万円、5年間で毎年300万円の効果が見込まれるシステムがある。運用コストを考慮しない場合のROIはどれか。",
    options: [
      { id: "a", text: "30%" },
      { id: "i", text: "50%" },
      { id: "u", text: "150%" },
      { id: "e", text: "300%" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "5年間の効果は1,500万円です。ROI=(1,500-1,000)/1,000=0.5となり、50%です。",
      why: [
        "ROIは投資に対する利益の割合であり、分子は効果から投資を引いた額です。",
        "回収期間は1,000/300≒3.3年ですが、ROIは5年間の効果全体で計算します。",
      ],
      optionNotes: {
        a: "30%は年間効果300万円を投資額1,000万円で割った値であり、5年分を考慮していません。",
        i: "正解です。(1,500-1,000)/1,000=50%です。",
        u: "150%は効果の合計を投資額で割った値で、投資額を引いていません。",
        e: "300%は年間効果を3年分と誤って計算した場合などに生じる値です。",
      },
      english:
        "Total benefit is 15 million yen; ROI = (15 - 10) / 10 = 50%.",
      termIds: ["it-roi"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["ROI", "投資評価"],
  },
  {
    id: "q-it-strategy-004",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "easy",
    type: "knowledge",
    stem: "BCPとBCMの関係について適切なものはどれか。",
    options: [
      { id: "a", text: "BCPは計画であり、BCMはその計画を訓練・見直しする活動である。" },
      { id: "i", text: "BCPは訓練の活動であり、BCMは文書である。" },
      { id: "u", text: "両者は同一であり、計画を策定すれば完了する。" },
      { id: "e", text: "BCPは財務報告の信頼性を確保するための計画である。" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "BCPは事業継続のための計画、BCMは計画の策定・訓練・評価・見直しをPDCAで回すマネジメント活動です。",
      why: [
        "計画は作るだけでなく、訓練と見直しによって実行できる状態を維持する必要があります。",
        "財務報告の信頼性は内部統制（J-SOX）の目的であり、BCPとは異なります。",
      ],
      optionNotes: {
        a: "正解です。計画がBCP、継続的な活動がBCMです。",
        i: "役割が逆です。BCPが計画、BCMが活動です。",
        u: "策定だけでなく、訓練と見直しが必要です。",
        e: "財務報告の信頼性は内部統制の目的です。",
      },
      english:
        "A BCP is the plan; BCM is the ongoing cycle of testing, evaluating, and improving it.",
      termIds: ["it-bcp", "it-bcm"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["BCP", "BCM"],
  },
  {
    id: "q-it-strategy-005",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "easy",
    type: "knowledge",
    stem: "CIOの役割として適切なものはどれか。",
    options: [
      { id: "a", text: "個人情報の取扱い方針を統括する。" },
      { id: "i", text: "経営戦略に沿って情報システム戦略を定め、IT投資を統括する。" },
      { id: "u", text: "情報セキュリティ対策の責任者として方針を定める。" },
      { id: "e", text: "財務諸表の作成と開示を行う。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "CIOは経営戦略に沿って情報システム戦略を定め、IT投資の優先順位を決める経営層です。",
      why: [
        "CIOは情報システム部門の長ではなく、経営の一員として意思決定に参画します。",
        "セキュリティはCISO、プライバシーはCPO、財務はCFOの役割です。",
      ],
      optionNotes: {
        a: "個人情報保護の方針を統括するのはCPOです。",
        i: "正解です。IT戦略と投資の統括がCIOの役割です。",
        u: "情報セキュリティの責任者はCISOです。",
        e: "財務諸表の作成と開示はCFOや経理部門の役割です。",
      },
      english:
        "The CIO sets IT strategy aligned with business goals and governs IT investment.",
      termIds: ["it-cio", "it-cdo"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["経営", "CIO"],
  },
  {
    id: "q-it-strategy-006",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "財務諸表の説明として適切なものはどれか。",
    options: [
      { id: "a", text: "貸借対照表は一定期間の収益と費用を示す。" },
      { id: "i", text: "貸借対照表は一時点の資産・負債・純資産、損益計算書は一定期間の収益・費用・利益を示す。" },
      { id: "u", text: "キャッシュフロー計算書は利益の内訳を示す。" },
      { id: "e", text: "損益計算書は現金の増減を示す。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "貸借対照表は一時点の財政状態、損益計算書は一定期間の経営成績、キャッシュフロー計算書は現金の増減を示します。",
      why: [
        "B/Sは「ある時点」、P/LとC/Fは「一定期間」を対象にします。",
        "利益と現金は一致しないため、C/Fが別に用意されます。",
      ],
      optionNotes: {
        a: "収益と費用を示すのは損益計算書です。",
        i: "正解です。3表の対象と内容の組合せが正しいです。",
        u: "キャッシュフロー計算書は現金の増減を示します。",
        e: "現金の増減を示すのはキャッシュフロー計算書です。",
      },
      english:
        "The balance sheet shows financial position at a point in time; the income statement shows performance over a period; the cash flow statement shows cash movements.",
      termIds: ["it-financial-statements", "it-depreciation"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["財務諸表", "会計"],
  },
  {
    id: "q-it-strategy-007",
    part: "A",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "特性要因図の用途として適切なものはどれか。",
    options: [
      { id: "a", text: "不具合件数を多い順に並べ、重点を特定する。" },
      { id: "i", text: "問題の原因を人、物、方法などの要因に分けて整理する。" },
      { id: "u", text: "データの分布の形を確認する。" },
      { id: "e", text: "時系列の変動から異常を検知する。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "特性要因図は、結果（特性）に対して原因（要因）を人、物、方法などの枝分かれで整理する手法です。",
      why: [
        "原因の洗い出しと整理に向き、対策の検討に使います。",
        "件数の重点特定はパレート図、分布はヒストグラム、異常検知は管理図です。",
      ],
      optionNotes: {
        a: "件数を多い順に並べるのはパレート図です。",
        i: "正解です。原因を要因別に整理するのが特性要因図です。",
        u: "分布の形を見るのはヒストグラムです。",
        e: "時系列の異常を検知するのは管理図です。",
      },
      english:
        "A cause-and-effect diagram organizes potential causes by category such as people, equipment, and methods.",
      termIds: ["it-qc-tools"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["QC七つ道具", "品質管理"],
  },
  {
    id: "q-it-strategy-008",
    part: "B",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "scenario",
    stem: "中堅製造業のD社では、受発注システムを刷新して紙の帳票を電子化した。所要時間は30%短縮したが、事業の進め方や顧客への提供価値は変わっていない。この取組みの説明として最も適切なものはどれか。",
    options: [
      { id: "a", text: "DXの定義を満たす。デジタル技術を使ったためである。" },
      { id: "i", text: "業務の効率化（IT化）であり、事業や組織の変革を含むDXとは区別される。" },
      { id: "u", text: "BPRである。業務プロセスを根本から変えたためである。" },
      { id: "e", text: "RPAである。定型業務を自動化したためである。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "DXはデータとデジタル技術で事業や組織を変革し、競争優位を確立することを指します。帳票の電子化による時間短縮は業務効率化であり、DXとは区別されます。",
      why: [
        "事例では事業の進め方や顧客への提供価値が変わっておらず、変革の範囲が業務改善に留まっています。",
        "BPRはプロセスを根本から再設計する取組みであり、単なる電子化とは異なります。",
      ],
      optionNotes: {
        a: "デジタル技術の利用だけではDXとはいえません。事業や組織の変革が必要です。",
        i: "正解です。業務効率化とDXの違いを問う事例です。",
        u: "帳票の電子化は既存プロセスの改善であり、根本的な再設計とはいえません。",
        e: "RPAは定型操作の自動化であり、本事例の説明としては不適切です。",
      },
      english:
        "Digitizing forms improves efficiency but does not transform the business model or value proposition, so it is not DX.",
      termIds: ["it-dx", "it-bpr", "it-rpa"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["DX", "科目B"],
  },
  {
    id: "q-it-strategy-009",
    part: "B",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "medium",
    type: "scenario",
    stem: "E社は災害対策として、RPO 0分、RTO 1時間を目標に掲げた。この目標を満たす対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "毎週日曜日にフルバックアップを取得し、社内の別室に保管する。" },
      { id: "i", text: "本番サイトと同期複製する遠隔サイトを用意し、自動切替の訓練を行う。" },
      { id: "u", text: "バックアップ媒体を本番サーバの隣に保管する。" },
      { id: "e", text: "復旧手順書を作成し、年度末に一度だけ見直す。" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "RPO 0分には同期複製によるデータ保護が必要で、RTO 1時間には自動切替できる遠隔サイトと訓練が不可欠です。",
      why: [
        "同期複製なら、障害発生時点までのデータを失わずに済みます。",
        "遠隔サイトと自動切替の訓練により、1時間以内の復旧を現実的にします。",
      ],
      optionNotes: {
        a: "週次バックアップではRPO 0分を満たせず、別室では拠点被災時に復旧できません。",
        i: "正解です。同期複製と遠隔サイトが両方の目標を満たします。",
        u: "本番サーバの隣では、火災や地震で同時に失われます。",
        e: "手順書の作成だけでは復旧時間を保証できず、訓練も不足しています。",
      },
      english:
        "An RPO of zero requires synchronous replication, and a one-hour RTO requires an offsite site with tested automatic failover.",
      termIds: ["it-rto", "it-rpo", "it-bcp"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["RTO", "RPO", "科目B"],
  },
  {
    id: "q-it-strategy-010",
    part: "B",
    topicIds: ["it-strategy"],
    lessonIds: ["it/strategy"],
    difficulty: "hard",
    type: "scenario",
    stem: "F社の事業は、固定費1,200万円、変動費率70%である。売上高3,000万円のときの利益と、損益分岐点売上高の組合せとして適切なものはどれか。",
    options: [
      { id: "a", text: "利益 ▲300万円、損益分岐点 4,000万円" },
      { id: "i", text: "利益 ▲300万円、損益分岐点 1,714万円" },
      { id: "u", text: "利益 300万円、損益分岐点 4,000万円" },
      { id: "e", text: "利益 ▲900万円、損益分岐点 4,000万円" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "限界利益率は30%です。売上3,000万円の限界利益は900万円で、固定費1,200万円を引くと▲300万円になります。損益分岐点は1,200/0.3=4,000万円です。",
      why: [
        "変動費は3,000×0.7=2,100万円、限界利益は900万円です。",
        "損益分岐点売上高は固定費を限界利益率で割って求めます。",
      ],
      optionNotes: {
        a: "正解です。利益は▲300万円、損益分岐点は4,000万円です。",
        i: "1,714万円は固定費を変動費率で割った値に近く、式を取り違えています。",
        u: "売上3,000万円では固定費を回収できておらず、利益は負になります。",
        e: "▲900万円は限界利益そのもので、固定費を引いていません。",
      },
      english:
        "Contribution margin ratio is 30%. Profit = 9 - 12 = -3 million yen; break-even sales = 12 / 0.3 = 40 million yen.",
      termIds: ["it-break-even-point"],
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: ["損益分岐点", "計算問題", "科目B"],
  },
] as const satisfies readonly Question[];
