"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarRange,
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Kbd } from "@/components/ui/primitives";

const primaryNav = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/learn", label: "学習", icon: BookOpen },
  { href: "/practice", label: "演習", icon: ClipboardCheck },
  { href: "/mock", label: "模擬試験", icon: Timer },
  { href: "/review", label: "復習", icon: RotateCcw },
];

const secondaryNav = [
  { href: "/past-papers", label: "過去問", icon: FileText },
  { href: "/glossary", label: "用語集", icon: Library },
  { href: "/statistics", label: "統計", icon: BarChart3 },
  { href: "/plan", label: "学習プラン", icon: CalendarRange },
  { href: "/coverage", label: "シラバス Coverage", icon: Target },
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
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent-soft font-semibold text-accent"
          : "text-muted hover:bg-bg-soft hover:text-fg",
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={active ? 2.3 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <Link href="/" className="flex items-center gap-3 px-2" onClick={onNavigate}>
        <span className="grid size-10 place-items-center rounded-xl bg-accent text-sm font-bold tracking-tight text-accent-fg shadow-sm">
          SG
        </span>
        <span>
          <span className="block text-sm font-semibold leading-5">SG 学習プラットフォーム</span>
          <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-muted">
            Security Management
          </span>
        </span>
      </Link>

      <nav aria-label="メインナビゲーション" className="flex flex-col gap-1">
        <p className="eyebrow px-3 pb-1">Study</p>
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <nav aria-label="その他のナビゲーション" className="flex flex-col gap-1">
        <p className="eyebrow px-3 pb-1">Reference</p>
        {secondaryNav.map((item) => (
          <NavLink key={item.href} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-border bg-surface-2 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <GraduationCap className="size-4 text-accent" />
          IPA 情報セキュリティマネジメント
        </div>
        <p className="mt-1.5 text-[0.7rem] leading-5 text-muted">
          シラバス Ver.4.1 準拠。2027年度改定案は別途表示します。
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        本文へスキップ
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-border bg-surface/70 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            aria-label="メニューを閉じる"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[286px] border-r border-border bg-surface shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full p-2 text-muted hover:bg-bg-soft"
              onClick={() => setMobileOpen(false)}
              aria-label="閉じる"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 md:px-8">
            <button
              type="button"
              className="btn btn-ghost size-9 rounded-full p-0 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="メニューを開く"
            >
              <Menu className="size-5" />
            </button>

            <form action="/search" className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                name="q"
                placeholder="用語・レッスン・問題を検索…"
                aria-label="全体検索"
                className="field h-9 border-transparent bg-surface-2 pl-9 pr-14 text-sm"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 sm:block">
                <Kbd>/</Kbd>
              </span>
            </form>

            <div className="ml-auto flex items-center gap-1">
              <Link href="/practice" className="btn btn-primary hidden h-9 px-3 text-xs sm:inline-flex">
                5問クイズ
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-6xl px-4 py-7 md:px-8 md:py-10">
          {children}
        </main>

        <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-xs leading-6 text-muted md:px-8">
          <div className="hairline flex flex-col gap-2 pt-5 md:flex-row md:items-center md:justify-between">
            <p>
              学習用非公式サイト。試験制度・シラバスは IPA 公式情報を確認してください。模擬スコアは
              IRT による公式評価点ではありません。
            </p>
            <div className="flex gap-3">
              <a className="hover:text-fg" href="https://www.ipa.go.jp/shiken/kubun/sg.html" target="_blank" rel="noreferrer">
                IPA SG
              </a>
              <Link className="hover:text-fg" href="/about">
                このサイトについて
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
