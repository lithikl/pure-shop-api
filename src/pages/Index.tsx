import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import FeaturedCarousel from '@/components/FeaturedCarousel';

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>NOIRKNULL — Streetwear</title>
        <meta
          name="description"
          content="NOIRKNULL — contemporary streetwear with a clean, editorial edge."
        />
      </Helmet>

      <section className="group relative h-[calc(100vh-56px)] w-full overflow-hidden bg-[#f3f1ec] text-foreground">
        {/* Layered art-directed atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[42vw] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[80px] transition-transform duration-[1800ms] ease-out group-hover:scale-110" />
          <div className="absolute -left-[14vw] -top-[18vw] h-[55vw] w-[55vw] rounded-full bg-[#fffdfa] blur-[95px] transition-transform duration-[2400ms] ease-out group-hover:translate-x-8 group-hover:translate-y-8" />
          <div className="absolute -right-[16vw] -top-[4vw] h-[48vw] w-[48vw] rounded-full bg-[#ddd5c7]/75 blur-[100px] transition-transform duration-[2600ms] ease-out group-hover:-translate-x-10 group-hover:translate-y-8" />
          <div className="absolute -bottom-[25vw] left-[16vw] h-[55vw] w-[55vw] rounded-full bg-[#e6e0d6]/80 blur-[115px] transition-transform duration-[2800ms] ease-out group-hover:translate-y-10" />

          {/* Spotlight */}
          <div className="absolute left-1/2 top-[46%] h-[30vw] w-[30vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-[70px]" />

          {/* Editorial grid */}
          <div
            className="absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '72px 72px',
              maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
            }}
          />

          {/* Diagonal construction lines */}
          <div className="absolute -left-[10%] top-[18%] h-px w-[120%] rotate-[14deg] bg-foreground/[0.07]" />
          <div className="absolute -left-[10%] top-[72%] h-px w-[120%] -rotate-[9deg] bg-foreground/[0.055]" />

          {/* Geometric rings */}
          <div className="absolute -right-[11vw] top-[20%] h-[34vw] w-[34vw] rounded-full border border-foreground/[0.08] transition-transform duration-[3000ms] ease-out group-hover:rotate-12" />
          <div className="absolute -right-[3vw] top-[28%] h-[20vw] w-[20vw] rounded-full border border-foreground/[0.055] transition-transform duration-[2400ms] ease-out group-hover:-rotate-12" />
          <div className="absolute -left-[9vw] bottom-[3%] h-[22vw] w-[22vw] rounded-full border border-foreground/[0.06]" />

          {/* Architectural frame */}
          <div className="absolute inset-5 border border-foreground/[0.08] md:inset-8" />
          <div className="absolute left-1/2 top-8 bottom-8 hidden w-px -translate-x-1/2 bg-foreground/[0.045] md:block" />
          <div className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/20 bg-[#f3f1ec] md:block" />
        </div>

        {/* Giant brand layer */}
        <div className="pointer-events-none absolute inset-x-0 top-[42%] z-[1] -translate-y-1/2 overflow-hidden text-center select-none">
          <div className="whitespace-nowrap text-[clamp(5rem,17vw,15rem)] font-black leading-none tracking-[-0.095em] text-foreground/[0.055] transition-transform duration-[2200ms] ease-out group-hover:scale-[1.025]">
            NOIRKNULL
          </div>
          <div className="mt-[-1.5vw] text-[8px] uppercase tracking-[0.65em] text-foreground/[0.25]">
            Objects / Attitude / Form
          </div>
        </div>

        {/* Floating micro-elements */}
        <div className="pointer-events-none absolute left-8 top-8 z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] opacity-65 md:left-11 md:top-10">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
          Independent / Streetwear / 2026
        </div>
        <div className="pointer-events-none absolute right-8 top-8 z-10 text-[9px] uppercase tracking-[0.3em] opacity-65 md:right-11 md:top-10">
          N° 01
        </div>
        <div className="pointer-events-none absolute bottom-8 left-8 z-10 hidden text-[9px] uppercase tracking-[0.3em] opacity-45 md:left-11 md:block">
          Chennai / India
        </div>
        <div className="pointer-events-none absolute bottom-8 right-8 z-10 hidden text-[9px] uppercase tracking-[0.3em] opacity-45 md:right-11 md:block">
          Studio 001
        </div>

        {/* Product carousel remains the hero focus */}
        <div className="relative z-[3] h-full">
          <FeaturedCarousel collectionHandle="frontpage" />
        </div>

        {/* CTA */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center md:bottom-10">
          <Link
            to="/products"
            className="group/btn relative overflow-hidden border border-foreground bg-foreground px-10 py-3.5 text-[10px] uppercase tracking-[0.24em] text-background shadow-[0_18px_45px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:bg-transparent hover:text-foreground hover:shadow-none"
          >
            <span className="relative z-10">Shop All</span>
            <span className="absolute inset-0 -translate-x-full bg-background transition-transform duration-500 group-hover/btn:translate-x-0" />
          </Link>
        </div>

        {/* Fine grain */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.9%27/%3E%3C/svg%3E")',
          }}
        />
      </section>

      <section className="relative flex w-full justify-center overflow-hidden bg-[#f3f1ec] py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-foreground/10" />
        <Link
          to="/collections"
          className="group relative border border-foreground px-10 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
        >
          <span>View Collection</span>
          <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </section>
    </Layout>
  );
}
