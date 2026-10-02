export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-xl leading-none tracking-[0.18em] uppercase ${className}`}>
      Noirknull
    </span>
  );
}
