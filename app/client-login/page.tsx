import type { Metadata } from 'next';
import Seal from '@/components/Seal';
import ClientLoginForm from '@/components/ClientLoginForm';
import { getFirm } from '@/lib/content/firm';

export const metadata: Metadata = {
  title: 'ورود موکلین',
  description: 'ورود موکلین به پرتال اختصاصی دفتر وکالت مجید سواری.',
};

export default async function ClientLoginPage() {
  const firm = await getFirm();

  return (
    <section className="bg-parchment flex items-center" style={{ minHeight: '70vh' }}>
      <div className="max-w-md mx-auto px-6 py-20 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Seal size={52} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">ورود موکلین</h1>
          <p className="text-sm text-muted-foreground">این بخش صرفاً برای موکلین فعال {firm.name} است.</p>
        </div>
        <ClientLoginForm />
      </div>
    </section>
  );
}
