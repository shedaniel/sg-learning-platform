import type { DiagramId } from "@/lib/content/types";

const LABELS: Record<DiagramId, string> = {
  "cia-triad": "CIA  triad",
  "risk-process": "リスクマネジメントプロセス",
  "risk-matrix": "リスクマトリックス",
  pdca: "PDCA サイクル",
  "isms-landscape": "ISMS の体系",
  "tls-handshake": "TLS ハンドシェイク",
  "pki-chain": "PKI 信頼の連鎖",
  "dmz-firewall": "DMZ とファイアウォール",
  "kill-chain": "サイバーキルチェーン",
  "incident-response": "インシデント対応ライフサイクル",
  "backup-321": "3-2-1 バックアップ",
  "rpo-rto": "RPO と RTO",
  "access-control": "アクセス制御モデル",
  "auth-factors": "認証の3要素",
  "cloud-responsibility": "クラウド責任共有モデル",
  "supply-chain": "サプライチェーン",
  "zero-trust": "ゼロトラスト",
  "hash-signature": "ハッシュとデジタル署名",
  "data-protection": "データ保護ライフサイクル",
  "audit-flow": "監査プロセス",
  "bcp-timeline": "事業継続タイムライン",
  "network-path": "ネットワーク経路",
};

export function Diagram({ id }: { id: DiagramId; props?: Record<string, string | number | boolean> }) {
  return (
    <div
      role="img"
      aria-label={LABELS[id]}
      className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-2 px-4 py-8 text-center"
    >
      <span className="eyebrow">Diagram</span>
      <span className="text-sm font-semibold">{LABELS[id]}</span>
      <span className="text-xs text-muted">図解コンポーネントを読み込み中</span>
    </div>
  );
}
