import { useEffect, useRef } from "react";

type Props = {
  title?: string;
  intensity?: number; // 0..1+
};

function clamp(x: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, x));
}

export default function MetamorphStage({ title = "Capabilities", intensity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;

  const seedRef = useRef((typeof crypto !== "undefined" && "randomUUID" in crypto
    ? Array.from(crypto.randomUUID()).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    : 5731));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement as Element);

    const t0 = performance.now();

    const draw = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;

      const time = (t - t0) / 1000;
      const I = Math.max(0, intensity);
      const i = clamp(I); // 0..1 primary control

      ctx.clearRect(0, 0, w, h);

      // ---- background: calm paper + subtle vignette
      const bg = ctx.createRadialGradient(w * 0.55, h * 0.40, 0, w * 0.55, h * 0.40, Math.max(w, h) * 0.9);
      bg.addColorStop(0, "rgba(0,0,0,0.018)");
      bg.addColorStop(0.55, "rgba(0,0,0,0.010)");
      bg.addColorStop(1, "rgba(0,0,0,0.00)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const pad = Math.round(26 * dpr);
      const rx = Math.round(22 * dpr);
      const mx = pad;
      const my = pad;
      const mw = w - pad * 2;
      const mh = h - pad * 2;

      // frame
      ctx.save();
      roundRect(ctx, mx, my, mw, mh, rx);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // glass fill
      const glass = ctx.createLinearGradient(mx, my, mx, my + mh);
      glass.addColorStop(0, "rgba(255,255,255,0.72)");
      glass.addColorStop(0.5, "rgba(255,255,255,0.56)");
      glass.addColorStop(1, "rgba(255,255,255,0.66)");
      ctx.fillStyle = glass;
      ctx.fill();
      ctx.restore();

      // clip to inner
      ctx.save();
      roundRect(ctx, mx + 1 * dpr, my + 1 * dpr, mw - 2 * dpr, mh - 2 * dpr, rx - 2 * dpr);
      ctx.clip();

      // ---- Mesh parameters
      const cols = 26; // grid density (premium: not too dense)
      const rows = 34;

      const dx = mw / (cols - 1);
      const dy = mh / (rows - 1);

      // "tactile" deformation: a slow breathing field + a controlled vertical drift driven by intensity
      const centerX = mx + mw * 0.52;
      const centerY = my + mh * (0.44 + (0.18 * (0.5 - i))); // intensity shifts the “weight”
      const falloff = mw * 0.55;

      // amplitude (intensity drives it)
      const amp = (10 + 36 * i) * dpr; // deformation strength
      const micro = (0.35 + 0.9 * i); // micro motion

      // line styling (keep it museum subtle)
      const baseAlpha = 0.035 + 0.03 * i;
      const hiAlpha = 0.08 + 0.05 * i;

      // secondary diagonal “shear” (gives textile feel)
      const shear = (0.06 + 0.10 * i);

      // draw: warp lines (horizontal + vertical), with subtle thickness variation
      // NOTE: we build points on the fly (no heavy allocations)
      const noise = (x: number, y: number) => {
        // smooth pseudo noise (deterministic)
        const n = Math.sin(x * 1.7 + y * 1.3 + seedRef.current) * 43758.5453;
        return n - Math.floor(n);
      };

      // helper: displaced point
      const point = (c: number, r: number) => {
        const px0 = mx + c * dx;
        const py0 = my + r * dy;

        const vx = px0 - centerX;
        const vy = py0 - centerY;
        const dist = Math.sqrt(vx * vx + vy * vy);

        const g = Math.exp(-(dist * dist) / (falloff * falloff)); // 0..1
        const n = noise(c * 0.23, r * 0.19);

        // breathing + directional drift
        const breathe = Math.sin(time * (0.55 + 0.35 * micro) + n * 6.0) * 0.55 + 0.45; // 0..1
        const waveX = Math.sin(time * (0.9 + 0.6 * micro) + r * 0.12 + n * 3.0);
        const waveY = Math.cos(time * (0.7 + 0.6 * micro) + c * 0.10 + n * 3.2);

        // “cloth” displacement:
        // - pulls towards center a bit (tension)
        // - adds a shear diagonal
        const pull = (0.10 + 0.22 * i) * g;
        const sx = -vx * pull;
        const sy = -vy * pull;

        const tx = amp * g * (0.55 * waveX) * breathe;
        const ty = amp * g * (0.55 * waveY) * breathe;

        const shx = shear * vy;
        const shy = -shear * vx;

        return {
          x: px0 + sx + tx + shx,
          y: py0 + sy + ty + shy,
          g,
        };
      };

      // horizontal lines
      for (let r = 0; r < rows; r++) {
        const p0 = point(0, r);
        // alpha varies by proximity to deformation center
        const a = baseAlpha + (hiAlpha - baseAlpha) * (p0.g * 0.9);
        ctx.strokeStyle = `rgba(0,0,0,${a})`;
        ctx.lineWidth = (1 + 0.9 * p0.g) * dpr;

        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const p = point(c, r);
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // vertical lines (slightly lighter, adds weave)
      for (let c = 0; c < cols; c++) {
        const p0 = point(c, 0);
        const a = (baseAlpha * 0.85) + (hiAlpha * 0.75 - baseAlpha * 0.85) * (p0.g * 0.9);
        ctx.strokeStyle = `rgba(0,0,0,${a})`;
        ctx.lineWidth = (0.9 + 0.7 * p0.g) * dpr;

        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = point(c, r);
          if (r === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // subtle highlight band (gives material feel)
      const bandY = my + mh * (0.28 + 0.22 * (1 - i));
      const bandH = (22 + 36 * i) * dpr;
      const band = ctx.createLinearGradient(0, bandY - bandH, 0, bandY + bandH);
      band.addColorStop(0, "rgba(255,255,255,0)");
      band.addColorStop(0.45, `rgba(255,255,255,${0.08 + 0.10 * i})`);
      band.addColorStop(0.5, `rgba(255,255,255,${0.12 + 0.14 * i})`);
      band.addColorStop(0.55, `rgba(255,255,255,${0.08 + 0.10 * i})`);
      band.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = band;
      ctx.fillRect(mx, my, mw, mh);

      // grain (very subtle)
      const grains = Math.floor(320 + i * 520);
      ctx.fillStyle = "rgba(0,0,0,0.015)";
      for (let k = 0; k < grains; k++) {
        const gx = mx + rand(seedRef.current + k * 7.1) * mw;
        const gy = my + rand(seedRef.current + k * 11.3) * mh;
        ctx.fillRect(gx, gy, 1 * dpr, 1 * dpr);
      }

      ctx.restore(); // end clip

      // bottom caption
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.font = `${10 * dpr}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
      // Note: letterSpacing isn't supported reliably in canvas; keep clean
      ctx.fillText(String(title).toUpperCase(), mx + 18 * dpr, my + mh - 18 * dpr);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [dpr, intensity, title]);

  return (
    <div className="sticky top-24 h-[calc(100vh-6rem)]">
      <div className="h-full flex flex-col">
        <div className="relative flex-1 rounded-2xl border border-neutral-100 overflow-hidden bg-white">
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-100 p-4">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-[160px]">
              <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-500">Stage</div>
              <div className="mt-1 text-lg tracking-tight">Tactile Mesh</div>
              <div className="text-xs text-neutral-500">Warp / weave field</div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-[11px] tracking-[0.22em] uppercase text-neutral-500">
              <div>
                <div>Mode</div>
                <div className="mt-1 tracking-normal text-xs text-neutral-700">Cloth / Tension</div>
              </div>
              <div>
                <div>Material</div>
                <div className="mt-1 tracking-normal text-xs text-neutral-700">Ink / Glass</div>
              </div>
              <div>
                <div>Status</div>
                <div className="mt-1 tracking-normal text-xs text-neutral-700">Live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function rand(n: number) {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}
