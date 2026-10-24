import { Arrow, ArrowDefs, DiagramSvg, Node, Panel, Txt } from "./shared";

export function TlsHandshake() {
  return (
    <DiagramSvg
      title="TLS ハンドシェイク"
      desc="クライアントとサーバが ClientHello、ServerHello と証明書、証明書検証、鍵交換、Finished を経て暗号化通信を始める流れを示す図。"
      viewBox="0 0 760 400"
    >
      <ArrowDefs prefix="tls" />
      <Txt x={380} y={18} tone="muted">
        TLS ハンドシェイク（簡略）：相手を確認し、共通鍵を共有する
      </Txt>

      <Node x={40} y={32} w={160} h={44} title="クライアント" tone="c5" />
      <Node x={560} y={32} w={160} h={44} title="サーバ" tone="c1" />

      <line x1="120" y1="80" x2="120" y2="384" stroke="var(--input)" strokeWidth="1.5" strokeDasharray="5 5" />
      <line x1="640" y1="80" x2="640" y2="384" stroke="var(--input)" strokeWidth="1.5" strokeDasharray="5 5" />

      <Txt x={380} y={106}>
        ① ClientHello：対応バージョン・暗号スイート・乱数
      </Txt>
      <Arrow prefix="tls" x1={124} y1={116} x2={632} y2={116} tone="accent" />

      <Txt x={380} y={156}>
        ② ServerHello・サーバ証明書（公開鍵）
      </Txt>
      <Arrow prefix="tls" x1={636} y1={166} x2={128} y2={166} tone="muted" />

      <Node
        x={136}
        y={186}
        w={270}
        h={58}
        title="③ 証明書を検証"
        sub="連鎖・有効期限・失効を確認"
        tone="warning"
        titleSize={13}
      />

      <Txt x={380} y={276}>
        ④ 鍵交換（ECDHE）：共有鍵の材料を交換
      </Txt>
      <Arrow prefix="tls" x1={124} y1={286} x2={632} y2={286} tone="accent" />

      <Txt x={380} y={326}>
        ⑤ Finished：ハンドシェイクの完全性を検証
      </Txt>
      <Arrow prefix="tls" x1={124} y1={336} x2={632} y2={336} tone="muted" />

      <Txt x={380} y={368} tone="muted">
        ⑥ 暗号化通信（共通鍵暗号 AES-GCM など）
      </Txt>
      <Arrow prefix="tls" x1={124} y1={378} x2={632} y2={378} tone="success" both />
    </DiagramSvg>
  );
}

export function PkiChain() {
  return (
    <DiagramSvg
      title="PKI の信頼の連鎖"
      desc="ルート CA が中間 CA に署名し、中間 CA がサーバ証明書に署名する連鎖と、CRL・OCSP による失効確認を示す図。"
    >
      <ArrowDefs prefix="pki" />
      <Txt x={380} y={32} tone="muted">
        サーバ証明書は中間 CA を経てルート CA につながり、その連鎖を検証する
      </Txt>

      <rect
        x="24"
        y="68"
        width="222"
        height="104"
        rx="16"
        fill="var(--chart-2)"
        fillOpacity="0.05"
        stroke="var(--chart-2)"
        strokeWidth="1.5"
        strokeDasharray="6 5"
      />
      <Txt x={135} y={60} tone="muted">
        トラストアンカー
      </Txt>

      <Node x={40} y={84} w={190} h={72} title="ルート CA" sub="自己署名・信頼の起点" tone="accent" />
      <Node x={285} y={84} w={190} h={72} title="中間 CA" sub="ルート CA が署名" tone="c5" />
      <Node x={530} y={84} w={190} h={72} title="サーバ証明書" sub="中間 CA が署名" tone="c1" />

      <Arrow prefix="pki" x1={230} y1={120} x2={281} y2={120} tone="accent" />
      <Arrow prefix="pki" x1={475} y1={120} x2={526} y2={120} tone="accent" />
      <Txt x={257} y={110} tone="muted">
        署名
      </Txt>
      <Txt x={502} y={110} tone="muted">
        署名
      </Txt>

      <Txt x={380} y={192} tone="muted">
        検証は逆方向：サーバ証明書 → 中間 CA → ルート CA
      </Txt>

      <Panel x={24} y={216} w={344} h={100} title="失効確認（CRL / OCSP）" />
      <Txt x={40} y={262} anchor="start" tone="muted">
        CRL：失効した証明書のリストを取得
      </Txt>
      <Txt x={40} y={284} anchor="start" tone="muted">
        OCSP：証明書ごとに有効性を照会
      </Txt>
      <Txt x={40} y={306} anchor="start" tone="muted">
        失効済みの証明書は信頼しない
      </Txt>

      <Panel x={392} y={216} w={344} h={100} title="連鎖の検証" />
      <Txt x={408} y={264} anchor="start" tone="muted">
        ① サーバ証明書 → 中間 CA の公開鍵
      </Txt>
      <Txt x={408} y={284} anchor="start" tone="muted">
        ② 中間 CA → ルート CA の公開鍵
      </Txt>
      <Txt x={408} y={304} anchor="start" tone="muted">
        ③ ルート CA は信頼ストアに登録済み
      </Txt>

      <Arrow prefix="pki" x1={625} y1={156} x2={625} y2={212} dashed />

      <Txt x={380} y={342} tone="muted">
        ルート CA の秘密鍵はオフラインで厳重に保管する
      </Txt>
    </DiagramSvg>
  );
}

