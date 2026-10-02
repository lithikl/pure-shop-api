import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  link?: { to: string; label: string };
}

export default function SectionHeading({ index, eyebrow, title, link }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-t border-border pt-6">
      <div>
        <p className="eyebrow mb-5">
          <span className="text-foreground">{index}</span>
          <span className="mx-3">—</span>
          {eyebrow}
        </p>
        <h2 className="font-display normal-case text-4xl md:text-6xl leading-[0.95] tracking-tight">{title}</h2>
      </div>
      {link && (
        <Link to={link.to} className="link-underline eyebrow text-foreground self-start md:self-auto">
          {link.label} →
        </Link>
      )}
    </div>
  );
}
