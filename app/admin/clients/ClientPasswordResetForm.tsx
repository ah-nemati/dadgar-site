'use client';

import { useActionState, useState } from 'react';
import { Check, Copy, ExternalLink, KeyRound, Link2 } from 'lucide-react';
import { createUserPasswordResetLinkAction } from './actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ClientPasswordResetForm({ clientId }: { clientId: string }) {
  const action = createUserPasswordResetLinkAction.bind(null, clientId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [copied, setCopied] = useState(false);

  async function copyResetUrl() {
    if (!state?.resetUrl) return;

    try {
      await navigator.clipboard.writeText(state.resetUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <details className="dashboard-card mt-6 group">
      <summary className="cursor-pointer list-none p-4 md:p-5 flex items-center justify-between gap-3 font-bold">
        <span className="flex items-center gap-2"><KeyRound size={18} /> بازنشانی رمز کاربر</span>
        <span className="text-xs font-normal text-muted-foreground group-open:hidden">بدون سرویس ایمیل</span>
      </summary>
      <form action={formAction} className="border-t border-border p-4 md:p-5 space-y-4">
        <p className="text-sm leading-7 text-muted-foreground">
          پس از تأیید هویت کاربر، یک لینک یک‌بارمصرف بسازید و آن را خصوصی برای او بفرستید. با ساخت لینک، رمز قبلی و همه نشست‌های کاربر از دسترس خارج می‌شوند. لینک پس از ۳۰ دقیقه منقضی می‌شود و ساخت لینک تازه، لینک قبلی را باطل می‌کند.
        </p>

        {state?.error && (
          <Alert variant="destructive">
            <AlertDescription className="col-start-1">{state.error}</AlertDescription>
          </Alert>
        )}

        {state?.resetUrl && (
          <Alert variant="accent">
            <Link2 size={17} />
            <AlertDescription className="space-y-3">
              <p>لینک آماده است. آن را در گروه عمومی یا بخش یادداشت‌ها قرار ندهید.</p>
              <Input
                value={state.resetUrl}
                readOnly
                dir="ltr"
                aria-label="لینک بازنشانی رمز"
                onFocus={(event) => event.currentTarget.select()}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={copyResetUrl}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'کپی شد' : 'کپی لینک'}
                </Button>
                <Button type="button" size="sm" variant="outline" asChild>
                  <a href={state.resetUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={15} /> آزمایش لینک
                  </a>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? (
            <><span className="button-spinner" />در حال ساخت...</>
          ) : (
            <><KeyRound size={16} />ساخت لینک بازنشانی</>
          )}
        </Button>
      </form>
    </details>
  );
}
