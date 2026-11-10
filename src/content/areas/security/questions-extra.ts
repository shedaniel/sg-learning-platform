import type { Block, Difficulty, OptionId, Question } from "@/lib/content/types";

/**
 * 追加の独自問題（本サイト独自問題）。
 * 正解の選択肢と誤答の選択肢を分けて記述し、`at` の位置に正解を配置して組み立てる。
 * `fixed` を指定した問題は、選択肢の並びと解説を a・i・u・e の順で直接指定する。
 */
interface Spec {
  id: string;
  topics: string[];
  diff: Difficulty;
  part: "A" | "B";
  stem: string;
  pres?: Block[];
  ok?: string;
  ng?: [string, string, string];
  at?: OptionId;
  okNote?: string;
  ngNotes?: [string, string, string];
  fixed?: { opts: [string, string, string, string]; notes: [string, string, string, string]; ans: OptionId };
  correct: string;
  why: string[];
  en: string;
  terms: string[];
  tags: string[];
}

const SLOTS: OptionId[] = ["a", "i", "u", "e"];

function lessonFor(topics: string[]): string[] {
  const t = topics[0];
  if (t === "sec-threats" || t === "sec-malware" || t === "sec-fraud") return ["security/threats-and-malware"];
  if (t.startsWith("sec-attacks")) return ["security/attacks"];
  return ["security/crypto-auth"];
}

function build(s: Spec): Question {
  let options: { id: OptionId; text: string }[];
  let notes: Partial<Record<OptionId, string>> = {};
  let ans: OptionId;
  if (s.fixed) {
    options = SLOTS.map((id, i) => ({ id, text: s.fixed!.opts[i] }));
    SLOTS.forEach((id, i) => {
      notes[id] = s.fixed!.notes[i];
    });
    ans = s.fixed.ans;
  } else {
    ans = s.at!;
    let k = 0;
    options = SLOTS.map((id) => {
      if (id === ans) return { id, text: s.ok! };
      return { id, text: s.ng![k++] };
    });
    k = 0;
    SLOTS.forEach((id) => {
      notes[id] = id === ans ? `正解である。${s.okNote}` : s.ngNotes![k++];
    });
  }
  const q: Question = {
    id: s.id,
    part: s.part,
    topicIds: s.topics,
    lessonIds: lessonFor(s.topics),
    difficulty: s.diff,
    type: s.part === "B" ? "scenario" : "knowledge",
    stem: s.stem,
    options,
    correctOptionId: ans,
    explanation: {
      correct: s.correct,
      why: s.why,
      optionNotes: notes,
      english: s.en,
      termIds: s.terms,
    },
    source: { kind: "original", attribution: "本サイト独自問題" },
    tags: s.tags,
  };
  if (s.pres) q.presentation = s.pres;
  return q;
}

