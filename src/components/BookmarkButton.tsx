"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@coss/ui/components/button";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  itemType,
  itemId,
  initial,
  label = "ブックマーク",
}: {
  itemType: "question" | "term" | "lesson";
  itemId: string;
  initial: boolean;
  label?: string;
}) {
  const [bookmarked, setBookmarked] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId }),
      });
      if (response.ok) {
        const data = (await response.json()) as { bookmarked: boolean };
        setBookmarked(data.bookmarked);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void toggle()}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? `${label}を解除` : label}
      className={bookmarked ? "text-info-foreground" : undefined}
    >
      <Bookmark className={bookmarked ? "fill-current" : undefined} />
      {bookmarked ? "保存済み" : label}
    </Button>
  );
}
