import { Arrow, ArrowDefs, ArrowPath, DiagramSvg, Node, Panel, Txt } from "./shared";

export function KillChain() {
  return (
    <DiagramSvg
      title="サイバーキルチェーン"
      desc="偵察から目的遂行までの7段階の攻撃手順と、各段階で攻撃を遮断する多層防御の考え方を示す図。"
    >
      <ArrowDefs prefix="kc" />
      <Txt x={380} y={36} tone="muted">
        攻撃は 7 段階で進む。防御側は各段階で遮断し、次の段階へ進ませない
      </Txt>

      <Node x={22} y={66} w={164} h={64} title="① 偵察" sub="公開情報・走査" tone="c5" />
      <Node x={206} y={66} w={164} h={64} title="② 武器化" sub="攻撃コード作成" tone="c5" />
      <Node x={390} y={66} w={164} h={64} title="③ 配送" sub="メール・不正サイト" tone="c2" />
      <Node x={574} y={66} w={164} h={64} title="④ 実行" sub="脆弱性を悪用" tone="warning" />

      <Node x={574} y={214} w={164} h={64} title="⑤ 導入" sub="マルウェア常駐" tone="c6" />
      <Node x={390} y={214} w={164} h={64} title="⑥ C2" sub="外部と遠隔通信" tone="error" />
      <Node x={206} y={214} w={164} h={64} title="⑦ 目的遂行" sub="情報窃取・暗号化" tone="c4" />
      <Node x={22} y={214} w={164} h={64} title="被害発生" sub="漏えい・停止" tone="error" dashed />

      <Arrow prefix="kc" x1={186} y1={98} x2={202} y2={98} />
      <Arrow prefix="kc" x1={370} y1={98} x2={386} y2={98} />
      <Arrow prefix="kc" x1={554} y1={98} x2={570} y2={98} />
      <Arrow prefix="kc" x1={656} y1={130} x2={656} y2={210} tone="error" />

      <Txt x={380} y={204} tone="muted">
        攻撃は番号順に進む
      </Txt>

      <Arrow prefix="kc" x1={574} y1={246} x2={554} y2={246} tone="error" />
      <Arrow prefix="kc" x1={390} y1={246} x2={370} y2={246} tone="error" />
      <Arrow prefix="kc" x1={206} y1={246} x2={186} y2={246} tone="error" />

      <Txt x={380} y={320} tone="muted">
        1 段階でも止めれば攻撃は完了しない（多層防御）
      </Txt>
    </DiagramSvg>
  );
}

export function IncidentResponse() {
  return (
    <DiagramSvg
      title="インシデント対応ライフサイクル"
      desc="準備、検知・受付、トリアージ、封じ込め、根絶、復旧、教訓化の7段階と、教訓を次の準備に反映する循環を示す図。"
    >
      <ArrowDefs prefix="ir" />
      <Txt x={380} y={36} tone="muted">
        準備を起点に、検知から教訓化までを一巡し、次の備えに反映する
      </Txt>

      <Node x={22} y={64} w={164} h={64} title="① 準備" sub="体制・連絡網・演習" tone="accent" />
      <Node x={206} y={64} w={164} h={64} title="② 検知・受付" sub="監視と通報の受付" tone="c5" />
      <Node x={390} y={64} w={164} h={64} title="③ トリアージ" sub="影響度・優先度の判断" tone="c2" />
      <Node x={574} y={64} w={164} h={64} title="④ 封じ込め" sub="被害拡大を阻止" tone="warning" />

      <Node x={574} y={212} w={164} h={64} title="⑤ 根絶" sub="原因を除去" tone="c6" />
      <Node x={390} y={212} w={164} h={64} title="⑥ 復旧" sub="サービス再開" tone="success" />
      <Node x={206} y={212} w={164} h={64} title="⑦ 教訓化" sub="再発防止と改善" tone="c1" />

      <Arrow prefix="ir" x1={186} y1={96} x2={202} y2={96} />
      <Arrow prefix="ir" x1={370} y1={96} x2={386} y2={96} />
      <Arrow prefix="ir" x1={554} y1={96} x2={570} y2={96} />
      <Arrow prefix="ir" x1={656} y1={128} x2={656} y2={208} tone="warning" />

      <Arrow prefix="ir" x1={574} y1={244} x2={554} y2={244} />
      <Arrow prefix="ir" x1={390} y1={244} x2={370} y2={244} />
      <ArrowPath prefix="ir" d="M 206 244 H 96 V 132" tone="accent" />

      <Txt x={380} y={320} tone="muted">
        教訓を準備・計画に反映し、次のインシデントに備える
      </Txt>
      <Txt x={380} y={344} tone="muted">
        初動の遅れが被害を大きくする
      </Txt>
    </DiagramSvg>
  );
}

