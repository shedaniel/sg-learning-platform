import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PROFILE_COOKIE, parseProfileCode } from "@/lib/profile";

export const metadata: Metadata = { title: "プロフィールを選ぶ" };
export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const cookieStore = await cookies();
  const currentCode = parseProfileCode(cookieStore.get(PROFILE_COOKIE)?.value);

  return (
    <div className="mx-auto max-w-md py-10 md:py-16">
      <h1 className="display text-2xl md:text-[1.875rem]">プロフィールを選ぶ</h1>
      <p className="jp mt-3 text-pretty text-[0.9375rem] leading-7 text-muted-foreground">
        学習履歴は「同期コード」ごとに保存されます。同じコードを入力すれば、どの端末・どのブラウザでも同じ履歴を開けます。
      </p>
      <div className="mt-8">
        <ProfileForm currentCode={currentCode} next={next} />
      </div>
      <p className="mt-10 text-[0.8125rem] leading-6 text-muted-foreground">
        パスワードはありません。コードを知っている人は誰でもその履歴を開けるため、推測されにくいコードを使ってください。メールアドレスなどの個人情報は求めません。
      </p>
    </div>
  );
}
