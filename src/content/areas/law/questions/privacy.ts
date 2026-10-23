import type { Question } from "@/lib/content/types";

export const privacyQuestions: Question[] = [
  {
    id: "q-law-privacy-001",
    part: "A",
    topicIds: ["law-privacy"],
    lessonIds: ["law/privacy"],
    difficulty: "easy",
    type: "knowledge",
    stem: "個人情報保護法上の用語の関係について、正しいものはどれか。",
    options: [
      {
        id: "a",
        text: "個人情報データベース等を構成する個人情報を「個人データ」という。",
      },
      {
        id: "i",
        text: "個人データのうち、開示・訂正等の権限を有するものを「個人情報」という。",
      },
      {
        id: "u",
        text: "個人情報保護法上の「個人情報」には、法人そのものに関する情報も含まれる。",
      },
      {
        id: "e",
        text: "個人識別符号を含む情報は、他の情報と照合しなければ個人情報に該当しない。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "個人情報データベース等を構成する個人情報が「個人データ」です。保護の範囲は、個人情報、個人データ、保有個人データの順に狭くなります。",
      why: [
        "個人情報データベース等を構成する個人情報を個人データといい、さらに開示・訂正・利用停止等の権限を有するものを保有個人データといいます。",
        "個人識別符号を含む情報は、それ単体で個人情報に該当します。",
      ],
      optionNotes: {
        a: "正解です。データベース等を構成する個人情報が個人データです。",
        i: "逆です。開示・訂正等の権限を有する個人データは「保有個人データ」です。",
        u: "法人その他の団体は「個人」に該当しないため、法人そのものに関する情報は個人情報ではありません。ただし、役員や従業員の情報は個人情報になり得ます。",
        e: "個人識別符号を含む情報は、他の情報と照合するまでもなく、それ単体で個人情報に該当します。",
      },
      english:
        "Personal data is personal information constituting a personal information database. Retained personal data is personal data over which the operator has disclosure and correction authority. Information containing a personal identifier is personal information on its own.",
      termIds: [
        "law-personal-information",
        "law-personal-data",
        "law-retained-personal-data",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "定義", "科目A"],
  },
  {
    id: "q-law-privacy-002",
    part: "A",
    topicIds: ["law-privacy"],
    lessonIds: ["law/privacy"],
    difficulty: "easy",
    type: "knowledge",
    stem: "次のうち、個人情報保護法上の「個人識別符号」に該当するものはどれか。",
    options: [
      { id: "a", text: "社員番号" },
      { id: "i", text: "指紋の特徴を変換したデータ" },
      { id: "u", text: "生年月日" },
      { id: "e", text: "商品の購入履歴" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "指紋の特徴を電子計算機で利用できる形に変換したデータは、身体的特徴に基づく個人識別符号です。",
      why: [
        "個人識別符号には、身体の特徴を変換した符号と、個人ごとに割り振られる公的な番号があります。",
        "指紋・顔・虹彩・声紋・静脈・DNAなどは、身体的特徴の代表例です。",
      ],
      optionNotes: {
        a: "社員番号は、政令で定める個人識別符号には該当しません。ただし、氏名等と組み合わされば個人情報になり得ます。",
        i: "正解です。指紋の特徴を変換したデータは個人識別符号です。",
        u: "生年月日は「記述等」による識別情報であり、個人識別符号そのものではありません。",
        e: "購入履歴は個人に関する情報ですが、個人識別符号には該当しません。",
      },
      english:
        "A code converted from fingerprint features is a personal identifier based on physical characteristics. Employee numbers, dates of birth, and purchase histories are not personal identifiers.",
      termIds: ["law-personal-identifier", "law-personal-information"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "個人識別符号", "科目A"],
  },
  {
    id: "q-law-privacy-003",
    part: "A",
    topicIds: ["law-privacy"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "病歴を含む個人情報を新たに取得する場合の対応として、個人情報保護法上最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "本人の同意を得ずに取得し、オプトアウト方式で第三者に提供する。",
      },
      {
        id: "i",
        text: "あらかじめ本人の同意を得て取得する。",
      },
      {
        id: "u",
        text: "個人情報保護委員会に届け出れば、本人の同意は不要である。",
      },
      {
        id: "e",
        text: "匿名加工情報にすれば、取得時の本人同意は不要である。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "病歴は要配慮個人情報です。要配慮個人情報の取得には、原則としてあらかじめ本人の同意が必要です。",
      why: [
        "要配慮個人情報は、不当な差別や偏見が生じ得る情報として、取得時により厳格な同意要件が課されています。",
        "要配慮個人情報はオプトアウトによる第三者提供の対象外です。",
      ],
      optionNotes: {
        a: "要配慮個人情報はオプトアウトによる第三者提供が認められていません。取得時にも本人同意が必要です。",
        i: "正解です。取得前に本人の同意を得る必要があります。",
        u: "委員会への届出はオプトアウト方式の手続であり、要配慮個人情報の取得時同意を免除するものではありません。",
        e: "匿名加工情報の作成は取得後の加工の問題です。取得時に要配慮個人情報である以上、本人同意が必要です。",
      },
      english:
        "Medical history is sensitive personal information. Prior consent is generally required to acquire it, and opt-out third-party provision is not available.",
      termIds: [
        "law-sensitive-personal-information",
        "law-opt-out",
        "law-third-party-provision",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "要配慮個人情報", "科目A"],
  },
  {
    id: "q-law-privacy-004",
    part: "A",
    topicIds: ["law-privacy"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "オプトアウト方式による第三者提供が認められないものはどれか。",
    options: [
      { id: "a", text: "氏名と住所" },
      { id: "i", text: "要配慮個人情報" },
      { id: "u", text: "商品の購入履歴" },
      { id: "e", text: "メールアドレス" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "要配慮個人情報は、オプトアウト方式による第三者提供が認められていません。",
      why: [
        "要配慮個人情報は、取得時の本人同意が原則必要であり、オプトアウトの対象から除外されています。",
        "不正に取得された個人データや、オプトアウトで取得した個人データの再提供も対象外です。",
      ],
      optionNotes: {
        a: "氏名・住所は、オプトアウトの対象となり得ます。ただし、事前の通知・公表と委員会への届出が必要です。",
        i: "正解です。要配慮個人情報はオプトアウトの対象外です。",
        u: "購入履歴は、要配慮個人情報でなければオプトアウトの対象となり得ます。",
        e: "メールアドレスは、要配慮個人情報でなければオプトアウトの対象となり得ます。",
      },
      english:
        "Sensitive personal information cannot be provided to third parties under the opt-out scheme. Wrongfully obtained data and re-provision of opt-out data are also excluded.",
      termIds: [
        "law-opt-out",
        "law-sensitive-personal-information",
        "law-third-party-provision",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "オプトアウト", "科目A"],
  },
  {
    id: "q-law-privacy-005",
    part: "A",
    topicIds: ["law-privacy", "law-privacy-ops"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "匿名加工情報を第三者に提供する場合の対応として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "提供先と秘密保持契約を結べば、提供する情報の項目を公表する必要はない。",
      },
      {
        id: "i",
        text: "提供する情報の項目と提供方法を公表し、提供先に明示する。",
      },
      {
        id: "u",
        text: "本人の同意を得れば、作成時の加工基準への適合は不要である。",
      },
      {
        id: "e",
        text: "提供先が個人を再識別しても、提供元が責任を負うことはない。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "匿名加工情報を第三者に提供するときは、提供する情報の項目と提供方法を公表し、提供先に明示する必要があります。",
      why: [
        "匿名加工情報は作成時の加工基準の適合が前提であり、その上で第三者提供時の公表・明示が求められます。",
        "提供先における識別行為は禁止されており、提供元も安全管理措置を講じる必要があります。",
      ],
      optionNotes: {
        a: "秘密保持契約を結んでも、匿名加工情報の第三者提供に必要な項目・方法の公表は免除されません。",
        i: "正解です。提供する情報の項目と提供方法の公表、提供先への明示が必要です。",
        u: "匿名加工情報は作成した時点で加工基準を満たしている必要があります。本人同意で基準適合が免除されるわけではありません。",
        e: "提供先の識別行為は禁止されており、提供元にも安全管理措置や契約上の対応が求められます。",
      },
      english:
        "When providing anonymously processed information to a third party, the provider must publish the items and method of provision and clearly inform the recipient.",
      termIds: [
        "law-anonymized-information",
        "law-third-party-provision",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "匿名加工情報", "科目A"],
  },
  {
    id: "q-law-privacy-006",
    part: "A",
    topicIds: ["law-privacy", "law-privacy-ops"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "knowledge",
    stem: "仮名加工情報の取扱いとして、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "本人の事前の同意があれば、第三者に提供できる。",
      },
      {
        id: "i",
        text: "法令に基づく場合等を除き、第三者に提供できない。",
      },
      {
        id: "u",
        text: "作成時に、規則で定める基準に従う必要はない。",
      },
      {
        id: "e",
        text: "仮名加工情報は、個人情報保護法上の個人情報に該当しない。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "仮名加工情報は、法令に基づく場合等を除き、第三者提供が認められていません。本人の事前同意があっても提供できません。",
      why: [
        "仮名加工情報は事業者内部での利用を想定した制度であり、提供による再識別リスクを避けるため、第三者提供が原則禁止されています。",
        "委託、事業承継、共同利用は第三者提供に該当しないため可能です。",
      ],
      optionNotes: {
        a: "仮名加工情報は、作成前に本人の同意を得ていても第三者提供できません。",
        i: "正解です。法令に基づく場合等を除き、第三者提供は認められません。",
        u: "仮名加工情報を作成するときは、規則で定める基準に従って加工する必要があります。",
        e: "仮名加工情報は個人情報に該当します。ただし、利用目的の変更制限や漏えい報告など、一部の規定が適用されません。",
      },
      english:
        "Pseudonymized information cannot be provided to third parties except as required by law, even with prior consent. Entrustment, business succession, and joint use remain possible.",
      termIds: [
        "law-pseudonymized-information",
        "law-anonymized-information",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "仮名加工情報", "科目A"],
  },
  {
    id: "q-law-privacy-007",
    part: "A",
    topicIds: ["law-privacy"],
    lessonIds: ["law/privacy"],
    difficulty: "easy",
    type: "knowledge",
    stem: "個人情報保護法上の安全管理措置のうち、従業者に対する定期的な教育・研修はどれに分類されるか。",
    options: [
      { id: "a", text: "組織的措置" },
      { id: "i", text: "人的措置" },
      { id: "u", text: "物理的措置" },
      { id: "e", text: "技術的措置" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "従業者に対する教育・研修は、人に関する対策であるため「人的措置」に分類されます。",
      why: [
        "安全管理措置は、組織的・人的・物理的・技術的の4分類で整理されます。",
        "研修、秘密保持契約、退職時の権限削除などは人的措置の例です。",
      ],
      optionNotes: {
        a: "組織的措置は、規程の策定、責任者の設置、定期監査など、組織のルールに関する対策です。",
        i: "正解です。教育・研修は人的措置です。",
        u: "物理的措置は、入退室管理、施錠、廃棄時の裁断など、物理的な環境に関する対策です。",
        e: "技術的措置は、アクセス制御、暗号化、ログ監視など、技術的な仕組みに関する対策です。",
      },
      english:
        "Employee education and training are human security measures, one of the four categories: organizational, human, physical, and technical.",
      termIds: ["law-security-measures"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "安全管理措置", "科目A"],
  },
  {
    id: "q-law-privacy-008",
    part: "B",
    topicIds: ["law-privacy-ops"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "scenario",
    stem: "ECサイトを運営するA社で、決済画面の入力フォームに不正なスクリプトが埋め込まれ、顧客が入力した氏名・カード番号が外部に送信された。情報はA社のデータベースに保存される前に窃取されており、従来の「個人データ」には該当しない状態であった。2024年4月以降のA社の対応として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "個人データに該当しないため、個人情報保護委員会への報告義務は一切ない。",
      },
      {
        id: "i",
        text: "個人データとして取り扱うことが想定される個人情報であり、一定の場合には委員会への報告と本人通知の対象となる。",
      },
      {
        id: "u",
        text: "匿名加工情報に該当するため、報告は不要である。",
      },
      {
        id: "e",
        text: "要配慮個人情報でないため、常に報告は不要である。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "2024年4月の施行規則改正により、個人データとして取り扱うことが想定される個人情報の漏えいも、一定要件で報告・本人通知の対象となりました。ウェブスキミングはその典型例です。",
      why: [
        "従来は「個人データ」の漏えいが報告対象でしたが、入力段階で窃取される情報も保護対象に含められました。",
        "報告対象は、要配慮個人情報、財産的被害のおそれ、不正の目的、1,000人超の影響などに限られます。",
      ],
      optionNotes: {
        a: "2024年4月以降、個人データになる前の個人情報も、一定の場合には報告対象となります。",
        i: "正解です。ウェブスキミングのように、個人データとして取り扱うことが想定される個人情報が対象になります。",
        u: "匿名加工情報は、特定の個人を識別できず復元できないように加工した情報です。入力フォームの情報は匿名加工情報ではありません。",
        e: "要配慮個人情報でなくても、財産的被害のおそれ、不正の目的、1,000人超の影響などがあれば報告対象となります。",
      },
      english:
        "Since April 2024, personal information intended to be handled as personal data can be subject to breach reporting and individual notification, with web skimming as a typical example.",
      termIds: [
        "law-personal-information",
        "law-personal-data",
        "law-security-measures",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["個人情報保護法", "漏えい報告", "ウェブスキミング", "科目B"],
  },
  {
    id: "q-law-privacy-009",
    part: "B",
    topicIds: ["law-privacy-ops"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "scenario",
    stem: "EU域内の顧客にサービスを提供する日本のB社が、EU域内で取得した個人データを日本のクラウド環境に移転する。GDPRとの関係について、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "日本はEUから十分性認定を受けているため、補完的ルールを守ることを前提に、原則として追加の適合措置なしで移転できる。",
      },
      {
        id: "i",
        text: "GDPRはEU域内に拠点を置く事業者にのみ適用されるため、B社には関係しない。",
      },
      {
        id: "u",
        text: "本人の同意を得れば、GDPRのデータ主体の権利はすべて免除される。",
      },
      {
        id: "e",
        text: "日本法を遵守していれば、GDPRを検討する必要はない。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "日本は2019年1月にEUから十分性認定を受けています。補完的ルールの遵守を前提に、EUから日本への個人データ移転は原則として追加の適合措置なしで行えます。",
      why: [
        "GDPRは、EU域内のデータ主体に商品・サービスを提供する場合や、行動を監視する場合には、EU域外の事業者にも適用されます。",
        "十分性認定は、移転先の国の保護水準が十分であることをEUが認める制度です。",
      ],
      optionNotes: {
        a: "正解です。十分性認定と補完的ルールにより、原則として移転が可能です。",
        i: "GDPRは域外適用されます。EU域内のデータ主体にサービスを提供するB社にも適用されます。",
        u: "本人の同意は適法性根拠の一つにすぎません。データ主体の権利は、同意によってすべて免除されるわけではありません。",
        e: "日本法の遵守だけでは足りません。EU域内のデータを扱う場合は、GDPRの要件も確認する必要があります。",
      },
      english:
        "Japan has received an EU adequacy decision. Subject to the supplementary rules, personal data can generally be transferred from the EU to Japan without additional safeguards.",
      termIds: ["law-gdpr", "law-personal-information"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["GDPR", "十分性認定", "科目B"],
  },
  {
    id: "q-law-privacy-010",
    part: "B",
    topicIds: ["law-privacy", "law-privacy-ops"],
    lessonIds: ["law/privacy"],
    difficulty: "medium",
    type: "scenario",
    stem: "C社は、本番環境の顧客個人データをテスト環境で利用したい。個人情報保護法上のリスクを下げる対応として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "本番データをそのままコピーし、テスト環境のアクセス権を全開発者に付与する。",
      },
      {
        id: "i",
        text: "データマスキングやk-匿名化を用いて再識別リスクを下げ、利用目的・アクセス制御・委託先の監督も確認する。",
      },
      {
        id: "u",
        text: "匿名加工情報にすれば、作成時の加工基準への適合は不要である。",
      },
      {
        id: "e",
        text: "テスト環境は社内ネットワーク内なので、安全管理措置は不要である。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "テスト環境でも個人データを扱う以上、安全管理措置が必要です。データマスキングやk-匿名化で再識別リスクを下げ、利用目的・アクセス制御・委託先の監督を確認します。",
      why: [
        "データマスキングは、氏名や住所などを別の値に置換する技術で、静的マスキングと動的マスキングがあります。",
        "k-匿名化は準識別子の組合せをk人以上にする手法ですが、属性推論や背景知識による再識別リスクは残ります。",
      ],
      optionNotes: {
        a: "本番データのそのままのコピーと全開発者への権限付与は、漏えい時の影響を大きくします。最小権限とマスキングが必要です。",
        i: "正解です。マスキング・匿名化と安全管理措置を組み合わせます。",
        u: "匿名加工情報を作成する場合は、作成時の加工基準への適合が必要です。テスト用のマスキングとは別の制度です。",
        e: "社内ネットワーク内でも、個人データを扱うテスト環境には安全管理措置が必要です。",
      },
      english:
        "Test environments handling personal data still require security measures. Combine data masking or k-anonymity with purpose limitation, access control, and contractor supervision.",
      termIds: [
        "law-security-measures",
        "law-k-anonymity",
        "law-anonymized-information",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["データマスキング", "k-匿名化", "科目B"],
  },
];
