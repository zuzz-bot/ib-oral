import { useEffect } from "react";
import { useTilt } from "../hooks/useTilt.js";

const FALLBACK =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&auto=format&fit=crop";

/**
 * Instax photo card — the core visual identity.
 * Float (CSS), 3D cursor tilt + spotlight (imperative), and a click fly-up.
 *
 * @param exit  null | "fly" (clicked card leaves upward) | "fade" (siblings dim)
 */
export default function InstaxCard({
  imgSrc,
  label,
  rot = 0,
  floatAnim,
  entranceClass = "",
  onHoverIn,
  onHoverOut,
  onClick,
  exit = null,
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(rot, floatAnim);

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

  return (
    <div
      ref={ref}
      className={`instax ${entranceClass}`}
      style={{ "--rot": `${rot}deg`, animation: floatAnim }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        onMouseLeave();
        onHoverOut?.();
      }}
      onMouseEnter={onHoverIn}
      onClick={onClick}
    >
      <div className="instax-inner">
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
        <div className="instax-label">{label}</div>
      </div>
    </div>
  );
}
