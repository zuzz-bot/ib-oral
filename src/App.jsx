import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretLeft } from "@phosphor-icons/react";
import { THEMES } from "./data/content.js";
import GradientBg from "./components/GradientBg.jsx";
import EnterScreen from "./components/EnterScreen.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import TopicsScreen from "./components/TopicsScreen.jsx";
import Drawer from "./components/Drawer.jsx";
import Ghost from "./components/Ghost.jsx";

const themeById = (id) => THEMES.find((t) => t.id === id) || null;

export default function App() {
  const [entered, setEntered] = useState(false);
  const [themeId, setThemeId] = useState(null);
  const [topic, setTopic] = useState(null);
  const [accentRgb, setAccentRgb] = useState(null);

  const theme = themeById(themeId);

  // Reflect navigation in browser history so the back button (and the phone's
  // system back, once installed as a PWA) closes the drawer / returns home.
  const pushState = useCallback((next) => {
    window.history.pushState(next, "");
  }, []);

  useEffect(() => {
    const onPop = (e) => {
      const s = e.state || {};
      setEntered(Boolean(s.entered));
      setThemeId(s.themeId ?? null);
      setTopic(s.topic ?? null);
      setAccentRgb(s.themeId ? themeById(s.themeId)?.rgb ?? null : null);
    };
    window.addEventListener("popstate", onPop);
    window.history.replaceState({ entered: false }, "");
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const enter = () => {
    setEntered(true);
    pushState({ entered: true });
  };

  const pickTheme = (id) => {
    setThemeId(id);
    setAccentRgb(themeById(id)?.rgb ?? null);
    pushState({ entered: true, themeId: id });
  };

  const goHome = () => {
    setTopic(null);
    setThemeId(null);
    setAccentRgb(null);
    pushState({ entered: true });
  };

  const openTopic = (t) => {
    setTopic(t);
    pushState({ entered: true, themeId, topic: t });
  };

  const closeDrawer = () => {
    setTopic(null);
    pushState({ entered: true, themeId });
  };

  return (
    <>
      <GradientBg accentRgb={accentRgb} />

      <AnimatePresence>
        {!entered && <EnterScreen key="enter" onEnter={enter} />}
      </AnimatePresence>

      {entered && (
        <div id="app">
          <AnimatePresence>
            {theme && (
              <motion.button
                key="back"
                className="back-btn"
                onClick={goHome}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Back"
              >
                <CaretLeft size={16} weight="bold" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!theme ? (
              <HomeScreen
                key="home"
                themes={THEMES}
                onPickTheme={pickTheme}
                onHoverTheme={setAccentRgb}
              />
            ) : (
              <TopicsScreen key="topics" theme={theme} onOpenTopic={openTopic} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {topic && (
              <Drawer key="drawer" topic={topic} theme={theme} onClose={closeDrawer} />
            )}
          </AnimatePresence>
        </div>
      )}

      <Ghost />
    </>
  );
}
