interface AvatarProps {
  initials: string;
  size?: number;
}

export default function Avatar({ initials, size = 88 }: AvatarProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 bg-sky-100 border-2 border-sky-300"
      style={{ width: size, height: size }}
    >
      <span className="font-display text-sky-700" style={{ fontSize: size * 0.32 }}>
        {initials}
      </span>
    </div>
  );
}
