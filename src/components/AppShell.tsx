"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  RotateCcw,
  Search,
  Target,
  Timer,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Kbd } from "@/components/ui/primitives";

const primaryNav = [
  { href: "/", label: "概要", icon: LayoutDashboard, exact: true },
  { href: "/learn", label: "学習", icon: BookOpen },
  { href: "/practice", label: "演習", icon: ClipboardCheck },
  { href: "/mock", label: "模擬試験", icon: Timer },
  { href: "/review", label: "復習", icon: RotateCcw },
];

const secondaryNav = [
  { href: "/past-papers", label: "過去問", icon: FileText },
  { href: "/glossary", label: "用語集", icon: Library },
  { href: "/statistics", label: "統計", icon: BarChart3 },
  { href: "/coverage", label: "シラバス対応", icon: Target },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof BookOpen;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-[0.9375rem] transition-colors",
        active
          ? "bg-info/10 font-semibold text-info-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-[1.125rem] shrink-0" strokeWidth={active ? 2.2 : 1.7} />
      <span>{label}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate, profileCode }: { onNavigate?: () => void; profileCode: string | null }) {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <Link href="/" className="flex items-center gap-3 px-2" onClick={onNavigate}>
        <span className="grid size-9 place-items-center rounded-lg bg-info text-sm font-bold tracking-tight text-white">
          SG
        </span>
        <span className="min-w-0">
          <span className="block whitespace-nowrap text-[0.9375rem] font-semibold leading-5">
            SG 学習プラットフォーム
          </span>
          <span className="block whitespace-nowrap text-xs text-muted-foreground">
            情報セキュリティマネジメント
          </span>
        </span>
      </Link>

      <nav aria-label="メインナビゲーション" className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">学習</p>
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <nav aria-label="その他のナビゲーション" className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">参照</p>
        {secondaryNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8125rem] transition-colors hover:bg-muted"
          aria-label={profileCode ? `プロフィール ${profileCode}。切り替える` : "プロフィールを選ぶ"}
        >
          <UserRound className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.9375rem] font-medium leading-5">{profileCode ?? "—"}</span>
            <span className="block text-xs text-muted-foreground">コードを切り替える</span>
          </span>
        </Link>
        <div className="px-3">
          <p className="flex items-center gap-2 text-[0.8125rem] font-medium">
            <GraduationCap className="size-4 text-muted-foreground" />
            IPA SG シラバス Ver.4.1
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">2027年度改定案は別途表示します。</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileCode, setProfileCode] = useState<string | null>(null);
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const bare = pathname === "/profile";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { code?: string | null } | null) => {
        if (!cancelled) setProfileCode(data?.code ?? null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [bare]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (bare) {
    return (
      <div className="min-h-dvh">
        <main id="main-content" className="mx-auto max-w-6xl px-4 md:px-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        本文へスキップ
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-border bg-card lg:block">
        <SidebarContent profileCode={profileCode} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="メニューを閉じる"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[286px] border-r border-border bg-card">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground hover:bg-muted"
              onClick={() => setMobileOpen(false)}
              aria-label="閉じる"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} profileCode={profileCode} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-border bg-background">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 md:px-8">
            <button
              type="button"
              className="btn btn-ghost size-9 rounded-full p-0 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="メニューを開く"
            >
              <Menu className="size-5" />
            </button>

            <form action="/search" className="relative min-w-0 max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                type="search"
                name="q"
                placeholder="用語・レッスン・問題を検索…"
                aria-label="全体検索"
                className="field h-9 border-transparent bg-muted pl-9 pr-14 text-[0.9375rem]"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 sm:block">
                <Kbd>/</Kbd>
              </span>
            </form>

            <div className="ml-auto flex items-center gap-1">
              <Link href="/practice" className="btn btn-primary hidden h-9 px-3.5 sm:inline-flex">
                5問クイズ
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-6xl px-4 py-7 md:px-8 md:py-9">
          {children}
        </main>

        <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-xs leading-6 text-muted-foreground md:px-8">
          <div className="hairline flex flex-col gap-2 pt-5 md:flex-row md:items-center md:justify-between">
            <p>
              学習用非公式サイト。試験制度・シラバスは IPA 公式情報を確認してください。模擬スコアは
              IRT による公式評価点ではありません。
            </p>
            <div className="flex gap-3">
              <a className="hover:text-foreground" href="https://www.ipa.go.jp/shiken/kubun/sg.html" target="_blank" rel="noreferrer">
                IPA SG
              </a>
              <Link className="hover:text-foreground" href="/about">
                このサイトについて
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
