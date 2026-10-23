import { Arrow, ArrowDefs, ArrowPath, DiagramSvg, Node, Txt } from "./shared";

export function AuditFlow() {
  const phases = [
    { x: 18, title: "予備調査", sub: "資料と体制の把握", output: "監査計画" },
    { x: 166, title: "本調査", sub: "証拠の収集・検証", output: "監査調書" },
    { x: 314, title: "結論", sub: "適合性の判断", output: "指摘事項" },
    { x: 462, title: "報告", sub: "報告書と改善要求", output: "監査報告書" },
    { x: 610, title: "フォローアップ", sub: "是正状況の確認", output: "是正計画" },
  ];
  return (
    <DiagramSvg
      title="監査プロセス"
      desc="予備調査・本調査・結論・報告・フォローアップの5段階と、各段階の成果物、次期監査への改善の循環を示す図。"
    >
      <ArrowDefs prefix="audit" />
      <Txt x={380} y={36} tone="muted">
        監査は独立した立場で証拠を集め、基準への適合を判断して改善につなげる
      </Txt>

      {phases.map((phase, index) => (
        <g key={phase.title}>
          <Node x={phase.x} y={76} w={132} h={70} title={phase.title} sub={phase.sub} titleSize={14} />
          <line
            x1={phase.x + 66}
            y1="146"
            x2={phase.x + 66}
            y2="162"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <Node x={phase.x} y={166} w={132} h={32} title={phase.output} tone="c5" titleSize={13} rx={8} />
          {index < phases.length - 1 ? (
            <Arrow prefix="audit" x1={phase.x + 132} y1={111} x2={phases[index + 1].x - 4} y2={111} />
          ) : null}
        </g>
      ))}

      <ArrowPath prefix="audit" d="M 676 198 V 268 H 84 V 202" tone="accent" />

      <Txt x={380} y={292} tone="muted">
        次期監査・継続的改善
      </Txt>
      <Txt x={380} y={320} tone="muted">
        下段は各段階の成果物。監査結果は経営層に報告する
      </Txt>
    </DiagramSvg>
  );
}
