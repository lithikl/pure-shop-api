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
        <section className="noir-hero relative min-h-[calc(100svh-56px)] w-full overflow-hidden bg-[linear-gradient(120deg,#ddd3c4_0%,#ebe5dc_34%,#f7f5f1_68%,#ffffff_100%)]">
          <style>{`
            @keyframes noirShoeFloat {
              0%, 100% {
                transform: translate3d(0, 0, 0) rotate(-4deg) rotateY(-3deg);
              }
              25% {
                transform: translate3d(7px, -10px, 0) rotate(-1deg) rotateY(2deg);
              }
              50% {
                transform: translate3d(0, -22px, 0) rotate(3deg) rotateY(4deg);
              }
              75% {
                transform: translate3d(-7px, -10px, 0) rotate(0deg) rotateY(-2deg);
              }
            }

            @keyframes noirShadow {
              0%, 100% {
                transform: translateX(-50%) scaleX(.82);
                opacity: .16;
              }
              50% {
                transform: translateX(-50%) scaleX(1);
                opacity: .08;
              }
            }

            @keyframes noirGlow {
              0%, 100% { opacity: .42; transform: translate(-50%, -50%) scale(.92); }
              50% { opacity: .7; transform: translate(-50%, -50%) scale(1.08); }
            }

            @keyframes noirMarquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }

            @keyframes noirReveal {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .noir-shoe {
              animation: noirShoeFloat 5.5s cubic-bezier(.45,.05,.55,.95) infinite;
              transform-origin: center center;
              will-change: transform;
            }

            .noir-shadow {
              animation: noirShadow 5.5s ease-in-out infinite;
            }

            .noir-glow {
              animation: noirGlow 5.5s ease-in-out infinite;
            }

            .noir-marquee {
              animation: noirMarquee 28s linear infinite;
            }

            .noir-reveal {
              animation: noirReveal .9s cubic-bezier(.22,1,.36,1) both;
            }

            @media (prefers-reduced-motion: reduce) {
              .noir-shoe,
              .noir-shadow,
              .noir-glow,
              .noir-marquee,
              .noir-reveal {
                animation: none !important;
              }
            }
          `}</style>

          {/* Soft beige-to-white studio atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[18vw] -top-[18vw] h-[58vw] w-[58vw] rounded-full bg-white/80 blur-[100px]" />
            <div className="absolute -right-[15vw] top-[4%] h-[52vw] w-[52vw] rounded-full bg-[#ded4c5]/60 blur-[115px]" />
            <div className="noir-glow absolute left-1/2 top-[47%] h-[38vw] w-[38vw] rounded-full bg-white blur-[90px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.7),transparent_43%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.22),transparent_40%,rgba(210,199,184,.18)_100%)]" />
            <div className="absolute inset-5 border border-black/[0.07] md:inset-7" />
          </div>

          {/* Top editorial navigation information */}
          <div className="absolute left-6 right-6 top-6 z-30 flex items-center justify-between text-[8px] uppercase tracking-[0.28em] text-black/55 md:left-10 md:right-10 md:top-8">
            <span>NOIRKNULL / 001</span>
            <span className="hidden md:block">Free Shipping On Orders Over ₹2000</span>
            <span>Chennai / India</span>
          </div>

          {/* Small side labels like the reference */}
          <div className="absolute left-7 top-[38%] z-20 hidden max-w-[150px] md:block">
            <div className="mb-3 h-px w-7 bg-black/60" />
            <p className="text-[8px] uppercase tracking-[0.28em] text-black/65">Air Jordan 1</p>
            <p className="mt-2 text-[8px] uppercase leading-[1.7] tracking-[0.18em] text-black/45">
              Iconic style
              <br />
              Timeless design
              <br />
              Always relevant
            </p>
          </div>

          <div className="absolute right-7 top-[38%] z-20 hidden max-w-[150px] text-right md:block">
            <div className="mb-3 ml-auto h-px w-7 bg-black/60" />
            <p className="text-[8px] uppercase tracking-[0.28em] text-black/65">New Collection</p>
            <p className="mt-2 text-[8px] uppercase leading-[1.7] tracking-[0.18em] text-black/45">
              Sneakers
              <br />
              Clothing
              <br />
              Accessories
            </p>
          </div>

          {/* Floating sneaker */}
          <div className="absolute left-1/2 top-[42%] z-10 w-[min(82vw,720px)] -translate-x-1/2 -translate-y-1/2 md:top-[43%] md:w-[min(58vw,760px)]">
            <div className="pointer-events-none absolute left-1/2 top-[74%] h-[11%] w-[63%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-[28px] noir-shadow" />
            <img
              src={heroShoe}
              alt="NOIRKNULL featured sneaker"
              className="noir-shoe relative z-10 mx-auto block h-auto w-full select-none object-contain drop-shadow-[0_38px_30px_rgba(0,0,0,0.22)]"
              draggable={false}
              loading="eager"
            />
          </div>

          {/* NOIRKNULL wording BELOW the shoe */}
          <div className="noir-reveal absolute left-1/2 top-[63%] z-20 w-full -translate-x-1/2 text-center">
            <h1 className="whitespace-nowrap text-[clamp(3.4rem,10.5vw,10rem)] font-black leading-[.78] tracking-[-0.085em] text-[#171513]">
              NOIRKNULL
            </h1>
            <p className="mt-5 text-[8px] uppercase tracking-[0.7em] text-black/55 md:text-[9px]">
              Objects / Attitude / Form
            </p>
          </div>

          {/* CTA */}
          <div className="absolute bottom-[10%] left-1/2 z-30 -translate-x-1/2 md:bottom-[8%]">
            <Link
              to="/products"
              className="group inline-flex min-w-[175px] items-center justify-center gap-5 border border-[#171513] bg-[#171513] px-9 py-3.5 text-[9px] font-medium uppercase tracking-[0.3em] text-white transition-all duration-500 hover:-translate-y-1 hover:bg-transparent hover:text-[#171513]"
            >
              Shop All
              <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </Link>
          </div>

          {/* Bottom reference-style ticker */}
          <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden border-t border-black/[0.08] bg-white/25 py-2 backdrop-blur-sm">
            <div className="noir-marquee flex w-[200%] whitespace-nowrap text-[7px] uppercase tracking-[0.62em] text-black/45">
              <span className="w-1/2 text-center">
                NOIRKNULL — COLLECTION 001 — STREETWEAR / SNEAKERS / OBJECTS — NOIRKNULL — COLLECTION 001 —
              </span>
              <span className="w-1/2 text-center">
                NOIRKNULL — COLLECTION 001 — STREETWEAR / SNEAKERS / OBJECTS — NOIRKNULL — COLLECTION 001 —
              </span>
            </div>
          </div>
        </section>

        {/* Real store catalog remains below the hero */}
        <section className="relative overflow-hidden bg-[#faf9f6] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto mb-10 flex max-w-[1400px] items-end justify-between border-b border-black/10 pb-5">
            <div>
              <p className="mb-2 text-[8px] uppercase tracking-[0.3em] text-black/45">Collection 001</p>
              <h2 className="text-2xl font-medium uppercase tracking-[-0.04em] md:text-4xl">Latest Objects</h2>
            </div>
            <Link
              to="/products"
              className="hidden text-[9px] uppercase tracking-[0.25em] underline underline-offset-4 md:block"
            >
              View all
            </Link>
          </div>
          <FeaturedCarousel collectionHandle="frontpage" />
        </section>

        <section className="relative flex w-full justify-center overflow-hidden border-t border-black/10 bg-[#f1ede6] py-16">
          <div className="pointer-events-none absolute top-3 flex w-[200%] whitespace-nowrap text-[7px] uppercase tracking-[0.7em] text-black/[0.22]">
            <span className="w-1/2 text-center">NOIRKNULL — COLLECTION 001 — NOIRKNULL — COLLECTION 001 — </span>
            <span className="w-1/2 text-center">NOIRKNULL — COLLECTION 001 — NOIRKNULL — COLLECTION 001 — </span>
          </div>
          <Link
            to="/collections"
            className="group relative mt-2 overflow-hidden border border-[#171513] px-10 py-3 text-xs uppercase tracking-[0.18em] text-[#171513] transition-all duration-500 hover:-translate-y-1 hover:bg-[#171513] hover:text-white"
          >
            <span>View Collection</span>
            <span className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
