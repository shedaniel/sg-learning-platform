import { Arrow, ArrowDefs, ArrowPath, DiagramSvg, Node, Panel, Txt } from "./shared";

export function AccessControl() {
  return (
    <DiagramSvg
      title="アクセス制御モデル"
      desc="主体が資源へのアクセスを要求し、ポリシーに基づく判断を経て許可・拒否される流れと、最小権限・Need-to-Knowの原則を示す図。"
    >
      <ArrowDefs prefix="ac" />
      <Txt x={380} y={32} tone="muted">
        アクセス制御は「主体・資源・操作」の組で可否を判断し、必要な権限だけを与える
      </Txt>

      <Node x={30} y={136} w={150} h={72} title="主体" sub="利用者・端末" tone="c5" />
      <Node x={270} y={126} w={220} h={92} title="ポリシー判断" sub="誰が・何に・何を" tone="accent" />
      <Node x={580} y={136} w={150} h={72} title="資源" sub="ファイル・DB" tone="c1" />

      <Arrow prefix="ac" x1={180} y1={172} x2={266} y2={172} tone="accent" />
      <Arrow prefix="ac" x1={490} y1={172} x2={576} y2={172} tone="accent" />
      <Txt x={225} y={116} tone="muted">
        ① 要求
      </Txt>
      <Txt x={535} y={116} tone="muted">
        ② 許可/拒否
      </Txt>

      <Node x={270} y={258} w={220} h={64} title="ポリシー" sub="最小権限・職務分離" tone="c2" />
      <Arrow prefix="ac" x1={380} y1={258} x2={380} y2={222} tone="c2" />
      <Txt x={392} y={244} anchor="start" tone="muted">
        ポリシー参照
      </Txt>

      <Panel x={30} y={250} w={220} h={80} title="原則" titleSize={13} />
      <Txt x={46} y={298} anchor="start" tone="muted">
        最小権限：必要な権限だけ
      </Txt>
      <Txt x={46} y={318} anchor="start" tone="muted">
        Need-to-Know：必要時のみ
      </Txt>

      <Panel x={540} y={250} w={190} h={80} title="権限の見直し" titleSize={13} />
      <Txt x={556} y={298} anchor="start" tone="muted">
        退職・異動時は即時削除
      </Txt>
      <Txt x={556} y={318} anchor="start" tone="muted">
        定期的に棚卸しする
      </Txt>

      <Txt x={380} y={348} tone="muted">
        判断結果はログに記録し、監査できるようにする
      </Txt>
    </DiagramSvg>
  );
}

export function AuthFactors() {
  return (
    <DiagramSvg
      title="認証の3要素と多要素認証"
      desc="記憶・所有・生体の3つの認証要素と、異なる要素を組み合わせる多要素認証、同じ要素を重ねてもMFAにならない例を示す図。"
    >
      <ArrowDefs prefix="auth" />
      <Txt x={380} y={32} tone="muted">
        認証の 3 要素は知識・所持・生体。異なる要素を 2 つ以上組み合わせる
      </Txt>

      <Node
        x={40}
        y={58}
        w={210}
        h={88}
        title="記憶（知識）"
        sub="パスワード・PIN"
        note="忘れる・使い回し"
        tone="c5"
        titleSize={15}
      />
      <Node
        x={275}
        y={58}
        w={210}
        h={88}
        title="所有（所持）"
        sub="IC カード・スマホ"
        note="紛失・盗難の危険"
        tone="c3"
        titleSize={15}
      />
      <Node
        x={510}
        y={58}
        w={210}
        h={88}
        title="生体（特性）"
        sub="指紋・顔・静脈"
        note="変更不可・誤認識"
        tone="c1"
        titleSize={15}
      />

      <Panel
        x={40}
        y={170}
        w={680}
        h={150}
        tone="accent"
        title="多要素認証（MFA）：異なる要素を組み合わせる"
        titleSize={14}
      />

      <Node
        x={60}
        y={210}
        w={200}
        h={88}
        title="知識 + 所持"
        sub="パスワード + スマホ"
        note="○ MFA として有効"
        tone="success"
        noteTone="success"
      />
      <Node
        x={280}
        y={210}
        w={200}
        h={88}
        title="知識 + 生体"
        sub="パスワード + 指紋"
        note="○ MFA として有効"
        tone="success"
        noteTone="success"
      />
      <Node
        x={500}
        y={210}
        w={200}
        h={88}
        title="知識 + 知識"
        sub="パスワード + 秘密の質問"
        note="× 同一要素で MFA でない"
        tone="error"
        noteTone="error"
      />

      <Txt x={380} y={342} tone="muted">
        パスワードレス認証は所持と生体を組み合わせて実現する
      </Txt>
    </DiagramSvg>
  );
}

