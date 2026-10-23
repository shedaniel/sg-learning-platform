import type { OfficialPaper } from "@/lib/content/types";

const PAGE_URL =
  "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/2024r06.html";
const BOOKLET_URL =
  "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/eid2eo0000007g1d-att/2024r06_sg_qs.pdf";
const ANSWER_URL =
  "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/eid2eo0000007g1d-att/2024r06_sg_ans.pdf";

const attribution = (n: number) =>
  `出典：IPA 情報セキュリティマネジメント試験 令和6年度 公開問題 問${n}`;

export const paper: OfficialPaper = {
  year: 2024,
  reiwa: 6,
  label: "令和6年度 公開問題",
  publishedAt: "2024-07-05",
  pageUrl: PAGE_URL,
  bookletUrl: BOOKLET_URL,
  answerUrl: ANSWER_URL,
  questionNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  publishedCount: 15,
  actualCount: 60,
  note:
    "IPAが公開した令和6年度（2024年度）情報セキュリティマネジメント試験の公開問題15問をすべて収録しています。実際の試験は60問で構成されるため、本収録は試験全体ではありません。問題文・図表はIPA公開PDFに基づき、表と箇条書きはテキスト化して掲載しています。図のみに依存する問題はなく、全15問を収録しました。著作権はIPAに帰属し、出典を明示して利用しています。",
  questions: [
    {
      id: "official-2024-01",
      part: "A",
      topicIds: ["risk-assessment"],
      lessonIds: ["risk/assessment"],
      difficulty: "medium",
      type: "knowledge",
      stem:
        "JIS Q 31000:2019（リスクマネジメント－指針）におけるリスクアセスメントを構成するプロセスの組合せはどれか。",
      options: [
        { id: "a", text: "リスク特定，リスク評価，リスク受容" },
        { id: "i", text: "リスク特定，リスク分析，リスク評価" },
        { id: "u", text: "リスク分析，リスク対応，リスク受容" },
        { id: "e", text: "リスク分析，リスク評価，リスク対応" },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "リスクアセスメントは「リスク特定」「リスク分析」「リスク評価」の3プロセスで構成されます。",
        why: [
          "JIS Q 31000:2019では，リスクアセスメントをリスク特定・リスク分析・リスク評価の連続したプロセスとして定義しています。",
          "リスク特定でリスク源・事象・原因・結果を洗い出し，リスク分析で発生可能性と影響を理解し，リスク評価でリスク基準と比較して対応の要否を判断します。",
          "リスク対応とリスク受容はアセスメントの後続または意思決定の段階であり，アセスメントを構成する3プロセスには含まれません。",
        ],
        optionNotes: {
          a: "リスク評価は含まれますが，リスク受容はリスク対応の選択肢の一つであり，リスクアセスメントの構成要素ではありません。",
          i: "正解です。特定→分析→評価の順に実施します。",
          u: "リスク分析は含まれますが，リスク対応とリスク受容はアセスメントの外側にある処理です。",
          e: "リスク分析と評価は含まれますが，リスク対応はアセスメントの結果を受けて行う別プロセスです。",
        },
        english:
          "Under JIS Q 31000:2019, risk assessment consists of risk identification, risk analysis, and risk evaluation. Risk treatment follows assessment.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(1),
        url: PAGE_URL,
        year: 2024,
        questionNo: 1,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["リスクアセスメント", "JIS Q 31000", "リスクマネジメント"],
    },
    {
      id: "official-2024-02",
      part: "A",
      topicIds: ["mgmt-policy"],
      lessonIds: ["management/policy-isms"],
      difficulty: "medium",
      type: "knowledge",
      stem:
        "情報の取扱基準の中で，社外秘情報の持出しを禁じ，周知した上で，従業員に情報を不正に持ち出された場合に，“社外秘情報とは知らなかった”という言い訳をさせないことが目的の一つになっている対策はどれか。",
      options: [
        {
          id: "a",
          text: "権限がない従業員が文書にアクセスできないようにするペーパレス化",
        },
        { id: "i", text: "従業員との信頼関係の維持を目的にした職場環境の整備" },
        { id: "u", text: "従業員に対する電子メールの外部送信データ量の制限" },
        { id: "e", text: "情報の管理レベルについてのラベル付け" },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "情報の管理レベルをラベル付けして明示すれば，従業員は対象情報が社外秘であることを認識でき，「知らなかった」という言い訳が通用しなくなります。",
        why: [
          "ラベル付けは，情報の分類・管理レベルを目に見える形で示す統制であり，取扱基準の周知と相まって従業員の認識を確保します。",
          "不正持出しの責任を問う場面では，情報が社外秘であることを本人が認識できる状態にしておくことが重要です。",
          "アクセス制御やメール量の制限は不正行為の機会を減らしますが，「社外秘だと知らなかった」という主張を直接排除するものではありません。",
        ],
        optionNotes: {
          a: "ペーパレス化やアクセス制御は権限のない者の閲覧を防ぐ対策であり，閲覧できる従業員が管理レベルを認識する保証にはなりません。",
          i: "職場環境の整備は信頼関係の維持には役立ちますが，情報の区分を従業員に明示する対策ではありません。",
          u: "外部送信データ量の制限は大量持出しの抑止にはなりますが，個々の情報が社外秘であることを示すものではありません。",
          e: "正解です。ラベルによって情報の管理レベルを明示し，従業員の認識を確保します。",
        },
        english:
          "Labeling information by sensitivity makes its classification explicit, so an employee cannot credibly claim they did not know the information was confidential.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(2),
        url: PAGE_URL,
        year: 2024,
        questionNo: 2,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["情報管理", "ラベル付け", "情報取扱基準"],
    },
    {
      id: "official-2024-03",
      part: "A",
      topicIds: ["sec-malware"],
      lessonIds: ["security/threats-and-malware"],
      difficulty: "easy",
      type: "knowledge",
      stem:
        "マルウェアの検出方法のうち，検査対象のプログラムを実行する必要があるものはどれか。",
      options: [
        { id: "a", text: "コンペア法" },
        { id: "i", text: "チェックサム法" },
        { id: "u", text: "パターンマッチング法" },
        { id: "e", text: "ビヘイビア法" },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "ビヘイビア法は，プログラムを実際に実行し，その振る舞い（ファイル操作，通信，レジストリ変更など）を監視して不審な動作を検出します。",
        why: [
          "ビヘイビア法（動的検出）は，実行時の挙動を評価するため，未知のマルウェアや亜種にも対応できる一方，実行を伴うためサンドボックスなどの安全な環境が必要です。",
          "コンペア法・チェックサム法・パターンマッチング法は，いずれもファイルの内容やハッシュ値，既知のパターンと照合する静的検出であり，プログラムを実行せずに検査できます。",
        ],
        optionNotes: {
          a: "コンペア法は正常なファイルと比較して変更を検出する静的手法で，実行は不要です。",
          i: "チェックサム法はファイルのチェックサムを既知の値と比較する静的手法で，実行は不要です。",
          u: "パターンマッチング法は既知のマルウェアのコードパターンと照合する静的検出で，実行は不要です。",
          e: "正解です。実行時の振る舞いを監視するため，プログラムの実行が必要です。",
        },
        english:
          "Behavior-based detection runs the program in a controlled environment and monitors its actions, so execution is required. Signature, checksum, and compare methods inspect files statically.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(3),
        url: PAGE_URL,
        year: 2024,
        questionNo: 3,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["マルウェア", "検出手法", "ビヘイビア法"],
    },
    {
      id: "official-2024-04",
      part: "A",
      topicIds: ["sec-attacks-network"],
      lessonIds: ["security/attacks"],
      difficulty: "medium",
      type: "knowledge",
      stem: "サイバーキルチェーンに関する説明として，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "委託先の情報セキュリティリスクが委託元にも影響するという考え方を基にしたリスク分析のこと",
        },
        {
          id: "i",
          text: "攻撃者がクライアントとサーバとの間の通信を中継し，あたかもクライアントとサーバが直接通信しているかのように装うことによって情報を盗聴するサイバー攻撃手法のこと",
        },
        {
          id: "u",
          text: "攻撃者の視点から，攻撃の手口を偵察から目的の実行までの段階に分けたもの",
        },
        {
          id: "e",
          text: "取引データを複数の取引ごとにまとめ，それらを時系列につなげたチェーンに保存することによって取引データの改ざんを検知可能にしたもの",
        },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "サイバーキルチェーンは，攻撃を偵察，武器化，配送，エクスプロイト，インストール，C2通信，目的実行という段階に分け，各段階での防御機会を考えるモデルです。",
        why: [
          "攻撃者の視点で攻撃の進行を段階化することで，どの段階で検知・阻止すれば被害を防げるかを整理できます。",
          "単一の対策に頼らず，複数段階で食い止める多層防御の設計に役立ちます。",
          "選択肢アはサプライチェーンリスク，イは中間者攻撃（MITM），エはブロックチェーンの説明です。",
        ],
        optionNotes: {
          a: "委託先リスクが委託元に及ぶという考え方はサプライチェーンリスクの説明で，キルチェーンではありません。",
          i: "通信を中継して盗聴するのは中間者攻撃（MITM）の説明です。",
          u: "正解です。攻撃の手口を段階に分けたモデルです。",
          e: "取引データをチェーン状に保存して改ざんを検知するのはブロックチェーンの説明です。",
        },
        english:
          "The cyber kill chain models an attack in stages, from reconnaissance to actions on objectives, so defenders can interrupt it at multiple points.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(4),
        url: PAGE_URL,
        year: 2024,
        questionNo: 4,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["サイバーキルチェーン", "標的型攻撃", "多層防御"],
    },
    {
      id: "official-2024-05",
      part: "A",
      topicIds: ["sec-auth"],
      lessonIds: ["security/crypto-auth"],
      difficulty: "medium",
      type: "knowledge",
      stem: "リスクベース認証の説明として，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "機器の画面に表示された点を正しい順序に一筆書きでなぞった場合，認証が成功し，機器のロックが解除される。",
        },
        {
          id: "i",
          text: "通常とは異なる IP アドレス，Web ブラウザなどから認証要求があった場合に，追加の認証を行う。",
        },
        {
          id: "u",
          text: "認証局が，Web サイトへのサーバ証明書発行において，サーバ証明書に記載される組織のドメイン利用権，法的及び物理的実在性を確認する。",
        },
        {
          id: "e",
          text: "ゆがんだ文字を含む画像を表示し，その文字が正しく入力された場合に認証が成功する。",
        },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "リスクベース認証は，アクセス元のIPアドレス，端末，ブラウザ，時刻，履歴などからリスクを評価し，普段と異なる条件では追加認証を求める方式です。",
        why: [
          "正常時は利便性を保ち，リスクが高いと判断したときだけ本人確認を強化できる点が特徴です。",
          "不正ログインの兆候を検知して追加の要素認証を課すことで，パスワード漏えい時の被害を抑えます。",
          "選択肢アはパターンロック，ウはEV証明書の審査，エはCAPTCHAの説明です。",
        ],
        optionNotes: {
          a: "点を一筆書きでなぞるのはパターン認証（画面ロック）の説明です。",
          i: "正解です。普段と異なる条件でのアクセスに追加認証を行います。",
          u: "組織の実在性などを認証局が審査するのは，EV（Extended Validation）サーバ証明書などの発行審査の説明です。",
          e: "ゆがんだ文字を入力させるのは，自動プログラムを排除するCAPTCHAの説明です。",
        },
        english:
          "Risk-based authentication evaluates context such as IP address, device, and browser, and requests additional authentication only when the risk is elevated.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(5),
        url: PAGE_URL,
        year: 2024,
        questionNo: 5,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["リスクベース認証", "多要素認証", "不正ログイン"],
    },
    {
      id: "official-2024-06",
      part: "A",
      topicIds: ["tech-protocols"],
      lessonIds: ["tech/network"],
      difficulty: "medium",
      type: "knowledge",
      stem:
        "A 社の Web サーバは，サーバ証明書を使って TLS 通信を行っている。PC から A 社の Web サーバへの TLS を用いたアクセスにおいて，当該 PC がサーバ証明書を入手した後に，認証局の公開鍵を利用して行う動作はどれか。",
      options: [
        {
          id: "a",
          text: "暗号化通信に利用する共通鍵を，認証局の公開鍵を使って復号する。",
        },
        {
          id: "i",
          text: "暗号化通信に利用する共通鍵を生成し，認証局の公開鍵を使って暗号化する。",
        },
        {
          id: "u",
          text: "サーバ証明書の正当性を，認証局の公開鍵を使って検証する。",
        },
        {
          id: "e",
          text: "利用者が入力して送付する秘匿データを，認証局の公開鍵を使って暗号化する。",
        },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "PCは，サーバ証明書に付された認証局のデジタル署名を，認証局の公開鍵で検証して証明書の正当性を確認します。",
        why: [
          "サーバ証明書は認証局が秘密鍵で署名しており，対応する公開鍵で検証できれば，証明書が改ざんされていないことと発行元を確認できます。",
          "証明書の検証後，PCは共通鍵（セッション鍵）を生成し，サーバ証明書に含まれるサーバの公開鍵で暗号化して送ります。認証局の公開鍵はこの暗号化には使いません。",
          "認証局の公開鍵は署名検証用であり，通信データの暗号化や共通鍵の復号には用いません。",
        ],
        optionNotes: {
          a: "共通鍵はサーバの公開鍵で暗号化されて送られ，認証局の公開鍵で復号するものではありません。",
          i: "共通鍵の生成は行いますが，暗号化に使うのはサーバ証明書内のサーバの公開鍵です。",
          u: "正解です。認証局の公開鍵で証明書の署名を検証します。",
          e: "利用者の秘匿データは，確立したTLS通信の共通鍵で暗号化されます。認証局の公開鍵は使いません。",
        },
        english:
          "The client verifies the server certificate's signature with the CA's public key. The session key is then encrypted with the server's public key, not the CA's.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(6),
        url: PAGE_URL,
        year: 2024,
        questionNo: 6,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["TLS", "サーバ証明書", "認証局", "PKI"],
    },
    {
      id: "official-2024-07",
      part: "A",
      topicIds: ["law-privacy"],
      lessonIds: ["law/privacy"],
      difficulty: "easy",
      type: "knowledge",
      stem:
        "個人情報保護法が保護の対象としている個人情報に関する記述のうち，適切なものはどれか。",
      options: [
        { id: "a", text: "企業が管理している顧客に関する情報に限られる。" },
        { id: "i", text: "個人が秘密にしているプライバシーに関する情報に限られる。" },
        { id: "u", text: "生存する個人に関する情報に限られる。" },
        { id: "e", text: "日本国籍を有する個人に関する情報に限られる。" },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "個人情報保護法上の「個人情報」は，生存する個人に関する情報であって，氏名等により特定の個人を識別できるもの，または個人識別符号が含まれるものを指します。",
        why: [
          "同法は生存する個人を保護対象とし，死者に関する情報は原則として個人情報に該当しません。",
          "企業が管理する情報に限らず，個人が扱う情報も対象になり得ます。また，秘密にしている情報に限らず，公開されている情報も個人情報に該当し得ます。",
          "国籍を問わず，日本国内で取り扱われる個人に関する情報が対象となります。",
        ],
        optionNotes: {
          a: "個人情報は企業が管理するものに限られず，個人事業者や個人が保有する情報も対象です。",
          i: "秘密にしているプライバシー情報に限られず，公開されている情報でも個人識別性があれば個人情報に該当します。",
          u: "正解です。生存する個人に関する情報が保護対象です。",
          e: "日本国籍に限られず，外国人に関する情報も保護対象になります。",
        },
        english:
          "The Act protects information about living individuals that can identify a specific person, regardless of who holds it, whether it is secret, or the person's nationality.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(7),
        url: PAGE_URL,
        year: 2024,
        questionNo: 7,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["個人情報保護法", "個人情報", "個人識別符号"],
    },
    {
      id: "official-2024-08",
      part: "A",
      topicIds: ["org-audit"],
      lessonIds: ["org/audit-physical"],
      difficulty: "medium",
      type: "knowledge",
      stem: "内部統制の基本的要素の一つである“統制活動”に該当するものはどれか。",
      options: [
        { id: "a", text: "経営目的を達成するための経営方針及び経営戦略" },
        { id: "i", text: "個人情報保護に関する脅威と脆弱性の分析" },
        { id: "u", text: "受注から出荷に至る業務プロセスに組み込まれた処理結果の検証" },
        { id: "e", text: "定期的に計画して実施する内部業務監査" },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "統制活動は，経営者の指令が組織全体で確実に実行されるようにする方針・手続であり，業務プロセスに組み込まれた承認や照合，処理結果の検証などが該当します。",
        why: [
          "内部統制の5要素は，統制環境，リスク評価，統制活動，情報と伝達，モニタリングです。",
          "受注から出荷までの業務に処理結果の検証を組み込むことは，日々の業務の中で統制を機能させる具体的な統制活動です。",
          "選択肢アは統制環境，イはリスク評価，エはモニタリングに分類されます。",
        ],
        optionNotes: {
          a: "経営方針や経営戦略は，統制の基盤となる統制環境に該当します。",
          i: "脅威と脆弱性の分析はリスクの識別・評価であり，リスク評価に該当します。",
          u: "正解です。業務プロセスに組み込まれた検証は統制活動です。",
          e: "定期的な内部監査は，統制が有効に機能しているかを確認するモニタリングに該当します。",
        },
        english:
          "Control activities are the policies and procedures embedded in business processes, such as approvals and verification of processing results.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(8),
        url: PAGE_URL,
        year: 2024,
        questionNo: 8,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["内部統制", "統制活動", "監査"],
    },
    {
      id: "official-2024-09",
      part: "A",
      topicIds: ["it-system"],
      lessonIds: ["it/systems"],
      difficulty: "medium",
      type: "knowledge",
      stem:
        "システムの信頼性指標として RASIS がある。そのうちの A は可用性を表し，システムのサービス時間など，ある一定期間でのシステムの機能を維持する度合いを表している。この A を向上させるものはどれか。",
      options: [
        { id: "a", text: "MTBF と MTTR をともに 2 倍にする。" },
        { id: "i", text: "MTBF は変えず，MTTR を 2 倍にする。" },
        { id: "u", text: "MTBF を 2 倍にして，MTTR は変えない。" },
        { id: "e", text: "MTBF を半分にして，MTTR は 2 倍にする。" },
      ],
      correctOptionId: "u",
      explanation: {
        correct:
          "可用率は MTBF ÷（MTBF + MTTR）で求められます。MTTRを変えずにMTBFを2倍にすると，分母の増加に対して分子が大きく増えるため可用率は向上します。",
        why: [
          "MTBFは平均故障間隔（稼働していた時間），MTTRは平均修復時間（停止していた時間）です。可用性を上げるには，故障しにくくする（MTBFを大きくする）か，早く直す（MTTRを小さくする）必要があります。",
          "MTBFとMTTRをともに2倍にすると比が変わらず，可用率は変化しません。MTTRを2倍にすると停止時間が増えて可用率は低下します。",
          "MTBFを半分にしてMTTRを2倍にすると，故障間隔が短く修復も遅くなるため，可用率は大きく低下します。",
        ],
        optionNotes: {
          a: "MTBFとMTTRが同じ倍率で増えるため，MTBF ÷（MTBF + MTTR）の値は変わりません。",
          i: "MTTRが2倍になると停止時間が増えるため，可用率は低下します。",
          u: "正解です。MTBFを2倍にすると，故障間隔が長くなり可用率が向上します。",
          e: "MTBFが半分，MTTRが2倍では，稼働時間が短く停止時間が長くなるため可用率は低下します。",
        },
        english:
          "Availability = MTBF / (MTBF + MTTR). Increasing MTBF while keeping MTTR constant raises availability.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(9),
        url: PAGE_URL,
        year: 2024,
        questionNo: 9,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["RASIS", "可用性", "MTBF", "MTTR"],
    },
    {
      id: "official-2024-10",
      part: "A",
      topicIds: ["tech-network"],
      lessonIds: ["tech/network"],
      difficulty: "easy",
      type: "knowledge",
      stem:
        "社内ネットワークからインターネットへのアクセスを中継し，Web コンテンツをキャッシュすることによってアクセスを高速にする仕組みで，セキュリティ確保にも利用されるものはどれか。",
      options: [
        { id: "a", text: "DMZ" },
        { id: "i", text: "IP マスカレード（NAPT）" },
        { id: "u", text: "ファイアウォール" },
        { id: "e", text: "プロキシサーバ" },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "プロキシサーバは，クライアントのWebアクセスを代理して中継し，取得したコンテンツをキャッシュして応答を高速化します。URLフィルタリングやアクセスログの記録にも利用されます。",
        why: [
          "キャッシュにより同一コンテンツへの再アクセスを高速化できるほか，社内からの通信を一旦プロキシで受けることで，接続先の制御や監視が可能になります。",
          "DMZは外部公開サーバを置くネットワーク区画，IPマスカレードはアドレス変換，ファイアウォールは通信の許可・拒否を行う装置であり，いずれもWebコンテンツのキャッシュ機能を主体としません。",
        ],
        optionNotes: {
          a: "DMZは外部に公開するサーバを内部ネットワークから分離する区画であり，キャッシュによる高速化の仕組みではありません。",
          i: "IPマスカレード（NAPT）は複数の端末でグローバルIPアドレスを共有するアドレス変換技術です。",
          u: "ファイアウォールは通信を許可・拒否して境界を守る装置で，Webコンテンツのキャッシュを目的としません。",
          e: "正解です。プロキシサーバがアクセスを中継し，キャッシュやフィルタリングを行います。",
        },
        english:
          "A proxy server relays client web requests, caches content to improve performance, and supports URL filtering and access logging.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(10),
        url: PAGE_URL,
        year: 2024,
        questionNo: 10,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["プロキシサーバ", "キャッシュ", "ネットワーク防御"],
    },
    {
      id: "official-2024-11",
      part: "A",
      topicIds: ["it-strategy"],
      lessonIds: ["it/strategy"],
      difficulty: "medium",
      type: "knowledge",
      stem:
        "全社的な推進体制で RPA を導入するときの留意点として，適切なものはどれか。",
      options: [
        {
          id: "a",
          text: "各業務部門が連携して，RPA の対象業務に対して業務プロセス全体の可視化と業務プロセスの見直しを行った上で，RPA の導入を行う。",
        },
        {
          id: "i",
          text: "業務フローが固定的で画面の変更が少ない業務よりも，業務フローの変更や画面の変更が多い業務から優先的に導入する。",
        },
        {
          id: "u",
          text: "情報システム部門や他部門との連携は行わずに，個々の業務部門が主導して，RPA ツールの選定，ソフトウェアロボットの作成，活用及び運用を推進する。",
        },
        {
          id: "e",
          text: "ルール化された処理や繰返し処理が多い業務よりも，例外処理が多い業務や条件が複雑な業務に対して，優先的に RPA の導入を行う。",
        },
      ],
      correctOptionId: "a",
      explanation: {
        correct:
          "RPAは既存の業務をそのまま自動化するのではなく，まず業務プロセス全体を可視化し，無駄や例外を整理した上で適用範囲を決めることが重要です。全社導入では各部門が連携して進めます。",
        why: [
          "業務の見直しをせずに自動化すると，非効率な手順や例外処理までそのまま固定化してしまう恐れがあります。",
          "RPAは定型的で繰り返しの多い業務，画面や業務フローの変更が少ない業務に適しており，変更が多い業務や例外の多い業務は向きません。",
          "全社的な推進には情報システム部門との連携が不可欠で，個々の部門が独断でツールを選定すると，管理やセキュリティの統制が崩れます。",
        ],
        optionNotes: {
          a: "正解です。業務プロセス全体の可視化と見直しを行ってからRPAを導入します。",
          i: "画面や業務フローの変更が多い業務は，ロボットの作り直しが頻発するため，優先度は低くなります。",
          u: "全社導入では情報システム部門や他部門との連携が必要で，個々の部門だけでの推進は適切ではありません。",
          e: "例外処理や複雑な条件の業務はRPAに不向きで，定型的・反復的な業務を優先すべきです。",
        },
        english:
          "Before adopting RPA, organizations should visualize and redesign the entire business process, then automate stable, rule-based, repetitive tasks with cross-department coordination.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(11),
        url: PAGE_URL,
        year: 2024,
        questionNo: 11,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["RPA", "業務プロセス", "BPR"],
    },
    {
      id: "official-2024-12",
      part: "A",
      topicIds: ["it-strategy"],
      lessonIds: ["it/strategy"],
      difficulty: "medium",
      type: "knowledge",
      stem: "特性要因図を説明したものはどれか。",
      options: [
        {
          id: "a",
          text: "原因と結果の関連を魚の骨のような形態に整理して体系的にまとめ，結果に対してどのような原因が関連しているかを明確にする。",
        },
        {
          id: "i",
          text: "時系列的に発生するデータのばらつきを折れ線グラフで表し，管理限界線を利用して客観的に管理する。",
        },
        {
          id: "u",
          text: "収集したデータを幾つかの区間に分類し，各区間に属するデータの個数を棒グラフとして描き，品質のばらつきを捉える。",
        },
        {
          id: "e",
          text: "データを幾つかの項目に分類し，出現頻度の大きさの順に棒グラフとして並べ，累積和を折れ線グラフで描き，問題点を絞り込む。",
        },
      ],
      correctOptionId: "a",
      explanation: {
        correct:
          "特性要因図は，結果（特性）に対して考えられる原因を，4M（人，機械，材料，方法）などの分類ごとに魚の骨状に整理し，原因の関連を明確にするQC七つ道具の一つです。",
        why: [
          "問題の結果から原因を体系的に洗い出すことで，対策すべき要因の見当を付けやすくします。",
          "選択肢イは管理図，ウはヒストグラム，エはパレート図の説明です。",
          "QC七つ道具は，特性要因図，管理図，ヒストグラム，パレート図，散布図，チェックシート，グラフ（層別）です。",
        ],
        optionNotes: {
          a: "正解です。原因と結果の関連を魚の骨状に整理する図です。",
          i: "時系列データを管理限界線で管理するのは管理図です。",
          u: "データを区間に分類して棒グラフにするのはヒストグラムです。",
          e: "出現頻度順の棒グラフと累積和の折れ線で問題を絞り込むのはパレート図です。",
        },
        english:
          "A cause-and-effect (fishbone) diagram organizes possible causes of a result into categories, helping teams identify and prioritize root causes.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(12),
        url: PAGE_URL,
        year: 2024,
        questionNo: 12,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["特性要因図", "QC七つ道具", "品質管理"],
    },
    {
      id: "official-2024-13",
      part: "B",
      topicIds: ["sec-auth", "tech-cloud"],
      lessonIds: ["security/crypto-auth", "tech/endpoint-cloud"],
      difficulty: "medium",
      type: "scenario",
      stem:
        "A 社が実施することにした設定変更の組合せはどれか。解答群のうち，最も適切なものを選べ。",
      presentation: [
        {
          type: "lead",
          text: "A 社は，従業員 100 名の食品製造・販売会社である。A 社では，営業部が取り扱う顧客情報を X 社の SaaS である X 顧客管理サービス（以下，X サービスという）を利用して管理している。また，A 社は，X サービスの不正アクセス対策として，X サービスへのログインは，A 社の社内ネットワークからだけ許可しており，A 社の社外からはできないように設定している。",
        },
        {
          type: "p",
          text: "X サービスに備わっている不正ログインを防止するための機能と，A 社が X サービスに適用している現在の設定を表 1 に示す。",
        },
        {
          type: "table",
          caption: "表1 不正ログインを防止するための機能と現在の設定（抜粋）",
          headers: ["機能", "不正ログインを防止するための機能", "現在の設定"],
          rows: [
            [
              "機能 1",
              "指定した IP アドレスからアクセスした場合だけ，ログインできるよう制限する。",
              "有効 1)",
            ],
            ["機能 2", "利用者 ID とパスワードによって認証する。", "有効"],
            [
              "機能 3",
              "英字，数字，記号の 3 種類全てを含む 8 文字以上のパスワードを強制する。",
              "有効",
            ],
            ["機能 4", "ワンタイムパスワードによって認証する。", "無効"],
            ["機能 5", "ログイン画面に CAPTCHA を表示し，回答させる。", "無効"],
          ],
          note: "1) A 社が使用しているグローバル IP アドレスを指定している。",
        },
        {
          type: "p",
          text: "A 社では，昨今の社会情勢を鑑みて，営業部員を対象にテレワーク制度の導入を検討することにした。社外からも X サービスを利用できるようにしたい。また，社外から不正アクセスされるリスクを低減するために，利用者認証を強化したい。そこで，機能 1～5 の設定について，必要な変更を二つ実施することにした。",
        },
      ],
      options: [
        { id: "a", text: "有効から無効に変更する機能：機能 1／無効から有効に変更する機能：機能 4" },
        { id: "i", text: "有効から無効に変更する機能：機能 1／無効から有効に変更する機能：機能 5" },
        { id: "u", text: "有効から無効に変更する機能：機能 2／無効から有効に変更する機能：機能 4" },
        { id: "e", text: "有効から無効に変更する機能：機能 2／無効から有効に変更する機能：機能 5" },
        { id: "o", text: "有効から無効に変更する機能：機能 3／無効から有効に変更する機能：機能 4" },
        { id: "ka", text: "有効から無効に変更する機能：機能 3／無効から有効に変更する機能：機能 5" },
      ],
      correctOptionId: "a",
      explanation: {
        correct:
          "テレワークで社外から利用するには，社内グローバルIPアドレスに限定する機能1を無効にする必要があります。同時に，パスワードだけでなくワンタイムパスワードを組み合わせる機能4を有効にして認証を強化します。",
        why: [
          "機能1が有効のままだと，社外のテレワーク端末からログインできず，テレワーク制度の目的を達成できません。",
          "機能4のワンタイムパスワードを有効にすると，知識（パスワード）と所持（OTP生成端末）の2要素認証になり，パスワード漏えいだけでは不正ログインされにくくなります。",
          "機能2（IDとパスワード）と機能3（パスワード複雑性）は引き続き有効にしておくべきで，無効にする理由はありません。",
        ],
        optionNotes: {
          a: "正解です。機能1を無効化して社外アクセスを可能にし，機能4のOTPを有効化して認証を強化します。",
          i: "機能1の無効化は正しいですが，CAPTCHAは自動化された攻撃の抑止には有効でも，利用者認証そのものを強化するものではありません。",
          u: "機能2を無効にするとIDとパスワードによる認証ができなくなり，ログイン手段として成立しません。",
          e: "機能2の無効化は不適切で，CAPTCHAも認証強化の主手段にはなりません。",
          o: "機能3の無効化はパスワードの強度を下げる逆効果で，OTPだけでは他の利用者の認証基盤として不十分です。",
          ka: "機能3を無効にするとパスワードが弱くなり，CAPTCHAも認証要素の強化にはなりません。",
        },
        english:
          "Disable the IP-address restriction so teleworkers can connect, and enable one-time passwords to add a possession factor beyond the password.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(13),
        url: PAGE_URL,
        year: 2024,
        questionNo: 13,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["SaaS", "テレワーク", "多要素認証", "ワンタイムパスワード", "科目B"],
    },
    {
      id: "official-2024-14",
      part: "B",
      topicIds: ["ops-backup", "risk-continuity"],
      lessonIds: ["ops/backup-bcp", "risk/response-continuity"],
      difficulty: "hard",
      type: "scenario",
      stem:
        "B 課長が選んだ再発防止策はどれか。解答群のうち，最も適切なものを選べ。",
      presentation: [
        {
          type: "lead",
          text: "A 社は医療品の販売を行う従業員 100 名の企業である。営業部では，オンプレミスのデータベースに顧客情報を格納している。",
        },
        {
          type: "p",
          text: "営業部では，図 1 に示すバックアップポリシーを順守している。",
        },
        { type: "p", text: "図1 営業部におけるバックアップポリシー" },
        {
          type: "list",
          ordered: true,
          items: [
            "データベースは毎週日曜日にフルバックアップを，それ以外の日は毎日の増分バックアップを毎日，別のテープメディアに取得する。",
            "バックアップは 1 週間分保存する。",
            "データベースの目標復旧時点（RPO）は 24 時間とする。",
            "バックアップからの目標復旧時間（RTO）は 6 時間とする。",
            "バックアップを保存しているテープメディア（以下，バックアップテープという）は鍵付きのキャビネットに保管する。",
            "バックアップはシステムを停止せずに取得する。",
          ],
        },
        {
          type: "p",
          text: "先日，金曜日に営業部では，アプリケーションの不具合によってデータベースの内部構造の破損（以下，論理破損という）が生じたので，データベースを復旧する必要が生じた。しかし，火曜日のバックアップテープが物理的に破損していたので，データベースをバックアップポリシーどおりには復旧できなかった。",
        },
        {
          type: "p",
          text: "そのため，営業部の情報セキュリティリーダーである B 課長は，論理破損が起き，かつ，バックアップテープが物理的に破損していたとしてもデータベースを復旧できるようにする再発防止策を検討し，効果の高いものを選んだ。",
        },
      ],
      options: [
        {
          id: "a",
          text: "DBMS を IaaS 上に構築したサーバで稼働させ，データベースも IaaS 上に格納する。",
        },
        {
          id: "i",
          text: "データベースのレプリケーションを行って，データベースのコピーを確保する。",
        },
        { id: "u", text: "データベースを格納しているディスクを RAID5 構成にする。" },
        {
          id: "e",
          text: "テープメディアに加え，NAS にもバックアップを 1 週間分保存する。",
        },
        {
          id: "o",
          text: "毎日 1 回システムを停止させ，フルバックアップを取得する。",
        },
      ],
      correctOptionId: "e",
      explanation: {
        correct:
          "テープに加えてNASにも1週間分のバックアップを保存すれば，バックアップ媒体が二重化され，テープが物理破損してもNASから復旧できます。論理破損はバックアップからの復元で対処できます。",
        why: [
          "今回の障害は「論理破損」と「バックアップテープの物理破損」の同時発生です。論理破損には過去の正常なバックアップからの復元が必要で，そのバックアップが別媒体にも残っていれば復旧できます。",
          "異なる種類・場所の媒体に複数世代を保存することは，3-2-1ルールの考え方にも合致し，単一媒体の故障に対する耐性を高めます。",
          "レプリケーションは論理破損もそのまま複製するため，バックアップの代替にはなりません。RAID5はディスクの物理障害には有効ですが，論理破損は防げません。",
        ],
        optionNotes: {
          a: "IaaSへ移してもバックアップ媒体がテープ1種類のままであれば，テープ破損時に復旧できません。",
          i: "レプリケーションは変更を即時にコピーするため，アプリケーション不具合による論理破損もコピー先に伝播します。",
          u: "RAID5はディスク故障に対する冗長性を高めますが，データベース内部の論理破損からの復旧には使えません。",
          e: "正解です。NASへの追加バックアップにより，媒体の単一障害点を解消します。",
          o: "毎日フルバックアップを取得しても保存先がテープだけなら，テープ物理破損時の復旧手段がありません。またシステム停止はRTOにも影響します。",
        },
        english:
          "Adding a second backup destination (NAS) removes the single point of failure on tape. Replication and RAID protect against different failures and do not restore logically corrupted data.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(14),
        url: PAGE_URL,
        year: 2024,
        questionNo: 14,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["バックアップ", "RPO", "RTO", "論理破損", "科目B"],
    },
    {
      id: "official-2024-15",
      part: "B",
      topicIds: ["sec-malware", "ops-incident-response"],
      lessonIds: ["security/threats-and-malware", "ops/incident-response"],
      difficulty: "medium",
      type: "scenario",
      stem: "周知すべきことはどれか。解答群のうち，最も適切なものを選べ。",
      presentation: [
        {
          type: "lead",
          text: "A 社は，飲食店へのコンサルティングを行う従業員 50 名の企業である。A 社の全ての PC では，マルウェア対策ソフト（以下，X ソフトという）が有効にされている。",
        },
        {
          type: "p",
          text: "ある日，総務部の情報セキュリティリーダーである C 課長は，部下の D さんから，次の連絡を受けた。",
        },
        {
          type: "list",
          items: [
            "A 社の PC の Web ブラウザで Web サイトを閲覧していたところ，PC がマルウェアに感染しているとの警告画面（以下，警告画面という）が全画面に表示された。",
            "警告画面が表示されたあと何も PC の操作をせずに直ちに C 課長に連絡をした。",
          ],
        },
        {
          type: "p",
          text: "C 課長は，情報システム部に報告した。情報システム部は D さんの PC を確認し，数時間後，図 1 のとおり報告した。",
        },
        { type: "p", text: "図1 情報システム部からの報告" },
        {
          type: "list",
          ordered: true,
          items: [
            "警告画面には，次が表示されていた。・X ソフトの製品のロゴ・マルウェアを削除するためのツールをインストールする指示・サポートが必要な場合の電話番号とチャットウィンドウ",
            "念のため，X ソフトを使って D さんの PC をスキャンしたが，マルウェアは検出されなかった。また，警告画面の表示は，X ソフトによるものではないことを確認した。",
            "昨今，類似した警告画面の事例の報告が日本国内で増えている。",
          ],
        },
        {
          type: "p",
          text: "A 社では，警告画面が表示された場合の適切な対応について全従業員に周知することにした。",
        },
      ],
      options: [
        {
          id: "a",
          text: "警告画面に，急いで対応する必要があるとの表示がある場合は，直ちに警告画面に表示された指示に従ってツールをインストールすること及びその具体的方法",
        },
        {
          id: "i",
          text: "警告画面に表示された指示には従わずに，直ちに Web ブラウザを終了すること及びその具体的方法",
        },
        {
          id: "u",
          text: "警告画面に表示されたツールと競合しないように，X ソフトをアンインストールし，警告画面に表示された指示に従ってツールをインストールすること及びその具体的方法",
        },
        {
          id: "e",
          text: "警告画面に表示された電話番号に直ちに連絡し，サポートオペレーターの指示に従うこと",
        },
        {
          id: "o",
          text: "警告画面に表示されている，X ソフトの製品のロゴが，製品開発元の Web サイトに掲載されている正規の製品のロゴと同じである場合は，警告画面に表示された指示に従ってツールをインストールすること及びその具体的方法",
        },
      ],
      correctOptionId: "i",
      explanation: {
        correct:
          "正規のマルウェア対策ソフトが検出していないのに全画面の警告が出るのは，偽の警告による詐欺（テクニカルサポート詐欺）の典型です。表示された指示には従わず，ブラウザを直ちに終了します。",
        why: [
          "本物のマルウェア対策ソフトは，警告画面に「ツールをインストールせよ」「電話せよ」と誘導する形で全画面表示することは通常ありません。情報システム部も，警告がXソフトによるものではないと確認しています。",
          "指示に従ってツールをインストールさせると，遠隔操作ツールや情報窃取マルウェアを入れさせられる恐れがあります。電話番号やチャットも攻撃者の窓口です。",
          "ロゴは誰でも画像をコピーできるため，正規ロゴの有無は警告の正当性の判断材料になりません。",
        ],
        optionNotes: {
          a: "「急いで対応」という表示は，利用者を慌てさせて指示に従わせるための常套手段です。インストールしてはいけません。",
          i: "正解です。偽の警告を閉じるため，指示に従わずブラウザを終了します。",
          u: "マルウェア対策ソフトを無効化させるのは攻撃者の狙いそのものです。アンインストールしてはいけません。",
          e: "警告画面の電話番号は攻撃者のサポート窓口であり，連絡すると遠隔操作や追加の詐欺に遭う恐れがあります。",
          o: "ロゴは画像として複製できるため，正規ロゴの表示は警告が本物である根拠になりません。",
        },
        english:
          "A full-screen infection warning that is not generated by the installed antivirus is a tech-support scam. Do not follow its instructions or call the number; close the browser and report it.",
        termIds: [],
      },
      source: {
        kind: "official",
        attribution: attribution(15),
        url: PAGE_URL,
        year: 2024,
        questionNo: 15,
        note: "IPA公開問題（実際の試験は60問）",
      },
      tags: ["偽警告", "テクニカルサポート詐欺", "マルウェア", "科目B"],
    },
  ],
};
