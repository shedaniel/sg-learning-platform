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

function build(s: Spec): Question {
  let options: { id: OptionId; text: string }[];
  const notes: Partial<Record<OptionId, string>> = {};
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
    lessonIds: ["risk/response-continuity"],
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
  // ===== risk-response =====
  {
    id: "q-risk-ext-001",
    topics: ["risk-response"],
    diff: "medium",
    part: "A",
    stem: "リスク受容の進め方として、適切でないものはどれか。",
    ok: "リスクレベルが受容基準を超えているが、対応予算を確保できないため、責任者の承認を得ずに現状のまま放置する",
    ng: [
      "リスクレベルが受容基準以下であることを確認し、リスク所有者の承認を得て、受容の根拠を記録する",
      "受容したリスクを残留リスクとして管理し、状況の変化に備えて定期的に再評価する",
      "対応のコストが想定される損失を上回る小さなリスクについて、経営判断として受容を決定する",
    ],
    at: "e",
    okNote: "この進め方は適切でない。受容基準を超えるリスクは、追加の対応を検討するか、責任者が根拠を示して承認する必要がある。承認や記録のない放置は、受容ではない。",
    ngNotes: [
      "適切な進め方である。基準との比較、権限のある者の承認、根拠の記録が、受容の要件である。",
      "適切な進め方である。受容したリスクも残留リスクとして管理し、再評価の対象にする。",
      "適切な進め方である。費用対効果の面から、小さなリスクを受容することは合理的である。",
    ],
    correct: "受容基準を超えるリスクを、承認なしに放置するのは受容ではなく、適切でない。",
    why: [
      "リスク受容は、基準との比較、責任者の承認、根拠の記録を伴う意思決定である。",
      "基準を超えるリスクは、低減・移転・回避の追加的な対応を検討する。",
    ],
    en: "Risk acceptance requires comparison with criteria, approval by an accountable owner, and documentation. Leaving a risk above criteria unapproved is neglect, not acceptance.",
    terms: ["risk-acceptance", "risk-acceptance-criteria", "risk-residual"],
    tags: ["リスク受容", "残留リスク"],
  },
  {
    id: "q-risk-ext-002",
    topics: ["risk-response"],
    diff: "easy",
    part: "A",
    stem: "リスクファイナンシングに該当するものはどれか。",
    ok: "情報漏えいなどの損失に備えて、準備金（引当金）を積み立てる",
    ng: [
      "重要な通信に多要素認証を導入する",
      "従業員に標的型攻撃メールの訓練を行う",
      "バックアップを取得し、復旧手順を整備する",
    ],
    at: "i",
    okNote: "リスクファイナンシングは、損失が発生したときの資金的な負担に備える手段であり、保険や準備金がその例である。",
    ngNotes: [
      "発生の可能性を下げるリスクコントロール（予防）である。",
      "従業員の行動を改善して発生可能性を下げる、リスクコントロール（予防）である。",
      "被害を戻すためのリスクコントロール（是正）である。",
    ],
    correct: "損失に備えて準備金を積み立てることは、資金面に備えるリスクファイナンシングである。",
    why: [
      "リスクコントロールは、損失の発生や拡大を防ぐ手段である。",
      "リスクファイナンシングは、損失に伴う資金負担への備えであり、事故そのものは防がない。",
    ],
    en: "Risk financing prepares funds for losses, for example through reserves or insurance. Authentication, training, and backups are risk control measures.",
    terms: ["risk-financing", "risk-control", "risk-cyber-insurance"],
    tags: ["リスクファイナンシング", "リスクコントロール"],
  },
  {
    id: "q-risk-ext-003",
    topics: ["risk-response"],
    diff: "hard",
    part: "B",
    stem: "年間予想損失額（ALE）と年間の対策費用の合計が最小になる選択として、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "ある情報資産のリスクについて、単一損失期待額（SLE）は3,000万円、年間発生率（ARO）は0.2である。対策XとYの費用と効果を表に示す。",
      },
      {
        type: "table",
        headers: ["案", "年間の対策費用", "効果"],
        rows: [
          ["対策X", "200万円", "AROを0.05に下げる（SLEは3,000万円のまま）"],
          ["対策Y", "100万円", "SLEを2,000万円に下げる（AROは0.2のまま）"],
          ["対策XとYの両方", "300万円", "AROを0.05に、SLEを2,000万円に下げる"],
          ["対策なし（受容）", "0円", "―"],
        ],
      },
    ],
    fixed: {
      opts: [
        "対策Xのみを実施する",
        "対策Yのみを実施する",
        "対策XとYの両方を実施する",
        "対策を行わず、リスクを受容する",
      ],
      notes: [
        "正解である。ALEは3,000万円×0.05＝150万円で、対策費用200万円を加えて合計350万円となり、最小である。",
        "ALEは2,000万円×0.2＝400万円で、対策費用100万円を加えて合計500万円となり、最小ではない。",
        "ALEは2,000万円×0.05＝100万円で、対策費用300万円を加えて合計400万円となり、Xのみより高い。",
        "ALEは3,000万円×0.2＝600万円で、合計も600万円となり、最小ではない。",
      ],
      ans: "a",
    },
    correct: "合計は、Xのみ350万円、Yのみ500万円、両方400万円、対策なし600万円であり、Xのみが最小である。",
    why: [
      "ALEは、SLE×AROで求める。対策後のALEに年間の対策費用を加えて比較する。",
      "対策を追加すれば必ず得になるわけではなく、費用対効果で判断する。",
    ],
    en: "Total cost = residual ALE + annual control cost. X alone gives 150 + 200 = 350 (million yen), the lowest; Y alone 500, both 400, none 600.",
    terms: ["risk-ale", "risk-reduction", "risk-acceptance"],
    tags: ["ALE", "費用対効果", "科目B"],
  },
  {
    id: "q-risk-ext-004",
    topics: ["risk-response"],
    diff: "medium",
    part: "B",
    stem: "ア〜エの対応を、リスク対応の分類に当てはめたときの組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "A社は、リスクアセスメントの結果を受けて、次の4つの対応を決定した。",
      },
      {
        type: "list",
        items: [
          "ア　個人情報を大量に収集する新機能について、リスクが大きいため、提供を取りやめる。",
          "イ　保存する個人情報を暗号化し、アクセス権限を限定する。",
          "ウ　情報漏えいの際の賠償金に備えて、サイバー保険に加入する。",
          "エ　発生可能性も影響も小さく、対応のコストが損失を上回るリスクについて、経過を観察する。",
        ],
      },
    ],
    fixed: {
      opts: [
        "ア：低減　イ：回避　ウ：移転　エ：受容",
        "ア：回避　イ：低減　ウ：受容　エ：移転",
        "ア：回避　イ：低減　ウ：移転　エ：受容",
        "ア：低減　イ：回避　ウ：受容　エ：移転",
      ],
      notes: [
        "アとイが入れ替わっている。提供の取りやめは回避、暗号化と権限の限定は低減である。",
        "ウとエが入れ替わっている。保険は移転、経過観察は受容である。",
        "正解である。アは活動をやめる回避、イは管理策で可能性や影響を下げる低減、ウは損失の金銭的負担を移す移転、エは受け入れる受容である。",
        "いずれも入れ替わっている。アは回避、イは低減、ウは移転、エは受容である。",
      ],
      ans: "u",
    },
    correct: "アは回避、イは低減、ウは移転、エは受容である。",
    why: [
      "リスクを生む活動をやめるのが回避、管理策で下げるのが低減、金銭的負担を第三者に移すのが移転、そのまま受け入れるのが受容である。",
      "移転は保険などで負担を移すものであり、リスクそのものが消えるわけではない。",
    ],
    en: "A: avoidance, B: reduction, C: transfer, D: acceptance. Each of the four treatment options is matched to its defining feature.",
    terms: ["risk-avoidance", "risk-reduction", "risk-transfer", "risk-acceptance"],
    tags: ["リスク対応", "4分類", "科目B"],
  },

  // ===== risk-continuity =====
  {
    id: "q-risk-ext-005",
    topics: ["risk-continuity"],
    diff: "easy",
    part: "A",
    stem: "復旧計画の説明として、最も適切なものはどれか。",
    ok: "被害を受けたシステムやデータを元に戻すための手順、順序、担当、必要な資源を定める",
    ng: [
      "インシデント発生直後の初動、連絡、被害拡大の防止を定める",
      "事業全体の継続戦略と体制、代替手段を定める",
      "中断が事業に与える影響を分析し、復旧の優先順位を決める",
    ],
    at: "u",
    okNote: "復旧計画は、システムとデータを元の状態に戻す手順や順序を、具体的に定める。",
    ngNotes: [
      "緊急時対応計画の説明である。",
      "BCP（事業継続計画）の説明である。",
      "BIA（ビジネスインパクト分析）の説明である。",
    ],
    correct: "復旧計画は、被害を受けたシステムやデータを元に戻すための手順などを定める。",
    why: [
      "緊急時対応計画は初動、復旧計画は復旧、BCPは事業全体の継続を扱う。",
      "BIAは、これらの計画の目標や優先順位を決める前提になる分析である。",
    ],
    en: "A recovery plan defines the steps, order, owners, and resources to restore systems and data. The others describe emergency response, BCP, and BIA.",
    terms: ["risk-bia", "risk-rto"],
    tags: ["復旧計画", "BCP"],
  },
  {
    id: "q-risk-ext-006",
    topics: ["risk-continuity"],
    diff: "medium",
    part: "A",
    stem: "RPOを15分以内にしたいシステムのバックアップ方式として、最も適切なものはどれか。",
    ok: "更新データを15分以内の間隔で別の場所へ複製する（レプリケーションなど）",
    ng: [
      "毎週日曜日にフルバックアップを取得する",
      "毎日深夜に差分バックアップを取得する",
      "月末に全データをテープに保存して、遠隔地に搬送する",
    ],
    at: "a",
    okNote: "RPOは、どの時点までのデータを復旧できるかの目標である。15分以内のRPOには、更新を15分以内の間隔で複製する必要がある。",
    ngNotes: [
      "最大で1週間分のデータが失われうるため、RPO15分を満たせない。",
      "最大で1日分のデータが失われうるため、RPO15分を満たせない。",
      "最大で1か月分のデータが失われうる。遠隔地への保管は災害対策には有効だが、RPOの短縮にはならない。",
    ],
    correct: "RPO15分には、更新を15分以内の間隔で複製する方式が必要である。",
    why: [
      "RPOは、最後のバックアップ時点から障害発生までの間に失われうるデータの量に対応する。",
      "RPOを短くするほど、取得の頻度が上がり、費用も増える。",
    ],
    en: "RPO is bounded by the interval between copies. A 15-minute RPO requires replication or backups at least every 15 minutes.",
    terms: ["risk-rpo", "risk-backup"],
    tags: ["RPO", "バックアップ"],
  },
  {
    id: "q-risk-ext-007",
    topics: ["risk-continuity"],
    diff: "medium",
    part: "A",
    stem: "最大許容中断時間（MTPD）と目標復旧時間（RTO）の関係として、最も適切なものはどれか。",
    ok: "RTOは、MTPDを超えないように設定する",
    ng: [
      "RTOは、MTPDより必ず長く設定する",
      "MTPDは、バックアップの取得間隔によって決まる",
      "MTPDとRTOは同じ意味であり、どちらも目標復旧時点を表す",
    ],
    at: "e",
    okNote: "MTPDは事業として許容できる中断の上限であり、RTOはその範囲内に復旧を終えるための目標時間である。",
    ngNotes: [
      "RTOがMTPDより長いと、事業が許容できない時間まで中断することになる。",
      "バックアップの取得間隔と関係するのは、目標復旧時点（RPO）である。MTPDは事業への影響から決まる。",
      "目標復旧時点はRPOである。MTPDは最大許容中断時間、RTOは目標復旧時間であり、同じ意味ではない。",
    ],
    correct: "RTOは、事業が許容できる最大の中断時間（MTPD）を超えないように設定する。",
    why: [
      "BIAで業務ごとにMTPDを定め、それを超えないようにRTOを設定する。",
      "RTOを満たせない場合は、復旧手段の強化や代替手段の整備が必要になる。",
    ],
    en: "RTO must be set within the maximum tolerable period of disruption (MTPD). RPO, not MTPD, relates to backup intervals.",
    terms: ["risk-rto", "risk-bia"],
    tags: ["MTPD", "RTO", "BIA"],
  },
  {
    id: "q-risk-ext-008",
    topics: ["risk-continuity"],
    diff: "hard",
    part: "A",
    stem: "あるシステムは、毎週日曜日にフルバックアップを取得し、月曜から水曜の毎日深夜に増分バックアップを取得している。木曜の朝に障害でデータが失われたとき、復旧に必要なバックアップの組合せとして、最も適切なものはどれか。ただし、増分バックアップは、直前のバックアップからの変更分を取得するものとする。",
    ok: "日曜のフルバックアップと、月曜・火曜・水曜の増分バックアップ3つ（計4つ）",
    ng: [
      "日曜のフルバックアップのみ",
      "日曜のフルバックアップと、水曜の増分バックアップ",
      "水曜の増分バックアップのみ",
    ],
    at: "u",
    okNote: "増分バックアップは直前のバックアップからの変更分だけを持つため、フルバックアップを起点に、取得順にすべての増分を適用する必要がある。",
    ngNotes: [
      "日曜のフルバックアップだけでは、月曜から水曜に更新されたデータが復旧できない。",
      "水曜の増分には、水曜分の変更しか含まれない。月曜と火曜の増分が欠けると、その間の更新が復旧できない。",
      "水曜の増分には変更分しかなく、元になるフルバックアップがなければ復旧できない。",
    ],
    correct: "増分バックアップでは、フルバックアップと、その後のすべての増分を順に適用する。",
    why: [
      "増分は、取得に必要な時間と容量が小さいが、復旧には複数のバックアップが必要で時間がかかる。",
      "差分バックアップなら、フルバックアップと最新の差分の2つで復旧できる。",
    ],
    en: "Incremental backups hold only changes since the previous backup, so restoring needs the full backup plus every incremental in order.",
    terms: ["risk-backup", "risk-rto"],
    tags: ["バックアップ", "増分", "復旧"],
  },
  {
    id: "q-risk-ext-009",
    topics: ["risk-continuity"],
    diff: "medium",
    part: "B",
    stem: "BIAの結果として、最優先で復旧の体制や手段を見直す必要があるシステムとその理由の組合せとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "B社は、BIAによって各システムの最大許容中断時間（MTPD）を定め、現在の復旧体制で見込まれるRTOと比較した。",
      },
      {
        type: "table",
        headers: ["システム", "最大許容中断時間（MTPD）", "現在のRTO"],
        rows: [
          ["受注管理システム", "4時間", "8時間"],
          ["経費精算システム", "72時間", "24時間"],
          ["会計システム", "24時間", "12時間"],
        ],
      },
    ],
    ok: "受注管理システム：RTOがMTPDを超えているため、復旧手段の強化などによってRTOを短縮する必要がある",
    ng: [
      "経費精算システム：RTOがMTPDより短く、余裕がありすぎるため、バックアップを廃止する必要がある",
      "会計システム：MTPDが短いため、RTOをMTPDと同じ24時間に延ばして、余裕を持たせる必要がある",
      "三つともRTOとMTPDに関する問題はないため、見直しは不要である",
    ],
    at: "i",
    okNote: "受注管理システムは、RTOの8時間がMTPDの4時間を超えており、許容できない中断が生じるおそれがある。",
    ngNotes: [
      "RTOがMTPDより短いのは、望ましい状態である。バックアップの廃止は、復旧を不可能にする。",
      "RTOを延ばすと、MTPDとの余裕がなくなり、対策が後退する。現在のRTOはMTPD以内であり、問題はない。",
      "受注管理システムではRTOがMTPDを超えており、見直しが必要である。",
    ],
    correct: "RTOがMTPDを超えている受注管理システムが、最優先で見直しの対象になる。",
    why: [
      "RTOは、MTPDを超えないことが条件である。",
      "超えている場合は、復旧手段の強化、冗長化、代替手段の整備などを検討する。",
    ],
    en: "The order management system's RTO (8h) exceeds its MTPD (4h). It must be improved first. The others already meet MTPD.",
    terms: ["risk-bia", "risk-rto"],
    tags: ["BIA", "RTO", "科目B"],
  },
  {
    id: "q-risk-ext-010",
    topics: ["risk-continuity"],
    diff: "hard",
    part: "B",
    stem: "見直しとして、最も適切なものはどれか。",
    pres: [
      {
        type: "p",
        text: "C社は、本社ビル内のサーバ室で基幹システムを運用している。バックアップは毎晩、同じサーバ室内のストレージに保存している。BIAでは、基幹システムのRTOは24時間、RPOは24時間とされている。地震によって本社ビルが使えなくなると、現状では、本番データもバックアップも同時に失われると指摘された。",
      },
    ],
    ok: "バックアップを、被災しにくい遠隔地や別のクラウド領域にも保存し、そこから代替環境へ復旧する手順を、RTO内に終えられるか訓練で確認する",
    ng: [
      "同じサーバ室内で、バックアップの世代数を増やし、保存期間を延ばす",
      "同じサーバ室内で、バックアップを別のラックのストレージにも複製する",
      "本番サーバを同じサーバ室内で冗長化し、片系の障害に備える",
    ],
    at: "u",
    okNote: "災害でサーバ室ごと失われても、遠隔地のバックアップから復旧できる。訓練で、RTO内に復旧できることまで確認する。",
    ngNotes: [
      "保存先が同じ場所である限り、建物が使えなくなると、世代数を増やしても同時に失われる。",
      "同じサーバ室の別のラックでは、地震や火災などサーバ室全体の被災を防げない。",
      "同じ場所での冗長化は、機器の故障には有効だが、建物ごと被災する場合には効果がない。",
    ],
    correct: "バックアップを遠隔地や別のクラウド領域にも持ち、そこからの復旧手順を訓練で検証することが適切である。",
    why: [
      "災害対策では、本番データとバックアップを同じ被災範囲に置かないことが基本である。",
      "RTO・RPOを満たせるかどうかは、手順を実際に試すことで確認できる。",
    ],
    en: "Keep backups off-site or in a separate cloud region and rehearse restoring to an alternate environment within the RTO. Same-site copies fail together in a disaster.",
    terms: ["risk-backup", "risk-rto", "risk-rpo"],
    tags: ["BCP", "遠隔地バックアップ", "科目B"],
  },
];

export const questionsExtra: Question[] = specs.map(build);
