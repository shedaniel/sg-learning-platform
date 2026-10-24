"use client";

import { useId, useState } from "react";
import { cn, clamp } from "@/lib/utils";
import { Field, Metric, Note, ResetButton, WidgetBody, numberProp, stringProp, type WidgetProps } from "./shared";

interface ParsedIp {
  octets: number[];
  value: number;
}

function parseIpv4(raw: string): ParsedIp | null {
  const parts = raw.trim().split(".");
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const value = Number(part);
    if (value < 0 || value > 255) return null;
    octets.push(value);
  }
  const value = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  return { octets, value };
}

function prefixToMask(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

function maskToPrefix(mask: number): number | null {
  let prefix = 0;
  for (let bit = 31; bit >= 0; bit -= 1) {
    if (((mask >>> bit) & 1) === 0) break;
    prefix += 1;
  }
  return prefixToMask(prefix) === (mask >>> 0) ? prefix : null;
}

function parseMask(raw: string): { prefix: number; value: number } | null {
  const value = raw.trim().replace(/^\//, "");
  if (/^\d{1,2}$/.test(value)) {
    const prefix = Number(value);
    return prefix <= 32 ? { prefix, value: prefixToMask(prefix) } : null;
  }
  const ip = parseIpv4(value);
  if (!ip) return null;
  const prefix = maskToPrefix(ip.value);
  return prefix === null ? null : { prefix, value: ip.value };
}

function intToIp(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

function formatInt(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function BitRow({ label, octet, networkBits }: { label: string; octet: number; networkBits: number }) {
  const bits = octet.toString(2).padStart(8, "0");
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="w-24 shrink-0 text-[0.64rem] leading-4 text-muted-foreground">{label}</span>
      <span className="mono flex gap-[2px]" aria-label={`${label}: ${bits}`}>
        {Array.from(bits).map((bit, index) => (
          <span
            key={index}
            className={cn(
              "rounded-[2px] px-1 py-0.5 text-[0.66rem] leading-4",
              index < networkBits ? "bg-muted font-semibold text-info-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {bit}
          </span>
        ))}
      </span>
    </div>
  );
}

export function SubnetCalculator({ props }: { props?: WidgetProps }) {
  const initialAddress = stringProp(props, "address", "192.168.10.37");
  const initialMask = stringProp(
    props,
    "mask",
    String(clamp(Math.round(numberProp(props, "prefix", 24)), 0, 32)),
  );
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [maskInput, setMaskInput] = useState(initialMask);
  const groupId = useId();

  const ip = parseIpv4(addressInput);
  const mask = parseMask(maskInput);
  const addressError = ip === null ? "0〜255 の数値を4つ、ドットで区切って入力してください" : null;
  const maskError =
    mask === null ? "0〜32 のプレフィックス長、または 255.255.255.0 のような連続したマスクを入力してください" : null;

  const result =
    ip !== null && mask !== null
      ? (() => {
          const network = (ip.value & mask.value) >>> 0;
          const broadcast = (network | (~mask.value >>> 0)) >>> 0;
          const total = 2 ** (32 - mask.prefix);
          const usable = mask.prefix <= 30 ? total - 2 : mask.prefix === 31 ? 2 : 1;
          const firstHost = mask.prefix <= 30 ? network + 1 : network;
          const lastHost = mask.prefix <= 30 ? broadcast - 1 : mask.prefix === 31 ? broadcast : network;
          return {
            network,
            broadcast,
            total,
            usable,
            firstHost,
            lastHost,
            networkBitsInLastOctet: Math.max(0, Math.min(8, mask.prefix - 24)),
          };
        })()
      : null;

  return (
    <WidgetBody>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Subnet calculator</p>
          <h3 className="text-sm font-semibold text-foreground">IPv4 のネットワークを計算する</h3>
        </div>
        <ResetButton
          onClick={() => {
            setAddressInput(initialAddress);
            setMaskInput(initialMask);
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="IPv4 アドレス" htmlFor={`${groupId}-address`} error={addressError}>
          <input
            id={`${groupId}-address`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className="field mono"
            value={addressInput}
            onChange={(event) => setAddressInput(event.target.value)}
            placeholder="192.168.10.37"
            aria-invalid={ip === null}
            aria-describedby={addressError ? `${groupId}-address-error` : undefined}
          />
        </Field>
        <Field label="プレフィックス長 / サブネットマスク" htmlFor={`${groupId}-mask`} error={maskError}>
          <input
            id={`${groupId}-mask`}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            className="field mono"
            value={maskInput}
            onChange={(event) => setMaskInput(event.target.value)}
            placeholder="24 または 255.255.255.0"
            aria-invalid={mask === null}
            aria-describedby={maskError ? `${groupId}-mask-error` : undefined}
          />
        </Field>
      </div>

      <p className="sr-only" role="status">
        {result !== null && mask !== null
          ? `ネットワークアドレスは ${intToIp(result.network)}、利用可能ホストは ${formatInt(result.usable)} 台です。`
          : ""}
      </p>

      {ip === null || mask === null || result === null ? (
        <Note tone="warn">アドレスとマスクを正しく入力すると、計算結果を表示する。</Note>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Metric
              label="ネットワークアドレス"
              value={`${intToIp(result.network)} / ${mask.prefix}`}
              sub="サブネットの先頭アドレス"
              tone="accent"
              className="col-span-2"
            />
            <Metric
              label="ブロードキャスト"
              value={intToIp(result.broadcast)}
              sub={
                mask.prefix <= 30
                  ? "サブネット内の最終アドレス"
                  : mask.prefix === 31
                    ? "／31 ではブロードキャストを使用しない"
                    : "／32 は単一ホストを表す"
              }
            />
            <Metric label="サブネットマスク" value={intToIp(mask.value)} sub={`プレフィックス /${mask.prefix}`} />
            <Metric
              label="利用可能ホスト数"
              value={`${formatInt(result.usable)} 台`}
              sub={
                mask.prefix <= 30
                  ? "総アドレス数 − 2（ネットワーク・ブロードキャスト）"
                  : mask.prefix === 31
                    ? "RFC 3021 のポイントツーポイント"
                    : "単一ホスト"
              }
              tone="success"
            />
            <Metric label="総アドレス数" value={`${formatInt(result.total)} 個`} sub={`2^${32 - mask.prefix}`} />
            <Metric
              label="利用可能なアドレス範囲"
              value={
                result.firstHost === result.lastHost
                  ? intToIp(result.firstHost)
                  : `${intToIp(result.firstHost)} 〜 ${intToIp(result.lastHost)}`
              }
              sub={mask.prefix <= 30 ? "先頭と末尾を除いた範囲" : mask.prefix === 31 ? "2 アドレスとも利用可能" : "単一アドレス"}
              className="col-span-2"
            />
          </div>

          <div className="rounded-lg border border-border bg-muted p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-1">
              <p className="text-xs font-semibold text-foreground">第4オクテットの2進数</p>
              <span className="text-[0.62rem] text-muted-foreground">左から {result.networkBitsInLastOctet} ビットがネットワーク部</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <BitRow label="入力アドレス" octet={ip.octets[3]} networkBits={result.networkBitsInLastOctet} />
              <BitRow
                label="ネットワーク"
                octet={result.network & 255}
                networkBits={result.networkBitsInLastOctet}
              />
              <BitRow
                label="ブロードキャスト"
                octet={result.broadcast & 255}
                networkBits={result.networkBitsInLastOctet}
              />
            </div>
            <p className="mt-2 text-[0.64rem] leading-5 text-muted-foreground">
              <span className="mr-2 inline-block rounded-[2px] bg-muted px-1 font-semibold text-info-foreground">1</span>
              ネットワーク部（アクセント色）
              <span className="ml-3 mr-2 inline-block rounded-[2px] bg-card px-1 text-muted-foreground">0</span>
              ホスト部
            </p>
          </div>

          <p className="text-[0.68rem] leading-5 text-muted-foreground">
            {intToIp(ip.value)} を /{mask.prefix} で分割すると、ネットワークアドレスは {intToIp(result.network)}、利用可能ホストは{" "}
            {formatInt(result.usable)} 台である。
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        {mask?.prefix === 31 ? (
          <Note tone="info">
            ／31 は RFC 3021 により、ルータ間のポイントツーポイント接続で 2 アドレスをそのまま利用できる。一般的な「総数 − 2」の公式とは扱いが異なる。
          </Note>
        ) : null}
        {mask?.prefix === 32 ? (
          <Note tone="info">
            ／32 は 1 台のホストを表す。ネットワークアドレスとブロードキャストの区別はなく、表示上のアドレスは同一である。
          </Note>
        ) : null}
        <Note>
          サブネットマスクは、アドレスのうちネットワーク部とホスト部の境界を示す。マスクのビットは先頭から連続して 1 でなければならない（例: 255.255.255.0）。一般的な /30 以下では、ネットワークアドレスとブロードキャストにはホストを割り当てない。
        </Note>
      </div>
    </WidgetBody>
  );
}