export function SupplyChain() {
  return (
    <DiagramSvg
      title="サプライチェーンと攻撃面"
      desc="委託先・クラウド事業者・ソフトウェア供給元・再委託先という外部依存と、そこから自社システムにリスクが連鎖する関係を示す図。"
    >
      <ArrowDefs prefix="sc" />
      <Txt x={380} y={32} tone="muted">
        外部の委託先・クラウド・ソフトウェアを経由してリスクが連鎖する
      </Txt>

      <Node x={40} y={64} w={190} h={64} title="委託先" sub="SIer・運用委託" tone="warning" dashed />
      <Node x={285} y={64} w={190} h={64} title="クラウド事業者" sub="IaaS / SaaS" tone="warning" dashed />
      <Node x={530} y={64} w={190} h={64} title="ソフトウェア供給元" sub="OSS・パッケージ" tone="warning" dashed titleSize={13} />

      <Node x={290} y={190} w={180} h={68} title="自社システム" sub="情報資産" tone="accent" />

      <Node x={40} y={282} w={190} h={60} title="再委託先" sub="委託先の委託先" tone="warning" dashed />

      <Arrow prefix="sc" x1={135} y1={128} x2={330} y2={186} tone="warning" />
      <Arrow prefix="sc" x1={380} y1={128} x2={380} y2={186} tone="warning" />
      <Arrow prefix="sc" x1={625} y1={128} x2={430} y2={186} tone="warning" />
      <Arrow prefix="sc" x1={135} y1={282} x2={135} y2={132} tone="warning" dashed />
      <Txt x={145} y={210} anchor="start" tone="muted">
        再委託
      </Txt>

      <Txt x={380} y={300} tone="muted">
        点線の枠＝攻撃面になり得る外部依存先
      </Txt>
      <Txt x={380} y={324} tone="muted">
        契約・監査・SBOM・脆弱性管理で継続的に確認する
      </Txt>
    </DiagramSvg>
  );
}

