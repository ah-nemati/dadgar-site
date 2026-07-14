import Seal from './Seal';
import Eyebrow from './Eyebrow';

export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="bg-ink relative overflow-hidden">
      <div
        className="absolute"
        style={{ left: '-10%', top: '-30%', opacity: 0.06 }}
        aria-hidden="true"
      >
        <Seal size={420} tone="cream" />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
        <Eyebrow dark>{eyebrow}</Eyebrow>
        <h1 className="text-3xl md:text-5xl font-bold text-parchment mb-4">{title}</h1>
        {description && (
          <p className="text-parchment/80 max-w-2xl leading-8">{description}</p>
        )}
      </div>
    </section>
  );
}
