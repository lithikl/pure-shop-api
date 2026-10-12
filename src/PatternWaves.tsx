import { useEffect, useRef } from "react";
import "./PatternWaves.css";

type PatternWavesProps = {
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  speed?: number;
  spacing?: number;
  depth?: number;
  interactive?: boolean;
  className?: string;
};

export default function PatternWaves({
  color = "#171512",
  backgroundColor = "transparent",
  opacity = 0.22,
  speed = 0.32,
  spacing = 12,
  depth = 0.9,
  interactive = true,
  className = "",
}: PatternWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const host = canvas.parentElement;
    if (!host) return;

    let width = 1;
    let height = 1;
    let raf = 0;
    let alive = true;
    let time = 0;
    let last = performance.now();
    const pointer = { x: 0, y: 0, inside: false };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= width && pointer.y <= height;
    };

    const leave = () => { pointer.inside = false; };

    const frame = (now: number) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt * speed;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      const gap = Math.max(7, spacing);
      const radius = Math.max(0.65, gap * 0.065);

      for (let y = -gap; y < height + gap; y += gap) {
        for (let x = -gap; x < width + gap; x += gap) {
          const nx = x / 260;
          const ny = y / 210;
          const wave =
            Math.sin(nx * 4.7 + time * 1.1 + Math.sin(ny * 2.8) * 1.5) * 0.55 +
            Math.sin(ny * 5.1 - time * 0.8) * 0.28 +
            Math.sin((nx + ny) * 3.2 - time * 0.45) * 0.17;

          let lift = wave * depth;
          if (interactive && pointer.inside) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - distance / 190);
            lift += Math.sin(distance * 0.075 - time * 5) * influence * 1.7;
          }

          const size = radius * (0.65 + (lift + 1) * 0.28);
          const alpha = Math.max(0.12, Math.min(1, 0.35 + (lift + 1) * 0.18));
          ctx.globalAlpha = opacity * alpha;
          ctx.beginPath();
          ctx.arc(x, y + lift * gap * 0.28, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave, { passive: true });
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [color, opacity, speed, spacing, depth, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={"pattern-waves " + className}
      style={{ backgroundColor }}
      aria-hidden="true"
    />
  );
}
