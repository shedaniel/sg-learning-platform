import { Arrow, ArrowDefs, ArrowPath, DiagramSvg, Node, Panel, Txt } from "./shared";

export function CiaTriad() {
  return (
    <DiagramSvg
      title="CIA トライアド"
      desc="情報資産を中心に、機密性・完全性・可用性の3特性が重なり合い、真正性と責任追跡性が外側から支える関係を示す図。"
      viewBox="0 0 760 400"
    >
      <ArrowDefs prefix="cia" />
      <rect
        x="16"
        y="34"
        width="728"
        height="352"
        rx="20"
        fill="none"
        stroke="var(--muted)"
        strokeOpacity="0.45"
        strokeDasharray="6 5"
      />
      <Txt x={380} y={58} tone="muted">
        真正性・責任追跡性：なりすましを防ぎ、操作の記録をたどれる
      </Txt>

      <circle cx="380" cy="150" r="86" fill="var(--c1)" fillOpacity="0.07" stroke="var(--c1)" strokeWidth="1.5" />
      <circle cx="300" cy="258" r="86" fill="var(--c3)" fillOpacity="0.07" stroke="var(--c3)" strokeWidth="1.5" />
      <circle cx="460" cy="258" r="86" fill="var(--c5)" fillOpacity="0.07" stroke="var(--c5)" strokeWidth="1.5" />

      <text x="380" y="112" textAnchor="middle" fontSize="16" fontWeight="600">
        機密性
      </text>
      <Txt x={380} y={132} tone="muted">
        許可された人だけ
      </Txt>
      <text x="300" y="288" textAnchor="middle" fontSize="16" fontWeight="600">
        完全性
      </text>
      <Txt x={300} y={308} tone="muted">
        改ざんを防ぐ
      </Txt>
      <text x="460" y="288" textAnchor="middle" fontSize="16" fontWeight="600">
        可用性
      </text>
      <Txt x={460} y={308} tone="muted">
        止まらず使える
      </Txt>

      <g>
        <rect x="316" y="202" width="128" height="58" rx="12" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="380" y="227" textAnchor="middle" fontSize="15" fontWeight="600">
          情報資産
        </text>
        <text x="380" y="246" textAnchor="middle" fontSize="13" fill="var(--muted)">
          保護対象
        </text>
      </g>

      <Txt x={380} y={372} tone="muted">
        3 特性のどれが損なわれるかを、事故ごとに判断する
      </Txt>
    </DiagramSvg>
  );
}

export function RiskProcess() {
  return (
    <DiagramSvg
      title="リスクマネジメントプロセス"
      desc="リスクの特定・分析・評価・対応を進め、監視とコミュニケーションで次のサイクルにつなげる流れを示す図。"
    >
      <ArrowDefs prefix="riskp" />
      <Txt x={380} y={44} tone="muted">
        リスク基準（許容水準）を先に定め、評価結果を対応につなげる
      </Txt>

      <Node x={22} y={76} w={164} h={76} title="① 特定" sub="資産・脅威・脆弱性" tone="c5" />
      <Node x={206} y={76} w={164} h={76} title="② 分析" sub="発生可能性 × 影響" tone="c3" />
      <Node x={390} y={76} w={164} h={76} title="③ 評価" sub="基準と比較し優先度付け" tone="c2" />
      <Node x={574} y={76} w={164} h={76} title="④ 対応" sub="回避・低減・移転・受容" tone="warning" />

      <Arrow prefix="riskp" x1={186} y1={114} x2={202} y2={114} />
      <Arrow prefix="riskp" x1={370} y1={114} x2={386} y2={114} />
      <Arrow prefix="riskp" x1={554} y1={114} x2={570} y2={114} />

      <Node x={470} y={246} w={210} h={62} title="リスク監視・レビュー" sub="残留リスクの確認" tone="c6" />
      <Node x={140} y={246} w={200} h={62} title="リスクコミュニケーション" sub="関係者への共有・協議" tone="c1" />

      <ArrowPath prefix="riskp" d="M 656 152 V 206 H 575 V 242" />
      <ArrowPath prefix="riskp" d="M 140 277 H 96 V 158" />

      <Txt x={380} y={334} tone="muted">
        PDCA を回しながら、リスクの変化に応じて見直す
      </Txt>
    </DiagramSvg>
  );
}

const MATRIX_X = 180;
const MATRIX_Y = 56;
const CELL = 52;

export function RiskMatrix() {
  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];
  return (
    <DiagramSvg
      title="リスクマトリックス"
      desc="発生可能性と影響度の5段階評価でリスク値を求め、低・中・高の領域ごとに対応の方向性を示す図。"
    >
      <ArrowDefs prefix="riskm" />

      {rows.map((probability, rowIndex) =>
        cols.map((impact, colIndex) => {
          const score = probability * impact;
          const tone = score >= 15 ? "var(--error)" : score >= 9 ? "var(--warning)" : "var(--success)";
          const x = MATRIX_X + colIndex * CELL;
          const y = MATRIX_Y + rowIndex * CELL;
          return (
            <g key={`${probability}-${impact}`}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                fill={tone}
                fillOpacity="0.16"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text x={x + CELL / 2} y={y + 31} textAnchor="middle" fontSize="13" fill="var(--muted)">
                {score}
              </text>
            </g>
          );
        }),
      )}

      {cols.map((impact, index) => (
        <text
          key={`col-${impact}`}
          x={MATRIX_X + index * CELL + CELL / 2}
          y={46}
          textAnchor="middle"
          fontSize="13"
          fill="var(--muted)"
        >
          {impact}
        </text>
      ))}
      {rows.map((probability, index) => (
        <text
          key={`row-${probability}`}
          x={MATRIX_X - 8}
          y={MATRIX_Y + index * CELL + 31}
          textAnchor="end"
          fontSize="13"
          fill="var(--muted)"
        >
          {probability}
        </text>
      ))}

      <text x="310" y="344" textAnchor="middle" fontSize="13" fill="var(--muted)">
        影響度（小 → 大）
      </text>
      <text x="104" y="186" textAnchor="middle" fontSize="13" fill="var(--muted)" transform="rotate(-90 104 186)">
        発生可能性（小 → 大）
      </text>

      <Node x={474} y={64} w={262} h={64} title="高リスク（15〜25）" sub="回避・低減を優先し経営層へ報告" tone="error" />
      <Node x={474} y={146} w={262} h={64} title="中リスク（9〜14）" sub="管理策で低減し、監視を強化" tone="warning" />
      <Node x={474} y={228} w={262} h={64} title="低リスク（1〜8）" sub="受容し、定期レビューを継続" tone="success" />

      <Txt x={605} y={314} tone="muted">
        リスク値 = 発生可能性 × 影響度
      </Txt>
      <Txt x={605} y={336} tone="muted">
        の目安。基準は組織ごとに設定する
      </Txt>
    </DiagramSvg>
  );
}