export function DmzFirewall() {
  return (
    <DiagramSvg
      title="DMZ とファイアウォール"
      desc="インターネットから外部ファイアウォール、DMZ の公開サーバ、内部ファイアウォールを経て社内 LAN に至る多段防御を示す図。"
    >
      <ArrowDefs prefix="dmz" />
      <Txt x={380} y={32} tone="muted">
        公開サービスは DMZ に置き、内部 LAN とはファイアウォールで分離する
      </Txt>

      <Node x={20} y={110} w={110} h={80} title="インターネット" sub="不特定多数" titleSize={13} />
      <Node x={164} y={110} w={100} h={80} title="外部 FW" sub="入口を制限" tone="accent" titleSize={13} />

      <Panel x={294} y={64} w={150} h={192} tone="c5" />
      <text x="369" y="88" textAnchor="middle" fontSize="15" fontWeight="600">
        DMZ
      </text>
      <Txt x={369} y={106} tone="muted">
        非武装地帯
      </Txt>
      <Node x={310} y={116} w={118} h={52} title="Web サーバ" sub="HTTPS 公開" tone="c5" titleSize={13} />
      <Node x={310} y={178} w={118} h={52} title="メール" sub="SMTP 25" tone="c5" titleSize={13} />

      <Node x={474} y={110} w={100} h={80} title="内部 FW" sub="LAN を保護" tone="accent" titleSize={13} />

      <Panel x={604} y={64} w={136} h={192} tone="c1" />
      <text x="672" y="88" textAnchor="middle" fontSize="15" fontWeight="600">
        社内 LAN
      </text>
      <Txt x={672} y={106} tone="muted">
        業務ネットワーク
      </Txt>
      <Node x={620} y={116} w={104} h={52} title="業務サーバ" sub="DB など" tone="c1" titleSize={13} />
      <Node x={620} y={178} w={104} h={52} title="社内 PC" sub="業務端末" tone="c1" titleSize={13} />

      <Arrow prefix="dmz" x1={130} y1={150} x2={160} y2={150} />
      <Arrow prefix="dmz" x1={264} y1={150} x2={290} y2={150} />
      <Arrow prefix="dmz" x1={444} y1={150} x2={470} y2={150} />
      <Arrow prefix="dmz" x1={574} y1={150} x2={600} y2={150} />

      <Txt x={147} y={278} tone="muted">
        HTTPS 443
      </Txt>
      <Txt x={279} y={278} tone="muted">
        443 / 25
      </Txt>
      <Txt x={459} y={278} tone="muted">
        許可のみ
      </Txt>
      <Txt x={589} y={278} tone="muted">
        TCP 443
      </Txt>

      <Txt x={380} y={322} tone="muted">
        DMZ が侵害されても、内部 FW が LAN への横展開を防ぐ
      </Txt>
    </DiagramSvg>
  );
}

