import { useEffect } from "react";
import { motion } from "motion/react";
import { useTilt } from "../hooks/useTilt.js";

const FALLBACK =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&auto=format&fit=crop";

/**
 * Instax photo card — the core visual identity.
 * Float (CSS), 3D cursor tilt + spotlight (imperative), click fly-up, and a
 * per-theme coloured-light grade so every photo reads as dark editorial.
 *
 * @param accent        hex colour of the theme (drives the light wash)
 * @param entranceDelay if set, the card springs in with this delay (topics grid)
 * @param exit          null | "fly" (clicked card leaves upward) | "fade" (siblings dim)
 */
export default function InstaxCard({
  imgSrc,
  label,
  rot = 0,
  floatAnim,
  accent = "#888",
  entranceDelay,
  tilt = true,
  onHoverIn,
  onHoverOut,
  onClick,
  exit = null,
}) {
  const tiltApi = useTilt(rot, floatAnim);
  const ref = tiltApi.ref;
  const onMouseMove = tilt ? tiltApi.onMouseMove : undefined;

  // Apply the leave animations imperatively when `exit` flips.
  useEffect(() => {
    const card = ref.current;
    if (!card || !exit) return;
    card.dataset.flying = "1";
    card.style.animation = "none";
    if (exit === "fly") {
      card.style.transition =
        "transform .55s cubic-bezier(.25,.1,.25,1), opacity .45s ease";
      card.style.transform = `translateY(-110vh) scale(.85) rotate(${rot}deg)`;
      card.style.opacity = "0";
    } else {
      card.style.transition = "opacity .35s ease, transform .35s ease";
      card.style.transform = `rotate(${rot}deg) scale(.92)`;
      card.style.opacity = "0";
    }
  }, [exit, rot]);

  const card = (
    <div
      ref={ref}
      className="instax"
      style={{ "--rot": `${rot}deg`, animation: floatAnim }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        if (tilt) tiltApi.onMouseLeave();
        onHoverOut?.();
      }}
      onMouseEnter={onHoverIn}
      onClick={onClick}
    >
      <div className="instax-inner">
        <div className="instax-photo">
          <img
            className="instax-img"
            src={imgSrc}
            alt={label}
            loading="eager"
            draggable={false}
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
            }}
          />
          <div className="instax-tint" style={{ "--accent": accent }} />
          <div className="instax-shade" />
        </div>
        <div className="instax-label">{label}</div>
        <span className="instax-open" style={{ color: accent }}>
          Open →
        </span>
      </div>
    </div>
  );

  // Topic grid cards spring in with a stagger; home cards appear with the screen.
  if (entranceDelay != null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: entranceDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {card}
      </motion.div>
    );
  }
  return card;
}
