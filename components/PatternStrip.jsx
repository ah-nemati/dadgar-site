export default function PatternStrip({ id, color = '#B08D45' }) {
  return (
    <svg
      viewBox="0 0 240 10"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 10, display: 'block' }}
      aria-hidden="true"
    >
      <pattern id={id} width="20" height="10" patternUnits="userSpaceOnUse">
        <path d="M0 10 L10 0 L20 10" fill="none" stroke={color} strokeWidth="1.25" />
      </pattern>
      <rect width="240" height="10" fill={`url(#${id})`} />
    </svg>
  );
}
