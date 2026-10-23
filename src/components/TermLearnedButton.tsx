"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TermLearnedButton({
  termId,
  initial,
}: {
  termId: string;
  initial: boolean;
}) {
  const [learned, setLearned] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    try {
      const next = !learned;
      const response = await fetch("/api/term-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termId, learned: next }),
      });
      if (response.ok) setLearned(next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className={cn("btn text-xs", learned && "border-success/40 bg-success/10 text-success")}
      aria-pressed={learned}
    >
      <Check className="size-4" />
      {learned ? "覚えた" : "覚えたことにする"}
    </button>
  );
}
