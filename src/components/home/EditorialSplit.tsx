import { Link } from 'react-router-dom';
import editorialImage from '@/assets/noirknull-editorial.jpg';
import Reveal from './Reveal';

export default function EditorialSplit() {
  return (
    <section className="grid md:grid-cols-2 border-y border-border">
      <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[90vh] overflow-hidden">
        <img
          src={editorialImage}
          alt="Silver signet ring and Cuban chain on black stone"
          loading="lazy"
          width={1200}
          height={1504}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between page-padding py-16 md:py-20 md:px-16 lg:px-24">
        <p className="eyebrow">02 — Journal</p>
        <Reveal className="my-16 md:my-0">
          <h2 className="font-display normal-case text-4xl md:text-6xl leading-[0.95] tracking-tight mb-8">
            Weight of <span className="italic font-light">silver</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-md mb-10">
            Each link is cast, filed and polished by hand. The signet is left blank — a surface for whatever you
            choose to carry. Placeholder copy for the first NOIRKNULL story.
          </p>
          <Link to="/collections/jewelry" className="link-underline eyebrow text-foreground">
            Explore jewelry →
          </Link>
        </Reveal>
        <p className="eyebrow">925 Sterling · Hand finished</p>
      </div>
    </section>
  );
}
