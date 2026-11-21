import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import heroShoe from '@/assets/shoe-black.png';

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

      <main className="bg-[#faf9f6] text-[#171513]">
        {/* HERO: one column in normal flow, so nothing can collide on short or narrow screens */}
        <section className="relative isolate flex min-h-[calc(100svh-56px)] flex-col overflow-hidden bg-[linear-gradient(135deg,#ddd2c2_0%,#eee9e1_42%,#faf9f6_75%,#fff_100%)]">
          <style>{`
            @keyframes shoeFloat {
              0%,100% { transform: translate3d(0,0,0) rotate(-2deg); }
              50% { transform: translate3d(0,-14px,0) rotate(2deg); }
            }
            @keyframes shoeShadow {
              0%,100% { transform: translateX(-50%) scale(.85); opacity:.18; }
              50% { transform: translateX(-50%) scale(1); opacity:.09; }
            }
            @keyframes heroIn {
              from { opacity:0; transform:translateY(18px); }
              to { opacity:1; transform:translateY(0); }
            }
            .nk-shoe { animation: shoeFloat 5.5s ease-in-out infinite; will-change: transform; }
            .nk-shadow { animation: shoeShadow 5.5s ease-in-out infinite; }
            .nk-wordmark { animation: heroIn .9s cubic-bezier(.22,1,.36,1) .1s both; }
            @media (prefers-reduced-motion:reduce) {
              .nk-shoe,.nk-shadow,.nk-wordmark { animation:none!important; }
            }
          `}</style>

          {/* Soft background light */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-[15vw] -top-[20vw] h-[55vw] w-[55vw] rounded-full bg-white/70 blur-[100px]" />
            <div className="absolute -right-[18vw] top-[8%] h-[50vw] w-[50vw] rounded-full bg-[#d8cdbd]/45 blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,.72),transparent_48%)]" />
          </div>

          {/* Top strip (sits in flow, so it never overlaps the shoe) */}
          <div className="flex items-center justify-between px-6 pt-5 text-[11px] uppercase tracking-[.18em] text-black/55 md:px-10">
            <span>NOIRKNULL 001</span>
            <span className="hidden md:block">Free shipping over ₹2000</span>
            <span>Chennai, India</span>
          </div>

          {/* Shoe + wordmark + CTA, stacked and centered */}
          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-6 text-center md:pb-28">
            <div className="relative z-10 w-[min(78vw,480px)] md:w-[min(38vw,540px)]">
              <div
                aria-hidden
                className="nk-shadow pointer-events-none absolute left-1/2 top-[80%] h-8 w-[68%] rounded-full bg-black/25 blur-2xl"
              />
              <img
                src={heroShoe}
                alt="Air Jordan 1 sneaker from the NOIRKNULL first collection"
                className="nk-shoe relative z-10 mx-auto block w-full object-contain drop-shadow-[0_28px_22px_rgba(0,0,0,.18)]"
                draggable={false}
                loading="eager"
                fetchPriority="high"
              />
            </div>

            {/* Wordmark tucks under the shoe so the two read as one lockup */}
            <h1 className="nk-wordmark -mt-[5vw] text-[clamp(2.75rem,12vw,9rem)] font-black leading-none tracking-[-.07em] text-[#181613] md:-mt-[3vw]">
              NOIRKNULL
            </h1>
            <p className="mt-4 text-xs tracking-[.4em] text-black/60 md:text-sm">
              Objects. Attitude. Form.
            </p>

            <Link
              to="/products"
              className="mt-9 inline-flex min-w-[180px] items-center justify-center border border-[#171513] bg-[#171513] px-9 py-4 text-xs uppercase tracking-[.25em] text-white transition-colors duration-300 hover:bg-transparent hover:text-[#171513] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171513]"
            >
              Shop all
            </Link>
          </div>

          {/* Corner captions, desktop only; the CTA is centered so they can't touch it */}
          <div className="absolute bottom-8 left-10 hidden text-left md:block">
            <p className="text-xs uppercase tracking-[.16em] text-black/65">Air Jordan 1</p>
            <p className="mt-1 text-[11px] tracking-[.12em] text-black/45">Collection 001</p>
          </div>
          <div className="absolute bottom-8 right-10 hidden text-right md:block">
            <p className="text-xs uppercase tracking-[.16em] text-black/65">New collection</p>
            <p className="mt-1 text-[11px] tracking-[.12em] text-black/45">The first drop</p>
          </div>
        </section>

        {/* LATEST */}
        <section className="bg-[#faf9f6] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto mb-10 flex max-w-[1400px] items-end justify-between border-b border-black/10 pb-5">
            <h2 className="text-2xl font-medium uppercase tracking-[-.03em] md:text-4xl">
              Latest objects
            </h2>
            <Link
              to="/products"
              className="text-xs uppercase tracking-[.2em] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171513]"
            >
              View all
            </Link>
          </div>
          <FeaturedCarousel collectionHandle="frontpage" />
        </section>

        {/* CLOSING: one clear next step, distinct from the Shop all button above */}
        <section className="border-t border-black/10 bg-[#f1ede6] px-6 py-20 text-center">
          <p className="mx-auto max-w-md text-lg leading-relaxed text-black/70">
            Looking for something specific? Browse by collection.
          </p>
          <Link
            to="/collections"
            className="mt-8 inline-flex border border-[#171513] px-10 py-4 text-xs uppercase tracking-[.2em] transition-colors duration-300 hover:bg-[#171513] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171513]"
          >
            Browse collections
          </Link>
        </section>
      </main>
    </Layout>
  );
}
