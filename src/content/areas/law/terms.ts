import type { GlossaryTerm } from "@/lib/content/types";

export const lawTerms: GlossaryTerm[] = [
  {
    id: "law-personal-information",
    ja: "個人情報",
    reading: "こじんじょうほう",
    en: "Personal Information",
    shortJa:
      "生存する個人に関する情報で、特定の個人を識別できるもの、または個人識別符号を含むもの。",
    shortEn:
      "Information about a living individual that identifies a specific person, or that contains a personal identifier.",
    explanationJa:
      "氏名・生年月日・連絡先などにより特定の個人を識別できる情報のほか、他の情報と容易に照合して識別できる情報、顔認証データやマイナンバーなどの個人識別符号を含む情報をいう。死者や法人そのものに関する情報は原則として含まれないが、死者に関する情報でも遺族を識別できる場合は、その遺族の個人情報となる。",
    explanationEn:
      "Personal information includes data that identifies a living individual by name, date of birth, contact details, or by easy cross-reference with other information, as well as data containing a personal identifier such as facial recognition data or My Number. Information about the deceased or about a corporation itself is generally outside the definition, unless it also identifies a living person.",
    examUsage:
      "「個人情報」は入口の広い概念、「個人データ」はデータベース等を構成するもの、「保有個人データ」は開示等の権限があるもの、と層で覚える。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-personal-data",
      "law-personal-identifier",
      "law-retained-personal-data",
    ],
    tags: ["個人情報保護法", "定義"],
  },
  {
    id: "law-personal-data",
    ja: "個人データ",
    reading: "こじんデータ",
    en: "Personal Data",
    shortJa: "個人情報データベース等を構成する個人情報。",
    shortEn: "Personal information that constitutes a personal information database, etc.",
    explanationJa:
      "個人情報データベース等（電子計算機を用いて検索できるように体系的に構成した個人情報、または規則的に分類・整理した個人情報）を構成する個人情報をいう。紙の名簿でも、検索・整理が可能な形であれば個人情報データベース等に該当する。安全管理措置や第三者提供の記録義務など、多くの義務は「個人データ」を単位に課される。",
    explanationEn:
      "Personal data is personal information forming part of a personal information database, etc. — information structured so it can be searched by computer, or systematically organized. Even a paper list can qualify if it is searchable or organized. Many obligations, including security measures and third-party provision records, apply at the level of personal data.",
    examUsage:
      "「名簿そのもの」ではなく「名簿を構成する各情報」が個人データ。個人情報より一段狭い概念である。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-personal-information",
      "law-retained-personal-data",
      "law-third-party-provision",
    ],
    tags: ["個人情報保護法", "定義"],
  },
  {
    id: "law-retained-personal-data",
    ja: "保有個人データ",
    reading: "ほゆうこじんデータ",
    en: "Retained Personal Data",
    shortJa:
      "個人情報取扱事業者が開示・訂正・利用停止等の権限を有する個人データ。",
    shortEn:
      "Personal data over which the business operator has authority to disclose, correct, or suspend use.",
    explanationJa:
      "開示・訂正・利用停止等の請求に応じる権限を有する個人データをいう。2022年4月の改正で「6か月以内に消去するもの」を除く規定が撤廃され、原則としてすべての個人データが保有個人データとして扱われるようになった。本人からの開示請求等の対象になる。",
    explanationEn:
      "Retained personal data is personal data over which the operator has authority to respond to requests for disclosure, correction, suspension of use, and similar. Since April 2022, the former exclusion for data deleted within six months has been removed, so in principle all personal data is treated as retained personal data and is subject to individual requests.",
    examUsage:
      "「6か月」という旧要件は現在の原則ではない。2022年4月以降は原則すべての個人データが保有個人データ。",
    lessonIds: ["law/privacy"],
    relatedTermIds: ["law-personal-data", "law-personal-information"],
    tags: ["個人情報保護法", "開示請求"],
  },
  {
    id: "law-personal-identifier",
    ja: "個人識別符号",
    reading: "こじんしきべつふごう",
    en: "Personal Identifier",
    shortJa:
      "身体的特徴を変換した符号や、個人ごとに割り振られる公的な番号。",
    shortEn:
      "A code converted from physical characteristics, or a public number assigned to an individual.",
    explanationJa:
      "顔・指紋・虹彩・声紋・歩行・静脈・DNAなどの身体的特徴を電子計算機で利用できる形に変換した符号、およびマイナンバー・旅券番号・基礎年金番号・免許証番号・保険者番号など対象者ごとに割り振られる符号をいう。個人識別符号を含む情報は、それ単体で個人情報に該当する。",
    explanationEn:
      "Personal identifiers include codes converted from physical features such as face, fingerprints, iris, voice, gait, veins, and DNA, as well as numbers assigned to individuals such as My Number, passport number, basic pension number, driver's license number, and insurer numbers. Information containing a personal identifier is personal information on its own.",
    examUsage:
      "顔画像そのものではなく「顔の特徴を変換したデータ」が符号。マイナンバーは代表例。",
    lessonIds: ["law/privacy"],
    relatedTermIds: ["law-personal-information", "law-my-number"],
    tags: ["個人情報保護法", "定義"],
  },
  {
    id: "law-sensitive-personal-information",
    ja: "要配慮個人情報",
    reading: "ようはいりょこじんじょうほう",
    en: "Sensitive Personal Information",
    shortJa:
      "人種・信条・社会的身分・病歴・犯罪歴など、不当な差別や偏見が生じ得る個人情報。",
    shortEn:
      "Personal information such as race, beliefs, social status, medical history, and criminal record that could lead to unfair discrimination or prejudice.",
    explanationJa:
      "人種、信条、社会的身分、病歴、犯罪の経歴、犯罪により害を被った事実のほか、政令で定める身体障害・知的障害・精神障害、健康診断等の結果、医師等による指導・診療・調剤情報などを含む個人情報をいう。取得には原則として本人の同意が必要で、オプトアウトによる第三者提供はできない。",
    explanationEn:
      "Sensitive personal information includes race, beliefs, social status, medical history, criminal record, and the fact of having been harmed by a crime, plus categories designated by cabinet order such as physical, intellectual, or mental disability, health check results, and medical guidance or prescriptions. Acquisition generally requires prior consent, and opt-out third-party provision is not permitted.",
    examUsage:
      "「病歴」は要配慮、「健康診断の結果」も要配慮。取得時同意とオプトアウト不可がセットで問われる。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-personal-information",
      "law-third-party-provision",
      "law-opt-out",
    ],
    tags: ["個人情報保護法", "要配慮"],
  },
  {
    id: "law-third-party-provision",
    ja: "第三者提供",
    reading: "だいさんしゃていきょう",
    en: "Provision to Third Parties",
    shortJa: "個人データを本人以外の者に提供すること。原則として本人の同意が必要。",
    shortEn:
      "Providing personal data to a person other than the individual; prior consent is generally required.",
    explanationJa:
      "個人情報取扱事業者が個人データを第三者に提供する場合、原則として事前に本人の同意を得なければならない。法令に基づく場合、生命・身体・財産の保護に必要で同意が困難な場合などは例外となる。提供元・提供先には確認・記録義務が課され、記録は原則3年間保存する。委託・事業承継・共同利用は第三者提供に該当しない。",
    explanationEn:
      "Providing personal data to a third party generally requires the individual's prior consent. Exceptions include cases based on law and cases where consent is difficult and protection of life, body, or property requires it. The provider and recipient must confirm and record the transaction, generally for three years. Entrustment, business succession, and joint use are not treated as third-party provision.",
    examUsage:
      "「委託」「事業承継」「共同利用」は第三者提供に該当しない。同意が必要かどうかを場面で判断する。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-opt-out",
      "law-personal-data",
      "law-sensitive-personal-information",
    ],
    tags: ["個人情報保護法", "第三者提供"],
  },
  {
    id: "law-opt-out",
    ja: "オプトアウト",
    reading: "オプトアウト",
    en: "Opt-out",
    shortJa:
      "本人の同意を得ずに第三者提供する代わりに、事前の通知・公表と委員会への届出を行う方式。",
    shortEn:
      "A mechanism for providing data without consent by notifying the public in advance and filing with the commission.",
    explanationJa:
      "第三者提供の例外方式で、本人が拒否できる機会を確保する。あらかじめ本人に通知・公表し、個人情報保護委員会に届け出る必要がある。要配慮個人情報、不正取得された個人データ、オプトアウトで取得した個人データの再提供は対象外である。本人から求めがあれば提供を停止しなければならない。",
    explanationEn:
      "Opt-out is an exception to the consent requirement that gives individuals a chance to refuse. The operator must notify or publish the relevant information in advance and file a report with the Personal Information Protection Commission. It cannot be used for sensitive personal information, data obtained by deception, or re-provision of data acquired through opt-out. Provision must stop on the individual's request.",
    examUsage:
      "オプトイン（事前同意）と逆。オプトアウトは「後から停止できる」方式だが、すべての情報に使えるわけではない。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-third-party-provision",
      "law-sensitive-personal-information",
      "law-ppc",
    ],
    tags: ["個人情報保護法", "第三者提供"],
  },
  {
    id: "law-anonymized-information",
    ja: "匿名加工情報",
    reading: "とくめいかこうじょうほう",
    en: "Anonymously Processed Information",
    shortJa: "特定の個人を識別できず、復元できないように加工した情報。",
    shortEn:
      "Information processed so that a specific individual cannot be identified and the original cannot be restored.",
    explanationJa:
      "特定の個人を識別できないように、かつ元の個人情報に復元できないように加工した情報をいう。作成時に加工基準への適合、安全管理措置、作成した旨の公表が必要で、作成後に基準を満たしても遡って適法にはならない。第三者提供時は提供する項目と方法を公表し、提供先に明示する。提供先でも識別行為は禁止される。",
    explanationEn:
      "Anonymously processed information is processed so that no specific individual can be identified and the original cannot be restored. At the time of creation, the operator must meet processing standards, take security measures, and publish the fact of creation; compliance cannot be achieved retroactively. For third-party provision, the items and method must be published and disclosed to the recipient, and re-identification remains prohibited.",
    examUsage:
      "匿名加工情報は「作成時」の基準適合が勝負。提供時の契約だけでは足りない。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-pseudonymized-information",
      "law-k-anonymity",
      "law-third-party-provision",
    ],
    tags: ["個人情報保護法", "匿名加工"],
  },
  {
    id: "law-pseudonymized-information",
    ja: "仮名加工情報",
    reading: "かめいかこうじょうほう",
    en: "Pseudonymized Information",
    shortJa:
      "他の情報と照合しない限り特定の個人を識別できないように加工した情報。",
    shortEn:
      "Information processed so that a specific individual cannot be identified unless cross-referenced with other information.",
    explanationJa:
      "個人情報を、他の情報と照合しない限り特定の個人を識別できないように加工した情報をいう。作成時には規則で定める基準に従う必要がある。事業者内部での利用を想定した制度で、法令に基づく場合を除き第三者提供は認められず、本人の事前同意があっても提供できない。委託・事業承継・共同利用は可能である。",
    explanationEn:
      "Pseudonymized information is personal information processed so that no specific individual can be identified unless it is cross-referenced with other information. Creation must follow standards set by the rules. It is designed for internal use: third-party provision is prohibited except as required by law, even with prior consent. Entrustment, business succession, and joint use remain possible.",
    examUsage:
      "匿名加工情報は提供可、仮名加工情報は原則提供不可。この対比が最頻出。本人同意でも提供できない点に注意。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-anonymized-information",
      "law-personal-information",
      "law-third-party-provision",
    ],
    tags: ["個人情報保護法", "仮名加工"],
  },
  {
    id: "law-security-measures",
    ja: "安全管理措置",
    reading: "あんぜんかんりそち",
    en: "Security Control Measures",
    shortJa:
      "個人データの漏えい・滅失・毀損を防ぐために講ずる必要かつ適切な措置。",
    shortEn:
      "Necessary and appropriate measures to prevent leakage, loss, or damage of personal data.",
    explanationJa:
      "組織的（規程・責任体制）、人的（教育・監督）、物理的（入退室管理・施錠）、技術的（アクセス制御・暗号化）の4分類で整理される。委託先の監督や外的環境の把握も含む。2024年4月の施行規則改正では、個人データとして取り扱うことが想定される個人情報も保護対象に含められた。",
    explanationEn:
      "Security measures are organized into organizational (rules and responsibility), human (training and supervision), physical (access control and locking), and technical (access control and encryption) categories. Supervision of contractors and understanding of the external environment are also included. An April 2024 amendment to the enforcement rules extended protection to certain personal information intended to be handled as personal data.",
    examUsage:
      "4分類のどれに当たるかを問う問題が多い。「施錠」は物理的、「権限設定」は技術的、「研修」は人的、「規程」は組織的。",
    lessonIds: ["law/privacy"],
    relatedTermIds: ["law-personal-data", "law-my-number"],
    tags: ["個人情報保護法", "安全管理"],
  },
  {
    id: "law-my-number",
    ja: "特定個人情報（マイナンバー）",
    reading: "とくていこじんじょうほう",
    en: "Specific Personal Information (My Number)",
    shortJa:
      "個人番号を含む個人情報。番号法により利用目的や提供が厳格に制限される。",
    shortEn:
      "Personal information containing an individual number, strictly regulated by the My Number Act.",
    explanationJa:
      "マイナンバー（個人番号）をその内容に含む個人情報を特定個人情報といい、番号法（行政手続における特定の個人を識別するための番号の利用等に関する法律）が個人情報保護法に優先して適用される。利用目的の特定・制限、提供の制限、安全管理措置、委託の制限などが課され、一定の場合には特定個人情報保護評価の実施が必要となる。",
    explanationEn:
      "Specific personal information is personal information containing an individual number. The My Number Act applies in preference to the Personal Information Protection Act, imposing limits on purpose and provision, security measures, and restrictions on entrustment. In certain cases, a specific personal information protection assessment is required.",
    examUsage:
      "マイナンバーは個人識別符号でもあり、特定個人情報でもある。利用は社会保障・税・災害対策の行政手続が中心。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-personal-identifier",
      "law-security-measures",
      "law-pia",
    ],
    tags: ["番号法", "マイナンバー"],
  },
  {
    id: "law-ppc",
    ja: "個人情報保護委員会",
    reading: "こじんじょうほうほごいいんかい",
    en: "Personal Information Protection Commission",
    abbr: "PPC",
    shortJa: "個人情報保護法と番号法を所管する内閣府の外局。",
    shortEn:
      "An external bureau of the Cabinet Office supervising the Personal Information Protection Act and the My Number Act.",
    explanationJa:
      "2016年1月に設置された独立規制機関で、国の行政機関等については2022年4月から、地方公共団体については2023年4月から、公的部門の個人情報保護も一元的に所管する。報告徴収・立入検査、指導・助言、勧告、命令などの権限を持つ。認定個人情報保護団体の認定も行う。漏えい等の報告先でもある。",
    explanationEn:
      "Established in January 2016, the Commission is an independent regulator that has supervised the private sector and, from April 2022, national public-sector bodies, with local governments added in April 2023. It can collect reports, conduct on-site inspections, issue guidance, advice, recommendations, and orders, and certify accredited personal information protection organizations. It is also the reporting destination for data breaches.",
    examUsage:
      "「主務大臣」ではなく「個人情報保護委員会」が窓口。漏えい等の報告先も委員会。",
    lessonIds: ["law/privacy"],
    relatedTermIds: ["law-personal-information", "law-opt-out"],
    tags: ["個人情報保護法", "監督機関"],
  },
  {
    id: "law-gdpr",
    ja: "EU一般データ保護規則",
    reading: "イーユーいっぱんデータほごきそく",
    en: "General Data Protection Regulation",
    abbr: "GDPR",
    shortJa:
      "EU域内の個人データ保護を定める規則。域外適用と高額の制裁金が特徴。",
    shortEn:
      "The EU regulation on personal data protection, characterized by extraterritorial reach and heavy fines.",
    explanationJa:
      "2018年5月25日から適用されているEUの規則で、EU域内のデータ主体に商品・サービスを提供する場合や行動を監視する場合には、EU域外の事業者にも適用される。同意・契約・法的義務など6つの適法性根拠、データ主体の権利、72時間以内の監督機関への通知、一定の場合のDPO設置などを定める。制裁金は最大2,000万ユーロまたは全世界売上高の4%のいずれか高い方である。",
    explanationEn:
      "Applied since 25 May 2018, the GDPR also reaches businesses outside the EU when they offer goods or services to data subjects in the EU or monitor their behavior. It sets out six lawful bases, data subject rights, notification to supervisory authorities within 72 hours, and DPO requirements. Fines can reach EUR 20 million or 4% of worldwide annual turnover, whichever is higher.",
    examUsage:
      "日本法との違いは「忘れられる権利」「72時間通知」「DPO」「制裁金」。日本はEUから十分性認定を受けている。",
    lessonIds: ["law/privacy"],
    relatedTermIds: ["law-personal-information", "law-ppc", "law-pia"],
    tags: ["GDPR", "国際"],
  },
  {
    id: "law-pia",
    ja: "プライバシー影響評価",
    reading: "プライバシーえいきょうひょうか",
    en: "Privacy Impact Assessment",
    abbr: "PIA",
    shortJa:
      "個人情報の取扱いがプライバシーに与える影響を事前に評価する取組み。",
    shortEn:
      "An assessment of the privacy impact of personal information handling before a project starts.",
    explanationJa:
      "新しいシステムやサービスを設計する段階で、個人情報の収集・利用・提供がプライバシーに与えるリスクを評価し、低減策を検討する。プライバシーバイデザインと組み合わせて実施する。日本では民間事業者に一般的な法定義務はないが、マイナンバーを扱う一定の事業者には特定個人情報保護評価が義務付けられる。",
    explanationEn:
      "PIA evaluates privacy risks from collecting, using, and providing personal information at the design stage and considers mitigations, ideally together with privacy by design. Japanese law does not generally mandate PIA for private businesses, but businesses handling My Number in certain cases must conduct a specific personal information protection assessment.",
    examUsage:
      "PIAは「事前評価」、特定個人情報保護評価は番号法上の義務。両者を混同しない。",
    lessonIds: ["law/privacy"],
    relatedTermIds: ["law-my-number", "law-gdpr"],
    tags: ["プライバシー", "評価"],
  },
  {
    id: "law-k-anonymity",
    ja: "k-匿名化",
    reading: "ケーとくめいか",
    en: "k-Anonymity",
    shortJa:
      "準識別子の組み合わせが同じ人物を少なくともk人以上にする匿名化手法。",
    shortEn:
      "An anonymization technique ensuring at least k individuals share the same combination of quasi-identifiers.",
    explanationJa:
      "年齢・郵便番号・性別などの準識別子の組合せに着目し、同じ組合せを持つ人物がk人以上になるように一般化・削除する手法である。kを大きくすれば識別リスクは下がるが、属性推論や背景知識による再識別のリスクは残る。l-多様性、t-近接性、差分プライバシーなどの発展手法がある。",
    explanationEn:
      "k-anonymity generalizes or suppresses quasi-identifiers such as age, postal code, and sex so that at least k people share each combination. A larger k reduces re-identification risk but does not eliminate attribute inference or re-identification using background knowledge. Extensions include l-diversity, t-closeness, and differential privacy.",
    examUsage:
      "k-匿名化は「個人の識別」を防ぐが「属性の推定」までは防げない。kの値が大きいほど安全とは限らない。",
    lessonIds: ["law/privacy"],
    relatedTermIds: [
      "law-anonymized-information",
      "law-personal-information",
    ],
    tags: ["匿名化", "プライバシー"],
  },
  {
    id: "law-unauthorized-access",
    ja: "不正アクセス行為",
    reading: "ふせいアクセスこうい",
    en: "Unauthorized Computer Access",
    shortJa:
      "アクセス制御機能を有する特定電子計算機に、許諾なく制限を免れて利用する行為。",
    shortEn:
      "Using a computer with access control without authorization by bypassing its restrictions.",
    explanationJa:
      "①他人の識別符号を入力して制限を免れる行為、②識別符号以外の情報・指令を入力して制限を免れる行為、③ネットワーク越しに他の計算機のアクセス制御機能の制限を免れる行為の3類型をいう。アクセス管理者自身が行う場合のほか、第1号はアクセス管理者又は利用権者の承諾、第2号・第3号はアクセス管理者の承諾がある場合は該当しない。",
    explanationEn:
      "The Act defines three types: entering another person's identification code to bypass restrictions; entering other information or commands to bypass restrictions; and bypassing restrictions through a networked computer. Acts by the administrator are excluded; type 1 also excludes acts with the administrator's or authorized user's consent, while types 2 and 3 require the administrator's consent.",
    examUsage:
      "「ID・パスワードを入力した」だけでなく、「セキュリティホールを突いた」「制限を回避した」も不正アクセス。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-access-control-function",
      "law-identification-code",
      "law-facilitation-act",
    ],
    tags: ["不正アクセス禁止法", "定義"],
  },
  {
    id: "law-access-control-function",
    ja: "アクセス制御機能",
    reading: "アクセスせいぎょきのう",
    en: "Access Control Function",
    shortJa:
      "特定電子計算機の利用を、入力された符号の確認によって自動的に制限・解除する機能。",
    shortEn:
      "A function that automatically restricts or releases use of a computer after verifying an entered code.",
    explanationJa:
      "入力された符号が正規の識別符号であることを確認し、特定利用の制限の全部または一部を解除する機能をいう。ID・パスワードによる認証のほか、生体認証なども含まれる。この機能があることが不正アクセス禁止法の適用前提となる。",
    explanationEn:
      "The function verifies that an entered code is a valid identification code and releases all or part of the restriction on use. It includes ID/password authentication and biometric authentication. The existence of this function is a precondition for applying the Unauthorized Access Prohibition Act.",
    examUsage:
      "アクセス制御機能のないシステムへの侵入は、不正アクセス禁止法ではなく刑法の建造物侵入罪などが問題になり得る。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-unauthorized-access",
      "law-identification-code",
    ],
    tags: ["不正アクセス禁止法", "定義"],
  },
  {
    id: "law-identification-code",
    ja: "識別符号",
    reading: "しきべつふごう",
    en: "Identification Code",
    shortJa:
      "アクセス管理者が利用者を区別するために付す、ID・パスワードなどの符号。",
    shortEn:
      "A code such as an ID or password assigned by the access administrator to distinguish users.",
    explanationJa:
      "アクセス管理者が、利用権者等を他の利用権者等と区別して識別できるように付す符号で、①第三者に知られてはならないもの、②身体の影像・音声から作成されるもの、③署名から作成されるもの、またはこれらの組合せをいう。他人の識別符号を不正に取得・提供・保管する行為は助長行為として処罰される。",
    explanationEn:
      "An identification code is assigned by the access administrator to distinguish authorized users. It includes codes that must not be disclosed to third parties, codes created from images or voice of the body, and codes created from signatures, or combinations thereof. Obtaining, providing, or storing another person's code wrongfully is punished as a facilitating act.",
    examUsage:
      "識別符号は「パスワード」だけではない。生体認証データや電子署名も含まれる。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-access-control-function",
      "law-facilitation-act",
      "law-phishing",
    ],
    tags: ["不正アクセス禁止法", "定義"],
  },
  {
    id: "law-facilitation-act",
    ja: "助長行為",
    reading: "じょちょうこうい",
    en: "Facilitating Act",
    shortJa:
      "不正アクセス行為を誘発・容易にする、識別符号の不正取得・提供・保管・入力要求。",
    shortEn:
      "Acts that induce or ease unauthorized access, such as wrongfully obtaining, providing, storing, or requesting identification codes.",
    explanationJa:
      "不正アクセス行為そのものではないが、それを助長する行為をいう。①不正アクセス行為の用に供する目的での他人の識別符号の取得、②識別符号の提供、③不正に取得された識別符号の保管、④管理者になりすまして識別符号の入力を求める行為が該当する。法定刑は1年以下の懲役又は50万円以下の罰金が基本だが、第5条の提供で相手方の目的を知らない場合は30万円以下の罰金となる。",
    explanationEn:
      "Facilitating acts are not unauthorized access itself but make it easier: obtaining another person's identification code for use in unauthorized access; providing such a code; storing a wrongfully obtained code; and impersonating the administrator to request code entry. The basic penalty is imprisonment for up to one year or a fine of up to 500,000 yen; providing a code without knowledge of the recipient's purpose carries a fine of up to 300,000 yen.",
    examUsage:
      "助長行為は「他人のID・パスワードを不正に取得・提供する」行為。自分がログインしていなくても処罰対象になる。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-unauthorized-access",
      "law-identification-code",
      "law-phishing",
    ],
    tags: ["不正アクセス禁止法", "助長行為"],
  },
  {
    id: "law-cybersecurity-basic-act",
    ja: "サイバーセキュリティ基本法",
    reading: "サイバーセキュリティきほんほう",
    en: "Cybersecurity Basic Act",
    shortJa:
      "国のサイバーセキュリティ施策の基本理念・責務・体制を定める基本法。",
    shortEn:
      "A basic law setting out the principles, responsibilities, and framework for national cybersecurity policy.",
    explanationJa:
      "2014年に制定された基本法で、情報の自由な流通の確保、国民の権利利益の保護などを基本理念とし、国・地方公共団体・重要インフラ事業者・サイバー関連事業者・教育研究機関・国民の責務を定める。サイバーセキュリティ戦略本部を設置し、政府全体の戦略策定を担う。",
    explanationEn:
      "Enacted in 2014, the Act sets out principles including ensuring the free flow of information and protecting the rights and interests of citizens. It defines the responsibilities of the national and local governments, critical infrastructure operators, cybersecurity-related businesses, educational and research institutions, and citizens. It establishes the Cybersecurity Strategy Headquarters to lead government-wide strategy.",
    examUsage:
      "具体的な罰則や規制を定める法律ではなく、施策の基本を定める「基本法」である点が問われる。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: ["law-unauthorized-access", "law-platform-act"],
    tags: ["サイバーセキュリティ基本法", "基本法"],
  },
  {
    id: "law-specified-email-act",
    ja: "特定電子メール法",
    reading: "とくていでんしメールほう",
    en: "Act on Regulation of Transmission of Specified Electronic Mail",
    shortJa:
      "広告宣伝目的の電子メールを規制する法律。原則オプトイン。",
    shortEn:
      "The law regulating advertising email, based on an opt-in principle.",
    explanationJa:
      "特定電子メールの送信の適正化等に関する法律。営業のために広告宣伝目的の電子メールを送る場合、原則としてあらかじめ同意した者にしか送信できない（オプトイン）。送信者情報の表示、受信拒否者への再送信禁止、送信者情報の偽装禁止などを定める。主要な違反には1年以下の懲役又は100万円以下の罰金、法人には3,000万円以下の罰金が科され得る。",
    explanationEn:
      "The Act regulates advertising email sent for business. In principle, email may be sent only to recipients who have given prior consent (opt-in). It also requires sender information, prohibits resending to recipients who have refused, and prohibits falsifying sender information. Major violations can result in imprisonment for up to one year or a fine of up to 1 million yen, and up to 30 million yen for corporations.",
    examUsage:
      "2011年改正でオプトアウトからオプトインへ移行。迷惑メール対策の基本。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: ["law-platform-act", "law-phishing"],
    tags: ["特定電子メール法", "迷惑メール"],
  },
  {
    id: "law-platform-act",
    ja: "情報流通プラットフォーム対処法",
    reading: "じょうほうりゅうつうプラットフォームたいしょほう",
    en: "Information Distribution Platform Act",
    shortJa:
      "旧プロバイダ責任制限法。プロバイダの免責と発信者情報開示、大規模事業者の義務を定める。",
    shortEn:
      "Formerly the Provider Liability Act; it covers provider immunity, disclosure of sender information, and duties of large platforms.",
    explanationJa:
      "2024年5月公布、2025年4月1日全面施行。特定電気通信による権利侵害情報について、プロバイダが削除等の措置を講じた場合の損害賠償責任の制限、発信者情報の開示請求、大規模なプラットフォーム事業者に対する削除申出対応の迅速化・透明化の義務などを定める。",
    explanationEn:
      "Promulgated in May 2024 and fully in force on 1 April 2025, the Act limits provider liability when providers remove or otherwise address infringing information, provides for disclosure of sender information, and imposes duties on large platform operators to handle removal requests promptly and transparently.",
    examUsage:
      "旧法名はプロバイダ責任制限法。2025年4月からの新名称と大規模事業者の義務が狙われる。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-provider-liability",
      "law-cybersecurity-basic-act",
    ],
    tags: ["情報流通プラットフォーム対処法", "プロバイダ"],
  },
  {
    id: "law-computer-fraud",
    ja: "電子計算機使用詐欺罪",
    reading: "でんしけいさんきしようさぎざい",
    en: "Computer Fraud",
    shortJa:
      "電子計算機に虚偽の情報や不正な指令を与え、財産上の不法利益を得る罪。",
    shortEn:
      "Obtaining unlawful financial benefit by feeding false information or improper commands to a computer.",
    explanationJa:
      "刑法246条の2。人の事務処理に用いる電子計算機に虚偽の情報または不正な指令を与え、財産権の得喪・変更に関する不実の電磁的記録を作成し、または虚偽の記録を事務処理に供して、財産上の不法利益を得る行為をいう。ネットバンキングの不正送金などが典型例で、10年以下の懲役に処される。",
    explanationEn:
      "Article 246-2 of the Penal Code punishes obtaining unlawful financial benefit by giving false information or improper commands to a computer used for another person's affairs, creating a false electromagnetic record concerning rights, or using such a record in processing. Unauthorized online banking transfers are a typical case, punishable by up to ten years' imprisonment.",
    examUsage:
      "財産上の利益を得た点がポイント。財産的利益がなければ、電磁的記録不正作出罪など別の罪を検討する。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-electromagnetic-record-forgery",
      "law-unauthorized-access",
    ],
    tags: ["刑法", "サイバー犯罪"],
  },
  {
    id: "law-computer-destruction",
    ja: "電子計算機損壊等業務妨害罪",
    reading: "でんしけいさんきそんかいとうぎょうむぼうがいざい",
    en: "Obstruction of Business by Damaging a Computer",
    shortJa:
      "電子計算機やデータを壊し、または不正な指令を与えて業務を妨害する罪。",
    shortEn:
      "Obstructing business by damaging a computer or data, or by giving improper commands.",
    explanationJa:
      "刑法234条の2。人の業務に使用する電子計算機もしくは電磁的記録を損壊し、または電子計算機に虚偽の情報・不正な指令を与えて、業務を妨害する行為をいう。DDoS攻撃やランサムウェアによる業務停止などが該当し得る。5年以下の懲役又は100万円以下の罰金に処される。",
    explanationEn:
      "Article 234-2 of the Penal Code punishes obstructing another person's business by damaging a computer or electromagnetic record used in that business, or by giving false information or improper commands to a computer. DDoS attacks and ransomware-caused outages can qualify. The penalty is up to five years' imprisonment or a fine of up to 1 million yen.",
    examUsage:
      "「業務妨害」の結果が必要。単にデータを消しただけでは、毀棄罪や不正指令電磁的記録の罪も検討する。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-virus-creation",
      "law-computer-fraud",
    ],
    tags: ["刑法", "サイバー犯罪"],
  },
  {
    id: "law-electromagnetic-record-forgery",
    ja: "電磁的記録不正作出・供用罪",
    reading: "でんじてききろくふせいさくしゅつきょうようざい",
    en: "Unlawful Creation of Electromagnetic Records",
    shortJa:
      "人の事務処理を誤らせる目的で、権利・義務・事実証明に関する電磁的記録を不正に作る罪。",
    shortEn:
      "Wrongfully creating electromagnetic records concerning rights, obligations, or proof of facts to mislead processing.",
    explanationJa:
      "刑法161条の2。人の事務処理を誤らせる目的で、権利・義務または事実証明に関する電磁的記録を不正に作出し、または不正に作出された電磁的記録を人の事務処理の用に供する行為をいう。私電磁的記録は5年以下、公電磁的記録は10年以下の懲役に処される。",
    explanationEn:
      "Article 161-2 of the Penal Code punishes creating a false electromagnetic record concerning rights, obligations, or proof of facts for the purpose of misleading another person's processing, or using such a record in processing. Private records carry up to five years' imprisonment; public records up to ten years.",
    examUsage:
      "財産上の利益ではなく「事務処理を誤らせる」点が電子計算機使用詐欺罪との違い。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-computer-fraud",
      "law-computer-destruction",
    ],
    tags: ["刑法", "サイバー犯罪"],
  },
  {
    id: "law-virus-creation",
    ja: "不正指令電磁的記録作成等罪",
    reading: "ふせいしれいでんじてききろくさくせいとうざい",
    en: "Unlawful Creation of Malicious Programs",
    shortJa:
      "ウイルスなどの不正な指令を与える電磁的記録を作成・提供する罪。",
    shortEn:
      "Creating or providing electromagnetic records containing improper commands, such as malware.",
    explanationJa:
      "刑法168条の2。正当な理由がないのに、人の電子計算機における実行の用に供する目的で、不正な指令を与える電磁的記録を作成し、または提供する行為をいう。3年以下の懲役又は50万円以下の罰金に処される。実行させた場合は、電子計算機損壊等業務妨害罪など他の罪も問題になる。",
    explanationEn:
      "Article 168-2 of the Penal Code punishes, without justifiable grounds, creating or providing an electromagnetic record containing an improper command for execution on another person's computer. The penalty is up to three years' imprisonment or a fine of up to 500,000 yen. If executed, other offences such as obstruction of business may also apply.",
    examUsage:
      "「ウイルス作成罪」と呼ばれるが、作成だけでなく提供も処罰対象。正当な理由（セキュリティ研究等）の有無が争点になる。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-computer-destruction",
      "law-unauthorized-access",
    ],
    tags: ["刑法", "マルウェア"],
  },
  {
    id: "law-phishing",
    ja: "フィッシング",
    reading: "フィッシング",
    en: "Phishing",
    shortJa:
      "偽のWebサイトやメールでID・パスワード・クレジットカード情報を騙し取る攻撃。",
    shortEn:
      "An attack that tricks users into revealing credentials or card details via fake sites or emails.",
    explanationJa:
      "金融機関やECサイトを装ったメール・SMS・Webサイトに誘導し、認証情報やカード情報を入力させる攻撃である。不正アクセス禁止法7条は、管理者になりすまして識別符号の入力を求める行為を禁止している。取得した情報で不正ログインすれば、不正アクセス行為や電子計算機使用詐欺罪にも該当し得る。",
    explanationEn:
      "Phishing lures users to emails, SMS, or websites impersonating banks or online shops and induces them to enter credentials or card details. Article 7 of the Unauthorized Access Prohibition Act prohibits impersonating the administrator to request identification code entry. Using the obtained credentials to log in can also constitute unauthorized access or computer fraud.",
    examUsage:
      "フィッシングは「入力要求」自体が助長行為として処罰される点が特徴。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: [
      "law-identification-code",
      "law-facilitation-act",
      "law-specified-email-act",
    ],
    tags: ["フィッシング", "ソーシャルエンジニアリング"],
  },
  {
    id: "law-provider-liability",
    ja: "プロバイダ責任",
    reading: "プロバイダせきにん",
    en: "Provider Liability",
    shortJa:
      "プロバイダが権利侵害情報を削除した場合の責任や、発信者情報を開示する義務。",
    shortEn:
      "Provider liability when removing infringing content and the duty to disclose sender information.",
    explanationJa:
      "プロバイダは、権利侵害情報の削除等の措置を講じた場合、故意・重過失がなければ損害賠償責任を負わない。権利侵害が明白で、損害賠償請求のために必要かつ正当な理由がある場合は、発信者情報の開示請求に応じる。情報流通プラットフォーム対処法がこの枠組みを定める。",
    explanationEn:
      "A provider that removes or otherwise addresses infringing information is not liable for damages absent intentional or grossly negligent conduct. It must respond to a request for sender information when the infringement is clear, disclosure is necessary to pursue damages, and there are justifiable grounds. The Information Distribution Platform Act sets out this framework.",
    examUsage:
      "プロバイダは常に削除義務を負うわけではない。免責要件と開示請求の要件を区別する。",
    lessonIds: ["law/cyber-criminal"],
    relatedTermIds: ["law-platform-act"],
    tags: ["プロバイダ", "情報流通"],
  },
  {
    id: "law-copyright",
    ja: "著作権",
    reading: "ちょさくけん",
    en: "Copyright",
    shortJa:
      "著作物を創作した者に認められる、複製・公衆送信などの権利。",
    shortEn:
      "The rights of the creator of a work, including reproduction and public transmission.",
    explanationJa:
      "著作物とは、思想または感情を創作的に表現したもので、文芸・学術・美術・音楽の範囲に属するものをいう。著作権は創作と同時に発生し、登録は不要である。著作者の死後70年（法人著作は公表後70年）保護される。財産権のほか、公表権・氏名表示権・同一性保持権などの著作者人格権がある。",
    explanationEn:
      "A work is a creative expression of thought or feeling in the literary, academic, artistic, or musical domain. Copyright arises upon creation and requires no registration. Protection lasts for 70 years after the author's death (70 years after publication for corporate works). It includes economic rights and moral rights such as publication, attribution, and integrity.",
    examUsage:
      "アイデアやデータそのものは著作権で保護されない。表現の創作性が要件。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-quotation", "law-technical-protection"],
    tags: ["著作権法", "知的財産"],
  },
  {
    id: "law-quotation",
    ja: "引用",
    reading: "いんよう",
    en: "Quotation",
    shortJa:
      "公表された著作物を、要件を満たして自分の著作物に引用する利用。",
    shortEn:
      "Using a published work in one's own work while satisfying statutory requirements.",
    explanationJa:
      "著作権法32条1項により、公表された著作物は、公正な慣行に合致し、報道・批評・研究などの目的上正当な範囲内で引用できる。引用部分と自分の著作物の明瞭な区分（明瞭区分性）、引用が従たる関係（主従関係）、出所の明示（48条）が求められる。要件を満たさなければ著作権侵害となる。",
    explanationEn:
      "Article 32(1) of the Copyright Act permits quoting a published work in a manner consistent with fair practice and within the scope justified by purposes such as news reporting, criticism, or research. The quotation must be clearly distinguished, subordinate to the quoting work, and the source must be indicated. Failure to meet these requirements infringes copyright.",
    examUsage:
      "「引用すれば自由に使える」は誤り。4要件をすべて満たす必要がある。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-copyright", "law-fake-news"],
    tags: ["著作権法", "引用"],
  },
  {
    id: "law-trade-secret",
    ja: "営業秘密",
    reading: "えいぎょうひみつ",
    en: "Trade Secret",
    shortJa:
      "秘密管理性・有用性・非公知性の3要件を満たす技術上・営業上の情報。",
    shortEn:
      "Technical or business information meeting the three requirements of secrecy management, usefulness, and non-publicity.",
    explanationJa:
      "不正競争防止法2条6項。①秘密として管理されていること、②有用な情報であること、③公然と知られていないことの3要件を満たす技術上または営業上の情報をいう。特許と異なり公開せずに保護できるが、独自に開発された場合やリバースエンジニアリングには保護が及ばない場合がある。",
    explanationEn:
      "Article 2(6) of the Unfair Competition Prevention Act defines a trade secret as technical or business information satisfying three requirements: it is managed as a secret, it is useful, and it is not publicly known. Unlike a patent, it can be protected without disclosure, but independent development and reverse engineering may fall outside protection.",
    examUsage:
      "3要件のうち「秘密管理性」が最も問われる。アクセス制限や秘密表示などの管理措置が必要。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: [
      "law-limited-provision-data",
      "law-nda",
      "law-copyright",
    ],
    tags: ["不正競争防止法", "営業秘密"],
  },
  {
    id: "law-limited-provision-data",
    ja: "限定提供データ",
    reading: "げんていていきょうデータ",
    en: "Limited Provision Data",
    shortJa:
      "業として特定の者に提供され、電磁的方法で相当量蓄積・管理される技術上・営業上の情報。",
    shortEn:
      "Technical or business data provided to specified persons and accumulated and managed electronically in substantial volume.",
    explanationJa:
      "不正競争防止法2条7項。①限定提供性（業として特定の者に提供）、②相当蓄積性（電磁的方法により相当量蓄積）、③電磁的管理性（電磁的方法により管理）の3要件を満たす技術上または営業上の情報で、営業秘密を除く。2019年7月1日施行の改正で新設された。データの不正取得・使用・開示が不正競争行為となる。",
    explanationEn:
      "Article 2(7) of the Unfair Competition Prevention Act covers technical or business information that is provided to specified persons in the course of business, accumulated in substantial volume by electronic means, and managed electronically, excluding trade secrets. Introduced by the amendment effective 1 July 2019, it treats wrongful acquisition, use, and disclosure of such data as unfair competition.",
    examUsage:
      "営業秘密は「秘密管理性」、限定提供データは「限定提供性」。両者は別の制度。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-trade-secret", "law-copyright"],
    tags: ["不正競争防止法", "データ"],
  },
  {
    id: "law-technical-protection",
    ja: "技術的保護手段（コピープロテクト）",
    reading: "ぎじゅつてきほごしゅだん",
    en: "Technological Protection Measures",
    shortJa: "著作物の複製やアクセスを技術的に制限する仕組み。",
    shortEn:
      "Technical mechanisms that restrict copying or access to copyrighted works.",
    explanationJa:
      "コピープロテクトやアクセスコントロールなど、著作物の利用を技術的に制限する手段をいう。私的使用目的でも、技術的保護手段の回避によって作成された複製は著作権法30条1項2号により許されない。不正競争防止法でも、技術的制限手段の回避行為や回避装置の提供が不正競争として扱われる。",
    explanationEn:
      "These are technical measures such as copy protection and access control that restrict use of works. Even for private use, copies made by circumventing technological protection measures are not permitted under Article 30(1)(ii) of the Copyright Act. The Unfair Competition Prevention Act also treats circumvention and the provision of circumvention devices as unfair competition.",
    examUsage:
      "「私的複製なら何でも許される」わけではない。コピープロテクト外しは違法となり得る。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-copyright", "law-software-license"],
    tags: ["著作権法", "コピープロテクト"],
  },
  {
    id: "law-labor-dispatch",
    ja: "労働者派遣",
    reading: "ろうどうしゃはけん",
    en: "Labor Dispatch",
    shortJa:
      "派遣元が雇用する労働者が、派遣先の指揮命令を受けて働く形態。",
    shortEn:
      "A form of work in which employees of a dispatcher work under the direction of a client company.",
    explanationJa:
      "労働者派遣法に基づき、派遣元が労働者を雇用し、派遣先の指揮命令を受けて労働させる形態をいう。派遣元は雇用主として賃金・社会保険・労働安全衛生などの責任を負い、派遣先は指揮命令権を持つ。派遣には許可が必要で、派遣可能期間は原則3年である。",
    explanationEn:
      "Under the Workers Dispatch Act, the dispatcher employs the worker while the client company directs the work. The dispatcher bears employer responsibilities such as wages, social insurance, and occupational safety, while the client holds the right to direct work. Dispatch requires a license, and the dispatch period is generally limited to three years.",
    examUsage:
      "派遣は「雇用主は派遣元、指揮命令は派遣先」。請負との最大の違い。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-contract-for-work", "law-quasi-mandate"],
    tags: ["労働者派遣法", "契約"],
  },
  {
    id: "law-contract-for-work",
    ja: "請負契約",
    reading: "うけおいけいやく",
    en: "Contract for Work",
    shortJa:
      "一方が仕事の完成を約し、他方がその結果に対価を支払う契約。",
    shortEn:
      "A contract in which one party promises to complete work and the other pays for the result.",
    explanationJa:
      "民法632条。仕事の完成を目的とする契約で、請負人は成果物の完成義務を負う。注文者は請負人の労働者に直接指揮命令をしてはならず、これを破ると偽装請負として労働者派遣法違反などが問題になる。2020年4月の民法改正により、瑕疵担保責任は契約不適合責任に改められた。",
    explanationEn:
      "Article 632 of the Civil Code defines a contract for work: the contractor must complete the work and the client pays for the result. The client must not directly direct the contractor's workers; doing so may constitute disguised dispatch in violation of the Workers Dispatch Act. Since April 2020, defect liability has been reorganized as liability for non-conformity to contract.",
    examUsage:
      "請負は「成果物の完成」、準委任は「事務の処理」。指揮命令の有無が偽装請負の判断基準。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: [
      "law-quasi-mandate",
      "law-labor-dispatch",
      "law-model-contract",
    ],
    tags: ["民法", "契約"],
  },
  {
    id: "law-quasi-mandate",
    ja: "準委任契約",
    reading: "じゅんいにんけいやく",
    en: "Quasi-Mandate Contract",
    shortJa:
      "事務の処理を目的とし、成果物の完成義務を負わない契約。",
    shortEn:
      "A contract for performing services, without an obligation to complete a specific deliverable.",
    explanationJa:
      "民法643条・656条。法律行為以外の事務の処理を委託する契約で、受託者は善管注意義務を負うが、仕事の完成義務は負わない。システム開発では、要件定義・設計・運用保守・コンサルティングなど、仕様を事前に確定しにくい業務に適する。アジャイル開発で採用されることが多い。",
    explanationEn:
      "Articles 643 and 656 of the Civil Code govern entrustment of non-legal affairs. The entrusted party owes a duty of care as a good manager but does not owe completion of a specific work product. In system development, it suits requirements definition, design, operations, maintenance, and consulting where specifications are hard to fix in advance. Agile development often uses this form.",
    examUsage:
      "準委任は「完成義務なし・善管注意義務あり」。請負との対比で問われる。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: [
      "law-contract-for-work",
      "law-model-contract",
      "law-labor-dispatch",
    ],
    tags: ["民法", "契約"],
  },
  {
    id: "law-nda",
    ja: "NDA（秘密保持契約）",
    reading: "エヌディーエー",
    en: "Non-Disclosure Agreement",
    abbr: "NDA",
    shortJa:
      "秘密情報の取扱いを定め、目的外利用や第三者開示を防ぐ契約。",
    shortEn:
      "A contract governing confidential information and preventing misuse or disclosure to third parties.",
    explanationJa:
      "秘密情報の定義、利用目的の限定、第三者への開示禁止、返還・破棄、契約期間、例外（公知情報・既知情報・独自開発・法令に基づく開示）などを定める。情報を提供する側と受ける側の双方が負担する双務型と、一方のみが負担する片務型がある。委託開発では、再委託先への展開も定める。",
    explanationEn:
      "An NDA defines confidential information, limits the purpose of use, prohibits disclosure to third parties, addresses return or destruction, sets the term, and lists exceptions such as public, previously known, independently developed, or legally required information. It may be mutual or one-way. In outsourced development, it should also cover subcontractors.",
    examUsage:
      "NDAは「秘密にする」契約であり、営業秘密の秘密管理性を補強する意味もある。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: [
      "law-trade-secret",
      "law-model-contract",
      "law-software-license",
    ],
    tags: ["契約", "秘密保持"],
  },
  {
    id: "law-software-license",
    ja: "ソフトウェア使用許諾契約",
    reading: "ソフトウェアしようきょだくけいやく",
    en: "Software License Agreement",
    shortJa:
      "著作権を留保したまま、ソフトウェアの使用権を許諾する契約。",
    shortEn:
      "A contract granting a right to use software while the licensor retains copyright.",
    explanationJa:
      "ソフトウェアの著作権はライセンサーに留保し、利用者に使用権を許諾する。許諾範囲（台数・ユーザー数・同時利用数・利用環境）、複製・改変・再配布・リバースエンジニアリングの可否、保証、監査などを定める。買い切り型、サブスクリプション型、従量課金型などがある。",
    explanationEn:
      "The licensor retains copyright and grants the user a right to use the software. The agreement defines the scope of the license (devices, users, concurrent use, environment), permissions for copying, modification, redistribution, and reverse engineering, warranties, and audits. Models include perpetual, subscription, and usage-based licensing.",
    examUsage:
      "「ソフトを買った」は所有権の移転ではなく、使用権の許諾であることが多い。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-copyright", "law-technical-protection"],
    tags: ["契約", "ライセンス"],
  },
  {
    id: "law-model-contract",
    ja: "開発委託モデル契約",
    reading: "かいはついたくモデルけいやく",
    en: "Model Contract for System Development",
    shortJa:
      "情報システム開発の委託で、請負・準委任の使い分けや責任分界を定めるモデル契約。",
    shortEn:
      "A model contract for system development clarifying the choice between fixed-scope and service contracts and the division of responsibility.",
    explanationJa:
      "IPAが公開する「情報システム・モデル取引・契約書」などが代表的である。企画、要件定義、設計、開発、運用の各フェーズで、請負契約と準委任契約のどちらが適するかを整理し、成果物の範囲、変更管理、検収、知的財産権の帰属、損害賠償の上限などを定める。",
    explanationEn:
      "IPA's Model Transactions and Contracts for Information Systems is a representative example. It organizes whether a contract for work or a quasi-mandate fits each phase — planning, requirements, design, development, and operations — and addresses deliverables, change management, acceptance, IP ownership, and liability caps.",
    examUsage:
      "仕様が固まっていれば請負、固まっていなければ準委任。アジャイルは準委任が基本。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: [
      "law-contract-for-work",
      "law-quasi-mandate",
      "law-nda",
    ],
    tags: ["IPA", "契約"],
  },
  {
    id: "law-de-jure-standard",
    ja: "デジュレ標準",
    reading: "デジュレひょうじゅん",
    en: "De Jure Standard",
    shortJa: "公的な標準化機関が制定した標準。",
    shortEn: "A standard established by an official standards body.",
    explanationJa:
      "ISO、IEC、ITUなどの公的な標準化機関が定めた標準や、日本産業規格（JIS）をいう。法的拘束力は原則としてないが、調達要件や認証制度を通じて実質的な強制力を持つことがある。相互運用性や取引の円滑化を目的とする。",
    explanationEn:
      "De jure standards are established by official standards bodies such as ISO, IEC, and ITU, or are national standards such as Japan's JIS. They are generally not legally binding, but procurement requirements and certification schemes can give them practical force. Their purpose is interoperability and smoother transactions.",
    examUsage:
      "デジュレは「公的機関」、デファクトは「市場の実績」。例で判別する。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-de-facto-standard"],
    tags: ["標準化", "JIS"],
  },
  {
    id: "law-de-facto-standard",
    ja: "デファクト標準",
    reading: "デファクトひょうじゅん",
    en: "De Facto Standard",
    shortJa: "市場での普及によって事実上の標準になった仕様。",
    shortEn:
      "A specification that has become a de facto standard through market adoption.",
    explanationJa:
      "公的な標準化機関の制定を待たず、市場シェアや利用の広がりによって事実上の標準となった仕様をいう。Windows、Ethernet、TCP/IPなどが例として挙げられる。利用者が多いほど互換性の価値が高まるネットワーク効果が働く。",
    explanationEn:
      "A de facto standard emerges through market share and widespread use rather than formal adoption by a standards body. Examples include Windows, Ethernet, and TCP/IP. Network effects make compatibility more valuable as more users adopt the specification.",
    examUsage:
      "デファクトは「市場が決めた標準」。デジュレとの対比で出題される。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-de-jure-standard"],
    tags: ["標準化", "デファクト"],
  },
  {
    id: "law-engineering-ethics",
    ja: "技術者倫理",
    reading: "ぎじゅつしゃりんり",
    en: "Engineering Ethics",
    shortJa:
      "技術者が公衆の安全・健康・福祉を最優先に行動するための規範。",
    shortEn:
      "Norms requiring engineers to put public safety, health, and welfare first.",
    explanationJa:
      "技術者は、専門知識を社会の利益のために用い、公衆の安全・健康・福祉を最優先する責任を負う。誠実性、守秘義務、利益相反の回避、説明責任、専門能力の維持、責任ある脆弱性開示などが含まれる。組織の利益と公益が衝突する場合の判断が問われる。",
    explanationEn:
      "Engineers must use their expertise for society's benefit and prioritize public safety, health, and welfare. This includes honesty, confidentiality, avoiding conflicts of interest, accountability, maintaining competence, and responsible vulnerability disclosure. The hard cases arise when organizational interests conflict with the public good.",
    examUsage:
      "「上司の命令だから」は免責理由にならない。公衆の安全が最優先。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-fake-news", "law-nda"],
    tags: ["倫理", "技術者"],
  },
  {
    id: "law-fake-news",
    ja: "フェイクニュース",
    reading: "フェイクニュース",
    en: "Fake News",
    shortJa:
      "事実と異なる情報や、誤解を招く目的で流される情報。",
    shortEn:
      "False or misleading information spread either accidentally or intentionally.",
    explanationJa:
      "誤って広がる誤情報（misinformation）と、意図的に流される偽情報（disinformation）がある。SNSのアルゴリズムによるエコーチェンバーやフィルターバブルが拡散を助長する。ファクトチェック、情報源の確認、メディアリテラシーの向上が対策となる。表現の自由とのバランスも論点になる。",
    explanationEn:
      "Fake news includes misinformation that spreads by mistake and disinformation spread intentionally. Social media algorithms, echo chambers, and filter bubbles accelerate diffusion. Countermeasures include fact-checking, source verification, and media literacy, balanced against freedom of expression.",
    examUsage:
      "誤情報と偽情報の違い、ファクトチェック、フィルタリングの用語を整理する。",
    lessonIds: ["law/ip-contract"],
    relatedTermIds: ["law-quotation", "law-engineering-ethics"],
    tags: ["情報倫理", "メディア"],
  },
];
