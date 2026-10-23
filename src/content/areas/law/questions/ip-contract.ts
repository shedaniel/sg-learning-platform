import type { Question } from "@/lib/content/types";

export const ipContractQuestions: Question[] = [
  {
    id: "q-law-ip-001",
    part: "A",
    topicIds: ["law-ip"],
    lessonIds: ["law/ip-contract"],
    difficulty: "easy",
    type: "knowledge",
    stem: "個人が創作した著作物の著作権の保護期間として、原則として正しいものはどれか。",
    options: [
      { id: "a", text: "創作した時点から20年" },
      { id: "i", text: "著作者の死後70年" },
      { id: "u", text: "公表した時点から10年" },
      { id: "e", text: "保護期間はなく、永久に存続する" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "著作権の保護期間は、原則として著作者の死後70年です。",
      why: [
        "法人その他の団体が著作者である法人著作は公表後70年、映画は公表後70年です。",
        "著作権は創作と同時に発生し、特許のような出願・登録は不要です。",
      ],
      optionNotes: {
        a: "著作権の保護期間は創作から20年ではありません。",
        i: "正解です。著作者の死後70年が原則です。",
        u: "公表から10年ではありません。法人著作や映画でも公表後70年です。",
        e: "著作権には保護期間があり、永久に存続するわけではありません。",
      },
      english:
        "Copyright generally lasts for 70 years after the author's death. Corporate works and films are protected for 70 years after publication.",
      termIds: ["law-copyright"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["著作権法", "保護期間", "科目A"],
  },
  {
    id: "q-law-ip-002",
    part: "A",
    topicIds: ["law-ip", "law-standards-ethics"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "knowledge",
    stem: "著作物を引用する場合の要件として、適切でないものはどれか。",
    options: [
      { id: "a", text: "引用する著作物が公表されていること" },
      { id: "i", text: "引用部分と自分の著作物が明瞭に区分されていること" },
      { id: "u", text: "自分の著作物が主で、引用部分が従であること" },
      { id: "e", text: "出所を明示しなくてもよいこと" },
    ],
    correctOptionId: "e",
    explanation: {
      correct:
        "引用では出所の明示が必要です。出所を明示しなくてよいとする記述は誤りです。",
      why: [
        "著作権法32条1項は、公表された著作物を、公正な慣行に合致し、正当な範囲内で引用することを認めています。",
        "実務上は、公表・明瞭区分性・主従関係・出所明示の4要件を確認します。",
      ],
      optionNotes: {
        a: "引用の対象は、公表された著作物である必要があります。",
        i: "引用部分と自分の著作物は、明瞭に区分されている必要があります。",
        u: "引用は自分の著作物が主で、引用部分が従である必要があります。",
        e: "正解です（適切でないもの）。出所の明示は引用の要件です。",
      },
      english:
        "Quotation requires a published work, clear distinction, the quoting work being primary, and indication of the source. Failure to indicate the source is not acceptable.",
      termIds: ["law-quotation", "law-copyright"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["著作権法", "引用", "科目A"],
  },
  {
    id: "q-law-ip-003",
    part: "A",
    topicIds: ["law-ip"],
    lessonIds: ["law/ip-contract"],
    difficulty: "easy",
    type: "knowledge",
    stem: "不正競争防止法上の「営業秘密」の3要件の組合せとして、正しいものはどれか。",
    options: [
      { id: "a", text: "秘密管理性・有用性・非公知性" },
      { id: "i", text: "限定提供性・相当蓄積性・電磁的管理性" },
      { id: "u", text: "新規性・進歩性・産業上の利用可能性" },
      { id: "e", text: "創作性・独創性・固定性" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "営業秘密の3要件は、秘密管理性・有用性・非公知性です。",
      why: [
        "秘密として管理されていること、有用な情報であること、公然と知られていないことが必要です。",
        "限定提供性・相当蓄積性・電磁的管理性は、限定提供データの3要件です。",
      ],
      optionNotes: {
        a: "正解です。営業秘密の3要件です。",
        i: "これは限定提供データの3要件です。営業秘密とは異なります。",
        u: "新規性・進歩性・産業上の利用可能性は、特許の要件です。",
        e: "創作性・独創性・固定性は、著作物や意匠の文脈で使われる概念であり、営業秘密の3要件ではありません。",
      },
      english:
        "A trade secret requires secrecy management, usefulness, and non-publicity. Limited provision data requires limited provision, substantial accumulation, and electronic management.",
      termIds: ["law-trade-secret", "law-limited-provision-data"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正競争防止法", "営業秘密", "科目A"],
  },
  {
    id: "q-law-ip-004",
    part: "A",
    topicIds: ["law-ip"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "knowledge",
    stem: "不正競争防止法上の「限定提供データ」の説明として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "秘密として管理されている情報だけを対象とする。",
      },
      {
        id: "i",
        text: "業として特定の者に提供され、電磁的方法により相当量蓄積・管理されている技術上または営業上の情報を対象とする。",
      },
      {
        id: "u",
        text: "個人情報だけを対象とする。",
      },
      {
        id: "e",
        text: "特許庁に登録したデータだけを対象とする。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "限定提供データは、限定提供性・相当蓄積性・電磁的管理性を満たす技術上または営業上の情報で、営業秘密を除きます。",
      why: [
        "業として特定の者に提供する情報として、電磁的方法により相当量蓄積され、管理されていることが必要です。",
        "2019年7月1日施行の不正競争防止法改正で新設されました。",
      ],
      optionNotes: {
        a: "秘密として管理されている情報は営業秘密として扱われ、限定提供データからは除かれます。",
        i: "正解です。限定提供性・相当蓄積性・電磁的管理性を満たす情報です。",
        u: "限定提供データは技術上・営業上の情報を対象とし、個人情報に限定されません。",
        e: "限定提供データは登録を要件としません。電磁的方法による相当量の蓄積と管理が要件です。",
      },
      english:
        "Limited provision data covers technical or business information provided to specified persons and accumulated and managed electronically in substantial volume, excluding trade secrets.",
      termIds: ["law-limited-provision-data", "law-trade-secret"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["不正競争防止法", "限定提供データ", "科目A"],
  },
  {
    id: "q-law-ip-005",
    part: "A",
    topicIds: ["law-ip", "law-standards-ethics"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "knowledge",
    stem: "購入したDVDに付されたコピープロテクトを外して、私的に複製する行為について、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "私的使用のための複製なので、常に適法である。",
      },
      {
        id: "i",
        text: "技術的保護手段の回避によって作成された複製は、私的使用目的でも許されない。",
      },
      {
        id: "u",
        text: "コピープロテクト外しは、著作権法とは無関係である。",
      },
      {
        id: "e",
        text: "一度購入すれば、複製・再配布を含め何でもできる。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "著作権法30条1項2号により、技術的保護手段の回避によって作成された複製は、私的使用目的でも許されません。",
      why: [
        "私的複製の例外は、技術的保護手段を回避しない複製に限られます。",
        "回避装置の提供や回避サービスは、不正競争防止法上の不正競争にもなり得ます。",
      ],
      optionNotes: {
        a: "私的使用目的でも、コピープロテクトを外して作成した複製は許されません。",
        i: "正解です。技術的保護手段の回避による複製は私的複製の例外から外れます。",
        u: "コピープロテクトは著作権法上の技術的保護手段として扱われ、回避には著作権法上の効果があります。",
        e: "購入しても著作権が移転するわけではなく、複製・再配布には制限があります。",
      },
      english:
        "Copies made by circumventing technological protection measures are not permitted even for private use under Article 30(1)(ii) of the Copyright Act.",
      termIds: ["law-technical-protection", "law-copyright"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["著作権法", "コピープロテクト", "科目A"],
  },
  {
    id: "q-law-ip-006",
    part: "A",
    topicIds: ["law-contract"],
    lessonIds: ["law/ip-contract"],
    difficulty: "easy",
    type: "knowledge",
    stem: "労働者派遣と請負の違いについて、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "労働者派遣では派遣先が労働者に指揮命令し、請負では注文者は請負人の労働者に指揮命令できない。",
      },
      {
        id: "i",
        text: "請負では、注文者が請負人の労働者に直接指揮命令できる。",
      },
      {
        id: "u",
        text: "労働者派遣では、派遣元が派遣先の業務について指揮命令する。",
      },
      {
        id: "e",
        text: "労働者派遣と請負は、指揮命令の点で法的に同じである。",
      },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "労働者派遣では派遣先が指揮命令し、請負では注文者は請負人の労働者に指揮命令できません。",
      why: [
        "派遣元は雇用主としての責任を負い、派遣先が日々の指揮命令を行います。",
        "請負の注文者が直接指示すると、偽装請負として労働者派遣法違反などが問題になります。",
      ],
      optionNotes: {
        a: "正解です。指揮命令の主体が異なります。",
        i: "請負の注文者は、請負人の労働者に直接指揮命令できません。",
        u: "派遣では派遣先が指揮命令します。派遣元は雇用主としての責任を負います。",
        e: "指揮命令の有無と主体が異なるため、法的に同じではありません。",
      },
      english:
        "In labor dispatch, the client directs the dispatched worker. In a contract for work, the client may not directly direct the contractor's workers.",
      termIds: [
        "law-labor-dispatch",
        "law-contract-for-work",
        "law-quasi-mandate",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["労働者派遣法", "請負", "科目A"],
  },
  {
    id: "q-law-ip-007",
    part: "A",
    topicIds: ["law-contract"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "knowledge",
    stem: "準委任契約の説明として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "仕事の完成義務を負う契約である。",
      },
      {
        id: "i",
        text: "事務の処理を目的とし、受託者は善管注意義務を負うが、仕事の完成義務は負わない。",
      },
      {
        id: "u",
        text: "労働者を派遣するための契約である。",
      },
      {
        id: "e",
        text: "著作権を譲渡するための契約である。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "準委任契約は事務の処理を目的とし、受託者は善管注意義務を負いますが、仕事の完成義務は負いません。",
      why: [
        "請負契約は仕事の完成を目的とし、請負人が完成義務を負います。",
        "アジャイル開発や運用保守など、仕様を事前に確定しにくい業務では準委任が適します。",
      ],
      optionNotes: {
        a: "仕事の完成義務を負うのは請負契約です。",
        i: "正解です。準委任は事務の処理を目的とし、完成義務を負いません。",
        u: "労働者を派遣する契約は労働者派遣契約です。",
        e: "著作権の譲渡は、著作権譲渡契約で行います。",
      },
      english:
        "A quasi-mandate contract covers the performance of services. The entrusted party owes a duty of care but not an obligation to complete a specific deliverable.",
      termIds: ["law-quasi-mandate", "law-contract-for-work"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["民法", "準委任", "科目A"],
  },
  {
    id: "q-law-ip-008",
    part: "B",
    topicIds: ["law-contract"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社は、B社にシステム開発を請負契約で発注した。しかし、A社の社員がB社の開発者に対して日々の作業手順を細かく指示し、勤怠管理もA社が行っていた。この状況の法的評価として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "請負契約である以上、A社が作業者に指示しても適法である。",
      },
      {
        id: "i",
        text: "実態が労働者派遣に該当し、偽装請負として労働者派遣法違反などが問題になる。",
      },
      {
        id: "u",
        text: "準委任契約なので、A社の指示は問題にならない。",
      },
      {
        id: "e",
        text: "請負契約では、注文者が勤怠管理を行うことが義務付けられている。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "請負契約でありながら、注文者が請負人の労働者に直接指揮命令し、勤怠管理まで行っているため、実態は労働者派遣に近く、偽装請負として問題になります。",
      why: [
        "請負では、注文者は請負人の労働者に指揮命令できません。",
        "請負人は自社の労働者を指揮命令し、注文者は成果物の検査・確認にとどめる必要があります。",
      ],
      optionNotes: {
        a: "請負契約であっても、注文者が請負人の労働者に直接指揮命令することはできません。",
        i: "正解です。指揮命令の実態から偽装請負が問題になります。",
        u: "準委任でも、委託者が受託者の労働者に指揮命令するものではありません。また、本件は請負契約です。",
        e: "請負の注文者に、請負人労働者の勤怠管理を行う義務はありません。",
      },
      english:
        "If the client directly directs the contractor's workers and manages their attendance, the arrangement may be treated as disguised dispatch in violation of the Workers Dispatch Act.",
      termIds: [
        "law-contract-for-work",
        "law-labor-dispatch",
        "law-quasi-mandate",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["偽装請負", "労働者派遣法", "科目B"],
  },
  {
    id: "q-law-ip-009",
    part: "B",
    topicIds: ["law-contract", "law-standards-ethics"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "scenario",
    stem: "A社はB社に業務システムの開発を委託したが、契約書に著作権の帰属を定めていなかった。B社は成果物を他社向けに再利用し、A社から預かった業務ノウハウも外部に開示した。この状況の法的評価として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "著作権は常に発注者であるA社に移転する。",
      },
      {
        id: "i",
        text: "契約で定めなければ著作権は受託者であるB社に帰属し、再利用を防ぐには契約で定める必要がある。",
      },
      {
        id: "u",
        text: "著作権は必ずA社とB社の共有になる。",
      },
      {
        id: "e",
        text: "秘密保持契約を結んでいなければ、B社が業務ノウハウを外部に開示しても法的責任は生じない。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "著作権は原則として創作した者に帰属します。委託開発で帰属を定めなければ、受託者であるB社に帰属します。",
      why: [
        "著作権の帰属や利用許諾の範囲は、契約で明確に定める必要があります。",
        "業務ノウハウの開示は、NDAや営業秘密の管理措置の有無によって、不正競争防止法上の責任が問題になります。",
      ],
      optionNotes: {
        a: "著作権は、契約で譲渡しない限り、原則として創作した受託者に帰属します。",
        i: "正解です。帰属を定めていない場合、著作権は受託者に帰属します。",
        u: "契約で定めがなければ、当然に共有になるわけではありません。",
        e: "NDAがなくても守秘義務が問題になる場合はありますが、法的責任が生じないわけではありません。営業秘密の管理措置や契約の有無が重要です。",
      },
      english:
        "Without a contractual assignment, copyright in commissioned work generally remains with the contractor. Ownership, licensing, and confidentiality must be addressed in the contract.",
      termIds: ["law-copyright", "law-nda", "law-trade-secret"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["著作権", "委託開発", "NDA", "科目B"],
  },
  {
    id: "q-law-ip-010",
    part: "B",
    topicIds: ["law-standards-ethics"],
    lessonIds: ["law/ip-contract"],
    difficulty: "medium",
    type: "scenario",
    stem: "青少年向けのSNSを運営するD社では、事実と異なる情報の拡散と、青少年に不適切な情報への接触が課題になっている。D社の対応として、最も適切なものはどれか。",
    options: [
      {
        id: "a",
        text: "デファクト標準は公的な標準化機関が定めた標準なので、それに従えば誤情報はなくなる。",
      },
      {
        id: "i",
        text: "情報源の確認やファクトチェックの仕組みを整え、青少年向けにはフィルタリングや利用時間の制限を組み合わせる。",
      },
      {
        id: "u",
        text: "フィルタリングは著作権侵害だけを防ぐ技術であり、青少年保護には役立たない。",
      },
      {
        id: "e",
        text: "フェイクニュースはすべて違法であるため、投稿者を一律に処罰すればよい。",
      },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "誤情報対策としては情報源の確認・ファクトチェック・メディアリテラシーの向上が有効です。青少年保護には、フィルタリングや利用制限を組み合わせます。",
      why: [
        "フェイクニュースには、誤って広がる誤情報と、意図的に流される偽情報があります。",
        "フィルタリングは、URL・DNS・パケットなどのレベルで不適切な情報への接触を制限する技術です。",
      ],
      optionNotes: {
        a: "デファクト標準は市場の普及によって成立した標準であり、公的機関が定めた標準ではありません。また、標準化だけで誤情報がなくなるわけではありません。",
        i: "正解です。ファクトチェックとフィルタリング・利用制限を組み合わせます。",
        u: "フィルタリングは、著作権侵害だけでなく、有害情報や不適切なコンテンツへの接触を制限するためにも使われます。",
        e: "フェイクニュースのすべてが違法なわけではありません。表現の自由とのバランスを踏まえ、内容と態様に応じて判断します。",
      },
      english:
        "Countering misinformation requires source verification, fact-checking, and media literacy. Youth protection combines filtering with usage limits and other measures.",
      termIds: [
        "law-fake-news",
        "law-de-facto-standard",
        "law-de-jure-standard",
        "law-engineering-ethics",
      ],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["フェイクニュース", "フィルタリング", "標準化", "科目B"],
  },
];
