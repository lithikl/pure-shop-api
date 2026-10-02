import { Link } from 'react-router-dom';
import heroImage from '@/assets/noirknull-hero.jpg';

export default function HomeHero() {
  return (
    <section className="relative h-[calc(100svh-56px)] min-h-[560px] w-full overflow-hidden bg-background">
      <img
        src={heroImage}
        alt="NOIRKNULL campaign — figure in tailored black against concrete"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] animate-hero-zoom"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between page-padding py-8 md:py-12">
        <div className="flex justify-between eyebrow animate-fade-up">
          <span>Collection 01</span>
          <span className="hidden sm:inline">Autumn / Winter 2026</span>
        </div>

        <div className="max-w-4xl">
          <p className="eyebrow mb-6 animate-fade-up [animation-delay:150ms]">Silence, made to be worn</p>
          <h1 className="font-display normal-case text-[18vw] sm:text-[14vw] lg:text-[11rem] leading-[0.82] tracking-[-0.04em] animate-fade-up [animation-delay:250ms]">
            Noir<span className="italic font-light">knull</span>
          </h1>
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6 animate-fade-up [animation-delay:400ms]">
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-12 px-10 text-[11px] uppercase tracking-[0.25em] bg-foreground text-background hover:bg-foreground/85 transition-colors"
            >
              Shop the collection
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Footwear and silver, reduced to essentials. Designed to disappear into the dark.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
