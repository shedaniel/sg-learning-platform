"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Field, Note, WidgetBody } from "./shared";

type HashState =
  | { status: "computing" }
  | { status: "ready"; base: string; compare: { text: string; hash: string; bitDiff: number } | null }
  | { status: "unavailable"; message: string };

function mutateOneChar(value: string): string {
  const characters = Array.from(value);
  if (characters.length === 0) return "";
  const last = characters[characters.length - 1];
  characters[characters.length - 1] = last === "あ" ? "い" : "あ";
  return characters.join("");
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function countDifferingBits(left: string, right: string): number {
  let count = 0;
  for (let index = 0; index < left.length; index += 2) {
    let value = Number.parseInt(left.slice(index, index + 2), 16) ^ Number.parseInt(right.slice(index, index + 2), 16);
    while (value > 0) {
      count += value & 1;
      value >>>= 1;
    }
  }
  return count;
}

function HashHex({ hex, compareHex }: { hex: string; compareHex?: string }) {
  const groups = hex.match(/.{1,8}/g) ?? [];
  return (
    <p className="mono break-all text-[0.72rem] leading-6 text-foreground">
      {groups.map((group, groupIndex) => (
        <span key={groupIndex} className="mr-1.5 inline-block">
          {Array.from(group).map((character, characterIndex) => {
            const index = groupIndex * 8 + characterIndex;
            const differs = compareHex !== undefined && compareHex[index] !== character;
            return (
              <span
                key={characterIndex}
                className={cn(differs && "rounded-[2px] bg-destructive/20 font-bold text-destructive-foreground")}
              >
                {character}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}

export function HashDemo() {
  const [text, setText] = useState("情報セキュリティ");
  const [state, setState] = useState<HashState>({ status: "computing" });
  const inputId = useId();

  useEffect(() => {
    let cancelled = false;

    if (typeof globalThis.crypto === "undefined" || !globalThis.crypto.subtle) {
      setState({
        status: "unavailable",
        message:
          "この環境では Web Crypto API を利用できない。SHA-256 の計算には HTTPS または localhost で開いたモダンブラウザが必要である。",
      });
      return;
    }

    setState({ status: "computing" });
    const timer = window.setTimeout(() => {
      const compareTarget = mutateOneChar(text);
      void Promise.all([sha256Hex(text), compareTarget === "" ? Promise.resolve("") : sha256Hex(compareTarget)])
        .then(([base, changed]) => {
          if (cancelled) return;
          setState({
            status: "ready",
            base,
            compare:
              compareTarget === ""
                ? null
                : { text: compareTarget, hash: changed, bitDiff: countDifferingBits(base, changed) },
          });
        })
        .catch(() => {
          if (cancelled) return;
          setState({
            status: "unavailable",
            message:
              "ハッシュの計算に失敗した。HTTPS または localhost で開いているか、ブラウザが Web Crypto API に対応しているか確認する。",
          });
        });
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text]);

  const byteLength = new TextEncoder().encode(text).length;
  const percent =
    state.status === "ready" && state.compare ? Math.round((state.compare.bitDiff / 256) * 1000) / 10 : null;

  return (
    <WidgetBody>
      <div>
        <p className="eyebrow">SHA-256</p>
        <h3 className="text-sm font-semibold text-foreground">1文字の変更でハッシュはどう変わるか</h3>
      </div>

      <Field
        label="テキスト"
        htmlFor={inputId}
        hint={`${byteLength} バイト（UTF-8）`}
      >
        <input
          id={inputId}
          type="text"
          className="field"
          value={text}
          maxLength={120}
          onChange={(event) => {
            setText(event.target.value);
            setState({ status: "computing" });
          }}
          placeholder="例: 情報セキュリティ"
          autoComplete="off"
          spellCheck={false}
        />
      </Field>

      <p className="sr-only" role="status">
        {state.status === "computing"
          ? "SHA-256 を計算しています"
          : state.status === "unavailable"
            ? state.message
            : state.compare
              ? `SHA-256 を計算しました。256 ビット中 ${state.compare.bitDiff} ビットが変化しました。`
              : "SHA-256 を計算しました。"}
      </p>

      <div className="space-y-3">
        {state.status === "computing" ? (
          <p className="rounded-lg border border-border bg-muted px-3 py-2 text-[0.74rem] text-muted-foreground">
            SHA-256 を計算している…
          </p>
        ) : null}

        {state.status === "unavailable" ? <Note tone="warn">{state.message}</Note> : null}

        {state.status === "ready" ? (
          <>
            <div className="rounded-lg border border-border bg-muted p-3">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
                <p className="text-[0.68rem] font-semibold text-muted-foreground">入力テキストのハッシュ</p>
                <span className="chip">256 bit / 64 hex</span>
              </div>
              <HashHex hex={state.base} compareHex={state.compare?.hash} />
            </div>

            {state.compare ? (
              <>
                <div className="rounded-lg border border-border bg-muted p-3">
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
                    <p className="text-[0.68rem] font-semibold text-muted-foreground">末尾の1文字だけ変更したテキスト</p>
                    <span className="chip">比較用</span>
                  </div>
                  <p className="break-all text-[0.72rem] text-muted-foreground">「{state.compare.text}」</p>
                  <div className="mt-2">
                    <HashHex hex={state.compare.hash} compareHex={state.base} />
                  </div>
                </div>

                <div className="rounded-lg border border-ring/45 bg-muted px-3 py-2">
                  <p className="text-xs font-semibold text-foreground">
                    雪崩効果: 256 ビット中{" "}
                    <span className="mono text-info-foreground">{state.compare.bitDiff}</span> ビットが変化
                    {percent !== null ? `（${percent}%）` : ""}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] leading-5 text-muted-foreground">
                    入力の1文字を変えただけで、出力はほぼ別物になる。理想的なハッシュでは約半数（128 ビット前後）が変化する。赤字は2つの出力で異なる16進文字を示す。
                  </p>
                </div>
              </>
            ) : (
              <Note>1文字以上入力すると、末尾を1文字だけ変えた場合との比較を表示する。</Note>
            )}
          </>
        ) : null}
      </div>

      <Note>
        SHA-256 は任意長の入力を 256 ビットの固定長に圧縮する一方向ハッシュである。同じ入力からは常に同じ値が得られ、少しでも入力が変われば出力は大きく変わる。改ざん検知やデジタル署名の基礎になるが、パスワードの保存にはソルト付きの専用関数（Argon2 など）を使う。
      </Note>
      <p className="text-[0.65rem] leading-5 text-muted-foreground">
        入力はブラウザ内だけで処理され、外部へ送信されない。表示しているハッシュは、この端末の Web Crypto API が計算した値である。
      </p>
    </WidgetBody>
  );
}