export function CloudResponsibility() {
  const rows = [
    {
      y: 72,
      label: "IaaS",
      detail: "仮想マシン",
      boundary: 590,
      customer: "ゲスト OS・ミドルウェア・アプリ・データ",
      provider: "仮想化・物理基盤",
    },
    {
      y: 132,
      label: "PaaS",
      detail: "実行環境",
      boundary: 440,
      customer: "アプリ・データ",
      provider: "OS・実行環境・基盤",
    },
    {
      y: 192,
      label: "SaaS",
      detail: "アプリ",
      boundary: 310,
      customer: "データ・設定",
      provider: "アプリ・OS・基盤すべて",
    },
  ];
  return (
    <DiagramSvg
      title="クラウドの責任共有モデル"
      desc="IaaS・PaaS・SaaSの3形態について、利用者と事業者の責任範囲がどこで分かれるかを横棒で示す図。"
    >
      <ArrowDefs prefix="cloud" />
      <Txt x={380} y={30} tone="muted">
        責任共有モデル：サービス形態が上がるほど、事業者の管理範囲が広がる
      </Txt>

      <Txt x={40} y={59} anchor="start" tone="muted">
        サービスモデル
      </Txt>
      <rect x="560" y="46" width="16" height="16" rx="3" fill="var(--c5)" fillOpacity="0.25" stroke="var(--c5)" strokeWidth="1.5" />
      <Txt x={582} y={59} anchor="start" tone="muted">
        利用者
      </Txt>
      <rect x="660" y="46" width="16" height="16" rx="3" fill="var(--c1)" fillOpacity="0.2" stroke="var(--c1)" strokeWidth="1.5" />
      <Txt x={682} y={59} anchor="start" tone="muted">
        事業者
      </Txt>

      {rows.map((row) => (
        <g key={row.label}>
          <Node x={30} y={row.y} w={140} h={48} title={row.label} sub={row.detail} tone="neutral" />
          <rect
            x="180"
            y={row.y}
            width={row.boundary - 180}
            height="48"
            rx="8"
            fill="var(--c5)"
            fillOpacity="0.16"
            stroke="var(--c5)"
            strokeWidth="1.5"
          />
          <rect
            x={row.boundary}
            y={row.y}
            width={730 - row.boundary}
            height="48"
            rx="8"
            fill="var(--c1)"
            fillOpacity="0.14"
            stroke="var(--c1)"
            strokeWidth="1.5"
          />
          <text x="192" y={row.y + 29} fontSize="13" fill="var(--foreground)">
            {row.customer}
          </text>
          <text x={row.boundary + 10} y={row.y + 29} fontSize="13" fill="var(--foreground)">
            {row.provider}
          </text>
        </g>
      ))}

      <Txt x={380} y={282} tone="muted">
        データ・アカウント・アクセス設定の管理は、どのモデルでも利用者の責任
      </Txt>
      <Txt x={380} y={306} tone="muted">
        IaaS は OS 以上、PaaS はアプリ以上、SaaS は設定以上が利用者側
      </Txt>
    </DiagramSvg>
  );
}

