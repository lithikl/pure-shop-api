import { useLayoutEffect, useRef } from "react";

type ScrollLogoProps = {
  homeActive: boolean;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const HEADER_LOGO_SIZE = 16;

export default function ScrollLogo({ homeActive }: ScrollLogoProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let targetProgress = 0;
    let visualProgress = 0;
    let running = true;

    const getState = () => {
      const header = document.querySelector(".landing-header") as HTMLElement | null;
      const placeholder =
        homeActive && (window.location.pathname === "/" || window.location.pathname === "/index.html")
          ? document.getElementById("hero-wordmark")
          : null;

      const headerRect = header?.getBoundingClientRect();
      const headerCenterY = headerRect ? headerRect.top + headerRect.height / 2 : 56;
      const viewportCenterX = document.documentElement.clientWidth / 2;

      if (!placeholder) {
        return { target: 1, centerY: headerCenterY, headerCenterY, startFont: 46, viewportCenterX };
      }

      const heroRect = placeholder.getBoundingClientRect();
      const heroCenterY = heroRect.top + heroRect.height / 2;
      const heroDocumentCenterY = heroCenterY + window.scrollY;
      const heroStartDistance = Math.max(heroDocumentCenterY - headerCenterY, 1);
      const target = clamp(window.scrollY / heroStartDistance, 0, 1);

      return {
        target,
        centerY: heroCenterY,
        headerCenterY,
        startFont: parseFloat(getComputedStyle(placeholder).fontSize) || 46,
        viewportCenterX,
        header,
      };
    };

    const paint = () => {
      const state = getState();
      targetProgress = state.target;

      visualProgress += (targetProgress - visualProgress) * 0.16;
      if (Math.abs(targetProgress - visualProgress) < 0.0008) {
        visualProgress = targetProgress;
      }

      const p = visualProgress;
      const y = state.centerY + (state.headerCenterY - state.centerY) * p;
      const font = lerp(state.startFont, HEADER_LOGO_SIZE, p);
      const atHeader = p >= 0.995;
      
      el.style.fontSize = `${font}px`;
      el.classList.toggle("scroll-logo-at-header", atHeader);
      el.style.letterSpacing = `${lerp(-0.07, -0.02, p)}em`;
      el.style.transform = `translate(${state.viewportCenterX}px, ${y}px) translate(-50%, -50%)`;
      el.style.textShadow = p > 0.92 ? "none" : `0 2px 24px rgba(0,0,0,${(0.28 * (1 - p)).toFixed(3)})`;
      el.style.pointerEvents = p > 0.86 ? "auto" : "none";

      if (Math.abs(targetProgress - visualProgress) > 0.0008) {
        frame = requestAnimationFrame(paint);
      } else {
        running = false;
        frame = 0;
      }
    };

    const schedule = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(paint);
      }
    };

    paint();

    const timers = [50, 150, 400, 800].map((ms) => window.setTimeout(schedule, ms));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [homeActive]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
          window.location.href = "/";
          return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label="NOIRKNULL, go to home page"
      className="scroll-logo"
    >
      NOIRKNULL
    </button>
  );
}
