"use client";

import { useFormStatus } from "react-dom";
import { Loader2, LogOut } from "lucide-react";
import { logoutAction } from "@/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label="خروج از حساب کاربری"
      className="dashboard-logout-button"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin text-white" aria-hidden="true" />
          <span>در حال خروج...</span>
        </>
      ) : (
        <>
          <LogOut size={15} aria-hidden="true" />
          <span>خروج</span>
        </>
      )}
    </button>
  );
}

export default function DashboardLogoutButton() {
  return (
    <form action={logoutAction} className="w-full">
      <SubmitButton />
    </form>
  );
}
