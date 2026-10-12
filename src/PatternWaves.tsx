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
  color = "#0b0b0a",
  backgroundColor = "transparent",
  opacity = 0.72,
  speed = 0.42,
  spacing = 17,
  depth = 1.0,
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
      ctx.lineWidth = 1;

      const gap = Math.max(8, spacing);
      const lineGap = Math.max(18, gap * 1.35);
      const amplitude = gap * 1.7;

      // Two diagonal families create a crossing "X" wave field instead of a
      // regular horizontal/vertical dot grid.
      ctx.lineWidth = Math.max(0.55, gap * 0.045);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const drawWaveFamily = (direction: 1 | -1) => {
        const diagonalLength = Math.hypot(width, height) + 180;
        const count = Math.ceil(diagonalLength / lineGap) + 4;

        for (let line = -count; line <= count; line += 1) {
          const offset = line * lineGap;
          ctx.beginPath();
          let started = false;

          for (let distance = -90; distance <= diagonalLength; distance += 9) {
            const baseX = direction === 1
              ? distance + offset
              : width - distance + offset;
            const baseY = direction === 1
              ? distance
              : distance;

            const nx = baseX / 190;
            const ny = baseY / 170;
            const wave =
              Math.sin(nx * 3.7 + time * 1.05 + line * 0.08) * 0.55 +
              Math.sin(ny * 4.5 - time * 0.72 - line * 0.05) * 0.3 +
              Math.sin((nx - ny) * 2.7 + time * 0.4) * 0.15;

            let lift = wave * depth * amplitude;

            if (interactive && pointer.inside) {
              const px = baseX - pointer.x;
              const py = baseY - pointer.y;
              const distanceToPointer = Math.sqrt(px * px + py * py);
              const influence = Math.max(0, 1 - distanceToPointer / 240);
              lift += Math.sin(distanceToPointer * 0.045 - time * 4) * influence * amplitude * 0.55;
            }

            const x = baseX;
            const y = baseY + lift;

            if (x < -120 || x > width + 120 || y < -120 || y > height + 120) continue;

            const alpha = Math.max(0.18, Math.min(1, 0.48 + Math.abs(wave) * 0.42));
            ctx.globalAlpha = opacity * alpha;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        }
      };

      drawWaveFamily(1);
      drawWaveFamily(-1);

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
