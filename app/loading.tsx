
import Seal from '@/components/Seal';

export default function Loading() {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-6" role="status" aria-label="در حال بارگذاری">
      <div className="bg-card border border-border rounded-lg px-8 py-6 shadow-sm flex items-center gap-4">
        <div className="navigation-loader__seal"><Seal size={42} /></div>
        <div>
          <p className="font-bold text-foreground">در حال آماده‌سازی صفحه</p>
          <p className="text-sm text-muted-foreground mt-1">اطلاعات در حال دریافت است...</p>
        </div>
      </div>
    </div>
  );
}
