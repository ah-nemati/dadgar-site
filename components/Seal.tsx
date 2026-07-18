import { Scale } from 'lucide-react';

// Math.cos/Math.sin can return a last-bit-different double on the server's vs the
// browser's math library for the same input. Rounding before it becomes a string
// keeps SSR and client hydration byte-for-byte identical.
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

interface SealProps {
  size?: number;
  tone?: 'gold' | 'cream';
  className?: string;
}

export default function Seal({ size = 56, tone = 'gold', className = '' }: SealProps) {
  const color = tone === 'gold' ? '#B08D45' : '#F6F1E6';
  const ticks = Array.from({ length: 24 });

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="50" r="37" fill="none" stroke={color} strokeWidth="1" />
        {ticks.map((_, i) => {
          const a = (i * Math.PI * 2) / ticks.length;
          const x1 = round2(50 + 39 * Math.cos(a));
          const y1 = round2(50 + 39 * Math.sin(a));
          const x2 = round2(50 + 44 * Math.cos(a));
          const y2 = round2(50 + 44 * Math.sin(a));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />;
        })}
      </svg>
      <Scale size={size * 0.38} color={color} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}
