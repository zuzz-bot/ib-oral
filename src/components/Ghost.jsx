import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QUOTES } from "../data/content.js";

// Floating ghost mascot. Auto-shows a random quote every 45s (first after 5s),
// click to toggle. Same behaviour as the original, with spring float via Motion.
export default function Ghost() {
  const [quote, setQuote] = useState(null);
  const hideTimer = useRef(null);

  const show = (forced) => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setQuote(null), forced ? 5000 : 7000);
  };

  useEffect(() => {
    const first = setTimeout(() => show(false), 5000);
    const interval = setInterval(() => show(false), 45000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const toggle = () => {
    if (quote) {
      setQuote(null);
      clearTimeout(hideTimer.current);
    } else {
      show(true);
    }
  };

  return (
    <div className="ghost-wrap">
      <AnimatePresence>
        {quote && (
          <motion.div
            className="ghost-bubble"
            initial={{ opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            {quote}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="ghost-btn"
        onClick={toggle}
        title="Motivation!"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        👻
      </motion.button>
    </div>
  );
}