export function HashSignature() {
  return (
    <DiagramSvg
      title="ハッシュとデジタル署名"
      desc="メッセージをハッシュ化し、秘密鍵で署名して送信し、受信側がハッシュを再計算して公開鍵で検証する流れを示す図。"
    >
      <ArrowDefs prefix="hash" />
      <Txt x={380} y={30} tone="muted">
        ハッシュは改ざん検知、デジタル署名は本人確認と改ざん検知を同時に実現する
      </Txt>

      <Txt x={40} y={56} anchor="start" tone="muted">
        署名する側
      </Txt>

      <Node x={40} y={68} w={140} h={56} title="① メッセージ" sub="改ざん検知の対象" tone="c5" titleSize={13} />
      <Node x={230} y={68} w={150} h={56} title="② ハッシュ化" sub="SHA-256 など" tone="c3" titleSize={13} />
      <Node x={430} y={68} w={170} h={56} title="③ 署名生成" sub="秘密鍵で署名" tone="accent" titleSize={13} />

      <Arrow prefix="hash" x1={180} y1={96} x2={226} y2={96} />
      <Arrow prefix="hash" x1={380} y1={96} x2={426} y2={96} />

      <Txt x={40} y={232} anchor="start" tone="muted">
        検証する側
      </Txt>

      <Node x={40} y={244} w={150} h={56} title="④ 受信データ" sub="メッセージ + 署名" tone="c5" titleSize={13} />
      <Node x={230} y={244} w={150} h={56} title="⑤ ハッシュ再計算" tone="c3" titleSize={13} />
      <Node x={430} y={244} w={170} h={56} title="⑥ 署名検証" sub="公開鍵で照合" tone="accent" titleSize={13} />
      <Node x={630} y={244} w={100} h={56} title="⑦ 判定" sub="一致/不一致" tone="success" titleSize={13} />

      <Arrow prefix="hash" x1={190} y1={272} x2={226} y2={272} />
      <Arrow prefix="hash" x1={380} y1={272} x2={426} y2={272} />
      <Arrow prefix="hash" x1={600} y1={272} x2={626} y2={272} />

      <Arrow prefix="hash" x1={110} y1={124} x2={110} y2={240} dashed />
      <Arrow prefix="hash" x1={515} y1={124} x2={515} y2={240} dashed />
      <Txt x={122} y={186} anchor="start" tone="muted">
        送信
      </Txt>
      <Txt x={527} y={186} anchor="start" tone="muted">
        署名を添付
      </Txt>

      <Txt x={380} y={336} tone="muted">
        ハッシュが一致すれば改ざんはなく、署名が通れば本人が作成したと判断できる
      </Txt>
    </DiagramSvg>
  );
}

export function DataProtection() {
  return (
    <DiagramSvg
      title="データ保護ライフサイクル"
      desc="個人データの収集・分類・保存・利用・共有・保持・廃棄の各段階と、全段階に適用する安全管理措置を示す図。"
    >
      <ArrowDefs prefix="dp" />
      <Txt x={380} y={30} tone="muted">
        個人データは収集から廃棄までのライフサイクル全体で保護する
      </Txt>

      <Node x={30} y={64} w={160} h={68} title="① 収集" sub="目的の特定・最小化" tone="c5" />
      <Node x={210} y={64} w={160} h={68} title="② 分類" sub="機密度の設定" tone="c3" />
      <Node x={390} y={64} w={160} h={68} title="③ 保存" sub="暗号化・権限制御" tone="c1" />
      <Node x={570} y={64} w={160} h={68} title="④ 利用" sub="目的内での利用" tone="c2" />

      <Arrow prefix="dp" x1={190} y1={98} x2={206} y2={98} />
      <Arrow prefix="dp" x1={370} y1={98} x2={386} y2={98} />
      <Arrow prefix="dp" x1={550} y1={98} x2={566} y2={98} />

      <Node x={570} y={204} w={160} h={68} title="⑤ 共有" sub="契約・同意の確認" tone="c6" />
      <Node x={390} y={204} w={160} h={68} title="⑥ 保持" sub="保存期間の設定" tone="c4" />
      <Node x={210} y={204} w={160} h={68} title="⑦ 廃棄" sub="完全消去と記録" tone="error" />

      <ArrowPath prefix="dp" d="M 650 132 V 200" />
      <Arrow prefix="dp" x1={570} y1={238} x2={550} y2={238} />
      <Arrow prefix="dp" x1={390} y1={238} x2={370} y2={238} />

      <Panel x={30} y={204} w={160} h={68} tone="accent" title="安全管理措置" titleSize={13} />
      <Txt x={46} y={248} anchor="start" tone="muted">
        全段階に適用
      </Txt>

      <Txt x={380} y={296} tone="muted">
        各段階の実施状況を記録し、説明できるようにする
      </Txt>
      <Txt x={380} y={322} tone="muted">
        委託先には契約で同等の保護を求める
      </Txt>
    </DiagramSvg>
  );
}
