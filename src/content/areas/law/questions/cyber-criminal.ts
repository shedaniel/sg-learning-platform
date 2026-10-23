import type { Question } from "@/lib/content/types";

export const cyberCriminalQuestions: Question[] = [
  {
    id: "q-law-cyber-001",
    part: "A",
    topicIds: ["law-unauthorized"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "easy",
    type: "knowledge",
    stem: "次の行為のうち、不正アクセス禁止法上の「不正アクセス行為」に該当するものはどれか。",
    options: [
      {
        id: "a",
        text: "自社のサーバに、管理者権限を持つ担当者としてログインする。",
      },
      {
        id: "i",
        text: "退職した従業員のIDとパスワードを、本人の許諾なく使って社内システムにログインする。",
      },
      {
        id: "u",
        text: "自社システムの脆弱性を、書面による許可を得て検査する。",
      },
      {
        id: "e",
        text: "自分のアカウントのパスワードを変更する。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "退職した従業員はもはや利用権者ではなく、本人の許諾もありません。そのIDとパスワードでログインする行為は、不正アクセス行為に該当します。",
      why: [
        "不正アクセス行為は、アクセス制御機能を有する特定電子計算機に、他人の識別符号を入力するなどして制限を免れる行為です。",
        "アクセス管理者自身が行う場合や、管理者・利用権者の承諾がある場合は除外されます。",
      ],
      optionNotes: {
        a: "アクセス管理者自身が行う行為は、不正アクセス行為から除外されます。",
        i: "正解です。退職者は利用権者ではなく、許諾もないため不正アクセス行為に該当します。",
        u: "アクセス管理者の書面による承諾がある脆弱性診断は、正当な業務として不正アクセス行為に該当しません。",
        e: "自分のアカウントのパスワード変更は、自分の識別符号を自分で管理する行為であり、不正アクセス行為ではありません。",
      },
      english:
        "Using a former employee's ID and password without permission constitutes unauthorized access, because the former employee is no longer an authorized user.",
      termIds: [
        "law-unauthorized-access",
        "law-identification-code",
        "law-access-control-function",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正アクセス禁止法", "定義", "科目A"],
  },
  {
    id: "q-law-cyber-002",
    part: "A",
    topicIds: ["law-unauthorized"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "easy",
    type: "knowledge",
    stem: "不正アクセス禁止法上の「アクセス制御機能」の説明として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "入退室を管理するカードリーダーの機能",
      },
      {
        id: "i",
        text: "入力された符号が正規の識別符号であることを確認し、特定利用の制限の全部または一部を解除する機能",
      },
      {
        id: "u",
        text: "ファイアウォールで外部からの通信を遮断する機能",
      },
      {
        id: "e",
        text: "アクセスログを保存する機能",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "アクセス制御機能は、入力された符号が正規の識別符号であることを確認し、特定利用の制限を解除する機能です。",
      why: [
        "ID・パスワードによる認証のほか、生体認証なども含まれます。",
        "ファイアウォールによる通信の遮断は、特定利用の制限を解除する機能ではないため、この法律のアクセス制御機能には当たりません。",
      ],
      optionNotes: {
        a: "入退室管理は物理的なアクセス制御ですが、不正アクセス禁止法が対象とする電子計算機のアクセス制御機能ではありません。",
        i: "正解です。符号を確認して利用制限を解除する機能です。",
        u: "ファイアウォールは通信を遮断する機能であり、特定利用の制限を解除するアクセス制御機能ではありません。",
        e: "ログ保存は監査や追跡の機能であり、利用制限を解除する機能ではありません。",
      },
      english:
        "The access control function verifies that an entered code is a valid identification code and releases all or part of the restriction on use. A firewall's blocking function is different.",
      termIds: ["law-access-control-function", "law-unauthorized-access"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正アクセス禁止法", "アクセス制御機能", "科目A"],
  },
  {
    id: "q-law-cyber-003",
    part: "A",
    topicIds: ["law-unauthorized"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "knowledge",
    stem: "不正アクセス禁止法上の「助長行為」に該当するものはどれか。",
    options: [
      {
        id: "a",
        text: "自分のIDとパスワードで、自分が利用権者であるシステムにログインする。",
      },
      {
        id: "i",
        text: "不正アクセス行為の用に供する目的で、他人のIDとパスワードを取得し、第三者に提供する。",
      },
      {
        id: "u",
        text: "アクセス管理者の許諾を得て、脆弱性診断を実施する。",
      },
      {
        id: "e",
        text: "自分のパスワードを定期的に変更する。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "不正アクセス行為の用に供する目的で他人の識別符号を取得し、第三者に提供する行為は、助長行為として処罰されます。",
      why: [
        "助長行為には、識別符号の不正取得、提供、不正取得された識別符号の保管、管理者になりすました入力要求が含まれます。",
        "自分が不正アクセス行為を行っていなくても、助長行為は独立して処罰されます。",
      ],
      optionNotes: {
        a: "自分が利用権者として自分の識別符号でログインする行為は、不正アクセス行為にも助長行為にも該当しません。",
        i: "正解です。他人の識別符号の不正取得と提供は、助長行為の典型です。",
        u: "アクセス管理者の許諾を得た脆弱性診断は、正当な業務であり、助長行為に該当しません。",
        e: "自分のパスワードの変更は、識別符号の適正な管理であり、助長行為ではありません。",
      },
      english:
        "Obtaining another person's identification code for unauthorized access and providing it to a third party is a facilitating act, punishable even if the actor does not log in.",
      termIds: [
        "law-facilitation-act",
        "law-identification-code",
        "law-unauthorized-access",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正アクセス禁止法", "助長行為", "科目A"],
  },
  {
    id: "q-law-cyber-004",
    part: "A",
    topicIds: ["law-unauthorized"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "knowledge",
    stem: "不正アクセス行為と助長行為の法定刑の組合せとして、正しいものはどれか。",
    options: [
      {
        id: "a",
        text: "不正アクセス行為は3年以下の懲役又は100万円以下の罰金、助長行為は1年以下の懲役又は50万円以下の罰金",
      },
      {
        id: "i",
        text: "不正アクセス行為も助長行為も、3年以下の懲役又は100万円以下の罰金",
      },
      {
        id: "u",
        text: "不正アクセス行為は1年以下の懲役又は50万円以下の罰金、助長行為は3年以下の懲役又は100万円以下の罰金",
      },
      {
        id: "e",
        text: "不正アクセス行為も助長行為も、1年以下の懲役又は50万円以下の罰金",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "不正アクセス行為は3年以下の懲役又は100万円以下の罰金、助長行為は1年以下の懲役又は50万円以下の罰金です。",
      why: [
        "不正アクセス行為本体の方が、助長行為よりも重い法定刑になっています。",
        "識別符号の提供でも、相手方に不正アクセス行為の用に供する目的があることを知らない場合は、30万円以下の罰金となります。",
      ],
      optionNotes: {
        a: "正解です。不正アクセス行為3年・100万円、助長行為1年・50万円が基本です。",
        i: "助長行為の法定刑は、不正アクセス行為本体よりも軽い1年以下・50万円以下です。",
        u: "逆です。不正アクセス行為本体の方が重く、3年以下・100万円以下です。",
        e: "不正アクセス行為本体は3年以下・100万円以下であり、両方が1年以下・50万円以下ではありません。",
      },
      english:
        "Unauthorized access carries up to three years' imprisonment or a fine of up to 1 million yen; facilitating acts carry up to one year or a fine of up to 500,000 yen.",
      termIds: ["law-unauthorized-access", "law-facilitation-act"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正アクセス禁止法", "罰則", "科目A"],
  },
  {
    id: "q-law-cyber-005",
    part: "A",
    topicIds: ["law-cyber"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "easy",
    type: "knowledge",
    stem: "サイバーセキュリティ基本法の説明として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "不正アクセス行為を直接処罰する法律である。",
      },
      {
        id: "i",
        text: "国のサイバーセキュリティ施策の基本理念や、国・事業者等の責務を定める基本法である。",
      },
      {
        id: "u",
        text: "個人情報の取扱いだけを定める法律である。",
      },
      {
        id: "e",
        text: "広告宣伝目的の電子メールだけを規制する法律である。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "サイバーセキュリティ基本法は、国の施策の基本理念、国・地方公共団体・事業者・国民の責務、サイバーセキュリティ戦略本部の設置などを定める基本法です。",
      why: [
        "具体的な禁止行為や罰則は、不正アクセス禁止法、刑法、特定電子メール法などの個別法が定めます。",
        "基本法は、個別法を支える政策の枠組みを提供します。",
      ],
      optionNotes: {
        a: "不正アクセス行為を直接処罰するのは、不正アクセス禁止法です。",
        i: "正解です。基本理念と責務を定める基本法です。",
        u: "個人情報の取扱いを定めるのは、個人情報保護法です。",
        e: "広告宣伝メールを規制するのは、特定電子メール法です。",
      },
      english:
        "The Cybersecurity Basic Act sets out principles, responsibilities, and the strategy headquarters. It does not itself create criminal penalties.",
      termIds: ["law-cybersecurity-basic-act"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["サイバーセキュリティ基本法", "科目A"],
  },
  {
    id: "q-law-cyber-006",
    part: "A",
    topicIds: ["law-cyber"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "knowledge",
    stem: "特定電子メール法の規制として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "広告宣伝メールは、原則としてあらかじめ同意した者にのみ送信できる。",
      },
      {
        id: "i",
        text: "受信者の同意がなくても、住所を知っていれば広告宣伝メールを送信できる。",
      },
      {
        id: "u",
        text: "広告宣伝メールには、送信者情報を表示する義務はない。",
      },
      {
        id: "e",
        text: "受信拒否の連絡を受けても、営業目的であれば送信を続けることができる。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "特定電子メール法はオプトイン方式を採用しており、広告宣伝メールは原則として、あらかじめ同意した者にのみ送信できます。",
      why: [
        "送信者情報の表示、受信拒否者への再送信禁止、送信者情報の偽装禁止なども定められています。",
        "違反には1年以下の懲役又は100万円以下の罰金、法人には3,000万円以下の罰金が科され得ます。",
      ],
      optionNotes: {
        a: "正解です。オプトイン方式により、原則として事前同意が必要です。",
        i: "住所を知っているだけでは足りません。広告宣伝メールには、原則として事前の同意が必要です。",
        u: "送信者情報の表示は義務です。氏名・名称、住所、連絡先、受信拒否の通知先などを表示します。",
        e: "受信拒否の連絡を受けた後は、その受信者への送信を続けることはできません。",
      },
      english:
        "The Act adopts an opt-in rule: advertising email may in principle be sent only to recipients who have given prior consent. Sender information must be displayed.",
      termIds: ["law-specified-email-act"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["特定電子メール法", "オプトイン", "科目A"],
  },
  {
    id: "q-law-cyber-007",
    part: "A",
    topicIds: ["law-cyber"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "knowledge",
    stem: "他人のネットバンキングのIDとパスワードを不正に入手し、不正送金を行って現金を引き出した行為に、最も直接的に該当する罪はどれか。",
    options: [
      { id: "a", text: "電子計算機損壊等業務妨害罪" },
      { id: "i", text: "電子計算機使用詐欺罪" },
      { id: "u", text: "電磁的記録不正作出・供用罪" },
      { id: "e", text: "不正指令電磁的記録作成等罪" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "電子計算機に不正な指令を与えて財産上の不法利益を得ているため、電子計算機使用詐欺罪が最も直接的に該当します。",
      why: [
        "電子計算機使用詐欺罪は、財産権の得喪・変更に関する不実の電磁的記録を作り、財産上の不法利益を得る罪です。",
        "不正アクセス禁止法の不正アクセス行為にも該当しますが、選択肢の中では電子計算機使用詐欺罪が金銭取得を捉えています。",
      ],
      optionNotes: {
        a: "電子計算機損壊等業務妨害罪は、電子計算機やデータを壊し、業務を妨害する罪です。不正送金による金銭取得を直接捉えるものではありません。",
        i: "正解です。不正送金により財産上の不法利益を得ています。",
        u: "電磁的記録不正作出・供用罪は、事務処理を誤らせる目的で権利・義務・事実証明に関する電磁的記録を不正に作る罪です。金銭取得を直接の目的とする事案では、電子計算機使用詐欺罪がより直接的です。",
        e: "不正指令電磁的記録作成等罪は、ウイルスなどの作成・提供を処罰する罪です。本件ではウイルスの作成・提供は示されていません。",
      },
      english:
        "Obtaining money by sending improper commands to a banking computer constitutes computer fraud under Article 246-2 of the Penal Code.",
      termIds: ["law-computer-fraud", "law-unauthorized-access"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["刑法", "電子計算機使用詐欺", "科目A"],
  },
  {
    id: "q-law-cyber-008",
    part: "B",
    topicIds: ["law-unauthorized", "law-cyber"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社を退職した元社員のIDが無効化されずに残っていた。元同僚のBさんが、そのIDとパスワードを使って社内システムにログインし、顧客データを閲覧して外部に持ち出した。この行為の法的評価として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "元社員のIDは会社が管理していたものなので、不正アクセス行為には該当しない。",
      },
      {
        id: "i",
        text: "不正アクセス行為に該当し、顧客データの持ち出しの態様によっては、刑法や不正競争防止法上の責任も問題になる。",
      },
      {
        id: "u",
        text: "電子計算機使用詐欺罪だけが成立し、不正アクセス禁止法は適用されない。",
      },
      {
        id: "e",
        text: "著作権侵害だけが問題となり、刑事責任は生じない。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "退職した元社員は利用権者ではなく、Bさんには正当な権限も許諾もありません。そのIDでログインする行為は不正アクセス行為に該当します。",
      why: [
        "アクセス制御機能を有する特定電子計算機に、他人の識別符号を入力して制限を免れています。",
        "顧客データの不正な持ち出しは、営業秘密の侵害や、不正競争防止法上の責任、刑法上の罪にも関係し得ます。",
      ],
      optionNotes: {
        a: "IDを会社が管理していたとしても、退職者に利用権限はなく、Bさんにも許諾がありません。不正アクセス行為に該当します。",
        i: "正解です。不正アクセス行為に該当し、データ持ち出しの態様に応じて他の法的責任も問題になります。",
        u: "不正アクセス禁止法と刑法は重畳的に適用され得ます。電子計算機使用詐欺罪だけに限定されるわけではありません。",
        e: "著作権侵害だけではありません。不正アクセス行為や、顧客データの不正持ち出しに関する責任が問題になります。",
      },
      english:
        "A former employee is no longer an authorized user. Logging in with that ID constitutes unauthorized access, and removing customer data may also trigger other civil and criminal liability.",
      termIds: [
        "law-unauthorized-access",
        "law-identification-code",
        "law-trade-secret",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正アクセス禁止法", "退職者", "科目B"],
  },
  {
    id: "q-law-cyber-009",
    part: "B",
    topicIds: ["law-unauthorized", "law-cyber"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "scenario",
    stem: "攻撃者が金融機関を装った偽のログイン画面を用意し、利用者にIDとパスワードを入力させた。攻撃者は取得したIDとパスワードを使って、実際にその利用者の口座にログインした。この行為の法的評価として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "偽のログイン画面を作成しただけでは、いかなる罪も成立しない。",
      },
      {
        id: "i",
        text: "識別符号の入力を不正に要求する行為は助長行為として処罰され、取得したIDでログインすれば不正アクセス行為にも該当する。",
      },
      {
        id: "u",
        text: "不正アクセス行為だけが成立し、助長行為は成立しない。",
      },
      {
        id: "e",
        text: "電子計算機使用詐欺罪だけが成立し、不正アクセス禁止法は適用されない。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "管理者になりすまして識別符号の入力を求める行為は助長行為に当たり、取得したIDでログインすれば不正アクセス行為にも当たります。",
      why: [
        "不正アクセス禁止法7条は、管理者になりすまして識別符号の入力を求める行為を禁止しています。",
        "取得した認証情報で実際にログインすれば、第3条の不正アクセス行為に該当します。",
      ],
      optionNotes: {
        a: "偽のログイン画面を作成し、識別符号の入力を求める行為自体が助長行為として処罰対象になります。",
        i: "正解です。助長行為と不正アクセス行為の両方が成立し得ます。",
        u: "助長行為も成立します。入力要求行為と、その後の不正ログインは別の行為として評価されます。",
        e: "不正アクセス禁止法も適用されます。電子計算機使用詐欺罪が成立する場合でも、不正アクセス行為の成立が排除されるわけではありません。",
      },
      english:
        "Impersonating the administrator to request identification code entry is a facilitating act. Logging in with the obtained credentials is also unauthorized access.",
      termIds: [
        "law-phishing",
        "law-facilitation-act",
        "law-unauthorized-access",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["フィッシング", "不正アクセス禁止法", "科目B"],
  },
  {
    id: "q-law-cyber-010",
    part: "B",
    topicIds: ["law-cyber"],
    lessonIds: ["law/cyber-criminal"],
    difficulty: "medium",
    type: "scenario",
    stem: "SNS上で会社に関する事実無根の誹謗中傷を投稿されたA社が、投稿の削除と投稿者の特定を検討している。情報流通プラットフォーム対処法との関係について、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "プロバイダは、権利侵害情報について常に削除義務を負う。",
      },
      {
        id: "i",
        text: "大規模なプラットフォーム事業者には削除申出対応の迅速化・透明化の義務があり、一定要件を満たせば発信者情報の開示を請求できる。",
      },
      {
        id: "u",
        text: "発信者情報は、警察の令状がなければ一切開示されない。",
      },
      {
        id: "e",
        text: "匿名での投稿は、法的な保護の対象にならない。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "情報流通プラットフォーム対処法は、大規模事業者に削除申出対応の迅速化・透明化を求め、一定要件の下で発信者情報の開示請求を認めています。",
      why: [
        "プロバイダは、削除等の措置を講じた場合、故意・重過失がなければ損害賠償責任を負いません。",
        "発信者情報の開示には、権利侵害が明白であること、損害賠償請求のために必要であること、正当な理由があることなどが求められます。",
      ],
      optionNotes: {
        a: "プロバイダに常に削除義務があるわけではありません。削除するかどうかは、権利侵害の明白性や申出の内容を踏まえて判断します。",
        i: "正解です。大規模事業者の義務と発信者情報開示の要件を押さえます。",
        u: "発信者情報の開示は、民事の開示請求や裁判手続によっても行われます。警察の令状が唯一の手段ではありません。",
        e: "匿名投稿でも、表現の自由やプライバシーなど法的保護の対象になります。違法性の判断は内容と態様によります。",
      },
      english:
        "The Information Distribution Platform Act imposes prompt and transparent handling duties on large platforms and allows sender information disclosure under certain requirements.",
      termIds: [
        "law-platform-act",
        "law-provider-liability",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["情報流通プラットフォーム対処法", "誹謗中傷", "科目B"],
  },
];
