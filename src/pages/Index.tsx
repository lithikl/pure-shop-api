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

      <section className="noir-hero group relative h-[calc(100vh-56px)] w-full overflow-hidden bg-[#f1efe9] text-foreground">
        <style>{`
          @keyframes nk-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4vw,2vh,0) scale(1.08); } }
          @keyframes nk-drift-b { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-5vw,4vh,0) scale(1.12); } }
          @keyframes nk-drift-c { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(2vw,-3vh,0) rotate(8deg); } }
          @keyframes nk-pulse { 0%,100% { opacity:.28; transform: scale(.96); } 50% { opacity:.5; transform: scale(1.06); } }
          @keyframes nk-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes nk-spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes nk-scan { 0% { transform: translateY(-120%); opacity:0; } 20%,70% { opacity:.35; } 100% { transform: translateY(520%); opacity:0; } }
          @keyframes nk-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes nk-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes nk-flicker { 0%,92%,100% { opacity:1; } 94% { opacity:.45; } 96% { opacity:.8; } }
          .nk-drift-a { animation:nk-drift-a 13s ease-in-out infinite; }
          .nk-drift-b { animation:nk-drift-b 17s ease-in-out infinite; }
          .nk-drift-c { animation:nk-drift-c 19s ease-in-out infinite; }
          .nk-pulse { animation:nk-pulse 7s ease-in-out infinite; }
          .nk-spin { animation:nk-spin 28s linear infinite; }
          .nk-spin-reverse { animation:nk-spin-reverse 22s linear infinite; }
          .nk-scan { animation:nk-scan 9s ease-in-out infinite; }
          .nk-float { animation:nk-float 5s ease-in-out infinite; }
          .nk-marquee { animation:nk-marquee 28s linear infinite; }
          .nk-flicker { animation:nk-flicker 8s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .nk-drift-a,.nk-drift-b,.nk-drift-c,.nk-pulse,.nk-spin,.nk-spin-reverse,.nk-scan,.nk-float,.nk-marquee,.nk-flicker { animation:none !important; }
          }
        `}</style>

        {/* Cinematic atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="nk-drift-a absolute -left-[18vw] -top-[20vw] h-[62vw] w-[62vw] rounded-full bg-white/90 blur-[100px]" />
          <div className="nk-drift-b absolute -right-[18vw] top-[2vw] h-[55vw] w-[55vw] rounded-full bg-[#d9d0c0]/80 blur-[110px]" />
          <div className="nk-drift-c absolute -bottom-[30vw] left-[12vw] h-[60vw] w-[60vw] rounded-full bg-[#e5ded2]/90 blur-[125px]" />
          <div className="nk-pulse absolute left-1/2 top-[48%] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[80px]" />

          {/* Light beam */}
          <div className="nk-scan absolute left-[10%] top-[-20%] h-[18%] w-[80%] rotate-[-7deg] bg-white/25 blur-[45px]" />

          {/* Perspective grid */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '72px 72px',
              maskImage: 'radial-gradient(ellipse at center, black 0%, black 35%, transparent 82%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 35%, transparent 82%)',
            }}
          />

          {/* Construction geometry */}
          <div className="nk-spin absolute -right-[10vw] top-[16%] h-[36vw] w-[36vw] rounded-full border border-foreground/[0.08]" />
          <div className="nk-spin-reverse absolute -right-[2vw] top-[24%] h-[22vw] w-[22vw] rounded-full border border-dashed border-foreground/[0.07]" />
          <div className="nk-float absolute -left-[8vw] bottom-[5%] h-[20vw] w-[20vw] rounded-full border border-foreground/[0.07]" />
          <div className="absolute left-[8%] top-[22%] h-px w-[84%] rotate-[11deg] bg-foreground/[0.06]" />
          <div className="absolute left-[3%] top-[76%] h-px w-[94%] -rotate-[7deg] bg-foreground/[0.055]" />

          {/* Frame + center axis */}
          <div className="absolute inset-5 border border-foreground/[0.085] md:inset-8" />
          <div className="absolute left-1/2 top-8 bottom-8 hidden w-px -translate-x-1/2 bg-foreground/[0.045] md:block" />
          <div className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/25 bg-[#f1efe9] md:block" />

          {/* Cursor-like ambient orb */}
          <div className="absolute left-[58%] top-[38%] h-24 w-24 rounded-full border border-foreground/[0.08] shadow-[0_0_70px_rgba(255,255,255,.5)] transition-transform duration-700 group-hover:scale-125" />
        </div>

        {/* Giant kinetic typography */}
        <div className="pointer-events-none absolute inset-x-0 top-[41%] z-[1] -translate-y-1/2 overflow-hidden select-none">
          <div className="nk-flicker whitespace-nowrap text-center text-[clamp(5rem,17vw,15rem)] font-black leading-none tracking-[-0.1em] text-foreground/[0.06] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.035] group-hover:tracking-[-0.075em]">
            NOIRKNULL
          </div>
          <div className="nk-marquee mt-[-1.2vw] flex w-[200%] whitespace-nowrap text-[8px] uppercase tracking-[0.65em] text-foreground/[0.28]">
            <span className="w-1/2 text-center">Objects / Attitude / Form — Independent Streetwear — Chennai / India — </span>
            <span className="w-1/2 text-center">Objects / Attitude / Form — Independent Streetwear — Chennai / India — </span>
          </div>
        </div>

        {/* Editorial HUD */}
        <div className="pointer-events-none absolute left-8 top-8 z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] opacity-65 md:left-11 md:top-10">
          <span className="nk-pulse h-1.5 w-1.5 rounded-full bg-foreground/70" />
          Independent / Streetwear / 2026
        </div>
        <div className="pointer-events-none absolute right-8 top-8 z-10 text-[9px] uppercase tracking-[0.3em] opacity-65 md:right-11 md:top-10">
          N° 01 / 001
        </div>
        <div className="pointer-events-none absolute bottom-8 left-8 z-10 hidden text-[9px] uppercase tracking-[0.3em] opacity-45 md:left-11 md:block">
          Chennai / India
        </div>
        <div className="pointer-events-none absolute bottom-8 right-8 z-10 hidden text-[9px] uppercase tracking-[0.3em] opacity-45 md:right-11 md:block">
          Objects / Attitude / Form
        </div>

        {/* Carousel stays above the artwork */}
        <div className="relative z-[3] h-full transition-transform duration-700 ease-out group-hover:-translate-y-1">
          <FeaturedCarousel collectionHandle="frontpage" />
        </div>

        {/* Magnetic-style CTA */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center md:bottom-10">
          <Link
            to="/products"
            className="group/btn relative overflow-hidden border border-foreground bg-foreground px-11 py-3.5 text-[10px] uppercase tracking-[0.25em] text-background shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:bg-transparent hover:text-foreground hover:shadow-none"
          >
            <span className="relative z-10 transition-colors duration-300">Shop All</span>
            <span className="absolute inset-0 origin-left scale-x-0 bg-background transition-transform duration-500 group-hover/btn:scale-x-100" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover/btn:right-4 group-hover/btn:opacity-100">↗</span>
          </Link>
        </div>

        {/* Grain + vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.9%27/%3E%3C/svg%3E")',
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(30,27,23,0.06)_100%)]" />
      </section>

      {/* Animated collection gateway */}
      <section className="group/collection relative flex w-full justify-center overflow-hidden bg-[#f1efe9] py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-foreground/10" />
        <div className="nk-marquee pointer-events-none absolute top-3 flex w-[200%] whitespace-nowrap text-[7px] uppercase tracking-[0.7em] text-foreground/[0.22]">
          <span className="w-1/2 text-center">NOIRKNULL — COLLECTION 001 — NOIRKNULL — COLLECTION 001 — </span>
          <span className="w-1/2 text-center">NOIRKNULL — COLLECTION 001 — NOIRKNULL — COLLECTION 001 — </span>
        </div>
        <Link
          to="/collections"
          className="group relative mt-2 overflow-hidden border border-foreground px-10 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-all duration-500 hover:-translate-y-1 hover:bg-foreground hover:text-background"
        >
          <span>View Collection</span>
          <span className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
        </Link>
      </section>
    </Layout>
  );
}
