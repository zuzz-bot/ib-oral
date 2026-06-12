import { useState } from "react";
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
  const [clickedId, setClickedId] = useState(null);

  const handleClick = (theme) => {
    if (clickedId) return;
    setClickedId(theme.id);
    onHoverTheme(theme.rgb); // gradient settles on the chosen theme
    // Let the clicked card fly up and siblings fade before switching screens.
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
      <div className="photo-row">
        {themes.map((theme, i) => (
          <InstaxCard
            key={theme.id}
            imgSrc={theme.photo}
            label={theme.label}
            rot={theme.rot}
            accent={theme.accent}
            floatAnim={FLOAT_ANIMS[i % FLOAT_ANIMS.length]}
            onHoverIn={() => !clickedId && onHoverTheme(theme.rgb)}
            onHoverOut={() => !clickedId && onHoverTheme(null)}
            onClick={() => handleClick(theme)}
            exit={
              clickedId
                ? clickedId === theme.id
                  ? "fly"
                  : "fade"
                : null
            }
          />
        ))}
      </div>
    </motion.div>
  );
}
