import { motion } from "motion/react";
import {
  BookOpen,
  Globe,
  LinkSimple,
  Question,
  ChatCircle,
  Sparkle,
  ArrowRight,
  Lightbulb,
} from "@phosphor-icons/react";
import { OVERVIEW } from "../../data/overview.js";
import { PHRASES } from "../../data/phrases.js";

const phraseCount = PHRASES.reduce((n, g) => n + g.items.length, 0);

export default function OverviewTab({ topic, data, vocabCount, accent, onJump }) {
  const o = OVERVIEW[topic] || {};
  const terms = vocabCount ?? data.vocabulary.length;
  const countryFacts =
    (data.countries.uk?.length || 0) +
    (data.countries.usa?.length || 0) +
    (data.countries.india?.length || 0);

  const stats = [
    { n: terms, l: "key terms" },
    { n: countryFacts, l: "country facts" },
    { n: data.sources.length, l: "sources" },
    { n: data.questions.length, l: "questions" },
  ];

  const jumps = [
    {
      k: "vocab",
      Icon: BookOpen,
      title: "Build your vocabulary",
      sub: `${terms} precise terms to raise your language band`,
    },
    {
      k: "countries",
      Icon: Globe,
      title: "Compare UK · USA · India",
      sub: `${countryFacts} facts — open Compare for the three-way view`,
    },
    {
      k: "questions",
      Icon: Question,
      title: "Practice the questions",
      sub: `${data.questions.length} prompts that push you to take a stance`,
    },
    {
      k: "phrases",
      Icon: ChatCircle,
      title: "Steal some oral phrases",
      sub: `${phraseCount} sentence starters for any topic`,
    },
    {
      k: "sources",
      Icon: LinkSimple,
      title: "Check the sources",
      sub: `${data.sources.length} verified links to dig deeper`,
    },
  ];

  return (
    <div className="ov">
      <motion.p
        className="ov-hook"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {o.hook}
      </motion.p>

      <div className="ov-stats">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            className="ov-stat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
          >
            <span className="ov-stat-n" style={{ color: accent }}>
              {s.n}
            </span>
            <span className="ov-stat-l">{s.l}</span>
          </motion.div>
        ))}
      </div>

      {o.angle && (
        <motion.div
          className="ov-angle"
          style={{ borderColor: `${accent}44` }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.45 }}
        >
          <div className="ov-angle-head" style={{ color: accent }}>
            <Sparkle size={14} weight="fill" /> Your sharp angle
          </div>
          <p>{o.angle}</p>
        </motion.div>
      )}

      <div className="ov-jumps">
        {jumps.map((j, i) => (
          <motion.button
            key={j.k}
            className="ov-jump"
            onClick={() => onJump(j.k)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 + i * 0.06, duration: 0.4 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="ov-jump-ico" style={{ color: accent }}>
              <j.Icon size={20} weight="fill" />
            </span>
            <span className="ov-jump-text">
              <span className="ov-jump-title">{j.title}</span>
              <span className="ov-jump-sub">{j.sub}</span>
            </span>
            <ArrowRight size={16} className="ov-jump-arrow" />
          </motion.button>
        ))}
      </div>

      {o.start && (
        <motion.div
          className="ov-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Lightbulb size={15} weight="fill" style={{ color: accent }} />
          <span>{o.start}</span>
        </motion.div>
      )}
    </div>
  );
}
