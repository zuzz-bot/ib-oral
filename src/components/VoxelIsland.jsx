import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Original isometric voxel island, hand-built in SVG (no external assets).
 * Gentle float + subtle mouse-follow parallax. Calm and premium.
 */
export default function VoxelIsland() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const tx = useTransform(sx, [-1, 1], [16, -16]);
  const ty = useTransform(sy, [-1, 1], [12, -12]);
  const rot = useTransform(sx, [-1, 1], [7, -7]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <motion.div
      className="voxel-wrap"
      style={reduce ? undefined : { x: tx, y: ty, rotateZ: rot }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          className="voxel-svg"
          viewBox="0 0 240 280"
          shapeRendering="crispEdges"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* floating mini rocks below for depth */}
          <g opacity="0.85">
            <polygon points="60,250 76,258 60,266 44,258" fill="#7b5333" />
            <polygon points="60,250 60,266 44,258" fill="#5e3d24" />
            <polygon points="176,262 188,268 176,274 164,268" fill="#7b5333" />
            <polygon points="176,262 176,274 164,268" fill="#5e3d24" />
          </g>

          {/* island body — isometric, tapered bottom */}
          <polygon points="34,86 120,134 120,214 34,150" fill="#7b5333" />
          <polygon points="206,86 120,134 120,214 206,150" fill="#5e3d24" />
          {/* dirt texture blocks */}
          <rect x="48" y="104" width="12" height="8" fill="#6b4a2e" />
          <rect x="78" y="128" width="12" height="8" fill="#6b4a2e" />
          <rect x="150" y="120" width="12" height="8" fill="#4f3320" />
          <rect x="174" y="104" width="12" height="8" fill="#4f3320" />
          <rect x="96" y="160" width="12" height="8" fill="#6b4a2e" />

          {/* grass lip / overhang */}
          <polygon points="34,86 120,134 120,146 34,98" fill="#5a9a36" />
          <polygon points="206,86 120,134 120,146 206,98" fill="#4e8a2e" />

          {/* grass top */}
          <polygon points="120,38 206,86 120,134 34,86" fill="#79c14a" />
          <polygon points="120,38 163,62 120,86 77,62" fill="#86d255" />

          {/* little pond */}
          <polygon points="96,92 112,100 96,108 80,100" fill="#56c5e8" />
          <polygon points="96,92 104,96 96,100 88,96" fill="#8fe0f5" />

          {/* rock */}
          <rect x="150" y="74" width="16" height="9" fill="#7d828c" />
          <rect x="154" y="68" width="10" height="7" fill="#969ba6" />

          {/* tree */}
          <rect x="60" y="58" width="8" height="18" fill="#6b4a2e" />
          <polygon points="64,18 88,34 64,50 40,34" fill="#3c7e30" />
          <polygon points="64,30 86,44 64,58 42,44" fill="#4e9e3e" />
          <polygon points="64,30 75,37 64,44 53,37" fill="#5bb84a" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
