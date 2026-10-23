"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play, Timer } from "lucide-react";

export function MockStartButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (loading || disabled) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) throw new Error(data.error ?? "模擬試験を開始できませんでした");
      router.push(`/mock/run/${data.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "模擬試験を開始できませんでした");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary h-11 px-5"
        onClick={() => void start()}
        disabled={disabled || loading}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        {loading ? "準備中…" : "120分の模擬試験を開始"}
      </button>
      {error ? <p className="mt-2 max-w-sm text-xs leading-5 text-error">{error}</p> : null}
      {disabled ? (
        <p className="mt-2 text-xs text-muted">問題バンクが60問未満のため開始できません。</p>
      ) : null}
      <p className="mt-2 flex items-center gap-1 text-[0.65rem] text-muted">
        <Timer className="size-3" />
        開始するとタイマーが動きます。途中保存・再開できます。
      </p>
    </div>
  );
}
