import { useEffect, useRef } from "react";

const BASE =
  "linear-gradient(270deg,#000000,#0a0018,#000a1a,#000d12,#050010,#0a0005,#000000)";

// Animated gradient that bleeds toward the hovered/active theme's accent
// (very dark, ~12% of the accent RGB), exactly like the original.
export default function GradientBg({ accentRgb }) {
  const ref = useRef(null);

  useEffect(() => {
    const bg = ref.current;
    if (!bg) return;
    if (!accentRgb) {
      bg.style.background = BASE;
      bg.style.backgroundSize = "400% 400%";
      bg.style.animation = "gradientShift 18s ease infinite";
      return;
    }
    const [r, g, b] = accentRgb.split(",").map(Number);
    const mid = `rgb(${Math.round(r * 0.12)},${Math.round(g * 0.12)},${Math.round(
      b * 0.12
    )})`;
    bg.style.background = `linear-gradient(270deg,#000000,${mid},#000000,${mid},#000000)`;
    bg.style.backgroundSize = "400% 400%";
    bg.style.animation = "gradientShift 14s ease infinite";
  }, [accentRgb]);

  return <div id="bg" ref={ref} />;
}
