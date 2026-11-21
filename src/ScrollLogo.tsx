import { useLayoutEffect, useRef } from "react";

type ScrollLogoProps = {
  homeActive: boolean;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ScrollLogo({ homeActive }: ScrollLogoProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const update = () => {
      const placeholder =
        homeActive && (window.location.pathname === "/" || window.location.pathname === "/index.html")
          ? document.getElementById("hero-wordmark")
          : null;

      const header = document.querySelector(".landing-header") as HTMLElement | null;
      const headerHeight = header?.getBoundingClientRect().height || 64;
      const headerY = headerHeight / 2;
      const x = document.documentElement.clientWidth / 2;

      let y = headerY;
      let font = 22;
      let t = 1;

      if (placeholder) {
        const rect = placeholder.getBoundingClientRect();
        const rectVisible = rect.width > 0 && rect.height > 0;
        const startFont = parseFloat(getComputedStyle(placeholder).fontSize) || 72;
        const centerY = rect.top + rect.height / 2;
        const startY = centerY + window.scrollY;

        if (rectVisible) {
          y = Math.max(centerY, headerY);
          t = clamp((startY - y) / Math.max(startY - headerY, 1), 0, 1);
          font = lerp(startFont, 22, t);
        }
      }

      el.style.fontSize = `${font}px`;
      el.style.letterSpacing = `${lerp(-0.07, -0.02, t)}em`;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

      const inHeader = t > 0.88;
      el.style.color = inHeader ? "#111" : "#fff";
      el.style.textShadow = inHeader ? "none" : "0 2px 24px rgba(0,0,0,.28)";
      el.style.pointerEvents = inHeader ? "auto" : "none";
      el.style.opacity = "1";
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "style"] });

    const timers = [50, 150, 400, 800].map((ms) => window.setTimeout(update, ms));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [homeActive]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="NOIRKNULL, go to home page"
      className="scroll-logo"
    >
      NOIRKNULL
    </button>
  );
}
