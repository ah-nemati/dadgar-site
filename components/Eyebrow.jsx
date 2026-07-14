export default function Eyebrow({ children, dark = false }) {
  return (
    <div
      className={`flex items-center gap-2 mb-4 font-semibold text-sm tracking-wide ${
        dark ? 'text-gold-light' : 'text-teal'
      }`}
    >
      <span className={`inline-block w-6 h-px ${dark ? 'bg-gold-light' : 'bg-teal'}`}></span>
      {children}
    </div>
  );
}
