import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 py-20">
      <p className="eyebrow">404</p>
      <h1 className="display text-4xl font-semibold">ページが見つかりません</h1>
      <p className="text-sm leading-7 text-muted-foreground">
        リンクが変更されたか、コンテンツがまだ公開されていない可能性があります。
        学習トップから目的の章を選び直してください。
      </p>
      <Link href="/learn" className="btn btn-primary">
        学習トップへ
      </Link>
    </div>
  );
}
