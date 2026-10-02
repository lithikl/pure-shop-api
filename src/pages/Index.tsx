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

      {/* Hero */}
      <section className="group relative h-[calc(100vh-56px)] w-full overflow-hidden bg-[#f7f5f0] text-foreground">
        {/* Warm atmospheric background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[12%] -top-[18%] h-[58vw] w-[58vw] rounded-full bg-white/90 blur-[100px] transition-transform duration-[1800ms] ease-out group-hover:translate-x-6 group-hover:translate-y-4" />
          <div className="absolute -right-[15%] top-[8%] h-[45vw] w-[45vw] rounded-full bg-[#e7dfd0]/75 blur-[110px] transition-transform duration-[2200ms] ease-out group-hover:-translate-x-8 group-hover:translate-y-5" />
          <div className="absolute -bottom-[28%] left-[25%] h-[52vw] w-[52vw] rounded-full bg-[#ece7dd]/80 blur-[120px] transition-transform duration-[2400ms] ease-out group-hover:translate-y-8" />
          <div className="absolute left-[42%] top-[20%] h-[20vw] w-[20vw] rounded-full bg-white/50 blur-[90px]" />
        </div>

        {/* Fine editorial grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '90px 90px',
            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />

        {/* Architectural frame */}
        <div className="pointer-events-none absolute inset-5 border border-foreground/[0.08] md:inset-8" />
        <div className="pointer-events-none absolute left-1/2 top-8 bottom-8 hidden w-px -translate-x-1/2 bg-foreground/[0.035] md:block" />

        {/* Oversized brand typography */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden text-center">
          <span className="whitespace-nowrap text-[clamp(5rem,18vw,16rem)] font-black leading-none tracking-[-0.09em] text-foreground/[0.045] transition-transform duration-[2000ms] ease-out group-hover:scale-[1.015]">
            NOIRKNULL
          </span>
        </div>

        {/* Editorial labels */}
        <div className="pointer-events-none absolute left-7 top-7 z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] opacity-60 md:left-10 md:top-10">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
          Independent / Streetwear / 2026
        </div>
        <div className="pointer-events-none absolute right-7 top-7 z-10 text-[9px] uppercase tracking-[0.28em] opacity-60 md:right-10 md:top-10">
          N° 01
        </div>
        <div className="pointer-events-none absolute bottom-8 left-7 z-10 hidden text-[9px] uppercase tracking-[0.28em] opacity-45 md:left-10 md:block">
          Objects / Attitude / Form
        </div>
        <div className="pointer-events-none absolute bottom-8 right-7 z-10 hidden text-[9px] uppercase tracking-[0.28em] opacity-45 md:right-10 md:block">
          Chennai / India
        </div>

        {/* Decorative rings */}
        <div className="pointer-events-none absolute -right-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-foreground/[0.055] md:h-96 md:w-96" />
        <div className="pointer-events-none absolute -right-12 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border border-foreground/[0.045] md:h-64 md:w-64" />
        <div className="pointer-events-none absolute -left-20 bottom-20 h-48 w-48 rounded-full border border-foreground/[0.045]" />

        {/* Featured Products Carousel */}
        <div className="relative z-[2] h-full">
          <FeaturedCarousel collectionHandle="frontpage" />
        </div>

        {/* CTA */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center md:bottom-10">
          <Link
            to="/products"
            className="border border-foreground bg-foreground px-9 py-3 text-[10px] uppercase tracking-[0.22em] text-background shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-transparent hover:text-foreground hover:shadow-none"
          >
            Shop All
          </Link>
        </div>

        {/* Fine grain */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-[0.028] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.8%27/%3E%3C/svg%3E")',
          }}
        />
      </section>

      {/* Collection CTA */}
      <section className="relative flex w-full justify-center overflow-hidden bg-[#f7f5f0] py-16">
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
