"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Note, ResetButton, Verdict, WidgetBody } from "./shared";

// 指定された5つの主体（営業・人事・経理・管理者・委託先）を役割、
// 保護対象の3区分を資源として扱う。委託先×顧客データの違反を検出できる。
const ROLES = [
  { id: "sales", label: "営業", note: "顧客対応・提案" },
  { id: "hr", label: "人事", note: "採用・評価・給与" },
  { id: "finance", label: "経理", note: "請求・支払・決算" },
  { id: "admin", label: "システム管理者", note: "アカウント・端末管理" },
  { id: "contractor", label: "外部委託先", note: "業務範囲は契約で限定" },
] as const;

const RESOURCES = [
  { id: "customer", label: "顧客データ", note: "氏名・連絡先・購買履歴" },
  { id: "employee", label: "人事・給与", note: "評価・給与・勤怠" },
  { id: "finance", label: "財務・請求", note: "口座・請求・支払" },
] as const;

type Role = (typeof ROLES)[number];
type Resource = (typeof RESOURCES)[number];

const ALLOWED: Record<Role["id"], readonly Resource["id"][]> = {
  sales: ["customer"],
  hr: ["employee"],
  finance: ["finance"],
  admin: [],
  contractor: [],
};

interface Grant {
  role: Role;
  resource: Resource;
}

interface Violation extends Grant {
  severity: "高" | "中";
  reason: string;
}

function violationFor(role: Role, resource: Resource): Violation | null {
  if (ALLOWED[role.id].includes(resource.id)) return null;

  if (role.id === "contractor") {
    const scope =
      resource.id === "customer"
        ? "顧客データは特に、委託先の作業に必要なレコード・項目だけに限定し、多要素認証と操作ログを必須にする。"
        : "必要なレコード・期間だけに限定し、多要素認証と操作ログを必須にする。";
    return {
      role,
      resource,
      severity: "高",
      reason: `${resource.label}を外部委託先に付与している。委託契約の作業範囲を超える権限は最小権限違反である。${scope}`,
    };
  }

  if (role.id === "admin") {
    return {
      role,
      resource,
      severity: "中",
      reason: `システム管理者が${resource.label}を常時閲覧できる。システム管理権限と業務データの閲覧を分離しないと、特権の悪用や誤操作を検知しにくい。保守時は都度承認と記録を行う。`,
    };
  }

  const reason =
    role.id === "finance" && resource.id === "employee"
      ? "経理が人事・給与データを閲覧できる。給与計算と支払の職務分離が崩れ、支給額の改ざん余地が生まれる。"
      : role.id === "sales" && resource.id === "employee"
        ? "営業が人事・給与データを閲覧できる。評価・給与情報は業務上の必要がなく、職務分掌違反となる。"
        : role.id === "sales" && resource.id === "finance"
          ? "営業が財務・請求データを閲覧できる。与信・請求情報は営業の成果と分離し、必要項目だけを参照させる。"
          : role.id === "hr" && resource.id === "customer"
            ? "人事が顧客データを閲覧できる。採用・評価の業務に顧客の個人情報は通常不要であり、必要性を説明できない。"
            : role.id === "hr" && resource.id === "finance"
              ? "人事が財務データを閲覧できる。給与振込や経費の処理に人事が関与すると、不正の機会が広がる。"
              : role.id === "finance" && resource.id === "customer"
                ? "経理が顧客データ全体を閲覧できる。請求に必要な項目だけに限定し、購買履歴や連絡先まで見せない。"
                : `この役割に${resource.label}の閲覧権限を与える業務上の必要性が確認できない。`;

  return { role, resource, severity: "中", reason };
}

function cellKey(roleId: string, resourceId: string): string {
  return `${roleId}:${resourceId}`;
}

