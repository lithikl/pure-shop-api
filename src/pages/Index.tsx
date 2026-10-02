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
      <section className="relative h-[calc(100vh-56px)] w-full overflow-hidden bg-[#f5f4f0] text-foreground">
        {/* Editorial background treatment */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[#dedbd3] blur-3xl" />
        </div>

        {/* Fine grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Oversized brand mark */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden text-center">
          <span className="whitespace-nowrap text-[clamp(5rem,18vw,16rem)] font-black tracking-[-0.08em] leading-none opacity-[0.045]">
            NOIRKNULL
          </span>
        </div>

        {/* Small editorial labels */}
        <div className="pointer-events-none absolute left-5 top-5 z-10 text-[9px] uppercase tracking-[0.28em] opacity-60 md:left-8 md:top-8">
          Independent / Streetwear / 2026
        </div>
        <div className="pointer-events-none absolute right-5 top-5 z-10 text-[9px] uppercase tracking-[0.28em] opacity-60 md:right-8 md:top-8">
          N° 01
        </div>

        {/* Featured Products Carousel */}
        <div className="relative z-[2] h-full">
          <FeaturedCarousel collectionHandle="frontpage" />
        </div>

        {/* CTA */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
          <Link
            to="/products"
            className="border border-foreground bg-foreground px-8 py-3 text-xs uppercase tracking-[0.18em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-transparent hover:text-foreground"
          >
            Shop All
          </Link>
        </div>

        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.8%27/%3E%3C/svg%3E")',
          }}
        />
      </section>

      {/* Collection CTA */}
      <section className="relative flex w-full justify-center overflow-hidden bg-[#f5f4f0] py-16">
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
