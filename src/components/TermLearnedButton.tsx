"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@coss/ui/components/button";
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
    <Button
      variant={learned ? "secondary" : "outline"}
      size="sm"
      onClick={() => void toggle()}
      aria-pressed={learned}
      className={learned ? "text-success-foreground" : undefined}
    >
      <Check />
      {learned ? "覚えた" : "覚えたことにする"}
    </Button>
  );
}