export function AccessMatrix() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const grants: Grant[] = [];
  for (const key of selected) {
    const [roleId, resourceId] = key.split(":");
    const role = ROLES.find((entry) => entry.id === roleId);
    const resource = RESOURCES.find((entry) => entry.id === resourceId);
    if (role && resource) grants.push({ role, resource });
  }
  grants.sort(
    (a, b) =>
      ROLES.findIndex((entry) => entry.id === a.role.id) - ROLES.findIndex((entry) => entry.id === b.role.id) ||
      RESOURCES.findIndex((entry) => entry.id === a.resource.id) - RESOURCES.findIndex((entry) => entry.id === b.resource.id),
  );

  const violations = grants
    .map((grant) => violationFor(grant.role, grant.resource))
    .filter((entry): entry is Violation => entry !== null);
  const allowedCount = grants.length - violations.length;

  return (
    <WidgetBody>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Least privilege</p>
          <h3 className="text-sm font-semibold text-foreground">役割 × データの権限を点検する</h3>
        </div>
        <ResetButton onClick={() => setSelected(new Set())} label="全解除" />
      </div>

      <p className="text-[0.76rem] leading-6 text-muted-foreground">
        5つの役割に、3種類のデータへの閲覧権限を与える。チェックした組合せを「最小権限の原則」と職務分離の観点で判定する。ここでは常時付与する権限を点検し、作業単位・期間単位の一時付与は別に設計する。
      </p>

      <div className="overflow-x-auto" role="region" aria-label="アクセス権限マトリックス" tabIndex={0}>
        <table className="w-full min-w-[27rem] border-collapse text-xs">
          <caption className="sr-only">
            役割ごとのデータアクセス権限。各行が役割、各列がデータ区分で、チェックを付けると権限を付与する。
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border border-border bg-muted px-2 py-2 text-left font-semibold">
                役割
              </th>
              {RESOURCES.map((resource) => (
                <th
                  key={resource.id}
                  scope="col"
                  className="border border-border bg-muted px-1.5 py-2 text-center font-semibold"
                >
                  <span className="block">{resource.label}</span>
                  <span className="mt-0.5 block text-[0.55rem] font-normal leading-4 text-muted-foreground">{resource.note}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role) => (
              <tr key={role.id}>
                <th scope="row" className="border border-border px-2 py-1.5 text-left font-medium">
                  <span className="block text-[0.72rem] text-foreground">{role.label}</span>
                  <span className="block text-[0.55rem] font-normal leading-4 text-muted-foreground">{role.note}</span>
                </th>
                {RESOURCES.map((resource) => {
                  const key = cellKey(role.id, resource.id);
                  const checked = selected.has(key);
                  return (
                    <td
                      key={resource.id}
                      className={cn("border border-border p-0 text-center", checked && "bg-muted")}
                    >
                      <label className="flex min-h-9 cursor-pointer items-center justify-center p-1.5">
                        <input
                          type="checkbox"
                          className="size-4"
                          style={{ accentColor: "var(--chart-2)" }}
                          checked={checked}
                          aria-label={`${role.label}の${resource.label}閲覧権限`}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setSelected((previous) => {
                              const next = new Set(previous);
                              if (checked) next.add(key);
                              else next.delete(key);
                              return next;
                            });
                          }}
                        />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="chip">付与 {grants.length} 件</span>
        <span className="chip" style={{ color: "var(--success-foreground)", borderColor: "var(--success-foreground)" }}>
          適正 {allowedCount}
        </span>
        <span className="chip" style={{ color: "var(--destructive-foreground)", borderColor: "var(--destructive-foreground)" }}>
          違反 {violations.length}
        </span>
        <span className="ml-auto text-[0.6rem] leading-4 text-muted-foreground">
          推奨ベースライン: 営業=顧客／人事=人事・給与／経理=財務・請求／システム管理者・委託先=なし
        </span>
      </div>

      <p className="sr-only" role="status">
        {grants.length === 0
          ? "権限は未付与です。"
          : `付与 ${grants.length} 件、適正 ${allowedCount} 件、違反 ${violations.length} 件です。`}
      </p>

      <div className="space-y-2">
        {grants.length === 0 ? (
          <Note>まだ権限を付与していない。チェックを付けると、その組合せの適否と理由を表示する。</Note>
        ) : violations.length === 0 ? (
          <Verdict ok>付与した権限はすべて推奨ベースライン内である。不要になった権限は定期的に棚卸しする。</Verdict>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive-foreground">
              <ShieldAlert aria-hidden className="size-4" />
              {violations.length} 件の最小権限違反
            </div>
            <ul className="space-y-1.5">
              {violations.map((violation) => (
                <li
                  key={cellKey(violation.role.id, violation.resource.id)}
                  className="rounded-lg border border-border bg-muted px-2.5 py-2"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="chip"
                      style={{
                        color: violation.severity === "高" ? "var(--destructive-foreground)" : "var(--warning-foreground)",
                        borderColor: violation.severity === "高" ? "var(--destructive-foreground)" : "var(--warning-foreground)",
                      }}
                    >
                      重大度 {violation.severity}
                    </span>
                    <span className="text-[0.72rem] font-semibold text-foreground">
                      {violation.role.label} × {violation.resource.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.7rem] leading-5 text-muted-foreground">{violation.reason}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <p className="text-[0.68rem] leading-5 text-muted-foreground">
        外部委託先には、自社の従業員と同じ権限を与えない。委託先のアカウントは作業単位・期間単位で発行し、契約終了時に確実に失効させる。システム管理者には業務データの閲覧ではなく、アカウント管理に必要な権限だけを与える。
      </p>
    </WidgetBody>
  );
}
