"use client";

import { useState } from "react";
import { Button } from "@coss/ui/components/button";
import {
  PROFILE_CODE_HINT,
  isValidProfileCode,
  normalizeProfileCode,
  safeNextPath,
} from "@/lib/profile";

type Step = "enter" | "confirm-create";

export function ProfileForm({ currentCode, next }: { currentCode: string | null; next?: string }) {
  const [input, setInput] = useState("");
  const [step, setStep] = useState<Step>("enter");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const code = normalizeProfileCode(input);
  const destination = safeNextPath(next);

  async function submit(create: boolean) {
    setError(null);
    if (!isValidProfileCode(code)) {
      setError(`コードの形式が正しくありません。${PROFILE_CODE_HINT}`);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, create }),
      });
      if (response.status === 404) {
        setStep("confirm-create");
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "プロフィールを開けませんでした。もう一度お試しください。");
        return;
      }
      // Full navigation so the server picks up the new cookie for every page.
      window.location.assign(destination);
    } catch {
      setError("通信に失敗しました。接続を確認してもう一度お試しください。");
    } finally {
      setBusy(false);
    }
  }

  async function forget() {
    setBusy(true);
    await fetch("/api/profile", { method: "DELETE" }).catch(() => undefined);
    window.location.assign("/profile");
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(step === "confirm-create");
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="profile-code" className="text-[0.9375rem] font-medium">
            同期コード
          </label>
          <input
            id="profile-code"
            name="code"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setStep("enter");
              setError(null);
            }}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="例: taro-sg"
            className="field mt-1.5 h-11 text-base"
            aria-describedby="profile-code-hint profile-code-error"
            aria-invalid={error ? true : undefined}
          />
          <p id="profile-code-hint" className="mt-1.5 text-[0.8125rem] text-muted-foreground">
            {PROFILE_CODE_HINT}
          </p>
        </div>

        {step === "confirm-create" ? (
          <div className="rounded-xl border border-border bg-muted/60 p-4" role="status">
            <p className="text-[0.9375rem] leading-7">
              「<span className="mono font-semibold">{code}</span>」はまだ使われていないコードです。新しいプロフィールとして始めますか？
            </p>
            <p className="mt-1 text-[0.8125rem] leading-6 text-muted-foreground">
              入力ミスの場合は、コードを直してからもう一度お試しください。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="submit" disabled={busy} className="h-10 px-4">
                新しく始める
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep("enter")} className="h-10 px-4">
                コードを直す
              </Button>
            </div>
          </div>
        ) : (
          <Button type="submit" disabled={busy || code.length === 0} className="h-11 w-full text-base">
            {busy ? "確認中…" : "このコードで開く"}
          </Button>
        )}

        <p id="profile-code-error" role="alert" className="min-h-5 text-[0.9375rem] text-destructive-foreground">
          {error}
        </p>
      </form>

      {currentCode ? (
        <div className="mt-8 border-t border-border pt-5">
          <p className="text-[0.9375rem]">
            この端末のプロフィール: <span className="mono font-semibold">{currentCode}</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a href={destination} className="btn h-10 px-4">
              このまま続ける
            </a>
            <Button type="button" variant="ghost" onClick={() => void forget()} disabled={busy} className="h-10 px-4">
              この端末から外す
            </Button>
          </div>
          <p className="mt-2 text-[0.8125rem] leading-6 text-muted-foreground">
            外しても学習履歴は消えません。同じコードを入力すればいつでも開けます。
          </p>
        </div>
      ) : null}
    </div>
  );
}
