import Seal from '@/components/Seal';
import ClientLoginForm from '@/components/ClientLoginForm';
import { FIRM } from '@/data/firm';

export const metadata = {
  title: 'ورود موکلین',
  description: 'ورود موکلین به پرتال اختصاصی موسسه حقوقی دادگر.',
};

export default function ClientLoginPage() {
  return (
    <section className="bg-parchment flex items-center" style={{ minHeight: '70vh' }}>
      <div className="max-w-md mx-auto px-6 py-20 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Seal size={52} />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">ورود موکلین</h1>
          <p className="text-sm text-muted">این بخش صرفاً برای موکلین فعال {FIRM.name} است.</p>
        </div>
        <ClientLoginForm />
      </div>
    </section>
  );
}
