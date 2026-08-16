import { SERVICE_FEES, type ServiceFeeItem } from '@/data/service-fees';
import { getContentOverride } from '@/lib/content/overrides';

export async function getServiceFees(): Promise<ServiceFeeItem[]> {
  return getContentOverride<ServiceFeeItem[]>('service_fees', SERVICE_FEES);
}
