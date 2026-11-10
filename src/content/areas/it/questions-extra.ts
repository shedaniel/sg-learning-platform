import type { Block, OptionId, Question } from "@/lib/content/types";

type Pos = "a" | "i" | "u" | "e";

interface Spec {
  n: number;
  part: "A" | "B";
  topicIds: string[];
  lessonId: string;
  difficulty: "easy" | "medium" | "hard";
  stem: string;
  presentation?: Block[];
  /** 正解の選択肢と、配置したい記号 */
  right: string;
  pos: Pos;
  /** 誤りの選択肢（正解以外の枠に a, i, u, e の順で入る） */
  wrong: [string, string, string];
  correct: string;
  why: string[];
  rightNote: string;
  wrongNotes: [string, string, string];
  english: string;
  termIds: string[];
  tags: string[];
}

const ORDER: Pos[] = ["a", "i", "u", "e"];

function mk(s: Spec): Question {
  const rest = ORDER.filter((p) => p !== s.pos);
  const options = ORDER.map((p) =>
    p === s.pos
      ? { id: p as OptionId, text: s.right }
      : { id: p as OptionId, text: s.wrong[rest.indexOf(p)] },
  );
  const optionNotes: Partial<Record<OptionId, string>> = {};
  for (const p of ORDER) {
    optionNotes[p] = p === s.pos ? s.rightNote : s.wrongNotes[rest.indexOf(p)];
  }
  return {
    id: `q-it-ext-${String(s.n).padStart(3, "0")}`,
    part: s.part,
    topicIds: s.topicIds,
    lessonIds: [s.lessonId],
    difficulty: s.difficulty,
    type: s.part === "B" ? "scenario" : "knowledge",
    stem: s.stem,
    ...(s.presentation ? { presentation: s.presentation } : {}),
    options,
    correctOptionId: s.pos,
    explanation: {
      correct: s.correct,
      why: s.why,
      optionNotes,
      english: s.english,
      termIds: s.termIds,
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: s.tags,
  };
}

export const questionsExtra: Question[] = [
  // ── it/network-db：ネットワーク ─────────────────────────────
  mk({
    n: 1,
    part: "A",
    topicIds: ["it-network"],
    lessonId: "it/network-db",
    difficulty: "hard",
    stem: "172.16.35.200/27 のホストが属するサブネットのブロードキャストアドレスはどれか。",
    right: "172.16.35.223",
    pos: "i",
    wrong: ["172.16.35.207", "172.16.35.231", "172.16.35.255"],
    correct:
      "/27のブロックサイズは32であり、200が含まれるブロックは192～223である。ブロードキャストアドレスはその末尾の223である。",
    why: [
      "プレフィックス長27のホスト部は5ビットで、ブロックサイズは 2^5 = 32 となる。",
      "ブロックは0、32、64、…、192、224と区切られ、200は192以上224未満なので、ネットワークアドレスは172.16.35.192、ブロードキャストアドレスは172.16.35.223である。",
    ],
    rightNote: "正解である。192+32−1 = 223 が、このブロックの末尾である。",
    wrongNotes: [
      "207は、ブロックサイズを16（/28）として計算した場合の192～207の末尾である。",
      "231は、224から始まる次のブロックの途中の値であり、200を含むブロックのブロードキャストアドレスではない。",
      "255は、/24のブロック全体の末尾であり、/27では末尾にならない。",
    ],
    english:
      "With a /27 mask the block size is 32; 200 falls in 192–223, so the broadcast address is 172.16.35.223.",
    termIds: ["it-subnet-mask", "it-ip-address"],
    tags: ["サブネット", "計算問題"],
  }),
  mk({
    n: 2,
    part: "A",
    topicIds: ["it-network"],
    lessonId: "it/network-db",
    difficulty: "medium",
    stem: "プレフィックス長が /26 のネットワークで、同じネットワークに属する2台の端末のIPアドレスの組合せとして、適切なものはどれか。",
    right: "192.168.10.100 と 192.168.10.126",
    pos: "u",
    wrong: [
      "192.168.10.62 と 192.168.10.65",
      "192.168.10.127 と 192.168.10.128",
      "192.168.10.190 と 192.168.10.193",
    ],
    correct:
      "/26のブロックサイズは64で、ブロックは0～63、64～127、128～191、192～255である。100と126は同じ64～127のブロックに属する。",
    why: [
      "ブロックの境界は64の倍数で、ブロックごとに別のネットワークになる。",
      "同じネットワークかどうかは、両方のアドレスが同じブロックに入るかで判断する。",
    ],
    rightNote: "正解である。100と126は、どちらも64～127のブロックにある。",
    wrongNotes: [
      "62は0～63、65は64～127のブロックにあり、別のネットワークである。",
      "127は64～127のブロックの末尾（ブロードキャストアドレス）、128は次のブロックの先頭であり、別のネットワークである。",
      "190は128～191、193は192～255のブロックにあり、別のネットワークである。",
    ],
    english:
      "With /26, blocks are 64 addresses wide; 100 and 126 both lie in 64–127 and therefore share a network.",
    termIds: ["it-subnet-mask", "it-ip-address"],
    tags: ["サブネット", "ネットワークアドレス"],
  }),
  mk({
    n: 3,
    part: "B",
    topicIds: ["it-network"],
    lessonId: "it/network-db",
    difficulty: "medium",
    stem: "原因と対処の組合せとして、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "G社の支店で、新しく設置した端末Xから、同じ事務所内の販売管理サーバには接続できるが、インターネット上のWebサイトには接続できない。同じ事務所の他の端末は、インターネットに接続できている。端末Xのネットワーク設定は次のとおりである。",
      },
      {
        type: "table",
        caption: "端末Xのネットワーク設定",
        headers: ["項目", "設定値"],
        rows: [
          ["IPアドレス", "192.168.1.50"],
          ["サブネットマスク", "255.255.255.0"],
          ["デフォルトゲートウェイ", "192.168.2.1"],
          ["DNSサーバ", "192.168.1.10"],
        ],
        note: "事務所内のルータのアドレスは192.168.1.1である。他の端末のDNSサーバは192.168.1.10で、正常に動作している。",
      },
    ],
    right:
      "デフォルトゲートウェイが端末と別のネットワークのアドレスになっている。同じネットワーク内のルータのアドレス192.168.1.1に修正する。",
    pos: "a",
    wrong: [
      "サブネットマスクが小さすぎる。255.255.0.0に変更し、ゲートウェイは192.168.2.1のまま使う。",
      "DNSサーバの設定が誤っている。インターネット上のDNSサーバのアドレスに変更する。",
      "ファイアウォールでTCP445番を許可する。",
    ],
    correct:
      "ゲートウェイは端末が直接到達できる同一ネットワーク内のルータでなければならない。192.168.2.1は端末の192.168.1.0/24の外にある。",
    why: [
      "同じネットワーク内のサーバにはゲートウェイを介さず通信できるため、販売管理サーバには接続できる。",
      "他のネットワークへの通信は、ゲートウェイ経由になる。ゲートウェイに届かないと、インターネットへ出られない。",
    ],
    rightNote: "正解である。ゲートウェイを同一ネットワーク内のルータ（192.168.1.1）に修正する。",
    wrongNotes: [
      "マスクを変えても、192.168.2.1という機器が同じ事務所に実在するわけではない。根本の原因を取り違えている。",
      "他の端末は同じDNSサーバで正常に動作している。DNSサーバの設定は原因ではない。",
      "445番はSMB（ファイル共有）であり、Webサイトへの接続や今回の症状とは関係がない。",
    ],
    english:
      "The default gateway must be on the same subnet as the host; 192.168.2.1 is unreachable from 192.168.1.50/24, so it should be 192.168.1.1.",
    termIds: ["it-default-gateway", "it-subnet-mask", "it-dns"],
    tags: ["デフォルトゲートウェイ", "障害切り分け", "科目B"],
  }),
  mk({
    n: 4,
    part: "A",
    topicIds: ["it-network"],
    lessonId: "it/network-db",
    difficulty: "medium",
    stem: "Webサイトのサーバを移転し、IPアドレスが変わる。切替後に、利用者が新しいサーバへ速やかに到達できるようにするために、事前に行う設定変更として、最も適切なものはどれか。",
    right:
      "移転の数日前から、該当するAレコードのTTLを短く設定し、旧IPアドレスの情報が早く期限切れになるようにする。",
    pos: "e",
    wrong: [
      "移転当日にTTLを最大に設定し、新しいIPアドレスの情報を長く保持させる。",
      "サブネットマスクを変更し、新旧のサーバを同じネットワークにまとめる。",
      "DHCPのリース時間を短くし、端末に新しいIPアドレスを配り直す。",
    ],
    correct:
      "TTLは名前解決の結果をキャッシュしてよい時間である。移転前に短くしておくと、古い情報が早く破棄され、切替が速やかに反映される。",
    why: [
      "すでに長いTTLでキャッシュされた応答は、そのTTLが切れるまで使われる。そのため、切替の前に短縮しておく必要がある。",
      "TTLを短くすると反映は速くなるが、DNSサーバへの問合せが増える。移転後は元に戻す。",
    ],
    rightNote: "正解である。移転前にAレコードのTTLを短縮しておく。",
    wrongNotes: [
      "当日にTTLを長くすると、旧IPアドレスや新アドレスの情報が長くキャッシュされ、切替の反映が遅れる。",
      "サブネットマスクは、同一ネットワークの範囲を決める設定であり、名前解決の反映とは関係がない。",
      "DHCPのリース時間は、端末へのアドレス配布の期間であり、Webサイトのサーバのアドレスの反映とは関係がない。",
    ],
    english:
      "Lower the A record's TTL well before the migration so that cached old answers expire quickly.",
    termIds: ["it-dns", "it-ip-address"],
    tags: ["DNS", "TTL"],
  }),
  mk({
    n: 5,
    part: "A",
    topicIds: ["it-network"],
    lessonId: "it/network-db",
    difficulty: "easy",
    stem: "プライベートIPアドレスの範囲に含まれるものはどれか。",
    right: "172.20.1.1",
    pos: "u",
    wrong: ["172.15.3.4", "172.32.0.5", "192.169.1.1"],
    correct:
      "プライベートアドレスは、10.0.0.0/8、172.16.0.0/12（172.16.0.0～172.31.255.255）、192.168.0.0/16である。172.20.1.1は172.16.0.0/12に含まれる。",
    why: [
      "172.16.0.0/12は、2番目のオクテットが16～31の範囲である。",
      "範囲の外側にある172.15.x.xや172.32.x.x、192.169.x.xはグローバルアドレスである。",
    ],
    rightNote: "正解である。2番目のオクテットが20で、16～31の範囲にある。",
    wrongNotes: [
      "2番目のオクテットが15で、172.16.0.0/12の範囲の外にある。",
      "2番目のオクテットが32で、172.16.0.0/12の範囲の外にある。",
      "192.168.0.0/16ではなく192.169.x.xであり、範囲の外にある。",
    ],
    english:
      "The private range 172.16.0.0/12 covers 172.16.0.0–172.31.255.255, so 172.20.1.1 qualifies.",
    termIds: ["it-ip-address", "it-subnet-mask"],
    tags: ["プライベートアドレス"],
  }),
  // ── it/network-db：データベース ─────────────────────────────
  mk({
    n: 6,
    part: "A",
    topicIds: ["it-db"],
    lessonId: "it/network-db",
    difficulty: "medium",
    stem: "次の「社員」表に対して、SQL文を実行した結果として、適切なものはどれか。",
    presentation: [
      {
        type: "table",
        caption: "社員表",
        headers: ["社員番号", "部署"],
        rows: [
          ["1", "営業"],
          ["2", "営業"],
          ["3", "開発"],
          ["4", "営業"],
          ["5", "開発"],
          ["6", "総務"],
          ["7", "開発"],
          ["8", "開発"],
          ["9", "総務"],
        ],
      },
      {
        type: "p",
        text: "`SELECT 部署, COUNT(*) FROM 社員 GROUP BY 部署 HAVING COUNT(*) >= 3`",
      },
    ],
    right: "営業が3、開発が4の2行が得られる。",
    pos: "i",
    wrong: [
      "営業が3、開発が4、総務が2の3行が得られる。",
      "開発が4の1行だけが得られる。",
      "社員表の9行が、そのまま得られる。",
    ],
    correct:
      "GROUP BYで部署ごとに集計すると、営業3、開発4、総務2になる。HAVINGで3以上に絞るため、営業と開発の2行が残る。",
    why: [
      "HAVINGは集約後の結果を絞り込む。条件は「3以上」なので、3の営業も含まれる。",
      "WHEREは集約前の行を絞り込み、集約関数の結果には使えない。",
    ],
    rightNote: "正解である。営業3、開発4が条件を満たす。",
    wrongNotes: [
      "HAVINGの条件が効いておらず、総務（2）が含まれている。",
      "条件は「3以上」であり、「3を超える」ではない。営業（3）も含まれる。",
      "GROUP BYで部署ごとに集約されるため、元の行のまま出力されることはない。",
    ],
    english:
      "GROUP BY aggregates per department and HAVING keeps groups with at least 3 rows, leaving Sales (3) and Development (4).",
    termIds: ["it-relational-database"],
    tags: ["SQL", "GROUP BY", "HAVING"],
  }),
  mk({
    n: 7,
    part: "A",
    topicIds: ["it-db"],
    lessonId: "it/network-db",
    difficulty: "easy",
    stem: "関係データベースの「外部キー」の説明として、最も適切なものはどれか。",
    right:
      "他の表の主キーを参照する列であり、参照先に存在しない値の登録を拒否して、表間の整合性（参照整合性）を保つ。",
    pos: "e",
    wrong: [
      "同じ値を持つ行が複数存在することを禁止し、表の行を一意に識別する。",
      "検索条件に使う列の検索を高速にするために、列に付ける索引である。",
      "複数の更新を1つの処理単位として扱い、途中で失敗した場合にすべてを取り消す。",
    ],
    correct:
      "外部キーは、他の表の主キーを参照する列で、参照先にない値の登録を拒否して参照整合性を保つ。",
    why: [
      "受注表の顧客番号を、顧客表の主キーを参照する外部キーにすると、存在しない顧客への受注を登録できない。",
      "行の一意な識別は主キー、検索の高速化は索引、処理単位の一括取消しはトランザクションの役割である。",
    ],
    rightNote: "正解である。参照先にない値を登録できないようにする。",
    wrongNotes: [
      "行を一意に識別するのは主キーの役割である。",
      "検索を高速にするのは索引（インデックス）の役割である。",
      "更新を1つの処理単位として扱うのは、トランザクション（原子性）の役割である。",
    ],
    english:
      "A foreign key references another table's primary key and rejects values that do not exist there, preserving referential integrity.",
    termIds: ["it-primary-key", "it-relational-database"],
    tags: ["外部キー", "参照整合性"],
  }),
  mk({
    n: 8,
    part: "A",
    topicIds: ["it-db"],
    lessonId: "it/network-db",
    difficulty: "hard",
    stem: "次の「受注明細」表の正規化に関する記述として、適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "受注明細（受注番号、商品コード、商品名、数量）　主キー：（受注番号、商品コード）",
      },
      {
        type: "list",
        items: [
          "商品名は、商品コードによって一意に決まる。",
          "数量は、受注番号と商品コードの組によって決まる。",
          "各列の値は、1つの欄に複数の値を含まない。",
        ],
      },
    ],
    right:
      "商品名が主キーの一部（商品コード）だけに従属しているため、第2正規形を満たさない。商品表（商品コード、商品名）を分けると、商品名の修正が1か所で済む。",
    pos: "a",
    wrong: [
      "商品名が主キー以外の列に従属しているため、第3正規形を満たさない。受注番号を削除すれば解消する。",
      "1つの欄に複数の値を含むため、第1正規形を満たさない。数量を別の表に分ければ解消する。",
      "すべての列が主キー全体に従属しているため、正規化を行う必要はない。",
    ],
    correct:
      "主キーの一部だけに従属する列（部分関数従属）がある表は第2正規形ではない。商品表を分けることで、更新の矛盾を防げる。",
    why: [
      "商品名は主キー全体ではなく商品コードだけで決まる。同じ商品名が明細ごとに重複し、修正漏れが起きる。",
      "各列の値は単一であるため、第1正規形は満たしている。",
    ],
    rightNote: "正解である。部分関数従属があり、第2正規形でない。",
    wrongNotes: [
      "商品名は主キー以外ではなく、主キーの一部（商品コード）に従属している。これは第2正規形の違反であり、受注番号は削除できない。",
      "各列の値が単一であるという条件が示されており、第1正規形は満たしている。",
      "商品名は主キー全体ではなく、一部だけに従属しているため、正規化が必要である。",
    ],
    english:
      "Product name depends on only part of the composite key, a partial dependency, so the table is not in 2NF; split out a product table.",
    termIds: ["it-primary-key", "it-relational-database"],
    tags: ["正規化", "第2正規形"],
  }),
  mk({
    n: 9,
    part: "A",
    topicIds: ["it-db"],
    lessonId: "it/network-db",
    difficulty: "medium",
    stem: "データベースサーバが障害で停止し、再起動した。障害時点で、コミット済みだがディスクに反映されていない更新と、コミット前の更新があったとき、それぞれに対する回復処理の組合せとして、適切なものはどれか。",
    right:
      "コミット済み：ロールフォワード（更新後ログで再反映する）／未コミット：ロールバック（更新前ログで取り消す）",
    pos: "i",
    wrong: [
      "コミット済み：ロールバック／未コミット：ロールフォワード",
      "コミット済み：ロールフォワード／未コミット：ロールフォワード",
      "コミット済み：ロールバック／未コミット：ロールバック",
    ],
    correct:
      "確定した更新は永続性を守るためにロールフォワードで反映し、確定していない更新は原子性を守るためにロールバックで取り消す。",
    why: [
      "ロールフォワードは、更新後ログを使い、チェックポイント以降の確定済みの更新を再度反映する。",
      "ロールバックは、更新前ログを使い、未確定の更新を取り消して処理前の状態に戻す。",
    ],
    rightNote: "正解である。確定済みはロールフォワード、未確定はロールバックである。",
    wrongNotes: [
      "処理が逆になっている。確定した更新を取り消すと永続性が損なわれ、未確定の更新を反映すると原子性が損なわれる。",
      "未確定の更新までロールフォワードすると、確定していない処理が反映される。",
      "確定した更新まで取り消すと、コミットした結果が失われ、永続性が損なわれる。",
    ],
    english:
      "After a crash, committed work is rolled forward from after-image logs and uncommitted work is rolled back using before-images.",
    termIds: ["it-rollforward", "it-transaction"],
    tags: ["障害回復", "ロールフォワード"],
  }),
  mk({
    n: 10,
    part: "B",
    topicIds: ["it-db"],
    lessonId: "it/network-db",
    difficulty: "hard",
    stem: "Q社が行うべき対応として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "Q社の受注システムでは、月末に在庫の引当処理Aと、注文の締め処理Bが同時に動く。このとき、いずれかの処理がロック待ちのまま止まり、タイムアウトで失敗することが頻発している。調査の結果、2つの処理が更新する行のロック順序は次のとおりだった。",
      },
      {
        type: "table",
        caption: "各処理のロック取得順序",
        headers: ["処理", "1番目にロックする表", "2番目にロックする表"],
        rows: [
          ["処理A（在庫の引当）", "在庫表", "注文表"],
          ["処理B（注文の締め）", "注文表", "在庫表"],
        ],
      },
    ],
    right:
      "2つの処理がロックを取得する順序を在庫表、注文表の順に統一する。それでも待ちが生じた処理はDBMSの検出に従ってロールバックし、再実行できるようにする。",
    pos: "u",
    wrong: [
      "排他制御を無効にして、ロック待ちが起きないようにする。",
      "分離レベルを最も低い「未コミット読取り」に下げ、読取り時のロックを省けば、競合はなくなる。",
      "ロックを解放するために、DBMSを毎晩再起動する。",
    ],
    correct:
      "互いに相手の持つロックを待つデッドロックは、ロックの取得順序を統一して防ぎ、発生した場合はロールバックして再実行する。",
    why: [
      "処理Aは在庫表、処理Bは注文表を先に押さえ、相互に相手の表を待つ。取得順序を揃えると、循環する待ちが起きにくい。",
      "排他制御を外すと、更新の消失や二重引当などデータの不整合が起きる。",
    ],
    rightNote: "正解である。ロック順序の統一と、ロールバックによる再実行を組み合わせる。",
    wrongNotes: [
      "排他制御を無効にすると、更新の消失や二重引当が起きる。問題を悪化させる。",
      "分離レベルを下げるのは読取りの扱いの話であり、更新同士のロック競合は解消しない。ダーティリードの危険も増える。",
      "再起動は処理を中断させるだけで、原因の解消にならない。再発し、処理も失敗する。",
    ],
    english:
      "Deadlock is avoided by acquiring locks in a consistent order, and victims are rolled back and retried rather than disabling locking.",
    termIds: ["it-exclusive-control", "it-transaction"],
    tags: ["デッドロック", "排他制御", "科目B"],
  }),
  mk({
    n: 11,
    part: "B",
    topicIds: ["it-db"],
    lessonId: "it/network-db",
    difficulty: "medium",
    stem: "RTO（目標復旧時間）3時間を満たすバックアップ方式と、障害時の復元にかかる時間の組合せとして、適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "P社の基幹データベースは、日曜の23:00にフルバックアップを取得し、月曜から木曜までは毎晩23:00に、増分バックアップ（前回のバックアップ以降の変更分）または差分バックアップ（日曜のフルバックアップ以降の変更分）のどちらかを取得する。金曜の12:00にディスク障害が起き、データベースの復元が必要になった。",
      },
      {
        type: "list",
        items: [
          "復元は、バックアップ1本につき40分かかる。複数本は順に直列に復元する。",
          "ログの適用や検証の時間は考慮しない。",
          "RTOは3時間（180分）である。",
        ],
      },
    ],
    right:
      "差分方式を採用する。日曜のフルと木曜の差分の2本を復元し、80分でRTOを満たす。",
    pos: "a",
    wrong: [
      "増分方式を採用する。日曜のフルと月曜から木曜の増分の5本を復元し、200分でRTOを満たす。",
      "増分方式を採用する。月曜から木曜の増分の4本を復元し、160分でRTOを満たす。",
      "差分方式を採用する。日曜のフルと月曜から木曜の差分の5本を復元し、200分かかる。",
    ],
    correct:
      "差分方式では、フルと直近の差分の2本で復元でき、80分である。増分方式ではフル＋増分4本の5本が必要で200分となり、RTOを超える。",
    why: [
      "差分バックアップは、フル以降の変更をすべて含むため、最新の差分1本で足りる。",
      "増分バックアップは前回以降の変更だけなので、フルから最新までのすべての増分を順に適用する必要がある。",
    ],
    rightNote: "正解である。差分方式は2本で80分、RTOの180分以内に収まる。",
    wrongNotes: [
      "増分方式では、フル＋増分4本の計5本で200分かかり、RTOの180分を超える。",
      "増分方式でも、基になるフルバックアップが必要である。フルを含めない4本では復元できない。",
      "差分方式では、最新の差分1本にそれまでの変更がすべて含まれるため、月曜から木曜のすべての差分は要らない。",
    ],
    english:
      "A differential backup needs only the full plus the latest differential (2 sets, 80 min); an incremental chain needs 5 sets, 200 min, exceeding the RTO.",
    termIds: ["it-rto", "it-rpo"],
    tags: ["バックアップ", "RTO", "計算問題", "科目B"],
  }),
  // ── it/systems ───────────────────────────────────────────────
  mk({
    n: 12,
    part: "A",
    topicIds: ["it-system"],
    lessonId: "it/systems",
    difficulty: "hard",
    stem: "稼働率0.9のWebサーバ2台を、どちらか1台が稼働していればよい並列構成にし、この構成と稼働率0.95のDBサーバ1台を直列に接続したシステムがある。このシステム全体の稼働率はどれか。ここで、各装置の故障は独立に発生する。",
    right: "0.9405",
    pos: "e",
    wrong: ["0.7695", "0.8550", "0.9995"],
    correct:
      "Web層の並列の稼働率は 1−(1−0.9)^2 = 0.99である。これとDBサーバの直列なので、0.99×0.95 = 0.9405となる。",
    why: [
      "並列構成は、全部が同時に止まった場合のみ停止する。稼働率は 1−(各故障率の積) で求める。",
      "直列構成は、1つでも止まると全体が止まる。稼働率は各稼働率の積で求める。",
    ],
    rightNote: "正解である。0.99×0.95 = 0.9405である。",
    wrongNotes: [
      "0.9×0.9×0.95 の値であり、Webサーバ2台を直列とみなしている。",
      "0.9×0.95 の値であり、Webサーバを1台とみなして、並列化の効果を無視している。",
      "1−0.1×0.1×0.05 の値であり、DBサーバも含めて全体を並列とみなしている。",
    ],
    english:
      "Two parallel 0.9 servers give 1−0.1² = 0.99; in series with a 0.95 DB server the total is 0.99×0.95 = 0.9405.",
    termIds: ["it-availability", "it-cluster"],
    tags: ["稼働率", "直列・並列", "計算問題"],
  }),
  mk({
    n: 13,
    part: "B",
    topicIds: ["it-system"],
    lessonId: "it/systems",
    difficulty: "hard",
    stem: "MTBFが変わらないものとして、稼働率99.5%以上とするために必要なMTTRとして、選択肢の中で適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "R社のファイルサーバは、SLAで月間の稼働率99.5%以上を求められている。現在の運用実績は次のとおりである。",
      },
      {
        type: "list",
        items: [
          "運用期間：2,000時間",
          "故障の回数：4回",
          "故障による停止時間の合計：40時間",
        ],
      },
      {
        type: "p",
        text: "稼働率は、MTBF ÷（MTBF＋MTTR）で求める。MTBFは故障なく稼働した時間の平均、MTTRは修復にかかった時間の平均である。",
      },
    ],
    right: "2時間",
    pos: "u",
    wrong: ["5時間", "4時間", "3時間"],
    correct:
      "稼働時間は1,960時間で、MTBFは490時間、現在のMTTRは10時間（稼働率98%）である。MTTRが2時間なら 490÷492 ≒ 0.9959となり、99.5%以上を満たす。",
    why: [
      "3時間では 490÷493 ≒ 0.9939 となり、99.5%に届かない。4時間は ≒ 0.9919、5時間は ≒ 0.9899である。",
      "稼働率99.5%以上にするには、MTTRを約2.46時間以下にする必要がある。選択肢で満たすのは2時間だけである。",
    ],
    rightNote: "正解である。490÷492 ≒ 0.9959で、99.5%以上になる。",
    wrongNotes: [
      "490÷495 ≒ 0.9899であり、99.5%に届かない。",
      "490÷494 ≒ 0.9919であり、99.5%に届かない。",
      "490÷493 ≒ 0.9939であり、99.5%にわずかに届かない。",
    ],
    english:
      "MTBF is 490 h; to reach 99.5% availability the MTTR must be about 2.46 h or less, so only 2 hours qualifies.",
    termIds: ["it-mtbf", "it-mttr", "it-availability"],
    tags: ["MTBF", "MTTR", "稼働率", "科目B"],
  }),
  // ── it/management：プロジェクト ──────────────────────────────
  mk({
    n: 14,
    part: "A",
    topicIds: ["it-pm"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "次の作業と先行関係をもつプロジェクトの、最短完了日数とクリティカルパスの組合せとして、適切なものはどれか。",
    presentation: [
      {
        type: "table",
        caption: "作業の所要日数と先行作業",
        headers: ["作業", "所要日数", "先行作業"],
        rows: [
          ["A", "3", "なし"],
          ["B", "4", "A"],
          ["C", "2", "A"],
          ["D", "5", "B"],
          ["E", "3", "C"],
          ["F", "2", "D、E"],
        ],
      },
    ],
    right: "14日、A→B→D→F",
    pos: "i",
    wrong: ["10日、A→C→E→F", "14日、A→C→E→F", "19日、すべての作業の合計"],
    correct:
      "経路はA→B→D→F（3+4+5+2＝14日）とA→C→E→F（3+2+3+2＝10日）の2つである。最も長い前者がクリティカルパスで、最短完了日数は14日になる。",
    why: [
      "最短完了日数は、すべての経路のうち最長のものが決める。",
      "作業Fは、DとEの両方が終わらないと始められない。Dを含む経路が長いため、完了は14日になる。",
    ],
    rightNote: "正解である。最長の経路A→B→D→Fが14日である。",
    wrongNotes: [
      "10日は、短い経路A→C→E→Fの日数である。最長の経路ではない。",
      "日数は合っているが、経路が誤っている。A→C→E→Fは10日である。",
      "19日は、並行して進められる作業も含めた合計である。完了日数は最長の経路で決まる。",
    ],
    english:
      "The longest path A→B→D→F takes 3+4+5+2 = 14 days; it is the critical path and sets the minimum duration.",
    termIds: ["it-critical-path", "it-wbs"],
    tags: ["クリティカルパス", "計算問題"],
  }),
  mk({
    n: 15,
    part: "B",
    topicIds: ["it-pm"],
    lessonId: "it/management",
    difficulty: "hard",
    stem: "プロジェクト全体の完了を1日短縮するために、追加費用が同じであるとき、最も効果的な施策はどれか。",
    presentation: [
      {
        type: "p",
        text: "S社のプロジェクトで、発注者から納期の1日短縮を求められた。作業の所要日数と先行作業は次のとおりである。",
      },
      {
        type: "table",
        caption: "作業の所要日数と先行作業",
        headers: ["作業", "所要日数", "先行作業"],
        rows: [
          ["A", "2", "なし"],
          ["B", "5", "A"],
          ["C", "3", "A"],
          ["D", "4", "B"],
          ["E", "6", "C"],
          ["F", "2", "D、E"],
        ],
      },
    ],
    right: "作業Fを1日短縮する。",
    pos: "e",
    wrong: [
      "作業Bだけを2日短縮する。",
      "作業Eだけを1日短縮する。",
      "作業CとEをそれぞれ1日短縮する。",
    ],
    correct:
      "経路A→B→D→F（2+5+4+2＝13日）とA→C→E→F（2+3+6+2＝13日）の両方がクリティカルパスである。両方に含まれるFを1日短縮すると、完了が12日になる。",
    why: [
      "クリティカルパスが複数ある場合は、片方だけを短縮しても、もう片方が全体の日数を決める。",
      "Bだけを2日、またはEだけを1日短縮しても、もう一方の経路が13日のままで、全体は短縮されない。",
    ],
    rightNote: "正解である。Fは両方の経路に含まれるため、1日の短縮で全体が12日になる。",
    wrongNotes: [
      "Bを短縮すると、A→B→D→Fは11日になるが、A→C→E→Fは13日のままで、全体は13日である。",
      "Eを短縮すると、A→C→E→Fは12日になるが、A→B→D→Fは13日のままで、全体は13日である。",
      "CとEを短縮しても、A→C→E→Fが11日になるだけで、A→B→D→Fは13日のままである。",
    ],
    english:
      "Both paths take 13 days, so shortening one path does not help; task F lies on both, so cutting it by one day shortens the project.",
    termIds: ["it-critical-path", "it-wbs"],
    tags: ["クリティカルパス", "工期短縮", "科目B"],
  }),
  mk({
    n: 16,
    part: "A",
    topicIds: ["it-pm"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "予算総額（BAC）が1,200万円のプロジェクトで、ある時点のPVが500万円、EVが450万円、ACが600万円であった。この時点のSVとCPIの組合せとして、適切なものはどれか。",
    right: "SV：−50万円、CPI：0.75",
    pos: "a",
    wrong: [
      "SV：−50万円、CPI：1.33",
      "SV：+50万円、CPI：0.75",
      "SV：−150万円、CPI：0.90",
    ],
    correct:
      "SVはEV−PV＝450−500＝−50万円、CPIはEV÷AC＝450÷600＝0.75である。進捗は遅れ、コスト効率も悪い。",
    why: [
      "SVが負なら進捗の遅れ、CPIが1未満ならコスト超過を表す。",
      "なお、CVはEV−AC＝450−600＝−150万円、SPIはEV÷PV＝0.9である。",
    ],
    rightNote: "正解である。SV＝−50万円、CPI＝0.75である。",
    wrongNotes: [
      "1.33はAC÷EV（600÷450）であり、CPIの分子と分母を逆にしている。",
      "SVの符号が逆である。EVがPVを下回っているので、SVは負になる。",
      "−150万円はCV（EV−AC）であり、SVではない。0.90はSPIであり、CPIではない。",
    ],
    english:
      "SV = EV − PV = −50; CPI = EV ÷ AC = 0.75, so the project is behind schedule and over cost.",
    termIds: ["it-evm"],
    tags: ["EVM", "SV", "CPI", "計算問題"],
  }),
  mk({
    n: 17,
    part: "A",
    topicIds: ["it-pm"],
    lessonId: "it/management",
    difficulty: "easy",
    stem: "プロジェクトのリスク対応に関する次のア～ウの例が該当する対応の組合せとして、適切なものはどれか。",
    presentation: [
      {
        type: "list",
        items: [
          "ア: 実績のない新技術の採用をやめ、実績のある技術に変更する。",
          "イ: プロジェクトで生じる損害を、保険に加入して補填できるようにする。",
          "ウ: 要員の離脱に備えて、手順書を整備し、代替要員を育成する。",
        ],
      },
    ],
    right: "ア：回避／イ：転嫁／ウ：軽減",
    pos: "i",
    wrong: [
      "ア：軽減／イ：転嫁／ウ：回避",
      "ア：回避／イ：軽減／ウ：受容",
      "ア：転嫁／イ：回避／ウ：軽減",
    ],
    correct:
      "リスクの原因を取り除くのが回避、第三者へ移すのが転嫁、発生確率や影響を小さくするのが軽減である。",
    why: [
      "アは原因となる新技術の採用自体をやめるため回避、イは損害を保険に移すため転嫁である。",
      "ウは発生した場合の影響を小さくするため軽減である。受容は、対策せず予備費などで備える対応である。",
    ],
    rightNote: "正解である。回避、転嫁、軽減の組合せが正しい。",
    wrongNotes: [
      "アとウが入れ替わっている。原因を取り除くアが回避である。",
      "イは損害を移すため転嫁であり、軽減ではない。ウも対策を行うため受容ではなく軽減である。",
      "アとイが入れ替わっている。保険は転嫁、新技術をやめることは回避である。",
    ],
    english:
      "Dropping the risky technology is avoidance, insurance is transfer, and preparing backups is mitigation.",
    termIds: ["it-wbs", "it-scope-creep"],
    tags: ["リスク対応", "回避・転嫁・軽減"],
  }),
  mk({
    n: 18,
    part: "B",
    topicIds: ["it-pm"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "S社が今後とるべき進め方として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "S社のプロジェクトマネージャは、会議後に顧客の現場担当者から口頭で「帳票の出力項目を追加してほしい」と依頼を受け、承認の手続を経ずに開発者へ指示した。納期の直前になり、テストの工数不足とコストの超過が判明した。同様の口頭の依頼は、これまでにも数件あった。",
      },
    ],
    right:
      "追加の依頼は変更要求として記録し、工数・日程・コスト・品質・リスクへの影響を評価したうえで、承認権限者が判断し、承認された内容を計画に反映する。",
    pos: "u",
    wrong: [
      "顧客の依頼であるため、契約外でも即座に受け入れ、費用の調整は後から行う。",
      "今後は、顧客からの追加の依頼をすべて受け付けないことにする。",
      "開発者に余力がある範囲で実装し、計画や費用の見直しは行わない。",
    ],
    correct:
      "変更管理は、要求の受付、影響評価、承認、実施、記録の順に行う。承認を経ない口頭の依頼を作業に反映したことが、スコープクリープを招いた。",
    why: [
      "変更の影響を評価せずに受け入れると、工数・コスト・品質に影響し、納期を守れなくなる。",
      "変更管理の目的は、すべてを受け入れる、またはすべてを断ることではなく、影響を把握して意思決定することにある。",
    ],
    rightNote: "正解である。変更要求として記録し、影響評価と承認を経て計画に反映する。",
    wrongNotes: [
      "影響を評価せずに即座に受け入れると、同じ問題が再発する。",
      "変更を一切認めないのは極端であり、必要な変更まで拒否することになる。",
      "余力で実装して計画を見直さないと、品質やテストの工数に影響し、変更が管理されないままになる。",
    ],
    english:
      "Record each request as a change request, assess its impact, obtain approval, and update the plan, rather than accepting verbal requests.",
    termIds: ["it-scope-creep", "it-change-management"],
    tags: ["変更管理", "スコープクリープ", "科目B"],
  }),
  // ── it/management：サービス ──────────────────────────────────
  mk({
    n: 19,
    part: "A",
    topicIds: ["it-service"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "30日（43,200分）の月間可用性をSLAで99.95%と定めたシステムがある。計画停止を含まない場合に許容される停止時間は何分か。",
    right: "21.6分",
    pos: "a",
    wrong: ["4.32分", "43.2分", "216分"],
    correct:
      "許容される停止率は 100%−99.95% = 0.05%である。43,200分×0.0005 = 21.6分になる。",
    why: [
      "99.9%は43.2分、99.99%は4.32分で、99.95%はその間の21.6分である。",
      "99.5%なら216分であり、桁の取り違えに注意する。",
    ],
    rightNote: "正解である。43,200×0.0005 = 21.6分である。",
    wrongNotes: [
      "4.32分は99.99%の場合の許容停止時間である。",
      "43.2分は99.9%の場合の許容停止時間である。",
      "216分は99.5%の場合の許容停止時間である。",
    ],
    english:
      "A 99.95% monthly SLA allows 0.05% of 43,200 minutes, which is 21.6 minutes of downtime.",
    termIds: ["it-sla", "it-availability"],
    tags: ["SLA", "可用性", "計算問題"],
  }),
  mk({
    n: 20,
    part: "B",
    topicIds: ["it-service"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "U社のITサービスマネジメントとして、最も適切な追加の対応はどれか。",
    presentation: [
      {
        type: "p",
        text: "U社のメールシステムは、毎週月曜の朝になると応答が極端に遅くなる。そのたびにサービスデスクがサーバを再起動し、数分で復旧させている。この対応がすでに2か月続いており、利用者からの問合せも毎週発生している。",
      },
    ],
    right:
      "インシデントとは別に問題として起票し、根本原因を調査する。原因が判明するまでは、再起動による回避策を既知のエラーとして記録し、サービスデスクで共有する。",
    pos: "e",
    wrong: [
      "再起動の手順を自動化して復旧を1分以内に短縮し、原因の調査は行わない。",
      "月曜の朝は利用を控えるよう利用者に通知し、この時間帯の応答遅延をSLAの対象外とする。",
      "原因が不明であるため、変更管理を経ずに、メールサーバを新しい機種へ置き換える。",
    ],
    correct:
      "インシデント管理は早期復旧、問題管理は根本原因の特定と再発防止を担う。繰り返し発生する事象は、問題管理で扱う。",
    why: [
      "毎週同じ事象が再発するのは、根本原因が解消されていないためである。",
      "回避策を既知のエラーとして記録すると、原因が判明するまでの対応を標準化でき、ナレッジにもなる。",
    ],
    rightNote: "正解である。問題管理で根本原因を調査し、回避策を既知のエラーとして記録する。",
    wrongNotes: [
      "復旧は速くなるが、毎週の再発は止まらない。根本原因の調査が必要である。",
      "利用者に利用を控えさせてSLA対象外とするのは、問題の解決ではなく、サービス提供側の責任の回避である。",
      "原因が不明のまま機器を置き換えても、解消する根拠がない。しかも、変更管理を経ない変更は不適切である。",
    ],
    english:
      "Recurring incidents call for problem management: find the root cause and record the workaround as a known error meanwhile.",
    termIds: ["it-incident-management", "it-problem-management", "it-service-desk"],
    tags: ["問題管理", "インシデント管理", "科目B"],
  }),
  mk({
    n: 21,
    part: "A",
    topicIds: ["it-service"],
    lessonId: "it/management",
    difficulty: "easy",
    stem: "変更管理に関する記述のうち、適切でないものはどれか。",
    right:
      "緊急変更は迅速さが重要であるため、承認も記録も不要である。",
    pos: "u",
    wrong: [
      "変更要求ごとに影響範囲とリスクを評価し、承認権限者が可否を決める。",
      "実施前に切戻し手順を確認し、失敗した場合に元の状態へ戻せるようにする。",
      "緊急変更は事後に承認を得る場合があるが、実施した内容は記録する。",
    ],
    correct:
      "緊急変更でも、事後の承認と記録は省略できない。承認や記録を不要とする記述は適切でない。",
    why: [
      "変更管理は、影響範囲とリスクの評価、承認、切戻し手順の確認、記録を通じて、変更による障害を防ぐ。",
      "緊急変更は、事前の手続を簡略化する場合があるが、実施内容の記録と事後の承認は必要である。",
    ],
    rightNote: "正解（適切でないもの）である。緊急変更でも承認と記録は必要である。",
    wrongNotes: [
      "影響とリスクの評価と、承認権限者による判断は、変更管理の基本である。",
      "切戻し手順の確認は、変更が失敗した場合の備えとして適切である。",
      "緊急変更は事後承認の場合があり、実施内容の記録は必要である。適切な記述である。",
    ],
    english:
      "Even emergency changes require after-the-fact approval and records; claiming they need neither is incorrect.",
    termIds: ["it-change-management"],
    tags: ["変更管理", "緊急変更"],
  }),
  mk({
    n: 22,
    part: "A",
    topicIds: ["it-service"],
    lessonId: "it/management",
    difficulty: "easy",
    stem: "ITサービスマネジメントにおける構成管理の説明として、最も適切なものはどれか。",
    right:
      "ハードウェア、ソフトウェア、設定、文書などの構成項目とその関係を最新の状態で管理し、変更や障害の影響範囲を把握できるようにする。",
    pos: "i",
    wrong: [
      "利用者からの問合せを一元的に受け付ける窓口として、記録と一次切り分けを行う。",
      "インシデントの根本原因を特定し、再発を防ぐ。",
      "サービスの水準について、提供者と顧客が目標値を合意する。",
    ],
    correct:
      "構成管理は、構成項目（CI）とその関係を最新に保ち、変更や障害の影響範囲を判断するための基盤となる。",
    why: [
      "構成情報が古いと、変更の影響範囲を見誤り、障害の切り分けも遅れる。",
      "窓口はサービスデスク、根本原因の特定は問題管理、水準の合意はSLAの役割である。",
    ],
    rightNote: "正解である。構成項目とその関係を最新に保つ。",
    wrongNotes: [
      "利用者の単一窓口はサービスデスクの役割である。",
      "根本原因の特定と再発防止は問題管理の役割である。",
      "サービス水準の合意はSLAの役割である。",
    ],
    english:
      "Configuration management keeps configuration items and their relationships current to assess the impact of changes and faults.",
    termIds: ["it-change-management", "it-service-desk"],
    tags: ["構成管理", "CMDB"],
  }),
  mk({
    n: 23,
    part: "A",
    topicIds: ["it-service"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "次のア～ウの合意や契約が該当するものの組合せとして、適切なものはどれか。",
    presentation: [
      {
        type: "list",
        items: [
          "ア: 情報システム部とネットワーク運用部の間で、「ネットワーク設定の変更依頼は3営業日前までに申請する」と合意した。",
          "イ: 顧客企業との間で、月間の可用性99.9%以上を約束した。",
          "ウ: 外部のデータセンター事業者との間で、電源設備の稼働率を保証する契約を結んだ。",
        ],
      },
    ],
    right: "ア：OLA／イ：SLA／ウ：UC",
    pos: "e",
    wrong: [
      "ア：SLA／イ：OLA／ウ：UC",
      "ア：OLA／イ：UC／ウ：SLA",
      "ア：UC／イ：SLA／ウ：OLA",
    ],
    correct:
      "OLAは内部部署間の合意、SLAは提供者と顧客の合意、UCは外部の委託先との契約である。",
    why: [
      "SLAの履行を支えるため、内部ではOLA、外部の委託先とはUCを結んで、サービスの水準を裏付ける。",
      "同じ「合意」でも、相手が顧客、内部部署、外部の委託先のどれかで区別する。",
    ],
    rightNote: "正解である。内部部署間はOLA、顧客とはSLA、外部の委託先とはUCである。",
    wrongNotes: [
      "アとイが入れ替わっている。内部部署間はOLA、顧客との合意はSLAである。",
      "イとウが入れ替わっている。顧客との合意はSLA、外部の事業者との契約はUCである。",
      "アとウが入れ替わっている。内部部署間の合意はOLA、外部の事業者との契約はUCである。",
    ],
    english:
      "OLA is an internal agreement, SLA is with the customer, and UC is a contract with an external supplier.",
    termIds: ["it-sla", "it-slo"],
    tags: ["SLA", "OLA", "UC"],
  }),
  mk({
    n: 24,
    part: "B",
    topicIds: ["it-service"],
    lessonId: "it/management",
    difficulty: "medium",
    stem: "T社のサービスデスクの対応として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "T社のサービスデスクに、午前9時から30分の間に、「社内システムにログインできない」という問合せが20件寄せられた。担当者は、問合せごとに個別に回答している。まだ、同じ事象かどうか、原因は何かは分かっていない。",
      },
    ],
    right:
      "同一の事象の可能性があるインシデントとして記録・集約し、影響範囲を確認したうえで、技術担当者や管理者へエスカレーションし、利用者へ状況と回避策を周知する。",
    pos: "a",
    wrong: [
      "問合せごとに個別に回答し、解決した問合せだけを記録する。",
      "根本原因の調査が終わるまで、利用者への連絡は控える。",
      "利用者に各自でPCを再起動するよう案内し続け、管理者への報告は100件を超えてから行う。",
    ],
    correct:
      "短時間に同種の問合せが集中した場合は、1つのインシデントとして記録・集約し、影響範囲を確認してエスカレーションし、利用者へ周知する。",
    why: [
      "インシデント管理の目的は、サービスの早期復旧である。影響の大きさに応じて、上位の担当者へ引き継ぐ。",
      "原因の調査と並行して、状況と回避策を周知すると、問合せの増加を抑えられる。",
    ],
    rightNote: "正解である。集約、エスカレーション、周知を行う。",
    wrongNotes: [
      "個別対応では、同一の事象を見落とし、影響範囲の把握と対応が遅れる。記録も、すべての問合せについて必要である。",
      "原因の調査の完了を待たずに、状況と回避策を周知する。連絡を控えると、問合せが増える。",
      "再起動の案内が有効かは不明であり、件数の基準を決めて報告を遅らせるのも不適切である。",
    ],
    english:
      "A burst of similar calls should be logged as one incident, scoped, escalated, and communicated to users while diagnosis continues.",
    termIds: ["it-service-desk", "it-incident-management"],
    tags: ["サービスデスク", "エスカレーション", "科目B"],
  }),
  // ── it/strategy ──────────────────────────────────────────────
  mk({
    n: 25,
    part: "A",
    topicIds: ["it-strategy"],
    lessonId: "it/strategy",
    difficulty: "hard",
    stem: "固定費が2,400万円、変動費率が60%の事業で、営業利益800万円を得るために必要な売上高はどれか。",
    right: "8,000万円",
    pos: "i",
    wrong: ["5,333万円", "6,000万円", "6,800万円"],
    correct:
      "売上高をSとすると、S−0.6S−2,400＝800である。0.4S＝3,200より、S＝8,000万円である。",
    why: [
      "限界利益率は1−0.6＝0.4である。必要な限界利益は、固定費2,400万円と目標利益800万円の合計3,200万円である。",
      "検算では、売上8,000万円の変動費は4,800万円で、8,000−4,800−2,400＝800万円となる。",
    ],
    rightNote: "正解である。(2,400+800)÷0.4＝8,000万円である。",
    wrongNotes: [
      "5,333万円は、(2,400+800)÷0.6の値であり、限界利益率ではなく変動費率で割っている。",
      "6,000万円は、目標利益を考えない損益分岐点売上高（2,400÷0.4）である。",
      "6,800万円は、損益分岐点売上高に目標利益を単純に加えた値で、限界利益率を考慮していない。",
    ],
    english:
      "Required sales = (fixed costs + target profit) ÷ contribution margin ratio = (2,400 + 800) ÷ 0.4 = 8,000.",
    termIds: ["it-break-even-point", "it-financial-statements"],
    tags: ["損益分岐点", "目標利益", "計算問題"],
  }),
  mk({
    n: 26,
    part: "B",
    topicIds: ["it-strategy"],
    lessonId: "it/strategy",
    difficulty: "medium",
    stem: "5年間のTCOの比較として、適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "N社は、人事システムをオンプレミスで構築するか、クラウドサービスを利用するかを検討している。5年間利用する計画で、費用は次のとおりである。これ以外の費用は考慮しない。",
      },
      {
        type: "table",
        caption: "費用の見積り（単位：万円）",
        headers: ["方式", "初期費用", "年間の運用費"],
        rows: [
          ["オンプレミス", "1,800", "300"],
          ["クラウド", "200", "600"],
        ],
      },
    ],
    right:
      "オンプレミスは3,300万円、クラウドは3,200万円で、クラウドが100万円低い。",
    pos: "u",
    wrong: [
      "オンプレミスは2,100万円、クラウドは800万円で、クラウドが1,300万円低い。",
      "オンプレミスは3,300万円、クラウドは3,000万円で、クラウドが300万円低い。",
      "オンプレミスは1,500万円、クラウドは3,000万円で、オンプレミスが1,500万円低い。",
    ],
    correct:
      "TCOは初期費用と運用費の総額である。オンプレミスは1,800+300×5＝3,300万円、クラウドは200+600×5＝3,200万円である。",
    why: [
      "初期費用が小さい方式でも、運用費が高ければ、期間が長いほど総額は逆転する。",
      "この条件では、約5.3年で逆転する。オンプレミスの方が総額で安くなるのは、利用が6年以上になる場合である。",
    ],
    rightNote: "正解である。3,300万円と3,200万円で、クラウドが100万円低い。",
    wrongNotes: [
      "1年分の費用を比較しており、5年間のTCOではない。",
      "クラウドの初期費用200万円を含めていない。TCOでは初期費用を含める。",
      "初期費用を除外して、運用費だけを比べており、TCOではない。",
    ],
    english:
      "Five-year TCO is initial cost plus five years of running cost: 3,300 for on-premises versus 3,200 for cloud.",
    termIds: ["it-tco", "it-roi"],
    tags: ["TCO", "クラウド", "科目B"],
  }),
];
