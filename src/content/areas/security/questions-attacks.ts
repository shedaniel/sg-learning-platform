import type { Question } from "@/lib/content/types";

export const attackQuestions: Question[] = [
  {
    id: "q-security-attack-001",
    part: "A",
    topicIds: ["sec-attacks-web"],
    lessonIds: ["security/attacks"],
    difficulty: "easy",
    type: "knowledge",
    stem: "SQLインジェクションへの対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "入力値をHTMLエスケープしてからSQL文に連結する" },
      { id: "i", text: "プレースホルダを用いてSQL文の構造と値を分離する" },
      { id: "u", text: "WAFを導入するだけで、アプリケーションの修正は行わない" },
      { id: "e", text: "データベースの管理者パスワードを短くする" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解は、プレースホルダ（バインド機構）によるSQL文と値の分離である。入力値が命令として解釈されなくなる。",
      why: [
        "SQLインジェクションは、入力値がSQL文の一部として解釈されることで成立する。",
        "プレースホルダを使えば、値はデータとして扱われ、SQLの構文に影響を与えない。",
      ],
      optionNotes: {
        a: "HTMLエスケープはXSS対策であり、SQLの構文を守るものではない。",
        i: "正解である。SQL文と値の分離が根本的な対策である。",
        u: "WAFは防御の一層として有効だが、アプリケーション側の根本対策を代替しない。",
        e: "パスワードを短くすると、認証の強度が下がる。",
      },
      english:
        "Prepared statements with bind parameters separate SQL structure from data and are the fundamental defense against SQL injection.",
      termIds: ["sec-sql-injection"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["Web", "SQLインジェクション"],
  },
  {
    id: "q-security-attack-002",
    part: "A",
    topicIds: ["sec-attacks-web"],
    lessonIds: ["security/attacks"],
    difficulty: "easy",
    type: "knowledge",
    stem: "クロスサイトスクリプティング（XSS）の説明として最も適切なものはどれか。",
    options: [
      { id: "a", text: "悪意あるスクリプトが、閲覧した利用者のブラウザ上で実行される" },
      { id: "i", text: "入力値がSQL文として解釈され、データベースが不正に操作される" },
      { id: "u", text: "ログイン済みの利用者に、意図しないリクエストを送信させる" },
      { id: "e", text: "通信経路の途中に割り込み、通信内容を盗聴する" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、悪意あるスクリプトが利用者のブラウザで実行される攻撃である。反射型、格納型、DOM型がある。",
      why: [
        "XSSは、Webページの出力にスクリプトが埋め込まれることで成立する。",
        "スクリプトは利用者のブラウザの権限で動作し、Cookieや画面情報を窃取される可能性がある。",
      ],
      optionNotes: {
        a: "正解である。XSSの本質はブラウザ上でのスクリプト実行である。",
        i: "SQLインジェクションの説明である。",
        u: "CSRFの説明である。XSSとは異なる。",
        e: "中間者攻撃の説明である。",
      },
      english:
        "XSS injects malicious script that executes in the victim's browser. SQL injection targets the database, CSRF forges requests, and MITM intercepts traffic.",
      termIds: ["sec-xss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["Web", "XSS"],
  },
  {
    id: "q-security-attack-003",
    part: "A",
    topicIds: ["sec-attacks-web", "sec-attacks-auth"],
    lessonIds: ["security/attacks"],
    difficulty: "medium",
    type: "knowledge",
    stem: "CSRFへの対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "推測困難なCSRFトークンを生成し、リクエストごとに検証する" },
      { id: "i", text: "すべての出力をHTMLエスケープする" },
      { id: "u", text: "パスワードをハッシュ化して保存する" },
      { id: "e", text: "ファイルのアクセス権を最小化する" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、推測困難なCSRFトークンの検証である。正規の画面から送信されたリクエストであることを確認できる。",
      why: [
        "CSRFは、ログイン済みのブラウザに意図しないリクエストを送信させる攻撃である。",
        "トークンを知らない攻撃者は、正しいトークンを含むリクエストを偽造できない。",
      ],
      optionNotes: {
        a: "正解である。トークン検証がCSRFの基本的な対策である。",
        i: "HTMLエスケープはXSS対策であり、リクエストの偽造を防ぐものではない。",
        u: "パスワードのハッシュ化は保存時の保護であり、CSRFとは直接関係しない。",
        e: "ファイルのアクセス権は、OS上のファイル保護に関する対策である。",
      },
      english:
        "CSRF defenses verify an unpredictable token that the attacker cannot know. Output escaping addresses XSS, not forged requests.",
      termIds: ["sec-csrf", "sec-xss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["Web", "CSRF"],
  },
  {
    id: "q-security-attack-004",
    part: "A",
    topicIds: ["sec-attacks-auth"],
    lessonIds: ["security/attacks"],
    difficulty: "medium",
    type: "knowledge",
    stem: "他社から流出したIDとパスワードの組を用いて、自社サービスへのログインを試す攻撃はどれか。",
    options: [
      { id: "a", text: "総当たり攻撃" },
      { id: "i", text: "辞書攻撃" },
      { id: "u", text: "パスワードリスト攻撃" },
      { id: "e", text: "セッションハイジャック" },
    ],
    correctOptionId: "u",
    explanation: {
      correct:
        "正解はパスワードリスト攻撃である。他サービスから流出した認証情報の使い回しを悪用する。",
      why: [
        "パスワードリスト攻撃は、流出したIDとパスワードの組を別のサービスで試す。",
        "利用者が複数サービスで同じパスワードを使い回していると成立しやすい。",
      ],
      optionNotes: {
        a: "総当たり攻撃は、すべての組み合わせを試す。流出した組を使うわけではない。",
        i: "辞書攻撃は、辞書語やよくあるパターンを優先して試す。",
        u: "正解である。他社の漏えい情報を使う点が特徴である。",
        e: "セッションハイジャックは、セッションIDを盗んでなりすます攻撃である。",
      },
      english:
        "A password list attack replays leaked username-password pairs against another service, exploiting password reuse.",
      termIds: ["sec-password-list", "sec-brute-force"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["認証", "パスワード"],
  },
  {
    id: "q-security-attack-005",
    part: "A",
    topicIds: ["sec-attacks-auth"],
    lessonIds: ["security/attacks"],
    difficulty: "medium",
    type: "knowledge",
    stem: "セッションハイジャックへの対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "CookieにSecure属性とHttpOnly属性を付与し、ログイン成功時にセッションIDを再発行する" },
      { id: "i", text: "セッションIDをURLのクエリパラメータに含めて共有しやすくする" },
      { id: "u", text: "パスワードを短くして入力の手間を減らす" },
      { id: "e", text: "通信を平文HTTPで行い、端末側の負荷を下げる" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、Cookieの属性設定とログイン後のセッションID再発行である。盗聴やXSSによる窃取の影響を減らし、固定化を防ぐ。",
      why: [
        "HttpOnly属性はスクリプトからのCookie読み取りを防ぎ、Secure属性は平文通信での送信を防ぐ。",
        "ログイン成功時にIDを再発行することで、攻撃者が事前に用意したIDを固定する攻撃を防ぎやすくなる。",
      ],
      optionNotes: {
        a: "正解である。属性設定とID再発行の組合せが有効である。",
        i: "セッションIDをURLに含めると、ログやRefererから漏えいしやすくなる。",
        u: "パスワードを短くすると、認証の強度が下がる。",
        e: "平文HTTPは盗聴を許し、セッションIDの窃取リスクを高める。",
      },
      english:
        "Set Secure and HttpOnly on cookies and regenerate the session ID after login. Avoid putting session IDs in URLs and always use TLS.",
      termIds: ["sec-session-hijacking", "sec-xss"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["認証", "セッション"],
  },
  {
    id: "q-security-attack-006",
    part: "A",
    topicIds: ["sec-attacks-web"],
    lessonIds: ["security/attacks"],
    difficulty: "hard",
    type: "knowledge",
    stem: "ディレクトリトラバーサルへの対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "パスを正規化したうえで、許可されたディレクトリの配下であることを検証する" },
      { id: "i", text: "エラーメッセージにファイルの絶対パスを表示する" },
      { id: "u", text: "入力されたファイル名をそのままファイルパスとして使用する" },
      { id: "e", text: "拡張子の表示だけを制限する" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、パスの正規化と許可ディレクトリの検証である。「../」を解決した後に、公開範囲外へ出ていないことを確認する。",
      why: [
        "ディレクトリトラバーサルは、相対パスによって公開領域の外のファイルを読み出す。",
        "正規化してから許可リストと照合することで、変形したパスによる回避を防ぎやすくなる。",
      ],
      optionNotes: {
        a: "正解である。正規化後の検証が重要である。",
        i: "絶対パスの表示は、攻撃者に内部構造の手がかりを与える。",
        u: "入力値をそのままパスに使うと、攻撃が成立しやすくなる。",
        e: "拡張子の制限だけでは、設定ファイルなど任意のファイルの読み出しを防げない。",
      },
      english:
        "Canonicalize the path and verify that it stays within an allowed directory. Displaying absolute paths or using raw input as a path increases risk.",
      termIds: ["sec-directory-traversal"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["Web", "パス"],
  },
  {
    id: "q-security-attack-007",
    part: "A",
    topicIds: ["sec-attacks-network"],
    lessonIds: ["security/attacks"],
    difficulty: "hard",
    type: "knowledge",
    stem: "利用者が正規のURLを入力したにもかかわらず、偽のログイン画面に誘導された。DNSサーバのキャッシュに偽の名前解決結果が登録されたことが原因である。この攻撃はどれか。",
    options: [
      { id: "a", text: "DNSキャッシュポイズニング" },
      { id: "i", text: "SQLインジェクション" },
      { id: "u", text: "クロスサイトリクエストフォージェリ" },
      { id: "e", text: "バッファオーバーフロー" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解はDNSキャッシュポイズニングである。名前解決の結果を偽装し、利用者を攻撃者のサーバへ誘導する。",
      why: [
        "DNSのキャッシュに偽のIPアドレスを覚えさせると、正しいURLでも偽サーバへ接続してしまう。",
        "DNSSECによる応答の検証やDNSソフトの更新が対策となる。",
      ],
      optionNotes: {
        a: "正解である。名前解決の偽装が原因である。",
        i: "SQLインジェクションはデータベースへの攻撃であり、名前解決とは関係しない。",
        u: "CSRFはリクエストの偽造であり、DNSの応答を書き換えるものではない。",
        e: "バッファオーバーフローはメモリ領域の上書きであり、DNSキャッシュとは異なる。",
      },
      english:
        "DNS cache poisoning corrupts name resolution so that a legitimate URL leads to an attacker's server. DNSSEC helps validate responses.",
      termIds: ["sec-dns-cache-poisoning", "sec-mitm"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["ネットワーク", "DNS"],
  },
  {
    id: "q-security-attack-008",
    part: "B",
    topicIds: ["sec-attacks-web", "sec-attacks-network"],
    lessonIds: ["security/attacks"],
    difficulty: "medium",
    type: "scenario",
    stem: "G社の技術者は、業界団体が運営する技術情報サイトを日常的に閲覧していた。そのサイトが改ざんされ、閲覧した技術者の端末がマルウェアに感染した。端末は外部のC2サーバと通信し、認証情報が窃取された。初期侵入と足場の確保を防ぐ対策として最も適切なものはどれか。",
    options: [
      { id: "a", text: "Webフィルタで不審なサイトへの接続を制限し、EDRで不審なプロセスと外部通信を検知する" },
      { id: "i", text: "ファイルサーバのバックアップを暗号化する" },
      { id: "u", text: "すべての利用者のパスワードを長くする" },
      { id: "e", text: "ファイルサーバの共有権限を変更する" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、WebフィルタとEDRによる入口対策と検知である。水飲み場型の感染とC2通信を、接続・実行の段階で止める。",
      why: [
        "水飲み場型攻撃は、標的が訪れるサイトを改ざんして感染させる。",
        "Webフィルタは不審な接続を制限し、EDRは端末上の不審なプロセスや通信を検知する。",
      ],
      optionNotes: {
        a: "正解である。初期侵入と足場の確保の両方に対応している。",
        i: "バックアップの暗号化は、情報漏えい時の影響を減らすが、感染経路の遮断にはならない。",
        u: "パスワードの強化は認証情報の保護に役立つが、Web経由の感染とC2通信を防ぐものではない。",
        e: "共有権限の変更は横展開の抑制には役立つが、初期侵入の防止には直接効かない。",
      },
      english:
        "Use web filtering to restrict malicious sites and EDR to detect suspicious processes and C2 communications. Backups and password length do not address the initial infection vector.",
      termIds: ["sec-vulnerability"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "水飲み場", "EDR"],
  },
  {
    id: "q-security-attack-009",
    part: "B",
    topicIds: ["sec-attacks-auth", "sec-attacks-network"],
    lessonIds: ["security/attacks"],
    difficulty: "medium",
    type: "scenario",
    stem: "H社のWebサービスは、大量のアクセスで応答が遅くなると同時に、他社から流出したIDとパスワードの組によるログイン試行が増加している。可用性と認証の両面から対策を講じたい。最も適切な組合せはどれか。",
    options: [
      { id: "a", text: "CDNとレート制限で負荷を分散し、多要素認証と漏えいパスワードの照合を導入する" },
      { id: "i", text: "ファイアウォールですべての通信を遮断する" },
      { id: "u", text: "利用者にパスワードの定期変更だけを求める" },
      { id: "e", text: "ログの取得を停止して負荷を下げる" },
    ],
    correctOptionId: "a",
    explanation: {
      correct:
        "正解は、CDNとレート制限による可用性の確保、多要素認証と漏えいパスワード照合による認証強化の組合せである。",
      why: [
        "DDoSや大量アクセスには、帯域・処理能力の余裕と分散、レート制限が有効である。",
        "パスワードリスト攻撃には、多要素認証と漏えいパスワードの照合が有効である。",
      ],
      optionNotes: {
        a: "正解である。可用性と認証の両方に対処している。",
        i: "すべての通信を遮断すると、正規の利用者もサービスを利用できなくなる。",
        u: "定期変更だけでは、流出済みの認証情報の悪用を防げない。",
        e: "ログを停止すると、攻撃の検知と原因調査ができなくなる。",
      },
      english:
        "Combine CDN and rate limiting for availability with MFA and breached-password checks for authentication. Blocking all traffic or disabling logs is counterproductive.",
      termIds: ["sec-dos-ddos", "sec-password-list", "sec-mfa"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "DDoS", "パスワードリスト"],
  },
  {
    id: "q-security-attack-010",
    part: "B",
    topicIds: ["sec-attacks-network"],
    lessonIds: ["security/attacks"],
    difficulty: "hard",
    type: "scenario",
    stem: "I社は、取引先の保守ベンダーに自社システムの運用を委託していた。攻撃者は、そのベンダーの管理アカウントを窃取し、I社のシステムに侵入した。I社の防御は堅牢であったが、委託先の認証情報が悪用された。この攻撃の類型として最も適切なものはどれか。",
    options: [
      { id: "a", text: "水飲み場型攻撃" },
      { id: "i", text: "サプライチェーン攻撃" },
      { id: "u", text: "標的型メール攻撃" },
      { id: "e", text: "DoS攻撃" },
    ],
    correctOptionId: "i",
    explanation: {
      correct:
        "正解はサプライチェーン攻撃である。委託先や取引関係を経由して、標的組織の防御を迂回する。",
      why: [
        "サプライチェーン攻撃は、委託先、製品、更新経路など、標的の信頼関係を悪用する。",
        "I社自身の防御が堅くても、委託先の管理が弱ければ侵入される。",
      ],
      optionNotes: {
        a: "水飲み場型は、標的が訪れるサイトを改ざんして感染させる攻撃である。",
        i: "正解である。委託先の認証情報を経由した侵入はサプライチェーン攻撃に当たる。",
        u: "標的型メールは、標的組織の担当者に偽のメールを送る攻撃である。今回は委託先の管理アカウントが起点である。",
        e: "DoS攻撃は、サービスを利用不能にする攻撃であり、侵入の類型ではない。",
      },
      english:
        "An intrusion through a compromised vendor account is a supply chain attack, exploiting trust relationships rather than the target's own perimeter.",
      termIds: ["sec-vulnerability"],
    },
    source: {
      kind: "original",
      attribution: "本サイト独自問題",
    },
    tags: ["科目B", "サプライチェーン"],
  },
];
