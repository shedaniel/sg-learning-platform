import type { Question } from "@/lib/content/types";

export const cryptoQuestions: Question[] = [
  {
    id: "q-security-crypto-001",
    part: "A",
    topicIds: ["sec-crypto"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "easy",
    type: "knowledge",
    stem: "暗号化と復号に同一の鍵を用いる暗号方式はどれか。",
    options: [
      { id: "a", text: "共通鍵暗号" },
      { id: "i", text: "公開鍵暗号" },
      { id: "u", text: "ハッシュ関数" },
      { id: "e", text: "デジタル署名" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は共通鍵暗号である。AESが代表例で、暗号化と復号に同じ鍵を使う。",
      why: [
        "共通鍵暗号は、送信者と受信者が同じ鍵を共有する。",
        "公開鍵暗号は公開鍵と秘密鍵の対を使い、ハッシュ関数は復号を目的としない。",
      ],
      optionNotes: {
        a: "正解である。同一の鍵を使う方式が共通鍵暗号である。",
        i: "公開鍵暗号は、暗号化と復号で異なる鍵を使う。",
        u: "ハッシュ関数は一方向関数であり、暗号化と復号の対をなさない。",
        e: "デジタル署名は、秘密鍵で署名し公開鍵で検証する仕組みである。",
      },
      english:
        "Symmetric cryptography uses the same key for encryption and decryption. AES is a typical example.",
      termIds: ["sec-common-key", "sec-public-key"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["暗号", "共通鍵"],
  },
  {
    id: "q-security-crypto-002",
    part: "A",
    topicIds: ["sec-crypto"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "easy",
    type: "knowledge",
    stem: "TLSなどの通信でハイブリッド暗号が使われる理由として最も適切なものはどれか。",
    options: [
      { id: "a", text: "公開鍵暗号で共通鍵を安全に配送し、本文は高速な共通鍵暗号で処理するため" },
      { id: "i", text: "公開鍵暗号だけで大量のデータを高速に処理するため" },
      { id: "u", text: "ハッシュ関数で暗号文を復号できるようにするため" },
      { id: "e", text: "共通鍵を公開して誰でも復号できるようにするため" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、公開鍵暗号で共通鍵を配送し、共通鍵暗号で本文を処理する組合せである。",
      why: [
        "公開鍵暗号は鍵配送の問題を緩和するが、計算コストが高い。",
        "共通鍵暗号は高速で大量データに向くため、両者を組み合わせる。",
      ],
      optionNotes: {
        a: "正解である。鍵配送と高速処理の利点を組み合わせている。",
        i: "公開鍵暗号は一般に共通鍵暗号より遅く、大量データの処理には向かない。",
        u: "ハッシュ関数は一方向性を持ち、暗号文の復号には使えない。",
        e: "共通鍵を公開すると、誰でも復号できてしまい機密性が失われる。",
      },
      english:
        "Hybrid encryption uses public-key cryptography to distribute a symmetric key and symmetric encryption for bulk data, combining secure key exchange with speed.",
      termIds: ["sec-common-key", "sec-public-key"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["暗号", "ハイブリッド"],
  },
  {
    id: "q-security-crypto-003",
    part: "A",
    topicIds: ["sec-crypto"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "medium",
    type: "knowledge",
    stem: "デジタル署名とMACの違いとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "デジタル署名は秘密鍵で署名し公開鍵で検証するため、否認防止を提供できる" },
      { id: "i", text: "MACは公開鍵で検証するため、否認防止を提供できる" },
      { id: "u", text: "デジタル署名は共通鍵を使うため、受信者も署名を生成できる" },
      { id: "e", text: "MACはハッシュ関数を使わないため、改ざんを検知できない" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、デジタル署名が秘密鍵による署名と公開鍵による検証を行い、否認防止を提供する点である。",
      why: [
        "秘密鍵は署名者だけが持つため、署名者は後から署名を否認しにくい。",
        "MACは共通鍵を使うため、受信者も同じMACを生成でき、否認防止にはならない。",
      ],
      optionNotes: {
        a: "正解である。鍵の非対称性が否認防止を支える。",
        i: "MACは共通鍵で生成・検証する。公開鍵は使わない。",
        u: "デジタル署名は公開鍵暗号を用いる。共通鍵ではない。",
        e: "MACもハッシュ関数やブロック暗号を用いて改ざんを検知できる。",
      },
      english:
        "Digital signatures use a private key to sign and a public key to verify, providing non-repudiation. A MAC uses a shared key, so the receiver could also generate it.",
      termIds: ["sec-digital-signature", "sec-hash", "sec-non-repudiation"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["暗号", "署名", "MAC"],
  },
  {
    id: "q-security-crypto-004",
    part: "A",
    topicIds: ["sec-auth"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "medium",
    type: "knowledge",
    stem: "多要素認証に該当するものはどれか。",
    options: [
      { id: "a", text: "パスワードと、スマートフォンで生成するワンタイムパスワード" },
      { id: "i", text: "パスワードと、秘密の質問への回答" },
      { id: "u", text: "パスワードを2回続けて入力する" },
      { id: "e", text: "同じパスワードを2つのサービスで使う" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、知識（パスワード）と所持（スマートフォン）の組合せである。異なる要素を2つ使っている。",
      why: [
        "多要素認証は、知識・所持・生体のうち異なる2つ以上を組み合わせる。",
        "パスワードと秘密の質問はどちらも知識に属するため、多要素にはならない。",
      ],
      optionNotes: {
        a: "正解である。知識と所持の組合せである。",
        i: "パスワードも秘密の質問も知識に分類されるため、多要素認証ではない。",
        u: "同じパスワードを2回入力するのは、同じ要素の繰り返しであり、多要素ではない。",
        e: "複数サービスで同じパスワードを使うことは、かえってリスクを高める。",
      },
      english:
        "MFA combines different categories such as knowledge (password) and possession (smartphone OTP). Two knowledge factors do not count as MFA.",
      termIds: ["sec-mfa", "sec-authenticity"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["認証", "多要素認証"],
  },
  {
    id: "q-security-crypto-005",
    part: "A",
    topicIds: ["sec-auth"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "medium",
    type: "knowledge",
    stem: "PKIにおいて、デジタル証明書が失効していないかを確認するために用いられるものはどれか。",
    options: [
      { id: "a", text: "CRLやOCSP" },
      { id: "i", text: "DNSのAレコード" },
      { id: "u", text: "ARPテーブル" },
      { id: "e", text: "SNMPコミュニティ名" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解はCRLやOCSPである。証明書の失効状況を確認する仕組みである。",
      why: [
        "CRLは失効した証明書のリストを配布し、OCSPはオンラインで個別に問い合わせる。",
        "秘密鍵の漏えいなどで証明書を失効させた場合、この確認が重要になる。",
      ],
      optionNotes: {
        a: "正解である。失効確認にはCRLやOCSPを使う。",
        i: "DNSのAレコードは、ホスト名とIPアドレスの対応を表す。",
        u: "ARPテーブルは、IPアドレスとMACアドレスの対応を表す。",
        e: "SNMPはネットワーク機器の監視に使われるプロトコルである。",
      },
      english:
        "Certificate revocation is checked with CRL or OCSP. DNS, ARP, and SNMP serve different purposes.",
      termIds: ["sec-pki"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["PKI", "証明書"],
  },
  {
    id: "q-security-crypto-006",
    part: "A",
    topicIds: ["sec-evaluation"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "hard",
    type: "knowledge",
    stem: "CVSSの評価基準のうち、組織固有のシステム構成や資産の重要度、緩和策の有無を反映するものはどれか。",
    options: [
      { id: "a", text: "基本評価基準（Base）" },
      { id: "i", text: "現状評価基準（Temporal）" },
      { id: "u", text: "環境評価基準（Environmental）" },
      { id: "e", text: "攻撃ベクトル（AV）" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "正解は環境評価基準である。自組織の構成や資産価値、緩和策を反映してスコアを調整する。",
      why: [
        "基本評価基準は脆弱性自体の性質を表す。",
        "現状評価基準は攻撃コードの公開状況や修正状況を反映し、環境評価基準は組織固有の条件を反映する。",
      ],
      optionNotes: {
        a: "基本評価基準は、攻撃経路や影響など脆弱性固有の性質を表す。",
        i: "現状評価基準は、時間の経過による攻撃コードや修正の状況を反映する。",
        u: "正解である。組織固有の条件を反映する。",
        e: "攻撃ベクトル（AV）は基本評価基準の一項目であり、評価基準の分類ではない。",
      },
      english:
        "Environmental metrics adjust CVSS for the organization's configuration, asset importance, and mitigations.",
      termIds: ["sec-cvss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["CVSS", "脆弱性評価"],
  },
  {
    id: "q-security-crypto-007",
    part: "A",
    topicIds: ["sec-evaluation"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "hard",
    type: "knowledge",
    stem: "脆弱性診断とペネトレーションテストの違いとして最も適切なものはどれか。",
    options: [
      { id: "a", text: "脆弱性診断は既知の脆弱性や設定不備を網羅的に確認し、ペネトレーションテストは実際の攻撃手順で侵入可能性を検証する" },
      { id: "i", text: "脆弱性診断は必ず本番環境で攻撃を実行し、ペネトレーションテストは設定ファイルの一覧を確認する" },
      { id: "u", text: "ペネトレーションテストは、脆弱性が存在しないことを証明する" },
      { id: "e", text: "どちらも事前の許可や範囲の合意なしに実施してよい" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、診断が既知の脆弱性の網羅的確認、ペネトレーションテストが実際の攻撃手順による侵入可能性の検証という違いである。",
      why: [
        "脆弱性診断は、ツールと手動確認で既知の弱点や設定不備を洗い出す。",
        "ペネトレーションテストは、複数の弱点を組み合わせ、業務への影響まで含めて検証する。",
      ],
      optionNotes: {
        a: "正解である。目的と手法の違いを正しく説明している。",
        i: "診断が必ず本番で攻撃を実行するわけではなく、ペネトレーションテストも設定確認だけではない。",
        u: "どちらの手法も、脆弱性が存在しないことを完全には証明できない。",
        e: "どちらも事前の許可、範囲の合意、個人情報や本番環境への配慮が必要である。",
      },
      english:
        "Vulnerability assessment enumerates known weaknesses, while penetration testing validates exploitability and business impact through attack-like procedures. Neither proves the absence of vulnerabilities.",
      termIds: ["sec-cvss", "sec-vulnerability"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["脆弱性診断", "ペネトレーションテスト"],
  },
  {
    id: "q-security-crypto-008",
    part: "B",
    topicIds: ["sec-crypto", "sec-auth"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "medium",
    type: "scenario",
    stem: "J社は、社内の通信を検査するプロキシを導入した。導入後、社内のブラウザで外部のWebサイトにアクセスすると、証明書の警告が表示されるようになった。原因と対応として最も適切なものはどれか。",
    options: [
      { id: "a", text: "プロキシが提示する証明書を端末が信頼していない。プロキシのルート証明書の配布と信頼設定を確認する" },
      { id: "i", text: "Webサイトのパスワードが弱い。すべての利用者にパスワード変更を求める" },
      { id: "u", text: "DNSのAレコードが壊れている。DNSSECを無効化する" },
      { id: "e", text: "バッファオーバーフローが発生している。OSを再インストールする" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、プロキシのルート証明書が端末に信頼されていないことである。信頼設定を整えるか、検査方式を見直す。",
      why: [
        "通信を検査するプロキシは、サーバとの通信を一旦終端し、端末にはプロキシの証明書を提示する。",
        "端末がそのルート証明書を信頼していなければ、証明書チェーンの検証に失敗し、警告が表示される。",
      ],
      optionNotes: {
        a: "正解である。プロキシの証明書チェーンと端末の信頼設定を確認する。",
        i: "パスワードの強度は、証明書の検証エラーの原因ではない。",
        u: "DNSSECを無効化しても、証明書の信頼問題は解決しない。",
        e: "バッファオーバーフローやOSの再インストールは、今回の症状と関係がない。",
      },
      english:
        "A TLS-inspecting proxy presents its own certificate. If endpoints do not trust the proxy's root certificate, certificate validation fails and warnings appear.",
      termIds: ["sec-pki"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "TLS", "証明書"],
  },
  {
    id: "q-security-crypto-009",
    part: "B",
    topicIds: ["sec-auth", "sec-evaluation"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "medium",
    type: "scenario",
    stem: "K社は、重要システムの入退室に生体認証を導入する。他人の入室をできるだけ防ぎたい一方、正当な利用者が締め出される影響も考慮する必要がある。運用として最も適切なものはどれか。",
    options: [
      { id: "a", text: "閾値を厳しくしてFARを下げ、FRRの上昇に備えてICカードによる代替手段と職員による確認を用意する" },
      { id: "i", text: "閾値を緩くしてFRRを下げ、FARの上昇は無視する" },
      { id: "u", text: "生体情報を全社の共有フォルダに保存し、誰でも照合できるようにする" },
      { id: "e", text: "パスワードを廃止し、生体認証だけですべてのシステムにアクセスさせる" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、FARを下げる方向に閾値を調整し、FRR上昇による締め出しに代替手段を用意することである。",
      why: [
        "FAR（他人受入率）を下げるには閾値を厳しくするが、FRR（本人拒否率）は上がる。",
        "重要システムでは誤受理の影響が大きいため、代替手段と人的確認で可用性を補う。",
      ],
      optionNotes: {
        a: "正解である。セキュリティと可用性のトレードオフを運用で補っている。",
        i: "FARの上昇を無視すると、他人が入室できるリスクが高まる。",
        u: "生体情報を共有すると、漏えい時の影響が大きく、プライバシー上の問題もある。",
        e: "単一の生体認証に依存すると、故障や誤拒否の際に全システムへアクセスできなくなる。",
      },
      english:
        "Lowering FAR requires a stricter threshold, which raises FRR. For high-security access, provide an alternative and human verification to avoid locking out legitimate users.",
      termIds: ["sec-biometrics", "sec-mfa"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "生体認証", "FAR/FRR"],
  },
  {
    id: "q-security-crypto-010",
    part: "B",
    topicIds: ["sec-crypto", "sec-evaluation"],
    lessonIds: ["security/crypto-auth"],
    difficulty: "hard",
    type: "scenario",
    stem: "L社の顧客向けWebサーバは、脆弱性診断でTLS 1.0と古い暗号スイートが有効であると指摘された。このサーバでは顧客の個人情報を扱っている。対応として最も適切なものはどれか。",
    options: [
      { id: "a", text: "CVSSのスコア、外部からの到達性、資産の重要度を踏まえて優先度を決め、TLS 1.2以降への更新と古い方式の無効化を行う" },
      { id: "i", text: "CVSSの基本評価基準が低ければ、資産の重要度にかかわらず対応しない" },
      { id: "u", text: "WAFを導入するだけで、TLSの設定は変更しない" },
      { id: "e", text: "利用者のパスワードを変更するだけで、暗号方式はそのままにする" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、CVSSと露出・資産重要度を合わせて優先度を決め、TLS 1.2以降へ更新して古い方式を無効化することである。",
      why: [
        "古いTLSや暗号スイートは、既知の攻撃に対して脆弱である。",
        "個人情報を扱う外部公開サーバは、技術的なスコアだけでなく、到達性と資産価値を含めて評価する。",
      ],
      optionNotes: {
        a: "正解である。リスク評価と技術的な対策を組み合わせている。",
        i: "CVSSの基本評価基準だけで組織の優先度は決まらない。資産の重要度や露出を考慮する。",
        u: "WAFはアプリケーション層の攻撃には有効だが、TLSのバージョンや暗号スイートの問題を解決しない。",
        e: "パスワード変更は、暗号方式の脆弱性を解消しない。",
      },
      english:
        "Prioritize based on CVSS, exposure, and asset importance, then upgrade to TLS 1.2 or later and disable legacy cipher suites. A WAF or password change does not fix weak TLS configuration.",
      termIds: ["sec-cvss", "sec-common-key", "sec-public-key"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "TLS", "CVSS"],
  },
];
