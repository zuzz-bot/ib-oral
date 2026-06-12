import { useRef, useCallback } from "react";

// 3D cursor tilt + spotlight, ported from the original buildInstax().
// Done imperatively on the DOM node (no React state) so pointer moves never
// trigger re-renders — same reason the taste skill bans useState for pointer
// physics. The element keeps its CSS float animation at rest; we switch it off
// while tilting and restore it on leave.
export function useTilt(rot, floatAnim) {
  const ref = useRef(null);
  const restoreTimer = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const card = ref.current;
      if (!card || card.dataset.flying === "1") return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.animation = "none";
      card.style.transition = "transform .08s ease";
      card.style.transform =
        `rotate(${rot}deg) rotateX(${-y * 15}deg) rotateY(${x * 15}deg) ` +
        `scale(1.05) translateY(-6px)`;
      const inner = card.firstElementChild;
      if (inner) {
        inner.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
        inner.style.setProperty("--my", `${(y + 0.5) * 100}%`);
      }
    },
    [rot]
  );

  const onMouseLeave = useCallback(() => {
    const card = ref.current;
    if (!card || card.dataset.flying === "1") return;
    card.style.transition = "transform .7s cubic-bezier(.25,.1,.25,1)";
    card.style.transform = "";
    clearTimeout(restoreTimer.current);
    restoreTimer.current = setTimeout(() => {
      if (card.dataset.flying === "1") return;
      card.style.animation = floatAnim;
      card.style.transition = "";
    }, 700);
  }, [floatAnim]);

  return { ref, onMouseMove, onMouseLeave };
}