export function NetworkPath() {
  const boxes = [
    { x: 20, title: "クライアント", sub: "ブラウザ" },
    { x: 144, title: "インターネット", sub: "不特定多数" },
    { x: 268, title: "FW①", sub: "公開用" },
    { x: 392, title: "Web サーバ", sub: "DMZ" },
    { x: 516, title: "FW②", sub: "内部用" },
    { x: 640, title: "DB サーバ", sub: "社内 LAN" },
  ];
  return (
    <DiagramSvg
      title="ネットワーク経路"
      desc="クライアントからインターネット、ファイアウォール、DMZ の Web サーバ、2 台目のファイアウォールを経て内部の DB サーバに届く経路とポートを示す図。"
    >
      <ArrowDefs prefix="net" />
      <Txt x={380} y={40} tone="muted">
        クライアントから内部サーバまで、通信は複数の FW と DMZ を通過する
      </Txt>

      {boxes.map((box, index) => (
        <Node
          key={box.title}
          x={box.x}
          y={112}
          w={100}
          h={72}
          title={box.title}
          sub={box.sub}
          titleSize={13}
          tone={index === 3 ? "c5" : index === 5 ? "c1" : index === 2 || index === 4 ? "accent" : "neutral"}
        />
      ))}

      <Txt x={132} y={96} tone="muted">
        HTTPS 443
      </Txt>
      <Txt x={256} y={96} tone="muted">
        443
      </Txt>
      <Txt x={380} y={96} tone="muted">
        443 を許可
      </Txt>
      <Txt x={504} y={96} tone="muted">
        DB 接続
      </Txt>
      <Txt x={628} y={96} tone="muted">
        5432 のみ
      </Txt>

      <Arrow prefix="net" x1={120} y1={148} x2={140} y2={148} />
      <Arrow prefix="net" x1={244} y1={148} x2={264} y2={148} />
      <Arrow prefix="net" x1={368} y1={148} x2={388} y2={148} />
      <Arrow prefix="net" x1={492} y1={148} x2={512} y2={148} />
      <Arrow prefix="net" x1={616} y1={148} x2={636} y2={148} />

      <Panel x={20} y={220} w={356} h={100} title="経路の要点" />
      <Txt x={36} y={270} anchor="start" tone="muted">
        ① 公開サーバは DMZ に置く
      </Txt>
      <Txt x={36} y={292} anchor="start" tone="muted">
        ② FW は必要なポートだけ許可する
      </Txt>
      <Txt x={36} y={314} anchor="start" tone="muted">
        ③ 内部サーバは多段で保護する
      </Txt>

      <Panel x={392} y={220} w={348} h={100} title="通信の検査" />
      <Txt x={408} y={270} anchor="start" tone="muted">
        確立済みの戻り通信だけを通す
      </Txt>
      <Txt x={408} y={292} anchor="start" tone="muted">
        拒否した通信はログに記録する
      </Txt>
      <Txt x={408} y={314} anchor="start" tone="muted">
        許可リスト方式で最小限にする
      </Txt>

      <Txt x={380} y={342} tone="muted">
        経路上のどこで遮断できるかを設計することが重要
      </Txt>
    </DiagramSvg>
  );
}

export function ZeroTrust() {
  return (
    <DiagramSvg
      title="ゼロトラスト"
      desc="利用者・端末・ネットワークの情報をもとに毎回のアクセスを検証し、ログ監視で継続的に評価するゼロトラストの構成を示す図。"
    >
      <ArrowDefs prefix="zt" />
      <Txt x={380} y={32} tone="muted">
        社内ネットワークも信頼せず、アクセスのたびに本人・端末・状況を検証する
      </Txt>

      <Node x={90} y={58} w={170} h={60} title="アイデンティティ" sub="利用者の認証" tone="c5" titleSize={13} />
      <Node x={295} y={58} w={150} h={60} title="端末" sub="健全性の確認" tone="c3" titleSize={13} />
      <Node x={470} y={58} w={160} h={60} title="ネットワーク" sub="経路と暗号化" tone="c6" titleSize={13} />

      <Node x={270} y={150} w={220} h={72} title="ポリシー判断" sub="毎回の認証・認可" tone="accent" />

      <Node x={20} y={156} w={130} h={60} title="利用者" sub="社内外を問わず" titleSize={13} />
      <Node x={610} y={156} w={130} h={60} title="資源" sub="アプリ・データ" tone="c1" titleSize={13} />

      <Arrow prefix="zt" x1={175} y1={118} x2={300} y2={146} />
      <Arrow prefix="zt" x1={370} y1={118} x2={370} y2={146} />
      <Arrow prefix="zt" x1={550} y1={118} x2={460} y2={146} />

      <Arrow prefix="zt" x1={150} y1={186} x2={266} y2={186} tone="accent" />
      <Txt x={210} y={174} tone="muted">
        ① 要求
      </Txt>
      <Arrow prefix="zt" x1={490} y1={186} x2={606} y2={186} tone="accent" />
      <Txt x={550} y={174} tone="muted">
        ② 許可/拒否
      </Txt>

      <Node x={300} y={270} w={190} h={58} title="ログ・テレメトリ" sub="監視と異常検知" tone="warning" titleSize={13} />
      <Arrow prefix="zt" x1={395} y1={270} x2={395} y2={226} tone="warning" />
      <Txt x={408} y={252} anchor="start" tone="muted">
        継続的に評価
      </Txt>

      <Panel x={20} y={270} w={250} h={58} title="暗黙の信頼を排除" titleSize={13} />
      <Txt x={36} y={314} anchor="start" tone="muted">
        ネットワーク位置は根拠にしない
      </Txt>

      <Txt x={620} y={290} tone="muted">
        侵害される前提で
      </Txt>
      <Txt x={620} y={310} tone="muted">
        設計・監視する
      </Txt>

      <Txt x={380} y={342} tone="muted">
        単一の境界防御ではなく、認証・認可・監視を組み合わせる
      </Txt>
    </DiagramSvg>
  );
}
