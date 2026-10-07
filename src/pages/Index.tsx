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
        <section className="relative min-h-[calc(100svh-56px)] overflow-hidden bg-[linear-gradient(135deg,#ddd2c2_0%,#eee9e1_42%,#faf9f6_75%,#fff_100%)]">
          <style>{`
            @keyframes shoeFloat {
              0%,100% { transform: translate3d(0,0,0) rotate(-2deg); }
              50% { transform: translate3d(0,-18px,0) rotate(2deg); }
            }
            @keyframes shoeShadow {
              0%,100% { transform:translateX(-50%) scale(.82); opacity:.15; }
              50% { transform:translateX(-50%) scale(1); opacity:.07; }
            }
            @keyframes heroIn {
              from { opacity:0; transform:translateY(22px); }
              to { opacity:1; transform:translateY(0); }
            }
            @media (prefers-reduced-motion:reduce) {
              .nk-shoe,.nk-shadow,.nk-wordmark { animation:none!important; }
            }
            .nk-shoe {
              animation: shoeFloat 5.5s ease-in-out infinite;
              will-change: transform;
            }
            .nk-shadow {
              animation: shoeShadow 5.5s ease-in-out infinite;
            }
            .nk-wordmark {
              animation: heroIn .9s cubic-bezier(.22,1,.36,1) .15s both;
            }
          `}</style>

          {/* Quiet luxury background — no distracting graphics */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[15vw] -top-[20vw] h-[55vw] w-[55vw] rounded-full bg-white/70 blur-[100px]" />
            <div className="absolute -right-[18vw] top-[8%] h-[50vw] w-[50vw] rounded-full bg-[#d8cdbd]/45 blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,.72),transparent_48%)]" />
          </div>

          {/* Minimal announcement */}
          <div className="absolute left-6 right-6 top-5 z-20 flex justify-between text-[8px] uppercase tracking-[.28em] text-black/45 md:left-10 md:right-10">
            <span>NOIRKNULL / 001</span>
            <span className="hidden md:block">Free Shipping On Orders Over ₹2000</span>
            <span>Chennai / India</span>
          </div>

          {/* Floating sneaker */}
          <div className="absolute left-1/2 top-[38%] z-10 w-[min(76vw,520px)] -translate-x-1/2 -translate-y-1/2 md:top-[39%] md:w-[min(42vw,560px)]">
            <div className="nk-shadow pointer-events-none absolute left-1/2 top-[76%] h-8 w-[68%] -translate-x-1/2 rounded-full bg-black/20 blur-2xl" />
            <img
              src={heroShoe}
              alt="Featured NOIRKNULL sneaker"
              className="nk-shoe relative z-10 mx-auto block w-full object-contain drop-shadow-[0_30px_24px_rgba(0,0,0,.18)]"
              draggable={false}
              loading="eager"
            />
          </div>

          {/* Brand directly underneath the shoe */}
          <div className="nk-wordmark absolute left-1/2 top-[57%] z-20 w-full -translate-x-1/2 text-center">
            <h1 className="text-[clamp(3.4rem,9.5vw,9rem)] font-black leading-none tracking-[-.085em] text-[#181613]">
              NOIRKNULL
            </h1>
            <p className="mt-4 text-[8px] uppercase tracking-[.65em] text-black/45 md:text-[9px]">
              Objects / Attitude / Form
            </p>
          </div>

          {/* Simple editorial labels */}
          <div className="absolute bottom-[17%] left-6 z-20 hidden md:block">
            <p className="text-[8px] uppercase tracking-[.28em] text-black/55">Air Jordan 1</p>
            <p className="mt-2 text-[7px] uppercase tracking-[.22em] text-black/35">Collection 001</p>
          </div>

          <div className="absolute bottom-[17%] right-6 z-20 hidden text-right md:block">
            <p className="text-[8px] uppercase tracking-[.28em] text-black/55">New Collection</p>
            <p className="mt-2 text-[7px] uppercase tracking-[.22em] text-black/35">Explore the drop</p>
          </div>

          <div className="absolute bottom-9 left-1/2 z-30 -translate-x-1/2">
            <Link
              to="/products"
              className="inline-flex min-w-[160px] items-center justify-center gap-4 border border-[#171513] bg-[#171513] px-8 py-3.5 text-[9px] uppercase tracking-[.3em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-transparent hover:text-[#171513]"
            >
              Shop All <span>↗</span>
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#faf9f6] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto mb-10 flex max-w-[1400px] items-end justify-between border-b border-black/10 pb-5">
            <div>
              <p className="mb-2 text-[8px] uppercase tracking-[.3em] text-black/45">Collection 001</p>
              <h2 className="text-2xl font-medium uppercase tracking-[-.04em] md:text-4xl">Latest Objects</h2>
            </div>
            <Link to="/products" className="hidden text-[9px] uppercase tracking-[.25em] underline underline-offset-4 md:block">
              View all
            </Link>
          </div>
          <FeaturedCarousel collectionHandle="frontpage" />
        </section>

        <section className="flex justify-center border-t border-black/10 bg-[#f1ede6] py-16">
          <Link
            to="/collections"
            className="border border-[#171513] px-10 py-3 text-xs uppercase tracking-[.18em] transition-all duration-300 hover:bg-[#171513] hover:text-white"
          >
            View Collection <span className="ml-3">→</span>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
