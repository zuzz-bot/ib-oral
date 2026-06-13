import { useEffect, useRef } from "react";

/**
 * Voxel-inspired pixel-art sky on a single canvas (global background).
 * - Palette eases smoothly through the day (sunrise/day/sunset/night) based on
 *   local time; every frame nudges the current colours toward the target, so
 *   there are no hard switches.
 * - Blocky parallax clouds scrolling infinitely.
 * - Night (faded in by a "nightness" factor): pixel moon + glow, twinkling
 *   stars, rare shooting stars.
 * - forceNight overrides the clock (the NIGHT toggle).
 * Crisp pixels, pauses when hidden, freezes for prefers-reduced-motion.
 */

const hx = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const lerp = (a, b, t) => a + (b - a) * t;
const lerpRGB = (A, B, t) => [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)];
const rgb = (a) => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`;

// Keyframes across a 24h day. night = 0 (full day) … 1 (full night).
const KEYS = [
  { h: 0, top: "#070d22", mid: "#0e1838", bottom: "#1d2b54", cloud: "#2b3a66", night: 1 },
  { h: 5, top: "#0b1430", mid: "#26324f", bottom: "#5a4a6a", cloud: "#39395c", night: 0.85 },
  { h: 6.5, top: "#ff9e6b", mid: "#ffc78c", bottom: "#ffe6c2", cloud: "#fff3e6", night: 0.12 },
  { h: 8.5, top: "#3d8fe0", mid: "#69b0ec", bottom: "#a9d8f5", cloud: "#ffffff", night: 0 },
  { h: 17, top: "#3d8fe0", mid: "#69b0ec", bottom: "#a9d8f5", cloud: "#ffffff", night: 0 },
  { h: 18.5, top: "#5b3a78", mid: "#c85e7a", bottom: "#ff9e6b", cloud: "#ffd9c2", night: 0.22 },
  { h: 20, top: "#1a1840", mid: "#2a2a55", bottom: "#4a3a6a", cloud: "#33345a", night: 0.72 },
  { h: 24, top: "#070d22", mid: "#0e1838", bottom: "#1d2b54", cloud: "#2b3a66", night: 1 },
].map((k) => ({ ...k, top: hx(k.top), mid: hx(k.mid), bottom: hx(k.bottom), cloud: hx(k.cloud) }));

const NIGHT = KEYS[0];

function targetForTime(t) {
  let a = KEYS[0], b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (t >= KEYS[i].h && t <= KEYS[i + 1].h) {
      a = KEYS[i];
      b = KEYS[i + 1];
      break;
    }
  }
  const f = b.h === a.h ? 0 : (t - a.h) / (b.h - a.h);
  return {
    top: lerpRGB(a.top, b.top, f),
    mid: lerpRGB(a.mid, b.mid, f),
    bottom: lerpRGB(a.bottom, b.bottom, f),
    cloud: lerpRGB(a.cloud, b.cloud, f),
    night: lerp(a.night, b.night, f),
  };
}

const CLOUD_SHAPES = [
  [[1, 1, 2, 1], [0, 2, 4, 1], [2, 0, 1, 1]],
  [[0, 1, 3, 1], [1, 0, 2, 1], [1, 2, 4, 1], [4, 1, 1, 1]],
  [[1, 0, 2, 1], [0, 1, 5, 1], [2, 2, 2, 1]],
];

export default function PixelSky({ forceNight = false }) {
  const ref = useRef(null);
  const forceRef = useRef(forceNight);
  useEffect(() => {
    forceRef.current = forceNight;
  }, [forceNight]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    let clouds = [], stars = [], shooting = null, nextShoot = 0;
    let raf = 0, running = true;
    let cur = null; // smoothed current state
    const rand = (a, b) => a + Math.random() * (b - a);

    const buildScene = () => {
      clouds = [];
      const layers = [
        { count: 5, scale: 4, speed: 6, y: [0.04, 0.34], alpha: 0.55 },
        { count: 4, scale: 7, speed: 11, y: [0.08, 0.44], alpha: 0.8 },
        { count: 3, scale: 11, speed: 18, y: [0.1, 0.5], alpha: 1 },
      ];
      layers.forEach((L) => {
        for (let i = 0; i < L.count; i++)
          clouds.push({
            x: rand(-0.2, 1.2) * w,
            y: rand(L.y[0], L.y[1]) * h,
            scale: L.scale,
            speed: L.speed,
            alpha: L.alpha,
            shape: CLOUD_SHAPES[(Math.random() * CLOUD_SHAPES.length) | 0],
          });
      });
      stars = [];
      const n = Math.floor((w * h) / 13000);
      for (let i = 0; i < n; i++)
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.72,
          s: Math.random() < 0.14 ? 6 : Math.random() < 0.5 ? 4 : 2,
          ph: Math.random() * Math.PI * 2,
        });
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

    const drawMoon = (alpha) => {
      const mx = w * 0.78, my = h * 0.2, r = 46;
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(mx, my, r * 0.3, mx, my, r * 3.2);
      g.addColorStop(0, "rgba(224,231,255,0.55)");
      g.addColorStop(1, "rgba(224,231,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(mx - r * 3.2, my - r * 3.2, r * 6.4, r * 6.4);
      const step = 6;
      for (let yy = -r; yy <= r; yy += step) {
        const xw = Math.floor(Math.sqrt(Math.max(0, r * r - yy * yy)) / step) * step;
        block(mx - xw, my + yy, xw * 2 + step, step, "#eef2ff");
      }
      block(mx - 14, my - 8, 10, 10, "#ccd4f2");
      block(mx + 10, my + 12, 8, 8, "#ccd4f2");
      ctx.globalAlpha = 1;
    };

    const draw = (t) => {
      const now = new Date();
      const tt = now.getHours() + now.getMinutes() / 60;
      const target = forceRef.current ? NIGHT : targetForTime(tt);
      if (!cur) {
        cur = {
          top: [...target.top], mid: [...target.mid], bottom: [...target.bottom],
          cloud: [...target.cloud], night: target.night,
        };
      } else {
        const e = reduce ? 1 : 0.04; // ease toward target → smooth transitions
        for (const k of ["top", "mid", "bottom", "cloud"])
          cur[k] = lerpRGB(cur[k], target[k], e);
        cur.night = lerp(cur.night, target.night, e);
      }

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, rgb(cur.top));
      grad.addColorStop(0.55, rgb(cur.mid));
      grad.addColorStop(1, rgb(cur.bottom));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const night = cur.night;
      if (night > 0.02) {
        stars.forEach((s) => {
          const tw = reduce ? 0.85 : 0.55 + 0.45 * Math.sin(t * 0.002 + s.ph);
          ctx.globalAlpha = tw * night;
          block(s.x, s.y, s.s, s.s, "#ffffff");
        });
        ctx.globalAlpha = 1;
        drawMoon(Math.min(1, night * 1.1));

        if (!reduce && night > 0.5) {
          if (!shooting && t > nextShoot)
            shooting = { x: rand(0.1, 0.7) * w, y: rand(0.05, 0.3) * h, life: 0 };
          if (shooting) {
            shooting.life += 1;
            const len = 120, sx = shooting.x + shooting.life * 9, sy = shooting.y + shooting.life * 4;
            const a = Math.max(0, 1 - shooting.life / 45);
            for (let k = 0; k < len; k += 6) {
              ctx.globalAlpha = a * (1 - k / len) * night;
              block(sx - k, sy - k * 0.44, 4, 4, "#ffffff");
            }
            ctx.globalAlpha = 1;
            if (shooting.life > 46) {
              shooting = null;
              nextShoot = t + rand(30000, 90000);
            }
          }
        }
      }

      const cloudCol = rgb(cur.cloud);
      const cloudAlpha = lerp(0.95, 0.5, night);
      clouds.forEach((c) => {
        if (!reduce) {
          c.x += c.speed * 0.016;
          if (c.x - 60 > w) c.x = -c.scale * 6;
        }
        ctx.globalAlpha = cloudAlpha * c.alpha;
        c.shape.forEach(([dx, dy, cw, ch]) =>
          block(c.x + dx * c.scale, c.y + dy * c.scale, cw * c.scale, ch * c.scale, cloudCol)
        );
        ctx.globalAlpha = 1;
      });
    };

    const loop = (t) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
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
  }, []);

  return <canvas id="sky" ref={ref} aria-hidden="true" />;
}
