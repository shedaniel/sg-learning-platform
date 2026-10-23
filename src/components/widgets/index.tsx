"use client";

import type { ComponentType } from "react";
import type { WidgetId } from "@/lib/content/types";
import { AccessMatrix } from "./access-matrix";
import { BackupPlanner } from "./backup-planner";
import { CiaImpact } from "./cia-impact";
import { ControlMatcher } from "./control-matcher";
import { HashDemo } from "./hash-demo";
import { IncidentTriage } from "./incident-triage";
import { RiskMatrix } from "./risk-matrix";
import { SubnetCalculator } from "./subnet-calculator";
import type { WidgetProps } from "./shared";

const WIDGETS: Record<WidgetId, ComponentType<{ props?: WidgetProps }>> = {
  "risk-matrix": RiskMatrix,
  "backup-planner": BackupPlanner,
  "access-matrix": AccessMatrix,
  "hash-demo": HashDemo,
  "incident-triage": IncidentTriage,
  "control-matcher": ControlMatcher,
  "cia-impact": CiaImpact,
  "subnet-calculator": SubnetCalculator,
};

export function WidgetRenderer({ widget, props }: { widget: WidgetId; props?: WidgetProps }) {
  const Component = WIDGETS[widget];
  return <Component props={props} />;
}
