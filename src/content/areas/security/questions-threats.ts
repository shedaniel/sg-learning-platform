import type { Question } from "@/lib/content/types";

export const threatQuestions: Question[] = [
  {
    id: "q-security-threat-001",
    part: "A",
    topicIds: ["sec-threats"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "easy",
    type: "knowledge",
    stem: "次のうち、情報セキュリティにおける「脆弱性」に該当するものはどれか。",
    options: [
      { id: "a", text: "標的型攻撃のメールを送信する攻撃者" },
      { id: "i", text: "セキュリティパッチを適用していないWebサーバ" },
      { id: "u", text: "地震によるデータセンターの停電" },
      { id: "e", text: "顧客情報を不正に持ち出そうとする従業員" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、パッチ未適用のWebサーバである。攻撃に悪用されうる弱点が脆弱性に当たる。",
      why: [
        "脆弱性は、脅威によって悪用される可能性がある組織側の弱点である。",
        "攻撃者、地震、不正を行う従業員は、損害を引き起こす要因すなわち脅威に分類される。",
      ],
      optionNotes: {
        a: "攻撃者は脅威であり、組織が管理する弱点ではない。",
        i: "正解である。パッチ未適用は典型的な脆弱性である。",
        u: "地震は環境的な脅威であり、脆弱性ではない。",
        e: "不正を行う従業員は内部の脅威であり、脆弱性そのものではない。",
      },
      english:
        "An unpatched web server is a vulnerability: a weakness that a threat can exploit. Attackers, earthquakes, and malicious employees are threats.",
      termIds: ["sec-vulnerability", "sec-threat"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["脅威", "脆弱性"],
  },
  {
    id: "q-security-threat-002",
    part: "A",
    topicIds: ["sec-threats"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "easy",
    type: "knowledge",
    stem: "次のうち、偶発的な脅威に該当するものはどれか。",
    options: [
      { id: "a", text: "標的型攻撃のメール" },
      { id: "i", text: "内部者による意図的な情報持ち出し" },
      { id: "u", text: "従業員によるUSBメモリの紛失" },
      { id: "e", text: "外部からのDDoS攻撃" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "正解は、USBメモリの紛失である。意図せずに発生する事故であり、偶発的な脅威に分類される。",
      why: [
        "偶発的な脅威には、誤操作、紛失、設定ミス、機器故障、災害などが含まれる。",
        "標的型メール、内部不正、DDoSは、いずれも意図的な脅威である。",
      ],
      optionNotes: {
        a: "標的型攻撃のメールは、攻撃者の意図に基づく脅威である。",
        i: "内部者による意図的な持ち出しは、意図的な脅威である。",
        u: "正解である。紛失は偶発的な脅威の代表例である。",
        e: "DDoS攻撃は、攻撃者の意図に基づく脅威である。",
      },
      english:
        "A lost USB drive is an accidental threat. Targeted email, insider theft, and DDoS are intentional threats.",
      termIds: ["sec-threat"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["脅威", "分類"],
  },
  {
    id: "q-security-threat-003",
    part: "A",
    topicIds: ["sec-malware"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "easy",
    type: "knowledge",
    stem: "利用者がファイルを開いたりプログラムを実行したりしなくても、ネットワーク上の他の端末へ自律的に感染を広げるマルウェアはどれか。",
    options: [
      { id: "a", text: "ウイルス" },
      { id: "i", text: "ワーム" },
      { id: "u", text: "トロイの木馬" },
      { id: "e", text: "ランサムウェア" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解はワームである。宿主ファイルを必要とせず、ネットワークを介して自己複製しながら感染を広げる。",
      why: [
        "ワームは自律的に増殖し、利用者の操作を必要としない場合がある。",
        "ウイルスは宿主ファイルの実行・開封が必要であり、トロイの木馬は自己複製しない。",
      ],
      optionNotes: {
        a: "ウイルスは他のファイルに寄生し、そのファイルが実行・開封されたときに感染を広げる。",
        i: "正解である。ワームは宿主不要で自己伝播する。",
        u: "トロイの木馬は正規ソフトを装って実行させるが、自己複製しない。",
        e: "ランサムウェアは暗号化や窃取を目的とする。ワーム機能を持つ場合もあるが、名称としては目的に着目した分類である。",
      },
      english:
        "A worm self-replicates across networks without a host file or user action. A virus needs a host, and a trojan does not self-replicate.",
      termIds: ["sec-worm", "sec-virus", "sec-trojan"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["マルウェア", "ワーム"],
  },
  {
    id: "q-security-threat-004",
    part: "A",
    topicIds: ["sec-malware"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "medium",
    type: "knowledge",
    stem: "ランサムウェアの説明として最も適切なものはどれか。",
    options: [
      { id: "a", text: "ファイルを暗号化して利用不能にし、窃取した情報の公開を脅すことがある" },
      { id: "i", text: "他のファイルに寄生し、開封されたときだけ自己複製する" },
      { id: "u", text: "正規のソフトウェアに見せかけて実行させるが、自己複製はしない" },
      { id: "e", text: "OSのカーネルに潜伏し、自身の存在を隠すことだけを目的とする" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、暗号化による可用性の侵害と、窃取情報の公開を脅す二重恐喝である。",
      why: [
        "ランサムウェアは、ファイルを暗号化して業務を停止させ、復旧の対価を要求する。",
        "近年は、窃取した情報を公開すると脅すことで、バックアップからの復旧だけでは解決しない圧力をかける。",
      ],
      optionNotes: {
        a: "正解である。暗号化と情報公開の脅迫を組み合わせる場合がある。",
        i: "ウイルスの説明である。ランサムウェアの本質的な説明としては不十分である。",
        u: "トロイの木馬の説明である。",
        e: "ルートキットの説明である。ランサムウェアの目的とは異なる。",
      },
      english:
        "Ransomware encrypts files to disrupt availability and may steal data to threaten publication, a practice known as double extortion.",
      termIds: ["sec-ransomware", "sec-cia-availability"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["マルウェア", "ランサムウェア"],
  },
  {
    id: "q-security-threat-005",
    part: "A",
    topicIds: ["sec-malware"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "medium",
    type: "knowledge",
    stem: "ファイルレスマルウェアへの対策として最も有効なものはどれか。",
    options: [
      { id: "a", text: "既知のパターンに依存するシグネチャ定義の更新だけを行う" },
      { id: "i", text: "振る舞い検知やEDRによるプロセス・通信の監視を行う" },
      { id: "u", text: "共有フォルダのアクセス権を変更する" },
      { id: "e", text: "メールの添付ファイルの拡張子を制限するだけにする" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、振る舞い検知やEDRによる監視である。ファイルレスはディスク上に実行ファイルを残さないため、動作の観測が有効である。",
      why: [
        "ファイルレスマルウェアは、PowerShell、WMI、レジストリ、メモリなどを悪用する。",
        "プロセスの起動関係、スクリプトの実行、外部通信を監視することで、ファイルの有無に依存せず検知できる。",
      ],
      optionNotes: {
        a: "シグネチャは未知の検体やファイルレスには限界がある。更新だけでは不十分である。",
        i: "正解である。振る舞い検知とEDRが有効である。",
        u: "アクセス権の変更は情報共有の制御であり、ファイルレスマルウェアの検知には直接効かない。",
        e: "添付ファイルの制限は入口対策の一部だが、ファイルレスは正規ツールを悪用するため、これだけでは防げない。",
      },
      english:
        "Fileless malware leaves no executable on disk, so behavior-based detection and EDR monitoring of processes, scripts, and communications are effective.",
      termIds: ["sec-fileless-malware", "sec-malware"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["マルウェア", "検知", "ファイルレス"],
  },
  {
    id: "q-security-threat-006",
    part: "A",
    topicIds: ["sec-fraud"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "medium",
    type: "knowledge",
    stem: "経理担当者が入金の消込と承認を一人で行っていた。この状況が不正のトライアングルの「機会」に該当するとき、機会を減らす対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "入金処理と承認を別の担当者に分ける職務分離を行う" },
      { id: "i", text: "倫理研修を実施して不正の動機を下げる" },
      { id: "u", text: "内部通報の相談窓口を設置する" },
      { id: "e", text: "懲戒規定を就業規則に明記する" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は職務分離である。一人で処理と承認を完結できないようにし、不正を実行しにくい状況を作る。",
      why: [
        "不正のトライアングルのうち、組織が最も直接的に減らせるのが機会である。",
        "職務分離、承認、照合は、状況的犯罪予防の代表的な統制である。",
      ],
      optionNotes: {
        a: "正解である。職務分離は機会を直接減らす。",
        i: "倫理研修は動機や正当化に働きかける対策であり、機会の除去とは異なる。",
        u: "相談窓口は早期発見や動機の把握に役立つが、処理と承認を分離するものではない。",
        e: "懲戒規定は抑止力になるが、一人で完結できる業務プロセス自体は変わらない。",
      },
      english:
        "Segregation of duties directly reduces opportunity in the fraud triangle. Ethics training, reporting channels, and disciplinary rules address incentive or rationalization.",
      termIds: ["sec-fraud-triangle", "sec-situational-crime-prevention"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正", "職務分離"],
  },
  {
    id: "q-security-threat-007",
    part: "A",
    topicIds: ["sec-fraud"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "hard",
    type: "knowledge",
    stem: "状況的犯罪予防の考え方として最も適切なものはどれか。",
    options: [
      { id: "a", text: "犯罪者の生い立ちや性格を分析し、個人の特性を変えることだけを目指す" },
      { id: "i", text: "小さな違反や不備を放置せず、ルールが守られている状態を保つ" },
      { id: "u", text: "監視や承認を減らして、業務の効率を優先する" },
      { id: "e", text: "不正が発生した後だけ、原因を調査して報告する" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、小さな違反や不備を放置せず、規範が守られている状態を保つことである。割れ窓理論も、この考え方を支える。",
      why: [
        "状況的犯罪予防は、犯罪を実行しにくい環境や手順を設計することで機会を減らす。",
        "小さな違反の放置は「ルールが守られていない」という信号になり、大きな不正を招きやすくする。",
      ],
      optionNotes: {
        a: "個人の特性だけに着目するのではなく、環境や手順を変えるのが状況的犯罪予防である。",
        i: "正解である。規範が守られている状態を維持することが抑止につながる。",
        u: "監視や承認を減らすことは、機会を増やし、リスクを高める。",
        e: "事後の調査だけでは、不正の機会を減らす予防にはならない。",
      },
      english:
        "Situational crime prevention reduces opportunity by designing environments and procedures. The broken windows theory holds that leaving small violations unaddressed signals that rules are not enforced.",
      termIds: ["sec-situational-crime-prevention", "sec-fraud-triangle"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正", "状況的犯罪予防"],
  },
  {
    id: "q-security-threat-008",
    part: "B",
    topicIds: ["sec-threats", "sec-fraud"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "medium",
    type: "scenario",
    stem: "D社の営業部は、情報システム部門の承認を得ずに、個人向けのクラウドストレージに顧客名簿を保存し、社外の取引先と共有していた。情報システム部門が最初に行うべき対応として最も適切なものはどれか。",
    options: [
      { id: "a", text: "利用者を特定せず、直ちに全社員を懲戒処分にする" },
      { id: "i", text: "利用状況を可視化し、データの所在と共有範囲を確認したうえで、承認済みサービスへの移行とルール整備を進める" },
      { id: "u", text: "営業部の端末をすべて没収し、業務を停止する" },
      { id: "e", text: "問題が顕在化するまで何もせず、様子を見る" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、可視化とデータの所在確認、承認済みサービスへの移行、ルール整備である。シャドーITは、把握して管理下に置くことが出発点になる。",
      why: [
        "シャドーITは、データの所在、共有範囲、アカウント管理が把握できないことが最大的リスクである。",
        "禁止だけでは利用が隠れるため、可視化と安全な代替手段の提供を組み合わせる。",
      ],
      optionNotes: {
        a: "利用状況を確認せずに処分すると、問題の全容把握と再発防止ができない。",
        i: "正解である。可視化、移行、ルール整備の順で管理下に置く。",
        u: "業務を停止する対応は、被害の大きさに対して過剰であり、原因調査にも支障をきたす。",
        e: "放置すると、情報漏えいや退職者のアカウント残存などのリスクが拡大する。",
      },
      english:
        "For shadow IT, first gain visibility into where data is stored and shared, then migrate to approved services and establish usable rules. A blanket ban without investigation is ineffective.",
      termIds: ["sec-shadow-it", "sec-insider-threat"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["シャドーIT", "科目B", "内部統制"],
  },
  {
    id: "q-security-threat-009",
    part: "B",
    topicIds: ["sec-malware", "sec-threats"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "medium",
    type: "scenario",
    stem: "E社のEDRが、ある端末で業務時間外にPowerShellが不審な外部通信を行っていることを検知した。端末を調査したところ、ディスク上に不審な実行ファイルは見つかっていない。初動として最も適切なものはどれか。",
    options: [
      { id: "a", text: "ファイルのシグネチャスキャンだけを実行し、検出されなければ正常と判断する" },
      { id: "i", text: "端末をネットワークから隔離し、メモリ、実行履歴、通信ログを保全して調査する" },
      { id: "u", text: "端末を再起動し、利用者に様子を見るよう伝える" },
      { id: "e", text: "全社員のパスワードを一斉に変更する" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、端末の隔離と証拠保全である。ファイルレスマルウェアはディスクに実行ファイルを残さないため、メモリや実行履歴の調査が必要になる。",
      why: [
        "不審なPowerShellの実行と外部通信は、ファイルレス攻撃の典型的な兆候である。",
        "隔離によって被害の拡大を防ぎ、メモリやログを保全することで原因と影響範囲を調査できる。",
      ],
      optionNotes: {
        a: "ファイルレスではシグネチャスキャンが検出できない場合がある。検出なしを正常と判断するのは危険である。",
        i: "正解である。隔離と証拠保全を優先する。",
        u: "再起動するとメモリ上の証拠が失われる可能性がある。様子見は拡大の機会を与える。",
        e: "パスワード変更は認証情報窃取への対応になりうるが、端末の封じ込めと証拠保全が先である。",
      },
      english:
        "Isolate the endpoint and preserve memory, execution history, and network logs. Fileless malware may leave no executable on disk, so a signature scan alone is insufficient.",
      termIds: ["sec-fileless-malware", "sec-malware"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["マルウェア", "科目B", "インシデント対応"],
  },
  {
    id: "q-security-threat-010",
    part: "B",
    topicIds: ["sec-fraud", "sec-threats"],
    lessonIds: ["security/threats-and-malware"],
    difficulty: "hard",
    type: "scenario",
    stem: "F社では、経理担当者が仕入先の登録と支払処理を兼務し、上司の承認は形式的に行われていた。その結果、架空の仕入先への支払いが3年間発覚しなかった。再発防止として最も適切なものはどれか。",
    options: [
      { id: "a", text: "職務分離、取引先の実在確認、承認の実効性を確認する監査を組み合わせる" },
      { id: "i", text: "担当者に対する倫理研修だけを実施する" },
      { id: "u", text: "支払件数を増やし、処理を複雑にする" },
      { id: "e", text: "承認ログを保存せず、担当者の申告に任せる" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、職務分離、取引先の実在確認、承認の実効性を確認する監査の組合せである。機会を減らし、発見できる仕組みを重ねる。",
      why: [
        "仕入先登録と支払処理の兼務は、架空取引を実行できる機会を生む。",
        "取引先の実在確認と承認の監査は、形式的な承認を防ぎ、不正を早期に発見する。",
      ],
      optionNotes: {
        a: "正解である。機会の除去と発見の仕組みを組み合わせている。",
        i: "倫理研修だけでは、一人で完結できる業務プロセスと形式的な承認は変わらない。",
        u: "処理を複雑にしても、権限が集中したままでは機会は減らない。",
        e: "ログを保存せず申告に任せると、責任追跡性と発見可能性が失われる。",
      },
      english:
        "Separate vendor registration from payment, verify that vendors exist, and audit whether approvals are substantive. Training alone does not remove the opportunity.",
      termIds: ["sec-fraud-triangle", "sec-situational-crime-prevention", "sec-insider-threat"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正", "科目B", "内部統制"],
  },
];
