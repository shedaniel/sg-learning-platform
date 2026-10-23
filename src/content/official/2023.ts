import type { OfficialPaper } from "@/lib/content/types";

const PAGE_URL =
  "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/2023r05.html";
const BOOKLET_URL =
  "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/t6hhco0000003zx0-att/2023r05_sg_qs.pdf";
const ANSWER_URL =
  "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/t6hhco0000003zx0-att/2023r05_sg_ans.pdf";

const note = "IPA公開問題（実際の試験は60問）。公開されている問1〜問15をすべて収録した。表・事例文は原文の数値と表見出しを保ってテキスト化しており、図だけで示された設問はない。IPAが公開している過去問題を、出典を明記して利用している。";

export const paper: OfficialPaper = {
  year: 2023,
  reiwa: 5,
  label: "令和5年度 公開問題",
  publishedAt: "2023-07-06",
  pageUrl: PAGE_URL,
  bookletUrl: BOOKLET_URL,
  answerUrl: ANSWER_URL,
  questionNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  publishedCount: 15,
  actualCount: 60,
  note,
  questions: [
    {
      id: "official-2023-01",
      part: "A",
      topicIds: ["mgmt-isms", "mgmt-governance"],
      lessonIds: ["management/policy-isms", "management/governance-org"],
      difficulty: "medium",
      type: "knowledge",
      stem: "情報セキュリティ管理基準（平成28年）に関する記述のうち，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "“ガバナンス基準”，“管理策基準”及び“マネジメント基準”の三つの基準で構成されている。",
        },
        {
          id: "i",
          text: "JIS Q 27001:2014（情報セキュリティマネジメントシステム－要求事項）及びJIS Q 27002:2014（情報セキュリティ管理策の実践のための規範）との整合性をとっている。",
        },
        {
          id: "u",
          text: "情報セキュリティ対策は，“管理策基準”に挙げられた管理策の中から選択することとしている。",
        },
        {
          id: "e",
          text: "トップマネジメントは，“マネジメント基準”に挙げられている事項の中から，自組織に合致する事項を選択して実施することとしている。",
        },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正解はイ。情報セキュリティ管理基準（平成28年）は、JIS Q 27001:2014及びJIS Q 27002:2014との整合性をとって策定されている。",
        why: [
          "平成28年版の管理基準は、ISMSの要求事項であるJIS Q 27001:2014と、管理策の規範であるJIS Q 27002:2014を国内規格として反映した内容になっている。",
          "したがって、ISMS認証の審査や情報セキュリティ監査の判断基準として、JIS規格と同じ枠組みで利用できる。",
        ],
        optionNotes: {
          a: "平成28年版は“マネジメント基準”と“管理策基準”の二つの基準で構成される。ガバナンス基準を含む三構成は平成28年版の説明ではない。",
          i: "正解です。JIS Q 27001:2014及びJIS Q 27002:2014との整合性が確保されています。",
          u: "管理策基準は対策を選ぶ際の参照基準であり、そこに載っている管理策だけに限定して選ぶものではない。リスクアセスメントの結果に応じて対策を決定する。",
          e: "マネジメント基準は計画・実行・点検・処置の要求事項を定めたもので、項目を取捨選択して実施するメニューではない。",
        },
        english:
          "The 2016 edition of the Information Security Management Standards aligns with JIS Q 27001:2014 and JIS Q 27002:2014, and consists of management and control standards.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問1",
        url: PAGE_URL,
        year: 2023,
        questionNo: 1,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["情報セキュリティ管理基準", "ISMS", "JIS Q 27001"],
    },
    {
      id: "official-2023-02",
      part: "A",
      topicIds: ["tech-physical", "org-physical"],
      lessonIds: ["org/audit-physical"],
      difficulty: "medium",
      type: "knowledge",
      stem: "入室時と退室時にIDカードを用いて認証を行い，入退室を管理する。このとき，入室時の認証に用いられなかったIDカードでの退室を許可しない，又は退室時の認証に用いられなかったIDカードでの再入室を許可しないコントロールを行う仕組みはどれか。",
      options: [
        {
          id: "a",
          text: "TPMOR（Two Person Minimum Occupancy Rule）",
        },
        { id: "i", text: "アンチパスバック" },
        { id: "u", text: "インターロックゲート" },
        { id: "e", text: "パニックオープン" },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正解はイのアンチパスバック。入室と退室を同じIDカードで対応付け、記録のない方向への通過を拒否する仕組みである。",
        why: [
          "アンチパスバックでは、入室記録のないカードで退室しようとすると拒否され、退室記録のないカードで再入室しようとしても拒否される。",
          "カードの受け渡しや共連れによって、入室記録と実際の在室者が食い違うことを検知しやすくなる。",
        ],
        optionNotes: {
          a: "二人以上の滞在を求める考え方に関する語だが、入室と退室のカードを一対一で対応付けて通過を制御する仕組みではない。",
          i: "正解です。入退室の記録を突き合わせて不整合な通過を防ぐのがアンチパスバックです。",
          u: "インターロックゲートは、二重の扉を同時に開けないようにして共連れを防ぐ設備であり、カードの使用履歴を対応付けるものではない。",
          e: "パニックオープンは、火災などの緊急時に扉を解錠して避難できるようにする機能である。",
        },
        english:
          "Anti-passback correlates entry and exit records so that a card cannot be used to exit without a prior entry, or to re-enter without a prior exit.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問2",
        url: PAGE_URL,
        year: 2023,
        questionNo: 2,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["物理的セキュリティ", "入退室管理", "アンチパスバック"],
    },
    {
      id: "official-2023-03",
      part: "A",
      topicIds: ["ops-incident-response"],
      lessonIds: ["ops/incident-response"],
      difficulty: "easy",
      type: "knowledge",
      stem: "デジタルフォレンジックスの説明はどれか。",
      options: [
        {
          id: "a",
          text: "サイバー攻撃に関連する脅威情報を標準化された方法で記述し，その脅威情報をセキュリティ対策機器に提供すること",
        },
        {
          id: "i",
          text: "受信メールに添付された実行ファイルを動作させたときに，不正な振る舞いがないかどうかをメールボックスへの保存前に確認すること",
        },
        {
          id: "u",
          text: "情報セキュリティインシデント発生時に，法的な証拠となるデータを収集し，保管し，調査分析すること",
        },
        {
          id: "e",
          text: "内部ネットワークにおいて，通信データを盗聴されないように暗号化すること",
        },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "正解はウ。デジタルフォレンジックスは、インシデント発生時に証拠となり得るデータを収集・保管し、調査分析する一連の活動である。",
        why: [
          "電磁的記録は消去・改変が容易なため、収集時点から証拠としての完全性を保つ手続き（ハッシュ値の取得、複製の作成、保管履歴の記録）が重要になる。",
          "調査結果は、原因究明、再発防止、法的措置や損害賠償の主張に利用される。",
        ],
        optionNotes: {
          a: "脅威情報を標準化して共有するのは脅威インテリジェンス（STIX/TAXIIなど）の説明である。",
          i: "添付ファイルを安全な環境で実行して挙動を調べるのはサンドボックスによる検査であり、証拠保全を目的とするフォレンジックスとは異なる。",
          u: "正解です。証拠となり得るデータの収集・保管・調査分析がデジタルフォレンジックスです。",
          e: "通信の暗号化は盗聴対策であり、インシデント後の証拠調査とは目的が異なる。",
        },
        english:
          "Digital forensics is the collection, preservation, and analysis of data that may serve as legal evidence after a security incident.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問3",
        url: PAGE_URL,
        year: 2023,
        questionNo: 3,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["デジタルフォレンジックス", "インシデント対応", "証拠保全"],
    },
    {
      id: "official-2023-04",
      part: "A",
      topicIds: ["sec-crypto"],
      lessonIds: ["security/crypto-auth"],
      difficulty: "medium",
      type: "knowledge",
      stem: "暗号方式に関する記述のうち，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "公開鍵暗号方式，共通鍵暗号方式ともに，大きな合成数の素因数分解が困難であることが安全性の根拠である。",
        },
        {
          id: "i",
          text: "公開鍵暗号方式では原則としてセッションごとに異なる鍵を利用するが，共通鍵暗号方式では一度生成した鍵を複数のセッションに繰り返し利用する。",
        },
        {
          id: "u",
          text: "公開鍵暗号方式は仕様が標準化されているが，共通鍵暗号方式はベンダーによる独自の仕様で実装されることが一般的である。",
        },
        {
          id: "e",
          text: "大量のデータを短い時間で暗号化する場合には，公開鍵暗号方式よりも共通鍵暗号方式が適している。",
        },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "正解はエ。共通鍵暗号方式は公開鍵暗号方式より演算が軽く、大量データの暗号化に適している。",
        why: [
          "共通鍵暗号は同じ鍵で暗号化と復号を行う方式で、AESのように高速なアルゴリズムが標準化されている。",
          "公開鍵暗号は鍵配送や電子署名に向くが、べき乗演算を伴うため処理が重く、大量データの暗号化には向かない。実際には共通鍵で本文を暗号化し、その共通鍵を公開鍵暗号で配送するハイブリッド方式が使われる。",
        ],
        optionNotes: {
          a: "素因数分解の困難性はRSAなど公開鍵暗号の安全性の根拠である。AESなどの共通鍵暗号は、鍵空間の総当たりに対する強度などが根拠になる。",
          i: "記述が逆である。公開鍵の鍵ペアは長期間利用されるのに対し、共通鍵はセッションごとに生成して使い捨てるのが原則である。",
          u: "共通鍵暗号もAESとして標準化されており、ベンダー独自仕様が一般という記述は誤りである。",
          e: "正解です。共通鍵暗号は処理速度が速く、大量データの暗号化に適しています。",
        },
        english:
          "Symmetric encryption is much faster than public-key encryption and is used for bulk data; public-key cryptography is mainly used for key exchange and signatures.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問4",
        url: PAGE_URL,
        year: 2023,
        questionNo: 4,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["暗号", "共通鍵暗号", "公開鍵暗号", "ハイブリッド暗号"],
    },
    {
      id: "official-2023-05",
      part: "A",
      topicIds: ["sec-crypto", "sec-evaluation"],
      lessonIds: ["security/crypto-auth"],
      difficulty: "medium",
      type: "knowledge",
      stem: "セキュアハッシュ関数SHA-256を用いてファイルA及びファイルBのハッシュ値を算出すると，どちらも全く同じ次に示すハッシュ値n（16進数で示すと64桁）となった。この結果から考えられることとして，適切なものはどれか。",
      presentation: [
        {
          type: "p",
          text: "ハッシュ値n：86620f2f 152524d7 dbed4bcb b8119bb6 d493f734 0b4e7661 88565353 9e6d2074",
        },
      ],
      options: [
        {
          id: "a",
          text: "ファイルAとファイルBの各内容を変更せずに再度ハッシュ値を算出すると，ファイルAとファイルBのハッシュ値が異なる。",
        },
        {
          id: "i",
          text: "ファイルAとファイルBのハッシュ値nのデータ量は64バイトである。",
        },
        {
          id: "u",
          text: "ファイルAとファイルBを連結させたファイルCのハッシュ値の桁数は16進数で示すと128桁である。",
        },
        {
          id: "e",
          text: "ファイルAの内容とファイルBの内容は同じである。",
        },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "正解はエ。同じハッシュ値が得られたことから、ファイルAとファイルBの内容は同じであると考えられる。",
        why: [
          "ハッシュ関数は決定的であり、同じ入力からは必ず同じハッシュ値が得られる。内容が同じならハッシュ値も一致する。",
          "異なる内容から同じハッシュ値が得られる「衝突」は、SHA-256では現実的に起こらない強度を持つとされているため、まず同一内容と判断できる。",
        ],
        optionNotes: {
          a: "内容を変更していなければ、ハッシュ関数の決定性により再計算しても同じ値になる。異なる値になることはない。",
          i: "16進数64桁は64文字であり、1文字が4ビットなので256ビット、すなわち32バイトである。",
          u: "連結後のファイルCもSHA-256で計算するため、出力は常に256ビット（16進数64桁）であり、128桁にはならない。",
          e: "正解です。同一のハッシュ値は、同一内容であることを強く示唆します。",
        },
        english:
          "SHA-256 always outputs 256 bits (64 hexadecimal digits, 32 bytes). Identical hashes indicate identical content with overwhelming probability.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問5",
        url: PAGE_URL,
        year: 2023,
        questionNo: 5,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["ハッシュ", "SHA-256", "完全性"],
    },
    {
      id: "official-2023-06",
      part: "A",
      topicIds: ["tech-protocols"],
      lessonIds: ["tech/network"],
      difficulty: "medium",
      type: "knowledge",
      stem: "迷惑メール対策のSPF（Sender Policy Framework）の仕組みはどれか。",
      options: [
        {
          id: "a",
          text: "送信側ドメインの管理者が，正規の送信側メールサーバのIPアドレスをDNSに登録し，受信側メールサーバでそれを参照して，IPアドレスの判定を行う。",
        },
        {
          id: "i",
          text: "送信側メールサーバでメッセージにデジタル署名を施し，受信側メールサーバでそのデジタル署名を検証する。",
        },
        {
          id: "u",
          text: "第三者によって提供されている，スパムメールの送信元IPアドレスのデータベースを参照して，スパムメールの判定を行う。",
        },
        {
          id: "e",
          text: "ファイアウォールを通過した要求パケットに対する応答パケットかどうかを判断して，動的に迷惑メールの通信を制御する。",
        },
      ],
      correctOptionId: "a",
      explanation: {
        correct:
          "正解はア。SPFは、送信ドメインの正規メールサーバのIPアドレスをDNSのTXTレコードに登録し、受信側が送信元IPアドレスと照合する仕組みである。",
        why: [
          "受信側メールサーバは、エンベロープFromのドメインについてDNSを引いてSPFレコードを取得し、実際の接続元IPアドレスがそこに含まれるかを確認する。",
          "一致しなければ、そのドメインをかたる送信の可能性があると判断できる。ただしSPFは転送時に成立しにくいなど限界もある。",
        ],
        optionNotes: {
          a: "正解です。DNSに登録したIPアドレスと接続元IPアドレスを照合するのがSPFです。",
          i: "送信側がデジタル署名を付し、受信側が検証するのはDKIMである。",
          u: "第三者が提供する送信元IPアドレスの評判データベースを参照するのは、リアルタイムブラックリスト（RBL）などの仕組みである。",
          e: "要求パケットに対する応答パケットかを判断して通信を通すのは、ステートフルパケットインスペクションである。",
        },
        english:
          "SPF publishes the authorized sending servers for a domain in DNS, and the receiving server checks the connecting IP address against that list.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問6",
        url: PAGE_URL,
        year: 2023,
        questionNo: 6,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["SPF", "メール", "DKIM", "なりすまし"],
    },
    {
      id: "official-2023-07",
      part: "A",
      topicIds: ["sec-attacks-web", "tech-appsec"],
      lessonIds: ["security/attacks"],
      difficulty: "easy",
      type: "knowledge",
      stem: "Webアプリケーションにおけるセキュリティ上の脅威とその対策に関する記述のうち，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "OSコマンドインジェクションを防ぐために，Webアプリケーションが発行するセッションIDに推測困難な乱数を使用する。",
        },
        {
          id: "i",
          text: "SQLインジェクションを防ぐために，Webアプリケーション内でデータベースへの問合せを作成する際にプレースホルダを使用する。",
        },
        {
          id: "u",
          text: "クロスサイトスクリプティングを防ぐために，Webサーバ内のファイルを外部から直接参照できないようにする。",
        },
        {
          id: "e",
          text: "セッションハイジャックを防ぐために，Webアプリケーションからシェルを起動できないようにする。",
        },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正解はイ。SQL文の組み立てにプレースホルダを用いると、入力値がSQLの構文として解釈されず、SQLインジェクションを防げる。",
        why: [
          "プレースホルダ（バインド機構）は、SQLの構造を先に確定し、後から値をはめ込む。値がどんな文字列でも構文の一部にならない。",
          "エスケープ処理も有効だが、文字列連結でSQLを組み立てる実装はインジェクションの温床になりやすい。",
        ],
        optionNotes: {
          a: "セッションIDの乱数化はセッションハイジャック対策である。OSコマンドインジェクションには、シェルを介さない実装や入力値の検証が必要になる。",
          i: "正解です。プレースホルダによってSQL文と値が分離され、インジェクションが成立しにくくなります。",
          u: "クロスサイトスクリプティング対策は、出力時のエスケープやContent Security Policyの適用である。ファイルの直接参照禁止はディレクトリトラバーサル対策に近い。",
          e: "シェルを起動できないようにするのはOSコマンドインジェクション対策である。セッションハイジャックにはHTTPSの利用やCookie属性の設定、ログイン後のセッションID再生成が有効である。",
        },
        english:
          "Prepared statements with placeholders keep user input out of SQL syntax, preventing SQL injection.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問7",
        url: PAGE_URL,
        year: 2023,
        questionNo: 7,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["SQLインジェクション", "プレースホルダ", "Webセキュリティ"],
    },
    {
      id: "official-2023-08",
      part: "A",
      topicIds: ["law-contract", "law-standards-ethics"],
      lessonIds: ["law/ip-contract"],
      difficulty: "medium",
      type: "knowledge",
      stem: "電子署名法に関する記述のうち，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "電子署名には，電磁的記録ではなく，かつ，コンピュータで処理できないものも含まれる。",
        },
        {
          id: "i",
          text: "電子署名には，民事訴訟法における押印と同様の効力が認められる。",
        },
        {
          id: "u",
          text: "電子署名の認証業務を行うことができるのは，政府が運営する認証局に限られる。",
        },
        {
          id: "e",
          text: "電子署名は共通鍵暗号技術によるものに限られる。",
        },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正解はイ。電子署名法により、本人による電子署名が行われた電磁的記録は、真正な成立が推定され、民事訴訟法上の押印と同様の効力が認められる。",
        why: [
          "電子署名法3条は、電磁的記録に付された電子署名について、その成立の真正を推定する規定を置いている。",
          "これにより、紙の契約書における押印・署名に近い法的な扱いが可能になり、電子契約の普及を支えている。",
        ],
        optionNotes: {
          a: "電子署名法上の電子署名は、電磁的記録に記録された情報であり、コンピュータで処理できるものが対象である。",
          i: "正解です。電子署名には民事訴訟法上の押印と同様の効力（真正な成立の推定）が認められます。",
          u: "認証業務は民間事業者も行える。一定の要件を満たす特定認証業務は主務大臣の認定を受けることができ、政府運営に限定されない。",
          e: "電子署名は公開鍵暗号技術を用いるものが一般的であり、共通鍵暗号に限られるという記述は誤りである。",
        },
        english:
          "Under the Electronic Signature Act, a valid electronic signature creates a presumption of authenticity similar to a seal under the Code of Civil Procedure.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問8",
        url: PAGE_URL,
        year: 2023,
        questionNo: 8,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["電子署名法", "電子契約", "真正な成立の推定"],
    },
    {
      id: "official-2023-09",
      part: "A",
      topicIds: ["org-audit"],
      lessonIds: ["org/audit-physical"],
      difficulty: "hard",
      type: "knowledge",
      stem: "情報システムのインシデント管理に対する監査で判明した状況のうち，監査人が，指摘事項として監査報告書に記載すべきものはどれか。",
      options: [
        {
          id: "a",
          text: "インシデント対応手順が作成され，関係者への周知が図られている。",
        },
        {
          id: "i",
          text: "インシデントによってデータベースが被害を受けた場合の影響を最小にするために，規程に従ってデータのバックアップをとっている。",
        },
        {
          id: "u",
          text: "インシデントの種類や発生箇所，影響度合いに関係なく，連絡・報告ルートが共通になっている。",
        },
        {
          id: "e",
          text: "全てのインシデントについて，インシデント記録を残し，責任者の承認を得ることが定められている。",
        },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "正解はウ。インシデントの種類・発生箇所・影響度にかかわらず連絡・報告ルートが共通なのは、重大インシデントの迅速なエスカレーションを妨げる不備である。",
        why: [
          "インシデント管理では、影響度や緊急度に応じて連絡先や報告先を変え、重大な事象ほど早く経営層へ上げる仕組みが必要になる。",
          "すべてを同じルートに通すと、初動の遅れや報告漏れにつながるため、監査上の指摘事項となる。",
        ],
        optionNotes: {
          a: "手順の作成と周知は適切な統制であり、指摘事項ではない。",
          i: "規程に従ったバックアップは影響を小さくする適切な取組みであり、指摘事項ではない。",
          u: "正解です。一律の連絡・報告ルートは、影響度に応じたエスカレーションを妨げる不備です。",
          e: "記録の作成と責任者承認は、証跡を確保する適切な統制である。",
        },
        english:
          "Incident reporting routes should differ by type, location, and severity; a single common route regardless of impact is an audit finding.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問9",
        url: PAGE_URL,
        year: 2023,
        questionNo: 9,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["システム監査", "インシデント管理", "指摘事項"],
    },
    {
      id: "official-2023-10",
      part: "A",
      topicIds: ["tech-protocols"],
      lessonIds: ["tech/network"],
      difficulty: "medium",
      type: "knowledge",
      stem: "HTTPのcookieに関する記述のうち，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "cookieに含まれる情報はHTTPヘッダの一部として送信される。",
        },
        {
          id: "i",
          text: "cookieに含まれる情報はWebサーバだけに保存される。",
        },
        {
          id: "u",
          text: "cookieに含まれる情報はWebブラウザが全て暗号化して送信する。",
        },
        {
          id: "e",
          text: "クライアントがcookieに含まれる情報の有効期限を設定する。",
        },
      ],
      correctOptionId: "a",
      explanation: {
        correct:
          "正解はア。cookieはHTTPのヘッダ（Cookieヘッダ、Set-Cookieヘッダ）としてやり取りされる。",
        why: [
          "サーバはSet-Cookieレスポンスヘッダでcookieを発行し、ブラウザは以降のリクエストにCookieヘッダとして付加して送信する。",
          "したがってcookieの情報はHTTPメッセージのヘッダの一部として送信される。",
        ],
        optionNotes: {
          a: "正解です。cookieはHTTPヘッダとして送受信されます。",
          i: "cookieは主にブラウザ側に保存される。サーバ側に保存されるのはセッション情報などであり、「Webサーバだけ」は誤りである。",
          u: "ブラウザがcookieの中身を暗号化して送るわけではない。HTTPSを使えば通信経路は暗号化されるが、cookie自体が暗号化されるわけではない。",
          e: "有効期限はサーバがSet-CookieヘッダのExpiresやMax-Ageで指定する。クライアントが任意に設定するものではない。",
        },
        english:
          "Cookies are carried in HTTP headers: the server sets them with Set-Cookie, and the browser returns them in the Cookie header.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問10",
        url: PAGE_URL,
        year: 2023,
        questionNo: 10,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["cookie", "HTTP", "セッション管理"],
    },
    {
      id: "official-2023-11",
      part: "A",
      topicIds: ["it-strategy"],
      lessonIds: ["it/strategy"],
      difficulty: "medium",
      type: "knowledge",
      stem: "BPMの説明はどれか。",
      options: [
        {
          id: "a",
          text: "企業活動の主となる生産，物流，販売，財務，人事などの業務の情報を一元管理することによって，経営資源の全体最適を実現する。",
        },
        {
          id: "i",
          text: "業務プロセスに分析，設計，実行，改善のマネジメントサイクルを取り入れ，業務プロセスの改善見直しや最適なプロセスへの統合を継続的に実施する。",
        },
        {
          id: "u",
          text: "顧客データベースを基に，商品の販売から保守サービス，問合せやクレームへの対応など顧客に関する業務プロセスを一貫して管理する。",
        },
        {
          id: "e",
          text: "部品の供給から製品の販売までの一連の業務プロセスの情報をリアルタイムで交換することによって，在庫の削減とリードタイムの短縮を実現する。",
        },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正解はイ。BPM（Business Process Management）は、業務プロセスを分析・設計・実行・改善するサイクルを回し、継続的に最適化する手法である。",
        why: [
          "BPMでは、個々の業務を「プロセス」として可視化し、PDCAを回して改善する。",
          "RPAやワークフローと組み合わせ、業務の標準化・自動化を進める文脈でも用いられる。",
        ],
        optionNotes: {
          a: "経営資源を一元管理して全体最適を目指すのはERP（Enterprise Resource Planning）である。",
          i: "正解です。業務プロセスにマネジメントサイクルを取り入れ、継続的に改善するのがBPMです。",
          u: "顧客との関係を一貫して管理するのはCRM（Customer Relationship Management）である。",
          e: "部品供給から販売までの情報をリアルタイムに交換し、在庫削減とリードタイム短縮を図るのはSCM（Supply Chain Management）である。",
        },
        english:
          "BPM applies a continuous cycle of analysis, design, execution, and improvement to business processes.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問11",
        url: PAGE_URL,
        year: 2023,
        questionNo: 11,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["BPM", "業務プロセス", "ERP", "CRM", "SCM"],
    },
    {
      id: "official-2023-12",
      part: "A",
      topicIds: ["it-pm"],
      lessonIds: ["it/management"],
      difficulty: "easy",
      type: "knowledge",
      stem: "品質管理において，結果と原因との関連を整理して，魚の骨のような図にまとめたものはどれか。",
      options: [
        { id: "a", text: "管理図" },
        { id: "i", text: "特性要因図" },
        { id: "u", text: "パレート図" },
        { id: "e", text: "ヒストグラム" },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正解はイの特性要因図。結果（特性）と、それに影響する原因（要因）の関係を魚の骨のような形で整理した図である。",
        why: [
          "特性要因図は、品質問題の原因を4M（人・機械・材料・方法）などの観点で洗い出し、議論を構造化するのに使う。",
          "原因の候補を漏れなく整理できる一方、原因の大きさを定量的に示す図ではない点に注意する。",
        ],
        optionNotes: {
          a: "管理図は、品質特性の時系列変化を上下限とともに示し、工程が安定しているかを判断する図である。",
          i: "正解です。結果と原因の関係を魚骨状に整理するのが特性要因図です。",
          u: "パレート図は、項目別の件数を多い順に並べ、重点的に管理すべき項目を特定する図である。",
          e: "ヒストグラムは、測定値の分布を度数で表す図である。",
        },
        english:
          "A cause-and-effect diagram (fishbone diagram) organizes the causes that contribute to an observed result.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問12",
        url: PAGE_URL,
        year: 2023,
        questionNo: 12,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["品質管理", "特性要因図", "QC七つ道具"],
    },
    {
      id: "official-2023-13",
      part: "B",
      topicIds: ["risk-assessment", "risk-response"],
      lessonIds: ["risk/assessment", "risk/response-continuity"],
      difficulty: "hard",
      type: "scenario",
      stem: "表1中の各情報資産のうち，保有以外のリスク対応を行うべきものはどれか。該当するものだけを全て挙げた組合せを，解答群の中から選べ。",
      presentation: [
        {
          type: "p",
          text: "A社は，分析・計測機器などの販売及び機器を利用した試料の分析受託業務を行う分析機器メーカーである。A社では，図1の“情報セキュリティリスクアセスメント手順”に従い，年一度，情報セキュリティリスクアセスメントを行っている。",
        },
        {
          type: "p",
          text: "図1 情報セキュリティリスクアセスメント手順",
        },
        {
          type: "list",
          items: [
            "情報資産の機密性，完全性，可用性の評価値は，それぞれ0〜2の3段階とする。",
            "情報資産の機密性，完全性，可用性の評価値の最大値を，その情報資産の重要度とする。",
            "脅威及び脆弱性の評価値は，それぞれ0〜2の3段階とする。",
            "情報資産ごとに，様々な脅威に対するリスク値を算出し，その最大値を当該情報資産のリスク値として情報資産管理台帳に記載する。ここで，情報資産の脅威ごとのリスク値は，次の式によって算出する。",
            "リスク値＝情報資産の重要度×脅威の評価値×脆弱性の評価値",
            "情報資産のリスク値のしきい値を5とする。",
            "情報資産ごとのリスク値がしきい値以下であれば受容可能なリスクとする。",
            "情報資産ごとのリスク値がしきい値を超えた場合は，保有以外のリスク対応を行う。",
          ],
        },
        {
          type: "p",
          text: "A社の情報セキュリティリーダーであるBさんは，年次の情報セキュリティリスクアセスメントを行い，結果を情報資産管理台帳に表1のとおり記載した。",
        },
        {
          type: "table",
          caption: "表1 A社の情報資産管理台帳（抜粋）",
          headers: [
            "情報資産",
            "機密性の評価値",
            "完全性の評価値",
            "可用性の評価値",
            "情報資産の重要度",
            "脅威の評価値",
            "脆弱性の評価値",
            "リスク値",
          ],
          rows: [
            ["(一) 従業員の健康診断の情報", "2", "2", "2", "（省略）", "2", "2", "（省略）"],
            ["(二) 行動規範などの社内ルール", "1", "2", "1", "（省略）", "1", "1", "（省略）"],
            ["(三) 自社Webサイトに掲載している会社情報", "0", "2", "2", "（省略）", "2", "2", "（省略）"],
            [
              "(四) 分析結果の精度を向上させるために開発した技術",
              "2",
              "2",
              "1",
              "（省略）",
              "2",
              "1",
              "（省略）",
            ],
          ],
          note: "重要度とリスク値は、原文どおり「（省略）」と表記している。",
        },
      ],
      options: [
        { id: "a", text: "(一)，(二)" },
        { id: "i", text: "(一)，(二)，(三)" },
        { id: "u", text: "(一)，(二)，(四)" },
        { id: "e", text: "(一)，(三)" },
        { id: "o", text: "(一)，(三)，(四)" },
        { id: "ka", text: "(一)，(四)" },
        { id: "ki", text: "(二)，(三)" },
        { id: "ku", text: "(二)，(三)，(四)" },
        { id: "ke", text: "(二)，(四)" },
        { id: "ko", text: "(三)，(四)" },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "正解はエの(一)，(三)。各情報資産のリスク値を計算すると、(一)と(三)がしきい値5を超える。",
        why: [
          "(一)は重要度max(2,2,2)=2、脅威2、脆弱性2なので、リスク値は2×2×2=8となる。",
          "(二)は重要度max(1,2,1)=2、脅威1、脆弱性1なので、リスク値は2×1×1=2で受容可能である。",
          "(三)は重要度max(0,2,2)=2、脅威2、脆弱性2なので、リスク値は2×2×2=8となる。",
          "(四)は重要度max(2,2,1)=2、脅威2、脆弱性1なので、リスク値は2×2×1=4で受容可能である。しきい値5を超えるのは(一)と(三)だけである。",
        ],
        optionNotes: {
          a: "(二)のリスク値は2であり、保有以外の対応は不要である。",
          i: "(二)が含まれている点が誤りである。リスク値は2でしきい値以下になる。",
          u: "(二)は対象外であり、(四)もリスク値4でしきい値以下である。",
          e: "正解です。(一)と(三)はいずれもリスク値8で、しきい値5を超えます。",
          o: "(四)のリスク値は4であり、保有以外の対応を行う必要はない。",
          ka: "(三)のリスク値8を見落としている。また(四)はしきい値以下である。",
          ki: "(一)のリスク値8を見落としている。また(二)はしきい値以下である。",
          ku: "(一)を見落とし、(二)と(四)という不要な資産を含めている。",
          ke: "(二)も(四)もリスク値はしきい値以下であり、対象にならない。",
          ko: "(一)を見落とし、リスク値4の(四)を含めている。",
        },
        english:
          "Risk = importance × threat × vulnerability. Only assets (1) and (3) exceed the threshold of 5, with a risk value of 8 each.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問13",
        url: PAGE_URL,
        year: 2023,
        questionNo: 13,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["リスクアセスメント", "リスク値", "情報資産管理台帳", "科目B"],
    },
    {
      id: "official-2023-14",
      part: "B",
      topicIds: ["ops-backup", "risk-response"],
      lessonIds: ["ops/backup-bcp"],
      difficulty: "hard",
      type: "scenario",
      stem: "次の対策のうち，効果が期待できるものを二つ挙げた組合せを，解答群の中から選べ。",
      presentation: [
        {
          type: "p",
          text: "A社は旅行商品を販売しており，業務の中で顧客情報を取り扱っている。A社が保有する顧客情報は，A社のファイルサーバ1台に保存されている。ファイルサーバは，顧客情報を含むフォルダにある全てのデータを磁気テープに毎週土曜日にバックアップするよう設定されている。バックアップは2世代分が保存され，ファイルサーバの隣にあるキャビネットに保管されている。",
        },
        {
          type: "p",
          text: "A社では年に一度，情報セキュリティに関するリスクの見直しを実施している。情報セキュリティリーダーであるE主任は，A社のデータ保管に関するリスクを見直して図1にまとめた。",
        },
        {
          type: "p",
          text: "図1 A社のデータ保管に関するリスク（抜粋）",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "（省略）",
            "（省略）",
            "（省略）",
            "バックアップ対象とするフォルダの設定ミスによって，データが復旧できなくなる。",
          ],
        },
        {
          type: "p",
          text: "E主任は，図1の4のリスクを低減するための対策を検討し，効果が期待できるものを選んだ。",
        },
        {
          type: "p",
          text: "対策",
        },
        {
          type: "list",
          items: [
            "(一) 週1回バックアップを取得する代わりに，毎日1回バックアップを取得して7世代分保存する。",
            "(二) バックアップ後に，磁気テープ中のファイルのリストと，ファイルサーバのバックアップ対象ファイルのリストとを比較し，合致しているかを確認する。",
            "(三) バックアップ対象とするフォルダの設定を，必ず2名で行うようにする。",
            "(四) バックアップ用の媒体を磁気テープから外付けハードディスクに変更する。",
            "(五) バックアップを二組み取得し，うち一組みを遠隔地に保管する。",
          ],
        },
      ],
      options: [
        { id: "a", text: "(一)，(二)" },
        { id: "i", text: "(一)，(三)" },
        { id: "u", text: "(一)，(四)" },
        { id: "e", text: "(一)，(五)" },
        { id: "o", text: "(二)，(三)" },
        { id: "ka", text: "(二)，(四)" },
        { id: "ki", text: "(二)，(五)" },
        { id: "ku", text: "(三)，(四)" },
        { id: "ke", text: "(三)，(五)" },
        { id: "ko", text: "(四)，(五)" },
      ],
      correctOptionId: "o",
      explanation: {
        correct:
          "正解はオの(二)，(三)。バックアップ対象の突合と、設定作業の二人確認が、設定ミスによる復旧不能リスクに直接効く。",
        why: [
          "(二)は、テープ内のファイルリストとバックアップ対象のリストを比較することで、対象漏れや設定ミスを早期に検知できる。",
          "(三)は、設定作業を2名で行うことで、ひとりでの入力ミスや思い込みを相互に確認できる。いずれも原因である「設定ミス」に働きかける対策である。",
        ],
        optionNotes: {
          a: "(一)はバックアップ頻度と世代数を増やす対策で、設定ミスによる対象漏れを防ぐものではない。",
          i: "(一)は復旧時点の選択肢を増やすが、設定ミス自体には働きかけない。",
          u: "(一)も(四)も媒体や頻度の話であり、設定ミスの防止・検知にならない。",
          e: "(一)は頻度、(五)は災害対策であり、設定ミス対策ではない。",
          o: "正解です。(二)の突合と(三)の二人確認が、設定ミスの検知と防止に効果があります。",
          ka: "(四)の媒体変更は、設定ミスによる対象漏れを防がない。",
          ki: "(五)の遠隔地保管は、施設災害への対策であり、設定ミスには無関係である。",
          ku: "(四)は媒体変更であり、設定ミスの防止・検知に効果がない。",
          ke: "(五)は遠隔地保管であり、設定ミス対策ではない。",
          ko: "(四)と(五)はいずれも設定ミス以外のリスク（媒体障害・施設災害）への対策である。",
        },
        english:
          "Comparing the backup file list with the source list detects missed folders, and having two people configure the backup targets prevents misconfiguration.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問14",
        url: PAGE_URL,
        year: 2023,
        questionNo: 14,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["バックアップ", "設定ミス", "リスク対応", "科目B"],
    },
    {
      id: "official-2023-15",
      part: "B",
      topicIds: ["sec-malware", "ops-incident-response", "sec-auth"],
      lessonIds: ["security/threats-and-malware", "ops/incident-response"],
      difficulty: "hard",
      type: "scenario",
      stem: "A社が講じることにした対策はどれか。解答群のうち，最も適切なものを選べ。",
      presentation: [
        {
          type: "p",
          text: "消費者向けの化粧品販売を行うA社では，電子メール（以下，メールという）の送受信にクラウドサービスプロバイダB社が提供するメールサービス（以下，Bサービスという）を利用している。A社が利用するBサービスのアカウントは，A社の情報システム部が管理している。",
        },
        {
          type: "p",
          text: "〔Bサービスでの認証〕 Bサービスでの認証は，利用者IDとパスワードに加え，あらかじめ登録しておいたスマートフォンの認証アプリを利用した2要素認証である。入力された利用者IDとパスワードが正しかったときは，スマートフォンに承認のリクエストが来る。リクエストを1分以内に承認した場合は，Bサービスにログインできる。",
        },
        {
          type: "p",
          text: "〔社外のネットワークからの利用〕 社外のネットワークから社内システム又はファイルサーバを利用する場合，従業員は貸与されたPCから社内ネットワークにVPN接続する。",
        },
        {
          type: "p",
          text: "〔PCでのマルウェア対策〕 従業員に貸与されたPCには，マルウェア対策ソフトが導入されており，マルウェア定義ファイルを毎日16時に更新するように設定されている。マルウェア対策ソフトは，毎日17時に，各PCのマルウェア定義ファイルが更新されたかどうかをチェックし，更新されていない場合は情報システム部のセキュリティ担当者に更新されていないことをメールで知らせる。",
        },
        {
          type: "p",
          text: "〔メールに関する報告〕 ある日の15時頃，販売促進部の情報セキュリティリーダーであるC課長は，在宅で勤務していた部下のDさんから，メールに関する報告を受けた。報告を図1に示す。",
        },
        {
          type: "p",
          text: "図1 Dさんからの報告",
        },
        {
          type: "list",
          items: [
            "販売促進キャンペーンを委託しているE社のFさんから9時30分にメールが届いた。",
            "Fさんとは直接会ったことがある。この数か月頻繁にやり取りもしていた。",
            "そのメールは，これまでのメールに返信する形で作成されており，メールの本文には販売キャンペーンの内容やFさんがよく利用する挨拶文が記載されていた。",
            "急ぎの対応を求める旨が記載されていたので，メールに添付されていたファイルを開いた。",
            "メールの添付ファイルを開いた際，特に見慣れないエラーなどは発生せず，ファイルの内容も閲覧できた。",
            "ファイルの内容を確認した後，返信した。",
            "11時頃，Dさんのスマートフォンに，承認のリクエストが来たが，Bサービスにログインしようとしたタイミングではなかったので，リクエストを承認しなかった。",
            "12時までと急いでいた割にその後の返信がなく不審に思ったので，14時50分にFさんに電話で確認したところ，今日はメールを送っていないと言われた。",
            "現在までのところ，PCの処理速度が遅くなったり，見慣れないウィンドウが表示されたりするなどの不具合や不審な事象は発生していない。",
            "現在，PCは，インターネットには接続しているが，社内ネットワークへのVPN接続は切断している。",
            "Dさんはすぐに会社に向かうことは可能で，Dさんの自宅から会社までは1時間掛かる。",
          ],
        },
        {
          type: "p",
          text: "C課長は，すぐにPCを会社に持参し，オフラインでマルウェア対策ソフトの定義ファイルを最新版に更新した後，フルスキャンを実施するよう，Dさんに指示をした。スキャンを実行した結果，DさんのPCからマルウェアが検出された。このマルウェアは，マルウェア対策ソフトのベンダーが9時に公開した最新の定義ファイルで検出可能であることが判明した。",
        },
        {
          type: "p",
          text: "A社では，今回のマルウェア感染による情報セキュリティインシデントの問題点を整理し，再発を防止するための対策を講じることにした。",
        },
      ],
      options: [
        {
          id: "a",
          text: "PCが起動したらすぐに自動的にVPN接続するように，PCを構成する。",
        },
        {
          id: "i",
          text: "これまでメールをやり取りしたことがない差出人からメールを受信した場合は，添付されているファイルを開かず，すぐに削除するよう社内ルールに定める。",
        },
        {
          id: "u",
          text: "マルウェア定義ファイルは，10分ごとに更新されるように，マルウェア対策ソフトの設定を変更する。",
        },
        {
          id: "e",
          text: "マルウェア定義ファイルは，8時にも更新されるように，マルウェア対策ソフトの設定を変更する。",
        },
        {
          id: "o",
          text: "メールに添付されたファイルを開く場合は，一旦PCに保存し，マルウェア対策ソフトでスキャンを実行してから開くよう社内ルールに定める。",
        },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "正解はウ。定義ファイルの更新間隔を10分ごとに短縮すれば、新種マルウェアの定義が公開されてから端末に反映されるまでの空白を小さくできる。",
        why: [
          "今回の原因は、定義ファイルの更新が毎日16時であり、9時に公開された定義が端末に反映されていなかったことにある。",
          "更新間隔を短くすれば、公開から検知可能になるまでの時間が最大10分程度に縮まり、同種の感染の窓を狭められる。",
          "エの8時更新では、9時公開の定義を依然として取り込めず、今回の時間帯の感染を防げない。",
        ],
        optionNotes: {
          a: "起動時の自動VPN接続は利便性を高めるが、感染した端末を社内ネットワークにつなぐ方向に働き、被害拡大のリスクをむしろ高める。",
          i: "初回送信者の添付を一律削除すると正当な取引を損なううえ、今回は取引先をかたる返信メールであり、既知の差出人であるため防げない。",
          u: "正解です。更新間隔の短縮により、定義公開から端末反映までのタイムラグを小さくできます。",
          e: "8時に更新しても、問題の定義ファイルは9時公開であるため、9時30分のメール受信時点ではまだ反映されていない。",
          o: "保存後にスキャンしても、定義ファイルが古ければ新種を検知できない。今回のケースではスキャンしても検出できなかった。",
        },
        english:
          "The root cause was the daily 16:00 signature update, which missed the 09:00 release. Shortening the update interval to 10 minutes narrows the exposure window.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution:
          "出典：IPA 情報セキュリティマネジメント試験 令和5年度 公開問題 問15",
        url: PAGE_URL,
        year: 2023,
        questionNo: 15,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["マルウェア", "標的型メール", "定義ファイル", "科目B"],
    },
  ],
};
