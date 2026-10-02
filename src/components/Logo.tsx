export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap text-[14px] font-semibold uppercase tracking-[0.18em] leading-none ${className}`}
      aria-label="NOIRKNULL"
    >
      NOIRKNULL
    </span>
  );
}