const specs: Spec[] = [
  // ===== sec-threats =====
  {
    id: "q-security-ext-001",
    topics: ["sec-threats"],
    diff: "medium",
    part: "A",
    stem: "脅威と脆弱性の組合せとして、最も適切なものはどれか。",
    ok: "脅威：豪雨による浸水　脆弱性：サーバ室が地下階にあり、止水対策や排水設備がない",
    ng: [
      "脅威：OSのパッチが未適用であること　脆弱性：外部からの不正アクセス",
      "脅威：アクセス権限の棚卸しをしていないこと　脆弱性：従業員による情報の持ち出し",
      "脅威：パスワードが初期値のまま運用されていること　脆弱性：なりすましによる不正ログイン",
    ],
    at: "i",
    okNote: "豪雨は環境的な脅威であり、地下階で止水対策がないことは、その脅威によって被害が拡大する組織側の弱点である。",
    ngNotes: [
      "脅威と脆弱性が逆である。パッチ未適用は脆弱性、不正アクセスは脅威である。",
      "脅威と脆弱性が逆である。棚卸しをしていないことは管理上の弱点（脆弱性）、持ち出しは脅威である。",
      "脅威と脆弱性が逆である。初期パスワードのままの運用は脆弱性、なりすましによる不正ログインは脅威である。",
    ],
    correct: "脅威は損害を引き起こす要因、脆弱性は脅威に悪用される弱点である。豪雨と地下階の止水不備の組合せだけが、この関係に合っている。",
    why: [
      "脅威は組織の外側や環境から来る要因であり、脆弱性は組織側が管理できる弱点である。",
      "他の3つは、弱点と、その弱点を突いて起こる事象とが入れ替わっている。",
    ],
    en: "A threat is a cause of harm; a vulnerability is a weakness the threat can exploit. Flooding is the threat and a basement server room without flood protection is the vulnerability.",
    terms: ["sec-threat", "sec-vulnerability"],
    tags: ["脅威", "脆弱性"],
  },
  {
    id: "q-security-ext-002",
    topics: ["sec-threats"],
    diff: "easy",
    part: "A",
    stem: "環境的脅威に分類されるものはどれか。",
    ok: "落雷や長時間の停電による機器の停止",
    ng: [
      "従業員による宛先間違いのメール誤送信",
      "マルウェアへの感染によるデータの破壊",
      "退職者による機密情報の不正な持ち出し",
    ],
    at: "a",
    okNote: "落雷や停電は、自然現象や設備環境に起因する環境的脅威である。",
    ngNotes: [
      "誤送信は、人の過失によって起こる人的脅威である。",
      "マルウェア感染は、不正プログラムなど技術的な手段による技術的脅威である。",
      "退職者による持ち出しは、人の意図的な行為による人的脅威（内部不正）である。",
    ],
    correct: "環境的脅威は、災害、停電、火災、空調故障など、設備や自然環境に由来する脅威である。",
    why: [
      "脅威は、人的・技術的・環境的に分類して整理できる。",
      "人の過失や意図による脅威は人的脅威、不正プログラムなどは技術的脅威である。",
    ],
    en: "Environmental threats come from the physical environment, such as lightning and power outages. Mistakes and insider theft are human threats, and malware is a technical threat.",
    terms: ["sec-threat"],
    tags: ["脅威", "分類"],
  },
  {
    id: "q-security-ext-003",
    topics: ["sec-threats"],
    diff: "medium",
    part: "A",
    stem: "内部不正への対策として、適切でないものはどれか。",
    ok: "長年勤務している従業員は信頼できるため、特権IDの操作ログの取得と定期的な確認を省略する",
    ng: [
      "退職や異動の際に、アカウントとアクセス権限を速やかに無効化または見直す",
      "職務上必要な範囲に限って、情報へのアクセス権限を付与する",
      "委託先の担当者を含めて、アクセス権限を定期的に棚卸しする",
    ],
    at: "i",
    okNote: "この選択肢は適切でない。内部者は正規の権限を持つため、信頼を理由にログの取得や確認を省くと、不正や過失に気付けない。",
    ngNotes: [
      "適切な対策である。退職者や異動者の権限が残ることは、内部不正の典型的な機会になる。",
      "適切な対策である。最小権限により、不正が可能な範囲と漏えい時の影響を小さくできる。",
      "適切な対策である。委託先の担当者も内部者として扱い、不要な権限を残さない。",
    ],
    correct: "信頼を理由にログ取得や確認を省略するのは、内部不正の機会を残す対応であり、適切でない。",
    why: [
      "内部不正は、信頼されている人物が正規の権限を悪用する点に難しさがある。",
      "ログの取得とレビュー、最小権限、権限の棚卸しを組み合わせて、機会を減らし発見しやすくする。",
    ],
    en: "Skipping privileged-ID logging because an employee is trusted leaves the opportunity for insider fraud open. The other options reduce opportunity.",
    terms: ["sec-insider-threat", "sec-situational-crime-prevention"],
    tags: ["内部不正", "最小権限"],
  },
  {
    id: "q-security-ext-004",
    topics: ["sec-threats"],
    diff: "medium",
    part: "B",
    stem: "M社が行うべき再発防止策として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "M社の情報システム部は、資産台帳に登録された機器について、毎月パッチの適用状況を確認している。ある日、開発部が独自に構築した検証用Webサーバが、資産台帳に登録されないままインターネットに公開され、古いミドルウェアの既知の脆弱性を突かれて侵害された。",
      },
      {
        type: "list",
        items: [
          "資産台帳に登録された機器のパッチ適用率は98%であった。",
          "検証用Webサーバは開発部が管理するクラウドアカウントで作成され、情報システム部は存在を把握していなかった。",
          "侵害されたサーバには、本番データのコピーが置かれていた。",
        ],
      },
    ],
    ok: "ネットワークやクラウドアカウントを定期的に探索して台帳外の資産を発見し、システムの構築や公開の際に申請と台帳登録を必須にする",
    ng: [
      "台帳に登録された機器のパッチ適用を月次から週次に改め、適用率100%を目標とする",
      "検証用サーバの構築を全面的に禁止し、無断で構築した部門を処分する",
      "侵害されたサーバだけを廃止し、他の検証環境の管理は引き続き開発部の判断に任せる",
    ],
    at: "e",
    okNote: "原因は、台帳外の資産がパッチ管理の対象から漏れたことである。資産を発見する仕組みと、構築時の申請・登録の統制が根本的な対策になる。",
    ngNotes: [
      "台帳に登録された機器の適用率を上げても、台帳外のサーバは対象にならず、同じ事故が再発する。",
      "全面禁止は業務上のニーズを満たさず、かえって把握しにくい形での無断利用を招く。処分だけでは管理の穴も塞がらない。",
      "他の検証環境にも同様の台帳外資産が残りうるため、再発を防げない。",
    ],
    correct: "台帳外の資産が管理の対象から漏れたことが原因であり、資産の発見と構築時の登録統制を整えることが最も適切である。",
    why: [
      "脆弱性管理は、資産を把握していることが前提である。把握していない資産にはパッチを適用できない。",
      "禁止だけでは、隠れた利用を増やす（シャドーIT化する）おそれがある。",
    ],
    en: "The root cause is an unregistered asset outside patch management. Discover unmanaged assets and require registration when systems are built or exposed.",
    terms: ["sec-vulnerability", "sec-shadow-it"],
    tags: ["脆弱性管理", "資産管理", "科目B"],
  },
  {
    id: "q-security-ext-005",
    topics: ["sec-threats"],
    diff: "hard",
    part: "B",
    stem: "情報セキュリティ担当者が最初に行う対応として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "営業部のPは来月に退職する予定で、競合他社へ転職するとの噂がある。ログを分析したところ、Pは最近2週間、業務時間外に顧客データベースから大量の顧客情報をダウンロードしていたことが分かった。Pが持ち出しを認めた事実はまだない。",
      },
    ],
    ok: "アクセスログなどの証拠を保全し、人事部門や法務部門と連携して事実関係を確認したうえで、必要に応じてPの権限を制限する",
    ng: [
      "Pを直ちに懲戒解雇し、Pの端末とメールアカウントを初期化して削除する",
      "Pに口頭で注意するにとどめ、退職日までアクセス権限はそのままにして様子を見る",
      "顧客情報を扱う全従業員のアクセス権限を、調査が終わるまで一律に停止する",
    ],
    at: "a",
    okNote: "事実確認の前に証拠を保全し、人事・法務と連携して適切な手続で対応する。必要な範囲で権限を制限すれば、被害の拡大も抑えられる。",
    ngNotes: [
      "事実関係が未確認のまま解雇すると、手続上の問題を生じうる。端末やアカウントの初期化・削除は証拠を失わせる。",
      "ログ上の不審な挙動を放置すると、持ち出しが続いて被害が拡大するおそれがある。口頭注意だけでは事実の確認にもならない。",
      "全従業員の権限を一律に停止すると業務が止まり、影響が過大である。対象を絞った対応が適切である。",
    ],
    correct: "証拠を保全して事実を確認し、人事・法務と連携しつつ必要な範囲で権限を制限することが、最初の対応として適切である。",
    why: [
      "内部不正の疑いでは、証拠の保全と、手続に沿った事実確認が先である。",
      "対応は、疑いの程度と業務への影響に見合った範囲にとどめる。",
    ],
    en: "Preserve evidence, confirm the facts with HR and legal, and restrict access to a proportionate extent. Do not destroy evidence or act on suspicion alone.",
    terms: ["sec-insider-threat"],
    tags: ["内部不正", "初動", "科目B"],
  },

  // ===== sec-malware =====
  {
    id: "q-security-ext-006",
    topics: ["sec-malware"],
    diff: "easy",
    part: "A",
    stem: "ボットネットの説明として、最も適切なものはどれか。",
    ok: "マルウェアに感染して攻撃者の指令に従う多数の端末の集まりであり、DDoS攻撃やスパムメールの送信に悪用される",
    ng: [
      "ファイルを暗号化して使えなくし、復旧と引換えに金銭を要求するマルウェアの総称",
      "利用者の入力内容や閲覧履歴を、気付かれないように収集して外部へ送信するマルウェア",
      "侵入した攻撃者が自らの存在を隠し、再侵入できる状態を維持するために使うツール群",
    ],
    at: "i",
    okNote: "ボットに感染した端末が、C2サーバなどからの指令で一斉に動作し、攻撃の踏み台になる。",
    ngNotes: [
      "ランサムウェアの説明である。",
      "スパイウェアの説明である。",
      "ルートキットの説明である。",
    ],
    correct: "ボットネットは、感染して遠隔操作される端末の集まりであり、DDoS攻撃やスパム送信の基盤に使われる。",
    why: [
      "感染端末の所有者は、自分の端末が攻撃に加担していることに気付かない場合がある。",
      "他の選択肢は、それぞれ別のマルウェアや攻撃ツールの特徴を述べている。",
    ],
    en: "A botnet is a group of infected devices controlled remotely, used for DDoS attacks and spam. The other options describe ransomware, spyware, and rootkits.",
    terms: ["sec-botnet", "sec-ransomware", "sec-spyware", "sec-rootkit"],
    tags: ["マルウェア", "ボットネット"],
  },
  {
    id: "q-security-ext-007",
    topics: ["sec-malware"],
    diff: "medium",
    part: "A",
    stem: "ルートキットの説明として、最も適切なものはどれか。",
    ok: "侵入した攻撃者が、自身のプロセスやファイル、通信を隠蔽し、再侵入できる状態を維持するために使うツール群",
    ng: [
      "正規のソフトウェアを装って配布され、利用者に実行させることで侵入する不正プログラム",
      "宿主となるファイルに寄生し、感染したファイルが実行されたときに増殖する不正プログラム",
      "OSの脆弱性を悪用し、ネットワークを介して自律的に自己増殖する不正プログラム",
    ],
    at: "e",
    okNote: "ルートキットは、侵入の痕跡を隠すことで、検出を困難にして長期の潜伏を可能にする。",
    ngNotes: [
      "トロイの木馬の説明である。ルートキットは侵入後に使われ、利用者に実行させる性質を中心とするものではない。",
      "ウイルスの説明である。",
      "ワームの説明である。",
    ],
    correct: "ルートキットは、侵入後に自らの存在を隠蔽し、攻撃者が再侵入できる状態を維持するためのツール群である。",
    why: [
      "感染や増殖の方法ではなく、侵入後の隠蔽と維持という役割で分類される点が特徴である。",
      "検出が難しいため、ログの外部保管や、OSの外側から行う検査が有効になる場合がある。",
    ],
    en: "A rootkit hides an intruder's processes, files, and communications and helps maintain access. Trojans, viruses, and worms are classified by how they enter or spread.",
    terms: ["sec-rootkit", "sec-trojan", "sec-virus", "sec-worm"],
    tags: ["マルウェア", "ルートキット"],
  },
  {
    id: "q-security-ext-008",
    topics: ["sec-malware"],
    diff: "medium",
    part: "A",
    stem: "パターンファイル（シグネチャ）に基づくマルウェア検知の限界として、最も適切なものはどれか。",
    ok: "パターンファイルに登録されていない未知のマルウェアや、パターンを変化させた亜種は、検知できないことがある",
    ng: [
      "既知のマルウェアであっても検知に数時間を要するため、リアルタイムの検査には使えない",
      "インターネットに接続しない端末では、パターンファイルを更新する手段が一切ないため使用できない",
      "メールの添付ファイルは検査の対象にできないため、メール経由の感染には役立たない",
    ],
    at: "a",
    okNote: "シグネチャ検知は、既知のパターンとの一致で判定する方式のため、未知の検体や難読化された亜種には弱い。",
    ngNotes: [
      "シグネチャ検知は、既知のパターンとの照合なので高速である。遅いことは限界ではない。",
      "閉域の端末でも、管理サーバやメディア経由で更新する運用が可能である。",
      "添付ファイルも検査対象にできる。メールゲートウェイなどで検査する構成も一般的である。",
    ],
    correct: "シグネチャ検知は、登録されていない未知のマルウェアや亜種を検知しにくい。このため、振る舞い検知やEDRと組み合わせる。",
    why: [
      "既知の脅威には高速かつ正確に対応できる一方、パターンの登録が前提となる。",
      "未知の脅威には、振る舞い検知、サンドボックス、EDRなどを併用する。",
    ],
    en: "Signature-based detection matches known patterns, so it can miss unknown malware and variants. Combine it with behavioral detection and EDR.",
    terms: ["sec-malware", "sec-fileless-malware"],
    tags: ["マルウェア", "検知方式"],
  },
  {
    id: "q-security-ext-009",
    topics: ["sec-malware"],
    diff: "medium",
    part: "A",
    stem: "あるマルウェア対策製品を、悪意のあるファイル200個と正常なファイル10,000個で検査した。結果を表に示す。検知率（悪意のあるファイルのうち、悪意があると判定された割合）と誤検知率（正常なファイルのうち、悪意があると判定された割合）の組合せとして、適切なものはどれか。",
    pres: [
      {
        type: "table",
        headers: ["区分", "検査したファイル数", "悪意があると判定された数"],
        rows: [
          ["悪意のあるファイル", "200", "190"],
          ["正常なファイル", "10,000", "50"],
        ],
      },
    ],
    fixed: {
      opts: [
        "検知率95%、誤検知率5%",
        "検知率95%、誤検知率0.5%",
        "検知率99.5%、誤検知率0.5%",
        "検知率0.5%、誤検知率95%",
      ],
      notes: [
        "検知率は正しいが、誤検知率が誤っている。50÷10,000＝0.5%であり、5%ではない。",
        "正解である。検知率は190÷200＝95%、誤検知率は50÷10,000＝0.5%である。",
        "検知率が誤っている。99.5%は、正常なファイルを正しく扱えた割合であり、検知率ではない。",
        "検知率と誤検知率の値が入れ替わっている。",
      ],
      ans: "i",
    },
    correct: "検知率は190÷200＝95%、誤検知率は50÷10,000＝0.5%である。",
    why: [
      "検知率の分母は悪意のあるファイル数、誤検知率の分母は正常なファイル数である。",
      "分母を取り違えると、誤検知率を10倍以上に誤って見積もることになる。",
    ],
    en: "Detection rate = 190/200 = 95%. False-positive rate = 50/10,000 = 0.5%. Each rate uses its own population as the denominator.",
    terms: ["sec-malware"],
    tags: ["マルウェア", "検知率", "計算"],
  },
  {
    id: "q-security-ext-010",
    topics: ["sec-malware"],
    diff: "medium",
    part: "B",
    stem: "同様の被害に備えるためのバックアップの見直しとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "N社の本社では、ファイルサーバがランサムウェアに感染し、共有フォルダ内のファイルがすべて暗号化された。バックアップは毎晩、同じネットワークに常時接続されたNASに保存していたが、NAS上のバックアップも暗号化され、復旧できなかった。",
      },
    ],
    ok: "バックアップの一部を、ネットワークから切り離した媒体や、書き換え・削除ができない設定のストレージにも保存し、復元できることを定期的に試験する",
    ng: [
      "NASへのバックアップを毎晩から1時間ごとに増やし、保存先は従来のままにする",
      "ランサムウェアの被害は復旧できない前提とし、身代金の支払いを事前に承認する手続を整備する",
      "マルウェア対策ソフトのパターンファイルの更新を週次から毎日に改め、バックアップの構成は変更しない",
    ],
    at: "u",
    okNote: "感染した端末から到達できない場所に、変更されないバックアップを持つことで、暗号化の被害から復旧できる。復元試験で、実際に使えることも確認する。",
    ngNotes: [
      "保存先が常時接続のままでは、バックアップも同時に暗号化される。頻度を上げても、同じ被害が起きる。",
      "支払っても復旧できる保証はなく、攻撃者への資金提供にもなる。復旧の手段として前提にすべきでない。",
      "検知の精度を高めても、未知の検体を完全に防げるわけではない。バックアップの構成が変わらないため、再び復旧できなくなるおそれがある。",
    ],
    correct: "感染の影響が及ばないオフラインやイミュータブルなバックアップを持ち、復元試験で有効性を確認することが最も適切である。",
    why: [
      "ランサムウェア対策では、予防だけでなく、被害を受けても復旧できる状態が重要である。",
      "バックアップは、取得するだけでなく、復元できることを確認して初めて有効になる。",
    ],
    en: "Keep at least one backup copy offline or immutable, out of reach of infected systems, and test restores regularly.",
    terms: ["sec-ransomware", "sec-cia-availability"],
    tags: ["ランサムウェア", "バックアップ", "科目B"],
  },
  {
    id: "q-security-ext-011",
    topics: ["sec-malware"],
    diff: "hard",
    part: "B",
    stem: "実施すべき順序として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "O社のセキュリティ担当者は、従業員Qの端末でEDRがマルウェアを検知したという通知を受けた。Qの端末は、共有ファイルサーバにも接続している。次の対応A〜Cを、実施する順に並べる。",
      },
      {
        type: "list",
        items: [
          "A　同じ検体や通信先が、他の端末やサーバに存在しないか、ログとEDRで調査する",
          "B　端末を再構築し、パスワードを変更して、業務に復帰させる",
          "C　当該端末をネットワークから切り離す",
        ],
      },
    ],
    ok: "C → A → B",
    ng: ["A → C → B", "B → C → A", "C → B → A"],
    at: "e",
    okNote: "まず切り離して封じ込め、次に影響範囲を調べ、最後に根絶と復旧を行う。範囲が分からないまま再構築すると、他にも残る感染を見逃す。",
    ngNotes: [
      "調査を先にすると、その間に感染や情報の流出が広がるおそれがある。封じ込めが先である。",
      "原因や範囲の調査より先に再構築すると、証拠が失われ、他の感染端末を見逃す。",
      "切り離したあと、範囲を調べずに再構築して復帰させると、他の端末やサーバの感染が残る。",
    ],
    correct: "封じ込め（C）、影響範囲の調査（A）、根絶と復旧（B）の順に進める。",
    why: [
      "初動では、被害の拡大を止めることが優先される。",
      "復旧は、影響範囲と原因を把握してから行うことで、再感染を避けられる。",
    ],
    en: "Contain first, then investigate scope, then eradicate and recover. Rebuilding before the scope is known risks missing other infected systems.",
    terms: ["sec-malware", "sec-fileless-malware"],
    tags: ["マルウェア", "初動対応", "科目B"],
  },

  // ===== sec-fraud =====
  {
    id: "q-security-ext-012",
    topics: ["sec-fraud"],
    diff: "easy",
    part: "A",
    stem: "不正のトライアングルを構成する3つの要素の組合せとして、適切なものはどれか。",
    ok: "機会、動機、正当化",
    ng: ["脅威、脆弱性、リスク", "機密性、完全性、可用性", "識別、認証、認可"],
    at: "e",
    okNote: "不正は、実行できる機会、実行したい動機、自分の行為を正当化する理由が揃ったときに起こりやすい。",
    ngNotes: [
      "リスクを構成する要素の整理であり、不正が起きる要因の説明ではない。",
      "情報セキュリティの3つの特性である。",
      "アクセス制御の流れを構成する用語である。",
    ],
    correct: "不正のトライアングルは、機会・動機・正当化の3要素で、不正が起こる条件を説明する。",
    why: [
      "3要素のうち、組織が最も直接に減らしやすいのは、職務分離やログ監視で減らせる機会である。",
      "他の選択肢は、別の概念の3要素である。",
    ],
    en: "The fraud triangle consists of opportunity, motive, and rationalization.",
    terms: ["sec-fraud-triangle"],
    tags: ["不正のトライアングル"],
  },
  {
    id: "q-security-ext-013",
    topics: ["sec-fraud"],
    diff: "medium",
    part: "A",
    stem: "不正のトライアングルの「正当化」を抑制する対策として、最も適切なものはどれか。",
    ok: "倫理規程や行動規範を周知して研修を行い、通報窓口を整備して、小さな規則違反にも一貫した対応をとる",
    ng: [
      "入金処理と承認を別の担当者に分け、一人で業務が完結しないようにする",
      "重要データへのアクセスログを取得し、定期的に点検して不正を発見しやすくする",
      "経済的に困っている従業員がいないかを、定期的な面談で把握する",
    ],
    at: "i",
    okNote: "「みんなやっている」「会社は気にしていない」といった考えを許さない風土をつくることで、不正を自分に許す理由を減らせる。",
    ngNotes: [
      "職務分離は、不正を実行できる機会を減らす対策である。",
      "ログの取得と点検は、機会を減らし、発見しやすくする対策である。",
      "困窮の把握は、動機に対応する施策である。",
    ],
    correct: "正当化は、行為を自分に許す理由であり、規範の周知、教育、通報窓口、一貫した対応で抑制する。",
    why: [
      "機会は仕組みで、動機は処遇や環境の改善で、正当化は組織の規範と風土で対応する。",
      "どの要素に効く対策かを見分けることが、設問の鍵になる。",
    ],
    en: "Rationalization is reduced through ethics rules, training, reporting channels, and consistent enforcement. Segregation of duties and logging target opportunity.",
    terms: ["sec-fraud-triangle"],
    tags: ["不正のトライアングル", "正当化"],
  },
  {
    id: "q-security-ext-014",
    topics: ["sec-fraud"],
    diff: "medium",
    part: "A",
    stem: "ハクティビストの説明として、最も適切なものはどれか。",
    ok: "政治的・社会的な主張を目的として、Webサイトの改ざんやDDoS攻撃などを行う攻撃者",
    ng: [
      "金銭の獲得を目的として、ランサムウェアや情報窃取を組織的に行う犯罪グループ",
      "国家の支援を受け、長期にわたって特定の組織から機密情報を窃取する攻撃グループ",
      "正規の権限を持ち、その立場を悪用して不正を働く自組織の従業員",
    ],
    at: "a",
    okNote: "ハクティビストは、主義主張を訴えたり、特定の組織に抗議したりするために攻撃する。",
    ngNotes: [
      "金銭目的の犯罪グループの説明である。",
      "国家の支援を受けた攻撃グループ（APT）の説明である。",
      "内部不正を行う内部者の説明である。",
    ],
    correct: "ハクティビストは、政治的・社会的な主張を目的として攻撃を行う攻撃者である。",
    why: [
      "攻撃者の目的が異なれば、狙う情報や手口も異なる。",
      "金銭目的、国家支援、内部者、主義主張という目的の違いで区別する。",
    ],
    en: "Hacktivists attack to promote political or social causes, for example through defacement or DDoS. Others are driven by money, state objectives, or insider access.",
    terms: ["sec-threat", "sec-insider-threat"],
    tags: ["攻撃者", "動機"],
  },
  {
    id: "q-security-ext-015",
    topics: ["sec-fraud"],
    diff: "medium",
    part: "A",
    stem: "ダークウェブの説明として、最も適切なものはどれか。",
    ok: "一般的な検索エンジンでは見つからず、通信を匿名化する専用のソフトウェアなどを使ってアクセスする領域であり、盗まれた認証情報や個人情報が取引されることがある",
    ng: [
      "会員登録やログインが必要で検索エンジンには載らないが、正規のサービスとして提供されているWebサイトの領域",
      "インターネットから物理的に切り離され、組織の内部だけで構成されたネットワーク",
      "ISPや政府機関が管理する、違法なWebサイトを遮断するための接続禁止リスト",
    ],
    at: "i",
    okNote: "匿名性を高める仕組みが使われるため、盗まれた認証情報などが売買される場になる場合がある。",
    ngNotes: [
      "ログインが必要な会員制サービスなどの説明であり、匿名化を前提とするダークウェブとは異なる。",
      "閉域網やエアギャップ環境の説明であり、ダークウェブではない。",
      "ブラックリスト型のフィルタリングの説明である。",
    ],
    correct: "ダークウェブは、匿名化技術を使ってアクセスする領域であり、盗まれた情報の取引に使われることがある。",
    why: [
      "自社の認証情報が売買されていないかを調べる脅威インテリジェンスの対象になる。",
      "漏えいが見つかった場合は、パスワードの変更や不正ログインの確認が必要になる。",
    ],
    en: "The dark web is reachable only via anonymizing tools and is not indexed by ordinary search engines. Stolen credentials and personal data are sometimes traded there.",
    terms: ["sec-threat"],
    tags: ["ダークウェブ", "攻撃者"],
  },
  {
    id: "q-security-ext-016",
    topics: ["sec-fraud"],
    diff: "medium",
    part: "B",
    stem: "状況的犯罪予防の考え方に沿った対策として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "P社の開発部では、ソースコード管理サーバで、すべての開発者が全リポジトリの読み取りとダウンロードを行え、操作ログも取得していない。過去に、退職した開発者が在職中にソースコードを複製して持ち出していたことが、後から判明した。",
      },
    ],
    ok: "リポジトリの権限を職務上必要な範囲に絞り、大量のダウンロードを制限・検知して、操作が記録され発見されやすい環境にする",
    ng: [
      "退職者に秘密保持の誓約書への署名を再度求めるだけで、システム側の設定は変更しない",
      "開発者全員の給与水準を引き上げて、不正を働く動機をなくす",
      "情報漏えいの事例を紹介する講義を年1回行うだけで、権限や記録の仕組みは変えない",
    ],
    at: "e",
    okNote: "状況的犯罪予防は、人の動機に頼らず、不正を実行しにくく、発見されやすく、得にくい状況をつくる考え方である。権限の絞込みと検知・記録がこれに当たる。",
    ngNotes: [
      "誓約書だけでは、実行できる環境と、発見されない状況が変わらない。",
      "動機への働きかけであり、状況を変える対策ではない。給与を上げても、機会は残る。",
      "教育は有益だが、それだけでは機会が残り、発見もされにくいままである。",
    ],
    correct: "権限の最小化と、ダウンロードの制限・記録によって、不正が実行しにくく発見されやすい状況をつくることが最も適切である。",
    why: [
      "状況的犯罪予防は、人の性格や動機ではなく、環境を設計して不正の機会を減らす。",
      "技術的な制限と記録に、規程や教育を組み合わせると、効果が高まる。",
    ],
    en: "Situational crime prevention changes the environment: limit privileges, restrict and monitor bulk downloads, and make actions traceable.",
    terms: ["sec-situational-crime-prevention", "sec-insider-threat"],
    tags: ["状況的犯罪予防", "内部不正", "科目B"],
  },
  {
    id: "q-security-ext-017",
    topics: ["sec-fraud"],
    diff: "medium",
    part: "B",
    stem: "Q社が最初に行う対応として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "Q社は、外部の脅威インテリジェンス事業者から「ダークウェブ上で、Q社の従業員のメールアドレスとパスワードの組が売買されている」との通知を受けた。通知には、該当する30名分のアカウントの一覧が含まれている。",
      },
    ],
    ok: "対象アカウントのパスワードを失効・変更させ、ログから不正ログインの有無を調査し、多要素認証の適用と、他サービスでのパスワードの使い回しの有無を確認する",
    ng: [
      "通知の真偽を確かめるため、情報管理者がダークウェブ上の売買サイトに接触し、該当するデータを購入する",
      "ダークウェブ上の情報が自社のシステムから漏えいしたとは限らないため、対応は不要とする",
      "全従業員に注意喚起のメールを送るにとどめ、対象アカウントの設定は変更しない",
    ],
    at: "i",
    okNote: "認証情報が流通している以上、悪用される前に無効化し、不正ログインの有無を確認し、再発に備えて多要素認証を導入するのが適切である。",
    ngNotes: [
      "犯罪の取引に加わることになり、法的・倫理的な問題がある。認証情報の購入は対応として適切でない。",
      "漏えい元が自社でなくても、使い回しなどによって自社のアカウントが悪用されうる。対応は必要である。",
      "注意喚起だけでは、すでに流出した認証情報が使われる状態が変わらない。",
    ],
    correct: "対象アカウントを無効化して不正ログインを調べ、多要素認証と使い回しの確認を進めることが最も適切である。",
    why: [
      "流出した認証情報は、パスワードリスト攻撃などに使われる前に、無効化する必要がある。",
      "漏えい元が不明でも、悪用の可能性がある以上、被害の確認と予防を並行して行う。",
    ],
    en: "Invalidate the exposed credentials, check logs for unauthorized logins, enforce MFA, and check for password reuse. Never buy the data.",
    terms: ["sec-password-list", "sec-mfa"],
    tags: ["ダークウェブ", "認証情報", "科目B"],
  },

  // ===== sec-attacks-web =====
  {
    id: "q-security-ext-018",
    topics: ["sec-attacks-web"],
    diff: "medium",
    part: "A",
    stem: "クリックジャッキングの説明と対策の組合せとして、最も適切なものはどれか。",
    ok: "透明にした正規サイトのページを罠のページ上に重ね、利用者が気付かないまま正規サイト上のボタンなどを操作させる攻撃であり、他サイトのフレーム内に表示されないよう、X-Frame-OptionsヘッダやCSPのframe-ancestorsで制限する",
    ng: [
      "利用者のブラウザ上で攻撃者のスクリプトを実行させる攻撃であり、入力値をHTMLへ出力する際にエスケープする",
      "入力値をSQL文に連結して不正な命令を実行させる攻撃であり、プレースホルダを使用する",
      "ログイン中の利用者に、攻撃者が用意したリクエストを送信させる攻撃であり、CSRFトークンを検証する",
    ],
    at: "a",
    okNote: "クリックジャッキングは、利用者自身の操作を悪用する。正規ページを他のページのフレーム内に表示させない設定が有効である。",
    ngNotes: [
      "クロスサイトスクリプティングの説明と対策である。",
      "SQLインジェクションの説明と対策である。",
      "CSRFの説明と対策である。CSRFトークンは、フレームで重ねて表示された正規ページ上での操作を防げない。",
    ],
    correct: "クリックジャッキングは、透明化したページを重ねて誤操作させる攻撃であり、フレーム表示の制限が対策になる。",
    why: [
      "利用者は正規サイトのボタンを自分でクリックしているため、CSRFトークンでは防げない。",
      "対策は、ブラウザ側の機能を使って、自サイトのページがフレーム内に埋め込まれないよう指示することである。",
    ],
    en: "Clickjacking overlays an invisible legitimate page under a decoy to trick users into clicking. Prevent framing with X-Frame-Options or CSP frame-ancestors.",
    terms: ["sec-xss", "sec-csrf", "sec-sql-injection"],
    tags: ["クリックジャッキング", "Web攻撃"],
  },
  {
    id: "q-security-ext-019",
    topics: ["sec-attacks-web"],
    diff: "medium",
    part: "A",
    stem: "バッファオーバーフローを悪用した攻撃への対策として、最も適切なものはどれか。",
    ok: "入力データの長さを確認し、確保した領域を超えて書き込まない処理にする（境界の検査がある関数や言語の機能を使う）",
    ng: [
      "入力された特殊文字を、HTMLへ出力する際にエスケープする",
      "SQL文をプレースホルダで組み立て、値とSQL文の構造を分離する",
      "リクエストごとに推測困難なトークンを発行し、サーバ側で検証する",
    ],
    at: "u",
    okNote: "バッファオーバーフローは、確保した領域を超えるデータが書き込まれることで起こる。長さの検査と安全な関数の使用が対策になる。",
    ngNotes: [
      "XSSへの対策である。メモリ領域の超過書き込みは防げない。",
      "SQLインジェクションへの対策である。",
      "CSRFへの対策である。",
    ],
    correct: "バッファオーバーフローへの対策は、入力長の検査と、境界を検査する関数や言語の使用である。",
    why: [
      "確保した領域を超えて書き込まれると、隣接する領域が書き換えられ、任意のコードが実行される場合がある。",
      "ほかの選択肢は、それぞれ別の脆弱性に対応する対策である。",
    ],
    en: "Buffer overflows are prevented by validating input length and using bounds-checked functions. Escaping, placeholders, and CSRF tokens address other flaws.",
    terms: ["sec-buffer-overflow", "sec-xss", "sec-sql-injection", "sec-csrf"],
    tags: ["バッファオーバーフロー", "Web攻撃"],
  },
  {
    id: "q-security-ext-020",
    topics: ["sec-attacks-web"],
    diff: "medium",
    part: "A",
    stem: "Webアプリケーションの脆弱性と対策の組合せのうち、適切でないものはどれか。",
    ok: "ディレクトリトラバーサル ― CookieにHttpOnly属性を付与する",
    ng: [
      "SQLインジェクション ― プレースホルダを使用する",
      "クロスサイトスクリプティング ― HTMLへの出力時にエスケープ処理を行う",
      "CSRF ― 重要な操作の実行時に、推測困難なトークンを検証する",
    ],
    at: "e",
    okNote: "この組合せは適切でない。HttpOnly属性は、スクリプトからCookieを読み取れなくするものであり、ファイルパスの不正指定を防げない。対策は、パスの正規化と、許可されたディレクトリ配下かどうかの検証である。",
    ngNotes: [
      "適切な組合せである。プレースホルダにより、SQL文の構造と値が分離される。",
      "適切な組合せである。出力時のエスケープで、スクリプトがHTMLとして解釈されるのを防ぐ。",
      "適切な組合せである。トークンの検証で、第三者が作成したリクエストを拒否できる。",
    ],
    correct: "ディレクトリトラバーサルにHttpOnly属性は対応しない。対策は、パスの正規化と許可範囲の検証である。",
    why: [
      "脆弱性ごとに、原因に対応した対策を選ぶ必要がある。",
      "HttpOnly属性は、XSSなどによるCookieの窃取の被害を抑える補助的な対策である。",
    ],
    en: "HttpOnly does not stop directory traversal. Normalize paths and verify they stay within an allowed directory.",
    terms: ["sec-directory-traversal", "sec-sql-injection", "sec-xss", "sec-csrf"],
    tags: ["Web攻撃", "対策の対応"],
  },
  {
    id: "q-security-ext-021",
    topics: ["sec-attacks-web"],
    diff: "medium",
    part: "B",
    stem: "この事象の原因と、被害を抑える対策の組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "R社の通販サイトでは、レビュー投稿欄に入力された文字列が、加工されないままレビュー一覧ページのHTMLに出力されている。ある投稿者が<script>タグを含むレビューを投稿したところ、そのページを閲覧した他の会員のブラウザでスクリプトが実行され、会員のセッション用Cookieが外部のサーバに送信された。",
      },
    ],
    ok: "出力時にHTMLのエスケープをしていないことが原因である。出力時のエスケープを徹底し、セッション用CookieにHttpOnly属性を付与する",
    ng: [
      "SQL文を文字列連結で組み立てていることが原因である。プレースホルダを使用し、SQL文の構造と値を分離する",
      "リクエストの送信元を確認していないことが原因である。CSRFトークンを導入し、更新リクエストごとに検証する",
      "通信がHTTPで暗号化されていないことが原因である。HTTPSにすれば、スクリプトの実行も防げる",
    ],
    at: "i",
    okNote: "格納されたスクリプトが他の会員のブラウザで実行されており、典型的なXSSである。エスケープで根本を断ち、HttpOnly属性でCookie窃取の被害を抑える。",
    ngNotes: [
      "SQLインジェクションの原因と対策であり、この事象とは関係がない。",
      "CSRFの原因と対策である。この事象は、スクリプトが閲覧者のブラウザで実行されたものである。",
      "HTTPSは通信の盗聴や改ざんを防ぐが、サイト上で出力されたスクリプトの実行は防げない。",
    ],
    correct: "スクリプトが閲覧者のブラウザで実行されるXSSであり、出力時のエスケープとHttpOnly属性が適切な対策である。",
    why: [
      "XSSの根本原因は、入力値を出力するときに、HTMLとして解釈されない形に変換していないことである。",
      "HttpOnly属性は、スクリプトからのCookieの読取りを防ぐ。被害を抑える補助策になる。",
    ],
    en: "This is stored XSS: output was not escaped. Escape on output and set HttpOnly on session cookies to limit cookie theft.",
    terms: ["sec-xss", "sec-session-hijacking"],
    tags: ["XSS", "科目B"],
  },
  {
    id: "q-security-ext-022",
    topics: ["sec-attacks-web"],
    diff: "medium",
    part: "B",
    stem: "診断結果①〜③に対応する対策の組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "S社は、自社の会員向けWebサービスの脆弱性診断を受け、次の3項目を指摘された。",
      },
      {
        type: "table",
        headers: ["項目", "観察された状況"],
        rows: [
          ["①", "検索画面で入力した文字列が、そのままHTMLに出力されている。"],
          ["②", "会員情報の変更リクエストに、本人が操作したことを確認する仕組みがなく、外部のページからでも実行できる。"],
          ["③", "商品検索の条件が、文字列としてSQL文に連結されている。"],
        ],
      },
    ],
    fixed: {
      opts: [
        "①プレースホルダ　②エスケープ処理　③CSRFトークン",
        "①CSRFトークン　②プレースホルダ　③エスケープ処理",
        "①エスケープ処理　②CSRFトークン　③プレースホルダ",
        "①エスケープ処理　②プレースホルダ　③CSRFトークン",
      ],
      notes: [
        "対応が全て誤っている。①はXSS、②はCSRF、③はSQLインジェクションに当たる。",
        "対応が全て誤っている。①にCSRFトークン、②にプレースホルダ、③にエスケープ処理を充てても、原因に対応しない。",
        "正解である。①はXSSで出力時のエスケープ処理、②はCSRFでトークンの検証、③はSQLインジェクションでプレースホルダが対策になる。",
        "①は正しいが、②と③が入れ替わっている。②はCSRFなのでトークン、③はSQLインジェクションなのでプレースホルダを用いる。",
      ],
      ans: "u",
    },
    correct: "①はXSSで出力時のエスケープ処理、②はCSRFでトークンの検証、③はSQLインジェクションでプレースホルダを使う。",
    why: [
      "観察された状況から、脆弱性の種類を判断して対策を選ぶ。",
      "入力が出力される、本人の意思が確認されない、SQL文が連結される、という特徴が手がかりになる。",
    ],
    en: "(1) is XSS: escape output. (2) is CSRF: validate tokens. (3) is SQL injection: use placeholders.",
    terms: ["sec-xss", "sec-csrf", "sec-sql-injection"],
    tags: ["Web攻撃", "脆弱性診断", "科目B"],
  },

  // ===== sec-attacks-auth =====
  {
    id: "q-security-ext-023",
    topics: ["sec-attacks-auth"],
    diff: "medium",
    part: "A",
    stem: "辞書攻撃の説明として、最も適切なものはどれか。",
    ok: "利用者がよく使う単語や、よくあるパスワードを一覧にして、1つずつ試してログインを試みる攻撃",
    ng: [
      "他のサービスから漏えいしたIDとパスワードの組を、別のサービスにそのまま試す攻撃",
      "文字の組合せを、可能な限りすべて試してログインを試みる攻撃",
      "正規の通信を盗聴して取得し、あとから再送してなりすます攻撃",
    ],
    at: "i",
    okNote: "辞書攻撃は、よく使われる語やパスワードの一覧を使うことで、すべての組合せを試す総当たりよりも効率よく推測する。",
    ngNotes: [
      "パスワードリスト攻撃の説明である。",
      "総当たり攻撃（ブルートフォース攻撃）の説明である。",
      "リプレイ攻撃の説明である。",
    ],
    correct: "辞書攻撃は、よく使われる単語やパスワードの一覧を順に試す攻撃である。",
    why: [
      "利用者が推測しやすいパスワードを設定していると、辞書攻撃で破られやすくなる。",
      "総当たり攻撃は文字の全組合せ、パスワードリスト攻撃は漏えいした組合せを使う点で区別する。",
    ],
    en: "A dictionary attack tries common words and frequent passwords from a list, unlike brute force, which tries all combinations.",
    terms: ["sec-brute-force", "sec-password-list"],
    tags: ["辞書攻撃", "認証"],
  },
  {
    id: "q-security-ext-024",
    topics: ["sec-attacks-auth"],
    diff: "medium",
    part: "A",
    stem: "総当たり攻撃（ブルートフォース攻撃）への対策として、最も適切なものはどれか。",
    ok: "一定回数連続して失敗したときに一時的にロックするか、応答に遅延を入れ、多要素認証を組み合わせる",
    ng: [
      "ログインに成功したときに、セッションIDを再発行する",
      "入力された値を出力するときに、HTMLのエスケープ処理を行う",
      "ログイン画面のURLを推測されにくい文字列にして、非公開にする",
    ],
    at: "e",
    okNote: "試行回数を制限すれば、短時間に多数の推測をする攻撃が成立しにくい。多要素認証を併用すれば、パスワードが破られても侵入されにくい。",
    ngNotes: [
      "セッション固定化攻撃への対策であり、ログインの総当たりを抑えるものではない。",
      "XSSへの対策であり、認証の推測に対しては効果がない。",
      "URLを隠すだけでは、URLが知られたときに防げない。根本的な対策にならない。",
    ],
    correct: "試行回数の制限と多要素認証が、総当たり攻撃への基本的な対策である。",
    why: [
      "総当たり攻撃は、短時間に大量の試行をすることで成立する。",
      "ロックする場合は、攻撃者による正規利用者の締め出しを避けるため、一時的なロックや遅延を用いる。",
    ],
    en: "Limit login attempts with temporary lockouts or delays, and add MFA. Hiding the login URL is obscurity, not a real defense.",
    terms: ["sec-brute-force", "sec-mfa"],
    tags: ["総当たり攻撃", "認証"],
  },
  {
    id: "q-security-ext-025",
    topics: ["sec-attacks-auth"],
    diff: "medium",
    part: "A",
    stem: "リプレイ攻撃への対策として、最も適切なものはどれか。",
    ok: "認証のたびに変わるワンタイムな値（チャレンジやnonce）やタイムスタンプを認証データに組み込み、一度使われた通信を受け付けない",
    ng: [
      "パスワードの文字数を増やして、総当たりに要する時間を長くする",
      "毎回同じ内容の認証データを、一定回数まで受け付けるようにする",
      "ログインに連続して失敗したアカウントを、一時的にロックする",
    ],
    at: "a",
    okNote: "盗聴した通信を再送しても、有効でない値になれば、なりすましは成立しない。",
    ngNotes: [
      "長いパスワードでも、盗聴した認証データをそのまま再送すれば認証を通る。リプレイ攻撃には効果がない。",
      "同じ内容を受け付けると、再送された通信も受け付けてしまう。",
      "ロックは推測を繰り返す攻撃への対策であり、1回の再送には効果がない。",
    ],
    correct: "リプレイ攻撃は、通信ごとに変わる値を使い、一度使った通信を無効にして防ぐ。",
    why: [
      "リプレイ攻撃は、パスワードを知らなくても、盗聴した認証データの再送だけで成立する。",
      "ワンタイムパスワードやチャレンジレスポンス方式は、この性質を利用した対策である。",
    ],
    en: "Replay attacks resend captured authentication data. Defend with one-time values such as nonces or challenge-response, and with timestamps.",
    terms: ["sec-mfa"],
    tags: ["リプレイ攻撃", "認証"],
  },
  {
    id: "q-security-ext-026",
    topics: ["sec-attacks-auth"],
    diff: "hard",
    part: "A",
    stem: "利用者のパスワードを保存する方式として、データベースが漏えいした場合の被害を最も小さくできるものはどれか。",
    ok: "利用者ごとに異なるソルトを付加し、計算コストの高いハッシュ方式（bcryptなど）で処理して、ハッシュ値だけを保存する",
    ng: [
      "パスワードを共通鍵で暗号化して保存し、その鍵を同じデータベースに置く",
      "パスワードにシステム共通の固定文字列を付加し、高速なハッシュ関数で1回だけ処理して保存する",
      "パスワードを平文のまま保存し、データベースへのアクセス制御を強化する",
    ],
    at: "u",
    okNote: "ソルトにより同じパスワードでもハッシュ値が異なり、事前計算表を使った解析が難しくなる。計算コストが高いため、総当たりにも時間がかかる。",
    ngNotes: [
      "鍵も同じデータベースにあると、漏えい時に鍵と一緒に流出して復号される。",
      "共通の固定文字列では、同じパスワードが同じハッシュ値になり、一括した解析に弱い。高速なハッシュは総当たりも速くなる。",
      "平文の保存は、漏えいした時点でそのまま悪用される。アクセス制御だけでは被害を抑えられない。",
    ],
    correct: "利用者ごとのソルトと、計算コストの高いハッシュ方式でハッシュ値だけを保存すると、漏えい時の被害を最も小さくできる。",
    why: [
      "パスワードは、復号できる形で保存せず、一方向のハッシュ値で保存する。",
      "ソルトとストレッチングにより、事前計算や総当たりによる解析の効率を下げられる。",
    ],
    en: "Store per-user salted hashes computed with a slow hash function such as bcrypt. This resists precomputed tables and bulk cracking after a database leak.",
    terms: ["sec-hash", "sec-brute-force"],
    tags: ["パスワード保存", "ハッシュ"],
  },
  {
    id: "q-security-ext-027",
    topics: ["sec-attacks-auth"],
    diff: "medium",
    part: "B",
    stem: "対策として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "S社の会員向けWebサイトで、深夜に特定の1つのアカウントに対して、同一のIPアドレスから1分間に数百回のログイン失敗が記録された。サイトには現在、ログイン失敗の回数の制限がない。",
      },
    ],
    ok: "一定回数連続して失敗したら、一定時間のロックまたは遅延を与え、管理者や本人に通知し、多要素認証の提供も進める",
    ng: [
      "失敗が一定回数に達したアカウントを、利用者本人が申請するまで無期限でロックする",
      "ログイン失敗時に「そのIDは存在しません」「パスワードが違います」と区別して表示し、原因を分かりやすくする",
      "パスワードの最大文字数を8文字までに制限して、入力の誤りを減らす",
    ],
    at: "e",
    okNote: "試行回数の制限と通知で攻撃を抑え、多要素認証でパスワードが破られても侵入を防ぐ。一時的なロックなら、正規の利用者への影響も小さい。",
    ngNotes: [
      "無期限のロックは、攻撃者がわざと失敗を繰り返して正規の利用者を締め出す手段に悪用される。",
      "IDの存在を教えると、攻撃者が有効なIDを絞り込める。失敗の理由は区別せず、同じ表示にする。",
      "最大文字数を短くすると、パスワードが推測されやすくなり、総当たりに対して弱くなる。",
    ],
    correct: "一時的なロックや遅延、通知、多要素認証を組み合わせることが、総当たり攻撃への対策として最も適切である。",
    why: [
      "短時間に大量の失敗が続くログは、総当たり攻撃の兆候である。",
      "ロックの設計では、攻撃者による締め出し（可用性の低下）も考慮する。",
    ],
    en: "Use temporary lockout or throttling with alerts, and offer MFA. Permanent lockout enables denial of service against legitimate users.",
    terms: ["sec-brute-force", "sec-mfa"],
    tags: ["総当たり攻撃", "アカウントロック", "科目B"],
  },
  {
    id: "q-security-ext-028",
    topics: ["sec-attacks-auth"],
    diff: "hard",
    part: "B",
    stem: "原因と対策の組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "T社のWebサービスで、攻撃者が自分で取得したセッションIDを含むURLを、標的の会員にメールで送った。会員がそのURLからログインしたあと、攻撃者が同じセッションIDでアクセスすると、会員としてログインした状態になった。このサービスは、ログイン前に発行したセッションIDを、ログイン後もそのまま使い続けていた。",
      },
    ],
    ok: "ログイン成功時にセッションIDを新しく発行し直していないことが原因であり、ログイン成功時に再発行して古いIDを無効にする",
    ng: [
      "パスワードの桁数が少ないことが原因であり、パスワードの最小桁数を引き上げる",
      "セッションの有効期間が短すぎることが原因であり、有効期間を24時間から48時間に延長する",
      "通信がHTTPSでないことが唯一の原因であり、HTTPSに切り替えれば、セッションIDの再発行は不要である",
    ],
    at: "a",
    okNote: "これはセッション固定化攻撃である。ログイン前に攻撃者が知っているIDを、ログイン後に変更しないことが原因なので、ログイン時の再発行が根本的な対策になる。",
    ngNotes: [
      "パスワードを破っていないため、桁数は関係しない。",
      "有効期間を延ばすと、攻撃者が成りすませる期間が長くなり、むしろ悪化する。",
      "HTTPSは盗聴を防ぐが、攻撃者が用意したIDを会員に使わせる攻撃は防げない。再発行は引き続き必要である。",
    ],
    correct: "セッション固定化攻撃であり、ログイン成功時にセッションIDを再発行することが対策である。",
    why: [
      "セッションIDが、ログインの前後で変わらないと、事前に知っているIDで成りすませる。",
      "セッションIDはCookieで管理し、URLに含めない設計にすることも有効である。",
    ],
    en: "This is session fixation. Issue a new session ID upon successful login and invalidate the old one.",
    terms: ["sec-session-hijacking"],
    tags: ["セッション固定化", "セッション管理", "科目B"],
  },

  // ===== sec-attacks-network =====
  {
    id: "q-security-ext-029",
    topics: ["sec-attacks-network"],
    diff: "easy",
    part: "A",
    stem: "DDoS攻撃の説明として、最も適切なものはどれか。",
    ok: "多数の端末から標的に大量のリクエストやパケットを同時に送り、サービスを利用できない状態にする",
    ng: [
      "1台の端末から、標的に大量のパケットを送ってサービスを停止させる",
      "通信経路上に割り込み、通信内容を盗聴したり改ざんしたりする",
      "DNSサーバに偽の応答を登録し、利用者を偽のサイトへ誘導する",
    ],
    at: "a",
    okNote: "DDoS攻撃は、分散した多数の送信元から攻撃するため、送信元のIPアドレスを遮断するだけでは防ぎにくい。",
    ngNotes: [
      "1台からの攻撃はDoS攻撃であり、分散して行うDDoS攻撃とは区別される。",
      "中間者攻撃の説明である。",
      "DNSキャッシュポイズニングの説明である。",
    ],
    correct: "DDoS攻撃は、多数の端末から同時に攻撃して、サービスを利用できなくする。",
    why: [
      "多数の端末は、ボットネットに組み込まれた感染端末であることが多い。",
      "侵害されるのは、主に可用性である。",
    ],
    en: "A DDoS attack uses many distributed sources to overwhelm a target and break availability. DoS uses a single source.",
    terms: ["sec-dos-ddos", "sec-botnet"],
    tags: ["DDoS", "ネットワーク攻撃"],
  },
  {
    id: "q-security-ext-030",
    topics: ["sec-attacks-network"],
    diff: "medium",
    part: "A",
    stem: "中間者攻撃（MITM）による通信の盗聴や改ざんを防ぐ対策として、最も適切なものはどれか。",
    ok: "サーバ証明書を検証するTLS（HTTPS）で通信し、証明書の警告が表示された場合は接続しない",
    ng: [
      "パスワードの文字数を長くして、ログインを総当たりされにくくする",
      "ブラウザの警告表示を無効にして、接続が中断されないようにする",
      "Webサーバへの同時接続数を制限し、大量の接続を拒否する",
    ],
    at: "u",
    okNote: "サーバ証明書を検証すれば、通信相手が正規のサーバであることを確認でき、暗号化により盗聴や改ざんも防げる。警告は、偽のサーバや経路上の改ざんの兆候である。",
    ngNotes: [
      "総当たり攻撃への対策であり、通信の盗聴や改ざんは防げない。",
      "警告を無効にすると、偽のサーバに接続しても気付けず、攻撃が成立しやすくなる。",
      "DoS攻撃への対策であり、通信経路上の盗聴や改ざんには効果がない。",
    ],
    correct: "証明書を検証するTLSの通信と、警告を無視しない運用が、中間者攻撃への基本的な対策である。",
    why: [
      "中間者攻撃は、通信の途中に割り込み、利用者と正規サーバの間に入り込む。",
      "証明書の検証によって、通信相手の正当性を確認できる。",
    ],
    en: "Use TLS with proper certificate validation and never ignore certificate warnings. This authenticates the server and encrypts traffic.",
    terms: ["sec-mitm", "sec-pki"],
    tags: ["中間者攻撃", "TLS"],
  },
  {
    id: "q-security-ext-031",
    topics: ["sec-attacks-network"],
    diff: "medium",
    part: "A",
    stem: "標的型攻撃への対策のうち、侵入後の被害を抑える「出口対策」に該当するものはどれか。",
    ok: "マルウェアが攻撃者のC2サーバへ行う外部への通信を、検知・遮断する",
    ng: [
      "不審なメールの添付ファイルを開かないよう、従業員に訓練を行う",
      "メールゲートウェイで添付ファイルを検査し、不審なメールを隔離する",
      "OSやアプリケーションにパッチを適用し、既知の脆弱性を塞ぐ",
    ],
    at: "i",
    okNote: "出口対策は、侵入された後に、内部から外部への通信を監視・遮断して、情報の持ち出しや遠隔操作を防ぐ対策である。",
    ngNotes: [
      "入口対策である。侵入を防ぐ人的な対策に当たる。",
      "入口対策である。マルウェアの侵入経路を塞ぐ対策に当たる。",
      "入口対策である。侵入に使われる脆弱性を減らす対策に当たる。",
    ],
    correct: "C2サーバとの外部通信の検知・遮断が、侵入後の被害を抑える出口対策である。",
    why: [
      "入口対策だけでは、すべての侵入を防ぎきれない。",
      "出口対策によって、侵入された場合でも、情報の持ち出しや遠隔操作を防げる。",
    ],
    en: "Egress controls, such as detecting and blocking C2 communications, limit damage after an intrusion. Training, mail filtering, and patching are entry controls.",
    terms: ["sec-botnet", "sec-defense-in-depth"],
    tags: ["標的型攻撃", "出口対策"],
  },
  {
    id: "q-security-ext-032",
    topics: ["sec-attacks-network"],
    diff: "medium",
    part: "A",
    stem: "DNSキャッシュポイズニングへの対策として、最も適切なものはどれか。",
    ok: "DNSSECによる応答の署名検証を行い、DNSサーバのソフトウェアを最新にして、送信元ポートをランダム化する",
    ng: [
      "DNSサーバのアクセスログの保存期間を、1年から3年に延長する",
      "WebサーバにWebアプリケーションファイアウォール（WAF）を導入して、SQLインジェクションを遮断する",
      "利用者の端末で、マルウェア対策ソフトのパターンファイルを毎日更新する",
    ],
    at: "e",
    okNote: "DNSSECは応答の真正性を検証でき、ポートのランダム化は偽の応答を成功させる確率を下げる。",
    ngNotes: [
      "ログの保存は、事後の調査に役立つが、偽の応答が登録されること自体は防げない。",
      "WAFはWebアプリケーションへの攻撃を対象とし、DNSの応答の偽装には効果がない。",
      "端末のマルウェア対策は、DNSサーバのキャッシュに偽の情報が登録されることを防げない。",
    ],
    correct: "DNSSECによる検証と、DNSサーバの更新・送信元ポートのランダム化が、DNSキャッシュポイズニングへの対策である。",
    why: [
      "DNSキャッシュポイズニングは、キャッシュサーバに偽の名前解決結果を登録させる攻撃である。",
      "応答の正当性を検証する仕組みと、偽の応答を成功させにくくする仕組みを組み合わせる。",
    ],
    en: "Use DNSSEC validation, keep DNS software updated, and randomize source ports to defend against DNS cache poisoning.",
    terms: ["sec-dns-cache-poisoning"],
    tags: ["DNSキャッシュポイズニング", "ネットワーク攻撃"],
  },
  {
    id: "q-security-ext-033",
    topics: ["sec-attacks-network"],
    diff: "medium",
    part: "B",
    stem: "初動として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "U社の総務部に、取引先を装った送信元から、請求書を装う圧縮ファイルが添付されたメールが届いた。総務部員Rが添付ファイルを開いたところ、EDRが不審なプロセスの起動を検知した。同じメールは、総務部と経理部の合計12名に届いていた。",
      },
    ],
    ok: "Rの端末をネットワークから隔離すると同時に、同一メールの受信者を特定して開封の有無を確認し、メールの削除と通信先のブロックを行う",
    ng: [
      "Rの端末の隔離だけを行い、他の受信者には連絡せずに、翌月の定例会で報告する",
      "Rの端末を直ちに初期化し、ログや証拠は保存せずに業務を再開させる",
      "送信元の取引先に抗議の電話をし、社内の調査は取引先の回答を待ってから始める",
    ],
    at: "a",
    okNote: "感染端末の封じ込めに加え、同じメールを受け取った他の従業員の被害の有無を確認し、攻撃の拡大を止める。",
    ngNotes: [
      "他の受信者が開封していれば、被害が拡大する。報告を翌月に遅らせるのも不適切である。",
      "初期化は証拠を失わせ、原因や範囲の調査を困難にする。",
      "送信元の取引先も被害者である可能性がある。社内の調査を待たせる理由はなく、初動が遅れる。",
    ],
    correct: "感染端末の隔離と、同一メールの受信者の確認、メールの削除、通信先のブロックを並行して行うことが適切である。",
    why: [
      "標的型攻撃メールは、複数の宛先に送られている場合が多い。",
      "初動では、封じ込め、範囲の特定、証拠の保全を優先する。",
    ],
    en: "Isolate the affected PC while identifying other recipients, removing the email, and blocking the destination. Preserve evidence.",
    terms: ["sec-malware", "sec-botnet"],
    tags: ["標的型攻撃", "初動対応", "科目B"],
  },
  {
    id: "q-security-ext-034",
    topics: ["sec-attacks-network"],
    diff: "hard",
    part: "B",
    stem: "再発に備えた対策として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "V社のECサイトに対してDDoS攻撃が発生した。サイトの回線帯域は1Gbpsであるが、攻撃時の流入トラフィックは約8Gbpsに達し、V社の設備に到達する前に回線が飽和して、正規の利用者もサイトに接続できなくなった。サーバのCPU使用率は低いままであった。",
      },
    ],
    ok: "ISPのDDoS対策サービスやCDN、クラウド型のDDoS緩和サービスを利用し、回線の上流で攻撃トラフィックを吸収・遮断する",
    ng: [
      "自社のファイアウォールのルールを厳格にして、攻撃元のIPアドレスを遮断する",
      "Webサーバの台数を増やして、サーバの処理能力を高める",
      "サーバのOSとミドルウェアにパッチを適用して、脆弱性を塞ぐ",
    ],
    at: "u",
    okNote: "回線そのものが飽和しているため、自社設備の手前、つまり上流で攻撃を吸収・遮断する必要がある。",
    ngNotes: [
      "攻撃トラフィックは自社のファイアウォールに到達する前に回線を飽和させている。設備側の遮断では解決しない。",
      "サーバのCPUには余裕があり、ボトルネックは回線である。台数を増やしても改善しない。",
      "この攻撃は脆弱性ではなく、大量の通信で帯域を使い切る攻撃であり、パッチでは防げない。",
    ],
    correct: "回線が飽和する帯域型のDDoS攻撃には、上流での吸収・遮断が必要であり、ISPやCDN、DDoS緩和サービスが有効である。",
    why: [
      "ボトルネックが回線かサーバかを見極め、効果のある場所で対策する。",
      "自社の設備に届く前に回線が埋まる場合、自社内の対策では間に合わない。",
    ],
    en: "When attack traffic saturates the link itself, mitigation must happen upstream at the ISP, a CDN, or a cloud DDoS mitigation service.",
    terms: ["sec-dos-ddos", "sec-cia-availability"],
    tags: ["DDoS", "可用性", "科目B"],
  },

  // ===== sec-crypto =====
  {
    id: "q-security-ext-035",
    topics: ["sec-crypto"],
    diff: "easy",
    part: "A",
    stem: "ハッシュ関数の性質として、適切でないものはどれか。",
    ok: "ハッシュ値から、元のデータを復元できる",
    ng: [
      "同じデータからは、常に同じハッシュ値が得られる",
      "入力データの長さにかかわらず、出力は固定長である",
      "元のデータが1ビット変わると、ハッシュ値が大きく変わる",
    ],
    at: "e",
    okNote: "この性質は誤りである。ハッシュ関数は一方向性を持ち、ハッシュ値から元のデータを復元できない。",
    ngNotes: [
      "正しい性質である。同じ入力には同じ出力が得られるため、改ざんの検知に使える。",
      "正しい性質である。入力が長くても短くても、出力は固定長である。",
      "正しい性質である。わずかな変更でも、ハッシュ値が大きく変わる。",
    ],
    correct: "ハッシュ値から元のデータを復元できるという記述は誤りである。ハッシュ関数は一方向性を持つ。",
    why: [
      "復元できないため、パスワードの保存や、完全性の確認に使われる。",
      "暗号化は復号できることを前提とするが、ハッシュ化は復元を前提としない。",
    ],
    en: "Hash functions are one-way: you cannot recover the original data from the hash. Same input gives same output, output is fixed length, and small changes alter it greatly.",
    terms: ["sec-hash", "sec-cia-integrity"],
    tags: ["ハッシュ", "暗号"],
  },
  {
    id: "q-security-ext-036",
    topics: ["sec-crypto"],
    diff: "medium",
    part: "A",
    stem: "10人の従業員が、互いに他の全員と1対1で秘密の通信を行う。通信する相手ごとに異なる共通鍵を使う場合、必要な共通鍵の総数はいくつか。",
    fixed: {
      opts: ["10個", "20個", "45個", "90個"],
      notes: [
        "人数と同じ数であり、相手ごとに異なる鍵を使うという条件に合わない。",
        "10組の鍵ペアを使う公開鍵暗号の鍵の数であり、共通鍵暗号の場合の数ではない。",
        "正解である。10人から2人の組を選ぶ数は10×9÷2＝45であり、共通鍵は2人で共有する。",
        "10×9と数えると、同じ2人の組を二重に数えている。共通鍵は通信する2人で共有するため、組ごとに1個で足りる。",
      ],
      ans: "u",
    },
    correct: "n人が互いに異なる共通鍵を使う場合、必要な鍵は n(n−1)/2 個である。10人なら45個になる。",
    why: [
      "共通鍵は、通信する2人の間で共有するため、組ごとに1個である。",
      "人数が増えると、鍵の数は人数の2乗に近い割合で増える。公開鍵暗号なら、1人1組の鍵ペアで足りる。",
    ],
    en: "With n parties, shared keys number n(n-1)/2, so 10 people need 45 keys. Public-key cryptography needs only one key pair per person.",
    terms: ["sec-common-key", "sec-public-key"],
    tags: ["共通鍵暗号", "鍵管理", "計算"],
  },
  {
    id: "q-security-ext-037",
    topics: ["sec-crypto"],
    diff: "hard",
    part: "A",
    stem: "サーバの秘密鍵が漏えいした可能性がある場合の対応として、最も適切なものはどれか。",
    ok: "新しい鍵ペアを生成して証明書を再発行し、漏えいした鍵に対応する証明書を認証局に失効させる",
    ng: [
      "同じ鍵ペアのまま、証明書の有効期限だけを更新して運用を継続する",
      "漏えいした可能性のある秘密鍵に、新しいパスフレーズを設定し直す",
      "公開鍵は公開情報なので、秘密鍵が漏えいしても証明書の信頼性には影響しない",
    ],
    at: "i",
    okNote: "漏えいした鍵は危殆化しているため、新しい鍵ペアで証明書を再発行し、古い証明書は失効させて使えなくする。",
    ngNotes: [
      "同じ鍵を使い続けると、鍵を入手した攻撃者が、正規のサーバになりすませる状態が続く。",
      "すでに流出した複製の鍵は、新しいパスフレーズの影響を受けない。鍵の危殆化への対応にならない。",
      "秘密鍵が漏えいすると、攻撃者がその証明書の持ち主になりすませる。信頼性に影響する。",
    ],
    correct: "鍵が危殆化した場合は、新しい鍵ペアでの証明書の再発行と、旧証明書の失効が必要である。",
    why: [
      "公開鍵暗号の安全性は、秘密鍵が本人だけに保たれていることを前提とする。",
      "失効した証明書は、CRLやOCSPで、利用者が無効と判断できる。",
    ],
    en: "A compromised private key requires generating a new key pair, reissuing the certificate, and revoking the old one.",
    terms: ["sec-public-key", "sec-pki"],
    tags: ["鍵管理", "危殆化", "PKI"],
  },
  {
    id: "q-security-ext-038",
    topics: ["sec-crypto"],
    diff: "medium",
    part: "B",
    stem: "見直しとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "W社は、取引先に機密性の高い設計資料のファイルを送付する。W社と取引先の間には、事前に共有している鍵はない。現在は、パスワード付きの圧縮ファイルを添付し、同じメールの本文にパスワードを記載している。",
      },
    ],
    ok: "取引先の公開鍵（証明書）でファイルを暗号化して送り、取引先が自分の秘密鍵で復号する",
    ng: [
      "ファイルを独自に考案した変換方式で暗号化し、方式は非公開にする",
      "W社の秘密鍵でファイルを暗号化して送る",
      "パスワードを12桁に延ばし、引き続き同じメールの本文に記載する",
    ],
    at: "a",
    okNote: "公開鍵暗号を使えば、事前に鍵を共有しなくても、受信者だけが復号できる。公開鍵は公開してよいため、配送の問題が生じない。",
    ngNotes: [
      "独自の方式は、安全性が検証されておらず、危険である。標準的な方式を使うべきである。",
      "W社の秘密鍵で暗号化すると、W社の公開鍵を持つ誰もが復号できる。機密性は確保できず、署名に近い操作になる。",
      "桁数を増やしても、ファイルとパスワードが同じメールにあれば、メールを入手した者が復号できる。",
    ],
    correct: "受信者の公開鍵で暗号化して送ると、事前の鍵の共有なしに、受信者だけが復号できる。",
    why: [
      "公開鍵暗号の使い方は、暗号化に受信者の公開鍵、復号に受信者の秘密鍵を用いる。",
      "大きなファイルでは、共通鍵で本体を暗号化し、その鍵を公開鍵で暗号化するハイブリッド方式が使われる。",
    ],
    en: "Encrypt with the recipient's public key so only the recipient can decrypt. Sending the password with the file defeats the protection.",
    terms: ["sec-public-key", "sec-common-key"],
    tags: ["公開鍵暗号", "鍵配送", "科目B"],
  },
  {
    id: "q-security-ext-039",
    topics: ["sec-crypto"],
    diff: "hard",
    part: "B",
    stem: "この問題を解決する対策として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "X社は、自社製ソフトウェアの更新プログラムを自社のWebサーバで配布し、同じサーバのダウンロードページにそのSHA-256ハッシュ値を掲載している。利用者はダウンロード後に、ハッシュ値を照合している。攻撃者がWebサーバに侵入し、更新プログラムを改ざんしたうえで、ページのハッシュ値も書き換えた場合、利用者は改ざんに気付けない。",
      },
    ],
    ok: "更新プログラムにX社の秘密鍵でデジタル署名を付与し、利用者が信頼できる認証局の証明書（公開鍵）で署名を検証できるようにする",
    ng: [
      "ハッシュ関数を、SHA-256から、出力が短い別のハッシュ関数に変更する",
      "ハッシュ値を、更新プログラムと同じサーバ上の別のディレクトリにも掲載する",
      "更新プログラムを共通鍵で暗号化し、その鍵をダウンロードページに掲載する",
    ],
    at: "e",
    okNote: "署名は、X社の秘密鍵がなければ作れない。サーバを侵入されても秘密鍵を持たなければ、正しい署名を付けられず、利用者は検証で改ざんに気付ける。",
    ngNotes: [
      "ハッシュを短くすると衝突の危険が増す。しかも、攻撃者がハッシュ値を書き換えられる問題は解決しない。",
      "同じサーバの別の場所に掲載しても、侵入した攻撃者はそれも書き換えられる。",
      "鍵をダウンロードページに掲載すると、誰でも復号できる。暗号化では改ざんの検知にもならない。",
    ],
    correct: "デジタル署名を使うと、サーバが侵害されても、署名の偽造ができないため、利用者が改ざんを検知できる。",
    why: [
      "ハッシュ値は、同じ場所で改ざんできる限り、完全性の証明にならない。",
      "デジタル署名は、秘密鍵を持つ者だけが作れ、公開鍵で誰でも検証できる。",
    ],
    en: "A hash stored next to the file can be replaced along with it. A digital signature made with the vendor's private key can be verified but not forged.",
    terms: ["sec-digital-signature", "sec-hash", "sec-pki"],
    tags: ["デジタル署名", "ハッシュ", "科目B"],
  },

  // ===== sec-auth =====
  {
    id: "q-security-ext-040",
    topics: ["sec-auth"],
    diff: "easy",
    part: "A",
    stem: "多要素認証に該当しない組合せはどれか。",
    ok: "パスワードと、あらかじめ登録した秘密の質問の答え",
    ng: [
      "ICカードと、暗証番号（PIN）",
      "パスワードと、指紋",
      "パスワードと、スマートフォンのアプリが表示するワンタイムパスワード",
    ],
    at: "u",
    okNote: "どちらも本人が知っていることに基づく知識の要素であり、同じ種類の要素を2つ使っているため、多要素認証にならない。",
    ngNotes: [
      "ICカード（所持）と暗証番号（知識）という異なる要素の組合せである。",
      "パスワード（知識）と指紋（生体）という異なる要素の組合せである。",
      "パスワード（知識）と、端末の所持に基づくワンタイムパスワード（所持）の組合せである。",
    ],
    correct: "多要素認証は、知識・所持・生体のうち、異なる種類の要素を2つ以上組み合わせる。パスワードと秘密の質問は、どちらも知識である。",
    why: [
      "同じ種類の要素を2回使っても、1つの要素が破られれば同種の要素も破られやすい。",
      "異なる種類を組み合わせると、1つが漏えいしても、他の要素で防げる。",
    ],
    en: "Multi-factor authentication combines different factor types: knowledge, possession, and inherence. A password and a security question are both knowledge.",
    terms: ["sec-mfa", "sec-biometrics"],
    tags: ["多要素認証", "認証"],
  },
  {
    id: "q-security-ext-041",
    topics: ["sec-auth"],
    diff: "medium",
    part: "A",
    stem: "FIDO（FIDO2）による認証の特徴として、最も適切なものはどれか。",
    ok: "利用者の端末（認証器）内に秘密鍵を保持し、サービスには公開鍵を登録して、署名によって認証する。サーバにパスワードや生体情報を保存しない",
    ng: [
      "サーバが利用者のパスワードのハッシュ値を管理し、端末から送られたパスワードと照合する",
      "認証時に、利用者の指紋データなどの生体情報を、サービス事業者のサーバへ送信して照合する",
      "ワンタイムパスワードをSMSで利用者の電話番号宛に送信して、入力させる",
    ],
    at: "a",
    okNote: "FIDOは公開鍵暗号による認証であり、生体情報などは端末内で本人確認に使われ、サーバには送られない。",
    ngNotes: [
      "パスワード認証の説明である。FIDOはサーバにパスワードを保管しない。",
      "FIDOでは生体情報を端末内で照合し、サーバへ送信しない。",
      "SMSによるワンタイムパスワードの説明であり、FIDOとは異なる。",
    ],
    correct: "FIDOは、端末内の秘密鍵による署名で認証し、サーバには公開鍵だけを登録する方式である。",
    why: [
      "サーバが漏えいしても、秘密鍵は流出せず、認証情報の再利用ができない。",
      "署名が正規のドメインに結び付くため、偽サイトに認証情報を入力させるフィッシングにも強い。",
    ],
    en: "FIDO authenticates with a private key held on the user's device. The server stores only the public key, and biometrics stay on the device.",
    terms: ["sec-public-key", "sec-mfa", "sec-biometrics"],
    tags: ["FIDO", "パスワードレス"],
  },
  {
    id: "q-security-ext-042",
    topics: ["sec-auth"],
    diff: "medium",
    part: "A",
    stem: "シングルサインオン（SSO）を導入する際の留意点として、最も適切なものはどれか。",
    ok: "認証を担う基盤が侵害されると、連携する全サービスに影響するため、その基盤に多要素認証を適用し、可用性も確保する",
    ng: [
      "一度のログインで複数のサービスを利用できるため、各サービス側での権限管理は不要になる",
      "パスワードの管理が不要になるため、すべてのサービスで認証の強度を下げてよい",
      "SSOの基盤が停止しても、各サービスには個別にログインできるため、可用性への影響はない",
    ],
    at: "i",
    okNote: "SSOは便利だが、認証基盤が単一の障害点・攻撃点になる。基盤の認証の強化と、冗長化などによる可用性の確保が必要である。",
    ngNotes: [
      "SSOは認証を一本化するだけで、認可（権限管理）は各サービスで引き続き必要である。",
      "1つの認証情報で多数のサービスを利用できるため、むしろ認証の強度を高める必要がある。",
      "多くの構成では、SSO基盤が停止するとサービスにログインできなくなる。可用性への影響は大きい。",
    ],
    correct: "SSOでは、認証基盤が侵害や停止の影響を集中して受けるため、多要素認証と可用性の確保が重要になる。",
    why: [
      "認証の一元化は利便性とパスワードの管理負担の軽減につながる一方、リスクも集中させる。",
      "認証（誰か）と認可（何ができるか）は別であり、後者は各サービスで管理する。",
    ],
    en: "SSO concentrates risk in the identity provider, so protect it with MFA and ensure availability. Authorization is still managed per service.",
    terms: ["sec-mfa", "sec-cia-availability"],
    tags: ["SSO", "認証"],
  },
  {
    id: "q-security-ext-043",
    topics: ["sec-auth"],
    diff: "medium",
    part: "A",
    stem: "ある生体認証システムの試験結果を表に示す。本人拒否率（FRR）と他人受入率（FAR）の組合せとして、適切なものはどれか。",
    pres: [
      {
        type: "table",
        headers: ["区分", "認証を試行した回数", "結果"],
        rows: [
          ["本人による試行", "2,000回", "拒否された回数：40回"],
          ["他人による試行", "10,000回", "受け入れられた回数：5回"],
        ],
      },
    ],
    fixed: {
      opts: [
        "FRR 2%、FAR 0.05%",
        "FRR 0.05%、FAR 2%",
        "FRR 0.4%、FAR 0.25%",
        "FRR 98%、FAR 0.05%",
      ],
      notes: [
        "正解である。FRRは、本人の試行のうち拒否された割合で40÷2,000＝2%、FARは、他人の試行のうち受け入れられた割合で5÷10,000＝0.05%である。",
        "FRRとFARの値が入れ替わっている。",
        "分母を取り違えている。FRRは本人の試行回数、FARは他人の試行回数を分母にする。",
        "FRRが誤りである。98%は、本人が受け入れられた割合である。",
      ],
      ans: "a",
    },
    correct: "FRRは40÷2,000＝2%、FARは5÷10,000＝0.05%である。",
    why: [
      "FRRの分母は本人の試行回数、FARの分母は他人の試行回数である。",
      "FARを下げるとFRRが上がる関係があり、運用に合わせてしきい値を調整する。",
    ],
    en: "FRR = 40/2,000 = 2%. FAR = 5/10,000 = 0.05%. Each uses its own trial population.",
    terms: ["sec-biometrics"],
    tags: ["生体認証", "FAR", "FRR", "計算"],
  },
  {
    id: "q-security-ext-044",
    topics: ["sec-auth"],
    diff: "medium",
    part: "B",
    stem: "このシステムのリスクと、その対策の組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "Y社は、社内の業務システムをHTTPSで公開しているが、自社で作成した自己署名証明書を使っている。従業員のブラウザには証明書の警告が表示されるが、従業員は「いつものこと」として警告を無視して接続している。",
      },
    ],
    ok: "攻撃者が偽のサーバに誘導した場合でも、警告を無視する習慣のために気付けず、中間者攻撃を受けるおそれがある。社内の認証局を整備してルート証明書を端末に配布するか、公的な認証局が発行した証明書を使い、警告が出ない運用にする",
    ng: [
      "自己署名証明書は通信を暗号化できないため盗聴される。暗号化を有効にするために、HTTPを併用する",
      "警告の原因は有効期限切れであるため、証明書の有効期限を100年にして警告が表示されないようにする",
      "警告を無視しても問題は生じないため、従業員への周知だけを行い、証明書は変更しない",
    ],
    at: "a",
    okNote: "警告を無視する習慣は、本物の警告を見落とす原因になる。信頼された認証局の証明書を使うことで、警告が出る状況を異常として扱える。",
    ngNotes: [
      "自己署名証明書でも通信の暗号化はできる。問題は、相手の正当性を検証できないことである。HTTPを併用すると、暗号化もされなくなる。",
      "警告の原因は、自己署名で信頼された認証局の発行でないことである。有効期限を延ばしても、警告は消えない。長すぎる有効期間も不適切である。",
      "警告を無視する習慣は、中間者攻撃に気付けなくなるリスクを生む。問題を放置してはならない。",
    ],
    correct: "信頼された認証局の証明書を使い、警告が出ない運用にして、警告を異常として扱えるようにする。",
    why: [
      "証明書は、通信相手の正当性を検証するために、信頼された認証局が署名する。",
      "日常的に警告が出ると、本物の攻撃による警告も無視されてしまう。",
    ],
    en: "Habitually ignoring certificate warnings hides real man-in-the-middle attacks. Use certificates from a trusted CA, or distribute an internal root CA to endpoints.",
    terms: ["sec-pki", "sec-mitm"],
    tags: ["PKI", "証明書", "科目B"],
  },
  {
    id: "q-security-ext-045",
    topics: ["sec-auth"],
    diff: "hard",
    part: "B",
    stem: "この種の攻撃への対策として、最も有効なものはどれか。",
    pres: [
      {
        type: "p",
        text: "Z社は、パスワードとSMSで送るワンタイムパスワードによる2段階の認証を導入した。しかし、攻撃者が本物そっくりの偽ログインサイトを用意し、従業員が偽サイトに入力したIDとパスワード、ワンタイムパスワードを、攻撃者がリアルタイムで本物のサイトに入力して、ログインに成功した。",
      },
    ],
    ok: "FIDO2（パスキー）など、正規サイトのドメインに結び付いて署名する、フィッシング耐性のある認証方式を導入する",
    ng: [
      "SMSで送るワンタイムパスワードの桁数を、6桁から8桁に増やす",
      "パスワードの最小文字数を引き上げ、定期的な変更を義務づける",
      "ワンタイムパスワードの有効期間を5分から10分に延ばして、入力を間に合いやすくする",
    ],
    at: "u",
    okNote: "FIDO2は、認証時の署名が正規のドメインに結び付くため、偽サイトに誘導されても、本物のサイトで通用する署名が作れない。",
    ngNotes: [
      "桁数を増やしても、利用者が偽サイトに入力した値は、そのまま攻撃者に中継される。",
      "パスワードを強くしても、利用者が偽サイトに入力すれば、攻撃者に渡る。",
      "有効期間を延ばすと、攻撃者が中継できる時間が長くなり、攻撃が成立しやすくなる。",
    ],
    correct: "リアルタイムに入力を中継するフィッシングには、ドメインに結び付いて署名するFIDO2などの方式が最も有効である。",
    why: [
      "従来のワンタイムパスワードは、利用者が入力した値を攻撃者が中継できるため、フィッシングに弱い場合がある。",
      "多要素認証の導入だけでなく、フィッシング耐性があるかどうかも評価する。",
    ],
    en: "Real-time relay phishing defeats SMS one-time passwords. FIDO2 binds the signature to the legitimate origin and is phishing resistant.",
    terms: ["sec-mfa", "sec-public-key"],
    tags: ["FIDO", "フィッシング", "科目B"],
  },

  // ===== sec-evaluation =====
  {
    id: "q-security-ext-046",
    topics: ["sec-evaluation"],
    diff: "easy",
    part: "A",
    stem: "CVEの説明として、最も適切なものはどれか。",
    ok: "個々の脆弱性に付与される、共通の識別番号",
    ng: [
      "脆弱性の深刻度を0.0〜10.0の数値で表す評価手法",
      "日本国内で使われる製品の脆弱性情報と対策情報を提供する、ポータルサイト",
      "脆弱性を悪用する攻撃が、実際に確認されたかどうかを示す区分",
    ],
    at: "e",
    okNote: "CVEは、脆弱性ごとに「CVE-年-番号」の形式で付与される共通の識別子であり、情報の突合に使われる。",
    ngNotes: [
      "CVSS（共通脆弱性評価システム）の説明である。",
      "JVN（Japan Vulnerability Notes）の説明である。",
      "CVEは識別番号であり、攻撃の確認の有無を示す区分ではない。",
    ],
    correct: "CVEは、個々の脆弱性に付与される共通の識別番号である。",
    why: [
      "識別番号があるため、異なる製品や組織が、同じ脆弱性を指して情報を共有できる。",
      "深刻度はCVSS、国内の情報提供はJVNと、役割を区別する。",
    ],
    en: "CVE is a common identifier assigned to each vulnerability. CVSS scores severity, and JVN is a Japanese vulnerability information portal.",
    terms: ["sec-cvss", "sec-vulnerability"],
    tags: ["CVE", "CVSS", "JVN"],
  },
  {
    id: "q-security-ext-047",
    topics: ["sec-evaluation"],
    diff: "medium",
    part: "A",
    stem: "CVSSの基本評価基準の説明として、最も適切なものはどれか。",
    ok: "脆弱性そのものの特性（攻撃元区分、攻撃条件の複雑さ、必要な特権、機密性・完全性・可用性への影響など）で評価し、時間の経過や組織の環境によって変わらない",
    ng: [
      "攻撃コードの公開や修正パッチの提供状況など、時間とともに変化する状況を反映して評価する",
      "自組織の資産の重要度や、すでに実施している緩和策を反映して評価する",
      "脆弱性の発見者や報告者の信頼性を数値化して評価する",
    ],
    at: "u",
    okNote: "基本評価基準は、脆弱性に固有の特性を評価する。製品が同じなら、どの組織でも同じ値になる。",
    ngNotes: [
      "現状（時間とともに変わる状況）を反映する評価基準の説明である。",
      "環境評価基準の説明である。組織固有の事情を反映する。",
      "CVSSに、発見者や報告者の信頼性を評価する基準はない。",
    ],
    correct: "基本評価基準は、脆弱性そのものの特性で評価する。時間や環境によって変わらない。",
    why: [
      "基本値は、製品ごとの共通の深刻度の目安であり、対応の優先順位を決める出発点になる。",
      "実際の優先順位は、自組織の環境や攻撃の状況も加味して判断する。",
    ],
    en: "The CVSS base metrics score intrinsic characteristics of the vulnerability, independent of time and of the organization's environment.",
    terms: ["sec-cvss"],
    tags: ["CVSS", "基本評価基準"],
  },
  {
    id: "q-security-ext-048",
    topics: ["sec-evaluation"],
    diff: "medium",
    part: "A",
    stem: "ペネトレーションテストを実施するときの留意点として、最も適切なものはどれか。",
    ok: "対象範囲、実施期間、禁止する手法、緊急時の連絡先などについて事前に合意し、業務への影響を考慮して実施する",
    ng: [
      "実際の攻撃を再現するため、実施することを関係者にも秘密にし、事前の合意なしに外部の対象も含めて行う",
      "対象システムの全脆弱性が見つかったことの証明として、結果を扱う",
      "本番環境への影響を避けるため、いかなる場合も、実際に侵入できるかの検証までは行わない",
    ],
    at: "e",
    okNote: "テストは実際の攻撃と同様の手法を用いるため、範囲や手法を合意しないと、法的問題や業務への影響を招くおそれがある。",
    ngNotes: [
      "合意のない攻撃は、不正アクセスに当たるおそれがある。外部の対象を含める場合は、その管理者の許可も必要である。",
      "ペネトレーションテストは、特定の目標への侵入可能性を検証するものであり、全脆弱性の発見を保証しない。",
      "侵入の可否の検証がペネトレーションテストの特徴であり、行わないのであれば、脆弱性診断との区別がなくなる。",
    ],
    correct: "事前に範囲・期間・禁止事項・連絡体制を合意し、業務への影響を考慮して実施する。",
    why: [
      "実際の攻撃手法を使うため、合意のない実施は不正アクセスと区別がつかなくなる場合がある。",
      "実施の目的が、検出の網羅ではなく、侵入や被害の再現であることも理解しておく。",
    ],
    en: "Agree in advance on scope, timing, prohibited techniques, and emergency contacts. Penetration tests do not guarantee that all vulnerabilities are found.",
    terms: ["sec-cvss", "sec-vulnerability"],
    tags: ["ペネトレーションテスト", "セキュリティ評価"],
  },
  {
    id: "q-security-ext-049",
    topics: ["sec-evaluation"],
    diff: "hard",
    part: "A",
    stem: "ある脆弱性診断で「指摘事項なし」の結果が出た。結果の解釈として、最も適切なものはどれか。",
    ok: "診断した時点・範囲・手法で確認できた脆弱性が見つからなかったという意味であり、その後に公表される脆弱性や、範囲外の問題がないことは保証しない",
    ng: [
      "システムに脆弱性が存在しないことが証明されたため、次の診断までパッチ適用を停止してよい",
      "診断の対象外であった関連システムも含めて、安全であることが確認された",
      "未知の脆弱性（ゼロデイ）も含めて、すべて検出した結果である",
    ],
    at: "a",
    okNote: "診断は、ある時点の、決められた範囲と手法に基づく確認である。結果は、その条件の下での状態を示すにとどまる。",
    ngNotes: [
      "新しい脆弱性は日々公表されるため、パッチ適用などの継続的な管理は必要である。",
      "対象外のシステムについては、確認されていない。",
      "未知の脆弱性は、診断で検出できないことが多い。すべて検出したとはいえない。",
    ],
    correct: "診断結果は、診断した時点・範囲・手法の範囲での確認であり、安全であることの保証ではない。",
    why: [
      "システムの変更や新しい脆弱性の公表により、診断後に状況は変わる。",
      "継続的な脆弱性管理と、定期的な再診断が必要である。",
    ],
    en: "A clean result means nothing was found within the scope, time, and method of the assessment. It is not proof of security.",
    terms: ["sec-vulnerability", "sec-cvss"],
    tags: ["脆弱性診断", "限界"],
  },
  {
    id: "q-security-ext-050",
    topics: ["sec-evaluation"],
    diff: "hard",
    part: "B",
    stem: "限られた要員で対応する場合に、最初に対応すべき脆弱性はどれか。",
    pres: [
      {
        type: "p",
        text: "W社の情報システム部は、脆弱性スキャナで検出された次の3件について、対応の優先順位を決める。",
      },
      {
        type: "table",
        headers: ["脆弱性", "CVSS基本値", "状況"],
        rows: [
          ["P：社内の閉域網のみで稼働する検証用サーバの脆弱性", "9.8", "外部から到達できず、個人情報は保存していない。"],
          ["Q：インターネットに公開された顧客ポータルのサーバの脆弱性", "7.5", "顧客の個人情報を扱う。攻撃コードが公開され、実際に悪用が観測されている。"],
          ["R：社内利用のみの勤怠システムの脆弱性", "5.3", "社内から認証を通ったあとでのみ悪用できる。"],
        ],
      },
    ],
    fixed: {
      opts: [
        "P：基本値が最も高いため",
        "Q：外部に公開され、個人情報を扱い、実際に悪用されているため",
        "R：業務への影響が最も小さく、短時間で対応できるため",
        "いずれも同時に着手し、優先順位は付けない",
      ],
      notes: [
        "基本値は高いが、外部から到達できず、保護する情報もないため、リスクは相対的に低い。基本値だけで決めるのは不適切である。",
        "正解である。基本値は中間でも、外部公開、個人情報、実際の悪用という環境と現状が重なり、リスクが最も高い。",
        "基本値が最も低く、対応が容易なことは、最初に対応する理由にならない。",
        "限られた要員では、優先順位を付けずに着手すると、重要なものの対応が遅れる。",
      ],
      ans: "i",
    },
    correct: "基本値だけでなく、到達可能性、資産の重要度、攻撃の状況を踏まえると、Qの優先度が最も高い。",
    why: [
      "CVSSの基本値は、対応の優先順位を決める出発点にすぎない。",
      "自組織の環境（公開の有無、扱う情報）と、攻撃コードの公開や悪用の有無を加味して判断する。",
    ],
    en: "Prioritize by exposure, asset value, and active exploitation, not by base score alone. Q is internet-facing, handles personal data, and is being exploited.",
    terms: ["sec-cvss", "sec-vulnerability"],
    tags: ["CVSS", "優先順位", "科目B"],
  },
  {
    id: "q-security-ext-051",
    topics: ["sec-evaluation"],
    diff: "medium",
    part: "B",
    stem: "（ア）と（イ）の目的に合った手法の組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "A社は、次の2つの目的で、セキュリティの評価を実施する。",
      },
      {
        type: "list",
        items: [
          "（ア）新規に公開するWebサービスについて、公開前に、既知の脆弱性や設定の不備を網羅的に洗い出したい。",
          "（イ）運用中の基幹システムについて、攻撃者が実際に侵入して重要情報に到達できるか、検知や対応の体制が機能するかを確認したい。",
        ],
      },
    ],
    fixed: {
      opts: [
        "（ア）ペネトレーションテスト　（イ）脆弱性診断",
        "（ア）脆弱性診断　（イ）脆弱性診断",
        "（ア）脆弱性診断　（イ）ペネトレーションテスト",
        "（ア）ペネトレーションテスト　（イ）ペネトレーションテスト",
      ],
      notes: [
        "手法が入れ替わっている。（ア）は網羅的な洗い出し、（イ）は侵入の再現が目的である。",
        "（イ）は、実際に侵入できるかと体制の有効性の確認が目的であり、脆弱性診断では確認できない。",
        "正解である。（ア）の網羅的な洗い出しは脆弱性診断、（イ）の侵入の再現や体制の検証はペネトレーションテストに当たる。",
        "（ア）は網羅性が目的であり、特定の目標への侵入を試すペネトレーションテストでは網羅的に洗い出せない。",
      ],
      ans: "u",
    },
    correct: "（ア）は網羅的に洗い出す脆弱性診断、（イ）は侵入の再現と体制の検証を行うペネトレーションテストが適している。",
    why: [
      "脆弱性診断は、既知の脆弱性や設定不備を網羅的に確認する。",
      "ペネトレーションテストは、攻撃者の視点で、侵入や被害の拡大が実際に可能かを検証する。",
    ],
    en: "Vulnerability assessment suits exhaustive discovery of known issues. Penetration testing suits proving that an attacker can reach critical assets and testing detection and response.",
    terms: ["sec-vulnerability", "sec-cvss"],
    tags: ["脆弱性診断", "ペネトレーションテスト", "科目B"],
  },
];

export const questionsExtra: Question[] = specs.map(build);
