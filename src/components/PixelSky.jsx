import { useEffect, useRef } from "react";

/**
 * Voxel-inspired pixel-art sky on a single canvas. Global background.
 * - Smooth sky gradient whose palette follows the user's local time
 *   (sunrise / day / sunset / night).
 * - Blocky clouds in parallax layers, scrolling infinitely.
 * - At night: pixel moon with glow, twinkling stars, rare shooting stars.
 * Crisp pixels (imageSmoothingEnabled = false, block-aligned drawing),
 * pauses when the tab is hidden, and freezes for prefers-reduced-motion.
 */

const PALETTES = {
  sunrise: { top: "#ff9e6b", mid: "#ffc78c", bottom: "#ffe6c2", cloud: "#fff3e6", night: false },
  day: { top: "#3d8fe0", mid: "#69b0ec", bottom: "#a9d8f5", cloud: "#ffffff", night: false },
  sunset: { top: "#5b3a78", mid: "#c85e7a", bottom: "#ff9e6b", cloud: "#ffd9c2", night: false },
  night: { top: "#070d22", mid: "#0e1838", bottom: "#1d2b54", cloud: "#2b3a66", night: true },
};

function paletteForHour(h) {
  if (h >= 5 && h < 8) return PALETTES.sunrise;
  if (h >= 8 && h < 17) return PALETTES.day;
  if (h >= 17 && h < 20) return PALETTES.sunset;
  return PALETTES.night;
}

// A blocky cloud = list of [dx, dy, w, h] cells on a small grid (unit = 1).
const CLOUD_SHAPES = [
  [[1, 1, 2, 1], [0, 2, 4, 1], [2, 0, 1, 1]],
  [[0, 1, 3, 1], [1, 0, 2, 1], [1, 2, 4, 1], [4, 1, 1, 1]],
  [[1, 0, 2, 1], [0, 1, 5, 1], [2, 2, 2, 1]],
];

export default function PixelSky({ forceNight = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    let clouds = [];
    let stars = [];
    let shooting = null;
    let nextShoot = 0;
    let raf = 0;
    let running = true;

    const rand = (a, b) => a + Math.random() * (b - a);

    const buildScene = () => {
      // 3 parallax cloud layers: far/slow/small → near/fast/big
      clouds = [];
      const layers = [
        { count: 5, scale: 4, speed: 6, y: [0.05, 0.35], alpha: 0.55 },
        { count: 4, scale: 7, speed: 11, y: [0.1, 0.45], alpha: 0.8 },
        { count: 3, scale: 11, speed: 18, y: [0.12, 0.5], alpha: 1 },
      ];
      layers.forEach((L) => {
        for (let i = 0; i < L.count; i++) {
          clouds.push({
            x: rand(-0.2, 1.2) * w,
            y: rand(L.y[0], L.y[1]) * h,
            scale: L.scale,
            speed: L.speed,
            alpha: L.alpha,
            shape: CLOUD_SHAPES[(Math.random() * CLOUD_SHAPES.length) | 0],
          });
        }
      });
      stars = [];
      const n = Math.floor((w * h) / 14000);
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.7,
          s: Math.random() < 0.15 ? 6 : Math.random() < 0.5 ? 4 : 2,
          ph: Math.random() * Math.PI * 2,
        });
      }
      nextShoot = performance.now() + rand(8000, 30000);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth || document.documentElement.clientWidth || 1280;
      h = window.innerHeight || document.documentElement.clientHeight || 800;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      buildScene();
    };

    const block = (x, y, bw, bh, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(bw), Math.round(bh));
    };

    const drawCloud = (c, color, alpha) => {
      ctx.globalAlpha = alpha * c.alpha;
      const u = c.scale;
      // soft shadow row underneath for a touch of depth
      c.shape.forEach(([dx, dy, cw, ch]) => {
        block(c.x + dx * u, c.y + dy * u, cw * u, ch * u, color);
      });
      ctx.globalAlpha = 1;
    };

    const drawMoon = () => {
      const mx = w * 0.78, my = h * 0.2, r = 46;
      // glow
      const g = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 3);
      g.addColorStop(0, "rgba(220,228,255,0.5)");
      g.addColorStop(1, "rgba(220,228,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(mx - r * 3, my - r * 3, r * 6, r * 6);
      // pixel disc (block-stepped circle)
      const step = 6;
      for (let yy = -r; yy <= r; yy += step) {
        const xw = Math.floor(Math.sqrt(r * r - yy * yy) / step) * step;
        block(mx - xw, my + yy, xw * 2 + step, step, "#e7ecff");
      }
      // a couple of craters
      block(mx - 14, my - 8, 10, 10, "#c9d2f2");
      block(mx + 8, my + 10, 8, 8, "#c9d2f2");
    };

    const draw = (t) => {
      const pal = forceNight ? PALETTES.night : paletteForHour(new Date().getHours());
      // sky gradient (smooth is fine; pixel character comes from clouds/stars)
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, pal.top);
      grad.addColorStop(0.55, pal.mid);
      grad.addColorStop(1, pal.bottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (pal.night) {
        // stars
        stars.forEach((s) => {
          const tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.002 + s.ph);
          ctx.globalAlpha = tw;
          block(s.x, s.y, s.s, s.s, "#ffffff");
        });
        ctx.globalAlpha = 1;
        drawMoon();

        // shooting star
        if (!reduce) {
          if (!shooting && t > nextShoot) {
            shooting = { x: rand(0.1, 0.7) * w, y: rand(0.05, 0.3) * h, life: 0 };
          }
          if (shooting) {
            shooting.life += 1;
            const len = 120, sx = shooting.x + shooting.life * 9, sy = shooting.y + shooting.life * 4;
            const a = Math.max(0, 1 - shooting.life / 45);
            ctx.globalAlpha = a;
            for (let k = 0; k < len; k += 6) {
              block(sx - k, sy - k * 0.44, 4, 4, "#ffffff");
              ctx.globalAlpha = a * (1 - k / len);
            }
            ctx.globalAlpha = 1;
            if (shooting.life > 46) {
              shooting = null;
              nextShoot = t + rand(30000, 90000);
            }
          }
        }
      }

      // clouds (parallax). Tint clouds darker at night.
      clouds.forEach((c) => {
        if (!reduce) {
          c.x += (c.speed * 0.016);
          if (c.x - 60 > w) c.x = -c.scale * 6;
        }
        drawCloud(c, pal.cloud, pal.night ? 0.5 : 0.95);
      });
    };

    let last = performance.now();
    const loop = (t) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [forceNight]);

  return <canvas id="sky" ref={ref} aria-hidden="true" />;
}