export function Backup321() {
  const cards = [
    { x: 40, number: "3", title: "3 部のコピー", sub: "原本 + 予備 2 部" },
    { x: 270, number: "2", title: "2 種類の媒体", sub: "HDD・クラウド等" },
    { x: 500, number: "1", title: "1 か所は遠隔地", sub: "物理的に離れた場所" },
  ];
  return (
    <DiagramSvg
      title="3-2-1 バックアップ"
      desc="3部のコピーを2種類の媒体に保存し、1部を遠隔地に置く3-2-1ルールと、イミュータブル保管の考え方を示す図。"
    >
      <ArrowDefs prefix="b321" />
      <Txt x={380} y={32} tone="muted">
        3-2-1 ルール：3 部のコピーを 2 種類の媒体に分け、1 部を遠隔地に置く
      </Txt>

      {cards.map((card) => (
        <g key={card.title}>
          <rect
            x={card.x}
            y={54}
            width={220}
            height={84}
            rx={12}
            fill="var(--surface-2)"
            fillOpacity="0.65"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <text x={card.x + 34} y={102} textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--accent)">
            {card.number}
          </text>
          <text x={card.x + 62} y={86} fontSize="15" fontWeight="600">
            {card.title}
          </text>
          <text x={card.x + 62} y={110} fontSize="13" fill="var(--muted)">
            {card.sub}
          </text>
        </g>
      ))}

      <Node x={60} y={200} w={150} h={64} title="原本" sub="本番データ" tone="c5" />
      <Node x={320} y={154} w={200} h={58} title="バックアップ①" sub="媒体 A・社内" tone="c5" />
      <Node x={320} y={250} w={200} h={58} title="バックアップ②" sub="媒体 B・遠隔地" tone="c1" />

      <ArrowPath prefix="b321" d="M 210 224 H 265 V 183 H 316" />
      <ArrowPath prefix="b321" d="M 210 240 H 265 V 279 H 316" />

      <Panel x={548} y={150} w={188} h={164} tone="c2" title="イミュータブル保管" titleSize={13} />
      <Txt x={564} y={206} anchor="start" tone="muted">
        一定期間の削除を禁止
      </Txt>
      <Txt x={564} y={234} anchor="start" tone="muted">
        改ざん・暗号化を防ぐ
      </Txt>
      <Txt x={564} y={262} anchor="start" tone="muted">
        世代管理で復旧点確保
      </Txt>
      <Txt x={564} y={290} anchor="start" tone="muted">
        リストア演習も行う
      </Txt>

      <Arrow prefix="b321" x1={520} y1={279} x2={544} y2={279} tone="c2" dashed />

      <Txt x={380} y={338} tone="muted">
        3-2-1 を満たしても、定期的なリストア演習で復元できることを確認する
      </Txt>
    </DiagramSvg>
  );
}

export function RpoRto() {
  return (
    <DiagramSvg
      title="RPO と RTO"
      desc="最後のバックアップから障害発生までを RPO、障害発生からサービス再開までを RTO として、時間軸上に対応させた図。"
    >
      <ArrowDefs prefix="rpo" />
      <Txt x={380} y={32} tone="muted">
        RPO は失ってよいデータの範囲、RTO は停止してよい時間の範囲を表す
      </Txt>

      <rect x="130" y="182" width="170" height="16" fill="var(--error)" fillOpacity="0.18" />
      <rect x="300" y="182" width="240" height="16" fill="var(--warning)" fillOpacity="0.18" />
      <Arrow prefix="rpo" x1={48} y1={190} x2={704} y2={190} />
      <Txt x={700} y={178} anchor="end" tone="muted">
        時間
      </Txt>

      <line x1="130" y1="122" x2="130" y2="204" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="5 4" />
      <line x1="300" y1="108" x2="300" y2="204" stroke="var(--error)" strokeWidth="1.5" strokeDasharray="5 4" />
      <line x1="540" y1="108" x2="540" y2="204" stroke="var(--success)" strokeWidth="1.5" strokeDasharray="5 4" />

      <circle cx="130" cy="190" r="4" fill="var(--c5)" />
      <circle cx="300" cy="190" r="4" fill="var(--error)" />
      <circle cx="540" cy="190" r="4" fill="var(--success)" />

      <path d="M 130 142 V 158 M 130 150 H 296 M 296 142 V 158" fill="none" stroke="var(--error)" strokeWidth="1.5" />
      <path d="M 304 142 V 158 M 304 150 H 540 M 540 142 V 158" fill="none" stroke="var(--warning)" strokeWidth="1.5" />

      <Txt x={215} y={128} tone="error">
        RPO：目標復旧時点
      </Txt>
      <Txt x={215} y={176} tone="muted">
        失ってよいデータ量
      </Txt>
      <Txt x={420} y={128} tone="warning">
        RTO：目標復旧時間
      </Txt>
      <Txt x={420} y={176} tone="muted">
        停止してよい時間
      </Txt>

      <Txt x={130} y={222} tone="muted">
        最終バックアップ
      </Txt>
      <Txt x={300} y={222} tone="muted">
        障害発生
      </Txt>
      <Txt x={540} y={222} tone="muted">
        サービス再開
      </Txt>

      <Panel x={48} y={246} w={330} h={76} title="RPO を小さくする" titleSize={13} />
      <Txt x={64} y={296} anchor="start" tone="muted">
        バックアップ間隔を短くする
      </Txt>
      <Txt x={64} y={316} anchor="start" tone="muted">
        ログを継続的に取得する
      </Txt>

      <Panel x={400} y={246} w={330} h={76} title="RTO を小さくする" titleSize={13} />
      <Txt x={416} y={296} anchor="start" tone="muted">
        機器の冗長化と自動切替
      </Txt>
      <Txt x={416} y={316} anchor="start" tone="muted">
        復旧手順の整備と演習
      </Txt>

      <Txt x={380} y={344} tone="muted">
        目標は業務影響から決め、演習で達成できるか確認する
      </Txt>
    </DiagramSvg>
  );
}

