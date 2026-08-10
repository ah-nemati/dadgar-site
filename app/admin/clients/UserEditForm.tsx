'use client';

import { useActionState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { updateUserAction } from './actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '@/types/content';

export default function UserEditForm({ user }: { user: Profile }) {
  const action = updateUserAction.bind(null, user.id);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="dashboard-card mt-6 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <h2 className="font-bold">ویرایش حساب و سطح دسترسی</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          تغییر نقش یا غیرفعال‌کردن حساب، همه نشست‌های فعال آن کاربر را می‌بندد.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-user-name">نام و نام خانوادگی</Label>
        <Input id="edit-user-name" name="fullName" defaultValue={user.fullName} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-phone">شماره موبایل</Label>
        <Input id="edit-user-phone" name="phone" type="tel" dir="ltr" className="text-right" defaultValue={user.phone ?? ''} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-email">ایمیل</Label>
        <Input id="edit-user-email" name="email" type="email" dir="ltr" className="text-right" defaultValue={user.email ?? ''} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-role">نقش</Label>
        <select id="edit-user-role" name="role" defaultValue={user.role} className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm" required>
          <option value="CLIENT">موکل</option>
          <option value="LAWYER">وکیل</option>
          <option value="ADMIN">مدیر</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-status">وضعیت</Label>
        <select
          id="edit-user-status"
          name="status"
          defaultValue={user.status}
          className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
          required
        >
          <option value="ACTIVE">فعال</option>
          <option value="DISABLED">غیرفعال</option>
          <option value="PASSWORD_RESET_REQUIRED">نیازمند تعیین رمز</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-user-license">شماره پروانه وکیل</Label>
        <Input id="edit-user-license" name="licenseNumber" defaultValue={user.licenseNumber ?? ''} placeholder="فقط برای نقش وکیل" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="edit-user-education">تحصیلات وکیل</Label>
        <textarea
          id="edit-user-education"
          name="education"
          rows={3}
          defaultValue={(user.education ?? []).join('\n')}
          className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm leading-7"
          placeholder="هر مدرک در یک خط؛ فقط برای نقش وکیل"
        />
      </div>

      <div className="md:col-span-2 space-y-3">
        {state?.error && <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>}
        {state?.success && <p className="flex items-center gap-2 text-sm text-accent"><CheckCircle2 size={16} /> تغییرات ذخیره شد.</p>}
        <Button type="submit" disabled={pending}>
          {pending ? <span className="button-spinner" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {pending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
      </div>
    </form>
  );
}
