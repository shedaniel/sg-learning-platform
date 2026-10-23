export default function Loading() {
  return (
    <div className="space-y-4 py-10" aria-label="読み込み中">
      <div className="h-8 w-2/5 animate-pulse rounded bg-bg-soft" />
      <div className="h-4 w-3/5 animate-pulse rounded bg-bg-soft" />
      <div className="grid gap-3 pt-6 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-xl bg-bg-soft" />
        <div className="h-32 animate-pulse rounded-xl bg-bg-soft" />
      </div>
    </div>
  );
}
