import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Seal from '@/components/Seal';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="bg-parchment flex items-center" style={{ minHeight: '70vh' }}>
      <div className="max-w-md mx-auto px-6 py-20 w-full text-center">
        <div className="flex justify-center mb-6">
          <Seal size={64} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">صفحه مورد نظر پیدا نشد</h1>
        <p className="text-muted-foreground leading-7 mb-8">ممکن است این صفحه جابه‌جا شده یا نشانی وارد شده اشتباه باشد.</p>
        <Button asChild>
          <Link href="/">
            بازگشت به صفحه اصلی <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
