import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretLeft } from "@phosphor-icons/react";
import { THEMES } from "./data/content.js";
import PixelSky from "./components/PixelSky.jsx";
import SkyToggle from "./components/SkyToggle.jsx";
import MockOral from "./components/MockOral.jsx";
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
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [skyMode, setSkyMode] = useState(() => {
    try {
      return localStorage.getItem("ib_oral_sky") || "auto";
    } catch {
      return "auto";
    }
  });
  const changeSky = (m) => {
    setSkyMode(m);
    try {
      localStorage.setItem("ib_oral_sky", m);
    } catch {}
  };

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
      <PixelSky forceNight={skyMode === "night"} />
      <div className="sky-scrim" aria-hidden="true" />

      <AnimatePresence>
        {!entered && <EnterScreen key="enter" onEnter={enter} />}
      </AnimatePresence>

      {entered && (
        <div id="app">
          <SkyToggle mode={skyMode} onChange={changeSky} />
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
                onPractice={() => setPracticeOpen(true)}
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

      <AnimatePresence>
        {practiceOpen && (
          <MockOral key="mock" onClose={() => setPracticeOpen(false)} />
        )}
      </AnimatePresence>

      <Ghost />
    </>
  );
}
