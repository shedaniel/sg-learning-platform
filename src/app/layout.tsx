import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: {
    default: "SG 学習プラットフォーム | 情報セキュリティマネジメント",
    template: "%s | SG 学習プラットフォーム",
  },
  description:
    "IPA 情報セキュリティマネジメント試験（SG）の日本語インタラクティブ教科書。シラバス準拠のレッスン、用語集、演習、公式過去問、模擬試験。",
  applicationName: "SG 学習プラットフォーム",
  authors: [{ name: "SG Learning Platform" }],
  openGraph: {
    title: "SG 学習プラットフォーム",
    description:
      "情報セキュリティマネジメント試験の完全学習プラットフォーム。理解 → 可視化 → 演習 → 復習 → 模擬試験。",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#111411" },
  ],
};

const themeScript = `try {
  var saved = localStorage.getItem('sg-theme');
  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.classList.add('dark');
} catch (e) {}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="jp antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
