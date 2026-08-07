import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import Seal from "@/components/Seal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ساخت حساب کاربری",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <section className="bg-parchment min-h-[72vh] flex items-center">
      <div className="max-w-md mx-auto px-6 py-16 w-full text-center">
        <div className="flex justify-center mb-5">
          <Seal size={58} />
        </div>
        <h1 className="text-2xl font-bold mb-3">ساخت حساب موکل</h1>
        <p className="text-muted-foreground leading-8 mb-7">
          ثبت‌نام در صفحه امن Auth0 انجام می‌شود و پس از ورود، پروفایل پنل
          به‌صورت خودکار ساخته خواهد شد.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login?screen_hint=signup&returnTo=/account">
            <UserPlus size={17} /> ادامه ثبت‌نام امن
          </Link>
        </Button>
      </div>
    </section>
  );
}
