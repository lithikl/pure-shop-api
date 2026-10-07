import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import FeaturedCarousel from '@/components/FeaturedCarousel';

const HERO_SHOE =
  'https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8a068559-3d41-4442-a0c0-792b7ffef5cb/AIR+JORDAN+1+RETRO+HIGH+OG.png';

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
        <section className="noir-hero group relative min-h-[calc(100svh-56px)] w-full overflow-hidden bg-[linear-gradient(115deg,#ded5c7_0%,#eee9e1_38%,#faf9f6_72%,#ffffff_100%)]">
          <style>{`
            @keyframes nk-shoe-float {
              0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
              50% { transform: translate3d(0, -20px, 0) rotate(2deg); }
            }
            @keyframes nk-glow {
              0%, 100% { transform: translate(-50%, -50%) scale(.94); opacity: .55; }
              50% { transform: translate(-50%, -50%) scale(1.08); opacity: .8; }
            }
            @keyframes nk-marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @keyframes nk-reveal {
              from { opacity: 0; transform: translateY(18px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .nk-shoe-float { animation: nk-shoe-float 5.5s ease-in-out infinite; }
            .nk-glow { animation: nk-glow 5.5s ease-in-out infinite; }
            .nk-marquee { animation: nk-marquee 30s linear infinite; }
            .nk-reveal { animation: nk-reveal .9s cubic-bezier(.22,1,.36,1) both; }
            @media (prefers-reduced-motion: reduce) {
              .nk-shoe-float,.nk-glow,.nk-marquee,.nk-reveal { animation:none !important; }
            }
          `}</style>

          {/* Soft studio-light background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[16vw] -top-[18vw] h-[58vw] w-[58vw] rounded-full bg-white/75 blur-[90px]" />
            <div className="absolute -right-[14vw] top-[8%] h-[48vw] w-[48vw] rounded-full bg-[#e1d8ca]/70 blur-[110px]" />
            <div className="absolute left-1/2 top-[54%] h-[34vw] w-[34vw] rounded-full bg-white/80 blur-[90px] nk-glow" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.6),transparent_42%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.22),transparent_32%,rgba(220,211,199,.2)_100%)]" />

            {/* Very subtle editorial frame */}
            <div className="absolute inset-4 border border-black/[0.07] md:inset-7" />
            <div className="absolute left-1/2 top-7 bottom-7 hidden w-px bg-black/[0.045] md:block" />
          </div>

          {/* Minimal top information */}
          <div className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between text-[8px] uppercase tracking-[0.28em] text-black/55 md:left-10 md:right-10 md:top-9">
            <span>NOIRKNULL / 001</span>
            <span className="hidden md:block">Free shipping on selected orders</span>
            <span>Chennai / India</span>
          </div>

          {/* Large NOIRKNULL wordmark */}
          <div className="pointer-events-none absolute inset-x-0 top-[34%] z-[1] -translate-y-1/2 select-none overflow-hidden">
            <div className="whitespace-nowrap text-center text-[clamp(4.2rem,14.5vw,13rem)] font-black leading-[.82] tracking-[-0.09em] text-black/[0.055] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]">
              NOIRKNULL
            </div>
          </div>

          {/* Floating Air Jordan 1 */}
          <div className="absolute left-1/2 top-[49%] z-10 w-[min(76vw,720px)] -translate-x-1/2 -translate-y-1/2 md:top-[52%] md:w-[min(58vw,760px)]">
            <div className="pointer-events-none absolute left-1/2 top-[57%] h-[26%] w-[64%] -translate-x-1/2 rounded-full bg-black/15 blur-[32px]" />
            <img
              src={HERO_SHOE}
              alt="Air Jordan 1"
              className="nk-shoe-float relative z-10 mx-auto w-full select-none object-contain drop-shadow-[0_32px_28px_rgba(0,0,0,0.22)] transition-transform duration-700 group-hover:scale-[1.035]"
              draggable={false}
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Left editorial copy */}
          <div className="nk-reveal absolute bottom-24 left-7 z-20 max-w-[230px] md:bottom-14 md:left-12">
            <p className="mb-3 text-[8px] font-medium uppercase tracking-[0.28em] text-black/50">
              Lighting design
            </p>
            <p className="text-[10px] uppercase leading-[1.6] tracking-[0.16em] text-black/75">
              Built around attitude.
              <br />
              Designed for the street.
            </p>
          </div>

          {/* Right editorial copy */}
          <div className="nk-reveal absolute bottom-24 right-7 z-20 max-w-[220px] text-right md:bottom-14 md:right-12">
            <p className="mb-3 text-[8px] font-medium uppercase tracking-[0.28em] text-black/50">
              Featured object
            </p>
            <p className="text-[10px] uppercase leading-[1.6] tracking-[0.16em] text-black/75">
              Air Jordan 1
              <br />
              Icon / Form / Motion
            </p>
          </div>

          {/* Main title */}
          <div className="absolute left-1/2 top-[66%] z-20 w-full -translate-x-1/2 text-center md:top-[68%]">
            <h1 className="text-[clamp(2.9rem,7vw,7.4rem)] font-medium uppercase leading-[.88] tracking-[-0.075em] text-[#171513]">
              Own Your
              <br />
              <span className="font-black">Silhouette</span>
            </h1>
          </div>

          {/* Shop CTA */}
          <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 md:bottom-9">
            <Link
              to="/products"
              className="group/btn inline-flex min-w-[170px] items-center justify-center gap-4 border border-[#171513] bg-[#171513] px-8 py-3.5 text-[9px] font-medium uppercase tracking-[0.28em] text-white transition-all duration-500 hover:-translate-y-1 hover:bg-transparent hover:text-[#171513]"
            >
              Shop all
              <span className="transition-transform duration-300 group-hover/btn:translate-x-1">↗</span>
            </Link>
          </div>

          {/* Bottom ticker */}
          <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-black/[0.08] bg-white/20 py-2 backdrop-blur-[2px]">
            <div className="nk-marquee flex w-[200%] whitespace-nowrap text-[7px] uppercase tracking-[0.6em] text-black/45">
              <span className="w-1/2 text-center">NOIRKNULL — OBJECTS / ATTITUDE / FORM — NOIRKNULL — OBJECTS / ATTITUDE / FORM — </span>
              <span className="w-1/2 text-center">NOIRKNULL — OBJECTS / ATTITUDE / FORM — NOIRKNULL — OBJECTS / ATTITUDE / FORM — </span>
            </div>
          </div>
        </section>

        {/* Keep the real product catalog immediately below the new hero */}
        <section className="relative overflow-hidden bg-[#faf9f6] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto mb-10 flex max-w-[1400px] items-end justify-between border-b border-black/10 pb-5">
            <div>
              <p className="mb-2 text-[8px] uppercase tracking-[0.3em] text-black/45">Collection 001</p>
              <h2 className="text-2xl font-medium uppercase tracking-[-0.04em] md:text-4xl">Latest Objects</h2>
            </div>
            <Link to="/products" className="hidden text-[9px] uppercase tracking-[0.25em] underline underline-offset-4 md:block">
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