export function BcpTimeline() {
  return (
    <DiagramSvg
      title="事業継続タイムライン"
      desc="障害発生からBCP発動、重要業務の継続、復旧、事後レビューまでの時間軸と、RPO・RTOの目標範囲を示す図。"
    >
      <ArrowDefs prefix="bcp" />
      <Txt x={380} y={30} tone="muted">
        BCP は発動してから復旧するまでの時間と、失ってよいデータの範囲を定める
      </Txt>

      <Arrow prefix="bcp" x1={40} y1={116} x2={712} y2={116} />
      <Txt x={706} y={108} anchor="end" tone="muted">
        時間
      </Txt>

      <line x1="90" y1="100" x2="90" y2="122" stroke="var(--c5)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="210" y1="100" x2="210" y2="122" stroke="var(--error)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="330" y1="100" x2="330" y2="122" stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="550" y1="100" x2="550" y2="122" stroke="var(--success)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="660" y1="100" x2="660" y2="122" stroke="var(--c6)" strokeWidth="1.5" strokeDasharray="4 3" />

      <circle cx="90" cy="116" r="4" fill="var(--c5)" />
      <circle cx="210" cy="116" r="4" fill="var(--error)" />
      <circle cx="330" cy="116" r="4" fill="var(--warning)" />
      <circle cx="550" cy="116" r="4" fill="var(--success)" />
      <circle cx="660" cy="116" r="4" fill="var(--c6)" />

      <Txt x={90} y={92} tone="muted">
        最終バックアップ
      </Txt>
      <Txt x={210} y={92} tone="muted">
        障害発生
      </Txt>
      <Txt x={330} y={92} tone="muted">
        BCP 発動
      </Txt>
      <Txt x={550} y={92} tone="muted">
        復旧完了
      </Txt>
      <Txt x={660} y={92} tone="muted">
        レビュー
      </Txt>

      <path d="M 90 136 V 152 M 90 144 H 210 M 210 136 V 152" fill="none" stroke="var(--error)" strokeWidth="1.5" />
      <Txt x={150} y={166} tone="error">
        RPO：データ消失の許容範囲
      </Txt>

      <path d="M 210 176 V 192 M 210 184 H 550 M 550 176 V 192" fill="none" stroke="var(--warning)" strokeWidth="1.5" />
      <Txt x={380} y={210} tone="warning">
        RTO：サービス停止の許容範囲
      </Txt>

      <Node x={90} y={240} w={220} h={66} title="初動・BCP 発動" sub="体制の立上げと優先業務の選定" tone="warning" />
      <Node x={330} y={240} w={220} h={66} title="重要業務の継続と復旧" sub="RTO 内の再開を目指す" tone="c5" />
      <Node x={570} y={240} w={160} h={66} title="事後レビュー" sub="BCP の見直し" tone="c6" />

      <Arrow prefix="bcp" x1={310} y1={273} x2={326} y2={273} />
      <Arrow prefix="bcp" x1={550} y1={273} x2={566} y2={273} />

      <Txt x={380} y={338} tone="muted">
        RTO・RPO は業務影響から決め、演習で達成可能性を確認する
      </Txt>
    </DiagramSvg>
  );
}
