export default function Avatar({ initials, size = 88 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 bg-ink border-2 border-gold"
      style={{ width: size, height: size }}
    >
      <span className="font-display text-gold" style={{ fontSize: size * 0.32 }}>
        {initials}
      </span>
    </div>
  );
}
