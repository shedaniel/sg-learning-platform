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
    id: `q-org-ext-${String(s.n).padStart(3, "0")}`,
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
  // ── org/human ────────────────────────────────────────────────
  mk({
    n: 1,
    part: "A",
    topicIds: ["org-human"],
    lessonId: "org/human",
    difficulty: "easy",
    stem: "情報セキュリティの机上演習の説明として、最も適切なものはどれか。",
    right:
      "実際のシステムを止めずに、想定したシナリオに沿って関係者が判断・連絡・手順をたどり、役割や手順の不備を洗い出す。",
    pos: "u",
    wrong: [
      "本番環境に擬似的な攻撃を行い、システムの防御設備が実際に破られるかどうかを技術的に検証する。",
      "規程や脅威に関する知識を問う理解度テストを実施し、合格点に満たない従業者に再受講を課す。",
      "事故を起こした従業者に対し、事実確認と弁明の機会を経て、就業規則に基づく処分を決定する。",
    ],
    correct:
      "机上演習は、システムを止めずに、シナリオに沿って関係者が「誰が・いつ・何を判断するか」をたどる訓練である。",
    why: [
      "手順書の役割が実際の組織や権限と合っているか、連絡先が最新かといった不備を、低コストで洗い出せる。",
      "知識の確認は教育、実環境での技術検証は侵入テストなどの別の活動である。",
    ],
    rightNote: "正解である。システムを止めずに判断・連絡・手順を確認する。",
    wrongNotes: [
      "本番環境への擬似攻撃は、侵入テストなどの技術検証であり、机上演習ではない。",
      "理解度テストによる知識の確認は教育の評価であり、行動や手順を確かめる演習ではない。",
      "処分の決定は事故後の人事手続であり、演習とは目的も手続も異なる。",
    ],
    english:
      "A tabletop exercise walks stakeholders through a scenario on paper without disrupting systems, exposing gaps in roles and procedures.",
    termIds: ["org-tabletop-exercise", "org-security-awareness"],
    tags: ["机上演習", "訓練"],
  }),
  mk({
    n: 2,
    part: "A",
    topicIds: ["org-human"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "情報セキュリティ教育の計画として、最も適切なものはどれか。",
    right:
      "経営層、開発者、一般の従業者、委託先など対象ごとに内容と頻度を変え、実施記録と効果の確認結果を残す。",
    pos: "a",
    wrong: [
      "全員に同じ内容の教育を年1回実施し、受講率が100%であることをもって対策が有効であると判断する。",
      "経営層は専門知識を持つため教育の対象から外し、現場の従業者だけを対象にする。",
      "委託先の従業者は自社の従業者ではないため、委託元は教育の実施を求めず、委託先の判断に任せる。",
    ],
    correct:
      "教育は対象者の役割に応じて内容と頻度を変え、実施記録と効果の確認を残して初めて計画として機能する。",
    why: [
      "経営層にはリスク判断と資源配分、開発者には安全な実装、委託先には契約に基づく教育がそれぞれ必要である。",
      "受講率は活動量であり、行動の変化や統制の有効性を直接示さない。",
    ],
    rightNote: "正解である。対象別に設計し、記録と効果確認まで行う。",
    wrongNotes: [
      "受講率100%は実施の事実にすぎず、行動の変化を示さない。役割別の設計も欠けている。",
      "経営層にはリスク判断や資源配分に関する教育が必要であり、対象から外すのは不適切である。",
      "委託先の従業者にも契約に基づく教育が必要であり、委託元が求めずに任せきりにするのは不適切である。",
    ],
    english:
      "Security education should be tailored by audience, with records and effectiveness checks, not just a completion rate.",
    termIds: ["org-security-awareness", "org-outsourcing"],
    tags: ["教育設計", "対象別教育"],
  }),
  mk({
    n: 3,
    part: "A",
    topicIds: ["org-human"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "内部不正が起きる要因である「機会」「動機」「正当化」と、それぞれを減らす対策の組合せとして、最も適切なものはどれか。",
    right:
      "機会：特権操作のログを独立した者が確認する／動機：不満や負担を相談できる窓口を設ける／正当化：不正は許されないという規程と懲戒基準を示し、倫理教育を行う",
    pos: "e",
    wrong: [
      "機会：不正は許されないという規程と懲戒基準を示し、倫理教育を行う／動機：特権操作のログを独立した者が確認する／正当化：不満や負担を相談できる窓口を設ける",
      "機会：不満や負担を相談できる窓口を設ける／動機：不正は許されないという規程と懲戒基準を示し、倫理教育を行う／正当化：特権操作のログを独立した者が確認する",
      "機会：特権操作のログを独立した者が確認する／動機：不正は許されないという規程と懲戒基準を示し、倫理教育を行う／正当化：不満や負担を相談できる窓口を設ける",
    ],
    correct:
      "機会はログ確認や権限管理などの統制で、動機は相談窓口や適正な処遇で、正当化は規程の明示と倫理教育で減らす。",
    why: [
      "機会は不正を実行できる状況であり、構造的統制と独立したレビューで狭める。",
      "動機は不満や負担などの内的要因であり、相談窓口や処遇の見直しで和らげる。",
      "正当化は「自分は悪くない」と考える理由付けであり、規程と懲戒基準の明示、倫理教育で崩す。",
    ],
    rightNote: "正解である。3要素に対応する対策が正しく結び付いている。",
    wrongNotes: [
      "倫理教育は正当化への対策であり、機会を減らす統制ではない。3要素が全て入れ替わっている。",
      "相談窓口は動機への対策であり、機会に結び付けるのは誤りである。ログ確認は機会への対策である。",
      "倫理教育と規程の明示は正当化への対策であり、動機に結び付けるのは誤りである。相談窓口も正当化への対策ではない。",
    ],
    english:
      "Opportunity is reduced by controls and log review, motivation by support channels, and rationalization by clear rules and ethics education.",
    termIds: ["org-insider-fraud", "org-separation-of-duties"],
    tags: ["内部不正", "不正のトライアングル"],
  }),
  mk({
    n: 4,
    part: "A",
    topicIds: ["org-human", "org-hr"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "「セキュリティクリアランス」「ニード・トゥ・ノウ」「最小権限の原則」の説明の組合せとして、最も適切なものはどれか。",
    right:
      "クリアランス：情報の重要度に応じて取扱いを許す者を審査・認定する／ニード・トゥ・ノウ：認定済みでも、業務上知る必要のある情報だけに限る／最小権限：業務の遂行に必要な最小限の権限だけを付与する",
    pos: "i",
    wrong: [
      "クリアランス：業務上知る必要のある情報だけに限る／ニード・トゥ・ノウ：情報の重要度に応じて取扱いを許す者を審査・認定する／最小権限：業務の遂行に必要な最小限の権限だけを付与する",
      "クリアランス：業務の遂行に必要な最小限の権限だけを付与する／ニード・トゥ・ノウ：情報の重要度に応じて取扱いを許す者を審査・認定する／最小権限：認定済みでも、業務上知る必要のある情報だけに限る",
      "クリアランス：管理職に一律で最上位の取扱い資格を与える／ニード・トゥ・ノウ：認定済みでも、業務上知る必要のある情報だけに限る／最小権限：業務の遂行に必要な最小限の権限だけを付与する",
    ],
    correct:
      "クリアランスは取扱い資格の認定、ニード・トゥ・ノウは業務上の必要性による限定、最小権限は付与する権限の最小化である。",
    why: [
      "クリアランスは「誰に取扱いを許すか」を情報の重要度に応じて決める仕組みで、異動や退職のたびに見直す。",
      "資格があっても、業務上必要のない情報は見せないのがニード・トゥ・ノウである。",
    ],
    rightNote: "正解である。3つの概念が正しく対応している。",
    wrongNotes: [
      "クリアランスとニード・トゥ・ノウの説明が入れ替わっている。",
      "3つの説明が入れ替わっており、最小権限をニード・トゥ・ノウの説明にしている点も誤りである。",
      "クリアランスは役職ではなく情報の重要度と必要性に基づいて認定するため、管理職への一律付与は誤りである。",
    ],
    english:
      "Clearance qualifies who may handle information, need-to-know restricts it to work requirements, and least privilege minimizes granted rights.",
    termIds: ["org-security-clearance", "org-need-to-know", "org-least-privilege"],
    tags: ["クリアランス", "最小権限"],
  }),
  mk({
    n: 5,
    part: "B",
    topicIds: ["org-human"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "C社は、ランサムウェア感染を想定した机上演習を行い、次の課題が見つかった。C社の対応として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "C社の情報セキュリティインシデント対応手順書には、「システム停止の判断者は情報システム部長とする」と記載されている。机上演習の参加者が確認したところ、次の事実が分かった。",
      },
      {
        type: "list",
        items: [
          "情報システム部長は昨年度の組織変更で異動しており、後任はまだ決まっていない。",
          "手順書に載っている委託先（運用保守）の緊急連絡先は、すでに使われていない番号だった。",
          "経営層への報告の基準は、手順書には書かれていなかった。",
        ],
      },
    ],
    right:
      "手順書の役割と連絡先を現行の組織・権限に合わせて更新し、報告基準も明記する。課題は担当者と期限を付けて記録し、次回の演習や監査で改善状況を確認する。",
    pos: "a",
    wrong: [
      "演習は最後まで進められたので、結果は共有せず、手順書の内容は据え置く。",
      "後任が決まるまで判断者欄は空欄とし、実際のインシデント時にその場で決める。",
      "異動した前部長が手順書を更新しなかったことを理由に、懲戒処分を検討する。",
    ],
    correct:
      "机上演習の目的は不備の発見と改善であり、見つかった課題を更新・記録し、改善まで確認することが適切である。",
    why: [
      "判断者や連絡先が不明なままでは、実際のインシデントで初動が遅れる。",
      "課題を担当と期限に落とし、次回の演習や監査で確認しないと、毎年同じ発見を繰り返す。",
    ],
    rightNote: "正解である。更新・記録・改善確認までを行う。",
    wrongNotes: [
      "結果を共有せず据え置くと、判断者不在という重大な不備が放置される。",
      "判断者を決めずに本番を迎えると、初動が遅れる。手順書は事前に整備すべきである。",
      "訓練の目的は個人の処分ではなく手順の改善である。処分の検討は報告や改善を妨げる。",
    ],
    english:
      "Gaps found in a tabletop exercise should be fixed, recorded with owners and deadlines, and verified later, not punished.",
    termIds: ["org-tabletop-exercise"],
    tags: ["机上演習", "科目B"],
  }),
  mk({
    n: 6,
    part: "B",
    topicIds: ["org-human", "org-hr"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "F社が情報漏えいを防ぐために採るべき対策のうち、適切なものだけを挙げた組合せはどれか。",
    presentation: [
      {
        type: "p",
        text: "F社の営業担当のE氏は来月末に退職する予定であり、競合他社へ転職するという噂がある。現状は次のとおりである。",
      },
      {
        type: "list",
        items: [
          "E氏は顧客管理システムで、全顧客のデータを参照・ダウンロードできる。",
          "ダウンロードや外部サービスへの送信のログは取得しているが、誰もレビューしていない。",
          "E氏から、秘密保持に関する誓約書は取得していない。",
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          "a: 顧客データのダウンロードや外部送信のログを、業務部門から独立した者（情報セキュリティ部門など）がレビューする。",
          "b: E氏の権限を業務上必要な範囲に見直し、退職日にはすべてのアカウントを失効させる。",
          "c: 噂の真偽を確かめるため、E氏の私用スマートフォンの内容を、本人の同意なく確認する。",
          "d: 秘密の範囲と、退職後も義務が続くことを明記した秘密保持の誓約を取得する。",
        ],
      },
    ],
    right: "a、b、d",
    pos: "e",
    wrong: ["a、c、d", "b、c、d", "a、b、c"],
    correct:
      "ログの独立したレビュー、権限の見直しと退職時の失効、秘密保持の誓約が適切であり、私用端末の無断確認は不適切である。",
    why: [
      "退職予定者は動機が生じやすいため、機会を減らす統制（権限の最小化とログ確認）と、義務の明確化を組み合わせる。",
      "同意のない私用端末の確認は、プライバシーを侵害し、法的にも問題となる。",
    ],
    rightNote: "正解である。a、b、dが適切で、cは不適切である。",
    wrongNotes: [
      "cが含まれている。同意のない私用端末の確認は不適切である。また、権限の見直しと失効（b）が欠けている。",
      "cが含まれている。また、独立したログレビュー（a）が欠けている。",
      "cが含まれている。また、秘密保持の誓約（d）が欠けている。",
    ],
    english:
      "For a departing employee, review logs independently, trim and revoke access, and obtain a confidentiality pledge; do not inspect private devices without consent.",
    termIds: ["org-insider-fraud", "org-nda", "org-employment-lifecycle"],
    tags: ["内部不正", "退職", "科目B"],
  }),
  // ── org/human (人事) ─────────────────────────────────────────
  mk({
    n: 7,
    part: "A",
    topicIds: ["org-hr"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "人事異動に伴うアクセス権の扱いとして、最も適切なものはどれか。",
    right:
      "人事の発令情報をシステム管理者に連携し、旧部署の権限を失効したうえで、新部署の業務に必要な権限を改めて付与する。",
    pos: "u",
    wrong: [
      "新部署の権限を追加し、旧部署の権限は引継ぎが終わるまで半年間そのまま残す。",
      "異動した本人が不要になった権限を申告するまで、システム管理者は権限を変更しない。",
      "権限の見直しは年1回の棚卸しに任せ、異動時の個別の手続は設けない。",
    ],
    correct:
      "異動時は、旧権限を失効し、新しい業務に必要な権限を再設計して付与する。人事とシステム管理の連携が前提になる。",
    why: [
      "異動では前の部署の権限が残りやすく、不要な権限が内部不正や誤操作の機会になる。",
      "追加ではなく再設計とし、旧権限の失効を手続として組み込む必要がある。",
    ],
    rightNote: "正解である。旧権限の失効と新権限の再付与を連携して行う。",
    wrongNotes: [
      "旧権限を長期間残すと、不要な権限が長く残り、機会が拡大する。必要な引継ぎは別の方法で行う。",
      "本人の申告に依存すると、漏れが生じる。管理側が人事情報を起点に処理する。",
      "年1回の棚卸しだけでは、異動から最長1年近く不要な権限が残る。異動時の手続が必要である。",
    ],
    english:
      "On transfer, revoke old access and re-grant only what the new role needs, triggered by HR information shared with system administrators.",
    termIds: ["org-employment-lifecycle", "org-least-privilege"],
    tags: ["異動", "権限管理"],
  }),
  mk({
    n: 8,
    part: "A",
    topicIds: ["org-hr"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "情報漏えいを起こした従業者に対する懲戒の手続として、最も適切なものはどれか。",
    right:
      "就業規則に定めた懲戒事由と種類に基づき、事実確認と本人の弁明の機会を経て、行為の内容に見合った処分とする。",
    pos: "i",
    wrong: [
      "抑止効果を高めるため、疑いが生じた時点で本人の氏名と事案の内容を全従業者に公表する。",
      "懲戒処分は、刑事手続で結論が確定してからでなければ行えないため、確定までは何も行わない。",
      "就業規則に定めがなくても、経営者が必要と判断すれば、最も重い処分を科すことができる。",
    ],
    correct:
      "懲戒は就業規則に基づき、事実確認、弁明の機会、行為に見合った処分という手続を踏んで行う。",
    why: [
      "処分の根拠は就業規則であり、定めのない処分や過重な処分は無効とされるおそれがある。",
      "刑事罰や損害賠償とは目的も手続も異なるため、刑事手続の確定を待つ必要はない。",
    ],
    rightNote: "正解である。規定、事実確認、弁明の機会、比例の原則を踏む。",
    wrongNotes: [
      "疑いの段階での氏名公表は、名誉やプライバシーを侵害し、調査の秘密保持にも反する。",
      "懲戒は刑事罰とは別の手続であり、刑事手続の確定を待たなければならないわけではない。",
      "就業規則に定めのない処分は根拠を欠く。経営者の判断だけで処分を科すことはできない。",
    ],
    english:
      "Disciplinary action follows work rules: fact-finding, a chance for the employee to respond, and proportionate sanctions.",
    termIds: ["org-disciplinary-action"],
    tags: ["懲戒", "人事"],
  }),
  mk({
    n: 9,
    part: "B",
    topicIds: ["org-hr"],
    lessonId: "org/human",
    difficulty: "hard",
    stem: "D社の今後の内部通報への対応として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "D社の内部通報窓口に、匿名で「経理部長が顧客データを私的に持ち出している」という通報があった。窓口は総務部長が担当していたが、経理部長と同期入社で親しく、本人に直接事情を尋ねた。その後、通報者と疑われた経理課員が別部署へ異動となり、社内では通報を控える空気が広がった。",
      },
    ],
    right:
      "窓口と調査を、当事者から独立した部署（法務・監査・人事など）が担当し、通報者の特定につながる情報を秘匿する。ログなどの客観的な証拠を保全して事実を確認し、通報を理由とする不利益な取扱いは行わない。",
    pos: "u",
    wrong: [
      "通報の信頼性を確かめるため、まず通報者を特定し、通報者本人への聞取りを終えるまで調査を始めない。",
      "通報の内容は関係部署の長に共有して対応を依頼し、窓口は管理職だけが担当する。",
      "匿名の通報は信頼性に欠けるため受け付けず、実名で通報された場合だけ調査する。",
    ],
    correct:
      "内部通報では、窓口と調査の独立性、通報者の保護、証拠の保全、不利益取扱いの禁止が必要である。",
    why: [
      "当事者と利害関係のある者が窓口を担うと、秘密が漏れ、通報者が不利益を受けるおそれがある。",
      "公益通報者保護法は、通報を理由とする解雇や不利益な取扱いを禁じている。匿名でも受け付けると通報しやすくなる。",
    ],
    rightNote: "正解である。独立した調査、通報者の保護、証拠保全を組み合わせる。",
    wrongNotes: [
      "通報者を特定しようとすること自体が、通報者保護の趣旨に反する。調査は客観的な証拠を起点に進める。",
      "通報内容を関係部署の長に広く共有すると、当事者に情報が渡り、通報者が不利益を受けるおそれがある。",
      "匿名でも受け付けるのが望ましい。匿名を拒否すると、通報をためらわせ、早期発見の機会を失う。",
    ],
    english:
      "A whistleblowing system needs an independent channel, protection of the reporter's identity, preserved evidence, and no retaliation.",
    termIds: ["org-internal-reporting", "org-disciplinary-action"],
    tags: ["内部通報", "公益通報", "科目B"],
  }),
  mk({
    n: 10,
    part: "B",
    topicIds: ["org-hr", "org-human"],
    lessonId: "org/human",
    difficulty: "medium",
    stem: "G社で起きた事象の原因と対策の組合せとして、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "G社の経理部から営業部へ異動したJ氏が、異動の3か月後も給与データの参照を続けていたことが、ログの確認で分かった。調査の結果は次のとおりである。",
      },
      {
        type: "list",
        items: [
          "営業部の業務に必要な権限は、異動時に付与されていた。",
          "経理部の権限を失効する手続は、異動時の手順に含まれていなかった。",
          "アクセス権の棚卸しは年1回のみで、次回は9か月後の予定だった。",
          "J氏の参照が業務上の目的だったかどうかは、現時点で分かっていない。",
        ],
      },
    ],
    right:
      "原因：異動時に旧部署の権限を失効する手順がなかった／対策：人事異動の情報をシステム管理者に連携して旧権限を失効し、権限の棚卸しを定期的に行う",
    pos: "e",
    wrong: [
      "原因：J氏が不正を働く意図を持っていた／対策：懲戒処分の基準を厳しくする",
      "原因：営業部の権限が不足していた／対策：営業部の全員に給与データの参照権限を付与する",
      "原因：参照のログが取得されていなかった／対策：旧権限は残したまま、参照ログの取得だけを強化する",
    ],
    correct:
      "事実から読み取れる原因は異動時の旧権限の失効漏れであり、対策は失効の手順化と棚卸しの定期的な実施である。",
    why: [
      "J氏の意図は不明であり、悪意を前提にした対策は根拠に欠ける。手順の不備は事実として確認できる。",
      "ログは取得されており、不要な権限を残したまま検知だけを強化しても、機会は残る。",
    ],
    rightNote: "正解である。確認された事実に基づく原因と、再発を防ぐ対策である。",
    wrongNotes: [
      "J氏の意図は不明であり、原因を悪意と決めつけるのは根拠がない。懲戒基準の強化では手順の不備は解消しない。",
      "営業部の権限は付与されていた。給与データの権限をさらに広げるのは、最小権限の原則に反する。",
      "ログは取得されており、事象はログで発見された。旧権限を残したままでは、不要な権限という機会が残る。",
    ],
    english:
      "The root cause is the missing revocation step at transfer; fix it by linking HR changes to access administration and reviewing permissions regularly.",
    termIds: ["org-employment-lifecycle", "org-least-privilege"],
    tags: ["異動", "権限棚卸し", "科目B"],
  }),
  // ── org/vendor ───────────────────────────────────────────────
  mk({
    n: 11,
    part: "A",
    topicIds: ["org-vendor"],
    lessonId: "org/vendor",
    difficulty: "easy",
    stem: "クラウドサービスの責任分界を次の表にまとめた。空欄ア、イに入れる語句の組合せとして、最も適切なものはどれか。",
    presentation: [
      {
        type: "table",
        caption: "サービス形態ごとの管理責任（一般的な整理）",
        headers: ["管理対象", "IaaS", "PaaS", "SaaS"],
        rows: [
          ["データセンター設備・物理サーバ", "事業者", "事業者", "事業者"],
          ["OS・ミドルウェア", "利用者", "ア", "事業者"],
          ["アプリケーション", "利用者", "利用者", "事業者"],
          ["利用者のデータとアクセス権の設定", "利用者", "利用者", "イ"],
        ],
      },
    ],
    right: "ア：事業者／イ：利用者",
    pos: "a",
    wrong: [
      "ア：利用者／イ：事業者",
      "ア：事業者／イ：事業者",
      "ア：利用者／イ：利用者",
    ],
    correct:
      "PaaSではOS・ミドルウェアは事業者が管理し、利用者のデータとアクセス権の設定は、どの形態でも利用者の責任である。",
    why: [
      "サービスの形態がIaaSからPaaS、SaaSへ進むほど、事業者の管理範囲は広がる。",
      "SaaSでも、自社のデータの扱いや、誰にどの権限を与えるかの設定は利用者が責任を負う。",
    ],
    rightNote: "正解である。PaaSのOS・ミドルウェアは事業者、データと権限設定は利用者である。",
    wrongNotes: [
      "アが利用者になっている。PaaSではOS・ミドルウェアも事業者が管理する。イも事業者になっており誤りである。",
      "イが事業者になっている。SaaSでも、利用者のデータとアクセス権の設定は利用者の責任である。",
      "アが利用者になっている。PaaSでは、OS・ミドルウェアの管理は事業者が行う。",
    ],
    english:
      "In PaaS the provider manages OS and middleware, while customers always remain responsible for their data and access settings.",
    termIds: ["org-cloud-shared-responsibility"],
    tags: ["責任共有モデル", "クラウド"],
  }),
  mk({
    n: 12,
    part: "A",
    topicIds: ["org-vendor"],
    lessonId: "org/vendor",
    difficulty: "medium",
    stem: "委託契約が終了する際の、委託元のデータの扱いとして、最も適切なものはどれか。",
    right:
      "契約に基づき、委託先に預けたデータの返還と消去を求め、消去の方法と実施日を記載した証明書などで確認する。",
    pos: "i",
    wrong: [
      "契約が終了すれば委託先との関係は終わるため、預けたデータの扱いは確認しない。",
      "委託先の担当者から「削除した」と口頭で報告を受ければ、確認は十分である。",
      "データは返還を受けず、委託先がバックアップとして一定期間保管し続けることを認める。",
    ],
    correct:
      "契約終了時には、データの返還・消去を契約に基づいて求め、消去したことを記録や証明書で確認する。",
    why: [
      "契約終了後に委託先にデータが残ると、漏えいや目的外利用のリスクが残る。",
      "口頭の報告は客観的な証拠にならない。消去の方法、対象、実施日を記録で確認する必要がある。",
    ],
    rightNote: "正解である。返還・消去を求め、証拠で確認する。",
    wrongNotes: [
      "契約終了後も委託先にデータが残るおそれがあり、確認しないのは不適切である。",
      "口頭の報告だけでは、消去の範囲や方法を確認できない。記録や証明書で確認する。",
      "返還を受けず委託先に保管し続けさせると、管理の及ばない場所にデータが残り続ける。",
    ],
    english:
      "At contract end, require return and deletion of data and verify it with records or certificates, not verbal assurance.",
    termIds: ["org-data-return-deletion", "org-outsourcing"],
    tags: ["契約終了", "データ消去"],
  }),
  mk({
    n: 13,
    part: "B",
    topicIds: ["org-vendor"],
    lessonId: "org/vendor",
    difficulty: "medium",
    stem: "H社の今後の対応として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "H社は、外部ベンダが提供する販売管理パッケージを利用している。あるオープンソースのライブラリに重大な脆弱性が公表されたが、H社はそのパッケージに該当のライブラリが含まれているかを把握しておらず、ベンダへの問合せから回答まで3日かかった。その間、H社は暫定対策を決められなかった。",
      },
    ],
    right:
      "調達や契約の要件に、ソフトウェアの構成部品の一覧（SBOM）の提供を含め、H社でも構成部品と版を台帳で管理して、脆弱性の公表時に自社で該当を照合できるようにする。",
    pos: "a",
    wrong: [
      "ライブラリの管理はベンダの責任であるため、H社は脆弱性情報の収集を行わず、ベンダの連絡を待つ。",
      "ベンダ製パッケージの利用をやめ、すべて自社開発に置き換えれば、ライブラリの脆弱性の影響を受けなくなる。",
      "脆弱性の情報収集には手間がかかるため、被害が確認されてから対応を始める。",
    ],
    correct:
      "供給者が使う部品を可視化するSBOMを調達要件に含め、自社でも管理して、脆弱性の公表時に自ら影響を判断できるようにする。",
    why: [
      "委託や調達をしても、自社が使うソフトウェアのリスクを把握する責任は委託元に残る。",
      "自社開発でも多くのオープンソースを利用するため、置換では依存関係の問題を解消できない。",
    ],
    rightNote: "正解である。SBOMの提供と自社での構成管理で、影響判断を早める。",
    wrongNotes: [
      "ベンダ任せにすると、今回のように影響判断が遅れる。委託元にも把握と判断の責任がある。",
      "自社開発でもオープンソースの部品に依存することが多く、置換は過大で、問題の本質も解決しない。",
      "被害の確認を待つと、対策が後手になる。脆弱性は公表の時点で影響を確認すべきである。",
    ],
    english:
      "Require an SBOM from suppliers and track components yourself so you can quickly judge exposure when a vulnerability is published.",
    termIds: ["org-sbom", "org-supply-chain-attack", "org-supplier-management"],
    tags: ["SBOM", "サプライチェーン", "科目B"],
  }),
  // ── org/audit ────────────────────────────────────────────────
  mk({
    n: 14,
    part: "A",
    topicIds: ["org-audit"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "システム監査における保証型監査と助言型監査の説明として、最も適切なものはどれか。",
    right:
      "保証型は、対象が基準に照らして適切に整備・運用されているかについて、監査人が結論を表明する。助言型は、課題の指摘と改善案の提示を主な成果とする。",
    pos: "u",
    wrong: [
      "保証型は、課題の指摘と改善案の提示を主な成果とする。助言型は、対象が基準に適合しているかについて、監査人が結論を表明する。",
      "保証型は、監査人が改善作業を代行して統制の有効性を保証する。助言型は、被監査部門が改善作業を実施する。",
      "保証型は外部の監査人が行う監査で、助言型は内部の監査人が行う監査であり、所属によって区別される。",
    ],
    correct:
      "保証型は基準への適合や有効性について結論を表明し、助言型は改善に向けた助言を主な成果とする。",
    why: [
      "監査の開始前に、保証型か助言型かの目的と成果物を合意しないと、期待と成果がずれる。",
      "どちらの場合も、改善の実行責任は被監査部門にあり、監査人は改善を代行しない。",
    ],
    rightNote: "正解である。保証型は結論の表明、助言型は助言が中心である。",
    wrongNotes: [
      "保証型と助言型の説明が入れ替わっている。",
      "監査人は改善を代行しない。代行すると、自己評価となり独立性を損なう。",
      "区別は所属ではなく目的と成果物による。内部の監査人も保証型を行える。",
    ],
    english:
      "Assurance audits conclude on conformity and effectiveness, whereas advisory audits mainly give improvement advice.",
    termIds: ["org-system-audit", "org-auditor-independence"],
    tags: ["保証型", "助言型"],
  }),
  mk({
    n: 15,
    part: "A",
    topicIds: ["org-audit"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "内部統制の要素のうち、次のア～ウの例が該当するものの組合せとして、最も適切なものはどれか。",
    presentation: [
      {
        type: "list",
        items: [
          "ア: 取締役会が倫理規程を定め、経営者が率先して遵守する姿勢を示す。",
          "イ: 一定額以上の支払は、権限表に基づき部門長が承認する運用を行う。",
          "ウ: 内部監査部門が、統制の運用状況を定期的に評価し、不備を経営者に報告する。",
        ],
      },
    ],
    right: "ア：統制環境／イ：統制活動／ウ：モニタリング",
    pos: "e",
    wrong: [
      "ア：統制活動／イ：統制環境／ウ：モニタリング",
      "ア：統制環境／イ：モニタリング／ウ：統制活動",
      "ア：情報と伝達／イ：統制活動／ウ：リスク評価",
    ],
    correct:
      "経営者の姿勢や倫理規程は統制環境、承認権限の運用は統制活動、運用状況の評価は監視活動に当たる。",
    why: [
      "統制環境は、組織の価値観や経営者の姿勢など、統制全体の土台である。",
      "統制活動は承認や職務分掌など個別の手続であり、モニタリングは統制が機能しているかの継続的・独立的な評価である。",
    ],
    rightNote: "正解である。ア、イ、ウがそれぞれ統制環境、統制活動、モニタリングに当たる。",
    wrongNotes: [
      "アとイが入れ替わっている。倫理規程と経営者の姿勢は統制環境である。",
      "イとウが入れ替わっている。承認権限の運用は統制活動、評価はモニタリングである。",
      "アは情報と伝達ではなく統制環境であり、ウもリスク評価ではなくモニタリングである。",
    ],
    english:
      "Management tone is the control environment, approval rules are control activities, and periodic evaluation is monitoring.",
    termIds: ["org-internal-control", "org-control-environment", "org-monitoring"],
    tags: ["内部統制", "5要素"],
  }),
  mk({
    n: 16,
    part: "A",
    topicIds: ["org-audit"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "監査証拠の信頼性（適切性）が最も高いと考えられるものはどれか。",
    right:
      "監査人が、システムから直接取得したログを確認し、必要に応じて統制を再実施して得た結果",
    pos: "i",
    wrong: [
      "被監査部門の責任者が、運用状況について口頭で説明した内容",
      "被監査部門が作成した自己点検結果のまとめ（監査人は元のデータを確認していない）",
      "担当者の記憶に基づく回答を、監査人が聞取りメモとして記録したもの",
    ],
    correct:
      "監査人が自ら入手・観察し、再実施して確認した証拠は、他者を介した証拠よりも信頼性が高い。",
    why: [
      "監査証拠には、量の十分性と、関連性・信頼性という適切性が求められる。",
      "被監査部門を介した情報や口頭の説明は、裏付けが弱く、単独では不十分になりやすい。",
    ],
    rightNote: "正解である。直接入手と再実施で、信頼性が高い。",
    wrongNotes: [
      "責任者の口頭説明は、裏付けとなる証拠がなければ信頼性が低い。",
      "被監査部門が作成したまとめは、元のデータを確認していないと、作成者の都合が入るおそれがある。",
      "記憶に基づく回答は、客観性と再現性に欠け、証拠としては弱い。",
    ],
    english:
      "Evidence the auditor obtains directly and re-performs is more reliable than statements or summaries supplied by the auditee.",
    termIds: ["org-audit-evidence"],
    tags: ["監査証拠", "適切性"],
  }),
  mk({
    n: 17,
    part: "A",
    topicIds: ["org-audit"],
    lessonId: "org/audit-physical",
    difficulty: "easy",
    stem: "監査報告書における指摘事項の記載として、最も適切なものはどれか。",
    right:
      "確認した事実、準拠すべき基準、想定されるリスクを区別して示し、改善を勧告する。",
    pos: "u",
    wrong: [
      "「管理体制が不十分である」と結論だけを簡潔に記載する。",
      "不備の原因を推測し、担当者個人の能力不足を指摘事項として記載する。",
      "監査人が改善案を自ら実施し、その結果を指摘事項として記載する。",
    ],
    correct:
      "指摘は、事実と基準を区別し、リスクと改善勧告を示して、現場が何を直せばよいか分かる形にする。",
    why: [
      "事実、基準、影響を分けて書くと、再現でき、被監査部門が納得して改善しやすい。",
      "改善の実行責任は被監査部門にあり、監査人は改善を代行しない。",
    ],
    rightNote: "正解である。事実・基準・リスク・勧告を示す。",
    wrongNotes: [
      "結論だけでは、何が基準を満たしておらず、何を直すのかが分からない。",
      "個人への非難は監査の目的ではなく、事実に基づく指摘にもならない。",
      "監査人が改善を実施すると、自己評価となり独立性を損なう。",
    ],
    english:
      "A finding should distinguish facts, criteria and risk, and recommend improvement in a reproducible way.",
    termIds: ["org-follow-up", "org-audit-evidence"],
    tags: ["監査報告", "指摘事項"],
  }),
  mk({
    n: 18,
    part: "B",
    topicIds: ["org-audit"],
    lessonId: "org/audit-physical",
    difficulty: "hard",
    stem: "K社の内部監査部門が行った監査手続の改善として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "K社の内部監査部門は、特権IDの付与手続を監査した。年間1,200件の付与申請のうち、4月分の先頭から30件を抽出して確認したところ、すべてに承認印があった。監査人は「手続は適切に運用されている」と結論付けようとしている。",
      },
    ],
    right:
      "締め処理の前後、例外承認、緊急付与などリスクの高い期間や取引を意識的に追加で抽出し、申請内容と実際の付与内容、承認者の権限を突き合わせる。",
    pos: "a",
    wrong: [
      "同じ4月分の先頭から抽出する件数を、30件から60件に増やして、承認印の有無を確認する。",
      "承認印が揃っていたため、追加の手続は不要とし、このまま結論を報告する。",
      "担当者に「承認は毎回得ている」と口頭で確認し、その回答を追加の証拠とする。",
    ],
    correct:
      "抽出が偏っており、承認印の有無だけでは十分でない。リスクの高い取引を含めて抽出し、内容と権限まで突き合わせる。",
    why: [
      "期間や位置が偏った抽出は母集団を代表せず、例外や特権操作が漏れる。",
      "承認印の有無は形式の確認にすぎず、承認者に権限があるか、付与内容が申請と一致するかを確かめる必要がある。",
    ],
    rightNote: "正解である。リスクに応じた抽出と、内容・権限の突合を行う。",
    wrongNotes: [
      "同じ偏りのまま件数を増やしても、母集団の代表性は改善しない。",
      "承認印の有無は形式の確認にすぎず、実際の付与との整合や承認権限を確認していない。",
      "口頭の確認は、裏付けとなる証拠がなければ監査証拠として弱い。",
    ],
    english:
      "Sampling should cover high-risk periods and transactions, and tests should verify content and approver authority, not just stamps.",
    termIds: ["org-audit-evidence", "org-system-audit"],
    tags: ["監査手続", "サンプリング", "科目B"],
  }),
  // ── org/physical ─────────────────────────────────────────────
  mk({
    n: 20,
    part: "A",
    topicIds: ["org-physical"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "顧客データを保存していたHDDが故障し、上書き消去ができなくなった。このHDDを廃棄する方法として、最も適切なものはどれか。",
    right:
      "破砕や穿孔などでディスクを物理的に破壊し、実施した記録を台帳や証明書で残す。",
    pos: "i",
    wrong: [
      "故障しているため、データは読み出せないと判断し、一般の廃棄物としてそのまま廃棄する。",
      "OSの機能でフォーマットしてから廃棄する。",
      "リサイクル業者に無償で譲渡し、業者の判断で再利用してもらう。",
    ],
    correct:
      "書込みできず上書き消去ができない媒体は、物理的な破壊で復元を不可能にし、記録を残す。",
    why: [
      "故障した媒体でも、磁気ディスクの内容が読み出せる場合がある。",
      "フォーマットや削除は論理的な操作であり、データが復元される可能性がある。",
    ],
    rightNote: "正解である。物理破壊と記録で、復元を防ぎ、証跡を残す。",
    wrongNotes: [
      "故障していても、内容を読み出せる場合がある。そのまま廃棄するのは危険である。",
      "フォーマットは論理的な操作であり、データが復元される可能性が残る。故障した媒体では実施もできない場合がある。",
      "第三者に渡すと、データが復元されるおそれがあり、管理の及ばない場所へ流出する。",
    ],
    english:
      "A failed disk that cannot be overwritten should be physically destroyed, with disposal records kept.",
    termIds: ["org-physical-zoning", "org-clear-desk"],
    tags: ["機器廃棄", "媒体消去"],
  }),
  mk({
    n: 21,
    part: "A",
    topicIds: ["org-physical"],
    lessonId: "org/audit-physical",
    difficulty: "easy",
    stem: "監視カメラの運用として、最も適切なものはどれか。",
    right:
      "設置場所、撮影範囲、保存期間、閲覧権限を定めて従業者や来訪者に周知し、映像の不正閲覧や改ざんを防ぐ。",
    pos: "u",
    wrong: [
      "抑止効果を高めるため、設置の事実は従業者にも知らせず、映像は容量の許す限り無期限に保存する。",
      "映像は不具合の確認用であるため、閲覧権限を定めず、誰でも映像を再生できるようにする。",
      "映像から特定の個人を識別できても個人情報にはならないため、周知や安全管理の対象としない。",
    ],
    correct:
      "監視カメラは、設置場所・撮影範囲・保存期間・閲覧権限を定め、周知したうえで、映像の保護も行う。",
    why: [
      "記録映像は事後検証の証拠になるため、改ざんや不正閲覧を防ぐ必要がある。",
      "映像から特定の個人を識別できる場合は、個人情報として扱う必要がある。",
    ],
    rightNote: "正解である。運用ルールと周知、映像の保護を組み合わせる。",
    wrongNotes: [
      "周知しないことや無期限の保存は不適切である。保存期間を定めて周知する。",
      "閲覧権限を定めないと、映像が不正に閲覧されるおそれがある。",
      "特定の個人を識別できる映像は個人情報であり、適切な取扱いが必要である。",
    ],
    english:
      "Surveillance cameras need defined placement, coverage, retention, and viewing rights, with notice and protection of recordings.",
    termIds: ["org-physical-zoning", "org-anti-passback"],
    tags: ["監視カメラ", "物理対策"],
  }),
  mk({
    n: 22,
    part: "A",
    topicIds: ["org-physical"],
    lessonId: "org/audit-physical",
    difficulty: "easy",
    stem: "来訪者の管理として、適切でないものはどれか。",
    right:
      "来訪者に入館証を渡した後は、付添いなしで、執務室を通って目的の部署へ向かってもらう。",
    pos: "i",
    wrong: [
      "受付で本人確認を行ったうえで、入館証を交付する。",
      "立入りの範囲を会議室など、必要な区域に限定する。",
      "退館時に入館証の返却を確認し、入退館の記録を残す。",
    ],
    correct:
      "来訪者は付添いを付け、立入範囲を限定するのが原則であり、付添いなしで執務室を通すのは不適切である。",
    why: [
      "来訪者には、本人確認、入館証の交付、付添い、立入範囲の制限、退館時の返却確認を行う。",
      "執務室には机上の資料や画面があり、付添いなしの立入りは情報の盗み見や持出しの機会になる。",
    ],
    rightNote: "正解（適切でないもの）である。付添いなしで執務室を通すのは不適切である。",
    wrongNotes: [
      "受付での本人確認と入館証の交付は、適切な来訪者管理である。",
      "立入範囲を必要な区域に限定することは、適切な対策である。",
      "入館証の返却確認と記録は、適切な来訪者管理である。",
    ],
    english:
      "Visitors should be escorted and restricted to necessary areas; letting them walk through offices unaccompanied is inappropriate.",
    termIds: ["org-physical-zoning", "org-clear-desk"],
    tags: ["来訪者管理", "入退館"],
  }),
  mk({
    n: 23,
    part: "A",
    topicIds: ["org-physical"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "サーバ室の電源対策に関する記述として、最も適切なものはどれか。",
    right:
      "UPSは瞬断や短時間の停電に電力を供給して安全に停止する時間を稼ぎ、長時間の停電には非常用発電機を組み合わせる。燃料の備蓄や試運転も行う。",
    pos: "u",
    wrong: [
      "UPSを設置すれば、バッテリの状態にかかわらず数時間の停電でもサーバを運転し続けられる。",
      "非常用発電機は停電と同時に瞬断なく電力を供給できるため、UPSは不要である。",
      "UPSは設置後に保守は不要であり、バッテリの劣化は問題にならない。",
    ],
    correct:
      "UPSは短時間の電力供給と安全停止のため、長時間の停電は非常用発電機で備える。バッテリや燃料の保守が必要である。",
    why: [
      "発電機は起動して電圧が安定するまでに時間がかかるため、その間をUPSがつなぐ。",
      "バッテリは劣化するため、定期的な放電試験と交換計画が必要である。",
    ],
    rightNote: "正解である。UPSと非常用発電機は役割が異なり、組み合わせて使う。",
    wrongNotes: [
      "UPSのバッテリが供給できるのは一般に数分から数十分程度で、数時間は持たない。バッテリが劣化していればさらに短くなる。",
      "発電機は起動に時間がかかる。その間の瞬断はUPSで補う。",
      "バッテリは劣化するため、定期的な試験と交換が必要である。",
    ],
    english:
      "UPS bridges brief outages and allows safe shutdown, while a generator covers long outages; both need maintenance.",
    termIds: ["org-ups"],
    tags: ["UPS", "電源"],
  }),
  mk({
    n: 24,
    part: "B",
    topicIds: ["org-physical"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "L社の改善策として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "L社の営業部は、フリーアドレス制を導入した。導入1か月後の情報セキュリティ担当者による夜間巡回で、次の状況が見つかった。",
      },
      {
        type: "table",
        caption: "夜間巡回の結果（フロア全体）",
        headers: ["確認項目", "見つかった件数"],
        rows: [
          ["机上に放置された顧客資料", "7件"],
          ["画面ロックがされていないPC", "5件"],
          ["施錠された保管庫の鍵が机上にある", "2件"],
          ["共有プリンタに残された出力物", "3件"],
        ],
      },
    ],
    right:
      "離席時の施錠保管と自動画面ロック、鍵の管理方法、プリンタの本人認証出力を運用ルールとして定め、巡回点検を定期的に続けて結果を部門長に報告する。",
    pos: "a",
    wrong: [
      "注意喚起のメールを全員に1回送り、巡回は今回限りとする。",
      "見つかった従業者の氏名を全社に公表し、再発の抑止とする。",
      "紙の資料の問題が主であるため、巡回をやめ、PCの技術的対策だけを強化する。",
    ],
    correct:
      "クリアデスク・クリアスクリーンは、運用ルール、技術的な補助、点検の継続を組み合わせて定着させる。",
    why: [
      "施錠保管、鍵の管理、画面ロック、本人認証出力という手段で、放置や盗み見の機会を減らす。",
      "巡回を継続して部門長へ報告すると、点検が日常業務に組み込まれ、定着する。",
    ],
    rightNote: "正解である。ルール、技術的な補助、継続的な点検を組み合わせる。",
    wrongNotes: [
      "1回の注意喚起だけでは行動は変わらない。点検が続かないと再発する。",
      "氏名の公表は萎縮を招くだけで、機会を減らす対策にならず、人事面の問題も生じる。",
      "放置された資料は物理的な問題であり、技術的対策だけでは解決しない。巡回は有効な点検手段である。",
    ],
    english:
      "Clear-desk practices need rules, supporting mechanisms like auto-lock and secure printing, and recurring inspections.",
    termIds: ["org-clear-desk", "org-clear-screen"],
    tags: ["クリアデスク", "フリーアドレス", "科目B"],
  }),
  mk({
    n: 25,
    part: "B",
    topicIds: ["org-physical"],
    lessonId: "org/audit-physical",
    difficulty: "medium",
    stem: "M社がリース満了の複合機を返却する際の対応として、最も適切なものはどれか。",
    presentation: [
      {
        type: "p",
        text: "M社は、リース満了に伴い、オフィスで使っていた複合機を返却する。この複合機には、スキャンした契約書や社員の個人情報を含む画像が、内蔵ストレージに保存されている可能性がある。",
      },
    ],
    right:
      "内蔵ストレージのデータ消去（上書き消去や暗号化消去など）を、実施方法と実施結果を確認できる形で行い、機器の返却を台帳に記録する。",
    pos: "e",
    wrong: [
      "操作パネルから工場出荷状態に戻したので、データは完全に消えたと判断して返却する。",
      "リース会社は信頼できるため、消去の方法や結果は確認せず、そのまま返却する。",
      "電源を切ればストレージ内のデータは消えるため、返却前に電源を切って梱包する。",
    ],
    correct:
      "複合機のストレージは見落とされやすい記憶媒体であり、消去の実施と結果の確認、台帳への記録が必要である。",
    why: [
      "初期化や論理削除だけでは、データが復元できる場合がある。",
      "返却先に任せきりにすると、消去の実施や範囲を確認できず、委託先管理の観点でも不十分である。",
    ],
    rightNote: "正解である。消去と結果の確認、台帳への記録を行う。",
    wrongNotes: [
      "工場出荷状態への初期化だけでは、データが復元される可能性が残る。",
      "信頼できるという理由だけで確認を省くのは不適切である。消去の結果を確認する。",
      "ストレージのデータは電源を切っても消えない。",
    ],
    english:
      "Multifunction printers hold data in internal storage; securely erase it, verify the result, and record the return.",
    termIds: ["org-clear-desk", "org-supplier-management"],
    tags: ["複合機", "機器返却", "科目B"],
  }),
];
