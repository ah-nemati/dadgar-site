import { ExternalLink, MapPin } from 'lucide-react';
import type { Firm } from '@/types/content';

function hasCoordinates(firm: Firm): firm is Firm & { latitude: number; longitude: number } {
  return Number.isFinite(firm.latitude) && Number.isFinite(firm.longitude);
}

function mapQuery(firm: Firm): string {
  if (hasCoordinates(firm)) return `${firm.latitude},${firm.longitude}`;
  return [firm.address, firm.city, firm.region, 'ایران'].filter(Boolean).join('، ');
}

export function officeMapLink(firm: Firm): string {
  return firm.googleMapsUrl?.trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(firm))}`;
}

export function officeMapEmbed(firm: Firm): string {
  if (firm.googleMapsEmbedUrl?.trim()) return firm.googleMapsEmbedUrl.trim();

  const query = mapQuery(firm);
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${hasCoordinates(firm) ? 17 : 15}&output=embed`;
}

export default function OfficeMap({ firm, compact = false }: { firm: Firm; compact?: boolean }) {
  const coordinatesAvailable = hasCoordinates(firm);

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <div className={`relative w-full ${compact ? 'h-64' : 'h-[360px] md:h-[420px]'}`}>
        <iframe
          title={`نقشه دفتر ${firm.shortName}`}
          src={officeMapEmbed(firm)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center drop-shadow-lg">
            <span className="mb-1 whitespace-nowrap rounded-sm bg-ink px-2.5 py-1 text-xs font-bold text-parchment shadow-md">
              دفتر وکالت {firm.shortName}
            </span>
            <span className="flex size-11 items-center justify-center rounded-full border-4 border-white bg-primary text-primary-foreground shadow-xl">
              <MapPin size={23} fill="currentColor" />
            </span>
            <span className="-mt-1 block size-3 rotate-45 bg-primary shadow-sm" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2.5">
          <MapPin size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">نشانی دفتر</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{firm.address}</p>
            {coordinatesAvailable && (
              <p className="mt-1 text-[11px] text-muted-foreground" dir="ltr">
                {firm.latitude.toFixed(6)}, {firm.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>
        <a
          href={officeMapLink(firm)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          مسیریابی تا دفتر <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
