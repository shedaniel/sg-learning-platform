import type { DiagramId } from "@/lib/content/types";
import type { ReactElement } from "react";

import { AuditFlow } from "./audit";
import { CiaTriad, IsmsLandscape, Pdca, RiskMatrix, RiskProcess } from "./foundations";
import {
  AccessControl,
  AuthFactors,
  CloudResponsibility,
  DataProtection,
  HashSignature,
} from "./identity";
import { DmzFirewall, NetworkPath, PkiChain, TlsHandshake, ZeroTrust } from "./network";
import {
  Backup321,
  BcpTimeline,
  IncidentResponse,
  KillChain,
  RpoRto,
  SupplyChain,
} from "./security-ops";

const DIAGRAMS: Record<DiagramId, () => ReactElement> = {
  "cia-triad": CiaTriad,
  "risk-process": RiskProcess,
  "risk-matrix": RiskMatrix,
  pdca: Pdca,
  "isms-landscape": IsmsLandscape,
  "tls-handshake": TlsHandshake,
  "pki-chain": PkiChain,
  "dmz-firewall": DmzFirewall,
  "kill-chain": KillChain,
  "incident-response": IncidentResponse,
  "backup-321": Backup321,
  "rpo-rto": RpoRto,
  "access-control": AccessControl,
  "auth-factors": AuthFactors,
  "cloud-responsibility": CloudResponsibility,
  "supply-chain": SupplyChain,
  "zero-trust": ZeroTrust,
  "hash-signature": HashSignature,
  "data-protection": DataProtection,
  "audit-flow": AuditFlow,
  "bcp-timeline": BcpTimeline,
  "network-path": NetworkPath,
};

export function Diagram({
  id,
}: {
  id: DiagramId;
  props?: Record<string, string | number | boolean>;
}) {
  const Component = DIAGRAMS[id];
  return <Component />;
}
