import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import InstaxCard from "./InstaxCard.jsx";

const FLOAT_ANIMS = [
  "f1 6.2s ease-in-out infinite",
  "f2 7.1s ease-in-out infinite .6s",
  "f3 5.8s ease-in-out infinite 1.1s",
  "f4 6.7s ease-in-out infinite .3s",
  "f5 7.5s ease-in-out infinite .9s",
];

export default function HomeScreen({ themes, onPickTheme, onHoverTheme }) {
  const [clickedKey, setClickedKey] = useState(null);
  const scroller = useRef(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const suppressClick = useRef(false);

  // Triple the list so the strip can loop seamlessly in both directions.
  const loop = [...themes, ...themes, ...themes];

  // Start centred on the middle copy.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth / 3;
  }, []);

  // Seamless infinite wrap: jump by exactly one set when near an edge.
  const onScroll = () => {
    const el = scroller.current;
    if (!el || drag.current.active) return;
    const set = el.scrollWidth / 3;
    if (el.scrollLeft < set * 0.5) el.scrollLeft += set;
    else if (el.scrollLeft > set * 1.5) el.scrollLeft -= set;
  };

  // Mouse drag-to-scroll (touch uses native horizontal scrolling).
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    const el = scroller.current;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: 0 };
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    scroller.current.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    if (drag.current.moved > 6) suppressClick.current = true;
    drag.current.active = false;
    onScroll();
  };

  // Vertical wheel / trackpad → horizontal movement.
  const onWheel = (e) => {
    const el = scroller.current;
    if (!el) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    el.scrollLeft += delta;
  };

  const handleClick = (theme, key) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (clickedKey != null) return;
    setClickedKey(key);
    onHoverTheme(theme.rgb);
    setTimeout(() => onPickTheme(theme.id), 600);
  };

  return (
    <motion.div
      id="home"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div id="home-title">IB Oral</div>
      <div id="home-sub">
        English B &nbsp;·&nbsp; SL &nbsp;·&nbsp; Individual Oral
      </div>
      <div
        className="photo-row drag-row"
        ref={scroller}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        {loop.map((theme, i) => (
          <InstaxCard
            key={i}
            imgSrc={theme.photo}
            label={theme.label}
            rot={theme.rot}
            accent={theme.accent}
            tilt={false}
            floatAnim={FLOAT_ANIMS[i % FLOAT_ANIMS.length]}
            onHoverIn={() => clickedKey == null && onHoverTheme(theme.rgb)}
            onHoverOut={() => clickedKey == null && onHoverTheme(null)}
            onClick={() => handleClick(theme, i)}
            exit={clickedKey != null ? (clickedKey === i ? "fly" : "fade") : null}
          />
        ))}
      </div>
      <div className="home-hint">drag · scroll →</div>
    </motion.div>
  );
}
