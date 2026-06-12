import { motion } from "motion/react";
import InstaxCard from "./InstaxCard.jsx";
import { TOPIC_PHOTOS, IB_DESC } from "../data/content.js";
import { useProgress } from "../hooks/useProgress.js";

const ROTS = [-2.5, 1.8, -3.2, 2.2, -1.5, 3.5];
const FLOAT_ANIMS = [
  "f1 6s ease-in-out infinite",
  "f2 7s ease-in-out infinite .4s",
  "f3 5.5s ease-in-out infinite .9s",
  "f4 6.5s ease-in-out infinite .2s",
  "f5 7.2s ease-in-out infinite .7s",
  "f1 6.8s ease-in-out infinite 1.2s",
];
const FALLBACK = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=700&q=92";

export default function TopicsScreen({ theme, onOpenTopic }) {
  const { get } = useProgress();

  return (
    <motion.div
      id="topics-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div id="topics-header">
        <div id="topics-theme-name" style={{ color: theme.accent }}>
          {theme.label}
        </div>
        <div id="topics-ib-desc">{IB_DESC[theme.id] || ""}</div>
      </div>
      <div id="topics-row">
        {theme.topics.map((topic, i) => {
          const prog = get(topic);
          const prefix = prog === "done" ? "✓ " : prog === "progress" ? "◑ " : "";
          return (
            <InstaxCard
              key={topic}
              imgSrc={TOPIC_PHOTOS[topic] || FALLBACK}
              label={prefix + topic}
              rot={ROTS[i % ROTS.length]}
              floatAnim={FLOAT_ANIMS[i % FLOAT_ANIMS.length]}
              entranceClass={`au d${Math.min(i + 1, 6)}`}
              onClick={() => onOpenTopic(topic)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