export function Pdca() {
  return (
    <DiagramSvg
      title="PDCA サイクル"
      desc="Plan・Do・Check・Act の4段階を循環させ、ISMS を継続的に改善する流れを示す図。"
    >
      <ArrowDefs prefix="pdca" />

      <Node x={285} y={10} w={190} h={62} title="Plan（計画）" sub="リスク評価と計画策定" tone="c5" titleSize={15} />
      <Node x={545} y={140} w={190} h={62} title="Do（実行）" sub="管理策の実施・運用" tone="c1" titleSize={15} />
      <Node x={285} y={272} w={190} h={62} title="Check（評価）" sub="内部監査・レビュー" tone="c2" titleSize={15} />
      <Node x={25} y={140} w={190} h={62} title="Act（改善）" sub="是正処置と見直し" tone="c6" titleSize={15} />

      <circle cx="380" cy="172" r="72" fill="var(--accent)" fillOpacity="0.08" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="380" y="152" textAnchor="middle" fontSize="13" fill="var(--muted)">
        ISMS
      </text>
      <text x="380" y="176" textAnchor="middle" fontSize="15" fontWeight="600">
        継続的改善
      </text>
      <text x="380" y="198" textAnchor="middle" fontSize="13" fill="var(--muted)">
        PDCA を回す
      </text>

      <Arrow prefix="pdca" x1={470} y1={74} x2={547} y2={136} />
      <Arrow prefix="pdca" x1={620} y1={204} x2={480} y2={300} />
      <Arrow prefix="pdca" x1={283} y1={300} x2={220} y2={210} />
      <Arrow prefix="pdca" x1={140} y1={138} x2={292} y2={78} />

      <Txt x={380} y={352} tone="muted">
        Check と Act を軽視すると、ISMS は形だけになる
      </Txt>
    </DiagramSvg>
  );
}

export function IsmsLandscape() {
  const clauses = [
    { x: 46, y: 140, label: "4 組織の状況" },
    { x: 250, y: 140, label: "5 リーダーシップ" },
    { x: 46, y: 178, label: "6 計画" },
    { x: 250, y: 178, label: "7 支援" },
    { x: 46, y: 216, label: "8 運用" },
    { x: 250, y: 216, label: "9 パフォーマンス評価" },
    { x: 46, y: 254, label: "10 改善" },
  ];
  return (
    <DiagramSvg
      title="ISMS の体系"
      desc="ISO/IEC 27001 の要求事項を中心に、27002 の管理策、27014 のガバナンス、27017 のクラウド管理策の関係を示す図。"
    >
      <ArrowDefs prefix="isms" />

      <Panel
        x={30}
        y={16}
        w={700}
        h={52}
        tone="accent"
        title="ISO/IEC 27014（情報セキュリティガバナンス）"
        sub="経営層が方針を示し、実施状況を監視する"
      />

      <Panel
        x={30}
        y={84}
        w={440}
        h={208}
        title="ISO/IEC 27001（ISMS 要求事項）"
        sub="4〜10 の箇条でマネジメントシステムを要求"
      />
      {clauses.map((clause) => (
        <Node key={clause.label} x={clause.x} y={clause.y} w={196} h={30} title={clause.label} titleSize={13} rx={8} />
      ))}

      <Panel x={490} y={84} w={240} h={120} title="ISO/IEC 27002（管理策）" sub="27001 を支える実施の手引き" />
      <Node x={506} y={140} w={104} h={26} title="組織的" titleSize={13} rx={8} />
      <Node x={618} y={140} w={104} h={26} title="人的" titleSize={13} rx={8} />
      <Node x={506} y={174} w={104} h={26} title="物理的" titleSize={13} rx={8} />
      <Node x={618} y={174} w={104} h={26} title="技術的" titleSize={13} rx={8} />

      <Panel x={490} y={216} w={240} h={76} title="ISO/IEC 27017（クラウド）" titleSize={14} />
      <Txt x={506} y={260} tone="muted" anchor="start">
        クラウドサービス特有の管理策
      </Txt>
      <Txt x={506} y={280} tone="muted" anchor="start">
        27002 に追加して適用する
      </Txt>

      <Arrow prefix="isms" x1={380} y1={68} x2={380} y2={80} />
      <Arrow prefix="isms" x1={470} y1={150} x2={486} y2={150} />
      <Arrow prefix="isms" x1={470} y1={254} x2={486} y2={254} />

      <Txt x={380} y={322} tone="muted">
        27001 が「何をすべきか」、27002・27017 が「どう実施するか」、27014 が経営の関与を示す
      </Txt>
    </DiagramSvg>
  );
}
